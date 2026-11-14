"use client";

import { useEffect, useRef, type RefObject } from "react";

import { EASE, reducedMotion } from "@/lib/found/motion";

/* ===========================================================================
   iOS never moves one screen alone (2026-11-15, MOTION.md #3). When a screen
   is pushed, the one it came from slides a third of the way left and dims
   under it; going back, it slides back and lights up as the top one leaves;
   and a swipe back shows it underneath, following the finger.

   Most apps here unmount the list when they open a chat, so there's nothing
   underneath to move. The phone keeps a picture of it instead: on a tap in
   an app, the app's screen is copied (a "ghost", inert), and once React has
   drawn whatever the tap opened, the ghost plays the part of the screen
   that went. A push keeps its ghost for the swipe back.

   A screen is told apart by its back button: how it's labelled, and how
   many there are ("Chats" in a conversation, the name in its contact info).
   Anything with its own way in and out (`data-own-motion`: the photo viewer,
   which grows out of its thumbnail) is left to it.
   =========================================================================== */

const PUSH_MS = 420;
const POP_MS = 360;
const UNDER = "-30%";
const DIM = "brightness(0.78)";

type Ghost = { el: HTMLElement; sig: string };

function backOf(layer: HTMLElement): HTMLElement | null {
  const backs = layer.querySelectorAll<HTMLElement>("[data-back]:not([data-ghost] *)");
  return backs[backs.length - 1] ?? null;
}

/** Which screen is up: its back button, or the app's own first screen. */
function sigOf(layer: HTMLElement): string {
  const back = backOf(layer);
  const n = layer.querySelectorAll("[data-back]:not([data-ghost] *)").length;
  return back ? `${n}:${back.getAttribute("aria-label") ?? ""}` : "root";
}

function viewOf(layer: HTMLElement): HTMLElement | null {
  const back = backOf(layer);
  return (back?.closest<HTMLElement>("[data-push], [data-own-motion], section") ?? layer.querySelector<HTMLElement>(":scope > :not([data-ghost])")) || null;
}

/** A still copy of the app as it is: scroll kept, nothing playing, nothing to tap. */
function snapshot(layer: HTMLElement): HTMLElement {
  const ghost = document.createElement("div");
  ghost.dataset.ghost = "";
  ghost.setAttribute("aria-hidden", "true");
  ghost.inert = true;
  Object.assign(ghost.style, {
    position: "absolute",
    inset: "0",
    overflow: "hidden",
    background: "var(--os-bg)",
    pointerEvents: "none",
  });
  const scrolled: [number, number][] = [];
  const all = Array.from(layer.querySelectorAll<HTMLElement>("*"));
  all.forEach((el, i) => {
    if (el.scrollTop > 0) scrolled.push([i, el.scrollTop]);
  });
  for (const child of Array.from(layer.children)) {
    if ((child as HTMLElement).dataset.ghost !== undefined) continue;
    ghost.appendChild(child.cloneNode(true));
  }
  ghost.querySelectorAll("video").forEach((v) => {
    v.removeAttribute("autoplay");
    v.pause();
  });
  // Scroll positions don't copy; put them back once it's on the page.
  (ghost as HTMLElement & { restore?: () => void }).restore = () => {
    const copies = Array.from(ghost.querySelectorAll<HTMLElement>("*"));
    for (const [i, top] of scrolled) if (copies[i]) copies[i].scrollTop = top;
  };
  return ghost;
}

function place(layer: HTMLElement, ghost: HTMLElement, onTop: boolean) {
  ghost.style.zIndex = onTop ? "20" : "0";
  if (onTop) layer.appendChild(ghost);
  else layer.insertBefore(ghost, layer.firstChild);
  (ghost as HTMLElement & { restore?: () => void }).restore?.();
}

/** Run a screen in without its own CSS entrance: the script does it here. */
function quiet(view: HTMLElement) {
  view.style.animation = "none";
}

