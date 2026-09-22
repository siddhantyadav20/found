"use client";

import { useEffect, useState } from "react";

import type { EndingLine, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { chosen, ENDING_SEEN, linesFor } from "@/lib/game/endings";
import { flag } from "../playthrough";
import styles from "./Ending.module.css";

/* ===========================================================================
   What it costs, a line at a time.

   The lines come at reading speed on their own, and a tap brings the next
   one sooner. Then the ending's last image, then black, always before any
   answer arrives. Then the card. (ROADMAP S9 draws each ending's last image.)
   =========================================================================== */

const LINE_MS = 3800;
const BLACK_MS = 2600;

/** A line of an ending: narration, or a message from somebody. */
function Line({ line }: { line: EndingLine }) {
  const hinglish = line.english ? "hi-Latn" : undefined;
  return (
    <div className={styles.beat}>
      {line.at && <span className={styles.at}>{line.at}</span>}
      {line.who ? (
        <p className={styles.bubble} data-mine={line.who === "You" || undefined}>
          <span className={styles.from}>{line.who}</span>
          <span lang={hinglish}>{line.text}</span>
          {line.english && <span className={styles.english}>{line.english}</span>}
        </p>
      ) : (
        <p className={styles.told}>
          <span lang={hinglish}>{line.text}</span>
          {line.english && <span className={styles.english}>{line.english}</span>}
        </p>
      )}
    </div>
  );
}

export default function Aftermath({ story, state }: { story: Story; state: CaseState }) {
  const ending = chosen(story, state);
  const lines = ending ? [...linesFor(state, ending.lines), ...linesFor(state, ending.last)] : [];
  const [shown, setShown] = useState(1);
  const [black, setBlack] = useState(false);

  const more = () => (shown < lines.length ? setShown((n) => n + 1) : setBlack(true));

  useEffect(() => {
    if (black) return undefined;
    const t = window.setTimeout(
      () => (shown < lines.length ? setShown((n) => n + 1) : setBlack(true)),
      shown < lines.length ? LINE_MS : LINE_MS + 1200,
    );
    return () => window.clearTimeout(t);
  }, [black, shown, lines.length]);

  useEffect(() => {
    if (!black) return undefined;
    const t = window.setTimeout(() => flag(ENDING_SEEN), BLACK_MS);
    return () => window.clearTimeout(t);
  }, [black]);

  if (!ending) return null;
  if (black) return <div className={styles.black} aria-hidden="true" />;

  return (
    <div className={styles.screen}>
      <div className={styles.feed} onClick={more} aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <Line key={i} line={l} />
        ))}
      </div>
      <button type="button" className={styles.quiet} onClick={more}>
        Go on
      </button>
    </div>
  );
}
