import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

/** Set up and waiting for its design. */
export default function Terms() {
  return <PageShell eyebrow="Legal" title="Terms" />;
}
