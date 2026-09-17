"use client";

import { useState } from "react";

import { useCase } from "@/components/found/StoryContext";
import InAppGuard from "./InAppGuard";
import styles from "./Stage.module.css";

/* ===========================================================================
   The stage: both phones, hers and yours.

   A placeholder for now. The pivot (ROADMAP.md P0) took the old iOS phone
   out, and P1 puts the real thing in: her Android on the left of the table
   and your own phone asleep beside it, with the call running over both.

   What's here is the cold open's shape and nothing it hasn't earned: the
   pouch, the delivery label, and the chapter's promise that nothing it asks
   for is real.
   =========================================================================== */

export default function Stage() {
  const { story, meta, to, minutes } = useCase();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stage}>
      <p className={styles.eyebrow}>
        {story.title} · Episode 1 · {story.episodes[0]}
      </p>

      {!open ? (
        <>
          <button type="button" className={styles.pouch} onClick={() => setOpen(true)}>
            <span className={styles.sticker}>
              <span className={styles.to}>{to ? `TO ${to}` : "BY HAND"}</span>
              <span className={styles.note}>{meta.note}</span>
            </span>
          </button>
          <p className={styles.hint}>{meta.hint}</p>
          {minutes ? <p className={styles.minutes}>About {minutes} minutes.</p> : null}
          <InAppGuard />
        </>
      ) : (
        <div className={styles.building}>
          <p className={styles.eyebrow}>1:11 AM</p>
          <p>
            A phone, taped to a power bank. A note in block capitals:{" "}
            <strong>CALL MAT KATNA.</strong>
          </p>
          <p className={styles.minutes}>
            The stage is being rebuilt: her Android, your phone, and the call that never
            ends. See ROADMAP.md, P1 and P2.
          </p>
        </div>
      )}
    </div>
  );
}
