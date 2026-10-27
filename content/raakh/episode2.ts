import type { Beat, Dark, IncomingCall, LiveEvent, Message, Reply, ReplyOption, Thread } from "../types";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 2 — "The Second Shot" (RAAKH-V3 §8). 12:32 to 1:52 AM, on the
   player's charger. Prove Sameer fired, prove Dilip lived, and find the car
   that left empty.

   At 12:33 the day's data renews and iCloud brings down what Episode 1
   could only see the edges of. Bhasin sends a voice note whose words follow
   what Mummy was told. Meera rings at 12:51 and knows the voice from the
   first word. Raju rings again at 1:05. Nitin writes at 1:25, and at 1:52,
   a week to the minute, sends back what Sameer deleted.
   =========================================================================== */

export const beats: readonly Beat[] = [
  { at: "00:48", after: ["ask:q4"] },
  { at: "01:20", after: ["ask:q5"] },
];

/* --- Meera, 12:51 (scene 2.7) ---------------------------------------------
   She unblocked him for this call. Her pause after "Sameer—", and her
   pointed "Aap jo bhi ho", are clues (IC11): warm, controlled, never
   knowing-winking. */

/** Her closing words, whatever was said before them. */
const PASSWORDS: Message = {
  id: "mc-close",
  from: "them",
  at: "00:54",
  text: "Uske passwords uski birthday hote hain. Hamesha. Aur order mein dekhna. Usne order mein rakha hai.",
  english: "His passwords are his birthday. Always. And look in order. He put it in order.",
};

/** "Don't delete anything": asked of whoever has the phone, and of him, after an early reveal. */
const keepIt = (id: string, before: Reply["before"], close: Message): Reply => ({
  id,
  before,
  options: [
    {
      id: "promise",
      text: "Theek hai. Kuch delete nahi karunga.",
      english: "Okay. I won't delete anything.",
      impulse: { side: "confessor", weight: 1 },
      sets: ["did:promise-p3"],
      then: [close],
    },
    {
      id: "why",
      text: "Kyun?",
      english: "Why?",
      sets: ["did:meera-why-delete"],
      then: [
        { id: "mc-why", from: "them", at: "00:53", text: "Kyunki jo ise bhejta hai, woh sabse pehle wahi mitata hai jo use phasata hai.", english: "Because whoever sends it erases first whatever traps him." },
        close,
      ],
    },
  ],
});

const middle = keepIt(
  "meera-keep",
  [
    {
      who: "Meera",
      line: "Maine aaj subah ye lene se mana kiya tha. Usne mujhe bheja tha, aur main ab uska bojh nahi uthaati. Lekin agar ye aapke haath mein hai, toh ek kaam karna. Kuch delete mat karna. Kuch bhi.",
      english: "I refused this this morning. He sent it to me, and I don't carry his weight anymore. But if it's in your hands, do one thing. Don't delete anything. Anything.",
    },
  ],
  PASSWORDS,
);

/* After "Meera. Main hoon." (RAAKH-V3 §9.10b): the same asks, said to him.
   The script gives this path its opening and its reveal; these two lines
   are her own words from the main path, turned to him. */
const earlyMiddle = keepIt(
  "meera-keep-early",
  [{ who: "Meera", line: "Toh sun. Kuch delete mat karna. Kuch bhi.", english: "Then listen. Don't delete anything. Anything." }],
  { id: "mc-close-early", from: "them", at: "00:54", text: "Aur order mein dekh. Tune order mein rakha hai.", english: "And look in order. You put it in order." },
);

const meeraOpening: readonly ReplyOption[] = [
  {
    id: "stranger",
    text: "Main Sameer nahi hoon. Ye parcel mere darwaze pe wapas aaya.",
    english: "I'm not Sameer. This parcel came back to my door.",
    impulse: { side: "auditor", weight: 1 },
    sets: ["did:meera-stranger"],
    then: [{ id: "mc-1", from: "them", at: "00:52", text: "…Theek hai. Aap jo bhi ho.", english: "…All right. Whoever you are." }],
    next: middle,
  },
  {
    id: "parcel",
    text: "Parcel wapas aa gaya.",
    english: "The parcel came back.",
    sets: ["did:meera-parcel"],
    then: [{ id: "mc-2", from: "them", at: "00:52", text: "…Haan. Pata hai.", english: "…Yes. I know." }],
    next: middle,
  },
  {
    id: "why",
    text: "Aapne ise lene se mana kyun kiya?",
    english: "Why did you refuse it?",
    impulse: { side: "confessor", weight: 1 },
    sets: ["did:meera-why"],
    then: [
      { id: "mc-3", from: "them", at: "00:52", text: "Kyunki main uska confession box nahi hoon.", english: "Because I'm not his confession box." },
      { id: "mc-3a", from: "them", at: "00:52", text: "Aap jo bhi ho.", english: "Whoever you are." },
    ],
    next: middle,
  },
  {
    id: "me",
    text: "Meera. Main hoon.",
    english: "Meera. It's me.",
    requires: ["did:me-hunch"],
    impulse: { side: "confessor", weight: 3 },
    sets: ["did:early-reveal"],
    then: [{ id: "mc-4", from: "them", at: "00:52", typing: 6, text: "Pata hai. Pehle shabd se.", english: "I know. From the first word." }],
    next: earlyMiddle,
  },
];

