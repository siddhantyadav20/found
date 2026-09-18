import type { CallCue, Evidence, Exposure, LiveEvent, Question } from "../types";

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
  { id: "rukhsana", device: "hers", app: "whatsapp", label: "She messaged the number on Friday afternoon" },
  { id: "rukhsana-voice", device: "hers", app: "whatsapp", label: "A mother in Kurla whose son went to Thailand" },
  { id: "sahil-photo", device: "hers", app: "photos", label: "A photograph of the son who went" },
  { id: "burmese", device: "hers", app: "casefile", label: "The label on his fire extinguisher isn't in any Indian script", manual: true },
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
      "Her name is at the top of Settings. Is it the name in the alert?",
      "The name on her Settings card is the name in the news: Vasundhara Kulkarni.",
    ],
    proof: ["alert", "wallpaper"],
    orProof: [["alert", "watchman"]],
    reply: "Vasundhara Kulkarni. Sixty-four. Dead for about half an hour.",
    sets: ["did:named-her"],
  },
  {
    kind: "pick",
    id: "knew",
    ask: "Did she believe them?",
    episode: 1,
    whereToLook: ["notes", "photos", "whatsapp", "safari"],
    hints: [
      "She was a bank manager for thirty-two years. What would she have done in the first ten minutes?",
      "Notes, Thursday evening. And her diary, photographed the night she died.",
      "At 5:52 PM on Thursday, fourteen minutes in, she wrote that it was fake — and then stayed on the call anyway.",
    ],
    proof: ["she-knew"],
    orProof: [["diary-1"], ["she-searched"], ["stalling"]],
    reply:
      "No. She knew in fourteen minutes, and stayed on the call for thirty-one hours. Nothing she did after that was panic. It was work.",
    sets: ["did:she-knew"],
  },
  {
    kind: "type",
    id: "number",
    ask: "His \"FIR number\" is ten digits. Whose number is it?",
    episode: 1,
    whereToLook: ["photos", "whatsapp"],
    hints: [
      "No FIR in India is written as ten digits with no year and no station.",
      "Her diary works it out on page 3. Then look for that number in her chats.",
      "98204 57713 is a mobile number. She messaged it on Friday afternoon, and the woman who answered is Sahil's mother.",
    ],
    accepts: [
      "his mother",
      "sahil's mother",
      "sahils mother",
      "rukhsana",
      "rukhsana ansari",
      "the mother",
      "sahil ki maa",
      "his mothers",
    ],
    reply:
      "His mother's. He read his mother's phone number into a fake warrant, twice, slowly, hoping the woman he was robbing would write it down. She did.",
    sets: ["did:decoded"],
  },
  {
    kind: "pick",
    id: "where",
    ask: "Where is the officer really?",
    episode: 1,
    whereToLook: ["phone", "safari", "photos", "whatsapp"],
    hints: [
      "Look past him, at his room. Or, if he's gone, at what she worked out without him.",
      "Zoom into the wall behind him: the clock, and the extinguisher. With no call to look at, her diary names the place on page 4, and Safari shows she looked it up.",
      "The clock reads an hour ahead of Mumbai and the label isn't in any Indian script. Her diary says Myawaddy, Lotus Park. He is in a compound there, and he is the boy in his mother's photograph.",
    ],
    proof: ["clock", "sahil-photo"],
    orProof: [
      ["clock", "burmese"],
      ["clock", "she-searched-mw"],
      ["burmese", "she-searched-mw"],
      // A player who cut the call has no room to look at (CHAPTER1.md F4).
      ["diary-4", "she-searched-mw"],
      ["diary-4", "sahil-photo"],
    ],
    reply:
      "Not Mumbai. His clock is an hour ahead and the writing on his wall is Burmese. He is twenty-three, he is from Kurla, and he is not a policeman. He is a prisoner.",
    sets: ["did:placed-him"],
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
  {
    id: "idle-2",
    when: "idle",
    speaker: "rathore",
    line: "Case file khula hua hai, madam. Aaj raat close karna hai.",
    english: "The case file is open, madam. It has to be closed tonight.",
  },
  {
    id: "idle-3",
    when: "idle",
    speaker: "rathore",
    line: "Paani pi lijiye. Main yahin hoon.",
    english: "Have some water. I'm right here.",
  },
  {
    // She has been dead for half an hour, and he is still reading the script
    // at her camera. He says this while nobody is standing behind him.
    id: "after-knew",
    when: "did:she-knew",
    speaker: "rathore",
    line: "Madam… aap kal se bahut kam bol rahi hain.",
    english: "Madam… you've been saying very little since yesterday.",
  },
  {
    id: "after-decoded",
    when: "did:decoded",
    speaker: "rathore",
    line: "FIR number note kiya na? Dobara padh doon?",
    english: "You noted the FIR number? Shall I read it again?",
  },
  {
    id: "supervisor",
    when: "did:placed-him",
    speaker: "supervisor",
    line: "Quota. Kitna hua?",
    english: "Quota. How much have you got?",
    supervisorPresent: true,
  },
  {
    /* The last line of Episode 1. He does not know she is dead, and he is
       asking the dark whether the only person who ever tried to help him is
       still there. */
    id: "still-there",
    when: "did:bank-dead",
    speaker: "rathore",
    line: "Aunty? Aunty, aap ho na?",
    english: "Aunty? Aunty, you're there, aren't you?",
    whisper: true,
  },
];

const events: LiveEvent[] = [
  {
    id: "alert",
    device: "hers",
    after: ["did:unlock"],
    // Long enough for the player to have the phone in their hands, short
    // enough that they are still looking at it.
    delay: 8,
    app: "news",
    banner: "City Desk · Dadar: retired bank manager, 64, found dead below building",
    /* Twist 7. It says City Desk, and it wears their grey shield: the alert
       came from the profile, five and a half hours before any outlet had the
       story. Nobody sees it the first time. Everybody sees it the second. */
    icon: "kyc",
    sets: ["saw:alert"],
  },
  {
    /* Beat 12. He has been placed, and then the power bank's one LED goes
       out. The call holds on the phone's own 5%, and he asks the dark whether
       she is still there. */
    id: "bank-dies",
    device: "hers",
    after: ["did:placed-him"],
    delay: 6,
    app: "phone",
    sets: ["did:bank-dead"],
  },
  /* Cut at 1:11, the call rings back three times, and then stops
     (CHAPTER1.md F4). Nobody answers; the missed calls stay. */
  {
    id: "ringback-1",
    device: "hers",
    after: ["did:cut-early"],
    delay: 20,
    app: "phone",
    banner: "Mumbai Crime Branch · Missed FaceTime Video",
  },
  {
    id: "ringback-2",
    device: "hers",
    after: ["fired:ringback-1"],
    delay: 35,
    app: "phone",
    banner: "Mumbai Crime Branch · Missed FaceTime Video (2)",
  },
  {
    id: "ringback-3",
    device: "hers",
    after: ["fired:ringback-2"],
    delay: 50,
    app: "phone",
    banner: "Mumbai Crime Branch · Missed FaceTime Video (3)",
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

export const episode1 = { evidence, questions, cues, events, exposures } as const;
