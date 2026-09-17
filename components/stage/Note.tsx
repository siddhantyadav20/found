"use client";

import styles from "./Note.module.css";

/* ===========================================================================
   The note that came with the phone, and the phone lying face-down beside it.

   The player reads an instruction from a stranger and follows it before they
   know anything at all (PLAYER-JOURNEY law 1). Block capitals, ballpoint,
   Roman Hinglish, one word misspelled. A 64-year-old Marathi woman who
   spent 32 years in a bank did not write this, and nobody notices tonight.
   =========================================================================== */

export default function Note({ onTurn }: { onTurn: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.paper}>
        <p className={styles.hand}>CALL MAT KATNA.</p>
        <p className={styles.hand}>SAB DEKHO.</p>
        <p className={styles.sign}>— V</p>
        <p className={styles.english}>Don&apos;t cut the call. Look at everything.</p>
      </div>

      <div className={styles.kit}>
        <span className={styles.facedown} aria-hidden="true" />
        <span className={styles.bank} aria-hidden="true">
          <span className={styles.led} />
        </span>
      </div>
      <p className={styles.caption}>
        A phone, face-down, taped to a power bank. One light still on it.
      </p>

      <button type="button" className={styles.turn} onClick={onTurn}>
        Turn it over
      </button>
    </div>
  );
}
