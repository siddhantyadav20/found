"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { IncomingCall, Reply, ReplyOption, Voices } from "@/content/types";
import { has, type CaseState } from "@/lib/game/engine";
import { connected, ended, ringtone } from "@/lib/found/tones";
import { say } from "@/lib/found/voice";
import styles from "./Ringing.module.css";

/* ===========================================================================
   A call arriving on its own, on the found phone or the player's.

   Drawn as iOS draws an incoming call: the caller's name high on the screen,
   "mobile" under it, round buttons at the bottom with their words beneath,
   and a ringtone until it's answered (PLAYTEST.md #36, #64).

   A call that can be declined doesn't ring back; one that insists has no red
   button, only green. Whatever the player says, the other side answers
   before the line goes: people don't just hang up (#37). A call can go on
   (RAAKH-V3 §8.7): an answer leads into what they say next, and another
   choice (`ReplyOption.next`, `Reply.before`).

   The player's own lines are never voiced (RAAKH-V3 §16): only theirs.
   =========================================================================== */

/**
 * How long the answer to what was said stays before the next line: long
 * enough to read it and its English, a beat per character, within limits.
 */
const readMs = (m: { text?: string; english?: string } | undefined): number =>
  m ? Math.min(9000, Math.max(3000, 1500 + 50 * ((m.text?.length ?? 0) + (m.english?.length ?? 0)))) : 400;

function Glyph({ kind }: { kind: "answer" | "decline" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={kind === "decline" ? styles.down : undefined}>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z" />
    </svg>
  );
}

/** One line of the call, in order: theirs (heard), or the player's (only read). */
type Line = {
  readonly key: string;
  readonly who: string;
  readonly line: string;
  readonly english?: string;
  readonly voice?: { readonly src: string; readonly seconds: number };
  readonly mine?: boolean;
};

/** What can be said in an exchange now. */
const offered = (s: CaseState, r: Reply): ReplyOption[] =>
  r.options.filter(
    (o) => (o.requires ?? []).every((f) => has(s, f)) && (!o.any || o.any.some((f) => has(s, f))) && !(o.unless ?? []).some((f) => has(s, f)),
  );

