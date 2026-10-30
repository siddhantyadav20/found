"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Poster } from "@/components/owner/apps/Chat";
import type { Ending, EndingLine, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { ENDING_SEEN, linesFor } from "@/lib/game/endings";
import { buzz } from "@/lib/found/buzz";
import { say, useVoice } from "@/lib/found/voice";
import { longDay, phoneClock } from "@/lib/found/time";
import ColdOpen from "../ColdOpen";
import { flag } from "../playthrough";
import ending from "../ending/Ending.module.css";
import styles from "./Screens.module.css";
import own from "./Lockscreen.module.css";

/* ===========================================================================
   The endings (RAAKH-V3 §11), on a lock screen (PG-LOCK): somebody saying
   something lands as a notification, with its sound, newest on top, and a
   pause between; what nobody says is a line under the clock; a time moves
   the clock on. Between them, what's shown another way: the media, full
   screen and played through (PG-MEDIA); the statement, to his own camera;
   the cards (PG-CARD); the ending's last image (PG-FINAL); the cold open
   again, as it was; the parcel, coming back. Then black, and the card.
   =========================================================================== */

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

/** A beat of the ending: one line, or the statement's lines together. */
type Beat = { readonly kind: NonNullable<EndingLine["kind"]> | "notice" | "told"; readonly lines: readonly EndingLine[] };

function beatsOf(lines: readonly EndingLine[]): Beat[] {
  const out: Beat[] = [];
  for (const l of lines) {
    const kind = l.kind ?? (l.who ? "notice" : "told");
    const last = out.at(-1);
    // The statement is one take; notifications seen through the envelope glow together.
    if ((kind === "statement" || kind === "glow") && last?.kind === kind) out[out.length - 1] = { kind, lines: [...last.lines, l] };
    else out.push({ kind, lines: [l] });
  }
  return out;
}

/** How long a beat holds before the next, if nobody taps. */
function holdMs(b: Beat, story: Story): number {
  const l = b.lines[0];
  switch (b.kind) {
    case "card":
      return 3200;
    case "media":
      return ((l.seconds ?? 6) + 1.2) * 1000;
    case "statement":
      return b.lines.reduce((n, x) => n + Math.max(3200, (story.voices?.[`statement:${x.text}`]?.seconds ?? 0) * 1000 + 600), 800);
    case "final":
      return 5600;
    case "glow":
      return 2200 + b.lines.length * 1800;
    case "parcel":
      return 4200;
    case "cold":
      return 0;
    default: {
      const v = l.voice ? story.voices?.[l.voice] : undefined;
      // Long enough to read it and its English (2026-10-28: long messages went by before they could be).
      const read = Math.min(10_000, 1500 + 45 * (l.text.length + (l.english?.length ?? 0)));
      return Math.max(l.poster ? 6400 : 3800, read, v ? v.seconds * 1000 + 1200 : 0);
    }
  }
}

/** Media, full screen, played through once: a still or a film, and its words at their seconds. */
function Media({ line, story }: { line: EndingLine; story: Story }) {
  const [t, setT] = useState(0);
  // What's said on it, heard (Room 6's "Aap aa gaye", the coda, the new boy behind the light).
  useVoice(line.voice ? story.voices?.[line.voice]?.src : undefined, true);
  useEffect(() => {
    const began = performance.now();
    const tick = window.setInterval(() => setT((performance.now() - began) / 1000), 150);
    return () => window.clearInterval(tick);
  }, []);
  const words = (line.captions ?? []).filter((c) => c.at <= t).slice(-2);
  return (
    <div className={own.media} role="img" aria-label={line.text}>
      {line.film ? (
        <video className={own.film} src={line.film} autoPlay playsInline muted={false} />
      ) : line.src ? (
        <Image src={line.src} alt="" fill sizes="100vw" className={own.still} />
      ) : (
        <span className={own.corridor} aria-hidden="true" />
      )}
      <p className={own.mediaTitle}>{line.text}</p>
      <div className={own.captions} aria-live="polite">
        {words.map((c) => (
          <p key={c.at} data-sound={c.line.startsWith("[") || undefined}>
            {c.who && <b>{c.who}</b>}
            <span lang={c.english ? "hi-Latn" : undefined}>{c.line}</span>
            {c.english && <small>{c.english}</small>}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Said to his own camera (6:05 AM, Room 6): the first time the player's voice is heard. */
function Statement({ lines, story }: { lines: readonly EndingLine[]; story: Story }) {
  const [n, setN] = useState(1);
  const voice = story.voices?.[`statement:${lines[n - 1]?.text}`];
  useVoice(voice?.src, true);
  useEffect(() => {
    if (n >= lines.length) return undefined;
    const t = window.setTimeout(() => setN((x) => x + 1), Math.max(3200, (voice?.seconds ?? 0) * 1000 + 600));
    return () => window.clearTimeout(t);
  }, [n, lines.length, voice]);
  return (
    <div className={own.media} role="img" aria-label="The front camera: Sameer, speaking to it">
      <Image src={story.camera?.src ?? story.owner.photo ?? ""} alt="" fill sizes="100vw" className={own.still} />
      <p className={own.rec}>● REC</p>
      <div className={own.captions} aria-live="polite">
        {lines.slice(Math.max(0, n - 2), n).map((l) => (
          <p key={l.text}>
            <b>{l.who}</b>
            <span lang="hi-Latn">{l.text}</span>
            {l.english && <small>{l.english}</small>}
          </p>
        ))}
      </div>
    </div>
  );
}

/** The last image, full bleed: a photograph, or the thing itself drawn. */
function Final({ line, glow }: { line: EndingLine; glow?: readonly EndingLine[] }) {
  return (
    <div className={own.final} role="img" aria-label={line.text}>
      {line.src ? <Image src={line.src} alt="" fill sizes="100vw" className={own.still} /> : <span className={own.drawn} aria-hidden="true" />}
      <p className={own.finalText}>{line.text}</p>
      {glow && (
        <div className={own.glow}>
          {glow.map((g) => (
            <p key={g.text}>
              <b>{g.who}</b> {g.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/** The waybill coming back: the same parcel, its next attempt. */
function Parcel({ line }: { line: EndingLine }) {
  const [stampText, ...rest] = line.text.split(" · ");
  return (
    <div className={styles.table}>
      <div className={own.waybill} role="img" aria-label={line.text}>
        <span className={own.wbCourier}>DakRoute Express · Same-city · AWB DR-4471-0926</span>
        <span className={own.wbTo}>TO MEERA ARORA</span>
        <span className={own.wbLine}>Kalkaji, New Delhi 110019</span>
        <span className={own.wbLine}>From: S. Khurrana, B-14 Navjeevan Apartments, Malviya Nagar</span>
        <span className={own.wbStamp}>
          {stampText}
          <small>{rest.join(" · ")}</small>
        </span>
      </div>
    </div>
  );
}

function Notice({ line, story }: { line: EndingLine; story: Story }) {
  const [app, name] = line.who?.includes(" · ") ? line.who.split(" · ") : ["", line.who ?? ""];
  const v = line.voice ? story.voices?.[line.voice] : undefined;
  return (
    <div className={ending.notice}>
      <span className={ending.noticeIcon} aria-hidden="true">
        {(name || app).replace(/[^A-Za-z]/g, "").slice(0, 1) || "•"}
      </span>
      <span className={ending.noticeBody}>
        <span className={ending.noticeHead}>
          <b>{name || app}</b>
          {app && <span className={ending.noticeApp}>{app}</span>}
        </span>
        {line.voice && <span className={own.voice}>🎤 Voice message · 0:{String(Math.round(v?.seconds ?? 12)).padStart(2, "0")}</span>}
        {line.text && <span lang={line.english ? "hi-Latn" : undefined}>{line.text}</span>}
        {line.english && <span className={ending.english}>{line.english}</span>}
        {line.src && (
          <span className={own.attached}>
            <Image src={line.src} alt="" fill sizes="240px" />
          </span>
        )}
        {line.poster && (
          <span className={ending.noticePoster}>
            <Poster a={line.poster} />
          </span>
        )}
      </span>
    </div>
  );
}

export default function LockscreenEnding({ story, state, end }: { story: Story; state: CaseState; end: Ending }) {
  const lines = useMemo(() => linesFor(state, end.lines), [state, end]);
  const beats = useMemo(() => beatsOf(lines), [lines]);
  const [i, setI] = useState(0);
  const black = i >= beats.length;
  const b = beats[i];
  const yours = end.on === "yours";

  useEffect(() => {
    if (black) {
      const t = window.setTimeout(() => flag(ENDING_SEEN), 2200);
      return () => window.clearTimeout(t);
    }
    if (!b || b.kind === "cold") return undefined;
    const t = window.setTimeout(() => setI((n) => n + 1), holdMs(b, story));
    return () => window.clearTimeout(t);
  }, [i, b, black, story]);

  // Somebody writing lands as it would: with the buzz, and a voice note is heard.
  useEffect(() => {
    if (b?.kind !== "notice") return undefined;
    buzz();
    const v = b.lines[0].voice ? story.voices?.[b.lines[0].voice] : undefined;
    return say(v?.src);
  }, [b, story.voices]);

  if (black) return <div className={ending.black} aria-hidden="true" />;
  // Media and the statement play through on their first showing: no tap moves them on.
  const next = () => b && b.kind !== "media" && b.kind !== "statement" && setI((n) => n + 1);

  switch (b.kind) {
    case "card":
      return (
        <div className={styles.card} role="status" onClick={next}>
          <p className={styles.cardLine}>{b.lines[0].text}</p>
        </div>
      );
    case "media":
      return <Media line={b.lines[0]} story={story} />;
    case "statement":
      return <Statement lines={b.lines} story={story} />;
    case "cold":
      return story.coldOpen ? <ColdOpen cold={story.coldOpen} voices={story.voices} replay onDone={() => setI((n) => n + 1)} /> : null;
    case "parcel":
      return (
        <div onClick={next}>
          <Parcel line={b.lines[0]} />
        </div>
      );
    case "final": {
      // What glows through the paper comes with the image it's on.
      const glow = beats[i + 1]?.kind === "glow" ? beats[i + 1].lines : undefined;
      return (
        <div onClick={next}>
          <Final line={b.lines[0]} glow={glow} />
        </div>
      );
    }
    case "glow": {
      // Shown with the image before it; on its own, it's the envelope on the table.
      if (beats[i - 1]?.kind === "final") {
        return (
          <div onClick={next}>
            <Final line={beats[i - 1].lines[0]} glow={b.lines} />
          </div>
        );
      }
      return (
        <div className={styles.table} onClick={next}>
          <div className={own.envelope} aria-hidden="true" />
          <div className={own.glow}>
            {b.lines.map((g) => (
              <p key={g.text}>
                <b>{g.who}</b> {g.text}
              </p>
            ))}
          </div>
        </div>
      );
    }
  }

  // Notifications and narration: the lock screen.
  const shown = lines.slice(0, lines.indexOf(b.lines[0]) + 1).filter((l) => !l.kind);
  const clock = shown.map(clockOf).filter(Boolean).at(-1) ?? "04:40";
  const since = Math.max(0, shown.map((l) => Boolean(l.day)).lastIndexOf(true));
  const day = [...shown].reverse().find((l) => l.day)?.day ?? end.day ?? story.clocks[2];
  const cut = b.lines[0].at && !TIME.test(b.lines[0].at.trim()) ? b.lines[0].at : undefined;
  const notices = shown.slice(since).filter((l) => l.who).reverse();
  const told = b.kind === "told" ? b.lines[0] : undefined;
  return (
    <div
      className={`${ending.screen} ${ending.morning}`}
      data-yours={yours || undefined}
      style={yours && story.yourPhone ? ({ "--wall": `url(${story.yourPhone.wallpaper})` } as CSSProperties) : undefined}
      onClick={next}
    >
      <p className={ending.eyebrow} key={cut ?? "phone"} data-cut={cut ? "" : undefined}>
        {cut ?? (yours ? "Your phone" : "His phone")}
      </p>
      <p className={ending.lockDay}>{longDay(day.day, day.date)}</p>
      <p className={ending.lockClock}>
        {phoneClock(clock)}
        <span className={ending.lockHalf}>{Number(clock.slice(0, 2)) < 12 ? "AM" : "PM"}</span>
      </p>
      <div className={ending.toldSlot} aria-live="polite">
        {told && (
          <p key={i} className={ending.toldLine}>
            {told.text}
          </p>
        )}
      </div>
      <div className={ending.notices} aria-live="polite">
        {notices.map((l) => (
          <Notice key={lines.indexOf(l)} line={l} story={story} />
        ))}
      </div>
      <button
        type="button"
        className={ending.goOn}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- the only control on a full-screen beat: Enter and Space go on (fix brief §10)
        autoFocus
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      >
        Go on
      </button>
    </div>
  );
}
