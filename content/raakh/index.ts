import type { CaseMeta } from "../cases";

/* The site's copy for Chapter 1, Raakh (called Shagun until 2026-10-23). No story here: see CHAPTER1.md. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "raakh",
  href: "/c/raakh",
  title: "Raakh",
  cta: "Open the parcel",
  chapter: 1,
  city: "Delhi",
  logline: "A wedding planner's phone comes back to your door with a note meant for his ex. Somewhere on it is the night a waiter went missing.",
  hint: "A parcel for a lawyer came back to your door. Inside: a stranger's phone, and a note.",
  description:
    "A wedding planner's phone arrives with a shagun envelope and a note meant for someone else. A Delhi wedding, a shot, a missing waiter, and a phone arranged before it reached you.",
  wallpaper: "/found/raakh-wallpaper.jpg",
  time: "11:40",
  episodes: 3,
  tone: "Mystery · Delhi · 45–60 min",
  note: "16+ · death, gun violence, a body burned (not shown) · this game never asks for anything real",
  ask: "Where does it end?",
  // CHAPTER1.md J's preset message, less its question.
  hook: "A wedding planner's phone. A missing waiter.",
  envelope: { front: "Ishita weds Rohan", small: "Sehgal Parivar · 22.11" },
  /* O1, decided 2026-09-24: returned to origin. He sent it to Meera at home in
     Kalkaji; she was at a wedding in Jaipur; it came back to the sender's
     address he'd made up, which is yours. No house number: a real one could
     be a real person's. */
  label: {
    to: "Meera Arora",
    address: "Kalkaji, New Delhi 110019",
    // Couriers print the receiver's mobile: it's how the player can reach her.
    phone: "+91 98••• •1206",
    // The sender he wrote: a name you don't know, over your own address (#56).
    from: "S. Khurrana · your address",
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
