import type {
  CallCue,
  Evidence,
  Exposure,
  IncomingCall,
  LiveEvent,
  Photo,
  Question,
  Reply,
  Story24,
  Thread,
} from "../types";

/* ===========================================================================
   Episode 2 — "Delete for Everyone" · 1:40 AM → 6:42 AM.

   The episode where the player stops reading a tragedy and starts being in
   one. Three versions of how she died, none of them true. A twenty-year-old
   who sold her out of fear. A page in the bin with nine names on it, and the
   ninth is the player's own address. A neighbour's cat, filming a balcony at
   12:37, with two voices on the terrace above it.

   And then the turn the whole chapter rests on: **the note in the pouch is
   not hers.** Hers said the opposite (CHAPTER1.md, twist 5).
   =========================================================================== */

export const evidence: Evidence[] = [
  { id: "helpline-held", device: "hers", app: "phone", label: "She held for 24 minutes on the cyber helpline", requires: ["ep:2"] },
  { id: "collector", device: "hers", app: "phone", label: "The 38-second call to \"Tanvi\", recorded", requires: ["ep:2"] },
  { id: "diary-7", device: "hers", app: "photos", label: "Diary, page 7: \"The girl gave me to them\"", requires: ["ep:2"] },
  {
    /* In the bin, not the library: opening Photos doesn't find it. Somebody
       has to notice that a page is missing and go looking. */
    id: "list",
    device: "hers",
    app: "photos",
    label: "Tomorrow's list. Nine names.",
    requires: ["ep:2"],
    manual: true,
  },
  { id: "terrace", device: "hers", app: "instagram", label: "A cat, a balcony, and two voices above it at 12:37", requires: ["ep:2"] },
  { id: "detour", device: "hers", app: "pikdrop", label: "The bike stopped 14 minutes in Andheri East", requires: ["ep:2"] },
  { id: "shaila-asks", device: "hers", app: "whatsapp", label: "Shaila noticed the note change at 2:14 AM", requires: ["ep:2"] },
  { id: "real-note", device: "hers", app: "whatsapp", label: "Her real note: CUT THE CALL", requires: ["did:shaila-trusted"], manual: true },
  { id: "profile", device: "hers", app: "settings", label: "A profile installed four minutes after the passcode went off", requires: ["ep:2"] },
];

export const photos: Photo[] = [
  {
    id: "diary-7",
    album: "diary",
    at: "23:44",
    day: "Friday",
    kind: "paper",
    title: "Diary · page 7",
    lines: [
      "9.42 pm — rang the number the girl sent.",
      "A man answered. 'Aunty, aap bahut samajhdaar ho. Ghar pe raho.'",
      "The girl gave me to them. Not her fault.",
      "They will come. Tonight, I think.",
      "Photograph everything. Send the phone away.",
    ],
    evidence: "diary-7",
    requires: ["ep:2"],
  },
];

export const stories: Story24[] = [
  {
    id: "ruchi",
    who: "ruchi.pradhan · 5th floor",
    at: "00:37",
    expires: "11h",
    caption: "he sits here every night 🐈‍⬛",
    audio: [
      { who: "A man, above", line: "Madam, diary kahan hai?", english: "Madam, where is the diary?" },
      { who: "Vasu", line: "Aap police nahi ho.", english: "You are not police." },
      { who: "A man, above", line: "Madam—", english: "Madam—" },
    ],
    evidence: "terrace",
    requires: ["ep:2"],
  },
];

/** What Shaila sends back, and only if the player can prove they aren't them.
    Each answer opens the next part of the same conversation: the chat list
    merges threads by name, so it reads as one exchange with one friend. */
