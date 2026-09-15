"use client";

import { useEffect, useRef, useState } from "react";

import { getBattery, type BatteryLike } from "@/lib/found/battery";
import { keyTap } from "@/lib/found/buzz";
import { useDevice } from "@/lib/found/platform";
import * as play from "./actions";
import styles from "./Charge.module.css";

/** How the found phone came back: the player's real charger, one already in, or the on-screen cable. */
type How = "real" | "already" | "tap";
type Power = "checking" | "waiting" | "none";

/** From power arriving to Episode 2's first screen. */
const WAKE_MS = 1800;

/**
 * Episode 2's cold open. The phone is dead, and the last thing it said was
 * "Keep it charged."
 *
 * Where the browser can read the battery, the found phone wakes only when
 * the player's own device is really plugged in: the phone in their hand and
 * the one in the story charge together. Where it can't (Safari, Firefox),
 * the on-screen cable does it instead. See lib/found/battery.ts.
 */
export default function Charge({ onPlug }: { onPlug: () => void }) {
  const { handheld } = useDevice();
  const [power, setPower] = useState<Power>("checking");
  const [plugged, setPlugged] = useState(false);
  const done = useRef(false);
  const onPlugRef = useRef(onPlug);

  useEffect(() => {
    onPlugRef.current = onPlug;
  });

  const wake = (how: How) => {
    if (done.current) return;
    done.current = true;
    setPlugged(true);
    keyTap();
    play.verdict(`charge:${how}`);
    window.setTimeout(() => onPlugRef.current(), WAKE_MS);
  };
  const wakeRef = useRef(wake);
  useEffect(() => {
    wakeRef.current = wake;
  });

  useEffect(() => {
    let live = true;
    let battery: BatteryLike | null = null;
    const onChange = () => {
      if (battery?.charging) wakeRef.current("real");
    };
    getBattery().then((b) => {
      if (!live) return;
      battery = b;
      if (!b) return setPower("none");
      if (b.charging) {
        setPower("waiting");
        wakeRef.current("already");
        return;
      }
      setPower("waiting");
      b.addEventListener("chargingchange", onChange);
    });
    return () => {
      live = false;
      battery?.removeEventListener("chargingchange", onChange);
    };
  }, []);

  const device = handheld ? "phone" : "laptop";

  return (
    <div className={styles.charge}>
      <p className={styles.echo}>“Keep it charged.”</p>
      <span className={styles.cell} data-on={plugged || undefined}>
        <span className={styles.level} />
      </span>
      <p className={styles.state}>{plugged ? "Charging" : "Monday, 19:40. The phone is dead."}</p>

      {power === "none" ? (
        <>
          <button
            type="button"
            className={styles.cable}
            data-in={plugged || undefined}
            onClick={() => wake("tap")}
            aria-label="Plug the phone in"
          >
            <span className={styles.plug} />
            <span className={styles.cord} />
          </button>
          {!plugged && <p className={styles.hint}>Plug it in</p>}
        </>
      ) : (
        <>
          <span className={styles.cable} data-in={plugged || undefined} data-waiting={power === "waiting" && !plugged ? "" : undefined} aria-hidden="true">
            <span className={styles.plug} />
            <span className={styles.cord} />
          </span>
          {power === "waiting" && !plugged && (
            <div className={styles.real} role="status">
              <p className={styles.hint}>Plug in the {device} you&rsquo;re playing on.</p>
              <p className={styles.sub}>This one charges when yours does.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
