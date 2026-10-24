"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CaseMeta } from "@/content/cases";
import Mark from "@/components/site/Mark";
import { buzz, warmBuzz } from "@/lib/found/buzz";
import styles from "./Parcel.module.css";

/* ===========================================================================
   The first thirty seconds (rebuilt 2026-10-24): a courier parcel on your
   table at night, photographed from above under one lamp, and a phone
   inside it that won't stop buzzing.

   The waybill is real type on the photograph (who it was for, where, the
   courier's RETURN TO ORIGIN stamp over it, the content note as the
   declaration line). The strip across the top is pulled by hand: a letter
   addressed to somebody else, opened anyway, is the first trespass, and the
   player should be able to say *I opened it* (PLAYER-JOURNEY law 5). Below,
   the chapter's cover in the site's own voice, how to play, and the button
   for anyone whose pointer isn't a hand.
   =========================================================================== */

const TEAR = 0.55;
/** How long the parcel takes to come apart before the note is on the table. */
const TEAR_MS = 900;
/** The parcel shivers every 1.6 s (Parcel.module.css); it's heard on every other one, for a while. */
const BUZZ_FIRST_MS = 800;
const BUZZ_EVERY_MS = 3200;
const BUZZ_TIMES = 7;

export default function Parcel({
  meta,
  episode,
  to,
  minutes,
  replay,
  onOpen,
}: {
  meta: CaseMeta;
  /** Episode 1's name, for the cover. */
  episode: string;
  to?: string;
  minutes?: number;
  /** They have finished it before: the parcel is already open. */
  replay?: boolean;
  /** Opened, and how they chose to play: with the case file's help, or as a detective. */
  onOpen: (detective: boolean) => void;
}) {
  const [pull, setPull] = useState(0);
  const [detective, setDetective] = useState(false);
  const [tearing, setTorn] = useState(false);
  const torn = tearing || Boolean(replay);
  const from = useRef<number | null>(null);
  const done = useRef(false);

  /* It rings in the box: the phone inside is heard, in step with the
     shiver, before anyone has touched the strip. */
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
    try {
      navigator.vibrate?.([14, 40, 22]);
    } catch {
      // A phone that won't buzz still opens.
    }
    setTorn(true);
    window.setTimeout(() => onOpen(detective), TEAR_MS);
  };

  const move = (x: number, width: number) => {
    if (from.current === null) return;
    const next = Math.max(0, Math.min(1, (x - from.current) / (width * 0.6)));
    setPull(next);
    if (next >= TEAR) finish();
  };

  const [contains, declared] = [meta.note.split(" · ").slice(0, 2).join(" · "), meta.note.split(" · ").slice(2).join(" · ")];

  return (
    <div className={styles.scene} data-torn={torn || undefined}>
      <div className={styles.photo} aria-hidden="true">
        {meta.scene && <Image src={meta.scene.parcel} alt="" fill priority sizes="100vw" className={styles.image} />}
      </div>

      <header className={styles.bar}>
        <Link href="/" className={styles.home} aria-label="Found, home">
          <Mark size={17} />
        </Link>
        <span className={styles.crumb}>
          Chapter {String(meta.chapter).padStart(2, "0")} · {meta.city}
        </span>
      </header>

      {/* The parcel itself: the waybill on it, and the strip across its top. */}
      <div
        className={styles.parcel}
        style={{ "--pull": pull } as React.CSSProperties}
        onPointerDown={(e) => {
          if (replay) return;
          from.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => move(e.clientX, e.currentTarget.clientWidth)}
        onPointerUp={() => {
          from.current = null;
          if (!done.current) setPull(0);
        }}
      >
        <span className={styles.strip} aria-hidden="true">
          <span>{replay ? "Opened" : "Pull to open"}</span>
          <i>→</i>
        </span>

        <span className={styles.waybill}>
          <span className={styles.barcode} aria-hidden="true" />
          <span className={styles.courier}>DakRoute Express · Surface · 1 of 1</span>
          <span className={styles.to}>{to ? `TO ${to.toUpperCase()}` : meta.label ? `TO ${meta.label.to.toUpperCase()}` : "TO —"}</span>
          {meta.label && <span className={styles.line}>{to ? `By hand, over a courier's label to ${meta.label.to}` : meta.label.address}</span>}
          {meta.label?.phone && !to && <span className={styles.line}>Mob: {meta.label.phone}</span>}
          {meta.label?.from && !to && <span className={styles.line}>From: {meta.label.from}</span>}
          <span className={styles.decl}>
            <b>Contains</b> {contains}
          </span>
          <span className={styles.decl}>
            <b>Declared</b> {declared}
          </span>
          {meta.label && (
            <span className={styles.stamp} aria-label={`Stamped: ${meta.label.stamp.join(". ")}`}>
              {meta.label.stamp[0]}
              <small>{meta.label.stamp[1]}</small>
            </span>
          )}
        </span>
      </div>

      <section className={styles.cover}>
        <p className={styles.kicker}>Episode 1 · {episode}</p>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.logline}>{replay ? "It isn't yours. It still isn't." : "Something inside is buzzing. It isn't yours. Read the label, then pull the strip."}</p>
        <p className={styles.meta}>
          {meta.episodes} episodes · {minutes ? `about ${minutes} minutes` : meta.tone.split(" · ").at(-1)} · sound on
        </p>

        {/* How to play, chosen once, before anything is opened. */}
        <div className={styles.modes} role="radiogroup" aria-label="How you play">
          <button type="button" role="radio" aria-checked={!detective} onClick={() => setDetective(false)}>
            <b>With help</b>
            <span>Where to look, and a nudge when you&apos;re stuck</span>
          </button>
          <button type="button" role="radio" aria-checked={detective} onClick={() => setDetective(true)}>
            <b>Detective</b>
            <span>No pointers. Hints only if you ask</span>
          </button>
        </div>

        <button type="button" className={styles.open} onClick={finish}>
          {replay ? "Take it out again" : "Open the parcel"}
        </button>
      </section>
    </div>
  );
}
