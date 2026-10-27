import type { Clue, Flag, IncomingCall, Question, Reply, ReplyOption, Said, Story } from "@/content/types";
import { all, ANY_GONE, answered, chosenIn, clockOf, filedClaims, filedClaim, has, struckOut, type CaseState } from "./engine";
import { restored } from "./phone";

/* ===========================================================================
   How the phone was read (RAAKH-V3 §14, §15): read back off the save, never
   stored twice.

   - The two Sameers: every choice that leans (`ReplyOption.impulse`), every
     version or truth filed on a contested question, every deletion and
     recovery, and the first thing sent to M, added up for each.
   - The promises the player made, and whether the night kept them.
   - "Your story held on N of 4": the contested questions where his version
     still stands.
   - The identity clues the player walked past, and when.

   None of it decides what can happen. It changes lines, and the end card.
   =========================================================================== */

export type Side = "auditor" | "confessor";

/** Every exchange in the story, on a chat or a call, with the ones a call goes on into. */
export function exchanges(story: Story): Reply[] {
  const out: Reply[] = [];
  const walk = (r: Reply | undefined) => {
    if (!r) return;
    out.push(r);
    for (const o of r.options) walk(o.next);
  };
  for (const t of story.threads) for (const r of t.replies ?? []) walk(r);
  const calls: IncomingCall[] = [...story.incoming, ...(story.reveal ? [story.reveal.yours.call, story.reveal.call] : [])];
  for (const c of calls) walk(c.reply);
  return out;
}

/** The options the player chose, wherever they were offered, in the order they were chosen. */
export function chosenOptions(story: Story, s: CaseState): ReplyOption[] {
  const picked = exchanges(story)
    .map((r) => chosenIn(s, r))
    .filter((o): o is ReplyOption => Boolean(o?.sets?.length))
    // Where in the night it was said: the first of its flags to land.
    .map((o) => ({ o, at: Math.min(...o.sets!.map((f) => s.flags.indexOf(f)).filter((i) => i >= 0)) }));
  return [...new Map(picked.map((p) => [p.o.id + p.o.sets!.join(), p])).values()].toSorted((a, b) => a.at - b.at).map((p) => p.o);
}

/** One weighed thing: which way, how much, the line it was, and where it landed in the playthrough. */
type Weight = { readonly side: Side; readonly weight: number; readonly line?: string; readonly at: number };

const flagAt = (s: CaseState, f: Flag) => s.flags.indexOf(f);

function weights(story: Story, s: CaseState): Weight[] {
  const out: Weight[] = [];
  const rule = story.impulse;
  for (const o of chosenOptions(story, s)) {
    if (o.impulse) out.push({ side: o.impulse.side, weight: o.impulse.weight, line: o.text, at: flagAt(s, o.sets![0]) });
  }
  if (!rule) return out;
  for (const q of story.questions) {
    if (q.kind !== "file") continue;
    for (const c of filedClaims(q, s)) {
      const at = flagAt(s, `claim:${q.id}:${c.id}`);
      if (c.impulse) out.push({ side: c.impulse.side, weight: c.impulse.weight, line: c.text, at });
      else if (c.version) out.push({ side: "auditor", weight: rule.version, line: c.text, at });
      else if (q.contestable && !c.hunch) out.push({ side: "confessor", weight: rule.truth, line: c.text, at });
    }
  }
  for (const f of s.flags) {
    const at = flagAt(s, f);
    if (f === ANY_GONE) continue;
    if (f.startsWith("did:deleted-perm-")) out.push({ side: "auditor", weight: rule.perm, at });
    else if (f.startsWith("did:deleted-")) out.push({ side: "auditor", weight: rule.soft, at });
    else if (f.startsWith("did:recovered-") || f.startsWith("did:restored-")) out.push({ side: "confessor", weight: rule.recover, at });
  }
  if (story.sendTo && has(s, SENT)) out.push({ side: "confessor", weight: rule.send, at: flagAt(s, SENT) });
  return out;
}

/** The tally: how much of the reading was the one checking, and how much the one who wanted it found. */
export function impulseOf(story: Story, s: CaseState): { auditor: number; confessor: number } {
  const t = { auditor: 0, confessor: 0 };
  for (const w of weights(story, s)) t[w.side] += w.weight;
  return t;
}

/** Which Sameer read the phone, on balance: a tie goes to the one who wanted it found (RAAKH-V3 §9, step 7). */
export const leaning = (story: Story, s: CaseState): Side => {
  const t = impulseOf(story, s);
  return t.confessor >= t.auditor ? "confessor" : "auditor";
};

/** Each side's single most weighted line, the latest on a tie: what the end card quotes under its bar. */
export function topLines(story: Story, s: CaseState): Partial<Record<Side, string>> {
  const out: Partial<Record<Side, Weight>> = {};
  for (const w of weights(story, s)) {
    if (!w.line) continue;
    const best = out[w.side];
    if (!best || w.weight > best.weight || (w.weight === best.weight && w.at > best.at)) out[w.side] = w;
  }
  return { auditor: out.auditor?.line, confessor: out.confessor?.line };
}

/* --- sending to M -------------------------------------------------------- */

/** Something has gone to her (`Story.sendTo`): she has a copy. */
export const SENT: Flag = "did:sent-m";
export const sentFlag = (evidence: string): Flag => `did:sent-m-${evidence}`;

/* --- promises ------------------------------------------------------------ */

export type VowState = "made" | "kept" | "broken";

/** Each promise the player made, and how it stands; once the chapter is over, made means kept. */
export function vowsOf(story: Story, s: CaseState): { readonly id: string; readonly to: string; readonly text: string; readonly state: VowState }[] {
  const over = has(s, "did:chose");
  return (story.vows ?? [])
    .filter((v) => has(s, v.made))
    .map((v) => {
      const broken = v.broken.some((set) => all(s, set));
      return { id: v.id, to: v.to, text: v.text, state: broken ? "broken" : over ? "kept" : "made" };
    });
}

/* --- his story ----------------------------------------------------------- */

/** The contested questions (Q4, Q6, Q7, Q8). */
export const contested = (story: Story): Question[] => story.questions.filter((q) => q.contestable);

/** Where his version still stands: filed as his version, and not struck since. */
export const holds = (q: Question, s: CaseState): boolean => answered(s, q.id) && Boolean(filedClaim(q, s)?.version) && !struckOut(q, s);

/** "Your story held on N of 4." */
export const heldOn = (story: Story, s: CaseState): { n: number; of: number } => {
  const qs = contested(story);
  return { n: qs.filter((q) => holds(q, s)).length, of: qs.length };
};

/* --- clues --------------------------------------------------------------- */

/** Has the player seen this clue? */
export const sawClue = (s: CaseState, c: Clue): boolean => c.seen.some((set) => set.length > 0 && all(s, set));

/** When they first saw it, on the story's clock, where that was kept ("clue:<id>"). */
export const clueSeenAt = (s: CaseState, c: Clue): string | undefined => clockOf(s, `clue:${c.id}`);

/** The clues walked past before the reveal: seen, and not acted on. */
export const walkedPast = (story: Story, s: CaseState): Clue[] => (story.clues ?? []).filter((c) => sawClue(s, c));

/* --- lines read off the save ---------------------------------------------- */

export const saidNow = (s: CaseState, l: Said): boolean =>
  all(s, l.needs) && (!l.any || l.any.some((f) => has(s, f))) && !(l.unless ?? []).some((f) => has(s, f));

/** Put back from Recently Deleted, whichever way it got there. */
export const isRecovered = (s: CaseState, item: string): boolean => has(s, restored(item)) || has(s, `did:recovered-${item}`);
