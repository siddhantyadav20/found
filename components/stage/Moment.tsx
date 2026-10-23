"use client";

import { useEffect, useState } from "react";

import type { Flag, Moment as MomentT } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { buzz } from "@/lib/found/buzz";
import styles from "./Moment.module.css";

/* ===========================================================================
   A moment the story stops for (Last Local): the screen is the world, not a
   phone. The place, what's happening, a line at a time, then the choices,
   all of one weight. Against a clock when the story says so: a red bar runs
   down, and when it's gone the story chooses for you (`timeout`).
   =========================================================================== */

const LINE_MS = 1300;

export default function Moment({ moment, state, onChoose }: { moment: MomentT; state: CaseState; onChoose: (sets: readonly Flag[]) => void }) {
  const [shown, setShown] = useState(1);
  const ready = shown >= moment.lines.length;
  const options = moment.options.filter((o) => all(state, o.requires));
  const [left, setLeft] = useState(moment.seconds ?? 0);

  useEffect(() => {
    if (ready) return undefined;
    const t = window.setTimeout(() => setShown((n) => n + 1), LINE_MS);
    return () => window.clearTimeout(t);
  }, [ready, shown]);

  // The clock starts once everything has been said.
  useEffect(() => {
    if (!ready || !moment.seconds) return undefined;
    buzz();
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [ready, moment.seconds]);

  useEffect(() => {
    if (!moment.seconds || left > 0 || !ready) return;
    const fallback = moment.options.find((o) => o.id === moment.timeout) ?? moment.options[0];
    onChoose(fallback.sets);
  }, [left, ready, moment, onChoose]);

  return (
    <div className={styles.moment} role="dialog" aria-label={moment.where}>
      {moment.seconds ? (
        <span className={styles.clock} aria-hidden="true">
          <span style={{ width: `${(left / moment.seconds) * 100}%` }} />
        </span>
      ) : null}
      <div className={styles.body}>
        <p className={styles.where}>{moment.where}</p>
        {moment.lines.slice(0, shown).map((l, i) => (
          <p key={i} className={l.who ? styles.said : styles.told}>
            {l.who && <span className={styles.who}>{l.who}</span>}
            <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
            {l.english && <span className={styles.english}>{l.english}</span>}
          </p>
        ))}
      </div>
      {ready && (
        <div className={styles.options}>
          {moment.seconds ? <p className={styles.left}>{left}s</p> : null}
          {options.map((o) => (
            <button key={o.id} type="button" className={styles.option} onClick={() => onChoose(o.sets)}>
              {o.text}
            </button>
          ))}
        </div>
      )}
      {!ready && (
        <button type="button" className={styles.skip} onClick={() => setShown(moment.lines.length)}>
          Go on
        </button>
      )}
    </div>
  );
}
