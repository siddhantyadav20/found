"use client";

import { useEffect, useRef, useState } from "react";

import type { Caption } from "@/content/types";
import { mmss } from "@/lib/game/phone";
import styles from "./PhotoFrame.module.css";

/* ===========================================================================
   A clip's transport and its words: play, a scrubber, the time, and the
   captions underneath as they're said, with who said them and the English
   under anything that isn't. Until the footage exists (ASSETS.md) the
   captions are the clip, which is also how it plays with the sound off.

   The pilot's VideoControls (c03aa03), carried over. `onPlayed` fires once
   the clip has been played to its end, or scrubbed there.
   =========================================================================== */

export default function Clip({
  seconds,
  captions,
  onPlayed,
}: {
  seconds: number;
  captions: readonly Caption[];
  onPlayed?: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const words = useRef<HTMLOListElement>(null);
  const shown = captions.filter((l) => l.at <= elapsed && (playing || elapsed > 0));

  useEffect(() => {
    if (!playing) return undefined;
    const began = performance.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const e = Math.min(seconds, (performance.now() - began) / 1000);
      setElapsed(e);
      if (e >= seconds) setPlaying(false);
    }, 150);
    return () => window.clearInterval(timer);
    // Restarted by play and by a scrub, not by its own ticks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seconds]);

  const ended = elapsed >= seconds;
  useEffect(() => {
    if (ended) onPlayed?.();
  }, [ended, onPlayed]);

  // The newest line stays in view.
  useEffect(() => {
    words.current?.scrollTo({ top: words.current.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div className={styles.video} onPointerDown={(e) => e.stopPropagation()}>
      <div className={styles.transport}>
        <button
          type="button"
          className={styles.videoPlay}
          onClick={() => {
            if (ended) setElapsed(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5Z" />}
          </svg>
        </button>
        <span className={styles.videoTime}>{mmss(elapsed)}</span>
        <input
          type="range"
          className={styles.scrub}
          min={0}
          max={seconds}
          step={0.5}
          value={elapsed}
          onChange={(e) => setElapsed(Number(e.target.value))}
          aria-label="Position"
        />
        <span className={styles.videoTime}>{mmss(seconds)}</span>
      </div>
      <ol ref={words} className={styles.words} aria-live="polite">
        {shown.length === 0 ? (
          <li className={styles.wordsIdle}>Press play. Captions on.</li>
        ) : (
          shown.map((l) => (
            <li key={`${l.at}-${l.line}`} data-sound={l.line.startsWith("[") || undefined}>
              {l.who && <b>{l.who}</b>}
              <span lang={l.english ? "hi-Latn" : undefined}>{l.line}</span>
              {l.english && <small>{l.english}</small>}
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
