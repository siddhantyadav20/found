/**
 * Chapter One, as the rest of the app refers to it: the route, its name, and
 * the lines the page's metadata, the desk and the share card use.
 *
 * Like Low Battery's, it deliberately doesn't import the story. The script is
 * heavy and nothing outside `components/found` should carry it.
 *
 * "The Blue Room" is a working title (CHAPTER1.md, Part 11).
 */
export const blueRoom = {
  id: "blue-room",
  href: "/c/blue-room",
  title: "The Blue Room",
  cta: "Play The Blue Room",
  hint: "At 4:17 AM, a stranger's phone came under your door.",
  description:
    "At 4:17 AM, a phone comes under your door. 5% battery, no passcode, and its owner is calling it. A mystery in one sitting, played on the phone itself.",
  /** Placeholder until Raghav's own lock screen exists. */
  wallpaper: "/found/wallpaper.jpg",
  episodes: 3,
  tone: "Grounded thriller",
  note: "16+ · Violence, a missing person, threats.",
} as const;

/**
 * What lands on the phone in its first minute. The desk's phone cycles
 * through them. None of them explains itself.
 */
export const blueRoomTeaser: readonly { readonly from: string; readonly text: string }[] = [
  { from: "Unknown Number", text: "If you found this phone, don't call him." },
  { from: "RAGHAV", text: "1 missed call" },
  { from: "Maa ❤️", text: "Raghav? 4 baj gaye beta." },
  { from: "Rohan", text: "bhai reply kar" },
];
