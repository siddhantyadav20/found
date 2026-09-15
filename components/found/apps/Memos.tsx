"use client";

import { useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Memo } from "@/content/found/types";
import { cue, keepAwake, playRecording, stopRecording } from "@/lib/found/memoSound";
import * as play from "../FoundPhone/actions";
import AppBar from "./AppBar";
import app from "./App.module.css";
import styles from "./Memos.module.css";

const BARS = 44;
const TICK_MS = 150;
/** How far the skip buttons jump, as Voice Memos' do. */
const SKIP_S = 15;

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** A waveform that belongs to one recording: the same shape every time it's drawn. */
function wave(id: string): number[] {
  let seed = 0;
  for (const c of id) seed = (seed * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: BARS }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return 0.18 + (seed / 2 ** 32) * 0.82;
  });
}

/**
 * Voice Memos, as iOS lays it out: All Recordings, each row opening in place
 * into its waveform, times, and the transport (back 15, play, forward 15),
 * with the transcript underneath.
 */
export default function Memos() {
  const ep = useStory();
  const [open, setOpen] = useState<string | null>(null);
  const memo = ep.memos.find((m) => m.id === open);

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>All Recordings</h2>
        <ul className={styles.list}>
          {ep.memos.map((m) => (
            <li key={m.id} className={styles.item} data-open={memo?.id === m.id || undefined}>
              <button type="button" className={styles.head} onClick={() => setOpen(open === m.id ? null : m.id)}>
                <span className={styles.title}>{m.title}</span>
                <span className={styles.meta}>
                  <span>{m.at}</span>
                  <span>{clock(m.seconds)}</span>
                </span>
              </button>
              {memo?.id === m.id && <Player key={m.id} memo={m} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Skip({ back }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d={back ? "M11 8.2A10 10 0 1 1 6 16.5" : "M21 8.2A10 10 0 1 0 26 16.5"} />
      <path d={back ? "M11.6 4.2 11 8.2l4 1" : "M20.4 4.2 21 8.2l-4 1"} />
      <text x="16" y="20" textAnchor="middle">
        15
      </text>
    </svg>
  );
}

/**
 * Playback. The recording plays through the site's own audio bus, so the
 * site's mute reaches it; the transcript runs on the same clock, one line at
 * a time. Without a recording, each line gets a sketch of its sound instead.
 */
function Player({ memo }: { memo: Memo }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // Bumped by a skip, so the playback clock restarts from the new point.
  const [jump, setJump] = useState(0);
  const at = useRef(0);
  const cued = useRef(new Set<number>());
  const lines = memo.transcript;
  const step = memo.seconds / lines.length;
  const shown = elapsed > 0 ? Math.min(lines.length, Math.floor(elapsed / step) + 1) : 0;
  const bars = wave(memo.id);

  useEffect(() => {
    if (!playing) return;
    const from = performance.now() - at.current * 1000;
    const timer = window.setInterval(() => {
      const e = Math.min(memo.seconds, (performance.now() - from) / 1000);
      at.current = e;
      setElapsed(e);
      if (memo.src) {
        // lib/sound suspends the context after two quiet seconds; a memo is
        // forty. Keep it up for as long as this is playing.
        keepAwake();
      } else {
        const due = Math.min(lines.length, Math.floor(e / step) + 1);
        for (let i = 0; i < due; i++) {
          if (cued.current.has(i)) continue;
          cued.current.add(i);
          cue(lines[i]);
        }
      }
      if (e >= memo.seconds) {
        setPlaying(false);
        stopRecording();
      }
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [playing, memo, lines, step, jump]);

  // Leaving the memo (or the app) stops it.
  useEffect(() => stopRecording, []);

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      stopRecording();
      return;
    }
    if (at.current >= memo.seconds) {
      at.current = 0;
      cued.current.clear();
      setElapsed(0);
    }
    play.see(memo.evidence);
    if (memo.src) void playRecording(memo.src, at.current);
    setPlaying(true);
  };

  const skip = (delta: number) => {
    const next = Math.max(0, Math.min(memo.seconds, at.current + delta));
    at.current = next;
    setElapsed(next);
    // Lines before the new point count as heard; the rest can be heard again.
    cued.current = new Set(Array.from({ length: Math.floor(next / step) }, (_, i) => i));
    if (playing) {
      stopRecording();
      if (memo.src) void playRecording(memo.src, next);
      setJump((j) => j + 1);
    }
  };

  const progress = elapsed / memo.seconds;

  return (
    <div className={styles.player}>
      <div className={styles.wave} aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} className={styles.waveBar} data-past={i / BARS < progress || undefined} style={{ height: `${h * 100}%` }} />
        ))}
        <span className={styles.playhead} style={{ left: `${progress * 100}%` }} />
      </div>
      <div className={styles.times}>
        <span>{clock(elapsed)}</span>
        <span>−{clock(memo.seconds - elapsed)}</span>
      </div>
      <div className={styles.transport}>
        <button type="button" className={styles.skip} onClick={() => skip(-SKIP_S)} aria-label={`Back ${SKIP_S} seconds`}>
          <Skip back />
        </button>
        <button type="button" className={styles.play} onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7Z" />
            </svg>
          )}
        </button>
        <button type="button" className={styles.skip} onClick={() => skip(SKIP_S)} aria-label={`Forward ${SKIP_S} seconds`}>
          <Skip />
        </button>
      </div>
      {shown > 0 && (
        <div className={styles.transcript}>
          <p className={styles.transcriptLabel}>Transcript</p>
          <ol className={styles.captions} aria-live="polite">
            {lines.slice(0, shown).map((line, i) => (
              <li key={i} data-now={i === shown - 1 || undefined}>
                {line}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