/* --- Raju, 1:05 (scene 2.8) ------------------------------------------------ */

const CODE: Message = {
  id: "r-code",
  from: "them",
  at: "01:07",
  text: "Woh roz poochta tha, “Mumbai pakki na?” Har baar. Pakki, pakki.",
  english: "He asked every day: “Mumbai's settled, right?” Every time. Pakki, pakki.",
};

const rajuAnswers: readonly ReplyOption[] = [
  {
    id: "shot",
    text: "Goli lagi thi. Dilip ko. Main aage pata kar raha hoon.",
    english: "He was shot. Dilip. I'm finding out more.",
    impulse: { side: "confessor", weight: 1 },
    sets: ["did:raju-told-shot"],
    then: [{ id: "r-9", from: "them", at: "01:06", typing: 4, text: "…Zinda hai?", english: "…Is he alive?" }],
    next: {
      id: "raju-alive",
      options: [{ id: "dunno", text: "Pata nahi.", english: "I don't know.", sets: ["did:raju-code"], then: [CODE] }],
    },
  },
  {
    id: "promise",
    text: "Main usse dhoondh lunga. Pakki.",
    english: "I'll find him. Promise.",
    sets: ["did:promise-p2", "did:raju-code"],
    then: [{ id: "r-10", from: "them", at: "01:06", text: "Pakki? …Woh bhi yahi bolta tha.", english: "Promise? …He used to say that too." }, CODE],
  },
  {
    id: "kunal",
    text: "Kunal Sehgal ne goli chalayi.",
    english: "Kunal Sehgal fired.",
    impulse: { side: "auditor", weight: 2 },
    sets: ["did:raju-told-kunal"],
    then: [{ id: "r-11", from: "them", at: "01:06", text: "Sehgal? Shaadi wale?", english: "The wedding family?" }],
  },
];

const incoming: readonly IncomingCall[] = [
  {
    id: "meera",
    device: "owner",
    from: "M",
    sub: "mobile",
    at: "00:51",
    after: ["fired:meera-rings"],
    insists: true,
    lines: [
      { who: "Meera", line: "Sameer—" },
      { who: "Meera", line: "…Hello?" },
    ],
    reply: { id: "meera-call", options: meeraOpening },
  },
  {
    id: "raju-2",
    device: "owner",
    from: RAJU,
    sub: "mobile",
    at: "01:05",
    after: ["fired:raju-rings-2"],
    lines: [
      { who: "Raju", line: "Hello?" },
      { who: "Raju", line: "Aap hi ho na? Jisne pichhli baar phone uthaya tha?", english: "It's you, isn't it? Who picked up last time?", when: "did:answered-raju" },
      { who: "Raju", line: "Dilip ke baare mein kuch pata chala? Maa roz phone karti hai.", english: "Found anything about Dilip? Ma calls every day." },
    ],
    reply: { id: "raju-call-2", options: rajuAnswers },
  },
];

/* --- Bhasin's voice note, 12:40 (scene 2.3): the words follow what Mummy was told. */

const bhasinVoice = (id: string, seconds: number, transcript: string, english: string, when: Pick<Message, "requires" | "unless">): Message => ({
  id,
  from: "them",
  at: "00:40",
  day: "29/11",
  with: "bhasin-vn",
  ...when,
  requires: ["fired:bhasin-vn", ...(when.requires ?? [])],
  attachment: { kind: "voice", seconds, transcript, english },
});

const bhasin: Thread = {
  id: "bhasin",
  app: "whatsapp",
  name: "Bhasin Uncle",
  messages: [
    bhasinVoice(
      "b-vn-stranger",
      16,
      "Jiske paas bhi ye phone hai. Neelam ji keh rahi thi koi aur hai. Achha natak hai. Subah saat baje tak phone gate pe chhod dena. Baaki hum dekh lenge.",
      "Whoever has this phone. Neelam ji says someone else has it. Nice act. Leave it at the gate by seven. We'll handle the rest.",
      { requires: ["did:mummy-stranger"] },
    ),
    bhasinVoice(
      "b-vn-fine",
      10,
      "Neelam ji ne bataya tu theek hai. Achha hai. Toh ghar pe hi rehna. Subah baat karte hain.",
      "Neelam ji says you're fine. Good. Then stay home. We'll talk in the morning.",
      { requires: ["did:mummy-fine"] },
    ),
    bhasinVoice(
      "b-vn-none",
      7,
      "Jiske paas bhi ye phone hai. Subah saat baje tak gate pe chhod dena.",
      "Whoever has this phone. Leave it at the gate by seven.",
      { unless: ["did:mummy-stranger", "did:mummy-fine"] },
    ),
  ],
};

