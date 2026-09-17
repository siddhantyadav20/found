import "server-only";

import { isCaseId, type CaseId } from "@/content/cases";
import { STORIES } from "@/content/stories";
import { asCount, overLimit, redis, redisReady } from "@/lib/upstash";
import { visitorId } from "@/lib/visitorId";
import { countDropLeg } from "./dropStore";
import { DROP_LEGS, eventsFor, isFoundEvent } from "./events";

/* ===========================================================================
   Where each case's funnel lives.

     found:<case>:<event>    a counter per allowlisted event
     found:<case>:times      the last 500 Episode 1 finish times, in seconds
     found:rl:<who>          how many events one address sent this hour

   Plain counters rather than a hash: one INCR per event, read back with a
   GET per allowlisted name, which works against the dev stand-in
   (lib/upstashDev) as well as Upstash. The allowlist is what bounds the
   keyspace; an unknown event name is dropped before it reaches the store.
   =========================================================================== */

const prefix = (c: CaseId) => `found:${c}`;
const KEEP_TIMES = 500;

/** A whole playthrough sends perhaps 40 events. This leaves a household room. */
const PER_HOUR = 400;

/** Below this many answers, a percentage is one friend's opinion. Hidden. */
export const MIN_ANSWERS = 50;

const validSeconds = (x: unknown): number | undefined => {
  const s = Number(x);
  // A day is the ceiling: someone who left it on a tab for a week didn't take
  // a week to solve it, and one of those would drag the median.
  return Number.isFinite(s) && s > 0 && s < 86_400 ? Math.round(s) : undefined;
};

export async function countEvent(caseId: unknown, event: unknown, seconds: unknown, via: unknown): Promise<boolean> {
  if (!redisReady() || !isCaseId(caseId) || !isFoundEvent(STORIES[caseId], event)) return false;
  try {
    const limit = await overLimit(`found:rl:${await visitorId()}`, PER_HOUR, 3600);
    if (limit.over) return false;

    const p = prefix(caseId);
    const secs = validSeconds(seconds);
    const commands: (string | number)[][] = [["INCR", `${p}:${event}`]];
    if (event === "end" && secs !== undefined)
      commands.push(["LPUSH", `${p}:times`, secs], ["LTRIM", `${p}:times`, 0, KEEP_TIMES - 1]);
    await redis(...commands);

    // Someone who arrived through a drop: tell the drop, and count the loop.
    const leg = DROP_LEGS[event];
    if (via !== undefined && leg && (await countDropLeg(via, caseId, leg, secs)) && leg !== "arrive") {
      await redis(["INCR", `${p}:drop:${leg}`]);
    }
    return true;
  } catch (err) {
    console.error("[found] count failed", err);
    return false;
  }
}

async function readTimes(caseId: CaseId): Promise<number[]> {
  const [raw] = await redis(["LRANGE", `${prefix(caseId)}:times`, 0, -1]);
  return (Array.isArray(raw) ? raw : [])
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

export type Funnel = {
  configured: boolean;
  counts: Record<string, number>;
  finishes: number;
  /** Wall-clock from opening the envelope to the battery dying, breaks included. */
  medianSeconds: number | null;
};

export async function readFunnel(caseId: CaseId): Promise<Funnel> {
  if (!redisReady()) return { configured: false, counts: {}, finishes: 0, medianSeconds: null };
  const events = eventsFor(STORIES[caseId]);
  const results = await redis(...events.map((e) => ["GET", `${prefix(caseId)}:${e}`]));
  const counts = Object.fromEntries(events.map((e, i) => [e, asCount(results[i])]));
  const times = await readTimes(caseId);
  return {
    configured: true,
    counts,
    finishes: times.length,
    medianSeconds: times.length ? times[Math.floor(times.length / 2)] : null,
  };
}

/** The envelope's "About N minutes": the median Episode 1, once it means something. */
export async function estimatedMinutes(caseId: CaseId): Promise<number | undefined> {
  if (!redisReady()) return undefined;
  try {
    const times = await readTimes(caseId);
    if (times.length < MIN_ANSWERS) return undefined;
    return Math.max(5, Math.round(times[Math.floor(times.length / 2)] / 60 / 5) * 5);
  } catch {
    return undefined;
  }
}

/* --- What others did ----------------------------------------------------------
   Percentages only, never counts, and nothing until there are enough answers
   for a percentage to mean something. Read by the end card. */

export type Choices = {
  /** What everyone who answered Mum sent her, in percent. */
  mum: { lie: number; truth: number; silence: number } | null;
  /** What everyone said on the call that ends the chapter, in percent. */
  call: { send: number; run: number; fix: number } | null;
  /** The share of recent Episode 1 finishes slower than `seconds`. */
  fasterThan: number | null;
};

const MUM = ["lie", "truth", "silence"] as const;
const CALL = ["send", "run", "fix"] as const;

/** Whole percentages of `counts`, or null under `MIN_ANSWERS`. */
export function percentages<K extends string>(counts: Record<K, number>): Record<K, number> | null {
  const total = Object.values<number>(counts).reduce((n, c) => n + c, 0);
  if (total < MIN_ANSWERS) return null;
  return Object.fromEntries(Object.entries<number>(counts).map(([k, c]) => [k, Math.round((c / total) * 100)])) as Record<K, number>;
}

/** The share of `times` slower than `seconds`, or null under `MIN_ANSWERS`. */
export function fasterThan(times: readonly number[], seconds: number | undefined): number | null {
  if (seconds === undefined || times.length < MIN_ANSWERS) return null;
  return Math.round((times.filter((t) => t > seconds).length / times.length) * 100);
}

export async function readChoices(caseId: CaseId, seconds: unknown): Promise<Choices> {
  if (!redisReady()) return { mum: null, call: null, fasterThan: null };
  const results = await redis(
    ...MUM.map((m) => ["GET", `${prefix(caseId)}:mum:${m}`]),
    ...CALL.map((c) => ["GET", `${prefix(caseId)}:call:${c}`]),
  );
  const mum = Object.fromEntries(MUM.map((m, i) => [m, asCount(results[i])])) as Record<(typeof MUM)[number], number>;
  const call = Object.fromEntries(CALL.map((c, i) => [c, asCount(results[MUM.length + i])])) as Record<(typeof CALL)[number], number>;
  return { mum: percentages(mum), call: percentages(call), fasterThan: fasterThan(await readTimes(caseId), validSeconds(seconds)) };
}