export function usePushMotion(appRef: RefObject<HTMLDivElement | null>, appKey: string | undefined) {
  const stack = useRef<Ghost[]>([]);
  const peeking = useRef<HTMLElement | null>(null);
  const swiping = useRef(false);

  // A new app: nothing underneath.
  useEffect(() => {
    stack.current = [];
  }, [appKey]);

  useEffect(() => {
    const layer = appRef.current;
    if (!layer) return undefined;
    const onTap = (e: MouseEvent) => {
      if (reducedMotion()) return;
      const target = e.target as Element;
      // Only a tap on something that does something can open a screen; nothing else is copied.
      if (target.closest("[data-ghost]") || !target.closest("button, a, [role=button]")) return;
      const isBack = Boolean(target.closest("[data-back]"));
      if (isBack && target.closest("[data-own-motion]")) return;
      const before = sigOf(layer);
      const beforeView = viewOf(layer);
      const ghost = snapshot(layer);
      // Once React has drawn what the tap did, before the frame is painted.
      requestAnimationFrame(() => {
        const after = sigOf(layer);
        if (after === before) return;
        const view = viewOf(layer);
        if (!view || view.dataset.ownMotion !== undefined) return;

        if (isBack) {
          stack.current.pop();
          if (swiping.current) {
            // The swipe already moved everything; take away the picture underneath.
            swiping.current = false;
            peeking.current?.remove();
            peeking.current = null;
            return;
          }
          place(layer, ghost, true);
          ghost.animate([{ translate: "0 0" }, { translate: "100% 0" }], { duration: POP_MS, easing: EASE.out }).onfinish = () =>
            ghost.remove();
          ghost.style.boxShadow = "-12px 0 30px rgba(0, 0, 0, 0.35)";
          quiet(view);
          view.animate(
            [
              { translate: `${UNDER} 0`, filter: DIM },
              { translate: "0 0", filter: "none" },
            ],
            { duration: POP_MS, easing: EASE.out },
          );
          return;
        }

        // A push: something with a way back opened over what was there.
        if (!backOf(layer)) return;
        stack.current.push({ el: ghost, sig: after });
        quiet(view);
        view.animate([{ translate: "100% 0" }, { translate: "0 0" }], { duration: PUSH_MS, easing: EASE.out });
        // The screen it came from: itself, if it's still there underneath, or its picture.
        const under = beforeView && beforeView !== view && beforeView.isConnected && !beforeView.contains(view) ? beforeView : ghost;
        if (under === ghost) place(layer, ghost, false);
        under
          .animate(
            [
              { translate: "0 0", filter: "none" },
              { translate: `${UNDER} 0`, filter: DIM },
            ],
            { duration: PUSH_MS, easing: EASE.out },
          )
          .onfinish = () => {
          if (under === ghost) ghost.remove();
        };
      });
    };
    layer.addEventListener("click", onTap, true);
    return () => layer.removeEventListener("click", onTap, true);
  }, [appRef, appKey]);

  return {
    /** The finger is `dx` across a screen `width` wide: show what's underneath, following it. */
    peek(dx: number, width: number) {
      const layer = appRef.current;
      const top = stack.current.at(-1);
      if (!layer || !top || top.sig !== sigOf(layer) || reducedMotion()) return;
      if (!peeking.current) {
        peeking.current = top.el;
        place(layer, top.el, false);
      }
      const f = Math.min(1, Math.max(0, dx / width));
      top.el.style.transition = "none";
      top.el.style.translate = `${-30 * (1 - f)}% 0`;
      top.el.style.filter = `brightness(${0.78 + 0.22 * f})`;
    },
    /** The finger let go: going back (`go`), or staying. */
    settle(go: boolean, ms: number) {
      const el = peeking.current;
      if (!el) return;
      el.style.transition = `translate ${ms}ms var(--ease-out), filter ${ms}ms var(--ease-out)`;
      el.style.translate = go ? "0 0" : `${UNDER} 0`;
      el.style.filter = go ? "none" : DIM;
      if (go) swiping.current = true;
      else
        window.setTimeout(() => {
          el.remove();
          if (peeking.current === el) peeking.current = null;
        }, ms);
    },
  };
}
