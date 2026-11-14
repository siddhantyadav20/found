"use client";

import { useState } from "react";

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
  // It goes as iOS's do, a little smaller and fading, before it's gone (MOTION.md 3.3).
  const [leaving, setLeaving] = useState(false);
  const close = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onClose, 160);
  };
  return (
    <div className={styles.scrim} role="alertdialog" aria-modal="true" aria-label={title} data-no-swipe data-leaving={leaving || undefined}>
      <div className={`${styles.box} lg-thick`}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.button} onClick={close}>
          {button}
        </button>
      </div>
    </div>
  );
}
