import styles from "./Mark.module.css";

/* ===========================================================================
   Found's mark (2026-10-23): a phone face-down-then-up, its screen lit, and
   one notification dot in the corner, the ember red of the evidence stamp.
   The wordmark beside it is set tight. `animate` draws it in, for the splash
   and the loader.
   =========================================================================== */

export default function Mark({ size = 22, word = true, animate = false, className }: { size?: number; word?: boolean; animate?: boolean; className?: string }) {
  return (
    <span className={`${styles.mark} ${className ?? ""}`} data-animate={animate || undefined} style={{ "--s": `${size}px` } as React.CSSProperties}>
      <svg viewBox="0 0 24 36" className={styles.glyph} aria-hidden="true">
        <rect className={styles.body} x="1.5" y="1.5" width="21" height="33" rx="5.5" />
        <rect className={styles.screen} x="4.5" y="5" width="15" height="24" rx="2.4" />
        <rect className={styles.line} x="7" y="10" width="10" height="2.2" rx="1.1" />
        <rect className={styles.line} data-short x="7" y="14.4" width="6.5" height="2.2" rx="1.1" />
        <circle className={styles.dot} cx="21" cy="4" r="3.4" />
      </svg>
      {word && <span className={styles.word}>Found</span>}
    </span>
  );
}
