"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Poster } from "@/components/owner/apps/Chat";
import type { EndingLine, Story } from "@/content/types";
import { clockNow, type CaseState } from "@/lib/game/engine";
import { chosen, ENDING_SEEN, linesFor } from "@/lib/game/endings";
import { buzz } from "@/lib/found/buzz";
import { say } from "@/lib/found/voice";
import { longDay, phoneClock } from "@/lib/found/time";
import { flag } from "../playthrough";
import styles from "./Ending.module.css";

/* ===========================================================================
   The morning after, on your own phone (ROADMAP T21).

   What the act cost isn't told to the player: it arrives, on their lock
   screen, as the night turns into Sunday. Somebody saying something is a
   notification, newest on top, with a buzz; what nobody says is a line under
   the clock; a time moves the clock on. Then the ending's last image, alone,
   then black, then the card. A tap brings the next one sooner.
   =========================================================================== */

const LINE_MS = 3800;
const LAST_MS = 5200;
const BLACK_MS = 2600;
const TIME = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

/** Where the clock stands for a line: its own time, or the clock it names. */
function clockOf(l: EndingLine): string | undefined {
  const m = l.at ? TIME.exec(l.at.trim()) : null;
  if (m) {
    const h = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
    return `${String(h).padStart(2, "0")}:${m[2]}`;
  }
  return l.clock;
}

/** A voice note, as it lands: a play mark, its length, and what it says under it. */
function VoiceNote({ seconds }: { seconds?: number }) {
  return (
    <span className={styles.voiceNote}>
      <span className={styles.voicePlay} aria-hidden="true">
        ▶
      </span>
      <span className={styles.voiceWave} aria-hidden="true" />
      <span className={styles.voiceLength}>0:{String(Math.max(1, Math.round(seconds ?? 4))).padStart(2, "0")}</span>
    </span>
  );
}

/** A notification: who, what, and the English under it. */
function Notice({ line, seconds }: { line: EndingLine; seconds?: number }) {
  const who = line.who ?? "";
  const [app, name] = who.includes(" · ") ? who.split(" · ") : ["", who];
  return (
    <div className={styles.notice}>
      <span className={styles.noticeIcon} aria-hidden="true">
        {(name || app).replace(/[^A-Za-z]/g, "").slice(0, 1) || "•"}
      </span>
      <span className={styles.noticeBody}>
        <span className={styles.noticeHead}>
          <b>{name || app}</b>
          {app && <span className={styles.noticeApp}>{app}</span>}
        </span>
        {line.voice && <VoiceNote seconds={seconds} />}
        <span lang={line.english ? "hi-Latn" : undefined}>{line.text}</span>
        {line.english && <span className={styles.english}>{line.english}</span>}
        {line.poster && (
          <span className={styles.noticePoster}>
            <Poster a={line.poster} />
          </span>
        )}
      </span>
    </div>
  );
}

/** A line nobody says: under the clock, the way the night is narrated. */
function Told({ line }: { line: EndingLine }) {
  return (
    <p className={styles.toldLine}>
      <span lang={line.english ? "hi-Latn" : undefined}>{line.text}</span>
      {line.english && <span className={styles.english}>{line.english}</span>}
    </p>
  );
}

