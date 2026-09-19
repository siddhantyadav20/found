import type { MetadataRoute } from "next";
import { CASES, CASE_IDS } from "@/content/cases";
import { siteOrigin } from "@/lib/origin";

/** The desk, every case, and The First Minute. Drops are one person's envelope, and stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const SITE = siteOrigin();
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    ...CASE_IDS.map((id) => ({ url: `${SITE}${CASES[id].href}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${SITE}/first-minute`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
