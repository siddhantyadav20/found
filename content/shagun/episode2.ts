import type { Evidence, LiveEvent, Message, Question, Thread } from "../types";
import { SAMEER_NEW } from "./episode1";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 2 — "The Second Shot". Sunday, 12:32 AM on the story's clock (a
   week to the minute after the shot), and the phone on the player's charger.

   CHAPTER1.md F, Episode 2: Sameer, finding his phone back online; the reel
   and whose gun it was; two firings, forty minutes and a lawn apart, which
   cracks what was filed in Episode 1 (Q3 comes back as a Revisit); the memo
   in the bin, and who fired; 1:07 AM, and a boy who was alive; the money, on
   the side; Raju; Bhasin; and, in the archived chat, a car that came and
   left, and a reply to a message that isn't there.

   Everything here is on the phone from the first minute (phone.ts). None of
   it counts before this episode (the hybrid pacing).

   End belief (canon): Sameer fired the shot, but the family controlled what
   happened afterwards.
   =========================================================================== */

const now: readonly ["ep:2"] = ["ep:2"];

const evidence: readonly Evidence[] = [
  // Q5: the reel.
  { id: "kunal-papa", device: "owner", app: "whatsapp", label: "Kunal, Thursday before: “reel mein Papa wali le aaunga”", within: true, requires: now },
  { id: "shot-list", device: "owner", app: "notes", label: "The shot list: “12:15 — KS reel. back lawn… Dilip — light.”", within: true, requires: now },
  { id: "bts", device: "owner", app: "photos", label: "12:29 AM: Sameer holding the revolver, Dilip beside him with the light", within: true, requires: now },

  // Q6: two firings.
  { id: "kunal-clip", device: "owner", app: "whatsapp", label: "Kunal's clip: two shots on the dance floor, 11:52 PM", within: true, requires: now },
  { id: "reel-take", device: "owner", app: "photos", label: "The reel take, 12:31 AM, in Recently Deleted", manual: true, requires: now },

  // Q7: who fired.
  { id: "memo", device: "owner", app: "voicememos", label: "A deleted memo: “Doosri… main pose kar raha tha.”", manual: true, requires: now },
  { id: "gun-to-kunal", device: "owner", app: "whatsapp", label: "Bhasin, 12:36 AM: “Sameer, gun Kunal ko do. Abhi.”", within: true, requires: now },

  // Q8: alive.
  { id: "chhotu-107", device: "owner", app: "whatsapp", label: "Dilip, 1:07 AM: “Bhaiya dard ho raha hai. Aap aa rahe ho na?”", manual: true, requires: now },
  { id: "conscious", device: "owner", app: "whatsapp", label: "Pappu, 1:14 AM: “Sir ladka hosh mein hai.”", within: true, requires: now },

  // The promise: from Dilip himself, and from his brother if he trusts you.
  { id: "promise", device: "owner", app: "whatsapp", label: "Dilip, the evening of the wedding: “Mumbai wali baat pakki na?”", manual: true, requires: now },
  { id: "raju-promise", device: "owner", app: "whatsapp", label: "Raju: Sameer was taking Dilip to Mumbai as his assistant", within: true, requires: ["ep:2", "did:raju-trusts"] },

  // QM: the money.
  { id: "balance", device: "owner", app: "paytap", label: "+₹1,80,000 from Sehgal Enterprises, Sunday 11:04 AM", within: true, requires: now },
  { id: "bhasin-balance", device: "owner", app: "whatsapp", label: "Bhasin, Sunday 9:10 AM: “Balance aaj aa jayega. Tab tak kisi se baat nahi.”", within: true, requires: now },
  { id: "sethi-list", device: "owner", app: "whatsapp", label: "Mr Sethi: “Chhotu ka hisaab Bhasin sir ne kar diya. List se naam hata diya.”", within: true, requires: now },

  // Q9: the car.
  { id: "nitin-car", device: "owner", app: "whatsapp", label: "Nitin, 1:22 AM: Vicky's car, to the service gate", manual: true, requires: now },
  { id: "nitin-gate", device: "owner", app: "whatsapp", label: "Nitin, 1:40 AM: “service gate — Mandi Road wala na?”", manual: true, requires: now },
  { id: "nitin-reply", device: "owner", app: "whatsapp", label: "Nitin, 1:53 AM: “agar le gaye hain…”, answering nothing", manual: true, requires: now },
  { id: "nitin-back", device: "owner", app: "whatsapp", label: "Nitin, 2:04 AM: “Vicky wapas aa gaya.”", manual: true, requires: now },
  { id: "swift", device: "owner", app: "whatsapp", label: "Pappu, 1:59 AM: a Swift at the service gate", within: true, requires: now },
  { id: "left-empty", device: "owner", app: "whatsapp", label: "Pappu, 2:04 AM: “Chali gayi sir.”", within: true, requires: now },
];

