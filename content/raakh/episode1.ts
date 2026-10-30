import type { Beat, IncomingCall, LiveEvent, Thread } from "../types";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 1 — "Missed Calls" (RAAKH-V3 §7). Saturday 28 November, 11:40 PM
   to about 12:13 AM; the battery 9% to 2% to dead. Whose phone this is, who
   is missing, and Sameer's version of events.

   The clock moves only at these beats (§5): the phone waking, Raju ringing,
   the case file made, each question filed, Find My, Bhasin, the death.
   =========================================================================== */

export const beats: readonly Beat[] = [
  // 11:44: the case file is made, as a note on this iPhone (IC4).
  { at: "23:44", after: ["did:past-lock"] },
  { at: "23:52", after: ["ask:q1"] },
  { at: "00:00", after: ["ask:q2"] },
  { at: "00:10", after: ["ask:q3"] },
];

/** Raju, six seconds after the phone wakes: the number that has rung 47 times (scene 1.4). */
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
      { who: "Raju", line: "…Hello? Aap kaun? Ye Sameer bhaiya ka phone hai na?", english: "Who are you? This is Sameer bhaiya's phone, isn't it?" },
      { who: "Raju", line: "…Dilip kahan hai?", english: "Where's Dilip?" },
    ],
    reply: {
      id: "raju-call",
      options: [
        {
          id: "denial",
          text: "Main Sameer nahi hoon. Ye phone mere paas aaya hai.",
          english: "I'm not Sameer. This phone came to me.",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:raju-first-denial"],
          then: [{ id: "rc-1", from: "them", at: "23:42", text: "Toh Sameer bhaiya kahan hain? Saat din se phone kar raha hoon.", english: "Then where is he? I've called for seven days." }],
        },
        {
          id: "finding",
          text: "Main pata kar raha hoon. Thoda waqt do.",
          english: "I'm finding out. Give me some time.",
          impulse: { side: "confessor", weight: 1 },
          sets: ["did:raju-first-finding"],
          then: [{ id: "rc-2", from: "them", at: "23:42", text: "Waqt? Saat din ho gaye… Theek hai. Main phir karunga.", english: "Time? It's been seven days… Fine. I'll call again." }],
        },
        {
          id: "whos",
          text: "Dilip kaun?",
          english: "Who's Dilip?",
          impulse: { side: "auditor", weight: 2 },
          sets: ["did:raju-first-whos"],
          then: [{ id: "rc-3", from: "them", at: "23:42", text: "Dilip kaun? DILIP KAUN?", english: "Who's Dilip? WHO'S DILIP?" }],
        },
      ],
    },
  },
];

/* Raju, let ring out, writes instead; Mummy, once Find My has played its
   sound (scene 1.10); Bhasin, as the phone dies (scene 1.11). */
