import type { Metadata } from "next";

import LegalPage from "@/components/cinema/LegalPage";
import { LEGAL } from "@/content/pages";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return <LegalPage page={LEGAL.privacy} />;
}
