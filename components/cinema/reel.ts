import { useSyncExternalStore } from "react";

import { REELS } from "@/content/site";

/* The little that Roll and Nav share: which chapter is up, whether the reel
   is moving (a moving reel closes the menu), and how to ask it to go somewhere. */

type Snapshot = { readonly index: number; readonly moving: boolean };

let snapshot: Snapshot = { index: 0, moving: false };
let driver: ((chapter: number) => void) | null = null;
const listeners = new Set<() => void>();

const publish = (next: Snapshot) => {
  snapshot = next;
  listeners.forEach((l) => l());
};

export const reel = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  },
  get: () => snapshot,
  setSlot(slot: number) {
    const index = slot % REELS.length;
    if (index !== snapshot.index) publish({ ...snapshot, index });
  },
  setMoving(moving: boolean) {
    if (moving !== snapshot.moving) publish({ ...snapshot, moving });
  },
  /** Roll registers itself; there's nothing to drive away from the home page. */
  drive(next: ((chapter: number) => void) | null) {
    driver = next;
  },
  goTo(chapter: number) {
    driver?.(chapter);
  },
};

const server: Snapshot = { index: 0, moving: false };

export function useReel() {
  return useSyncExternalStore(reel.subscribe, reel.get, () => server);
}
