import type { Clue } from "../types";

/* ===========================================================================
   The identity clues (RAAKH-V3 §15): everything that said whose door this
   was, before the camera did. "Look again" lists them with when the player
   first saw each; the end card counts the ones they walked past.

   The target is that about one in five blind players suspects before 3:58
   AM. The dials, if playtests miss it, are IC1, IC3 and IC5 (§19).

   Three are doors (fix brief §6): each episode's last question needs its
   clue on the table, in both modes, so a careful player can name the twist
   before the guard does, and a careless one finds it was shown to them.
   =========================================================================== */

export const clues: readonly Clue[] = [
  {
    id: "D1",
    door: 1,
    what: "The waybill: picked up from B-14, returned to origin, B-14. Your own phone: “B-14 ka parcel aaya hai, upar bhej diya.”",
    where: "The parcel · Q3",
    seen: [["claim:q3:ready"]],
    meant: "It left from his door, and came back to it. You're the one it came back to.",
  },
  {
    id: "D2",
    door: 2,
    what: "Mummy's Find My at 12:02: one pin, B-14, Gate 2 side.",
    where: "WhatsApp · Q5b",
    seen: [["saw:mummy-pin"]],
    meant: "The phone is at B-14, by Gate 2. So are you.",
  },
  {
    id: "D3",
    door: 3,
    what: "The silver kada: on the hand that lit the fire, and on the wrist holding this phone.",
    where: "Notes · Photos · Instagram · the camera",
    seen: [["saw:fire-original"], ["saw:bts"], ["saw:kada-selfie"]],
    meant: "The same kada. The same hand.",
  },
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
  // The fix brief's optional door clues (§6).
  { id: "IC16", what: "His alarm on the charger at 12:32, labelled “D”, set every night since.", where: "Episode 2's first minute", seen: [["fired:title-2"]], meant: "Whoever was sleeping through it had set it." },
  { id: "IC17", what: "Tuesday, ₹11,499 at Croma: a second phone and a new SIM.", where: "Paytap", seen: [["saw:new-phone"]], meant: "The second phone was beside the parcel all night." },
  { id: "IC18", what: "Meera: “Woh hamesha yahi karta hai. Jab kuch sambhalta nahi, toh ‘main nahi tha’.”", where: "Phone", seen: [["did:done-meera"]], meant: "His habit, named, to the voice saying it." },
  { id: "IC19", what: "“Main Sameer nahi hoon. Ye parcel mere darwaze pe wapas aaya.”", where: "Phone", seen: [["did:meera-stranger"]], meant: "Wapas: back. It can only come back to the door it left from." },
  { id: "IC20", what: "Dilip saved this number as “Sameer Bhaiya Mumbai”, and the nurse wrote to it.", where: "WhatsApp", seen: [["fired:anita"]], meant: "She wrote to Sameer. You read it." },
  { id: "IC21", what: "Ram Kishan ji: “Teen saal se gate khol raha hoon aapke liye.”", where: "Your phone", seen: [["did:rv-guard"]], meant: "Three years of opening the gate for the man holding this phone." },
];
