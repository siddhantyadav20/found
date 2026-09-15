import { useSyncExternalStore } from "react";

/* ===========================================================================
   The player's own preferences, as opposed to the case's state: kept on this
   device, never in a save, never sent anywhere.

   Larger Text is the first. It lives in the found phone's Settings (Display
   & Brightness), because that's where a phone keeps it, but it's a setting
   for the person reading, so it outlives any one case.
   =========================================================================== */

const LARGER_TEXT = "found:larger-text";

let large: boolean | null = null;
const listeners = new Set<() => void>();

function readLargerText(): boolean {
  if (large === null) {
    try {
      large = window.localStorage.getItem(LARGER_TEXT) === "1";
    } catch {
      large = false;
    }
  }
  return large;
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setLargerText(on: boolean): void {
  large = on;
  try {
    if (on) window.localStorage.setItem(LARGER_TEXT, "1");
    else window.localStorage.removeItem(LARGER_TEXT);
  } catch {
    // Storage refused: it still holds for this visit.
  }
  for (const fn of listeners) fn();
}

export function useLargerText(): boolean {
  return useSyncExternalStore(subscribe, readLargerText, () => false);
}
