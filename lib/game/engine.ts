import type { AppId, EpisodeNo, Evidence, FileClaim, Flag, Hints, Link, LiveEvent, Question, Story } from "@/content/types";

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
};

/**
 * A link, as it goes into the record: a traced link `in` or `out`; an
 * untraced one `out`, as what Sameer `says`, or as `fact`.
 */
export type RecordChoice = "in" | "out" | "says" | "fact";

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

export function see(story: Story, s: CaseState, id: string): CaseState {
  const e = story.evidence.find((x) => x.id === id);
  return e && reachable(s, e) ? add(s, `saw:${id}`) : s;
}

/**
 * Everything whose finding act has already happened, now that it can count.
 * Run on every save, so an act done early counts the moment its episode opens.
 */
export const settle = (story: Story, s: CaseState): CaseState =>
  story.evidence
    .filter((e) => e.foundBy?.length && all(s, e.foundBy) && reachable(s, e) && !seen(s, e.id))
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
  if (q.kind !== "file" || !answered(s, q.id) || !q.reopenWhen?.length || !all(s, q.reopenWhen)) return false;
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
      (q.kind === "file" && !q.mustRevisit && needsRevisit(q, s)),
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
export const TOO_MUCH = "Some of that proves it. Take out what doesn't.";
export const PARTLY = "That's part of it. Something's missing.";
export const UNCHECKED = "Check each of them on the phone before you decide.";
export const STRUCK = "That's the line you struck. What you found since says otherwise.";
export const THIN = "The board can't show that yet. Something's missing from it.";

/** A timeline with enough on it to prove anything: one of its `enough` routes is all found. */
export const boardReady = (q: Question, s: CaseState): boolean =>
  q.kind !== "timeline" || !q.enough?.length || q.enough.some((r) => r.every((id) => seen(s, id)));

/**
 * All of one route, and nothing that wasn't found. More true proof is still
 * proof: anything that belongs to one of the routes can sit beside it, and
 * only what proves nothing here has to come off the table.
 */
function judgeProof(s: CaseState, routes: readonly (readonly string[])[], picked: readonly string[]): { ok: boolean; reply: string } {
  // You cannot put something on the table that you have not found.
  if (!picked.length || !picked.every((id) => seen(s, id))) return { ok: false, reply: WRONG };
  const proves = (id: string) => routes.some((route) => route.includes(id));
  const stray = picked.filter((p) => !proves(p)).length;
  if (!stray && routes.some((route) => route.every((id) => picked.includes(id)))) return { ok: true, reply: "" };
  // Something in there proves it, and something else doesn't.
  if (stray && stray < picked.length) return { ok: false, reply: TOO_MUCH };
  // Everything on the table counts, but no route is whole yet.
  if (!stray) return { ok: false, reply: PARTLY };
  return { ok: false, reply: WRONG };
}

/**
 * Judge an answer. Getting it wrong costs nothing but the truth of having
 * been wrong. Filing the owner's version is not getting it wrong.
 */
export function answer(story: Story, s: CaseState, id: string, given: Given): Answer {
  const q = story.questions.find((x) => x.id === id);
  const revisiting = q ? needsRevisit(q, s) : false;
  if (!q || (answered(s, id) && !revisiting)) return { state: s, ok: false, reply: WRONG };

  const picked = Array.isArray(given) ? (given as readonly string[]) : [];
  const text = typeof given === "string" ? normalise(given) : "";
  let ok = false;
  let reply = WRONG;

  switch (q.kind) {
    case "pick":
      ({ ok, reply } = judgeProof(s, [q.proof, ...(q.orProof ?? [])], picked));
      break;
    case "type":
      ok = q.accepts.some((a) => normalise(a) === text);
      break;
    case "timeline": {
      if (!boardReady(q, s)) return { state: s, ok: false, reply: THIN };
      /* The board only holds what the player has found, so the answer is
         judged against that and not against the whole script: every known
         row in its own lane, and nothing else. */
      const want = q.rows.filter((r) => seen(s, r.evidence)).map((r) => `${r.id}@${r.lane}`);
      ok = want.length > 0 && picked.length === want.length && want.every((w) => picked.includes(w));
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
      // A Revisit moves on from the version on file; it can't file a version again.
      if (revisiting && c.version) return { state: s, ok: false, reply: STRUCK };
      ({ ok, reply } = judgeProof(s, [c.proof, ...(c.orProof ?? [])], proof));
      if (!ok) return { state: s, ok, reply };
      return {
        state: add(s, `ask:${id}`, `claim:${id}:${c.id}`, ...(c.sets ?? []), ...(revisiting ? [] : (q.sets ?? []))),
        ok: true,
        reply: c.reply,
      };
    }
  }

  if (!ok) return { state: s, ok: false, reply };
  return { state: add(s, `ask:${id}`, ...(q.sets ?? [])), ok: true, reply: q.reply };
}

/* --- the chain ---------------------------------------------------------- */

export const isTraced = (s: CaseState, link: Link): boolean => has(s, `link:${link.id}`);

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

export const dueEvents = (story: Story, s: CaseState): LiveEvent[] =>
  story.events.filter((e) => !fired(s, e.id) && all(s, e.after) && !(e.unless ?? []).some((f) => has(s, f)));

/** Play a live event, once; given `now`, it also remembers when, for what arrives with it. */
export const fire = (story: Story, s: CaseState, id: string, now?: number): CaseState => {
  const e = story.events.find((x) => x.id === id);
  if (!e) return s;
  const next = add(s, `fired:${id}`, ...(e.sets ?? []));
  return now === undefined ? next : { ...next, at: { ...next.at, [`event:${id}`]: now } };
};

/** When something arriving with a live event (or a reply, by its id) arrived, on the story's clock; else its own time. */
export const arrivedAt = (story: Story, s: CaseState, m: { readonly at: string; readonly with?: string }): string => {
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

/** The story's own clock: this episode's base time plus how long it has run. */
export function clockNow(story: Story, s: CaseState, now: number): string {
  const base = minutesOf(story.clocks[episodeOf(s) - 1].base);
  const minutes = Math.max(0, Math.floor((now - episodeStart(s)) / 60_000));
  return hhmm((base + minutes) % (24 * 60));
}

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

export const dayNow = (story: Story, s: CaseState): string => story.clocks[episodeOf(s) - 1].day;

/** Today's date on the story's calendar, "30/11". */
export const dateNow = (story: Story, s: CaseState): string => story.clocks[episodeOf(s) - 1].date;

/**
 * The found phone's battery. Off the charger it falls with the beats, not
 * with a timer (the clock's `drain`); on it, it climbs a point a minute.
 */
export function battery(story: Story, s: CaseState, now: number): number {
  const clock = story.clocks[episodeOf(s) - 1];
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
