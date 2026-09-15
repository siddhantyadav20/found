import type { Metadata } from "next";

import Restore from "@/components/found/Restore";

export const metadata: Metadata = {
  title: "Your cases",
  // One person's saves: not for search, and not for the next site's referrer log.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/**
 * A case number's link: brings its cases onto this device. All of it happens
 * in the browser, which is where saves live; the server only draws the room.
 */
export default async function RestorePage({ params }: PageProps<"/r/[number]">) {
  const { number } = await params;
  return <Restore raw={number} />;
}
