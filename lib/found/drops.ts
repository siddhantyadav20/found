"use server";

import { isCaseId } from "@/content/cases";
import { overLimit, redisReady } from "@/lib/upstash";
import { visitorId } from "@/lib/visitorId";
import { cleanDropName } from "./dropName";
import { createDropRecord } from "./dropStore";

/* ===========================================================================
   Sealing an envelope for someone else: the end card's "Pass it on".

   Without a store there is nowhere to keep a drop, and the card falls back to
   sharing the case's plain link, so a player is never stuck.
   =========================================================================== */

/** A household sealing envelopes for its whole contact list, and then some. */
const PER_HOUR = 40;

export type DropResult = { ok: true; code: string; to: string } | { ok: false; reason: "unavailable" | "throttled" | "failed" };

export async function createDrop(caseId: string, rawName: string, rawTraced?: number): Promise<DropResult> {
  if (!isCaseId(caseId) || !redisReady()) return { ok: false, reason: "unavailable" };
  const to = cleanDropName(rawName);
  // How many links the sender traced: only ever a small whole number, for a share image.
  const traced = typeof rawTraced === "number" && Number.isInteger(rawTraced) && rawTraced >= 0 && rawTraced <= 20 ? rawTraced : undefined;
  try {
    const limit = await overLimit(`found:drop-rl:${await visitorId()}`, PER_HOUR, 3600);
    if (limit.over) return { ok: false, reason: "throttled" };
    return { ok: true, code: await createDropRecord(caseId, to, traced), to };
  } catch (err) {
    console.error("[found] drop failed", err);
    return { ok: false, reason: "failed" };
  }
}
