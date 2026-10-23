import type { Ending, EndingLine } from "../types";

/* ===========================================================================
   The endings (CHAPTER1.md I), each reached by an act:
   A · The Complete Record, B · Sameer's Version, C · The Wrong Story, and
   the early exit, Return to Sender, chosen from the case file since
   2026-10-23. The first whose rule fits is the one.

   No ending declares a verdict (script §18): formal outcomes stay outside the
   game. Each reads the player's night back through what they did: NITIN,
   RAJU, MEERA, SAMEER, PUBLIC (posted, not sent), and what the record held.
   =========================================================================== */

/** The last line of every ending that knew his name. */
const HELD_THE_LIGHT: EndingLine = { text: "Dilip Kumar Mahto, 19. He held the light.", needs: ["did:named-dilip"] };

/** What his brother was told, or wasn't, the morning after. */
const RAJU_AFTER: readonly EndingLine[] = [
  { at: "In the morning", clock: "06:40", who: "Raju", text: "Maa ko bata diya.", english: "I told Maa.", needs: ["did:told-raju"] },
  { at: "In the morning", clock: "06:40", text: "Raju's last message is still “Main jaag raha hoon.”", english: "I'm awake.", needs: ["did:kept-raju-waiting"] },
];

/** Bhasin, who had the phone on a map: whether the map still led anywhere. */
const BHASIN_AFTER: readonly EndingLine[] = [
  {
    at: "7:00 AM",
    text: "A man in a grey safari suit asks your building's guard about a parcel. The guard says nothing came.",
    needs: ["fired:bhasin-near"],
    unless: ["did:airplane", "did:done-guard-calls"],
  },
  /* The man the guard turned away at 2:40 (T12), back as he said he'd be. */
  {
    at: "7:00 AM",
    who: "Gate 2 · Guard",
    text: "Ji, woh safari suit wala phir aaya tha. Maine bola aap bahar gaye ho. Aapka naam ek parchi pe likh ke le gaya.",
    english: "The man in the safari suit came again. I said you'd gone out. He wrote your name on a slip and took it with him.",
    needs: ["did:done-guard-calls"],
  },
  { at: "7:00 AM", text: "Nobody comes. The last place the phone was seen online is a road away from yours.", needs: ["did:airplane", "fired:bhasin-rings"] },
];

/** The train in his Mail, Sunday afternoon. Nobody on this phone says who's in it. */
const THE_TRAIN: EndingLine = { at: "4:55 PM", text: "Train 12952 leaves New Delhi for Mumbai Central. In coach B3, seat 41 is taken." };

/** (game) T18: who his leaving costs, on the phone still face-down on your table. */
const MUMMY_AFTER: EndingLine = {
  at: "7:40 PM",
  who: "On his phone · Mummy",
  text: "Beta, Bhasin uncle bol rahe the tu Mumbai chala gaya. Bina bataye?",
  english: "Beta, Bhasin uncle says you've gone to Mumbai. Without telling me?",
};

