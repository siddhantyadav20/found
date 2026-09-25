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
   hua" (phone.ts), from the first minute. Its password is 0152: the minute
   of the lie, which nothing on the phone gives before this episode opens on
   it (CHAPTER1.md F, the layers).

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
  { id: "search-1244", device: "owner", app: "safari", label: "Safari, 12:44 AM: “goli lagne pe kya karein”", within: true, requires: now },
  { id: "search-156", device: "owner", app: "safari", label: "Safari, 1:56 AM: “private ambulance chhattarpur 24 hours”", within: true, requires: now },
  { id: "site-plan", device: "owner", app: "mail", label: "The site plan: the service room, 40 m from the service gate on Mandi Road", within: true, requires: now },

  // Q11: Nitin's copy, if he trusts you.
  { id: "nitin-shot-152", device: "owner", app: "whatsapp", label: "Nitin's screenshot: Sameer at 1:52, “Dilip ko le gaye… Tu Vicky ko wapas bhej”", within: true, requires: ["ep:3", "did:protect-nitin"] },
  { id: "vicky-location", device: "owner", app: "whatsapp", label: "Vicky's live location, 1:38–2:06: six minutes at the service gate", within: true, requires: ["ep:3", "did:protect-nitin"] },

  // Q12: the fire.
  { id: "fire-original", device: "owner", app: "notes", label: "The whole fire clip, in his locked note: 31 seconds, “Bhasin sir, yahan?”, his hands, a jerrycan", manual: true, requires: [...now, UNLOCKED] },
  { id: "kunal-wood", device: "owner", app: "whatsapp", label: "Kunal: “Aur aag? Lakdi tu khud dhoke laaya tha.”", within: true, requires: ["ep:3", "did:confronted-kunal"] },

  // Q13: their evidence.
  { id: "frame", device: "owner", app: "notes", label: "In his locked note: Kunal's frame of the second shot, “Humare paas bhi hai”", manual: true, requires: [...now, UNLOCKED] },
  { id: "kunal-frame", device: "owner", app: "whatsapp", label: "Kunal sends it again: the frame, “Tera Nitin bhi andar hai”", within: true, requires: ["ep:3", "did:exposed-nitin"] },

  // Sameer, one last time.
  { id: "sameer-rescuer", device: "owner", app: "whatsapp", label: "Sameer: “Haan. Maine koshish ki thi.”", within: true, requires: ["ep:3", "did:gave-rescuer"] },
  { id: "the-line", device: "owner", app: "whatsapp", label: "Sameer: “Maine usko bola Dilip nikal gaya hai. Mujhe pata tha woh nahi nikla tha.”", within: true, requires: ["ep:3", "did:confronted-sameer"] },
];

