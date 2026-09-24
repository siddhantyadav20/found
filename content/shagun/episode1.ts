import type { Evidence, IncomingCall, LiveEvent, Message, Question, Thread } from "../types";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 1 — "Missed Calls". Saturday 29 November, 11:40 PM; his battery 9%.

   CHAPTER1.md F, Episode 1: the phone wakes to 47 missed calls and one of them
   rings in your hand; whose phone it is; the boy with the tray and the
   poster; the voice notes and nine seconds of fire (filed, as he tells it);
   someone looking for the phone; a phone that was prepared; and a stranger
   writing "M? Tu hai?" as it dies.

   End belief (canon): Sameer witnessed a murder and is being hunted.
   =========================================================================== */

/** Airplane mode, turned on by hand (lib/game/phone.ts): after it, nothing reaches the phone. */
const OFFLINE = "did:airplane";

/** Sameer's new number, writing to his own phone. Masked, like every number here. */
export const SAMEER_NEW = "+91 70••• •2290";

const evidence: readonly Evidence[] = [
  // Read before the phone is even turned over.
  { id: "note", device: "owner", app: "casefile", label: "The note on the envelope, to M", manual: true },
  // Who M is: WhatsApp's contact info for the pinned chat.
  { id: "meera", device: "owner", app: "whatsapp", label: "M: Meera Arora, an advocate at Saket Courts", manual: true },

  // Q1: whose phone.
  { id: "apple-account", device: "owner", app: "settings", label: "The Apple Account: Sameer Khurana" },
  { id: "sk-films", device: "owner", app: "instagram", label: "@skfilms.delhi: weddings that feel like films", within: true },
  { id: "invoice", device: "owner", app: "mail", label: "Invoice SK-1127, to Sehgal Enterprises", within: true },

  // His life.
  { id: "offer", device: "owner", app: "mail", label: "A job in Mumbai, from Monday 1 December", within: true },
  { id: "deposit", device: "owner", app: "paytap", label: "₹35,000: a deposit on a flat in Andheri", within: true },

  // Q2: the boy.
  { id: "portrait", device: "owner", app: "photos", label: "9:48 PM: a waiter with a tray, smiling into the lens", within: true },
  { id: "badge", device: "owner", app: "photos", label: "His name badge: CHHOTU", manual: true },
  { id: "poster", device: "owner", app: "whatsapp", label: "LAPATA: Dilip Kumar Mahto (Chhotu), 19", within: true },
  { id: "sethi-chhotu", device: "owner", app: "whatsapp", label: "The caterer: Chhotu hasn't come in since Saturday", within: true },

  // Q3: his version.
  { id: "vn-kunal", device: "owner", app: "whatsapp", label: "Voice note: “Kunal firing kar raha tha. Ek ladka gir gaya.”", within: true },
  { id: "vn-hospital", device: "owner", app: "whatsapp", label: "Voice note: “Usko hospital nahi le gaye.”", within: true },
  { id: "vn-burned", device: "owner", app: "whatsapp", label: "Voice note: “Unhone usko jala diya… Maine dekha.”", within: true },
  { id: "fire-clip", device: "owner", app: "photos", label: "Nine seconds of fire, 4:47 AM Sunday", within: true },

  // Q4: prepared.
  { id: "passcode-off", device: "owner", app: "settings", label: "Passcode turned off: Thursday, 11:41 PM", within: true },
  { id: "for-m", device: "owner", app: "notes", label: "“For M”: a reading order, Thursday 11:20 PM", within: true },
];

