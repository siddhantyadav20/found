import { Geist, IBM_Plex_Mono, IBM_Plex_Sans, Inter, Kalam, Newsreader } from "next/font/google";
import localFont from "next/font/local";

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
 * The site's own voice: Geist (Vercel, SIL OFL), one variable file for every
 * weight. It replaced Inter Tight on 2026-10-25, with the site's revamp:
 * the wordmark, the headlines and the controls round the game, set tight.
 * The site's other faces (Anton, Instrument Serif, Geist Mono) load only on
 * its own pages: components/site/fonts.ts.
 */
export const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * The site's display face since the 2026-10-31 revamp: Neue Brücke, supplied
 * by Siddhant. Not preloaded: the preloader is on screen until it has arrived.
 */
export const brucke = localFont({
  src: "./fonts/NeueBrucke-Regular.woff2",
  variable: "--font-brucke",
  display: "swap",
  preload: false,
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});
