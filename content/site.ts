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
  readonly more: Page;
};

const YEAR = "2026";

function reel(
  meta: CaseMeta,
  own: Pick<Reel, "still" | "tall" | "badge" | "reviews" | "more"> & { id: CaseId },
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
    more: {
      lead: { role: "Written by", name: "Siddhant Yadav", still: "/found/raakh/w-4.jpg" },
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
      frames: [
        "w-0", "w-baraat", "w-3", "w-pheras", "w-1", "w-couple", "w-11", "ig-haldi", "w-4", "w-family", "w-8", "ig-drone",
        "w-5", "w-blur", "w-9", "w-15", "w-12", "w-portrait-2",
      ].map((name) => `/found/raakh/${name}.jpg`),
      apps: [
        ["4 voice notes", "WhatsApp"],
        ["47 missed calls", "Phone"],
        ["1,284 photos", "Photos"],
        ["Archived posts", "Instagram"],
        ["A locked note", "Notes"],
        ["Say it, then prove it", "Case file"],
      ],
      appsStill: "/found/site/raakh-wide.jpg",
      warning: "A shooting at a wedding, a missing young man and a fire. None of it is shown; all of it is talked about.",
    },
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
    more: {
      lead: { role: "Written by", name: "Siddhant Yadav", still: "/found/lastlocal/dadar.jpg" },
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
      frames: ["dadar", "sea", "site", "door", "wallpaper"].map((name) => `/found/lastlocal/${name}.jpg`),
      apps: [
        ["23 missed calls", "Phone"],
        ["Voice notes", "WhatsApp"],
        ["A live location", "Find My"],
        ["What she saved", "Files"],
        ["What she kept", "Photos"],
      ],
      appsStill: "/found/site/lastlocal-wide.jpg",
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
