import type { Metadata } from "next";
import Landing from "@/components/site/Landing";

export const metadata: Metadata = {
  title: { absolute: "Found · Thrillers you play on somebody else's phone" },
  description:
    "A stranger's phone arrives at your door. Read the chats, play the voice notes, dig through what was deleted, and work out what happened. Chapter 1, Raakh, is free in your browser.",
  alternates: { canonical: "/" },
};

/** The front door (2026-10-23), replacing the desk: what Found is, how it's played, and the chapters. */
export default function Home() {
  return <Landing />;
}
