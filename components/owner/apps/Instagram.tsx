"use client";

import type { ReplyOption, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { Chevron } from "../ios/AppBar";
import Chat from "./Chat";
import styles from "./Instagram.module.css";

/* ===========================================================================
   Instagram: the wordmark, the owner's own story ring, and the Direct
   messages underneath (PLAYTEST.md #42). ROADMAP S4 adds the profile grid
   (SK Films) and other people's profiles.
   =========================================================================== */

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
              <span className={styles.face}>{initials(story.owner.name)}</span>
            </span>
            <span className={styles.handle}>Your story</span>
          </li>
        </ul>

        <h3 className={styles.section}>Messages</h3>
        <Chat story={story} state={state} app="instagram" chrome={false} onRead={onRead} onSay={onSay} />
      </div>
    </div>
  );
}
