"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { Shot, Story } from "@/content/types";
import { chosenIn, clockOf, filedClaim, type CaseState } from "@/lib/game/engine";
import { exchanges, saidNow } from "@/lib/game/reading";
import { ringtone } from "@/lib/found/tones";
import { say } from "@/lib/found/voice";
import { stamp } from "@/lib/found/time";
import styles from "./Screens.module.css";

/* ===========================================================================
   "Previously on Raakh" and "Next on Raakh" (PG-PREV, PG-NEXT): shots, one
   at a time, TV-style, skippable. Previously is assembled from this
   player's save (their filed sentences being typed, what they said and
   when); a shot with nothing in the save for it is left out. Next shows
   what's coming and answers nothing.
   =========================================================================== */

/** What a shot shows, resolved against the save; null when there's nothing to show. */
type Ready = { readonly shot: Shot; readonly text?: string; readonly sub?: string; readonly ms: number };

function resolve(story: Story, s: CaseState, shot: Shot): Ready | null {
  if (!saidNow(s, { text: "", needs: shot.needs, any: shot.any, unless: shot.unless })) return null;
  switch (shot.kind) {
    case "filed": {
      const q = story.questions.find((x) => x.id === shot.question);
      const c = q && filedClaim(q, s);
      return c ? { shot, text: c.text, ms: Math.min(6500, 1400 + c.text.length * 32) } : null;
    }
    case "said": {
      const r = exchanges(story).find((x) => x.id === shot.reply);
      const o = r && chosenIn(s, r);
      if (!o) return null;
      const when = clockOf(s, `said:${o.sets?.[0]}`);
      return { shot, text: o.text, sub: `${when ? `${stamp(when)} · ` : ""}to ${shot.to}`, ms: 3600 };
    }
    case "voice":
      return { shot, ms: 3200 };
    case "card":
      return { shot, ms: 2600 };
    case "black":
      return { shot, ms: (shot.seconds ?? 1) * 1000 };
    case "battery":
      return { shot, ms: 3000 };
    case "image":
      return { shot, ms: 1800 };
    case "ring":
      return { shot, ms: 2600 };
    case "lock":
      return { shot, ms: 2400 };
    default:
      return { shot, ms: 2600 };
  }
}

/** A sentence typed out a character at a time. */
function Typed({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return undefined;
    const t = window.setTimeout(() => setN((x) => x + 1), 24);
    return () => window.clearTimeout(t);
  }, [n, text]);
  return (
    <p className={styles.typed}>
      {text.slice(0, n)}
      <span className={styles.caret} aria-hidden="true" />
    </p>
  );
}

function Battery({ from, to }: { from: number; to: number }) {
  const [at, setAt] = useState(from);
  useEffect(() => {
    const t = window.setTimeout(() => setAt(to), 300);
    return () => window.clearTimeout(t);
  }, [to]);
  return (
    <p className={styles.battery} aria-label={`Battery, ${from}% to ${to}%`}>
      <span className={styles.cell} aria-hidden="true">
        <i style={{ width: `${Math.max(4, at * 0.52)}px` }} />
      </span>
      {at}%
    </p>
  );
}

function Lock({ digits }: { digits: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= digits) return undefined;
    const t = window.setTimeout(() => setN((x) => x + 1), 420);
    return () => window.clearTimeout(t);
  }, [n, digits]);
  return (
    <span className={styles.dots} aria-label="A padlock, its code going in">
      {Array.from({ length: digits }, (_, i) => (
        <i key={i} data-on={i < n || undefined} />
      ))}
    </span>
  );
}

function ShotView({ ready, story }: { ready: Ready; story: Story }) {
  const { shot } = ready;
  useEffect(() => {
    if (shot.kind === "voice") return say(shot.voice ? story.voices?.[shot.voice]?.src : undefined);
    if (shot.kind === "ring") return ringtone();
    return undefined;
  }, [shot, story.voices]);
  switch (shot.kind) {
    case "card":
      return (
        <div className={styles.shot}>
          <p className={styles.typed}>{shot.text}</p>
          {shot.sub && <small>{shot.sub}</small>}
        </div>
      );
    case "filed":
      return (
        <div className={styles.shot}>
          <p className={styles.shotLabel}>You filed</p>
          <Typed text={ready.text ?? ""} />
        </div>
      );
    case "said":
      return (
        <div className={styles.shot}>
          <p className={styles.shotLabel}>You said</p>
          <p className={styles.said} lang="hi-Latn">
            “{ready.text}”<small>{ready.sub}</small>
          </p>
        </div>
      );
    case "voice":
      return (
        <div className={styles.shot}>
          {shot.who && <p className={styles.shotLabel}>{shot.who}</p>}
          <p className={styles.said} lang="hi-Latn">
            “{shot.text}”{shot.english && <small>{shot.english}</small>}
          </p>
        </div>
      );
    case "banner":
      return (
        <div className={styles.banner} role="img" aria-label={`${shot.from}${shot.text ? `: ${shot.text}` : ""}`}>
          <i aria-hidden="true" />
          <span>
            <b>{shot.from}</b>
            {shot.text && <span lang="hi-Latn">{shot.text}</span>}
          </span>
        </div>
      );
    case "battery":
      return <Battery from={shot.from} to={shot.to} />;
    case "image":
      return (
        <span className={styles.image} data-blur={shot.blur || undefined}>
          <Image src={shot.src} alt="" fill sizes="320px" />
        </span>
      );
    case "ring":
      return (
        <div className={styles.ring}>
          <b>{shot.from}</b>
          <span>calling…</span>
        </div>
      );
    case "sound":
      return <p className={styles.sound}>{shot.text}</p>;
    case "lock":
      return <Lock digits={shot.digits} />;
    case "bubble":
      return (
        <p className={styles.bubble} lang="hi-Latn">
          <b>{shot.who}</b>
          {shot.text}
          {shot.english && <small>{shot.english}</small>}
          <time>{stamp(shot.at)}</time>
        </p>
      );
    case "black":
      return null;
  }
}

export default function Reel({
  story,
  state,
  shots,
  label,
  onDone,
}: {
  story: Story;
  state: CaseState;
  shots: readonly Shot[];
  /** "Previously on Raakh", "Next on Raakh". */
  label: string;
  onDone: () => void;
}) {
  const ready = useMemo(() => shots.map((x) => resolve(story, state, x)).filter((r): r is Ready => Boolean(r)), [shots, story, state]);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= ready.length) {
      onDone();
      return undefined;
    }
    const t = window.setTimeout(() => setI((n) => n + 1), ready[i].ms);
    return () => window.clearTimeout(t);
  }, [i, ready, onDone]);
  const now = ready[i];

  return (
    <div className={styles.reel} role="dialog" aria-label={label} onClick={() => setI((n) => n + 1)}>
      <p className={styles.reelHead}>{label}</p>
      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          onDone();
        }}
      >
        Skip
      </button>
      {now && <ShotView key={i} ready={now} story={story} />}
    </div>
  );
}
