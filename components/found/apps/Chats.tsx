"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Attachment, Message, Thread } from "@/content/found/types";
import { refuse } from "@/lib/found/buzz";
import { all, dayNow, has, threadMessages, type CaseState } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import { Chevron } from "./AppBar";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import VoiceNote from "./VoiceNote";
import type { AppProps } from "./types";
import styles from "./Chats.module.css";

type ChatApp = "whatsapp" | "telegram";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/** "Fri 22:29" as a number that sorts, within the story's week. */
function order(at: string): number {
  const [day, time = "00:00"] = at.split(" ");
  const [h, m] = time.split(":").map(Number);
  return Math.max(0, WEEK.indexOf(day)) * 1440 + (h || 0) * 60 + (m || 0);
}

/** What the chat calls a day: "Today" for the story's present, "Yesterday" before it, the weekday otherwise. */
function dayLabel(at: string, today: string): string {
  const day = at.split(" ")[0];
  const t = WEEK.indexOf(today.slice(0, 3));
  const d = WEEK.indexOf(day);
  if (d === t) return "Today";
  if (d === (t + 6) % 7) return "Yesterday";
  return FULL[day] ?? day;
}

const timeOf = (at: string) => at.split(" ")[1] ?? "";

/** A chat list's time column: the time for today, "Yesterday", or the weekday. */
function listTime(at: string, today: string): string {
  const label = dayLabel(at, today);
  return label === "Today" ? timeOf(at) : label;
}

/** A pending message only shows its placeholder until its moment. */
const pending = (s: CaseState, m: Message) => !!m.pendingUntil && !has(s, m.pendingUntil);

/** The line a chat list shows for a message. */
function preview(s: CaseState, m: Message): string {
  if (pending(s, m)) return "Waiting for this message";
  if (m.deleted) return "This message was deleted";
  const a = m.attachment;
  if (a?.kind === "voice") return `Voice message (0:${String(a.seconds).padStart(2, "0")})`;
  if (a?.kind === "document") return a.name;
  if (a?.kind === "video") return m.text || "Video";
  if (a?.kind === "live-location") return "Live location";
  if (m.photo && !m.text) return "Photo";
  return m.text;
}

