"use client";

import { useEffect, useState } from "react";

import type { Dark, Voices } from "@/content/types";
import { useVoice } from "@/lib/found/voice";
import Waveform from "@/components/owner/ios/Waveform";
import { stamp } from "@/lib/found/time";
import styles from "./Screens.module.css";

/* ===========================================================================
   PG-DARK (RAAKH-V3 §6): the phone dims to black over 1.2 seconds; then one
   line, or one voice with its waveform and its words arriving a line at a
   time. No music. Used three times in the chapter, and nowhere else; the
   frozen 1:52 bubble that ends Episode 2 shares its black.
   =========================================================================== */

const BARS = 40;

/** One line on black: held, then the way on. */
export function DarkLine({ line, sub, onDone }: { line: string; sub?: string; onDone: () => void }) {
  return (
    <div className={styles.black} role="dialog" aria-label={line} onClick={onDone}>
      <div>
        <p className={styles.darkLine}>{line}</p>
        {sub && <p className={`eyebrow ${styles.darkSub}`}>{sub}</p>}
      </div>
      <button type="button" className={`act-quiet ${styles.quiet}`} onClick={onDone} autoFocus>
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
  const rec = voice.key ? voices?.[voice.key] : undefined;
  useVoice(rec?.src, playing);
  useEffect(() => {
    if (!playing) return undefined;
    const began = performance.now();
    const tick = window.setInterval(() => setT(Math.min(total + 2, (performance.now() - began) / 1000)), 120);
    return () => window.clearInterval(tick);
  }, [playing, total]);
  const shown = voice.lines.filter((l) => l.at <= t);
  const over = t >= total + 1;
  return (
    <div className={styles.black} role="dialog" aria-label={`A voice note from ${voice.who}`}>
      <div className={styles.voice}>
        <p className={`eyebrow ${styles.voiceWho}`}>{voice.who}</p>
        <Waveform
          className={styles.wave}
          peaks={rec?.peaks}
          seed={voice.who + total}
          bars={BARS}
          seconds={total}
          playing={playing && t < total}
          at={Math.min(t, total)}
        />
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
        <button type="button" className={`act-quiet ${styles.quiet}`} onClick={onDone} autoFocus>
          Go on
        </button>
      )}
    </div>
  );
}

function DarkBubble({ bubble, onDone }: { bubble: NonNullable<Dark["bubble"]>; onDone: () => void }) {
  /* Held, and then the episode is said to be over; the player goes on when
     they're ready (2026-10-28: it used to cut away by itself, abruptly). */
  const [over, setOver] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOver(true), 1800);
    return () => window.clearTimeout(t);
  }, []);
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
      {over && (
        <button type="button" className={`act-quiet ${styles.quiet}`} onClick={onDone} autoFocus>
          Go on
        </button>
      )}
    </div>
  );
}

export default function DarkScreen({ dark, voices, onDone }: { dark: Dark; voices?: Voices; onDone: () => void }) {
  if (dark.bubble) return <DarkBubble bubble={dark.bubble} onDone={onDone} />;
  if (dark.voice) return <DarkVoice voice={dark.voice} voices={voices} onDone={onDone} />;
  return <DarkLine line={dark.line ?? ""} sub={dark.sub} onDone={onDone} />;
}
