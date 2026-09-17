import type { Part } from "./types";

/* ===========================================================================
   Low Battery — Episode 2: Read Receipts. The turn.

   Monday evening. The phone has been dead since morning; the player plugs it
   in, and three days arrive at once: the mill burned on Sunday night, the
   police came to Mum at 11:52, and Mum showed them her Guardian report — the
   player's own morning, minute by minute. By six o'clock the police are
   looking for {name} over the fire, and every line of their evidence is
   something the player did.

   Three questions, no more. The player proves it to themselves (who unlocked
   the phone at {firstPickup}: they type the answer), then says who wanted it
   unlocked — and "I don't know" is an answer the case file respects — then,
   once Wi-Fi brings the first NightCam frame down, clears {name} of the fire.
   After that, what they send from this phone is evidence too.

   Mum confesses she saw Friday night on Saturday morning and told nobody.
   3107 is tested, and answers "okay", which proves nothing. And the last
   beat is the player's own: their home Wi-Fi was already a known network on
   this phone, joined before they'd unlocked it.

   Everything here is gated on `ep:2`, so it sits on the same story as
   Episode 1 and a finished Episode 1 save carries straight on.
   =========================================================================== */

const EP2 = "ep:2" as const;

export const episode2: Part = {
  /* --- Three days, arriving at once ---------------------------------------- */

  threads: [
    {
      id: "mum",
      contact: "Mum",
      messages: [
        { from: "them", at: "Mon 09:40", text: "Papa is calling the police.", requires: [EP2] },
        { from: "them", at: "Mon 11:52", text: "They came. They said you're okay.", requires: [EP2] },
        { from: "them", at: "Mon 11:52", text: "They showed me on my phone. The Guardian.", requires: [EP2] },
        { from: "them", at: "Mon 11:53", text: "", card: "guardian", evidence: "guardian-report", requires: [EP2] },
        { from: "them", at: "Mon 11:55", text: "You were on the map for {mapsTime}.", requires: [EP2] },
        { from: "them", at: "Mon 11:56", text: "Looking at that mill.", requires: [EP2] },
        { from: "them", at: "Mon 11:56", text: "The one that burned.", requires: [EP2] },
        { from: "them", at: "Mon 14:20", text: "They asked me if you knew anyone called K.", requires: [EP2] },
        { from: "them", at: "Mon 19:12", text: "Beta I don't care what happened. Just come home.", requires: [EP2] },
        // What she didn't tell the police: she'd seen Friday night on Saturday morning.
        { from: "them", at: "Mon 19:31", text: "I have to tell you something.", requires: [EP2] },
        { from: "them", at: "Mon 19:31", text: "I saw the Guardian on Saturday morning. Friday night. The mill.", requires: [EP2] },
        { from: "them", at: "Mon 19:32", text: "I didn't tell Papa. I didn't tell the police.", requires: [EP2] },
        { from: "them", at: "Mon 19:33", text: "I thought you had done something. I am your mother and I thought that.", requires: [EP2] },
      ],
    },
    {
      id: "tara",
      contact: "Tara",
      messages: [
        { from: "them", at: "Sun 22:40", text: "still nothing. i'm so scared", requires: [EP2] },
        { from: "them", at: "Mon 12:30", text: "the police came to mine", requires: [EP2] },
        { from: "them", at: "Mon 12:31", text: "they think you did something. i told them you'd never", requires: [EP2] },
        { from: "them", at: "Mon 18:40", text: "whoever has this phone. please be careful what you open.", requires: [EP2] },
      ],
    },
    {
      id: "dev",
      contact: "Dev",
      messages: [
        { from: "them", at: "Mon 13:05", text: "they kept me at the station for 3 hours", requires: [EP2] },
        { from: "them", at: "Mon 13:05", text: "because of friday", requires: [EP2] },
        { from: "them", at: "Mon 13:06", text: "if it's really you just tell them i didn't do anything", requires: [EP2] },
      ],
    },
    {
      id: "group",
      contact: "Tara turns 20 🎂",
      messages: [
        { from: "them", sender: "Ria", at: "Sun 20:10", text: "anyone heard anything", requires: [EP2] },
        { from: "them", sender: "Sam", at: "Mon 18:15", text: "did you see the news", requires: [EP2] },
        { from: "them", sender: "Sam", at: "Mon 18:16", text: "they're saying {name} might have started the mill fire??", requires: [EP2] },
        { from: "them", sender: "Ria", at: "Mon 18:17", text: "that's insane", requires: [EP2] },
        { from: "them", sender: "Tara", at: "Mon 18:20", text: "stop. please.", requires: [EP2] },
      ],
    },
  ],

  headlines: [
    {
      id: "h-fire",
      at: "Sun 23:48",
      title: "Fire guts engine house at shut Lower Parel mill",
      requires: [EP2],
      lines: [
        { text: "A fire broke out late on Sunday at Shree Ram Mills, a textile mill shut since 2009. No casualties were reported." },
        { text: "Fire officials said the cause was being examined. The 1923 engine house, the compound's only listed structure, was badly damaged." },
      ],
    },
    {
      id: "h-arson",
      at: "Mon 15:30",
      title: "Mill fire was started with petrol, officials say",
      requires: [EP2],
      lines: [
        { text: "Investigators found traces of petrol in the engine house of Shree Ram Mills, officials said on Monday." },
        { text: "The compound is the subject of a redevelopment proposal by Anand Realty, which has objected to the engine house's heritage listing." },
      ],
    },
    {
      id: "h-seek",
      at: "Mon 18:10",
      title: "Police seek missing student over mill fire",
      requires: [EP2],
      lines: [
        { text: "Police are trying to trace {name} Sethi, 19, who has not been seen since Friday night." },
        { text: "The student's phone was switched on in the Andheri area on Monday morning and used for about {minutes} minutes, police said." },
        { text: "Activity on the phone included a maps application showing the mill site, and an encrypted messaging app used by a man police want to identify." },
        { text: "A deleted image of the mill's gate was restored on the phone on Monday.", requires: ["did:recover-van"] },
        { text: "Read receipts on the phone were switched off shortly after it came on.", requires: ["did:receipts-off"] },
        { text: "Police said the student “appears to be avoiding contact with family” and asked {them} to come forward." },
      ],
    },
    {
      id: "h-update",
      at: "Mon 21:05",
      title: "Mill fire: police say missing student is in contact",
      requires: ["said:r-mum"],
      lines: [
        { text: "The family of {name} Sethi received a message from the student's phone on Monday night saying the student was fine.", requires: ["said:r-mum:lie"] },
        { text: "A message from the student's phone on Monday night claimed it was being used by a stranger. Police said they were treating that with caution.", requires: ["said:r-mum:truth"] },
        { text: "Messages from the family to the student's phone were read on Monday night and left unanswered, police said.", requires: ["said:r-mum:silence"] },
        { text: "A businessman told police he had received a threatening message from the same phone.", requires: ["said:r5520:threat"] },
        { text: "Police said the missing-person inquiry had been closed and that the student was now wanted for questioning.", requires: ["said:r-mum:lie"] },
      ],
    },
  ],

  /* --- What the phone can now reach ---------------------------------------- */

  // The network the phone joins when the player turns Wi-Fi on is theirs, and
  // it joins without asking for a password. The last beat says why.
  wifi: [{ ssid: "Home-4B", lastJoined: "Connected", joinedFirst: "Mon 08:11", evidence: "wifi-yours", requires: ["did:wifi-on"] }],

  devices: [
    {
      id: "tara-mac",
      name: "Tara's MacBook Air",
      detail: "Mail · Sun 22:14",
      evidence: "device-tara",
      requires: ["did:wifi-on"],
    },
  ],

  photos: [
    {
      id: "letterbox",
      album: "received",
      src: "/found/photos/letterbox.jpg",
      alt: "Your building's letterboxes, taken close, at 07:40. Rows of them. One of them is yours.",
      takenAt: "Mon 07:40",
      place: "Andheri West",
      requires: ["fired:e2-letterbox"],
    },
    {
      id: "fuel",
      album: "nightcam",
      alt: "Petrol cans lined up against a brick wall, lit by a phone torch.",
      takenAt: "Fri 23:39",
      place: "Shree Ram Mills",
      evidence: "nightcam-first",
      requires: ["did:wifi-on"],
    },
  ],

  vaultNotes: [
    {
      id: "receipt",
      title: "receipt",
      kind: "receipt",
      body: "RECEIVED ₹7,500\nFOR GATE 3\n— K.",
      evidence: "k-receipt",
      requires: ["did:wifi-on"],
    },
  ],

  /* --- The case file ------------------------------------------------------- */

  evidence: [
    { id: "guardian-report", app: "messages", label: "Mum's Guardian report, Monday", detail: "This phone's Monday morning: first pickup {firstPickup}, about {minutes} minutes of use.", requires: [EP2] },
    { id: "k-receipt", app: "calculator", label: "K.'s cash receipt", detail: "RECEIVED ₹7,500 FOR GATE 3, in careful block capitals. Signed K.", requires: ["did:wifi-on"] },
    { id: "device-tara", app: "settings", label: "Signed in: Tara's MacBook Air", detail: "{name}'s mail was opened on Tara's laptop on Sunday at 22:14.", requires: ["did:wifi-on"] },
    { id: "nightcam-first", app: "nightcam", label: "NightCam, 1 of 12", detail: "Petrol cans in the dark, 23:39 on Friday. The first of twelve.", requires: ["did:wifi-on"] },
    { id: "letterbox", app: "messages", label: "A photo of your letterbox", detail: "Taken at 07:40 on Monday, before the phone reached you.", requires: ["fired:e2-letterbox"] },
    { id: "wifi-yours", app: "settings", label: "Your Wi-Fi, joined Mon 08:11", detail: "This phone joined your home network before you unlocked it. Nobody here typed the password.", requires: ["fired:e2-known"] },
  ],

  deductions: [
    {
      id: "e2-who",
      question: "Who unlocked {name}'s phone at {firstPickup} on Monday?",
      ask: "The report says someone picked this phone up. It reached your letterbox at 08:10.",
      requires: ["seen:guardian-report"],
      answer: { kind: "text", accepts: ["me", "i", "i did", "it was me", "myself", "you", "me i did", "i unlocked it"] },
      right: "You did. It reached you at 08:10, and you picked it up at {firstPickup}.",
      nudges: {
        "{name}": "{name} hasn't touched this phone since Friday night.",
        kiran: "He posted it. He didn't open it.",
        k: "He posted it. He didn't open it.",
        "5520": "5520 told you not to. Who did anyway?",
        mum: "Mum is the one reading the report.",
      },
      otherwise: "Who has had this phone since 08:10?",
      look: ["guardian", "messages"],
      hints: [
        "When did the phone reach you? When was it first picked up?",
        "It came in your post at 08:10. Someone unlocked it at {firstPickup}.",
        "Type: me",
      ],
    },
    {
      /* Who is answerable; why a stranger isn't, yet. A player who types "I
         don't know" is told "Good." — the police already filled that gap with
         a story, and this question is where the player refuses to. */
      id: "e2-why",
      question: "Who wanted it unlocked, and why a stranger?",
      ask: "Say only what this phone can prove.",
      requires: ["solved:e2-who"],
      answer: {
        kind: "text",
        accepts: [
          "5520", "k", "kiran", "the burner", "him", "he did", "k did", "the man who posted it", "whoever posted it",
          "i don't know", "i dont know", "i don t know", "don't know", "dont know", "no idea", "idk", "not sure",
        ],
      },
      right: "The number that told you not to, twice. You did, both times. Why you, nothing on this phone says. Not yet.",
      rightFor: {
        "i don't know": "Good. Nothing here says why yet, and the police have already made something up.",
        "i dont know": "Good. Nothing here says why yet, and the police have already made something up.",
        "i don t know": "Good. Nothing here says why yet, and the police have already made something up.",
        "don't know": "Good. Nothing here says why yet, and the police have already made something up.",
        "dont know": "Good. Nothing here says why yet, and the police have already made something up.",
        "no idea": "Good. Nothing here says why yet, and the police have already made something up.",
        idk: "Good. Nothing here says why yet, and the police have already made something up.",
        "not sure": "Good. Nothing here says why yet, and the police have already made something up.",
      },
      nudges: {
        "{name}": "{name} hasn't had this phone since Friday night.",
        me: "You unlocked it. Someone wanted you to.",
        i: "You unlocked it. Someone wanted you to.",
        mum: "Mum wanted it answered, not opened.",
        tara: "Tara told you to be careful what you open.",
        dev: "Dev has been at a police station all afternoon.",
        police: "The police are reading what you did. They didn't ask you to.",
      },
      otherwise: "Nothing on this phone says that. Who told you not to open things?",
      look: ["messages", "calculator"],
      hints: [
        "Who told you not to do something, and did you do it anyway?",
        "+91 •• ••5520 said “Don't unlock it.” and “Close the calculator.” Why you is harder, and it's allowed not to know.",
        "Type: 5520. Or, if it's true: I don't know.",
      ],
    },
    {
      id: "e2-fire",
      question: "Did {name} start the fire?",
      ask: "The police think so. Show what this phone says.",
      requires: ["seen:nightcam-first"],
      answer: { kind: "evidence", accepts: [["nightcam-first"]] },
      right: "No. The petrol was already stacked in the engine house at 23:39 on Friday, two days before the fire. {name} photographed it.",
      nudges: {
        "k-receipt": "That says {name} was paid for Gate 3. Not what was waiting there.",
        "k-van": "Someone else was there first. Show what they'd brought.",
        "guardian-report": "That's what you did on Monday, not what happened on Friday.",
      },
      otherwise: "That doesn't say who brought the petrol, or when.",
      look: ["nightcam", "news"],
      hints: [
        "The fire was on Sunday night. What did {name} see on Friday?",
        "The first NightCam frame came down with the Wi-Fi. Check its time.",
        "Show “NightCam, 1 of 12”.",
      ],
    },
  ],

  /* --- What you can say, and what it does ---------------------------------- */

  replies: [
    {
      id: "r-mum",
      thread: "mum",
      when: ["solved:e2-why"],
      options: [
        { id: "lie", text: "i'm okay maa. don't worry." },
        { id: "truth", text: "This isn't {name}. Someone left this phone in my letterbox." },
        { id: "silence", text: null },
      ],
    },
    {
      id: "r3107-a",
      thread: "unknown",
      when: ["fired:e2-3107-sorry"],
      options: [
        { id: "a1", text: "Who are you?" },
        { id: "a2", text: "Where are you?" },
        { id: "a3", text: "How do I know you're not him?" },
      ],
    },
    {
      // A test that can be failed, and that teaches what a good test is.
      id: "r3107-b",
      thread: "unknown",
      when: ["fired:e2-3107-test"],
      repeat: true,
      options: [
        { id: "b1", text: "The envelope said TO YOU, BY HAND." },
        { id: "b2", text: "Your locker code is 2719." },
        { id: "b3", text: "Your mum can see everything this phone does." },
        { id: "b4", text: "You're at Tara's.", requires: ["seen:device-tara"], final: true },
      ],
    },
    {
      id: "r5520",
      thread: "burner",
      when: ["solved:e2-why"],
      options: [
        { id: "threat", text: "I know what you did." },
        { id: "who", text: "Who is this?" },
        { id: "silence", text: null },
      ],
    },
  ],

  events: [
    {
      // The first time the case file interrupts you.
      id: "e2-open-notes",
      when: ["seen:guardian-report"],
      thread: null,
      messages: [],
      effect: "open-notes",
    },
    {
      id: "e2-3107-sorry",
      when: ["solved:e2-why"],
      thread: "unknown",
      messages: [
        { from: "them", at: "now", text: "it wasn't your fault." },
        { from: "them", at: "now", text: "i told him about mum's app. i told him." },
      ],
    },

    { id: "e2-mum-lie", when: ["said:r-mum:lie"], thread: "mum", messages: [
      { from: "them", at: "now", text: "Okay beta." },
      { from: "them", at: "now", text: "Okay." },
    ] },
    { id: "e2-mum-truth", when: ["said:r-mum:truth"], thread: "mum", messages: [
      { from: "them", at: "now", text: "Who is this?" },
      { from: "them", at: "now", text: "Where is my {child}?" },
      { from: "them", at: "now", text: "The police say it's you. They say you're pretending." },
    ] },
    { id: "e2-mum-silence", when: ["said:r-mum:silence"], thread: "mum", messages: [
      { from: "them", at: "now", text: "I can see you reading." },
    ] },

    { id: "e2-3107-a1", when: ["said:r3107-a:a1"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "you know who i am. you've been reading my phone all day." },
    ] },
    { id: "e2-3107-a2", when: ["said:r3107-a:a2"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "somewhere he can't see. not yet." },
    ] },
    { id: "e2-3107-a3", when: ["said:r3107-a:a3"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "you don't. and i don't know you're not his." },
    ] },
    { id: "e2-3107-test", when: ["said:r3107-a"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "so we test each other." },
      { from: "them", at: "now", text: "tell me something he wouldn't know." },
    ] },
    { id: "e2-3107-b1", when: ["said:r3107-b:b1"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "he'd know that. he wrote it." },
    ] },
    { id: "e2-3107-b2", when: ["said:r3107-b:b2"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "he had my phone. he can know anything that was on it." },
    ] },
    { id: "e2-3107-b3", when: ["said:r3107-b:b3"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "so could he. that's the whole point." },
    ] },
    // Not a confirmation. 3107 could be {name}; 3107 could be anyone who
    // wants the player to think so. Episode 3 doesn't settle it either.
    { id: "e2-3107-b4", when: ["said:r3107-b:b4"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "okay." },
    ] },
    { id: "e2-3107-keep", when: ["said:r3107-b"], thread: "unknown", messages: [
      { from: "them", at: "now", text: "keep it charged. whatever he says." },
      { from: "them", at: "now", text: "i'll explain when i can." },
    ] },

    { id: "e2-5520-threat", when: ["said:r5520:threat"], thread: "burner", messages: [
      { from: "them", at: "now", text: "Do you." },
    ] },
    { id: "e2-5520-who", when: ["said:r5520:who"], thread: "burner", messages: [
      { from: "them", at: "now", text: "Someone who wants you to keep it charged." },
    ] },

    { id: "e2-nightcam", when: ["did:wifi-on"], thread: null, messages: [], banner: "NightCam · Downloading 1 of 12" },
    { id: "e2-vault", when: ["did:wifi-on", "fired:e2-nightcam"], thread: null, messages: [], banner: "Calculator · 1 new item" },

    {
      id: "e2-letterbox",
      when: ["said:r3107-b", "solved:e2-fire"],
      thread: "burner",
      messages: [
        { from: "them", at: "now", text: "", photo: "letterbox", evidence: "letterbox" },
        { from: "them", at: "now", text: "You kept it. Good." },
        { from: "them", at: "now", text: "Keep it charged." },
      ],
    },
    {
      // Not on arrival: the photo of your own letterbox has to be opened first.
      id: "e2-known",
      when: ["fired:e2-letterbox", "seen:letterbox"],
      thread: null,
      messages: [],
      banner: "Home-4B is a known network. First joined Mon 08:11.",
      bannerApp: "settings",
    },
    {
      // The last beat is the player's, and nobody says anything about it.
      id: "e2-last",
      when: ["seen:wifi-yours"],
      thread: null,
      messages: [],
      effect: "episode-end",
    },
  ],

  /* --- Where the story is -------------------------------------------------- */

  stages: [
    { id: "e2-dark", episode: 2, when: [EP2], battery: 0, screen: "charge" },
    { id: "e2-relock", episode: 2, when: [EP2, "did:plugged"], battery: 1, screen: "relock" },
    { id: "e2-boot", episode: 2, when: [EP2, "did:plugged", "did:unlock-2"], battery: 3, screen: "phone" },
    { id: "e2-reveal", episode: 2, when: [EP2, "did:unlock-2", "solved:e2-who"], battery: 12, screen: "phone" },
    { id: "e2-why", episode: 2, when: [EP2, "did:unlock-2", "solved:e2-who", "solved:e2-why"], battery: 20, screen: "phone" },
    { id: "e2-talk", episode: 2, when: [EP2, "did:unlock-2", "solved:e2-why", "said:r3107-a"], battery: 50, screen: "phone" },
    { id: "e2-online", episode: 2, when: [EP2, "did:unlock-2", "solved:e2-why", "said:r3107-a", "did:wifi-on"], battery: 60, screen: "phone" },
    { id: "e2-trust", episode: 2, when: [EP2, "did:unlock-2", "solved:e2-why", "did:wifi-on", "said:r3107-b"], battery: 72, screen: "phone" },
    { id: "e2-cliff", episode: 2, when: [EP2, "did:unlock-2", "did:wifi-on", "said:r3107-b", "solved:e2-fire"], battery: 80, screen: "phone" },
    { id: "e2-end", episode: 2, when: [EP2, "ep:2-done"], battery: 80, screen: "end" },
  ],

  actions: [
    { id: "plug", sets: "did:plugged", requires: [EP2] },
    { id: "unlock-2", sets: "did:unlock-2", requires: ["did:plugged"] },
    // Wi-Fi comes back once there's charge to spare: half-full.
    { id: "wifi-on", sets: "did:wifi-on", requires: ["said:r3107-a"] },
    { id: "finish-ep2", sets: "ep:2-done", requires: ["fired:e2-last"] },
    { id: "react", sets: "did:reacted", requires: ["solved:e2-who"], optional: true },
  ],

  end2: {
    title: "End of Episode 2",
    questions: [
      "What's on the other eleven?",
      "How did it know your Wi-Fi?",
      "Why does he still want it charged?",
      "Is 3107 really {name}?",
    ],
    ask: "It's charged. The rest is downloading.",
    cta: "Continue · Episode 3",
  },
};
