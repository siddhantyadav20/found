import type { Metadata } from "next";
import Desk from "@/components/found/Desk";
import { FEATURED } from "@/content/cases";
import { estimatedMinutes } from "@/lib/found/store";

export const metadata: Metadata = {
  title: { absolute: "Found" },
  description: "Mysteries played on the missing person's phone. Someone left one on your desk.",
  alternates: { canonical: "/" },
};

/** The luggage tag's "about N min" follows the real median, hourly. */
export const revalidate = 3600;

export default async function Home() {
  return <Desk minutes={await estimatedMinutes(FEATURED)} />;
}
