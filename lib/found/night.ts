import type { NightBeat, Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";

/* ===========================================================================
   Your night (2026-10-24): the beats of `Story.night` this player's save
   earned, in the order the story gives them, and the same as a share that
   spoils nothing. Pure, and read off the save alone.
   =========================================================================== */

const earned = (s: CaseState, b: NightBeat): boolean =>
  all(s, b.needs) && (!b.any || b.any.some((f) => has(s, f))) && !(b.unless ?? []).some((f) => has(s, f));

export const nightOf = (story: Story, s: CaseState): readonly NightBeat[] => (story.night ?? []).filter((b) => earned(s, b));

/** "My night in Raakh", one beat a line, the case's question, and the link. */
export function nightText(title: string, beats: readonly NightBeat[], ask: string, url: string): string {
  const shared = beats.filter((b) => b.share);
  return [`My night in ${title} — Found`, ...shared.map((b) => `${b.at} · ${b.share}`), ask, url].join("\n");
}
