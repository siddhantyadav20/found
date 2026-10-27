"use client";

import { useEffect, useState } from "react";

import type { Gate } from "@/content/types";
import { getBattery, type BatteryLike } from "@/lib/found/battery";
import Hand from "./v3/Hand";
import styles from "./Charge.module.css";

/* ===========================================================================
   The end of Episode 1: the found phone is about to die, and the player's own
   charger is the only thing that keeps it (PLAYER-JOURNEY Stage 5).

   It asks once, warmly, and then waits: no nagging, no timer, no way to fail
   it. Where the browser won't say whether a charger is in (Safari, Firefox),
   there is a cable on screen after thirty seconds and the beat reads the same.
   The words are the chapter's own (`story.gate`).
   =========================================================================== */

export default function Charge({
  gate,
  onPlugged,
  hand = false,
  waitMs = 30_000,
}: {
  gate: Gate;
  onPlugged: () => void;
  /** The player's hand, with the kada, bringing the cable in (RAAKH-V3 §7.12, IC8). */
  hand?: boolean;
  /** How long before the on-screen cable is offered, where the browser can't see a charger. */
  waitMs?: number;
}) {
  const [battery, setBattery] = useState<BatteryLike | null | undefined>(undefined);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    let live = true;
    void getBattery().then((b) => live && setBattery(b));
    // Thirty seconds, not two minutes: one-handed in bed, nobody waits longer at a wall they aren't near.
    const t = window.setTimeout(() => setWaited(true), waitMs);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [waitMs]);

  /* A charger going in is the moment itself. One that was already in (a
     laptop on mains) isn't a moment at all, so the player plugs his phone in
     by hand: the beat has to happen either way (PLAYTEST-SHAGUN.md #45). */
  useEffect(() => {
    if (!battery) return undefined;
    const check = () => battery.charging && onPlugged();
    battery.addEventListener("chargingchange", check);
    return () => battery.removeEventListener("chargingchange", check);
  }, [battery, onPlugged]);

  // No battery to read, one already charging, or thirty seconds of nothing: a cable they can tap.
  const cable = battery === null || Boolean(battery?.charging) || waited;

  return (
    <div className={styles.charge} data-hand={hand || undefined}>
      {hand ? (
        <Hand holding="cable" className={styles.hand} />
      ) : (
        <span className={styles.cell} aria-hidden="true">
          <span />
        </span>
      )}
      <p className={styles.level}>{gate.level}</p>
      {gate.lines.map((line) => (
        <p key={line} className={styles.line}>
          {line}
        </p>
      ))}

      <p className={styles.ask}>{gate.ask}</p>

      {cable ? (
        <button type="button" className={`act ${styles.cable}`} onClick={onPlugged}>
          Plug it in
        </button>
      ) : (
        <>
          <p className={styles.waiting}>Waiting for a charger…</p>
          {/* Nobody should give up at a wall socket they aren't near. */}
          <p className={styles.nearby}>
            No charger nearby? In {waitMs < 10_000 ? "a few seconds" : "thirty seconds"} you can plug it in here.
          </p>
        </>
      )}
    </div>
  );
}
