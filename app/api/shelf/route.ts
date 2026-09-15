import { NextResponse } from "next/server";

import { createShelf } from "@/lib/found/shelfStore";
import { overLimit, redisReady } from "@/lib/upstash";
import { visitorId } from "@/lib/visitorId";

/** A household, a classroom on one Wi-Fi: plenty, and still no use for farming numbers. */
const PER_HOUR = 10;

const json = (body: unknown, status = 200, retryAfter?: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) },
  });

/**
 * A new case number, empty. The browser that asked for it sends up whatever
 * it already holds straight after (`lib/found/shelf.ts`).
 */
export async function POST() {
  if (!redisReady()) return json({ error: "unavailable" }, 503);
  try {
    const limit = await overLimit(`found:shelf-rl:${await visitorId()}`, PER_HOUR, 3600);
    if (limit.over) return json({ error: "throttled" }, 429, limit.retryAfter);
    return json({ number: await createShelf() }, 201);
  } catch (err) {
    console.error("[found] case number failed", err);
    return json({ error: "failed" }, 500);
  }
}
