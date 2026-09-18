"use client";

import type { EndingLine } from "@/content/types";
import { episodeStart, type CaseState } from "@/lib/game/engine";
import { useNow } from "@/lib/found/now";
import styles from "./Ending.module.css";

/* The pieces every act shares: the call still running on the player's own
   phone, and a map on it. */

const two = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** "Mumbai Crime Branch ✔ · 14:22", counting since 10:30, or ended. */
export function CallBar({ state, ended }: { state: CaseState; ended?: boolean }) {
  const now = useNow(1000);
  // The arrest rang about a minute into the morning.
  const secs = now ? Math.max(0, Math.floor((now - episodeStart(state)) / 1000) - 60) : 0;
  return (
    <div className={styles.callBar} data-ended={ended || undefined} role="status">
      <span className={styles.callDot} aria-hidden="true" />
      <span className={styles.callWho}>Mumbai Crime Branch ✔ · WhatsApp video</span>
      <span className={styles.callTime}>{ended ? "Call ended" : `${two(secs / 60)}:${two(secs % 60)}`}</span>
    </div>
  );
}

export type Place = "bkc" | "dadar" | "chowpatty";

const PLACES: Record<Place, { name: string; sub: string; route: string; pin: [number, number] }> = {
  bkc: { name: "Cyber Police Station, BKC", sub: "Bandra Kurla Complex · 26 min", route: "M150 172 L170 140 L205 128 L232 96 L262 74", pin: [262, 74] },
  dadar: { name: "Dadar Police Station", sub: "Nearest station · 7 min", route: "M150 172 L150 150 L128 140", pin: [128, 140] },
  chowpatty: { name: "Dadar Chowpatty", sub: "The sea · 12 min on foot", route: "M150 172 L130 160 L104 150 L84 132 L66 128", pin: [66, 128] },
};

export const placeName = (p: Place) => PLACES[p].name;

/** A plain drawn map: the coast, a few roads, you, and where you are going. */
export function RouteMap({ to, walk }: { to: Place; walk?: boolean }) {
  const p = PLACES[to];
  return (
    <figure className={styles.column} style={{ margin: 0 }}>
      <div className={styles.map}>
        <svg viewBox="0 0 320 220" role="img" aria-label={`Map to ${p.name}`}>
          <path d="M0 0 H70 C60 50 48 90 60 130 C68 160 52 190 40 220 H0 Z" fill="#1d3848" />
          <g stroke="#2a2d33" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M60 172 H300" />
            <path d="M150 220 V20" />
            <path d="M80 60 L300 200" />
            <path d="M100 20 L260 120" />
          </g>
          <path className={styles.route} d={p.route} data-walk={walk || undefined} />
          <circle cx="150" cy="172" r="7" fill="#0a84ff" stroke="#fff" strokeWidth="3" />
          <circle cx={p.pin[0]} cy={p.pin[1]} r="8" fill="#ff453a" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>
      <figcaption>
        <p className={styles.placeName}>{p.name}</p>
        <p className={styles.placeSub}>{p.sub}</p>
      </figcaption>
    </figure>
  );
}

/** A line of an ending: narration, or a message from somebody. */
export function Line({ line, friend, named = true }: { line: EndingLine; friend: string; named?: boolean }) {
  const hinglish = line.english ? "hi-Latn" : undefined;
  return (
    <div className={styles.beat}>
      {line.at && <span className={styles.at}>{line.at}</span>}
      {line.who ? (
        <p className={styles.bubble} data-mine={line.who === "You" || undefined}>
          {named && <span className={styles.from}>{line.who === "friend" ? friend : line.who}</span>}
          <span lang={hinglish}>{line.text}</span>
          {line.english && <span className={styles.english}>{line.english}</span>}
        </p>
      ) : (
        <p className={styles.told}>
          <span lang={hinglish}>{line.text}</span>
          {line.english && <span className={styles.english}>{line.english}</span>}
        </p>
      )}
    </div>
  );
}
