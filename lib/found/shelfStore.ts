import "server-only";

import { randomBytes } from "node:crypto";

import { CASE_IDS, type CaseId } from "@/content/cases";
import { redis } from "@/lib/upstash";
import type { CaseState } from "@/lib/game/engine";
import { betterSolved, isSolved, numberFromBytes, type Solved } from "./keeping";
import { upgrade } from "./progress";

/* ===========================================================================
   The shelf: a case number's saves, kept on the server.

     found:shelf:<number>                 {"created"}: the number exists
     found:shelf:<number>:save:<case>     that case's save, as the browser keeps it
     found:shelf:<number>:solved:<case>   its first finish of the furthest episode

   A key per case rather than one document, so two devices playing two cases
   can't overwrite each other. Every write pushes all of them a year out: a
   number is kept for a year after the last play, not after it was made.

   Nothing here says who. The number is the only handle, as a drop's code is.
   =========================================================================== */

const TTL = 365 * 24 * 3600;

const base = (n: string) => `found:shelf:${n}`;
const saveAt = (n: string, id: CaseId) => `${base(n)}:save:${id}`;
const solvedAt = (n: string, id: CaseId) => `${base(n)}:solved:${id}`;

export type Shelf = {
  saves: Partial<Record<CaseId, CaseState>>;
  solved: Partial<Record<CaseId, Solved>>;
};

export type Put = { save?: CaseState | null; solved?: Solved };

function parse(raw: unknown): unknown {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createShelf(): Promise<string> {
  let n: string | null = null;
  while (!n) n = numberFromBytes(randomBytes(24));
  await redis(["SET", base(n), JSON.stringify({ created: Date.now() }), "EX", TTL]);
  return n;
}

/** Everything under a number, or null if nobody made it (or it lapsed). */
export async function readShelf(n: string): Promise<Shelf | null> {
  const results = await redis(["GET", base(n)], ...CASE_IDS.flatMap((id) => [["GET", saveAt(n, id)], ["GET", solvedAt(n, id)]]));
  if (typeof results[0] !== "string") return null;
  const shelf: Shelf = { saves: {}, solved: {} };
  CASE_IDS.forEach((id, i) => {
    const save = upgrade(parse(results[1 + i * 2]));
    if (save) shelf.saves[id] = save;
    const solved = parse(results[2 + i * 2]);
    if (isSolved(solved)) shelf.solved[id] = solved;
  });
  return shelf;
}

/**
 * One case's save (`null` when it was put back in the envelope) and/or a
 * finish. False if the number doesn't exist: a write never creates one.
 */
export async function putShelf(n: string, id: CaseId, put: Put): Promise<boolean> {
  const [exists, kept] = await redis(["GET", base(n)], ["GET", solvedAt(n, id)]);
  if (typeof exists !== "string") return false;

  const commands: (string | number)[][] = [["EXPIRE", base(n), TTL]];
  if (put.save === null) commands.push(["DEL", saveAt(n, id)]);
  else if (put.save) commands.push(["SET", saveAt(n, id), JSON.stringify(put.save), "EX", TTL]);
  else commands.push(["EXPIRE", saveAt(n, id), TTL]);

  const prev = parse(kept);
  const solved = betterSolved(isSolved(prev) ? prev : null, put.solved ?? null);
  if (solved) commands.push(["SET", solvedAt(n, id), JSON.stringify(solved), "EX", TTL]);

  await redis(...commands);
  return true;
}