const questions: readonly Question[] = [
  {
    kind: "pick",
    id: "q1",
    ask: "Whose phone is this, and what does he do?",
    episode: 1,
    whereToLook: ["settings", "instagram", "mail"],
    hints: [
      "Every iPhone says whose it is, at the very top of Settings.",
      "What he does is on his Instagram, and on what he bills people for in Mail.",
      "Table his Instagram (@skfilms.delhi) or the SK-1127 invoice in Mail, with the Apple Account if you like.",
    ],
    proof: ["sk-films"],
    orProof: [["invoice"], ["apple-account", "sk-films"], ["apple-account", "invoice"]],
    reply: "Sameer Khurana, 27. SK Films: a wedding photographer in South Delhi, with a job waiting in Mumbai.",
    sets: ["did:named-him"],
  },
  {
    kind: "pick",
    id: "q2",
    ask: "Who is the boy on the poster?",
    episode: 1,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "The poster has a face and a name. Somewhere on this phone is the same boy.",
      "Sameer photographed the staff at the Sehgal wedding. Lean in on the waiter's waistcoat, or read what the caterer wrote on Monday.",
      "Table the LAPATA poster with the name badge on the 9:48 PM portrait (zoom in on it), or with Sethi Caterers' message about Chhotu.",
    ],
    proof: ["poster", "badge"],
    orProof: [["poster", "sethi-chhotu"]],
    reply: "Dilip Kumar Mahto, nineteen, called Chhotu: a waiter at the Sehgal wedding. Sameer photographed him at 9:48 PM that night. Nobody has seen him since.",
    sets: ["did:named-dilip"],
  },
  {
    kind: "file",
    id: "q3",
    ask: "What happened at the wedding?",
    episode: 1,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "He left four voice notes for someone called M, and one video in his Favorites.",
      "Listen to what the voice notes say happened, and watch the fire.",
      "Table the first voice note with the fire clip (or with the third voice note), and file what they say.",
    ],
    claims: [
      {
        id: "his",
        text: "A worker was shot while Kunal Sehgal was firing. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-kunal", "fire-clip"],
        orProof: [["vn-kunal", "vn-burned"]],
        reply: "On the record.",
        version: true,
        link: "two-firings",
      },
      {
        id: "two",
        text: "There were two firings: Kunal's on the dance floor at 11:52, and the one that hit Dilip, forty minutes later on the back lawn.",
        proof: ["kunal-clip", "reel-take"],
        orProof: [["kunal-clip", "bts"]],
        reply: "Struck, and filed again. His voice note had put two moments in one sentence.",
      },
    ],
    reply: "On the record.",
    sets: ["did:heard-him"],
    // Episode 2's two firings crack it, and it has to be struck before going on.
    reopenWhen: ["link:two-firings"],
    mustRevisit: true,
  },
  {
    kind: "pick",
    id: "q4",
    ask: "Was this phone prepared before it was sent?",
    episode: 1,
    whereToLook: ["settings", "notes"],
    hints: [
      "A 27-year-old's phone with no passcode. When did that happen?",
      "Settings › Face ID & Passcode says when. Notes has something written for M.",
      "Table the passcode turned off on Thursday at 11:41 PM, or the note “For M” (or both).",
    ],
    proof: ["passcode-off"],
    orProof: [["for-m"], ["passcode-off", "for-m"]],
    reply: "Yes. On Thursday night, before he sent it: a reading order for M at 11:20, and the passcode off at 11:41. The order stops at “4. Nitin —”.",
    sets: ["did:prepared"],
  },
];

/** Raju, ringing in your hand within seconds of the phone waking (CHAPTER1.md H: reply to Raju early). */
const incoming: readonly IncomingCall[] = [
  {
    id: "raju",
    device: "owner",
    from: RAJU,
    sub: "mobile",
    at: "23:41",
    after: ["fired:raju-rings"],
    lines: [
      { who: "Raju", line: "Hello? Sameer bhaiya?" },
      { who: "Raju", line: "…Aap kaun ho? Ye Sameer bhaiya ka phone hai na?", english: "…Who are you? This is Sameer bhaiya's phone, isn't it?" },
      { who: "Raju", line: "Dilip kahan hai?", english: "Where's Dilip?" },
    ],
    reply: {
      id: "raju-call",
      options: [
        {
          id: "truth",
          text: "Main Sameer nahi hoon. Ye phone mujhe mila hai.",
          english: "I'm not Sameer. This phone came to me.",
          sets: ["did:raju-told-truth"],
          then: [{ id: "rc-1", from: "them", at: "23:42", text: "Mila hai? Kahan se? …Dilip ka bhai hoon. Raju.", english: "Came to you? From where? …I'm Dilip's brother. Raju." }],
        },
        {
          id: "who",
          text: "Dilip kaun?",
          english: "Who's Dilip?",
          sets: ["did:raju-asked"],
          then: [{ id: "rc-2", from: "them", at: "23:42", text: "Mera bhai. Sameer bhaiya ke saath kaam karta tha. Saat din ho gaye.", english: "My brother. He worked with Sameer bhaiya. It's been seven days." }],
        },
        {
          id: "wrong",
          text: "Galat number.",
          english: "Wrong number.",
          sets: ["did:raju-lied"],
          then: [{ id: "rc-3", from: "them", at: "23:42", text: "Galat number? Ye Sameer bhaiya ka hi number hai…", english: "Wrong number? This is Sameer bhaiya's number…" }],
        },
      ],
    },
  },
];

