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

/** Where the words a sentence offers are learned (Say.learn): the names, once the phone has said them. */
/* His name, wherever the phone says it in Episode 1: his Apple Account, his
   Instagram, his mail; Raju's first call ("Ye Sameer bhaiya ka phone hai
   na?", if it was answered), Raju's chat with the poster, the caterer's "Sameer ji", M's chat. */
const SAMEER = ["apple-account", "sk-films", "invoice", "offer", "did:answered-raju", "poster", "sethi-dilip", "meera"];
const KUNAL = ["kunal-papa", "kunal-clip", "kunal-pose", "vn-kunal"];
const NITIN = ["for-m", "sk-films", "shot-list"];
const BHASIN = ["note", "vn-hospital", "bhasin-balance"];
const DILIP = ["poster"];

const evidence: readonly Evidence[] = [
  // Read before the phone is even turned over.
  { id: "note", device: "owner", app: "casefile", label: "The note on the envelope, to M", manual: true },
  // Who M is: WhatsApp's contact info for the pinned chat.
  { id: "meera", device: "owner", app: "whatsapp", label: "M: Meera Arora, an advocate in Kalkaji", manual: true },

  // Q1: whose phone.
  { id: "apple-account", device: "owner", app: "settings", label: "The Apple Account: Sameer Khurrana, born 14 March 1998" },
  { id: "sk-films", device: "owner", app: "instagram", label: "@sk.weddings: Delhi weddings, planned like films", within: true },
  { id: "invoice", device: "owner", app: "mail", label: "Invoice SK-1127, to Sehgal Enterprises", within: true },

  // His life.
  { id: "offer", device: "owner", app: "mail", label: "A job in Mumbai, from Monday 1 December", within: true },
  // (game) T3: the clock on him, from the first question.
  { id: "ticket", device: "owner", app: "mail", label: "A train to Mumbai, tomorrow at 4:55 PM", within: true },
  { id: "deposit", device: "owner", app: "paytap", label: "₹35,000: a deposit on a flat in Andheri", within: true },

  // Q2: the boy.
  { id: "portrait", device: "owner", app: "photos", label: "9:48 PM: a waiter with a tray, smiling into the lens", within: true },
  { id: "badge", device: "owner", app: "photos", label: "His name badge: DILIP", manual: true },
  { id: "poster", device: "owner", app: "whatsapp", label: "LAPATA: Dilip Kumar Mahto, 19", within: true },
  { id: "sethi-dilip", device: "owner", app: "whatsapp", label: "The caterer: Dilip hasn't come in since Saturday", within: true },

  // Q3: his version, and what a careful reader builds on it.
  { id: "vn-kunal", device: "owner", app: "whatsapp", label: "Voice note: “Kunal firing kar raha tha. Ek ladka gir gaya.”", within: true },
  { id: "vn-hospital", device: "owner", app: "whatsapp", label: "Voice note: “Usko hospital nahi le gaye.”", within: true },
  { id: "vn-burned", device: "owner", app: "whatsapp", label: "Voice note: “Unhone usko jala diya… Maine dekha.”", within: true },
  { id: "fire-clip", device: "owner", app: "photos", label: "Nine seconds of fire, 4:47 AM Sunday", within: true },
  /* In plain view, and true: Kunal with his father's revolver on the back
     lawn, and the reel he wrote about. The wrong story, for the right
     reasons (script §23). Plain view, so they count from the first minute. */
  { id: "kunal-pose", device: "owner", app: "instagram", label: "Kunal on Instagram, 12:24 AM: a revolver by his face, “Papa ki lekar aaya hoon”", within: true },
  { id: "kunal-papa", device: "owner", app: "whatsapp", label: "Kunal, Thursday before: “reel mein Papa wali le aaunga”", within: true },
  { id: "shot-list", device: "owner", app: "notes", label: "His run sheet: “12:15 — SK reel w/ Kunal. back lawn… D — light (N sick)”", within: true },
  { id: "search-1244", device: "owner", app: "safari", label: "Safari, 12:44 AM: “goli lagne pe kya karein”", within: true },

  // Q4: prepared.
  { id: "passcode-off", device: "owner", app: "settings", label: "Passcode: off. Anyone who has the phone can open it.", within: true },
  { id: "for-m", device: "owner", app: "notes", label: "“For M”: a reading order, Thursday 11:20 PM", within: true },

  // Read, so the phone can die: his first words to whoever has it.
  { id: "sameer-first", device: "owner", app: "whatsapp", label: "A new number: “M? Tu hai?”", manual: true },
];

