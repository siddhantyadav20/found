"use client";

import { useState } from "react";

import type { AppId, Evidence, Question, Story } from "@/content/types";
import {
  answer,
  answered,
  appLabel,
  caseFile,
  filedClaim,
  filedClaims,
  hint,
  offeredClaims,
  needsRevisit,
  boardReady,
  openQuestion,
  seen,
  sideQuestions,
  whereToLook,
  type CaseState,
  type Given,
} from "@/lib/game/engine";
import note from "@/components/owner/ios/Notes.module.css";
import styles from "./CaseFile.module.css";
import { wrong } from "./playthrough";
import { nightly, stamp } from "@/lib/found/time";

/** The proof a player has laid out, per question, for as long as the page is open. */
const onTable = new Map<string, string[]>();

/* ===========================================================================
   The case file is the record: the player's own account of the night, one
   question at a time, with help that never costs anything.

   The only real complaint players ever made about Found was "I didn't know
   what to do", so where-to-look is free and unlimited, the three hints end in
   the answer, and nothing anywhere counts how often they were used
   (PLAYER-JOURNEY Stage 4).

   Every answer goes into the record as a claim with its sources beside it
   (script §12: observation, then inference). Five kinds of question:

     pick      — put the proof on the table
     file      — say what you think happened, and put its proof on the table.
                 The owner's own version is a real answer: filed, sourced,
                 never called wrong. When a later find contradicts it, the
                 question comes back as Revisit, and the player strikes the old
                 line by hand before filing the new one (CHAPTER1.md G).
     type      — say the name out loud
     timeline  — put each event in its lane
     claims    — mark each statement proven, or not
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
  const side = sideQuestions(story, state);
  const [aside, setAside] = useState<string | null>(null);
  const main = openQuestion(story, state);
  // A question taken up from the side, while it's still open; otherwise the one in front.
  const q = side.find((x) => x.id === aside) ?? main;
  const found = caseFile(story, state);

  // What was on the table survives a trip to another app and back (PLAYTEST.md #67).
  const [picked, setPickedHere] = useState<string[]>(() => (q ? (onTable.get(q.id) ?? []) : []));
  const setPicked = (next: string[] | ((p: string[]) => string[])) =>
    setPickedHere((p) => {
      const value = typeof next === "function" ? next(p) : next;
      if (q) onTable.set(q.id, value);
      return value;
    });
  const [claim, setClaim] = useState<string | null>(null);
  const [struck, setStruck] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [said, setSaid] = useState<{ text: string; ok: boolean; ask: string; filed: boolean; lit?: readonly { at: string; text: string }[] } | null>(null);
  const [helped, setHelped] = useState<string | null>(null);

  const reset = () => {
    setSaid(null);
    setPicked([]);
    setClaim(null);
    setTyped("");
    setHelped(null);
    setAside(null);
  };

  /* An answered question stays on screen with its reply. The reply is the
     payoff for the whole search, and it used to be replaced in the same frame
     by the next question, which threw it away. */
  if (said?.ok)
    return (
      <div className={note.card}>
        <p className={note.eyebrow}>{said.filed ? "Filed" : "Answered"}</p>
        <h3 className={note.question}>{said.ask}</h3>
        <p className={note.solvedA}>{said.text}</p>
        {/* What doesn't fit, lit and left unexplained. */}
        {said.lit?.length ? (
          <ul className={styles.list}>
            {said.lit.map((r) => (
              <li key={r.at} className={styles.lane} data-lit>
                <span className={styles.at}>{stamp(r.at)}</span>
                <span className={styles.laneText}>{r.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <button type="button" className={note.primary} onClick={reset}>
          Keep going
        </button>
      </div>
    );

  const record = <Record story={story} state={state} />;
  const offered = side.filter((x) => x.id !== q?.id);
  const others = offered.length > 0 && (
    <div className={styles.side}>
      <p className={styles.groupHead}>Also open</p>
      {offered.map((x) => (
        <button
          key={x.id}
          type="button"
          className={styles.lane}
          onClick={() => {
            reset();
            setAside(x.id);
            setPickedHere(onTable.get(x.id) ?? []);
          }}
        >
          <span className={styles.laneText}>{x.ask}</span>
          <span className={styles.tag}>{needsRevisit(x, state) ? "Revisit" : "Open"}</span>
        </button>
      ))}
    </div>
  );

  if (!q)
    return (
      <div className={styles.file}>
        <p className={styles.done}>Nothing else to answer yet.</p>
        {others}
        {record}
        <Found found={found} story={story} />
      </div>
    );

  const revisit = needsRevisit(q, state);
  const onFile = revisit ? filedClaim(q, state) : undefined;
  // The old line has to be struck, by hand, before the board comes back.
  const striking = Boolean(onFile) && struck !== q.id;

  const give = (given: Given) => {
    const r = answer(story, state, q.id, given);
    const lit = q.kind === "timeline" ? q.rows.filter((row) => row.odd && seen(state, row.evidence)) : undefined;
    setSaid({ text: r.reply, ok: r.ok, ask: q.ask, filed: q.kind === "file", lit });
    if (r.ok) {
      save(r.state);
      onTable.delete(q.id);
    } else wrong(q.id);
  };

  // With only one thing to say, there's nothing to choose: it's the one being filed.
  const sayable = q.kind === "file" ? stillOffered(q, state) : [];
  const chosen = claim ?? (sayable.length === 1 ? sayable[0].id : null);

  const ready =
    q.kind === "type" ? typed.trim().length > 0 : q.kind === "file" ? Boolean(chosen) && picked.length > 0 : picked.length > 0;

  return (
    <div className={styles.file}>
      <div className={note.card}>
        <p className={note.eyebrow}>{revisit ? "Revisit" : q.optional ? "On the side" : "Open question"}</p>
        <h3 className={note.question}>{q.ask}</h3>
        <p className={note.ask}>
          Where to look: {whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}
        </p>

        {onFile && (
          <div className={styles.onFile}>
            <p className={styles.groupHead}>On file</p>
            <p className={styles.fileLine} data-struck={!striking || undefined}>
              {onFile.text}
            </p>
            {striking && (
              <button type="button" className={note.secondary} onClick={() => setStruck(q.id)}>
                Strike it
              </button>
            )}
          </div>
        )}

        {!striking && (
          <>
            <Board
              q={q}
              state={state}
              found={found}
              picked={picked}
              setPicked={setPicked}
              claim={chosen}
              setClaim={setClaim}
              typed={typed}
              setTyped={setTyped}
              labelOf={(app) => (app === "casefile" ? "From the parcel" : appLabel(story, app))}
            />

            <div className={note.actions}>
              <button
                type="button"
                className={note.primary}
                disabled={!ready}
                onClick={() =>
                  give(q.kind === "type" ? typed : q.kind === "file" ? { claim: chosen ?? "", proof: picked } : picked)
                }
              >
                {q.kind === "file" ? "File it" : "Answer"}
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
          </>
        )}

        {helped && <p className={note.hint}>{helped}</p>}
        {said && !said.ok && (
          <p className={note.choose} data-over>
            {said.text}
          </p>
        )}
      </div>

      {others}
      {record}
    </div>
  );
}

/** The claims a player can file now: what they could prove, less any line already struck. */
function stillOffered(q: Question, s: CaseState) {
  const struck = new Set(filedClaims(q, s).map((c) => c.id));
  return offeredClaims(q, s).filter((c) => !struck.has(c.id));
}

/** Where a claim's sources come from: the first of its routes the player has all of. */
function sourcesOf(routes: readonly (readonly string[])[], s: CaseState): string[] {
  return [...(routes.find((r) => r.every((id) => seen(s, id))) ?? [])];
}

/** What stands behind a filed answer, as evidence ids. */
function sources(q: Question, s: CaseState): string[] {
  switch (q.kind) {
    case "pick":
      return sourcesOf([q.proof, ...(q.orProof ?? [])], s);
    case "file": {
      const c = filedClaim(q, s);
      return c ? sourcesOf([c.proof, ...(c.orProof ?? [])], s) : [];
    }
    case "timeline":
      return q.rows.filter((r) => seen(s, r.evidence)).map((r) => r.evidence);
    case "claims":
      return q.claims.map((c) => c.proof).filter((id) => seen(s, id));
    case "type":
      return [];
  }
}

/**
 * The record: every answer so far, in the order the chapter asks them, each
 * with what it stands on. A line that was struck stays, struck: the record
 * remembers what the player believed before.
 */
function Record({ story, state }: { story: Story; state: CaseState }) {
  const lines = story.questions.filter((q) => answered(state, q.id));
  if (!lines.length) return null;
  const label = (id: string) => story.evidence.find((e) => e.id === id)?.label ?? id;
  return (
    <section className={styles.record} aria-label="The record">
      <p className={styles.groupHead}>The record</p>
      <ol className={styles.lines}>
        {lines.map((q) => {
          const filed = filedClaims(q, state);
          const now = filed.at(-1);
          const from = [...new Set(sources(q, state))];
          return (
            <li key={q.id} className={styles.entry}>
              {filed.slice(0, -1).map((c, i) => (
                <p key={`${c.id}-${i}`} className={styles.fileLine} data-struck>
                  {c.text}
                </p>
              ))}
              <p className={styles.fileLine}>{now ? now.text : q.reply}</p>
              {from.length > 0 && <p className={styles.sources}>{from.map(label).join(" · ")}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Everything found so far, grouped by where. */
function Found({ found, story }: { found: readonly Evidence[]; story: Story }) {
  if (!found.length) return null;
  return (
    <section aria-label="What you have found">
      <p className={styles.groupHead}>What you have found</p>
      <ul className={styles.list}>
        {found.map((e) => (
          <li key={e.id} className={styles.item}>
            <span>{e.label}</span>
            <span className={styles.where}>{appLabel(story, e.app)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProofTable({
  found,
  picked,
  toggle,
  labelOf,
}: {
  found: readonly { readonly id: string; readonly label: string; readonly app: AppId }[];
  picked: readonly string[];
  toggle: (id: string) => void;
  labelOf: (app: AppId) => string;
}) {
  if (found.length === 0) return <p className={styles.empty}>Open something on the phone first.</p>;
  return (
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

function Board({
  q,
  state,
  found,
  picked,
  setPicked,
  claim,
  setClaim,
  typed,
  setTyped,
  labelOf,
}: {
  q: Question;
  state: CaseState;
  found: readonly { readonly id: string; readonly label: string; readonly app: AppId }[];
  /** What each app is called on the phone, for grouping what was found. */
  labelOf: (app: AppId) => string;
  picked: readonly string[];
  setPicked: (next: string[] | ((p: string[]) => string[])) => void;
  claim: string | null;
  setClaim: (id: string) => void;
  typed: string;
  setTyped: (v: string) => void;
}) {
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  // The timeline row whose lanes are open, on a board with more than two.
  const [choosing, setChoosing] = useState<string | null>(null);

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

  /* Say what you think, then prove it. Only what the player could prove with
     what they've found is offered, in the chapter's own order and one style
     for all of it: nothing says which is the owner's. A line already struck
     isn't offered again. */
  if (q.kind === "file") {
    const offered = stillOffered(q, state);
    if (!offered.length) return <p className={styles.empty}>Nothing you&apos;ve found says yet. Keep looking.</p>;
    return (
      <>
        <p className={note.choose}>What do you think happened?</p>
        <ul className={styles.list}>
          {offered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.lane}
                  data-on={claim === c.id || undefined}
                  aria-pressed={claim === c.id}
                  onClick={() => setClaim(c.id)}
                >
                  <span className={styles.laneText}>
                    {c.text}
                    {c.english && <span className={styles.english}>{c.english}</span>}
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <ProofTable found={found} picked={picked} toggle={toggle} labelOf={labelOf} />
      </>
    );
  }

  /* Lanes. Nothing is dragged anywhere, because dragging on a phone in one
     hand is a fight: tapping a row moves it to the next lane, and round. */
  if (q.kind === "timeline") {
    if (!boardReady(q, state)) return <p className={styles.empty}>Nothing you&apos;ve found shows it yet. Keep looking.</p>;
    const laneOf = (row: string) => picked.find((p) => p.startsWith(`${row}@`))?.split("@")[1];
    const place = (row: string, lane: string | undefined) =>
      setPicked((p) => [...p.filter((x) => !x.startsWith(`${row}@`)), ...(lane ? [`${row}@${lane}`] : [])]);
    const cycle = (row: string) => {
      const at = q.lanes.findIndex((l) => l.id === laneOf(row));
      place(row, q.lanes[at + 1]?.id);
    };
    /* Two lanes: a tap moves a row across. More than that, and cycling
       through them is a fight, so a tap opens the row's lanes to pick from. */
    const picker = q.lanes.length > 2;
    return (
      <>
        <p className={styles.where}>Tap each row until it sits in its lane.</p>
        <p className={styles.lanes}>
          {q.lanes.map((l) => (
            <span key={l.id}>{l.label}</span>
          ))}
        </p>
        <ul className={styles.list}>
          {q.rows
            .filter((r) => seen(state, r.evidence))
            .toSorted((a, b) => nightly(a.at) - nightly(b.at))
            .map((r) => {
              const lane = laneOf(r.id);
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    className={styles.lane}
                    data-on={lane !== undefined || undefined}
                    aria-expanded={picker ? choosing === r.id : undefined}
                    onClick={() => (picker ? setChoosing((c) => (c === r.id ? null : r.id)) : cycle(r.id))}
                  >
                    <span className={styles.at}>{stamp(r.at)}</span>
                    <span className={styles.laneText}>{r.text}</span>
                    <span className={styles.tag}>{q.lanes.find((l) => l.id === lane)?.label ?? "—"}</span>
                  </button>
                  {picker && choosing === r.id && (
                    <span className={styles.chips} role="group" aria-label={`Lane for ${stamp(r.at)}`}>
                      {q.lanes.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          className={styles.chip}
                          aria-pressed={lane === l.id}
                          onClick={() => {
                            place(r.id, lane === l.id ? undefined : l.id);
                            setChoosing(null);
                          }}
                        >
                          {l.label}
                        </button>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </>
    );
  }

  if (q.kind === "claims")
    return (
      <ul className={styles.list}>
        {q.claims.map((c) => (
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
              <span className={styles.tag}>
                {picked.includes(c.id) ? (q.labels?.[0] ?? "proven") : (q.labels?.[1] ?? "not proven")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );

  return <ProofTable found={found} picked={picked} toggle={toggle} labelOf={labelOf} />;
}
