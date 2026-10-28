"use client";

import { useEffect, useState } from "react";

import styles from "./Screens.module.css";

/* ===========================================================================
   PG-DEATH (RAAKH-V3 §6, end of Episode 1): the low-battery alert, two
   flickers, off. For about eight frames the black glass shows the faint
   shape of whoever is holding it, no features (IC7). Then black, and on.
   =========================================================================== */

/** Head and shoulders, as a dark screen reflects them: nothing anyone could name. */
function Shape() {
  return (
    <svg viewBox="0 0 200 240" aria-hidden="true">
      <ellipse cx="100" cy="86" rx="44" ry="54" />
      <path d="M8 240c6-58 46-86 92-86s86 28 92 86Z" />
      <rect x="138" y="168" width="40" height="72" rx="10" />
    </svg>
  );
}

export default function PhoneDeath({ alert, onDone }: { alert: string; onDone: () => void }) {
  const [step, setStep] = useState<"alert" | "off" | "black">("alert");
  const [title, line] = alert.split(" · ");

  useEffect(() => {
    // The alert waits for its OK: the player ends the episode, it isn't snatched away (2026-10-28).
    if (step === "alert") return undefined;
    if (step === "off") {
      try {
        navigator.vibrate?.(30);
      } catch {
        // No buzz; the flicker carries it.
      }
      const t = window.setTimeout(() => setStep("black"), 1900);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(onDone, 1400);
    return () => window.clearTimeout(t);
  }, [step, onDone]);

  return (
    <div className={styles.death} data-over={step === "alert" || undefined} role="dialog" aria-label="The phone dies">
      {step === "alert" && (
        <div className={styles.alertOver}>
          <div className={styles.deathAlert} role="alert">
            <b>{title}</b>
            <span>{line}</span>
            <button type="button" onClick={() => setStep("off")} autoFocus>
              OK
            </button>
          </div>
        </div>
      )}
      {step === "off" && (
        <>
          <div className={styles.screenOn} />
          <div className={styles.flicker} />
          <div className={styles.silhouette}>
            <Shape />
          </div>
        </>
      )}
    </div>
  );
}
