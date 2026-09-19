"use client";

import { useEffect } from "react";

import styles from "./Morning.module.css";

/* ===========================================================================
   Between episodes: the title, the time, and a breath (PLAYTEST.md #34).
   Episode 1's title is on the pouch; Episode 3's is on the morning. This is
   Episode 2's: the phone has come back on the player's charger, and the
   night has moved on while it did.
   =========================================================================== */

const HOLD_MS = 3800;

export default function TitleCard({
  n,
  title,
  when,
  onDone,
}: {
  n: number;
  title: string;
  when: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className={styles.morning} data-night role="status">
      <p className={styles.eyebrow}>Episode {n}</p>
      <p className={styles.line}>{title}</p>
      <p className={styles.sub}>{when}</p>
      <button type="button" className={styles.up} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}
