import type { Ending, EndingLine } from "../types";

/* ===========================================================================
   The endings (CHAPTER1.md I), each reached by an act on your phone:
   A · The Complete Record, B · Sameer's Version, C · The Wrong Story, and
   the early exit, Return to Sender. The first whose rule fits is the one.

   No ending declares a verdict (script §18): formal outcomes stay outside the
   game. Each reads the player's night back through what they did: NITIN,
   RAJU, MEERA, SAMEER, PUBLIC (posted, not sent), and what the record held.
   =========================================================================== */

/** The last line of every ending that knew his name. */
const HELD_THE_LIGHT: EndingLine = { text: "Dilip Kumar Mahto, 19. He held the light.", needs: ["did:named-dilip"] };

/** What his brother was told, or wasn't, the morning after. */
const RAJU_AFTER: readonly EndingLine[] = [
  { at: "In the morning", who: "Raju", text: "Maa ko bata diya.", english: "I told Maa.", needs: ["did:told-raju"] },
  { at: "In the morning", text: "Raju's last message is still “Main jaag raha hoon.”", english: "I'm awake.", needs: ["did:kept-raju-waiting"] },
];

/** Bhasin, who had the phone on a map: whether the map still led anywhere. */
const BHASIN_AFTER: readonly EndingLine[] = [
  {
    at: "7:00 AM",
    text: "A man in a grey safari suit asks your building's guard about a parcel. The guard says nothing came.",
    needs: ["fired:bhasin-near"],
    unless: ["did:airplane"],
  },
  { at: "7:00 AM", text: "Nobody comes. The last place the phone was seen online is a road away from yours.", needs: ["did:airplane", "fired:bhasin-rings"] },
];

/** The train in his Mail, Sunday afternoon. Nobody on this phone says who's in it. */
const THE_TRAIN: EndingLine = { at: "4:55 PM", text: "Train 12952 leaves New Delhi for Mumbai Central. In coach B3, seat 41 is taken." };

export const endings: readonly Ending[] = [
  {
    id: "wrong",
    row: "The Wrong Story",
    // Posted before the two firings were told apart (canon).
    when: { acts: ["post"], untraced: ["two-firings"] },
    lines: [
      { text: "The post climbs. Kunal Sehgal's name is in every share." },
      { at: "The next morning", text: "The Sehgals release a frame from Kunal's video: Sameer with the gun, and Dilip behind the light." },
      { who: "The Sehgal family", text: "The photographer fired. Our son was forty metres away." },
      { text: "The story turns around in an hour. Your correction is shared a tenth as often as your post was." },
      { who: "Raju", text: "Aapke post mein toh Kunal tha…", english: "Your post said it was Kunal…", any: ["did:raju-told-truth", "did:raju-trusts"] },
      ...BHASIN_AFTER,
      THE_TRAIN,
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
      { text: "Within the hour, the Sehgals' lawyers answer the post. The record holds: every line has its source.", needs: ["did:posted"] },
      { who: "Meera", text: "Phone mein kuch nahi badla. Achha kiya.", english: "Nothing on the phone changed. You did well.", needs: ["did:meera-preserved"] },
      { text: "Kunal handed over a loaded gun. Sameer fired it, and lied at 1:52. Bhasin kept Dilip in a room with no doctor, and gave the orders before dawn; Sameer carried the jerrycan. A friend with a car believed what he was told." },
      { at: "Later", who: "Nitin", text: "Theek hai. Sach hai.", english: "All right. It's true.", needs: ["did:protect-nitin"], unless: ["did:named-witness"] },
      { text: "Nitin reads his own name in it. You'd promised him it wouldn't be there.", needs: ["did:promised-nitin", "did:named-witness"] },
      { text: "Nitin's name is in it: the one person who tried.", needs: ["did:named-witness"], unless: ["did:promised-nitin"] },
      ...RAJU_AFTER,
      ...BHASIN_AFTER,
      { text: "Sameer's number stops existing on WhatsApp." },
      THE_TRAIN,
    ],
    last: [
      { who: "Raju", text: "📷 Dilip, at Chhath, Samastipur", needs: ["did:told-raju"] },
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
      { text: "The record names Bhasin for the car. Nobody asks the friend who sent it why he turned it round." },
      { text: "You knew about 1:52. You left it out.", needs: ["did:left-out-lie"] },
      ...RAJU_AFTER,
      ...BHASIN_AFTER,
      { text: "His boundary holds: “I caused the accident; they caused the death.”" },
      THE_TRAIN,
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
