import type { Metadata } from "next";
import FoundPhone from "@/components/found/FoundPhone";
import { found } from "@/content/found";

export const metadata: Metadata = {
  title: found.title,
  description: found.description,
  alternates: { canonical: found.href },
  openGraph: {
    title: `${found.title} — Found`,
    description: found.description,
    url: found.href,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${found.title} — Found`,
    description: found.description,
  },
};

/**
 * Found: a mystery played on the missing person's phone.
 *
 * Moved here from the portfolio's /found, where it was piloted. Everything is
 * client-side; the server renders the room, and the envelope (or a saved case)
 * arrives once the browser has read storage.
 */
export default function FoundPage() {
  return <FoundPhone />;
}
