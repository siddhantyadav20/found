"use client";

import { useState } from "react";

import type { ReplyOption, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import Chat from "./Chat";
import Stories from "./Story";
import styles from "./Instagram.module.css";

/* ===========================================================================
   Instagram, which she used for two things: her friends, and, on Friday
   night, finding the girl whose bank account had her ₹49,000 in it.

   Two tabs, because the app has two halves and the story needs both: what
   the neighbours posted, and what she said to Tanvi.
   =========================================================================== */

export default function Instagram({
  story,
  state,
  onRead,
  onSay,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  const stories = story.stories.filter((s) => all(state, s.requires));
  const [tab, setTab] = useState<"stories" | "messages">(stories.length ? "stories" : "messages");

  return (
    <div className={styles.app}>
      <div className={styles.tabs}>
        <button type="button" data-on={tab === "stories" || undefined} onClick={() => setTab("stories")}>
          Stories{stories.length ? ` (${stories.length})` : ""}
        </button>
        <button type="button" data-on={tab === "messages" || undefined} onClick={() => setTab("messages")}>
          Messages
        </button>
      </div>

      <div className={styles.body}>
        {tab === "stories" ? (
          <Stories story={story} state={state} onRead={onRead} />
        ) : (
          <Chat story={story} state={state} app="instagram" onRead={onRead} onSay={onSay} />
        )}
      </div>
    </div>
  );
}
