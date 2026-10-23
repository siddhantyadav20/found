import Mark from "./Mark";
import SplashScript from "./SplashScript";
import styles from "./Splash.module.css";

/* ===========================================================================
   The splash (2026-10-23): Found's mark drawn in on black, once a visit, then
   gone. Pure CSS, so it never waits on JavaScript and never blocks a tap:
   it fades out on its own and stops catching the pointer as it does. The
   script ahead of it marks a visit that has already seen it, so a second
   page in the same visit opens straight away.
   =========================================================================== */


export default function Splash() {
  return (
    <>
      <SplashScript />
      <div className={styles.splash} aria-hidden="true">
        <div className={styles.center}>
          <Mark size={40} animate />
          <p className={styles.line}>Thrillers on somebody else&apos;s phone</p>
        </div>
      </div>
    </>
  );
}
