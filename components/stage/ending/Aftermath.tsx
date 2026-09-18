"use client";

import { useEffect, useState } from "react";

import type { Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { chosen, ENDING_SEEN, linesFor } from "@/lib/game/endings";
import { flag } from "../playthrough";
import { readFriend } from "./Acts";
import { Last } from "./Last";
import { Line } from "./parts";
import styles from "./Ending.module.css";

/* ===========================================================================
   What it costs, a line at a time.

   The lines come at reading speed on their own, and a tap brings the next
   one sooner. Then the ending's last image, then black, always before any
   answer arrives (PLAYER-JOURNEY Stage 9). Then the card.
   =========================================================================== */

const LINE_MS = 3800;
const BLACK_MS = 2600;

export default function Aftermath({ story, state }: { story: Story; state: CaseState }) {
  const ending = chosen(story, state);
  const lines = ending ? linesFor(state, ending.lines) : [];
  const [shown, setShown] = useState(1);
  const [phase, setPhase] = useState<"lines" | "last" | "black">("lines");
  const [friend] = useState(() => readFriend() || "Your friend");

  const more = () => (shown < lines.length ? setShown((n) => n + 1) : setPhase("last"));

  useEffect(() => {
    if (phase !== "lines") return undefined;
    const t = window.setTimeout(
      () => (shown < lines.length ? setShown((n) => n + 1) : setPhase("last")),
      shown < lines.length ? LINE_MS : LINE_MS + 1200,
    );
    return () => window.clearTimeout(t);
  }, [phase, shown, lines.length]);

  useEffect(() => {
    if (phase !== "black") return undefined;
    const t = window.setTimeout(() => flag(ENDING_SEEN), BLACK_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (!ending) return null;
  if (phase === "black") return <div className={styles.black} aria-hidden="true" />;

  if (phase === "last")
    return (
      <div className={styles.screen}>
        <Last ending={ending} state={state} friend={friend} onDone={() => setPhase("black")} />
      </div>
    );

  return (
    <div className={styles.screen}>
      <div className={styles.feed} onClick={more} aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <Line key={i} line={l} friend={friend} />
        ))}
      </div>
      <button type="button" className={styles.quiet} onClick={more}>
        Go on
      </button>
    </div>
  );
}
