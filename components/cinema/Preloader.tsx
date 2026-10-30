import ExploreFace from "./ExploreFace";
import Logo from "./Logo";
import PreloaderScript from "./PreloaderScript";
import styles from "./Preloader.module.css";

/* ===========================================================================
   The preloader (2026-10-31), 1:1 with siena.film: hairline black stripes on
   cream swell until the screen is black, the wordmark inverted through them,
   the subline out of a blur, then ENTER. Pure CSS, so it never waits on
   JavaScript; the script ahead of it only decides whether it shows at all.
   =========================================================================== */

export default function Preloader() {
  return (
    <>
      <PreloaderScript />
      <noscript>
        <style>{`[data-preloader]{display:none!important}[data-page],[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <div className={styles.preloader} data-preloader>
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
