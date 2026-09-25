import styles from "./App.module.css";

/** SF Symbols' chevron: `chevron.backward` in a bar, `chevron.forward` at the end of a row. */
export function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 10 17" className={back ? undefined : styles.chev} aria-hidden="true">
      <path
        d={back ? "M8.5 1.5 1.5 8.5l7 7" : "m1.5 1.5 7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth={back ? 2.4 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * An app's top bar, as current iOS draws it: back is a small glass circle
 * with a chevron, the title sits in the middle (and can open something, like
 * a contact's details), and actions on the right are glass pills
 * (`app.pill`).
 *
 * The back button carries `data-back`: swiping a screen right presses the
 * last one on the phone, so every screen with a back button can be swiped.
 */
export default function AppBar({
  title = "",
  onBack,
  backLabel = "Back",
  onTitle,
  end,
  hideTitle,
}: {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  onTitle?: () => void;
  end?: React.ReactNode;
  /** The large title is still on screen, so the bar's small one waits for it to scroll away. */
  hideTitle?: boolean;
}) {
  return (
    <header className={styles.bar}>
      {onBack ? (
        <button type="button" className={`${styles.back} lg`} onClick={onBack} data-back aria-label={backLabel}>
          <Chevron back />
        </button>
      ) : (
        <span />
      )}
      {onTitle ? (
        <button type="button" className={styles.titleButton} onClick={onTitle}>
          <span className={styles.title}>{title}</span>
          <Chevron />
        </button>
      ) : (
        <h2 className={styles.title} data-hidden={hideTitle || undefined}>
          {title}
        </h2>
      )}
      <span className={styles.barEnd}>{end}</span>
    </header>
  );
}
