"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Message } from "@/content/found/types";
import { actionAvailable, has, openReply, replyOptions, sessionVars, type CaseState } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import * as play from "../FoundPhone/actions";
import { Chevron } from "./AppBar";
import Avatar from "./Avatar";
import GuardianCard from "./GuardianCard";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import Switch from "./Switch";
import app from "./App.module.css";
import styles from "./Thread.module.css";

/* The story's present is Monday in both episodes: the morning the phone
   arrived and the evening it came back on. So Monday is "Today" and Sunday
   is "Yesterday", as the phone would print them. */
const DAYS: Record<string, string> = {
  Mon: "Today",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Yesterday",
  now: "Today",
};
const dayOf = (at: string) => DAYS[at.split(" ")[0]] ?? at;
const timeOf = (at: string) => (at === "now" ? "" : (at.split(" ")[1] ?? ""));

/** Minutes past midnight, or null when the message has no clock time ("now"). */
function minutesOf(at: string): number | null {
  const t = at.split(" ")[1];
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}

/** iOS prints a centred time stamp at a new day, and again after an hour's quiet. */
const QUIET_MINUTES = 60;

/**
 * One conversation, as iOS Messages draws it: the person's picture and name
 * at the top (tap for their details), grey bubbles in and blue bubbles out
 * with a tail on the last of each run, centred time stamps, and "Delivered"
 * under the last thing sent.
 *
 * Opening it is looking at it: any evidence in its messages goes into the
 * case file, including messages that arrive while it's open.
 *
 * The bottom is what the phone lets the player do there: in Episode 1,
 * nothing (Low Power Mode); in Episode 2, a short list of things to send when
 * there's something to answer. Whatever they pick is sent from {name}'s
 * phone, and it shows up in the thread like anything else sent.
 *
 * The person's details hold Send Read Receipts: the one switch that decides
 * whether Mum is told her messages are being read.
 */
