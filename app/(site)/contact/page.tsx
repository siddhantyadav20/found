import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "Contact", robots: { index: false } };

/** Set up and waiting for its design. */
export default function Contact() {
  return <PageShell eyebrow="Let's talk" title="Contact" red />;
}
