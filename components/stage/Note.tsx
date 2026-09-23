"use client";

import { useState, useSyncExternalStore } from "react";

import type { Arrival } from "@/content/types";
import { buzz } from "@/lib/found/buzz";
import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";
import styles from "./Note.module.css";

/* ===========================================================================
   What was in the parcel: a phone lying face-down, cracked at one corner,
   and, when the chapter has one, an envelope from somebody else's wedding.

   The note is on the envelope's back. The player sees the front first (the
   foil, the couple's names, the date) and turns it over by hand to read what
   a stranger wrote to someone called M (PLAYER-JOURNEY Stage 2): a letter
   addressed to somebody else, read anyway, is the first choice nobody notices
   making. The English beneath is ours, never written on the note.

   Then the phone. Sound is offered here, in the fiction, as the phone's own
   ring/silent switch on its side: never a modal.
   =========================================================================== */

function Handwriting({ arrival }: { arrival: Arrival }) {
  return (
    <>
      {arrival.note.map((line) => (
        <p key={line} className={styles.hand}>
          {line}
        </p>
      ))}
      {arrival.sign && <p className={styles.sign}>{arrival.sign}</p>}
    </>
  );
}

export default function Note({ arrival, onTurn }: { arrival: Arrival; onTurn: () => void }) {
  const ringing = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  const envelope = arrival.envelope;
  // With no envelope, the note is simply there to be read.
  const [flipped, setFlipped] = useState(!envelope);
  const flip = () => setFlipped(true);

  return (
    <div className={styles.wrap}>
      {envelope ? (
        /* Turned over by hand: a tap, or a sideways drag. */
        <button
          type="button"
          className={styles.envelope}
          data-flipped={flipped || undefined}
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

      {flipped ? (
        <p className={styles.english}>&ldquo;{arrival.english}&rdquo;</p>
      ) : (
        <p className={styles.caption}>{envelope?.caption}</p>
      )}

      {flipped && (
        <>
          <div className={styles.kit}>
            <span className={styles.facedown}>
              {/* The corner that hit something, once. */}
              <svg className={styles.crack} viewBox="0 0 40 40" aria-hidden="true">
                <path d="M40 0 26 9l-6 11M26 9l3 12M20 20l-9 4M29 21l8 7" />
              </svg>
              <button
                type="button"
                role="switch"
                aria-checked={ringing}
                aria-label={ringing ? "Ringer on. Flip to silent." : "Silent. Flip to ring."}
                className={styles.ringer}
                data-on={ringing || undefined}
                onClick={() => setSoundOn(!ringing)}
              />
            </span>
          </div>
          <p className={styles.caption}>{arrival.caption}</p>
          <p className={styles.ringerNote}>
            {ringing ? "Its ringer is on." : "It's on silent. Flip the switch on its side to hear it."}
          </p>
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
    </div>
  );
}
