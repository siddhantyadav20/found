import type { Metadata } from "next";
import Desk from "@/components/found/Desk";
import { FEATURED } from "@/content/cases";
import { estimatedMinutes } from "@/lib/found/store";

export const metadata: Metadata = {
  title: { absolute: "Found" },
  description: "Thrillers played on somebody else's phone. One was left at your door.",
  alternates: { canonical: "/" },
};

/** The luggage tag's "about N min" follows the real median, hourly. */
export const revalidate = 3600;

export default async function Home() {
  return <Desk minutes={await estimatedMinutes(FEATURED)} />;
}
