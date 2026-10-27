"use client";

import { useEffect } from "react";

import styles from "./Interstitial.module.css";

/* ===========================================================================
   Between episodes: the title, the time, and a breath. Episode 1's title is
   on the parcel; every later episode opens on its own card, and on the
   minute it begins.
   =========================================================================== */

const HOLD_MS = 3800;

export default function TitleCard({
  n,
  title,
  when,
  small,
  under,
  onDone,
}: {
  n: number;
  title: string;
  when: string;
  /** Smaller, under the time: what this minute was a week ago (RAAKH-V3 §8.1, §9.1). */
  small?: string;
  /** Something left on screen from the episode before (the 1:52 bubble). */
  under?: React.ReactNode;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, small ? HOLD_MS + 1600 : HOLD_MS);
    return () => window.clearTimeout(t);
  }, [onDone, small]);

  return (
    <div className={styles.card} role="status">
      <p className={styles.eyebrow}>Episode {String(n).padStart(2, "0")}</p>
      <p className={styles.line}>{title}</p>
      <p className={styles.sub}>{when}</p>
      {small && <p className={styles.small}>{small}</p>}
      {under}
      <button type="button" className={styles.up} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}
