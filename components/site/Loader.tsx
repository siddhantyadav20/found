import Mark from "./Mark";
import styles from "./Loader.module.css";

/* ===========================================================================
   Found's loader (2026-10-23): the mark, its notification dot pulsing, and a
   line under it like a message being typed. For route changes and anything
   that takes a moment to arrive.
   =========================================================================== */

export default function Loader({ label = "Opening", full = false }: { label?: string; full?: boolean }) {
  return (
    <div className={styles.loader} data-full={full || undefined} role="status" aria-live="polite">
      <span className={styles.pulse}>
        <Mark size={30} word={false} />
      </span>
      <span className={styles.label}>
        {label}
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
    </div>
  );
}
