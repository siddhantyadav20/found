"use client";

import { useEffect, useState } from "react";

import { getBattery, type BatteryLike } from "@/lib/found/battery";
import styles from "./Charge.module.css";

/* ===========================================================================
   The end of Episode 1, and the chapter's complicity beat.

   The power bank taped to her phone has given out. The call is the only thing
   keeping a boy in a room somewhere off a quota sheet, and to keep it alive
   the player has to get up, find a cable and plug in **their own phone**.

   Half an hour later they learn what they were powering (PLAYER-JOURNEY
   Stage 5). It asks once, warmly, and then waits: no nagging, no timer, no
   way to fail it.

   Where the browser won't say (Safari, Firefox), there is a cable on screen
   and the beat reads exactly the same.
   =========================================================================== */

export default function Charge({ onPlugged }: { onPlugged: () => void }) {
  const [battery, setBattery] = useState<BatteryLike | null | undefined>(undefined);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    let live = true;
    void getBattery().then((b) => live && setBattery(b));
    const t = window.setTimeout(() => setWaited(true), 120_000);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!battery) return undefined;
    const check = () => battery.charging && onPlugged();
    check();
    battery.addEventListener("chargingchange", check);
    return () => battery.removeEventListener("chargingchange", check);
  }, [battery, onPlugged]);

  // No battery to read, or two minutes of nothing: a cable they can tap.
  const cable = battery === null || waited;

  return (
    <div className={styles.charge}>
      <p className={styles.level}>4%</p>
      <p className={styles.line}>The power bank taped to her phone has gone out.</p>
      <p className={styles.line}>
        He is still talking. If the call drops, the boy on it loses a meal, and neither of you
        knows that yet.
      </p>

      <p className={styles.ask}>Plug your phone in to keep the call alive.</p>

      {cable ? (
        <button type="button" className={styles.cable} onClick={onPlugged}>
          Plug it in
        </button>
      ) : (
        <p className={styles.waiting}>Waiting for a charger…</p>
      )}
    </div>
  );
}
