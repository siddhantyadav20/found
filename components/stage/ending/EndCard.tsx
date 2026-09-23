"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import KeepCase from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import type { CaseId } from "@/content/cases";
import type { EpisodeNo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { chosen } from "@/lib/game/endings";
import { commit } from "@/lib/found/progress";
import { resultOf } from "@/lib/found/result";
import { markSolved } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import PassItOn from "../PassItOn";
import styles from "./Ending.module.css";

/* ===========================================================================
   After every ending, the same card (PLAYER-JOURNEY Stage 9):

   1. The chain: every link, traced ones in the record's words and the rest
      in Sameer's, a line at a time; then the count, which is the share.
   2. The one thing only this ending showed, and what others chose.
   3. Play again, Pass it on, and keep your case number.
   4. Outside the fiction: what to do if any of this is close to home.
      (ROADMAP S9 writes the chapter's own facts here, checked at the source.)
   =========================================================================== */

type Others = Record<string, number> | null;

export default function EndCard({ story, state }: { story: Story; state: CaseState }) {
  const { id } = useCase();
  const ending = chosen(story, state);
  // Minutes are measured to the moment the card first appears.
  const [result] = useState(() => resultOf(story, state, Date.now()));
  const [others, setOthers] = useState<Others>(null);
  const done = result.traced;
  const episodes = story.episodes.length as EpisodeNo;

  // A finish outlives "Play again", and goes on the shelf if they keep a number.
  useEffect(() => {
    markSolved(id as CaseId, { episode: episodes, minutes: result.minutes, traced: done.length, at: Date.now() });
  }, [id, episodes, result.minutes, done.length]);

  // What others did, once enough people have, and never as a count.
  useEffect(() => {
    let live = true;
    fetch(`/api/found/choices?case=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { end?: Others } | null) => live && setOthers(d?.end ?? null))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id]);

  const playAgain = () => {
    track({ case: id, event: "reset:yes" });
    commit(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`${styles.screen} ${styles.card}`}>
      <section className={styles.section} aria-labelledby="chain">
        <p className={styles.eyebrow} id="chain">
          The chain
        </p>
        <ol className={styles.chain}>
          {story.chain.map((l, i) => {
            const traced = done.includes(l.id);
            return (
              <li key={l.id} data-traced={traced || undefined} style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
                <span className={styles.linkLabel}>{l.label}</span>
                {traced ? (
                  <span className={styles.linkText}>{l.truth}</span>
                ) : l.version ? (
                  /* Untraced: what the owner said happened, in his words. */
                  <span className={styles.linkText}>
                    <span lang="hi-Latn">&ldquo;{l.version}&rdquo;</span>
                    {l.english && <span className={styles.english}>{l.english}</span>}
                  </span>
                ) : (
                  <span className={styles.linkText}>Not traced.</span>
                )}
              </li>
            );
          })}
        </ol>
        <p className={styles.count} style={{ animationDelay: `${0.6 + story.chain.length * 0.35}s` }}>
          You traced {done.length} of {result.links} links.
        </p>
      </section>

      {ending && (
        <section className={styles.section}>
          <p className={styles.eyebrow}>Only this ending showed</p>
          <p className={styles.only}>{ending.onlyHere}</p>
          {others && (
            <p className={styles.others}>
              Of everyone who finished:{" "}
              {story.endings.map((e) => `${others[e.id] ?? 0}% chose “${e.row}”`).join(", ")}.
            </p>
          )}
        </section>
      )}

      <section className={styles.section}>
        <button type="button" className={styles.button} onClick={playAgain}>
          Play again
        </button>
      </section>

      <PassItOn result={result} />

      <section className={styles.section}>
        <KeepCase caseId={id as CaseId} />
        <Link className={styles.quiet} href="/">
          Back to the desk
        </Link>
      </section>

      <aside className={styles.outside} aria-label="Outside the story">
        <p>
          If any of this is close to home, Tele-MANAS is free and open all day: <a href="tel:14416">14416</a>.
        </p>
      </aside>
    </div>
  );
}
