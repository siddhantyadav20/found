import { ImageResponse } from "next/og";

import { EnvelopeCard, OG_SIZE } from "@/components/found/shareCards";
import { CASES, FEATURED } from "@/content/cases";
import { readDrop } from "@/lib/found/dropRead";
import { tracedLine } from "@/lib/found/result";

/* Edge, not Node. On Node, `next/og` rasterises through sharp when it can
   load it, and sharp's SVG reader fails inside the server process ("Input
   buffer contains unsupported image format"), though the same sharp works in
   plain Node. On Edge it uses the renderer bundled with `next/og`. */
export const runtime = "edge";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A parcel addressed to you, with a phone inside it, and a wedding envelope";

/**
 * The preview a friend sees in the chat: their own name on the parcel.
 *
 * Latin script only, for now. The card's built-in font has no Devanagari or
 * other Indian scripts, and a label of empty boxes is worse than "TO YOU";
 * the page itself shows the name in any script. Loading a Noto face for
 * those scripts is the fix when it matters.
 */
export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const drop = await readDrop(code);
  const to = drop?.to ?? "";
  const drawable = to && /^[\p{Script=Latin} ]+$/u.test(to);
  // The sender's result, if they finished: the spoiler-free brag.
  const meta = CASES[drop?.case ?? FEATURED];
  const said = drop?.traced === undefined ? undefined : tracedLine(drop.traced, meta.links);
  return new ImageResponse(<EnvelopeCard label={[drawable ? `TO ${to}` : "TO YOU", "BY HAND"]} said={said} ask={meta.ask} envelope={meta.envelope} />, size);
}