export const threads: Thread[] = [
  {
    id: "shaila-ep2",
    app: "whatsapp",
    name: "Shaila (laughter club)",
    requires: ["ep:2"],
    messages: [
      {
        id: "sh-5",
        from: "them",
        text: "Vasu? Tu jo photo pathavla hota to delete ka kela? Ani note madhe Madhav cha vadhdivas ka lihila?? Tu theek aahes na?",
        english: "Vasu? Why did you delete the photo you sent me? And why did you write Madhav's birthday in the note?? Are you alright?",
        at: "02:14",
        day: "Saturday",
        evidence: "shaila-asks",
      },
      { id: "sh-6", from: "them", text: "Vasu??", at: "02:31", day: "Saturday" },
    ],
    reply: {
      id: "shaila",
      prompt: "Say something to Shaila.",
      options: [
        {
          id: "truth",
          text: "Aunty, I'm not Vasu. Her phone was delivered to my door at 1:11 AM. I think she's been killed.",
          sets: ["did:shaila-told"],
          exposes: "shaila",
        },
        {
          id: "lie",
          text: "Haan Shaila, main theek hoon. So ja.",
          english: "Yes Shaila, I'm fine. Go to sleep.",
          sets: ["did:shaila-lied"],
        },
        { id: "nothing", text: "Say nothing.", sets: ["did:shaila-silent"] },
      ],
    },
  },
  {
    /* She was told the truth, and a 66-year-old who has been forwarded every
       scam in India wants proof before she believes any of it. */
    id: "shaila-asks-back",
    app: "whatsapp",
    name: "Shaila (laughter club)",
    requires: ["did:shaila-told"],
    messages: [
      {
        id: "sh-7",
        from: "her",
        text: "Aunty, I'm not Vasu. Her phone was delivered to my door at 1:11 AM.",
        at: "02:39",
        day: "Saturday",
      },
      {
        id: "sh-8",
        from: "them",
        text: "Tu kon aahes? Vasu cha laughter club kiti vajta asto? Sang.",
        english: "Who are you? What time is Vasu's laughter club? Tell me.",
        at: "02:40",
        day: "Saturday",
      },
    ],
    reply: {
      id: "shaila-proof",
      requires: ["did:shaila-told"],
      prompt: "She wants the one thing a stranger couldn't know.",
      options: [
        { id: "right", text: "6:15. Shivaji Park. She goes every morning.", sets: ["did:shaila-trusted"] },
        { id: "wrong", text: "Seven o'clock? At the beach?", sets: ["did:shaila-failed"] },
      ],
    },
  },
  {
    id: "shaila-sends",
    app: "whatsapp",
    name: "Shaila (laughter club)",
    requires: ["did:shaila-trusted"],
    messages: [
      {
        id: "sh-9",
        from: "them",
        text: "Devaa. Thamb. Ti mala kal raatri he pathavla hota.",
        english: "God. Wait. She sent me this last night.",
        at: "02:44",
        day: "Saturday",
      },
      {
        id: "sh-10",
        from: "them",
        at: "02:44",
        day: "Saturday",
        attachment: { kind: "photo", label: "Her real note, photographed at 11:48 PM" },
        evidence: "real-note",
      },
      {
        id: "sh-11",
        from: "them",
        text: "CUT THE CALL. THEY CAN SEE THIS PHONE. DON'T TYPE ANYTHING INTO IT. Cyber Police, BKC — not the local station. Don't trust anything that looks like me. — Vasundhara",
        at: "02:44",
        day: "Saturday",
      },
    ],
  },
  {
    id: "shaila-doubts",
    app: "whatsapp",
    name: "Shaila (laughter club)",
    requires: ["did:shaila-lied"],
    messages: [
      { id: "sh-12", from: "her", text: "Haan Shaila, main theek hoon. So ja.", at: "02:39", day: "Saturday" },
      {
        id: "sh-13",
        from: "them",
        text: "Tu Marathi madhe bolat naahis. Vasu, tu ahes ka?",
        english: "You're not speaking in Marathi. Vasu, is that you?",
        at: "02:41",
        day: "Saturday",
      },
      { id: "sh-14", from: "them", text: "Me police la phone karte.", english: "I'm calling the police.", at: "02:52", day: "Saturday" },
    ],
  },
];

/** What the player can say into a call, and what saying it costs. */
export const callReplies: Reply[] = [
  {
    id: "tell-him",
    requires: ["ep:2"],
    prompt: "He doesn't know. Say something, or don't.",
    options: [
      {
        id: "dead",
        text: "She's dead. She died at 12:40 this morning.",
        sets: ["did:told-him"],
        exposes: "voice",
      },
      {
        id: "who",
        text: "Sahil. Tumhari maa ne mujhe tumhari photo bheji hai.",
        english: "Sahil. Your mother sent me your photograph.",
        sets: ["did:said-his-name"],
        exposes: "voice",
      },
      { id: "quiet", text: "Say nothing. Stay muted." },
    ],
  },
];

