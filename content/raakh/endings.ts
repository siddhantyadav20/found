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

/** The last image, saved or lost: a photograph from his brother, and, saved, the boy himself. */
const LAST_IMAGE: readonly EndingLine[] = [
  { who: "Raju", text: "📷 Dilip, awake, his hand in his brother's", src: "/found/raakh/dilip-awake.jpg", needs: ["did:saved"] },
  { who: "Raju", text: "Isko rakhna. Ab achhi photo hai.", english: "Keep this one. Now it's a good photo.", needs: ["did:saved"] },
  /* The last voice on the phone is his: to whoever had it, which is you. */
  { who: "Dilip", voice: "ending:dilip-thanks", text: "Jo bhi ye phone rakhta hai… shukriya. Sach mein.", english: "Whoever has this phone… thank you. Really.", needs: ["did:saved"] },
  { who: "Raju", text: "📷 Dilip at Chhath, Samastipur: a yellow kurta, squinting into the sun, laughing", src: "/found/raakh/dilip-chhath.jpg", needs: ["did:lost"] },
  { who: "Raju", text: "Isko rakhna. Jab tak woh mil nahi jaata.", english: "Keep this one. Until he's found.", needs: ["did:lost"] },
];

/** Weeks on, lost: the poster again, with the one line that's new. */
const WEEKS_LATER: readonly EndingLine[] = [
  {
    at: "Three weeks later",
    clock: "21:10",
    day: { day: "Sunday", date: "21/12" },
    who: "Raju",
    text: "Naya chhapwaya hai. Ek line badli hai.",
    english: "I've had a new one printed. One line's changed.",
    poster: {
      kind: "poster",
      src: "/found/raakh/poster-dilip.jpg",
      label: "LAPATA, printed again: Dilip Kumar Mahto, 19. Last seen alive: Fatehpur Beri, Delhi, 30 November.",
      heading: "लापता",
      subheading: "LAPATA · MISSING",
      name: "Dilip Kumar Mahto",
      lines: ["Umar 19 saal · Age 19", "Aakhri baar zinda dekha: Fatehpur Beri, 30 November", "Last seen alive: Fatehpur Beri, 30 November", "Ghar: Samastipur, Bihar"],
      contact: "Sampark: Raju (bhai) · +91 62••• •4417",
      marked: [1, 2],
    },
    needs: ["did:lost"],
  },
];

/* What the twist meant, said once at the end of the record: everybody edited the night. */
const EDITED: EndingLine = {
  text: "Sameer arranged this phone so his part would end before a death. Bhasin arranged the night so there would be a death for it to end before.",
  needs: ["did:knows-alive"],
};

/** The last line of every ending that knew his name. */
const HELD_THE_LIGHT: EndingLine = { text: "Dilip Kumar Mahto, 19. He held the light.", needs: ["did:named-dilip"] };

/*
 * Seven o'clock (2026-10-24): what the two calls bought. The record is put
 * to a name at 4:40 AM (story.finale), so the night splits around it: what
 * had already happened opens every ending, and the morning comes after the
 * record's own replies, in the order the clock gives it.
 */
const SEVEN_NIGHT: readonly EndingLine[] = [
  { at: "3:15 AM", text: "Your post had 900 shares by half past three. By then the back gate of Bedi Nursing Home had already opened, once.", needs: ["did:call-post"] },
  { at: "3:20 AM", text: "The SHO from the local station rang Bhasin before he rang anyone else.", needs: ["did:call-police"] },
  { at: "3:40 AM", text: "Dilip Kumar Mahto is alive. A DCP from Saket takes his statement at the bedside, a word at a time.", needs: ["did:saved"] },
  { at: "4:30 AM", who: "Sameer", text: "Main Sameer Khurrana hoon. Goli maine chalayi thi. 1:52 pe maine jhooth bola tha.", english: "I'm Sameer Khurrana. I fired the shot. At 1:52 I lied.", needs: ["did:saved", "did:sameer-went"] },
];

