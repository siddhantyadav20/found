"use client";

import { useState, type CSSProperties } from "react";

import { drag } from "@/components/stage/drag";
import type { Notice } from "./Phone";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/LockScreen.module.css";

/* ===========================================================================
   The found phone's lock screen: the first time the player sees its owner's
   life. Whatever was waiting when it arrived (the chapter's `lockScreen`),
   and whatever has arrived since. The date, a large Canela clock, the torch
   and the camera in the corners.

   The passcode is off, so there is no pad: the swipe opens the phone. That
   is itself a clue, and Settings will say when it happened.

   The pilot's lock screen (c03aa03), in its "nobody locked it" mode.
   =========================================================================== */

/** Lifted this far (px), or flicked, the lock screen lets go. */
const LET_GO = 90;

function Corner({ kind }: { kind: "torch" | "camera" }) {
  return (
    <span className={`${styles.round} lg`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {kind === "torch" ? (
          <path d="M8 3h8v3.2l-2 2.6V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8.8L8 6.2Zm4 9.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
        ) : (
          <path d="M4.5 7.5h3l1.5-2.2h6l1.5 2.2h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5Zm7.5 3a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z" />
        )}
      </svg>
    </span>
  );
}

export default function LockScreen({
  day,
  clock,
  notes,
  onOpen,
}: {
  day: string;
  clock: string;
  notes: readonly Notice[];
  onOpen: () => void;
}) {
  const [lift, setLift] = useState(0);
  const [dragging, setDragging] = useState(false);

  const liftUp = (e: React.PointerEvent) =>
    drag(e, {
      engage: (dx, dy) => dy < 0 && -dy > Math.abs(dx),
      move: (_dx, dy) => {
        setDragging(true);
        setLift(Math.max(0, -dy));
      },
      end: ({ dy, vy }) => {
        setDragging(false);
        if (-dy < LET_GO && vy > -0.45) {
          setLift(0);
          return;
        }
        setLift(480);
        window.setTimeout(onOpen, 200);
      },
    });

  return (
    <button
      type="button"
      className={styles.lock}
      data-dragging={dragging || undefined}
      style={{ "--lift": `${lift}px`, "--fade": String(Math.max(0, 1 - lift / 240)) } as CSSProperties}
      onClick={onOpen}
      onPointerDown={liftUp}
      aria-label="Swipe up to open"
    >
      <span className={styles.slide}>
        <span className={styles.top}>
          <span className={styles.day}>{day}</span>
          <span className={styles.clock}>{clock}</span>
        </span>
        <span className={styles.notes}>
          {notes.map((n) => (
            <span key={n.key} className={`${styles.note} lg-thick`} data-look={n.look || undefined}>
              <span className={styles.noteIcon}>
                <AppGlyph app={n.icon ?? n.app} />
              </span>
              <span className={styles.noteBody}>
                <span className={styles.noteFrom}>{n.from}</span>
                <span className={styles.noteText}>{n.text}</span>
                {n.english && <span className={styles.noteEnglish}>{n.english}</span>}
              </span>
            </span>
          ))}
        </span>
        <span className={styles.bottom} aria-hidden="true">
          <Corner kind="torch" />
          <span className={styles.swipe}>Swipe up to open</span>
          <Corner kind="camera" />
        </span>
      </span>
    </button>
  );
}
