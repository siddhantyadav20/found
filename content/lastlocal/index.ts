import type { CaseMeta } from "../cases";

/* The site's copy for Chapter 2, Last Local. The story is story.ts; the design is LAST-LOCAL.md. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "lastlocal",
  href: "/c/lastlocal",
  title: "Last Local",
  cta: "Pick it up",
  chapter: 2,
  city: "Mumbai",
  logline: "The last train out of Dadar. A girl steps off, and leaves her phone buzzing on the seat beside you. Everyone looking for her is looking for it.",
  hint: "1:12 AM, the last Virar fast. A girl steps off at Dadar. Her phone stays on the seat beside you, buzzing.",
  description:
    "A phone left on the last train out of Dadar. Everyone looking for the girl who owns it is looking for the phone, and it's in your hand. Mumbai, one night, three stations to decide.",
  wallpaper: "/found/lastlocal/wallpaper.jpg",
  time: "1:12",
  episodes: 3,
  tone: "Thriller · Mumbai · 40–50 min",
  note: "16+ · a building collapse, threats, a family's violence (nothing graphic) · this game never asks for anything real",
  ask: "Did you get off at Vasai?",
  hook: "A phone left on the last train.",
  object: "phone",
  links: 7,
};

/** What keeps landing on her lock screen while the desk waits. */
export const teaser = [
  { from: "Aai", text: "23 Missed Calls" },
  { from: "+91 77••• •3018", text: "Mere ghar walon ko kuch mat batana." },
  { from: "Find My", text: "Shinde Kaka is viewing this iPhone's location." },
] as const;
