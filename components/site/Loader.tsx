import Logo from "@/components/cinema/Logo";
import styles from "./Loader.module.css";

/* ===========================================================================
   Found's loader (2026-10-23; the wordmark since 2026-10-31): the mark
   breathing, and a line under it like a message being typed. For route
   changes and anything that takes a moment to arrive.
   =========================================================================== */

export default function Loader({ label = "Opening", full = false }: { label?: string; full?: boolean }) {
  return (
    <div className={styles.loader} data-full={full || undefined} role="status" aria-live="polite">
      <span className={styles.pulse}>
        <Logo className={styles.logo} />
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