const questions: readonly Question[] = [
  {
    kind: "file",
    id: "q1",
    ask: "Who is “S”, and where is he running to?",
    episode: 1,
    whereToLook: ["settings", "instagram", "mail"],
    hints: [
      "Every iPhone says whose it is, at the very top of Settings.",
      "What he does is on his Instagram, and in what he bills the Sehgals for in Mail. Where he's going is in Mail too.",
      "Sameer Khurrana, a wedding planner, leaving for Mumbai. Table his Instagram (@sk.weddings) with the SK-1127 invoice, the Mumbai offer or the train ticket.",
    ],
    say: {
      line: "S is {name}, a {job}, and tomorrow afternoon he's on a train to {city}.",
      blanks: {
        name: ["Sameer Khurrana", "Rohan", "Kunal", "Nitin"],
        job: ["wedding planner", "wedding photographer", "DJ"],
        city: ["Mumbai", "Delhi", "Chhattarpur"],
      },
      learn: {
        "Sameer Khurrana": SAMEER,
        Kunal: KUNAL,
        Nitin: NITIN,
        "wedding planner": ["sk-films", "invoice", "offer"],
        // The offer, the flat, or his own bio: "Delhi → Mumbai, soon".
        Mumbai: ["offer", "deposit", "sk-films", "ticket"],
      },
    },
    claims: [
      {
        id: "him",
        words: { name: "Sameer Khurrana", job: "wedding planner", city: "Mumbai" },
        text: "Sameer Khurrana, 27. SK Weddings: a wedding planner in South Delhi, with a job waiting in Mumbai.",
        proof: ["sk-films"],
        also: ["apple-account", "offer", "invoice", "sk-films", "ticket"],
        orProof: [["invoice"], ["offer"], ["ticket"], ["apple-account", "sk-films"], ["apple-account", "invoice"]],
        reply: "Sameer Khurrana, 27. SK Weddings: Delhi weddings, planned like films. He planned the Sehgal wedding. A week after the Sehgal wedding he's leaving Delhi, for a job in Mumbai that starts on Monday. His train goes at 4:55 tomorrow.",
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
      "Raju's poster has a name, and a day. Somewhere on this phone is the same boy, that Saturday.",
      "Sameer photographed the staff at the Sehgal wedding. Lean in on a waiter's waistcoat, or read what the caterer wrote on Monday.",
      "A waiter at the Sehgal wedding. Table the LAPATA poster with the name badge on the 9:48 PM portrait (zoom in on it), or with Sethi Caterers' message about Dilip.",
    ],
    say: {
      line: "Dilip was last seen as a {role} at the {where}, in front of Sameer's camera.",
      blanks: {
        role: ["waiter", "guest", "driver", "dancer"],
        where: ["Sehgal wedding", "caterer's kitchen", "Samastipur bus stand"],
      },
      learn: {
        waiter: ["portrait", "badge", "sethi-dilip"],
        "Sehgal wedding": ["portrait", "badge", "invoice", "sethi-dilip"],
        "caterer's kitchen": ["sethi-dilip"],
        "Samastipur bus stand": ["poster"],
      },
    },
    claims: [
      {
        id: "dilip",
        words: { role: "waiter", where: "Sehgal wedding" },
        text: "Dilip Kumar Mahto, nineteen: a waiter at the Sehgal wedding. Sameer photographed him at 9:48 PM that night. Nobody has seen him since.",
        proof: ["poster", "badge"],
        also: ["portrait", "sethi-dilip", "badge"],
        orProof: [["poster", "sethi-dilip"]],
        reply: "Dilip Kumar Mahto, nineteen. Sameer photographed him at 9:48 PM, smiling over a tray. Nobody has seen him since.",
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
        who: ["Kunal Sehgal", "someone at the wedding", "Sameer", "Bhasin Sehgal", "Nitin"],
        then: ["burned", "buried", "sent home"],
      },
      learn: {
        "Kunal Sehgal": KUNAL,
        Sameer: SAMEER,
        "Bhasin Sehgal": BHASIN,
        Nitin: NITIN,
        burned: ["vn-burned", "fire-clip"],
      },
    },
    claims: [
      {
        id: "his",
        words: { who: "Kunal Sehgal", then: "burned" },
        text: "A worker was shot while Kunal Sehgal was firing. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-kunal", "fire-clip"],
        also: ["poster", "vn-hospital", "kunal-pose", "kunal-papa", "kunal-clip", "shot-list"],
        orProof: [["vn-kunal", "vn-burned"], ["vn-kunal", "vn-hospital", "vn-burned"], ["kunal-pose", "vn-burned"]],
        reply: "On the record.",
        version: true,
        link: "two-firings",
      },
      {
        id: "someone",
        words: { who: "someone at the wedding", then: "burned" },
        text: "Dilip was shot at the wedding. The phone doesn't say by whom. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-hospital", "vn-burned"],
        also: ["poster", "vn-kunal", "vn-hospital", "kunal-pose", "kunal-papa", "shot-list", "search-1244"],
        orProof: [["vn-burned", "fire-clip"], ["vn-kunal", "fire-clip"], ["vn-kunal", "vn-burned"]],
        reply: "On the record, and no further than it goes. His voice note names Kunal as firing. It doesn't say whose bullet hit Dilip.",
      },
      {
        id: "sameer",
        words: { who: "Sameer", then: "burned" },
        text: "Dilip was shot at the wedding, and I think Sameer fired. Nobody took him to a hospital, and his body was burned.",
        proof: ["vn-hospital", "vn-burned"],
        // Circumstance, not proof: his reel, his lawn, a real gun around. It can sit beside the proof.
        also: ["shot-list", "kunal-papa", "kunal-pose", "sethi-dilip", "portrait", "search-1244", "vn-kunal", "fire-clip"],
        orProof: [["vn-burned", "fire-clip"], ["vn-kunal", "fire-clip"], ["vn-kunal", "vn-burned"]],
        reply: "Filed, as your hunch. Nothing you've tabled puts the gun in his hand. Not yet.",
        backed: {
          by: ["shot-list", "kunal-papa", "search-1244"],
          // Never narrates what wasn't tabled (PLAYTEST-SHAGUN.md #42).
          reply: "Filed, as your hunch, and not a wild one: what you've tabled puts him close. Whose hand the gun was in, the phone doesn't say yet.",
        },
        hunch: "shot",
      },
      {
        id: "bhasin",
        words: { who: "Bhasin Sehgal", then: "burned" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Nothing on the phone puts a gun in Bhasin's hand. His name is on what happened after.",
      },
      {
        id: "nitin",
        words: { who: "Nitin", then: "burned" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Nothing on the phone puts a gun near Nitin.",
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
      "A 27-year-old's phone with no passcode, and a note to M. When was he writing to her?",
      "Settings › Face ID & Passcode says it's off. Notes has something written for M, when, and where it stops.",
      "Thursday night, and it stops at Nitin. Table the note “For M” (with the passcode, off, if you like).",
    ],
    say: {
      line: "Sameer got it ready on {when}: the passcode off, and a list for M that stops at {name}.",
      blanks: {
        when: ["Thursday night", "the wedding night", "Saturday morning"],
        name: ["Nitin", "Bhasin", "Kunal", "Dilip"],
      },
      learn: {
        "Thursday night": ["for-m"],
        Nitin: NITIN,
        Bhasin: BHASIN,
        Kunal: KUNAL,
        Dilip: DILIP,
      },
    },
    claims: [
      {
        id: "ready",
        words: { when: "Thursday night", name: "Nitin" },
        text: "Yes. On Thursday night, before he sent it: a reading order for M at 11:20, and the passcode off. The order stops at “4. Nitin —”.",
        proof: ["passcode-off", "for-m"],
        also: ["note", "passcode-off"],
        orProof: [["for-m"]],
        reply: "Thursday night, 11:20: a reading order for M, and a phone anyone can open. His list stops mid-line, at a name.",
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
  { id: "sn-1", from: "them", at: "00:06", day: "Saturday", with: "sameer-writes", text: "M? Tu hai?", english: "M? Is that you?", evidence: "sameer-first" },
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
  /* Once his version is filed, someone plays a sound on the phone to find it.
     The night's turns wait for the case file to be put down (Table): nobody
     reads a banner while they're writing. */
  { id: "find-my", device: "owner", after: ["did:heard-him"], unless: [OFFLINE], delay: 6, app: "settings", icon: "settings", banner: "Find My · A sound was played on this iPhone." },
  {
    id: "mummy-where",
    device: "owner",
    after: ["fired:find-my"],
    unless: [OFFLINE],
    delay: 14,
    app: "whatsapp",
    banner: "Mummy · Beta, phone ki location kahin aur dikha rahi hai. Tu kahan hai?",
  },
  // Once the phone is known to have been prepared, the man who prepared it writes.
  { id: "sameer-writes", device: "owner", after: ["did:prepared"], unless: [OFFLINE], delay: 8, app: "whatsapp", banner: `${SAMEER_NEW} · M? Tu hai?` },
  /* And then it dies, unless someone keeps it alive: once his first words
     have been read, so the episode ends on them and not under someone
     filing. Never read (or offline, so never sent), it dies anyway, in time,
     once the phone has been put down. */
  {
    id: "dying",
    device: "owner",
    after: ["did:prepared", "saw:sameer-first"],
    unless: ["fired:dying-late"],
    delay: 12,
    app: "settings",
    icon: "settings",
    banner: "Low Battery · 2% battery remaining",
    sets: ["did:needs-charge"],
  },
  {
    id: "dying-late",
    device: "owner",
    after: ["did:prepared"],
    unless: ["fired:dying"],
    delay: 90,
    quiet: true,
    app: "settings",
    icon: "settings",
    banner: "Low Battery · 2% battery remaining",
    sets: ["did:needs-charge"],
  },
];

export const episode1 = { evidence, questions, events, incoming, threads };
