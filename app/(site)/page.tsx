import type { Metadata } from "next";

import Roll from "@/components/cinema/Roll";

export const metadata: Metadata = {
  title: { absolute: "Found · Thrillers you play on somebody else's phone" },
  description:
    "A wedding planner's phone comes back to your door. Read his chats, play his voice notes, open what he deleted, and work out what happened. Chapter 1, Raakh, is free in your browser.",
  alternates: { canonical: "/" },
};

/** The front door since 2026-10-31: the chapters on a reel, the way siena.film shows its films. */
export default function Home() {
  return <Roll />;
}
