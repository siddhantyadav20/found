"use client";

import { useCallback, useRef, useState } from "react";

import type { CallCue, Story } from "@/content/types";
import { duration, hisClock, ranFor } from "@/lib/game/call";
import styles from "./LiveCall.module.css";
import CallFeed from "./CallFeed";

/* ===========================================================================
   The call, as the player holds it: full screen when it arrives, a window
   they can't close afterwards.

   Rules it keeps (PLAYER-JOURNEY Stage 3):
   - the timer only goes up, and it is never pausable
   - her mic and camera stay off until the player decides otherwise, and
     unmuting is deliberate
   - the red button works, and it costs something either way
   - everything he says is captioned, with the English under the Hinglish
   - zoom works on the feed, because the clue is in the room, not in the words

   Where the clock sits in the frame, so a zoom into it can count. The feed is
   320x240, and the clock's face is centred at (262, 56) with a radius of 21.
   =========================================================================== */
const CLOCK_BOX = { x: [0.75, 0.885], y: [0.145, 0.32] } as const;

const ZOOM_MAX = 3.5;
/** Below this the hands are a smudge; above it, the hour is unarguable. */
const ZOOM_READS = 2.4;

export default function LiveCall({
  story,
  mumbaiTime,
  elapsedMs,
  cue,
  expanded,
  muted,
  onExpand,
  onCollapse,
  onReachEnd,
  onCut,
  onUnmute,
  onReadClock,
}: {
  story: Story;
  mumbaiTime: string;
  elapsedMs: number;
  cue: CallCue | null;
  expanded: boolean;
  muted: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onReachEnd: () => void;
  onCut: () => void;
  onUnmute: () => void;
  onReadClock: () => void;
}) {
  const [asking, setAsking] = useState(false);
  const [zoom, setZoom] = useState({ scale: 1, x: 0.5, y: 0.5 });
  const frame = useRef<HTMLDivElement>(null);

  const at = useCallback((e: { clientX: number; clientY: number }) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return { x: 0.5, y: 0.5 };
    return { x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height };
  }, []);

  /** A zoom counts only once what it's aimed at is readable on screen. */
  const settle = useCallback(
    (scale: number, x: number, y: number) => {
      setZoom({ scale, x, y });
      const onClock = x >= CLOCK_BOX.x[0] && x <= CLOCK_BOX.x[1] && y >= CLOCK_BOX.y[0] && y <= CLOCK_BOX.y[1];
      if (scale >= ZOOM_READS && onClock) onReadClock();
    },
    [onReadClock],
  );

  const double = useRef(0);
  const onPointerUp = (e: React.PointerEvent) => {
    if (!expanded) return;
    const now = Date.now();
    const quick = now - double.current < 320;
    double.current = now;
    if (!quick) return;
    const { x, y } = at(e);
    settle(zoom.scale > 1.2 ? 1 : 2.8, x, y);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!expanded) return;
    const { x, y } = at(e);
    const next = Math.min(ZOOM_MAX, Math.max(1, zoom.scale - e.deltaY / 400));
    settle(next, zoom.scale === 1 ? x : zoom.x, zoom.scale === 1 ? y : zoom.y);
  };

  const ask = () => {
    // Reaching for it is what makes him break script, whichever way it ends.
    onReachEnd();
    setAsking(true);
  };

  return (
    <div className={styles.call} data-expanded={expanded ? "" : undefined}>
      <div
        ref={frame}
        className={styles.frame}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        role={expanded ? undefined : "button"}
        tabIndex={expanded ? -1 : 0}
        onClick={expanded ? undefined : onExpand}
        onKeyDown={expanded ? undefined : (e) => e.key === "Enter" && onExpand()}
      >
        <div
          className={styles.zoom}
          style={{ transform: `scale(${zoom.scale})`, transformOrigin: `${zoom.x * 100}% ${zoom.y * 100}%` }}
        >
          <CallFeed board={story.call.board} clock={hisClock(mumbaiTime)} supervisor={Boolean(cue?.supervisorPresent)} />
        </div>

        <div className={styles.top}>
          <span className={styles.who}>{story.call.caller}</span>
          <span className={styles.timer} aria-label="Call duration">
            {duration(ranFor(story, elapsedMs))}
          </span>
        </div>

        {zoom.scale > 1.2 && expanded && <span className={styles.zoomed}>{zoom.scale.toFixed(1)}×</span>}

        {/* Her side of the call: nothing. The camera was off in the pouch. */}
        {expanded && (
          <div className={styles.self} aria-hidden="true">
            <span className={styles.selfLabel}>Camera off</span>
          </div>
        )}
      </div>

      {cue && (
        <p className={styles.caption} data-whisper={cue.whisper ? "" : undefined}>
          <span className={styles.line}>{cue.line}</span>
          {cue.english && <span className={styles.english}>{cue.english}</span>}
        </p>
      )}

      {expanded && (
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={onUnmute} aria-pressed={!muted}>
            {muted ? "Unmute" : "Mic on"}
          </button>
          <button type="button" className={styles.end} onClick={ask}>
            End call
          </button>
          <button type="button" className={styles.control} onClick={onCollapse}>
            Use the phone
          </button>
        </div>
      )}

      {asking && (
        <div className={styles.sheet} role="dialog" aria-label="End the call?">
          <p className={styles.sheetAsk}>Call end karein?</p>
          <p className={styles.sheetSub}>End the call?</p>
          <button
            type="button"
            className={styles.sheetCut}
            onClick={() => {
              setAsking(false);
              onCut();
            }}
          >
            Cut it
          </button>
          <button type="button" className={styles.sheetStay} onClick={() => setAsking(false)}>
            Not yet
          </button>
        </div>
      )}
    </div>
  );
}
