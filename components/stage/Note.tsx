"use client";

import { useSyncExternalStore } from "react";

import type { Arrival } from "@/content/types";
import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";
import styles from "./Note.module.css";

/* ===========================================================================
   The note that came with the phone, and the phone lying face-down beside it.

   The note is somebody's handwriting, addressed to somebody else, and the
   player reads it anyway: the first choice they don't notice making. The
   English beneath it is ours, never written on the note (ROADMAP S5 turns
   this into the envelope, and the note on its back).

   Sound is offered here, in the fiction, as the phone's own ring/silent
   switch on its side: never a modal.
   =========================================================================== */

export default function Note({ arrival, onTurn }: { arrival: Arrival; onTurn: () => void }) {
  const ringing = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  return (
    <div className={styles.wrap}>
      <div className={styles.paper} lang="hi-Latn">
        {arrival.note.map((line) => (
          <p key={line} className={styles.hand}>
            {line}
          </p>
        ))}
        {arrival.sign && <p className={styles.sign}>{arrival.sign}</p>}
      </div>
      <p className={styles.english}>&ldquo;{arrival.english}&rdquo;</p>

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
      </div>
      <p className={styles.caption}>{arrival.caption}</p>
      <p className={styles.ringerNote}>{ringing ? "Its ringer is on." : "It's on silent. Flip the switch on its side to hear it."}</p>

      <button type="button" className={styles.turn} onClick={onTurn}>
        Turn it over
      </button>
    </div>
  );
}
