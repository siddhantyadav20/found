"use client";

import type { Story } from "@/content/types";
import { episodeOf, type CaseState } from "@/lib/game/engine";
import { ago } from "@/lib/found/keeping";
import { useNow } from "@/lib/found/now";
import { Mast, Still } from "./Film";
import styles from "./Interstitial.module.css";

/* ===========================================================================
   Coming back after a real gap (PLAYER-JOURNEY Stage 10).

   The player put the phone down, for an hour or a night. They're told how
   long, and then they pick it back up, onto exactly the screen they left.
   ROADMAP S5 gives this its own line for the chapter.
   =========================================================================== */

export default function Away({ story, state, last, still, onBack }: { story: Story; state: CaseState; last: number; still?: string; onBack: () => void }) {
  const now = useNow(1000);
  const ep = episodeOf(state);
  return (
    <div className={styles.card}>
      {still && <Still src={still} priority sizes="100vw" className={styles.frame} />}
      <Mast />
      <p className="eyebrow">{now ? `You put it down ${ago(last, now)}` : " "}</p>
      <p className={styles.line}>It&apos;s where you left it.</p>
      <p className={styles.sub}>
        Episode {ep} · {story.episodes[ep - 1]}
      </p>
      <button type="button" className={`act ${styles.back}`} onClick={onBack}>
        Pick it back up
      </button>
    </div>
  );
}
