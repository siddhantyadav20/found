"use client";

import { useEffect, useState } from "react";

/* ===========================================================================
   Motion the CSS can't do alone (2026-11-15, MOTION.md §4): an element that
   travels from where something else was (FLIP), and the tokens' curves for
   the Web Animations API. The six curves and four lengths are app/globals.css's;
   these are the same numbers, for script.
   =========================================================================== */

export const EASE = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.7, 0, 0.2, 1)",
  in: "cubic-bezier(0.5, 0, 0.75, 0)",
  springSoft: "cubic-bezier(0.2, 0.9, 0.3, 1.1)",
  spring: "cubic-bezier(0.3, 1.4, 0.5, 1)",
} as const;

export const T = { quick: 200, short: 400, mid: 800, long: 1200 } as const;

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Play `el` in from `from` (a box on screen, in viewport pixels) to where it
 * is now: the First-Last-Invert-Play trick. The phone can be scaled on the
 * desk, so the move is measured in the element's own pixels.
 */
export function flyFrom(
  from: DOMRect,
  el: HTMLElement,
  {
    ms = 380,
    ease = EASE.out,
    scale = true,
    uniform = false,
    delay = 0,
  }: { ms?: number; ease?: string; scale?: boolean; uniform?: boolean; delay?: number } = {},
): Animation | undefined {
  if (reducedMotion() || typeof el.animate !== "function") return undefined;
  const to = el.getBoundingClientRect();
  if (!to.width || !to.height) return undefined;
  // How much the page has scaled this element: its box on screen over its own width.
  const k = el.offsetWidth ? to.width / el.offsetWidth : 1;
  if (uniform) {
    // A picture growing out of its thumbnail: one scale, centre to centre, filling the thumbnail's box.
    const u = Math.max(from.width / to.width, from.height / to.height);
    const ux = (from.left + from.width / 2 - (to.left + to.width / 2)) / k;
    const uy = (from.top + from.height / 2 - (to.top + to.height / 2)) / k;
    return el.animate(
      [{ transform: `translate(${ux}px, ${uy}px) scale(${u})` }, { transform: "none" }],
      { duration: ms, easing: ease, delay, fill: "backwards" },
    );
  }
  // Without scaling (a block of text that only moves), centre to centre.
  const dx = (scale ? from.left - to.left : from.left + from.width / 2 - (to.left + to.width / 2)) / k;
  const dy = (scale ? from.top - to.top : from.top + from.height / 2 - (to.top + to.height / 2)) / k;
  const s = scale ? ` scale(${from.width / to.width}, ${from.height / to.height})` : "";
  return el.animate(
    [
      { transformOrigin: "0 0", transform: `translate(${dx}px, ${dy}px)${s}`, opacity: scale ? 0.9 : 1 },
      { transformOrigin: "0 0", transform: "none", opacity: 1 },
    ],
    { duration: ms, easing: ease, delay, fill: "backwards" },
  );
}

/* A launch: a tapped thing (a reply) leaves a box behind, and the next
   thing to land (the message it becomes) flies from it. Short-lived, so a
   message that arrives later for another reason never flies from a stale tap. */
let launched: { box: DOMRect; at: number } | null = null;

export function launch(from: Element) {
  launched = { box: from.getBoundingClientRect(), at: performance.now() };
}

/** Whether a launch is waiting to land. */
export function inFlight(): boolean {
  return Boolean(launched && performance.now() - launched.at < 900);
}

/** A ref for whatever the launch becomes: it flies in from the tapped box, once. */
export function land(el: HTMLElement | null, how?: Parameters<typeof flyFrom>[2]) {
  if (!el || !launched) return;
  const l = launched;
  launched = null;
  if (performance.now() - l.at < 900) {
    el.dataset.flown = "";
    flyFrom(l.box, el, how);
  }
}

/** True for `ms` after `key` changes (not on the first render): "online" after a message lands. */
export function useBlip(key: unknown, ms: number): boolean {
  const [prev, setPrev] = useState(key);
  const [on, setOn] = useState(false);
  // Adjusted while rendering, as React suggests for state that follows a prop.
  if (key !== prev) {
    setPrev(key);
    setOn(true);
  }
  useEffect(() => {
    if (!on) return undefined;
    const t = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(t);
  }, [on, ms, prev]);
  return on;
}
