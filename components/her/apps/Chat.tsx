"use client";

import { useEffect, useRef, useState } from "react";

import type { Message, ReplyOption, Story, Thread } from "@/content/types";
import { all, seen, type CaseState } from "@/lib/game/engine";
import { stamp } from "@/lib/found/time";
import { received, sent } from "@/lib/found/tones";
import { Chevron } from "../ios/AppBar";
import styles from "../ios/Chats.module.css";
import local from "./Chat.module.css";

/* ===========================================================================
   WhatsApp, as a phone in Mumbai really has it: pinned chats at the top, a
   society group nobody can leave, 3,412 unread good mornings, and one chat
   that is a police station pretending to be a person.

   Drawn on the pilot's WhatsApp (commit 8cc2907): a list with its own bar,
   a large "Chats" title and the tab bar; a conversation with the contact in
   its header. Everything a message can be is here because the story needs
   each one: a document (the warrant), a voice note (hers, the only recording
   of her), a photograph (Sahil), her own handwriting (the real note), a
   message deleted for everyone, a forward.

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
  if (m.text) return m.text;
  switch (m.attachment?.kind) {
    case "voice":
      return `🎤 Voice message (0:${String(m.attachment.seconds).padStart(2, "0")})`;
    case "photo":
    case "handwriting":
      return "📷 Photo";
    case "document":
      return `📄 ${m.attachment.label}`;
    case "video":
      return "🎥 Video";
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

function Bubble({ m }: { m: Message }) {
  if (m.from === "system") return <p className={styles.service}>{m.text}</p>;

  const out = m.from === "her";
  const a = m.attachment;
  const media = a?.kind === "photo" || a?.kind === "handwriting";
  return (
    <div className={styles.bubble} data-out={out || undefined} data-media={media || undefined}>
      {m.forwarded && <span className={styles.forwarded}>Forwarded many times</span>}

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

          {/* A photograph, drawn until the shoot: a soft frame and what it shows. */}
          {a?.kind === "photo" && (
            <span className={local.photo} role="img" aria-label={a.label}>
              <span>{a.label}</span>
            </span>
          )}

          {/* Her own hand on paper: cursive, sentence case, signed. Nothing
              like the block capitals in the pouch, which is the point. */}
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
        {stamp(m.at)}
        {out && !m.deleted && <span className={styles.ticks}>✓✓</span>}
      </span>
    </div>
  );
}

function Conversation({
  thread,
  state,
  app,
  onBack,
  onRead,
  onSay,
}: {
  thread: Thread;
  app: Thread["app"];
  state: CaseState;
  onBack: () => void;
  onRead: (evidenceIds: readonly string[]) => void;
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  const messages = thread.messages.filter((m) => all(state, m.requires));
  /* What is on screen. Everything already there shows at once; what arrives
     while the chat is open is revealed one message at a time. */
  const [shown, setShown] = useState(messages.length);
  const body = useRef<HTMLDivElement>(null);
  const pending = shown < messages.length;
  const nextFromThem = pending && messages[shown]?.from !== "her";

  useEffect(() => {
    if (!pending) return undefined;
    const t = window.setTimeout(() => {
      if (nextFromThem) received();
      setShown((n) => n + 1);
    }, nextFromThem ? TYPING_MS : 250);
    return () => window.clearTimeout(t);
  }, [pending, nextFromThem, shown]);

  // New messages scroll into view, the way a chat does.
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [shown]);

  /* Anything on screen counts as found, including what arrives while the
     player is still sitting in the chat: that is how Shaila's note reaches
     them. Nothing counts before it has been shown. */
  const visible = messages
    .slice(0, shown)
    .map((m) => m.evidence)
    .filter(Boolean)
    .join(",");
  useEffect(() => {
    if (visible) onRead(visible.split(","));
  }, [visible, onRead]);

  const said = (o: ReplyOption) => o.sets?.some((f) => state.flags.includes(f));
  const reply = thread.reply && all(state, thread.reply.requires) && !thread.reply.options.some(said) ? thread.reply : null;

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
            {m.day && m.day !== messages[i - 1]?.day && <p className={styles.day}>{m.day}</p>}
            <Bubble m={m} />
          </div>
        ))}
      </div>

      {reply && !pending ? (
        <div className={styles.replies}>
          {reply.prompt && <p className={styles.replyPrompt}>{reply.prompt}</p>}
          {reply.options.map((o) => (
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
          <span className={styles.field}>It isn&apos;t your phone.</span>
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
  const live = story.threads.filter((t) => t.app === app && all(state, t.requires));

  /* Two entries with the same name are one chat: Episode 2 adds messages to
     Shaila rather than a second Shaila. */
  const threads = live.reduce<Thread[]>((acc, t) => {
    const same = acc.find((x) => x.name === t.name);
    if (!same) return [...acc, t];
    return acc.map((x) =>
      x === same ? { ...x, messages: [...x.messages, ...t.messages], reply: t.reply ?? x.reply } : x,
    );
  }, []);

  const here = threads.find((t) => t.id === open);
  if (here) return <Conversation key={here.id} thread={here} state={state} app={app} onBack={() => setOpen(null)} onRead={onRead} onSay={onSay} />;

  const list = (
    <ul className={styles.list}>
      {[...threads]
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
        .map((t) => {
          const shown = t.messages.filter((m) => all(state, m.requires));
          const last = shown[shown.length - 1];
          const unread = shown.filter((m) => m.evidence && !seen(state, m.evidence)).length;
          return (
            <li key={t.id}>
              <button type="button" className={styles.row} onClick={() => setOpen(t.id)}>
                <Avatar name={t.name} />
                <span className={styles.rowMain}>
                  <span className={styles.rowTop}>
                    <span className={styles.rowName}>{t.name}</span>
                    <span className={styles.rowTime} data-unread={unread > 0 || undefined}>
                      {last?.day && last.day !== "Saturday" ? last.day : stamp(last?.at)}
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
        <h2 className={styles.big}>Chats</h2>
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
