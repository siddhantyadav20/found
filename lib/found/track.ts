/** One thing that happened, in one case. `via` is the drop the player arrived through. */
export type Beat = { case: string; event: string; seconds?: number; via?: string };

/**
 * Tell the funnel something happened. Fire-and-forget: `sendBeacon` survives
 * the tab closing, which is exactly when "got this far and gave up" gets
 * decided. Never throws, never blocks, sends no identifier.
 */
export function track(beat: Beat): void {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify({ ...beat, seconds: beat.seconds === undefined ? undefined : Math.round(beat.seconds) });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/found", blob)) return;
    void fetch("/api/found", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  } catch {
    // Measuring the game must never be the thing that breaks it.
  }
}
