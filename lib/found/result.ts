import type { EpisodeNo, Story } from "@/content/types";
import { episodeOf, type CaseState } from "@/lib/game/engine";

/* ===========================================================================
   How a playthrough went, in a form that spoils nothing.

   Read off the save alone, and pure. Until ROADMAP S3 it is the ledger: one
   line per thing the player handed over, and the count. S3 replaces it with
   the chain ("I traced 9 of 11 links"), which is *Shagun*'s thesis in a line.
   =========================================================================== */

export type Result = {
  readonly episode: EpisodeNo;
  /** What the end card lists, in the order it was handed over. */
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

/** The result in one line, for the share. Spoils nothing. */
export function resultLine(r: Result): string {
  if (r.held.length === 0) return "I gave nothing away.";
  if (r.held.length === 1) return "I gave 1 thing away.";
  return `I gave ${r.held.length} things away.`;
}

/** What goes in the chat when someone passes the phone on. The case's question is the hook. */
export function shareText(title: string, result: Result | null, url: string, ask: string): string {
  const lines = [`${title} — Found`, ...(result ? [resultLine(result)] : []), ask, url];
  return lines.join("\n");
}
