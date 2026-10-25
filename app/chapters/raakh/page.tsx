import type { Metadata } from "next";

import RaakhPage from "@/components/site/RaakhPage";
import { CASES } from "@/content/cases";

const raakh = CASES.raakh;

export const metadata: Metadata = {
  title: { absolute: "Raakh · Chapter 1 · Found" },
  description: raakh.description,
  alternates: { canonical: raakh.page },
};

/** Chapter 1's own page (2026-10-25): the night, the people, and the way in. The game itself is at /c/raakh. */
export default function Raakh() {
  return <RaakhPage />;
}
