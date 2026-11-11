"use client";

import { useEffect, useState } from "react";

import type { Gate } from "@/content/types";
import { getBattery, type BatteryLike } from "@/lib/found/battery";
import { Still } from "./Film";
import styles from "./Charge.module.css";

/* ===========================================================================
   The end of Episode 1: the found phone is about to die, and the player's own
   charger is the only thing that keeps it (PLAYER-JOURNEY Stage 5).

   It asks once, warmly: no nagging, no timer, no way to fail it. The cable
   is on screen from the start, one tap (the 20-player playtest, 2026-11-08,
   and the handoff review of 2026-11-11: never make a player go and find a
   real charger). A real one going in still counts, for anyone who has one
   to hand. The words are the chapter's own (`story.gate`).
   =========================================================================== */

export default function Charge({
  gate,
  onPlugged,
  hand,
}: {
  gate: Gate;
  onPlugged: () => void;
  /** The player's hand, with the kada, bringing the cable in (RAAKH-V3 §7.12, IC8): its still. */
  hand?: string;
}) {
  const [battery, setBattery] = useState<BatteryLike | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    void getBattery().then((b) => live && setBattery(b));
    return () => {
      live = false;
    };
  }, []);

  /* A charger going in is the moment itself. One that was already in (a
     laptop on mains) isn't a moment at all, so the player plugs his phone in
     by hand: the beat has to happen either way (PLAYTEST-SHAGUN.md #45). */
  useEffect(() => {
    if (!battery) return undefined;
    const check = () => battery.charging && onPlugged();
    battery.addEventListener("chargingchange", check);
    return () => battery.removeEventListener("chargingchange", check);
  }, [battery, onPlugged]);

  return (
    <div className={styles.charge}>
      {hand ? (
        <Still src={hand} priority className={styles.hand} />
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

      <button type="button" className={`act ${styles.cable}`} onClick={onPlugged}>
        Plug it in
      </button>
    </div>
  );
}
