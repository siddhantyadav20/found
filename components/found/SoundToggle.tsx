"use client";

import { useSyncExternalStore } from "react";

import { setSoundOn, soundOn, soundOnServerSide, subscribeSound } from "@/lib/sound";

/**
 * Sound on or off, for the whole site: the buzz, the memos, the keys. Says
 * which it is, and a tap flips it. Styled by whoever places it.
 */
export default function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, soundOn, soundOnServerSide);
  return (
    <button type="button" className={className} aria-pressed={on} onClick={() => setSoundOn(!on)}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
        {on ? (
          <path d="M10.5 5.2a4 4 0 0 1 0 5.6M12.4 3.4a6.6 6.6 0 0 1 0 9.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        ) : (
          <path d="m10.5 6 3.5 4m0-4-3.5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        )}
      </svg>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
