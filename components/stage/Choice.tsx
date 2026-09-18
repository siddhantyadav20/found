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

/** "10:41" → "10:41 AM", the way her status bar would say it. */
function twelve(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export default function Choice({ story, state, clock }: { story: Story; state: CaseState; clock: string }) {
  const held = against(story, state);

  return (
    <div className={styles.choice}>
      <p className={styles.eyebrow}>{twelve(clock)} · still on the call</p>
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
    </div>
  );
}
