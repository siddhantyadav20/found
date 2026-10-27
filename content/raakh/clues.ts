import type { Clue } from "../types";

/* ===========================================================================
   The identity clues (RAAKH-V3 §15): everything that said whose door this
   was, before the camera did. "Look again" lists them with when the player
   first saw each; the end card counts the ones they walked past.

   The target is that about one in five blind players suspects before 3:58
   AM. The dials, if playtests miss it, are IC1, IC3 and IC5 (§19).
   =========================================================================== */

export const clues: readonly Clue[] = [
  { id: "IC1", what: "The waybill's sender address is the address on his Apple Account.", where: "The parcel · Settings", seen: [["saw:waybill", "saw:apple-account"]], meant: "B-14 Navjeevan Apartments, Malviya Nagar: it was returned to origin, and the origin is your door." },
  { id: "IC2", what: "Find My: This iPhone · Home · Malviya Nagar.", where: "Settings", seen: [["saw:find-my"]], meant: "The phone was at home. Its home." },
  { id: "IC3", what: "A silver kada on the hand that pulled the strip.", where: "The parcel", seen: [["did:opened"]], meant: "The same kada is on the gun hand at 12:29 and on the hand at the fire." },
  { id: "IC4", what: "The case file's header: “On this iPhone · Today 11:44 PM”.", where: "Case file", seen: [["did:case-opened"]], meant: "It was written on this phone, tonight, by whoever was holding it." },
  { id: "IC5", what: "Bhasin: “Ghar pe hi hai. Achha hai.”", where: "WhatsApp", seen: [["fired:bhasin-home"]], meant: "It's at home. Bhasin was watching it on his mother's map, and it hadn't moved." },
  { id: "IC6", what: "Mummy: “Aunty? …Beta, tu kya bol raha hai?”", where: "WhatsApp", seen: [["did:mummy-stranger"]], meant: "She was talking to her son." },
  { id: "IC7", what: "A shape in the black glass as the phone died.", where: "The phone dying", seen: [["did:death-seen"]], meant: "Whoever held it, reflected." },
  { id: "IC8", what: "The kada again, on the hand plugging in the charger.", where: "The charger", seen: [["did:charged"]], meant: "The same hand, between episodes." },
  { id: "IC9", what: "The kada on the gun hand at 12:29.", where: "Photos", seen: [["saw:bts"]], meant: "Sameer's hand. Yours." },
  { id: "IC10", what: "Bhasin: “Achha natak hai.”", where: "WhatsApp", seen: [["fired:bhasin-vn", "did:mummy-stranger"]], meant: "Nice act. He knew who was answering." },
  { id: "IC11", what: "Meera's pause after “Sameer—”, and “Aap jo bhi ho.”", where: "Phone", seen: [["did:done-meera"]], meant: "She knew the voice from the first word." },
  { id: "IC12", what: "Nitin: “Ye tera hi message hai.”", where: "WhatsApp", seen: [["fired:nitin-copy", "did:nitin-care"]], meant: "This is your own message." },
  { id: "IC13", what: "Kunal: “Haan haan. Aur main dulha hoon.”", where: "WhatsApp", seen: [["did:kunal-denial"]], meant: "He didn't believe it for a second." },
  { id: "IC14", what: "The kada on the hand at the fire.", where: "Notes", seen: [["saw:fire-original"]], meant: "His hand set down the jerrycan. The hand holding this phone." },
  { id: "IC15", what: "Q1's “me”: “Nothing on the phone puts you in it. Not yet.”", where: "Case file", seen: [["did:refused-q1-me-early"]], meant: "Not yet. The parcel and his account were waiting." },
];
