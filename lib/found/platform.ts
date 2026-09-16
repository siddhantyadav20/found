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

/** The in-app browsers that forget everything when closed, and that a link from a reel opens in. */
export type InApp = "instagram" | "facebook";

export function inAppBrowser(ua: string): InApp | null {
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua)) return "facebook";
  return null;
}

/** The same page in Chrome, from inside an Android in-app browser (or the page itself, without Chrome). */
export function chromeIntent(href: string): string {
  const u = new URL(href);
  const scheme = u.protocol.replace(":", "");
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
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

/**
 * On an Android phone, the case takes the whole screen, as a game would. Call
 * it inside the tap. iPhone Safari has no full screen for pages, and a
 * laptop's is the player's own business.
 */
export function enterFullscreen(): void {
  const { os, handheld } = readDevice();
  if (os !== "android" || !handheld || document.fullscreenElement) return;
  if (window.matchMedia("(display-mode: standalone)").matches) return;
  document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
}

/** Fixed for the life of the page, so nothing to subscribe to. */
const never = () => () => {};

export function useDevice(): Device {
  return useSyncExternalStore(never, readDevice, () => SERVER);
}
