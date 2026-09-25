"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Message, ReplyOption, Story, Thread } from "@/content/types";
import { conversation, offeredOptions, openReply } from "@/lib/game/chat";
import { all, arrivedAt, dateNow, reachable, seen, type CaseState } from "@/lib/game/engine";
import { AIRPLANE, calendarOf } from "@/lib/game/phone";
import { stamp } from "@/lib/found/time";
import { received, sent } from "@/lib/found/tones";
import { TabBar } from "../AppView";
import { Chevron } from "../ios/AppBar";
import Clip from "../ios/Clip";
import styles from "../ios/Chats.module.css";
import local from "./Chat.module.css";

/* ===========================================================================
   WhatsApp, as an Indian phone really has it: pinned chats at the top,
   groups with many senders, unread counts, and whatever the chapter needs.

   Drawn on the pilot's WhatsApp (commit 8cc2907): a list with its own bar,
   a large "Chats" title and the tab bar; a conversation with the contact in
   its header. A message can be a document, a voice note, a photograph, a
   video with its words, somebody's handwriting, a message deleted for
   everyone, a forward, or a reply quoting an earlier one. In a group, each
   message says who sent it.

   Three WhatsApp behaviours a chapter can rest on (CHAPTER1.md E):
   - **Archived**: a chat moved out of the list sits one tap further, under
     "Archived" at the top
   - **one grey tick**: sent and never delivered, which is what a block
     looks like from the other side
   - a message deleted "for me" leaves nothing behind, so a reply to it is
     a reply to a message that isn't there

   Somebody answering takes a moment, and says so ("typing…"): replies are
   revealed one at a time, never all at once (PLAYTEST.md #47).

   English sits under every Hinglish or Marathi line, always, because no plot
   point is allowed to depend on knowing the language.
   =========================================================================== */

/** How long the other side takes to answer, per message. */
const TYPING_MS = 1800;

/** WhatsApp's picture for anyone without one: its grey silhouette, or two for a group. */
function Avatar({ group, head, big }: { group?: boolean; head?: boolean; big?: boolean }) {
  return (
    <span className={styles.avatar} data-size={big ? "big" : head ? "head" : undefined} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {group ? (
          <path d="M9 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Zm7.8.4a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8ZM2 20.5c.4-4 3.3-6.6 7-6.6s6.6 2.6 7 6.6Zm15-6.2c2.7.3 4.6 2.5 5 6.2h-4.3c-.2-2.5-1.2-4.6-2.9-6Z" />
        ) : (
          <path d="M12 12.4a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8ZM3.5 21.5c.5-4.8 4-7.6 8.5-7.6s8 2.8 8.5 7.6Z" />
        )}
      </svg>
    </span>
  );
}

/** A group chat: more than one person on the other side says something in it. */
const isGroup = (t: Thread) => t.messages.some((m) => m.who);

