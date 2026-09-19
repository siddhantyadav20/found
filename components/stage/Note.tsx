"use client";

import { useSyncExternalStore } from "react";

import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";
import styles from "./Note.module.css";

/* ===========================================================================
   The note that came with the phone, and the phone lying face-down beside it.

   The player reads an instruction from a stranger and follows it before they
   know anything at all (PLAYER-JOURNEY law 1). Block capitals, ballpoint,
   Roman Hinglish, one word misspelled. A 64-year-old Marathi woman who
   spent 32 years in a bank did not write this, and nobody notices tonight.

   Sound is offered here, in the fiction, as the phone's own ring/silent
   switch on its side: never a modal, and before the call begins.
   =========================================================================== */

export default function Note({ onTurn }: { onTurn: () => void }) {
  const ringing = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  return (
    <div className={styles.wrap}>
      <div className={styles.paper}>
        <p className={styles.hand}>CALL MAT KATNA.</p>
        <p className={styles.hand}>SAB DEKHO.</p>
        <p className={styles.sign}>— V</p>
        <p className={styles.english}>Don&apos;t cut the call. Look at everything.</p>
      </div>

      <div className={styles.kit}>
        <span className={styles.facedown}>
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
        <span className={styles.bank} aria-hidden="true">
          <span className={styles.led} />
        </span>
      </div>
      <p className={styles.caption}>
        A phone, face-down, taped to a power bank. One light still on it.
      </p>
      <p className={styles.ringerNote}>{ringing ? "Its ringer is on." : "It's on silent. Flip the switch on its side to hear it."}</p>

      <button type="button" className={styles.turn} onClick={onTurn}>
        Turn it over
      </button>
    </div>
  );
}
