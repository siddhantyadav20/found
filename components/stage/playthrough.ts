import type { Flag, ReplyOption, Story } from "@/content/types";
import { add, expose, see, stamp, type CaseState } from "@/lib/game/engine";
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
  const now = Date.now();
  // When the player was last here, so a return after a real gap is noticed.
  const stamped = { ...stamp(next, now), at: { ...next.at, last: now } };
  commit(stamped);

  const id = boundCase();
  if (!id) return;
  const had = new Set(before?.flags ?? []);
  for (const f of stamped.flags) {
    if (had.has(f)) continue;
    const event = reportFlag(f);
    if (event) track({ case: id, event, via: stamped.via, seconds: (now - stamped.started) / 1000 });
  }
}

/** Set flags on the latest save. */
export function flag(...flags: Flag[]): void {
  const s = readProgress();
  if (s) save(add(s, ...flags));
}

/** Saying something: what it sets, and what it hands over. */
export function say(story: Story, option: Pick<ReplyOption, "sets" | "exposes">): void {
  const s = readProgress();
  if (!s) return;
  let next = add(s, ...(option.sets ?? []));
  if (option.exposes) next = expose(story, next, option.exposes);
  save(next);
}

/** Having looked at something: it goes into the case file, if it can. */
export function read(story: Story, ids: readonly string[]): void {
  const s = readProgress();
  if (s) save(ids.reduce((acc, id) => see(story, acc, id), s));
}

/** Handing something over: flags, and one entry in their ledger. */
export function give(story: Story, exposure: string, ...flags: Flag[]): void {
  const s = readProgress();
  if (s) save(expose(story, add(s, ...flags), exposure));
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