/** WhatsApp's tab bar, as its iOS 26 app floats it. */
const TABS = [
  { label: "Updates", d: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 2a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 3.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Z" },
  {
    label: "Calls",
    d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  },
  {
    label: "Communities",
    d: "M12 5.5a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm-6.6 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm13.2 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM12 13.3c3.4 0 5.7 1.8 6.2 4.8v1.2H5.8v-1.2c.5-3 2.8-4.8 6.2-4.8Zm-7.1 1c-.6 1-.9 2.1-1 3.3v1.2H1.2v-.9c.3-2.2 1.7-3.6 3.7-3.6Zm14.2 0c2 0 3.4 1.4 3.7 3.6v.9h-2.7v-1.2c-.1-1.2-.4-2.3-1-3.3Z",
  },
  { label: "Chats", d: "M4.5 4.5h12a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5H9.5L5 20v-3.5h-.5A2.5 2.5 0 0 1 2 14V7a2.5 2.5 0 0 1 2.5-2.5Z" },
  {
    label: "Settings",
    d: "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm8.6 2.1-2-.4a7 7 0 0 0-.7-1.7l1.1-1.7-2-2-1.7 1.1a7 7 0 0 0-1.7-.7l-.4-2h-2.8l-.4 2a7 7 0 0 0-1.7.7L6.6 4.9l-2 2 1.1 1.7a7 7 0 0 0-.7 1.7l-2 .4v2.8l2 .4c.2.6.4 1.2.7 1.7l-1.1 1.7 2 2 1.7-1.1c.5.3 1.1.5 1.7.7l.4 2h2.8l.4-2c.6-.2 1.2-.4 1.7-.7l1.7 1.1 2-2-1.1-1.7c.3-.5.5-1.1.7-1.7l2-.4Z",
  },
];

/** WhatsApp's little marks in a chat's preview line. */
const MARK = {
  mic: "M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-6.5 8a6.5 6.5 0 0 0 5.7 6.4V20h1.6v-2.6A6.5 6.5 0 0 0 18.5 11h-1.6a4.9 4.9 0 0 1-9.8 0Z",
  photo: "M9 4.5 7.8 6.5H5A2.5 2.5 0 0 0 2.5 9v8.5A2.5 2.5 0 0 0 5 20h14a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 19 6.5h-2.8L15 4.5ZM12 9.5a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z",
  doc: "M6.5 2.5h8l4 4v15h-12Zm7.5 0v4.5h4.5",
  video: "M3 6.5h12a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 16V8A1.5 1.5 0 0 1 3 6.5Zm14 4 5.5-3.5v10L17 13.5Z",
  pin: "M14.5 3.5 20.5 9.5l-2.2.6-3.4 3.4.3 3.9-1.5 1.5-3.8-3.8-4.4 4.4-.9-.9 4.4-4.4-3.8-3.8 1.5-1.5 3.9.3 3.4-3.4Z",
};

function Mark({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className={local.mark} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** What the list says a chat's last message was. */
function preview(m: Message | undefined): React.ReactNode {
  if (!m) return "";
  if (m.deleted) return "This message was deleted";
  if (m.text) return m.who ? `${m.who}: ${m.text}` : m.text;
  switch (m.attachment?.kind) {
    case "voice":
      return (
        <>
          <Mark d={MARK.mic} />
          {mmss(m.attachment.seconds)}
        </>
      );
    case "photo":
    case "handwriting":
      return (
        <>
          <Mark d={MARK.photo} />
          Photo
        </>
      );
    case "document":
      return (
        <>
          <Mark d={MARK.doc} />
          {m.attachment.label}
        </>
      );
    case "video":
      return (
        <>
          <Mark d={MARK.video} />
          Video ({mmss(m.attachment.seconds)})
        </>
      );
    default:
      return "";
  }
}

function Voice({ seconds, transcript, english }: { seconds: number; transcript: string; english?: string }) {
  // No recording yet (ASSETS.md): the play button runs the note's length, and
  // the words are always there underneath.
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    const t = window.setTimeout(() => setPlaying(false), seconds * 1000);
    return () => window.clearTimeout(t);
  }, [playing, seconds]);
  return (
    <span className={styles.voice}>
      <span className={styles.voiceRow}>
        <button
          type="button"
          className={local.voicePlay}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause voice message" : "Play voice message"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={playing ? "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" : "M7 4.5v15l12.5-7.5Z"} />
          </svg>
        </button>
        <span className={local.wave} data-playing={playing || undefined} style={{ ["--len" as string]: `${seconds}s` }} aria-hidden="true">
          {/* The note's own shape: the same bars every time it's drawn. */}
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} style={{ height: `${Math.round(22 + 78 * Math.abs(Math.sin(i * 1.7 + seconds) * Math.cos(i * 0.55)))}%` }} />
          ))}
        </span>
        <span className={styles.voiceTime}>0:{String(seconds).padStart(2, "0")}</span>
      </span>
      <span className={styles.voiceWords}>{transcript}</span>
      {english && <span className={styles.docMeta}>{english}</span>}
    </span>
  );
}

