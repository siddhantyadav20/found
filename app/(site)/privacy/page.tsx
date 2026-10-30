import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

/** Set up and waiting for its design. */
export default function Privacy() {
  return <PageShell eyebrow="Legal" title="Privacy" />;
}
