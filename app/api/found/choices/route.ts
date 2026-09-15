import { NextResponse } from "next/server";
import { isCaseId } from "@/content/cases";
import { readChoices } from "@/lib/found/store";

/**
 * What others did, for the end card: percentages only, and nothing at all
 * until enough people have answered (see `MIN_ANSWERS`). Public, and cached
 * for five minutes, because it changes slowly and every finisher asks.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const c = params.get("case");
  if (!isCaseId(c)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await readChoices(c, params.get("seconds") ?? undefined), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
