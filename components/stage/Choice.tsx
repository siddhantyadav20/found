"use client";

import type { Story } from "@/content/types";
import { against, type CaseState } from "@/lib/game/engine";
import styles from "./Choice.module.css";

/* ===========================================================================
   The choice.

   Three rows, over a call that is still running. They are identical in
   weight, fixed in order, flat in voice: no recommendation, no icon, no
   colour that means anything, nothing that praises whichever is picked
   (PLAYER-JOURNEY Stage 9). Players read layout as morality, so the layout
   says nothing.

   Doing nothing is also real. The call keeps going, and the supervisor
   thanks the player for cooperating.

   P8 builds what each one costs. This is the screen it happens on.
   =========================================================================== */

const ROWS = [
  { id: "police", n: "01", label: "Report to police" },
  { id: "bin", n: "02", label: "Throw it away" },
  { id: "friend", n: "03", label: "Share with a friend" },
] as const;

export default function Choice({ story, state }: { story: Story; state: CaseState }) {
  const held = against(story, state);

  return (
    <div className={styles.choice}>
      <p className={styles.eyebrow}>10:41 AM · still on the call</p>
      <p className={styles.orders}>
        Don&apos;t cut the call.
        <br />
        Don&apos;t tell anyone.
      </p>

      <ul className={styles.rows}>
        {ROWS.map((r) => (
          <li key={r.id}>
            <button type="button" className={styles.row} disabled>
              <span className={styles.n}>{r.n}</span>
              <span className={styles.label}>{r.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.ledger}>
        {held.length === 0
          ? "They have nothing on you."
          : `They have ${held.length} thing${held.length === 1 ? "" : "s"} on you: ${held
              .map((e) => e.what.toLowerCase())
              .join(", ")}.`}
      </p>
      <p className={styles.soon}>
        What each of these costs is written in CHAPTER1.md, section E, and is built in P8:
        three acts done with your hands, then the end card that lists what they had on you.
      </p>
    </div>
  );
}