function Bubble({ m, at }: { m: Message; at: string }) {
  if (m.from === "system") return <p className={styles.service}>{m.text}</p>;

  const out = m.from === "owner";
  const a = m.attachment;
  const media = a?.kind === "photo" || a?.kind === "handwriting" || a?.kind === "video";
  const ticks = m.ticks ?? "read";
  return (
    <div className={styles.bubble} data-out={out || undefined} data-media={media || undefined}>
      {!out && m.who && <span className={local.who}>{m.who}</span>}
      {m.forwarded && <span className={styles.forwarded}>Forwarded many times</span>}
      {m.quote && (
        <span className={local.quote}>
          <b>{m.quote.who}</b>
          <span>{m.quote.text}</span>
        </span>
      )}

      {m.deleted ? (
        <span className={styles.text} style={{ opacity: 0.55, fontStyle: "italic" }}>
          🚫 This message was deleted
        </span>
      ) : (
        <>
          {a?.kind === "document" && (
            <span className={styles.doc}>
              <span className={styles.docIcon}>PDF</span>
              <span className={styles.docText}>
                <span className={styles.docName}>{a.label}</span>
                {a.meta && <span className={styles.docMeta}>{a.meta}</span>}
              </span>
            </span>
          )}

          {a?.kind === "voice" && <Voice seconds={a.seconds} transcript={a.transcript} english={a.english} />}

          {/* A photograph: the real one once it exists, and until then a soft frame and what it shows. */}
          {a?.kind === "photo" && (
            <span className={local.photo} role="img" aria-label={a.label}>
              {a.src ? <Image src={a.src} alt={a.label} fill sizes="230px" className={local.image} /> : <span>{a.label}</span>}
            </span>
          )}

          {/* A video: its poster, its length, and its words underneath once it plays. */}
          {a?.kind === "video" && (
            <span className={local.video}>
              <span className={local.photo} role="img" aria-label={a.label}>
                {a.src ? <Image src={a.src} alt={a.label} fill sizes="230px" className={local.image} /> : <span>{a.label}</span>}
                <span className={local.play} aria-hidden="true">
                  ▶
                </span>
              </span>
              {a.captions?.length ? <Clip seconds={a.seconds} captions={a.captions} /> : null}
            </span>
          )}

          {/* Somebody's own hand on paper, photographed and sent. */}
          {a?.kind === "handwriting" && (
            <span className={local.paper} role="img" aria-label={`${a.label}: ${a.lines.join(" ")} ${a.sign ?? ""}`}>
              {a.lines.map((l, i) => (
                <span key={i} className={local.hand}>
                  {l}
                </span>
              ))}
              {a.sign && <span className={local.sign}>{a.sign}</span>}
              {a.blessing && (
                <span className={local.blessing} lang="mr">
                  {a.blessing}
                </span>
              )}
            </span>
          )}

          {m.text && <span className={styles.text}>{m.text}</span>}
          {m.english && <span className={styles.docMeta}>{m.english}</span>}
        </>
      )}

      <span className={styles.stamp}>
        {stamp(at)}
        {out && !m.deleted && (
          <span
            className={styles.ticks}
            data-read={ticks === "read" || undefined}
            aria-label={ticks === "sent" ? "Sent" : ticks === "delivered" ? "Delivered" : "Read"}
          >
            {ticks === "sent" ? "✓" : "✓✓"}
          </span>
        )}
      </span>
    </div>
  );
}

