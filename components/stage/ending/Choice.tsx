"use client";

import type { Story } from "@/content/types";
import { finish } from "@/lib/game/endings";
import { flag } from "../playthrough";
import styles from "./Ending.module.css";

/* ===========================================================================
   The choice.

   The rows are identical in weight, fixed in order and flat in voice: no
   recommendation, no icon, no colour that means anything, nothing that
   praises whichever is picked (PLAYER-JOURNEY Stage 8). Players read layout
   as morality, so the layout says nothing.

   Until ROADMAP S9 builds the record and each ending's act, a row finishes
   the chapter directly.
   =========================================================================== */

export default function Choice({ story }: { story: Story }) {
  return (
    <div className={styles.screen}>
      <div className={styles.column}>
        <ul className={styles.rows}>
          {story.endings.map((e, i) => (
            <li key={e.id}>
              <button type="button" className={styles.row} onClick={() => flag(...finish(e.id))}>
                <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.label}>{e.row}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
