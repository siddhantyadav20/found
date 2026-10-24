import type { Story } from "../types";

import { chain } from "./chain";
import { endings } from "./endings";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";
import * as instagram from "./instagram";
import { night } from "./night";
import { voices } from "./voices";
import { calls, mail, memos, notes, payments, photos, searches, settings, threads } from "./phone";

/* ===========================================================================
   Chapter One — "Raakh" (ash) · Delhi. Called "Shagun" until 2026-10-23.

   Sameer Khurrana's phone, a week after the Sehgal wedding, arriving with a
   note meant for someone called M. The story is SCRIPT.md (canon, never
   edited); the game adaptation is CHAPTER1.md; this is where it becomes data.

   The phone as he left it is phone.ts; each episode adds what arrives during
   the player's night, and the questions (ROADMAP S6–S8).
   =========================================================================== */

export const story: Story = {
  id: "raakh",
  title: "Raakh",
  owner: { name: "Sameer Khurrana", short: "Sameer", photo: "/found/raakh/dp-sameer.jpg" },
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
  /* (game) T1: the reel take's own minute, heard before anything is known.
     Unnamed on purpose: "Rolling, bhai?" is Kunal's line in the take, the
     boy asking about the light is Dilip, and the minute, 12:31, is forty
     minutes after Kunal's clip: the two firings, planted in the first
     fifteen seconds for whoever remembers them. No "pakki": it opens his
     locked chats. */
  coldOpen: {
    where: "Banyan Farms, Chhattarpur · Sunday, 12:31 AM",
    lines: [
      { line: "[dhol, a wedding at full volume, far off]" },
      { line: "[fairy lights humming in the mango trees]" },
      { who: "A boy", line: "Bhaiya, light yahan theek hai?", english: "Bhaiya, is the light all right here?" },
      { who: "A voice", line: "Rolling, bhai?" },
      { line: "[a shot, straight up]", flash: true },
      { line: "[laughter]" },
      { line: "[a second shot]", flash: true },
      { line: "[the laughter stops]" },
      { line: "[the dhol plays on]" },
    ],
    after: "Seven days later, a parcel comes back to your door.",
  },
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
    {
      key: "mummy",
      app: "whatsapp",
      from: "Mummy",
      text: "Beta, phone kyun nahi utha raha? Khana khaya?",
      english: "Why aren't you picking up? Have you eaten?",
      time: "10:52 PM",
    },
    { key: "bhasin", app: "phone", from: "Bhasin Uncle", text: "2 missed calls", time: "Fri" },
  ],
  /* Nitin's and Dilip's chats, locked and hidden on Thursday. The code is the
     word of his promise to Dilip ("Mumbai wali baat pakki na?"). Sameer gives
     it himself in Episode 2, to show he tried; Raju, trusted, says the word
     the boy asked every day; and on the phone alone, the memo he deleted
     says the code is what the boy asked him, which the reel take has, seconds
     before the shot. */
  chatLock: { code: "pakki", knownWhen: [["did:installed-voicememos", "saw:reel-take"], ["fired:sameer-code"], ["did:raju-trusts"]] },
  /* What a wedding planner keeps on the first page. */
  home: {
    pages: [
      [
        { app: "instagram", label: "Instagram" },
        { app: "messages", label: "Messages" },
        { app: "notes", label: "Notes" },
        { app: "mail", label: "Mail" },
        { app: "paytap", label: "Paytap" },
        // Offloaded on Thursday, straight after the memo went in the bin: the app gone, what it kept kept (CHAPTER1.md E).
        { app: "voicememos", label: "Voice Memos", offloaded: ["ep:2"] },
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
  threads: [...threads, ...episode1.threads, ...episode2.threads, ...episode3.threads, ...instagram.threads],
  photos,
  notes,
  memos,
  mail,
  payments,
  profiles: instagram.profiles,
  feed: instagram.feed,
  incoming: [...episode1.incoming, ...episode2.incoming, ...episode3.incoming],
  searches,
  calls,
  settings,
  evidence: [...episode1.evidence, ...episode2.evidence, ...episode3.evidence],
  questions: [...episode1.questions, ...episode2.questions, ...episode3.questions],
  events: [...episode1.events, ...episode2.events, ...episode3.events, ...instagram.events],
  moments: episode3.moments,
  chain,
  endings,
  /* What a newcomer is doing here, said plainly (2026-10-24). */
  brief: {
    title: "Tonight",
    lines: [
      "This phone was posted to a lawyer, Meera Arora. It came back to your door instead. She's at a wedding in Jaipur, her phone off till morning.",
      "A boy called Dilip went missing at a Delhi wedding a week ago. His brother keeps ringing this number.",
      "Find out what happened to Dilip. What you file here traces that night, link by link. There are twelve.",
      "Somebody else wants this phone back before morning.",
    ],
  },
  finale: {
    when: "4:40 AM · Sunday",
    line: "Everything is on the table now.",
    sub: "The record is still yours to put your name to: who did what that night, and what you can prove. Sameer's train leaves at 4:55 this afternoon.",
    after: {
      yes: "Dilip is in an ambulance to Saket, a constable in the front seat. What's left is the record: who did what that night, and what you can prove, under your name. Sameer's train leaves at 4:55 this afternoon.",
      no: "Nobody you called got to Room 6 before Bhasin heard, and at seven they move him. What's left is the record: who did what that night, and what you can prove, under your name. It's the only thing still pointing at him. Sameer's train leaves at 4:55 this afternoon.",
    },
  },
  fate: {
    yes: "did:saved",
    no: "did:lost",
    headline: { yes: "Dilip Kumar Mahto is alive.", no: "Dilip Kumar Mahto is still missing." },
    share: { yes: "I got there before seven.", no: "I didn't get there before seven." },
    others: "{yes}% of everyone who's played got there before seven.",
  },
  night,
  hold: {
    after: ["did:knows-alive"],
    until: ["did:rescue-told"],
    note: "Every question is filed. The record can wait. Dilip can't: they move him at seven.",
    widget: "They move him at seven. Two calls, before anyone notices.",
  },
  realtime: {
    offer: "Real time: the night's last decision runs on a real clock. Four minutes, no pause",
    after: ["did:knows-alive", "did:realtime"],
    seconds: 240,
    from: "02:58",
    to: "03:30",
    label: "Sister Anita's shift ends at 3:30. After that, the side door stays shut.",
    hint: "Two calls: one who can identify him, one Bhasin is afraid of.",
    act: "Make the calls",
    go: ["fired:seven-clock"],
    out: ["did:froze", "did:lost", "did:moment-first-call"],
  },
  /* Each episode ends on what it's left open (2026-10-23). */
  voices,
  recaps: {
    1: {
      who: "A new number, to his phone",
      cliff: "M? Tu hai?",
      english: "M? Is that you?",
      open: [
        "Who is writing to his phone, and how do they know it's on?",
        "What was in the photos the phone couldn't load from iCloud?",
        "Why does his list for M stop at “4. Nitin —”?",
      ],
    },
    2: {
      who: "Nitin, 1:53 AM",
      cliff: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon",
      english: "OK bro. If they've taken him, I'll call Vicky back.",
      open: [
        "Nitin is answering a message that isn't on this phone. Who told him Dilip had gone?",
        "What did Sameer lock away in “Agar kuch hua”?",
        "Why did he send this phone at all?",
      ],
    },
  },
  /* Closing the case (2026-10-23): the record, and what to do with it, from
     the case file. Meera's number is on the parcel's label, so she can be
     sent it from the first minute; posting is from his own Instagram, to the
     12.4k people who follow SK Weddings; and the parcel can always go back. */
  close: {
    intro: "What happened at the Sehgal wedding · Banyan Farms, Chhattarpur · 22 Nov",
    sendTo: "Meera Arora",
    sendNote: "The lawyer it was meant for. Her number is on the parcel's label.",
    postTo: "his Instagram",
    postNote: "From @sk.weddings, to the 12,400 people who follow it. Anyone can share it.",
    /* Return to Sender, where the sender on paper is you (O1): the
       legitimate channel for a parcel that isn't yours is the courier. */
    parcel: {
      note: "It came back to your address as the sender's. You didn't send it. The courier takes a parcel back as “not the sender”, and keeps it.",
      act: "Hand it to the courier: not the sender",
      ask: "Hand his phone back to the courier, as not yours? You won't see it again.",
    },
  },
  // The replay image (CHAPTER1.md J): the note whose last line stops at "4. Nitin —".
  replay: { note: "for-m", caption: "He started to tell you." },
  /* Canon §21: Meera, with a separate case and another handset, in Mumbai. The
     player's role is established now; this time the label is theirs. */
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
    "did:meera-called",
    "did:meera-preserved",
    "did:passed-as-m",
    "did:caught-as-m",
    "did:caught-khaali",
    "did:detective",
  ],
  /* Look again (CHAPTER1.md K1): what was on the phone from the first minute,
     and what it meant, for a player who's finished and wants to go back. */
  lookAgain: [
    { what: "The phone opens with no passcode.", where: "settings", meant: "He turned it off on Thursday night, so M could read it in his order." },
    { what: "One grey tick under every voice note.", where: "whatsapp", meant: "M had blocked him. That's why he sent the phone, and didn't just talk." },
    { what: "“Kunal firing kar raha tha. Ek ladka gir gaya.”", where: "whatsapp", meant: "Two sentences, two moments, forty minutes and a lawn apart." },
    { what: "His archived post: Kunal at 12:22, a revolver by his face.", where: "instagram", meant: "True, and it points away from Sameer, so he kept it where M could find it. The gun changed hands ten minutes later." },
    { what: "“12:15 — SK reel w/ Kunal… D — light (N sick)”.", where: "notes", meant: "His own reel, with Kunal in it, and Dilip on the light because Nitin had a fever." },
    { what: "The boy smiling over a tray, in Favorites.", where: "photos", meant: "A portrait he'd planned (“Dilip portrait!!”), of someone he'd promised Mumbai to." },
    { what: "The fire clip starts mid-movement.", where: "photos", meant: "He trimmed it to its last nine seconds. The rest, with his hands in it, he locked away." },
    { what: "“For M”, stopping at “4. Nitin —”.", where: "notes", meant: "The whole chapter: he started to tell M, and didn't." },
    { what: "Safari: “private ambulance chhattarpur 24 hours”.", where: "safari", meant: "1:56: four minutes after he'd told Nitin help had come." },
    { what: "Mummy: “Bhasin uncle phir aaye the.”", where: "whatsapp", meant: "The family's man, at his mother's door, all week." },
    { what: "The title cards: 12:32 AM and 1:52 AM.", where: "casefile", meant: "The shot, and the lie." },
  ],
};
