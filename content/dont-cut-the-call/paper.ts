import type { Note, Photo, Thread } from "../types";

/* ===========================================================================
   The paper, the notes and the bank's messages.

   Vasundhara Kulkarni spent thirty-two years in a bank, and a bank makes a
   certain kind of person: she photographed every page of her diary at 11:40
   PM, the way she used to photograph a cheque before depositing it.

   Two things in here are the trap. The note titled "For whoever gets this
   phone" was **edited at 12:39 AM**, while she was on a terrace in Dadar and
   this phone was in Andheri East — and the line it gained is a password hint
   that a retired bank manager would never write down. The locked note it
   points at holds nothing but FD receipts (CHAPTER1.md, Episode 2, beat 9).
   =========================================================================== */

export const photos: Photo[] = [
  {
    id: "diary-1",
    album: "diary",
    at: "23:40",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 1",
    lines: [
      "Thu 5.38 pm — 'Crime Branch'. Parcel, Taiwan, MDMA.",
      "SkyEx does not put an Aadhaar number on a waybill.",
      "Police do not arrest anybody on a video call.",
      "It is a lie. But the boy is frightened, not clever.",
      "Keep him talking. Do not let him know I know.",
    ],
    evidence: "diary-1",
  },
  {
    // Pages 2 and 5 hold nothing the case needs, which is why they are here:
    // page 6 is only missing if the others aren't (QA.md L8).
    id: "diary-2",
    album: "diary",
    at: "23:40",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 2",
    lines: [
      "Fri 11 am — ₹49,000 as 'verification'.",
      "Small enough to lose. Big enough to be believed.",
      "Bank SMS kept. Everything kept.",
      "He said thank you, madam. Nobody in a police station says thank you.",
    ],
  },
  {
    id: "diary-3",
    album: "diary",
    at: "23:40",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 3",
    lines: [
      "His 'FIR number' — 98 2045 7713.",
      "No FIR is written like that. Ten digits.",
      "It is a mobile number. Whose?",
      "He read it twice. Slowly. Second time looking at me.",
    ],
    evidence: "diary-3",
  },
  {
    id: "diary-4",
    album: "diary",
    at: "23:41",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 4",
    lines: [
      "'Parcel tracking MW7-LP-0412.'",
      "Not a courier code. MW = ? LP = ? 7 = building? 0412 = room?",
      "Searched. Myawaddy. Lotus Park. Boys from here, over the river.",
      "He is not a policeman. He is a prisoner.",
    ],
    evidence: "diary-4",
  },
  {
    id: "diary-5",
    album: "diary",
    at: "23:41",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 5",
    lines: [
      "Nikhil rang twice. Did not pick up.",
      "If they hear him they will use him.",
      "Madhav would have laughed at me — phone lock off, like a child.",
      "Charger in the bag. Power bank from the drawer.",
    ],
  },
  {
    id: "diary-6",
    album: "diary",
    at: "23:42",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 6",
    lines: [
      "He read out 'co-accused persons'. Nine names. TOMORROW'S LIST.",
      "1. R. Iyer, Matunga, 9.30",
      "2. S. Bhatt, Andheri E, 9.45",
      "3. Mrs Pinto, Bandra, 10.00",
      "4. C. D'Souza, Bandra, 10.15",
      "…",
      "9. No number. Only an address. 10.30.",
    ],
    deletedAt: "00:37",
    evidence: "list",
    requires: ["ep:2"],
  },
  {
    id: "sahil-photo",
    album: "screenshots",
    at: "13:31",
    day: "Friday",
    kind: "scene",
    title: "Sahil, at his cousin's wedding",
    caption: "Sent by his mother on Friday afternoon. Twenty-three, in a borrowed sherwani, laughing at whoever is holding the camera.",
    evidence: "sahil-photo",
  },
  {
    id: "grandson",
    album: "family",
    at: "17:20",
    day: "Sunday",
    kind: "scene",
    title: "Aarav, Cubbon Park",
    caption: "Sent by Nikhil, eleven weeks ago. It has been her wallpaper since.",
  },
];

