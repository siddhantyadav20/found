import type { Metadata } from "next";

import PageShell from "@/components/cinema/PageShell";

export const metadata: Metadata = { title: "Chapters", robots: { index: false } };

/** To come: the chapters as siena.film's work page shows its films. */
export default function Chapters() {
  return <PageShell eyebrow="All chapters" title="Chapters" />;
}
