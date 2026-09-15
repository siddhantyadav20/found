import { NextResponse } from "next/server";
import { FEATURED, isCaseId } from "@/content/cases";
import { countEvent, readFunnel } from "@/lib/found/store";

/**
 * Found's funnel. A POST counts one allowlisted event for one case; a GET
 * reads a case's whole funnel back, for Siddhant only.
 *
 * The GET is behind `FOUND_STATS_TOKEN` (as `?token=`) everywhere but
 * `next dev`: the numbers are harmless, but a drop-off chart is not something
 * to publish by accident. Without the variable set the GET is simply a 404.
 */
type Body = { case?: unknown; event?: unknown; seconds?: unknown; via?: unknown } | null;

export async function POST(request: Request) {
  let body: Body = null;
  try {
    body = (await request.json()) as Body;
  } catch {
    // No body, or not JSON. Nothing to count.
  }
  return json({ counted: await countEvent(body?.case, body?.event, body?.seconds, body?.via) });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const token = process.env.FOUND_STATS_TOKEN;
  const open = process.env.NODE_ENV === "development";
  if (!open && (!token || params.get("token") !== token)) return json({ error: "Not found" }, 404);
  const c = params.get("case");
  return json(await readFunnel(isCaseId(c) ? c : FEATURED));
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
