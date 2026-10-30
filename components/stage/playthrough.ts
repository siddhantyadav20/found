import type { Flag, ReplyOption, Story } from "@/content/types";
import { add, CLOCK, clockMinutes, keepClock, recover, remove, see, settle, stamp, type CaseState } from "@/lib/game/engine";
import { sawClue } from "@/lib/game/reading";
import { playingStory } from "@/components/found/StoryContext";
import { reportFlag } from "@/lib/found/events";
import { boundCase, commit, readProgress } from "@/lib/found/progress";
import { track } from "@/lib/found/track";

/* ===========================================================================
   Every write to the playthrough, in one place.

   The stage, the case file and every app on his phone change the save the
   same way: read the latest, add to it, write it back. Doing it here means
   three things happen on every save without anybody remembering to:

   - the episode's start is stamped, so its clock begins at its own base
   - evidence found by an act done earlier counts once its episode opens
   - the moment is kept as `at.last`, so coming back after a gap is noticed
   - each flag that means something is reported to the funnel, once
   - nothing works from a stale copy of the save

   Nothing here renders; it is the store's front door.
   =========================================================================== */

export function save(given: CaseState): void {
  const before = readProgress();
  const bound = boundCase();
  // Anything found by an act already done counts as soon as it can.
  const story = playingStory();
  const next = bound && story ? settle(story, given) : given;
  // Nothing changed: writing anyway would stamp a new time, re-render every
  // reader, and let an effect that marks things read loop forever.
  if (before && next === before) return;
  const now = Date.now();
  // When the player was last here, so a return after a real gap is noticed.
  let stamped: CaseState = { ...stamp(next, now), at: { ...next.at, last: now } };
  // Each identity clue, the first time it's seen, on the story's clock: Look again says when (RAAKH-V3 §15).
  if (story?.clues) {
    const at = { ...stamped.at };
    for (const c of story.clues) if (at[CLOCK(`clue:${c.id}`)] === undefined && sawClue(stamped, c)) at[CLOCK(`clue:${c.id}`)] = clockMinutes(story, stamped, now);
    stamped = { ...stamped, at };
  }
  commit(stamped);

  const id = boundCase();
  // A night gone back to its last choice was counted the first time through.
  if (!id || !story || stamped.at.rewound) return;
  const had = new Set(before?.flags ?? []);
  for (const f of stamped.flags) {
    if (had.has(f)) continue;
    const event = reportFlag(f, story);
    if (event) track({ case: id, event, via: stamped.via, seconds: (now - stamped.started) / 1000 });
  }
}

/** Set flags on the latest save. */
export function flag(...flags: Flag[]): void {
  const s = readProgress();
  if (s) save(add(s, ...flags));
}

/**
 * Saying something: what it sets, and when it was said, so what comes back
 * arrives then. The story's clock is kept against what it set ("said:<flag>"),
 * for the reveal's montage and "Previously" to quote the time.
 */
export function say(option: Pick<ReplyOption, "sets">, replyId?: string): void {
  sayAll([option], replyId);
}

/** Everything said on one call, in order. */
export function sayAll(options: readonly Pick<ReplyOption, "sets">[], replyId?: string): void {
  const s = readProgress();
  const story = playingStory();
  if (!s) return;
  const now = Date.now();
  let said = add(s, ...options.flatMap((o) => o.sets ?? []));
  if (story) {
    // When it was said: before what comes back moves the clock on.
    const minute = clockMinutes(story, s, now);
    const at = { ...said.at };
    for (const f of options.flatMap((o) => o.sets ?? [])) if (at[CLOCK(`said:${f}`)] === undefined) at[CLOCK(`said:${f}`)] = minute;
    said = { ...said, at };
  }
  save(replyId ? { ...said, at: { ...said.at, [`event:${replyId}`]: now } } : said);
}

/**
 * Having looked at something: it goes into the case file, if it can. What
 * has to be heard (a clip, a memo) waits for its player to say so (`heard`).
 */
export function read(story: Story, ids: readonly string[]): void {
  const s = readProgress();
  const looked = ids.filter((id) => !story.evidence.find((e) => e.id === id)?.heard);
  if (s && looked.length) save(looked.reduce((acc, id) => see(story, acc, id), s));
}

/** Played past the moment that makes it evidence (lib/found/heard.ts). */
export function heardIt(story: Story, id: string): void {
  const s = readProgress();
  if (s) save(see(story, s, id));
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

/** How far the player has read a chat: what its unread count starts from (lib/game/chat.ts). */
export function markRead(key: string, count: number): void {
  const s = readProgress();
  if (s && (s.at[key] ?? -1) < count) save({ ...s, at: { ...s.at, [key]: count } });
}

/**
 * Delete something on his phone (RAAKH-V3 §17): to Recently Deleted, or for
 * good. When, on the story's clock, is kept for the reveal's montage.
 */
export function deleteItem(item: string, how: "soft" | "perm"): void {
  const s = readProgress();
  const story = playingStory();
  if (!s) return;
  const gone = remove(s, item, how);
  save(story && how === "perm" ? keepClock(story, gone, `deleted:${item}`, Date.now()) : gone);
}

/** Put back from Recently Deleted what the player deleted. */
export function recoverItem(item: string): void {
  const s = readProgress();
  if (s) save(recover(s, item));
}

/**
 * Control Centre's airplane mode, where it goes back off (`Story.airplaneToggles`).
 * Turned on before the phone died in Episode 1, Bhasin notices it went dark.
 */
export function toggleAirplane(): void {
  const s = readProgress();
  if (!s) return;
  const on = !s.airplane;
  const marked = on ? add(s, "did:airplane", ...(s.flags.includes("ask:q3") ? [] : (["did:went-dark"] as const))) : s;
  save({ ...marked, airplane: on });
}

/** Send things to M (`Story.sendTo`, RAAKH-V3 §8.7): she has a copy, from now. When is kept for her chat. */
export function sendToM(evidence: readonly string[]): void {
  const s = readProgress();
  const story = playingStory();
  if (!s || !story) return;
  let next = add(s, "did:sent-m", ...evidence.map((id): `did:${string}` => `did:sent-m-${id}`));
  for (const id of evidence) if (next.at[CLOCK(`sent:${id}`)] === undefined) next = keepClock(story, next, `sent:${id}`, Date.now());
  save(next);
}
