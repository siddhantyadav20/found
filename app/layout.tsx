import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/origin";
import { canela, outfit } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "Found",
    /** Each episode supplies its own half. */
    template: "%s · Found",
  },
  description: "Mysteries played on the missing person's phone.",
  openGraph: { type: "website", siteName: "Found" },
};

/**
 * Found has one committed look — it's night, and a phone is lit in front of
 * you — so there is no theme to follow: the browser chrome is the room's colour.
 * `viewportFit: cover` lets the phone screen run into the notch and home
 * indicator; FoundPhone pads itself back with `env(safe-area-inset-*)`.
 */
export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${canela.variable} ${outfit.variable}`}
      // SaveScript marks a returning player's page before React sees it.
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
