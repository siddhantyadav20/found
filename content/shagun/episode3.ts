import type { Evidence, LiveEvent, Message, Question, Thread } from "../types";
import { SAMEER_NEW } from "./episode1";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 3 — "The Cancelled Rescue". Sunday, 1:52 AM on the story's clock: a
   week to the minute after the lie.

   CHAPTER1.md F, Episode 3: the missing interval on a five-lane board;
   Nitin, who can be protected or pressed; why the car left empty (his
   version, or the lie); the fire, reverted; why he filmed it; their
   evidence, in the Hidden album; why he sent the phone; and Sameer, one last
   time, told he tried to save him or confronted with the whole chain.

   And the routes (CHAPTER1.md H): Kunal, messaged as Sameer, who can be asked
   for the truth or handed Nitin's name, and either way names Nitin to
   Bhasin; Raju, who hears at the Sehgals' that he was lied to; airplane mode,
   after which nobody reaches the phone. Every link keeps a route on the
   phone whichever of these closes (ROADMAP S12 holds it to that).

   The record, and what the player does with it, are ROADMAP S9.

   Believes (canon): Sameer and the family are both responsible, but not in
   the same way.
   =========================================================================== */

const now: readonly ["ep:3"] = ["ep:3"];

/** Airplane mode, turned on by hand (lib/game/phone.ts): after it, nobody's messages reach the phone. */
const OFFLINE = "did:airplane";

