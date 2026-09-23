"use client";

import { useRef, useState, ViewTransition } from "react";

import type { CaseMeta } from "@/content/cases";
import styles from "./Parcel.module.css";

/* ===========================================================================
   The first thirty seconds: a padded parcel, and a phone inside it that
   won't stop buzzing.

   The player tears it open with their hand (PLAYER-JOURNEY law 5). It is a
   drag, not a button, because a letter addressed to somebody else is the
   purest trespass, and they have to be able to say *I opened it*. ROADMAP S5
   adds the envelope and the note on its back.

   Two things on the label are promises rather than decoration: the content
   note, and the line about nothing here being real.
   =========================================================================== */

const TEAR = 0.55;
/** How long the parcel takes to come apart before the note is on the table. */
const TEAR_MS = 850;

export default function Parcel({
  meta,
  to,
  minutes,
  replay,
  onOpen,
}: {
  meta: CaseMeta;
  to?: string;
  minutes?: number;
  /** They have finished it before: the parcel is already open, and the label carries a postmark. */
  replay?: boolean;
  onOpen: () => void;
}) {
  const [pull, setPull] = useState(0);
  const [tearing, setTorn] = useState(false);
  // A second time, it's already open: the phone just has to be taken out again.
  // (Derived, because a finish is only known once the browser can read it.)
  const torn = tearing || Boolean(replay);
  const from = useRef<number | null>(null);
  const done = useRef(false);

  const finish = () => {
    if (replay) return onOpen();
    if (done.current) return;
    done.current = true;
    // Android's own haptic, where there is one: a tear, not a notification.
    try {
      navigator.vibrate?.([14, 40, 22]);
    } catch {
      // A phone that won't buzz still opens.
    }
    // The strip goes, the parcel opens, the phone comes up out of it; then the note.
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
          className={styles.parcel}
          data-torn={torn || undefined}
          data-replay={replay || undefined}
          style={{ "--pull": pull } as React.CSSProperties}
          onPointerDown={(e) => {
            if (replay) return;
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
            {replay ? "OPENED" : "PULL TO OPEN →"}
          </span>
          {/* The phone inside, which rises out as the parcel comes open. */}
          <span className={styles.inside} aria-hidden="true" />
          {/* A courier's delivery label: who it's for, where it came from, and
              the declaration line, which is where the content note and the
              promise live (PLAYER-JOURNEY Stage 1). */}
          <span className={styles.label}>
            {/* Who it was addressed to is still to be decided (CHAPTER1 O1). */}
            <span className={styles.to}>{to ? `TO ${to}` : "TO —"}</span>
            <span className={styles.note}>
              <b>Contains:</b> {meta.note.split(" · ").slice(0, 2).join(" · ")}
            </span>
            <span className={styles.note}>
              <b>Declared:</b> {meta.note.split(" · ").slice(2).join(" · ")}
            </span>
            {replay && (
              <span className={styles.postmark} aria-label="Postmarked: delivered">
                DELIVERED
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
        {replay ? "Take it out again" : "Or open it here"}
      </button>
    </div>
  );
}
