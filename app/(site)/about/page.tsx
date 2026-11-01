import type { Metadata } from "next";

import AboutPage from "@/components/cinema/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Found is a one-person thriller studio, dedicated to stories you play on a phone.",
};

export default function About() {
  return <AboutPage />;
}
