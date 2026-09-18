"use client";

import { useEffect, useState } from "react";

import type { IncomingCall, ReplyOption } from "@/content/types";
import { exposed, has, type CaseState } from "@/lib/game/engine";
import styles from "./Ringing.module.css";

/* ===========================================================================
   A call arriving on its own.

   Twice in the chapter, and both times the player is holding a phone that is
   not theirs: her son at 1:34 in the morning, and the Crime Branch at 10:30.

   Her son can be declined, and then he doesn't ring back. The Crime Branch
   can't: there is no red button, only green, which is exactly what the real
   crime does to real people (CHAPTER1.md Ep 3, beat 4).

   What the caller says can depend on the ledger: an accusation is only made
   when the player actually handed that thing over (CHAPTER1.md, twist 6).
   =========================================================================== */

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
  const lines = call.lines.filter((l) => (!l.needs || exposed(state, l.needs)) && (!l.when || has(state, l.when)));

  /* He talks. The player listens, the way a person under a digital arrest
     listens: one line at a time, with no way to hurry him. */
  useEffect(() => {
    if (!answered || said >= lines.length) return undefined;
    const t = window.setTimeout(() => setSaid((n) => n + 1), said === 0 ? 900 : 3400);
    return () => window.clearTimeout(t);
  }, [answered, said, lines.length]);

  return (
    <div className={styles.screen}>
      <p className={styles.label} role="status">{answered ? "Call in progress" : "Incoming call"}</p>
      <p className={styles.who}>{call.from}</p>
      {call.sub && <p className={styles.sub}>{call.sub}</p>}

      {answered ? (
        <div className={styles.lines} aria-live="polite">
          {lines.slice(0, said).map((l, i) => (
            <p key={i} className={styles.line}>
              <span className={styles.speaker}>{l.who}</span>
              <span lang={l.english ? "hi-Latn" : undefined}>{l.line}</span>
              {l.english && <span className={styles.english}>{l.english}</span>}
            </p>
          ))}

          {said >= lines.length && !call.reply && call.dismiss && (
            <button type="button" className={styles.option} onClick={() => onSay({ id: "done", text: call.dismiss! })}>
              {call.dismiss}
            </button>
          )}

          {said >= lines.length && call.reply && (
            <div className={styles.say}>
              {call.reply.prompt && <p className={styles.prompt}>{call.reply.prompt}</p>}
              {call.reply.options.map((o) => (
                <button key={o.id} type="button" className={styles.option} onClick={() => onSay(o)}>
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
            <button type="button" className={styles.decline} onClick={onDecline}>
              Decline
            </button>
          )}
          <button
            type="button"
            className={styles.answer}
            onClick={() => {
              setAnswered(true);
              onAnswer();
            }}
          >
            Answer
          </button>
        </div>
      )}
    </div>
  );
}
