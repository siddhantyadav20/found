"use client";

import { useRef, useState } from "react";

import type { CaseMeta } from "@/content/cases";
import styles from "./Pouch.module.css";

/* ===========================================================================
   The first thirty seconds: a courier pouch, and a phone taped to a power
   bank inside it.

   The player tears it open with their hand (PLAYER-JOURNEY law 5). It is a
   drag, not a button, because ownership is what makes the guilt work an hour
   later: they have to be able to say *I opened it*.

   Two things on the label are promises rather than decoration: the content
   note, and the line about nothing here being real.
   =========================================================================== */

const TEAR = 0.55;

export default function Pouch({ meta, to, minutes, onOpen }: { meta: CaseMeta; to?: string; minutes?: number; onOpen: () => void }) {
  const [pull, setPull] = useState(0);
  const from = useRef<number | null>(null);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    // Android's own haptic, where there is one: a tear, not a notification.
    try {
      navigator.vibrate?.([14, 40, 22]);
    } catch {
      // A phone that won't buzz still opens.
    }
    onOpen();
  };

  const move = (x: number, width: number) => {
    if (from.current === null) return;
    const next = Math.max(0, Math.min(1, (x - from.current) / (width * 0.6)));
    setPull(next);
    if (next >= TEAR) finish();
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.pouch}
        style={{ "--pull": pull } as React.CSSProperties}
        onPointerDown={(e) => {
          from.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => move(e.clientX, e.currentTarget.clientWidth)}
        onPointerUp={() => {
          from.current = null;
          setPull(0);
        }}
      >
        <span className={styles.strip} aria-hidden="true">
          PULL TO OPEN →
        </span>
        <span className={styles.label}>
          <span className={styles.to}>{to ? `TO ${to}` : "BY HAND"}</span>
          <span className={styles.from}>PikDrop · 1:08 AM · Dadar East</span>
          <span className={styles.note}>{meta.note}</span>
        </span>
      </div>

      <p className={styles.hint}>{meta.hint}</p>
      {minutes ? <p className={styles.minutes}>About {minutes} minutes, in one sitting.</p> : null}

      {/* A pointer isn't always a hand: keyboards and assistive tech open it too. */}
      <button type="button" className={styles.open} onClick={finish}>
        Tear it open
      </button>
    </div>
  );
}
