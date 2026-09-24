"use client";

import { useEffect, useState } from "react";

import type { IncomingCall, ReplyOption } from "@/content/types";
import { has, type CaseState } from "@/lib/game/engine";
import { connected, ended, ringtone } from "@/lib/found/tones";
import styles from "./Ringing.module.css";

/* ===========================================================================
   A call arriving on its own, on the found phone or the player's.

   Drawn as iOS draws an incoming call: the caller's name high on the screen,
   "mobile" under it, round buttons at the bottom with their words beneath,
   and a ringtone until it's answered (PLAYTEST.md #36, #64).

   A call that can be declined doesn't ring back; one that insists has no red
   button, only green. Whatever the player says, the other side answers
   before the line goes: people don't just hang up (#37).

   What the caller says can depend on what the player did earlier: a line
   can wait on a flag.

   =========================================================================== */

/**
 * How long the answer to what was said stays before the call ends: long
 * enough to read it and its English, a beat per character, within limits.
 */
const reactionMs = (m: { text?: string; english?: string } | undefined): number =>
  m ? Math.min(9000, Math.max(3400, 1600 + 55 * ((m.text?.length ?? 0) + (m.english?.length ?? 0)))) : 400;

function Glyph({ kind }: { kind: "answer" | "decline" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={kind === "decline" ? styles.down : undefined}>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z" />
    </svg>
  );
}

export default function Ringing({
  call,
  state,
  answered: alreadyAnswered,
  onAnswer,
  onDecline,
  onSay,
}: {
  call: IncomingCall;
  state: CaseState;
  /** Answering is remembered in the save, so a reload doesn't re-ring it. */
  answered: boolean;
  onAnswer: () => void;
  /** Absent for a call that can't be refused: it can only be answered. */
  onDecline?: () => void;
  onSay: (option: ReplyOption) => void;
}) {
  const [answered, setAnswered] = useState(alreadyAnswered);
  const [said, setSaid] = useState(0);
  const [chosen, setChosen] = useState<ReplyOption | null>(null);
  // How long the call has been going, where iOS puts it once it's picked up.
  const [secs, setSecs] = useState(0);
  const lines = call.lines.filter((l) => !l.when || has(state, l.when));

  useEffect(() => {
    if (!answered) return undefined;
    const t = window.setInterval(() => setSecs((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [answered]);

  // It rings until it's answered, or declined.
  useEffect(() => {
    if (answered) return undefined;
    return ringtone();
  }, [answered]);

  /* They talk. The player listens, one line at a time, with no way to hurry them. */
  useEffect(() => {
    if (!answered || said >= lines.length) return undefined;
    const t = window.setTimeout(() => setSaid((n) => n + 1), said === 0 ? 900 : 3400);
    return () => window.clearTimeout(t);
  }, [answered, said, lines.length]);

  // What was said gets its answer, and then the line goes.
  useEffect(() => {
    if (!chosen) return undefined;
    const t = window.setTimeout(
      () => {
        ended();
        onSay(chosen);
      },
      reactionMs(chosen.then?.[0]),
    );
    return () => window.clearTimeout(t);
  }, [chosen, onSay]);

  const reaction = chosen?.then?.[0];

  return (
    <div className={styles.screen} data-answered={answered || undefined}>
      <div className={styles.head}>
        <p className={styles.who}>{call.from}</p>
        {answered ? (
          <p className={styles.sub} data-timer>
            {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
          </p>
        ) : (
          <p className={styles.sub}>{call.sub}</p>
        )}
      </div>

      {answered ? (
        <div className={styles.lines} aria-live="polite">
          {lines.slice(0, said).map((l, i) => (
            <p key={i} className={styles.line}>
              <span className={styles.speaker}>{l.who}</span>
              <span lang={l.english ? "hi-Latn" : undefined}>{l.line}</span>
              {l.english && <span className={styles.english}>{l.english}</span>}
            </p>
          ))}

          {chosen && (
            <p className={styles.line} data-mine>
              <span className={styles.speaker}>You</span>
              <span>{chosen.text}</span>
            </p>
          )}
          {reaction && (
            <p className={styles.line}>
              {/* Whoever has been speaking answers, by name, however the phone listed them. */}
              <span className={styles.speaker}>{call.lines[0]?.who ?? call.from}</span>
              <span lang={reaction.english ? "hi-Latn" : undefined}>{reaction.text}</span>
              {reaction.english && <span className={styles.english}>{reaction.english}</span>}
            </p>
          )}

          {!chosen && said >= lines.length && !call.reply && call.dismiss && (
            <button type="button" className={styles.option} onClick={() => onSay({ id: "done", text: call.dismiss! })}>
              {call.dismiss}
            </button>
          )}

          {!chosen && said >= lines.length && call.reply && (
            <div className={styles.say}>
              {call.reply.prompt && <p className={styles.prompt}>{call.reply.prompt}</p>}
              {call.reply.options.map((o) => (
                <button key={o.id} type="button" className={styles.option} onClick={() => setChosen(o)}>
                  <span lang={o.english ? "hi-Latn" : undefined}>{o.text}</span>
                  {o.english && <span className={styles.english}>{o.english}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.buttons}>
          {onDecline && (
            <span className={styles.button}>
              <button type="button" className={styles.decline} onClick={onDecline} aria-label="Decline">
                <Glyph kind="decline" />
              </button>
              <span>Decline</span>
            </span>
          )}
          <span className={styles.button}>
            <button
              type="button"
              className={styles.answer}
              aria-label="Accept"
              onClick={() => {
                connected();
                setAnswered(true);
                onAnswer();
              }}
            >
              <Glyph kind="answer" />
            </button>
            <span>Accept</span>
          </span>
        </div>
      )}
    </div>
  );
}
