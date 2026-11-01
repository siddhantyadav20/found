/* ===========================================================================
   The words on the site's own pages (2026-11-01). The legal pages say what the
   code actually does; if the code changes, these change with it.
   =========================================================================== */

const raakh = (name: string) => `/found/raakh/${name}.jpg`;
const art = (name: string) => `/found/chapters/${name}.jpg`;

/** Every still there is, for the wall. It wants 36, so each goes up twice, well apart. */
const STILLS = [
  "raakh-baraat", "lastlocal-walker", "raakh-meera", "lastlocal-aai", "raakh-bhasin", "lastlocal-platform",
  "raakh-photo", "lastlocal-imran", "raakh-fire", "lastlocal-poster", "raakh-planner", "lastlocal-seat",
  "raakh-parcel", "lastlocal-collapse", "raakh-phone", "lastlocal-key", "raakh-poster", "raakh-key",
];

export const ABOUT = {
  hero: {
    arches: [art("raakh-poster"), art("lastlocal-poster")],
    lead: ["Found is a"],
    big: ["One-person", "Thriller", "Studio"],
    tail: ["Dedicated to stories", "you play on a phone"],
  },
  type: {
    titles: ["Written", "Designed", "Built", "Played"],
    small: [
      ["Every chapter", "is a phone", "left in your hands"],
      ["You read it,", "work it out", "and say it"],
      ["Then you prove it", "with what's", "on the screen"],
      ["One person writes,", "designs and", "builds them all"],
    ],
    medium: { first: ["Say", "it"], second: ["Then", "prove it"] },
    xl: "Found",
    side: ["In your", "browser", "for free"],
    block: ["Two chapters.", "One in transit.", "No download.", "No sign-up.", "No ads."],
  },
  grid: [...STILLS, ...STILLS.slice(7), ...STILLS.slice(0, 7)].map(art),
  who: {
    name: "Siddhant Yadav",
    eyebrow: "Everything",
    bio: "Writes, designs and builds every chapter of Found. There's nobody else behind the word studio.",
    coffeeEyebrow: "And you",
    coffeeTitle: "Buy me a coffee",
    coffeeBio: "Found is free and has no ads. If a chapter kept you up, a coffee keeps the next one coming.",
    coffeeStill: raakh("x-chai"),
  },
  steps: [
    { label: "Step 1", lines: ["Read", "the phone"] },
    { label: "Step 2", lines: ["Say it,", "then prove it"] },
  ],
  cta: { title: "Our chapters", still: art("raakh-key") },
} as const;

export const CONTACT = {
  eyebrow: "Get in touch",
  headline: ["Leave", "a note", "for us"],
  inquiries: "Inquiries",
  placeholder: "Your email or phone",
  thanks: "Got it. I'll write back.",
  coffee: "Coffee",
  coffeeCta: "Buy me one",
} as const;

export const NOT_FOUND = { note: "Case note:", line: "Page not found" } as const;

export type LegalPage = {
  readonly title: string;
  readonly updated: string;
  readonly sections: readonly { readonly heading: string; readonly body: readonly string[] }[];
};

const UPDATED = "1 November 2026";

export const LEGAL: Readonly<Record<"cookies" | "terms" | "privacy", LegalPage>> = {
  cookies: {
    title: "Cookies",
    updated: UPDATED,
    sections: [
      {
        heading: "Found sets no cookies",
        body: ["There are no cookies on this site, ours or anybody else's, and so no banner asking you to accept them."],
      },
      {
        heading: "What your browser keeps instead",
        body: [
          "A chapter needs to remember where you got to, so your browser's own local storage keeps it: your saves and finishes, whether the sound is on, your text size and pace, and the fact that you've already seen the opening screen in the last hour.",
          "None of that is sent anywhere unless you ask for a case number (see Privacy). Clearing your browser's site data removes all of it, and your progress with it.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    updated: UPDATED,
    sections: [
      {
        heading: "What Found is",
        body: ["Found is a free game played in a web browser. Using the site means you accept these terms."],
      },
      {
        heading: "It's fiction",
        body: [
          "Every person, company, message, photograph and event in a chapter is invented. Any resemblance to real people or events is a coincidence. The phone numbers and accounts in the story are made up, so don't try to reach them.",
        ],
      },
      {
        heading: "Who it's for",
        body: ["Found is for players aged 16 and over. Each chapter says what's in it on its own page."],
      },
      {
        heading: "What's ours",
        body: [
          "The stories, pictures, words and code are Found's. Play them, talk about them and pass a chapter on with its own share link. Please don't copy, resell or republish them.",
        ],
      },
      {
        heading: "No promises",
        body: [
          "Found is offered as it is. It may change, break or go away, and saves kept only in your browser can be lost. As far as the law allows, Found isn't liable for what happens as a result.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy",
    updated: UPDATED,
    sections: [
      {
        heading: "The short version",
        body: ["There are no accounts, no ads and no trackers. Found never asks for anything real inside a story, and nothing you do in a chapter is tied to your name."],
      },
      {
        heading: "On your device",
        body: ["Your progress and settings stay in your browser's local storage. See Cookies for what that covers."],
      },
      {
        heading: "Counting",
        body: [
          "When you play, the site counts how far a chapter gets played: which chapter, which step, how long it took. These counts carry no name, no account and no identifier.",
        ],
      },
      {
        heading: "Case numbers",
        body: [
          "If you ask for a case number, your saves are copied to our database against that number so you can open them on another phone. The number names nobody. It lapses after a year without use.",
        ],
      },
      {
        heading: "Passing a chapter on",
        body: [
          "When you pass a chapter on, the first name you type for the envelope is stored for 90 days, with counts of how far that link has got. Nothing records who sent it or who opened it.",
        ],
      },
      {
        heading: "If you leave your email or number",
        body: [
          "It's delivered by email, through Resend, to the one person who runs Found, and used to write back to you. Nothing is kept in a database on this site.",
        ],
      },
      {
        heading: "Who else is involved",
        body: [
          "Found runs on Vercel, whose servers keep the ordinary request logs any website produces. Case numbers, passed-on chapters and counts are held with Upstash. To stop one address from flooding those features, the site keeps a salted hash of your IP address, never the address itself.",
        ],
      },
      {
        heading: "Your choices",
        body: ["To have something removed, leave a note on the Contact page with your case number."],
      },
    ],
  },
};
