"use client";

import { useState } from "react";

import type { ReplyOption, Story } from "@/content/types";
import { all, seen, type CaseState } from "@/lib/game/engine";
import { Chevron } from "../ios/AppBar";
import Chat from "./Chat";
import Stories from "./Story";
import styles from "./Instagram.module.css";

/* ===========================================================================
   Instagram, which she used for two things: her friends, and, on Friday
   night, finding the girl whose bank account had her ₹49,000 in it.

   Drawn the way the app is: the wordmark, a row of stories in their
   gradient rings, and her messages underneath (PLAYTEST.md #42). A ring
   that hasn't been watched is coloured; one that has goes grey.
   =========================================================================== */

export default function Instagram({
  story,
  state,
  onHome,
  onRead,
  onSay,
}: {
  story: Story;
  state: CaseState;
  onHome: () => void;
  onRead: (ids: readonly string[]) => void;
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  const stories = story.stories.filter((s) => all(state, s.requires));
  const [watching, setWatching] = useState(false);

  if (watching)
    return (
      <div className={styles.app}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={() => setWatching(false)} data-back aria-label="Back">
            <Chevron back />
          </button>
        </header>
        <div className={styles.body}>
          <Stories story={story} state={state} onRead={onRead} />
        </div>
      </div>
    );

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span className={styles.wordmark}>Instagram</span>
        <span />
      </header>

      <div className={styles.body}>
        <ul className={styles.rings} aria-label="Stories">
          <li>
            <span className={styles.ring} data-own>
              <span className={styles.face}>VK</span>
            </span>
            <span className={styles.handle}>Your story</span>
          </li>
          {stories.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={styles.ring}
                data-new={!(s.evidence && seen(state, s.evidence)) || undefined}
                onClick={() => setWatching(true)}
                aria-label={`${s.who}'s story, ${s.expires} left`}
              >
                <span className={styles.face}>{s.who.slice(0, 2).toUpperCase()}</span>
              </button>
              <span className={styles.handle}>{s.who.split(" ")[0]}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.section}>Messages</h3>
        <Chat story={story} state={state} app="instagram" chrome={false} onRead={onRead} onSay={onSay} />
      </div>
    </div>
  );
}
