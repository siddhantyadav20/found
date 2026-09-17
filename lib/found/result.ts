import type { EpisodeNo, Story } from "@/content/types";
import { episodeOf, type CaseState } from "@/lib/game/engine";

/* ===========================================================================
   How a playthrough went, in a form that spoils nothing.

   Not a score, and not a count of hints: **what they had on you.** One line
   per thing the player handed the syndicate, in the order they handed it
   over, and the number of them. It names nothing in the story, gives away no
   answer, and it's the chapter's whole thesis in one line, so it can go
   in a group chat before anyone else has played.

   Pure, and read off the save alone (CHAPTER1.md G1.4, ROADMAP.md P3).
   =========================================================================== */

export type Result = {
  readonly episode: EpisodeNo;
  /** What the end card lists: "Your voice", "Her PIN", "Shaila's name". */
  readonly held: readonly string[];
  /** Wall-clock minutes, breaks included. Null until the chapter has ended. */
  readonly minutes: number | null;
  readonly title: string;
};

export function resultOf(story: Story, s: CaseState, now?: number): Result {
  const held = s.ledger
    .map((id) => story.exposures.find((e) => e.id === id)?.what)
    .filter((x): x is string => Boolean(x));
  const last = Math.max(s.started, ...Object.values(s.at), now ?? 0);
  const ended = s.flags.includes("did:chose");
  return {
    episode: episodeOf(s),
    held,
    minutes: ended ? Math.max(1, Math.round((last - s.started) / 60_000)) : null,
    title: story.title,
  };
}

/** "They had 4 things on me." The brag is having nothing. */
export function resultLine(r: Result): string {
  if (r.held.length === 0) return "They had nothing on me.";
  if (r.held.length === 1) return "They had 1 thing on me.";
  return `They had ${r.held.length} things on me.`;
}

/** What goes in the chat when someone passes the phone on. */
export function shareText(title: string, result: Result | null, url: string): string {
  const line = result ? resultLine(result) : "Would you have cut the call?";
  return `${title} — Found\n${line}\n${url}`;
}
