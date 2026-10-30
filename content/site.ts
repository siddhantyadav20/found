import { CASES, type CaseId, type CaseMeta } from "./cases";

/* ===========================================================================
   The site's own words (2026-10-31): each chapter as the reel shows it. What
   a chapter already says about itself comes from its meta, so there's one
   source for "45–60 min". Everything else on a slide lives here.
   =========================================================================== */

export type Review = {
  /** Five stars, or none where the line isn't a review. */
  readonly stars?: number;
  readonly quote: string;
  readonly source: string;
};

export type Reel = {
  readonly id: CaseId;
  readonly title: string;
  readonly eyebrow: string;
  /** The site's page for it, and the game itself. */
  readonly page: string;
  readonly play: string;
  readonly cta: string;
  /** Wide on a desk, tall on a phone. */
  readonly still: string;
  readonly tall: string;
  readonly badge: { readonly year: string; readonly headline: string; readonly seal: string };
  readonly callouts: readonly (readonly [label: string, value: string])[];
  readonly ticket: readonly [left: string, centre: string, minutes: string];
  readonly reviews: readonly Review[];
};

const YEAR = "2026";

function reel(
  meta: CaseMeta,
  own: Pick<Reel, "still" | "tall" | "badge" | "reviews"> & { id: CaseId },
): Reel {
  const [category, city, length] = meta.tone.split(" · ");
  const eyebrow = `Chapter ${meta.chapter}`;
  return {
    ...own,
    title: meta.title,
    eyebrow,
    page: meta.page ?? `/chapters/${own.id}`,
    play: meta.href,
    cta: meta.cta,
    callouts: [
      ["City", city],
      ["Year", YEAR],
      ["Category", category],
    ],
    ticket: [eyebrow, YEAR, length.replace(" min", "")],
  };
}

export const REELS: readonly Reel[] = [
  reel(CASES.raakh, {
    id: "raakh",
    still: "/found/site/raakh-wide.jpg",
    tall: "/found/raakh/key-lawn.jpg",
    badge: { year: YEAR, headline: "Out 5 Nov", seal: "Live" },
    reviews: [
      { stars: 4.5, quote: "A work of art", source: "Reddit" },
      { stars: 4.5, quote: "Fresh in the world of slop", source: "Instagram" },
      { stars: 4.5, quote: "My man out here competing with Nolan", source: "In-game feedback" },
    ],
  }),
  reel(CASES.lastlocal, {
    id: "lastlocal",
    still: "/found/site/lastlocal-wide.jpg",
    tall: "/found/lastlocal/dadar.jpg",
    badge: { year: YEAR, headline: "Three episodes", seal: "Play" },
    // No reviews yet, and none invented: its lock screen speaks for it.
    reviews: [
      { quote: "23 Missed Calls", source: "Aai" },
      { quote: "Mere ghar walon ko kuch mat batana", source: "+91 77••• •3018" },
      { quote: "Shinde Kaka is viewing this iPhone's location", source: "Find My" },
    ],
  }),
];

export const NAV_LINKS = [
  { href: "/chapters", label: "Chapters" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const LEGAL_LINKS = [
  { href: "/cookies", label: "Cookie" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;
