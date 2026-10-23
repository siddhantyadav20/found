"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { EndingLine, Story } from "@/content/types";
import { clockNow, type CaseState } from "@/lib/game/engine";
import { chosen, ENDING_SEEN, linesFor } from "@/lib/game/endings";
import { buzz } from "@/lib/found/buzz";
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

/** A notification: who, what, and the English under it. */
function Notice({ line }: { line: EndingLine }) {
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
        <span lang={line.english ? "hi-Latn" : undefined}>{line.text}</span>
        {line.english && <span className={styles.english}>{line.english}</span>}
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
    const t = window.setTimeout(more, atLast ? LAST_MS : LINE_MS);
    return () => window.clearTimeout(t);
  }, [black, atLast, shown]);

  // Someone writing to you lands as it would: with the buzz.
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
              <p key={i} className={styles.lastSaid}>
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

  const seen = lines.slice(0, shown);
  const clock = seen.map(clockOf).filter(Boolean).at(-1) ?? start;
  const told = [...seen].reverse().find((l) => !l.who);
  const notices = seen.filter((l) => l.who).reverse();

  return (
    <div className={`${styles.screen} ${styles.morning}`} onClick={more}>
      <p className={styles.eyebrow}>Your phone</p>
      <p className={styles.lockDay}>{longDay(story.clocks[2].day, story.clocks[2].date)}</p>
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
          <Notice key={lines.indexOf(l)} line={l} />
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
