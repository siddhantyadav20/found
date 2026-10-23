"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";

import type { CaseMeta } from "@/content/cases";
import { buzz, warmBuzz } from "@/lib/found/buzz";
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
/** The parcel shivers every 1.6 s (Parcel.module.css); it's heard on every other one, for a while. */
const BUZZ_FIRST_MS = 800;
const BUZZ_EVERY_MS = 3200;
const BUZZ_TIMES = 7;

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
  /** Opened, and how they chose to play: with the case file's help, or as a detective. */
  onOpen: (detective: boolean) => void;
}) {
  const [pull, setPull] = useState(0);
  // How to play: the case file's help (where to look, nudges), or none of it.
  const [detective, setDetective] = useState(false);
  const [tearing, setTorn] = useState(false);
  // A second time, it's already open: the phone just has to be taken out again.
  // (Derived, because a finish is only known once the browser can read it.)
  const torn = tearing || Boolean(replay);
  const from = useRef<number | null>(null);
  const done = useRef(false);

  /* It rings in the box (ROADMAP T2): the phone inside is heard, in step
     with the shiver, before anyone has touched the strip. */
  useEffect(() => {
    if (torn) return undefined;
    warmBuzz();
    let n = 0;
    let every: number | undefined;
    const first = window.setTimeout(() => {
      buzz();
      every = window.setInterval(() => (++n >= BUZZ_TIMES ? window.clearInterval(every) : buzz()), BUZZ_EVERY_MS);
    }, BUZZ_FIRST_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [torn]);

  const finish = () => {
    if (replay) return onOpen(detective);
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
    window.setTimeout(() => onOpen(detective), TEAR_MS);
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
          {/* A courier's delivery label: who it was for, where, the courier's
              stamp over it, and the declaration line, which is where the
              content note and the promise live (PLAYER-JOURNEY Stage 1).
              Passed on by a friend, their name goes over it by hand. */}
          <span className={styles.label}>
            <span className={styles.to}>{to ? `TO ${to}` : meta.label ? `TO ${meta.label.to.toUpperCase()}` : "TO —"}</span>
            {meta.label && (
              <span className={styles.from}>
                {to ? `By hand, over a courier's label to ${meta.label.to}` : meta.label.address}
              </span>
            )}
            {meta.label?.phone && !to && <span className={styles.from}>Mob: {meta.label.phone}</span>}
            {meta.label?.from && !to && <span className={styles.from}>From: {meta.label.from}</span>}
            <span className={styles.note}>
              <b>Contains:</b> {meta.note.split(" · ").slice(0, 2).join(" · ")}
            </span>
            <span className={styles.note}>
              <b>Declared:</b> {meta.note.split(" · ").slice(2).join(" · ")}
            </span>
            {/* What the courier did with it: the reason it's in your hands. */}
            {meta.label ? (
              <span className={styles.postmark} aria-label={`Stamped: ${meta.label.stamp.join(". ")}`}>
                {meta.label.stamp[0]}
                <span className={styles.postmarkSmall}>{meta.label.stamp[1]}</span>
              </span>
            ) : (
              replay && (
                <span className={styles.postmark} aria-label="Postmarked: delivered">
                  DELIVERED
                </span>
              )
            )}
          </span>
        </div>
      </ViewTransition>

      {/* The desk said what this is; here, only what to do with it. */}
      <p className={styles.hint}>
        {replay ? "It isn't yours. It still isn't." : "Something inside is buzzing. It isn't yours. Read the label, then pull the strip."}
      </p>
      {minutes ? <p className={styles.minutes}>About {minutes} minutes, in one sitting.</p> : null}

      {/* How to play, chosen once, before anything is opened (the 2026-10-01 review). */}
      <div className={styles.mode} role="radiogroup" aria-label="How you play">
        <button type="button" role="radio" aria-checked={!detective} className={styles.modeOption} onClick={() => setDetective(false)}>
          <b>With help</b>
          <span>Where to look, and a nudge when you&apos;re stuck</span>
        </button>
        <button type="button" role="radio" aria-checked={detective} className={styles.modeOption} onClick={() => setDetective(true)}>
          <b>Detective</b>
          <span>No where-to-look, no nudges. Hints if you ask</span>
        </button>
      </div>

      {/* The drag is the way in. A pointer isn't always a hand, so keyboards
          and assistive tech get a quiet way too, never the loud one. */}
      <button type="button" className={styles.open} onClick={finish}>
        {replay ? "Take it out again" : "Or open it here"}
      </button>
    </div>
  );
}
