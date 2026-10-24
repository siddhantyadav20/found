"use client";

import type { Story } from "@/content/types";
import { traced, type CaseState } from "@/lib/game/engine";
import CloseCase from "./CloseCase";
import file from "./CaseFile.module.css";
import styles from "./Finale.module.css";

/* ===========================================================================
   The last hour (2026-10-24). Everything's asked, and the night stops: the
   time, what's coming in the morning, how much of the chain the player
   traced, and the record with the three things that can be done with it.
   It used to be a panel at the foot of the case file, and the chapter ended
   on a form. "Not yet" goes back to the phone; the case file keeps it.
   =========================================================================== */

/** The line under it, told from whichever way seven o'clock went. */
function subOf(story: Story, state: CaseState): string {
  const { finale, fate } = story;
  if (!finale) return "";
  if (fate && finale.after && state.flags.includes(fate.yes)) return finale.after.yes;
  if (fate && finale.after && state.flags.includes(fate.no)) return finale.after.no;
  return finale.sub;
}

export default function Finale({ story, state, onLater }: { story: Story; state: CaseState; onLater: () => void }) {
  const finale = story.finale;
  if (!finale) return null;
  const links = traced(story, state).length;
  return (
    <div className={styles.finale}>
      <div className={styles.inner}>
        <p className={styles.when}>{finale.when}</p>
        <h2 className={styles.line}>{finale.line}</h2>
        <p className={styles.sub}>{subOf(story, state)}</p>
        <div className={styles.score} aria-label={`${links} of ${story.chain.length} links traced`}>
          {story.chain.map((l) => (
            <span key={l.id} data-on={traced(story, state).some((t) => t.id === l.id) || undefined} title={l.label} />
          ))}
          <b>
            {links} of {story.chain.length} links traced
          </b>
        </div>
        <div className={`${file.file} ${styles.sheet}`}>
          <CloseCase story={story} state={state} open />
        </div>
        <button type="button" className={styles.later} onClick={onLater}>
          Not yet. I want to look at his phone again
        </button>
      </div>
    </div>
  );
}
