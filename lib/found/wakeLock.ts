import { useEffect } from "react";

/**
 * Keep the screen on while `active`. A case is read in silence, and a phone
 * that locks itself mid-thought throws the player out of someone else's.
 *
 * The browser lets go of the lock whenever the tab is hidden, so it's taken
 * again each time the tab comes back. Where there's no Wake Lock API (older
 * Safari), nothing happens and nothing breaks.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let live = true;
    const take = () => {
      if (document.visibilityState !== "visible") return;
      navigator.wakeLock
        .request("screen")
        .then((l) => {
          if (live) lock = l;
          else void l.release();
        })
        .catch(() => {});
    };
    take();
    document.addEventListener("visibilitychange", take);
    return () => {
      live = false;
      document.removeEventListener("visibilitychange", take);
      void lock?.release().catch(() => {});
    };
  }, [active]);
}
