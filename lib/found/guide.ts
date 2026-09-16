import type { AppId, Deduction, Lock, Story } from "@/content/found/types";
import { deductionOpen, evidenceAvailable, has, lockAvailable, type CaseState } from "./engine";

/* ===========================================================================
   Never being lost.

   The one piece of real feedback from players was that they didn't know what
   to do. The lock screen teaches itself; the ten seconds after it opens don't.
   Ten identical icons, an objective that exists only as atmosphere, and help
   hidden inside the app you'd only open if you already knew to.

   Everything here is derived from the save — no new state, no tutorial, and
   nothing the phone wouldn't plausibly show:

     badgesOf     what each app is carrying that hasn't been looked at
     openQuestion the single question the case file is asking, oldest first
     openLock     what to open when no question is waiting
     lookIn       which apps hold the answer — apps, never answers
     nextNudge    the next rung of the hint ladder, for the idle nudge

   Pure, so the whole guidance layer is testable without a browser.
   =========================================================================== */

/** What an app holds that the player can reach and hasn't seen. A real phone's badge. */
export function badgesOf(ep: Story, s: CaseState): Partial<Record<AppId, number>> {
  const out: Partial<Record<AppId, number>> = {};
  for (const e of ep.evidence) {
    if (has(s, `seen:${e.id}`) || !evidenceAvailable(s, e)) continue;
    out[e.app] = (out[e.app] ?? 0) + 1;
  }
  return out;
}

/**
 * The question the case file is asking. Script order, so it's the oldest one
 * still open: exactly one at a time, however many are technically available.
 */
export const openQuestion = (ep: Story, s: CaseState): Deduction | null =>
  ep.deductions.find((d) => deductionOpen(s, d)) ?? null;

/** Something reachable and still locked — the next step when no question is open. */
export const openLock = (ep: Story, s: CaseState): Lock | null =>
  ep.locks.find((l) => lockAvailable(s, l) && !has(s, `lock:${l.id}`)) ?? null;

/** Whatever the player is being asked for right now, question or lock. */
const target = (ep: Story, s: CaseState): Deduction | Lock | null => openQuestion(ep, s) ?? openLock(ep, s);

/**
 * Where to look. Apps, never answers, always visible and costing no hint —
 * this is the line that does most of the work against "what do I do now".
 */
export const lookIn = (ep: Story, s: CaseState): readonly AppId[] => target(ep, s)?.look ?? [];

export type Nudge = { readonly id: string; readonly tier: number; readonly text: string };

/**
 * The next rung of the hint ladder for whatever is open: a direction, then a
 * connection, then nearly the answer. Null once there's nothing left to say,
 * so the phone goes quiet rather than nagging.
 */
export function nextNudge(ep: Story, s: CaseState): Nudge | null {
  const t = target(ep, s);
  const hints: readonly string[] = t?.hints ?? [];
  if (!t || hints.length === 0) return null;
  const used = s.hints[t.id] ?? 0;
  const text = hints[used];
  return text === undefined ? null : { id: t.id, tier: used + 1, text };
}
