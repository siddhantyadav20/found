"use client";

import type { CSSProperties, ReactNode } from "react";

import { buzz } from "@/lib/found/buzz";
import { useEffect } from "react";
import styles from "./YourPhone.module.css";

/* ===========================================================================
   PG-YOURPHONE (RAAKH-V3 §6): the second device. A plainer phone slides up
   from the bottom edge to cover about 40% of the screen, Marine Drive at
   dusk on its wallpaper. Never browsable: it only rings, or shows one
   notification. It's the new phone and SIM Sameer bought on Tuesday for
   Mumbai (§18.17), and it appears for the first time at the reveal.
   =========================================================================== */

export function YourPhoneOverlay({ wallpaper, time, children }: { wallpaper: string; time: string; children: ReactNode }) {
  useEffect(() => buzz(), []);
  return (
    <div className={styles.overlay} role="dialog" aria-label="Your phone">
      <div className={styles.phone} style={{ "--wall": `url(${wallpaper})` } as CSSProperties}>
        <span className={styles.wallpaper} aria-hidden="true" />
        <p className={styles.status} aria-hidden="true">
          <span>{time}</span>
          <span>5G ▮▮▮</span>
        </p>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

/** One notification on it, and the way on. */
export function YourPhoneNote({ from, text, english, onDone, go = "Go on" }: { from: string; text: string; english?: string; onDone: () => void; go?: string }) {
  return (
    <>
      <p className={styles.note}>
        <i aria-hidden="true" />
        <span>
          <b>{from}</b>
          <span lang={english ? "hi-Latn" : undefined}>{text}</span>
          {english && <small>{english}</small>}
        </span>
      </p>
      <button type="button" className={styles.go} onClick={onDone}>
        {go}
      </button>
    </>
  );
}
