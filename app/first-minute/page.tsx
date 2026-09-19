import type { Metadata } from "next";

import FirstMinute from "@/components/minute/FirstMinute";
import { siteOrigin } from "@/lib/origin";

const TITLE = "Would you have cut the call?";
const DESCRIPTION = "60 seconds. A stranger's phone, a man in a police uniform, and one question. Then what to do if it happens for real.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} — Found` },
  description: DESCRIPTION,
  alternates: { canonical: "/first-minute" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/first-minute", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The First Minute (ROADMAP P10): the chapter's opening in sixty seconds, for
 * forwarding into family groups. No desk, no save, nothing before it starts.
 */
export default function FirstMinutePage() {
  return <FirstMinute shareUrl={`${siteOrigin()}/first-minute`} />;
}