export const endings: readonly Ending[] = [
  {
    id: "wrong",
    row: "The Wrong Story",
    // Posted before the two firings were told apart (canon).
    when: { acts: ["post"], untraced: ["two-firings"] },
    lines: [
      { text: "The post climbs. Kunal Sehgal's name is in every share." },
      { at: "The next morning", text: "The Sehgals release a frame from Kunal's video: Sameer with the gun, and Dilip behind the light." },
      { who: "The Sehgal family", text: "The wedding planner fired. Our son was forty metres away." },
      { text: "The story turns around in an hour. Your correction is shared a tenth as often as your post was." },
      { who: "Raju", text: "Aapke post mein toh Kunal tha…", english: "Your post said it was Kunal…", any: ["did:raju-told-truth", "did:raju-trusts"] },
      ...BHASIN_AFTER,
      THE_TRAIN,
      MUMMY_AFTER,
    ],
    last: [HELD_THE_LIGHT],
    onlyHere: "The frame, released by the people you'd named.",
  },
  {
    id: "complete",
    row: "The Complete Record",
    // The lie and the edit traced and left in, and nothing untraced passed off as fact.
    when: { acts: ["send", "post"], in: ["lie", "edit"], noFacts: true },
    lines: [
      { who: "Meera", text: "Ye complete hai. Isliye kisi ko pasand nahi aayega.", english: "It's complete. That's why nobody will like it.", needs: ["did:sent"] },
      // (game) T19: what it costs her to take it.
      { at: "3:20 AM", who: "Meera", text: "Kal Saket mein file kar rahi hoon. Senior ne mana kiya hai. Phir bhi.", english: "I'm filing at Saket tomorrow. My senior told me not to. Even so.", needs: ["did:sent"] },
      { at: "3:40 AM", who: "Instagram · Sehgal & Associates", text: "This post is false and defamatory. Remove it within 24 hours.", needs: ["did:posted"] },
      { text: "The record holds: every line has its source.", needs: ["did:posted"] },
      { who: "Meera", text: "Phone mein kuch nahi badla. Achha kiya.", english: "Nothing on the phone changed. You did well.", needs: ["did:meera-preserved"] },
      { text: "Kunal handed over a loaded gun. Sameer fired it, and lied at 1:52. Bhasin kept Dilip in a room with no doctor, and gave the orders before dawn; Sameer carried the jerrycan. The one man who sent a car believed what he was told." },
      { at: "Later", clock: "05:12", who: "Nitin", text: "Mera naam nahi hai. …Par sach hai. Shukriya.", english: "My name isn't in it. …But it's true. Thank you.", needs: ["did:protect-nitin", "did:kept-witness"] },
      { at: "Later", clock: "05:12", who: "Nitin", text: "Theek hai. Sach hai.", english: "All right. It's true.", needs: ["did:protect-nitin"], unless: ["did:named-witness", "did:kept-witness"] },
      { text: "Nitin reads his own name in it. You'd promised him it wouldn't be there.", needs: ["did:promised-nitin", "did:named-witness"] },
      { text: "Nitin's name is in it: the one person who tried.", needs: ["did:named-witness"], unless: ["did:promised-nitin"] },
      // (game) T22: what naming him costs, before anyone official has asked him anything.
      { at: "5:30 AM", who: "Nitin", text: "Bhasin ke log ghar aaye the. Maa ro rahi hai.", english: "Bhasin's people came to my house. Ma is crying.", needs: ["did:named-witness"] },
      ...RAJU_AFTER,
      ...BHASIN_AFTER,
      { text: "Sameer's number stops existing on WhatsApp." },
      THE_TRAIN,
      MUMMY_AFTER,
    ],
    last: [
      { who: "Raju", text: "📷 Dilip at Chhath, Samastipur: a yellow kurta, squinting into the sun, laughing", src: "/found/raakh/dilip-chhath.jpg", needs: ["did:told-raju"] },
      { who: "Raju", text: "Isko rakhna. Uski yahi achhi photo hai.", english: "Keep this one. It's his only good photo.", needs: ["did:told-raju"] },
      HELD_THE_LIGHT,
    ],
    onlyHere: "1:52, in the record, under your name.",
  },
  {
    id: "version",
    row: "Sameer's Version",
    when: { acts: ["send", "post"] },
    lines: [
      { who: "Sameer", text: "Thank you. Tune wahi dekha jo hua tha.", english: "Thank you. You saw what happened.", unless: ["did:confronted-sameer"] },
      { who: "Meera", text: "Ye uska version hai. Par jo bhi likha hai, sach hai.", english: "This is his version. But everything in it is true.", needs: ["did:sent"] },
      { text: "It's shared widely, and it is almost all true.", needs: ["did:posted"] },
      { text: "The record names Bhasin for the car. Nobody asks the man who sent it why he turned it round." },
      { text: "You knew about 1:52. You left it out.", needs: ["did:left-out-lie"] },
      ...RAJU_AFTER,
      ...BHASIN_AFTER,
      { text: "His boundary holds: “I caused the accident; they caused the death.”" },
      THE_TRAIN,
      MUMMY_AFTER,
    ],
    last: [HELD_THE_LIGHT],
    onlyHere: "What Sameer said when he said thank you.",
  },
  {
    id: "returned",
    row: "Return to Sender",
    when: { acts: ["return"] },
    lines: [
      { text: "In the morning you tape the parcel shut, with the envelope inside, and write across the label: not the sender." },
      { text: "The courier takes it back. It goes to the hub, onto a shelf of parcels nobody will claim.", unless: ["did:bhasin-yes"] },
      { text: "The courier takes it back. By noon it's gone from the hub. Nobody signs for it.", needs: ["did:bhasin-yes"] },
      { text: "Whatever happened in Chhattarpur stays on it." },
      { text: "Raju's last message is still “Main jaag raha hoon.”", english: "I'm awake.", needs: ["did:kept-raju-waiting"] },
    ],
    last: [{ text: "Four voice notes to M. One grey tick each.", needs: ["saw:vn-kunal"] }],
    onlyHere: "A shelf of parcels nobody will claim.",
  },
];
