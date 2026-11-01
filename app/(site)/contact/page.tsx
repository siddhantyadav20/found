import type { Metadata } from "next";

import ContactPage from "@/components/cinema/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Leave a note for Found, or buy the person who makes it a coffee.",
};

export default function Contact() {
  return <ContactPage />;
}
