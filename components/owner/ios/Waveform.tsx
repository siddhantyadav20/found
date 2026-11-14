"use client";

import { useEffect, useMemo, useRef } from "react";

import styles from "./Waveform.module.css";

/* ===========================================================================
   One waveform for every recording (2026-11-15, MOTION.md #5): the voice
   notes in a chat, Voice Memos, the dark screens' voice and the reveal's.
   Its shape is the recording's own loudness (`Voices[key].peaks`, read from
   the file at build time), so the loud words are the tall bars; without
   peaks it falls back to a shape seeded from the recording's name.

   The playhead runs continuously on an animation frame (a custom property,
   no re-render), the played part lit through a clip, and the bars at the
   playhead swell with how loud the voice is at that instant. The page's
   own clock (`at`) is followed when there is one; otherwise it keeps time
   itself and says when it reaches the end.
   =========================================================================== */

const PER_SECOND = 25;

function level(c: string): number {
  return parseInt(c, 36) / 35;
}

/** The recording's loudness at `t` seconds, 0–1, with its floor (room tone) taken out. */
export function loudness(peaks: string | undefined, t: number): number {
  if (!peaks) return 0;
  const i = Math.floor(t * PER_SECOND);
  if (i < 0 || i >= peaks.length) return 0;
  return Math.max(0, (level(peaks[i]) - 0.08) / 0.92);
}

function shapeOf(peaks: string | undefined, seed: string, bars: number): number[] {
  if (peaks) {
    const levels = Array.from(peaks, level);
    const floor = Math.min(...levels);
    const top = Math.max(...levels) - floor || 1;
    return Array.from({ length: bars }, (_, i) => {
      const from = Math.floor((i * levels.length) / bars);
      const to = Math.max(from + 1, Math.floor(((i + 1) * levels.length) / bars));
      const m = Math.max(...levels.slice(from, to));
      return 0.12 + 0.88 * ((m - floor) / top);
    });
  }
  let s = 0;
  for (const c of seed) s = (s * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: bars }, () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return 0.15 + (s / 2 ** 32) * 0.85;
  });
}

export default function Waveform({
  peaks,
  seed,
  bars,
  seconds,
  playing,
  at,
  onEnd,
  knob,
  className,
}: {
  peaks?: string;
  /** What the fallback shape is seeded from: the recording's id. */
  seed: string;
  bars: number;
  seconds: number;
  playing: boolean;
  /** The page's own clock, in seconds; the waveform runs smoothly between its ticks. */
  at?: number;
  /** With no `at`: reached the end of its own clock. */
  onEnd?: () => void;
  /** WhatsApp's knob riding the playhead. */
  knob?: boolean;
  className?: string;
}) {
  const shape = useMemo(() => shapeOf(peaks, seed, bars), [peaks, seed, bars]);
  const el = useRef<HTMLSpanElement>(null);
  const own = useRef(0);
  const end = useRef(onEnd);
  useEffect(() => {
    end.current = onEnd;
  }, [onEnd]);

  // Where the playhead sits while nothing is playing.
  useEffect(() => {
    if (playing) return;
    const p = at ?? own.current;
    el.current?.style.setProperty("--p", String(Math.min(1, p / seconds)));
    el.current?.style.setProperty("--amp", "0");
  }, [playing, at, seconds]);

  useEffect(() => {
    if (!playing) return undefined;
    const from = at ?? (own.current >= seconds ? 0 : own.current);
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(seconds, from + (now - began) / 1000);
      own.current = t;
      el.current?.style.setProperty("--p", String(t / seconds));
      el.current?.style.setProperty("--amp", loudness(peaks, t).toFixed(2));
      if (t >= seconds && at === undefined) {
        own.current = 0;
        end.current?.();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `at` resyncs the clock on each of the page's ticks.
  }, [playing, at, seconds, peaks]);

  const row = (lit?: boolean) => (
    <span className={lit ? styles.lit : styles.row}>
      {shape.map((h, i) => (
        <span key={i} style={{ height: `${Math.round(h * 100)}%`, ["--i" as string]: (i + 0.5) / bars }} />
      ))}
    </span>
  );

  return (
    <span
      ref={el}
      className={`${styles.wave} ${className ?? ""}`}
      style={{ ["--n" as string]: bars }}
      data-playing={playing || undefined}
      aria-hidden="true"
    >
      {row()}
      {row(true)}
      {knob && <i className={styles.knob} />}
    </span>
  );
}

/**
 * A caller still talking (the call screen's "Listening…"): five bars that
 * move with the line being heard, from its recording's loudness, started
 * when the line was. Without a recording (or with the sound off) they
 * breathe on their own, as the three dots did.
 */
export function Meter({ peaks, className }: { peaks?: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!peaks) return undefined;
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = (now - began) / 1000;
      el.current?.childNodes.forEach((bar, i) => {
        const v = loudness(peaks, t - i * 0.06);
        (bar as HTMLElement).style.scale = `1 ${(0.25 + 0.75 * v).toFixed(2)}`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [peaks]);
  return (
    <span ref={el} className={`${styles.meter} ${className ?? ""}`} data-live={peaks ? "" : undefined} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
