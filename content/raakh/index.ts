import type { CaseMeta } from "../cases";

/* The site's copy for Chapter 1, Raakh. No story here: see RAAKH-V3.md. Every
   line is true of the chapter's twist (RAAKH-V3 §15): the phone "comes back"
   to a door; nothing calls it a stranger's, or the door anyone's. */

export const meta: Omit<CaseMeta, "teaser"> = {
  id: "raakh",
  href: "/c/raakh",
  page: "/chapters/raakh",
  title: "Raakh",
  cta: "Open the parcel",
  chapter: 1,
  city: "Delhi",
  logline: "A wedding planner's phone comes back to your door with a note meant for his ex. Somewhere on it is the night a catering boy went missing.",
  hint: "A parcel for a lawyer came back to your door. Inside: a wedding planner's phone, and a note.",
  description:
    "A wedding planner's phone comes back to your door. Read his chats, play his voice notes, open what he deleted, and work out what happened.",
  wallpaper: "/found/raakh-wallpaper.jpg",
  time: "11:40",
  episodes: 3,
  tone: "Mystery · Delhi · 45–60 min",
  note: "16+ · gun violence, a missing person, a fire · this game never asks for anything real",
  ask: "Who did you tell, by seven?",
  hook: "A wedding planner's phone. A missing catering boy.",
  envelope: { front: "Ishita weds Rohan", small: "Sehgal Parivar · 21.11" },
  /* The waybill (RAAKH-V3 §7.2): sent same-city to M, refused at her door,
     returned to origin. Never a label saying whose address it is: whose door stays a
     fact the player can deduce, not one they're told. */
  label: {
    to: "Meera Arora",
    address: "Kalkaji, New Delhi 110019",
    from: "S. Khurrana, B-14 Navjeevan Apartments, Malviya Nagar, New Delhi 110017",
    stamp: ["RETURN TO ORIGIN", "Refused by addressee · 28/11 11:10"],
    courier: "DakRoute Express · Same-city · AWB DR-4471-0926 · Attempt 1",
    contains: "1 mobile phone, used",
    // Same day, same city (fix brief H-01): out in the morning, back by night, to the address it left from.
    track: ["28/11 09:10 Picked up · Malviya Nagar", "28/11 11:10 Refused by addressee · Kalkaji", "28/11 22:50 Delivered to origin · Malviya Nagar"],
  },
  door: { from: "Gate 2 · Ram Kishan ji", text: "B-14 ka parcel aaya hai, upar bhej diya.", english: "B-14's parcel has come. I've sent it up.", at: "10:50 PM" },
  links: 0,
};

/** What keeps landing on his lock screen while the desk waits. */
export const teaser = [
  { from: "Phone", text: "47 Missed Calls" },
  { from: "Mummy", text: "Beta, phone kyun nahi utha raha?" },
  { from: "Bhasin Uncle", text: "2 missed calls" },
] as const;
