import type { CallCue, Flag, Story } from "@/content/types";
import { has, type CaseState } from "./engine";

/* ===========================================================================
   The call that never ends.

   Two pure things: what the timer reads, and which line he says next. The
   React side (components/call) owns the video, the buttons and the captions;
   everything decidable without a DOM is decided here, so it can be tested.

   The timer counts *up*. It started 31 hours before the player opened the
   pouch, and nothing in the chapter pauses it (ROADMAP.md P2).
   =========================================================================== */

const two = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** 113_587 → "31:33:07". Hours run past 24 on purpose: that's the point. */
export function duration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${two(s / 3600)}:${two((s % 3600) / 60)}:${two(s % 60)}`;
}

/** How long the call has run, in seconds, this many ms into the playthrough. */
export const ranFor = (story: Story, elapsedMs: number): number =>
  story.call.since + Math.floor(elapsedMs / 1000);

/**
 * The line he says next.
 *
 * A cue whose `when` flag has just landed wins, and each of those plays once.
 * Otherwise he idles: the loop is there so he reads as a man in a room rather
 * than a paused frame, and idle lines repeat in order, never at random, so
 * two players see the same performance.
 */
export function nextCue(story: Story, s: CaseState, spoken: readonly string[], idleTurn: number): CallCue | null {
  const unspoken = (c: CallCue) => !spoken.includes(c.id);

  const triggered = story.cues.filter(
    (c) => c.when !== "idle" && c.when !== "open" && has(s, c.when as Flag) && unspoken(c),
  );
  if (triggered.length) return triggered[0];

  const opening = story.cues.find((c) => c.when === "open" && unspoken(c));
  if (opening) return opening;

  const idle = story.cues.filter((c) => c.when === "idle");
  return idle.length ? idle[idleTurn % idle.length] : null;
}

/** Is someone standing behind him right now? It changes what he can say. */
export const watched = (cue: CallCue | null): boolean => Boolean(cue?.supervisorPresent);

/**
 * His wall clock. Myanmar runs an hour ahead of India, and the clock in the
 * "Mumbai Crime Branch" office is the first proof of where he really is, so
 * it has to be right to the minute from the first second (CHAPTER1.md F1).
 */
export function hisClock(mumbai: string): string {
  const [h, m] = mumbai.split(":").map(Number);
  return `${two((h + 1) % 24)}:${two(m)}`;
}
