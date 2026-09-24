"use client";

import { useEffect, useState } from "react";

import Chat from "@/components/owner/apps/Chat";
import { AppGlyph } from "@/components/owner/ios/icons";
import tile from "@/components/owner/ios/icons.module.css";
import type { Act, Story } from "@/content/types";
import { all, type CaseState, type RecordChoice } from "@/lib/game/engine";
import { actFlags, recordRows, setRow } from "@/lib/game/record";
import { hasRecord, READ_KEY, SAW_RECORD, yourMessages, yourThreads } from "@/lib/game/yours";
import { readProgress } from "@/lib/found/progress";
import { flag, read, save, say } from "@/components/stage/playthrough";
import styles from "./Sheet.module.css";

/* ===========================================================================
   Your phone, picked up (CHAPTER1.md I).

   Where the chapter ends, by the player's hand: the record, link by link,
   with what goes in and how; then send it, post it, or give his phone back
   to the courier as not yours. Also your messages (Meera, once she can be reached) and
   the draft post, which is the record as the world would read it.

   No signalling (PLAYER-JOURNEY Stage 8): one row style, the chain's own
   order, flat copy, and the acts drawn alike. Nothing says which is right.
   Loaded only when it's first opened, because most of a play never needs it.
   =========================================================================== */

type View = "home" | "messages" | "draft" | "record" | "parcel";

const AS: Record<RecordChoice, string> = { in: "In", out: "Leave out", says: "As he says", fact: "As fact" };

/* Your own apps, drawn like his: the same tile and edge light, so both
   phones read as phones. Messages is the one app they have in common. */
const TILES = {
  social: "linear-gradient(160deg, #9a87ff 0%, #5a3fd6 100%)",
  record: "linear-gradient(180deg, #f8f4ec 0%, #dcd3c2 100%)",
  parcel: "linear-gradient(170deg, #c29466 0%, #8a6035 100%)",
} as const;

