"use client";

import { useEffect, useState } from "react";

import type { Story, Thread } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Page, SearchField } from "../AppView";
import { Chevron } from "../ios/AppBar";
import Avatar from "../ios/Avatar";
import app from "../ios/App.module.css";
import list from "../ios/Messages.module.css";
import styles from "../ios/Thread.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Messages: the bank, the lender, and what the phone decided to file away.

   The pilot's iMessage (c03aa03), re-pointed at this story: grey bubbles with
   tails on the last of each run, a centred time stamp at each new day, and
   the list with its unread dots.

   iOS files anything from a sender it doesn't trust under **Unknown
   Senders**, a filter over real senders rather than a contact of its own
   (PLAYTEST.md #59).
   =========================================================================== */

type Folder = "inbox" | "junk";

function ThreadView({
  thread,
  state,
  label,
  onBack,
  onRead,
}: {
  thread: Thread;
  state: CaseState;
  /** How the phone names a day. */
  label: (day: string | undefined) => string;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
}) {
  const shown = thread.messages.filter((m) => all(state, m.requires));
  const ids = shown.map((m) => m.evidence).filter(Boolean).join(",");
  useEffect(() => {
    if (ids) onRead(ids.split(","));
  }, [ids, onRead]);

  return (
    <section className={app.view} data-push aria-label={thread.name}>
      {/* iOS 26: back and FaceTime in glass circles, the person in the middle. */}
      <header className={styles.head}>
        <button type="button" className={`${app.back} lg`} onClick={onBack} data-back aria-label="Messages">
          <Chevron back />
        </button>
        <span className={styles.who}>
          <Avatar name={thread.name} size="head" />
          <span className={`${styles.whoName} lg`}>
            <span>{thread.name}</span>
            <Chevron />
          </span>
        </span>
        <span className={`${app.back} ${styles.headEnd} lg`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.facetime}>
            <rect x="2.5" y="6.5" width="13" height="11" rx="3" />
            <path d="m16.5 10.5 5-3v9l-5-3Z" />
          </svg>
        </span>
      </header>
      <div className={`${app.body} ${styles.body}`} data-no-swipe>
        {shown.map((m, i) => {
          const prev = shown[i - 1];
          const next = shown[i + 1];
          const newDay = !prev || label(prev.day) !== label(m.day);
          const endOfRun = !next || next.from !== m.from || label(next.day) !== label(m.day);
          return (
            <div key={m.id}>
              {newDay && (
                <p className={styles.stamp}>
                  <b>{label(m.day)}</b> {stamp(m.at)}
                </p>
              )}
              <div className={styles.row} data-from={m.from === "owner" ? "owner" : "them"} data-tail={endOfRun || undefined}>
                <p className={styles.bubble}>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* A business's number takes no replies; the field is there all the same. */}
      <div className={styles.composer} aria-hidden="true">
        <span className={`${styles.plus} lg`}>
          <svg viewBox="0 0 16 16">
            <path d="M8 2.5v11M2.5 8h11" />
          </svg>
        </span>
        <span className={styles.field}>
          Text Message · SMS
          <svg viewBox="0 0 16 16" className={styles.mic}>
            <rect x="5.4" y="1.5" width="5.2" height="8.6" rx="2.6" />
            <path d="M3.3 7.6a4.7 4.7 0 0 0 9.4 0M8 12.3v2.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </section>
  );
}

export default function Messages({
  story,
  state,
  onRead,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onHome?: () => void;
}) {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [open, setOpen] = useState<string | null>(null);
  // A sender with nothing visible yet isn't in the list at all.
  const threads = story.threads.filter(
    (t) => t.app === "messages" && all(state, t.requires) && t.messages.some((m) => all(state, m.requires)),
  );
  const cal = calendarOf(story, state);
  const here = threads.find((t) => t.id === open);

  if (here) return <ThreadView thread={here} state={state} label={cal.label} onBack={() => setOpen(null)} onRead={onRead} />;

  const inFolder = threads.filter((t) => (t.folder ?? "inbox") === folder);
  const junk = threads.filter((t) => t.folder === "junk").reduce((n, t) => n + t.messages.filter((m) => all(state, m.requires)).length, 0);

  return (
    <Page
      title={folder === "inbox" ? "Messages" : "Unknown Senders"}
      large
      root={folder === "inbox"}
      onBack={folder === "inbox" ? onHome : () => setFolder("inbox")}
      backLabel={folder === "inbox" ? "Home" : "Messages"}
      end={
        <span className={`${app.back} lg`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={list.compose}>
            <path d="M12.5 5.5h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M16.8 4.2l3 3-7.6 7.6-3.7.7.7-3.7Z" />
          </svg>
        </span>
      }
    >
      <SearchField />
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
                    <span className={list.when}>
                      {cal.isToday(last?.day) ? stamp(last?.at) : cal.label(last?.day)}
                      <Chevron />
                    </span>
                  </span>
                  <span className={list.preview}>{last?.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {folder === "inbox" && (
        <ul className={`${app.group} ${list.filters}`}>
          <li>
            <button type="button" className={app.row} onClick={() => setFolder("junk")}>
              <span className={app.rowMain}>
                <span className={app.rowTitle}>Unknown Senders</span>
              </span>
              {junk > 0 && <span className={app.rowMeta}>{junk}</span>}
              <Chevron />
            </button>
          </li>
        </ul>
      )}
    </Page>
  );
}
