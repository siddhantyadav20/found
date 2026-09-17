"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import styles from "./Story.module.css";

/* ===========================================================================
   A neighbour's Instagram story, eleven hours from expiring: a cat on a
   fifth-floor balcony at 12:37 AM.

   Nothing in the picture matters. Turn the volume up and there are two voices
   on the terrace above it, and one of them is asking a 64-year-old woman
   where her diary is (CHAPTER1.md, Episode 2, beat 8).

   Never graphic. It ends before anything happens, the way a phone recording
   of somebody's cat would.
   =========================================================================== */

export default function Stories({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const [loud, setLoud] = useState(false);
  const live = story.stories.filter((s) => all(state, s.requires));
  if (!live.length) return <p className={styles.none}>Nothing new.</p>;

  return (
    <>
      {live.map((s) => (
        <section key={s.id} className={styles.story}>
          <header className={styles.head}>
            <span className={styles.who}>{s.who}</span>
            <span className={styles.expires}>{s.at} · expires in {s.expires}</span>
          </header>

          <div className={styles.frame} aria-label={s.caption}>
            <span className={styles.cat} aria-hidden="true" />
            <span className={styles.caption}>{s.caption}</span>
            <span className={styles.bar} aria-hidden="true" />
          </div>

          {!loud ? (
            <button
              type="button"
              className={styles.turnUp}
              onClick={() => {
                setLoud(true);
                if (s.evidence) onRead([s.evidence]);
              }}
            >
              Turn the volume up
            </button>
          ) : (
            <div className={styles.audio}>
              <p className={styles.audioLabel}>Above her, on the terrace</p>
              {s.audio.map((line, i) => (
                <p key={i} className={styles.line}>
                  <span className={styles.speaker}>{line.who}</span>
                  <span>{line.line}</span>
                  {line.english && <span className={styles.english}>{line.english}</span>}
                </p>
              ))}
              <p className={styles.ends}>The clip ends there.</p>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
