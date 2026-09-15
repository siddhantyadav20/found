import type { MetadataRoute } from "next";
import { found } from "@/content/found";
import { siteOrigin } from "@/lib/origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE = siteOrigin();
  return [{ url: `${SITE}${found.href}`, changeFrequency: "monthly", priority: 1 }];
}
