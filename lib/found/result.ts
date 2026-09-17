import type { EpisodeNo, Flag, Story } from "@/content/found/types";
import { has, type CaseState } from "./engine";

/* ===========================================================================
   How a playthrough went, in a form that spoils nothing.

   One mark per puzzle solved, in the order it was solved: clean, needed a
   hint, or got it wrong first. Minutes, hints, and which cast the envelope
   dealt ("I got Mira" is the question friends ask each other). No puzzle is
   named and no answer appears, so it can go in a group chat before anyone
   else has played.

   Pure, and read off the save alone: the order of `flags` is the order
   things happened, and `ep:2` and `ep:3` split the episodes.
   =========================================================================== */

export type Mark = "clean" | "hinted" | "wrong";

export type Result = {
  readonly episode: EpisodeNo;
  readonly marks: readonly Mark[];
  readonly hints: number;
  /** Wall-clock minutes for the episode, breaks included. Null until it has ended. */
  readonly minutes: number | null;
  readonly name: string;
};

export const MARK_EMOJI: Record<Mark, string> = { clean: "🟩", hinted: "🟨", wrong: "🟥" };

/** Where each episode starts and stops, in the order flags were set. */
const START: Record<EpisodeNo, Flag | null> = { 1: null, 2: "ep:2", 3: "ep:3" };

export function resultOf(ep: Story, s: CaseState, episode: EpisodeNo): Result {
  const puzzles = new Set([...ep.locks.map((l) => l.id), ...ep.deductions.map((d) => d.id)]);
  const startAt = (n: EpisodeNo) => (START[n] ? s.flags.indexOf(START[n]) : 0);
  const from = startAt(episode);
  const next = episode < 3 ? startAt((episode + 1) as EpisodeNo) : -1;
  const inEpisode = (i: number) => from >= 0 && i >= from && (next < 0 || i < next);

  const solved: string[] = [];
  s.flags.forEach((f, i) => {
    if (!inEpisode(i)) return;
    const id = f.startsWith("lock:") ? f.slice(5) : f.startsWith("solved:") ? f.slice(7) : "";
    if (puzzles.has(id)) solved.push(id);
  });

  const marks = solved.map<Mark>((id) =>
    has(s, `did:wrong:${id}`) ? "wrong" : (s.hints[id] ?? 0) > 0 ? "hinted" : "clean",
  );
  const hints = solved.reduce((n, id) => n + (s.hints[id] ?? 0), 0);

  const [began, ended] =
    episode === 1
      ? [s.started, s.at["dead"]]
      : episode === 2
        ? [s.at["did:plugged"] ?? s.at["ep:2"], s.at["ep:2-done"]]
        : [s.at["ep:3"], s.at["ep:3-done"]];
  const minutes = began !== undefined && ended !== undefined && ended > began ? Math.max(1, Math.round((ended - began) / 60_000)) : null;

  return { episode, marks, hints, minutes, name: s.cast.name };
}

/** "31 min · 1 hint · I got Mira" */
export function resultLine(r: Result): string {
  return [
    r.minutes !== null ? `${r.minutes} min` : null,
    r.hints === 0 ? "no hints" : `${r.hints} hint${r.hints === 1 ? "" : "s"}`,
    `I got ${r.name}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * What goes into WhatsApp. The hook first, because the first line is what a
 * chat list shows; the link second, so the preview card sits under it; the
 * result last, for whoever already played.
 */
export function shareText(title: string, r: Result | null, url: string): string {
  const lines = ["Someone left this for you. Don't unlock it.", url];
  if (r && r.marks.length) {
    lines.push("", `FOUND · ${title} · Ep ${r.episode}`, r.marks.map((m) => MARK_EMOJI[m]).join(""), resultLine(r));
  }
  return lines.join("\n");
}
