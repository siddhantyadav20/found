"use client";

import { useRef, useState, ViewTransition } from "react";

import type { CaseMeta } from "@/content/cases";
import styles from "./Pouch.module.css";

/* ===========================================================================
   The first thirty seconds: a courier pouch, and a phone taped to a power
   bank inside it.

   The player tears it open with their hand (PLAYER-JOURNEY law 5). It is a
   drag, not a button, because ownership is what makes the guilt work an hour
   later: they have to be able to say *I opened it*.

   Two things on the label are promises rather than decoration: the content
   note, and the line about nothing here being real.
   =========================================================================== */

const TEAR = 0.55;
/** How long the pouch takes to come apart before the note is on the table. */
const TEAR_MS = 850;

export default function Pouch({
  meta,
  to,
  minutes,
  replay,
  onOpen,
}: {
  meta: CaseMeta;
  to?: string;
  minutes?: number;
  /** They have finished it before: the label carries a postmark now. */
  replay?: boolean;
  onOpen: () => void;
}) {
  const [pull, setPull] = useState(0);
  const [torn, setTorn] = useState(false);
  const from = useRef<number | null>(null);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    // Android's own haptic, where there is one: a tear, not a notification.
    try {
      navigator.vibrate?.([14, 40, 22]);
    } catch {
      // A phone that won't buzz still opens.
    }
    // The strip goes, the pouch opens, the phone comes up out of it; then the note.
    setTorn(true);
    window.setTimeout(onOpen, TEAR_MS);
  };

  const move = (x: number, width: number) => {
    if (from.current === null) return;
    const next = Math.max(0, Math.min(1, (x - from.current) / (width * 0.6)));
    setPull(next);
    if (next >= TEAR) finish();
  };

  return (
    <div className={styles.wrap}>
      {/* The same object the desk showed, carried over into the room. */}
      <ViewTransition name="found-phone" share="morph" default="none">
        <div
          className={styles.pouch}
          data-torn={torn || undefined}
          style={{ "--pull": pull } as React.CSSProperties}
          onPointerDown={(e) => {
            from.current = e.clientX;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => move(e.clientX, e.currentTarget.clientWidth)}
          onPointerUp={() => {
            from.current = null;
            setPull(0);
          }}
        >
          <span className={styles.strip} aria-hidden="true">
            PULL TO OPEN →
          </span>
          {/* The phone inside, which rises out as the pouch comes open. */}
          <span className={styles.inside} aria-hidden="true" />
          {/* A courier's delivery label: who it's for, where it came from, and
              the declaration line, which is where the content note and the
              promise live (PLAYER-JOURNEY Stage 1). */}
          <span className={styles.label}>
            <span className={styles.to}>{to ? `TO ${to}` : "FLAT —"}</span>
            <span className={styles.from}>PikDrop · 1:08 AM · Dadar East</span>
            <span className={styles.note}>
              <b>Contains:</b> {meta.note.split(" · ").slice(0, 2).join(" · ")}
            </span>
            <span className={styles.note}>
              <b>Declared:</b> {meta.note.split(" · ").slice(2).join(" · ")}
            </span>
            {replay && (
              <span className={styles.postmark} aria-label="Postmarked: delivered 1:11 AM">
                DELIVERED
                <br />
                1:11 AM
              </span>
            )}
          </span>
        </div>
      </ViewTransition>

      <p className={styles.hint}>{meta.hint}</p>
      {minutes ? <p className={styles.minutes}>About {minutes} minutes, in one sitting.</p> : null}

      {/* The drag is the way in. A pointer isn't always a hand, so keyboards
          and assistive tech get a quiet way too, never the loud one. */}
      <button type="button" className={styles.open} onClick={finish}>
        Or open it here
      </button>
    </div>
  );
}