export const threads: readonly Thread[] = [
  {
    id: "raju",
    app: "whatsapp",
    name: RAJU,
    messages: [
      { id: "r-5", from: "them", at: "23:42", day: "Saturday", with: "raju-text", requires: ["fired:raju-text"], text: "Aap jo bhi ho, Dilip kahan hai?", english: "Whoever you are, where's Dilip?" },
    ],
  },
  {
    id: "mummy",
    app: "whatsapp",
    name: "Mummy",
    messages: [
      {
        id: "mu-6",
        from: "them",
        at: "00:02",
        day: "29/11",
        with: "mummy-findmy",
        requires: ["fired:mummy-findmy"],
        text: "Beta, maine phone dhoondhne wala button daba diya. Location on dikh rahi hai. Tu theek hai na? Bhasin uncle ka phone aaya tha, pooch rahe the.",
        english: "I pressed the find-phone button. The location's showing. You're okay, right? Bhasin uncle called, asking.",
        evidence: "mummy-findmy",
      },
      /* What her phone showed her (fix brief §6, Episode 2's door): the pin on
         Bhasin's gift, at B-14, Gate 2 side. Where this phone is now. */
      {
        id: "mu-6p",
        from: "them",
        at: "00:02",
        day: "29/11",
        with: "mummy-findmy",
        requires: ["fired:mummy-findmy"],
        attachment: {
          kind: "photo",
          label: "A screenshot of Find My on Mummy's phone: “Sameer's iPhone”, one pin, B-14 Navjeevan Apartments, Gate 2 side, Malviya Nagar, Now",
          map: { title: "Sameer's iPhone", sub: "Find My · Mummy's iPhone", stop: "B-14 Navjeevan Apts · Gate 2 side", ended: "Malviya Nagar · Now", area: "Navjeevan Apts", road: "Gate 2", pin: true },
        },
        text: "Ye dikh raha hai. Ghar pe hi hai na?",
        english: "This is what it shows. You're at home, aren't you?",
        evidence: "mummy-pin",
      },
      { id: "mu-9", from: "them", at: "00:10", day: "29/11", with: "mummy-silent", requires: ["fired:mummy-silent"], text: "Seen kar ke bhi reply nahi?", english: "Seen, and no reply?" },
    ],
    replies: [
      {
        id: "mummy-reply",
        requires: ["fired:mummy-findmy"],
        unless: ["fired:mummy-silent"],
        options: [
          {
            id: "stranger",
            text: "Aunty, main Sameer nahi hoon.",
            english: "Aunty, I'm not Sameer.",
            impulse: { side: "auditor", weight: 2 },
            sets: ["did:mummy-stranger"],
            then: [{ id: "mu-7", from: "them", at: "00:03", day: "29/11", text: "Aunty? …Beta, tu kya bol raha hai? Tu theek hai? Main Bhasin uncle ko bolti hoon.", english: "Aunty? …What are you saying? Are you okay? I'll tell Bhasin uncle." }],
          },
          {
            id: "fine",
            text: "Main theek hoon, Mummy.",
            english: "I'm fine, Mummy.",
            impulse: { side: "confessor", weight: 1 },
            sets: ["did:mummy-fine"],
            then: [{ id: "mu-8", from: "them", at: "00:03", day: "29/11", text: "Achha. Khana kha lena. Uncle ko bata deti hoon.", english: "Good. Eat something. I'll tell uncle." }],
          },
        ],
      },
    ],
  },
  {
    id: "bhasin",
    app: "whatsapp",
    name: "Bhasin Uncle",
    messages: [
      { id: "b-home", from: "them", at: "00:12", day: "29/11", with: "bhasin-home", requires: ["fired:bhasin-home"], text: "Ghar pe hi hai. Achha hai.", english: "It's at home. Good." },
      {
        id: "b-dark",
        from: "them",
        at: "00:12",
        day: "29/11",
        with: "bhasin-dark",
        requires: ["fired:bhasin-dark"],
        text: "Phone band kar diya? Koi baat nahi. Ghar ka pata hai.",
        english: "Switched it off? Doesn't matter. I know the house.",
      },
    ],
  },
];

export const events: readonly LiveEvent[] = [
  { id: "raju-rings", device: "owner", after: ["did:unlock"], delay: 6, clock: "23:41", app: "phone" },
  { id: "raju-text", device: "owner", after: ["did:declined-raju"], delay: 4, clock: "23:42", app: "whatsapp", banner: `${RAJU} · Aap jo bhi ho, Dilip kahan hai?` },
  // After Q2, at 12:02: somebody plays a sound on the phone to find it, and his mother writes.
  { id: "find-my", device: "owner", after: ["ask:q2"], delay: 4, clock: "00:02", app: "settings", icon: "findmy", banner: "Find My · A sound was played on this iPhone." },
  { id: "mummy-findmy", device: "owner", after: ["fired:find-my"], delay: 8, clock: "00:02", app: "whatsapp", banner: "Mummy · Beta, maine phone dhoondhne wala button daba diya." },
  // Left unanswered by the time the list is found, she says so: Bhasin hears "none".
  {
    id: "mummy-silent",
    device: "owner",
    after: ["ask:q3", "fired:mummy-findmy"],
    unless: ["did:mummy-stranger", "did:mummy-fine"],
    delay: 2,
    clock: "00:10",
    app: "whatsapp",
    banner: "Mummy · Seen kar ke bhi reply nahi?",
    sets: ["did:mummy-none"],
  },
  // After Q3, at 12:12: the man who has the phone on his map.
  { id: "bhasin-home", device: "owner", after: ["ask:q3"], unless: ["did:went-dark"], delay: 6, clock: "00:12", app: "whatsapp", banner: "Bhasin Uncle · Ghar pe hi hai. Achha hai." },
  // The phone went dark on him before it could die (airplane mode): he says what he knows instead.
  { id: "bhasin-dark", device: "owner", after: ["ask:q3", "did:went-dark"], unless: ["fired:bhasin-home"], delay: 6, clock: "00:12", app: "whatsapp", banner: "Bhasin Uncle · Phone band kar diya? Koi baat nahi. Ghar ka pata hai." },
  // 12:13: it dies, whatever else is happening, airplane mode or not (PG-DEATH).
  {
    id: "dying",
    device: "owner",
    after: ["ask:q3"],
    delay: 16,
    local: true,
    clock: "00:13",
    app: "settings",
    icon: "settings",
    banner: "Low Battery · 2% of battery remaining",
    sets: ["did:needs-charge"],
  },
];

export const episode1 = { beats, events, incoming, threads };
