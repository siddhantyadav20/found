"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

import type { Arrival } from "@/content/types";
import { buzz } from "@/lib/found/buzz";
import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";
import styles from "./Note.module.css";

/* ===========================================================================
   What was in the parcel (rebuilt 2026-10-24): the same table, the parcel
   torn open, a phone lying face down with a cracked corner, and a wedding
   envelope from somebody else's shaadi.

   The envelope lifts off the photograph. Its front first (the foil, the
   couple's names, the date); turned over by hand, the note a stranger wrote
   to someone called M (PLAYER-JOURNEY Stage 2). The English beneath is
   ours, never written on the note. Then the phone, and its ring/silent
   switch: sound is offered in the fiction, never as a modal.
   =========================================================================== */

function Handwriting({ arrival }: { arrival: Arrival }) {
  return (
    <>
      {arrival.note.map((line) => (
        <span key={line} className={styles.hand}>
          {line}
        </span>
      ))}
      {arrival.sign && <span className={styles.sign}>{arrival.sign}</span>}
    </>
  );
}

export default function Note({ arrival, scene, onTurn }: { arrival: Arrival; scene?: string; onTurn: () => void }) {
  const ringing = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  const envelope = arrival.envelope;
  const [flipped, setFlipped] = useState(!envelope);
  const flip = () => setFlipped(true);

  return (
    <div className={styles.scene} data-flipped={flipped || undefined}>
      <div className={styles.photo} aria-hidden="true">
        {scene && <Image src={scene} alt="" fill priority sizes="100vw" className={styles.image} />}
      </div>

      {/* What else came out of it, on the table: the torn mailer, and the phone face down with its cracked corner. */}
      <div className={styles.table} aria-hidden="true">
        <span className={styles.mailer} />
        <span className={styles.phone}>
          <span className={styles.camera} />
          <span className={styles.crack} />
        </span>
      </div>

      {envelope ? (
        /* Turned over by hand: a tap, or a sideways drag. */
        <button
          type="button"
          className={styles.envelope}
          onClick={flip}
          onPointerDown={(e) => {
            const x = e.clientX;
            const up = (ev: PointerEvent) => {
              if (Math.abs(ev.clientX - x) > 30) flip();
              window.removeEventListener("pointerup", up);
            };
            window.addEventListener("pointerup", up);
          }}
          aria-label={flipped ? "The back of the envelope" : `A wedding envelope: ${envelope.front}. Turn it over`}
          disabled={flipped}
        >
          <span className={styles.card}>
            <span className={styles.front} aria-hidden={flipped || undefined}>
              <span className={styles.ganesh} aria-hidden="true">
                ॐ
              </span>
              <span className={styles.foil}>{envelope.front}</span>
              {envelope.small && <span className={styles.small}>{envelope.small}</span>}
            </span>
            <span className={styles.back} lang="hi-Latn" aria-hidden={!flipped || undefined}>
              <span className={styles.flap} aria-hidden="true" />
              <span className={styles.label}>
                <Handwriting arrival={arrival} />
              </span>
            </span>
          </span>
        </button>
      ) : (
        <div className={styles.paper} lang="hi-Latn">
          <Handwriting arrival={arrival} />
        </div>
      )}

      <section className={styles.panel}>
        {flipped ? (
          <>
            <p className={styles.eyebrow}>On the back, in a man&apos;s quick hand</p>
            <p className={styles.english}>&ldquo;{arrival.english}&rdquo;</p>
            <p className={styles.notYou}>You aren&apos;t M.</p>
            <div className={styles.phoneRow}>
              <span className={styles.phoneIcon} aria-hidden="true">
                <svg viewBox="0 0 24 36">
                  <rect x="2" y="1.5" width="20" height="33" rx="5" />
                  <path d="M22 1.5 15 7l-3 6M15 7l2 6" />
                </svg>
              </span>
              <span className={styles.phoneText}>
                <b>{arrival.caption}</b>
                <span>{ringing ? "Its ringer is on." : "It's on silent. Flip the switch to hear it."}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={ringing}
                aria-label={ringing ? "Ringer on. Flip to silent." : "Silent. Flip to ring."}
                className={styles.ringer}
                data-on={ringing || undefined}
                onClick={() => setSoundOn(!ringing)}
              />
            </div>
          </>
        ) : (
          <>
            <p className={styles.eyebrow}>Inside the parcel</p>
            <p className={styles.caption}>{envelope?.caption}</p>
          </>
        )}
        <button
          type="button"
          className={styles.turn}
          onClick={() => {
            if (!flipped) return flip();
            // It wakes in your hand: the buzz of everything that came while it was in the parcel.
            buzz();
            onTurn();
          }}
        >
          {flipped ? "Turn the phone over" : "Turn the envelope over"}
        </button>
      </section>
    </div>
  );
}
