import type { EpisodeNo, Story } from "@/content/types";
import { episodeOf, traced, type CaseState } from "@/lib/game/engine";
import { chosen } from "@/lib/game/endings";
import { vowsOf } from "@/lib/game/reading";

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
  /** Played without where-to-look or nudges (chosen at the parcel). */
  readonly detective?: boolean;
  /** What the night's last hours decided, as the share says it ("I got there before seven."). */
  readonly fate?: string;
  /** The whole share line, where the chapter writes its own (`Story.endCopy.share`, RAAKH-V3 §11). */
  readonly line?: string;
};

/** "Raakh · Ending: Room 6 · Promises kept: 1 of 3.": spoiler-safe, from the chapter's own words. */
export function endLine(story: Story, s: CaseState): string | undefined {
  const ending = chosen(story, s);
  if (!story.endCopy || !ending) return undefined;
  const vows = vowsOf(story, s);
  return story.endCopy.share
    .replace("{ending}", ending.row)
    .replace("{kept}", String(vows.filter((v) => v.state === "kept").length))
    .replace("{made}", String(vows.length));
}

export function resultOf(story: Story, s: CaseState, now?: number): Result {
  const last = Math.max(s.started, ...Object.values(s.at), now ?? 0);
  const ended = s.flags.includes("did:chose");
  return {
    episode: episodeOf(s),
    traced: traced(story, s).map((l) => l.id),
    links: story.chain.length,
    minutes: ended ? Math.max(1, Math.round((last - s.started) / 60_000)) : null,
    title: story.title,
    detective: s.flags.includes("did:detective"),
    fate: story.fate ? (s.flags.includes(story.fate.yes) ? story.fate.share.yes : s.flags.includes(story.fate.no) ? story.fate.share.no : undefined) : undefined,
    line: endLine(story, s),
  };
}

/** "I traced 9 of 11 links." The brag is eleven. */
export const tracedLine = (n: number, of: number): string => `I traced ${n} of ${of} link${of === 1 ? "" : "s"}.`;

export const resultLine = (r: Result): string =>
  r.line
    ? r.line + (r.detective ? " As a detective." : "")
    : (r.fate ? `${r.fate} ` : "") + tracedLine(r.traced.length, r.links) + (r.detective ? " As a detective." : "");

/**
 * What goes in the chat when someone passes the phone on: the title, the
 * brag, the premise in a breath, the case's question, and the link.
 */
export function shareText(title: string, result: Result | null, url: string, ask: string, hook?: string): string {
  const lines = [`${title} — Found`, ...(result ? [resultLine(result)] : []), hook ? `${hook} ${ask}` : ask, url];
  return lines.join("\n");
}
