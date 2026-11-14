"use client";

import { useEffect, useState } from "react";

import { talkingNow } from "./voice";

/* ===========================================================================
   A screen left alone dims (2026-11-15, MOTION.md #9): after a minute with
   no touch, key or wheel it falls to half brightness, and any input brings
   it back at once. It never locks. Not while somebody is talking, a video
   is playing or a call is up: nobody touches a phone they're listening to.
   =========================================================================== */

// A click too: a switch or a screen reader can press without any pointer moving.
const WAKE = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "click"] as const;

function busy(): boolean {
  if (talkingNow()) return true;
  if (document.querySelector("[data-ringing], [data-answered]")) return true;
  return Array.from(document.querySelectorAll("video")).some((v) => !v.paused);
}

export function useIdleDim(after = 60_000): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t = 0;
    const check = () => {
      if (busy()) t = window.setTimeout(check, 5000);
      else setIdle(true);
    };
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(check, after);
    };
    for (const e of WAKE) window.addEventListener(e, wake, { passive: true, capture: true });
    t = window.setTimeout(check, after);
    return () => {
      window.clearTimeout(t);
      for (const e of WAKE) window.removeEventListener(e, wake, { capture: true });
    };
  }, [after]);
  return idle;
}
