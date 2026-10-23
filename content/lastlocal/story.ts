import type { Ending, Evidence, IncomingCall, Link, LiveEvent, Moment, Note, Photo, Story, Thread } from "../types";

/* ===========================================================================
   Case 1 — "Last Local" · Mumbai (2026-10-18). Design: LAST-LOCAL.md.

   1:12 AM, the last Virar fast out of Dadar. A girl pushes her phone into the
   seat beside the player and steps off as the doors close. Everyone looking
   for her is looking for the phone; the phone tells them where it is.

   Played on the phone, never in a case file: replies, calls, Find My, what
   is sent and what is held back. Three moments stop the story (Borivali, if
   the player agreed to hand it over; Vasai Road; Nalasopara), and what the
   player did decides which of six mornings follows.

   The truth: Pawar Infra built two floors over Ananya's rejected report on
   Shree Sai Heights, Nalasopara; it fell, fourteen died; her signature was
   forged on the approval so the inquiry (10 AM) would blame her. Tonight she
   ran with the proof. Imran, whom the family calls dangerous, is the
   journalist whose sister died there; his page locks at 2:30. Shinde, a
   retired inspector, follows the phone, and from Borivali texts the player
   as Ananya, from the phone she borrowed at Dadar.

   Player lines are gender-neutral Hindi, always.
   =========================================================================== */

/** The phone she borrowed at Dadar, from a stranger. From Borivali, Shinde has it. */
const BORROWED = "+91 77••• •3018";
const SHINDE = "+91 98••• •5521";

/* --- the phone as she left it ---------------------------------------------- */

const family: Thread = {
  id: "family",
  app: "whatsapp",
  name: "Pawar Parivar 🏠",
  group: true,
  pinned: true,
  sub: "Aai, Papa, Rohit Dada, Shinde Kaka, You",
  unread: 3,
  messages: [
    { id: "f-1", from: "them", who: "Aai", at: "23:58", day: "Saturday", text: "Anu kahan hai? Kamre mein nahi hai.", english: "Where's Anu? She isn't in her room." },
    { id: "f-2", from: "them", who: "Rohit Dada", at: "00:04", text: "Papa ki study khuli padi hai.", english: "Papa's study is lying open." },
    // The father, closing the subject on the family group: the first thing that doesn't fit.
    { id: "f-3", from: "them", who: "Papa", at: "00:06", text: "Rohit. Group pe nahi.", english: "Rohit. Not on the group." },
    {
      id: "f-4",
      from: "them",
      who: "Aai",
      at: "00:20",
      attachment: {
        kind: "voice",
        seconds: 14,
        transcript: "Anu beta, ghar aa ja. Koi kuch nahi kahega. Tere Papa bahut pareshan hain.",
        english: "Anu, child, come home. Nobody will say a thing. Your Papa is so worried.",
      },
    },
    { id: "f-5", from: "them", who: "Rohit Dada", at: "00:31", text: "Imran ke saath gayi hai. Main jaanta hoon.", english: "She's gone with Imran. I know it." },
    { id: "f-6", from: "them", who: "Papa", at: "00:33", text: "Shinde ko bulaya hai. Woh dhoond lega.", english: "I've called Shinde. He'll find her.", evidence: "family" },
    { id: "f-7", from: "them", who: "Rohit Dada", at: "01:09", text: "Kuch pata chala?", english: "Any news?" },
    // Arriving during the night.
    { id: "f-8", from: "them", who: "Rohit Dada", at: "01:20", with: "loc-off", requires: ["fired:loc-off"], text: "Anu ki location band ho gayi!!", english: "Anu's location just went off!!" },
    { id: "f-9", from: "them", who: "Rohit Dada", at: "01:43", with: "shinde-boards", requires: ["fired:shinde-boards"], text: "Shinde Kaka Borivali pe train mein chadh gaye.", english: "Shinde Kaka got on the train at Borivali." },
    { id: "f-10", from: "them", who: "Shinde Kaka", at: "01:47", with: "shinde-5", requires: ["fired:shinde-5"], text: "Dabba 5.", english: "Coach 5." },
    { id: "f-11", from: "them", who: "Shinde Kaka", at: "01:51", with: "shinde-6", requires: ["fired:shinde-6"], text: "Dabba 6. Phone abhi bhi on hai.", english: "Coach 6. The phone is still on." },
  ],
};