const questions: readonly Question[] = [
  {
    kind: "pick",
    id: "q5",
    ask: "What was Sameer doing on the back lawn at 12:15?",
    episode: 2,
    whereToLook: ["photos", "notes", "whatsapp"],
    hints: [
      "His shot list says where he meant to be at 12:15, and WhatsApp saved a photo from that lawn to Photos.",
      "Photos › WhatsApp has Kunal's 12:29 picture. Kunal's chat, the Thursday before the wedding, says what he'd bring.",
      "Table Kunal's “Papa wali le aaunga” with the 12:29 photo, or with the shot list's 12:15 line.",
    ],
    proof: ["kunal-papa", "bts"],
    orProof: [
      ["kunal-papa", "shot-list"],
      ["kunal-clip", "bts"],
    ],
    reply: "His own reel. At 12:15 on the back lawn, Sameer was shooting a reel with Kunal's father's revolver: Kunal brought it, real and loaded, “for the feel”. Dilip held the light.",
    sets: ["link:reel", "link:kunals-gun"],
  },
  {
    kind: "timeline",
    id: "q6",
    ask: "Was it one firing, or two?",
    episode: 2,
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "Kunal's clip and the reel weren't shot in the same place. Put what you've found where it happened.",
      "Watch Kunal's clip in his chat. Then look in Photos › Recently Deleted: Sameer deleted something shot on the back lawn.",
      "Dance floor: Kunal's 11:52 clip. Back lawn: the shot list's 12:15, the 12:29 photo and the 12:31 take.",
    ],
    lanes: [
      { id: "dance", label: "Dance floor" },
      { id: "back", label: "Back lawn" },
    ],
    rows: [
      { id: "t-kunal", at: "23:52", text: "Two shots into the air, dhol and cheering", lane: "dance", evidence: "kunal-clip" },
      { id: "t-list", at: "00:15", text: "The shot list: “KS reel. back lawn, mango trees.”", lane: "back", evidence: "shot-list" },
      { id: "t-setup", at: "00:29", text: "Sameer holding the revolver; Dilip with the light", lane: "back", evidence: "bts" },
      { id: "t-take", at: "00:31", text: "One shot, straight up, for the camera. “Ek aur, pose mein—”", lane: "back", evidence: "reel-take" },
    ],
    enough: [
      ["kunal-clip", "reel-take"],
      ["kunal-clip", "bts"],
    ],
    reply: "Two. Kunal fired twice into the air on the dance floor at 11:52. Forty minutes later, on the back lawn, the gun was in Sameer's hand. His first voice note put them in one sentence.",
    sets: ["link:two-firings"],
  },
  {
    kind: "pick",
    id: "q7",
    ask: "Who fired the shot that hit Dilip?",
    episode: 2,
    whereToLook: ["voicememos", "photos", "whatsapp"],
    hints: [
      "The take ends on “ek aur, pose mein—”. Who was holding the gun, and was there another shot?",
      "Voice Memos keeps what's deleted, too. And the first thing Bhasin wrote in his group was an order to someone.",
      "Table the memo in Voice Memos › Recently Deleted with the reel take, or Bhasin's 12:36 “Sameer, gun Kunal ko do” with the reel take.",
    ],
    proof: ["memo", "reel-take"],
    orProof: [
      ["gun-to-kunal", "reel-take"],
      ["memo", "gun-to-kunal"],
    ],
    reply: "Sameer. The first shot was for the camera. The second, as he posed for Kunal's phone, went lower than he meant, and it hit Dilip. Four minutes later, Bhasin's first order was to take the gun off him.",
    sets: ["link:shot"],
  },
  {
    kind: "pick",
    id: "q8",
    ask: "Did the shot kill Dilip?",
    episode: 2,
    whereToLook: ["whatsapp", "safari"],
    hints: [
      "Did anyone hear from Dilip after 12:32?",
      "WhatsApp keeps archived chats under Archived, at the top of Chats. The security group says something at 1:14, too.",
      "Table Dilip's 1:07 message in the archived Chhotu chat, or Pappu's 1:14 “ladka hosh mein hai” in Banyan — Security.",
    ],
    proof: ["chhotu-107"],
    orProof: [["conscious"], ["chhotu-107", "conscious"]],
    reply: "No. At 1:07 he wrote to Sameer himself: “Bhaiya dard ho raha hai. Aap aa rahe ho na?” At 1:14 he was awake and asking for water. Sameer's searches from 12:44, for what to do about a gunshot, were about a boy who was alive.",
    sets: ["link:alive"],
  },
  {
    kind: "pick",
    id: "q9",
    ask: "Did anyone try to get him out?",
    episode: 2,
    whereToLook: ["whatsapp"],
    hints: [
      "“For M” stops at “4. Nitin —”. Who is Nitin, and where's his chat?",
      "Nitin's chat is archived. And the security group saw a car at the service gate.",
      "Table Nitin's 1:22 message about the car with Pappu's 2:04 “Chali gayi sir”, or with Nitin's own 2:04 “Vicky wapas aa gaya”.",
    ],
    proof: ["nitin-car", "left-empty"],
    orProof: [["nitin-car", "nitin-back"]],
    reply: "Yes. Nitin got his friend Vicky's car to the service gate on Mandi Road. At 2:04 it left without him. And at 1:53, Nitin was answering a message that isn't in his chat.",
    sets: ["link:car"],
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
      "Table the SK-1127 invoice (or the payment itself) with Bhasin's Sunday “Balance aaj aa jayega. Tab tak kisi se baat nahi.”",
    ],
    claims: [
      {
        id: "hush",
        text: "Hush money: the Sehgals paid him to keep quiet.",
        proof: ["balance", "sethi-list"],
        reply: "On the record.",
        version: true,
      },
      {
        id: "held",
        text: "His own balance, owed on invoice SK-1127 since 3 November, held back until he agreed to keep quiet.",
        proof: ["invoice", "bhasin-balance"],
        orProof: [["balance", "bhasin-balance"]],
        reply: "On the record. It was money he was owed, for work he'd done. What they bought with it was the timing: nothing until he'd agreed to say nothing.",
        sets: ["link:price"],
      },
    ],
    reply: "On the record.",
    // Bhasin's message, found after filing it as hush money, says what the money was for.
    reopenWhen: ["saw:bhasin-balance"],
  },
];

