import type { Metadata } from "next";

import Strip from "@/components/cinema/Strip";

export const metadata: Metadata = {
  title: "Chapters",
  description: "Every chapter of Found: thrillers you play on a phone, in your browser, for free.",
};

export default function Chapters() {
  return <Strip />;
}
