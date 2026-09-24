import type { Story } from "../types";

import { chain } from "./chain";
import { endings } from "./endings";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";
import * as yours from "./yours";
import { calls, mail, memos, notes, payments, photos, profiles, searches, settings, threads } from "./phone";

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
      date: "29/11",
      battery: 9,
      drain: [
        { after: "did:named-dilip", battery: 7 },
        { after: "did:heard-him", battery: 5 },
        { after: "did:prepared", battery: 3 },
        { after: "fired:dying", battery: 2 },
      ],
    },
    { base: "00:32", day: "Sunday", date: "30/11", battery: 2, charging: true },
    { base: "01:52", day: "Sunday", date: "30/11", battery: 64, charging: true },
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
  threads: [...threads, ...episode1.threads, ...episode2.threads, ...episode3.threads, ...yours.threads],
  photos,
  notes,
  memos,
  mail,
  payments,
  profiles,
  incoming: [...episode1.incoming],
  searches,
  calls,
  settings,
  evidence: [...episode1.evidence, ...episode2.evidence, ...episode3.evidence],
  questions: [...episode1.questions, ...episode2.questions, ...episode3.questions],
  events: [...episode1.events, ...episode2.events, ...episode3.events, ...yours.events],
  chain,
  endings,
  /* Your phone (CHAPTER1.md I): a fictional social app for the draft, and
     Meera, once her contact info on his phone has been found. */
  yours: {
    social: "Pulse",
    intro: "What happened at the Sehgal wedding · Banyan Farms, Chhattarpur · 22 Nov",
    sendTo: "Meera",
    sendRequires: ["saw:meera"],
  },
  // The replay image (CHAPTER1.md J): the note whose last line stops at "4. Nitin —".
  replay: { note: "for-m", caption: "He started to tell you." },
  /* Checked at the source on 2026-09-24: the Arms Act, 1959, s.25(9) as
     inserted by Act 48 of 2019 (indiankanoon.org/doc/26451110); Parmanand
     Katara v. Union of India, AIR 1989 SC 2039 (indiankanoon.org/doc/498126);
     Tele-MANAS, the Ministry of Health's line (telemanas.mohfw.gov.in). */
  outside: [
    {
      text: "Celebratory gunfire is a crime in India: up to two years in prison, a fine of up to ₹1 lakh, or both.",
      source: "Arms Act, 1959, s.25(9), added in 2019",
    },
    {
      text: "Every doctor, at a government hospital or a private one, must treat an injured person to save their life. Police formalities can't come first.",
      source: "Supreme Court, Parmanand Katara v. Union of India, 1989",
    },
    { text: "Emergency, anywhere in India: 112.", tel: "112" },
    { text: "If any of this is close to home, Tele-MANAS is free, open all day, in English and 20 other languages: 14416.", tel: "14416" },
  ],
  // Counted by name in the funnel: the chapter's own choices (CHAPTER1.md H).
  choices: [
    "did:answered-raju",
    "did:declined-raju",
    "did:raju-told-truth",
    "did:raju-lied",
    "did:mummy-stranger",
    "did:mummy-as-sameer",
    "did:sameer-not-m",
    "did:sameer-as-m",
    "did:sameer-where",
    "did:told-sameer-shot",
    "did:gave-sameer-kunal",
    "did:asked-sameer-after",
    "did:raju-trusts",
    "did:raju-told-shot",
    "did:raju-told-kunal",
    "did:protect-nitin",
    "did:nitin-pressed",
    "did:confronted-kunal",
    "did:exposed-nitin",
    "did:gave-rescuer",
    "did:confronted-sameer",
    "did:airplane",
    "did:wrote-meera",
    "did:meera-preserved",
  ],
};