/* --- Sameer, finding his phone back online -------------------------------- */

const sameer: Thread = {
  id: "sameer-new-2",
  app: "whatsapp",
  name: SAMEER_NEW,
  number: SAMEER_NEW,
  requires: ["fired:sameer-writes"],
  messages: [
    { id: "sn-4", from: "them", day: "30/11", at: "00:33", with: "sameer-online", requires: ["fired:sameer-online"], text: "Online dikh raha hai. M?", english: "It's showing online. M?" },
    { id: "sn-5", from: "them", day: "30/11", at: "00:50", with: "sameer-asks", requires: ["fired:sameer-asks"], text: "Group dekha?", english: "Seen the group?" },
    { id: "sn-6", from: "them", day: "30/11", at: "00:50", with: "sameer-asks", requires: ["fired:sameer-asks"], text: "Ab samajh aaya Bhasin kya cheez hai?", english: "Now you see what Bhasin is?" },
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
          then: [
            { id: "sn-7", from: "them", at: "00:34", text: "Kaun hai?", english: "Who is it?" },
            { id: "sn-8", from: "them", at: "00:34", text: "…Jo bhi hai. Phone band mat karna. Bhasin ka group dekh. Sab wahan hai.", english: "…Whoever you are. Don't switch the phone off. Look at Bhasin's group. It's all there." },
          ],
        },
        {
          id: "as-m",
          text: "Haan.",
          english: "Yes.",
          sets: ["did:sameer-as-m"],
          then: [
            { id: "sn-9", from: "them", at: "00:34", text: "M 🙏 mujhe pata tha tu sunegi.", english: "M. I knew you'd listen." },
            { id: "sn-10", from: "them", at: "00:34", text: "Bhasin ka group dekh. Sab wahan hai.", english: "Look at Bhasin's group. It's all there." },
          ],
        },
        {
          id: "where",
          text: "Tum kahan ho?",
          english: "Where are you?",
          sets: ["did:sameer-where"],
          then: [
            { id: "sn-11", from: "them", at: "00:34", text: "Mat poochh. Safe hoon abhi.", english: "Don't ask. I'm safe for now." },
            { id: "sn-12", from: "them", at: "00:34", text: "Bhasin ka group dekh. Sab wahan hai.", english: "Look at Bhasin's group. It's all there." },
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
            { id: "sn-13", from: "them", at: "00:51", text: "Mujhe laga khaali hai.", english: "I thought it was empty." },
            { id: "sn-14", from: "them", at: "00:52", text: "Galti thi. Par uske baad jo hua, woh Bhasin ne kiya. Main kuch nahi kar sakta tha.", english: "It was a mistake. But what happened after, Bhasin did. I couldn't do anything." },
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
            { id: "sn-18", from: "them", at: "00:52", text: "Maine koshish ki thi. Sach mein.", english: "I tried. Really." },
          ],
        },
      ],
    },
  ],
};

