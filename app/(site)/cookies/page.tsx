import type { Metadata } from "next";

import LegalPage from "@/components/cinema/LegalPage";
import { LEGAL } from "@/content/pages";

export const metadata: Metadata = { title: "Cookies" };

export default function Cookies() {
  return <LegalPage page={LEGAL.cookies} />;
}