function Conversation({
  story,
  thread,
  state,
  app,
  onBack,
  onRead,
  onSay,
}: {
  story: Story;
  thread: Thread;
  app: Thread["app"];
  state: CaseState;
  onBack: () => void;
  onRead: (evidenceIds: readonly string[]) => void;
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  /* What was said back, once said: the player's line, then whatever comes
     back (the option's `then`), revealed with "typing…" like anything new. */
  const messages: Message[] = conversation(state, thread, dateNow(story, state));
  const cal = calendarOf(story, state);
  // WhatsApp's contact info, opened by tapping the name at the top.
  const [info, setInfo] = useState(false);
  /* What is on screen. Everything already there shows at once; what arrives
     while the chat is open is revealed one message at a time. */
  const [shown, setShown] = useState(messages.length);
  const body = useRef<HTMLDivElement>(null);
  const pending = shown < messages.length;
  const nextFromThem = pending && messages[shown]?.from !== "owner";
  // Some things take someone longer to write.
  const typingMs = (messages[shown]?.typing ?? TYPING_MS / 1000) * 1000;

  useEffect(() => {
    if (!pending) return undefined;
    const t = window.setTimeout(() => {
      if (nextFromThem) received();
      setShown((n) => n + 1);
    }, nextFromThem ? typingMs : 250);
    return () => window.clearTimeout(t);
  }, [pending, nextFromThem, shown, typingMs]);

  // New messages scroll into view, the way a chat does.
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [shown]);

  /* Anything on screen counts as found, including what arrives while the
     player is still sitting in the chat. Nothing counts before it has been
     shown. */
  const visible = messages
    .slice(0, shown)
    .map((m) => m.evidence)
    .filter(Boolean)
    .join(",");
  useEffect(() => {
    if (visible) onRead(visible.split(","));
  }, [visible, onRead]);

  // In airplane mode nothing leaves his phone either. Yours isn't in airplane mode.
  const offline = app !== "yours:chats" && state.flags.includes(AIRPLANE);

  if (info && thread.contact)
    return (
      <section className={styles.chats} data-app={app}>
        <header className={styles.chatBar}>
          <button type="button" className={`${styles.backButton} lg`} onClick={() => setInfo(false)} data-back aria-label={thread.name}>
            <Chevron back />
          </button>
          <span className={styles.chatTitle}>Contact info</span>
          <span />
        </header>
        <div className={local.contact}>
          <Avatar group={isGroup(thread)} big />
          <p className={local.contactName}>{thread.name}</p>
          <p className={local.contactNumber}>{thread.contact.number}</p>
          {thread.contact.about && (
            <p className={local.contactAbout}>
              <span className={local.contactLabel}>About</span>
              {thread.contact.about}
            </p>
          )}
        </div>
      </section>
    );
  const reply = offline ? undefined : openReply(state, thread);

  return (
    <section className={styles.chats} data-app={app} data-wall={app === "whatsapp" || undefined}>
      <header className={styles.chatBar}>
        <button type="button" className={`${styles.backButton} lg`} onClick={onBack} data-back aria-label="Chats">
          <Chevron back />
        </button>
        <button
          type="button"
          className={styles.who}
          aria-label={thread.contact ? `${thread.name}: contact info` : undefined}
          onClick={() => {
            if (!thread.contact) return;
            setInfo(true);
            if (thread.contact.evidence) onRead([thread.contact.evidence]);
          }}
        >
          <Avatar group={isGroup(thread)} head />
          <span className={styles.whoText}>
            <span className={styles.whoName}>{thread.name}</span>
            <span className={styles.whoSub} aria-live="polite">
              {pending && nextFromThem ? "typing…" : (thread.sub ?? thread.number ?? "")}
            </span>
          </span>
        </button>
        {/* Video and voice call, in one capsule of glass, as WhatsApp's header has them. */}
        <span className={`${styles.calls} lg`} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="2.5" y="6.5" width="13" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16.5 10.5 5-3v9l-5-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <svg viewBox="0 0 24 24">
            <path
              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </header>

      <div ref={body} className={styles.messages}>
        {messages.slice(0, shown).map((m, i) => (
          <div key={m.id}>
            {m.day && cal.dayOf(m.day) !== cal.dayOf(messages[i - 1]?.day ?? "01/01") && <p className={styles.day}>{cal.label(m.day)}</p>}
            <Bubble m={m} at={arrivedAt(story, state, m)} />
          </div>
        ))}
      </div>

      {reply && !pending ? (
        <div className={styles.replies}>
          {reply.prompt && <p className={styles.replyPrompt}>{reply.prompt}</p>}
          {offeredOptions(state, reply).map((o) => (
            <button
              key={o.id}
              type="button"
              className={styles.replyOption}
              onClick={() => {
                sent();
                onSay?.(o, reply.id);
              }}
            >
              <span lang={o.english ? "hi-Latn" : undefined}>{o.text}</span>
              {o.english && <span className={styles.docMeta}>{o.english}</span>}
            </button>
          ))}
        </div>
      ) : (
        <footer className={styles.composer}>
          <svg viewBox="0 0 24 24" className={styles.composerIcon} aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className={styles.field}>
            {app === "yours:chats" ? "iMessage" : offline && openReply(state, thread) ? "Airplane Mode is on." : "It isn't your phone."}
            <svg viewBox="0 0 24 24" className={styles.sticker} aria-hidden="true">
              <path d="M19.5 13.5V7a2.5 2.5 0 0 0-2.5-2.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h6.5Zm0 0-6 6c0-3.3 2.7-6 6-6Z" />
            </svg>
          </span>
          <svg viewBox="0 0 24 24" className={styles.composerIcon} aria-hidden="true">
            <path d="M9 4.5 7.8 6.5H5A2.5 2.5 0 0 0 2.5 9v8.5A2.5 2.5 0 0 0 5 20h14a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 19 6.5h-2.8L15 4.5ZM12 9.5a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
          </svg>
          <svg viewBox="0 0 24 24" className={styles.composerIcon} aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
          </svg>
        </footer>
      )}
    </section>
  );
}