/* --- Raju, writing instead of ringing ------------------------------------- */

const raju: Thread = {
  id: "raju-2",
  app: "whatsapp",
  name: RAJU,
  number: RAJU,
  messages: [
    {
      id: "r-5",
      from: "them",
      day: "30/11", at: "01:02",
      with: "raju-writes",
      requires: ["fired:raju-writes"],
      text: "Aap jo bhi ho… Dilip ke baare mein kuch pata chala? Maa roz phone karti hai.",
      english: "Whoever you are… have you found out anything about Dilip? Our mother calls every day.",
    },
  ],
  replies: [
    /* Trust is what he gives for care (CHAPTER1.md H, reply to Raju). What
       Dilip told him is here only for a player who asked about Dilip; the
       Chhotu chat keeps the promise for everyone else. */
    {
      id: "raju-asks",
      requires: ["fired:raju-writes"],
      options: [
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
              evidence: "raju-promise",
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
      ],
    },
  ],
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
  // The phone comes back on, on the player's charger, and the man who sent it sees it online.
  { id: "sameer-online", device: "owner", after: ["fired:title-2"], delay: 6, app: "whatsapp", banner: `${SAMEER_NEW} · Online dikh raha hai. M?` },
  // Told a stranger has the phone, his mother told Bhasin, and Bhasin writes early (CHAPTER1.md H).
  {
    id: "bhasin-knows",
    device: "owner",
    after: ["did:mummy-stranger", "fired:title-2"],
    delay: 45,
    app: "whatsapp",
    banner: "Bhasin Uncle · Jiske paas bhi ye phone hai — wapas kar do.",
  },
  // Once the player knows who fired, Sameer wants to know what they've seen.
  { id: "sameer-asks", device: "owner", after: ["ask:q7"], delay: 20, app: "whatsapp", banner: `${SAMEER_NEW} · Group dekha?` },
  // Once Dilip is known to have been alive, his brother writes.
  { id: "raju-writes", device: "owner", after: ["ask:q8"], delay: 10, app: "whatsapp", banner: `${RAJU} · Aap jo bhi ho… Dilip ke baare mein kuch pata chala?` },
  { id: "bhasin-writes", device: "owner", after: ["ask:q8"], unless: ["did:mummy-stranger"], delay: 40, app: "whatsapp", banner: "Bhasin Uncle · Jiske paas bhi ye phone hai — wapas kar do." },
  // The episode ends on the gap: once the car is known to have left empty, the night turns to 1:52.
  { id: "the-gap", device: "owner", after: ["ask:q9"], delay: 25, app: "whatsapp", sets: ["ep:3"] },
];

export const episode2 = { evidence, questions, events, threads };
