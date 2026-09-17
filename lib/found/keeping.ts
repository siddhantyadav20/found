import type { EpisodeNo } from "@/content/found/types";
import type { CaseState } from "./engine";

/* ===========================================================================
   Never losing a case: the pure half, shared by the browser and the server.

   A case number is twelve characters from an alphabet with nothing that reads
   two ways (no 0/O, no 1/I/L), in three groups of four, so it survives being
   read aloud, written on a hand, or typed into a laptop off a phone screen.
   It's the only key to the saves kept under it, so it's long: 31^12 is about
   8 × 10^17, and lookups are rate-limited on top of that.
   =========================================================================== */

export const NUMBER_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const LENGTH = 12;
/** Bytes at or above this are skipped, so no character is likelier than another. */
const FAIR = 256 - (256 % NUMBER_ALPHABET.length);

const grouped = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;

/** A case number from random bytes, or null if too few of them were usable. */
export function numberFromBytes(bytes: ArrayLike<number>): string | null {
  let out = "";
  for (let i = 0; i < bytes.length && out.length < LENGTH; i++) {
    if (bytes[i] < FAIR) out += NUMBER_ALPHABET[bytes[i] % NUMBER_ALPHABET.length];
  }
  return out.length === LENGTH ? grouped(out) : null;
}

/** However it was typed (lower case, spaces, no dashes), as the canonical number. */
export function normalizeCaseNumber(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const s = input.toUpperCase().replace(/[\s-]/g, "");
  if (s.length !== LENGTH) return null;
  for (const c of s) if (!NUMBER_ALPHABET.includes(c)) return null;
  return grouped(s);
}

export const restorePath = (n: string): string => `/r/${n}`;

/* --- Finishes, which outlive "Start over" ----------------------------------- */

export type Solved = {
  readonly episode: EpisodeNo;
  /** Wall-clock minutes for the episode, if it could be told. */
  readonly minutes: number | null;
  /** The result's marks, as the share shows them: 🟩🟩🟨. */
  readonly marks: string;
  readonly at: number;
};

export function isSolved(x: unknown): x is Solved {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    (s.episode === 1 || s.episode === 2 || s.episode === 3) &&
    (s.minutes === null || (typeof s.minutes === "number" && Number.isFinite(s.minutes) && s.minutes >= 0)) &&
    typeof s.marks === "string" &&
    s.marks.length <= 64 &&
    typeof s.at === "number"
  );
}

/** The furthest episode wins; within one, the first finish is the one kept. */
export function betterSolved(kept: Solved | null, next: Solved | null): Solved | null {
  if (!kept) return next;
  if (!next) return kept;
  return next.episode > kept.episode ? next : kept;
}

/**
 * Two saves of one case, from two devices: keep whichever got further. A tie
 * goes to the incoming one, which is what a player who opened a restore link
 * asked for.
 */
export function pickSave(local: CaseState | null, incoming: CaseState | null): CaseState | null {
  if (!local) return incoming;
  if (!incoming) return local;
  return incoming.flags.length >= local.flags.length ? incoming : local;
}

/* --- A save, in a line ---------------------------------------------------- */

export type Progress = {
  readonly episode: EpisodeNo;
  /** Mid-episode; between episodes (the phone died); or every episode done. */
  readonly phase: "playing" | "between" | "done";
  readonly name: string;
  /** The last time anything happened in the case (ms). */
  readonly last: number;
};

export function summarise(s: CaseState): Progress {
  const flags = s.flags as readonly string[];
  // Episode 2's end card leads straight on, so a finished Episode 2 is Episode 3 waiting.
  const episode = flags.includes("ep:3") || flags.includes("ep:2-done") ? 3 : flags.includes("ep:2") ? 2 : 1;
  const phase = flags.includes("ep:3-done") ? "done" : episode === 1 && flags.includes("dead") ? "between" : "playing";
  return { episode, phase, name: s.cast.name, last: Math.max(s.started, ...Object.values(s.at)) };
}

export function ago(then: number, now: number): string {
  const min = Math.round((now - then) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

/** Gone this long, a player comes back to "While you were away" and the case so far. */
export const AWAY_MS = 30 * 60_000;

export const wasAway = (s: CaseState, now: number): boolean => now - summarise(s).last >= AWAY_MS;

/** How the desk draws a case's object: new, mid-case, charging between episodes, or bagged. */
export type DeskState =
  | { readonly kind: "new" }
  | { readonly kind: "playing"; readonly episode: EpisodeNo; readonly name: string; readonly last: number }
  | { readonly kind: "between"; readonly name: string }
  /** `again`: the save is gone (started over), so opening it deals a new case. */
  | { readonly kind: "solved"; readonly solved: Solved | null; readonly again: boolean };

export function deskState(save: CaseState | null, solved: Solved | null): DeskState {
  if (save) {
    const p = summarise(save);
    if (p.phase === "playing") return { kind: "playing", episode: p.episode, name: p.name, last: p.last };
    if (p.phase === "between") return { kind: "between", name: p.name };
    return { kind: "solved", solved, again: false };
  }
  return solved ? { kind: "solved", solved, again: true } : { kind: "new" };
}

/**
 * Cases this browser hasn't seen on the desk before. Nothing is new to a
 * first visit (`seen` null): everything is.
 */
export const arrivals = (seen: readonly string[] | null, ids: readonly string[]): string[] =>
  seen ? ids.filter((id) => !seen.includes(id)) : [];

export type CaseLine = { readonly status: string; readonly result: string | null; readonly cta: string };

/** How the desk and the restore page describe one of your cases. */
export function describeCase(save: CaseState | null, solved: Solved | null, now: number): CaseLine {
  const result = solved
    ? `Solved Episode ${solved.episode}${solved.minutes ? ` in ${solved.minutes} min` : ""}${solved.marks ? ` · ${solved.marks}` : ""}`
    : null;
  if (!save) return { status: "Back in its envelope", result, cta: "Play again" };
  const p = summarise(save);
  if (p.phase === "between") return { status: "Episode 1 done · the phone is dead", result, cta: "Charge it" };
  if (p.phase === "done") return { status: "Case closed", result, cta: "Open it" };
  return { status: `Episode ${p.episode} · ${p.name} is missing · ${ago(p.last, now)}`, result, cta: "Carry on" };
}
