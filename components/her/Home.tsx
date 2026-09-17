"use client";

import { useState } from "react";

import type { AppId, Story } from "@/content/types";
import { openQuestion, unseenIn, type CaseState } from "@/lib/game/engine";
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
  onOpen: (app: AppId) => void;
  covered?: boolean;
}) {
  const [page, setPage] = useState(0);
  const open = openQuestion(story, state);
  const { pages, dock } = story.hersHome;

  const icon = (app: AppId, label: string) => {
    const unseen = unseenIn(story, state, app);
    return (
      <button key={`${app}-${label}`} type="button" className={styles.icon} onClick={() => onOpen(app)}>
        <span className={styles.tile}>
          <AppGlyph app={app} />
        </span>
        {unseen > 0 && <span className={styles.badge}>{unseen}</span>}
        <span className={styles.label}>{label}</span>
      </button>
    );
  };

  return (
    <div className={styles.home} data-covered={covered || undefined} inert={covered} aria-hidden={covered || undefined}>
      <button type="button" className={styles.widget} onClick={() => onOpen("casefile")}>
        <span className={styles.widgetLabel}>{open ? "Open question" : "Case file"}</span>
        <span className={styles.widgetText}>
          {open ? open.ask : "Look around. What you open, you keep."}
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

      <div className={styles.dots} aria-hidden="true">
        {pages.map((_, i) => (
          <span key={i} className={styles.pageDot} data-on={i === page || undefined} />
        ))}
      </div>

      <div className={styles.dock}>{dock.map((a) => icon(a.app, a.label))}</div>
    </div>
  );
}
