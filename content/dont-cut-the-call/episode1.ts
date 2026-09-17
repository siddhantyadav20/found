import type { CallCue, Ending, Evidence, Exposure, LiveEvent, Question } from "../types";

/* ===========================================================================
   Episode 1 — "Call Mat Kaatna" · 1:11 AM · 7% and a power bank on one LED.

   The opening only, as the pivot's first stub (ROADMAP.md P0). P5 writes the
   twelve beats of CHAPTER1.md Part D in full; what's here is enough for the
   phone to have something true to show while P1–P4 build the stage, the call,
   the ledger and her apps.
   =========================================================================== */

const evidence: Evidence[] = [
  { id: "note", device: "hers", app: "casefile", label: "The note in the pouch", manual: true },
  { id: "call", device: "hers", app: "casefile", label: "A call that has run 31 hours", manual: true },
  { id: "clock", device: "hers", app: "casefile", label: "His wall clock is an hour ahead", manual: true },
  { id: "alert", device: "hers", app: "news", label: "A woman in Dadar is dead" },
  { id: "wallpaper", device: "hers", app: "settings", label: "Whose phone this is" },

  // Her life, and the scam sitting in it like an appointment.
  { id: "warrant", device: "hers", app: "whatsapp", label: "An arrest warrant with an FIR number" },
  { id: "stalling", device: "hers", app: "whatsapp", label: "\"PIN bhool gayi\" — she stalled them for 31 hours" },
  { id: "watchman", device: "hers", app: "whatsapp", label: "A Crime Branch officer came to her building at 12:21" },
  { id: "secretary", device: "hers", app: "whatsapp", label: "The society asked nobody to forward anything" },
  { id: "her-voice", device: "hers", app: "whatsapp", label: "Her voice note to Shaila, 11:48 PM" },
  { id: "deleted-photo", device: "hers", app: "whatsapp", label: "A photo she sent Shaila, deleted" },
  { id: "last-call-son", device: "hers", app: "phone", label: "Her last call was to her son, unanswered" },
  { id: "helpline", device: "hers", app: "phone", label: "She called 1930 and held for 24 minutes" },
  { id: "passcode-off", device: "hers", app: "settings", label: "The passcode was turned off on Thursday" },
  { id: "profile", device: "hers", app: "settings", label: "A device management profile she didn't install", requires: ["ask:whose"] },
  { id: "apple-account", device: "hers", app: "settings", label: "Her Apple Account is on a device she doesn't own", requires: ["ask:whose"] },

  // Her diary, her notes, and the bank's own account of what she lost.
  { id: "diary-1", device: "hers", app: "photos", label: "Diary, page 1: \"It is a lie\"" },
  { id: "diary-3", device: "hers", app: "photos", label: "Diary, page 3: the FIR number is a mobile number" },
  { id: "diary-4", device: "hers", app: "photos", label: "Diary, page 4: Myawaddy, Lotus Park" },
  { id: "she-knew", device: "hers", app: "notes", label: "She knew it was fake by 5:52 PM on Thursday" },
  { id: "lure", device: "hers", app: "notes", label: "A note for whoever gets this phone, edited at 12:39 AM" },
  { id: "the-49k", device: "hers", app: "messages", label: "She lost ₹49,000, not ₹38 lakh" },
  { id: "she-searched", device: "hers", app: "safari", label: "She looked up whether police video-call anyone" },
  { id: "she-searched-mw", device: "hers", app: "safari", label: "She looked up Myawaddy, and boys who don't come back" },
  { id: "brother", device: "hers", app: "pikdrop", label: "The rider was told her brother wanted a detour" },
  { id: "booking", device: "hers", app: "pikdrop", label: "She sent this phone here herself, at 11:52 PM" },
  { id: "tanvi-dm", device: "hers", app: "instagram", label: "She found the girl whose account took the money", requires: ["ep:2"] },
  { id: "tanvi-number", device: "hers", app: "instagram", label: "\"Tanvi\" sent back a number to call", requires: ["ep:2"] },
];

const questions: Question[] = [
  {
    kind: "pick",
    id: "whose",
    ask: "Whose phone is this?",
    episode: 1,
    whereToLook: ["news", "settings", "whatsapp"],
    hints: [
      "The news alert names a building. So does one of her chats.",
      "Her lock screen has her face on it, and so does the article.",
      "The woman on the wallpaper is the woman in the news: Vasundhara Kulkarni.",
    ],
    proof: ["alert", "wallpaper"],
    reply: "Vasundhara Kulkarni. Sixty-four. Dead for about half an hour.",
    sets: ["did:named-her"],
  },
];

const cues: CallCue[] = [
  {
    id: "open",
    when: "open",
    speaker: "rathore",
    line: "Madam? Madam, camera on kijiye.",
    english: "Madam? Madam, turn your camera on.",
  },
  {
    id: "whisper",
    when: "did:reach-for-end",
    speaker: "rathore",
    line: "Mat kaatna… please.",
    english: "Don't cut it… please.",
    whisper: true,
  },
  {
    id: "script",
    when: "did:reach-for-end",
    speaker: "rathore",
    line: "CALL MAT KAATNA. Aapke naam pe non-bailable warrant hai.",
    english: "DON'T CUT THE CALL. There is a non-bailable warrant in your name.",
    supervisorPresent: true,
  },
  {
    id: "idle-1",
    when: "idle",
    speaker: "rathore",
    line: "Madam, aap sun rahi hain na?",
    english: "Madam, you're listening, aren't you?",
  },
];

const events: LiveEvent[] = [
  {
    id: "alert",
    device: "hers",
    after: ["did:unlock"],
    delay: 8,
    app: "news",
    banner: "City Desk · Dadar: retired bank manager, 64, found dead below building",
    sets: ["saw:alert"],
  },
];

const exposures: Exposure[] = [
  {
    id: "pin",
    what: "Her password",
    used: "Aapne unka password khola. 3:02 AM pe ek lakh transfer hua.",
    english: "You opened her password. At 3:02 AM, one lakh was transferred.",
  },
  {
    id: "voice",
    what: "Your voice",
    used: "Aapki awaaz humare paas hai.",
    english: "We have your voice.",
  },
  {
    id: "shaila",
    what: "Shaila's name",
    used: "Aapne ek gawah ko sampark kiya. Shaila Joshi, Shivaji Park.",
    english: "You contacted a witness. Shaila Joshi, Shivaji Park.",
  },
  {
    id: "nikhil",
    what: "Her son's trust",
    used: "Aapne mrit mahila ke bete se baat ki, aur jhooth bola.",
    english: "You spoke to the dead woman's son, and you lied.",
  },
  {
    id: "delivery",
    what: "The delivery at 1:11 AM",
    used: "1:11 AM pe ek mrit mahila ka phone aapke ghar deliver hua. CCTV hai.",
    english: "At 1:11 AM a dead woman's phone was delivered to your home. There is CCTV.",
  },
];

/** Placeholders until P8. The rows are the chapter's three answers. */
const endings: [Ending, Ending, Ending] = [
  { id: "police", row: "Report to police", lines: [], onlyHere: "Who PK Kothari was." },
  { id: "bin", row: "Throw it away", lines: [], onlyHere: "What the world believes when nobody speaks." },
  { id: "friend", row: "Share with a friend", lines: [], onlyHere: "What virality does to the people in the screenshots." },
];

export const episode1 = { evidence, questions, cues, events, exposures, endings } as const;
