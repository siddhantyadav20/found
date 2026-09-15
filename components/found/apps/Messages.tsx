"use client";

import { useEffect, useMemo, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Story } from "@/content/found/types";
import { all, has, openReply, sessionVars, threadMessages } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import * as play from "../FoundPhone/actions";
import AppBar, { Chevron } from "./AppBar";
import Avatar from "./Avatar";
import Thread from "./Thread";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Messages.module.css";

/** Threads with something new rise to the top, newest first; the rest keep the script's order. */
function lastTouched(ep: Story, flags: readonly string[], threadId: string): number {
  let at = -1;
  flags.forEach((f, i) => {
    if (f === "ep:2" && ep.threads.find((t) => t.id === threadId)?.messages.some((m) => m.requires?.includes("ep:2")))
      at = Math.max(at, i);
    if (!f.startsWith("fired:") && !f.startsWith("said:")) return;
    const e = f.startsWith("fired:") ? ep.events.find((x) => `fired:${x.id}` === f) : ep.replies.find((r) => f.startsWith(`said:${r.id}`));
    if (e?.thread === threadId) at = i;
  });
  return at;
}

const WEEKDAY: Record<string, string> = { Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };

/**
 * When a conversation last moved, the way the iOS list prints it. The story's
 * present is always Monday, so a Monday message shows its time, Sunday is
 * "Yesterday", and anything earlier is its weekday.
 */
function listTime(at: string | undefined): string {
  if (!at) return "";
  if (at === "now") return "Now";
  const [day, time] = at.split(" ");
  if (day === "Mon") return time ?? "";
  if (day === "Sun") return "Yesterday";
  return WEEKDAY[day] ?? day;
}

/** A number nobody on this phone has given a name to. */
const isUnknown = (contact: string, named: string | undefined) => contact.startsWith("+") && !named;

export default function Messages({
  state,
  arg,
  unread,
  onRead,
}: AppProps & { unread: ReadonlySet<string>; onRead: (thread: string) => void }) {
  const ep = useStory();
  const [open, setOpen] = useState<string | null>(arg ?? null);
  const [query, setQuery] = useState("");
  const vars = sessionVars(ep, state);
  const ep2 = has(state, "ep:2");

  const threads = useMemo(
    () =>
      ep.threads
        .filter((t) => all(state, t.requires))
        .map((t) => ({ thread: t, touched: lastTouched(ep, state.flags, t.id), messages: threadMessages(ep, state, t.id) }))
        .sort((a, b) => b.touched - a.touched),
    [ep, state],
  );

  const rows = threads.map(({ thread, messages }) => {
    const last = messages.at(-1);
    const title = state.names[thread.id] ?? thread.contact;
    const preview = thread.moved
      ? "This conversation was moved."
      : last?.text
        ? say(last.text, state.cast, vars)
        : last?.card
          ? "Image"
          : last?.photo
            ? "Photo"
            : "";
    return {
      thread,
      title,
      preview,
      when: listTime(last?.at),
      waiting: ep2 && !!openReply(ep, state, thread.id),
      unknown: isUnknown(thread.contact, state.names[thread.id]),
    };
  });

  const q = query.trim().toLowerCase();
  const shown = q ? rows.filter((r) => r.title.toLowerCase().includes(q) || r.preview.toLowerCase().includes(q)) : rows;

  const current = threads.find((t) => t.thread.id === open);
  const count = current?.messages.length ?? 0;

  useEffect(() => {
    if (!open) return;
    onRead(open);
    // Opening a thread is reading it, and the other side can see that.
    play.perform(`open:${open}`);
  }, [open, count, onRead]);

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>Messages</h2>
        <label className={styles.search}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.6" cy="8.6" r="5.6" />
            <path d="m12.8 12.8 4.2 4.2" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search messages"
            autoComplete="off"
          />
        </label>
        <ul className={styles.list}>
          {shown.map(({ thread, title, preview, when, waiting, unknown }) => (
            <li key={thread.id}>
              <button type="button" className={styles.thread} onClick={() => setOpen(thread.id)}>
                <span className={styles.unread} data-on={unread.has(thread.id) || waiting || undefined} />
                <Avatar name={title} unknown={unknown} group={thread.group} />
                <span className={styles.main}>
                  <span className={styles.top}>
                    <span className={styles.name}>{title}</span>
                    <span className={styles.when}>
                      {when}
                      <Chevron />
                    </span>
                  </span>
                  <span className={styles.preview}>{preview}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p className={app.empty}>No Results</p>}
      </div>
      {current && (
        <Thread
          threadId={current.thread.id}
          contact={current.thread.contact}
          messages={current.messages}
          state={state}
          moved={current.thread.moved}
          group={current.thread.group}
          nameable={current.thread.nameable}
          composer={ep2 ? "replies" : "low-power"}
          onBack={() => setOpen(null)}
          backLabel="Messages"
        />
      )}
    </section>
  );
}
