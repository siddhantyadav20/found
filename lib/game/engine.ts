import type { AppId, EpisodeNo, Evidence, FileClaim, Flag, Hints, Link, LiveEvent, Message, Question, Reply, ReplyOption, Story } from "@/content/types";
import { nightly } from "@/lib/found/time";

/* ===========================================================================
   The engine: one playthrough, as data.

   It knows about flags, evidence, questions, the claims a player files, the
   chain those claims trace, hints and live events. It knows nothing about
   any one story. Every function here is pure:
   the store (lib/found/progress.ts) owns the saving, and React owns the
   rendering.

   Written for the pivot of 2026-09-17, and carried into *Shagun* at
   ROADMAP.md S1 (save version 4: older saves are dropped, not upgraded).
   =========================================================================== */

export const SAVE_VERSION = 4;

export type CaseState = {
  readonly version: number;
  /** In the order they happened. The order is the playthrough. */
  readonly flags: readonly Flag[];
  /** A run id, so one save's events can't be replayed into another. */
  readonly run: string;
  readonly started: number;
  /** When each app was last open, for badges and the idle nudge. */
  readonly at: Readonly<Record<string, number>>;
  /** The drop this playthrough arrived through, if any. */
  readonly via?: string;
  /** When Episodes 2 and 3 began, so each one's clock starts at its own base. */
  readonly began?: Readonly<Record<string, number>>;
  /**
   * How the player has set each link in the record they'll send or post,
   * where they changed it from what they filed (lib/game/record.ts). Unlike
   * flags, it can be changed back.
   */
  readonly record?: Readonly<Record<string, RecordChoice>>;
  /**
   * What the player has deleted on the phone, by the item's id (a photo, a
   * memo, a message, a note's attachment): in Recently Deleted, or gone for
   * good. Recovering takes an item off this list, so it can change back.
   */
  readonly deleted?: Readonly<Record<string, "soft" | "perm">>;
  /** Airplane mode, where a story lets it go back off (`Story.airplaneToggles`). */
  readonly airplane?: boolean;
};

/**
 * A link, as it goes into the record: a traced link `in` or `out`; an
 * untraced one `out`, as what Sameer `says`, or as `fact`.
 */
export type RecordChoice = "in" | "anon" | "out" | "says" | "fact";

export function newCase(run: string, now: number, via?: string): CaseState {
  return { version: SAVE_VERSION, flags: [], run, started: now, at: {}, via };
}

export const has = (s: CaseState, flag: Flag): boolean => s.flags.includes(flag);

export const all = (s: CaseState, flags: readonly Flag[] = []): boolean => flags.every((f) => has(s, f));

export function add(s: CaseState, ...flags: readonly Flag[]): CaseState {
  const fresh = flags.filter((f) => !has(s, f));
  return fresh.length ? { ...s, flags: [...s.flags, ...fresh] } : s;
}

export const episodeOf = (s: CaseState): EpisodeNo => (has(s, "ep:3") ? 3 : has(s, "ep:2") ? 2 : 1);

/* --- evidence ----------------------------------------------------------- */

/** Reachable now: every gate it names is true. */
export const reachable = (s: CaseState, e: Evidence): boolean => all(s, e.requires);

export const seen = (s: CaseState, id: string): boolean => has(s, `saw:${id}`);

/** Read before it could count: kept, so it counts once it can (`settle`). */
export const readEarly = (id: string): Flag => `did:read-${id}`;

export function see(story: Story, s: CaseState, id: string): CaseState {
  const e = story.evidence.find((x) => x.id === id);
  if (!e) return s;
  return reachable(s, e) ? add(s, `saw:${id}`) : add(s, readEarly(id));
}

/**
 * Everything already read, or whose finding act has already happened, now
 * that it can count. Run on every save, so something read in plain view in
 * Episode 1 counts the moment its own episode opens, and doesn't sit there as
 * a badge over a chat the player has read (PLAYTEST-SHAGUN.md #25).
 */
export const settle = (story: Story, s: CaseState): CaseState =>
  story.evidence
    .filter((e) => (has(s, readEarly(e.id)) || (e.foundBy?.length && all(s, e.foundBy))) && reachable(s, e) && !seen(s, e.id))
    .reduce((acc, e) => add(acc, `saw:${e.id}`), s);

/** What the case file lists: everything reachable, in the order it was found. */
export const caseFile = (story: Story, s: CaseState): Evidence[] =>
  story.evidence.filter((e) => reachable(s, e) && seen(s, e.id));

/** What an app's badge counts: reachable, unseen, and never a bait. */
export const unseenIn = (story: Story, s: CaseState, app: AppId): number =>
  story.evidence.filter((e) => e.app === app && !e.manual && reachable(s, e) && !seen(s, e.id)).length;

/** What opening one app finds on its own: everything in it but the manual, and what is inside something. */
export const openApp = (story: Story, s: CaseState, app: AppId): CaseState =>
  story.evidence.filter((e) => e.app === app && !e.manual && !e.within).reduce((acc, e) => see(story, acc, e.id), s);

/* --- deleting (RAAKH-V3 §17) --------------------------------------------- */

/** Deleted to Recently Deleted, the first time: what the tally counts. */
export const deletedFlag = (item: string): Flag => `did:deleted-${item}`;
/** Deleted for good. */
export const goneFlag = (item: string): Flag => `did:deleted-perm-${item}`;
/** Anything at all deleted for good: what breaks a promise to keep everything. */
export const ANY_GONE: Flag = "did:deleted-perm";

