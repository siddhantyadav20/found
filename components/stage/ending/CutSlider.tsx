"use client";

import { useRef, useState } from "react";

import styles from "./Ending.module.css";

/* ===========================================================================
   Slide to end the call: the red button dragged all the way, because ending
   it has to be something a thumb decides to do (CHAPTER1.md E, 01 and 02).

   A keyboard press, or any tap when the player has asked for less motion,
   ends it outright: reduced motion trades drags for taps and never removes
   a choice (PLAYER-JOURNEY, access).
   =========================================================================== */

const KNOB = 64;
const ENOUGH = 0.9;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CutSlider({ label, onCut }: { label: string; onCut: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const from = useRef<number | null>(null);
  const [span, setSpan] = useState(1);
  const [x, setX] = useState(0);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);

  const down = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (done) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const width = (track.current?.clientWidth ?? KNOB * 2) - KNOB - 8;
    setSpan(width);
    setDragging(true);
    from.current = e.clientX - x * width;
  };

  const move = (e: React.PointerEvent) => {
    if (from.current === null) return;
    setX(Math.min(1, Math.max(0, (e.clientX - from.current) / span)));
  };

  const up = () => {
    if (from.current === null) return;
    from.current = null;
    setDragging(false);
    if (x >= ENOUGH) {
      setX(1);
      setDone(true);
      onCut();
    } else setX(0);
  };

  return (
    <div className={styles.slider} ref={track}>
      <span className={styles.sliderLabel} aria-hidden="true">
        {label}
      </span>
      <button
        type="button"
        className={styles.knob}
        data-back={!dragging || undefined}
        style={{ transform: `translateX(${x * span}px)` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClick={(e) => {
          if (done || !(e.detail === 0 || reduced())) return;
          setDone(true);
          onCut();
        }}
        aria-label={`${label}. Drag all the way across, or press Enter.`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.2 13.4c4.9-4.1 12.7-4.1 17.6 0l-2.1 2.4-3.3-1.1-.4-2.3a9.6 9.6 0 0 0-6 0l-.4 2.3-3.3 1.1Z" />
        </svg>
      </button>
    </div>
  );
}
