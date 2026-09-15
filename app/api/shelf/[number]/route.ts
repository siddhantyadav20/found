import { NextResponse } from "next/server";

import { isCaseId } from "@/content/cases";
import { isSolved, normalizeCaseNumber } from "@/lib/found/keeping";
import { upgrade } from "@/lib/found/progress";
import { putShelf, readShelf, type Put } from "@/lib/found/shelfStore";
import { overLimit, redisReady } from "@/lib/upstash";
import { visitorId } from "@/lib/visitorId";

/** Every lookup counts, found or not: that's what makes guessing numbers slow. */
const READS_PER_HOUR = 60;
/** A save goes up a couple of seconds after each change; an hour of hard play is a few hundred. */
const WRITES_PER_HOUR = 900;
/** A whole case's save is a few kilobytes. */
const MAX_BODY = 200_000;

const json = (body: unknown, status = 200, retryAfter?: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) },
  });

const notFound = () => json({ error: "Not found" }, 404);

/** Everything kept under a case number: a restore link, opened. */
export async function GET(_request: Request, ctx: RouteContext<"/api/shelf/[number]">) {
  const n = normalizeCaseNumber((await ctx.params).number);
  if (!n) return notFound();
  if (!redisReady()) return json({ error: "unavailable" }, 503);
  try {
    const limit = await overLimit(`found:shelf-read:${await visitorId()}`, READS_PER_HOUR, 3600);
    if (limit.over) return json({ error: "throttled" }, 429, limit.retryAfter);
    const shelf = await readShelf(n);
    return shelf ? json(shelf) : notFound();
  } catch (err) {
    console.error("[found] shelf read failed", err);
    return json({ error: "failed" }, 500);
  }
}

/**
 * One case's save and/or finish, kept under the number. Sent with `fetch`,
 * or with `sendBeacon` as the page goes away, so the body is read as text
 * whatever it says it is.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/shelf/[number]">) {
  const n = normalizeCaseNumber((await ctx.params).number);
  if (!n) return notFound();
  if (!redisReady()) return json({ error: "unavailable" }, 503);

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: "Too large" }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return json({ error: "Bad request" }, 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  if (!isCaseId(body.case)) return json({ error: "Bad request" }, 400);

  const put: Put = {};
  if (body.save === null) put.save = null;
  else if (body.save !== undefined) {
    const save = upgrade(body.save);
    if (!save) return json({ error: "Bad request" }, 400);
    put.save = save;
  }
  if (body.solved !== undefined) {
    if (!isSolved(body.solved)) return json({ error: "Bad request" }, 400);
    put.solved = body.solved;
  }

  try {
    const limit = await overLimit(`found:shelf-put:${n}`, WRITES_PER_HOUR, 3600);
    if (limit.over) return json({ error: "throttled" }, 429, limit.retryAfter);
    return (await putShelf(n, body.case, put)) ? json({ ok: true }) : notFound();
  } catch (err) {
    console.error("[found] shelf write failed", err);
    return json({ error: "failed" }, 500);
  }
}
