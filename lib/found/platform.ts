import { useSyncExternalStore } from "react";

/* ===========================================================================
   Which phone the player's own hands expect.

   The phone in Found should feel like the one in the player's pocket: Android
   for an Android player, iOS for an iPhone, and iOS everywhere else (a laptop,
   a desktop), the look the pilot was drawn in.

   Only the browser can say, and the phone only ever renders in the browser
   (a case's save lives there), so the server's answer is simply the default.
   `?os=android` / `?os=ios` overrides it in development.
   =========================================================================== */

export type OS = "ios" | "android";

export type Device = {
  readonly os: OS;
  /** Held in the hand (a phone or a tablet) rather than on a desk. */
  readonly handheld: boolean;
};

export function detectOS(ua: string): OS {
  return /Android/i.test(ua) ? "android" : "ios";
}

/** iPadOS reports itself as a Mac; a "Mac" with a touch screen is an iPad. */
export function isHandheld(ua: string, maxTouchPoints = 0): boolean {
  return /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1);
}

const SERVER: Device = { os: "ios", handheld: false };
let cached: Device | null = null;

function readDevice(): Device {
  if (cached) return cached;
  const ua = navigator.userAgent;
  let os = detectOS(ua);
  if (process.env.NODE_ENV === "development") {
    const forced = new URLSearchParams(window.location.search).get("os");
    if (forced === "android" || forced === "ios") os = forced;
  }
  cached = { os, handheld: isHandheld(ua, navigator.maxTouchPoints) };
  return cached;
}

/** Fixed for the life of the page, so nothing to subscribe to. */
const never = () => () => {};

export function useDevice(): Device {
  return useSyncExternalStore(never, readDevice, () => SERVER);
}
