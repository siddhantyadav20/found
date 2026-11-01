import ExploreFace from "./ExploreFace";
import Logo from "./Logo";
import PreloaderScript from "./PreloaderScript";
import styles from "./Preloader.module.css";

/* ===========================================================================
   The preloader (2026-10-31), 1:1 with siena.film: hairline black stripes on
   cream swell until the screen is black, the wordmark widening through them,
   the subline out of a blur, then ENTER. Pure CSS; the script ahead of it says
   whether it shows at all and when it runs. Found's sound mark plays over it.
   =========================================================================== */

export default function Preloader() {
  return (
    <>
      <PreloaderScript />
      <noscript>
        <style>{`[data-preloader]{display:none!important}[data-page],[data-reveal],[data-late],[data-a]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className={styles.preloader} data-preloader>
        <div className={styles.gate}>
          <p className={styles.gateLine}>Sound on</p>
          <button type="button" className={styles.button} data-btn="explore">
            <ExploreFace label="BEGIN" />
          </button>
        </div>
        <div className={styles.field} />
        <div className={styles.center}>
          <Logo className={styles.logo} />
          <p className={styles.line}>Thriller Game</p>
        </div>
        <div className={styles.enter}>
          <button type="button" className={styles.button} data-enter data-btn="explore">
            <ExploreFace label="ENTER" />
          </button>
        </div>
      </div>
    </>
  );
}
