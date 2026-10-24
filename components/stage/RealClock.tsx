"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import { buzz } from "@/lib/found/buzz";
import { flag } from "./playthrough";
import styles from "./RealClock.module.css";

/* ===========================================================================
   Real time (2026-10-24): once the story's deadline starts, it runs on the
   player's own clock, over the phone. The story's time ticks from `from` to
   `to` while they can still go back into the phone (to make Sameer face it,
   to read the nurse again); the button makes the calls; running out decides
   it for them (`Story.realtime`).
   =========================================================================== */

const EVENT = "event:seven-clock-real";

function subscribe(on: () => void): () => void {
  const t = window.setInterval(on, 250);
  return () => window.clearInterval(t);
}

export default function RealClock({ story, state }: { story: Story; state: CaseState }) {
  const rt = story.realtime;
  const started = state.at[EVENT];
  const live = Boolean(rt && started && all(state, rt.after) && !rt.go.every((f) => has(state, f)) && !rt.out.some((f) => has(state, f)));
  const now = useSyncExternalStore(live ? subscribe : () => () => {}, () => Math.floor(Date.now() / 250) * 250, () => 0);
  const left = rt && started && now ? Math.max(0, rt.seconds * 1000 - (now - started)) : 0;
  const over = live && now > 0 && left === 0;

  // Run out: the story decides. A buzz at the last minute, and at the last ten seconds.
  useEffect(() => {
    if (over && rt) flag(...rt.out);
  }, [over, rt]);
  const lastMinute = left > 0 && left <= 60_000;
  const lastTen = left > 0 && left <= 10_000;
  useEffect(() => {
    if (lastMinute) buzz();
  }, [lastMinute]);
  useEffect(() => {
    if (lastTen) buzz();
  }, [lastTen]);

  if (!live || !rt || !now) return null;
  const done = 1 - left / (rt.seconds * 1000);
  const s = Math.ceil(left / 1000);

  /* A countdown, not a clock: the phone's own clock keeps the story's time,
     and two clocks that disagree on one screen would be a lie. */
  return (
    <div className={styles.clock} role="timer" aria-live="off" data-urgent={lastMinute || undefined}>
      <span className={styles.bar} aria-hidden="true">
        <span style={{ width: `${(1 - done) * 100}%` }} />
      </span>
      <span className={styles.top}>
        <span className={styles.label}>{rt.label}</span>
        <b className={styles.time}>
          {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
        </b>
      </span>
      <span className={styles.hint}>{rt.hint}</span>
      <button type="button" className={styles.act} onClick={() => flag(...rt.go)}>
        {rt.act}
      </button>
    </div>
  );
}