/** Where an item stands: here, in Recently Deleted, or gone. */
export const goneOf = (s: CaseState, item: string): "soft" | "perm" | undefined => s.deleted?.[item];

/** Every piece of evidence an item on the phone carries: a photo and the lines in it, a memo, a message, an attachment. */
export function evidenceIn(story: Story, item: string): string[] {
  const photo = [...story.photos, ...story.notes.flatMap((n) => n.attachments ?? [])].find((p) => p.id === item);
  if (photo) return [photo.evidence, photo.original?.evidence, ...(photo.chat?.lines.map((l) => l.evidence) ?? [])].filter((x): x is string => Boolean(x));
  const memo = story.memos.find((m) => m.id === item);
  if (memo) return memo.evidence ? [memo.evidence] : [];
  const message = [
    ...story.threads.flatMap((t) => [...t.messages, ...(t.replies ?? []).flatMap((r) => r.options.flatMap((o) => o.then ?? []))]),
  ].find((m) => m.id === item);
  return message?.evidence ? [message.evidence] : [];
}

/** Evidence whose every source has gone for good: it was seen, and it can't be put on the table any more. */
export function lost(story: Story, s: CaseState, id: string): boolean {
  const gone = Object.entries(s.deleted ?? {}).filter(([, how]) => how === "perm");
  return gone.some(([item]) => evidenceIn(story, item).includes(id));
}

/** Seen, and still on the phone: what can go on the table. */
export const usable = (story: Story, s: CaseState, id: string): boolean => seen(s, id) && !lost(story, s, id);

/** Delete an item: to Recently Deleted, or (from there, or at once) for good. Nothing gone comes back. */
export function remove(s: CaseState, item: string, how: "soft" | "perm"): CaseState {
  if (goneOf(s, item) === "perm") return s;
  const next = add(s, ...(how === "soft" ? [deletedFlag(item)] : [goneFlag(item), ANY_GONE]));
  return { ...next, deleted: { ...next.deleted, [item]: how } };
}

/** Put back from Recently Deleted. */
export function recover(s: CaseState, item: string): CaseState {
  if (goneOf(s, item) !== "soft") return s;
  const { [item]: _was, ...rest } = s.deleted ?? {};
  void _was;
  return { ...add(s, `did:recovered-${item}`), deleted: rest };
}

/** Every icon on the found phone's home screen, pages and dock together. */
export const homeIcons = (story: Story) => [...story.home.pages.flat(), ...story.home.dock];

/** What the owner's phone calls an app. The dock and the pages are the only source. */
export const appLabel = (story: Story, app: AppId): string =>
  homeIcons(story).find((i) => i.app === app)?.label ?? app;

/* --- questions ---------------------------------------------------------- */

export const answered = (s: CaseState, id: string): boolean => has(s, `ask:${id}`);

/** Every claim filed for a question, oldest first. The last one stands; the rest are struck. */
export function filedClaims(q: Question, s: CaseState): FileClaim[] {
  if (q.kind !== "file") return [];
  const prefix = `claim:${q.id}:`;
  return s.flags
    .filter((f) => f.startsWith(prefix))
    .map((f) => q.claims.find((c) => c.id === f.slice(prefix.length)))
    .filter((c): c is FileClaim => Boolean(c));
}

/** The claim on file for a question now, if it's the kind that files one. */
export const filedClaim = (q: Question, s: CaseState): FileClaim | undefined => filedClaims(q, s).at(-1);

/**
 * A version on file that what the player proved since has crossed out
 * (`struckWhen`): the next episode's answer to the last one's question.
 */
export const struckOut = (q: Question, s: CaseState): boolean =>
  q.kind === "file" && Boolean(q.struckWhen?.length) && all(s, q.struckWhen) && Boolean(filedClaim(q, s)?.version);

/* --- saying it ---------------------------------------------------------- */

