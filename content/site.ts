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

/** A line of the credits: what they are, and what they're called. */
export type Credit = readonly [role: string, name: string];

/** Everything further down a chapter's page. Nothing here gives away the ending. */
export type Page = {
  readonly lead: { readonly role: string; readonly name: string; readonly still: string };
  readonly pair: readonly [Credit, Credit];
  readonly trio: readonly [Credit, Credit, Credit];
  readonly crewTitle: string;
  readonly crew: readonly Credit[];
  /** Squares for the gallery, and the two rows of the chapters page's footage mode. */
  readonly frames: readonly string[];
  /** The festival wall, here a phone's home screen: what's waiting on it, and where. */
  readonly apps: readonly (readonly [chip: string, app: string])[];
  readonly appsStill: string;
  readonly warning: string;
};

/** The top of a chapter's page (2026-11-05): one line set big, the clock the
 *  story runs against, and two quiet lines over the way down. Spoiler-free. */
export type Hero = {
  readonly headline: readonly string[];
  readonly clock: { readonly time: string; readonly caption: string };
  readonly tagline: readonly [string, string];
};

/** A chapter's trailer, served from public/. */
export type Trailer = { readonly src: string; readonly poster: string; readonly length: string };

const art = (name: string) => `/found/chapters/${name}.jpg`;

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
  readonly logline: string;
  readonly note: string;
  readonly hero: Hero;
  readonly trailer?: Trailer;
  readonly more: Page;
};

const YEAR = "2026";

function reel(
  meta: CaseMeta,
  own: Pick<Reel, "still" | "tall" | "badge" | "reviews" | "hero" | "more"> & Partial<Pick<Reel, "trailer">> & { id: CaseId },
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
    logline: meta.logline,
    note: meta.note,
    callouts: [
      ["City", city],
      ["Year", YEAR],
      ["Category", category],
    ],
    ticket: [eyebrow, YEAR, length.replace(" min", "")],
  };
}

/* The pictures are film stills made for the site (2026-11-01), the way
   siena.film's are: one person, one light, a moment out of the story. They show
   nothing the warnings don't already say, and nobody in them is real. */
export const REELS: readonly Reel[] = [
  reel(CASES.raakh, {
    id: "raakh",
    still: art("raakh-key"),
    tall: art("raakh-poster"),
    badge: { year: YEAR, headline: "Out 5 Nov", seal: "Live" },
    // Lines from the trailer's own cards, which were written twist-safe.
    hero: {
      headline: ["Everyone", "has a", "version."],
      clock: { time: "7:00", caption: "They want it back by seven" },
      tagline: ["A wedding in Delhi.", "Every phone was recording."],
    },
    // v4 (2026-11-04), cropped to its scope frame and cut down to 720p for the web.
    trailer: { src: "/found/trailer/raakh.mp4", poster: "/found/trailer/raakh-poster.jpg", length: "1:12" },
    reviews: [
      { stars: 4.5, quote: "A work of art", source: "Reddit" },
      { stars: 4.5, quote: "Fresh in the world of slop", source: "Instagram" },
      { stars: 4.5, quote: "My man out here competing with Nolan", source: "In-game feedback" },
    ],
    more: {
      lead: { role: "Written by", name: "Siddhant Yadav", still: art("raakh-planner") },
      pair: [
        ["Where", "Banyan Farms"],
        ["When", "21 November"],
      ],
      trio: [
        ["His ex", "Meera Arora"],
        ["His friend", "Kunal Sehgal"],
        ["The bride's father", "Bhasin Uncle"],
      ],
      crewTitle: "Also on his phone",
      crew: [
        ["His mother", "Mummy"],
        ["The bride", "Ishita"],
        ["Worked the lights", "Dilip"],
        ["Not saved", "+91 62••• •4417"],
      ],
      frames: ["raakh-planner", "raakh-baraat", "raakh-meera", "raakh-fire", "raakh-photo", "raakh-bhasin", "raakh-parcel", "raakh-phone", "raakh-key"].map(art),
      apps: [
        ["4 voice notes", "WhatsApp"],
        ["47 missed calls", "Phone"],
        ["1,284 photos", "Photos"],
        ["Archived posts", "Instagram"],
        ["A locked note", "Notes"],
        ["Say it, then prove it", "Case file"],
      ],
      appsStill: art("raakh-phone"),
      warning: "A shooting at a wedding, a missing young man and a fire. None of it is shown; all of it is talked about.",
    },
  }),
  reel(CASES.lastlocal, {
    id: "lastlocal",
    still: art("lastlocal-key"),
    tall: art("lastlocal-poster"),
    badge: { year: YEAR, headline: "Three episodes", seal: "Play" },
    hero: {
      headline: ["Her phone", "stayed", "behind."],
      clock: { time: "1:12", caption: "The last train out" },
      tagline: ["She stepped off at Dadar.", "Her phone stayed on the seat."],
    },
    // No reviews yet, and none invented: its lock screen speaks for it.
    reviews: [
      { quote: "23 Missed Calls", source: "Aai" },
      { quote: "Mere ghar walon ko kuch mat batana", source: "+91 77••• •3018" },
      { quote: "Shinde Kaka is viewing this iPhone's location", source: "Find My" },
    ],
    more: {
      lead: { role: "Written by", name: "Siddhant Yadav", still: art("lastlocal-platform") },
      pair: [
        ["Where", "The Western Line"],
        ["When", "1:12 AM"],
      ],
      trio: [
        ["Her phone", "Ananya Pawar"],
        ["Her brother", "Rohit"],
        ["A family friend", "Shinde Kaka"],
      ],
      crewTitle: "Also on her phone",
      crew: [
        ["Her mother", "Aai"],
        ["Her father", "Papa"],
        ["Everyone warns her off", "Imran Shaikh"],
        ["Not saved", "+91 77••• •3018"],
      ],
      frames: ["lastlocal-platform", "lastlocal-walker", "lastlocal-aai", "lastlocal-collapse", "lastlocal-imran", "lastlocal-seat", "lastlocal-key"].map(art),
      apps: [
        ["23 missed calls", "Phone"],
        ["Voice notes", "WhatsApp"],
        ["A live location", "Find My"],
        ["What she saved", "Files"],
        ["What she kept", "Photos"],
      ],
      appsStill: art("lastlocal-seat"),
      warning: "A building collapse, threats and a family's violence, none of it graphic.",
    },
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

export const SITEMAP = [{ href: "/", label: "Home" }, ...NAV_LINKS] as const;

/** The three words stacked at the foot of every page. */
export const FOOTER_WORDS = ["Thriller", "Mystery", "Phone game"] as const;
