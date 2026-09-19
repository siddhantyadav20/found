"use client";

import type { Story } from "@/content/types";
import { duration, ranFor } from "@/lib/game/call";
import type { CaseState } from "@/lib/game/engine";
import { ago } from "@/lib/found/keeping";
import { useNow } from "@/lib/found/now";
import styles from "./Morning.module.css";

/* ===========================================================================
   Coming back after a real gap (PLAYER-JOURNEY Stage 11, ROADMAP P9).

   The player put the phone down, for an hour or a night. The call didn't
   stop, and the first thing they see is how long it has now been running.
   Then they pick it back up, onto exactly the screen they left.
   =========================================================================== */

export default function Away({ story, state, last, onBack }: { story: Story; state: CaseState; last: number; onBack: () => void }) {
  const now = useNow(1000);
  return (
    <div className={styles.morning} data-night>
      <p className={styles.eyebrow}>{now ? `You put it down ${ago(last, now)}` : " "}</p>
      <p className={styles.line}>The call didn&apos;t stop.</p>
      <p className={styles.timer}>{now ? duration(ranFor(story, state, now)) : null}</p>
      <p className={styles.sub}>Mumbai Crime Branch · still connected</p>
      <button type="button" className={styles.up} onClick={onBack}>
        Pick it back up
      </button>
    </div>
  );
}
