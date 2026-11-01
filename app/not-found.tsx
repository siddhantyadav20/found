import type { Metadata } from "next";

import LazyNotFound from "@/components/cinema/LazyNotFound";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return <LazyNotFound />;
}
