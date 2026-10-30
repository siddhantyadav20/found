import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "Cookies", robots: { index: false } };

/** Set up and waiting for its design. */
export default function Cookies() {
  return <PageShell eyebrow="Legal" title="Cookies" />;
}
