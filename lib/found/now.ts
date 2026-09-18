import { useSyncExternalStore } from "react";

/* ===========================================================================
   One clock for the whole page.

   A single interval, shared by everything that shows a time, and read at the
   grain each reader needs: the call's timer re-renders every second, the
   stage only when the minute changes. Nothing above the timer pays for its
   seconds (QA.md §6).
   =========================================================================== */

const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((f) => f()), 1000);
  return () => {
    listeners.delete(fn);
    if (!listeners.size && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** The time now, rounded down to `step` ms, so a reader only re-renders when it moves. */
export function useNow(step = 1000): number {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / step) * step,
    () => 0,
  );
}