const imran: Thread = {
  id: "imran",
  app: "whatsapp",
  name: "Imran",
  contact: { number: "+91 99••• •4410", about: "Sach sabko pata chalna chahiye." },
  messages: [
    // Out of context, all of it reads the way her family says he is.
    { id: "i-1", from: "them", at: "22:14", day: "21/10", text: "Tu unhe nahi jaanti. Main jaanta hoon.", english: "You don't know them. I do." },
    { id: "i-2", from: "owner", at: "22:30", day: "21/10", text: "Woh mere Papa hain, Imran.", english: "He's my father, Imran." },
    { id: "i-3", from: "them", at: "22:31", day: "21/10", text: "Isliye toh.", english: "That's exactly why." },
    { id: "i-4", from: "them", at: "19:02", day: "Friday", text: "Kal ke baad sab badal jayega. Usse pehle kisi ko kuch mat bolna. Ghar pe bhi nahi.", english: "After tomorrow everything changes. Don't tell anyone before that. Not at home either." },
    { id: "i-5", from: "owner", at: "19:40", day: "Friday", text: "Mujhe darr lag raha hai.", english: "I'm scared." },
    { id: "i-6", from: "them", at: "19:41", day: "Friday", text: "Mujhe pata hai. Main hoon na.", english: "I know. I'm here." },
    { id: "i-7", from: "owner", at: "00:44", text: "Nikal gayi. Dadar.", english: "I'm out. Dadar." },
    { id: "i-8", from: "them", at: "00:46", text: "Platform 4. Mat rukna.", english: "Platform 4. Don't stop.", evidence: "imran-chat" },
    { id: "i-9", from: "them", at: "00:47", text: "Phone band kar de. Woh dekh rahe hain.", english: "Switch your phone off. They're watching." },
    { id: "i-10", from: "owner", at: "00:47", text: "Nahi kar sakti. Sab isme hai.", english: "I can't. Everything's in it." },
    // Episode 2: he sees her online.
    { id: "i-11", from: "them", at: "01:31", with: "imran-writes", requires: ["fired:imran-writes"], text: "Anu? Online dikh rahi hai.", english: "Anu? You're showing online." },
    { id: "i-12", from: "them", at: "01:31", with: "imran-writes", requires: ["fired:imran-writes"], text: "Tu theek hai?", english: "Are you okay?" },
    // Episode 3: the network gap after Mira Road.
    { id: "i-30", from: "them", at: "01:50", with: "upload-dropped", requires: ["fired:upload-dropped"], text: "Beech mein ruk gaya! Kuch nahi aaya. Phir se bhejo.", english: "It stopped halfway! Nothing came through. Send it again." },
    // The proof, arriving.
    { id: "i-40", from: "them", at: "01:40", with: "upload-done", requires: ["fired:upload-done"], text: "Aa gaya. Sab. Recording bhi.", english: "It's here. All of it. The recording too." },
    { id: "i-41", from: "them", at: "01:40", with: "upload-done", requires: ["fired:upload-done"], typing: 6, text: "Ab page pe hai. Ab woh kuch nahi kar sakte.", english: "It's on the page now. There's nothing they can do." },
    { id: "i-42", from: "them", at: "02:08", with: "resend-done", requires: ["fired:resend-done"], text: "Aa gaya. Nalasopara se. …Wahin se.", english: "It's here. From Nalasopara. …From right there." },
  ],
  replies: [
    {
      id: "imran-ask",
      requires: ["fired:imran-writes"],
      options: [
        {
          id: "truth",
          text: "Main Ananya nahi hoon. Uska phone mere paas hai. Woh Dadar pe utar gayi.",
          english: "I'm not Ananya. Her phone is with me. She got off at Dadar.",
          sets: ["did:imran-knows"],
          then: [
            { id: "i-13", from: "them", at: "01:32", typing: 6, text: "…Tum kaun ho? Woh theek hai?", english: "…Who are you? Is she okay?" },
            { id: "i-14", from: "them", at: "01:32", typing: 9, text: "Suno. Mera naam Imran hai. Meri behen Rubina us building mein thi.", english: "Listen. My name's Imran. My sister Rubina was in that building." },
            { id: "i-15", from: "them", at: "01:33", attachment: { kind: "photo", label: "Rubina, sixteen, in her school uniform, laughing at whoever's holding the camera", }, evidence: "rubina" },
            { id: "i-16", from: "them", at: "01:33", typing: 8, text: "Anu ke phone mein jo hai, wahi saboot hai. Mera page 2:30 pe lock hota hai.", english: "What's on Anu's phone is the proof. My page locks at 2:30." },
            { id: "i-17", from: "them", at: "01:34", text: "Note ki photos aur recording mujhe bhej do. Abhi. Main Virar pe hoon, platform 1. Woh bhi wahin aayegi.", english: "Send me the note's photos and the recording. Now. I'm at Virar, platform 1. She's coming there too." },
          ],
        },
        {
          id: "posed",
          text: "Haan, theek hoon.",
          english: "Yes, I'm okay.",
          sets: ["did:imran-knows", "did:posed-imran"],
          then: [
            { id: "i-18", from: "them", at: "01:32", typing: 7, text: "…Anu 'haan' nahi likhti. 'Ha' likhti hai. Kaun hai?", english: "…Anu doesn't write 'haan'. She writes 'ha'. Who is this?" },
            { id: "i-19", from: "them", at: "01:33", typing: 9, text: "Jo bhi ho. Suno. Meri behen Rubina us building mein thi.", english: "Whoever you are. Listen. My sister Rubina was in that building." },
            { id: "i-20", from: "them", at: "01:33", attachment: { kind: "photo", label: "Rubina, sixteen, in her school uniform, laughing at whoever's holding the camera", }, evidence: "rubina" },
            { id: "i-21", from: "them", at: "01:34", text: "Anu ke phone mein saboot hai. Mera page 2:30 pe lock hota hai. Note ki photos aur recording bhej do. Main Virar pe hoon, platform 1.", english: "The proof is on Anu's phone. My page locks at 2:30. Send the note's photos and the recording. I'm at Virar, platform 1." },
          ],
        },
      ],
    },
    {
      id: "imran-send",
      requires: ["did:imran-knows", "saw:report"],
      unless: ["did:decoy"],
      options: [
        {
          id: "send",
          text: "Ye lo. Sab bhej rahe hain.",
          english: "Here. Sending all of it.",
          sets: ["did:sent-files", "did:sent-early"],
          then: [
            { id: "i-22", from: "owner", at: "01:35", ticks: "sent", attachment: { kind: "document", label: "Shree Sai Heights — original.zip", meta: "3 photos, 1 recording · 48 MB" } },
            { id: "i-23", from: "them", at: "01:35", typing: 4, text: "Aa raha hai… train ka network hai, dheere.", english: "It's coming… it's train network, slow." },
          ],
        },
        {
          id: "hold",
          text: "Pehle Ananya se baat karni hai.",
          english: "I need to talk to Ananya first.",
          sets: ["did:held-files"],
          then: [{ id: "i-24", from: "them", at: "01:35", typing: 5, text: "Samajh sakta hoon. Par 2:30 ke baad iska koi matlab nahi.", english: "I understand. But after 2:30 it means nothing." }],
        },
      ],
    },
    // Held back once: the same choice comes again, until it's too late to matter.
    {
      id: "imran-send-again",
      requires: ["did:held-files"],
      unless: ["did:sent-files", "did:decoy"],
      options: [
        {
          id: "send2",
          text: "Theek hai. Bhej rahe hain.",
          english: "All right. Sending it.",
          sets: ["did:sent-files"],
          then: [
            { id: "i-25", from: "owner", at: "01:40", ticks: "sent", attachment: { kind: "document", label: "Shree Sai Heights — original.zip", meta: "3 photos, 1 recording · 48 MB" } },
            { id: "i-26", from: "them", at: "01:40", typing: 4, text: "Aa raha hai. Dheere.", english: "It's coming. Slowly." },
          ],
        },
      ],
    },
    {
      id: "imran-resend",
      requires: ["fired:upload-dropped"],
      unless: ["did:decoy", "did:files-in"],
      options: [
        {
          id: "resend",
          text: "Phir se bhej rahe hain.",
          english: "Sending it again.",
          sets: ["did:resent"],
          then: [{ id: "i-27", from: "owner", at: "01:52", ticks: "sent", attachment: { kind: "document", label: "Shree Sai Heights — original.zip", meta: "Waiting for network…" } }],
        },
      ],
    },
  ],
};

const aai: Thread = {
  id: "aai",
  app: "whatsapp",
  name: "Aai",
  unread: 2,
  messages: [
    { id: "a-1", from: "them", at: "22:10", day: "Saturday", text: "Khana kha liya?", english: "Have you eaten?" },
    { id: "a-2", from: "owner", at: "22:12", day: "Saturday", text: "ha aai", english: "Yes, Aai." },
    { id: "a-3", from: "them", at: "00:15", text: "Anu, phone utha.", english: "Anu, pick up the phone." },
    { id: "a-4", from: "them", at: "00:52", text: "Beta, bas ek baar bata de tu theek hai.", english: "Child, just tell me once that you're all right." },
    // Episode 2: meant for the family group, sent to her daughter's phone by mistake.
    {
      id: "a-5",
      from: "them",
      at: "01:34",
      with: "aai-mistake",
      requires: ["fired:aai-mistake"],
      attachment: {
        kind: "voice",
        seconds: 9,
        transcript: "…Shinde ko bolo, phone mile toh ladki ko jaane de. Phone zaroori hai.",
        english: "…Tell Shinde: if he gets the phone, let the girl go. The phone is what matters.",
      },
      evidence: "aai-mistake",
    },
    { id: "a-6", from: "them", at: "01:35", with: "aai-mistake", requires: ["fired:aai-mistake"], typing: 10, text: "Anu ye tere liye nahi tha", english: "Anu, that wasn't meant for you" },
  ],
};

