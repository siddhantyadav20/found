import type { CaseMeta } from "../cases";

/* The desk's copy for Chapter One. No story here: see CHAPTER1.md. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "shagun",
  href: "/c/shagun",
  title: "Shagun",
  cta: "Open the parcel",
  hint: "A parcel for a lawyer came back to your door. Inside: a stranger's phone, and a note.",
  description:
    "A stranger's phone arrives with a wedding envelope and a note meant for someone else. A Delhi wedding, a shot, and a night that was arranged before it reached you.",
  wallpaper: "/found/shagun-wallpaper.jpg",
  time: "11:40",
  episodes: 3,
  tone: "Mystery · Delhi · 60 min",
  note: "16+ · death, gun violence, a body burned (not shown) · this game never asks for anything real",
  ask: "Where does it end?",
  // CHAPTER1.md J's preset message, less its question.
  hook: "A photographer's phone. A wedding.",
  envelope: { front: "Ishita weds Rohan", small: "Sehgal Parivar · 22.11" },
  /* O1, decided 2026-09-24: returned to origin. He sent it to Meera at the
     courts; she was away; it came back to the sender's address he'd made up,
     which is yours. No chamber number: a real one could be a real lawyer's. */
  label: {
    to: "Meera Arora",
    address: "Advocate · Lawyers' Chambers, Saket Courts, New Delhi",
    // Couriers print the receiver's mobile: it's how the player can reach her.
    phone: "+91 98••• •1206",
    // The sender he wrote: a name you don't know, over your own address (#56).
    from: "S. Khurana · your address",
    stamp: ["RETURN TO ORIGIN", "Addressee not available"],
  },
  links: 11,
};

/** What keeps landing on his lock screen while the desk waits. */
export const teaser = [
  { from: "Phone", text: "47 Missed Calls" },
  { from: "Mummy", text: "Beta, phone kyun nahi utha raha?" },
  { from: "Bhasin Uncle", text: "Missed call" },
] as const;