/** The blanks of a sentence, in the order they appear in it. */
export const blanksOf = (line: string): string[] => [...line.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

/**
 * Which claim a finished sentence files. `close` when no claim fits but one
 * is only a word away: the player is nearly there, and is told so.
 */
export function claimFor(q: Question, words: Readonly<Record<string, string>>): { claim?: FileClaim; close: boolean } {
  if (q.kind !== "file" || !q.say) return { close: false };
  const names = blanksOf(q.say.line);
  const fits = (c: FileClaim) => names.filter((n) => fitsWord(c, n, words[n])).length;
  const claim = q.claims.find((c) => c.words && fits(c) === names.length);
  if (claim) return { claim, close: false };
  const best = Math.max(0, ...q.claims.filter((c) => c.words && !c.refuse).map(fits));
  return { close: names.length > 1 && best === names.length - 1 };
}

/** A claim's word for a blank: the word itself, or "*", any word at all (a near miss that turns on one blank). */
const fitsWord = (c: FileClaim, blank: string, word: string | undefined): boolean =>
  c.words?.[blank] === "*" || (Boolean(word) && c.words?.[blank] === word);

/** A refusal that has been lifted by what the player has found: the words now mean the next claim. */
const lifted = (s: CaseState, c: FileClaim): boolean => Boolean(c.liftedBy?.some((r) => r.every((id) => seen(s, id))));

/**
 * Every claim these words could file, in the order the question gives
 * them (the first that fits is the one: a refusal written before a claim
 * with the same words stands in front of it until it's lifted), a refusal
 * the player's finds have lifted left out, and none that's closed (`unless`).
 */
export function claimsFor(q: Question, s: CaseState, words: Readonly<Record<string, string>>): FileClaim[] {
  if (q.kind !== "file" || !q.say) return [];
  const names = blanksOf(q.say.line);
  return q.claims
    .filter((c) => c.words && names.every((n) => fitsWord(c, n, words[n])))
    .filter((c) => !lifted(s, c) && !(c.unless ?? []).some((f) => has(s, f)));
}

/**
 * The words a blank offers: all of them, from the start (2026-10-23). Words
 * used to be "learned" (`Say.learn`) and the rest shown as locked slots,
 * and players couldn't say what hadn't occurred to them. The phone still
 * has to prove the sentence; the words are only the player's vocabulary.
 * `Say.learn` stays in the data: it's where each word is shown, which is
 * what a wrong word is answered with (`whereWordsAre`).
 */
export function wordsFor(q: Question, blank: string): string[] {
  if (q.kind !== "file" || !q.say) return [];
  return [...(q.say.blanks[blank] ?? [])];
}

/**
 * A finished (or half-finished) sentence, read back blank by blank, so a
 * wrong word can be pointed at instead of "that isn't what the phone shows"
 * (2026-10-23: "wrong choices are not clear to the users").
 *
 * - `claim`: the claim the words file, if they file one.
 * - `wrong`: the blanks that keep it from being something the phone bears
 *   out, measured against the nearest real answer.
 * - `why`: what to say about it: a refused near miss says its own line.
 */
export function readSentence(
  q: Question,
  words: Readonly<Record<string, string>>,
  s?: CaseState,
): { claim?: FileClaim; wrong: string[]; why?: string; whole: boolean } {
  if (q.kind !== "file" || !q.say) return { wrong: [], whole: false };
  const names = blanksOf(q.say.line);
  const whole = names.every((n) => words[n]);
  const real = q.claims.filter((c) => c.words && !c.refuse && !Object.values(c.words).includes("*"));
  // With a save, refusals the player's finds have lifted and claims that are closed are skipped (`claimsFor`).
  const exact = s ? claimsFor(q, s, words)[0] : q.claims.find((c) => c.words && names.every((n) => fitsWord(c, n, words[n])));
  // A claim filed on its words alone needs no more of them ("Sameer Khurrana", in the last question).
  if (exact && !exact.refuse) return { claim: exact, wrong: [], whole: whole || Boolean(exact.free) };
  // The nearest real answer: the most blanks in common, and the truth before a version or a hunch on a tie.
  const fits = (c: FileClaim) => names.filter((n) => words[n] && c.words?.[n] === words[n]).length;
  const rank = (c: FileClaim) => fits(c) * 4 + (c.version ? 0 : c.hunch ? 1 : 2);
  const nearest = real.toSorted((a, b) => rank(b) - rank(a))[0];
  const wrong = nearest ? names.filter((n) => words[n] && nearest.words?.[n] !== words[n]) : [];
  // Only a whole sentence is judged; half a sentence is still being said.
  if (!whole) return { wrong: [], whole };
  if (exact?.refuse) return { claim: exact, wrong, why: exact.refuse, whole };
  const first = wrong[0];
  return { wrong, why: first ? `“${words[first]}” isn't what the phone shows.` : UNSAID, whole };
}

/** Every piece of evidence any answer to this question could stand on, or sit beside. */
export function bearsOn(q: Question): string[] {
  switch (q.kind) {
    case "file":
      return [...new Set(q.claims.flatMap((c) => [...c.proof, ...(c.orProof ?? []).flat(), ...(c.also ?? [])]))];
    case "pick":
      return [...new Set([...q.proof, ...(q.orProof ?? []).flat()])];
    case "timeline":
      return q.rows.map((r) => r.evidence);
    case "claims":
      return q.claims.map((c) => c.proof).filter((x): x is string => Boolean(x));
    case "type":
      return [];
  }
}

/**
 * What the case file offers as proof for a question: what the player has
 * found that bears on it, and a few other things from where to look, so the
 * table is a short list to think about and not thirty things to scroll
 * (2026-10-23: "everything you reveal looks overwhelming").
 */
export function proofChoices(story: Story, s: CaseState, q: Question, decoys = 3): Evidence[] {
  const near = new Set(bearsOn(q));
  const found = caseFile(story, s).filter((e) => !lost(story, s, e.id));
  const relevant = found.filter((e) => near.has(e.id));
  const apps = new Set(q.whereToLook);
  const others = found.filter((e) => !near.has(e.id) && apps.has(e.app)).slice(-decoys);
  return [...relevant, ...others];
}

/** How many things on the phone bear on this question that the player hasn't found (or can't count) yet. */
export const proofToCome = (story: Story, s: CaseState, q: Question): number =>
  bearsOn(q).filter((id) => {
    const e = story.evidence.find((x) => x.id === id);
    return e && reachable(s, e) && !seen(s, id);
  }).length;

/** The routes a claim can be proved by, shortest first. */
const routesOf = (c: FileClaim): (readonly string[])[] => [c.proof, ...(c.orProof ?? [])].toSorted((a, b) => a.length - b.length);

/**
 * The proof on the table, read back against a claim: what doesn't belong,
 * and what the nearest way of proving it still needs (2026-10-23: say what's
 * missing, and where it is).
 */
export function readProof(
  story: Story,
  s: CaseState,
  c: FileClaim,
  picked: readonly string[],
): { ok: boolean; stray: string[]; missing: string[]; need: number } {
  const routes = routesOf(c);
  const proves = (id: string) => (c.also ?? []).includes(id) || routes.some((r) => r.includes(id));
  const stray = picked.filter((p) => !proves(p));
  const nearest =
    routes.toSorted((a, b) => b.filter((id) => picked.includes(id)).length - a.filter((id) => picked.includes(id)).length || a.length - b.length)[0] ?? [];
  const missing = nearest.filter((id) => !picked.includes(id));
  return { ok: !stray.length && !missing.length && picked.length > 0, stray, missing, need: routes[0]?.length ?? 1 };
}

/** Where a missing piece of proof lives, said plainly, and whether it's been found yet. */
export function whereMissing(story: Story, s: CaseState, ids: readonly string[]): { app: AppId; found: boolean }[] {
  return ids
    .map((id) => story.evidence.find((e) => e.id === id))
    .filter((e): e is Evidence => Boolean(e))
    .map((e) => ({ app: e.app, found: seen(s, e.id) }));
}

/**
 * The words of a finished sentence that no answer uses in that blank: what
 * to point at when it isn't what the phone shows. Refused near misses don't
 * count as answers here, so their words are "off" only when no real answer
 * shares them.
 */
export function wordsOff(q: Question, words: Readonly<Record<string, string>>): string[] {
  if (q.kind !== "file" || !q.say) return [];
  const real = q.claims.filter((c) => c.words && !c.refuse);
  return blanksOf(q.say.line).filter((b) => words[b] && !real.some((c) => c.words?.[b] === words[b]));
}

/** Where the words a blank is looking for are learned: the apps that teach them. */
export function whereWordsAre(story: Story, q: Question, blank: string): AppId[] {
  if (q.kind !== "file" || !q.say) return [];
  const want = new Set(q.claims.filter((c) => !c.refuse && c.words?.[blank]).map((c) => c.words![blank]));
  const ids = [...want].flatMap((w) => q.say!.learn?.[w] ?? []).filter((id) => !id.includes(":"));
  return [...new Set(ids.map((id) => story.evidence.find((e) => e.id === id)?.app).filter((a): a is AppId => Boolean(a)))];
}

/** When the story's clock says a claim was filed, for a player who called something early. */
export const FILED_AT = (q: string, c: string) => `filed:${q}:${c}`;

/**
 * The hunch this claim proves, if the player filed it: when they did, on
 * the story's clock, so the answer can say "You called it at 11:49 PM."
 */
export function calledIt(story: Story, s: CaseState, c: FileClaim): string | undefined {
  for (const ref of c.pays ?? []) {
    const [q, id] = ref.split(":");
    if (!has(s, `claim:${q}:${id}`)) continue;
    if (story.beats) return clockOf(s, FILED_AT(q, id)) ?? "";
    const when = s.at[FILED_AT(q, id)];
    return when === undefined ? "" : clockAt(story, s, when);
  }
  return undefined;
}

/**
 * The claims a player is offered: only those they could prove with what they
 * have found. A claim the phone can't yet support is never put in front of
 * them, because its words alone would give the next episode away. What they
 * can say grows with what they've found.
 */
export const offeredClaims = (q: Question, s: CaseState): FileClaim[] =>
  q.kind === "file" ? q.claims.filter((c) => [c.proof, ...(c.orProof ?? [])].some((r) => r.every((id) => seen(s, id)))) : [];

/**
 * Filed as the owner's version, and something found *since* says otherwise.
 * A player who filed his version with the contradiction already in hand
 * chose it, and isn't asked again: that would be a buzzer by another name.
 */
export function needsRevisit(q: Question, s: CaseState): boolean {
  if (q.kind !== "file" || !answered(s, q.id)) return false;
  /* A contested question (RAAKH-V3 §12): his version, or a hunch, holds
     until the truth is filed over it, and can be the moment the player can
     show the truth. Never once it's been struck by what came after. */
  if (q.contestable) {
    const on = filedClaim(q, s);
    if (!on || !(on.version || on.hunch) || struckOut(q, s)) return false;
    return q.claims.some((c) => !c.version && !c.hunch && !c.refuse && !c.free && [c.proof, ...(c.orProof ?? [])].some((r) => r.every((id) => seen(s, id))));
  }
  if (!q.reopenWhen?.length || !all(s, q.reopenWhen)) return false;
  const c = filedClaim(q, s);
  if (!c?.version) return false;
  const filedAt = s.flags.indexOf(`claim:${q.id}:${c.id}`);
  return q.reopenWhen.some((f) => s.flags.indexOf(f) > filedAt);
}

/**
 * The one question in front of the player. A Revisit that must be done comes
 * first, whatever episode it was asked in; then the first unanswered
 * question of this episode that isn't optional. It waits for its moment
 * rather than being skipped past.
 */
export function openQuestion(story: Story, s: CaseState): Question | undefined {
  const revisit = story.questions.find((q) => q.kind === "file" && q.mustRevisit && needsRevisit(q, s));
  if (revisit) return revisit;
  const q = story.questions.find((x) => x.episode === episodeOf(s) && !x.optional && !answered(s, x.id));
  return q && all(s, q.requires) ? q : undefined;
}

/** What the case file offers on the side: optional questions, and Revisits nobody has to do. */
export const sideQuestions = (story: Story, s: CaseState): Question[] =>
  story.questions.filter(
    (q) =>
      (q.optional && q.episode <= episodeOf(s) && all(s, q.requires) && !answered(s, q.id)) ||
      (q.kind === "file" && !q.mustRevisit && needsRevisit(q, s)) ||
      editable(q, s),
  );

export const normalise = (t: string): string =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export type Answer = { readonly state: CaseState; readonly ok: boolean; readonly reply: string };

/** What a player gives: evidence ids, typed text, "row@lane" placements, claim ids, or a claim with its proof. */
export type Given = readonly string[] | string | { readonly claim: string; readonly proof: readonly string[] };

export const WRONG = "Not quite. Look again.";
export const TOO_MUCH = "Some of that proves it.";
/** Said with how many have to come off, so the player isn't left guessing which half of the table is wrong. */
export const tooMuch = (n: number) =>
  n === 1 ? `${TOO_MUCH} One thing on the table doesn't: take it off.` : `${TOO_MUCH} ${n} things on the table don't: take them off.`;
export const PARTLY = "That's part of it. Something's missing.";
/** The sentence is right; the table doesn't hold it up yet. */
export const UNPROVED = "That's what happened. Nothing on the table proves it yet.";
export const UNCHECKED = "Check each of them on the phone before you decide.";
export const STRUCK = "That's the line you struck. What you found since says otherwise.";
export const UNSAID = "That isn't what the phone shows.";
export const CLOSE = "Close. One part of that isn't what the phone shows.";
export const THIN = "The board can't show that yet. Something's missing from it.";
export const UNPLACED = "Every row needs a lane first.";
/** The lanes are right; the board isn't answered until the player says what doesn't fit. */
export const PLACED = "Every row is in its lane.";
export const NOT_THOSE = "Those can all be true together. Look at the same few minutes, in three lanes.";
export const ODD_PART = "That's part of it. Something else in those minutes doesn't fit either.";

/** A row marked as one that can't be true alongside the others: "odd:<row>". */
export const ODD = (row: string) => `odd:${row}`;

/** A timeline with enough on it to prove anything: one of its `enough` routes is all found. */
export const boardReady = (q: Question, s: CaseState): boolean =>
  q.kind !== "timeline" || !q.enough?.length || q.enough.some((r) => r.every((id) => seen(s, id)));

/**
 * All of one route, and nothing that wasn't found. More true proof is still
 * proof: anything that belongs to one of the routes, or is on the point
 * (`also`), can sit beside it, and only what proves nothing here has to
 * come off the table.
 */
function judgeProof(
  story: Story,
  s: CaseState,
  routes: readonly (readonly string[])[],
  picked: readonly string[],
  also: readonly string[] = [],
): { ok: boolean; reply: string } {
  // You cannot put something on the table that you have not found, or that's been deleted for good.
  if (!picked.length || !picked.every((id) => usable(story, s, id))) return { ok: false, reply: WRONG };
  const proves = (id: string) => also.includes(id) || routes.some((route) => route.includes(id));
  const stray = picked.filter((p) => !proves(p)).length;
  if (!stray && routes.some((route) => route.every((id) => picked.includes(id)))) return { ok: true, reply: "" };
  // Something in there proves it, and something else doesn't.
  if (stray && stray < picked.length) return { ok: false, reply: tooMuch(stray) };
  // Everything on the table counts, but no route is whole yet.
  if (!stray) return { ok: false, reply: PARTLY };
  return { ok: false, reply: WRONG };
}

/**
 * Judge an answer. Getting it wrong costs nothing but the truth of having
 * been wrong. Filing the owner's version is not getting it wrong.
 */
/** Filed, and still open to filing again (`Question.editable`): Q1, until the reveal. */
export const editable = (q: Question, s: CaseState): boolean =>
  Boolean(q.editable) && answered(s, q.id) && !(q.editable ?? []).some((f) => has(s, f));

export function answer(story: Story, s: CaseState, id: string, given: Given): Answer {
  const q = story.questions.find((x) => x.id === id);
  const revisiting = q ? needsRevisit(q, s) || editable(q, s) : false;
  if (!q || (answered(s, id) && !revisiting)) return { state: s, ok: false, reply: WRONG };

  const picked = Array.isArray(given) ? (given as readonly string[]) : [];
  const text = typeof given === "string" ? normalise(given) : "";
  let ok = false;
  let reply = WRONG;

  switch (q.kind) {
    case "pick":
      ({ ok, reply } = judgeProof(story, s, [q.proof, ...(q.orProof ?? [])], picked));
      break;
    case "type":
      ok = q.accepts.some((a) => normalise(a) === text);
      break;
    case "timeline": {
      if (!boardReady(q, s)) return { state: s, ok: false, reply: THIN };
      /* The board only holds what the player has found, so the answer is
         judged against that and not against the whole script: every known
         row in its own lane, and nothing else. */
      const known = q.rows.filter((r) => seen(s, r.evidence));
      const placed = picked.filter((p) => p.includes("@"));
      const marked = new Set(picked.filter((p) => p.startsWith("odd:")).map((p) => p.slice(4)));
      const laneOf = new Map(placed.map((p) => [p.slice(0, p.indexOf("@")), p.slice(p.indexOf("@") + 1)]));
      const unplaced = known.filter((r) => !laneOf.has(r.id)).length;
      const off = known.filter((r) => laneOf.has(r.id) && laneOf.get(r.id) !== r.lane && laneOf.get(r.id) !== r.orLane).length;
      const lanesRight = known.length > 0 && placed.length === known.length && !unplaced && !off;
      // How far off, never which: the board is still theirs to fix (PLAYTEST-SHAGUN.md #53).
      if (!lanesRight) {
        reply = unplaced ? UNPLACED : off === 1 ? "One row is in the wrong lane." : off ? `${off} rows are in the wrong lane.` : WRONG;
        break;
      }
      /* Then the board's own question: which of these can't all be true. The
         player marks them; nothing lights them first (PLAYER-JOURNEY Stage 7). */
      const odd = known.filter((r) => r.odd).map((r) => r.id);
      // One odd row alone contradicts nothing.
      if (!q.contradiction || odd.length < 2) {
        ok = true;
        break;
      }
      if (!marked.size) {
        reply = `${PLACED} ${q.contradiction}`;
        break;
      }
      const stray = [...marked].some((id) => !odd.includes(id));
      ok = !stray && odd.every((id) => marked.has(id));
      if (!ok) reply = stray ? NOT_THOSE : ODD_PART;
      break;
    }
    case "claims": {
      /* A claim is only judged once what settles it has been looked at, so
         the board can't be passed by guessing. What can't be reached needs
         no checking. */
      const unchecked = q.claims.some((c) => {
        const e = c.proof ? story.evidence.find((x) => x.id === c.proof) : undefined;
        return e !== undefined && reachable(s, e) && !seen(s, e.id);
      });
      if (unchecked) return { state: s, ok: false, reply: UNCHECKED };
      const want = new Set(q.claims.filter((c) => c.trueWhen && all(s, c.trueWhen)).map((c) => c.id));
      ok = picked.length === want.size && picked.every((p) => want.has(p));
      break;
    }
    case "file": {
      if (typeof given !== "object" || Array.isArray(given)) return { state: s, ok: false, reply: WRONG };
      const { claim: cid, proof } = given as { claim: string; proof: readonly string[] };
      const c = q.claims.find((x) => x.id === cid);
      if (!c) return { state: s, ok: false, reply: WRONG };
      // Said that way, it's the near miss the phone answers pointedly.
      if (c.refuse) return { state: s, ok: false, reply: c.refuse };
      // A Revisit moves on from the version on file; it can't file a version again.
      if (revisiting && c.version) return { state: s, ok: false, reply: STRUCK };
      if ((c.unless ?? []).some((f) => has(s, f))) return { state: s, ok: false, reply: WRONG };
      // Said on its words alone: nothing to table.
      if (c.free) ({ ok, reply } = { ok: true, reply: "" });
      else ({ ok, reply } = judgeProof(story, s, [c.proof, ...(c.orProof ?? [])], proof, c.also));
      // The words are right; say so, so the player looks again at the table and not the sentence.
      if (!ok) return { state: s, ok, reply: reply === WRONG && proof.length ? UNPROVED : reply };
      return {
        state: add(s, `ask:${id}`, `claim:${id}:${c.id}`, ...(c.sets ?? []), ...(revisiting ? [] : (q.sets ?? []))),
        ok: true,
        reply: c.backed && proof.some((p) => c.backed!.by.includes(p)) ? c.backed.reply : c.reply,
      };
    }
  }

  if (!ok) return { state: s, ok: false, reply };
  return { state: add(s, `ask:${id}`, ...(q.sets ?? [])), ok: true, reply: q.reply };
}

/**
 * File a finished sentence with what's on the table. The same words can be
 * more than one claim (the truth, and a hunch that rests on less), so each
 * is tried in order and the first the table bears out is filed; otherwise
 * the first one's answer says why not.
 */
export function fileSentence(story: Story, s: CaseState, id: string, words: Readonly<Record<string, string>>, proof: readonly string[]): Answer & { claim?: FileClaim } {
  const q = story.questions.find((x) => x.id === id);
  if (!q) return { state: s, ok: false, reply: WRONG };
  const options = claimsFor(q, s, words);
  if (!options.length) return { state: s, ok: false, reply: readSentence(q, words, s).why ?? UNSAID };
  // A refusal in front is the answer, whatever else the words could have meant.
  if (options[0].refuse) return { state: s, ok: false, reply: options[0].refuse, claim: options[0] };
  const real = options.filter((c) => !c.refuse);
  let first: Answer | undefined;
  for (const c of real) {
    const r = answer(story, s, id, { claim: c.id, proof });
    if (r.ok) return { ...r, claim: c };
    first ??= r;
  }
  return { ...first!, claim: real[0] };
}

/* --- the chain ---------------------------------------------------------- */

export const isTraced = (s: CaseState, link: Link): boolean =>
  has(s, `link:${link.id}`) || Boolean(link.when?.some((set) => all(s, set)));

/** The links the player has traced, in the chain's own order. */
export const traced = (story: Story, s: CaseState): Link[] => story.chain.filter((l) => isTraced(s, l));

export type Hint = { readonly state: CaseState; readonly tier: 1 | 2 | 3; readonly text: string };

/** Three steps, and the third is the answer. Asking is never held against anyone. */
export function hint(story: Story, s: CaseState, id: string): Hint | null {
  const q = story.questions.find((x) => x.id === id);
  if (!q) return null;
  const taken = s.flags.filter((f) => f.startsWith(`hint:${id}:`)).length;
  const tier = (Math.min(taken + 1, 3) as 1 | 2 | 3);
  const hints: Hints = q.hints;
  return { state: add(s, `hint:${id}:${tier}` as Flag), tier, text: hints[tier - 1] };
}

/** The free one: which apps hold it. Never counted, never rationed. */
export const whereToLook = (story: Story, id: string): readonly AppId[] =>
  story.questions.find((q) => q.id === id)?.whereToLook ?? [];

/* --- live events -------------------------------------------------------- */

export const fired = (s: CaseState, id: string): boolean => has(s, `fired:${id}`);

/** Control Centre's airplane mode, turned on by hand. */
export const AIRPLANE: Flag = "did:airplane";

/** Is the found phone offline now? Where airplane mode goes back off, it's the switch; elsewhere, once on, it stays. */
export const offline = (story: Story, s: CaseState): boolean => (story.airplaneToggles ? Boolean(s.airplane) : has(s, AIRPLANE));

/**
 * What the story says should happen now. Where airplane mode can go back
 * off, anything that has to reach the phone waits for it to (RAAKH-V3 §17:
 * no beat is ever lost); what happens on the phone itself doesn't.
 */
export const dueEvents = (story: Story, s: CaseState): LiveEvent[] =>
  story.events.filter(
    (e) =>
      !fired(s, e.id) &&
      all(s, e.after) &&
      !(e.unless ?? []).some((f) => has(s, f)) &&
      !(story.airplaneToggles && s.airplane && e.device === "owner" && !e.local),
  );

/** Play a live event, once; given `now`, it also remembers when, for what arrives with it. */
export const fire = (story: Story, s: CaseState, id: string, now?: number): CaseState => {
  const e = story.events.find((x) => x.id === id);
  if (!e) return s;
  const next = add(s, `fired:${id}`, ...(e.sets ?? []));
  const at = now === undefined ? next : { ...next, at: { ...next.at, [`event:${id}`]: now } };
  // With beats, when on the story's clock: an event without a clock of its own lands at the minute it fired.
  return story.beats ? keepClock(story, at, `event:${id}`, now ?? 0) : at;
};

/**
 * When something arriving with a live event (or a reply, by its id) arrived,
 * on the story's clock; else its own time. With beats, everything is
 * stamped as written: the clock was made to agree with it.
 */
export const arrivedAt = (story: Story, s: CaseState, m: { readonly at: string; readonly with?: string }): string => {
  if (story.beats) return m.at;
  const when = m.with ? s.at[`event:${m.with}`] : undefined;
  return when === undefined ? m.at : clockAt(story, s, when);
};

/* --- time --------------------------------------------------------------- */

/**
 * Note the moment an episode began, the first time a save shows it. Every
 * save goes through here, so each episode opens at its own clock's base
 * however long the player spent in the one before.
 */
export function stamp(s: CaseState, now: number): CaseState {
  const ep = episodeOf(s);
  if (ep === 1 || s.began?.[ep] !== undefined) return s;
  return { ...s, began: { ...s.began, [ep]: now } };
}

/** When this episode began. Saves from before `began` fall back to the start. */
export const episodeStart = (s: CaseState): number => s.began?.[episodeOf(s)] ?? s.started;

const minutesOf = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** How far the story's clock has run since the chapter opened, in seconds. */
export function storySeconds(story: Story, s: CaseState, now: number): number {
  const base = minutesOf(story.clocks[episodeOf(s) - 1].base);
  const first = minutesOf(story.clocks[0].base);
  const gap = ((base - first + 24 * 60) % (24 * 60)) * 60;
  return gap + Math.max(0, Math.floor((now - episodeStart(s)) / 1000));
}

const hhmm = (t: number): string => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

/**
 * The story's own clock: this episode's base time plus how long it has run;
 * or, where the story has beats, the latest beat or event that has happened,
 * and never earlier than anything already delivered (RAAKH-V3 §17).
 */
export function clockNow(story: Story, s: CaseState, now: number): string {
  if (story.beats) return beatClock(story, s);
  const base = minutesOf(story.clocks[episodeOf(s) - 1].base);
  const minutes = Math.max(0, Math.floor((now - episodeStart(s)) / 60_000));
  return hhmm((base + minutes) % (24 * 60));
}

/** The latest of some times, by the night's order (the small hours after the evening). */
const latest = (times: readonly string[]): string => times.reduce((a, b) => (nightly(b) > nightly(a) ? b : a));

/**
 * The option picked in an exchange, if one was. Options can share a flag
 * (Nitin's "for Raju" and "promise" both protect him), so the pick is the
 * option whose flags are all set, the most specific of them first, and only
 * then one that merely shares a flag (PLAYTEST-SHAGUN.md #52).
 */
export function chosenIn(s: CaseState, r: Reply): ReplyOption | undefined {
  const set = (o: ReplyOption) => (o.sets ?? []).filter((f) => s.flags.includes(f)).length;
  const whole = r.options.filter((o) => o.sets?.length && set(o) === o.sets.length);
  if (whole.length) return whole.reduce((a, b) => (b.sets!.length > a.sets!.length ? b : a));
  return r.options.find((o) => set(o) > 0);
}

/** What has arrived in a chat during the player's night, at the times it's stamped with. */
function delivered(story: Story, s: CaseState): string[] {
  const out: string[] = [];
  const keep = (m: Message) => m.at && out.push(m.at);
  for (const t of story.threads) {
    for (const m of t.messages) if (m.with && all(s, m.requires) && !(m.unless ?? []).some((f) => has(s, f))) keep(m);
    for (const r of t.replies ?? []) {
      if (!all(s, r.requires)) continue;
      for (const m of chosenIn(s, r)?.then ?? []) keep(m);
    }
  }
  return out;
}

/** The clock by beats: where the episode opened, every beat and timed event since, and what's been delivered. */
export function beatClock(story: Story, s: CaseState): string {
  const ep = episodeOf(s);
  const base = story.clocks[ep - 1].base;
  const floor = nightly(base);
  const times = [
    base,
    ...(story.beats ?? []).filter((b) => all(s, b.after)).map((b) => b.at),
    ...story.events.filter((e) => e.clock && fired(s, e.id)).map((e) => e.clock!),
    ...delivered(story, s),
  ];
  // Nothing from before the episode opened can pull its clock back, and nothing can set it before its base.
  return latest(times.filter((t) => nightly(t) >= floor));
}

/** The story clock's minutes into the night (`nightly`), for keeping when something happened. */
export const clockMinutes = (story: Story, s: CaseState, now: number): number => nightly(clockNow(story, s, now));

/** "00:51" from minutes into the night. */
export const fromMinutes = (m: number): string => hhmm(((m % 1440) + 1440) % 1440);

/** Keep when, on the story's clock, something happened ("said:<flag>", "filed:<q>:<c>"): for timestamps read back later. */
export const CLOCK = (key: string) => `clock:${key}`;
export const keepClock = (story: Story, s: CaseState, key: string, now: number): CaseState => ({
  ...s,
  at: { ...s.at, [CLOCK(key)]: clockMinutes(story, s, now) },
});

/** When, on the story's clock, something kept with `keepClock` happened, as "00:51". */
export const clockOf = (s: CaseState, key: string): string | undefined => {
  const m = s.at[CLOCK(key)];
  return m === undefined ? undefined : fromMinutes(m);
};

/**
 * What the story's clock said at a moment already past: by the clock of the
 * episode that moment fell in, so a message that arrived in Episode 1 keeps
 * its Episode 1 time once Episode 2 has begun.
 */
export function clockAt(story: Story, s: CaseState, when: number): string {
  const ep = ([3, 2] as const).find((n) => s.began?.[n] !== undefined && when >= (s.began?.[n] ?? Infinity)) ?? 1;
  const start = ep === 1 ? s.started : (s.began?.[ep] ?? s.started);
  const base = minutesOf(story.clocks[ep - 1].base);
  return hhmm((base + Math.max(0, Math.floor((when - start) / 60_000))) % (24 * 60));
}

/**
 * How many minutes ago, on the story's clock, a live event arrived: what
 * Notification Centre counts from. Undefined for one with no time kept.
 */
export function minutesSince(story: Story, s: CaseState, id: string, now: number): number | undefined {
  const when = s.at[`event:${id}`];
  if (when === undefined) return undefined;
  if (story.beats) {
    const at = eventClock(story, s, id);
    return at === undefined ? undefined : Math.max(0, nightly(clockNow(story, s, now)) - nightly(at));
  }
  return (minutesOf(clockNow(story, s, now)) - minutesOf(clockAt(story, s, when)) + 24 * 60) % (24 * 60);
}

/** When a live event happened on a story with beats: its own clock, or the clock kept when it fired. */
export function eventClock(story: Story, s: CaseState, id: string): string | undefined {
  return story.events.find((e) => e.id === id)?.clock ?? clockOf(s, `event:${id}`);
}

/** Past midnight on an episode that opened before it (Episode 1, 11:40 PM to 12:13 AM). */
const pastMidnight = (story: Story, s: CaseState): boolean => {
  const c = story.clocks[episodeOf(s) - 1];
  return Boolean(story.beats && c.after) && nightly(c.base) < 1440 && nightly(beatClock(story, s)) >= 1440;
};

export const dayNow = (story: Story, s: CaseState): string => {
  const c = story.clocks[episodeOf(s) - 1];
  return pastMidnight(story, s) && c.after ? c.after.day : c.day;
};

/** Today's date on the story's calendar, "30/11". */
export const dateNow = (story: Story, s: CaseState): string => {
  const c = story.clocks[episodeOf(s) - 1];
  return pastMidnight(story, s) && c.after ? c.after.date : c.date;
};

/**
 * The found phone's battery. Off the charger it falls with the beats, not
 * with a timer (the clock's `drain`); on it, it climbs a point a minute, or
 * with the story's own clock where it has beats.
 */
export function battery(story: Story, s: CaseState, now: number): number {
  const clock = story.clocks[episodeOf(s) - 1];
  if (clock.charging && story.beats) {
    const minutes = Math.max(0, nightly(beatClock(story, s)) - nightly(clock.base));
    return Math.min(100, clock.battery + Math.floor(minutes * (clock.rate ?? 1)));
  }
  if (clock.charging) return Math.min(100, clock.battery + Math.max(0, Math.floor((now - episodeStart(s)) / 60_000)));
  const steps = (clock.drain ?? []).filter((d) => has(s, d.after));
  return steps.length ? steps[steps.length - 1].battery : clock.battery;
}

export const charging = (story: Story, s: CaseState): boolean => Boolean(story.clocks[episodeOf(s) - 1].charging);

/** Note an app was open, for badges and the idle nudge. */
export const logUsage = (s: CaseState, app: AppId, now: number): CaseState => ({
  ...s,
  at: { ...s.at, [app]: now },
});