export const incoming: IncomingCall[] = [
  {
    /* Her son, told by the police that his mother is dead and her phone is
       missing, ringing his mother's phone at 1:34 in the morning. */
    id: "nikhil",
    device: "hers",
    from: "Nikhil ❤️",
    sub: "mobile",
    at: "01:34",
    after: ["ep:2"],
    insists: true,
    lines: [
      { who: "Nikhil", line: "Aai? Aai, kaay zala?", english: "Aai? Aai, what happened?" },
      { who: "Nikhil", line: "Kaun hai? Kaun bol raha hai?", english: "Who is this? Who's speaking?" },
      {
        who: "Nikhil",
        line: "Police ne bola phone nahi mila. Aai ka phone tumhare paas kaise aaya?",
        english: "The police said the phone wasn't found. How do you have my mother's phone?",
      },
    ],
    reply: {
      id: "nikhil",
      prompt: "His mother died half an hour ago.",
      options: [
        {
          id: "truth",
          text: "It was delivered to my door at 1:11 AM. I don't know why. I'm trying to find out.",
          sets: ["did:nikhil-truth"],
          exposes: "nikhil",
        },
        {
          id: "police",
          text: "Main police se hoon. Aap subah station aa jaiye.",
          english: "I'm from the police. Come to the station in the morning.",
          sets: ["did:nikhil-lied"],
          exposes: "nikhil",
        },
        { id: "end", text: "End the call without speaking.", sets: ["did:nikhil-silent"] },
      ],
    },
    sets: ["did:nikhil-rang"],
  },
];

