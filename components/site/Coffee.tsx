"use client";

import { useRef, useState } from "react";

import styles from "./Coffee.module.css";

/* ===========================================================================
   Buy me a coffee (2026-10-25). The QR isn't on the page: it's asked for
   only when someone presses the button, and shown in a dialog, on paper.
   Drop the UPI QR at `public/support/upi-qr.png`; until it's there, the
   dialog says so rather than showing a broken image.
   =========================================================================== */

const QR = "/support/upi-qr.png";

export default function Coffee() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [asked, setAsked] = useState(false);
  const [missing, setMissing] = useState(false);

  const open = () => {
    setAsked(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className={styles.button} onClick={open} aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1.5h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5c0 1.2-1 1.3-1 2.5M11.5 3.5c0 1.2-1 1.3-1 2.5M15 3.5c0 1.2-1 1.3-1 2.5" />
        </svg>
        Buy me a coffee
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="coffee-title"
        // A click on the dark round the card closes it.
        onClick={(e) => e.target === dialog.current && close()}
      >
        <div className={styles.card}>
          <p className={styles.eyebrow}>Buy me a coffee</p>
          <h3 id="coffee-title" className={styles.title}>
            Scan with any UPI app
          </h3>
          <div className={styles.qr}>
            {asked && !missing ? (
              // eslint-disable-next-line @next/next/no-img-element -- fetched only once asked for, never optimised or preloaded
              <img src={QR} alt="UPI QR code for Siddhant Yadav" width={240} height={240} onError={() => setMissing(true)} />
            ) : (
              <span className={styles.missing}>{missing ? "The QR code isn't up yet. Thank you for looking." : ""}</span>
            )}
          </div>
          <p className={styles.note}>Any amount, any app. It goes into the next chapter.</p>
          <span className={styles.stamp} aria-hidden="true">
            Thank you
          </span>
          <button type="button" className={styles.close} onClick={close}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
