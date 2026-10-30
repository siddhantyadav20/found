import { useSyncExternalStore } from "react";

/* ===========================================================================
   How fast people write back (fix brief §8.7): Normal, Fast, or Instant.
   A per-browser convenience, kept in localStorage; "typing…" bubbles take
   their scripted time times this, and a tap on one skips it either way.
   =========================================================================== */

export type Pace = "normal" | "fast" | "instant";

const KEY = "found:pace";
const FACTOR: Record<Pace, number> = { normal: 1, fast: 0.35, instant: 0 };
const listeners = new Set<() => void>();

function read(): Pace {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "fast" || v === "instant" ? v : "normal";
  } catch {
    return "normal";
  }
}

export function setPace(p: Pace): void {
  try {
    window.localStorage.setItem(KEY, p);
  } catch {
    // Private browsing: it holds for this page only.
  }
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const usePace = (): Pace => useSyncExternalStore(subscribe, read, () => "normal");

/** What a "typing…" delay is multiplied by at this pace. */
export const paceFactor = (p: Pace): number => FACTOR[p];