export default function Ringing({
  call,
  state,
  answered: alreadyAnswered,
  onAnswer,
  onDecline,
  onSay,
  wallpaper,
  voices,
  compact = false,
  finale,
}: {
  call: IncomingCall;
  /** The story's recordings: each line of the call, and each answer, said aloud. */
  voices?: Voices;
  /** The phone's wallpaper, blurred behind the call as iOS shows it. */
  wallpaper?: string;
  state: CaseState;
  /** Answering is remembered in the save, so a reload doesn't re-ring it. */
  answered: boolean;
  onAnswer: () => void;
  /** Absent for a call that can't be refused: it can only be answered. */
  onDecline?: () => void;
  /** Everything the player said, in order, once they hang up. */
  onSay: (said: readonly ReplyOption[]) => void;
  /** Drawn inside the second phone (PG-YOURPHONE), not over the whole screen. */
  compact?: boolean;
  /**
   * What ends the call instead of the red button, once there's nothing left
   * to say (the reveal's camera or face down). `onSay` is called the moment
   * it appears, with everything said.
   */
  finale?: React.ReactNode;
}) {
  const [answered, setAnswered] = useState(alreadyAnswered);
  const [path, setPath] = useState<readonly ReplyOption[]>([]);
  const [shown, setShown] = useState(0);
  // How long the call has been going, where iOS puts it once it's picked up.
  const [secs, setSecs] = useState(0);
  const speaker = call.lines[0]?.who ?? call.from;

  /* The whole call so far, in order: what they said, what the player said,
     what came back, and what they said next. */
  const lines = useMemo<Line[]>(() => {
    const out: Line[] = [];
    call.lines.forEach((l, i) => {
      if (!l.when || has(state, l.when)) out.push({ key: `c${i}`, who: l.who, line: l.line, english: l.english, voice: voices?.[`call:${call.id}:${i}`] });
    });
    path.forEach((o, n) => {
      // Keyed by where in the call it was said: two exchanges can each have a "why".
      out.push({ key: `me-${n}-${o.id}`, who: "You", line: o.text, english: o.english, mine: true });
      for (const m of o.then ?? []) out.push({ key: m.id, who: speaker, line: m.text ?? "", english: m.english, voice: voices?.[`msg:${m.id}`] });
      o.next?.before?.forEach((l, i) => out.push({ key: `${o.next!.id}-${i}`, who: l.who, line: l.line, english: l.english, voice: voices?.[`call:${call.id}:${o.next!.id}:${i}`] }));
    });
    return out;
  }, [call, path, state, voices, speaker]);

  // The exchange open now: the call's own, or the one the last answer led into.
  const exchange: Reply | undefined = path.length ? path.at(-1)!.next : call.reply;
  const options = exchange ? offered(state, exchange) : [];

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

  /* They talk; the player listens, a line at a time, with no way to hurry
     them: each line is heard (where it's recorded) and the next waits. */
  // Said once, when it comes up: an answer picked later never makes them say it again.
  const current = lines[shown - 1];
  const sayNow = current && !current.mine ? current.voice?.src : undefined;
  useEffect(() => {
    if (!answered || !sayNow) return undefined;
    return say(sayNow);
  }, [answered, shown, sayNow]);
  // When the line that's up was heard: a reply picked after it doesn't start its clock again.
  const upAt = useRef<{ key?: string; at: number }>({ at: 0 });
  const upKey = current?.key;
  useEffect(() => {
    if (upAt.current.key !== upKey) upAt.current = { key: upKey, at: Date.now() };
  }, [upKey]);
  useEffect(() => {
    if (!answered || shown >= lines.length) return undefined;
    const prev = lines[shown - 1];
    const heard = prev?.voice ? prev.voice.seconds * 1000 + 450 : 0;
    const full = shown === 0 ? 900 : prev?.mine ? 700 : Math.max(readMs({ text: prev?.line, english: prev?.english }), heard);
    // The player's own answer goes up the moment it's picked; anyone else waits out what came before.
    const wait = lines[shown]?.mine ? 250 : Math.max(0, full - (Date.now() - upAt.current.at));
    const t = window.setTimeout(() => setShown((n) => n + 1), wait);
    return () => window.clearTimeout(t);
  }, [answered, shown, lines]);

  const listening = answered && shown < lines.length;
  // The newest line, and the answers under it, are always in view.
  const linesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = linesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, path.length, listening]);
  const over = answered && !listening && (!exchange || options.length === 0);
  const hangUp = () => {
    ended();
    onSay(path);
  };
  /* They had the last word and nothing's left to say: they hang up, as a
     caller does (2026-10-28: the call sat open until the player pressed End). */
  const last = lines.at(-1);
  const theirsLast = Boolean(last && !last.mine);
  useEffect(() => {
    if (!over || finale || !theirsLast || !last) return undefined;
    // After their last line has been heard and read.
    const wait = Math.max(readMs({ text: last.line, english: last.english }), (last.voice?.seconds ?? 0) * 1000) + 1500;
    const t = window.setTimeout(hangUp, wait);
    return () => window.clearTimeout(t);
    // Once, when it's over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);
  // With a finale, what was said is kept the moment the talking stops.
  useEffect(() => {
    if (over && finale) onSay(path);
    // Once, when it's over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  return (
    <div
      className={styles.screen}
      data-answered={answered || undefined}
      data-compact={compact || undefined}
      style={wallpaper ? ({ "--wallpaper": `url(${wallpaper})` } as CSSProperties) : undefined}
    >
      <div className={styles.head}>
        {/* Yours, not his: said once, in your phone's own blue. */}
        {call.device === "yours" && !compact && <p className={styles.yours}>Your phone</p>}
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
        <div className={styles.lines} aria-live="polite" ref={linesRef}>
          {lines.slice(0, shown).map((l) => (
            <p key={l.key} className={styles.line} data-mine={l.mine || undefined}>
              {/* An unsaved number has no name on this phone: the caller is only the caller. */}
              <span className={styles.speaker}>{!l.mine && call.from.startsWith("+") ? "Caller" : l.who}</span>
              <span lang={l.english ? "hi-Latn" : undefined}>{l.line}</span>
              {l.english && <span className={styles.english}>{l.english}</span>}
            </p>
          ))}

          {/* They're still talking: said where the player is waiting, so the pause doesn't read as a stall. */}
          {listening && (
            <p className={styles.listening} role="status">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              {shown === 0 ? "Connecting…" : "Listening…"}
            </p>
          )}

          {over && finale}
          {over && !finale && (
            <span className={`${styles.button} ${styles.end}`}>
              <button type="button" className={styles.decline} onClick={hangUp} aria-label="End call">
                <Glyph kind="decline" />
              </button>
              <span>End</span>
            </span>
          )}

          {!listening && !exchange && path.length === 0 && call.dismiss && (
            <button type="button" className={styles.option} onClick={hangUp}>
              {call.dismiss}
            </button>
          )}

          {!listening && exchange && options.length > 0 && (
            <div className={styles.say}>
              {exchange.prompt && <p className={styles.prompt}>{exchange.prompt}</p>}
              {options.map((o) => (
                <button key={o.id} type="button" className={styles.option} onClick={() => setPath((p) => [...p, o])}>
                  <span lang={o.english ? "hi-Latn" : undefined}>{o.text}</span>
                  {o.english && <span className={styles.english}>{o.english}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* iOS 26 offers these two over the answer buttons. Both decline the
              call, as on iOS; a call that can't be refused doesn't offer them. */}
          {onDecline && !compact && (
            <div className={styles.extras}>
              <span className={styles.button}>
                <button type="button" className={`${styles.extra} lg`} onClick={onDecline} aria-label="Remind Me">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 9.5V13l2.2 1.6M5 4.5 3 6.5M19 4.5l2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
                <span>Remind Me</span>
              </span>
              <span className={styles.button}>
                <button type="button" className={`${styles.extra} lg`} onClick={onDecline} aria-label="Message">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4.5c4.7 0 8 2.9 8 6.6s-3.3 6.6-8 6.6c-.9 0-1.8-.1-2.6-.3L5.2 19.3l1-3C4.8 15 4 13.3 4 11.1c0-3.7 3.3-6.6 8-6.6Z" fill="currentColor" />
                  </svg>
                </button>
                <span>Message</span>
              </span>
            </div>
          )}
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
        </>
      )}
    </div>
  );
}
