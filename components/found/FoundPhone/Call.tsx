"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { ScriptedCall } from "@/content/found/types";
import { buzz, refuse } from "@/lib/found/buzz";
import { callReply, replyOptions, type CaseState } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import * as play from "./actions";
import styles from "./Call.module.css";

/** Between rings, while it's ringing. */
const RING_MS = 2600;
/** From the last caption to the three things the player can say. */
const ANSWERS_AFTER = 2200;
/** From the last caption of a call nobody can answer to the line going dead. */
const HANGUP_AFTER = 2600;
/** "Call Ended" on screen before the phone goes back to where it was. */
const ENDED_MS = 1400;

/**
 * The only call in the chapter, and the only full-bleed screen in the game:
 * no status bar, no apps, one name.
 *
 * It rings until it's answered. Declining refuses; this is the one thing the
 * phone won't let a stranger put off. Once it's picked up, the player can't
 * type and can't leave. They can listen — room tone, a train, a voice that
 * has been a whisper for two and a half episodes — and then say one of three
 * things. Whichever they say is the ending.
 *
 * Captions carry it until the recording exists, so it plays silent too. A
 * line that isn't in English has its English underneath.
 *
 * A `scripted` call is one the player only listens to: when it's said what it
 * has to say, the line goes dead, and the call marks itself heard.
 */
export default function Call({ state, scripted }: { state: CaseState; scripted?: ScriptedCall }) {
  const ep = useStory();
  const call = scripted ? null : ep.call;
  const reply = scripted ? undefined : callReply(ep, state);
  const [picked, setPicked] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const caller = scripted
    ? scripted.from
    : call
      ? (state.names[call.thread] ?? ep.threads.find((t) => t.id === call.thread)?.contact ?? "Unknown")
      : "Unknown";
  const lines = scripted?.lines ?? call?.lines ?? [];
  const last = (lines.at(-1)?.at ?? 0) * 1000;
  const end = last + (scripted ? HANGUP_AFTER : ANSWERS_AFTER);
  const talking = elapsed !== null;
  const shown = talking ? lines.filter((l) => l.at * 1000 <= elapsed) : [];
  const answering = talking && elapsed >= end;
  const ended = !!scripted && answering;

  // A call nobody can answer back: the line goes dead, and the phone goes back.
  useEffect(() => {
    if (!ended || !scripted) return;
    const timer = window.setTimeout(() => play.perform(scripted.ends), ENDED_MS);
    return () => window.clearTimeout(timer);
  }, [ended, scripted]);

  // It rings: the phone's own buzz, over and over, until it's picked up.
  useEffect(() => {
    if (talking) return;
    buzz();
    const timer = window.setInterval(buzz, RING_MS);
    return () => window.clearInterval(timer);
  }, [talking]);

  // The call's clock, from the moment it's answered.
  useEffect(() => {
    if (!talking) return;
    const began = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - began), 250);
    return () => window.clearInterval(timer);
  }, [talking]);

  if (!scripted && (!call || !reply)) return null;
  const seconds = Math.floor((elapsed ?? 0) / 1000);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={styles.call} data-talking={talking || undefined} role="dialog" aria-label={`Call from ${caller}`}>
      <div className={styles.head}>
        <p className={styles.kind}>{ended ? "Call Ended" : talking ? clock : "mobile"}</p>
        <h2 className={styles.name}>{caller}</h2>
        {!talking && <p className={styles.ringing}>Incoming call…</p>}
      </div>

      {talking && (
        <ol className={styles.captions} aria-live="polite">
          {shown.map((l) => (
            <li key={l.at} data-sound={l.text.startsWith("[") || undefined}>
              {say(l.text, state.cast)}
              {l.en && <span className={styles.en}>{l.en}</span>}
            </li>
          ))}
        </ol>
      )}

      {!talking ? (
        <div className={styles.buttons}>
          <span className={styles.control}>
            <button type="button" className={styles.decline} onClick={() => refuse()} aria-label="Decline">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.2 13.6c4.9-4.3 12.7-4.3 17.6 0 .6.5.7 1.4.2 2l-1.4 1.6c-.5.5-1.2.6-1.8.3l-2.3-1.2c-.5-.3-.8-.8-.8-1.4v-1.4c-2-.6-3.4-.6-5.4 0v1.4c0 .6-.3 1.1-.8 1.4l-2.3 1.2c-.6.3-1.3.2-1.8-.3L3 15.6c-.5-.6-.4-1.5.2-2Z" />
              </svg>
            </button>
            <span>Decline</span>
          </span>
          <span className={styles.control}>
            <button type="button" className={styles.accept} onClick={() => setElapsed(0)} aria-label="Accept">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.6 3.4c.5-.2 1.1 0 1.4.4l1.9 3c.3.5.2 1.2-.2 1.6L8.3 9.8c.9 2.2 3.3 4.7 5.9 5.9l1.4-1.4c.4-.4 1.1-.5 1.6-.2l3 1.9c.5.3.6.9.4 1.4l-.9 2.2c-.3.7-1 1.1-1.8 1C9.9 19.7 4.3 14.1 3.5 6.1c-.1-.8.3-1.5 1-1.8Z" />
              </svg>
            </button>
            <span>Accept</span>
          </span>
        </div>
      ) : ended ? (
        <p className={styles.listening}>They hung up.</p>
      ) : answering && reply ? (
        <div className={styles.answers}>
          <p className={styles.say}>Say</p>
          {replyOptions(state, reply).map((o) => (
            <button
              type="button"
              key={o.id}
              className={styles.answer}
              disabled={picked}
              onClick={() => {
                setPicked(true);
                play.choose(reply.id, o.id);
              }}
            >
              {o.text && say(o.text, state.cast)}
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.listening}>You can&apos;t type on a call. Listen.</p>
      )}
    </div>
  );
}