const SEVEN_MORNING: readonly EndingLine[] = [
  { at: "6:40 AM", who: "Raju", text: "Maa ko bata diya. Woh ro rahi hai. Is baar achha wala.", english: "I told Maa. She's crying. The good kind, this time.", needs: ["did:saved"] },
  { at: "6:58 AM", text: "A white Innova pulls out of the back gate of Bedi Nursing Home with its lights off. Room 6 has a new sheet on the bed, and a file with no name on it.", needs: ["did:lost"] },
  { who: "Sister Anita", text: "Le gaye. Kahan, nahi pata.", english: "They took him. Where, I don't know.", needs: ["did:lost"] },
  { who: "Sister Anita", text: "Unka phone bhi le gaye.", english: "They took his phone too.", needs: ["did:lost"] },
  { at: "7:00 AM", text: "A white Innova waits at the back gate of Bedi Nursing Home for a patient called Deepak. Nobody comes out.", needs: ["did:saved"] },
  { text: "Dilip Kumar Mahto is still missing. Raju prints the poster again, with one new line: last seen alive, Fatehpur Beri.", needs: ["did:lost"] },
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
const THE_TRAIN: readonly EndingLine[] = [
  { at: "4:55 PM", text: "Train 12952 leaves New Delhi for Mumbai Central. In coach B3, seat 41 is taken.", unless: ["did:sameer-went", "did:sameer-stayed"] },
  { at: "4:55 PM", text: "Sameer is on the 4:55, as he told you he would be.", needs: ["did:sameer-stayed"] },
];

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
      ...SEVEN_NIGHT,
      { text: "The post climbs. Kunal Sehgal's name is in every share." },
      ...SEVEN_MORNING,
      ...BHASIN_AFTER,
      ...THE_TRAIN,
      MUMMY_AFTER,
      // Monday, last: the turn comes after the day it went out.
      { at: "The next morning", clock: "09:10", day: { day: "Monday", date: "01/12" }, text: "The Sehgals release a frame from Kunal's video: Sameer with the gun, and Dilip behind the light." },
      { who: "The Sehgal family", text: "The wedding planner fired. Our son was forty metres away." },
      { text: "The story turns around in an hour. Your correction is shared a tenth as often as your post was." },
      { who: "Raju", text: "Aapke post mein toh Kunal tha…", english: "Your post said it was Kunal…", any: ["did:raju-told-truth", "did:raju-trusts"] },
      ...WEEKS_LATER,
    ],
    last: [...LAST_IMAGE, HELD_THE_LIGHT],
    onlyHere: "The frame, released by the people you'd named.",
  },
  {
    id: "complete",
    row: "The Complete Record",
    // The lie and the edit traced and left in, and nothing untraced passed off as fact.
    when: { acts: ["send", "post"], in: ["lie", "edit"], noFacts: true },
    lines: [
      ...SEVEN_NIGHT,
      { at: "4:48 AM", who: "Meera", text: "Ye complete hai. Isliye kisi ko pasand nahi aayega.", english: "It's complete. That's why nobody will like it.", needs: ["did:sent"] },
      // (game) T19: what it costs her to take it.
      { at: "4:52 AM", who: "Meera", text: "Aaj Saket mein file kar rahi hoon. Senior ne mana kiya hai. Phir bhi.", english: "I'm filing at Saket today. My senior told me not to. Even so.", needs: ["did:sent"] },
      { at: "5:05 AM", who: "Instagram · Sehgal & Associates", text: "This post is false and defamatory. Remove it within 24 hours.", needs: ["did:posted"] },
      { text: "The record holds: every line has its source.", needs: ["did:posted"] },
      { who: "Meera", text: "Phone mein kuch nahi badla. Achha kiya.", english: "Nothing on the phone changed. You did well.", needs: ["did:meera-preserved"] },
      { text: "Kunal handed over a loaded gun. Sameer fired it, and lied at 1:52. Bhasin kept Dilip in a room with no doctor, hid him under another name, and let Sameer burn a mattress believing it was a boy. The one man who sent a car believed what he was told." },
      { at: "Later", clock: "05:12", who: "Nitin", text: "Mera naam nahi hai. …Par sach hai. Shukriya.", english: "My name isn't in it. …But it's true. Thank you.", needs: ["did:protect-nitin", "did:kept-witness"] },
      { at: "Later", clock: "05:12", who: "Nitin", text: "Theek hai. Sach hai.", english: "All right. It's true.", needs: ["did:protect-nitin"], unless: ["did:named-witness", "did:kept-witness"] },
      { text: "Nitin reads his own name in it. You'd promised him it wouldn't be there.", needs: ["did:promised-nitin", "did:named-witness"] },
      { text: "Nitin's name is in it: the one person who tried.", needs: ["did:named-witness"], unless: ["did:promised-nitin"] },
      // (game) T22: what naming him costs, before anyone official has asked him anything.
      { at: "5:30 AM", who: "Nitin", text: "Bhasin ke log ghar aaye the. Maa ro rahi hai.", english: "Bhasin's people came to my house. Ma is crying.", needs: ["did:named-witness"] },
      ...SEVEN_MORNING,
      ...BHASIN_AFTER,
      EDITED,
      { text: "Sameer's number stops existing on WhatsApp.", unless: ["did:sameer-went"] },
      ...THE_TRAIN,
      MUMMY_AFTER,
      ...WEEKS_LATER,
    ],
    last: [...LAST_IMAGE, HELD_THE_LIGHT],
    onlyHere: "1:52, in the record, under your name.",
  },
  {
    id: "version",
    row: "Sameer's Version",
    when: { acts: ["send", "post"] },
    lines: [
      ...SEVEN_NIGHT,
      { who: "Sameer", text: "Thank you. Tune wahi dekha jo hua tha.", english: "Thank you. You saw what happened.", unless: ["did:confronted-sameer"] },
      { at: "4:48 AM", who: "Meera", text: "Ye uska version hai. Par jo bhi likha hai, sach hai.", english: "This is his version. But everything in it is true.", needs: ["did:sent"] },
      { text: "It's shared widely, and it is almost all true.", needs: ["did:posted"] },
      { text: "The record names Bhasin for the car. Nobody asks the man who sent it why he turned it round." },
      { text: "You knew about 1:52. You left it out.", needs: ["did:left-out-lie"] },
      ...SEVEN_MORNING,
      ...BHASIN_AFTER,
      { text: "His boundary holds: “I caused the accident; they caused the death.”", unless: ["did:knows-alive"] },
      { text: "His boundary holds: “I caused the accident; they caused the rest.” Nobody asks him what the rest was.", needs: ["did:knows-alive"] },
      ...THE_TRAIN,
      MUMMY_AFTER,
      ...WEEKS_LATER,
    ],
    last: [...LAST_IMAGE, HELD_THE_LIGHT],
    onlyHere: "What Sameer said when he said thank you.",
  },
  {
    id: "returned",
    row: "Return to Sender",
    when: { acts: ["return"] },
    lines: [
      ...SEVEN_NIGHT,
      ...SEVEN_MORNING,
      { text: "In the morning you tape the parcel shut, with the envelope inside, and write across the label: not the sender." },
      { text: "The courier takes it back. It goes to the hub, onto a shelf of parcels nobody will claim.", unless: ["did:bhasin-yes"] },
      { text: "The courier takes it back. By noon it's gone from the hub. Nobody signs for it.", needs: ["did:bhasin-yes"] },
      { text: "Whatever happened in Chhattarpur stays on it." },
      ...WEEKS_LATER,
    ],
    last: [{ text: "Four voice notes to M. One grey tick each.", needs: ["saw:vn-kunal"] }],
    onlyHere: "A shelf of parcels nobody will claim.",
  },
];
