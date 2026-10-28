"use client";

import { useEffect, useState } from "react";

import type { PreStep, Said, Story, Voices } from "@/content/types";
import { goneOf, has, type CaseState } from "@/lib/game/engine";
import { finish } from "@/lib/game/endings";
import { saidNow } from "@/lib/game/reading";
import { sent } from "@/lib/found/tones";
import { say } from "@/lib/found/voice";
import { deleteItem, flag } from "../playthrough";
import styles from "./Final.module.css";

/* ===========================================================================
   Before an ending (RAAKH-V3 §10): optional, any order. Room 6's "Before you
   go" (Meera, Raju, Nitin, Mummy, Gate 1); the Trade's message to Dilip's
   number; the 4:55's and Return to Origin's "Clean up", every breaking item
   still on the phone with a Delete beside it, and Meera's "Kuch delete mat
   karna" under it if it was promised; Return to Origin's line on the note.

   Then the ending, which can't be taken back.
   =========================================================================== */

/** The lines an exchange shows now, read off the save. */
const linesOf = (s: CaseState, lines: readonly Said[] = []) => lines.filter((l) => saidNow(s, l));

/** Heard, one after another, as a call would be: whatever the others say back, never the player's own lines. */
function useSaid(lines: readonly Said[], voices: Voices | undefined, plays: number) {
  // What will be heard, as one key: a re-render with the same lines never plays them again.
  const heard = lines
    .filter((l) => l.who !== "You")
    .map((l) => voices?.[l.voice ?? `said:${l.text}`])
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .map((v) => `${v.src}#${v.seconds}`)
    .join("|");
  // Each tap is a play from the top (2026-10-28: a second tap did nothing).
  useEffect(() => {
    if (!plays || !heard) return undefined;
    let stop = () => {};
    const timers: number[] = [];
    let at = 0;
    for (const part of heard.split("|")) {
      const [src, seconds] = part.split("#");
      timers.push(window.setTimeout(() => (stop = say(src)), at));
      at += Number(seconds) * 1000 + 450;
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      stop();
    };
  }, [plays, heard]);
}

/** One thing to do before an ending, or while choosing one (the last question's asides). */
export function PreStepView({ step, state, voices }: { step: PreStep; state: CaseState; voices?: Voices }) {
  const [plays, setPlays] = useState(0);
  const open = plays > 0;
  const heard = linesOf(state, step.lines);
  useSaid(heard, voices, plays);
  const did = step.sets?.length ? step.sets.every((f) => has(state, f)) : step.choose?.some((c) => c.sets.every((f) => has(state, f)));
  if ((step.requires ?? []).some((f) => !has(state, f)) || (step.unless ?? []).some((f) => has(state, f))) return null;

  // A clean-up row: the item, and a Delete that's for good.
  if (step.delete) {
    const gone = goneOf(state, step.delete) === "perm";
    return (
      <li className={styles.row}>
        <span>{step.label}</span>
        <button type="button" className={styles.delete} disabled={gone} onClick={() => deleteItem(step.delete!, "perm")}>
          {gone ? "Deleted" : "Delete"}
        </button>
      </li>
    );
  }

  const show = open || did;
  return (
    <li className={styles.step} data-done={did || undefined}>
      <button
        type="button"
        className={styles.stepButton}
        aria-expanded={show}
        onClick={() => {
          setPlays((n) => n + 1);
          if (step.sets?.length && !did) {
            sent();
            flag(...step.sets);
          }
        }}
      >
        {step.label}
        {did && <span className={styles.tick}>Done</span>}
      </button>
      {show && (
        <div className={styles.exchange}>
          {heard.map((l, i) => (
            <p key={i} className={styles.said} data-you={l.who === "You" || undefined}>
              {l.who && <b>{l.who}</b>}
              <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
              {l.english && <small>{l.english}</small>}
            </p>
          ))}
          {step.choose && !did && (
            <div className={styles.choices}>
              {step.choose
                .filter((c) => (c.requires ?? []).every((f) => has(state, f)) && !(c.unless ?? []).some((f) => has(state, f)))
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={styles.choice}
                    onClick={() => {
                      sent();
                      flag(...c.sets);
                    }}
                  >
                    <span lang={c.english ? "hi-Latn" : undefined}>{c.text}</span>
                    {c.english && <small>{c.english}</small>}
                  </button>
                ))}
            </div>
          )}
          {step.choose && did && (
            <p className={styles.said} data-you>
              <b>You</b>
              {step.choose.find((c) => c.sets.every((f) => has(state, f)))?.text}
            </p>
          )}
          {/* Raju, lied to, hears it: and comes. */}
          {step.id === "raju-broken" && has(state, "did:raju-repaired") && (
            <RajuHears voices={voices} />
          )}
          {step.id === "raju-broken" && has(state, "did:raju-repaired") && (
            <p className={styles.said}>
              <b>Raju</b>
              <span lang="hi-Latn">…Agar ye bhi jhooth hua—</span>
              <small>If this is a lie too—</small>
            </p>
          )}
        </div>
      )}
    </li>
  );
}

/** "…Agar ye bhi jhooth hua—", said once, when the truth has been told him. */
function RajuHears({ voices }: { voices?: Voices }) {
  useEffect(() => say(voices?.["said:…Agar ye bhi jhooth hua—"]?.src), [voices]);
  return null;
}

export default function BeforeEnding({ story, state, ending }: { story: Story; state: CaseState; ending: string }) {
  const before = story.final?.before[ending];
  const row = story.endings.find((e) => e.id === ending)?.row ?? ending;
  const [going, setGoing] = useState(false);
  const go = () => {
    setGoing(true);
    flag(...finish(ending));
  };
  if (!before) {
    // Nothing to do first: straight on.
    return (
      <div className={styles.sheet}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{row}</p>
          <button type="button" className={styles.go} onClick={go} disabled={going}>
            Go on
          </button>
        </div>
      </div>
    );
  }
  const echo = before.echo && saidNow(state, before.echo) ? before.echo : undefined;
  return (
    <div className={styles.sheet} data-table={ending === "origin" || undefined}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{row}</p>
        <h2 className={styles.title}>{before.title}</h2>
        <p className={styles.lede}>All of it optional. None of it can be undone.</p>
        <ul className={styles.steps}>
          {before.steps.map((s) => (
            <PreStepView key={s.id} step={s} state={state} voices={story.voices} />
          ))}
        </ul>
        {/* A promise to keep everything, said again, faintly, over the clean-up. */}
        {echo && (
          <p className={styles.echo} lang="hi-Latn">
            “{echo.text}”{echo.english && <small>{echo.english}</small>}
          </p>
        )}
        <button type="button" className={styles.go} onClick={go} disabled={going}>
          {before.go}
        </button>
      </div>
    </div>
  );
}