export default function Aftermath({ story, state }: { story: Story; state: CaseState }) {
  const ending = chosen(story, state);
  const lines = ending ? linesFor(state, ending.lines) : [];
  const last = ending ? linesFor(state, ending.last) : [];
  const [start] = useState(() => clockNow(story, state, Date.now()));
  // 1..lines.length: the morning; then the last image; then black.
  const [shown, setShown] = useState(1);
  const total = lines.length + (last.length ? 1 : 0);
  const black = shown > total;
  const atLast = last.length > 0 && shown === total;

  const more = () => setShown((n) => n + 1);

  useEffect(() => {
    if (black) return undefined;
    // A line with a voice, a poster or a photo is given the time it takes to take in.
    const heavy = (atLast ? last : [lines[shown - 1]]).some((l) => l?.voice || l?.poster);
    const t = window.setTimeout(more, (atLast ? LAST_MS : LINE_MS) + (heavy ? 3200 : 0));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [black, atLast, shown]);

  // Someone writing to you lands as it would: with the buzz, and a voice note is heard.
  const voiceOf = (l?: EndingLine) => (l?.voice ? story.voices?.[l.voice] : undefined);
  useEffect(() => {
    if (atLast) {
      const v = last.map(voiceOf).find(Boolean);
      if (!v) return undefined;
      let stop = () => {};
      const t = window.setTimeout(() => (stop = say(v.src)), 1600);
      return () => {
        window.clearTimeout(t);
        stop();
      };
    }
    return say(voiceOf(lines[shown - 1])?.src);
    // Only when a new line arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, atLast]);
  useEffect(() => {
    if (!atLast && lines[shown - 1]?.who) buzz();
    // Only when a new line arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  useEffect(() => {
    if (!black) return undefined;
    const t = window.setTimeout(() => flag(ENDING_SEEN), BLACK_MS);
    return () => window.clearTimeout(t);
  }, [black]);

  if (!ending) return null;
  if (black) return <div className={styles.black} aria-hidden="true" />;

  if (atLast)
    return (
      <div className={styles.screen} onClick={more}>
        <div className={styles.lastImage} aria-live="polite">
          {last.map((l, i) =>
            l.who && l.text.startsWith("📷") ? (
              <figure key={i} className={styles.lastPhoto}>
                {l.src ? (
                  <span className={styles.lastFrame} data-photo>
                    <Image src={l.src} alt={l.text.replace(/^📷\s*/, "")} fill sizes="360px" style={{ objectFit: "cover" }} />
                  </span>
                ) : (
                  <span className={styles.lastFrame} aria-hidden="true" />
                )}
                <figcaption>
                  <span className={styles.from}>{l.who}</span>
                  {l.text.replace(/^📷\s*/, "")}
                </figcaption>
              </figure>
            ) : l.who ? (
              <p key={i} className={styles.lastSaid} data-voice={l.voice ? "" : undefined}>
                {l.voice && (
                  <>
                    <span className={styles.from}>{l.who}</span>
                    <VoiceNote seconds={voiceOf(l)?.seconds} />
                  </>
                )}
                <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
                {l.english && <span className={styles.english}>{l.english}</span>}
              </p>
            ) : (
              <p key={i} className={styles.told}>
                {l.text}
              </p>
            ),
          )}
        </div>
      </div>
    );

  const all = lines.slice(0, shown);
  const clock = all.map(clockOf).filter(Boolean).at(-1) ?? start;
  // A new day is a new lock screen: what came before it has been read and cleared.
  const since = Math.max(0, all.map((l) => Boolean(l.day)).lastIndexOf(true));
  const seen = all.slice(since);
  const told = [...seen].reverse().find((l) => !l.who);
  // The day on the lock screen, and a cut ("Three weeks later") when the ending moves on.
  const day = [...all].reverse().find((l) => l.day)?.day ?? story.clocks[2];
  const now = lines[shown - 1];
  const cut = now?.at && !TIME.test(now.at.trim()) ? now.at : undefined;
  const notices = seen.filter((l) => l.who).reverse();

  return (
    <div className={`${styles.screen} ${styles.morning}`} onClick={more}>
      <p className={styles.eyebrow} key={cut ?? "phone"} data-cut={cut ? "" : undefined}>
        {cut ?? "Your phone"}
      </p>
      <p className={styles.lockDay}>{longDay(day.day, day.date)}</p>
      <p className={styles.lockClock}>
        {phoneClock(clock)}
        {/* The morning runs on into the evening: say which half of the day it is. */}
        <span className={styles.lockHalf}>{Number(clock.slice(0, 2)) < 12 ? "AM" : "PM"}</span>
      </p>
      <div className={styles.toldSlot} aria-live="polite">
        {told && <Told key={lines.indexOf(told)} line={told} />}
      </div>
      <div className={styles.notices} aria-live="polite">
        {notices.map((l) => (
          <Notice key={lines.indexOf(l)} line={l} seconds={voiceOf(l)?.seconds} />
        ))}
      </div>
      <button
        type="button"
        className={styles.quiet}
        onClick={(e) => {
          e.stopPropagation();
          more();
        }}
      >
        Go on
      </button>
    </div>
  );
}
