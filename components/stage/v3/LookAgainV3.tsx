"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { clueSeenAt, sawClue } from "@/lib/game/reading";
import { stamp } from "@/lib/found/time";
import styles from "../ending/LookAgain.module.css";

/* ===========================================================================
   Look again (RAAKH-V3 §15, §17): after any ending but Unopened, his phone
   to go back through, and beside it the fifteen identity clues: each with
   where it was, when this player first saw it (or that they never did), and
   what it meant, held back until they ask. Nothing happens on the phone any
   more: no calls, no messages, no nudges.
   =========================================================================== */

export default function LookAgainV3({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const clues = story.clues ?? [];
  const seen = clues.filter((c) => sawClue(state, c)).length;

  return (
    <>
      <div className={styles.bar}>
        <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
          Whose door it was ({seen} of {clues.length})
        </button>
        <button type="button" className={styles.back} onClick={onDone}>
          Back to the end
        </button>
      </div>

      {open && (
        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Look again">
          <div className={styles.panel}>
            <header className={styles.head}>
              <h2>Look again</h2>
              <button type="button" className={styles.close} onClick={() => setOpen(false)}>
                Back to the phone
              </button>
            </header>
            <p className={styles.lede}>Everything that said whose door this was, before the camera did. Tap one to see what it meant.</p>
            <ol className={styles.list}>
              {clues.map((c) => {
                const saw = sawClue(state, c);
                const at = clueSeenAt(state, c);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={styles.item}
                      aria-expanded={shown.has(c.id)}
                      onClick={() => setShown((s) => new Set(s).add(c.id))}
                    >
                      <span className={styles.where}>
                        {c.id} · {c.where} · {saw ? (at ? `You saw it at ${stamp(at)}` : "You saw it") : "Not seen"}
                      </span>
                      <span className={styles.what}>{c.what}</span>
                      {shown.has(c.id) && <span className={styles.meant}>{c.meant}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
