import type { EpisodeNo, Story } from "@/content/types";
import { episodeOf, traced, type CaseState } from "@/lib/game/engine";

/* ===========================================================================
   How a playthrough went, in a form that spoils nothing.

   Not a count of hints, and not a verdict: **how much of the chain the
   player traced**, past the version they were handed. "I traced 9 of 11
   links" names nothing in the story, gives no answer away, and is the
   chapter's thesis in a line, so it can go in a group chat before anyone
   else has played (CHAPTER1.md J).

   Pure, and read off the save alone.
   =========================================================================== */

export type Result = {
  readonly episode: EpisodeNo;
  /** The ids of the links traced, in the chain's order. */
  readonly traced: readonly string[];
  /** How many links the chain has. */
  readonly links: number;
  /** Wall-clock minutes, breaks included. Null until the chapter has ended. */
  readonly minutes: number | null;
  readonly title: string;
};

export function resultOf(story: Story, s: CaseState, now?: number): Result {
  const last = Math.max(s.started, ...Object.values(s.at), now ?? 0);
  const ended = s.flags.includes("did:chose");
  return {
    episode: episodeOf(s),
    traced: traced(story, s).map((l) => l.id),
    links: story.chain.length,
    minutes: ended ? Math.max(1, Math.round((last - s.started) / 60_000)) : null,
    title: story.title,
  };
}

/** "I traced 9 of 11 links." The brag is eleven. */
export const tracedLine = (n: number, of: number): string => `I traced ${n} of ${of} link${of === 1 ? "" : "s"}.`;

export const resultLine = (r: Result): string => tracedLine(r.traced.length, r.links);

/** What goes in the chat when someone passes the phone on. The case's question is the hook. */
export function shareText(title: string, result: Result | null, url: string, ask: string): string {
  const lines = [`${title} — Found`, ...(result ? [resultLine(result)] : []), ask, url];
  return lines.join("\n");
}
