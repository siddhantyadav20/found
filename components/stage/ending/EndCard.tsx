"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import KeepCase from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import type { CaseId } from "@/content/cases";
import type { Story } from "@/content/types";
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

   1. How the playthrough went, in a form that spoils nothing. (Until ROADMAP
      S3 replaces it with the chain, this is still the ledger.)
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
  const held = result.held;

  // A finish outlives "Play again", and goes on the shelf if they keep a number.
  useEffect(() => {
    markSolved(id as CaseId, { episode: 3, minutes: result.minutes, held: held.length, at: Date.now() });
  }, [id, result.minutes, held.length]);

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
      <section className={styles.section} aria-labelledby="had">
        <p className={styles.eyebrow} id="had">
          What you gave away
        </p>
        {held.length > 0 && (
          <ul className={styles.held}>
            {held.map((h, i) => (
              <li key={h} style={{ animationDelay: `${0.4 + i * 0.7}s` }}>
                {h}
              </li>
            ))}
          </ul>
        )}
        <p className={styles.count} style={{ animationDelay: `${0.6 + held.length * 0.7}s` }}>
          {held.length === 0 ? "Nothing." : `${held.length} thing${held.length === 1 ? "" : "s"}.`}
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