function Icon({ app }: { app: "messages" | keyof typeof TILES }) {
  if (app === "messages")
    return (
      <span className={styles.icon} aria-hidden="true">
        <AppGlyph app="yours:chats" />
      </span>
    );
  return (
    <span className={styles.icon} aria-hidden="true">
      <span className={tile.tile} style={{ background: TILES[app] }}>
        <svg viewBox="0 0 24 24" className={tile.glyph}>
          {app === "social" && (
            <path d="M3.5 12.5h4l2-5.5 4 11 2.2-5.5h4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {app === "record" && <path d="M6.5 7h11M6.5 10.5h11M6.5 14h11M6.5 17.5h6" stroke="#3a3530" strokeWidth="1.5" strokeLinecap="round" />}
          {app === "parcel" && (
            <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M4.5 8.5 12 5l7.5 3.5V16L12 19.5 4.5 16Z" />
              <path d="M4.5 8.5 12 12l7.5-3.5M12 12v7.5M8.2 6.8l7.5 3.5" />
            </g>
          )}
        </svg>
      </span>
    </span>
  );
}

export default function Sheet({ story, state, time, onClose }: { story: Story; state: CaseState; time: string; onClose: () => void }) {
  const [view, setView] = useState<View>("home");
  const [confirm, setConfirm] = useState<Act | null>(null);
  const record = hasRecord(story, state);
  const canSend = all(state, story.yours.sendRequires);
  const threads = yourThreads(story, state);
  const count = yourMessages(story, state);

  // Looking at your messages is reading them.
  useEffect(() => {
    if (view !== "messages") return;
    const s = readProgress();
    if (s && (s.at[READ_KEY] ?? 0) < count) save({ ...s, at: { ...s.at, [READ_KEY]: count } });
  }, [view, count]);

  // The draft or the record, once seen, stops lighting your phone's edge.
  useEffect(() => {
    if ((view === "record" || view === "draft") && !state.flags.includes(SAW_RECORD)) flag(SAW_RECORD);
  }, [view, state.flags]);

  const act = (a: Act) => {
    const s = readProgress();
    if (s) flag(...actFlags(story, s, a));
  };

  const rows = recordRows(story, state);
  const post = [story.yours.intro, ...rows.map((r) => r.line).filter((l): l is string => Boolean(l))];

  const ASK: Record<Act, { q: string; yes: string }> = {
    send: { q: `Send the record to ${story.yours.sendTo}, with his phone? You can't take it back.`, yes: "Send" },
    post: { q: `Post it on ${story.yours.social}? Anyone can see it. You can't take it back.`, yes: "Post" },
    return: { q: story.yours.parcel.ask, yes: "Give it back" },
  };

  const back = view === "home" ? onClose : () => setView("home");

  return (
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Your phone">
      <div className={styles.phone}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={back} data-back aria-label={view === "home" ? "Put your phone down" : "Home"}>
            ‹
          </button>
          <span className={styles.time}>{time}</span>
          <span />
        </header>

        {view === "home" && (
          <div className={styles.body}>
            <h2 className={styles.title}>Yours</h2>
            <ul className={styles.apps}>
              <li>
                <button type="button" className={styles.app} onClick={() => setView("messages")}>
                  <Icon app="messages" />
                  Messages
                </button>
              </li>
              {record && (
                <>
                  <li>
                    <button type="button" className={styles.app} onClick={() => setView("draft")}>
                      <Icon app="social" />
                      {story.yours.social}
                    </button>
                  </li>
                  <li>
                    <button type="button" className={styles.app} onClick={() => setView("record")}>
                      <Icon app="record" />
                      The record
                    </button>
                  </li>
                </>
              )}
              <li>
                <button type="button" className={styles.app} onClick={() => setView("parcel")}>
                  <Icon app="parcel" />
                  The parcel
                </button>
              </li>
            </ul>
          </div>
        )}

        {view === "messages" && (
          <div className={styles.chat}>
            {threads.length ? (
              <Chat story={story} state={state} app="yours:chats" chrome={false} onRead={(ids) => read(story, ids)} onSay={(o, id) => say(o, id)} />
            ) : (
              <p className={styles.empty}>No messages.</p>
            )}
          </div>
        )}

        {view === "draft" && (
          <div className={styles.body}>
            <h2 className={styles.title}>{story.yours.social}</h2>
            <p className={styles.label}>Draft</p>
            <div className={styles.post}>
              {post.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className={styles.note}>It says what your record says.</p>
            <div className={styles.acts}>
              <button type="button" className={styles.act} onClick={() => setView("record")}>
                Change the record
              </button>
              <button type="button" className={styles.act} onClick={() => setConfirm("post")}>
                Post
              </button>
            </div>
          </div>
        )}

        {view === "record" && (
          <div className={styles.body}>
            <h2 className={styles.title}>The record</h2>
            <p className={styles.note}>Each link of the night, as it would go out under your name.</p>
            <ol className={styles.rows}>
              {rows.map((r) => (
                <li key={r.link.id} className={styles.row}>
                  <span className={styles.rowLabel}>{r.link.label}</span>
                  <span className={styles.rowLine}>{r.line ?? (r.options.length > 1 ? "Left out." : "Not traced.")}</span>
                  {r.options.length > 1 && (
                    <span className={styles.choices} role="group" aria-label={r.link.label}>
                      {r.options.map((o) => (
                        <button
                          key={o}
                          type="button"
                          className={styles.choice}
                          aria-pressed={r.choice === o}
                          onClick={() => {
                            const s = readProgress();
                            if (s) save(setRow(story, s, r.link.id, o));
                          }}
                        >
                          {AS[o]}
                        </button>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <div className={styles.acts}>
              {canSend && (
                <button type="button" className={styles.act} onClick={() => setConfirm("send")}>
                  Send to {story.yours.sendTo}
                </button>
              )}
              <button type="button" className={styles.act} onClick={() => setConfirm("post")}>
                Post on {story.yours.social}
              </button>
            </div>
          </div>
        )}

        {view === "parcel" && (
          <div className={styles.body}>
            <h2 className={styles.title}>The parcel</h2>
            <p className={styles.note}>{story.yours.parcel.note}</p>
            <div className={styles.acts}>
              <button type="button" className={styles.act} onClick={() => setConfirm("return")}>
                {story.yours.parcel.act}
              </button>
            </div>
          </div>
        )}

        {confirm && (
          <div className={styles.confirm} role="alertdialog" aria-label={ASK[confirm].q}>
            <p>{ASK[confirm].q}</p>
            <div className={styles.acts}>
              <button type="button" className={styles.act} onClick={() => setConfirm(null)}>
                Not yet
              </button>
              <button type="button" className={styles.act} onClick={() => act(confirm)}>
                {ASK[confirm].yes}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
