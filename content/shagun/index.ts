import type { CaseMeta } from "../cases";

/* The desk's copy for Chapter One. No story here: see CHAPTER1.md. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "shagun",
  href: "/c/shagun",
  title: "Shagun",
  cta: "Open the parcel",
  hint: "A parcel at your door. A wedding envelope. A note to someone called M.",
  description:
    "A stranger's phone arrives with a wedding envelope and a note meant for someone else. A Delhi wedding, a shot, and a night that was arranged before it reached you.",
  wallpaper: "/found/wallpaper.jpg",
  time: "11:40",
  episodes: 3,
  tone: "Mystery · Delhi · 60 min",
  note: "16+ · death, gun violence, a body burned (not shown) · this game never asks for anything real",
  ask: "Where does it end?",
};

/** What keeps landing on his lock screen while the desk waits. */
export const teaser = [
  { from: "Phone", text: "47 Missed Calls" },
  { from: "Mummy", text: "Beta, phone kyun nahi utha raha?" },
  { from: "Bhasin Uncle", text: "Missed call" },
] as const;