export default function Thread({
  threadId,
  contact,
  messages,
  state,
  moved = false,
  group = false,
  nameable = false,
  composer,
  onBack,
  backLabel,
}: {
  threadId: string;
  contact: string;
  messages: readonly Message[];
  state: CaseState;
  moved?: boolean;
  group?: boolean;
  nameable?: boolean;
  composer: "low-power" | "replies" | "none";
  onBack: () => void;
  backLabel: string;
}) {
  const ep = useStory();
  const body = useRef<HTMLDivElement>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [details, setDetails] = useState(false);
  const [name, setName] = useState(state.names[threadId] ?? "");
  const vars = sessionVars(ep, state);
  const t = (x: string) => say(x, state.cast, vars);
  const reply = composer === "replies" ? openReply(ep, state, threadId) : undefined;
  const options = reply ? replyOptions(state, reply) : [];
  const receipts = !has(state, "did:receipts-off");
  const canReceipts = actionAvailable(ep, state, "receipts-off");
  // Group chats and the vault's copy of K.'s chat have no one person to open.
  const hasDetails = !group && composer !== "none";
  const title = state.names[threadId] ?? contact;
  const unknown = contact.startsWith("+") && !state.names[threadId];

  useEffect(() => {
    play.seeAll(messages.map((m) => m.evidence));
  }, [messages]);

  // Pinned to the newest message, like every messaging app: on open, and
  // whenever one arrives. Set on the scroller rather than `scrollIntoView`,
  // which would also scroll the fixed room around the phone.
  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, options.length]);

  // Where iOS would print a time stamp: the first message, a new day, or a
  // message after an hour's quiet.
  const stamped = messages.map((m, i) => {
    const prev = messages[i - 1];
    if (!prev || dayOf(prev.at) !== dayOf(m.at)) return true;
    const a = minutesOf(prev.at);
    const b = minutesOf(m.at);
    return a !== null && b !== null && b - a >= QUIET_MINUTES;
  });
  const lastSent = messages.findLastIndex((m) => m.from === "owner");

  const who = (
    <>
      <Avatar name={title} unknown={unknown} group={group} size="head" />
      <span className={styles.whoName}>
        <span>{title}</span>
        {hasDetails && <Chevron />}
      </span>
    </>
  );

  return (
    <section className={app.view}>
      <header className={styles.head}>
        <button type="button" className={app.back} onClick={onBack} data-back aria-label={backLabel}>
          <Chevron back />
        </button>
        {hasDetails ? (
          <button type="button" className={styles.who} onClick={() => setDetails(true)} aria-label={`${title}, details`}>
            {who}
          </button>
        ) : (
          <span className={styles.who}>{who}</span>
        )}
        <span className={styles.headEnd}>
          {nameable && (
            <button type="button" className={app.pill} onClick={() => setNaming((v) => !v)}>
              {naming ? "Cancel" : state.names[threadId] ? "Rename" : "Add Name"}
            </button>
          )}
        </span>
      </header>

      {naming && (
        <form
          className={styles.naming}
          onSubmit={(e) => {
            e.preventDefault();
            play.nameContact(threadId, name);
            setNaming(false);
          }}
        >
          <input
            className={styles.nameInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={contact}
            maxLength={24}
            autoFocus
          />
          <button type="submit" className={styles.nameSave}>
            Save
          </button>
        </form>
      )}

      <div className={`${app.body} ${styles.body}`} ref={body}>
        {moved && <p className={styles.moved}>This conversation was moved.</p>}
        {messages.map((m, i) => {
          const next = messages[i + 1];
          const endOfRun = !next || next.from !== m.from || next.sender !== m.sender || stamped[i + 1];
          const prev = messages[i - 1];
          const showSender =
            group && m.from === "them" && m.sender && (stamped[i] || prev?.sender !== m.sender || prev?.from !== m.from);
          const scrubbed = m.text === "This message was deleted.";
          const time = timeOf(m.at);
          return (
            <Fragment key={i}>
              {stamped[i] && (
                <p className={styles.stamp}>
                  <b>{dayOf(m.at)}</b>
                  {time && ` ${time}`}
                </p>
              )}
              <div className={styles.row} data-from={m.from} data-new={m.at === "now" || undefined} data-tail={endOfRun || undefined}>
                {showSender && <span className={styles.sender}>{m.sender}</span>}
                {m.text && (
                  <p className={styles.bubble} data-scrubbed={scrubbed || undefined}>
                    {t(m.text)}
                  </p>
                )}
                {m.card === "guardian" && (
                  <div className={styles.card}>
                    <GuardianCard state={state} />
                  </div>
                )}
                {m.photo && (
                  <button type="button" className={styles.photo} onClick={() => setViewing(m.photo ?? null)}>
                    <PhotoFrame id={m.photo} cast={state.cast} size="bubble" />
                  </button>
                )}
                {i === lastSent && <span className={styles.receipt}>Delivered</span>}
              </div>
            </Fragment>
          );
        })}
      </div>

      {reply && options.length > 0 ? (
        <div className={styles.replies} role="group" aria-label="Reply">
          {options.map((o) => (
            <button
              type="button"
              key={o.id}
              className={styles.replyOption}
              data-silent={o.text === null || undefined}
              onClick={() => play.choose(reply.id, o.id)}
            >
              {o.text === null ? "Don’t reply" : t(o.text)}
            </button>
          ))}
        </div>
      ) : (
        composer !== "none" && (
          <div className={styles.composer} aria-disabled="true">
            <span className={styles.plus} aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 4v12M4 10h12" />
              </svg>
            </span>
            <span className={styles.field}>
              {composer === "low-power" ? "Low Power Mode is on. Messages can’t be sent." : "iMessage"}
            </span>
          </div>
        )
      )}

      {details && (
        <div className={styles.contactSheet} role="dialog" aria-label={title} data-no-swipe>
          <div className={styles.contactBar}>
            <button type="button" className={app.pill} onClick={() => setDetails(false)}>
              Done
            </button>
          </div>
          <span className={styles.contactAvatar}>
            <Avatar name={title} unknown={unknown} size="card" />
          </span>
          <p className={styles.contactName}>{title}</p>
          {title !== contact && <p className={styles.contactSub}>{contact}</p>}
          <ul className={app.group}>
            <li className={app.row}>
              <span className={app.rowMain}>
                <span className={app.rowTitle}>Send Read Receipts</span>
              </span>
              <Switch
                on={receipts}
                disabled={!receipts || !canReceipts}
                onChange={() => play.perform("receipts-off")}
                label="Send Read Receipts"
              />
            </li>
          </ul>
          <p className={app.note}>When this is on, people are told when you&apos;ve read their messages.</p>
        </div>
      )}
      {viewing && <PhotoViewer id={viewing} cast={state.cast} onClose={() => setViewing(null)} />}
    </section>
  );
}
