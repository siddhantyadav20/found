import type { Evidence, IncomingCall, LiveEvent, Message, Moment, Question, Thread } from "../types";
import { SAMEER_NEW } from "./episode1";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 3 — "The Cancelled Rescue". Sunday, 1:52 AM on the story's clock: a
   week to the minute after the lie.

   CHAPTER1.md F, Episode 3: the missing interval on a five-lane board; Bhasin
   ringing the phone he's found on a map; Nitin, who won't hand anything to a
   stranger until he's given a reason; who sent the car away, in the player's
   own words, which proves (or strikes) what they filed at the end of Episode
   2; the fire, whole, in the note he locked with the minute of the lie; why
   he filmed it; why he sent the phone; Sameer, one last time; and Raju,
   asking what to tell their mother.

   And the routes (CHAPTER1.md H): Kunal, messaged as Sameer, who can be asked
   for the truth or handed Nitin's name, and either way names Nitin to
   Bhasin; Raju, who hears at the Sehgals' that he was lied to; airplane mode,
   after which nobody reaches the phone, Bhasin included. Every link keeps a
   route on the phone whichever of these closes (ROADMAP S12 holds it to that).

   The whole fire clip and Kunal's frame are in his locked note, "Agar kuch
   hua" (phone.ts), from the first minute. Its password is his birthday,
   1403 (Settings has it; Meera says so); opened early, what's inside counts
   here, where it belongs.

   Believes (canon): Sameer and the family are both responsible, but not in
   the same way.
   =========================================================================== */

const now: readonly ["ep:3"] = ["ep:3"];

/** Airplane mode, turned on by hand (lib/game/phone.ts): after it, nobody's messages reach the phone. */
const OFFLINE = "did:airplane";

/** His locked note, opened with its password (lib/game/phone.ts: `unlocked`). */
const UNLOCKED = "did:unlocked-insurance";

