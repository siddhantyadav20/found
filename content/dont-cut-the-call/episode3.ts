import type { CallCue, Evidence, IncomingCall, LiveEvent, Message, Question, Thread } from "../types";

/* ===========================================================================
   Episode 3 — "10:30" · Saturday morning.

   The player wakes up holding somebody else's phone with forty hours of call
   on it. Two things arrived while they slept: the real article, published at
   6:42 AM — five and a half hours after the "alert" they read at 1:11 — and a
   thank-you from a man she saved at 9 o'clock, addressed to a woman who has
   been dead since midnight.

   Then their own phone rings, and everything the officer says about them is
   something they did last night (CHAPTER1.md, twist 6).
   =========================================================================== */

export const evidence: Evidence[] = [
  { id: "published", device: "hers", app: "news", label: "The real article, published at 6:42 AM", requires: ["ep:3"] },
  { id: "dsouza", device: "hers", app: "whatsapp", label: "A thank-you to a woman who died at midnight", requires: ["ep:3"] },
  { id: "removed", device: "hers", app: "settings", label: "You removed the profile that was watching", requires: ["did:removed-profile"], manual: true },
];

/** What arrived while the player slept. */
export const messages: Thread[] = [
  {
    id: "dsouza",
    app: "whatsapp",
    name: "C. D'Souza",
    sub: "+91 98204 11902",
    requires: ["ep:3"],
    messages: [
      {
        id: "d-1",
        from: "them",
        text: "Aunty, subah 9 baje SkyEx ka call aaya. Parcel, Taiwan, wahi sab. Maine kaat diya.",
        english: "Aunty, at 9 this morning I got the courier call. A parcel, Taiwan, all of it. I cut the call.",
        at: "10:12",
        day: "Saturday",
      },
      {
        id: "d-2",
        from: "them",
        text: "Aapne kal raat phone karke bachaya. Thank you 🙏 God bless you.",
        english: "You saved me by ringing last night. Thank you 🙏 God bless you.",
        at: "10:12",
        day: "Saturday",
        evidence: "dsouza",
      },
      { id: "d-3", from: "system", text: "Delivered", at: "10:12", day: "Saturday" },
    ] as Message[],
  },
];

export const cues: CallCue[] = [
  {
    id: "ep3-open",
    when: "ep:3",
    speaker: "rathore",
    line: "Madam, good morning. Aaj file close ho jayegi.",
    english: "Madam, good morning. The file will be closed today.",
    supervisorPresent: true,
  },
  {
    id: "ep3-gone",
    when: "did:removed-profile",
    speaker: "supervisor",
    line: "Screen gaya. Call kaat.",
    english: "The screen's gone. Cut the call.",
    supervisorPresent: true,
  },
];

export const events: LiveEvent[] = [
  {
    id: "morning",
    device: "hers",
    after: ["ep:3"],
    delay: 4,
    app: "news",
    banner: "City Desk · Dadar death: police say no foul play suspected (published 6:42 AM)",
    sets: ["saw:published"],
  },
];

/**
 * The arrest, done to the player.
 *
 * Every line with `needs` is read only when the ledger holds that thing, so
 * the charge sheet is assembled out of the player's own night. A player who
 * gave them nothing hears a call made entirely of bluffs — and that is the
 * only version in which Sahil can risk the longer code.
 */
export const incoming: IncomingCall[] = [
  {
    id: "arrest",
    device: "yours",
    from: "Mumbai Crime Branch ✔",
    sub: "WhatsApp video · 10:30 AM",
    at: "10:30",
    after: ["ep:3", "did:woke"],
    insists: true,
    lines: [
      {
        who: "Inspector Rathore",
        line: "Sir, aapke ghar pe 1:11 AM ko ek mrit mahila ka phone deliver hua hai. Building ka CCTV hai.",
        english: "Sir, a dead woman's phone was delivered to your home at 1:11 AM. There is building CCTV.",
      },
      {
        who: "Inspector Rathore",
        line: "Aapne raat 3:02 baje unke account se ek lakh transfer kiya.",
        english: "At 3:02 AM you transferred one lakh from her account.",
        needs: "pin",
      },
      {
        who: "Inspector Rathore",
        line: "Aapki awaaz hamare paas recorded hai.",
        english: "We have your voice on record.",
        needs: "voice",
      },
      {
        who: "Inspector Rathore",
        line: "Aapne ek gawah ko sampark kiya — Shaila Joshi, Shivaji Park.",
        english: "You contacted a witness — Shaila Joshi, Shivaji Park.",
        needs: "shaila",
      },
      {
        who: "Inspector Rathore",
        line: "Aapne mrit mahila ke bete se baat ki aur jhooth bola.",
        english: "You spoke to the dead woman's son, and you lied.",
        needs: "nikhil",
      },
      {
        who: "Inspector Rathore",
        line: "Aapka case number hai… one… nine… three… zero.",
        english: "Your case number is… one… nine… three… zero.",
      },
      {
        who: "Supervisor, off camera",
        line: "Phone leke Andheri East aao. Ek baje tak. Call mat kaatna, aur kisi ko mat batana.",
        english: "Bring the phone to Andheri East. By one o'clock. Don't cut the call, and don't tell anyone.",
      },
    ],
    dismiss: "Check it on her phone, while he talks",
    sets: ["did:arrested"],
  },
];

export const questions: Question[] = [
  {
    kind: "claims",
    id: "against-you",
    ask: "He has just read out a charge sheet. Which parts of it are true?",
    episode: 3,
    whereToLook: ["messages", "phone", "whatsapp", "settings"],
    hints: [
      "Check each one on her phone while he is still talking. That is what she would have done.",
      "The bank's own messages, the call log, and her chats will settle every line of it.",
      "The true ones are the ones you did last night. Everything else is a guess he is making to see what you admit to.",
    ],
    claims: [
      {
        id: "delivered",
        text: "A dead woman's phone was delivered to your door at 1:11 AM.",
        trueWhen: ["did:unlock"],
        proof: "note",
      },
      { id: "transfer", text: "You moved ₹1,00,000 out of her account at 3:02 AM.", trueWhen: ["did:typed-password"], proof: "the-lakh" },
      { id: "voice", text: "They have your voice.", trueWhen: ["did:unmuted"], proof: "call" },
      { id: "witness", text: "You contacted a witness.", trueWhen: ["did:shaila-told"], proof: "shaila-asks" },
      { id: "son", text: "You lied to her son.", trueWhen: ["did:nikhil-lied"], proof: "last-call-son" },
      { id: "inside", text: "You were inside the building in Dadar last night.", proof: "watchman" },
    ],
    reply:
      "The scam is fake. The evidence isn't. Everything he can prove is something you did while you were trying to help her — and the one thing he invented is the one you can disprove.",
    sets: ["did:checked-charges"],
  },
  {
    kind: "type",
    id: "case-number",
    ask: "He gave you a case number. What was he actually telling you?",
    episode: 3,
    whereToLook: ["phone", "casefile"],
    hints: [
      "No case number in India is four digits long.",
      "She rang the same four digits at 9:48 last night, and held for twenty-four minutes.",
      "1930 is the national cyber-fraud helpline. He was telling you to hang up and call it — with his supervisor sitting behind him.",
    ],
    accepts: ["1930", "the helpline", "cyber helpline", "call 1930", "hang up and call 1930", "one nine three zero"],
    reply:
      "1930. The helpline. He read it out as a case number with his supervisor in the room, which is the third time tonight he has risked himself for somebody he has never met.",
    sets: ["did:got-code", "did:choice"],
  },
];
