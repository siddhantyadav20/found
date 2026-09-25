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
    kind: "file",
    id: "q1",
    ask: "Who is “S”, and where is he going?",
    episode: 1,
    whereToLook: ["settings", "instagram", "mail"],
    hints: [
      "Every iPhone says whose it is, at the very top of Settings.",
      "What he does is on his Instagram, and in what he bills people for in Mail. Where he's going is in Mail too.",
      "Sameer Khurana, a wedding photographer, leaving for Mumbai. Table his Instagram (@skfilms.delhi), the SK-1127 invoice or the Mumbai offer, with the Apple Account if you like.",
    ],
    say: {
      line: "S is {name}, a {job}, and a week after the wedding he's leaving for {city}.",
      blanks: {
        name: ["Sameer Khurana", "Kunal Sehgal", "Vinod Bhasin", "Nitin"],
        job: ["wedding photographer", "caterer", "security officer", "lawyer"],
        city: ["Mumbai", "Delhi", "Samastipur"],
      },
    },
    claims: [
      {
        id: "him",
        words: { name: "Sameer Khurana", job: "wedding photographer", city: "Mumbai" },
        text: "Sameer Khurana, 27. SK Films: a wedding photographer in South Delhi, with a job waiting in Mumbai.",
        proof: ["sk-films"],
        also: ["apple-account", "offer", "invoice", "sk-films"],
        orProof: [["invoice"], ["offer"], ["apple-account", "sk-films"], ["apple-account", "invoice"]],
        reply: "Sameer Khurana, 27. SK Films: weddings that feel like films. A week after the Sehgal wedding he's leaving Delhi, for a job in Mumbai that starts on Monday.",
      },
    ],
    reply: "On the record.",
    sets: ["did:named-him"],
  },
  {
    kind: "file",
    id: "q2",
    ask: "Dilip is missing. Where was he last seen?",
    episode: 1,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "Raju's poster has a face and a name. Somewhere on this phone is the same boy.",
      "Sameer photographed the staff at the Sehgal wedding. Lean in on a waiter's waistcoat, or read what the caterer wrote on Monday.",
      "A waiter at the Sehgal wedding. Table the LAPATA poster with the name badge on the 9:48 PM portrait (zoom in on it), or with Sethi Caterers' message about Chhotu.",
    ],
    say: {
      line: "Dilip was last seen as a {role} at the {where}, in front of Sameer's camera.",
      blanks: {
        role: ["waiter", "guest", "driver", "dancer"],
        where: ["Sehgal wedding", "Rangmanch interview", "Chhath festival"],
      },
    },
    claims: [
      {
        id: "dilip",
        words: { role: "waiter", where: "Sehgal wedding" },
        text: "Dilip Kumar Mahto, nineteen, called Chhotu: a waiter at the Sehgal wedding. Sameer photographed him at 9:48 PM that night. Nobody has seen him since.",
        proof: ["poster", "badge"],
        also: ["portrait", "sethi-chhotu", "badge"],
        orProof: [["poster", "sethi-chhotu"]],
        reply: "Dilip Kumar Mahto, nineteen, called Chhotu. Sameer photographed him at 9:48 PM, smiling over a tray. Nobody has seen him since.",
      },
    ],
    reply: "On the record.",
    sets: ["did:named-dilip"],
  },
  {
    kind: "file",
    id: "q3",
    ask: "What happened to Dilip at the wedding?",
    episode: 1,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "He left four voice notes for someone called M, and one video in his Favorites.",
      "Listen to what the voice notes say happened, and watch the fire. Who do they say was firing? Do they say who hit him?",
      "Sameer's notes say Kunal was firing and a boy fell. Say that, or say only what they prove (someone shot him), with the first voice note and the fire clip or the third voice note.",
    ],
    say: {
      line: "Dilip was shot by {who}. Nobody took him to a hospital, and his body was {then}.",
      blanks: {
        who: ["Kunal Sehgal", "someone at the wedding", "Sameer", "Vinod Bhasin"],
        then: ["burned", "buried", "sent home"],
      },
    },
    claims: [
      {
        id: "his",
        words: { who: "Kunal Sehgal", then: "burned" },
        text: "A worker was shot while Kunal Sehgal was firing. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-kunal", "fire-clip"],
        also: ["poster", "vn-hospital"],
        orProof: [["vn-kunal", "vn-burned"], ["vn-kunal", "vn-hospital", "vn-burned"]],
        reply: "On the record, as his voice notes tell it.",
        version: true,
        link: "two-firings",
      },
      {
        id: "someone",
        words: { who: "someone at the wedding", then: "burned" },
        text: "Dilip was shot at the wedding. The phone doesn't say by whom. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-hospital", "vn-burned"],
        also: ["poster", "vn-kunal", "vn-hospital"],
        orProof: [["vn-burned", "fire-clip"], ["vn-kunal", "fire-clip"], ["vn-kunal", "vn-burned"]],
        reply: "On the record, and no further than it goes. His voice note names Kunal as firing. It doesn't say whose bullet hit Dilip.",
      },
      {
        id: "sameer",
        words: { who: "Sameer", then: "burned" },
        text: "Dilip was shot at the wedding, and I think Sameer fired. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-hospital", "vn-burned"],
        orProof: [["vn-burned", "fire-clip"], ["vn-kunal", "fire-clip"], ["vn-kunal", "vn-burned"]],
        reply: "Filed. The rest the phone shows. Sameer, you're saying on your own: nothing here says so yet.",
        hunch: "shot",
      },
      {
        id: "bhasin",
        words: { who: "Vinod Bhasin", then: "burned" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Nothing on the phone puts a gun in Bhasin's hand. His name is on what happened after.",
      },
    ],
    reply: "On the record.",
    sets: ["did:heard-him"],
    // Episode 2 proves who fired. His version, if it was filed, crosses out then.
    struckWhen: ["link:two-firings"],
  },
  {
    kind: "file",
    id: "q4",
    ask: "Someone set this phone up for M to read. When, and where does his list stop?",
    episode: 1,
    whereToLook: ["settings", "notes"],
    hints: [
      "A 27-year-old's phone with no passcode. When did that happen?",
      "Settings › Face ID & Passcode says when. Notes has something written for M, and where it stops.",
      "Thursday night, and it stops at Nitin. Table the passcode turned off at 11:41 PM, or the note “For M” (or both).",
    ],
    say: {
      line: "Sameer got it ready on {when}: the passcode off, and a list for M that stops at {name}.",
      blanks: {
        when: ["Thursday night", "the wedding night", "Saturday morning"],
        name: ["Nitin", "Bhasin", "Kunal", "Dilip"],
      },
    },
    claims: [
      {
        id: "ready",
        words: { when: "Thursday night", name: "Nitin" },
        text: "Yes. On Thursday night, before he sent it: a reading order for M at 11:20, and the passcode off at 11:41. The order stops at “4. Nitin —”.",
        proof: ["passcode-off", "for-m"],
        also: ["note", "passcode-off"],
        orProof: [["for-m"]],
        reply: "Thursday night: a reading order for M at 11:20, the passcode off at 11:41. He meant it to be read, in his order. And his list stops mid-line, at a name: “4. Nitin —”.",
      },
    ],
    reply: "On the record.",
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
