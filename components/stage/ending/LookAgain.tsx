"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { appLabel, isTraced, type CaseState } from "@/lib/game/engine";
import styles from "./LookAgain.module.css";

/* ===========================================================================
   Look again (script §20): once it's over, his phone, to go back through,
   and beside it what was on it from the first minute, each with what it
   turned out to mean, held back until the player asks, so they can think
   first (CHAPTER1.md K1). Then the links still in Sameer's words, and where
   their proof was. Nothing happens on the phone any more: no calls, no
   messages, no nudges (Table's `review`).
   =========================================================================== */

export default function LookAgain({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const items = story.lookAgain ?? [];
  // Each untraced link, and the answer to the question that would have traced it.
  const missed = story.chain
    .filter((l) => !isTraced(state, l))
    .map((l) => ({
      link: l,
      where: story.questions.find((q) => q.kind === "file" && q.claims.some((c) => !c.version && c.sets?.includes(`link:${l.id}`)))?.hints[2],
    }));

  return (
    <>
      <div className={styles.bar}>
        <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
          What was there all along
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
                Back to his phone
              </button>
            </header>
            <p className={styles.lede}>All of this was on the phone from the first minute. Tap one to see what it meant.</p>
            <ol className={styles.list}>
              {items.map((item, i) => (
                <li key={item.what}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-expanded={shown.has(i)}
                    onClick={() => setShown((s) => new Set(s).add(i))}
                  >
                    <span className={styles.where}>{appLabel(story, item.where)}</span>
                    <span className={styles.what}>{item.what}</span>
                    {shown.has(i) && <span className={styles.meant}>{item.meant}</span>}
                  </button>
                </li>
              ))}
            </ol>
            {missed.length > 0 && (
              <>
                <h3 className={styles.sub}>Still in Sameer&apos;s words</h3>
                <ol className={styles.list}>
                  {missed.map(({ link, where }) => (
                    <li key={link.id} className={styles.missed}>
                      <span className={styles.where}>{link.label}</span>
                      {link.version && (
                        <span className={styles.what} lang="hi-Latn">
                          &ldquo;{link.version}&rdquo;
                        </span>
                      )}
                      {where && <span className={styles.meant}>{where}</span>}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
