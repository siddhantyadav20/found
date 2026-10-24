"use client";

import { useEffect, useRef, useState } from "react";

import type { Caption } from "@/content/types";
import { bedFor, sound, useBed, warmNight } from "@/lib/found/nightSound";
import { mmss } from "@/lib/game/phone";
import { useVoice } from "@/lib/found/voice";
import { soundOn } from "@/lib/sound";
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
  voice,
  film,
}: {
  seconds: number;
  captions: readonly Caption[];
  /** The recording under the captions, where there is one (`Story.voices`). */
  voice?: string;
  /** The footage itself, picture and sound, where there is some (2026-10-24): it plays here, and the captions follow it. */
  film?: string;
  onPlayed?: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const words = useRef<HTMLOListElement>(null);
  const shown = captions.filter(
    (l) => l.at <= elapsed && (playing || elapsed > 0),
  );

  /* Heard as it plays: the bed under it, and each caption's own sound as it
     comes up. "[recording stops]" cuts the bed dead. */
  const said = useRef(0);
  const [cut, setCut] = useState(false);
  // Footage carries its own sound; without it, the captions' sounds and the voice are played instead.
  useBed(film ? undefined : bedFor(captions), playing && !cut);
  useVoice(film ? undefined : voice, playing && !cut, elapsed);
  useEffect(() => {
    if (shown.length < said.current) said.current = shown.length;
    if (!playing) return;
    for (const l of shown.slice(said.current))
      if (!film && sound(l.line) === "cut") setCut(true);
    said.current = shown.length;
  }, [shown, playing, film]);

  /* The footage leads: play and pause follow the button, the clock follows the footage. */
  const reel = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = reel.current;
    if (!film || !v) return undefined;
    v.muted = !soundOn();
    if (playing) void v.play().catch(() => setPlaying(false));
    else v.pause();
    let raf = 0;
    const tick = () => {
      setElapsed(Math.min(seconds, v.currentTime));
      raf = requestAnimationFrame(tick);
    };
    if (playing) raf = requestAnimationFrame(tick);
    const end = () => {
      setElapsed(seconds);
      setPlaying(false);
    };
    v.addEventListener("ended", end);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", end);
    };
  }, [film, playing, seconds]);

  useEffect(() => {
    if (!playing || film) return undefined;
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
    words.current?.scrollTo({
      top: words.current.scrollHeight,
      behavior: "smooth",
    });
  }, [shown.length]);

  return (
    <div className={styles.video} onPointerDown={(e) => e.stopPropagation()}>
      {film && (
        <div className={styles.film}>
          <video
            ref={reel}
            src={film}
            playsInline
            preload="metadata"
            className={styles.filmVideo}
          />
        </div>
      )}
      <div className={styles.transport}>
        <button
          type="button"
          className={styles.videoPlay}
          onClick={() => {
            warmNight();
            if (ended) {
              setElapsed(0);
              said.current = 0;
              setCut(false);
              if (reel.current) reel.current.currentTime = 0;
            }
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            ) : (
              <path d="M8 5.5v13l10.5-6.5Z" />
            )}
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
          onChange={(e) => {
            // A scrub moves past what it skipped in silence.
            const at = Number(e.target.value);
            said.current = captions.filter((l) => l.at <= at).length;
            setCut(
              captions.some(
                (l) =>
                  l.at <= at &&
                  l.line.toLowerCase().includes("recording stops"),
              ),
            );
            setElapsed(at);
            if (reel.current) reel.current.currentTime = at;
          }}
          aria-label="Position"
        />
        <span className={styles.videoTime}>{mmss(seconds)}</span>
      </div>
      <ol ref={words} className={styles.words} aria-live="polite">
        {shown.length === 0 ? (
          <li className={styles.wordsIdle}>Press play. Captions on.</li>
        ) : (
          shown.map((l) => (
            <li
              key={`${l.at}-${l.line}`}
              data-sound={l.line.startsWith("[") || undefined}
            >
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
