"use client";

import { useEffect, useState } from "react";

import type { CallLine } from "@/content/found/types";
import styles from "./Chats.module.css";

/** Bar heights for the waveform: fixed, so a voice note looks the same every time it's drawn. */
const BARS = [3, 6, 9, 5, 11, 7, 4, 8, 12, 6, 3, 9, 7, 5, 10, 6, 4, 8, 5, 3, 7, 9, 4, 6];

/**
 * A voice note in a chat: play, a waveform that fills as it plays, the
 * length, and the words as captions under it, a line at a time. Until the
 * recording exists (S8) the captions are the voice note, so it plays silent.
 */
export default function VoiceNote({ seconds, transcript }: { seconds: number; transcript: readonly CallLine[] }) {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const playing = elapsed !== null && elapsed < seconds * 1000;
  const heard = elapsed !== null;

  useEffect(() => {
    if (!playing) return;
    const began = Date.now() - (elapsed ?? 0);
    const timer = window.setInterval(() => setElapsed(Math.min(seconds * 1000, Date.now() - began)), 100);
    return () => window.clearInterval(timer);
    // Restarted only when play is pressed, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seconds]);

  const progress = heard ? Math.min(1, (elapsed ?? 0) / (seconds * 1000)) : 0;
  const shown = heard ? transcript.filter((l) => l.at * 1000 <= (elapsed ?? 0)) : [];
  const left = Math.ceil(seconds - (elapsed ?? 0) / 1000);

  return (
    <span className={styles.voice}>
      <span className={styles.voiceRow}>
        <button
          type="button"
          className={styles.voicePlay}
          onClick={() => setElapsed(playing ? null : 0)}
          aria-label={playing ? "Stop" : "Play voice message"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5Z" />}
          </svg>
        </button>
        <span className={styles.wave} aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} style={{ height: `${h + 3}px` }} data-on={i / BARS.length < progress || undefined} />
          ))}
        </span>
        <span className={styles.voiceTime}>0:{String(playing ? left : seconds).padStart(2, "0")}</span>
      </span>
      {shown.length > 0 && (
        <span className={styles.voiceWords} aria-live="polite">
          {shown.map((l) => (
            <span key={l.at} data-sound={l.text.startsWith("[") || undefined}>
              {l.text}
              {l.en && <small>{l.en}</small>}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