const evidence: readonly Evidence[] = [
  // Q10: the board.
  { id: "no-112", device: "owner", app: "whatsapp", label: "Bhasin, 12:38 AM: “Koi 112 nahi karega. Ladke ko service room le jao.”", within: true, requires: now },
  { id: "doctor", device: "owner", app: "whatsapp", label: "Bhasin, 12:52 AM: “Doctor ka intezaam ho raha hai.”", within: true, requires: now },
  { id: "sameer-room", device: "owner", app: "whatsapp", label: "Ramesh, 1:49 AM: Sameer is in the service room with the boy", within: true, requires: now },
  { id: "not-speaking", device: "owner", app: "whatsapp", label: "Pappu, 2:41 AM: “Sir ladka bol nahi raha.”", within: true, requires: now },
  { id: "search-1244", device: "owner", app: "safari", label: "Safari, 12:44 AM: “goli lagne pe kya karein”", within: true, requires: now },
  { id: "search-156", device: "owner", app: "safari", label: "Safari, 1:56 AM: “private ambulance chhattarpur 24 hours”", within: true, requires: now },
  { id: "site-plan", device: "owner", app: "mail", label: "The site plan: the service room, 40 m from the service gate on Mandi Road", within: true, requires: now },

  // Q11: Nitin's copy, if he trusts you.
  { id: "nitin-shot-152", device: "owner", app: "whatsapp", label: "Nitin's screenshot: Sameer at 1:52, “Dilip ko le gaye… Tu Vicky ko wapas bhej”", within: true, requires: ["ep:3", "did:protect-nitin"] },
  { id: "vicky-location", device: "owner", app: "whatsapp", label: "Vicky's live location, 1:38–2:06: six minutes at the service gate", within: true, requires: ["ep:3", "did:protect-nitin"] },

  // Q12: the fire.
  { id: "fire-original", device: "owner", app: "photos", label: "The fire clip, reverted: 31 seconds, “Bhasin sir, yahan?”, his hands, a jerrycan", manual: true, foundBy: ["did:reverted-fire"], requires: now },
  { id: "kunal-wood", device: "owner", app: "whatsapp", label: "Kunal: “Aur aag? Lakdi tu khud dhoke laaya tha.”", within: true, requires: ["ep:3", "did:confronted-kunal"] },

  // Q13: their evidence.
  { id: "frame", device: "owner", app: "photos", label: "Hidden: Kunal's frame of the second shot, “Humare paas bhi hai”", manual: true, requires: now },
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
    whereToLook: ["whatsapp", "safari", "mail"],
    hints: [
      "Five people's night, minute by minute: Dilip, Sameer, Nitin, the car, and Bhasin. The group, the archived chats and Safari's history all have times.",
      "Bhasin's orders are in Banyan — Security. Sameer's searches are in Safari › History. The site plan in Mail shows how far the service room was from the gate.",
      "Dilip: 1:07, 1:14, 2:41. Sameer: 12:44, 1:49, 1:56. Nitin: 1:22, 1:53. The car: 1:40, 1:59, 2:04. Bhasin: 12:38, 12:52.",
    ],
    lanes: [
      { id: "dilip", label: "Dilip" },
      { id: "sameer", label: "Sameer" },
      { id: "nitin", label: "Nitin" },
      { id: "car", label: "The car" },
      { id: "bhasin", label: "Bhasin" },
    ],
    rows: [
      { id: "v-112", at: "00:38", text: "No 112. The boy to the service room", lane: "bhasin", evidence: "no-112" },
      { id: "v-1244", at: "00:44", text: "Searches: what to do for a gunshot", lane: "sameer", evidence: "search-1244" },
      { id: "v-doctor", at: "00:52", text: "“A doctor is being arranged.” None comes", lane: "bhasin", evidence: "doctor" },
      { id: "v-107", at: "01:07", text: "“Bhaiya dard ho raha hai. Aap aa rahe ho na?”", lane: "dilip", evidence: "chhotu-107" },
      { id: "v-114", at: "01:14", text: "Awake, asking for water", lane: "dilip", evidence: "conscious" },
      { id: "v-122", at: "01:22", text: "Gets Vicky's car: “Dilip ko wahan le aao”", lane: "nitin", evidence: "nitin-car" },
      { id: "v-140", at: "01:40", text: "Ten minutes out, for the Mandi Road gate", lane: "car", evidence: "nitin-gate" },
      { id: "v-149", at: "01:49", text: "In the service room, with the boy", lane: "sameer", evidence: "sameer-room", odd: true },
      { id: "v-153", at: "01:53", text: "“Agar le gaye hain…”: sends the car back", lane: "nitin", evidence: "nitin-reply", odd: true },
      { id: "v-156", at: "01:56", text: "Searches: a private ambulance", lane: "sameer", evidence: "search-156", odd: true },
      { id: "v-159", at: "01:59", text: "At the service gate, to pick someone up", lane: "car", evidence: "swift" },
      { id: "v-204", at: "02:04", text: "Leaves, empty", lane: "car", evidence: "left-empty" },
      { id: "v-241", at: "02:41", text: "“Sir ladka bol nahi raha.”", lane: "dilip", evidence: "not-speaking" },
    ],
    enough: [
      ["no-112", "conscious", "left-empty"],
      ["no-112", "chhotu-107", "left-empty"],
      ["no-112", "site-plan", "left-empty"],
    ],
    reply:
      "Bhasin kept him there: from 12:38, in the service room, awake at 1:14. At 1:59 a car was at the service gate on Mandi Road, waiting for someone. At 2:04 it left without him.",
    sets: ["link:kept"],
  },
  {
    kind: "file",
    id: "q11",
    ask: "Why did the car leave empty?",
    episode: 3,
    whereToLook: ["whatsapp", "safari"],
    hints: [
      "Nitin sent the car back at 1:53, answering something. What was he told, and by whom?",
      "Nitin still has the message Sameer deleted, if he'll trust you with it. On this phone, 1:49, 1:53 and 1:56 are enough.",
      "Table Nitin's screenshot with Ramesh's 1:49, or 1:49 with Nitin's 1:53 reply and the 1:56 ambulance search.",
    ],
    claims: [
      {
        id: "turned",
        text: "Bhasin's people turned it away at the gate.",
        proof: ["swift", "left-empty"],
        orProof: [["sameer-tried", "left-empty"]],
        reply: "On the record.",
        version: true,
        link: "lie",
      },
      {
        id: "told",
        text: "At 1:52 Sameer told Nitin that Dilip had already gone for treatment. He knew he hadn't.",
        proof: ["nitin-shot-152", "sameer-room"],
        orProof: [["sameer-room", "nitin-reply", "search-156"]],
        reply: "On the record. At 1:49 he was in the room with Dilip. At 1:52 he told Nitin that Dilip had gone. At 1:56 he was still looking for an ambulance.",
        sets: ["link:lie"],
      },
    ],
    reply: "On the record.",
    // Nitin's copy of the message, found after filing his version, says what 1:52 was.
    reopenWhen: ["saw:nitin-shot-152"],
  },
  {
    kind: "file",
    id: "q12",
    ask: "Why did Sameer film the fire?",
    episode: 3,
    whereToLook: ["photos", "whatsapp"],
    hints: [
      "The clip in Favorites is nine seconds long, and Photos says it was edited.",
      "iOS keeps the original of an edited video: open it, then Edit › Revert. Or ask Kunal what he remembers.",
      "Table the reverted fire clip, or Kunal's “Lakdi tu khud dhoke laaya tha” with the clip in Favorites.",
    ],
    claims: [
      {
        id: "proof",
        text: "To have proof against them.",
        proof: ["vn-burned", "fire-clip"],
        orProof: [["sameer-mistake", "fire-clip"]],
        reply: "On the record.",
        version: true,
        link: "fire",
      },
      {
        id: "part",
        text: "He took part, on Bhasin's orders, and kept the footage as proof against them.",
        proof: ["fire-original"],
        orProof: [["kunal-wood", "fire-clip"]],
        reply: "On the record. The first twenty-two seconds are his voice, “Bhasin sir, yahan?”, and his own hands, with the kada, setting down a jerrycan. He cut them before he sent it.",
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
    whereToLook: ["settings", "photos", "whatsapp"],
    hints: [
      "Somebody else has a picture of that night. Where would he keep something he didn't want seen?",
      "Settings › Apps › Photos › Show Hidden Album. Then set what's in Hidden beside what he cut and deleted.",
      "Table Kunal's frame (Hidden, or Kunal's chat) with the reverted fire clip and Nitin's 1:53 (or his copy of 1:52), or the frame with the deleted reel take and the deleted memo.",
    ],
    claims: [
      {
        id: "confess",
        text: "To confess, and to get help.",
        proof: ["note", "for-m"],
        orProof: [["sameer-rescuer", "note"]],
        reply: "On the record.",
        version: true,
        link: "edit",
      },
      {
        id: "counter",
        text: "They can prove he fired, so he sent a counter-file: everything they did after the shot, with his own part cut out.",
        proof: ["frame", "fire-original", "nitin-reply"],
        orProof: [
          ["kunal-frame", "fire-original", "nitin-reply"],
          // Nitin's copy of the 1:52 message is the edit itself, not just its trace.
          ["frame", "fire-original", "nitin-shot-152"],
          ["kunal-frame", "fire-original", "nitin-shot-152"],
          ["frame", "reel-take", "memo"],
        ],
        reply: "On the record. Everything on this phone is true. The order is his, and so is what's missing: the reel, the second shot, 1:52, and his hands at the fire.",
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

const nitin: Thread = {
  id: "nitin-3",
  app: "whatsapp",
  name: "Nitin",
  archived: true,
  messages: [...nitinNamed("nitin-named"), ...nitinNamed("nitin-named-2")],
  replies: [
    {
      id: "nitin-ask",
      requires: ["fired:title-3"],
      unless: ["did:nitin-closed"],
      options: [
        {
          id: "protect",
          text: "Nitin, main Sameer nahi hoon. Mujhe bas 1:52 ka sach chahiye. Tumhara naam kahin nahi aayega.",
          english: "Nitin, I'm not Sameer. I only need the truth about 1:52. Your name won't come up anywhere.",
          sets: ["did:protect-nitin"],
          then: [
            { id: "n-11", from: "them", at: "01:53", text: "Sameer nahi ho? Toh ye phone…", english: "You're not Sameer? Then this phone…" },
            { id: "n-12", from: "them", at: "01:54", text: "Theek hai. Ye lo.", english: "All right. Here." },
            {
              id: "n-13",
              from: "them",
              at: "01:54",
              attachment: { kind: "photo", label: "Screenshot · Sameer, 1:52 AM: “Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bhej aur nikal yahan se.”" },
              english: "“They've taken Dilip. In Bhasin sir's car, to hospital. Send Vicky back and get out of here.”",
              evidence: "nitin-shot-152",
            },
            {
              id: "n-14",
              from: "them",
              at: "01:54",
              attachment: { kind: "photo", label: "Screenshot · Vicky's live location, 1:38–2:06 AM: in along Mandi Road, six minutes at the service gate, out" },
              evidence: "vicky-location",
            },
            { id: "n-15", from: "them", at: "01:55", typing: 6, text: "Maine check bhi nahi kiya. Bas maan gaya.", english: "I didn't even check. I just believed it." },
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
      requires: ["ask:q7"],
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

/* --- Raju, who went to the Sehgals' ---------------------------------------- */

const raju: Thread = {
  id: "raju-3",
  app: "whatsapp",
  name: RAJU,
  number: RAJU,
  messages: [
    { id: "r-13", from: "them", day: "30/11", at: "02:20", with: "raju-withdraws", requires: ["fired:raju-withdraws"], text: "Sehgal ke ghar gaya tha. Wahan bola goli photographer ne chalayi thi, Kunal ne nahi.", english: "I went to the Sehgals' house. They said the photographer fired, not Kunal." },
    { id: "r-14", from: "them", day: "30/11", at: "02:20", with: "raju-withdraws", requires: ["fired:raju-withdraws"], text: "Aapne jhooth bola.", english: "You lied." },
    { id: "r-15", from: "them", day: "30/11", at: "02:21", with: "raju-withdraws", requires: ["fired:raju-withdraws"], typing: 5, text: "Aap log sab ek jaise ho.", english: "You people are all the same." },
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
          text: "1:52 pe tumne Nitin ko bola Dilip chala gaya. 1:56 pe tum ambulance dhoondh rahe the.",
          english: "At 1:52 you told Nitin Dilip had gone. At 1:56 you were searching for an ambulance.",
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

export const threads: readonly Thread[] = [nitin, kunal, raju, sameer];

const events: readonly LiveEvent[] = [
  // Kunal names Nitin to Bhasin, whichever way the player brought him up.
  { id: "nitin-named", device: "owner", after: ["did:confronted-kunal"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  { id: "nitin-named-2", device: "owner", after: ["did:exposed-nitin"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: "Nitin · Bhai tune Kunal ko mera naam de diya?", sets: ["did:nitin-closed"] },
  // Told it was Kunal, Raju went to the Sehgals', and heard otherwise.
  { id: "raju-withdraws", device: "owner", after: ["did:raju-told-kunal", "fired:title-3"], unless: [OFFLINE], delay: 40, app: "whatsapp", banner: `${RAJU} · Aapne jhooth bola.`, sets: ["did:raju-withdrew"] },
  // Once the player knows why the phone was sent, the man who sent it asks what now.
  { id: "sameer-last", device: "owner", after: ["ask:q13"], unless: [OFFLINE], delay: 10, app: "whatsapp", banner: `${SAMEER_NEW} · Sab dekh liya?` },
];

export const episode3 = { evidence, questions, events, threads };