export default function Chat({
  story,
  state,
  app,
  onHome,
  chrome = true,
  onRead,
  onSay,
}: {
  story: Story;
  state: CaseState;
  app: Thread["app"];
  onHome?: () => void;
  /** WhatsApp draws its own bar, title and tabs; Instagram's DMs sit inside Instagram. */
  chrome?: boolean;
  /** Opening a chat is how what's in it gets found. */
  onRead: (evidenceIds: readonly string[]) => void;
  /** The player, saying something on somebody else's phone. */
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [archive, setArchive] = useState(false);
  const live = story.threads.filter((t) => t.app === app && all(state, t.requires));

  /* Two entries with the same name are one chat: a later episode adds
     messages to a thread rather than opening a second one. */
  const threads = live.reduce<Thread[]>((acc, t) => {
    const same = acc.find((x) => x.name === t.name);
    if (!same) return [...acc, t];
    return acc.map((x) =>
      x === same ? { ...x, messages: [...x.messages, ...t.messages], replies: [...(x.replies ?? []), ...(t.replies ?? [])] } : x,
    );
  }, []);

  const here = threads.find((t) => t.id === open);
  if (here) return <Conversation key={here.id} story={story} thread={here} state={state} app={app} onBack={() => setOpen(null)} onRead={onRead} onSay={onSay} />;

  const archived = threads.filter((t) => t.archived);
  const today = dateNow(story, state);
  const cal = calendarOf(story, state);
  const inList = archive ? archived : threads.filter((t) => !t.archived);

  const list = (
    <ul className={styles.list}>
      {!archive && archived.length > 0 && (
        <li>
          <button type="button" className={local.archivedRow} onClick={() => setArchive(true)}>
            <svg viewBox="0 0 24 24" className={local.archivedIcon} aria-hidden="true">
              <path d="M3.5 5.5h17v4h-17ZM5 9.5v9a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18.5v-9M9.5 13.5h5" />
            </svg>
            <span className={local.archivedLabel}>Archived</span>
            <span className={local.archivedCount}>{archived.length}</span>
          </button>
        </li>
      )}
      {[...inList]
        // Pinned first, then newest first, as WhatsApp keeps its list.
        .sort((a, b) => {
          if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
          const last = (t: Thread) => conversation(state, t, today).at(-1);
          const la = last(a);
          const lb = last(b);
          return cal.when(lb?.day, lb && arrivedAt(story, state, lb)) - cal.when(la?.day, la && arrivedAt(story, state, la));
        })
        .map((t) => {
          const shown = conversation(state, t, today);
          const last = shown[shown.length - 1];
          // Only what can count now: a later episode's find doesn't sit there as a badge nobody can clear.
          const unread = shown.filter((m) => {
            const e = m.evidence ? story.evidence.find((x) => x.id === m.evidence) : undefined;
            return e && reachable(state, e) && !seen(state, e.id);
          }).length;
          return (
            <li key={t.id}>
              <button type="button" className={styles.row} onClick={() => setOpen(t.id)}>
                <Avatar group={isGroup(t)} />
                <span className={styles.rowMain}>
                  <span className={styles.rowTop}>
                    <span className={styles.rowName}>{t.name}</span>
                    <span className={styles.rowTime} data-unread={unread > 0 || undefined}>
                      {cal.isToday(last?.day) ? stamp(last && arrivedAt(story, state, last)) : cal.label(last?.day)}
                    </span>
                  </span>
                  <span className={styles.rowBottom}>
                    <span className={styles.rowPreview}>
                      {preview(last)}
                    </span>
                    {unread > 0 ? (
                      <span className={styles.unread}>{unread}</span>
                    ) : (
                      t.pinned && (
                        <svg viewBox="0 0 24 24" className={styles.pin} role="img" aria-label="Pinned">
                          <path d={MARK.pin} />
                        </svg>
                      )
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
    </ul>
  );

  if (!chrome) return list;

  // Everything waiting, across every chat: the Chats tab carries the count.
  const waiting = threads
    .filter((t) => !t.archived)
    .reduce(
      (n, t) =>
        n +
        conversation(state, t, today).filter((m) => {
          const e = m.evidence ? story.evidence.find((x) => x.id === m.evidence) : undefined;
          return e && reachable(state, e) && !seen(state, e.id);
        }).length,
      0,
    );

  return (
    <section className={styles.chats} data-app="whatsapp">
      <header className={styles.listBar}>
        {archive ? (
          <button type="button" className={`${styles.backButton} lg`} onClick={() => setArchive(false)} data-back aria-label="Chats">
            <Chevron back />
          </button>
        ) : (
          <button type="button" className={`${styles.backButton} lg`} onClick={onHome} data-back aria-label="Home">
            <Chevron back />
          </button>
        )}
        {!archive && (
          <span className={styles.listActions} aria-hidden="true">
            <span className={`${styles.backButton} lg`}>
              <svg viewBox="0 0 24 24" className={styles.barGlyph}>
                <path d="M9 4.5 7.8 6.5H5A2.5 2.5 0 0 0 2.5 9v8.5A2.5 2.5 0 0 0 5 20h14a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 19 6.5h-2.8L15 4.5ZM12 9.5a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" />
              </svg>
            </span>
            <span className={styles.newChat}>
              <svg viewBox="0 0 24 24">
                <path d="M12 5.5v13M5.5 12h13" />
              </svg>
            </span>
          </span>
        )}
      </header>
      <div className={styles.listBody}>
        {archive ? (
          <>
            <h2 className={styles.big}>Archived</h2>
            <p className={local.archivedNote}>These chats stay archived when new messages are received.</p>
          </>
        ) : (
          <>
            <h2 className={styles.big}>Chats</h2>
            <div className={styles.search} aria-hidden="true">
              <span className={styles.metaAi} />
              Ask Meta AI or Search
            </div>
            <div className={styles.chips} aria-hidden="true">
              {["All", "Unread", "Favourites", "Groups"].map((c, i) => (
                <span key={c} data-on={i === 0 || undefined}>
                  {c}
                </span>
              ))}
              <span>+</span>
            </div>
          </>
        )}
        {list}
      </div>
      <TabBar tabs={TABS.map((tab) => ({ ...tab, on: tab.label === "Chats", badge: tab.label === "Chats" ? waiting : undefined }))} tint="#25d366" />
    </section>
  );
}
