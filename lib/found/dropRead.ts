import "server-only";

import { isCaseId, type CaseId } from "@/content/cases";
import { redis, redisReady } from "@/lib/upstash";

/* ===========================================================================
   Reading a drop, and nothing else. See lib/found/dropStore.ts for the rest.

   Split out so the drop's share image can run on the Edge runtime, which has
   no `node:crypto` (dropStore mints codes with it). On Node, a generated
   image goes through sharp, and sharp's SVG reader fails inside the server
   process; on Edge it goes through the renderer bundled with `next/og`.
   =========================================================================== */

const CODE = /^[A-Za-z0-9]{8}$/;

export const isDropCode = (x: unknown): x is string => typeof x === "string" && CODE.test(x);

export const dropKey = (code: string) => `found:drop:${code}`;

export type Drop = { case: CaseId; to: string; created: number };

export async function readDrop(code: unknown): Promise<Drop | null> {
  if (!isDropCode(code) || !redisReady()) return null;
  try {
    const [raw] = await redis(["GET", dropKey(code)]);
    if (typeof raw !== "string") return null;
    const d = JSON.parse(raw) as Partial<Drop>;
    return isCaseId(d.case) && typeof d.to === "string" && typeof d.created === "number"
      ? { case: d.case, to: d.to, created: d.created }
      : null;
  } catch {
    return null;
  }
}
