import type { Metadata } from "next";
import Desk from "@/components/found/Desk";

export const metadata: Metadata = {
  title: { absolute: "Found" },
  description: "Mysteries played on the missing person's phone. Someone left one on your desk.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <Desk />;
}
