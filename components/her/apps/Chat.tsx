"use client";

import { useState } from "react";

import type { Message, Story, Thread } from "@/content/types";
import { all, seen, type CaseState } from "@/lib/game/engine";
import styles from "../ios/Chats.module.css";

/* ===========================================================================
   WhatsApp, as a phone in Mumbai really has it: pinned chats at the top, a
   society group nobody can leave, 3,412 unread good mornings, and one chat
   that is a police station pretending to be a person.

   Everything a message can be is here because the story needs each one: a
   document (the warrant), a voice note (hers, the only recording of her), a
   message deleted for everyone (the photo she sent Shaila), a forward.

   English sits under every Hinglish or Marathi line, always, because no plot
   point is allowed to depend on knowing the language.
   =========================================================================== */

const initials = (name: string) =>
  name
    .replace(/[^\p{L}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

function Bubble({ m }: { m: Message }) {
  if (m.from === "system")
    return (
      <p className={styles.service}>
        {m.text}
      </p>
    );

  const out = m.from === "her";
  return (
    <div className={styles.bubble} data-out={out || undefined} data-media={m.attachment?.kind === "photo" || undefined}>
      {m.forwarded && <span className={styles.forwarded}>Forwarded many times</span>}

      {m.deleted ? (
        <span className={styles.text} style={{ opacity: 0.55, fontStyle: "italic" }}>
          🚫 This message was deleted
        </span>
      ) : (
        <>
          {m.attachment?.kind === "document" && (
            <span className={styles.doc}>
              <span className={styles.docIcon}>PDF</span>
              <span className={styles.docText}>
                <span className={styles.docName}>{m.attachment.label}</span>
                {m.attachment.meta && <span className={styles.docMeta}>{m.attachment.meta}</span>}
              </span>
            </span>
          )}

          {m.attachment?.kind === "voice" && (
            <span className={styles.voice}>
              <span className={styles.voiceRow}>
                <span className={styles.voicePlay} aria-hidden="true">
                  ▶
                </span>
                <span className={styles.wave} aria-hidden="true" />
                <span className={styles.voiceTime}>0:{String(m.attachment.seconds).padStart(2, "0")}</span>
              </span>
              <span className={styles.voiceWords}>{m.attachment.transcript}</span>
              {m.attachment.english && <span className={styles.docMeta}>{m.attachment.english}</span>}
            </span>
          )}

          {m.text && <span className={styles.text}>{m.text}</span>}
          {m.english && <span className={styles.docMeta}>{m.english}</span>}
        </>
      )}

      <span className={styles.stamp}>
        {m.at}
        {out && !m.deleted && <span className={styles.ticks}>✓✓</span>}
      </span>
    </div>
  );
}

export default function Chat({
  story,
  state,
  app,
  onRead,
}: {
  story: Story;
  state: CaseState;
  app: Thread["app"];
  /** Opening a chat is how what's in it gets found. */
  onRead: (evidenceIds: readonly string[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const threads = story.threads.filter((t) => t.app === app && all(state, t.requires));
  const here = threads.find((t) => t.id === open);

  if (here)
    return (
      <div className={styles.chats}>
        <div className={styles.chatBar}>
          <button type="button" className={styles.backButton} onClick={() => setOpen(null)}>
            ‹ Chats
          </button>
          <span className={styles.avatar} data-size="head">
            {initials(here.name)}
          </span>
          <span className={styles.chatTitle}>{here.name}</span>
          {here.number && <span className={styles.rowTime}>{here.number}</span>}
        </div>

        <div className={styles.messages}>
          {here.messages.map((m, i) => (
            <div key={m.id}>
              {m.day && m.day !== here.messages[i - 1]?.day && <p className={styles.day}>{m.day}</p>}
              <Bubble m={m} />
            </div>
          ))}
        </div>

        <div className={styles.composer}>
          <span className={styles.field}>It isn&apos;t your phone.</span>
        </div>
      </div>
    );

  return (
    <div className={styles.chats}>
      <div className={styles.list}>
        {[...threads].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))).map((t) => {
          const last = t.messages[t.messages.length - 1];
          const unread = t.messages.filter((m) => m.evidence && !seen(state, m.evidence)).length;
          return (
            <button
              key={t.id}
              type="button"
              className={styles.row}
              onClick={() => {
                setOpen(t.id);
                onRead(t.messages.map((m) => m.evidence).filter((x): x is string => Boolean(x)));
              }}
            >
              <span className={styles.avatar}>{initials(t.name)}</span>
              <span className={styles.rowMain}>
                <span className={styles.rowTop}>
                  <span className={styles.rowName}>{t.name}</span>
                  <span className={styles.rowTime}>{last?.at}</span>
                </span>
                <span className={styles.rowBottom}>
                  <span className={styles.rowPreview}>
                    {t.sub ?? (last?.deleted ? "This message was deleted" : last?.text ?? last?.attachment?.kind)}
                  </span>
                  {t.pinned && <span className={styles.pin}>📌</span>}
                  {unread > 0 && <span className={styles.unread}>{unread}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
