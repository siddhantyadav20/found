import styles from "./Screen.module.css";

/* The found phone's status bar, on its own so that a page drawing the phone
   (the front page) needn't bring the whole phone with it. */

/** The aeroplane iOS draws for airplane mode. */
export const PLANE =
  "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z";

/** Wi-Fi: three arcs, as the status bar draws them. */
export const WIFI =
  "M8 11.4 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.3 6.7a6.6 6.6 0 0 1 9.4 0l-1.5 1.5a4.5 4.5 0 0 0-6.4 0zM1 4.4a9.9 9.9 0 0 1 14 0l-1.5 1.5a7.8 7.8 0 0 0-11 0z";

export function StatusBar({
  time,
  battery,
  recording,
  charging,
  airplane,
  locked,
}: {
  time: string;
  battery: number;
  recording?: boolean;
  charging?: boolean;
  airplane?: boolean;
  /** On the Lock Screen the big clock tells the time, and the corner names the carrier. */
  locked?: boolean;
}) {
  /* The true level, as iOS draws it (2026-10-29: 9% was drawn at six times its
     width and read as half full). A sliver still shows at the very bottom. */
  const width = Math.max(6, Math.min(100, battery));
  return (
    <div className={styles.status} aria-hidden="true">
      {locked && !recording ? (
        <span className={styles.carrier}>{airplane ? "" : "Jio"}</span>
      ) : (
        <span className={recording ? styles.recording : undefined}>{time}</span>
      )}
      <span className={styles.statusIcons}>
        {airplane ? (
          <svg viewBox="0 0 24 24" className={styles.plane}>
            <path d={PLANE} />
          </svg>
        ) : (
          <>
        <svg viewBox="0 0 18 12" className={styles.signal}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" opacity={i < 3 ? 1 : 0.3} />
          ))}
        </svg>
        <svg viewBox="0 0 16 12" className={styles.wifi}>
          <path d={WIFI} />
        </svg>
          </>
        )}
        <span
          className={styles.battery}
          data-low={(battery <= 7 && !charging) || undefined}
          data-charging={charging || undefined}
        >
          <span className={styles.cell}>
            <span className={styles.fill} style={{ width: `${width}%` }} />
            <span className={styles.cellNum} data-dark={width >= 55 || undefined}>
              {battery}
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
