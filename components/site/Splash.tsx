import Mark from "./Mark";
import SplashScript from "./SplashScript";
import styles from "./Splash.module.css";

/* ===========================================================================
   The splash (2026-10-23; a loader since the 2026-10-25 revamp): Found's
   mark drawn in on black over a count to 100, then the dark splits down
   the middle and slides away, the way a game's loader opens on its world.
   Pure CSS, so it never waits on JavaScript and never blocks a tap: it
   goes on its own and stops catching the pointer as it does. The script
   ahead of it marks a visit that has already seen it, so a second page in
   the same visit opens straight away.
   =========================================================================== */

export default function Splash() {
  return (
    <>
      <SplashScript />
      <div className={styles.splash} aria-hidden="true">
        <span className={styles.half} />
        <span className={styles.half} data-right />
        <div className={styles.center}>
          <Mark size={40} animate />
          <p className={styles.count} />
          <p className={styles.line}>Thrillers on somebody else&apos;s phone</p>
        </div>
      </div>
    </>
  );
}
