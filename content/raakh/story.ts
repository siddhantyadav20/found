import type { Story } from "../types";

import { clues } from "./clues";
import { endings } from "./endings";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";
import { evidence } from "./evidence";
import * as instagram from "./instagram";
import { night, previously, teasers } from "./night";
import { questions } from "./questions";
import { final, reveal } from "./reveal";
import { voices } from "./voices";
import { calls, mail, memos, notes, payments, photos, searches, settings, threads } from "./phone";

/* ===========================================================================
   Chapter 1 — "Raakh" (ash) · Delhi. The build is RAAKH-V3.md, "Script and
   Player Journey v3: Return to Origin" (27 Oct 2026), which supersedes every
   earlier design where they differ.

   A parcel comes back to a door in Malviya Nagar: a wedding planner's phone,
   sent to his ex and refused. The player reads it the way she would have.
   By four in the morning they know who fired, who lied, and who is still
   alive. Then the phone tells them whose door this is.

   Two nights share one clock, a week apart: the Sehgal wedding, Saturday 21
   into Sunday 22 November 2026, and the player's own, Saturday 28 into
   Sunday 29. The clock moves only at authored beats (each episode's
   `beats`, and events with a `clock`).
   =========================================================================== */

const VIEWFINDER = "/found/raakh/viewfinder-2.jpg";