const evidence: readonly Evidence[] = [
  // Q10: the board.
  { id: "no-112", device: "owner", app: "photos", label: "Screenshot: Bhasin, 12:38 AM, “Koi 112 nahi karega. Ladke ko service room le jao.”", within: true, requires: now },
  { id: "doctor", device: "owner", app: "photos", label: "Screenshot: Bhasin, 12:52 AM, “Doctor ka intezaam ho raha hai.”", within: true, requires: now },
  { id: "sameer-room", device: "owner", app: "photos", label: "Screenshot: Ramesh, 1:49 AM, Sameer in the service room with the boy", within: true, requires: now },
  { id: "not-speaking", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:41 AM, “Sir ladka bol nahi raha.”", within: true, requires: now },
  { id: "search-156", device: "owner", app: "safari", label: "Safari, 1:56 AM: “private ambulance chhattarpur 24 hours”", within: true, requires: now },
  { id: "site-plan", device: "owner", app: "mail", label: "The site plan: the service room, 40 m from the service gate on Mandi Road", within: true, requires: now },

  // Q11: Nitin's copy, if he trusts you.
  { id: "nitin-shot-152", device: "owner", app: "whatsapp", label: "Nitin's screenshot: Sameer at 1:52, “Dilip ko le gaye… Tu Vicky ko wapas bhej”", within: true, requires: ["ep:3", "did:protect-nitin"] },
  { id: "vicky-location", device: "owner", app: "whatsapp", label: "Vicky's live location, 1:38–2:06: six minutes at the service gate", within: true, requires: ["ep:3", "did:protect-nitin"] },

  // Q12: the fire.
  { id: "fire-original", device: "owner", app: "notes", label: "The whole fire clip, in his locked note: 31 seconds, “Bhasin sir, yahan?”, a hand with a silver kada setting down a jerrycan", manual: true, requires: [...now, UNLOCKED] },
  { id: "kunal-wood", device: "owner", app: "whatsapp", label: "Kunal: “Aur aag? Lakdi tu khud dhoke laaya tha.”", within: true, requires: ["ep:3", "did:confronted-kunal"] },

  // Q13: their evidence.
  { id: "frame", device: "owner", app: "notes", label: "In his locked note: Kunal's chat, a video frame (an arm coming down, a flash, a boy behind a light) and “Humare paas bhi hai”", manual: true, requires: [...now, UNLOCKED] },
  { id: "kunal-frame", device: "owner", app: "whatsapp", label: "Kunal sends it again: the frame, “Tera Nitin bhi andar hai”", within: true, requires: ["ep:3", "did:exposed-nitin"] },

  /* The living witness (2026-10-24). Planted since Episode 2 (the car at
     2:55, the ticks, the last seen), counted here. */
  { id: "car-255", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:55 AM, “Sir gaadi nikal gayi.” Bhasin: “Baaki back plot pe.”", within: true, requires: now },
  { id: "belongings", device: "owner", app: "whatsapp", label: "From Dilip's number: a patient's things in a bag, a maroon waistcoat, a badge: DILIP", within: true, requires: ["ep:3", "fired:the-witness"] },
  { id: "patient-voice", device: "owner", app: "whatsapp", label: "From Dilip's number: six seconds of a patient whispering, “…bhaiya… light… ready… hai…”", within: true, requires: ["ep:3", "fired:the-witness"] },
  // His phone in airplane mode: the nurse found Raju through the poster instead, and Raju rang you.
  { id: "raju-relay", device: "owner", app: "phone", label: "Raju: a nurse in Fatehpur Beri has a boy with Dilip's waistcoat and Dilip's voice", within: true, foundBy: ["did:answered-raju-relays"], requires: ["ep:3", "did:answered-raju-relays"] },

  // Sameer, one last time.
  { id: "sameer-rescuer", device: "owner", app: "whatsapp", label: "Sameer: “Haan. Maine koshish ki thi.”", within: true, requires: ["ep:3", "did:gave-rescuer"] },
  { id: "the-line", device: "owner", app: "whatsapp", label: "Sameer: “Maine usko bola Dilip nikal gaya hai. Mujhe pata tha woh nahi nikla tha.”", within: true, requires: ["ep:3", "did:confronted-sameer"] },
];

const questions: readonly Question[] = [
  /* Was a five-lane board until 2026-10-23, and players stalled on it. Now a
     sentence like the rest, and what the board used to light (1:49, 1:53,
     1:56) is said in its answer, as the bridge to Q11. */
  {
    kind: "file",
    id: "q10",
    ask: "After the shot, where was Dilip kept, and on whose orders?",
    episode: 3,
    whereToLook: ["photos", "whatsapp"],
    hints: [
      "Bhasin's group gave orders that night. Sameer screenshotted them on Sunday morning: they're in Photos.",
      "Bhasin, 12:38: “Koi 112 nahi karega. Ladke ko service room le jao.” Then look for anyone saying Dilip was still awake.",
      "The service room, on Bhasin's orders, and awake at 1:14. Table Bhasin's 12:38 screenshot with Pappu's 1:14 “ladka hosh mein hai” (or Dilip's own 1:07 message).",
    ],
    say: {
      line: "Dilip was kept in the {where} on {who}'s orders. At 1:14 he was still {state}.",
      blanks: {
        where: ["service room", "hospital", "car"],
        who: ["Bhasin", "Sameer", "Kunal"],
        state: ["awake", "unconscious"],
      },
    },
    claims: [
      {
        id: "kept",
        words: { where: "service room", who: "Bhasin", state: "awake" },
        text: "Bhasin had Dilip kept in the service room: no 112, no hospital. At 1:14, forty minutes after the shot, he was awake and asking for water.",
        proof: ["no-112", "conscious"],
        also: ["doctor", "dilip-107", "not-speaking", "site-plan", "sameer-room", "swift", "left-empty", "search-1244"],
        orProof: [["no-112", "dilip-107"]],
        reply:
          "From 12:38 Bhasin kept him in the service room, forty metres from a gate on Mandi Road, and promised a doctor who never came. At 1:14 he was awake. And three moments that night don't fit together: at 1:49 Sameer was in that room; at 1:53 Nitin called the car back, because someone had told him Dilip was already gone; at 1:56 Sameer was still searching for an ambulance.",
        sets: ["link:kept"],
      },
      {
        id: "hospital",
        words: { where: "hospital", who: "Bhasin", state: "awake" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Nobody took him to a hospital. Bhasin's first order was “Koi 112 nahi karega.”",
      },
      {
        id: "sameer-orders",
        words: { where: "service room", who: "Sameer", state: "awake" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Sameer was in that room at 1:49. Whose group gave the orders?",
      },
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q11",
    ask: "Who sent the car away?",
    episode: 3,
    whereToLook: ["whatsapp", "photos", "safari"],
    hints: [
      "Nitin sent the car back at 1:53, answering something. What was he told, and by whom? Where was that person at 1:49?",
      "Nitin still has the message Sameer deleted, if he'll trust you with it. On this phone, 1:49, 1:53 and 1:56 are enough.",
      "Sameer, at 1:52, knowing. Table Nitin's screenshot with Ramesh's 1:49, or 1:49 with Nitin's 1:53 reply and the 1:56 ambulance search, or Sameer's own words if you asked him.",
    ],
    say: {
      line: "{who} sent the car away: {how}.",
      blanks: {
        who: ["Sameer", "Bhasin's people", "Kunal", "Nitin himself"],
        how: [
          "he told Nitin Dilip had already gone, knowing he hadn't",
          "he told Nitin Dilip had already gone, believing it",
          "they stopped it at the gate",
        ],
      },
    },
    claims: [
      {
        id: "turned",
        words: { who: "Bhasin's people", how: "they stopped it at the gate" },
        text: "Bhasin's people turned it away at the gate.",
        proof: ["swift", "left-empty"],
        orProof: [["sameer-tried", "left-empty"]],
        reply: "On the record, as Sameer tells it.",
        version: true,
        link: "lie",
      },
      {
        id: "told",
        words: { who: "Sameer", how: "he told Nitin Dilip had already gone, knowing he hadn't" },
        text: "At 1:52 Sameer told Nitin that Dilip had already gone for treatment. He knew he hadn't.",
        proof: ["nitin-shot-152", "sameer-room"],
        also: ["nitin-reply", "search-156", "nitin-car", "nitin-gate", "swift", "left-empty", "nitin-back", "the-line", "vicky-location"],
        orProof: [["sameer-room", "nitin-reply", "search-156"], ["the-line"]],
        moment: "He knew.",
        reply: "At 1:49 he was in the room with Dilip. At 1:52 he told Nitin that Dilip had gone. The car that could have taken him was minutes from the gate.",
        sets: ["link:lie"],
        pays: ["q9:sameer"],
      },
      {
        id: "believed",
        words: { who: "Sameer", how: "he told Nitin Dilip had already gone, believing it" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Believing it? Where was Sameer at 1:49?",
      },
    ],
    reply: "On the record.",
    // His version, filed before Nitin's copy turned up, comes back on the side once it does.
    reopenWhen: ["saw:nitin-shot-152"],
  },
  {
    kind: "file",
    id: "q12",
    ask: "What did Sameer do at the fire, and what burned?",
    episode: 3,
    whereToLook: ["notes", "whatsapp"],
    hints: [
      "The clip in Favorites is nine seconds of something longer. He kept the rest somewhere only he could open.",
      "Notes › “Agar kuch hua” is locked, and its hint is his: “birthday · ddmm”. Settings has his birthday, under his name. Or ask Kunal what he remembers.",
      "He took part, on Bhasin's orders, and what burned was a mattress, sheets and clothes. The password is 1403: he was born on 14 March. Table the whole fire clip from the locked note.",
    ],
    say: {
      line: "At the fire, Sameer {role}, on {whose} orders, and what burned was {what}.",
      blanks: {
        role: ["took part", "only watched", "tried to stop it"],
        whose: ["Bhasin's", "Kunal's"],
        what: ["Dilip's body", "a mattress, sheets and clothes"],
      },
    },
    claims: [
      {
        id: "proof",
        words: { role: "only watched", whose: "Bhasin's", what: "Dilip's body" },
        text: "He saw them burn Dilip's body, on Bhasin's orders.",
        proof: ["vn-burned", "fire-clip"],
        orProof: [["sameer-mistake", "fire-clip"]],
        reply: "On the record, as he tells it: “Unhone usko jala diya. Main wahan tha. Maine dekha.”",
        version: true,
        link: "fire",
      },
      {
        id: "part",
        words: { role: "took part", whose: "Bhasin's", what: "a mattress, sheets and clothes" },
        text: "He took part, on Bhasin's orders: he carried the jerrycan. What burned was a mattress, sheets and clothes. There is no body in the footage.",
        proof: ["fire-original"],
        also: ["fire-clip", "vn-burned", "kunal-wood", "car-255", "not-speaking"],
        orProof: [["kunal-wood", "fire-clip", "car-255"]],
        moment: "No body.",
        reply: "Thirty-one seconds, and his own hands with the kada set down a jerrycan beside a rolled mattress and a bundle of sheets. “Uske kapde bhi.” His clothes too. Sameer has told M for a week that they burned him. In the whole clip, there is no body. Then where is Dilip?",
        sets: ["link:fire"],
      },
      {
        id: "body",
        words: { role: "took part", whose: "Bhasin's", what: "Dilip's body" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Watch the whole clip again. What's on the ground beside the jerrycan?",
      },
    ],
    reply: "On the record.",
    reopenWhen: ["saw:fire-original"],
  },
  {
    kind: "file",
    id: "q13",
    ask: "Why did he send this phone?",
    episode: 3,
    whereToLook: ["notes", "whatsapp"],
    hints: [
      "Somebody else has a picture of that night. Where would he keep something he didn't want M to see?",
      "His locked note, “Agar kuch hua”, holds more than the fire. Set what's in it beside what he cut, deleted and locked.",
      "As insurance against them, because they can prove he fired, with 1:52 left out. Table Kunal's frame (in the locked note, or Kunal's chat) with the whole fire clip and Nitin's 1:53 (or his copy of 1:52), or the frame with the reel take and the memo.",
    ],
    say: {
      line: "He sent this phone {how}, because {why}, and he left out {what}.",
      blanks: {
        how: ["to confess and get help", "as insurance against them"],
        why: ["he couldn't live with it", "they can prove he fired"],
        what: ["nothing", "what he did at 1:52"],
      },
    },
    claims: [
      {
        id: "confess",
        words: { how: "to confess and get help", why: "he couldn't live with it", what: "nothing" },
        text: "To confess, and to get help.",
        proof: ["note", "for-m"],
        orProof: [["sameer-rescuer", "note"]],
        reply: "On the record, as his note puts it: “Sab isme hai.”",
        version: true,
        link: "edit",
      },
      {
        id: "counter",
        words: { how: "as insurance against them", why: "they can prove he fired", what: "what he did at 1:52" },
        text: "They can prove he fired, so he sent a counter-file: everything they did after the shot, with his own part cut out.",
        proof: ["frame", "fire-original", "nitin-reply"],
        also: ["for-m", "note", "reel-take", "memo", "gun-to-kunal", "kunal-frame", "frame", "nitin-shot-152"],
        orProof: [
          ["kunal-frame", "fire-original", "nitin-reply"],
          // Nitin's copy of the 1:52 message is the edit itself, not just its trace.
          ["frame", "fire-original", "nitin-shot-152"],
          ["kunal-frame", "fire-original", "nitin-shot-152"],
          ["frame", "reel-take", "memo"],
        ],
        moment: "His version.",
        reply: "Everything on this phone is true. The order is his, and so is what's missing: the reel, the second shot, 1:52, and his hands at the fire. They had their proof; this was his.",
        sets: ["link:edit"],
      },
    ],
    reply: "On the record.",
    reopenWhen: ["saw:frame"],
  },
  /* The living witness (2026-10-24): the patient in Fatehpur Beri. Asked once
     his number has written (or Raju has rung with it), and answered with
     what's been on this phone since Episode 1: the badge, his voice, the car. */
  {
    kind: "file",
    id: "q14",
    ask: "The patient they call Deepak: who is he, and how did he get there?",
    episode: 3,
    requires: ["did:witness"],
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "Dilip's own number has written to this phone. Read what the nurse sent, and listen to it.",
      "The badge on the waistcoat in the bag: you've seen it before, on the 9:48 PM portrait. The voice: you've heard it practising English. And Bhasin's group saw a car leave at 2:55.",
      "Dilip, taken out in Bhasin's car at 2:55, and nobody burned a body. Table the nurse's photo of his belongings with the name badge from the portrait (or his voice with the portrait, or the 2:55 screenshot).",
    ],
    say: {
      line: "The patient is {who}. Bhasin's car took him out at {time}, and nobody burned {body}.",
      blanks: {
        who: ["Dilip", "Nitin", "a stranger"],
        time: ["2:55", "1:52", "4:47"],
        body: ["a body", "his things"],
      },
    },
    claims: [
      {
        id: "alive",
        words: { who: "Dilip", time: "2:55", body: "a body" },
        text: "The patient admitted as “Deepak, 19, road accident” is Dilip. Bhasin's car took him out of Banyan Farms at 2:55. Nobody burned a body. Bhasin told Sameer he was dead, and had him burn the rest.",
        proof: ["belongings", "badge"],
        also: ["patient-voice", "portrait", "car-255", "fire-original", "raju-relay", "not-speaking"],
        orProof: [["patient-voice", "portrait"], ["belongings", "car-255"], ["raju-relay", "car-255"], ["raju-relay", "badge"]],
        moment: "Alive.",
        reply: "Dilip Kumar Mahto is alive, in a room in Fatehpur Beri, under somebody else's name. He has been there for a week. Bhasin didn't kill him; he hid him, and let Sameer believe the rest. They're moving him at seven.",
        sets: ["link:alive-now", "did:knows-alive"],
      },
      {
        id: "stranger",
        words: { who: "a stranger", time: "2:55", body: "a body" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Look at the badge on the waistcoat in the bag. You've zoomed into it before.",
      },
    ],
    reply: "On the record.",
  },
];

/* --- Nitin, who thinks it's Sameer writing -------------------------------- */


/** What Nitin says once Kunal has given his name to Bhasin: the route closes. */
const nitinNamed = (event: string): Message[] => [
  { id: `n-named-1-${event}`, from: "them", day: "30/11", at: "02:10", with: event, requires: [`fired:${event}`], text: "Bhai tune Kunal ko mera naam de diya? Bhasin ke log ghar aaye the.", english: "Bro, you gave Kunal my name? Bhasin's people came to my house." },
  { id: `n-named-2-${event}`, from: "them", day: "30/11", at: "02:10", with: event, requires: [`fired:${event}`], text: "Ab mujhse baat mat karna.", english: "Don't talk to me any more." },
];

/** What Nitin gives, once he has a reason to: the message Sameer deleted, and the car on a map. */
const nitinSends: readonly Message[] = [
  { id: "n-12", from: "them", day: "30/11", at: "01:55", with: "nitin-sends", requires: ["fired:nitin-sends"], typing: 6, text: "1:52 pe Sameer ne ye bheja tha. Uske phone pe hota toh aap mujhse na poochte. Mere pe hai.", english: "Sameer sent this at 1:52. If it were on his phone you wouldn't be asking me. It's on mine." },
  {
    id: "n-13",
    from: "them",
    day: "30/11",
    at: "01:55",
    with: "nitin-sends",
    requires: ["fired:nitin-sends"],
    attachment: {
      kind: "photo",
      label: "Screenshot · Sameer, 1:52 AM: “Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.”",
      shot: {
        name: "Sameer Bhai",
        sub: "online",
        lines: [
          { text: "Vicky 10 min. service gate — Mandi Road wala na?", at: "01:40", out: true },
          { who: "Sameer Bhai", text: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.", english: "They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and go to sleep.", at: "01:52" },
          { text: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon", at: "01:53", out: true },
        ],
      },
    },
    english: "“They've taken Dilip. In Bhasin sir's car, to hospital. Send Vicky back and get out of here.”",
    evidence: "nitin-shot-152",
  },
  {
    id: "n-14",
    from: "them",
    day: "30/11",
    at: "01:56",
    with: "nitin-sends",
    requires: ["fired:nitin-sends"],
    attachment: {
      kind: "photo",
      label: "Screenshot · Vicky's live location, 1:38–2:06 AM: in along Mandi Road, six minutes at the service gate, out",
      map: { title: "Vicky · Live location", sub: "1:38 AM – 2:06 AM", stop: "Service gate, Mandi Road · 1:58–2:04", ended: "Live location ended" },
    },
    evidence: "vicky-location",
  },
  { id: "n-15", from: "them", day: "30/11", at: "01:56", with: "nitin-sends", requires: ["fired:nitin-sends"], typing: 8, text: "Maine check bhi nahi kiya. Bas maan gaya.", english: "I didn't even check. I just believed it." },
];

/* (game) #107: with the phone online at 1:52, Nitin writes first, so a
   player who read his chat in Episode 2 is called back to it. */
const nitinReaches: readonly Message[] = [
  { id: "n-r1", from: "them", day: "30/11", at: "01:54", with: "nitin-reaches", requires: ["fired:nitin-reaches"], text: "Bhai? Online dikh raha hai.", english: "Bro? You're showing online." },
  { id: "n-r2", from: "them", day: "30/11", at: "01:54", with: "nitin-reaches", requires: ["fired:nitin-reaches"], typing: 7, text: "Ek hafte se phone nahi utha raha. Us raat ke baad se neend nahi aayi.", english: "You haven't picked up in a week. I haven't slept since that night." },
];

const nitin: Thread = {
  id: "nitin-3",
  app: "whatsapp",
  name: "Nitin",
  locked: true,
  messages: [...nitinReaches, ...nitinSends, ...nitinNamed("nitin-named"), ...nitinNamed("nitin-named-2")],
  replies: [
    {
      id: "nitin-ask",
      requires: ["fired:title-3"],
      unless: ["did:nitin-closed"],
      options: [
        {
          id: "honest",
          text: "Nitin, main Sameer nahi hoon. Ye phone mere paas aaya hai. Us raat ka sach jaanna hai.",
          english: "Nitin, I'm not Sameer. This phone came to me. I need to know the truth about that night.",
          sets: ["did:nitin-asked"],
          then: [
            { id: "n-11", from: "them", at: "01:53", text: "Sameer nahi ho? Toh ye phone…", english: "You're not Sameer? Then this phone…" },
            { id: "n-11a", from: "them", at: "01:54", typing: 7, text: "Kaun ho aap? Bhasin ke aadmi?", english: "Who are you? Bhasin's man?" },
          ],
        },
        {
          id: "press",
          text: "Tumne gaadi wapas kyun bheji? Dilip wahan tha.",
          english: "Why did you send the car back? Dilip was there.",
          sets: ["did:nitin-pressed"],
          then: [
            { id: "n-16", from: "them", at: "01:53", text: "Bhai tu ye kya bol raha hai?", english: "Bro, what are you saying?" },
            { id: "n-17", from: "them", at: "01:53", text: "Mujhe is sab mein mat daal.", english: "Don't drag me into this." },
          ],
        },
      ],
    },
    /* He won't hand the one thing he has to a stranger on Sameer's phone
       without a reason. Each reason is one the player earned elsewhere. */
    {
      id: "nitin-trust",
      requires: ["did:nitin-asked"],
      unless: ["did:nitin-closed"],
      options: [
        {
          id: "raju",
          text: "Nahi. Dilip ke bhai Raju ke liye poochh raha hoon.",
          english: "No. I'm asking for Dilip's brother, Raju.",
          requires: ["did:raju-trusts"],
          sets: ["did:protect-nitin"],
          then: [{ id: "n-12r", from: "them", at: "01:54", typing: 9, text: "Raju… Dilip ka bhai. Woh mujhe bhi roz phone karta hai. Main uthata nahi.", english: "Raju… Dilip's brother. He calls me every day too. I don't pick up." }],
        },
        {
          id: "meera",
          text: "Meera Arora ke liye. Advocate. Sameer ne ye phone unhe bheja tha.",
          english: "For Meera Arora. An advocate. Sameer sent this phone to her.",
          requires: ["did:knows-meera"],
          sets: ["did:protect-nitin"],
          then: [{ id: "n-12m", from: "them", at: "01:54", typing: 7, text: "Meera didi? …Unhe bheja tha? Toh woh sach mein bolna chahta tha.", english: "Meera didi? …He sent it to her? Then he really meant to tell." }],
        },
        {
          id: "promise",
          text: "Tumhara naam kahin nahi aayega. Promise.",
          english: "Your name won't come up anywhere. Promise.",
          sets: ["did:protect-nitin", "did:promised-nitin"],
          then: [{ id: "n-12p", from: "them", at: "01:54", typing: 8, text: "Promise? …Theek hai.", english: "Promise? …All right." }],
        },
      ],
    },
  ],
};

/* --- Kunal, messaged as Sameer (CHAPTER1.md H: confront Kunal, expose Nitin) - */

const kunal: Thread = {
  id: "kunal-3",
  app: "whatsapp",
  name: "Kunal",
  // (game) #107: Kunal, seeing the phone online, writes as the family would.
  messages: [
    { id: "k-r1", from: "them", day: "30/11", at: "01:58", with: "kunal-writes", requires: ["fired:kunal-writes"], text: "Bhai phone on hai tera? Papa bol rahe hain kisi se baat mat karna.", english: "Bro, your phone's on? Papa says don't talk to anyone." },
    { id: "k-r2", from: "them", day: "30/11", at: "01:58", with: "kunal-writes", requires: ["fired:kunal-writes"], typing: 6, text: "Kal Mumbai nikal ja. Sab theek ho jayega.", english: "Leave for Mumbai tomorrow. Everything will be fine." },
  ],
  replies: [
    {
      id: "kunal-ask",
      // Once the player knows who fired, and can't be told otherwise.
      requires: ["ask:q6"],
      options: [
        {
          id: "confront",
          text: "Kunal, us raat ka sach bata.",
          english: "Kunal, tell me the truth about that night.",
          sets: ["did:confronted-kunal"],
          then: [
            { id: "k-4", from: "them", at: "01:30", text: "Sach? Tu khud jaanta hai goli kisne chalayi.", english: "The truth? You know yourself who fired." },
            { id: "k-5", from: "them", at: "01:31", text: "Maine sirf gun di thi. Papa ne bola hai Bhasin uncle sambhalenge. Tu bas Mumbai ja.", english: "All I did was hand over the gun. Papa says Bhasin uncle will handle it. You just go to Mumbai." },
            { id: "k-6", from: "them", at: "01:31", text: "Aur aag? Lakdi tu khud dhoke laaya tha. Bhool gaya?", english: "And the fire? You carried the wood yourself. Forgotten?", evidence: "kunal-wood" },
          ],
        },
        {
          id: "expose",
          text: "Nitin ne us raat gaadi bheji thi. Uske messages dekh.",
          english: "Nitin sent a car that night. Look at his messages.",
          sets: ["did:exposed-nitin"],
          then: [
            { id: "k-7", from: "them", at: "01:30", text: "Nitin?", english: "Nitin?" },
            { id: "k-8", from: "them", at: "01:31", text: "Tera Nitin bhi andar hai.", english: "Your Nitin's in it too." },
            {
              id: "k-9",
              from: "them",
              at: "01:31",
              attachment: { kind: "photo", label: "A frame from a video: an arm coming down, a flash, a boy behind a light", src: "/found/raakh/kunal-frame.jpg" },
              evidence: "kunal-frame",
            },
            { id: "k-10", from: "them", at: "01:31", text: "Humare paas bhi hai. Soch samajh ke.", english: "We have it too. Think carefully." },
          ],
        },
      ],
    },
  ],
};

/* --- Raju, who went to the Sehgals', or who is still waiting --------------- */

const raju: Thread = {
  id: "raju-3",
  app: "whatsapp",
  name: RAJU,
  number: RAJU,
  messages: [
    { id: "r-13", from: "them", day: "30/11", at: "02:20", with: "raju-withdraws", requires: ["fired:raju-withdraws"], text: "Sehgal ke ghar gaya tha. Wahan bola goli wedding planner ne chalayi thi, Kunal ne nahi.", english: "I went to the Sehgals' house. They said the wedding planner fired, not Kunal." },
    { id: "r-14", from: "them", day: "30/11", at: "02:20", with: "raju-withdraws", requires: ["fired:raju-withdraws"], text: "Aapne jhooth bola.", english: "You lied." },
    { id: "r-15", from: "them", day: "30/11", at: "02:21", with: "raju-withdraws", requires: ["fired:raju-withdraws"], typing: 5, text: "Aap log sab ek jaise ho.", english: "You people are all the same." },
  ],
};

/* --- Bhasin, who has the phone on a map ------------------------------------ */

const incoming: readonly IncomingCall[] = [
  /* His phone in airplane mode, so Dilip's number can't reach it: the nurse
     found Raju through the poster, and Raju rings yours (2026-10-24). */
  {
    id: "raju-relays",
    device: "yours",
    from: "Raju",
    sub: "mobile",
    at: "02:16",
    after: ["fired:witness-relay"],
    insists: true,
    lines: [
      { who: "Raju", line: "Hello? Aap ho? …Suniye. Ek nurse ka phone aaya tha. Poster wala number.", english: "Hello? It's you? …Listen. A nurse called. The number on the poster." },
      { who: "Raju", line: "Fatehpur Beri mein ek ladka hai. Naam Deepak likha hai. Uske bag mein waistcoat hai. Badge pe likha hai… Dilip.", english: "There's a boy in Fatehpur Beri. They've written Deepak. In his bag there's a waistcoat. The badge says… Dilip." },
      { who: "Raju", line: "Nurse ne uski awaaz sunayi. Woh Dilip hai. Woh zinda hai.", english: "The nurse played me his voice. It's Dilip. He's alive." },
      { who: "Raju", line: "Subah saat baje usko le jaayenge. Kya karoon? Bataiye.", english: "They're taking him at seven in the morning. What do I do? Tell me." },
    ],
    reply: {
      id: "raju-relays-answer",
      options: [
        {
          id: "wait",
          text: "Ruko. Ek minute. Main sochta hoon kaun saath jaa sakta hai.",
          english: "Wait. One minute. I'm working out who can go with you.",
          then: [{ id: "rr-1", from: "them", at: "02:17", text: "Jaldi. Main jaag raha hoon.", english: "Quickly. I'm awake." }],
        },
      ],
    },
  },

  {
    id: "bhasin-calls",
    device: "owner",
    from: "Bhasin Uncle",
    sub: "mobile",
    at: "02:05",
    after: ["fired:bhasin-rings"],
    lines: [
      { who: "Bhasin", line: "Hello." },
      { who: "Bhasin", line: "Aap Sameer nahi ho. Neelam ji ne bata diya tha.", english: "You're not Sameer. Neelam ji told me.", when: "did:mummy-stranger" },
      { who: "Bhasin", line: "Uske phone ki location uski maa ke phone pe dikhti hai. Mujhe bhi.", english: "His phone's location shows on his mother's phone. And to me." },
      { who: "Bhasin", line: "Subah tak courier waale ko wapas de dena. Baaki hum dekh lenge.", english: "Give it back to the courier by morning. We'll see to the rest." },
    ],
    reply: {
      id: "bhasin-answer",
      options: [
        {
          id: "yes",
          text: "Theek hai.",
          english: "All right.",
          sets: ["did:bhasin-yes"],
          then: [{ id: "bc-1", from: "them", at: "02:06", text: "Samajhdaar ho.", english: "Sensible." }],
        },
        {
          id: "police",
          text: "Ye phone police ke paas jayega.",
          english: "This phone is going to the police.",
          sets: ["did:bhasin-no"],
          then: [
            { id: "bc-2", from: "them", at: "02:06", text: "Kaunsi police? Saket wali?", english: "Which police? The Saket ones?" },
            { id: "bc-3", from: "them", at: "02:06", text: "Theek hai. Location hamare paas hai.", english: "Fine. We have the location." },
          ],
        },
        {
          id: "why",
          text: "Aapne Dilip ko hospital kyun nahi jaane diya?",
          english: "Why didn't you let Dilip go to a hospital?",
          sets: ["did:asked-bhasin"],
          then: [
            { id: "bc-4", from: "them", at: "02:06", text: "Aapko nahi pata us raat kya tha.", english: "You don't know what that night was." },
            { id: "bc-5", from: "them", at: "02:06", text: "Phone wapas kar do. Aapke liye achha hoga.", english: "Give the phone back. It'll be better for you." },
          ],
        },
      ],
    },
  },
  /* (game) T12, the knock: Bhasin has the address the parcel went out
     under (b-6a), and at 2:40 a man is at the player's own gate. Your
     building's guard rings your phone, not his, and keeps ringing. */
  {
    id: "guard-calls",
    device: "yours",
    from: "Gate 2 · Guard",
    sub: "mobile",
    at: "02:40",
    after: ["fired:guard-rings"],
    insists: true,
    lines: [
      { who: "Guard", line: "Hello? Ji, maaf karna, itni raat ko.", english: "Hello? Sorry, at this hour." },
      { who: "Guard", line: "Gate pe ek aadmi aaya hai. Safari suit mein. Aapka flat number pooch raha hai.", english: "There's a man at the gate. In a safari suit. He's asking for your flat number." },
      { who: "Guard", line: "Bol raha hai courier se hai, kisi parcel ke baare mein.", english: "He says he's from the courier, about some parcel." },
      { who: "Guard", line: "Upar bhej doon?", english: "Shall I send him up?" },
    ],
    reply: {
      id: "guard-answer",
      options: [
        {
          id: "hold",
          text: "Nahi. Kisi ko upar mat bhejna. Gate band rakho.",
          english: "No. Don't send anyone up. Keep the gate shut.",
          sets: ["did:guard-held"],
          then: [
            { id: "g-1", from: "them", at: "02:41", text: "Theek hai ji.", english: "All right." },
            { id: "g-2", from: "them", at: "02:41", text: "…Chala gaya. Jaate jaate bola, subah saat baje phir aayega.", english: "…He's gone. On his way out he said he'd be back at seven." },
          ],
        },
        {
          id: "who",
          text: "Usse poochho, kisne bheja hai?",
          english: "Ask him who sent him.",
          sets: ["did:guard-asked"],
          then: [
            { id: "g-3", from: "them", at: "02:41", text: "Naam nahi bata raha, ji. Bas bol raha hai, “Bhasin sahab ne bheja hai. Woh samajh jayenge.”", english: "He won't give a name. He only says, “Bhasin sahab sent me. They'll understand.”" },
            { id: "g-4", from: "them", at: "02:41", text: "Main gate band kar raha hoon.", english: "I'm shutting the gate." },
          ],
        },
        {
          id: "away",
          text: "Bol do main yahan nahi rehta.",
          english: "Tell him I don't live here.",
          sets: ["did:guard-lied"],
          then: [
            { id: "g-5", from: "them", at: "02:41", text: "Ji… woh aapka naam le raha hai. Poora naam.", english: "He's… he's saying your name. Your full name." },
            { id: "g-6", from: "them", at: "02:41", text: "Theek hai. Bol deta hoon.", english: "All right. I'll tell him." },
          ],
        },
      ],
    },
  },
];

const bhasin: Thread = {
  id: "bhasin-3",
  app: "whatsapp",
  name: "Bhasin Uncle",
  messages: [
    { id: "b-6", from: "them", day: "30/11", at: "02:25", with: "bhasin-near", requires: ["fired:bhasin-near"], text: "Location dekh li hai.", english: "I've seen the location." },
    /* The parcel went out with the player's address as its sender (O1), and
       came back to it: the man in the safari suit at 7 AM is a promise kept. */
    { id: "b-6a", from: "them", day: "30/11", at: "02:25", with: "bhasin-near", requires: ["fired:bhasin-near"], typing: 7, text: "Courier company mein bhi humare log hain. Parcel pe bhejne wale ka pata aapka hai na?", english: "We have people at the courier company too. The sender's address on that parcel is yours, isn't it?" },
    { id: "b-7", from: "them", day: "30/11", at: "02:25", with: "bhasin-near", requires: ["fired:bhasin-near"], typing: 6, text: "Subah 7 baje tak phone gate pe chhod dena. Guard ko kuch mat bolna.", english: "Leave the phone at the gate by 7 in the morning. Don't say anything to the guard." },
  ],
};

/* --- Sameer, one last time ------------------------------------------------- */

const sameer: Thread = {
  id: "sameer-new-3",
  app: "whatsapp",
  name: SAMEER_NEW,
  number: SAMEER_NEW,
  requires: ["fired:sameer-writes"],
  messages: [
    { id: "sn-19", from: "them", day: "30/11", at: "02:30", with: "sameer-last", requires: ["fired:sameer-last"], text: "Sab dekh liya?", english: "Seen it all?" },
    { id: "sn-20", from: "them", day: "30/11", at: "02:30", with: "sameer-last", requires: ["fired:sameer-last"], text: "Ab kya karna hai?", english: "What now?" },
  ],
  replies: [
    {
      id: "sameer-last",
      requires: ["fired:sameer-last"],
      options: [
        {
          id: "rescuer",
          text: "Tumne bachane ki koshish ki thi.",
          english: "You tried to save him.",
          sets: ["did:gave-rescuer"],
          then: [
            { id: "sn-21", from: "them", at: "02:31", text: "Haan. Maine koshish ki thi.", english: "Yes. I tried.", evidence: "sameer-rescuer" },
            { id: "sn-22", from: "them", at: "02:31", text: "Koi nahi maanega. Tu likh dena, please.", english: "Nobody will believe it. Write it down, please." },
          ],
        },
        {
          id: "confront",
          text: "1:49 pe tum uske paas the. 1:53 pe Nitin ne Vicky ko wapas bheja. Beech mein tumne usko kya bola?",
          english: "At 1:49 you were with him. At 1:53 Nitin sent Vicky back. What did you tell him in between?",
          /* With the night laid out (the shot, alive, the car, the board), and
             before the case file can say it: the line is his to say, and it's
             the reveal, not an echo of one (script §16). */
          requires: ["link:shot", "link:alive", "link:car", "link:kept"],
          sets: ["did:confronted-sameer"],
          then: [
            {
              id: "sn-23",
              from: "them",
              at: "02:33",
              typing: 14,
              text: "Maine usko bola Dilip nikal gaya hai. Mujhe pata tha woh nahi nikla tha.",
              english: "I told him Dilip had already left. I knew he hadn't.",
              evidence: "the-line",
            },
          ],
        },
      ],
    },
    /* The one thing a player wants from him at the end (PLAYTEST-SHAGUN.md
       #100): why. His answer is canon's motive, in his words, and still his
       version: the doctor he let himself believe in is Bhasin's. */
    {
      id: "sameer-why",
      requires: ["did:confronted-sameer"],
      options: [
        {
          id: "why",
          text: "Kyun?",
          english: "Why?",
          sets: ["did:asked-sameer-why"],
          then: [
            { id: "sn-24", from: "them", at: "02:34", typing: 9, text: "Kunal ke paas video tha. Meri goli ki.", english: "Kunal had a video. Of my shot." },
            { id: "sn-25", from: "them", at: "02:34", typing: 12, text: "Hospital jaata toh police aati. Case mera banta. Sirf mera. Kunal ka naam kahin nahi hota.", english: "If he'd reached a hospital, the police would come. The case would be mine. Only mine. Kunal's name wouldn't be anywhere." },
            { id: "sn-26", from: "them", at: "02:35", typing: 6, text: "Monday ko Mumbai join karna tha.", english: "I was joining in Mumbai on Monday." },
            { id: "sn-27", from: "them", at: "02:35", typing: 11, text: "Group mein Bhasin bol raha tha doctor aa raha hai. Maine maan liya. Maanna tha mujhe.", english: "In the group Bhasin kept saying a doctor was coming. I believed it. I needed to." },
            { id: "sn-28", from: "them", at: "02:36", typing: 16, text: "Woh mujhe bhaiya bolta tha.", english: "He called me bhaiya." },
          ],
        },
      ],
    },
  ],
};

/* --- Dilip's own number, at 2:10 (2026-10-24) -----------------------------
   A night nurse at a nursing home in Fatehpur Beri has a patient admitted as
   someone else, and his phone, charged at last. He woke once and said one
   name. It writes in the chat Sameer locked: the boy's own. */
const witness: readonly Message[] = [
  { id: "nu-1", from: "them", day: "30/11", at: "02:10", with: "the-witness", requires: ["fired:the-witness"], text: "Hello? Ye phone ek patient ka hai. Aap Sameer bhaiya ho?", english: "Hello? This phone belongs to a patient. Are you Sameer bhaiya?" },
  { id: "nu-2", from: "them", day: "30/11", at: "02:10", with: "the-witness", requires: ["fired:the-witness"], typing: 5, text: "Main Sister Anita. Bedi Nursing Home, Fatehpur Beri. Night duty pe hoon.", english: "I'm Sister Anita. Bedi Nursing Home, Fatehpur Beri. I'm on night duty." },
  {
    id: "nu-3",
    from: "them",
    day: "30/11",
    at: "02:11",
    with: "the-witness",
    requires: ["fired:the-witness"],
    typing: 8,
    text: "Ek hafta pehle raat ko ek ladka laaye the. File mein naam Deepak, 19, road accident. Par zakhm goli ka hai.",
    english: "A week ago, at night, they brought in a boy. The file says Deepak, 19, road accident. But the wound is a bullet's.",
  },
  { id: "nu-4", from: "them", day: "30/11", at: "02:11", with: "the-witness", requires: ["fired:the-witness"], typing: 6, text: "Kal raat thoda hosh aaya. Bas ek naam liya. Sameer bhaiya. Is phone mein aap hi ho.", english: "Last night he came round a little. He said one name. Sameer bhaiya. You're the one in this phone." },
  {
    id: "nu-5",
    from: "them",
    day: "30/11",
    at: "02:12",
    with: "the-witness",
    requires: ["fired:the-witness"],
    attachment: { kind: "photo", label: "A patient's belongings in a plastic bag: a folded maroon waistcoat with a name badge, DILIP, and a cracked phone", src: "/found/raakh/nurse-bag.jpg" },
    evidence: "belongings",
  },
  {
    id: "nu-6",
    from: "them",
    day: "30/11",
    at: "02:12",
    with: "the-witness",
    requires: ["fired:the-witness"],
    attachment: { kind: "voice", seconds: 6, transcript: "…bhaiya… light… ready… hai…", english: "…brother… the light's… ready…" },
    evidence: "patient-voice",
  },
  {
    id: "nu-7",
    from: "them",
    day: "30/11",
    at: "02:13",
    with: "the-witness",
    requires: ["fired:the-witness"],
    typing: 7,
    text: "Subah 7 baje inhe kahin aur shift kar rahe hain. Safari suit wale ek sahab aaye the. Bhasin sahab ka naam le rahe the.",
    english: "At 7 in the morning they're moving him somewhere else. A man in a safari suit came. He kept saying Bhasin sahab's name.",
  },
  { id: "nu-8", from: "them", day: "30/11", at: "02:13", with: "the-witness", requires: ["fired:the-witness"], text: "Police ko mat bolna. Thane ka SHO roz aata hai yahan, unke saath.", english: "Don't tell the police. The SHO from the station comes here every day, with them." },
  {
    id: "nu-9",
    from: "them",
    day: "30/11",
    at: "02:14",
    with: "the-witness",
    requires: ["fired:the-witness"],
    typing: 8,
    text: "Main akeli kuch nahi kar sakti. Do log chahiye. Ek jo inhe pehchaane. Aur ek jisse Bhasin sahab darte hon.",
    english: "I can't do anything alone. I need two people. One who can identify him. And one Bhasin sahab is afraid of.",
  },
  { id: "nu-10", from: "them", day: "30/11", at: "02:15", with: "the-witness", requires: ["fired:the-witness"], text: "Meri duty 3:30 tak hai. Side wala darwaza sirf main khol sakti hoon.", english: "My shift's until 3:30. Only I can open the side door." },
];

const dilipNumber: Thread = { id: "dilip", app: "whatsapp", name: "Dilip", locked: true, messages: witness };

export const threads: readonly Thread[] = [nitin, kunal, raju, bhasin, sameer, dilipNumber];


const events: readonly LiveEvent[] = [
  // The man with the phone on a map rings it, a few minutes into the night's last hour.
  { id: "bhasin-rings", device: "owner", after: ["fired:title-3"], unless: [OFFLINE], delay: 40, app: "phone" },
  // The phone online at 1:52: Nitin writes first, then Kunal (#107).
  { id: "nitin-reaches", device: "owner", after: ["fired:title-3"], unless: [OFFLINE, "did:nitin-asked", "did:nitin-pressed", "did:nitin-closed"], delay: 75, app: "whatsapp", banner: "Nitin · Bhai? Online dikh raha hai." },
  { id: "kunal-writes", device: "owner", after: ["fired:title-3"], unless: [OFFLINE, "did:confronted-kunal", "did:exposed-nitin"], delay: 150, app: "whatsapp", banner: "Kunal · Bhai phone on hai tera?" },
  // Given a reason, Nitin sends what he kept.
  { id: "nitin-sends", device: "owner", after: ["did:protect-nitin"], unless: [OFFLINE], delay: 5, app: "whatsapp", banner: "Nitin · 1:52 pe Sameer ne ye bheja tha." },
  // Kunal names Nitin to Bhasin, whichever way the player brought him up.
  { id: "nitin-named", device: "owner", after: ["did:confronted-kunal"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  { id: "nitin-named-2", device: "owner", after: ["did:exposed-nitin"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  // Told it was Kunal, Raju went to the Sehgals', and heard otherwise.
  { id: "raju-withdraws", device: "owner", after: ["did:raju-told-kunal", "fired:title-3"], unless: [OFFLINE], delay: 40, app: "whatsapp", banner: `${RAJU} · Aapne jhooth bola.`, sets: ["did:raju-withdrew"] },
  // Once the fire is known for what it was, Bhasin says where he's looked.
  { id: "bhasin-near", device: "owner", after: ["ask:q12"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Bhasin Uncle · Location dekh li hai." },
  /* Once the night is on the board, the man who sent the phone asks what now
     (and can be asked what he said at 1:52); once the player knows why he
     sent it, Dilip's brother asks what happened. */
  { id: "sameer-last", device: "owner", after: ["ask:q10"], unless: [OFFLINE], delay: 12, app: "whatsapp", banner: `${SAMEER_NEW} · Sab dekh liya?` },
  /* The living witness (2026-10-24): once he knows why the phone was sent,
     the boy's own number writes. In airplane mode it can't, and Raju rings
     yours instead. Then, once the player knows who it is, the clock. */
  { id: "the-witness", device: "owner", after: ["ask:q13"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Dilip · Hello? Ye phone ek patient ka hai. Aap Sameer bhaiya ho?", sets: ["did:witness"] },
  { id: "witness-relay", device: "yours", after: ["ask:q13", OFFLINE], unless: ["fired:the-witness"], delay: 20, app: "yours:phone", sets: ["did:witness"] },
  { id: "seven-clock", device: "owner", after: ["did:knows-alive"], unless: ["did:realtime"], delay: 6, app: "casefile" },
  // Real time (story.realtime): the clock starts here, and the calls wait for the player, or for seven.
  { id: "seven-clock-real", device: "owner", after: ["did:knows-alive", "did:realtime"], delay: 3, app: "casefile" },
  /* (game) 2026-10-24: the last hour. Once Raju has had his chance to ask
     (or couldn't), the night stops for the player's decision. Quiet: it
     waits for whatever they're reading. */
  { id: "last-hour", device: "owner", after: ["did:rescue-told"], delay: 4, app: "casefile", sets: ["did:last-hour"] },
];


/* --- Seven o'clock (2026-10-24) ----------------------------------------------
   The decider, played full screen against a clock: two calls before anyone
   moves. The nurse said what it takes: someone who can identify him, and
   someone Bhasin is afraid of. The note on the envelope said where not to
   go. Sameer goes only if he's been made to face what he did at 1:52. */
const MEERA = "Meera Arora, the lawyer this phone was meant for";
const RAJU_CALL = "Raju, his brother";
const SAMEER_CALL = "Sameer, still in Delhi until his train";
const POLICE = "112, the police";
const POST = "Post it from his Instagram: “Dilip is alive, at Bedi Nursing Home”";
const FACED = "did:confronted-sameer";
/** The night's last moment is over, either way: the finale can come. */
const TOLD = "did:rescue-told";

/** Who's on the other end of each call: their face, or a mark for the ones that aren't a person. */
const FACES: Record<string, { readonly face?: string; readonly glyph?: string }> = {
  meera: { face: "/found/raakh/dp-meera.jpg" },
  raju: { face: "/found/raakh/dp-raju.jpg" },
  sameer: { face: "/found/raakh/dp-sameer.jpg" },
  "sameer-faced": { face: "/found/raakh/dp-sameer.jpg" },
  police: { glyph: "112" },
  post: { glyph: "@" },
  froze: { glyph: "…" },
};

const withFaces = (all: readonly Moment[]): readonly Moment[] =>
  all.map((m) => ({ ...m, options: m.options.map((o) => ({ ...FACES[o.id], ...o })) }));

export const moments: readonly Moment[] = withFaces([
  {
    id: "first-call",
    after: ["did:knows-alive", "fired:seven-clock"],
    unless: ["did:lost"],
    where: "2:58 AM · Four hours to seven",
    lines: [
      { text: "Fatehpur Beri is twenty minutes from Chhattarpur. They move him at seven." },
      { who: "Sister Anita", text: "Do log chahiye. Ek jo inhe pehchaane. Aur ek jisse Bhasin sahab darte hon.", english: "I need two people. One who can identify him. And one Bhasin sahab is afraid of." },
      { text: "Two calls, before anyone notices. Who first?" },
    ],
    seconds: 40,
    timeout: "froze",
    options: [
      { id: "meera", text: MEERA, sets: ["did:call-meera"] },
      { id: "raju", text: RAJU_CALL, sets: ["did:call-raju"] },
      { id: "sameer", text: SAMEER_CALL, sets: ["did:call-sameer"] },
      { id: "police", text: POLICE, sets: ["did:call-police", "did:lost"] },
      { id: "post", text: POST, sets: ["did:call-post", "did:lost"] },
      { id: "froze", text: "Wait. Think it through first.", sets: ["did:froze", "did:lost"] },
    ],
  },
  {
    id: "after-meera",
    after: ["did:call-meera"],
    unless: ["did:lost", "did:saved"],
    where: "3:01 AM · One more call",
    lines: [
      { who: "Meera", text: "Zinda hai? …Theek hai. Main DCP Saket ko jaanti hoon. Woh Bhasin ka aadmi nahi hai.", english: "Alive? …All right. I know the DCP at Saket. He isn't Bhasin's man." },
      { who: "Meera", text: "Par file mein naam Deepak hai. Mujhe wahan koi chahiye jo usko pehchaane. Abhi.", english: "But the file says Deepak. I need someone there who can identify him. Now." },
    ],
    seconds: 30,
    timeout: "police",
    options: [
      { id: "raju", text: RAJU_CALL, sets: ["did:call-raju", "did:saved"] },
      { id: "sameer-faced", text: SAMEER_CALL, requires: [FACED], sets: ["did:call-sameer", "did:sameer-went", "did:saved"] },
      { id: "sameer", text: SAMEER_CALL, unless: [FACED], sets: ["did:call-sameer", "did:sameer-stayed", "did:lost"] },
      { id: "police", text: POLICE, sets: ["did:call-police", "did:lost"] },
      { id: "post", text: POST, sets: ["did:call-post", "did:lost"] },
    ],
  },
  {
    id: "after-raju",
    after: ["did:call-raju"],
    unless: ["did:lost", "did:saved"],
    where: "3:01 AM · One more call",
    lines: [
      { who: "Raju", text: "Fatehpur Beri? Main nikal raha hoon. Bike pe chaalis minute.", english: "Fatehpur Beri? I'm leaving now. Forty minutes on the bike." },
      { who: "Raju", text: "Par akele mujhe andar nahi jaane denge. Main delivery wala hoon. Koi aur chahiye.", english: "But alone they won't let me in. I'm a delivery boy. I need someone else." },
    ],
    seconds: 30,
    timeout: "police",
    options: [
      { id: "meera", text: MEERA, sets: ["did:call-meera", "did:saved"] },
      { id: "sameer-faced", text: SAMEER_CALL, requires: [FACED], sets: ["did:call-sameer", "did:sameer-went", "did:saved"] },
      { id: "sameer", text: SAMEER_CALL, unless: [FACED], sets: ["did:call-sameer", "did:sameer-stayed", "did:lost"] },
      { id: "police", text: POLICE, sets: ["did:call-police", "did:lost"] },
      { id: "post", text: POST, sets: ["did:call-post", "did:lost"] },
    ],
  },
  /* He was made to say 1:52 out loud: this time, he goes. */
  {
    id: "after-sameer-faced",
    after: ["did:call-sameer", FACED],
    unless: ["did:lost", "did:saved"],
    where: "3:01 AM · One more call",
    lines: [
      { who: "Sameer", text: "…Zinda hai?", english: "…He's alive?" },
      { who: "Sameer", text: "Main jaata hoon. Abhi. Is baar main jaata hoon.", english: "I'm going. Now. This time, I'm going." },
      { text: "He can say who the boy is. Someone still has to make Bhasin's people stand aside." },
    ],
    seconds: 30,
    timeout: "police",
    options: [
      { id: "meera", text: MEERA, sets: ["did:call-meera", "did:sameer-went", "did:saved"] },
      { id: "raju", text: RAJU_CALL, sets: ["did:call-raju", "did:sameer-went", "did:saved"] },
      { id: "police", text: POLICE, sets: ["did:call-police", "did:lost"] },
      { id: "post", text: POST, sets: ["did:call-post", "did:lost"] },
    ],
  },
  /* Given the rescuer's story, or never pressed: he does at 3 AM what he did at 1:52. */
  {
    id: "after-sameer",
    after: ["did:call-sameer"],
    unless: ["did:lost", "did:saved", FACED],
    where: "3:01 AM · One more call",
    lines: [
      { who: "Sameer", text: "…Zinda hai?", english: "…He's alive?" },
      { who: "Sameer", text: "Main nahi aa sakta. Mera train hai. Tu samajh na. Bhasin dekh lega.", english: "I can't come. I've got my train. Understand. Bhasin will handle it." },
      { text: "A week ago he sent help away with almost the same words. It's 3:04. One call left." },
    ],
    seconds: 30,
    timeout: "police",
    options: [
      { id: "meera", text: MEERA, sets: ["did:call-meera", "did:sameer-stayed", "did:lost"] },
      { id: "raju", text: RAJU_CALL, sets: ["did:call-raju", "did:sameer-stayed", "did:lost"] },
      { id: "police", text: POLICE, sets: ["did:call-police", "did:sameer-stayed", "did:lost"] },
      { id: "post", text: POST, sets: ["did:call-post", "did:sameer-stayed", "did:lost"] },
    ],
  },
  {
    id: "found",
    after: ["did:saved"],
    where: "3:24 AM · Bedi Nursing Home, Fatehpur Beri",
    lines: [
      { text: "A white Gypsy with a blue light turns in at the front gate. The man in the safari suit, smoking by the back gate, drops his cigarette and walks away fast." },
      { text: "Sister Anita opens the side door. Room 6. A boy, thinner than in any photograph, a drip in his arm." },
      { who: "Raju", text: "Dilip.", english: "Dilip." },
      { text: "He opens his eyes." },
      { who: "Dilip", text: "…Bhaiya. Light ready hai.", english: "…Bhaiya. The light's ready." },
    ],
    options: [{ id: "on", text: "Go on", sets: ["did:rescue-told"] }],
  },
  /* Too late, told straight after the call that lost it, at the hour it
     happened: what the two calls were missing. Seven o'clock itself, Room 6
     empty, is left for the ending, after the record has gone out. */
  {
    id: "late-police",
    after: ["did:lost", "did:call-police"],
    unless: [TOLD],
    where: "3:09 AM · 112",
    lines: [
      { text: "The control room puts you through to the local station. The man who answers asks your name twice, and the nursing home's address once." },
      { who: "SHO, Chhattarpur", text: "Hum dekh lenge. Aap phone rakhiye.", english: "We'll look into it. Put the phone down." },
      { text: "Four minutes later, Bhasin Uncle's number shows online." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  {
    id: "late-post",
    after: ["did:lost", "did:call-post"],
    unless: [TOLD],
    where: "3:12 AM · @sk.weddings",
    lines: [
      { text: "The post goes up from his account. Forty shares in ten minutes, then four hundred." },
      { text: "Bhasin Uncle reads it. Online, then not." },
      { text: "At 3:14 the back gate of Bedi Nursing Home opens, and closes." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  /* Real time (story.realtime), run out: her shift ended with nobody on the way. */
  {
    id: "late-clock",
    after: ["did:lost", "did:froze", "did:realtime"],
    unless: [TOLD],
    where: "3:30 AM · Bedi Nursing Home, Fatehpur Beri",
    lines: [
      { text: "Sister Anita's shift ends. The side door is locked behind her." },
      { text: "Nobody you could have called is on their way." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  {
    id: "late-froze",
    after: ["did:lost", "did:froze"],
    unless: [TOLD],
    where: "3:00 AM · Four hours to seven",
    lines: [
      { text: "You hold the phone and think it through." },
      { text: "By the time you have, it's past three, and nobody has called anybody." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  {
    id: "late-meera",
    after: ["did:lost", "did:call-meera"],
    unless: [TOLD, "did:call-raju"],
    where: "3:24 AM · Bedi Nursing Home, Fatehpur Beri",
    lines: [
      { text: "A DCP's car at the front gate, and Meera beside it in yesterday's clothes." },
      { who: "Sister Anita", text: "Deepak naam ka patient hai. Koi inhe pehchaanne wala hai?", english: "The patient's name is Deepak. Is there anyone who can identify him?" },
      { text: "Nobody there has ever seen Dilip's face. The DCP writes something down, and leaves a constable at the gate until his shift ends at six." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  {
    id: "late-raju",
    after: ["did:lost", "did:call-raju"],
    unless: [TOLD, "did:call-meera"],
    where: "3:50 AM · Bedi Nursing Home, Fatehpur Beri",
    lines: [
      { text: "Raju gets there on a borrowed scooter. The man in the safari suit at the back gate says the nursing home is closed." },
      { text: "Raju shouts his brother's name at a dark window until the chowkidar threatens him with the police." },
      { who: "Raju", text: "Bhaiya, woh andar hai. Main jaanta hoon woh andar hai.", english: "Bhaiya, he's in there. I know he's in there." },
    ],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
  /* Any other way of losing him: never a night with no way to its end. */
  {
    id: "late",
    after: ["did:lost"],
    unless: [TOLD],
    where: "3:30 AM · Four hours to seven",
    lines: [{ text: "Nobody you called is going to get to Room 6 before Bhasin's people do." }],
    options: [{ id: "on", text: "Go on", sets: [TOLD] }],
  },
]);

export const episode3 = { evidence, questions, events, threads, incoming, moments };
