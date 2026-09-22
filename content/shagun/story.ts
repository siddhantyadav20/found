import type { Story } from "../types";

import { endings } from "./endings";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";

/* ===========================================================================
   Chapter One — "Shagun" · Delhi.

   Sameer Khurana's phone, a week after the Sehgal wedding, arriving with a
   note meant for someone called M. The story is SCRIPT.md (canon, never
   edited); the game adaptation is CHAPTER1.md; this is where it becomes data.

   A stub since ROADMAP S1: the arrival, the clocks and the home screen are
   real, and the episodes are empty until S6–S8 write them.
   =========================================================================== */

export const story: Story = {
  id: "shagun",
  title: "Shagun",
  owner: { name: "Sameer Khurana", short: "Sameer" },
  episodes: ["Missed Calls", "The Second Shot", "The Cancelled Rescue"],
  /* A week to the night after the wedding. The title cards carry the minute
     of the shot (12:32) and the minute of the lie (1:52), and never say so. */
  clocks: [
    { base: "23:40", day: "Saturday", battery: 9 },
    { base: "00:32", day: "Sunday", battery: 2, charging: true },
    { base: "01:52", day: "Sunday", battery: 64, charging: true },
  ],
  arrival: {
    note: ["M —", "Sab isme hai.", "Local thane mat le jaana.", "Bhasin ke log wahan baithe hain."],
    sign: "— S",
    english: "M — It's all in here. Don't take it to the local police station. Bhasin's people sit there.",
    caption: "A phone with a cracked corner, face-down on a wedding envelope.",
  },
  gate: {
    level: "2%",
    lines: [
      "His phone is about to die.",
      "The voice notes, the photographs and whoever is still ringing it go dark with it.",
    ],
    ask: "Find a charger. Plug in to keep it alive.",
  },
  lockScreen: [
    { key: "calls", app: "phone", from: "Phone", text: "47 Missed Calls", time: "11:38 PM" },
    { key: "mummy", app: "whatsapp", from: "Mummy", text: "Beta, phone kyun nahi utha raha? Khana khaya?", time: "10:52 PM" },
    { key: "bhasin", app: "phone", from: "Bhasin Uncle", text: "2 missed calls", time: "Fri" },
  ],
  /* What a wedding photographer keeps on the first page. Mail, Voice Memos
     and the payments app arrive with ROADMAP S4. */
  hersHome: {
    pages: [
      [
        { app: "instagram", label: "Instagram" },
        { app: "messages", label: "Messages" },
        { app: "notes", label: "Notes" },
        { app: "safari", label: "Safari" },
        { app: "settings", label: "Settings" },
      ],
    ],
    dock: [
      { app: "whatsapp", label: "WhatsApp" },
      { app: "photos", label: "Photos" },
      { app: "phone", label: "Phone" },
      { app: "casefile", label: "Case file" },
    ],
  },
  threads: [],
  photos: [],
  notes: [],
  incoming: [],
  searches: [],
  calls: [],
  settings: [],
  evidence: [...episode1.evidence, ...episode2.evidence, ...episode3.evidence],
  questions: [...episode1.questions, ...episode2.questions, ...episode3.questions],
  events: [...episode1.events, ...episode2.events, ...episode3.events],
  exposures: [...episode1.exposures, ...episode2.exposures, ...episode3.exposures],
  endings,
};
