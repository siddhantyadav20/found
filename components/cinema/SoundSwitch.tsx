"use client";

import { useSyncExternalStore } from "react";

import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";
import { menuTick } from "./sounds";
import styles from "./SoundSwitch.module.css";

/**
 * Sound on or off (2026-11-05), beside the logo on every page of the site. It
 * is the same switch as the parcel's ringer and the phone's: one setting, kept
 * under `sy-sound`, for the site's cues, the sound mark, the game's buzzes,
 * voice notes and clips. Four bars that move while it's on, lie flat when off.
 */
export default function SoundSwitch({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  const flip = () => {
    setSoundOn(!on);
    if (!on) menuTick();
  };
  return (
    <button
      type="button"
      className={`${styles.switch} ${className ?? ""}`}
      aria-pressed={on}
      aria-label={on ? "Sound on. Turn it off." : "Sound off. Turn it on."}
      data-on={on || undefined}
      data-cursor="hide"
      onClick={flip}
    >
      {[0, 1, 2, 3].map((i) => (
        <i key={i} style={{ animationDelay: `${i * -0.27}s` }} />
      ))}
    </button>
  );
}