const rohit: Thread = {
  id: "rohit",
  app: "whatsapp",
  name: "Rohit Dada",
  messages: [
    { id: "r-1", from: "them", at: "00:12", text: "Anu tu pagal hai kya? Wapas aa.", english: "Anu, are you mad? Come back." },
    { id: "r-2", from: "them", at: "00:40", text: "Papa ko pata chala ki tune kya liya hai toh…", english: "If Papa finds out what you took…" },
    // Episode 2: to whoever has it.
    { id: "r-3", from: "them", at: "01:36", with: "rohit-side", requires: ["fired:rohit-side"], text: "Aapne Anu se baat ki? Woh jo bhi bole, jhooth hai. Woh theek nahi hai.", english: "Have you talked to Anu? Whatever she says is a lie. She isn't well." },
    { id: "r-4", from: "them", at: "01:36", with: "rohit-side", requires: ["fired:rohit-side"], typing: 6, text: "Aap kis taraf ho?", english: "Whose side are you on?" },
  ],
  replies: [
    {
      id: "rohit-side",
      requires: ["fired:rohit-side"],
      options: [
        {
          id: "ananya",
          text: "Ananya ki taraf.",
          english: "Ananya's.",
          sets: ["did:sided-ananya"],
          then: [
            { id: "r-5", from: "them", at: "01:37", typing: 5, text: "Theek hai.", english: "All right." },
            { id: "r-6", from: "them", at: "01:37", typing: 4, text: "Phir aap bhi.", english: "Then you too." },
          ],
        },
        {
          id: "family",
          text: "Aapki. Phone kahan de doon?",
          english: "Yours. Where shall I hand the phone over?",
          sets: ["did:sided-family", "did:agreed-shinde"],
          then: [{ id: "r-7", from: "them", at: "01:37", typing: 5, text: "Borivali, platform 3. Shinde Kaka wahin milenge. Shukriya.", english: "Borivali, platform 3. Shinde Kaka will be right there. Thank you." }],
        },
        {
          id: "report",
          text: "Pehle batao, us report ka kya hua jo Ananya ne reject ki thi?",
          english: "First tell me what happened to the report Ananya rejected.",
          requires: ["saw:report"],
          sets: ["did:pressed-rohit"],
          then: [
            { id: "r-8", from: "them", at: "01:37", typing: 9, text: "…Kaunsi report?", english: "…What report?" },
            { id: "r-9", from: "them", at: "01:38", text: "Aapko nahi pata aap kis cheez mein ghus rahe ho.", english: "You don't know what you're getting into." },
          ],
        },
      ],
    },
  ],
};

