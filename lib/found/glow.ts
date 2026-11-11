import { useSyncExternalStore } from "react";

import type { AppId } from "@/content/types";

/* ===========================================================================
   The app that glows on the Home Screen (2026-11-12): help that shows
   before it tells. The case file says which app the next clue is in, after
   the player's own pause, and the icon pulses until anything else happens
   (`until`: how many flags the save had, so any progress puts it out).
   =========================================================================== */

type Glowing = { readonly app: AppId; readonly until: number } | null;

let glowing: Glowing = null;
const listeners = new Set<() => void>();

export function glowApp(next: Glowing): void {
  if (glowing?.app === next?.app && glowing?.until === next?.until) return;
  glowing = next;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The app glowing now, for a save with this many flags; nothing once the save has moved on. */
export function useGlowApp(flags: number): AppId | null {
  const g = useSyncExternalStore(subscribe, () => glowing, () => null);
  return g && g.until === flags ? g.app : null;
}
