"use client";

import type { Story } from "@/content/types";
import { duration, ranFor } from "@/lib/game/call";
import styles from "./Morning.module.css";

/* ===========================================================================
   10:29 AM.

   Relief has to come before the crash, or the crash is just more of the same
   (PLAYER-JOURNEY Stage 7). So the player sleeps, wakes up in daylight with
   somebody else's phone still warm on their chest, and finds the one good
   thing that happens in this chapter: a man she rang at half past ten last
   night, alive and grateful, thanking a woman who has been dead since
   midnight.

   Then, in sixty seconds, their own phone rings.
   =========================================================================== */

export default function Morning({
  story,
  elapsedMs,
  onUp,
}: {
  story: Story;
  elapsedMs: number;
  onUp: () => void;
}) {
  return (
    <div className={styles.morning}>
      <p className={styles.eyebrow}>Saturday · 10:29 AM</p>
      <p className={styles.line}>You slept, in the end. Holding it.</p>
      <p className={styles.timer}>{duration(ranFor(story, elapsedMs))}</p>
      <p className={styles.sub}>The call is still running.</p>
      <button type="button" className={styles.up} onClick={onUp}>
        Sit up
      </button>
    </div>
  );
}
