"use client";

import { useState } from "react";

import type { Question, Story } from "@/content/types";
import { answer, appLabel, caseFile, hint, openQuestion, seen, whereToLook, type CaseState } from "@/lib/game/engine";
import styles from "./CaseFile.module.css";

/* ===========================================================================
   The case file: one question at a time, what you have found, and help that
   never costs anything.

   The only real complaint players ever made about Found was "I didn't know
   what to do", so where-to-look is free and unlimited, the three hints end in
   the answer, and nothing anywhere counts how often they were used
   (PLAYER-JOURNEY Stage 4).

   Four kinds of question, because this chapter thinks in four ways
   (ROADMAP.md P3):

     pick      — put the proof on the table
     type      — say the name out loud
     timeline  — two lanes: where she was, and what her phone did
     claims    — mark each thing they say about you true, or a bluff
   =========================================================================== */

type Given = readonly string[] | string;

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
  const [typed, setTyped] = useState("");
  const [said, setSaid] = useState<{ text: string; ok: boolean; ask: string } | null>(null);
  const [helped, setHelped] = useState<string | null>(null);

  const reset = () => {
    setSaid(null);
    setPicked([]);
    setTyped("");
    setHelped(null);
  };

  /* An answered question stays on screen with its reply. The reply is the
     payoff for the whole search, and it used to be replaced in the same frame
     by the next question, which threw it away. */
  if (said?.ok)
    return (
      <div className={styles.file}>
        <p className={styles.eyebrow}>Answered</p>
        <h3 className={styles.ask}>{said.ask}</h3>
        <p className={styles.said}>{said.text}</p>
        <button type="button" className={styles.answer} onClick={reset}>
          Keep going
        </button>
      </div>
    );

  if (!q)
    return (
      <div className={styles.file}>
        <p className={styles.done}>Nothing else to answer yet. What you have found so far is below.</p>
        <ul className={styles.list}>
          {found.map((e) => (
            <li key={e.id} className={styles.item}>
              <span>{e.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const give = (given: Given) => {
    const r = answer(story, state, q.id, given);
    setSaid({ text: r.reply, ok: r.ok, ask: q.ask });
    if (r.ok) save(r.state);
  };

  return (
    <div className={styles.file}>
      <p className={styles.eyebrow}>The question</p>
      <h3 className={styles.ask}>{q.ask}</h3>
      <p className={styles.where}>
        Where to look: {whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}
      </p>

      <Board q={q} state={state} found={found} picked={picked} toggle={toggle} typed={typed} setTyped={setTyped} />

      <div className={styles.row}>
        <button
          type="button"
          className={styles.answer}
          disabled={q.kind === "type" ? typed.trim().length === 0 : picked.length === 0}
          onClick={() => give(q.kind === "type" ? typed : picked)}
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

function Board({
  q,
  state,
  found,
  picked,
  toggle,
  typed,
  setTyped,
}: {
  q: Question;
  state: CaseState;
  found: readonly { readonly id: string; readonly label: string }[];
  picked: readonly string[];
  toggle: (id: string) => void;
  typed: string;
  setTyped: (v: string) => void;
}) {
  if (q.kind === "type")
    return (
      <input
        className={styles.field}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="Type it"
        aria-label={q.ask}
      />
    );

  /* Two lanes. Nothing is dragged anywhere, because dragging on a phone in
     one hand is a fight: tapping a row moves it to the other lane. */
  if (q.kind === "timeline")
    return (
      <>
        <p className={styles.lanes}>
          <span>Her</span>
          <span>This phone</span>
        </p>
        <ul className={styles.list}>
          {q.rows.filter((r) => seen(state, r.evidence)).map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className={styles.lane}
                data-on={picked.includes(r.id) || undefined}
                onClick={() => toggle(r.id)}
              >
                <span className={styles.at}>{r.at}</span>
                <span className={styles.laneText}>{r.text}</span>
                <span className={styles.side}>{picked.includes(r.id) ? "the phone" : "her"}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.where}>Tap anything this phone did while she was somewhere else.</p>
      </>
    );

  if (q.kind === "claims")
    return (
      <ul className={styles.list}>
        {q.claims.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={styles.lane}
              data-on={picked.includes(c.id) || undefined}
              onClick={() => toggle(c.id)}
            >
              <span className={styles.laneText}>
                {c.text}
                {c.english && <span className={styles.english}>{c.english}</span>}
              </span>
              <span className={styles.side}>{picked.includes(c.id) ? "true" : "bluff"}</span>
            </button>
          </li>
        ))}
      </ul>
    );

  return found.length === 0 ? (
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
  );
}
