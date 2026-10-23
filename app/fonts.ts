import { IBM_Plex_Mono, IBM_Plex_Sans, Inter, Inter_Tight, Kalam, Newsreader } from "next/font/google";

/**
 * Display face: Newsreader (Production Type, SIL Open Font Licence), in the
 * two weights the design uses (Medium 500 for the 44px/15px display text,
 * Bold 700 for 20/22/28px). It replaced the Canela trial files on
 * 2026-10-01: a trial licence can't ship on a public site, and Newsreader's
 * display cut keeps the same quiet, bookish voice.
 */
export const display = Newsreader({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * A hand, for what someone wrote on paper: the note on the envelope, and any
 * page photographed into a chat. Kalam (Indian Type Foundry, SIL OFL) was
 * drawn from Indian handwriting, Latin and Devanagari both. Not preloaded:
 * the desk never needs it, and the note comes a tap later.
 */
export const hand = Kalam({
  subsets: ["latin", "devanagari"],
  weight: ["400", "700"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

/**
 * UI face: IBM Plex Sans (SIL OFL), Regular / Medium / SemiBold. It replaced
 * Outfit on 2026-10-17: a geometric startup sans read as a template; Plex is
 * a working typeface, the kind a form or a case file is set in.
 */
export const ui = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

/**
 * Field labels, times and numbers outside the phones: IBM Plex Mono (SIL
 * OFL), the voice of a courier's waybill and a case file's form.
 */
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The found phone's face where San Francisco isn't installed (Android,
 * Windows): Inter, the closest free match. Apple devices draw the phone in
 * their own SF through `-apple-system` and never fetch this, so it isn't
 * preloaded (see `--font-ios` in globals.css).
 */
export const phone = Inter({
  subsets: ["latin"],
  variable: "--font-phone",
  display: "swap",
  preload: false,
});

/**
 * The site's own voice (2026-10-23): Inter Tight (SIL OFL) for the landing
 * page's headlines and controls, set tight, as product sites set theirs.
 * Newsreader stays for the one word in a headline that's the story's.
 */
export const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
