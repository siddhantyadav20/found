import type { Evidence, IncomingCall, LiveEvent, Message, Question, ReplyOption, Thread } from "../types";
import { SAMEER_NEW } from "./episode1";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 2 — "The Second Shot". Sunday, 12:32 AM on the story's clock (a
   week to the minute after the shot), and the phone on the player's charger.

   CHAPTER1.md F, Episode 2: the phone wakes into what it couldn't reach
   before (Bhasin's group, screenshotted; the reel take; the 12:29 photo;
   Voice Memos); Sameer, finding his phone back online, steering; the reel;
   who fired, said by the player in their own words, which strikes Episode 1's
   version if it was filed (and says so if they'd called it); the locked
   chats, whose code Sameer gives away to prove he tried; 1:07 AM, and a boy
   who was alive; Raju ringing; the car; and the episode's own question left
   open for the next: why did it leave empty?

   Each episode ends on a question the next one tests: here, a player files
   Sameer's version, only what the phone shows, or their hunch.

   End belief (canon): Sameer fired the shot, but the family controlled what
   happened afterwards.
   =========================================================================== */

const now: readonly ["ep:2"] = ["ep:2"];

/** Airplane mode, turned on by hand (lib/game/phone.ts): after it, nobody's messages reach the phone. */
const OFFLINE = "did:airplane";

const evidence: readonly Evidence[] = [
  // Q5: the reel.
  { id: "kunal-papa", device: "owner", app: "whatsapp", label: "Kunal, Thursday before: “reel mein Papa wali le aaunga”", within: true, requires: now },
  { id: "shot-list", device: "owner", app: "notes", label: "The shot list: “12:15 — KS reel. back lawn… Dilip — light.”", within: true, requires: now },
  { id: "bts", device: "owner", app: "photos", label: "12:29 AM: Sameer holding the revolver, Dilip beside him with the light", within: true, requires: now },

  // Q6: who fired.
  { id: "kunal-clip", device: "owner", app: "whatsapp", label: "Kunal's clip: two shots on the dance floor, 11:52 PM", within: true, requires: now },
  { id: "reel-take", device: "owner", app: "photos", label: "The reel take, 12:31 AM, in Recently Deleted", manual: true, requires: now },
  // Voice Memos has to be downloaded again first (story.ts: offloaded).
  { id: "memo", device: "owner", app: "voicememos", label: "A deleted memo: “Pehli camera ke liye thi. Doosri… main pose kar raha tha.”", manual: true, requires: ["ep:2", "did:installed-voicememos"] },
  // The one screenshot of Bhasin's group he deleted.
  { id: "gun-to-kunal", device: "owner", app: "photos", label: "Deleted screenshot: Bhasin, 12:36 AM, “Sameer, gun Kunal ko do. Abhi.”", manual: true, requires: now },

  // Q7: alive.
  { id: "chhotu-107", device: "owner", app: "whatsapp", label: "Dilip, 1:07 AM: “Bhaiya dard ho raha hai. Aap aa rahe ho na?”", manual: true, requires: now },
  { id: "conscious", device: "owner", app: "photos", label: "Screenshot: Pappu, 1:14 AM, “Sir ladka hosh mein hai.”", within: true, requires: now },

  // The promise: from Dilip himself, and from his brother if he trusts you.
  { id: "promise", device: "owner", app: "whatsapp", label: "Dilip, the evening of the wedding: “Mumbai wali baat pakki na?”", manual: true, requires: now },
  // Said on a call or in a message: it counts once he's said it.
  { id: "raju-promise", device: "owner", app: "phone", label: "Raju: Sameer was taking Dilip to Mumbai as his assistant", within: true, foundBy: ["did:raju-trusts"], requires: ["ep:2", "did:raju-trusts"] },

  // QM: the money.
  { id: "balance", device: "owner", app: "paytap", label: "+₹1,80,000 from Sehgal Enterprises, Sunday 11:04 AM", within: true, requires: now },
  { id: "bhasin-balance", device: "owner", app: "whatsapp", label: "Bhasin, Sunday 9:10 AM: “Balance aaj aa jayega. Tab tak kisi se baat nahi.”", within: true, requires: now },
  { id: "sethi-list", device: "owner", app: "whatsapp", label: "Mr Sethi: “Chhotu ka hisaab Bhasin sir ne kar diya. List se naam hata diya.”", within: true, requires: now },

  /* Sameer, in his own words, once the player has given him something to
     reshape (CHAPTER1.md H, tell Sameer your theory): sources for his version. */
  { id: "sameer-mistake", device: "owner", app: "whatsapp", label: "Sameer: “Galti thi. Par uske baad jo hua, woh Bhasin ne kiya.”", within: true, requires: ["ep:2", "did:told-sameer-shot"] },
  { id: "sameer-tried", device: "owner", app: "whatsapp", label: "Sameer: “Maine koshish ki thi. Sach mein.”", within: true, requires: ["ep:2", "did:asked-sameer-after"] },

  // Q8 and Q9: the car.
  { id: "nitin-car", device: "owner", app: "whatsapp", label: "Nitin, 1:22 AM: Vicky's car, to the service gate", manual: true, requires: now },
  { id: "nitin-gate", device: "owner", app: "whatsapp", label: "Nitin, 1:40 AM: “service gate — Mandi Road wala na?”", manual: true, requires: now },
  { id: "nitin-reply", device: "owner", app: "whatsapp", label: "Nitin, 1:53 AM: “agar le gaye hain…”, answering nothing", manual: true, requires: now },
  { id: "nitin-back", device: "owner", app: "whatsapp", label: "Nitin, 2:04 AM: “Vicky wapas aa gaya.”", manual: true, requires: now },
  { id: "swift", device: "owner", app: "photos", label: "Screenshot: Pappu, 1:59 AM, a Swift at the service gate", within: true, requires: now },
  { id: "left-empty", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:04 AM, “Chali gayi sir. Driver bol raha tha cancel ho gaya.”", within: true, requires: now },
];

const questions: readonly Question[] = [
  {
    kind: "file",
    id: "q5",
    ask: "What was Sameer doing on the back lawn at 12:15?",
    episode: 2,
    whereToLook: ["photos", "notes", "whatsapp"],
    hints: [
      "His shot list says where he meant to be at 12:15. Kunal's chat says what he'd bring. Photos has come down from iCloud now.",
      "Photos › Collections › WhatsApp has Kunal's 12:29 picture, whole at last. Kunal wrote on Thursday about “Papa wali”.",
      "His own reel, with Kunal's father's real revolver, and Dilip on the light. Table Kunal's “Papa wali le aaunga” with the 12:29 photo, or with the shot list.",
    ],
    say: {
      line: "At 12:15 Sameer was shooting {what} on the back lawn, with the {gun} Kunal brought. {who} held the light.",
      blanks: {
        what: ["his own reel", "the pheras", "family portraits"],
        gun: ["real revolver", "prop gun", "air pistol"],
        who: ["Dilip", "Nitin", "Kunal"],
      },
    },
    claims: [
      {
        id: "reel",
        words: { what: "his own reel", gun: "real revolver", who: "Dilip" },
        text: "His own reel. At 12:15 on the back lawn, Sameer was shooting a reel with Kunal's father's revolver: Kunal brought it, real and loaded, “for the feel”. Dilip held the light.",
        proof: ["kunal-papa", "bts"],
        also: ["reel-take", "promise", "shot-list", "kunal-clip"],
        orProof: [["kunal-papa", "shot-list"], ["kunal-clip", "bts"], ["shot-list", "bts"]],
        reply: "His own reel, not the Sehgals'. Kunal brought his father's revolver, real and loaded, “for the feel”. And the boy on the light was Dilip.",
        sets: ["link:reel", "link:kunals-gun"],
      },
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q6",
    ask: "Who fired the shot that hit Dilip?",
    episode: 2,
    whereToLook: ["photos", "voicememos", "whatsapp"],
    hints: [
      "Kunal's clip is on the dance floor. What happened on the back lawn, forty minutes later?",
      "Photos › Recently Deleted has the reel take, and one screenshot of Bhasin's group he deleted. Voice Memos is back: look in its Recently Deleted too.",
      "Sameer, and the second shot. Table Kunal's clip, the reel take and the deleted memo (or the deleted screenshot of Bhasin's 12:36 order).",
    ],
    say: {
      line: "Kunal fired on the {place} at 11:52. Forty minutes later on the back lawn, {who} fired twice, and the {which} shot hit Dilip.",
      blanks: {
        place: ["dance floor", "back lawn", "service lane"],
        who: ["Sameer", "Kunal", "Bhasin", "Nitin"],
        which: ["second", "first"],
      },
    },
    claims: [
      {
        id: "sameer",
        words: { place: "dance floor", who: "Sameer", which: "second" },
        text: "Two firings, forty minutes and a lawn apart. Kunal's on the dance floor at 11:52; on the back lawn at 12:31, Sameer fired twice, and the second shot hit Dilip.",
        proof: ["kunal-clip", "reel-take", "memo"],
        also: ["bts", "kunal-papa", "gun-to-kunal", "sameer-mistake"],
        orProof: [
          ["kunal-clip", "reel-take", "gun-to-kunal"],
          ["kunal-clip", "memo", "gun-to-kunal"],
        ],
        moment: "Sameer.",
        reply: "The first shot was for the camera, straight up. The second, as he posed for Kunal, went lower than he meant. It hit the boy holding his light. Four minutes later, Bhasin's first order was to take the gun off him.",
        sets: ["link:two-firings", "link:shot"],
        pays: ["q3:sameer"],
      },
      {
        id: "kunal",
        words: { place: "dance floor", who: "Kunal", which: "second" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Watch the reel take again. Kunal says “Rolling, bhai?”: he's the one filming. Who says “Light upar, Chhotu”?",
      },
      {
        id: "first",
        words: { place: "dance floor", who: "Sameer", which: "first" },
        text: "",
        proof: [],
        reply: "",
        refuse: "The first went straight up, for the camera. He says so himself.",
      },
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q7",
    ask: "Did the shot kill Dilip?",
    episode: 2,
    whereToLook: ["photos", "whatsapp"],
    hints: [
      "Did anyone hear from Dilip, or about him, after the shot?",
      "Bhasin's group screenshots run on past 1 AM. And one of the two chats Sameer locked is Dilip's own.",
      "No. Table Pappu's 1:14 “ladka hosh mein hai” (a screenshot), or Dilip's own 1:07 message in his locked chat.",
    ],
    say: {
      line: "The shot {verdict} Dilip. At {time} he was {state}.",
      blanks: {
        verdict: ["didn't kill", "killed"],
        time: ["1:07", "1:14", "2:41"],
        state: ["awake", "unconscious", "already gone"],
      },
    },
    claims: [
      {
        id: "awake-114",
        words: { verdict: "didn't kill", time: "1:14", state: "awake" },
        text: "Dilip survived the shot. At 1:14, forty minutes later, he was awake and asking for water.",
        proof: ["conscious"],
        also: ["chhotu-107", "no-112", "doctor", "not-speaking"],
        orProof: [["conscious", "chhotu-107"]],
        moment: "Alive.",
        reply: "At 1:14, forty minutes after the shot, he was awake and asking for water. Whatever happened to Dilip happened after that.",
        sets: ["link:alive"],
      },
      {
        id: "awake-107",
        words: { verdict: "didn't kill", time: "1:07", state: "awake" },
        text: "Dilip survived the shot. At 1:07 he wrote to Sameer himself: “Bhaiya dard ho raha hai. Aap aa rahe ho na?”",
        proof: ["chhotu-107"],
        also: ["conscious", "no-112", "doctor", "not-speaking"],
        orProof: [["chhotu-107", "conscious"]],
        moment: "Alive.",
        reply: "At 1:07, thirty-five minutes after the shot, he wrote to Sameer himself: “Bhaiya dard ho raha hai. Aap aa rahe ho na?” Sameer answered a minute later: “aa raha hoon. hospital le jayenge.”",
        sets: ["link:alive"],
      },
      {
        id: "gone",
        words: { verdict: "killed", time: "2:41", state: "already gone" },
        text: "",
        proof: [],
        reply: "",
        refuse: "At 2:41 he'd stopped speaking. Look at what the phone says before that.",
      },
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q8",
    ask: "Did anyone try to get him out?",
    episode: 2,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "“For M” stops at “4. Nitin —”. Who is Nitin, and where's his chat?",
      "Sameer locked Nitin's chat with Dilip's. WhatsApp shows locked chats once their secret code is typed into Search. Bhasin's group saw a car at the gate, too.",
      "Nitin, and it left at 2:04 without him. Table Nitin's 1:22 message about the car with Pappu's 2:04 “Chali gayi sir”, or with Nitin's own 2:04 “Vicky wapas aa gaya”.",
    ],
    say: {
      line: "{who} got a car to the service gate. At {time} it left {how}.",
      blanks: {
        who: ["Nitin", "Sameer", "Bhasin", "Kunal"],
        time: ["2:04", "1:40", "1:59"],
        how: ["without him", "with him"],
      },
    },
    claims: [
      {
        id: "car",
        words: { who: "Nitin", time: "2:04", how: "without him" },
        text: "Nitin got a car to the service gate, and at 2:04 it left without Dilip.",
        proof: ["nitin-car", "left-empty"],
        also: ["swift", "nitin-gate", "nitin-reply", "nitin-back", "left-empty"],
        orProof: [["nitin-car", "nitin-back"]],
        reply: "Nitin got his friend Vicky's car to the service gate on Mandi Road, for Dilip, twenty minutes out. At 2:04 it left without him.",
        sets: ["link:car"],
      },
      {
        id: "sameer-car",
        words: { who: "Sameer", time: "2:04", how: "without him" },
        text: "",
        proof: [],
        reply: "",
        refuse: "The car wasn't Sameer's doing. Who wrote “Dilip ko wahan le aao”?",
      },
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q9",
    ask: "Why did the car leave empty?",
    episode: 2,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "Nitin sent the car back at 1:53. What did he write then, and to whom was he answering?",
      "“Agar le gaye hain…”: if they've taken him. He's answering something that isn't in his chat. Bhasin's people say the driver called it off.",
      "Say what the phone shows (someone told Nitin Dilip had already been taken) with Nitin's 1:53 and Pappu's 2:04, or Sameer's version with the gate screenshots, or your own hunch about who.",
    ],
    say: {
      line: "It left empty because {why}.",
      blanks: {
        why: [
          "Bhasin's people turned it away at the gate",
          "someone told Nitin that Dilip had already been taken",
          "Sameer told Nitin that Dilip had already been taken",
          "Nitin gave up waiting",
        ],
      },
    },
    claims: [
      {
        id: "turned",
        words: { why: "Bhasin's people turned it away at the gate" },
        text: "The car left empty because Bhasin's people turned it away at the gate.",
        proof: ["swift", "left-empty"],
        orProof: [["sameer-tried", "left-empty"]],
        reply: "On the record, as Sameer would tell it: Bhasin's people, at the gate.",
        version: true,
        link: "lie",
      },
      {
        id: "someone",
        words: { why: "someone told Nitin that Dilip had already been taken" },
        text: "The car left empty because someone told Nitin that Dilip had already been taken. The phone doesn't say who.",
        proof: ["nitin-reply", "left-empty"],
        also: ["nitin-car", "nitin-gate", "swift", "nitin-back", "left-empty"],
        orProof: [["nitin-reply", "nitin-back"]],
        reply: "On the record, and no further. At 1:53 Nitin answered “agar le gaye hain…”. What he was answering isn't on this phone.",
      },
      {
        id: "sameer",
        words: { why: "Sameer told Nitin that Dilip had already been taken" },
        text: "The car left empty because someone told Nitin that Dilip had already been taken, and I think it was Sameer.",
        proof: ["nitin-reply", "left-empty"],
        orProof: [["nitin-reply", "nitin-back"]],
        reply: "Filed. Somebody told Nitin that, just before 1:53. That it was Sameer, you're saying on your own: what he was answering isn't on this phone.",
        hunch: "lie",
      },
      {
        id: "gave-up",
        words: { why: "Nitin gave up waiting" },
        text: "",
        proof: [],
        reply: "",
        refuse: "Nitin didn't give up. Read his 1:53 again: he's answering someone.",
      },
    ],
    reply: "On the record.",
    // Episode 3 proves who. His version, if it was filed, crosses out then.
    struckWhen: ["link:lie"],
  },
  {
    kind: "file",
    id: "qm",
    ask: "What was the ₹1,80,000?",
    episode: 2,
    optional: true,
    whereToLook: ["paytap", "mail", "whatsapp"],
    hints: [
      "Paytap shows who paid him on the Sunday morning, and what for.",
      "Mail has the invoice that money settles. Bhasin wrote to him about it two hours before it came.",
      "His own balance, held back. Table the SK-1127 invoice (or the payment itself) with Bhasin's Sunday “Balance aaj aa jayega. Tab tak kisi se baat nahi.”",
    ],
    say: {
      line: "The ₹1,80,000 was {what}.",
      blanks: {
        what: ["hush money from the Sehgals", "his own balance, held back until he agreed to keep quiet", "a loan from Bhasin"],
      },
    },
    claims: [
      {
        id: "hush",
        words: { what: "hush money from the Sehgals" },
        text: "Hush money: the Sehgals paid him to keep quiet.",
        proof: ["balance", "sethi-list"],
        orProof: [["balance", "bhasin-balance"]],
        reply: "On the record.",
        version: true,
        link: "price",
      },
      {
        id: "held",
        words: { what: "his own balance, held back until he agreed to keep quiet" },
        text: "His own balance, owed on invoice SK-1127 since 3 November, held back until he agreed to keep quiet.",
        proof: ["invoice", "bhasin-balance"],
        also: ["balance", "invoice"],
        orProof: [["balance", "bhasin-balance"]],
        reply: "It was money he was owed, for work he'd done. What they bought with it was the timing: nothing until he'd agreed to say nothing.",
        sets: ["link:price"],
      },
      {
        id: "loan",
        words: { what: "a loan from Bhasin" },
        text: "",
        proof: [],
        reply: "",
        refuse: "It came from Sehgal Enterprises, and it says SK-1127.",
      },
    ],
    reply: "On the record.",
    // Bhasin's message, found after filing it as hush money, says what the money was for.
    reopenWhen: ["saw:bhasin-balance"],
  },
];

/* --- Sameer, finding his phone back online, and steering ----------------- */

/** Steering, whatever the player said: the group he wants read. */
const TO_THE_GROUP = { text: "Screenshots dekh. Bhasin ke group ke. Sab wahan hai.", english: "Look at the screenshots. Of Bhasin's group. It's all there." } as const;

const sameer: Thread = {
  id: "sameer-new-2",
  app: "whatsapp",
  name: SAMEER_NEW,
  number: SAMEER_NEW,
  requires: ["fired:sameer-writes"],
  messages: [
    { id: "sn-4", from: "them", day: "30/11", at: "00:33", with: "sameer-online", requires: ["fired:sameer-online"], text: "Online dikh raha hai. M?", english: "It's showing online. M?" },
    { id: "sn-5", from: "them", day: "30/11", at: "00:50", with: "sameer-asks", requires: ["fired:sameer-asks"], text: "Screenshots dekhe?", english: "Seen the screenshots?" },
    { id: "sn-6", from: "them", day: "30/11", at: "00:50", with: "sameer-asks", requires: ["fired:sameer-asks"], text: "Ab samajh aaya Bhasin kya cheez hai?", english: "Now you see what Bhasin is?" },
    /* He gives away the lock to prove he tried: Nitin's car, his own "aa raha
       hoon". He believes the one message that would undo him is gone. */
    { id: "sn-c1", from: "them", day: "30/11", at: "00:58", with: "sameer-code", requires: ["fired:sameer-code"], text: "Ek aur baat.", english: "One more thing." },
    {
      id: "sn-c2",
      from: "them",
      day: "30/11",
      at: "00:58",
      with: "sameer-code",
      requires: ["fired:sameer-code"],
      typing: 5,
      text: "Nitin aur Chhotu ki chat maine lock ki thi. Search mein code daal: pakki",
      english: "I locked Nitin's and Chhotu's chats. Put the code in Search: pakki",
    },
    { id: "sn-c3", from: "them", day: "30/11", at: "00:59", with: "sameer-code", requires: ["fired:sameer-code"], text: "Wahan dikhega maine koshish ki thi.", english: "You'll see there that I tried." },
  ],
  replies: [
    /* Who the player says they are (CHAPTER1.md F Ep 2 beat 1). Whatever
       they say, he steers them to the group: it's his case against Bhasin. */
    {
      id: "sameer-hello",
      requires: ["fired:sameer-online"],
      options: [
        {
          id: "not-m",
          text: "Main M nahi hoon.",
          english: "I'm not M.",
          sets: ["did:sameer-not-m"],
          /* It came back (CHAPTER1.md O1): he works out that Meera never took
             it, and that the sender's address he made up was somebody's. */
          then: [
            { id: "sn-7", from: "them", at: "00:34", text: "Kaun hai? …Parcel wapas aa gaya?", english: "Who is it? …Did the parcel come back?" },
            { id: "sn-7a", from: "them", at: "00:34", typing: 6, text: "Usne liya hi nahi.", english: "She never even took it." },
            { id: "sn-7b", from: "them", at: "00:35", text: "Woh bhejne wala address maine aise hi likh diya tha.", english: "I'd just made up the sender's address." },
            { id: "sn-8", from: "them", at: "00:35", text: "…Jo bhi ho. Phone band mat karna.", english: "…Whoever you are. Don't switch the phone off." },
            { id: "sn-8a", from: "them", at: "00:35", ...TO_THE_GROUP },
          ],
        },
        {
          id: "as-m",
          text: "Haan.",
          english: "Yes.",
          sets: ["did:sameer-as-m"],
          then: [
            { id: "sn-9", from: "them", at: "00:34", text: "M 🙏 mujhe pata tha tu sunegi.", english: "M. I knew you'd listen." },
            { id: "sn-9a", from: "them", at: "00:34", typing: 5, text: "Tune block kiya tha. Mujhe laga ab kabhi baat nahi hogi.", english: "You'd blocked me. I thought we'd never talk again." },
            { id: "sn-10", from: "them", at: "00:35", ...TO_THE_GROUP },
          ],
        },
        {
          id: "where",
          text: "Tum kahan ho?",
          english: "Where are you?",
          sets: ["did:sameer-where"],
          then: [
            { id: "sn-11", from: "them", at: "00:34", text: "Mat poochh. Safe hoon abhi.", english: "Don't ask. I'm safe for now." },
            { id: "sn-12", from: "them", at: "00:34", ...TO_THE_GROUP },
          ],
        },
      ],
    },
    /* Once the player knows who fired: whatever they give him, he takes and
       reshapes (CHAPTER1.md H, tell Sameer your theory). */
    {
      id: "sameer-group",
      requires: ["fired:sameer-asks"],
      options: [
        {
          id: "shot",
          text: "Goli tumne chalayi thi. Doosri wali.",
          english: "You fired the shot. The second one.",
          sets: ["did:told-sameer-shot"],
          then: [
            { id: "sn-13", from: "them", at: "00:51", typing: 9, text: "Mujhe laga khaali hai.", english: "I thought it was empty." },
            { id: "sn-14", from: "them", at: "00:52", text: "Galti thi. Par uske baad jo hua, woh Bhasin ne kiya. Main kuch nahi kar sakta tha.", english: "It was a mistake. But what happened after, Bhasin did. I couldn't do anything.", evidence: "sameer-mistake" },
          ],
        },
        {
          id: "kunal",
          text: "Kunal ne goli chalayi thi na?",
          english: "Kunal fired the shot, didn't he?",
          sets: ["did:gave-sameer-kunal"],
          then: [
            { id: "sn-15", from: "them", at: "00:51", text: "Haan. Uski gun thi. Uska idea tha.", english: "Yes. It was his gun. His idea." },
            { id: "sn-16", from: "them", at: "00:51", text: "Dekha? Bas yahi sabko samajhna hai.", english: "See? That's all anyone needs to understand." },
          ],
        },
        {
          id: "after",
          text: "12:32 ke baad kya hua?",
          english: "What happened after 12:32?",
          sets: ["did:asked-sameer-after"],
          then: [
            { id: "sn-17", from: "them", at: "00:52", text: "Bhasin aa gaya. Sab usne sambhaala.", english: "Bhasin came. He handled everything." },
            { id: "sn-18", from: "them", at: "00:52", text: "Maine koshish ki thi. Sach mein.", english: "I tried. Really.", evidence: "sameer-tried" },
          ],
        },
      ],
    },
  ],
};

/* --- Raju, ringing the moment Dilip is known to have been alive ----------- */

/* What he says back, whether he's answered on the phone or in writing. Trust
   is what he gives for care (CHAPTER1.md H, reply to Raju): what Dilip told
   him is here only for a player who asked about Dilip. */
const rajuAnswers: readonly ReplyOption[] = [
  {
    id: "careful",
    text: "Abhi sab pakka nahi hai. Par main dhoondh raha hoon. Dilip Sameer ke saath kya kaam karta tha?",
    english: "Nothing's certain yet. But I'm looking. What work did Dilip do with Sameer?",
    sets: ["did:raju-trusts"],
    then: [
      { id: "r-6", from: "them", at: "01:03", text: "Light pakadta tha. Chhote kaam.", english: "He held the lights. Small jobs." },
      {
        id: "r-7",
        from: "them",
        at: "01:04",
        text: "Sameer bhaiya usko Mumbai le jaane wale the. Assistant banayenge bole the. Woh unko bhaiya bolta tha.",
        english: "Sameer bhaiya was going to take him to Mumbai. He said he'd make him his assistant. He called him bhaiya.",
      },
      { id: "r-8", from: "them", at: "01:04", text: "Usko bharosa tha. Sameer bhaiya hain na, sab sambhaal lenge.", english: "He trusted him. Sameer bhaiya's there, he'll handle everything." },
    ],
  },
  {
    id: "shot",
    text: "Us raat shaadi mein goli chali thi. Dilip ko lagi thi.",
    english: "A shot was fired at the wedding that night. It hit Dilip.",
    sets: ["did:raju-told-shot"],
    then: [
      { id: "r-9", from: "them", at: "01:03", text: "Goli??", english: "A shot??" },
      { id: "r-10", from: "them", at: "01:03", text: "Kisne chalayi? Woh ab kahan hai? Kaunse hospital mein?", english: "Who fired it? Where is he now? Which hospital?" },
    ],
  },
  {
    id: "kunal",
    text: "Kunal Sehgal ne goli chalayi thi.",
    english: "Kunal Sehgal fired the shot.",
    sets: ["did:raju-told-kunal"],
    then: [
      { id: "r-11", from: "them", at: "01:03", text: "Sehgal… shaadi wale? Kunal Sehgal ne?", english: "Sehgal… the wedding family? Kunal Sehgal?" },
      { id: "r-12", from: "them", at: "01:04", text: "Theek hai. Main unke ghar jaata hoon.", english: "All right. I'm going to their house." },
    ],
  },
];

const incoming: readonly IncomingCall[] = [
  {
    id: "raju-alive",
    device: "owner",
    from: RAJU,
    sub: "mobile",
    at: "01:02",
    after: ["fired:raju-rings-2"],
    lines: [
      { who: "Raju", line: "Hello?" },
      { who: "Raju", line: "…Aap hi ho na? Jisne pichhli baar phone uthaya tha?", english: "…It's you, isn't it? Who picked up last time?", when: "did:answered-raju" },
      { who: "Raju", line: "Dilip ke baare mein kuch pata chala? Maa roz phone karti hai.", english: "Have you found out anything about Dilip? Our mother calls every day." },
    ],
    reply: { id: "raju-asks-call", options: rajuAnswers },
  },
];

/* Declined, he writes instead, and the same answer can be given there. */
const raju: Thread = {
  id: "raju-2",
  app: "whatsapp",
  name: RAJU,
  number: RAJU,
  messages: [
    {
      id: "r-5",
      from: "them",
      day: "30/11",
      at: "01:02",
      with: "raju-writes",
      requires: ["fired:raju-writes"],
      text: "Aap jo bhi ho… Dilip ke baare mein kuch pata chala? Maa roz phone karti hai.",
      english: "Whoever you are… have you found out anything about Dilip? Our mother calls every day.",
    },
  ],
  replies: [{ id: "raju-asks", requires: ["fired:raju-writes"], options: rajuAnswers }],
};

/* --- Bhasin, who has heard someone else has the phone --------------------- */

const bhasinKnows: readonly Message[] = [
  {
    id: "b-2",
    from: "them",
    day: "30/11", at: "00:40",
    with: "bhasin-knows",
    requires: ["fired:bhasin-knows"],
    text: "Neelam ji bata rahi thi Sameer ka phone koi aur utha raha hai.",
    english: "Neelam ji says someone else is answering Sameer's phone.",
  },
  {
    id: "b-3",
    from: "them",
    day: "30/11", at: "00:40",
    with: "bhasin-knows",
    requires: ["fired:bhasin-knows"],
    text: "Jiske paas bhi ye phone hai — wapas kar do. Sameer ke liye achha hoga.",
    english: "Whoever has this phone, return it. It'll be better for Sameer.",
  },
];

const bhasinWrites: readonly Message[] = [
  {
    id: "b-4",
    from: "them",
    day: "30/11", at: "01:10",
    with: "bhasin-writes",
    requires: ["fired:bhasin-writes", "did:mummy-as-sameer"],
    text: "Mummy bol rahi thi tu theek hai. Toh ghar aa ja. Baat karte hain.",
    english: "Your mother says you're fine. So come home. We'll talk.",
  },
  {
    id: "b-5",
    from: "them",
    day: "30/11", at: "01:10",
    with: "bhasin-writes",
    requires: ["fired:bhasin-writes"],
    text: "Jiske paas bhi ye phone hai — wapas kar do. Sameer ke liye achha hoga.",
    english: "Whoever has this phone, return it. It'll be better for Sameer.",
  },
];

const bhasin: Thread = { id: "bhasin-2", app: "whatsapp", name: "Bhasin Uncle", messages: [...bhasinKnows, ...bhasinWrites] };

export const threads: readonly Thread[] = [sameer, raju, bhasin];

const events: readonly LiveEvent[] = [
  // Back on, past midnight: his day's data is back, so what was waiting in iCloud and the App Store can come down.
  { id: "data-renewed", device: "owner", after: ["fired:title-2"], unless: [OFFLINE], delay: 3, app: "messages", banner: "JIO · Your daily data quota of 1.5 GB has been renewed." },
  // The phone comes back on, on the player's charger, and the man who sent it sees it online.
  { id: "sameer-online", device: "owner", after: ["fired:title-2"], unless: [OFFLINE], delay: 6, app: "whatsapp", banner: `${SAMEER_NEW} · Online dikh raha hai. M?` },
  // Told a stranger has the phone, his mother told Bhasin, and Bhasin writes early (CHAPTER1.md H).
  {
    id: "bhasin-knows",
    device: "owner",
    after: ["did:mummy-stranger", "fired:title-2"],
    unless: [OFFLINE],
    delay: 45,
    app: "whatsapp",
    banner: "Bhasin Uncle · Jiske paas bhi ye phone hai — wapas kar do.",
  },
  // Once the player knows who fired, Sameer wants to know what they've seen; then he gives the lock away.
  { id: "sameer-asks", device: "owner", after: ["ask:q6"], unless: [OFFLINE], delay: 12, app: "whatsapp", banner: `${SAMEER_NEW} · Screenshots dekhe?` },
  { id: "sameer-code", device: "owner", after: ["fired:sameer-asks"], unless: [OFFLINE], delay: 30, app: "whatsapp", banner: `${SAMEER_NEW} · Nitin aur Chhotu ki chat maine lock ki thi.` },
  // Once Dilip is known to have been alive, his brother rings. Declined, he writes.
  { id: "raju-rings-2", device: "owner", after: ["ask:q7"], unless: [OFFLINE], delay: 9, app: "phone" },
  { id: "raju-writes", device: "owner", after: ["did:declined-raju-alive"], unless: [OFFLINE], delay: 20, app: "whatsapp", banner: `${RAJU} · Aap jo bhi ho… Dilip ke baare mein kuch pata chala?` },
  { id: "bhasin-writes", device: "owner", after: ["ask:q7"], unless: ["did:mummy-stranger", OFFLINE], delay: 60, app: "whatsapp", banner: "Bhasin Uncle · Jiske paas bhi ye phone hai — wapas kar do." },
  /* The episode ends on its own question, filed however the player filed it:
     then the night turns to 1:52. Not under someone reading, though: only
     once the phone has been put down a while. */
  { id: "the-gap", device: "owner", after: ["ask:q9"], delay: 15, quiet: true, app: "whatsapp", sets: ["ep:3"] },
];

export const episode2 = { evidence, questions, events, threads, incoming };
