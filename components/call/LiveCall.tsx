"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { drag } from "@/components/stage/drag";

import type { CallCue, Reply, ReplyOption, Story } from "@/content/types";
import { duration, hisClock, ranFor } from "@/lib/game/call";
import type { CaseState } from "@/lib/game/engine";
import { useNow } from "@/lib/found/now";
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
/* The two things in his room that are evidence carry `data-zone` in the feed
   itself, so a zoom counts by hitting the drawing rather than by landing in a
   rectangle worked out from the frame. The frame letterboxes; the drawing
   doesn't move. */

const ZOOM_MAX = 3.5;
/** How long a thumb has to stay on Unmute. Speaking is never an accident. */
const HOLD_TO_SPEAK_MS = 900;

/** The only thing on the page that changes every second. */
function Timer({ story, state }: { story: Story; state: CaseState }) {
  const now = useNow(1000);
  return <>{now ? duration(ranFor(story, state, now)) : null}</>;
}
/** Below this the hands are a smudge; above it, the hour is unarguable. */
const ZOOM_READS = 2.4;

export default function LiveCall({
  story,
  mumbaiTime,
  state,
  cue,
  expanded,
  muted,
  onExpand,
  onCollapse,
  onReachEnd,
  onCut,
  onUnmute,
  onReadClock,
  onReadLabel,
  reply,
  onSay,
}: {
  story: Story;
  mumbaiTime: string;
  state: CaseState;
  cue: CallCue | null;
  expanded: boolean;
  muted: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onReachEnd: () => void;
  onCut: () => void;
  onUnmute: () => void;
  onReadClock: () => void;
  onReadLabel: () => void;
  /** What the player may say, once they have unmuted. */
  reply?: Reply | null;
  onSay?: (option: ReplyOption) => void;
}) {
  const [asking, setAsking] = useState(false);
  /* Unmuting is held, not tapped (PLAYER-JOURNEY Stage 3): the ring fills
     while the thumb stays down, and letting go early changes nothing. */
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const letGo = () => {
    window.clearTimeout(holdTimer.current);
    setHolding(false);
  };
  const press = () => {
    if (!muted) return;
    setHolding(true);
    holdTimer.current = window.setTimeout(() => {
      setHolding(false);
      onUnmute();
    }, HOLD_TO_SPEAK_MS);
  };
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);
  /* Where the window is parked. iOS lets a picture-in-picture call be thrown
     to any corner, and it snaps there; so does this one. */
  const [corner, setCorner] = useState<"tr" | "br" | "tl" | "bl">("tr");
  const callRef = useRef<HTMLDivElement>(null);

  const throwIt = (e: React.PointerEvent) => {
    const el = callRef.current;
    if (expanded || !el) return;
    const box = el.getBoundingClientRect();
    const screen = el.parentElement?.getBoundingClientRect();
    if (!screen) return;
    drag(e, {
      engage: (dx, dy) => Math.hypot(dx, dy) > 6,
      move: (dx, dy) => {
        el.style.transition = "none";
        el.style.translate = `${dx}px ${dy}px`;
      },
      end: ({ dx, dy }) => {
        const cx = box.left + box.width / 2 + dx - screen.left;
        const cy = box.top + box.height / 2 + dy - screen.top;
        const right = cx > screen.width / 2;
        const lower = cy > screen.height / 2;
        el.style.transition = "translate 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.05)";
        el.style.translate = "";
        setCorner(`${lower ? "b" : "t"}${right ? "r" : "l"}` as typeof corner);
      },
    });
  };
  const [zoom, setZoom] = useState({ scale: 1, x: 0.5, y: 0.5 });
  const frame = useRef<HTMLDivElement>(null);

  const at = useCallback((e: { clientX: number; clientY: number }) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return { x: 0.5, y: 0.5 };
    return { x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height };
  }, []);

  /** A zoom counts only once what it's aimed at is readable on screen. */
  const settle = useCallback(
    (scale: number, x: number, y: number, zone?: string | null) => {
      setZoom({ scale, x, y });
      if (scale < ZOOM_READS) return;
      if (zone === "clock") onReadClock();
      if (zone === "label") onReadLabel();
    },
    [onReadClock, onReadLabel],
  );

  /** What was under the finger: the clock, the extinguisher, or the room. */
  const zoneAt = (e: React.PointerEvent | React.WheelEvent): string | null => {
    const el = e.target as Element | null;
    return el?.closest?.("[data-zone]")?.getAttribute("data-zone") ?? null;
  };

  const double = useRef(0);
  const onPointerUp = (e: React.PointerEvent) => {
    if (!expanded) return;
    const now = Date.now();
    const quick = now - double.current < 320;
    double.current = now;
    if (!quick) return;
    const { x, y } = at(e);
    settle(zoom.scale > 1.2 ? 1 : 2.8, x, y, zoneAt(e));
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!expanded) return;
    const { x, y } = at(e);
    const next = Math.min(ZOOM_MAX, Math.max(1, zoom.scale - e.deltaY / 400));
    settle(next, zoom.scale === 1 ? x : zoom.x, zoom.scale === 1 ? y : zoom.y, zoneAt(e));
  };

  const ask = () => {
    // Reaching for it is what makes him break script, whichever way it ends.
    onReachEnd();
    setAsking(true);
  };

  return (
    <div
      ref={callRef}
      className={styles.call}
      data-expanded={expanded ? "" : undefined}
      data-corner={expanded ? undefined : corner}
      onPointerDown={throwIt}
      data-no-swipe
    >
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
            <Timer story={story} state={state} />
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
        <p className={styles.caption} data-whisper={cue.whisper ? "" : undefined} aria-hidden="true">
          <span className={styles.line}>{cue.line}</span>
          {cue.english && <span className={styles.english}>{cue.english}</span>}
        </p>
      )}

      {/* What he says is read out even with the window put away, and in the
          language he says it in, so a screen reader doesn't mangle it. */}
      <p className="sr" role="log" aria-live="polite">
        {cue && (
          <>
            <span lang="hi-Latn">{cue.line}</span> {cue.english}
          </>
        )}
      </p>

      {/* Unmuted, with something to say: he is a person, and the player has
          just decided to speak to him. Picked from a list, never typed. */}
      {expanded && !muted && reply && onSay && (
        <div className={styles.say}>
          {reply.prompt && <p className={styles.sayPrompt}>{reply.prompt}</p>}
          {reply.options.map((o) => (
            <button key={o.id} type="button" className={styles.sayOption} onClick={() => onSay(o)}>
              <span lang={o.english ? "hi-Latn" : undefined}>{o.text}</span>
              {o.english && <span className={styles.english}>{o.english}</span>}
            </button>
          ))}
        </div>
      )}

      {/* FaceTime's own controls: round glass buttons, a label under each, and
          the red one in the middle. "Minimise" is how iOS puts a call away. */}
      {expanded && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.round}
            onPointerDown={press}
            onPointerUp={letGo}
            onPointerLeave={letGo}
            onPointerCancel={letGo}
            onContextMenu={(e) => e.preventDefault()}
            // A keyboard has no hold. Enter is already a deliberate act.
            onClick={(e) => e.detail === 0 && onUnmute()}
            aria-pressed={!muted}
            aria-label={muted ? "Hold to unmute" : "Unmuted"}
            data-on={!muted || undefined}
            data-holding={holding || undefined}
            style={{ ["--hold" as string]: `${HOLD_TO_SPEAK_MS}ms` }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="3.5" width="6" height="11" rx="3" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
              {muted && <path d="M4 4l16 16" />}
            </svg>
            <span>{muted ? (holding ? "Keep holding" : "Hold to unmute") : "Unmuted"}</span>
          </button>
          <button type="button" className={styles.round} data-end onClick={ask}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.2 13.4c4.9-4.1 12.7-4.1 17.6 0l-2.1 2.4-3.3-1.1-.4-2.3a9.6 9.6 0 0 0-6 0l-.4 2.3-3.3 1.1Z" />
            </svg>
            <span>End</span>
          </button>
          <button type="button" className={styles.round} onClick={onCollapse}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 4.5v4.5H4.5M15 19.5V15h4.5M9 9 4 4M15 15l5 5" />
            </svg>
            <span>Minimise</span>
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