export const questions: Question[] = [
  {
    kind: "claims",
    id: "how-died",
    ask: "Three versions of how she died. Which of them is true?",
    episode: 2,
    whereToLook: ["news", "whatsapp", "messages", "phone"],
    hints: [
      "Each version says something you can check on this phone.",
      "The paper says ₹38 lakh. Her bank says something else. The society says she was being arrested — but look at who she rang at 9:48 PM.",
      "None of them is true. She lost ₹49,000, on purpose, and she spent 24 minutes on hold to the cyber helpline. Guilty people don't do that.",
    ],
    claims: [
      { id: "shame", text: "City Desk: she lost ₹38 lakh and could not face her family.", proof: "the-49k" },
      { id: "guilty", text: "The society: the police came to arrest her, so she must have been involved.", proof: "helpline" },
      { id: "murder", text: "Somebody came for her, and she knew they would.", trueWhen: ["ep:2"], proof: "diary-7" },
    ],
    reply:
      "She lost ₹49,000, and she chose to. She held for twenty-four minutes on a helpline. She wrote down that they were coming. Nobody who does that jumps.",
    sets: ["did:not-suicide"],
  },
  {
    kind: "type",
    id: "who-told",
    ask: "Somebody told them she knew. Who?",
    episode: 2,
    whereToLook: ["instagram", "phone", "photos"],
    hints: [
      "She found where her ₹49,000 went, and then she did the kindest possible thing with it.",
      "Instagram, Friday 8:47 PM. Then the number that came back, and the recording of that call.",
      "Tanvi forwarded the message to the men who rent her account. The voice that answered at 9:42 was not a twenty-year-old girl.",
    ],
    accepts: ["tanvi", "tanvi deshmukh", "the girl", "tanvi d", "the student"],
    reply:
      "Tanvi. Twenty years old, ₹8,000 a month for her bank account, and frightened enough to forward a stranger's kindness to the men who rented it. Her diary says it: not her fault.",
    sets: ["did:knows-tanvi"],
  },
  {
    kind: "pick",
    id: "why-you",
    ask: "Why did this phone come to you?",
    episode: 2,
    whereToLook: ["photos", "pikdrop"],
    hints: [
      "Something was deleted from her phone at 12:37 AM. It is still in the bin.",
      "Recover page six of her diary, then read the PikDrop booking again.",
      "Row nine of tomorrow's list has no phone number, only an address — and it is the address she sent this phone to at 11:52 PM. You.",
    ],
    proof: ["list", "booking"],
    reply:
      "Because you were the only one she could not call. Nine names on tomorrow's list, and yours is the one with no number beside it. Ten thirty this morning.",
    sets: ["did:number-nine"],
  },
  {
    kind: "pick",
    id: "who-wrote",
    ask: "Did she write the note that came with this phone?",
    episode: 2,
    whereToLook: ["whatsapp", "photos", "pikdrop"],
    hints: [
      "Compare the note in the pouch with anything else she wrote.",
      "She writes English and Marathi, never Roman Hinglish, and she does not misspell. Then read what PikDrop says was in the parcel.",
      "No. Her note said the opposite: cut the call. The parcel left Dadar with a diary in it, and arrived here without one.",
    ],
    proof: ["real-note", "note"],
    orProof: [
      ["note", "detour"],
      ["note", "brother"],
    ],
    reply:
      "No. She wrote: CUT THE CALL. THEY CAN SEE THIS PHONE. Somebody took that out in Andheri East and put in the note you have been obeying since 1:11 AM.",
    sets: ["did:note-is-theirs"],
  },
  {
    kind: "timeline",
    id: "after-midnight",
    ask: "Who used this phone after midnight?",
    episode: 2,
    whereToLook: ["notes", "photos", "whatsapp", "pikdrop"],
    hints: [
      "She was on a terrace in Dadar. Where was her phone?",
      "Line up everything with a time on it between 12:20 and 12:45.",
      "Between 12:36 and 12:39 this phone was in Andheri East, and she was not with it. Every one of those was somebody else.",
    ],
    rows: [
      { id: "gate", at: "00:21", text: "A man with a Crime Branch ID reaches her gate", lane: "her", evidence: "watchman" },
      { id: "pickup", at: "00:08", text: "The rider takes the parcel from the watchman", lane: "her", evidence: "booking" },
      { id: "andheri", at: "00:31", text: "The bike stops in Andheri East, for fourteen minutes", lane: "phone", evidence: "detour" },
      { id: "reminder", at: "00:36", text: "A reminder is scheduled on this phone", lane: "phone", evidence: "lure" },
      { id: "deleted", at: "00:37", text: "Diary page six is deleted", lane: "phone", evidence: "list" },
      { id: "cat", at: "00:37", text: "Two voices on the terrace, five floors up", lane: "her", evidence: "terrace" },
      { id: "forever", at: "00:38", text: "Her photo to Shaila is deleted for everyone", lane: "phone", evidence: "deleted-photo" },
      { id: "edited", at: "00:39", text: "\"For whoever gets this phone\" is edited", lane: "phone", evidence: "lure" },
      { id: "fell", at: "00:40", text: "She falls", lane: "her", evidence: "terrace" },
    ],
    reply:
      "She was in Dadar until 12:40. Her phone was in Andheri East from 12:31. Everything this phone did in those four minutes was done by somebody else, in a room, with it in their hands.",
    sets: ["did:timeline"],
  },
];

export const cues: CallCue[] = [
  {
    id: "ep2-open",
    when: "ep:2",
    speaker: "rathore",
    line: "Madam, charger laga diya? Achha hua. Line nahi katni chahiye.",
    english: "Madam, you plugged in the charger? Good. The line shouldn't drop.",
  },
  {
    id: "ep2-idle",
    when: "idle",
    speaker: "rathore",
    line: "Subah ho rahi hai, madam. Aaj hi settle karna hai.",
    english: "It's getting light, madam. This has to be settled today.",
  },
  {
    id: "ep2-tanvi",
    when: "did:knows-tanvi",
    speaker: "rathore",
    line: "Madam, koi aur aapse contact kar raha hai kya?",
    english: "Madam, is anybody else contacting you?",
    supervisorPresent: true,
  },
  {
    id: "ep2-note",
    when: "did:note-is-theirs",
    speaker: "rathore",
    line: "Madam… aap wahan ho? Camera on karo, ek baar.",
    english: "Madam… are you there? Turn the camera on, just once.",
  },
];

export const events: LiveEvent[] = [
  {
    id: "good-morning",
    device: "hers",
    after: ["did:timeline", "saw:profile"],
    delay: 3,
    app: "settings",
    banner: "RBI Secure KYC · Good morning, #9.",
    sets: ["did:seen-by-them", "ep:3"],
  },
];

export const exposures: Exposure[] = [];
