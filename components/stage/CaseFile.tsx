"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { answer, caseFile, hint, openQuestion, whereToLook, type CaseState } from "@/lib/game/engine";
import styles from "./CaseFile.module.css";

/* ===========================================================================
   The case file: one question at a time, what you've found, and help that
   never costs anything.

   The only real complaint players ever made about Found was "I didn't know
   what to do", so where-to-look is free and unlimited, the three hints end in
   the answer, and nothing anywhere counts how often they were used
   (PLAYER-JOURNEY Stage 4).

   A first pass: picking evidence. The timeline and claim-check boards, the
   idle nudge and the typed answers arrive with P3.
   =========================================================================== */

export default function CaseFile({
  story,
  state,
  save,
}: {
  story: Story;
  state: CaseState;
  save: (next: CaseState) => void;
}) {
  const q = openQuestion(story, state);
  const found = caseFile(story, state);
  const [picked, setPicked] = useState<string[]>([]);
  const [said, setSaid] = useState<{ text: string; ok: boolean; ask: string } | null>(null);
  const [helped, setHelped] = useState<string | null>(null);

  /* An answered question stays on screen with its reply. The reply is the
     payoff for the whole search, and it used to be replaced in the same frame
     by the next question, which threw it away. */
  if (said?.ok)
    return (
      <div className={styles.file}>
        <p className={styles.eyebrow}>Answered</p>
        <h3 className={styles.ask}>{said.ask}</h3>
        <p className={styles.said}>{said.text}</p>
        <button
          type="button"
          className={styles.answer}
          onClick={() => {
            setSaid(null);
            setPicked([]);
            setHelped(null);
          }}
        >
          Keep going
        </button>
      </div>
    );

  if (!q)
    return (
      <p className={styles.done}>
        Nothing else to answer yet. Episode 1&apos;s other questions arrive with P5; what
        you&apos;ve found so far is below.
      </p>
    );

  const toggle = (idEv: string) =>
    setPicked((p) => (p.includes(idEv) ? p.filter((x) => x !== idEv) : [...p, idEv]));

  return (
    <div className={styles.file}>
      <p className={styles.eyebrow}>The question</p>
      <h3 className={styles.ask}>{q.ask}</h3>

      <p className={styles.where}>
        Where to look: {whereToLook(story, q.id).map((a) => story.hersHome.find((h) => h.app === a)?.label ?? a).join(", ")}
      </p>

      {found.length === 0 ? (
        <p className={styles.empty}>Open something on her phone first.</p>
      ) : (
        <ul className={styles.list}>
          {found.map((e) => (
            <li key={e.id}>
              <label className={styles.item}>
                <input type="checkbox" checked={picked.includes(e.id)} onChange={() => toggle(e.id)} />
                <span>{e.label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.row}>
        <button
          type="button"
          className={styles.answer}
          disabled={picked.length === 0}
          onClick={() => {
            const r = answer(story, state, q.id, picked);
            setSaid({ text: r.reply, ok: r.ok, ask: q.ask });
            if (r.ok) save(r.state);
          }}
        >
          Answer
        </button>
        <button
          type="button"
          className={styles.hint}
          onClick={() => {
            const h = hint(story, state, q.id);
            if (!h) return;
            setHelped(h.text);
            save(h.state);
          }}
        >
          Hint
        </button>
      </div>

      {helped && <p className={styles.helped}>{helped}</p>}
      {said && !said.ok && <p className={styles.said}>{said.text}</p>}
    </div>
  );
}
