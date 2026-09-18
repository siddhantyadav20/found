"use client";

import { useEffect, useState } from "react";

import type { Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { finish, type EndingId } from "@/lib/game/endings";
import { flag } from "../playthrough";
import { Police, Sea, Share } from "./Acts";
import { CallBar } from "./parts";
import styles from "./Ending.module.css";

/* ===========================================================================
   The choice.

   Three rows, over a call that is still running. They are identical in
   weight, fixed in order, flat in voice: no recommendation, no icon, no
   colour that means anything, nothing that praises whichever is picked
   (PLAYER-JOURNEY Stage 9). Players read layout as morality, so the layout
   says nothing.

   Doing nothing is also real. After ninety seconds the supervisor thanks
   the player for cooperating, and the rows stay.
   =========================================================================== */

const COOPERATE_MS = 90_000;

/** "10:41" → "10:41 AM", the way a status bar would say it. */
function twelve(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export default function Choice({ story, state, clock }: { story: Story; state: CaseState; clock: string }) {
  const [act, setAct] = useState<EndingId | null>(null);
  const [cooperating, setCooperating] = useState(false);

  useEffect(() => {
    if (act) return undefined;
    const t = window.setTimeout(() => setCooperating(true), COOPERATE_MS);
    return () => window.clearTimeout(t);
  }, [act]);

  if (act) {
    const Act = act === "police" ? Police : act === "bin" ? Sea : Share;
    return (
      <div className={styles.screen}>
        <Act state={state} onBack={() => setAct(null)} onDone={() => flag(...finish(act))} />
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <CallBar state={state} />
      <div className={styles.column}>
        <p className={styles.eyebrow}>{twelve(clock)} · still on the call</p>
        <p className={styles.orders}>
          Don&apos;t cut the call.
          <br />
          Don&apos;t tell anyone.
        </p>

        <ul className={styles.rows}>
          {story.endings.map((e, i) => (
            <li key={e.id}>
              <button type="button" className={styles.row} onClick={() => setAct(e.id)}>
                <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.label}>{e.row}</span>
              </button>
            </li>
          ))}
        </ul>

        <div aria-live="polite">
          {cooperating && (
            <p className={styles.said}>
              <span lang="hi-Latn">Good. Aap cooperate kar rahe ho.</span>
              <span className={styles.english}>Good. You&apos;re cooperating.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
