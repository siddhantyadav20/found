/* The little every scrolling page shares (2026-11-01): one requestAnimationFrame
   for everything that moves with the page, and siena.film's "how far through
   this element has the page got", from 0 to 1. */

type Frame = (now: number) => void;

const frames = new Set<Frame>();
let raf = 0;

function loop(now: number) {
  frames.forEach((f) => f(now));
  raf = frames.size ? requestAnimationFrame(loop) : 0;
}

export function onFrame(frame: Frame) {
  frames.add(frame);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => void frames.delete(frame);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, low = 0, high = 1) => Math.min(Math.max(v, low), high);
export const expoOut = (p: number) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p));
/** Into [-e, e): how far a slot in a loop of 2e is from the middle. */
export const wrap = (v: number, e: number) => {
  const d = e * 2;
  return ((((v + e) % d) + d) % d) - e;
};

type Edge = "top" | "center" | "bottom";

/**
 * Starts when the element's top meets `top` of the screen and ends when its
 * bottom meets `bottom`. Measured once and on resize: an element that this
 * moves would otherwise chase itself.
 */
export function track(el: Element, top: Edge = "bottom", bottom: Edge = "top") {
  let start = 0;
  let end = 1;
  const at = (edge: Edge) => (edge === "top" ? 0 : edge === "center" ? innerHeight / 2 : innerHeight);
  const measure = () => {
    const box = el.getBoundingClientRect();
    start = box.top + scrollY - at(top);
    end = box.bottom + scrollY - at(bottom);
  };
  measure();
  addEventListener("resize", measure);
  return {
    measure,
    value: () => clamp((scrollY - start) / (end - start || 1)),
    destroy: () => removeEventListener("resize", measure),
  };
}
