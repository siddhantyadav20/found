import { ImageResponse } from "next/og";

import { MinuteCard, OG_SIZE } from "@/components/found/shareCards";

/* Edge, for the reason given in app/d/[code]/opengraph-image.tsx: on Node,
   sharp's SVG reader fails inside the server process. */
export const runtime = "edge";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A phone on a video call with Mumbai Crime Branch, 31 hours in. Would you have cut the call?";

export default function Image() {
  return new ImageResponse(<MinuteCard />, size);
}