/* --- Meera, after the call: she writes in the chat he pinned for her. ------- */

const meera: Thread = {
  id: "m",
  app: "whatsapp",
  name: "M",
  messages: [
    {
      id: "me-0",
      from: "them",
      at: "00:55",
      day: "29/11",
      with: "meera-unblocks",
      requires: ["fired:meera-unblocks"],
      text: "Block hata diya hai. Kuch bhejna ho toh yahan bhejna.",
      english: "I've unblocked. If you need to send anything, send it here.",
    },
  ],
};

/* --- Nitin, 1:25 (scene 2.10), in the chat Sameer locked ------------------- */

const READY = "did:nitin-ready";

const nitin: Thread = {
  id: "nitin",
  app: "whatsapp",
  name: "Nitin",
  locked: true,
  messages: [
    { id: "n-o1", from: "them", at: "01:25", day: "29/11", with: "nitin-online", requires: ["fired:nitin-online"], text: "Bhai? Online dikh raha hai.", english: "Bro? You're showing online." },
    { id: "n-o2", from: "them", at: "01:25", day: "29/11", with: "nitin-online", requires: ["fired:nitin-online"], typing: 6, text: "Us raat ke baad se neend nahi aayi.", english: "I haven't slept since that night." },
    /* 1:52, a week to the minute (scene 2.11, E42): what he kept, and how he says it. */
    {
      id: "n-copy-line-stranger",
      from: "them",
      at: "01:52",
      day: "29/11",
      with: "nitin-copy",
      requires: ["fired:nitin-copy", "did:nitin-stranger"],
      typing: 7,
      text: "Ye uska message hai. 1:52. Uske phone se delete hai, mere se nahi. Maine check bhi nahi kiya. Bas maan gaya.",
      english: "This is his message. Deleted from his phone, not mine. I didn't even check. I just believed it.",
    },
    {
      id: "n-copy-line-care",
      from: "them",
      at: "01:52",
      day: "29/11",
      with: "nitin-copy",
      requires: ["fired:nitin-copy", "did:nitin-care"],
      typing: 7,
      text: "Ye tera hi message hai. 1:52. Tune delete kiya hoga. Mere paas hai. Maine check bhi nahi kiya. Tujhe maan liya.",
      english: "This is your own message. You must have deleted it. I have it. I didn't even check. I believed you.",
    },
    {
      id: "n-copy-line-blame",
      from: "them",
      at: "01:52",
      day: "29/11",
      with: "nitin-copy",
      requires: ["fired:nitin-copy", "did:nitin-blame"],
      text: "Ye dekh. Phir poochna.",
      english: "Look at this. Then ask.",
    },
    {
      id: "n-copy",
      from: "them",
      at: "01:52",
      day: "29/11",
      with: "nitin-copy",
      requires: ["fired:nitin-copy"],
      attachment: {
        kind: "photo",
        label: "Screenshot · Sameer Bhai, 1:52 AM: “Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.”",
        shot: {
          name: "Sameer Bhai",
          sub: "last seen Sunday",
          lines: [
            { text: "Vicky 10 min. Service gate — Mandi Road wala na?", at: "01:40", out: true },
            {
              who: "Sameer Bhai",
              text: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.",
              english: "They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.",
              at: "01:52",
            },
            { text: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon.", at: "01:53", out: true },
          ],
        },
      },
      english: "“They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.”",
      evidence: "nitin-152",
    },
  ],
  replies: [
    {
      id: "nitin-open",
      requires: ["fired:nitin-online"],
      options: [
        {
          id: "stranger",
          text: "Main Sameer nahi hoon. Mujhe jaanna hai us raat kya hua.",
          english: "I'm not Sameer. I need to know what happened that night.",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:nitin-stranger"],
          then: [{ id: "n-s1", from: "them", at: "01:26", typing: 6, text: "Kaun ho aap? Bhasin ke aadmi?", english: "Who are you? Bhasin's man?" }],
        },
        {
          id: "care",
          text: "Tu theek hai?",
          english: "Are you okay?",
          impulse: { side: "confessor", weight: 1 },
          sets: ["did:nitin-care", READY],
          then: [
            { id: "n-c1", from: "them", at: "01:26", typing: 5, text: "Nahi bhai.", english: "No." },
            { id: "n-c2", from: "them", at: "01:26", typing: 8, text: "…Tu poochh raha hai? Tu? Ek hafte se tu ek baar nahi bola.", english: "…You're asking? You? You didn't say one word all week." },
          ],
        },
        {
          id: "blame",
          text: "Gaadi kyun wapas bulayi thi?",
          english: "Why did you recall the car?",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:nitin-blame", READY],
          then: [{ id: "n-b1", from: "them", at: "01:26", typing: 7, text: "Tu… ye mujhse pooch raha hai?", english: "You're asking me this?" }],
        },
      ],
    },
    /* A stranger on Sameer's phone has to give him a reason. Each is one the player earned elsewhere. */
    {
      id: "nitin-reason",
      requires: ["did:nitin-stranger"],
      options: [
        {
          id: "raju",
          text: "Raju ke liye, Dilip ka bhai.",
          english: "For Raju, Dilip's brother.",
          any: ["did:raju-first-finding", "did:raju-told-shot", "did:promise-p2"],
          sets: ["did:nitin-for-raju", READY],
          then: [{ id: "n-r1", from: "them", at: "01:27", typing: 9, text: "…Theek hai. Ek cheez hai mere paas. Ruk.", english: "…Okay. I have something. Wait." }],
        },
        {
          id: "meera",
          text: "Meera ke liye.",
          english: "For Meera.",
          requires: ["did:meera-contact"],
          sets: ["did:nitin-for-meera", READY],
          then: [{ id: "n-r2", from: "them", at: "01:27", typing: 9, text: "…Theek hai. Ek cheez hai mere paas. Ruk.", english: "…Okay. I have something. Wait." }],
        },
        {
          id: "promise",
          text: "Tera naam kahin nahi aayega. Pakki.",
          english: "Your name won't come up anywhere. Promise.",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:promise-p1", READY],
          then: [{ id: "n-r3", from: "them", at: "01:27", typing: 9, text: "…Theek hai. Ek cheez hai mere paas. Ruk.", english: "…Okay. I have something. Wait." }],
        },
      ],
    },
  ],
};

export const threads: readonly Thread[] = [bhasin, meera, nitin];

export const events: readonly LiveEvent[] = [
  // 12:33: the day's data renews. iCloud, the App Store and Safari can reach the phone again.
  { id: "data-renewed", device: "owner", after: ["fired:title-2"], delay: 3, clock: "00:33", app: "messages", banner: "JIO · Your daily data quota of 1.5 GB has been renewed." },
  { id: "bhasin-vn", device: "owner", after: ["fired:data-renewed"], delay: 18, clock: "00:40", app: "whatsapp", banner: "Bhasin Uncle · 🎤 Voice message" },
  // Once Q4 is filed: M rings, at 12:51.
  { id: "meera-rings", device: "owner", after: ["ask:q4"], delay: 6, clock: "00:51", app: "phone" },
  { id: "meera-unblocks", device: "owner", after: ["did:done-meera"], delay: 4, clock: "00:55", app: "whatsapp", banner: "M · Block hata diya hai. Kuch bhejna ho toh yahan bhejna.", sets: ["did:meera-contact"] },
  { id: "raju-rings-2", device: "owner", after: ["fired:meera-unblocks"], delay: 14, clock: "01:05", app: "phone" },
  // Once Q5 is filed: Nitin, seeing the phone online.
  { id: "nitin-online", device: "owner", after: ["ask:q5"], delay: 6, clock: "01:25", app: "whatsapp", banner: "Nitin · Bhai? Online dikh raha hai." },
  { id: "nitin-copy", device: "owner", after: [READY], delay: 8, clock: "01:52", app: "whatsapp", banner: "Nitin · 📷 Photo" },
  // The bubble seen, or left a while: the episode freezes on it, and cuts to black.
  { id: "ep2-end", device: "owner", after: ["saw:nitin-152"], delay: 2, local: true, app: "whatsapp", sets: ["did:freeze-2"] },
  { id: "ep2-end-late", device: "owner", after: ["fired:nitin-copy"], unless: ["fired:ep2-end"], delay: 45, quiet: true, local: true, app: "whatsapp", sets: ["did:freeze-2"] },
];

/** The 1:52 bubble, held for a second and a half, then black (scene 2.11). */
export const dark: readonly Dark[] = [
  {
    id: "freeze-2",
    after: ["did:freeze-2"],
    bubble: {
      who: "Sameer Bhai",
      text: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.",
      english: "They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.",
      at: "01:52",
    },
    sets: ["ep:3"],
  },
];

export const episode2 = { beats, events, incoming, threads, dark };
