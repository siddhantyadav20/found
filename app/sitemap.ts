import type { MetadataRoute } from "next";
import { CASES, CASE_IDS } from "@/content/cases";
import { siteOrigin } from "@/lib/origin";

/** The desk and every case. Drops are one person's parcel, and stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const SITE = siteOrigin();
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    ...CASE_IDS.map((id) => ({ url: `${SITE}${CASES[id].href}`, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
