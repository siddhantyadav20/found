import type { AppId, Evidence, FileClaim, Question, Story } from "@/content/types";
import { add, bearsOn, factRoutes, filingFor, pinFlag, pinning, seen, usable, WRONG, type CaseState, type Row } from "./engine";
import { leadFor } from "./lead";

/* ===========================================================================
   Pinning (2026-11-12): what makes the case file detective work.

   A study of fifteen detective games (playtest/case-file-study.html) found
   one thing every good one shares: the player commits to something the game
   hasn't already decided. Here that's one act: a clue they've seen, pinned to
   the row it answers. The game only checks it.

   What the player chooses from is kept small on purpose. The note offers the
   few clues they saw most recently that bear on the open rows, and one that
   doesn't (a row's `misses` first, the near misses the script already knows
   about), so the choice is real and can't be brute-forced from forty. A
   wrong pin costs nothing and says why.

   Help shows before it tells, as Candy Crush wiggles a move: after a pause
   the clue that fits glows, or, with none to hand, the app it's in. The
   pause is the player's own: half again their usual time per row, so a quick
   player is left alone (Duolingo's aim for the middle).
   =========================================================================== */

export type Pinned = { readonly state: CaseState; readonly ok: boolean; readonly reply: string };

const rowsOf = (story: Story, s: CaseState, q: Question): Row[] => filingFor(story, s, q).rows;

/** When it was seen: later is nearer the top. */
const recency = (s: CaseState, id: string) => s.flags.lastIndexOf(`saw:${id}`);

/**
 * The clues on the note's tray for a question: up to `size` that answer an
 * open row (the latest for each row first, then the latest of the rest), and
 * one that doesn't. `more` is everything else
 * the player has found that bears on it, for a player who wants to look.
 */
export function tray(story: Story, s: CaseState, q: Question, size = 3): { clues: Evidence[]; more: Evidence[] } {
  const rows = rowsOf(story, s, q);
  const open = rows.filter((r) => !r.by);
  if (!pinning(story, s) || !open.length) return { clues: [], more: [] };
  const held = new Set(rows.flatMap((r) => r.by ?? []));
  const can = (id: string) => seen(s, id) && usable(story, s, id) && !held.has(id);
  const latest = (ids: Iterable<string>) => [...new Set(ids)].filter(can).toSorted((a, b) => recency(s, b) - recency(s, a));
  const right = latest(open.flatMap((r) => factRoutes(r.fact).flat()));
  const misses = latest(open.flatMap((r) => Object.keys(r.fact.misses ?? {}))).filter((id) => !right.includes(id));
  const near = latest(bearsOn(q)).filter((id) => !right.includes(id) && !misses.includes(id));
  // One for each open row first, so no row's way in is hidden under another's; then the latest of the rest.
  const each = open.map((r) => right.find((id) => factRoutes(r.fact).some((x) => x.includes(id)))).filter((id): id is string => Boolean(id));
  const top = [...new Set([...each, ...right])].slice(0, size);
  const decoy = misses[0] ?? near[0];
  const shown = (decoy ? [...top, decoy] : top).toSorted((a, b) => recency(s, b) - recency(s, a));
  const rest = [...right, ...misses, ...near].filter((id) => !shown.includes(id));
  const ev = (id: string) => story.evidence.find((e) => e.id === id);
  return { clues: shown.map(ev).filter((e): e is Evidence => Boolean(e)), more: rest.map(ev).filter((e): e is Evidence => Boolean(e)) };
}

/** Pin a clue to a row. Right, the row fills; wrong, nothing changes, and the note says why. */
export function pin(story: Story, s: CaseState, q: Question, row: number, id: string, now?: number): Pinned {
  const rows = rowsOf(story, s, q);
  const r = rows[row];
  if (!r || r.by || !pinning(story, s)) return { state: s, ok: false, reply: "" };
  if (!seen(s, id) || !usable(story, s, id)) return { state: s, ok: false, reply: WRONG };
  const f = r.fact;
  const routes = factRoutes(f).filter((x) => x.includes(id));
  if (routes.length) {
    if (routes.some((x) => x.every((y) => usable(story, s, y)))) {
      const pinned = add(s, pinFlag(q.id, row, id));
      return { state: now === undefined ? pinned : { ...pinned, at: { ...pinned.at, [`pin:${q.id}:${row}`]: now } }, ok: true, reply: "" };
    }
    return { state: s, ok: false, reply: `That's part of it. On its own it doesn't show ${f.what}.` };
  }
  const miss = f.misses?.[id];
  if (miss) return { state: s, ok: false, reply: miss };
  const elsewhere = rows.some((o) => o !== r && !o.by && factRoutes(o.fact).some((x) => x.includes(id)));
  return { state: s, ok: false, reply: `That doesn't show ${f.what}.${elsewhere ? " It fits another line here." : ""}` };
}

/** Every row that the phone shows, pinned with what shows it: the solver's way through, and nobody else's. */
export function pinAll(story: Story, s: CaseState, q: Question): CaseState {
  let x = s;
  for (const r of rowsOf(story, s, q)) if (!r.by && r.shown) x = add(x, pinFlag(q.id, r.i, r.shown[0]));
  return x;
}

/**
 * Where Sameer's account breaks against what the player has pinned: the
 * first of its `against` facts that's on the note now.
 */
export function breaksOn(story: Story, s: CaseState, q: Question, c: FileClaim): string | undefined {
  if (!c.against?.length) return undefined;
  return rowsOf(story, s, q).find((r) => r.by && c.against!.includes(r.fact.fact))?.fact.fact;
}

/* --- pace ------------------------------------------------------------------ */

const median = (xs: readonly number[]) => {
  const v = xs.toSorted((a, b) => a - b);
  return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
};

/** The player's usual time between one pinned row and the next, from what they've pinned so far. */
export function pace(s: CaseState): number | undefined {
  const at = Object.entries(s.at)
    .filter(([k]) => k.startsWith("pin:"))
    .map(([, v]) => v)
    .toSorted((a, b) => a - b);
  const gaps = at.slice(1).map((v, i) => v - at[i]).filter((g) => g > 0 && g < 15 * 60_000);
  return gaps.length ? median(gaps) : undefined;
}

/** How long before the fitting clue glows: half again their own pace, between 15 seconds and a minute. */
export function glowAfter(s: CaseState): number {
  const p = pace(s);
  return p === undefined ? 20_000 : Math.min(60_000, Math.max(15_000, Math.round(p * 1.5)));
}

/** How long before the game says, in words, where to look: well after the glow, and never sooner than 30 seconds. */
export const nudgeAfter = (s: CaseState): number => Math.max(30_000, glowAfter(s) * 2);

/** What glows: a clue on the tray that fits a row, or else the app the next one is in. */
export type Glow = { readonly kind: "clue"; readonly evidence: string; readonly row: number } | { readonly kind: "app"; readonly app: AppId };

export function glowFor(story: Story, s: CaseState, q: Question): Glow | undefined {
  const { clues } = tray(story, s, q);
  for (const r of rowsOf(story, s, q)) {
    if (r.by) continue;
    const fits = clues.find((e) => factRoutes(r.fact).some((x) => x.includes(e.id) && x.every((y) => usable(story, s, y))));
    if (fits) return { kind: "clue", evidence: fits.id, row: r.i };
  }
  const next = leadFor(story, s, q);
  if (next && (next.lead.kind === "open" || next.lead.kind === "do") && next.lead.app !== "casefile") return { kind: "app", app: next.lead.app };
  return undefined;
}
