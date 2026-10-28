"use client";

import { useCallback, useRef } from "react";

/* ===========================================================================
   Where a list was scrolled to, kept for the visit (2026-10-28). Photos lays
   its viewer over the grid, so putting a photo away lands where it was; the
   other apps swap a list for what was opened in it, and the list used to come
   back at the top. Every scrolling list keys itself here instead, and comes
   back where it was left: a chat list, a memo list, an inbox, a settings page.
   =========================================================================== */

const kept = new Map<string, number>();

/**
 * A ref for a scrolling element: whenever it's put on screen it opens where
 * it was last left under this key, and it remembers as it's scrolled.
 */
export function useKeptScroll<T extends HTMLElement>(key: string | undefined): (el: T | null) => void {
  const off = useRef<(() => void) | null>(null);
  return useCallback(
    (el: T | null) => {
      off.current?.();
      off.current = null;
      if (!el || !key) return;
      const at = kept.get(key);
      let frame = 0;
      if (at !== undefined) {
        el.scrollTop = at;
        // Pictures that size themselves a frame later can leave it short: once more, after they have.
        frame = requestAnimationFrame(() => {
          if (Math.abs(el.scrollTop - at) > 2) el.scrollTop = at;
        });
      }
      const save = () => kept.set(key, el.scrollTop);
      el.addEventListener("scroll", save, { passive: true });
      off.current = () => {
        cancelAnimationFrame(frame);
        el.removeEventListener("scroll", save);
      };
    },
    [key],
  );
}
