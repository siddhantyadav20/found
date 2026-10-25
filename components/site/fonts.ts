import { Anton, Geist_Mono, Instrument_Serif } from "next/font/google";

/* ===========================================================================
   The site's faces (2026-10-25), beside Geist (`--font-sans`, app/fonts.ts).
   Loaded only by the site's own pages, so the game never fetches them.

   - Anton: the poster's voice. A chapter's name, a clock at full height:
     set condensed, in capitals, as a film sets its title.
   - Instrument Serif, italic: the one word in a line that is the story's.
   - Geist Mono: times, labels, anything a phone or a form would print.
   =========================================================================== */

export const cond = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cond",
  display: "swap",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const gmono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-gmono",
  display: "swap",
});

/** On the outermost element of a site page. */
export const siteFonts = `${cond.variable} ${serif.variable} ${gmono.variable}`;
