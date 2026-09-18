"use client";

import type { Story } from "@/content/types";
import { duration, ranFor } from "@/lib/game/call";
import type { CaseState } from "@/lib/game/engine";
import { useNow } from "@/lib/found/now";
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
  state,
  onUp,
}: {
  story: Story;
  state: CaseState;
  onUp: () => void;
}) {
  // 40:51 and counting: the call ran all night while the player slept.
  const now = useNow(1000);
  return (
    <div className={styles.morning}>
      <p className={styles.eyebrow}>Saturday · 10:29 AM</p>
      <p className={styles.line}>You slept, in the end. Holding it.</p>
      <p className={styles.timer}>{now ? duration(ranFor(story, state, now)) : null}</p>
      <p className={styles.sub}>The call is still running.</p>
      <button type="button" className={styles.up} onClick={onUp}>
        Sit up
      </button>
    </div>
  );
}