const questions: readonly Question[] = [
  {
    kind: "timeline",
    id: "q10",
    ask: "Between the shot and the fire, where was Dilip, and who kept him there?",
    episode: 3,
    whereToLook: ["photos", "whatsapp", "safari"],
    hints: [
      "Five people's night, minute by minute: Dilip, Sameer, Nitin, the car, and Bhasin. The screenshots, the locked chats and Safari's history all have times.",
      "Bhasin's orders are in the screenshots of his group. Sameer's searches are in Safari › History. Nitin's messages, and Dilip's, are in the chats Sameer locked.",
      "Dilip: 1:07, 1:14, 2:41. Sameer: 12:44, 1:49, 1:56. Nitin: 1:22, 1:53. The car: 1:40 (or Nitin), 1:59, 2:04. Bhasin: 12:38, 12:52.",
    ],
    lanes: [
      { id: "dilip", label: "Dilip" },
      { id: "sameer", label: "Sameer" },
      { id: "nitin", label: "Nitin" },
      { id: "car", label: "The car" },
      { id: "bhasin", label: "Bhasin" },
    ],
    // Each row as the phone says it, with nobody's name on it: which life it belongs to is the player's to say.
    rows: [
      { id: "v-112", at: "00:38", text: "“Koi 112 nahi karega. Ladke ko service room le jao.”", lane: "bhasin", evidence: "no-112" },
      { id: "v-1244", at: "00:44", text: "A search: “goli lagne pe kya karein”", lane: "sameer", evidence: "search-1244" },
      { id: "v-doctor", at: "00:52", text: "“Doctor ka intezaam ho raha hai.”", lane: "bhasin", evidence: "doctor" },
      { id: "v-107", at: "01:07", text: "“Bhaiya dard ho raha hai. Aap aa rahe ho na?”", lane: "dilip", evidence: "chhotu-107" },
      { id: "v-114", at: "01:14", text: "“Sir ladka hosh mein hai. Paani maang raha hai.”", lane: "dilip", evidence: "conscious" },
      { id: "v-122", at: "01:22", text: "“20 min. Service gate pe laata hoon.”", lane: "nitin", evidence: "nitin-car" },
      { id: "v-140", at: "01:40", text: "“10 min. Mandi Road wala na?”", lane: "car", orLane: "nitin", evidence: "nitin-gate" },
      { id: "v-149", at: "01:49", text: "“Service room mein hain, ladke ke paas.”", lane: "sameer", evidence: "sameer-room", odd: true },
      { id: "v-153", at: "01:53", text: "“Agar le gaye hain toh wapas bhej deta hoon.”", lane: "nitin", evidence: "nitin-reply", odd: true },
      { id: "v-156", at: "01:56", text: "A search: “private ambulance chhattarpur 24 hours”", lane: "sameer", evidence: "search-156", odd: true },
      { id: "v-159", at: "01:59", text: "“Ek Swift aayi hai, kisi ko lene.”", lane: "car", evidence: "swift" },
      { id: "v-204", at: "02:04", text: "“Chali gayi sir.”", lane: "car", evidence: "left-empty" },
      { id: "v-241", at: "02:41", text: "“Sir ladka bol nahi raha.”", lane: "dilip", evidence: "not-speaking" },
    ],
    enough: [
      ["no-112", "conscious", "left-empty"],
      ["no-112", "chhotu-107", "left-empty"],
    ],
    reply:
      "Bhasin kept him there: from 12:38, in the service room, still awake at 1:14. At 1:59 a car was at the service gate, waiting for someone. At 2:04 it left without him.",
    sets: ["link:kept"],
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
      "Sameer, at 1:52, knowing. Table Nitin's screenshot with Ramesh's 1:49, or 1:49 with Nitin's 1:53 reply and the 1:56 ambulance search.",
    ],
    say: {
      line: "{who} sent the car away at {time}: {how}.",
      blanks: {
        who: ["Sameer", "Bhasin's people", "Kunal", "Nitin himself"],
        time: ["1:49", "1:52", "1:59", "2:04"],
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
        words: { who: "Bhasin's people", time: "1:59", how: "they stopped it at the gate" },
        text: "Bhasin's people turned it away at the gate.",
        proof: ["swift", "left-empty"],
        orProof: [["sameer-tried", "left-empty"]],
        reply: "On the record, as Sameer tells it.",
        version: true,
        link: "lie",
      },
      {
        id: "told",
        words: { who: "Sameer", time: "1:52", how: "he told Nitin Dilip had already gone, knowing he hadn't" },
        text: "At 1:52 Sameer told Nitin that Dilip had already gone for treatment. He knew he hadn't.",
        proof: ["nitin-shot-152", "sameer-room"],
        also: ["nitin-reply", "search-156", "nitin-car", "nitin-gate", "swift", "left-empty", "nitin-back"],
        orProof: [["sameer-room", "nitin-reply", "search-156"]],
        moment: "He knew.",
        reply: "At 1:49 he was in the room with Dilip. At 1:52 he told Nitin that Dilip had gone. The car that could have taken him was minutes from the gate.",
        sets: ["link:lie"],
        pays: ["q9:sameer"],
      },
      {
        id: "believed",
        words: { who: "Sameer", time: "1:52", how: "he told Nitin Dilip had already gone, believing it" },
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
    ask: "Why did Sameer film the fire?",
    episode: 3,
    whereToLook: ["notes", "whatsapp"],
    hints: [
      "The clip in Favorites is nine seconds of something longer. He kept the rest somewhere only he could open.",
      "Notes › “Agar kuch hua” is locked, and its hint is his: “When I told N”. What time did he write to Nitin? Or ask Kunal what he remembers.",
      "He took part, on Bhasin's orders. The password is 0152, the minute he wrote to Nitin. Table the whole fire clip, or Kunal's “Lakdi tu khud dhoke laaya tha” with the clip in Favorites.",
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
      "A counter-file, because they can prove he fired, with 1:52 left out. Table Kunal's frame (in the locked note, or Kunal's chat) with the whole fire clip and Nitin's 1:53 (or his copy of 1:52), or the frame with the reel take and the memo.",
    ],
    say: {
      line: "He sent this phone {how}, because {why}, and he left out {what}.",
      blanks: {
        how: ["to confess and get help", "as a counter-file"],
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
        words: { how: "as a counter-file", why: "they can prove he fired", what: "what he did at 1:52" },
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
  { id: "n-12", from: "them", day: "30/11", at: "01:55", with: "nitin-sends", requires: ["fired:nitin-sends"], typing: 6, text: "1:52 pe Sameer ne ye bheja tha. Tere wale phone se delete hai. Mere pe nahi.", english: "Sameer sent this at 1:52. It's deleted on the phone you've got. Not on mine." },
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

const nitin: Thread = {
  id: "nitin-3",
  app: "whatsapp",
  name: "Nitin",
  locked: true,
  messages: [...nitinSends, ...nitinNamed("nitin-named"), ...nitinNamed("nitin-named-2")],
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
          requires: ["did:wrote-meera"],
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
  messages: [],
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
              attachment: { kind: "photo", label: "A frame from a video: an arm coming down, a flash, a boy behind a light" },
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
    { id: "r-13", from: "them", day: "30/11", at: "02:20", with: "raju-withdraws", requires: ["fired:raju-withdraws"], text: "Sehgal ke ghar gaya tha. Wahan bola goli photographer ne chalayi thi, Kunal ne nahi.", english: "I went to the Sehgals' house. They said the photographer fired, not Kunal." },
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
];

const bhasin: Thread = {
  id: "bhasin-3",
  app: "whatsapp",
  name: "Bhasin Uncle",
  messages: [
    { id: "b-6", from: "them", day: "30/11", at: "02:25", with: "bhasin-near", requires: ["fired:bhasin-near"], text: "Location dekh li hai.", english: "I've seen the location." },
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
          text: "1:49 pe tum uske paas the. 1:52 pe tumne Nitin ko bola Dilip chala gaya.",
          english: "At 1:49 you were with him. At 1:52 you told Nitin Dilip had gone.",
          // Only with the whole chain: the shot, alive, the car, and the lie.
          requires: ["link:shot", "link:alive", "link:car", "link:lie"],
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
  ],
};

export const threads: readonly Thread[] = [nitin, kunal, raju, bhasin, sameer];

const events: readonly LiveEvent[] = [
  // The man with the phone on a map rings it, a few minutes into the night's last hour.
  { id: "bhasin-rings", device: "owner", after: ["fired:title-3"], unless: [OFFLINE], delay: 40, app: "phone" },
  // Given a reason, Nitin sends what he kept.
  { id: "nitin-sends", device: "owner", after: ["did:protect-nitin"], unless: [OFFLINE], delay: 5, app: "whatsapp", banner: "Nitin · 1:52 pe Sameer ne ye bheja tha." },
  // Kunal names Nitin to Bhasin, whichever way the player brought him up.
  { id: "nitin-named", device: "owner", after: ["did:confronted-kunal"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  { id: "nitin-named-2", device: "owner", after: ["did:exposed-nitin"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  // Told it was Kunal, Raju went to the Sehgals', and heard otherwise.
  { id: "raju-withdraws", device: "owner", after: ["did:raju-told-kunal", "fired:title-3"], unless: [OFFLINE], delay: 40, app: "whatsapp", banner: `${RAJU} · Aapne jhooth bola.`, sets: ["did:raju-withdrew"] },
  // Once the fire is known for what it was, Bhasin says where he's looked.
  { id: "bhasin-near", device: "owner", after: ["ask:q12"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Bhasin Uncle · Location dekh li hai." },
  // Once the player knows why the phone was sent, the man who sent it asks what now; then Dilip's brother asks what happened.
  { id: "sameer-last", device: "owner", after: ["ask:q13"], unless: [OFFLINE], delay: 10, app: "whatsapp", banner: `${SAMEER_NEW} · Sab dekh liya?` },
  { id: "raju-last", device: "owner", after: ["ask:q13"], unless: [OFFLINE, "did:raju-withdrew"], delay: 45, app: "whatsapp", banner: `${RAJU} · Kuch pata chala? Sach batana.` },
];

export const episode3 = { evidence, questions, events, threads, incoming };