/* The borrowed phone: Ananya until Borivali; from then on, Shinde. An unsaved number on WhatsApp. */
const borrowed: Thread = {
  id: "borrowed",
  app: "whatsapp",
  name: BORROWED,
  number: BORROWED,
  unread: 1,
  messages: [
    { id: "b-0", from: "them", at: "01:11", text: "Jisne bhi ye phone uthaya hai — mere ghar walon ko kuch mat batana. Please.", english: "Whoever picked up this phone: don't tell my family anything. Please." },
    // Episode 1, once the brother has called.
    { id: "b-1t", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro", "did:told-rohit"], text: "Tumne bata diya na.", english: "You told them, didn't you." },
    { id: "b-2t", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro", "did:told-rohit"], typing: 6, text: "…Ab woh tumhare peeche aayenge. Mere nahi. Tumhare.", english: "…Now they'll come after you. Not me. You." },
    // Thanks, for anyone who didn't tell him where they were.
    { id: "b-1p", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro", "did:asked-police"], text: "Shukriya. Phone on rakhna, band mat karna.", english: "Thank you. Keep the phone on, don't switch it off." },
    { id: "b-1l", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro", "did:lied-rohit"], text: "Shukriya. Phone on rakhna, band mat karna.", english: "Thank you. Keep the phone on, don't switch it off." },
    { id: "b-1d", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro", "did:declined-rohit"], text: "Shukriya. Phone on rakhna, band mat karna.", english: "Thank you. Keep the phone on, don't switch it off." },
    { id: "b-3", from: "them", at: "01:16", with: "a-intro", requires: ["fired:a-intro"], typing: 5, text: "Main Ananya hoon. Ye mera phone hai.", english: "I'm Ananya. This is my phone.", evidence: "a-intro" },
    { id: "b-4", from: "them", at: "01:17", with: "a-intro", requires: ["fired:a-intro"], typing: 6, text: "Mujhe ye wapas chahiye. 2:30 se pehle. Jo isme hai, uske liye.", english: "I need it back. Before 2:30. For what's in it." },
    // Episode 2: the door.
    { id: "b-10", from: "them", at: "01:28", with: "a-password", requires: ["fired:a-password"], text: "Andheri aa gaya?", english: "Are you at Andheri?" },
    { id: "b-11", from: "them", at: "01:28", with: "a-password", requires: ["fired:a-password"], typing: 7, text: "Notes mein ek lock wala note hai. Password: rubina", english: "There's a locked note in Notes. Password: rubina" },
    { id: "b-12", from: "them", at: "01:29", with: "a-password", requires: ["fired:a-password"], typing: 6, text: "Padh lo. Phir decide karna tum kiski taraf ho.", english: "Read it. Then decide whose side you're on." },
    /* Episode 3, from Borivali: Shinde, with the phone he took off the woman
       who lent it. He says "aap" where she said "tum"; he signs, and she never
       did; and he says Vasai, where her plan with Imran says Virar. */
    { id: "b-20", from: "them", at: "01:46", with: "impostor", requires: ["fired:impostor"], text: "Sab theek? Plan badla hai.", english: "All okay? The plan's changed." },
    { id: "b-21", from: "them", at: "01:46", with: "impostor", requires: ["fired:impostor"], typing: 6, text: "Aap Vasai Road pe utariye. Platform 6. Main wahan hoon, 2:03.", english: "Please get off at Vasai Road. Platform 6. I'm there, 2:03." },
    { id: "b-22", from: "them", at: "01:47", with: "impostor", requires: ["fired:impostor"], typing: 4, text: "Phone saath laaiye. — A", english: "Bring the phone. — A", evidence: "vasai-texts" },
  ],
  replies: [
    {
      id: "a-reply",
      requires: ["fired:a-intro"],
      options: [
        {
          id: "what",
          text: "Kya hai isme?",
          english: "What's in it?",
          sets: ["did:asked-what"],
          then: [{ id: "b-5", from: "them", at: "01:18", typing: 7, text: "Abhi nahi. Ye phone kisi aur ka hai, zyada der nahi. Agle station pe batati hoon.", english: "Not now. This phone is someone else's, I can't stay long. I'll tell you at the next station." }],
        },
        {
          id: "family",
          text: "Tumhare ghar wale bahut pareshan hain.",
          english: "Your family is really worried.",
          sets: ["did:said-family"],
          then: [
            { id: "b-6", from: "them", at: "01:18", typing: 4, text: "Haan.", english: "Yes." },
            { id: "b-7", from: "them", at: "01:18", typing: 5, text: "Phone ke liye.", english: "About the phone." },
          ],
        },
        {
          id: "where",
          text: "Ise kahan laana hai?",
          english: "Where should it go?",
          sets: ["did:offered"],
          then: [{ id: "b-8", from: "them", at: "01:18", typing: 6, text: "Abhi kahin nahi. Train mein raho. Main bataungi.", english: "Nowhere yet. Stay on the train. I'll tell you." }],
        },
      ],
    },
    {
      id: "impostor-reply",
      requires: ["fired:impostor"],
      options: [
        {
          id: "ok",
          text: "Theek hai. Vasai.",
          english: "Okay. Vasai.",
          sets: ["did:agreed-vasai"],
          then: [{ id: "b-23", from: "them", at: "01:48", typing: 4, text: "Shukriya. — A", english: "Thank you. — A" }],
        },
        {
          id: "who",
          text: "Tum kaun ho?",
          english: "Who are you?",
          sets: ["did:doubted", "did:asked-who"],
          then: [{ id: "b-24", from: "them", at: "01:48", typing: 8, text: "Main Ananya. Aur kaun? — A", english: "I'm Ananya. Who else? — A" }],
        },
        {
          id: "virar",
          text: "Imran ne kaha tha Virar, platform 1.",
          english: "Imran said Virar, platform 1.",
          requires: ["did:imran-knows"],
          sets: ["did:doubted", "did:cited-virar"],
          then: [{ id: "b-25", from: "them", at: "01:48", typing: 9, text: "Imran pe bharosa mat kariye. Vasai. — A", english: "Don't trust Imran. Vasai. — A" }],
        },
      ],
    },
  ],
};

const home: Thread = {
  id: "home",
  app: "yours:chats",
  name: "Ghar",
  messages: [
    { id: "h-1", from: "them", at: "00:50", text: "Last train mili? Pahunch ke message karna.", english: "Did you get the last train? Text when you're home." },
    { id: "h-2", from: "them", at: "01:52", with: "home-again", requires: ["fired:home-again"], text: "So jaayein? Virar se auto mil jayega na?", english: "Shall we go to sleep? You'll get an auto from Virar, right?" },
  ],
};

const threads: readonly Thread[] = [family, borrowed, imran, aai, rohit, home];

/* --- photos, the note, the rest -------------------------------------------- */

const photos: readonly Photo[] = [
  { id: "p-site", at: "16:20", day: "Thursday", place: "Mira Road", kind: "scene", title: "A building site at dusk: columns, rebar, a hard hat on a pile of bricks", src: "/found/lastlocal/site.jpg" },
  { id: "p-sea", at: "20:41", day: "Friday", place: "Marine Drive", kind: "scene", title: "Marine Drive at night, the Queen's Necklace from the far end", src: "/found/lastlocal/sea.jpg", wide: true },
  { id: "p-story", at: "00:41", day: "Sunday", place: "Dadar", kind: "scene", title: "Dadar, platform 4, 12:41 AM: a bag at her feet, a train's lights coming in", src: "/found/lastlocal/dadar.jpg", evidence: "story-dadar" },
];

/** The recording she made through her father's study door, 11:52 PM. */
const RECORDING: Photo = {
  id: "n-recording",
  at: "23:52",
  day: "Saturday",
  kind: "scene",
  title: "Recording, 11:52 PM, through a door",
  src: "/found/lastlocal/door.jpg",
  video: {
    seconds: 24,
    captions: [
      { at: 1, line: "[a door, not quite shut; a phone on speaker]" },
      { at: 3, who: "Papa", line: "Shinde, kal inquiry mein wahi file jayegi. Sign Anu ka hai.", english: "Shinde, that file goes to the inquiry tomorrow. The signature's Anu's." },
      { at: 9, who: "A man, on speaker", line: "Aur woh maan jayegi?", english: "And she'll go along with it?" },
      { at: 12, who: "Papa", line: "Do floor maine daale. Par naam uska jayega, toh case khatam.", english: "I added the two floors. But if it's her name, the case is closed." },
      { at: 19, who: "Papa", line: "Ghar ki baat hai. Maan jayegi.", english: "It's family. She'll go along." },
      { at: 22, line: "[footsteps, away from the door]" },
    ],
  },
  evidence: "recording",
};

const notes: readonly Note[] = [
  {
    id: "original",
    title: "Shree Sai Heights — original",
    at: "23:58",
    day: "Saturday",
    locked: true,
    password: "rubina",
    hint: "Imran ki behen",
    knownAfter: ["fired:a-password"],
    body: [],
    inside: [
      "Shree Sai Heights, Gaurai Pada, Nalasopara (W).",
      "Sanctioned: ground + 5. Built: ground + 7.",
      "14 Aug: my review. REJECTED. Columns C-4 to C-9 fail at G+6.",
      "The approval in the file has my signature. I never signed it.",
      "6 Sep, 5:10 AM. Fourteen people.",
      "Inquiry: Monday, 10 AM. They'll show them my name.",
    ],
    attachments: [
      {
        id: "n-report",
        at: "23:47",
        day: "Saturday",
        kind: "paper",
        title: "Structural review · Shree Sai Heights",
        lines: ["Proposal: G+7, two floors over sanction", "Columns C-4 to C-9: overstressed at G+6", "Status: REJECTED", "A. Pawar, Jr. Structural Engineer · 14.08"],
        evidence: "report",
      },
      {
        id: "n-approval",
        at: "23:48",
        day: "Saturday",
        kind: "paper",
        title: "Certificate of structural safety · Shree Sai Heights",
        lines: ["Floors: G+7", "Structure: certified safe", "A. Pawar · 16.08", "(the A is closed; she writes hers open)"],
        evidence: "forged",
      },
      RECORDING,
    ],
    evidence: "the-note",
  },
  {
    id: "list",
    title: "If I go tonight",
    at: "21:05",
    day: "Saturday",
    body: ["If I go tonight", "– charger", "– Aadhaar", "– don't take the car, Rohit has the key tracker", "– last Virar fast, 12:58", "– phone ON. Imran needs the originals, not screenshots"],
  },
];

const lockScreen = [
  { key: "aai", app: "phone" as const, from: "Aai", text: "23 Missed Calls", time: "1:10 AM" },
  { key: "family", app: "whatsapp" as const, from: "Pawar Parivar 🏠", text: "Rohit Dada: Kuch pata chala?", english: "Any news?", time: "1:09 AM" },
  { key: "borrowed", app: "whatsapp" as const, from: BORROWED, text: "Jisne bhi ye phone uthaya hai — mere ghar walon ko kuch mat batana. Please.", english: "Whoever picked up this phone: don't tell my family anything. Please.", time: "1:11 AM" },
  { key: "findmy", app: "findmy" as const, from: "Find My", text: "Your location is being shared with Family.", time: "12:02 AM" },
];

/* --- what can be found ----------------------------------------------------- */

const evidence: readonly Evidence[] = [
  { id: "family", device: "owner", app: "whatsapp", label: "Papa: “Shinde ko bulaya hai.”", within: true },
  { id: "imran-chat", device: "owner", app: "whatsapp", label: "Imran: “Platform 4. Mat rukna.”", within: true },
  { id: "story-dadar", device: "owner", app: "photos", label: "Dadar, platform 4, 12:41 AM", within: true },
  { id: "a-intro", device: "owner", app: "whatsapp", label: "Ananya: “Mujhe ye wapas chahiye. 2:30 se pehle.”", within: true, requires: ["fired:a-intro"] },
  { id: "the-note", device: "owner", app: "notes", label: "Her locked note, Shree Sai Heights", manual: true },
  { id: "report", device: "owner", app: "notes", label: "Her review: REJECTED, 14 Aug", manual: true },
  { id: "forged", device: "owner", app: "notes", label: "The approval, signed in her name, not her hand", manual: true },
  { id: "recording", device: "owner", app: "notes", label: "Papa: “Do floor maine daale.”", manual: true },
  { id: "aai-mistake", device: "owner", app: "whatsapp", label: "Aai: “Phone zaroori hai.”", within: true, requires: ["fired:aai-mistake"] },
  { id: "rubina", device: "owner", app: "whatsapp", label: "Rubina Shaikh, 16", within: true, requires: ["did:imran-knows"] },
  { id: "vasai-texts", device: "owner", app: "whatsapp", label: "“Vasai Road. Platform 6. — A”", within: true, requires: ["fired:impostor"] },
];

/* --- calls ---------------------------------------------------------------- */

const incoming: readonly IncomingCall[] = [
  {
    id: "rohit",
    device: "owner",
    from: "Rohit Dada",
    sub: "mobile",
    at: "01:13",
    after: ["fired:rohit-rings"],
    lines: [
      { who: "Rohit", line: "Anu? Anu, tu hai?", english: "Anu? Anu, is that you?" },
      { who: "Rohit", line: "…Aap kaun? Ye meri behen ka phone hai.", english: "…Who are you? This is my sister's phone." },
      { who: "Rohit", line: "Woh theek nahi hai. Ghar se bhaagi hai, kisi Imran ke saath. Please, aap kahan ho?", english: "She isn't well. She's run off from home, with some Imran. Please, where are you?" },
    ],
    reply: {
      id: "rohit-call",
      options: [
        {
          id: "tell",
          text: "Virar fast mein. Dadar se abhi nikli hai.",
          english: "On the Virar fast. It just left Dadar.",
          sets: ["did:told-rohit"],
          then: [
            { id: "rc-1", from: "them", at: "01:14", text: "Virar fast. Thank you. Thank you.", english: "The Virar fast. Thank you. Thank you." },
            { id: "rc-2", from: "them", at: "01:14", text: "Phone on rakhna. Hum aa rahe hain.", english: "Keep the phone on. We're coming." },
          ],
        },
        {
          id: "police",
          text: "Ye phone police ko de doon?",
          english: "Should I give this phone to the police?",
          sets: ["did:asked-police"],
          then: [
            { id: "rc-3", from: "them", at: "01:14", text: "Police nahi!", english: "Not the police!" },
            { id: "rc-4", from: "them", at: "01:14", text: "…Matlab, please. Ghar ki baat hai. Bas batao aap kahan ho.", english: "…I mean, please. It's a family matter. Just tell me where you are." },
          ],
        },
        {
          id: "lie",
          text: "Galat number.",
          english: "Wrong number.",
          sets: ["did:lied-rohit"],
          then: [{ id: "rc-5", from: "them", at: "01:14", text: "Galat number? Ye Anu ka phone hai. Maine khud dilaya tha.", english: "Wrong number? This is Anu's phone. I bought it for her myself." }],
        },
      ],
    },
  },
  /* Turn off the location, and the man who was watching it calls the phone. */
  {
    id: "shinde-calls",
    device: "owner",
    from: SHINDE,
    sub: "mobile",
    at: "01:21",
    after: ["fired:loc-off"],
    insists: true,
    lines: [
      { who: "Shinde", line: "Namaste. Aap mujhe nahi jaante. Main Shinde. Pawar sahab ka purana dost.", english: "Namaste. You don't know me. I'm Shinde. An old friend of Mr Pawar's." },
      { who: "Shinde", line: "Location band karne se train nahi rukti.", english: "Switching the location off doesn't stop the train." },
      { who: "Shinde", line: "Borivali pe phone de dena. Platform 3. Kisi ka nuksaan nahi hoga.", english: "Hand the phone over at Borivali. Platform 3. Nobody gets hurt." },
    ],
    reply: {
      id: "shinde-answer",
      options: [
        {
          id: "yes",
          text: "Theek hai. Borivali.",
          english: "All right. Borivali.",
          sets: ["did:agreed-shinde"],
          then: [{ id: "sc-1", from: "them", at: "01:22", text: "Samajhdaar.", english: "Sensible." }],
        },
        {
          id: "floors",
          text: "Do floor Pawar sahab ne daale the. Recording hai.",
          english: "Mr Pawar added the two floors. There's a recording.",
          requires: ["saw:recording"],
          sets: ["did:accused-shinde"],
          then: [
            { id: "sc-2", from: "them", at: "01:22", text: "…Recording.", english: "…A recording." },
            { id: "sc-3", from: "them", at: "01:22", text: "Phir toh phone aur bhi zaroori hai. Aakhri baar keh raha hoon.", english: "Then the phone matters even more. I'm saying it for the last time." },
          ],
        },
        {
          id: "police",
          text: "Ye phone police ke paas jayega.",
          english: "This phone is going to the police.",
          sets: ["did:threatened-police"],
          then: [{ id: "sc-4", from: "them", at: "01:22", text: "Kaunsi police? Main tees saal police mein tha.", english: "Which police? I was in the police for thirty years." }],
        },
      ],
    },
  },
  /* Bhayander: the real Ananya, on Imran's phone. */
  {
    id: "real-call",
    device: "owner",
    from: "Imran",
    sub: "WhatsApp Audio",
    at: "01:55",
    after: ["did:at-bhayander"],
    insists: true,
    lines: [
      { who: "Ananya", line: "Hello? Main Ananya. Imran ke phone se.", english: "Hello? It's Ananya. On Imran's phone." },
      { who: "Ananya", line: "Dadar pe jisne mujhe apna phone diya tha, Shinde ne usse woh phone le liya.", english: "The woman who lent me her phone at Dadar: Shinde took it off her." },
      { who: "Ananya", line: "Maine tumhe Vasai ka koi message nahi bheja.", english: "I never sent you any message about Vasai." },
      { who: "Ananya", line: "Hum Virar pe hain. Platform 1. Please. Train mat chhodna.", english: "We're at Virar. Platform 1. Please. Don't leave the train." },
    ],
    reply: {
      id: "real-answer",
      options: [
        {
          id: "near",
          text: "Woh is train mein hai. Paas aa raha hai.",
          english: "He's on this train. He's getting closer.",
          sets: ["did:knows-impostor", "did:warned-her"],
          then: [{ id: "rl-1", from: "them", at: "01:56", text: "Toh dabba badal lo. Bheed mein raho. Bas Virar tak.", english: "Then change coaches. Stay in the crowd. Just until Virar." }],
        },
        {
          id: "how",
          text: "Kaise maanoon ki ye tum ho?",
          english: "How do I know this is you?",
          sets: ["did:knows-impostor", "did:tested-her"],
          then: [{ id: "rl-2", from: "them", at: "01:56", text: "Maine tumhe kabhi 'aap' nahi bola. Woh bolta hai. Kyunki woh tumhe nahi jaanta.", english: "I never called you 'aap'. He does. Because he doesn't know you." }],
        },
      ],
    },
  },
];

/* --- the night, as it happens ---------------------------------------------- */

const events: readonly LiveEvent[] = [
  // Episode 1. Seconds after it's picked up, the brother rings.
  { id: "rohit-rings", device: "owner", after: ["did:unlock"], delay: 8, app: "phone" },
  // Then the girl, from a borrowed phone.
  { id: "a-intro", device: "owner", after: ["fired:rohit-rings"], delay: 9, app: "whatsapp", banner: `${BORROWED} · Main Ananya hoon. Ye mera phone hai.` },
  // Once she's been read: someone else starts watching the phone.
  { id: "shinde-views", device: "owner", after: ["saw:a-intro"], delay: 22, app: "findmy", banner: "Find My · Shinde Kaka is now viewing this iPhone's location." },
  // Andheri: the episode turns, once the phone's been put down.
  { id: "at-andheri", device: "owner", after: ["fired:shinde-views"], delay: 25, quiet: true, app: "findmy", sets: ["did:at-andheri", "ep:2"] },

  // Episode 2.
  { id: "a-password", device: "owner", after: ["fired:title-2"], delay: 6, app: "whatsapp", banner: `${BORROWED} · Notes mein ek lock wala note hai. Password: rubina` },
  { id: "aai-mistake", device: "owner", after: ["saw:report"], delay: 10, app: "whatsapp", banner: "Aai · 🎤 Voice message" },
  { id: "imran-writes", device: "owner", after: ["saw:report"], unless: ["did:imran-knows"], delay: 14, app: "whatsapp", banner: "Imran · Anu? Online dikh rahi hai." },
  { id: "rohit-side", device: "owner", after: ["fired:aai-mistake"], delay: 18, app: "whatsapp", banner: "Rohit Dada · Aap kis taraf ho?" },
  // Location off: the family group sees it, and the man watching it calls.
  { id: "loc-off", device: "owner", after: ["did:location-off"], delay: 4, app: "whatsapp", banner: "Pawar Parivar 🏠 · Rohit Dada: Anu ki location band ho gayi!!" },
  // The files, sent before the gap after Mira Road, get through in twenty seconds.
  { id: "upload-done", device: "owner", after: ["did:sent-files"], unless: ["fired:upload-dropped", "did:decoy", "did:gap"], delay: 20, app: "whatsapp", sets: ["did:files-in"], banner: "Imran · Aa gaya. Sab. Recording bhi." },
  // Borivali: once she's been read and the note opened, or in time anyway.
  { id: "at-borivali", device: "owner", after: ["fired:aai-mistake", "fired:rohit-side"], delay: 30, quiet: true, app: "findmy", sets: ["did:at-borivali", "ep:3"] },
  { id: "at-borivali-late", device: "owner", after: ["fired:a-password"], unless: ["fired:at-borivali"], delay: 300, quiet: true, app: "findmy", sets: ["did:at-borivali", "ep:3"] },

  // Episode 3.
  { id: "shinde-boards", device: "owner", after: ["fired:title-3"], unless: ["did:gave-shinde"], delay: 5, app: "whatsapp", banner: "Pawar Parivar 🏠 · Rohit Dada: Shinde Kaka Borivali pe train mein chadh gaye." },
  { id: "impostor", device: "owner", after: ["fired:shinde-boards"], delay: 20, app: "whatsapp", banner: `${BORROWED} · Aap Vasai Road pe utariye. Platform 6.` },
  // The gap after Mira Road: anything still uploading stops.
  { id: "dead-zone", device: "owner", after: ["fired:impostor"], delay: 12, app: "settings", icon: "settings", banner: "No Service · Mira Road – Bhayander", sets: ["did:gap"] },
  /* Anything still uploading when the gap comes, or sent after it, stops; the
     signal is patchy from here until Nalasopara, where a resend gets through. */
  { id: "upload-dropped", device: "owner", after: ["did:sent-files", "did:gap"], unless: ["fired:upload-done"], delay: 2, app: "whatsapp", banner: "Imran · Beech mein ruk gaya! Phir se bhejo." },
  { id: "shinde-5", device: "owner", after: ["fired:dead-zone"], delay: 10, app: "whatsapp", banner: "Pawar Parivar 🏠 · Shinde Kaka: Dabba 5." },
  { id: "home-again", device: "yours", after: ["fired:shinde-5"], delay: 4, app: "yours:chats", banner: "Ghar · So jaayein? Virar se auto mil jayega na?" },
  { id: "shinde-6", device: "owner", after: ["fired:shinde-5"], delay: 14, app: "whatsapp", banner: "Pawar Parivar 🏠 · Shinde Kaka: Dabba 6. Phone abhi bhi on hai." },
  { id: "at-bhayander", device: "owner", after: ["fired:shinde-6"], delay: 8, app: "findmy", sets: ["did:at-bhayander"] },
  // Vasai Road, once she's been heard.
  { id: "at-vasai", device: "owner", after: ["did:done-real-call"], delay: 10, app: "findmy", sets: ["did:at-vasai"] },
  // A resent file finishes where the signal comes back: Nalasopara.
  { id: "resend-done", device: "owner", after: ["did:resent", "did:at-nalasopara"], unless: ["did:decoy"], delay: 2, app: "whatsapp", sets: ["did:files-in"], banner: "Imran · Aa gaya. Nalasopara se." },
  // Off the train at Vasai, or handed in: the night is over there.
  { id: "end-off", device: "owner", after: ["did:got-off"], delay: 1, app: "findmy", sets: ["did:resolve", "did:chose"] },
  { id: "end-139", device: "owner", after: ["did:called-139"], delay: 1, app: "findmy", sets: ["did:resolve", "did:chose"] },
  { id: "end-borivali", device: "owner", after: ["did:gave-shinde"], delay: 1, app: "findmy", sets: ["did:resolve", "did:chose"] },
  // Virar.
  { id: "at-virar", device: "owner", after: ["did:at-nalasopara"], delay: 14, app: "findmy", sets: ["did:at-virar", "did:resolve", "did:chose"] },
];

/* --- where the story stops ------------------------------------------------- */

const moments: readonly Moment[] = [
  // Only for someone who agreed to hand it over.
  {
    id: "borivali",
    after: ["did:at-borivali", "did:agreed-shinde"],
    where: "Borivali · 1:42 AM · Platform 3",
    lines: [
      { text: "The doors open." },
      { text: "A man in a grey safari suit is standing at the door. Fifties, a moustache, a police haircut. He holds out his hand." },
      { who: "Shinde", text: "Phone.", english: "The phone." },
    ],
    seconds: 15,
    timeout: "keep",
    options: [
      { id: "give", text: "Give him the phone.", sets: ["did:gave-shinde"] },
      { id: "keep", text: "Step back. Let the doors close on his hand.", sets: ["did:refused-shinde"] },
    ],
  },
  {
    id: "vasai",
    after: ["did:at-vasai"],
    where: "Vasai Road · 2:03 AM · Platform 6",
    lines: [
      { text: "The train slows into Vasai Road. Platform 6." },
      { text: "A chai stall, shut. A tube light, buzzing. Nobody is waiting." },
      { text: "Two doors down, a man in a grey safari suit steps to the edge of the doorway and looks along the platform." },
      { text: "Then he looks along the train. At you." },
    ],
    seconds: 20,
    timeout: "stay",
    options: [
      { id: "off", text: "Get off at Vasai.", sets: ["did:got-off"] },
      { id: "stay", text: "Stay on. Keep the phone in your pocket. Don't look at him.", sets: ["did:stayed"] },
      { id: "decoy", text: "Leave the phone on the seat, still on, and walk away from it.", sets: ["did:decoy"] },
      { id: "139", text: "Call 139, the railway helpline, and hold the phone up.", sets: ["did:called-139"] },
    ],
  },
  {
    id: "nalasopara",
    after: ["did:moment-vasai"],
    unless: ["did:got-off", "did:called-139"],
    where: "Nalasopara · 2:08 AM",
    lines: [
      { text: "The train runs past the back of Nalasopara station." },
      { text: "Behind a blue tin fence, an empty lot. Grass already coming up through the rubble." },
      { text: "Fourteen people lived there until six weeks ago." },
      { text: "Nobody else in the coach looks." },
    ],
    options: [{ id: "look", text: "Look.", sets: ["did:at-nalasopara"] }],
  },
];

/* --- the score: what the player uncovered ---------------------------------- */

const chain: readonly Link[] = [
  { id: "phone", label: "The phone", owner: "Ananya", kind: "spine", truth: "Ananya left her phone on your seat because her family could track it.", when: [["saw:a-intro"]] },
  { id: "family", label: "The family", owner: "Pawar", kind: "spine", truth: "Her family wanted the phone back more than they wanted her.", when: [["saw:aai-mistake"]] },
  { id: "building", label: "The building", owner: "Pawar", kind: "spine", truth: "Pawar Infra built two floors over her rejected report. Fourteen people died.", when: [["saw:report"]] },
  { id: "signature", label: "The signature", owner: "Pawar", kind: "spine", truth: "Her signature on the approval was forged, so the collapse would be hers.", when: [["saw:forged", "saw:recording"]] },
  { id: "imran", label: "Imran", owner: "Imran", kind: "deep", truth: "The man her family warned her about lost his sister in that building.", when: [["saw:rubina"]] },
  { id: "texts", label: "The texts", owner: "Shinde", kind: "deep", truth: "From Borivali, Shinde texted you as Ananya, to bring the phone off at Vasai. You doubted it before she called.", when: [["did:doubted"]] },
  { id: "proof", label: "The proof", owner: "You", kind: "deep", truth: "The files reached Imran before his page locked.", when: [["did:files-in"]] },
];

/* --- the mornings ---------------------------------------------------------- */

const NEWS_BLAMED = { at: "10:20 AM", who: "News · PTI", text: "Inquiry told approval for collapsed Nalasopara building was signed by builder's daughter" } as const;

const endings: readonly Ending[] = [
  {
    id: "family",
    row: "The Family's Version",
    when: { flags: ["did:gave-shinde"] },
    lines: [
      { at: "1:42 AM", text: "Borivali. You put the phone in his hand. He says thank you the way a man says it who's used to being thanked." },
      { at: "1:43 AM", text: "The doors close. Through the glass he's already scrolling." },
      { at: "3:05 AM", text: "Somewhere in Dadar, a girl is brought home in the back of her brother's car." },
      NEWS_BLAMED,
    ],
    last: [{ text: "Fourteen names will be read at the inquiry. Then hers." }],
    onlyHere: "His hand, out, at the door.",
  },
  {
    id: "lost",
    row: "Lost and Found",
    when: { flags: ["did:called-139"] },
    lines: [
      { at: "2:03 AM", text: "Two railway constables meet the train at Vasai. You hand them the phone. One writes it in a register: one iPhone, found, Virar fast, seat 41." },
      { at: "2:05 AM", text: "Shinde watches from two doors down. He doesn't come closer. He makes a call." },
      { at: "10:20 AM", who: "News · PTI", text: "Nalasopara collapse inquiry adjourned for two weeks" },
      { at: "12:10 PM", text: "A lawyer collects “his client's daughter's phone” from Vasai lost property, with a letter from the family." },
    ],
    last: [{ text: "Lost property, Vasai Road. Item 0417. Collected." }],
    onlyHere: "A register, and a lawyer's letter.",
  },
  {
    id: "platform",
    row: "Wrong Platform",
    when: { flags: ["did:got-off"] },
    lines: [
      { at: "2:03 AM", text: "You step down onto platform 6. The train pulls out behind you. Nobody is here." },
      { at: "2:04 AM", text: "The man in the grey safari suit steps down too, and walks over, unhurried. He holds out his hand. He doesn't have to say anything." },
      { at: "2:14 AM", text: "At Virar, under the clock on platform 1, a girl waits for the train after yours. And the one after." },
      NEWS_BLAMED,
    ],
    last: [{ text: "Platform 6, Vasai Road. A chai stall, shut. A tube light, buzzing." }],
    onlyHere: "Vasai Road, platform 6, empty.",
  },
  {
    id: "decoy",
    row: "The Decoy",
    when: { flags: ["did:decoy", "did:files-in"] },
    lines: [
      { at: "2:04 AM", text: "At Vasai, Shinde steps in, picks a phone up off an empty seat, and steps off before the doors close. It's still on. Everything on it has already left." },
      { at: "2:14 AM", text: "Virar. You get off with empty hands. Ananya is under the clock with Imran. She doesn't need her phone any more. She needed it to have been sent." },
      { at: "2:29 AM", who: "Imran", text: "Page lock ho gaya. Sab andar hai.", english: "The page is locked. Everything's in it." },
      { at: "6:10 AM", who: "News · Mid-Day", text: "Nalasopara collapse: engineer's rejected report surfaces; builder recorded admitting two illegal floors" },
      { at: "10:40 AM", who: "News · Mid-Day", text: "Pawar Infra owner detained after inquiry hearing" },
    ],
    last: [{ who: "Ananya", text: "📷 The sunrise from Virar station, 6:31 AM" }, { text: "You never saw her phone again." }],
    onlyHere: "A phone left on an empty seat, still on.",
  },
  {
    id: "morning",
    row: "Morning Edition",
    when: { flags: ["did:files-in"] },
    lines: [
      { at: "2:14 AM", text: "Virar, platform 1. She's under the clock with Imran. She takes her phone from you with both hands, like it might burn." },
      { at: "2:29 AM", who: "Imran", text: "Page lock ho gaya. Kal subah sabke ghar pahunchega.", english: "The page is locked. It'll be in every home by morning." },
      { at: "6:10 AM", who: "News · Mid-Day", text: "Nalasopara collapse: engineer's rejected report surfaces; builder recorded admitting two illegal floors" },
      { at: "10:40 AM", who: "News · Mid-Day", text: "Pawar Infra owner detained after inquiry hearing" },
      { at: "11:02 AM", who: "Ananya", text: "Aai ne pehli baar phone kiya. Maine utha liya.", english: "Aai called for the first time. I picked up." },
    ],
    last: [{ who: "Imran", text: "📷 Rubina, sixteen, at her school's annual day" }, { text: "Fourteen names, on page one." }],
    onlyHere: "Page one, with fourteen names on it.",
  },
  // Kept her, lost the proof: everything else that reaches Virar.
  {
    id: "late",
    row: "Too Late",
    when: { flags: [] },
    lines: [
      { at: "2:14 AM", text: "Virar. She's under the clock. She takes the phone. Imran is on a call with his editor, shouting." },
      { at: "2:31 AM", who: "Imran", text: "Page lock ho gaya. Bina iske.", english: "The page locked. Without it." },
      NEWS_BLAMED,
      { at: "10:24 AM", who: "Ananya", text: "Main inquiry ke bahar khadi hoon. Phone haath mein hai. Abhi bhi der nahi hui.", english: "I'm standing outside the inquiry. The phone is in my hand. It isn't too late yet." },
    ],
    last: [{ text: "She walks in." }],
    onlyHere: "A girl walking into the inquiry, alone.",
  },
];

/* --- the chapter ----------------------------------------------------------- */

export const story: Story = {
  id: "lastlocal",
  title: "Last Local",
  owner: { name: "Ananya Pawar", short: "Ananya" },
  episodes: ["Somebody's Phone", "Fourteen", "Vasai Road"],
  clocks: [
    { base: "01:12", day: "Sunday", date: "26/10", battery: 31 },
    { base: "01:27", day: "Sunday", date: "26/10", battery: 27 },
    { base: "01:42", day: "Sunday", date: "26/10", battery: 22 },
  ],
  coldOpen: {
    where: "Western line · Virar fast · 1:11 AM",
    lines: [
      { line: "[a local at speed, slowing]" },
      { who: "Announcement", line: "Agla station: Dadar. Pudhil station: Dadar.", english: "Next station: Dadar." },
      { line: "[the doors open; the platform's noise pours in]" },
      { who: "A girl", line: "Sorry— ek second—", english: "Sorry, one second." },
      { line: "[something slides down the seat beside you]" },
      { line: "[she's back on the platform before the doors close]" },
      { line: "[she doesn't look back]" },
    ],
    after: "Then something starts buzzing in the seat where she sat.",
    bed: "train",
  },
  ambience: "train",
  seat: {
    line: "A phone, face down, buzzing in the seat where she sat. It isn't yours.",
    note: "16+ · a building collapse, threats, a family's violence (nothing graphic) · this game never asks for anything real",
    act: "Pick it up",
  },
  caseFile: false,
  status: [
    { text: "A girl got off at Dadar. Her phone didn't." },
    { text: "Her name is Ananya. She wants this phone back by 2:30.", requires: ["saw:a-intro"] },
    { text: "Someone called Shinde is watching where this phone goes.", requires: ["fired:shinde-views"] },
    { text: "She left a locked note. The password is “rubina”.", requires: ["fired:a-password"] },
    { text: "Her report said the building would fall. Someone signed it safe, in her name.", requires: ["saw:report"] },
    { text: "Imran's page locks at 2:30. He needs the note's files.", requires: ["did:imran-knows"] },
    { text: "The files are going to Imran. Slowly. Keep the phone on.", requires: ["did:sent-files"] },
    { text: "Imran has the files. Now get the phone to her, at Virar.", requires: ["did:files-in"] },
    { text: "Shinde is on this train.", requires: ["fired:shinde-boards"] },
    { text: "Imran has the files. Get the phone past Shinde, to Virar.", requires: ["did:files-in", "fired:shinde-boards"] },
    { text: "The upload died in the dead zone. Imran needs it again.", requires: ["fired:upload-dropped"], unless: ["did:files-in"] },
    { text: "The Vasai messages weren't her. She's at Virar, platform 1.", requires: ["did:knows-impostor"] },
  ],
  route: {
    train: "Virar fast",
    stations: [
      { name: "Dadar", at: "1:12" },
      { name: "Andheri", at: "1:27", flag: "did:at-andheri" },
      { name: "Borivali", at: "1:42", flag: "did:at-borivali" },
      { name: "Bhayander", at: "1:55", flag: "did:at-bhayander" },
      { name: "Vasai Road", at: "2:03", flag: "did:at-vasai" },
      { name: "Nalasopara", at: "2:08", flag: "did:at-nalasopara" },
      { name: "Virar", at: "2:14", flag: "did:at-virar" },
    ],
  },
  moments,
  findMy: {
    people: [
      { name: "Aai", steps: [{ at: "Home · Dadar West" }] },
      { name: "Papa", steps: [{ at: "Home · Dadar West" }] },
      {
        name: "Rohit Dada",
        steps: [
          { at: "Home · Dadar West" },
          { after: "did:told-rohit", at: "In a car · Western Express Highway, near Andheri" },
          { after: "did:at-borivali", at: "In a car · near Borivali", note: "Driving north" },
          { after: "did:at-vasai", at: "Vasai Road station" },
        ],
      },
      {
        name: "Shinde Kaka",
        requires: ["fired:shinde-views"],
        follows: ["fired:shinde-views"],
        steps: [
          { at: "In a car · Western Express Highway, near Andheri" },
          { after: "did:at-andheri", at: "In a car · near Borivali station" },
          { after: "fired:shinde-boards", at: "On this train · after Borivali", note: "Moving through the coaches" },
          { after: "fired:shinde-6", at: "On this train · near Bhayander", note: "Two coaches away" },
          { after: "did:at-vasai", at: "On this train · Vasai Road", note: "Two doors down" },
        ],
      },
    ],
    stopSharing: ["did:location-off"],
  },
  arrival: { note: [], english: "", caption: "" },
  gate: { level: "", lines: [], ask: "" },
  lockScreen,
  home: {
    pages: [
      [
        { app: "notes", label: "Notes" },
        { app: "findmy", label: "Find My" },
        { app: "safari", label: "Safari" },
        { app: "settings", label: "Settings" },
      ],
    ],
    dock: [
      { app: "whatsapp", label: "WhatsApp" },
      { app: "phone", label: "Phone" },
      { app: "photos", label: "Photos" },
    ],
  },
  evidence,
  threads,
  photos,
  notes,
  memos: [],
  mail: [],
  payments: [],
  profiles: [],
  incoming,
  searches: [
    {
      id: "s-1",
      text: "imran shaikh journalist",
      at: "19:12",
      day: "Friday",
      results: ["Imran Shaikh · independent journalist · “Who signed Shree Sai Heights?”", "Protester detained outside Nalasopara collapse site, released"],
    },
    {
      id: "s-2",
      text: "nalasopara building collapse inquiry date",
      at: "21:40",
      day: "Saturday",
      results: ["Shree Sai Heights inquiry: hearing on Monday, 10 AM", "14 dead in Nalasopara collapse; builder blames tenants' alterations"],
    },
    {
      id: "s-3",
      text: "my signature forged on approval what to do",
      at: "22:58",
      day: "Saturday",
      results: ["Forged signatures on official documents: what you can do", "Keep originals, with their metadata. Don't send screenshots."],
    },
  ],
  calls: [
    { id: "c-aai", name: "Aai", kind: "missed", at: "01:10", day: "Sunday", count: 23 },
    { id: "c-rohit", name: "Rohit Dada", kind: "missed", at: "00:58", day: "Sunday", count: 6 },
    { id: "c-imran", name: "Imran", kind: "out", at: "00:44", day: "Sunday", seconds: 38 },
  ],
  settings: [{ rows: [{ title: "Ananya Pawar", sub: "Apple Account, iCloud and more" }] }, { rows: [{ title: "Battery Percentage", value: "On" }] }],
  questions: [],
  events,
  chain,
  endings,
  yours: {
    intro: "",
    sendTo: "",
    sendRequires: ["did:never"],
    parcel: { note: "", act: "", ask: "" },
  },
  next: {
    title: "Chapter 3",
    from: "Imran",
    lines: [{ text: "Ek aur phone mila hai. Is baar kisi aur sheher mein.", english: "Another phone has turned up. Another city this time." }],
    note: "Chapter 3 is being found. It'll be on the site when it arrives.",
  },
  outside: [
    { text: "On any train in India, the railway helpline is 139.", tel: "139" },
    { text: "Emergency, anywhere in India: 112.", tel: "112" },
    { text: "If any of this is close to home, Tele-MANAS is free, open all day, in English and 20 other languages: 14416.", tel: "14416" },
  ],
  choices: [
    "did:told-rohit",
    "did:asked-police",
    "did:lied-rohit",
    "did:location-off",
    "did:sided-ananya",
    "did:sided-family",
    "did:imran-knows",
    "did:sent-files",
    "did:held-files",
    "did:doubted",
    "did:gave-shinde",
    "did:got-off",
    "did:stayed",
    "did:decoy",
    "did:called-139",
  ],
};

