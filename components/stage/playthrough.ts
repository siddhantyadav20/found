import type { Flag, ReplyOption, Story } from "@/content/types";
import { add, see, stamp, type CaseState } from "@/lib/game/engine";
import { STORIES } from "@/content/stories";
import type { CaseId } from "@/content/cases";
import { reportFlag } from "@/lib/found/events";
import { boundCase, commit, readProgress } from "@/lib/found/progress";
import { track } from "@/lib/found/track";

/* ===========================================================================
   Every write to the playthrough, in one place.

   The stage, the case file and every app on her phone change the save the
   same way: read the latest, add to it, write it back. Doing it here means
   three things happen on every save without anybody remembering to:

   - the episode's start is stamped, so its clock begins at its own base
   - the moment is kept as `at.last`, so coming back after a gap is noticed
   - each flag that means something is reported to the funnel, once
   - nothing works from a stale copy of the save

   Nothing here renders; it is the store's front door.
   =========================================================================== */

export function save(next: CaseState): void {
  const before = readProgress();
  // Nothing changed: writing anyway would stamp a new time, re-render every
  // reader, and let an effect that marks things read loop forever.
  if (before && next === before) return;
  const now = Date.now();
  // When the player was last here, so a return after a real gap is noticed.
  const stamped = { ...stamp(next, now), at: { ...next.at, last: now } };
  commit(stamped);

  const id = boundCase();
  if (!id) return;
  const had = new Set(before?.flags ?? []);
  for (const f of stamped.flags) {
    if (had.has(f)) continue;
    const event = reportFlag(f, STORIES[id as CaseId]);
    if (event) track({ case: id, event, via: stamped.via, seconds: (now - stamped.started) / 1000 });
  }
}

/** Set flags on the latest save. */
export function flag(...flags: Flag[]): void {
  const s = readProgress();
  if (s) save(add(s, ...flags));
}

/** Saying something: what it sets. */
export function say(option: Pick<ReplyOption, "sets">): void {
  const s = readProgress();
  if (s) save(add(s, ...(option.sets ?? [])));
}

/** Having looked at something: it goes into the case file, if it can. */
export function read(story: Story, ids: readonly string[]): void {
  const s = readProgress();
  if (s) save(ids.reduce((acc, id) => see(story, acc, id), s));
}

/** A wrong answer costs nothing in the game. The funnel still wants to know. */
export function wrong(question: string): void {
  const id = boundCase();
  if (id) track({ case: id, event: `wrong:${question}`, via: readProgress()?.via });
}

/** The game noticed a player was stuck, and offered help unasked. */
export function nudged(question: string): void {
  const id = boundCase();
  if (id) track({ case: id, event: `nudge:${question}`, via: readProgress()?.via });
}