/* Someone looking for the phone: his mother, through Find My (CHAPTER1.md H:
   answer Sameer's mother). What she's told changes who comes looking. */
const mummyWhere: Message = {
  id: "mu-6",
  from: "them",
  at: "23:58",
  day: "Saturday",
  text: "Beta, phone ki location kahin aur dikha rahi hai. Tu kahan hai? Bhasin uncle phir aaye the.",
  english: "Your phone's location shows somewhere else. Where are you? Bhasin uncle came again.",
  requires: ["fired:mummy-where"],
  with: "mummy-where",
};

const sameerWrites: readonly Message[] = [
  { id: "sn-1", from: "them", at: "00:06", day: "Saturday", with: "sameer-writes", text: "M? Tu hai?", english: "M? Is that you?" },
  {
    id: "sn-2",
    from: "them",
    at: "00:06",
    day: "Saturday",
    with: "sameer-writes",
    text: "Voice notes sun liye? Order mein dekhna. Jo pehle rakha hai woh pehle.",
    english: "Did you hear the voice notes? Look in order. What I put first, first.",
  },
  { id: "sn-3", from: "them", at: "00:07", day: "Saturday", with: "sameer-writes", text: "Mere ghar mat jaana. Bhasin wahan aata hai.", english: "Don't go to my house. Bhasin comes there." },
];

/** What arrives on the phone during Episode 1, added to the chats in phone.ts. */
export const threads: readonly Thread[] = [
  {
    id: "mummy",
    app: "whatsapp",
    name: "Mummy",
    messages: [mummyWhere],
    replies: [
      {
        id: "mummy-reply",
        requires: ["fired:mummy-where"],
        options: [
          {
            id: "stranger",
            text: "Aunty, main Sameer nahi hoon. Ye phone mere paas aaya hai.",
            english: "Aunty, I'm not Sameer. This phone came to me.",
            sets: ["did:mummy-stranger"],
            then: [
              { id: "mu-7", from: "them", at: "00:01", day: "Saturday", text: "Kaun ho aap?? Sameer kahan hai? Main Bhasin uncle ko batati hoon.", english: "Who are you?? Where is Sameer? I'm telling Bhasin uncle." },
            ],
          },
          {
            id: "as-sameer",
            text: "Main theek hoon mummy. Baad mein baat karta hoon.",
            english: "I'm fine, Mummy. I'll talk later.",
            sets: ["did:mummy-as-sameer"],
            then: [
              { id: "mu-8", from: "them", at: "00:01", day: "Saturday", text: "Theek hai beta. Bhasin uncle ko bol deti hoon tu theek hai. Khana kha lena 🙏", english: "All right. I'll tell Bhasin uncle you're fine. Do eat something." },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sameer-new",
    app: "whatsapp",
    name: SAMEER_NEW,
    number: SAMEER_NEW,
    requires: ["fired:sameer-writes"],
    messages: sameerWrites,
  },
];

const events: readonly LiveEvent[] = [
  // Seconds after the phone wakes, over its lock screen, the number that called 47 times calls again.
  { id: "raju-rings", device: "owner", after: ["did:unlock"], delay: 6, app: "phone" },
  // Once his version is filed, someone plays a sound on the phone to find it.
  { id: "find-my", device: "owner", after: ["did:heard-him"], unless: [OFFLINE], delay: 6, app: "settings", icon: "settings", banner: "Find My · A sound was played on this iPhone." },
  {
    id: "mummy-where",
    device: "owner",
    after: ["fired:find-my"],
    unless: [OFFLINE],
    delay: 8,
    app: "whatsapp",
    banner: "Mummy · Beta, phone ki location kahin aur dikha rahi hai. Tu kahan hai?",
  },
  // Once the phone is known to have been prepared, the man who prepared it writes.
  { id: "sameer-writes", device: "owner", after: ["did:prepared"], unless: [OFFLINE], delay: 5, app: "whatsapp", banner: `${SAMEER_NEW} · M? Tu hai?` },
  // And then it dies, unless someone keeps it alive: online or not, half a minute after Sameer's first message would come.
  {
    id: "dying",
    device: "owner",
    after: ["did:prepared"],
    delay: 35,
    app: "settings",
    icon: "settings",
    banner: "Low Battery · 2% battery remaining",
    sets: ["did:needs-charge"],
  },
];

export const episode1 = { evidence, questions, events, incoming, threads };
