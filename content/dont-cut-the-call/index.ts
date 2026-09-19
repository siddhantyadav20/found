import type { CaseMeta } from "../cases";

/* The desk's copy for Chapter One. No story here: see CHAPTER1.md. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "dont-cut-the-call",
  href: "/c/dont-cut-the-call",
  title: "Don't Cut the Call",
  cta: "Open the pouch",
  hint: "1:11 AM. A courier pouch. A phone that is already on a call.",
  description:
    "A stranger's phone arrives at your door at 1:11 AM, 31 hours into a video call with a man in a police uniform. The woman who owns it is dead. Mumbai, one night, three ways to answer.",
  wallpaper: "/found/wallpaper.jpg",
  episodes: 3,
  tone: "Thriller · Mumbai · 30–45 min",
  note: "16+ · death, fraud, human trafficking · this game never asks for anything real",
};

/** What keeps landing on her lock screen while the desk waits. */
export const teaser = [
  { from: "Mumbai Crime Branch", text: "Madam, camera on kijiye." },
  { from: "Shanti Kunj CHS", text: "Ambulance aayi hai. Kya hua?" },
  { from: "Nikhil ❤️", text: "Missed call" },
] as const;
