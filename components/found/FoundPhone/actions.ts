import { FEATURED, type CaseId } from "@/content/cases";
import type { AppId, Cast, Gender, Story } from "@/content/found/types";
import { STORIES } from "@/content/stories";
import * as engine from "@/lib/found/engine";
import { MILESTONE_OF } from "@/lib/found/events";
import { afterCommit, bindProgress, commit, readProgress } from "@/lib/found/progress";
import { MARK_EMOJI, resultOf } from "@/lib/found/result";
import { markSolved, noteBattery, syncSave } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import { pickCast } from "@/lib/found/voice";
import { wakeAudio } from "@/lib/found/buzz";

/* ===========================================================================
   Everything the phone can do to the case, in one place.

   Each action reads the latest saved state, runs the engine, stamps the time
   on every flag it newly set (that's the clock Mum's report is written in),
   saves the result, and counts any milestone it crossed. Components call
   these directly rather than threading callbacks through a dozen apps; the
   state comes back to them through the progress store.

   They act on whichever case `bindCase` last named. A page plays one case,
   and `CaseProvider` binds it as it renders in the browser, before any of
   these can run. Rendering reads the story from context instead
   (`useStory`), because the server renders the envelope too.
   =========================================================================== */

let caseId: CaseId = FEATURED;
let ep: Story = STORIES[FEATURED];
/** The drop this page was opened through, if any. A new case remembers it. */
let arrivedVia: string | undefined;

export function bindCase(id: CaseId, via?: string): void {
  caseId = id;
  ep = STORIES[id];
  arrivedVia = via;
  bindProgress(id);
  // With a case number, every save also goes to the shelf.
  afterCommit(syncSave);
}

function beat(event: string, seconds?: number, via = readProgress()?.via): void {
  track({ case: caseId, event, seconds, via });
}

/** An episode finished: its result is kept apart from the save, so it stays on the desk. */
function solve(episode: 1 | 2, s: engine.CaseState): void {
  const r = resultOf(ep, s, episode);
  markSolved(caseId, { episode, minutes: r.minutes, marks: r.marks.map((m) => MARK_EMOJI[m]).join(""), at: Date.now() });
}

function save(next: engine.CaseState): void {
  const prev = readProgress();
  if (!prev || next === prev) return;
  const fresh = next.flags.filter((f) => !prev.flags.includes(f));
  const ended: (1 | 2)[] = [];
  if (fresh.length) {
    const now = Date.now();
    const at: Record<string, number> = { ...next.at };
    for (const f of fresh) {
      at[f] ??= now;
      const milestone = MILESTONE_OF[f];
      if (milestone) beat(milestone, milestone === "end" ? (now - next.started) / 1000 : undefined, next.via);
      if (milestone === "end") ended.push(1);
      if (milestone === "ep2-end") ended.push(2);
    }
    next = { ...next, at };
  }
  commit(next);
  noteBattery(caseId, engine.battery(ep, next));
  for (const episode of ended) solve(episode, next);
}

/** `?cast=girl`, `?cast=boy` or `?cast=<name>` in dev, to play a specific version. */
function devCast(): Cast | null {
  if (process.env.NODE_ENV !== "development") return null;
  const q = new URLSearchParams(window.location.search).get("cast");
  if (!q) return null;
  for (const gender of ["girl", "boy"] as Gender[]) {
    if (q === gender) return { gender, name: ep.names[gender][0] };
    const name = ep.names[gender].find((n) => n.toLowerCase() === q.toLowerCase());
    if (name) return { gender, name };
  }
  return null;
}

function runId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

/** The envelope is opened: deal the cast and start the case. Runs in a click. */
export function start(): void {
  wakeAudio();
  const s = engine.see(ep, engine.newCase(devCast() ?? pickCast(ep.names), runId(), Date.now(), arrivedVia), ep.envelope.evidence);
  commit(s);
  noteBattery(caseId, engine.battery(ep, s));
  beat("open", undefined, arrivedVia);
}

/** A passed-on link was opened. Counted once per page load, before the envelope is. */
export function arrived(): void {
  if (arrivedVia) beat("drop:arrive", undefined, arrivedVia);
}

export function see(id: string | undefined): void {
  const s = readProgress();
  if (s && id) save(engine.see(ep, s, id));
}

export function seeAll(ids: readonly (string | undefined)[]): void {
  const s = readProgress();
  if (!s) return;
  let next = s;
  for (const id of ids) if (id) next = engine.see(ep, next, id);
  save(next);
}

export function unlock(lockId: string, input: string): boolean {
  const s = readProgress();
  if (!s) return false;
  const r = engine.tryUnlock(ep, s, lockId, input);
  save(r.state);
  if (!r.ok) beat(`wrong:${lockId}`);
  return r.ok;
}

/** After the phone restarts in Episode 2 it wants the passcode again. */
export function unlockAfterRestart(input: string): boolean {
  const s = readProgress();
  const passcode = ep.locks.find((l) => l.id === "passcode")?.answer;
  if (!s || engine.digits(input) !== passcode) return false;
  save(engine.perform(ep, s, "unlock-2"));
  return true;
}

export function answer(deductionId: string, pick: readonly string[] | string): engine.Answer | null {
  const s = readProgress();
  if (!s) return null;
  const r = engine.answer(ep, s, deductionId, pick);
  save(r.state);
  if (!r.ok) beat(`wrong:${deductionId}`);
  return r;
}

export function hint(id: string): string | null {
  const s = readProgress();
  if (!s) return null;
  const h = engine.hint(ep, s, id);
  if (!h) return null;
  save(h.state);
  beat(`hint:${id}:${h.tier}`);
  return h.text;
}

export function fire(eventId: string): void {
  const s = readProgress();
  if (s) save(engine.fire(s, eventId));
}

export function die(): void {
  const s = readProgress();
  if (s) save(engine.die(ep, s));
}

/** Something done to the phone itself. False if it wasn't possible (yet). */
export function perform(actionId: string): boolean {
  const s = readProgress();
  if (!s) return false;
  const next = engine.perform(ep, s, actionId);
  save(next);
  return next !== s;
}

/** Send a reply from the phone. */
export function choose(replyId: string, optionId: string): void {
  const s = readProgress();
  if (s) save(engine.choose(ep, s, replyId, optionId));
}

export function nameContact(threadId: string, name: string): void {
  const s = readProgress();
  if (s) commit(engine.nameContact(s, threadId, name));
}

/** Time spent in an app: the minutes Mum's report will show. */
export function logUsage(app: AppId, ms: number): void {
  const s = readProgress();
  if (s) commit(engine.logUsage(s, app, ms));
}

/** An app opened from the home screen: a pickup, as Guardian counts them. */
export function openApp(): void {
  const s = readProgress();
  if (s) commit(engine.openApp(s));
}

/**
 * Back in the envelope. The next open deals a new cast. What was finished is
 * kept first, for saves from before finishes were kept on their own.
 */
export function reset(): void {
  const s = readProgress();
  if (s && engine.has(s, "dead")) solve(1, s);
  if (s && engine.has(s, "ep:2-done")) solve(2, s);
  commit(null);
}

export function resumed(): void {
  beat("resume");
}

/** A vote, a reaction or a share, counted and nothing else. */
export function verdict(event: string): void {
  beat(event);
}