export const story: Story = {
  id: "raakh",
  title: "Raakh",
  owner: { name: "Sameer Khurrana", short: "Sameer", photo: "/found/raakh/dp-sameer.jpg" },
  episodes: ["Missed Calls", "The Second Shot", "Return to Origin"],
  clocks: [
    {
      base: "23:40",
      day: "Saturday",
      date: "28/11",
      after: { day: "Sunday", date: "29/11" },
      battery: 9,
      // 9% to 2% across Episode 1's beats, then dead (RAAKH-V3 §17).
      drain: [
        { after: "ask:q1", battery: 7 },
        { after: "ask:q2", battery: 5 },
        { after: "ask:q3", battery: 3 },
        { after: "fired:dying", battery: 2 },
      ],
    },
    { base: "00:32", day: "Sunday", date: "29/11", battery: 2, charging: true, rate: 0.78, card: "A week ago, to the minute: the second shot." },
    { base: "01:52", day: "Sunday", date: "29/11", battery: 64, charging: true, rate: 0.5, card: "A week ago, to the minute: the lie." },
  ],
  beats: [...episode1.beats, ...episode2.beats, ...episode3.beats],
  airplaneToggles: true,

  /* PG-COLD (RAAKH-V3 §7.1): audio on true black. On the first play, no
     words on screen where the voices are recorded; the captions stay
     unnamed either way, so nobody is told who fired. */
  coldOpen: {
    where: "Banyan Farms, Chhattarpur · Sunday, 12:31 AM",
    lines: [
      { line: "[dhol and a crowd, far off]" },
      { who: "A boy", line: "Bhaiya, light yahan theek hai?", english: "Is the light okay here?" },
      { who: "A man", line: "Haan, wahin. Rolling, bhai?", english: "Yes, there. Rolling?" },
      { who: "Another man", line: "Rolling." },
      { who: "The boy", line: "Bhaiya… Mumbai pakki na?", english: "Mumbai's settled, right?" },
      { who: "The man", line: "Pakki. Ab hilna mat.", english: "Settled. Now don't move." },
      { line: "[a shot]", flash: true },
      { line: "[laughter]" },
      { who: "The man", line: "Ek aur, pose mein—", english: "One more, posing—" },
      { line: "[a shot]", flash: true },
      { line: "[the laughter stops]" },
      { line: "[the dhol plays on]" },
    ],
    after: "Seven days later, a parcel comes back to your door.",
  },
  warning: "A shooting at a wedding, a cover-up, a missing worker. Violence is heard, never shown.",
  arrival: {
    note: ["M —", "Sab isme hai.", "Local thane mat le jaana.", "Bhasin ke log wahan baithe hain."],
    sign: "— S",
    english: "M — It's all in here. Don't take it to the local police station. Bhasin's people sit there.",
    caption: "The phone: face down, cracked at one corner.",
    envelope: {
      front: "Ishita weds Rohan",
      small: "Sehgal Parivar · 21.11",
      caption: "A wedding envelope. There's writing on the back, in a man's quick hand.",
    },
  },
  gate: {
    level: "2%",
    lines: ["The phone is dead.", "Whoever is still ringing it is ringing nothing."],
    ask: "Plug it in.",
  },
  lockScreen: [
    { key: "calls", app: "phone", from: "Phone", text: "47 Missed Calls", time: "11:38 PM" },
    { key: "mummy", app: "whatsapp", from: "Mummy", text: "Beta, phone kyun nahi utha raha? Khana khaya?", english: "Why aren't you picking up? Have you eaten?", time: "10:52 PM" },
    { key: "bhasin", app: "phone", from: "Bhasin Uncle", text: "2 missed calls", time: "9:40 PM" },
  ],
  /* Dilip's and Nitin's chats, locked and hidden on Thursday with the word of
     his promise. Found three ways: the reel audio, the code memo with the
     7:10 PM "pakki", or Raju (§8.6). Accepted from Episode 2. */
  chatLock: { code: "pakki", requires: ["ep:2"], knownWhen: [["saw:reel-take"], ["saw:memo-code"], ["did:raju-code"]] },
  safariWaits: { until: ["fired:data-renewed"], site: "faq.whatsapp.com", note: "Jio · Daily data used up. Internet speed is 64 Kbps until midnight." },
  home: {
    pages: [
      [
        { app: "instagram", label: "Instagram" },
        { app: "messages", label: "Messages" },
        { app: "notes", label: "Notes" },
        { app: "mail", label: "Mail" },
        { app: "paytap", label: "Paytap" },
        // Offloaded on Thursday night: the app gone, what it kept kept, until the data's back.
        { app: "voicememos", label: "Voice Memos", offloaded: ["fired:data-renewed"] },
        { app: "safari", label: "Safari" },
        { app: "camera", label: "Camera" },
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
  threads: [...threads, ...episode1.threads, ...episode2.threads, ...episode3.threads, ...instagram.threads],
  photos,
  notes,
  memos,
  mail,
  payments,
  profiles: instagram.profiles,
  feed: instagram.feed,
  incoming: [...episode1.incoming, ...episode2.incoming],
  searches,
  calls,
  settings,
  evidence,
  questions,
  events: [...episode1.events, ...episode2.events, ...episode3.events, ...instagram.events],
  dark: [...episode2.dark, ...episode3.dark],
  reveal,
  final,
  clues,
  chain: [],
  endings,
  nowLabel: "Tonight",
  /* The night strip (RAAKH-V3 §17): that night beside tonight, a week to the
     minute apart, each minute pinned once it's known. */
  timeline: {
    thatNight: "That night · 21–22 Nov",
    tonight: "Tonight · 28–29 Nov",
    from: "23:30",
    to: "05:00",
    marks: [
      { at: "23:52", label: "Kunal fires", when: [["saw:kunal-clip"]] },
      { at: "00:32", label: "The shot: Sameer, the second", when: [["claim:q4:truth"], ["claim:q4:hunch"]], says: [["claim:q4:version"]], saysLabel: "The shot: Kunal" },
      { at: "01:14", label: "Awake", when: [["ask:q5"]] },
      { at: "01:49", label: "Sameer in the room", when: [["saw:sameer-room"]], minor: true },
      { at: "01:52", label: "The lie", when: [["claim:q6:truth"]], says: [["claim:q6:version"]], saysLabel: "The car turned away" },
      { at: "02:04", label: "The car leaves", when: [["ask:q5"]], minor: true },
      { at: "02:55", label: "Bhasin's car", when: [["saw:car-255"]] },
      { at: "04:47", label: "The fire: an empty mattress", when: [["claim:q7:truth"]], says: [["claim:q7:version"]], saysLabel: "The fire: a body" },
    ],
    now: [
      { at: "23:40", label: "The parcel", when: [[]] },
      { at: "00:32", label: "Episode 2", when: [["ep:2"]] },
      { at: "01:52", label: "Episode 3", when: [["ep:3"]] },
      { at: "03:58", label: "Gate 2", when: [["did:reveal-start"]] },
    ],
  },
  caseNote: { title: "Case file", created: "23:44", header: "On this iPhone · Today 11:44 PM", when: ["did:past-lock"] },
  brief: {
    title: "Case file",
    lines: [
      "This phone was posted to M — Meera Arora, Kalkaji. She refused it.",
      "A boy called Dilip went missing at a Delhi wedding a week ago. Find out what happened to him.",
      "Somebody else wants this phone back before morning.",
    ],
  },
  recaps: {
    1: {
      who: "Bhasin Uncle",
      cliff: "Ghar pe hi hai. Achha hai.",
      english: "It's at home. Good.",
      filed: ["q1", "q2", "q3"],
      open: ["Who fired the shot that hit Dilip?"],
      last: "Sameer has told M what happened. He hasn't proved it.",
    },
    2: {
      who: "Sameer, to Nitin · 1:52 AM",
      cliff: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.",
      english: "They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.",
      filed: ["q4", "q5"],
      open: ["Why did the car leave empty?"],
      last: "The phone was edited. Somebody kept what he deleted.",
    },
  },
  death: {
    after: ["did:needs-charge"],
    alert: "Low Battery · 2% of battery remaining",
    cliff: { who: "Bhasin Uncle", text: "Ghar pe hi hai. Achha hai.", english: "It's at home. Good.", unless: ["did:went-dark"] },
  },
  previously,
  teasers,
  vows: [
    { id: "P1", to: "Nitin", text: "“Tera naam kahin nahi aayega. Pakki.”", made: "did:promise-p1", broken: [["did:end-room6", "claim:q6:truth"]] },
    { id: "P2", to: "Raju", text: "“Main usse dhoondh lunga. Pakki.”", made: "did:promise-p2", broken: [["did:end-train"], ["did:end-origin"]] },
    { id: "P3", to: "Meera", text: "“Kuch delete nahi karunga.”", made: "did:promise-p3", broken: [["did:deleted-perm"]] },
  ],
  impulse: {
    labels: { auditor: "The one checking", confessor: "The one who wanted it found" },
    version: 1,
    truth: 1,
    soft: 1,
    perm: 2,
    recover: 1,
    send: 1,
  },
  sendTo: { name: "M", after: ["did:meera-contact"], label: "Send to M", thread: "m" },
  camera: { unavailable: "Camera is unavailable in Low Power Mode on this device.", after: ["did:reveal-start"], src: VIEWFINDER },
  yourPhone: { wallpaper: "/found/lastlocal/sea.jpg" },
  unopened: { before: ["did:reveal-start"], ask: "Put it away? You can open it again.", card: "You put it away. It's still ringing.", again: "Open it again" },
  /* Real time, opt-in (RAAKH-V3 §9.11): only Bhasin's half hour at the gate,
     five real minutes, pausable. Run out, his car leaves, and the Trade
     with it. Nothing else is lost. */
  realtime: {
    offer: "Real time: the last half hour of the night runs on a real clock. Nothing is lost if it runs out.",
    after: ["fired:bhasin-terms", "did:realtime"],
    seconds: 300,
    from: "04:06",
    to: "04:36",
    label: "Bhasin waits",
    hint: "Answer the last question in the case file before his half hour is up, if you want his trade.",
    act: "Open the case file",
    go: [],
    out: ["did:bhasin-left"],
    event: "bhasin-terms",
    stop: ["ask:qf", "did:chose"],
  },
  endCopy: {
    impulses: "Which Sameer read the phone",
    held: "Your story held on {n} of {of}.",
    promises: "Promises made: {made}. Kept: {kept}.",
    clues: "Clues you walked past: {n} of {of}",
    share: "Raakh · Ending: {ending} · Promises kept: {kept} of {made}.",
  },
  voices,
  night,
  replay: { note: "for-m", caption: "He started to tell M." },
  next: {
    title: "Chapter 2 · Last Local",
    from: "Meera",
    lines: [
      { text: "Ek aur phone mila hai. Mumbai mein. Ek local train ki seat pe.", english: "Another phone has turned up. In Mumbai. On a local train's seat." },
      { text: "Is baar tum train mein ho.", english: "This time, you're on the train." },
    ],
    note: "Chapter 2 is ready. A girl steps off at Dadar, and her phone stays on the seat beside you.",
    href: "/c/lastlocal",
    cta: "Play Chapter 2",
  },
  /* Checked at the source on 2026-09-24: the Arms Act, 1959, s.25(9) as
     inserted by Act 48 of 2019; Parmanand Katara v. Union of India, AIR 1989
     SC 2039; Tele-MANAS, the Ministry of Health's line. */
  outside: [
    { text: "Celebratory gunfire is a crime in India: up to two years in prison, a fine of up to ₹1 lakh, or both.", source: "Arms Act, 1959, s.25(9), added in 2019" },
    { text: "Every doctor, at a government hospital or a private one, must treat an injured person to save their life. Police formalities can't come first.", source: "Supreme Court, Parmanand Katara v. Union of India, 1989" },
    { text: "Emergency, anywhere in India: 112.", tel: "112" },
    { text: "If any of this is close to home, Tele-MANAS is free, open all day, in English and 20 other languages: 14416.", tel: "14416" },
  ],
  // Counted by name in the funnel: the chapter's own choices.
  choices: [
    "did:answered-raju",
    "did:declined-raju",
    "did:raju-first-denial",
    "did:raju-first-finding",
    "did:raju-first-whos",
    "did:mummy-stranger",
    "did:mummy-fine",
    "did:mummy-none",
    "did:early-reveal",
    "did:promise-p1",
    "did:promise-p2",
    "did:promise-p3",
    "did:raju-told-shot",
    "did:raju-told-kunal",
    "did:nitin-stranger",
    "did:nitin-care",
    "did:nitin-blame",
    "did:kunal-denial",
    "did:kunal-frame",
    "did:nitin-exposed",
    "did:anita-care",
    "did:camera-open",
    "did:camera-photo",
    "did:facedown",
    "did:sent-m",
    "did:deleted-perm",
    "did:airplane",
    "did:detective",
    "did:realtime",
  ],
};
