"use client";

import { useEffect, useRef, useState } from "react";

import type { Memo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { calendarOf, memos, mmss } from "@/lib/game/phone";
import { Page } from "../AppView";
import app from "../ios/App.module.css";
import { Chevron } from "../ios/AppBar";
import { heard } from "@/lib/found/heard";
import { useVoice } from "@/lib/found/voice";
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

function Player({ memo, voice }: { memo: Memo; voice?: string }) {
  const [elapsed, setElapsed] = useState(0);
  // Its evidence counts once it has been heard past its revealing line (fix brief H-23).
  const revealed = elapsed >= (memo.lines.find((l) => l.reveals)?.at ?? memo.seconds);
  useEffect(() => {
    if (revealed && memo.evidence) heard(memo.evidence);
  }, [revealed, memo.evidence]);
  const [playing, setPlaying] = useState(false);
  useVoice(voice, playing, elapsed);
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

/** The two folders, as Voice Memos lists them, with their SF glyphs. */
const FOLDERS = [
  { id: "all", label: "All Recordings", d: "M4 10v4M7.5 7v10M11 4.5v15M14.5 8v8M18 6v12M21 10.5v3" },
  { id: "deleted", label: "Recently Deleted", d: "M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13h9l1-13M10.5 10v6.5M13.5 10v6.5" },
] as const;

export default function VoiceMemos({
  story,
  state,
  onRead,
  onRestore,
  onHome,
  onDelete,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
  onHome?: () => void;
  /** Delete a recording the phone lets go of: to Recently Deleted, or from there for good (RAAKH-V3 §17). */
  onDelete?: (id: string, how: "soft" | "perm") => void;
}) {
  const [folder, setFolder] = useState<"all" | "deleted" | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  // What Recover just moved, said where the player is looking (it used to vanish without a word).
  const [recovered, setRecovered] = useState<string | null>(null);
  const { recordings, bin } = memos(story, state);
  // What the phone lets go of: a recording whose evidence is marked deletable.
  const deletable = (m: Memo) => Boolean(m.evidence && story.evidence.find((e) => e.id === m.evidence)?.deletable);
  const cal = calendarOf(story, state);

  // Voice Memos' first screen: its folders, and how much is in each.
  if (!folder)
    return (
      <Page title="Voice Memos" large root onBack={onHome} backLabel="Home" tint="#ff453a">
        <ul className={app.group}>
          {FOLDERS.map((f) => (
            <li key={f.id}>
              <button type="button" className={app.row} onClick={() => setFolder(f.id)}>
                <svg viewBox="0 0 24 24" className={styles.folderIcon} aria-hidden="true">
                  <path d={f.d} />
                </svg>
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{f.label}</span>
                </span>
                <span className={app.rowMeta}>{(f.id === "all" ? recordings : bin).length}</span>
                <Chevron />
              </button>
            </li>
          ))}
        </ul>
      </Page>
    );

  const list = folder === "all" ? recordings : bin;
  return (
    <Page
      title={folder === "all" ? "All Recordings" : "Recently Deleted"}
      large
      onBack={() => {
        setFolder(null);
        setOpen(null);
        setRecovered(null);
      }}
      backLabel="Voice Memos"
      tint="#ff453a"
      tabbed={folder === "all"}
    >
      {folder === "deleted" && <p className={styles.keep}>Recordings are kept for 30 days before they&apos;re gone.</p>}
      {recovered && (
        <p className={styles.keep} role="status">
          “{recovered}” is back in All Recordings.
        </p>
      )}
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
                    {folder === "deleted" ? `${m.daysLeft ?? 30} days` : `${cal.label(m.day)} · ${stamp(m.at)}`}
                  </span>
                  <span>{mmss(m.seconds)}</span>
                </span>
              </button>
              {open === m.id && <Player key={m.id} memo={m} voice={story.voices?.[`memo:${m.id}`]?.src} />}
              {open === m.id && folder === "deleted" && (
                <span className={styles.binActs}>
                  <button
                    type="button"
                    className={styles.recover}
                    onClick={() => {
                      onRestore(m.id);
                      setOpen(null);
                      setRecovered(m.title);
                    }}
                  >
                    Recover
                  </button>
                  {onDelete && deletable(m) && (
                    <button
                      type="button"
                      className={styles.recover}
                      data-danger
                      onClick={() => {
                        onDelete(m.id, "perm");
                        setOpen(null);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </span>
              )}
              {open === m.id && folder === "all" && onDelete && deletable(m) && (
                <button
                  type="button"
                  className={styles.recover}
                  data-danger
                  onClick={() => {
                    onDelete(m.id, "soft");
                    setOpen(null);
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* The record button, in its well at the bottom, as the app always has it. */}
      {folder === "all" && (
        <div className={styles.recordBar} aria-hidden="true">
          <span className={styles.record}>
            <span />
          </span>
        </div>
      )}
    </Page>
  );
}
