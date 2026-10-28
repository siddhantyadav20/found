import { RESOLVE, type Ending, type EndingLine, type Flag, type Story } from "@/content/types";
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
  const acted = story.endings.find((e) => has(s, endFlag(e.id)));
  if (acted || !has(s, RESOLVE)) return acted;
  /* Played to its end rather than chosen by one act: the first ending whose
     flags all hold and none of whose `not` do (Last Local). */
  return story.endings.find((e) => e.when.flags && all(s, e.when.flags) && !(e.when.not ?? []).some((f) => has(s, f)));
}

/** A line is read when the player did what it needs, and none of what it can't bear. */
export const earned = (s: CaseState, l: EndingLine): boolean =>
  all(s, l.needs) && (!l.any || l.any.some((f) => has(s, f))) && !(l.unless ?? []).some((f) => has(s, f));

export const linesFor = (s: CaseState, lines: readonly EndingLine[]): EndingLine[] => lines.filter((l) => earned(s, l));

/** What finishing sets: the ending, and the chapter's own "it's over". */
export const finish = (id: EndingId): readonly Flag[] => [endFlag(id), "did:chose"];

/**
 * Choose differently (2026-10-29): the save as it was just before the last
 * choice, so a finisher can try another ending without replaying the night.
 *
 * Flags are kept in the order they landed, so cutting the list where the
 * choice was made takes everything after it too: the ending, what came
 * before it, the card. A night that went face down goes back to M's call,
 * where looking or not was decided; every other one goes back to the last
 * question, filed again. Undefined when there's nothing to go back to.
 */
export function rewindToChoice(story: Story, s: CaseState): CaseState | undefined {
  const last = story.questions.find((q) => q.final);
  const at = has(s, "did:facedown")
    ? s.flags.indexOf("did:rv-meera")
    : last
      ? s.flags.findIndex((f) => f === `ask:${last.id}` || f.startsWith(`claim:${last.id}:`))
      : -1;
  if (at < 0) return undefined;
  return { ...s, flags: s.flags.slice(0, at) };
}
