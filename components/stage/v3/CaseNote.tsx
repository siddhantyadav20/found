"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { appLabel, caseFile, has, lost, type CaseState } from "@/lib/game/engine";
import { sentFlag } from "@/lib/game/reading";
import { REVEAL_DONE, REVEAL_START, UNOPENED } from "@/lib/game/scene";
import { sent } from "@/lib/found/tones";
import { flag, sendToM } from "../playthrough";
import { PreStepView } from "./BeforeEnding";
import styles from "./CaseNote.module.css";

/* ===========================================================================
   The case file as a note on this iPhone (RAAKH-V3 §17): its header in the
   Notes style ("On this iPhone · Today 11:44 PM", IC4), and an info panel
   that exists from the start but can't be reached until the reveal. Below
   the question: what's been found, each with Send to M once she's asked for
   it; the last question's asides (call M, listen again); and, until 3:58,
   a way to put the phone away unopened.
   =========================================================================== */

export function NoteHead({ story, state }: { story: Story; state: CaseState }) {
  const [info, setInfo] = useState(false);
  const note = story.caseNote;
  if (!note) return null;
  const turned = has(state, REVEAL_DONE);
  return (
    <header className={styles.head}>
      <p className={styles.meta}>{note.header}</p>
      {/* The info panel: there all along, out of reach until the reveal turned it over. */}
      {turned && (
        <button type="button" className={styles.info} aria-expanded={info} aria-label="Info" onClick={() => setInfo((v) => !v)}>
          i
        </button>
      )}
      {info && story.reveal && (
        <ul className={styles.panel}>
          {story.reveal.info.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </header>
  );
}

/** Before the last question is answered: call M, listen to Dilip again (RAAKH-V3 §9.12). */
export function Asides({ story, state }: { story: Story; state: CaseState }) {
  const asides = story.final?.asides ?? [];
  if (!asides.length) return null;
  return (
    <section className={styles.asides} aria-label="Before you choose">
      <p className={styles.group}>Before you choose</p>
      <ul className={styles.list}>
        {asides.map((a) => (
          <PreStepView key={a.id} step={a} state={state} voices={story.voices} />
        ))}
      </ul>
    </section>
  );
}

/** Put it away: the chapter's early exit, until the reveal (RAAKH-V3 §11, Unopened). */
export function CloseTheCase({ story, state }: { story: Story; state: CaseState }) {
  const [asking, setAsking] = useState(false);
  const u = story.unopened;
  if (!u || has(state, REVEAL_START) || u.before.some((f) => has(state, f))) return null;
  return (
    <div className={styles.close}>
      {asking ? (
        <>
          <p>{u.ask}</p>
          <span className={styles.closeRow}>
            <button type="button" onClick={() => flag(UNOPENED, "did:unopened-once")}>
              Put it away
            </button>
            <button type="button" onClick={() => setAsking(false)}>
              Keep reading
            </button>
          </span>
        </>
      ) : (
        <button type="button" className={styles.closeLink} onClick={() => setAsking(true)}>
          Close the case
        </button>
      )}
    </div>
  );
}

/** Everything found so far, grouped by where, with Send to M beside each once she's asked (RAAKH-V3 §8.7). */
export function FoundList({ story, state }: { story: Story; state: CaseState }) {
  const [open, setOpen] = useState(false);
  const found = caseFile(story, state);
  const to = story.sendTo;
  const canSend = Boolean(to && to.after.every((f) => has(state, f)));
  if (!found.length) return null;
  return (
    <section className={styles.found} aria-label="What you have found">
      <button type="button" className={styles.group} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        What you have found ({found.length}) {open ? "▴" : "▾"}
      </button>
      {open && (
        <ul className={styles.list}>
          {found.map((e) => {
            const gone = lost(story, state, e.id);
            const sentIt = has(state, sentFlag(e.id));
            return (
              <li key={e.id} className={styles.item} data-gone={gone || undefined}>
                <span>
                  {e.label}
                  <small>
                    {e.from ?? (e.app === "casefile" ? "Case file" : appLabel(story, e.app))}
                    {gone && " · source deleted"}
                  </small>
                </span>
                {canSend && !gone && (
                  <button
                    type="button"
                    className={styles.send}
                    disabled={sentIt}
                    onClick={() => {
                      sent();
                      sendToM([e.id]);
                    }}
                  >
                    {sentIt ? "Sent" : to!.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
