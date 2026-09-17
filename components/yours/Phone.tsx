"use client";

import { useDevice } from "@/lib/found/platform";
import styles from "./Phone.module.css";

/* ===========================================================================
   Your phone: the second device on the table.

   It matches the player's own platform, because it is meant to be theirs, and
   it is almost empty on purpose. It sleeps through Episodes 1 and 2 and does
   nothing at all until 10:30 AM (ROADMAP.md P7), which is exactly what makes
   that moment land.
   =========================================================================== */

export default function YourPhone({ time, ringing }: { time: string; ringing?: boolean }) {
  const { os } = useDevice();
  return (
    <div className={styles.phone} data-os={os} data-ringing={ringing ? "" : undefined} aria-label="Your own phone">
      <div className={styles.screen}>
        <p className={styles.time}>{time}</p>
        <p className={styles.label}>Your phone</p>
      </div>
    </div>
  );
}
