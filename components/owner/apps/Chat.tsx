"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Message, ReplyOption, Story, Thread } from "@/content/types";
import { conversation, offeredOptions, openReply } from "@/lib/game/chat";
import { all, arrivedAt, dateNow, reachable, seen, type CaseState } from "@/lib/game/engine";
import { AIRPLANE, calendarOf } from "@/lib/game/phone";
import { stamp } from "@/lib/found/time";
import { received, sent } from "@/lib/found/tones";
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

const initials = (name: string) =>
  name
    .replace(/[^\p{L}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

function Avatar({ name, head }: { name: string; head?: boolean }) {
  return (
    <span className={styles.avatar} data-size={head ? "head" : undefined} aria-hidden="true">
      {initials(name) || "?"}
    </span>
  );
}

/** What the list says a chat's last message was. */
function preview(m: Message | undefined): string {
  if (!m) return "";
  if (m.deleted) return "This message was deleted";
  if (m.text) return m.who ? `${m.who}: ${m.text}` : m.text;
  switch (m.attachment?.kind) {
    case "voice":
      return `🎤 Voice message (0:${String(m.attachment.seconds).padStart(2, "0")})`;
    case "photo":
    case "handwriting":
      return "📷 Photo";
    case "document":
      return `📄 ${m.attachment.label}`;
    case "video":
      return `🎥 Video (${Math.floor(m.attachment.seconds / 60)}:${String(m.attachment.seconds % 60).padStart(2, "0")})`;
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
          {playing ? "❚❚" : "▶"}
        </button>
        <span className={local.wave} data-playing={playing || undefined} style={{ ["--len" as string]: `${seconds}s` }} aria-hidden="true" />
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

  // In airplane mode nothing leaves the phone either.
  const offline = state.flags.includes(AIRPLANE);
  const reply = offline ? undefined : openReply(state, thread);

  return (
    <section className={styles.chats} data-app={app} data-wall={app === "whatsapp" || undefined}>
      <header className={styles.chatBar}>
        <button type="button" className={styles.backButton} onClick={onBack} data-back aria-label="Chats">
          <Chevron back />
        </button>
        <span className={styles.who}>
          <Avatar name={thread.name} head />
          <span className={styles.whoText}>
            <span className={styles.whoName}>{thread.name}</span>
            <span className={styles.whoSub} aria-live="polite">
              {pending && nextFromThem ? "typing…" : (thread.sub ?? thread.number ?? "")}
            </span>
          </span>
        </span>
        <span />
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
          <span className={styles.field}>{offline && openReply(state, thread) ? "Airplane Mode is on." : "It isn't your phone."}</span>
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
  /** The player, saying something on a dead woman's phone. */
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
            <span className={local.archivedIcon} aria-hidden="true">
              ▤
            </span>
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
                <Avatar name={t.name} />
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
                        <span className={styles.pin} aria-label="Pinned">
                          📌
                        </span>
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

  return (
    <section className={styles.chats} data-app="whatsapp">
      <header className={styles.listBar}>
        <button type="button" className={styles.backButton} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span />
      </header>
      <div className={styles.listBody}>
        {archive ? (
          <>
            <button type="button" className={local.archivedBack} onClick={() => setArchive(false)} data-back>
              ‹ Chats
            </button>
            <h2 className={styles.big}>Archived</h2>
            <p className={local.archivedNote}>These chats stay archived when new messages are received.</p>
          </>
        ) : (
          <h2 className={styles.big}>Chats</h2>
        )}
        {list}
      </div>
      <nav className={styles.tabs} aria-hidden="true">
        {["Updates", "Calls", "Communities", "Chats", "Settings"].map((tab) => (
          <span key={tab} data-on={tab === "Chats" || undefined}>
            {tab}
          </span>
        ))}
      </nav>
    </section>
  );
}