function initials(name: string): string {
  const letters = name.replace(/[^\p{L}\p{N} ]/gu, "").trim();
  if (!letters || /^\d/.test(letters)) return "";
  return letters
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Avatar({
  name,
  group = false,
  blank = false,
  size = "row",
}: {
  name: string;
  group?: boolean;
  blank?: boolean;
  size?: "row" | "head" | "big";
}) {
  const text = blank ? "" : initials(name);
  return (
    <span className={styles.avatar} data-size={size} aria-hidden="true">
      {group ? (
        <svg viewBox="0 0 24 24">
          <circle cx="9" cy="9" r="3.4" />
          <circle cx="16.5" cy="10" r="2.7" />
          <path d="M3 19c.6-3.3 3-5.2 6-5.2s5.4 1.9 6 5.2M14.4 14.3c3 .1 5.3 1.7 6 4.7" />
        </svg>
      ) : text ? (
        text
      ) : (
        // An unsaved number or a blank profile: the empty silhouette.
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="9" r="4" />
          <path d="M4.5 20.5c1-4 3.9-6.2 7.5-6.2s6.5 2.2 7.5 6.2" />
        </svg>
      )}
    </span>
  );
}

/** Ticks on a sent message: one grey, two grey, two blue. */
function Ticks({ ticks = "read" }: { ticks?: Message["ticks"] }) {
  return (
    <svg viewBox="0 0 18 11" className={styles.ticks} data-read={ticks === "read" || undefined} aria-label={ticks}>
      <path d="m1 6 3.2 3.2L11 2.4" />
      {ticks !== "sent" && <path d="m7.4 8.6.6.6L14.8 2.4" />}
    </svg>
  );
}

/**
 * WhatsApp or Telegram, as a phone in Mumbai has them: a chat list, a
 * conversation, and the contact's info page. One component, two looks
 * (`data-app` in the CSS): WhatsApp's green and ticks, Telegram's blue.
 *
 * Nothing here can be sent. It isn't the player's phone to write from, and
 * The Blue Room never asks them to until its last ending. The composer is
 * there because a chat has one, and it refuses.
 *
 * Opening a chat is looking at it: evidence in its messages goes into the case
 * file. A message still downloading ("Waiting for this message") isn't
 * evidence until it arrives. Opening a chat's info is looking at that.
 */
export default function Chats({
  state,
  nav,
  arg,
  app,
  unread,
  onRead,
}: AppProps & { app: ChatApp; unread: ReadonlySet<string>; onRead: (thread: string) => void }) {
  const ep = useStory();
  const today = dayNow(state, ep.clocks);
  const threads = ep.threads.filter((t) => t.app === app && all(state, t.requires));
  const [open, setOpen] = useState<string | null>(arg && threads.some((t) => t.id === arg) ? arg : null);
  const thread = threads.find((t) => t.id === open);

  const rows = threads
    .map((t) => {
      const messages = threadMessages(ep, state, t.id);
      return { t, last: messages.at(-1) };
    })
    .sort((a, b) => Number(!!b.t.pinned) - Number(!!a.t.pinned) || order(b.last?.at ?? "") - order(a.last?.at ?? ""));

  if (thread) {
    return <Conversation key={thread.id} app={app} thread={thread} state={state} nav={nav} today={today} onBack={() => setOpen(null)} onRead={onRead} />;
  }

  return (
    <section className={styles.chats} data-app={app}>
      <header className={styles.listBar}>
        <span className={styles.edit}>Edit</span>
        <span />
      </header>
      <div className={styles.listBody}>
        <h2 className={styles.big}>Chats</h2>
        <ul className={styles.list}>
          {rows.map(({ t, last }) => (
            <li key={t.id}>
              <button
                type="button"
                className={styles.row}
                onClick={() => {
                  setOpen(t.id);
                  onRead(t.id);
                }}
              >
                <Avatar name={t.contact} group={t.group} blank={t.noPhoto} />
                <span className={styles.rowMain}>
                  <span className={styles.rowTop}>
                    <span className={styles.rowName}>{state.names[t.id] ?? t.contact}</span>
                    <span className={styles.rowTime} data-unread={unread.has(t.id) || undefined}>
                      {last ? listTime(last.at, today) : ""}
                    </span>
                  </span>
                  <span className={styles.rowBottom}>
                    <span className={styles.rowPreview}>
                      {last?.from === "owner" && app === "whatsapp" && <Ticks ticks={last.ticks} />}
                      {last?.sender && `${last.sender}: `}
                      {last ? preview(state, last) : ""}
                    </span>
                    {unread.has(t.id) ? (
                      <span className={styles.unread}>1</span>
                    ) : t.pinned ? (
                      <svg viewBox="0 0 16 16" className={styles.pin} aria-label="Pinned">
                        <path d="M10.2 1.8 14.2 5.8 12.6 6.5 10.4 8.7 10.6 11.6 9.5 12.7 7 10.2 3.4 13.8 2.2 13.8 2.2 12.6 5.8 9 3.3 6.5 4.4 5.4 7.3 5.6 9.5 3.4Z" />
                      </svg>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <nav className={styles.tabs} aria-hidden="true">
        {(app === "whatsapp" ? ["Updates", "Calls", "Communities", "Chats", "Settings"] : ["Contacts", "Calls", "Chats", "Settings"]).map((tab) => (
          <span key={tab} data-on={tab === "Chats" || undefined}>
            {tab}
          </span>
        ))}
      </nav>
    </section>
  );
}

function Conversation({
  app,
  thread,
  state,
  nav,
  today,
  onBack,
  onRead,
}: {
  app: ChatApp;
  thread: Thread;
  state: CaseState;
  nav: AppProps["nav"];
  today: string;
  onBack: () => void;
  onRead: (thread: string) => void;
}) {
  const ep = useStory();
  const messages = threadMessages(ep, state, thread.id);
  const [info, setInfo] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const name = state.names[thread.id] ?? thread.contact;
  const count = messages.length;

  // Everything on screen is seen, including what arrives while it's open.
  useEffect(() => {
    play.seeAll(messages.filter((m) => !pending(state, m)).map((m) => m.evidence));
    onRead(thread.id);
    body.current?.scrollTo({ top: body.current.scrollHeight });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, thread.id, onRead]);

  useEffect(() => {
    if (info) play.see(thread.infoEvidence);
  }, [info, thread.infoEvidence]);

  if (info) {
    return (
      <section className={styles.chats} data-app={app}>
        <header className={styles.chatBar}>
          <button type="button" className={styles.backButton} onClick={() => setInfo(false)} data-back aria-label="Back">
            <Chevron back />
          </button>
          <span className={styles.chatTitle}>{app === "whatsapp" ? "Contact info" : "Info"}</span>
          <span />
        </header>
        <div className={styles.info}>
          <Avatar name={thread.contact} group={thread.group} blank={thread.noPhoto} size="big" />
          <p className={styles.infoName}>{name}</p>
          {thread.username && <p className={styles.infoSub}>{thread.username}</p>}
          <p className={styles.infoSub}>{thread.lastSeen}</p>
          <ul className={styles.infoList}>
            {thread.number && (
              <li>
                <span className={styles.infoLabel}>mobile</span>
                <span className={styles.infoValue}>{thread.number}</span>
              </li>
            )}
            {thread.username && (
              <li>
                <span className={styles.infoLabel}>username</span>
                <span className={styles.infoValue}>{thread.username}</span>
              </li>
            )}
            {thread.about !== undefined && (
              <li>
                <span className={styles.infoLabel}>{app === "whatsapp" ? "about" : "bio"}</span>
                <span className={styles.infoValue} data-empty={!thread.about || undefined}>
                  {thread.about || "No bio"}
                </span>
              </li>
            )}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.chats} data-app={app} data-wall>
      <header className={styles.chatBar}>
        <button type="button" className={styles.backButton} onClick={onBack} data-back aria-label="Chats">
          <Chevron back />
        </button>
        <button type="button" className={styles.who} onClick={() => setInfo(true)}>
          <Avatar name={thread.contact} group={thread.group} blank={thread.noPhoto} size="head" />
          <span className={styles.whoText}>
            <span className={styles.whoName}>{name}</span>
            {thread.lastSeen && <span className={styles.whoSub}>{thread.lastSeen}</span>}
          </span>
        </button>
        <span />
      </header>

      <div ref={body} className={styles.messages}>
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const newDay = !prev || dayLabel(prev.at, today) !== dayLabel(m.at, today);
          return (
            <Fragment key={`${m.at}:${i}`}>
              {newDay && <p className={styles.day}>{dayLabel(m.at, today)}</p>}
              <Bubble m={m} state={state} app={app} group={!!thread.group} onPhoto={setViewing} onFile={(file) => nav.go("files", file)} />
            </Fragment>
          );
        })}
      </div>

      <footer className={styles.composer}>
        <button type="button" className={styles.field} onClick={() => refuse()}>
          Message
        </button>
      </footer>

      {viewing && <PhotoViewer id={viewing} cast={state.cast} onClose={() => setViewing(null)} />}
    </section>
  );
}

function Bubble({
  m,
  state,
  app,
  group,
  onPhoto,
  onFile,
}: {
  m: Message;
  state: CaseState;
  app: ChatApp;
  group: boolean;
  onPhoto: (id: string) => void;
  onFile: (file: string) => void;
}) {
  if (m.from === "system") return <p className={styles.service}>{m.text}</p>;
  const out = m.from === "owner";
  const time = timeOf(m.at);
  const stamp = (
    <span className={styles.stamp}>
      {time}
      {out && app === "whatsapp" && <Ticks ticks={m.ticks} />}
    </span>
  );

  if (pending(state, m)) {
    return (
      <div className={styles.bubble} data-out={out || undefined} data-quiet>
        <span className={styles.waiting}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.2" />
            <path d="M8 4.6V8l2.2 1.4" />
          </svg>
          Waiting for this message. This may take a while.
        </span>
        {stamp}
      </div>
    );
  }
  if (m.deleted) {
    return (
      <div className={styles.bubble} data-out={out || undefined} data-quiet>
        <span className={styles.waiting}>This message was deleted</span>
        {stamp}
      </div>
    );
  }

  const a = m.attachment;
  return (
    <div className={styles.bubble} data-out={out || undefined} data-media={(a?.kind === "video" || (m.photo && !m.text)) || undefined}>
      {group && !out && m.sender && <span className={styles.sender}>{m.sender}</span>}
      {m.forwarded && <span className={styles.forwarded}>Forwarded</span>}
      {m.photo && (
        <button type="button" className={styles.media} onClick={() => onPhoto(m.photo!)}>
          <PhotoFrame id={m.photo} cast={state.cast} size="bubble" />
        </button>
      )}
      {a && <AttachmentView a={a} state={state} onPhoto={onPhoto} onFile={onFile} />}
      {m.text && <span className={styles.text}>{m.text}</span>}
      {stamp}
    </div>
  );
}

function AttachmentView({
  a,
  state,
  onPhoto,
  onFile,
}: {
  a: Attachment;
  state: CaseState;
  onPhoto: (id: string) => void;
  onFile: (file: string) => void;
}) {
  const ep = useStory();
  const [confirm, setConfirm] = useState(false);
  switch (a.kind) {
    case "voice":
      return <VoiceNote seconds={a.seconds} transcript={a.transcript} />;
    case "document": {
      const ext = a.name.split(".").pop()?.toUpperCase() ?? "";
      return (
        <button type="button" className={styles.doc} onClick={() => onFile(a.file)}>
          <span className={styles.docIcon} data-ext={ext}>
            {ext}
          </span>
          <span className={styles.docText}>
            <span className={styles.docName}>{a.name}</span>
            <span className={styles.docMeta}>
              {a.size} · {ext}
            </span>
          </span>
        </button>
      );
    }
    case "video":
      return (
        <button type="button" className={styles.media} onClick={() => onPhoto(a.photo)}>
          <PhotoFrame id={a.photo} cast={state.cast} size="bubble" />
          <span className={styles.play} aria-label="Play video">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5Z" />
            </svg>
          </span>
          <span className={styles.duration}>0:{String(a.seconds).padStart(2, "0")}</span>
        </button>
      );
    case "live-location": {
      const sets = ep.actions.find((x) => x.id === a.stops)?.sets;
      const stopped = !!sets && has(state, sets);
      return (
        <span className={styles.live}>
          <span className={styles.liveMap} aria-hidden="true">
            <span className={styles.livePin} data-on={!stopped || undefined} />
          </span>
          <span className={styles.liveText}>
            <b>{stopped ? "Live location ended" : "Live Location"}</b>
            <span>{stopped ? "You stopped sharing" : `${a.place} · until ${a.until}`}</span>
          </span>
          {!stopped &&
            (confirm ? (
              <button type="button" className={styles.stop} data-confirm onClick={() => play.perform(a.stops)}>
                Stop sharing now?
              </button>
            ) : (
              <button type="button" className={styles.stop} onClick={() => setConfirm(true)}>
                Stop Sharing
              </button>
            ))}
        </span>
      );
    }
  }
}
