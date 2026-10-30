import styles from "./Explore.module.css";

const OUTLINE =
  "M5 1h90c0 1 .6 3 3 3s3-2 3-3h36c0 3.2 2.667 4.144 4 4.216V39c-3.2 0-4 2.667-4 4h-35c0-1.333-.8-4-4-4s-4 2.667-4 4H5c0-3.6-2.667-4.167-4-4V5c3.2 0 4-2.667 4-4Z";
const ARROW =
  "M4.481.005a6.65 6.65 0 0 1 6.46 4.659c.078.229.08.479-.003.706C10.302 7.105 8.318 10 4.48 10V8.39c.941.127 2.922-.257 4.442-2.603H0V4.208h8.938c-.756-1.229-2.216-2.78-4.457-2.78V.006Z";

function Arrow({ second = false }: { second?: boolean }) {
  return (
    <span className={styles.arrow} data-second={second || undefined}>
      <svg viewBox="0 0 11 10" fill="currentColor" aria-hidden="true">
        <path d={ARROW} />
      </svg>
    </span>
  );
}

/**
 * The perforated ticket on every "EXPLORE": a stub, a dashed tear and an
 * arrow. Only the face: the caller wraps it in the button or the link, which
 * carries `data-btn="explore"` so the hover below can find its way in.
 */
export default function ExploreFace({ label }: { label: string }) {
  return (
    <span className={styles.face}>
      <span className={styles.col}>
        <span className={styles.clip}>
          <span className={styles.text} data-after={label}>
            {label}
          </span>
        </span>
      </span>
      <span className={styles.last}>
        <span className={styles.clip}>
          <Arrow />
          <Arrow second />
        </span>
      </span>
      <svg className={styles.outline} viewBox="0 0 142 44" fill="none" aria-hidden="true">
        <path stroke="currentColor" d={OUTLINE} />
        <path className={styles.tear} stroke="currentColor" strokeDasharray="4" d="M98 4.5v34" />
      </svg>
    </span>
  );
}
