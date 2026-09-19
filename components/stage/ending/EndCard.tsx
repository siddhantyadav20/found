"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import KeepCase from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import { AppGlyph } from "@/components/her/ios/icons";
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
   After every ending, the same card (CHAPTER1.md E, PLAYER-JOURNEY Stage 10):

   1. What they had on you, a line at a time, and the count. No score.
   2. The one thing only this ending showed.
   3. The first ten seconds again, frozen on the 1:11 alert, its icon growing
      into the grey shield: nobody had reported her death yet.
   4. Pass it on, and keep your case number.
   5. Outside the fiction: what to do if this happens for real.
   =========================================================================== */

type Others = { police: number; bin: number; friend: number } | null;

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
          What they had on you
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
          {held.length === 0
            ? "They had nothing on you."
            : `They had ${held.length} thing${held.length === 1 ? "" : "s"} on you.`}
        </p>
      </section>

      {ending && (
        <section className={styles.section}>
          <p className={styles.eyebrow}>Only this ending showed</p>
          <p className={styles.only}>{ending.onlyHere}</p>
          {others && (
            <p className={styles.others}>
              Of everyone who finished: {others.police}% reported it, {others.bin}% threw it away, {others.friend}% shared
              it.
            </p>
          )}
        </section>
      )}

      <section className={styles.section} aria-label="The first ten seconds, again">
        <div className={styles.replay} aria-hidden="true">
          <span className={styles.replayTime}>1:11</span>
          <span className={styles.replayAlert}>
            <span className={styles.replayIcon}>
              <AppGlyph app="kyc" />
            </span>
            <span>
              <b>City Desk</b>
              <br />
              Dadar: retired bank manager, 64, found dead below building
            </span>
          </span>
        </div>
        <p className={styles.nobody}>No one had reported her death yet.</p>
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
          Real police never arrest anyone over a video call. If it happens to you or your parents, cut the call and
          dial <a href="tel:1930">1930</a>, or report it at{" "}
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
            cybercrime.gov.in
          </a>
          .
        </p>
        <p>
          If any of this is close to home, Tele-MANAS is free and open all day: <a href="tel:14416">14416</a>.
        </p>
        <p>
          The people most likely to get this call won&apos;t play for forty minutes.{" "}
          <Link href="/first-minute">There is a sixty-second version</Link> for your family group.
        </p>
      </aside>
    </div>
  );
}
