"use client";

import { useEffect, useState } from "react";

import Chat from "@/components/owner/apps/Chat";
import { AppGlyph } from "@/components/owner/ios/icons";
import tile from "@/components/owner/ios/icons.module.css";
import type { Act, Story } from "@/content/types";
import { add, all, episodeOf, type CaseState, type RecordChoice } from "@/lib/game/engine";
import { actFlags, recordRows, setRow } from "@/lib/game/record";
import { hasRecord, LOOKED_KEY, SAW_RECORD, yourThreads } from "@/lib/game/yours";
import { badgeFor } from "@/lib/game/chat";
import { readProgress } from "@/lib/found/progress";
import { flag, markRead, read, save, say } from "@/components/stage/playthrough";
import styles from "./Sheet.module.css";

/* ===========================================================================
   Your phone, picked up (CHAPTER1.md I; rebuilt 2026-10-01).

   Two apps, as a person has them. **Messages**: Meera, and the courier who
   brought the parcel back. **Pulse**: the night spreading in public, the
   rumour everyone already believes climbing an episode at a time, and your
   unposted draft on top of it all. The record is what opens when you post,
   or attach it in Meera's chat; giving his phone back is the courier's own
   "Book a return pickup", there from the first minute and again in
   Episode 3, the morning's pickup slot.

   No signalling (PLAYER-JOURNEY Stage 8): one row style, the chain's own
   order, flat copy, and the acts drawn alike. Nothing says which is right.
   Loaded only when it's first opened, because most of a play never needs it.
   =========================================================================== */

type View = "home" | "messages" | "pulse" | "record" | "return";

const AS: Record<RecordChoice, string> = { in: "In", anon: "Without his name", out: "Leave out", says: "As he says", fact: "As fact" };

/* Your own apps, drawn like his: the same tile and edge light, so both
   phones read as phones. Messages is the one app they have in common. */
const PULSE = "linear-gradient(160deg, #9a87ff 0%, #5a3fd6 100%)";

function Icon({ app }: { app: "messages" | "pulse" }) {
  if (app === "messages")
    return (
      <span className={styles.icon} aria-hidden="true">
        <AppGlyph app="yours:chats" />
      </span>
    );
  return (
    <span className={styles.icon} aria-hidden="true">
      <span className={`${tile.tile} sq`} style={{ background: PULSE }}>
        <svg viewBox="0 0 24 24" className={tile.glyph}>
          <path d="M3.5 12.5h4l2-5.5 4 11 2.2-5.5h4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

/** 8400 → "8.4k", as a feed counts. */
const count = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n));

/** A story without a phone of yours (RAAKH) never opens this; the empty one keeps the types honest. */
const NONE: NonNullable<Story["yours"]> = { intro: "", sendTo: "", sendRequires: ["did:never"], parcel: { note: "", act: "", ask: "" } };

