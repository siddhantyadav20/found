import { NextResponse } from "next/server";
import { dropStatus } from "@/lib/found/dropStore";

/**
 * How far a passed-on phone has got: arrived, opened, unlocked, finished.
 * Asked for by the browser that sealed it, which is the only one that knows
 * the code. Counts only; nothing here says who.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/drop/[code]">) {
  const { code } = await ctx.params;
  const status = await dropStatus(code);
  return NextResponse.json(status ?? { error: "Not found" }, {
    status: status ? 200 : 404,
    headers: { "Cache-Control": "no-store" },
  });
}
