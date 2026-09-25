"use client";

import { useState } from "react";

import type { AppId, Story } from "@/content/types";
import { answered, needsRevisit, openQuestion, unseenIn, type CaseState } from "@/lib/game/engine";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/Home.module.css";

/* ===========================================================================
   Her home screen, with one thing a real phone wouldn't have: the widget at
   the top is the player's open question.

   It is the quiet answer to "what am I supposed to be doing", it is always
   one tap from the case file, and it is the reason nobody has to be told how
   to play (PLAYER-JOURNEY Stage 4).

   Page two is where a son installed things for his mother once and she never
   opened them again.

   It stays mounted under an open app (`covered`): pushed back, dimmed and out
   of reach, so pulling the app away shows it, as a phone does.
   =========================================================================== */

export default function Home({
  story,
  state,
  onOpen,
  covered = false,
}: {
  story: Story;
  state: CaseState;
  /** Which app, and the box it was tapped in, relative to the viewport. */
  onOpen: (app: AppId, from?: DOMRect) => void;
  covered?: boolean;
}) {
  const [page, setPage] = useState(0);
  const open = openQuestion(story, state);
  // Everything the chapter asks has been answered: what's left is done on your own phone.
  const allAsked = story.questions.filter((q) => !q.optional).every((q) => answered(state, q.id));
  const { pages, dock } = story.home;

  const icon = (app: AppId, label: string) => {
    const unseen = unseenIn(story, state, app);
    return (
      <button
        key={`${app}-${label}`}
        type="button"
        className={styles.icon}
        // The dock draws no labels, as iOS doesn't; a screen reader still gets one.
        aria-label={unseen > 0 ? `${label}, ${unseen} new` : label}
        onClick={(e) => onOpen(app, e.currentTarget.querySelector("span")?.getBoundingClientRect())}
      >
        {/* The badge sits on the tile's corner, as iOS draws it. */}
        <span className={styles.tile}>
          <AppGlyph app={app} />
          {unseen > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {unseen}
            </span>
          )}
        </span>
        <span className={styles.label}>{label}</span>
      </button>
    );
  };

  return (
    <div className={styles.home} data-covered={covered || undefined} inert={covered} aria-hidden={covered || undefined}>
      <button type="button" className={`${styles.widget} lg-thick`} onClick={(e) => onOpen("casefile", e.currentTarget.getBoundingClientRect())}>
        <span className={styles.widgetLabel}>{open ? (needsRevisit(open, state) ? "Revisit" : "Open question") : "Case file"}</span>
        <span className={styles.widgetText}>
          {open ? open.ask : allAsked ? "Everything's asked. What you do with it is on your phone." : "Look around. What you open, you keep."}
        </span>
      </button>

      <div
        className={styles.pages}
        onScroll={(e) => {
          const w = e.currentTarget.clientWidth || 1;
          setPage(Math.round(e.currentTarget.scrollLeft / w));
        }}
      >
        {pages.map((apps, i) => (
          <div key={i} className={styles.page}>
            <div className={styles.grid}>{apps.map((a) => icon(a.app, a.label))}</div>
          </div>
        ))}
      </div>

      {/* iOS 26 puts Search where the page dots were; the dots come back with a second page. */}
      {pages.length > 1 ? (
        <div className={`${styles.dots} lg`} aria-hidden="true">
          {pages.map((_, i) => (
            <span key={i} className={styles.pageDot} data-on={i === page || undefined} />
          ))}
        </div>
      ) : (
        <span className={`${styles.dots} ${styles.search} lg`} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="6.8" cy="6.8" r="4.6" />
            <path d="m10.3 10.3 3.6 3.6" />
          </svg>
          Search
        </span>
      )}

      <div className={`${styles.dock} lg`}>{dock.map((a) => icon(a.app, a.label))}</div>
    </div>
  );
}
