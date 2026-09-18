"use client";

import { useEffect, useState } from "react";

import type { Story, Thread } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import AppBar from "../ios/AppBar";
import Avatar from "../ios/Avatar";
import app from "../ios/App.module.css";
import list from "../ios/Messages.module.css";
import styles from "../ios/Thread.module.css";

/* ===========================================================================
   Messages: the bank, and what the phone decided she shouldn't see.

   The pilot's iMessage (c03aa03), re-pointed at this story: grey bubbles with
   tails on the last of each run, a centred time stamp at each new day, and
   the list with its unread dots.

   A retired bank manager's Messages is mostly her bank. And iOS files
   anything from a sender it doesn't trust under **Unknown Senders** — which
   is where the ₹1,00,000 debit lands, if the player typed her password and
   they used it (CHAPTER1.md, Episode 2, beat 9). The arrest accuses the
   player of that transfer; this is where they check whether it happened.
   =========================================================================== */

type Folder = "inbox" | "junk";

function ThreadView({
  thread,
  state,
  onBack,
  onRead,
}: {
  thread: Thread;
  state: CaseState;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
}) {
  const shown = thread.messages.filter((m) => all(state, m.requires));
  const ids = shown.map((m) => m.evidence).filter(Boolean).join(",");
  useEffect(() => {
    if (ids) onRead(ids.split(","));
  }, [ids, onRead]);

  return (
    <section className={app.view} aria-label={thread.name}>
      <AppBar onBack={onBack} backLabel="Messages" />
      <header className={styles.head}>
        <span className={styles.who}>
          <Avatar name={thread.name} size="head" />
          <span className={styles.whoName}>{thread.name}</span>
        </span>
      </header>
      <div className={styles.body} data-no-swipe>
        {shown.map((m, i) => {
          const prev = shown[i - 1];
          const next = shown[i + 1];
          const newDay = !prev || prev.day !== m.day;
          const endOfRun = !next || next.from !== m.from || next.day !== m.day;
          return (
            <div key={m.id}>
              {newDay && (
                <p className={styles.stamp}>
                  <b>{m.day}</b> {m.at}
                </p>
              )}
              <div className={styles.row} data-from={m.from === "her" ? "owner" : "them"} data-tail={endOfRun || undefined}>
                <p className={styles.bubble}>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Messages({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [open, setOpen] = useState<string | null>(null);
  const threads = story.threads.filter((t) => t.app === "messages" && all(state, t.requires));
  const here = threads.find((t) => t.id === open);

  if (here) return <ThreadView thread={here} state={state} onBack={() => setOpen(null)} onRead={onRead} />;

  const inFolder = threads.filter((t) => (t.folder ?? "inbox") === folder);
  const junk = threads.filter((t) => t.folder === "junk").reduce((n, t) => n + t.messages.filter((m) => all(state, m.requires)).length, 0);

  return (
    <div className={app.body}>
      <h2 className={app.big}>{folder === "inbox" ? "Messages" : "Unknown Senders"}</h2>
      <ul className={list.list}>
        {inFolder.map((t) => {
          const shown = t.messages.filter((m) => all(state, m.requires));
          const last = shown[shown.length - 1];
          return (
            <li key={t.id}>
              <button type="button" className={list.thread} onClick={() => setOpen(t.id)}>
                <span className={list.unread} />
                <Avatar name={t.name} size="row" />
                <span className={list.main}>
                  <span className={list.top}>
                    <span className={list.name}>{t.name}</span>
                    <span className={list.when}>{last?.day === "Friday" ? "Friday" : last?.at}</span>
                  </span>
                  <span className={list.preview}>{last?.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className={app.row} onClick={() => setFolder(folder === "inbox" ? "junk" : "inbox")}>
        <span className={app.rowMain}>
          <span className={app.rowTitle}>{folder === "inbox" ? "Unknown Senders" : "Back to Messages"}</span>
        </span>
        {folder === "inbox" && junk > 0 && <span className={app.rowMeta}>{junk}</span>}
      </button>
    </div>
  );
}
