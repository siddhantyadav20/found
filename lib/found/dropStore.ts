import "server-only";

import { randomBytes } from "node:crypto";

import type { CaseId } from "@/content/cases";
import { asCount, redis } from "@/lib/upstash";
import { dropKey as key, readDrop, type Drop } from "./dropRead";

export { isDropCode, readDrop, type Drop } from "./dropRead";

/* ===========================================================================
   Drops: a phone passed on to someone by name.

     found:drop:<code>             {"case","to","created"} as JSON, 90 days
     found:drop:<code>:<leg>       how many times it was arrived at, opened,
                                   unlocked, finished (a group chat is many)
     found:drop:<code>:secs        the last finish time, in seconds

   The code is the only handle. It names nobody: `to` is a first name the
   sender typed for the envelope's label, and nothing identifies who sent it
   or who opened it. The sender's browser remembers its own codes; that is
   how it finds out how far its friend got.

   Reading a drop lives in ./dropRead, which the Edge share image can load.
   =========================================================================== */

const TTL = 90 * 24 * 3600;
const LEGS = ["arrive", "open", "unlock", "end"] as const;
export type Leg = (typeof LEGS)[number];

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export type DropStatus = {
  to: string;
  case: CaseId;
  arrived: number;
  opened: number;
  unlocked: number;
  finished: number;
  /** The most recent finish, in seconds from opening the envelope. */
  seconds: number | null;
};

function newCode(): string {
  return Array.from(randomBytes(8), (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function createDropRecord(caseId: CaseId, to: string, held?: number): Promise<string> {
  const code = newCode();
  const drop: Drop = { case: caseId, to, created: Date.now(), ...(held === undefined ? {} : { held }) };
  await redis(["SET", key(code), JSON.stringify(drop), "EX", TTL]);
  return code;
}

export async function dropStatus(code: unknown): Promise<DropStatus | null> {
  const drop = await readDrop(code);
  if (!drop) return null;
  const results = await redis(...LEGS.map((l) => ["GET", `${key(code as string)}:${l}`]), ["GET", `${key(code as string)}:secs`]);
  const [arrived, opened, unlocked, finished] = LEGS.map((_, i) => asCount(results[i]));
  const secs = Number(results[LEGS.length]);
  return {
    to: drop.to,
    case: drop.case,
    arrived,
    opened,
    unlocked,
    finished,
    seconds: Number.isFinite(secs) && secs > 0 ? secs : null,
  };
}

/**
 * Count one step against a drop, and only a real drop of the same case: a
 * made-up code or one from another case counts nothing, so the keyspace is
 * bounded by drops that exist.
 */
export async function countDropLeg(code: unknown, caseId: CaseId, leg: Leg, seconds?: number): Promise<boolean> {
  const drop = await readDrop(code);
  if (!drop || drop.case !== caseId) return false;
  const base = key(code as string);
  const commands: (string | number)[][] = [
    ["INCR", `${base}:${leg}`],
    ["EXPIRE", `${base}:${leg}`, TTL],
  ];
  if (leg === "end" && seconds !== undefined) commands.push(["SET", `${base}:secs`, Math.round(seconds), "EX", TTL]);
  await redis(...commands);
  return true;
}
