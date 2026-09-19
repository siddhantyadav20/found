"use client";

import { useState } from "react";

import type { AppId, Question, Story } from "@/content/types";
import { answer, appLabel, caseFile, claimsFor, hint, openQuestion, seen, whereToLook, type CaseState } from "@/lib/game/engine";
import note from "@/components/her/ios/Notes.module.css";
import styles from "./CaseFile.module.css";
import { wrong } from "./playthrough";
import { stamp } from "@/lib/found/time";

/** The proof a player has laid out, per question, for as long as the page is open. */
const onTable = new Map<string, string[]>();

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
  // What was on the table survives a trip to another app and back (PLAYTEST.md #67).
  const [picked, setPickedHere] = useState<string[]>(() => (q ? (onTable.get(q.id) ?? []) : []));
  const setPicked = (next: string[] | ((p: string[]) => string[])) =>
    setPickedHere((p) => {
      const value = typeof next === "function" ? next(p) : next;
      if (q) onTable.set(q.id, value);
      return value;
    });
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
      <div className={note.card}>
        <p className={note.eyebrow}>Answered</p>
        <h3 className={note.question}>{said.ask}</h3>
        <p className={note.solvedA}>{said.text}</p>
        <button type="button" className={note.primary} onClick={reset}>
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
    else wrong(q.id);
  };

  return (
    <div className={note.card}>
      <p className={note.eyebrow}>Open question</p>
      <h3 className={note.question}>{q.ask}</h3>
      <p className={note.ask}>
        Where to look: {whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}
      </p>

      <Board
        q={q}
        state={state}
        found={found}
        picked={picked}
        toggle={toggle}
        typed={typed}
        setTyped={setTyped}
        labelOf={(app) => (app === "casefile" ? "From the call and the pouch" : appLabel(story, app))}
      />

      <div className={note.actions}>
        <button
          type="button"
          className={note.primary}
          disabled={q.kind === "type" ? typed.trim().length === 0 : picked.length === 0}
          onClick={() => give(q.kind === "type" ? typed : picked)}
        >
          Answer
        </button>
        <button
          type="button"
          className={note.secondary}
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

      {helped && <p className={note.hint}>{helped}</p>}
      {said && !said.ok && <p className={note.choose} data-over>{said.text}</p>}
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
  labelOf,
}: {
  q: Question;
  state: CaseState;
  found: readonly { readonly id: string; readonly label: string; readonly app: AppId }[];
  /** What each app is called on her phone, for grouping what was found. */
  labelOf: (app: AppId) => string;
  picked: readonly string[];
  toggle: (id: string) => void;
  typed: string;
  setTyped: (v: string) => void;
}) {
  if (q.kind === "type")
    return (
      <input
        className={note.input}
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
        <p className={styles.where}>Tap anything this phone did while she was somewhere else.</p>
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
                aria-pressed={picked.includes(r.id)}
                onClick={() => toggle(r.id)}
              >
                <span className={styles.at}>{stamp(r.at)}</span>
                <span className={styles.laneText}>{r.text}</span>
                <span className={styles.side}>{picked.includes(r.id) ? "the phone" : "her"}</span>
              </button>
            </li>
          ))}
        </ul>
      </>
    );

  if (q.kind === "claims")
    return (
      <ul className={styles.list}>
        {claimsFor(q, state).map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={styles.lane}
              data-on={picked.includes(c.id) || undefined}
              aria-pressed={picked.includes(c.id)}
              onClick={() => toggle(c.id)}
            >
              <span className={styles.laneText}>
                {c.text}
                {c.english && <span className={styles.english}>{c.english}</span>}
              </span>
              <span className={styles.side}>{picked.includes(c.id) ? (q.labels?.[0] ?? "true") : (q.labels?.[1] ?? "bluff")}</span>
            </button>
          </li>
        ))}
      </ul>
    );

  return found.length === 0 ? (
    <p className={styles.empty}>Open something on her phone first.</p>
  ) : (
    <div className={note.pick}>
      <p className={note.choose}>Put the proof on the table.</p>
      {/* Grouped by where it was found, so thirty things stay findable. */}
      {[...new Set(found.map((e) => e.app))].map((app) => (
        <div key={app}>
          <p className={styles.groupHead}>{labelOf(app)}</p>
          <ul className={note.pickList}>
            {found
              .filter((e) => e.app === app)
              .map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className={note.pickRow}
                    data-on={picked.includes(e.id) || undefined}
                    aria-pressed={picked.includes(e.id)}
                    onClick={() => toggle(e.id)}
                  >
                    <span className={note.check} aria-hidden="true" />
                    <span>{e.label}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
