/* ===========================================================================
   The player's real battery, where the browser will say.

   Episode 2 begins with the found phone dead, and it only comes back when the
   device the player is holding is really plugged in. Chromium browsers
   (Chrome, Edge, Samsung Internet, on Android and on laptops) expose the
   battery through `navigator.getBattery()`. Safari and Firefox don't, and
   there the found phone falls back to an on-screen cable.

   A desktop with no battery reports itself as charging, which is true enough:
   it's plugged in.
   =========================================================================== */

export type BatteryLike = EventTarget & { readonly charging: boolean; readonly level: number };

type WithBattery = Navigator & { getBattery?: () => Promise<BatteryLike> };

/**
 * Development only, for testing every path on one machine:
 * `?battery=unplugged` gives a battery that isn't charging until
 * `window.foundPlug()` is called; `?battery=none` behaves like Safari.
 */
function devBattery(): BatteryLike | null | undefined {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return undefined;
  const mode = new URLSearchParams(window.location.search).get("battery");
  if (mode === "none") return null;
  if (mode !== "unplugged") return undefined;
  const fake = Object.assign(new EventTarget(), { charging: false, level: 0.21 });
  (window as unknown as { foundPlug?: () => void }).foundPlug = () => {
    fake.charging = true;
    fake.dispatchEvent(new Event("chargingchange"));
  };
  return fake;
}

/** The battery, or null where the browser won't tell. Never throws. */
export async function getBattery(): Promise<BatteryLike | null> {
  if (typeof navigator === "undefined") return null;
  const dev = devBattery();
  if (dev !== undefined) return dev;
  const nav = navigator as WithBattery;
  if (typeof nav.getBattery !== "function") return null;
  try {
    return await nav.getBattery();
  } catch {
    // Blocked by a permissions policy, or refused outright.
    return null;
  }
}
