import type { Ending, EndingLine, Flag, Story } from "@/content/types";
import { all, has, type CaseState } from "./engine";

/* ===========================================================================
   The endings, as far as they can be decided without a screen: which one the
   player chose, and which of its lines their night earned.
   =========================================================================== */

export type EndingId = Ending["id"];

/** Set when the ending's act is done. */
export const endFlag = (id: EndingId): Flag => `did:end-${id}`;

/** Set when the last image has gone to black, so a reload lands on the end card. */
export const ENDING_SEEN: Flag = "did:ending-seen";

export function chosen(story: Story, s: CaseState): Ending | undefined {
  return story.endings.find((e) => has(s, endFlag(e.id)));
}

/** A line is read when the player did what it needs, and none of what it can't bear. */
export const earned = (s: CaseState, l: EndingLine): boolean =>
  all(s, l.needs) && (!l.any || l.any.some((f) => has(s, f))) && !(l.unless ?? []).some((f) => has(s, f));

export const linesFor = (s: CaseState, lines: readonly EndingLine[]): EndingLine[] => lines.filter((l) => earned(s, l));

/** What finishing sets: the ending, and the chapter's own "it's over". */
export const finish = (id: EndingId): readonly Flag[] => [endFlag(id), "did:chose"];
