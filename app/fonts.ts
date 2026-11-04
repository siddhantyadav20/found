import { Geist, Geist_Mono, Inter, Kalam, Newsreader } from "next/font/google";
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
 * Labels, times and numbers outside the phones: Geist Mono (Vercel, SIL OFL),
 * Geist's own mono, so a label and the sentence beside it are one family. It
 * replaced IBM Plex Mono on 2026-11-05, when the product went to one type
 * system (see the note above `sans`).
 */
export const mono = Geist_Mono({
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
 * THE TYPE SYSTEM (2026-11-05). One set of faces for the site and the game's
 * own screens alike:
 *
 *   - Neue Brücke (`--font-brucke`): titles and every button, in capitals.
 *   - Newsreader (`--font-display`): the editorial serif, and the small caps
 *     on anything that labels (`.eyebrow`).
 *   - Geist (`--font-sans`): everything you read, and the page's default.
 *   - Geist Mono (`--font-mono`): times, codes and field labels.
 *
 * Two more belong to the story, not the product: the found phone is drawn in
 * the phone's own face (SF, or Inter where there's no SF: `--font-ios`), and
 * whatever someone wrote by hand is Kalam. IBM Plex Sans and Plex Mono (the
 * game's old UI faces) and the old site's Anton and Instrument Serif are gone.
 *
 * Geist (Vercel, SIL OFL) is one variable file for every weight.
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
