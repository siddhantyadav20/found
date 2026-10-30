import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "About", robots: { index: false } };

/** Set up and waiting for its design. */
export default function About() {
  return <PageShell eyebrow="Found" title="About" />;
}