export default function Sheet({ story: chapter, state, time, onClose }: { story: Story; state: CaseState; time: string; onClose: () => void }) {
  const story = { ...chapter, yours: chapter.yours ?? NONE };
  const [view, setView] = useState<View>("home");
  // Where the record was opened from: posting it, or attaching it for Meera.
  const [mode, setMode] = useState<"post" | "send">("post");
  const [confirm, setConfirm] = useState<Act | null>(null);
  // The chat the record or the return was opened from, to come back to.
  const [inChat, setInChat] = useState<string | undefined>(undefined);
  const record = hasRecord(story, state);
  const canSend = all(state, story.yours.sendRequires);
  const threads = yourThreads(story, state);
  const unread = badgeFor(story, state, "yours:chats");
  const episode = episodeOf(state);

  // Picked up: what it was saying has been seen, and the funnel hears it the first time.
  useEffect(() => {
    const s = readProgress();
    if (s) save(add({ ...s, at: { ...s.at, [LOOKED_KEY]: Date.now() } }, "did:opened-yours"));
  }, []);

  // The feed, opened; the draft or the record, looked at: the funnel's "choice" milestone.
  useEffect(() => {
    if (view === "pulse") flag("did:opened-pulse");
    if ((view === "record" || (view === "pulse" && record)) && !state.flags.includes(SAW_RECORD)) flag(SAW_RECORD);
  }, [view, record, state.flags]);

  const act = (a: Act) => {
    const s = readProgress();
    if (s) flag(...actFlags(story, s, a));
  };

  const rows = recordRows(story, state);
  const post = [story.yours.intro, ...rows.map((r) => r.line).filter((l): l is string => Boolean(l))];
  const feed = (story.yours.feed ?? []).filter((p) => all(state, p.requires));
  const trending = (story.yours.trending ?? []).filter((t) => all(state, t.requires)).at(-1)?.text;

  const ASK: Record<Act, { q: string; yes: string }> = {
    send: { q: `Send the record to ${story.yours.sendTo}, with his phone? You can't take it back.`, yes: "Send" },
    post: { q: `Post it on ${story.yours.social}? Anyone can see it. You can't take it back.`, yes: "Post" },
    return: { q: story.yours.parcel.ask, yes: "Give it back" },
  };

  const openRecord = (m: "post" | "send") => {
    setMode(m);
    setView("record");
  };
  const home = () => {
    setInChat(undefined);
    setView("home");
  };
  const back = view === "home" ? onClose : view === "record" ? () => setView(mode === "post" ? "pulse" : "messages") : view === "return" ? () => setView("messages") : home;

  return (
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Your phone">
      <div className={styles.phone}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={back} data-back aria-label={view === "home" ? "Put your phone down" : "Back"}>
            ‹
          </button>
          <span className={styles.time}>{time}</span>
          <span />
        </header>

        {view === "home" && (
          <div className={styles.body}>
            <h2 className={styles.title}>Yours</h2>
            <p className={styles.note}>What you put out goes out under your name.</p>
            <ul className={styles.apps}>
              <li>
                <button type="button" className={styles.app} onClick={() => setView("messages")}>
                  <span className={styles.badged}>
                    <Icon app="messages" />
                    {unread > 0 && <span className={styles.badge}>{unread}</span>}
                  </span>
                  Messages
                </button>
              </li>
              {story.yours.social && (
                <li>
                  <button type="button" className={styles.app} onClick={() => setView("pulse")}>
                    <Icon app="pulse" />
                    {story.yours.social}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}

        {view === "messages" && (
          <div className={styles.chat}>
            {threads.length ? (
              <Chat
                story={story}
                state={state}
                app="yours:chats"
                chrome={false}
                onRead={(ids) => read(story, ids)}
                onSay={(o, id) => say(o, id)}
                onMark={markRead}
                opened={inChat}
                onLink={(to, t) => {
                  if (to !== "return") return;
                  setInChat(t.id);
                  setView("return");
                }}
                attachFor={(t) =>
                  t.id === "meera" && record && canSend
                    ? {
                        label: "Attach the record",
                        onAttach: () => {
                          setInChat(t.id);
                          openRecord("send");
                        },
                      }
                    : undefined
                }
              />
            ) : (
              <p className={styles.empty}>No messages.</p>
            )}
          </div>
        )}

        {view === "pulse" && (
          <div className={styles.body}>
            <h2 className={styles.title}>{story.yours.social}</h2>
            {trending && <p className={styles.trending}>Trending near you · {trending}</p>}

            {/* Yours, on top of everybody else's: what you'd put out, under your name. */}
            <section className={styles.draft} aria-label="Your draft">
              <p className={styles.label}>Your draft · only you can see it</p>
              {record ? (
                <div className={styles.post}>
                  {post.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className={styles.note}>Nothing yet. What you file in the case file shows up here.</p>
              )}
              {record && (
                <button type="button" className={styles.act} onClick={() => openRecord("post")}>
                  Review and post
                </button>
              )}
            </section>

            <ol className={styles.feed}>
              {feed.map((p) => (
                <li key={p.id} className={styles.feedPost}>
                  <p className={styles.feedWho}>
                    <span className={styles.feedAvatar} aria-hidden="true">
                      {p.who.slice(0, 1).toUpperCase()}
                    </span>
                    <b>{p.who}</b>
                    <span>
                      @{p.handle} · {p.when}
                    </span>
                  </p>
                  <p className={styles.feedText} lang={p.english ? "hi-Latn" : undefined}>
                    {p.text}
                  </p>
                  {p.english && <p className={styles.feedEnglish}>{p.english}</p>}
                  {p.media && <p className={styles.feedMedia}>{p.media}</p>}
                  <p className={styles.feedShares}>↻ {count(p.shares[episode - 1])} shares</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {view === "record" && (
          <div className={styles.body}>
            <h2 className={styles.title}>{mode === "post" ? "Your post" : `For ${story.yours.sendTo}`}</h2>
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
              <button type="button" className={styles.act} onClick={() => setConfirm(mode)}>
                {mode === "post" ? `Post on ${story.yours.social}` : `Send to ${story.yours.sendTo}`}
              </button>
            </div>
          </div>
        )}

        {view === "return" && (
          <div className={styles.body}>
            <h2 className={styles.title}>Return pickup</h2>
            <p className={styles.label}>DakRoute · Shipment DR4821••</p>
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