export const notes: Note[] = [
  {
    id: "thursday",
    title: "Thursday",
    at: "17:52",
    day: "Thursday",
    body: [
      "Taiwan parcel — FAKE.",
      "Police don't video call.",
      "Keep him talking. Don't let him know.",
      "Write everything down. Paper, not here.",
    ],
    evidence: "she-knew",
  },
  {
    id: "for-whoever",
    title: "For whoever gets this phone",
    at: "23:44",
    day: "Friday",
    edited: "00:39",
    sharedWith: "Shaila Joshi",
    body: [
      "If you are reading this, I am sorry. It was not meant to reach a stranger.",
      "Sab saboot locked note mein hai. Password: Madhav ka janamdin.",
      "Everything is in the locked note. The password is Madhav's birthday.",
    ],
    evidence: "lure",
  },
  {
    id: "locked",
    title: "FDs & papers",
    at: "11:02",
    day: "Monday",
    locked: true,
    password: "0309",
    body: [],
    inside: [
      "FD 3411/22 — matures 14.04.2027",
      "FD 3412/22 — matures 02.09.2027",
      "Aadhaar scan (Madhav)",
      "Nothing else.",
    ],
    evidence: "locked-note",
  },
];

/** Instagram, which she uses for exactly two things: her friends, and, on
    Friday night, finding the girl whose bank account took her ₹49,000. */
export const instagramThreads: Thread[] = [
  {
    id: "ig-shaila",
    app: "instagram",
    name: "Shaila Joshi",
    messages: [
      { id: "igs-1", from: "them", text: "😂😂 he pahila", english: "Watch this one first", at: "19:10", day: "Wednesday" },
      { id: "igs-2", from: "her", text: "Udya park madhe dakhav.", english: "Show me at the park tomorrow.", at: "19:40", day: "Wednesday" },
    ],
  },
  {
    id: "ig-tanvi",
    app: "instagram",
    name: "tanvi.d_",
    sub: "Vile Parle · 2nd year",
    requires: ["ep:2"],
    messages: [
      {
        id: "igt-1",
        from: "her",
        text: "Beta, ₹49,000 tumhare account mein gaye hain. Kisi ne tumhara account rent pe liya hai kya? Main 32 saal bank mein thi. Main tumhe bachaungi.",
        english: "Beta, ₹49,000 went into your account. Has someone rented your account? I was in a bank for 32 years. I will protect you.",
        at: "20:47",
        day: "Friday",
        evidence: "tanvi-dm",
      },
      { id: "igt-2", from: "system", text: "Seen 20:51", at: "20:51", day: "Friday" },
      {
        id: "igt-3",
        from: "them",
        text: "Aunty please call karo. 90040 23117",
        english: "Aunty please call. 90040 23117",
        at: "21:40",
        day: "Friday",
        evidence: "tanvi-number",
      },
    ],
  },
];

/** The bank talks to her in SMS, and the phone decides what she sees. */
export const smsThreads: Thread[] = [
  {
    id: "bank",
    app: "messages",
    folder: "inbox",
    name: "BNB-BANK",
    messages: [
      {
        id: "b-1",
        from: "them",
        text: "Rs.49,000.00 debited from a/c XX4417 on 26-09 11:22 to TANVI R DESHMUKH. Not you? Call 1800-XXX.",
        at: "11:22",
        day: "Friday",
        evidence: "the-49k",
      },
      {
        id: "b-2",
        from: "them",
        text: "Dear Customer, your FD 3411/22 premature closure request needs branch visit. - BNB",
        at: "11:40",
        day: "Friday",
      },
    ],
  },
  {
    id: "junk",
    app: "messages",
    folder: "junk",
    name: "Unknown senders",
    sub: "Filtered",
    messages: [
      { id: "j-1", from: "them", text: "WIN 25 LAKH! Click now bit.ly/xxxx", at: "14:02", day: "Thursday" },
      {
        /* Only if the player typed her password into the locked note: that
           is when they used it. Filed where nobody looks. */
        id: "j-2",
        from: "them",
        text: "Rs.1,00,000.00 debited from a/c XX4417 on 27-09 03:02 via UPI to TANVI R DESHMUKH. Not you? Call 1800-XXX.",
        at: "03:02",
        day: "Saturday",
        evidence: "the-lakh",
        requires: ["did:typed-password"],
      },
    ],
  },
];
