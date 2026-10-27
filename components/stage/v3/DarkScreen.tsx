"use client";

import { useEffect, useMemo, useState } from "react";

import type { Dark, Voices } from "@/content/types";
import { useVoice } from "@/lib/found/voice";
import { stamp } from "@/lib/found/time";
import styles from "./Screens.module.css";

/* ===========================================================================
   PG-DARK (RAAKH-V3 §6): the phone dims to black over 1.2 seconds; then one
   line, or one voice with its waveform and its words arriving a line at a
   time. No music. Used three times in the chapter, and nowhere else; the
   frozen 1:52 bubble that ends Episode 2 shares its black.
   =========================================================================== */

const BARS = 40;

/** A waveform the same shape every time for the same voice. */
function bars(seed: string): number[] {
  let n = 7;
  for (const c of seed) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: BARS }, () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return 0.18 + (n / 2 ** 32) * 0.82;
  });
}

/** One line on black: held, then the way on. */
export function DarkLine({ line, sub, onDone }: { line: string; sub?: string; onDone: () => void }) {
  return (
    <div className={styles.black} role="dialog" aria-label={line} onClick={onDone}>
      <div>
        <p className={styles.darkLine}>{line}</p>
        {sub && <p className={styles.darkSub}>{sub}</p>}
      </div>
      <button type="button" className={styles.quiet} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}

function DarkVoice({ voice, voices, onDone }: { voice: NonNullable<Dark["voice"]>; voices?: Voices; onDone: () => void }) {
  const [t, setT] = useState(0);
  const total = voice.seconds;
  // The dim takes 1.2 s; the voice starts after it.
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const go = window.setTimeout(() => setPlaying(true), 1500);
    return () => window.clearTimeout(go);
  }, []);
  useVoice(voice.key ? voices?.[voice.key]?.src : undefined, playing);
  useEffect(() => {
    if (!playing) return undefined;
    const began = performance.now();
    const tick = window.setInterval(() => setT(Math.min(total + 2, (performance.now() - began) / 1000)), 120);
    return () => window.clearInterval(tick);
  }, [playing, total]);
  const shape = useMemo(() => bars(voice.who + total), [voice.who, total]);
  const shown = voice.lines.filter((l) => l.at <= t);
  const over = t >= total + 1;
  return (
    <div className={styles.black} role="dialog" aria-label={`A voice note from ${voice.who}`}>
      <div className={styles.voice}>
        <p className={styles.voiceWho}>{voice.who}</p>
        <div className={styles.wave} aria-hidden="true">
          {shape.map((h, i) => (
            <span key={i} style={{ height: `${Math.round(h * 100)}%` }} data-on={i / BARS < t / total || undefined} />
          ))}
        </div>
        <ol className={styles.words} aria-live="polite">
          {shown.map((l) => (
            <li key={l.at} lang={l.english ? "hi-Latn" : undefined}>
              {l.line}
              {l.english && <small>{l.english}</small>}
            </li>
          ))}
        </ol>
      </div>
      {over && (
        <button type="button" className={styles.quiet} onClick={onDone}>
          Go on
        </button>
      )}
    </div>
  );
}

function DarkBubble({ bubble, onDone }: { bubble: NonNullable<Dark["bubble"]>; onDone: () => void }) {
  // Held for a second and a half, then black: it goes on by itself.
  useEffect(() => {
    const t = window.setTimeout(onDone, 3600);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className={styles.black} role="dialog" aria-label={`${bubble.who}, ${stamp(bubble.at)}: ${bubble.text}`}>
      <div className={styles.bubbleWrap}>
        <p className={styles.bubble} lang="hi-Latn">
          <b>{bubble.who}</b>
          {bubble.text}
          {bubble.english && <small>{bubble.english}</small>}
          <time>{stamp(bubble.at)}</time>
        </p>
      </div>
    </div>
  );
}

export default function DarkScreen({ dark, voices, onDone }: { dark: Dark; voices?: Voices; onDone: () => void }) {
  if (dark.bubble) return <DarkBubble bubble={dark.bubble} onDone={onDone} />;
  if (dark.voice) return <DarkVoice voice={dark.voice} voices={voices} onDone={onDone} />;
  return <DarkLine line={dark.line ?? ""} sub={dark.sub} onDone={onDone} />;
}
