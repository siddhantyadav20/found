import type { AppId, EpisodeNo, Evidence, Flag, Hints, LiveEvent, Question, Story } from "@/content/types";

/* ===========================================================================
   The engine: one playthrough, as data.

   It knows about flags, evidence, questions, hints, live events and the
   ledger. It knows nothing about any one story. Every function here is pure:
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
  /** Exposure ids, in the order the player handed them over. */
  readonly ledger: readonly string[];
  /** A run id, so one save's events can't be replayed into another. */
  readonly run: string;
  readonly started: number;
  /** When each app was last open, for badges and the idle nudge. */
  readonly at: Readonly<Record<string, number>>;
  /** The drop this playthrough arrived through, if any. */
  readonly via?: string;
  /** When Episodes 2 and 3 began, so each one's clock starts at its own base. */
  readonly began?: Readonly<Record<string, number>>;
};

export function newCase(run: string, now: number, via?: string): CaseState {
  return { version: SAVE_VERSION, flags: [], ledger: [], run, started: now, at: {}, via };
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

/** What the case file lists: everything reachable, in the order it was found. */
export const caseFile = (story: Story, s: CaseState): Evidence[] =>
  story.evidence.filter((e) => reachable(s, e) && seen(s, e.id));

/** What an app's badge counts: reachable, unseen, and never a bait. */
export const unseenIn = (story: Story, s: CaseState, app: AppId): number =>
  story.evidence.filter((e) => e.app === app && !e.manual && reachable(s, e) && !seen(s, e.id)).length;

/** What opening one app finds on its own: everything in it but the manual. */
export const openApp = (story: Story, s: CaseState, app: AppId): CaseState =>
  story.evidence.filter((e) => e.app === app && !e.manual).reduce((acc, e) => see(story, acc, e.id), s);

/** Every icon on the found phone's home screen, pages and dock together. */
export const homeIcons = (story: Story) => [...story.hersHome.pages.flat(), ...story.hersHome.dock];

/** What the owner's phone calls an app. The dock and the pages are the only source. */
export const appLabel = (story: Story, app: AppId): string =>
  homeIcons(story).find((i) => i.app === app)?.label ?? app;

/* --- questions ---------------------------------------------------------- */

export const answered = (s: CaseState, id: string): boolean => has(s, `ask:${id}`);

/** The one question in front of the player: first unanswered, this episode. */
export function openQuestion(story: Story, s: CaseState): Question | undefined {
  const q = story.questions.find((x) => x.episode === episodeOf(s) && !answered(s, x.id));
  // The next question waits for its moment rather than being skipped past.
  return q && all(s, q.requires) ? q : undefined;
}

export const normalise = (t: string): string =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** The claims on a board: those whose ledger entry is held, plus those that need none. */
export const claimsFor = (q: Extract<Question, { kind: "claims" }>, s: CaseState) =>
  q.claims.filter((c) => !c.needs || exposed(s, c.needs));

export type Answer = { readonly state: CaseState; readonly ok: boolean; readonly reply: string };

export const WRONG = "Not quite. Look again.";
export const TOO_MUCH = "Some of that proves it. Take out what doesn't.";
export const UNCHECKED = "Check each of them on the phone before you decide.";

/**
 * Judge an answer. `given` is evidence ids for a pick, text for a type, row
 * ids in the "phone" lane for a timeline, and claim ids marked true for
 * claims. Getting it wrong costs nothing but the truth of having been wrong.
 */
export function answer(story: Story, s: CaseState, id: string, given: readonly string[] | string): Answer {
  const q = story.questions.find((x) => x.id === id);
  if (!q || answered(s, id)) return { state: s, ok: false, reply: WRONG };

  const picked = Array.isArray(given) ? given : [];
  const text = typeof given === "string" ? normalise(given) : "";
  let ok = false;
  let reply = WRONG;

  switch (q.kind) {
    case "pick": {
      // You cannot put something on the table that you have not found.
      if (!picked.every((id) => seen(s, id))) return { state: s, ok: false, reply: WRONG };
      const routes = [q.proof, ...(q.orProof ?? [])];
      ok = routes.some((route) => picked.length === route.length && picked.every((p) => route.includes(p)));
      // Something in there proves it, and something else doesn't.
      if (!ok && routes.some((route) => picked.some((p) => route.includes(p)))) reply = TOO_MUCH;
      break;
    }
    case "type":
      ok = q.accepts.some((a) => normalise(a) === text);
      break;
    case "timeline": {
      /* The board only holds what the player has found, so the answer is
         judged against that and not against the whole script. */
      const known = q.rows.filter((r) => seen(s, r.evidence));
      const want = new Set(known.filter((r) => r.lane === "phone").map((r) => r.id));
      ok =
        want.size > 0 &&
        picked.length === want.size &&
        picked.every((p) => want.has(p)) &&
        // Nothing can be put on the board that isn't on it.
        picked.every((p) => known.some((r) => r.id === p));
      break;
    }
    case "claims": {
      /* A claim is only judged once what settles it has been looked at, so
         the board can't be passed by guessing. What can't be reached needs
         no checking. */
      const claims = claimsFor(q, s);
      const unchecked = claims.some((c) => {
        const e = c.proof ? story.evidence.find((x) => x.id === c.proof) : undefined;
        return e !== undefined && reachable(s, e) && !seen(s, e.id);
      });
      if (unchecked) return { state: s, ok: false, reply: UNCHECKED };
      const want = new Set(claims.filter((c) => c.trueWhen && all(s, c.trueWhen)).map((c) => c.id));
      ok = picked.length === want.size && picked.every((p) => want.has(p));
      break;
    }
  }

  if (!ok) return { state: s, ok: false, reply };
  return { state: add(s, `ask:${id}`, ...(q.sets ?? [])), ok: true, reply: q.reply };
}

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
  story.events.filter((e) => !fired(s, e.id) && all(s, e.after));

export const fire = (story: Story, s: CaseState, id: string): CaseState => {
  const e = story.events.find((x) => x.id === id);
  return e ? add(s, `fired:${id}`, ...(e.sets ?? [])) : s;
};

/* --- the ledger --------------------------------------------------------- */

export const exposed = (s: CaseState, id: string): boolean => s.ledger.includes(id);

/** Something the player handed over. Recorded once, and never announced. */
export function expose(story: Story, s: CaseState, id: string): CaseState {
  if (exposed(s, id) || !story.exposures.some((e) => e.id === id)) return s;
  return { ...s, ledger: [...s.ledger, id] };
}

/** What the ledger holds, in the order it was collected. */
export const against = (story: Story, s: CaseState) =>
  s.ledger.flatMap((id) => story.exposures.filter((e) => e.id === id));

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

/** The story's own clock: this episode's base time plus how long it has run. */
export function clockNow(story: Story, s: CaseState, now: number): string {
  const base = minutesOf(story.clocks[episodeOf(s) - 1].base);
  const minutes = Math.max(0, Math.floor((now - episodeStart(s)) / 60_000));
  const t = (base + minutes) % (24 * 60);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export const dayNow = (story: Story, s: CaseState): string => story.clocks[episodeOf(s) - 1].day;

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
