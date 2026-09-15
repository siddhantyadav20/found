import { ImageResponse } from "next/og";

import { CaseCard, OG_SIZE } from "@/components/found/shareCards";
import { CASES, FEATURED } from "@/content/cases";

/**
 * The desk's share card: the featured case. Drawn (components/found/shareCards)
 * so the copy can't drift from the page. Check it in a build: `next dev` has
 * served these as 500s before.
 */

const meta = CASES[FEATURED];

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${meta.title}: ${meta.hint}`;

export default function OpengraphImage() {
  return new ImageResponse(<CaseCard meta={meta} />, size);
}
