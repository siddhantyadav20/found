import { useSyncExternalStore } from "react";

/* ===========================================================================
   Filling in (fix brief §8.7, H-26): the player has started a sentence or a
   table in the case file and hasn't filed it. On a wide table the notebook
   is always open, so the night's turns (a call, a banner) wait on this as
   they wait on the case file being open on the phone.
   =========================================================================== */

let filling = false;
const listeners = new Set<() => void>();

/** Said by the case file whenever its open question gains or loses words or proof. */
export function markFilling(now: boolean): void {
  if (filling === now) return;
  filling = now;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useFilling = (): boolean => useSyncExternalStore(subscribe, () => filling, () => false);
