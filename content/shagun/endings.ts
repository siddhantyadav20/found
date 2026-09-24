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
      { who: "Raju", text: "Aapke post mein toh Kunal tha…", english: "Your post said it was Kunal…", needs: ["did:raju-told-truth"] },
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
      { text: "Kunal handed over a loaded gun. Sameer fired it, and lied at 1:52. Bhasin kept Dilip in a room with no doctor, and gave the orders before dawn; Sameer carried the jerrycan. Nitin believed what he was told." },
      { at: "Later", who: "Nitin", text: "Theek hai. Sach hai.", english: "All right. It's true.", needs: ["did:protect-nitin"] },
      { text: "Nitin's name is in it: the one person who tried.", unless: ["did:protect-nitin"] },
      { text: "Sameer's number stops existing on WhatsApp." },
    ],
    last: [{ who: "Raju", text: "📷 Dilip, at Chhath, Samastipur", needs: ["did:raju-trusts"] }, HELD_THE_LIGHT],
    onlyHere: "Nitin, reading his own name in it.",
  },
  {
    id: "version",
    row: "Sameer's Version",
    when: { acts: ["send", "post"] },
    lines: [
      { who: "Sameer", text: "Thank you. Tune wahi dekha jo hua tha.", english: "Thank you. You saw what happened.", unless: ["did:confronted-sameer"] },
      { who: "Meera", text: "Ye uska version hai. Par jo bhi likha hai, sach hai.", english: "This is his version. But everything in it is true.", needs: ["did:sent"] },
      { text: "It's shared widely, and it is almost all true.", needs: ["did:posted"] },
      { text: "The record names Bhasin for the car. Nitin is never asked anything." },
      { text: "You knew about 1:52. You left it out.", needs: ["did:left-out-lie"] },
      { text: "His boundary holds: “I caused the accident; they caused the death.”" },
    ],
    last: [HELD_THE_LIGHT],
    onlyHere: "What Sameer said when he said thank you.",
  },
  {
    id: "returned",
    row: "Return to Sender",
    when: { acts: ["return"] },
    lines: [
      { text: "You put the phone back in the parcel with the envelope, and send it back the way it came." },
      { text: "Whatever happened in Chhattarpur stays on it." },
    ],
    last: [{ text: "Four voice notes to M. One grey tick each.", needs: ["saw:vn-kunal"] }],
    onlyHere: "The parcel, closed again.",
  },
];
