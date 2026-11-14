import styles from "./RollingClock.module.css";

/* ===========================================================================
   A lock screen's clock whose digits roll when the time moves on (2026-11-15,
   MOTION.md 3.5): a clock that jumps silently reads as an edit; one that rolls
   reads as time passing. Each digit is a column of 0–9 (drawn by CSS, so it
   isn't text) moved to its value; anything else (the colon) stands still.
   The time itself is there once, for whoever reads it aloud.
   =========================================================================== */

export default function RollingClock({ time, className }: { time: string; className?: string }) {
  const chars = Array.from(time);
  return (
    <span className={`${styles.clock} ${className ?? ""}`}>
      <span className="sr">{time}</span>
      {chars.map((c, i) => {
        // Keyed from the right, so 9:59 → 10:00 rolls the minutes rather than shifting them.
        const key = chars.length - i;
        if (!/\d/.test(c))
          return <span key={key} className={styles.still} data-d={c} aria-hidden="true" />;
        return (
          <span key={key} className={styles.digit} data-d={c} aria-hidden="true">
            <span className={styles.reel} style={{ translate: `0 ${-Number(c)}lh` }} />
          </span>
        );
      })}
    </span>
  );
}
