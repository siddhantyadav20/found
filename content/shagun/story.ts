import type { Story } from "../types";

import { chain } from "./chain";
import { endings } from "./endings";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";
import { calls, mail, notes, payments, photos, profiles, searches, settings, threads } from "./phone";

/* ===========================================================================
   Chapter One — "Shagun" · Delhi.

   Sameer Khurana's phone, a week after the Sehgal wedding, arriving with a
   note meant for someone called M. The story is SCRIPT.md (canon, never
   edited); the game adaptation is CHAPTER1.md; this is where it becomes data.

   The phone as he left it is phone.ts; each episode adds what arrives during
   the player's night, and the questions (ROADMAP S6–S8).
   =========================================================================== */

export const story: Story = {
  id: "shagun",
  title: "Shagun",
  owner: { name: "Sameer Khurana", short: "Sameer" },
  episodes: ["Missed Calls", "The Second Shot", "The Cancelled Rescue"],
  /* A week to the night after the wedding. The title cards carry the minute
     of the shot (12:32) and the minute of the lie (1:52), and never say so. */
  clocks: [
    // Off the charger, it falls with what the player finds, and dies after Sameer writes.
    {
      base: "23:40",
      day: "Saturday",
      battery: 9,
      drain: [
        { after: "did:named-dilip", battery: 7 },
        { after: "did:heard-him", battery: 5 },
        { after: "did:prepared", battery: 3 },
        { after: "fired:dying", battery: 2 },
      ],
    },
    { base: "00:32", day: "Sunday", battery: 2, charging: true },
    { base: "01:52", day: "Sunday", battery: 64, charging: true },
  ],
  arrival: {
    note: ["M —", "Sab isme hai.", "Local thane mat le jaana.", "Bhasin ke log wahan baithe hain."],
    sign: "— S",
    english: "M — It's all in here. Don't take it to the local police station. Bhasin's people sit there.",
    caption: "His phone, face-down, cracked at one corner.",
    /* The note is on the back of the Sehgal wedding's shagun envelope: the
       title, made physical, and a clue from the first second (CHAPTER1.md
       O2, proposed). */
    envelope: {
      front: "Ishita weds Rohan",
      small: "Sehgal Parivar · 22.11",
      caption: "Somebody else's wedding envelope. There's writing on the back.",
    },
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
  /* What a wedding photographer keeps on the first page. */
  home: {
    pages: [
      [
        { app: "instagram", label: "Instagram" },
        { app: "messages", label: "Messages" },
        { app: "notes", label: "Notes" },
        { app: "mail", label: "Mail" },
        { app: "paytap", label: "Paytap" },
        { app: "voicememos", label: "Voice Memos" },
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
  threads: [...threads, ...episode1.threads],
  photos,
  notes,
  memos: [],
  mail,
  payments,
  profiles,
  incoming: [...episode1.incoming],
  searches,
  calls,
  settings,
  evidence: [...episode1.evidence, ...episode2.evidence, ...episode3.evidence],
  questions: [...episode1.questions, ...episode2.questions, ...episode3.questions],
  events: [...episode1.events, ...episode2.events, ...episode3.events],
  chain,
  endings,
  // Counted by name in the funnel: the chapter's own choices (CHAPTER1.md H).
  choices: [
    "did:answered-raju",
    "did:declined-raju",
    "did:raju-told-truth",
    "did:raju-lied",
    "did:mummy-stranger",
    "did:mummy-as-sameer",
  ],
};
