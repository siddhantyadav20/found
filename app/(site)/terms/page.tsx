import type { Metadata } from "next";

import LegalPage from "@/components/cinema/LegalPage";
import { LEGAL } from "@/content/pages";

export const metadata: Metadata = { title: "Terms" };

export default function Terms() {
  return <LegalPage page={LEGAL.terms} />;
}
