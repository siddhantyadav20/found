/* ===========================================================================
   Episode drops (2026-10-24): an episode can be held back until a set time,
   so a launch's cliffhanger has a night to travel. Set per case and episode
   at build time, as an ISO time:

     NEXT_PUBLIC_RELEASE_RAAKH_3=2026-11-01T21:00:00+05:30

   Nothing set, nothing held. A tester skips the wait with
   localStorage["found:early"] = "1".
   =========================================================================== */

const RELEASES: Readonly<Record<string, string | undefined>> = {
  // Written out in full: Next inlines NEXT_PUBLIC_ variables only where they're named.
  "raakh:3": process.env.NEXT_PUBLIC_RELEASE_RAAKH_3,
};

/** When an episode arrives, if it's held back: a time in ms, or undefined. */
export function releaseOf(caseId: string, episode: number): number | undefined {
  const raw = RELEASES[`${caseId}:${episode}`];
  const at = raw ? Date.parse(raw) : NaN;
  return Number.isFinite(at) ? at : undefined;
}

/** Whether this browser waits for releases at all (a tester's doesn't). */
export function waitsForRelease(): boolean {
  try {
    return window.localStorage.getItem("found:early") !== "1";
  } catch {
    return true;
  }
}

/** "Saturday, 9 PM": when it arrives, said the way a friend would. */
export function releaseWhen(at: number): string {
  const d = new Date(at);
  const day = d.toLocaleDateString("en-IN", { weekday: "long" });
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: d.getMinutes() ? "2-digit" : undefined, hour12: true }).toUpperCase();
  return `${day}, ${time}`;
}

/** "14h 05m", "3m 20s": what's left, for a countdown. */
export function releaseLeft(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h >= 24) return `${Math.floor(h / 24)}d ${String(h % 24).padStart(2, "0")}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}
