"use client";

import { useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Recording } from "@/content/found/types";
import { all, dayNow } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import AppBar from "./AppBar";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Recorder.module.css";

const BARS = 48;
const SKIP_S = 15;
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** A waveform that belongs to one recording: the same shape every time it's drawn. */
function wave(id: string): number[] {
  let seed = 0;
  for (const c of id) seed = (seed * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: BARS }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return 0.15 + (seed / 2 ** 32) * 0.85;
  });
}

/** "Yesterday · 23:24", the way a recordings list dates things. */
function dated(at: string, today: string): string {
  const [day, time = ""] = at.split(" ");
  const t = WEEK.indexOf(today.slice(0, 3));
  const d = WEEK.indexOf(day);
  const label = d === t ? "Today" : d === (t + 6) % 7 ? "Yesterday" : day;
  return `${label} · ${time}`;
}

/**
 * The phone's recorder: voice memos, and the calls it recorded by itself.
 * Each opens in place into a waveform, a scrubber, back and forward 15, and
 * the words as they're said, with who's speaking and the English under
 * anything that isn't. Until the recordings exist (S8), the captions are the
 * recording.
 *
 * Opening one is hearing it, for the case file: a player who scrubs to the end
 * of a six-minute recording has still chosen to open it.
 */
export default function Recorder({ state }: AppProps) {
  const ep = useStory();
  const today = dayNow(state, ep.clocks);
  const [folder, setFolder] = useState<Recording["folder"]>("memos");
  const [open, setOpen] = useState<string | null>(null);
  const all_ = (ep.recordings ?? []).filter((r) => all(state, r.requires));
  const list = all_.filter((r) => r.folder === folder);
  const hasCalls = all_.some((r) => r.folder === "calls");

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>{folder === "memos" ? "All Recordings" : "Call Recordings"}</h2>
        <div className={styles.segments} role="tablist">
          {(["memos", "calls"] as const).map((f) => (
            <button
              type="button"
              key={f}
              role="tab"
              aria-selected={folder === f}
              data-on={folder === f || undefined}
              onClick={() => {
                setFolder(f);
                setOpen(null);
              }}
            >
              {f === "memos" ? "Recordings" : "Calls"}
              {f === "calls" && hasCalls && folder !== "calls" && <span className={styles.dot} />}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className={app.empty}>{folder === "memos" ? "No recordings." : "No recorded calls."}</p>
        ) : (
          <ul className={styles.list}>
            {[...list].reverse().map((r) => (
              <li key={r.id} className={styles.item} data-open={open === r.id || undefined}>
                <button type="button" className={styles.head} onClick={() => setOpen(open === r.id ? null : r.id)}>
                  <span className={styles.title}>{r.title}</span>
                  <span className={styles.meta}>
                    <span>{dated(r.at, today)}</span>
                    <span>{mmss(r.seconds)}</span>
                  </span>
                </button>
                {open === r.id && <Player key={r.id} recording={r} />}
              </li>
            ))}
          </ul>
        )}
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

function Player({ recording }: { recording: Recording }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const words = useRef<HTMLOListElement>(null);
  const bars = wave(recording.id);
  const total = recording.seconds;
  const shown = recording.transcript.filter((l) => l.at <= elapsed && (playing || elapsed > 0));

  useEffect(() => {
    play.see(recording.evidence);
  }, [recording.evidence]);

  useEffect(() => {
    if (!playing) return;
    const began = performance.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const e = Math.min(total, (performance.now() - began) / 1000);
      setElapsed(e);
      if (e >= total) setPlaying(false);
    }, 150);
    return () => window.clearInterval(timer);
    // Restarted by play and by a skip or scrub, not by its own ticks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, total]);

  useEffect(() => {
    words.current?.scrollTo({ top: words.current.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  // A skip or a scrub while playing restarts the clock from there.
  const seek = (to: number) => {
    const next = Math.max(0, Math.min(total, to));
    setElapsed(next);
    if (playing) {
      setPlaying(false);
      window.setTimeout(() => setPlaying(true), 0);
    }
  };

  const progress = elapsed / total;

  return (
    <div className={styles.player}>
      <div className={styles.wave} aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${Math.round(h * 100)}%` }} data-on={i / BARS < progress || undefined} />
        ))}
      </div>
      <input
        type="range"
        className={styles.scrub}
        min={0}
        max={total}
        step={1}
        value={elapsed}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Position"
      />
      <div className={styles.times}>
        <span>{mmss(elapsed)}</span>
        <span>−{mmss(total - elapsed)}</span>
      </div>
      <div className={styles.transport}>
        <button type="button" className={styles.skip} onClick={() => seek(elapsed - SKIP_S)} aria-label="Back 15 seconds">
          <Skip back />
        </button>
        <button
          type="button"
          className={styles.play}
          onClick={() => {
            if (elapsed >= total) setElapsed(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5Z" />}
          </svg>
        </button>
        <button type="button" className={styles.skip} onClick={() => seek(elapsed + SKIP_S)} aria-label="Forward 15 seconds">
          <Skip />
        </button>
      </div>
      <ol ref={words} className={styles.words} aria-live="polite">
        {shown.length === 0 ? (
          <li className={styles.idle}>Press play. Captions on.</li>
        ) : (
          shown.map((l) => (
            <li key={l.at} data-sound={l.text.startsWith("[") || undefined}>
              {l.who && <b>{l.who}</b>}
              {l.text}
              {l.en && <small>{l.en}</small>}
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
