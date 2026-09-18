import { ImageResponse } from "next/og";

import { CaseCard, OG_SIZE } from "@/components/found/shareCards";
import { CASES, FEATURED, isCaseId } from "@/content/cases";

/* Edge, for the reason given in app/d/[code]/opengraph-image.tsx: on Node,
   sharp's SVG reader fails inside the server process. */
export const runtime = "edge";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Found: a thriller played on somebody else's phone";

export default async function Image({ params }: { params: Promise<{ case: string }> }) {
  const { case: id } = await params;
  return new ImageResponse(<CaseCard meta={CASES[isCaseId(id) ? id : FEATURED]} />, size);
}
