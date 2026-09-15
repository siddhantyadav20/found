/**
 * Found, as the rest of the app refers to it: the route, its name, and the
 * lines the page's metadata and the share card use.
 *
 * Deliberately doesn't import the story: the script is well over 20KB that
 * nothing outside `components/found` should carry. `tests/found.test.ts`
 * checks the title here matches the story's.
 *
 * Piloted at sidbuilds.in/found. Standalone, it is one case among several:
 * `content/cases.ts` lists it, and `/` is the desk it lies on.
 */
export const found = {
  id: "low-battery",
  href: "/c/low-battery",
  title: "Low Battery",
  cta: "Play Low Battery",
  hint: "Someone is missing. You have their phone.",
  description:
    "Someone is missing, and their phone has arrived in your post. A mystery in one sitting, played on the phone itself.",
  /** The missing person's lock screen: the game's, and the canvas phone's. */
  wallpaper: "/found/wallpaper.jpg",
} as const;

/**
 * What keeps landing on the phone's lock screen. The first four are the
 * story's own lock-screen notifications (episode1.ts reads them from here),
 * and the very first is the first line of the game: an order that is really
 * an invitation. The canvas phone cycles through all of them, one per buzz.
 * None of them names the missing person, so none needs a cast.
 */
export const teaser: readonly { readonly from: string; readonly text: string }[] = [
  { from: "+91 •• ••5520", text: "Don't unlock it." },
  { from: "Mum", text: "14 missed calls" },
  { from: "Tara", text: "i'm scared. please" },
  { from: "Dev", text: "your mum called me. where are you" },
  { from: "Mum", text: "Beta please. Just one message." },
  { from: "Tara", text: "text me when you're home" },
  { from: "Mum", text: "I keep calling so I can hear your voicemail." },
];
