import type { Evidence, IncomingCall, LiveEvent, Message, Question, Thread } from "../types";
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
    ask: "What did Sameer do at the fire, and why keep the footage?",
    episode: 3,
    whereToLook: ["notes", "whatsapp"],
    hints: [
      "The clip in Favorites is nine seconds of something longer. He kept the rest somewhere only he could open.",
      "Notes › “Agar kuch hua” is locked, and its hint is his: “birthday · ddmm”. Settings has his birthday, under his name. Or ask Kunal what he remembers.",
      "He took part, on Bhasin's orders. The password is 1403: he was born on 14 March. Table the whole fire clip, or Kunal's “Lakdi tu khud dhoke laaya tha” with the clip in Favorites.",
    ],
    say: {
      line: "At the fire, Sameer {role}, on {whose} orders, and kept the footage {why}.",
      blanks: {
        role: ["took part", "only watched", "tried to stop it"],
        whose: ["Bhasin's", "Kunal's"],
        why: ["as proof against them", "to confess", "to sell it"],
      },
    },
    claims: [
      {
        id: "proof",
        words: { role: "only watched", whose: "Bhasin's", why: "as proof against them" },
        text: "He saw it, and filmed it to have proof against them.",
        proof: ["vn-burned", "fire-clip"],
        orProof: [["sameer-mistake", "fire-clip"]],
        reply: "On the record, as he tells it: “Main wahan tha. Maine dekha.”",
        version: true,
        link: "fire",
      },
      {
        id: "part",
        words: { role: "took part", whose: "Bhasin's", why: "as proof against them" },
        text: "He took part, on Bhasin's orders, and kept the footage as proof against them.",
        proof: ["fire-original"],
        also: ["fire-clip", "vn-burned", "kunal-wood"],
        orProof: [["kunal-wood", "fire-clip"]],
        moment: "His hands.",
        reply: "The first twenty-two seconds are his voice, “Bhasin sir, yahan?”, and his own hands, with the kada, setting down a jerrycan. He left M the last nine, and locked the rest away for himself.",
        sets: ["link:fire"],
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
    attachment: { kind: "photo", label: "Screenshot · Sameer, 1:52 AM: “Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bhej aur nikal yahan se.”" },
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
    attachment: { kind: "photo", label: "Screenshot · Vicky's live location, 1:38–2:06 AM: in along Mandi Road, six minutes at the service gate, out" },
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
    { id: "r-16", from: "them", day: "30/11", at: "02:34", with: "raju-last", requires: ["fired:raju-last"], text: "Aap abhi bhi jaag rahe ho?", english: "Are you still awake?" },
    { id: "r-17", from: "them", day: "30/11", at: "02:34", with: "raju-last", requires: ["fired:raju-last"], typing: 5, text: "Kuch pata chala? Sach batana.", english: "Did you find out anything? Tell me the truth." },
  ],
  replies: [
    /* The last thing asked of the player on his phone, and the one nobody
       else can answer: what happened to Dilip, told to his brother. */
    {
      id: "raju-last",
      requires: ["fired:raju-last"],
      unless: ["did:raju-withdrew"],
      options: [
        {
          id: "truth",
          text: "Dilip ab nahi raha. Us raat goli lagi, woh kuch ghante zinda tha, aur kisi ne use bachaya nahi. Main sab likh ke de raha hoon.",
          english: "Dilip is gone. He was shot that night, he was alive for hours, and nobody saved him. I'm writing it all down.",
          sets: ["did:told-raju"],
          then: [
            { id: "r-18", from: "them", at: "02:36", typing: 16, text: "Maa ko kya bolun?", english: "What do I tell Maa?" },
            { id: "r-19", from: "them", at: "02:38", attachment: { kind: "photo", label: "Dilip at Chhath, Samastipur: a yellow kurta, squinting into the sun, laughing" } },
            { id: "r-20", from: "them", at: "02:38", text: "Isko rakhna. Uski yahi achhi photo hai.", english: "Keep this one. It's his only good photo." },
          ],
        },
        {
          id: "wait",
          text: "Abhi pakka nahi keh sakta. Subah tak bata doonga.",
          english: "I can't say for sure yet. I'll tell you by morning.",
          sets: ["did:kept-raju-waiting"],
          then: [{ id: "r-21", from: "them", at: "02:35", typing: 6, text: "Theek hai. Main jaag raha hoon.", english: "All right. I'm awake." }],
        },
      ],
    },
  ],
};

/* --- Bhasin, who has the phone on a map ------------------------------------ */

const incoming: readonly IncomingCall[] = [
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

export const threads: readonly Thread[] = [nitin, kunal, raju, bhasin, sameer];

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
  { id: "raju-last", device: "owner", after: ["ask:q13"], unless: [OFFLINE, "did:raju-withdrew"], delay: 45, app: "whatsapp", banner: `${RAJU} · Kuch pata chala? Sach batana.` },
];

export const episode3 = { evidence, questions, events, threads, incoming };
