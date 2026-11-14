"use client";

import { useEffect, useState } from "react";

import type { Gate } from "@/content/types";
import { getBattery, type BatteryLike } from "@/lib/found/battery";
import { plugged } from "@/lib/found/tones";
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

/** How long the plugged-in moment holds before the night goes on. */
const PLUGGED_MS = 1900;

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
  /* The cable going in is a moment of its own (MOTION.md §3.1): the screen
     comes on black with the big battery and its bolt, the chime, the level
     climbing from nothing. Then the episode. */
  const [plugging, setPlugging] = useState(false);
  const plugIn = () => {
    if (plugging) return;
    setPlugging(true);
    plugged();
    try {
      navigator.vibrate?.(20);
    } catch {
      // No buzz; the chime carries it.
    }
    window.setTimeout(onPlugged, PLUGGED_MS);
  };

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
    const check = () => battery.charging && plugIn();
    battery.addEventListener("chargingchange", check);
    return () => battery.removeEventListener("chargingchange", check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battery]);

  return (
    <div className={styles.charge} data-plugging={plugging || undefined}>
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

      <button type="button" className={`act ${styles.cable}`} onClick={plugIn}>
        Plug it in
      </button>

      {plugging && (
        <div className={styles.plugged} role="status" aria-label={`Charging, ${gate.level}`}>
          <span className={styles.bigCell} aria-hidden="true">
            <span className={styles.bigFill} />
            <svg viewBox="0 0 24 24" className={styles.bolt}>
              <path d="M13.5 2 5 13.5h6L10.5 22 19 10.5h-6z" />
            </svg>
          </span>
          <span className={styles.pluggedLevel}>{gate.level}</span>
        </div>
      )}
    </div>
  );
}
