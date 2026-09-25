"use client";

import styles from "./Alert.module.css";

/* ===========================================================================
   An iOS alert: a title, a line under it, and one button, on a pane of glass
   over the dimmed screen. What the phone says when it can't do something it
   was asked to, in its own words. It covers whatever positioned box it's put
   in, which on the found phone is the screen.
   =========================================================================== */

export default function Alert({
  title,
  message,
  button = "OK",
  onClose,
}: {
  title: string;
  message: string;
  button?: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.scrim} role="alertdialog" aria-modal="true" aria-label={title} data-no-swipe>
      <div className={`${styles.box} lg-thick`}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.button} onClick={onClose}>
          {button}
        </button>
      </div>
    </div>
  );
}
