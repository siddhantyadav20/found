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
    <div className={styles.card} role="status">
      <p className={styles.eyebrow}>Episode {n}</p>
      <p className={styles.line}>{title}</p>
      <p className={styles.sub}>{when}</p>
      <button type="button" className={styles.up} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}
