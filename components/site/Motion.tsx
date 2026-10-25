"use client";

import { useEffect } from "react";

/* ===========================================================================
   The page's pointer (2026-10-25), one small island for all of it:
   - `[data-tilt]` leans toward the pointer: it gets --mx and --my, each
     from -1 to 1, measured from its own centre, and its CSS turns them
     into rotation and parallax;
   - `[data-spot]` lights where the pointer is: it gets --x and --y in px.
   Only with a mouse, and never when motion is reduced. Without it, every
   one of them simply sits still.
   =========================================================================== */

export default function Motion() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return undefined;

    let x = 0;
    let y = 0;
    let frame = 0;

    const lean = () => {
      frame = 0;
      for (const el of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const mx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (r.width / 2 + 200)));
        const my = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (r.height / 2 + 200)));
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      }
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const spot = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--x", `${e.clientX - r.left}px`);
        spot.style.setProperty("--y", `${e.clientY - r.top}px`);
      }
      if (!frame) frame = requestAnimationFrame(lean);
    };

    addEventListener("pointermove", move, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
