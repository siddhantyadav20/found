"use client";

import { useEffect, useState } from "react";

import type { Gate } from "@/content/types";
import { getBattery, type BatteryLike } from "@/lib/found/battery";
import styles from "./Charge.module.css";

/* ===========================================================================
   The end of Episode 1: the found phone is about to die, and the player's own
   charger is the only thing that keeps it (PLAYER-JOURNEY Stage 5).

   It asks once, warmly, and then waits: no nagging, no timer, no way to fail
   it. Where the browser won't say whether a charger is in (Safari, Firefox),
   there is a cable on screen after two minutes and the beat reads the same.
   The words are the chapter's own (`story.gate`).
   =========================================================================== */

export default function Charge({ gate, onPlugged }: { gate: Gate; onPlugged: () => void }) {
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
      <p className={styles.level}>{gate.level}</p>
      {gate.lines.map((line) => (
        <p key={line} className={styles.line}>
          {line}
        </p>
      ))}

      <p className={styles.ask}>{gate.ask}</p>

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
