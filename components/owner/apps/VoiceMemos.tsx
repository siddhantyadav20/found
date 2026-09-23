"use client";

import { useEffect, useRef, useState } from "react";

import type { Memo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { memos, mmss } from "@/lib/game/phone";
import app from "../ios/App.module.css";
import styles from "./VoiceMemos.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Voice Memos: All Recordings, and Recently Deleted, which keeps a recording
   for 30 days and puts it back on Recover (real iOS behaviour, and one of the
   places a chapter can hide something one tap further than people look).

   Each recording opens in place into a waveform, a scrubber, back and forward
   15, and the words as they're said, with the English under anything that
   isn't. Until the recordings exist (ASSETS.md), the captions are the
   recording. Opening one is hearing it, for the case file.

   The pilot's Recorder (c03aa03), carried over.
   =========================================================================== */

const BARS = 48;
const SKIP_S = 15;

/** A waveform that belongs to one recording: the same shape every time it's drawn. */
function wave(id: string): number[] {
  let seed = 0;
  for (const c of id) seed = (seed * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: BARS }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return 0.15 + (seed / 2 ** 32) * 0.85;
  });
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

function Player({ memo }: { memo: Memo }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const words = useRef<HTMLOListElement>(null);
  const bars = wave(memo.id);
  const total = memo.seconds;
  const shown = memo.lines.filter((l) => l.at <= elapsed && (playing || elapsed > 0));

  useEffect(() => {
    if (!playing) return undefined;
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
    setElapsed(Math.max(0, Math.min(total, to)));
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

export default function VoiceMemos({
  story,
  state,
  onRead,
  onRestore,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
}) {
  const [folder, setFolder] = useState<"all" | "deleted">("all");
  const [open, setOpen] = useState<string | null>(null);
  const { recordings, bin } = memos(story, state);
  const list = folder === "all" ? recordings : bin;

  return (
    <div className={app.body}>
      <h2 className={app.big}>{folder === "all" ? "All Recordings" : "Recently Deleted"}</h2>
      <div className={styles.segments} role="tablist">
        {(["all", "deleted"] as const).map((f) => (
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
            {f === "all" ? "All Recordings" : "Recently Deleted"}
          </button>
        ))}
      </div>
      {folder === "deleted" && <p className={app.note}>Recordings are kept for 30 days before they&apos;re gone.</p>}
      {list.length === 0 ? (
        <p className={app.empty}>No recordings.</p>
      ) : (
        <ul className={styles.list}>
          {[...list].reverse().map((m) => (
            <li key={m.id} className={styles.item} data-open={open === m.id || undefined}>
              <button
                type="button"
                className={styles.head}
                onClick={() => {
                  setOpen(open === m.id ? null : m.id);
                  if (m.evidence) onRead([m.evidence]);
                }}
              >
                <span className={styles.title}>{m.title}</span>
                <span className={styles.meta}>
                  <span>
                    {folder === "deleted" ? `${m.daysLeft ?? 30} days` : `${m.day} · ${stamp(m.at)}`}
                  </span>
                  <span>{mmss(m.seconds)}</span>
                </span>
              </button>
              {open === m.id && <Player key={m.id} memo={m} />}
              {open === m.id && folder === "deleted" && (
                <button
                  type="button"
                  className={styles.recover}
                  onClick={() => {
                    onRestore(m.id);
                    setOpen(null);
                  }}
                >
                  Recover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
