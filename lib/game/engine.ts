import type { AppId, EpisodeNo, Evidence, Flag, Hints, LiveEvent, Question, Story } from "@/content/types";

/* ===========================================================================
   The engine: one playthrough, as data.

   It knows about flags, evidence, questions, hints, live events and the
   ledger. It knows nothing about Vasundhara Kulkarni, Mumbai or a video call.
   Every function here is pure: the store (lib/found/progress.ts) owns the
   saving, and React owns the rendering.

   Written for the pivot of 2026-09-17 (ROADMAP.md P0), replacing the engine
   the two retired chapters shared.
   =========================================================================== */

export const SAVE_VERSION = 3;

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
  story.evidence.filter((e) => e.app === app && reachable(s, e) && !seen(s, e.id)).length;

/* --- questions ---------------------------------------------------------- */

export const answered = (s: CaseState, id: string): boolean => has(s, `ask:${id}`);

/** The one question in front of the player: first unanswered, this episode. */
export const openQuestion = (story: Story, s: CaseState): Question | undefined =>
  story.questions.find((q) => q.episode === episodeOf(s) && !answered(s, q.id));

export const normalise = (t: string): string =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export type Answer = { readonly state: CaseState; readonly ok: boolean; readonly reply: string };

export const WRONG = "Not quite. Look again.";
export const TOO_MUCH = "Some of that proves it. Take out what doesn't.";

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
      const want = new Set(q.proof);
      ok = picked.length === want.size && picked.every((p) => want.has(p));
      if (!ok && picked.some((p) => want.has(p))) reply = TOO_MUCH;
      break;
    }
    case "type":
      ok = q.accepts.some((a) => normalise(a) === text);
      break;
    case "timeline": {
      const want = new Set(q.rows.filter((r) => r.lane === "phone").map((r) => r.id));
      ok = picked.length === want.size && picked.every((p) => want.has(p));
      break;
    }
    case "claims": {
      const want = new Set(q.claims.filter((c) => c.trueWhen && all(s, c.trueWhen)).map((c) => c.id));
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

/** What Episode 3's officer can read out, in the order it was collected. */
export const against = (story: Story, s: CaseState) =>
  s.ledger.flatMap((id) => story.exposures.filter((e) => e.id === id));

/* --- time --------------------------------------------------------------- */

/** The story's own clock: its base time plus how long this episode has run. */
export function clockNow(story: Story, s: CaseState, now: number): string {
  const { base } = story.clocks[episodeOf(s) - 1];
  const [h, m] = base.split(":").map(Number);
  const minutes = Math.floor((now - s.started) / 60_000);
  const t = (h * 60 + m + minutes) % (24 * 60);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export const dayNow = (story: Story, s: CaseState): string => story.clocks[episodeOf(s) - 1].day;

/** Her battery: it only ever goes down, and never below one. */
export const battery = (story: Story, s: CaseState): number => story.clocks[episodeOf(s) - 1].battery;

/** Note an app was open, for badges and the idle nudge. */
export const logUsage = (s: CaseState, app: AppId, now: number): CaseState => ({
  ...s,
  at: { ...s.at, [app]: now },
});
