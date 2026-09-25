import type {
  CallEntry,
  Mail,
  Memo,
  Note,
  Payment,
  Photo,
  Profile,
  Search,
  SettingsGroup,
  Thread,
} from "../types";

/* ===========================================================================
   Sameer's phone, as he left it: the layer in plain view (CHAPTER1.md E,
   "what he put in front", and everything he didn't think to tidy).

   It is all here from the first minute, because it's his phone. What he
   tucked away is here too, behind the hard routes, and counts only in the
   episode that needs it: each evidence id says which, in episode1.ts,
   episode2.ts and episode3.ts. What would give an episode away has a door
   the player can find early and can't open until then (the layers, decided
   2026-09-25, CHAPTER1.md F): the 12:29 photo and the reel take are still in
   iCloud, Voice Memos is offloaded, and the whole fire clip and Kunal's
   frame are in a note locked with the minute of the lie.

   Days: the wedding was Saturday 22/11, and the player's night is Saturday
   29/11, so last Saturday is written as a date the way WhatsApp would.
   Times are 24-hour "HH:MM"; the phone turns them into what it would show.
   =========================================================================== */

/** Raju's number, unsaved. Masked, so no real person's number is ever on screen. */
export const RAJU = "+91 62••• •4417";

export const threads: readonly Thread[] = [
  /* The pinned chat: four voice notes to someone who blocked him, each with
     one grey tick. What he wanted read first. */
  {
    id: "m",
    app: "whatsapp",
    name: "M",
    pinned: true,
    sub: "last seen a long time ago",
    /* Who M is, as WhatsApp's contact info shows anyone: the number, and the
       line she wrote about herself. Found this way whatever brought the
       phone to the player (CHAPTER1.md O1). */
    contact: { number: "+91 98••• •1206", about: "Meera Arora · Advocate, Saket Courts", evidence: "meera" },
    messages: [
      {
        id: "m-1",
        from: "owner",
        at: "09:40",
        day: "Sunday",
        ticks: "sent",
        attachment: {
          kind: "voice",
          seconds: 18,
          transcript: "M… main jaanta hoon tu reply nahi karegi. Kal shaadi mein… Kunal firing kar raha tha. Ek ladka gir gaya.",
          english: "M… I know you won't reply. Last night at the wedding… Kunal was firing. A boy fell.",
        },
        evidence: "vn-kunal",
      },
      {
        id: "m-2",
        from: "owner",
        at: "23:20",
        day: "Sunday",
        ticks: "sent",
        attachment: {
          kind: "voice",
          seconds: 11,
          transcript: "Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya.",
          english: "They didn't take him to hospital. Bhasin didn't let anyone go.",
        },
        evidence: "vn-hospital",
      },
      {
        id: "m-3",
        from: "owner",
        at: "02:05",
        day: "Monday",
        ticks: "sent",
        attachment: {
          kind: "voice",
          seconds: 9,
          transcript: "Unhone usko jala diya, M. Main wahan tha. Maine dekha.",
          english: "They burned him, M. I was there. I saw it.",
        },
        evidence: "vn-burned",
      },
      {
        id: "m-4",
        from: "owner",
        at: "22:15",
        day: "Wednesday",
        ticks: "sent",
        attachment: {
          kind: "voice",
          seconds: 6,
          transcript: "Agar mujhe kuch hua… sab phone mein hai.",
          english: "If anything happens to me… it's all on the phone.",
        },
      },
    ],
  },
  {
    id: "mummy",
    app: "whatsapp",
    name: "Mummy",
    messages: [
      { id: "mu-1", from: "them", at: "13:02", day: "Sunday", text: "Beta shaadi kaisi rahi? Photo bhejna 😊", english: "How was the wedding? Send photos." },
      { id: "mu-2", from: "owner", at: "15:40", day: "Sunday", text: "theek thi mummy. thak gaya hoon", english: "It was fine, Mummy. I'm tired." },
      { id: "mu-3", from: "them", at: "11:30", day: "Tuesday", text: "Bhasin uncle aaye the. Pooch rahe the tu kahan hai. Beta sab theek hai?", english: "Bhasin uncle came by. He was asking where you are. Is everything all right?" },
      { id: "mu-4", from: "them", at: "20:15", day: "Thursday", text: "Mumbai ka ticket le liya? Rent ka kya socha?", english: "Did you get the Mumbai ticket? What about the rent?" },
      { id: "mu-5", from: "them", at: "22:52", day: "Saturday", text: "Beta, phone kyun nahi utha raha? Khana khaya?", english: "Why aren't you picking up? Have you eaten?" },
    ],
  },
  /* Unsaved: the number and the name its owner gave WhatsApp, the way the app
     shows a stranger. Dilip's brother, asking who has the phone. */
  {
    id: "raju",
    app: "whatsapp",
    name: RAJU,
    number: RAJU,
    sub: "~Raju Mahto",
    messages: [
      {
        id: "r-1",
        from: "them",
        at: "13:12",
        day: "Monday",
        forwarded: true,
        attachment: { kind: "photo", label: "LAPATA — Dilip Kumar Mahto (Chhotu), 19. Last seen Sat 22 Nov, Chhattarpur. Catering work." },
        evidence: "poster",
      },
      {
        id: "r-2",
        from: "them",
        at: "13:13",
        day: "Monday",
        text: "Aap Sameer bhaiya ho na? Dilip aapke saath kaam kar raha tha.",
        english: "You're Sameer bhaiya, right? Dilip was working with you.",
      },
      { id: "r-3", from: "them", at: "19:40", day: "Wednesday", text: "Bhaiya ek baar baat kar lo 🙏", english: "Bhaiya, please talk to me once." },
      {
        id: "r-4",
        from: "them",
        at: "23:31",
        day: "Saturday",
        text: "Ye phone ab kiske paas hai?",
        english: "Who has this phone now?",
      },
    ],
  },
  /* The groom's brother, sending the photographer a clip for the film. */
  {
    id: "kunal",
    app: "whatsapp",
    name: "Kunal",
    messages: [
      {
        id: "k-1",
        from: "them",
        at: "16:18",
        day: "20/11",
        text: "Bhai reel mein Papa wali le aaunga. Asli feel aayegi 🔥",
        english: "Bro, I'll bring Papa's one for the reel. It'll feel real.",
        evidence: "kunal-papa",
      },
      { id: "k-2", from: "owner", at: "16:21", day: "20/11", text: "😂 done. back lawn, 12:15" },
      {
        id: "k-3",
        from: "them",
        at: "23:58",
        day: "22/11",
        text: "bhai ye bhi daal dena film mein 🔥🔥",
        evidence: "kunal-clip",
        english: "Bro, put this in the film too.",
        attachment: {
          kind: "video",
          label: "Dance floor, 11:52 PM",
          seconds: 14,
          captions: [
            { at: 1, line: "[dhol]" },
            { at: 5, line: "[two shots, close]" },
            { at: 7, line: "[cheering]" },
            { at: 10, who: "Kunal", line: "Oye hoye!" },
          ],
        },
      },
    ],
  },
  /* Bhasin's group. He turned on disappearing messages the moment he made it,
     as a man who used to be police would: by Monday the night was gone from
     every phone in it. What survives is what Sameer screenshotted on Sunday
     morning (Photos, below), which is why "For M" sends M there. */
  {
    id: "security",
    app: "whatsapp",
    name: "Banyan — Security",
    group: true,
    sub: "Bhasin, Kunal, Pappu, Ramesh, You",
    messages: [
      { id: "s-0", from: "system", at: "00:36", day: "Sunday", text: "Vinod Bhasin created group “Banyan — Security”" },
      {
        id: "s-dm",
        from: "system",
        at: "00:36",
        day: "Sunday",
        text: "Vinod Bhasin turned on disappearing messages. New messages will disappear from this chat 24 hours after they're sent.",
      },
    ],
  },
  {
    id: "sethi",
    app: "whatsapp",
    name: "Sethi Caterers",
    messages: [
      {
        id: "se-1",
        from: "them",
        at: "09:05",
        day: "Monday",
        text: "Sameer ji, Chhotu Saturday ke baad se nahi aaya. Aapke saath tha na light pakadne?",
        english: "Sameer ji, Chhotu hasn't come in since Saturday. He was with you, holding the light, wasn't he?",
        evidence: "sethi-chhotu",
      },
      {
        id: "se-2",
        from: "them",
        at: "10:12",
        day: "Monday",
        text: "Chhotu ka hisaab Bhasin sir ne kar diya. List se naam hata diya. Aap bhi kuch mat bolna.",
        english: "Bhasin sir has settled Chhotu's account. His name is off the list. Don't you say anything either.",
        evidence: "sethi-list",
      },
    ],
  },
  {
    id: "bhasin",
    app: "whatsapp",
    name: "Bhasin Uncle",
    messages: [
      {
        id: "b-1",
        from: "them",
        at: "09:10",
        day: "Sunday",
        text: "Balance aaj aa jayega. Tab tak kisi se baat nahi. Nitin se bhi nahi.",
        english: "The balance will come today. Until then, you talk to no one. Not even Nitin.",
        evidence: "bhasin-balance",
      },
    ],
  },
  /* Locked on Thursday at 11:08 PM, with "Hide locked chats" on: the boy's
     own chat, which ends on a promise Sameer made at 1:08 AM. He couldn't
     delete Dilip's last words, and couldn't leave them where M would start
     (CHAPTER1.md E). The secret code is `chatLock` in story.ts. */
  {
    id: "chhotu",
    app: "whatsapp",
    name: "Chhotu",
    locked: true,
    messages: [
      {
        id: "d-1",
        from: "them",
        at: "17:20",
        day: "18/11",
        text: "Bhaiya Saturday ko main aaunga na light ke liye? Sethi sir se baat kar li hai",
        english: "Bhaiya, I'm coming on Saturday for the light, right? I've talked to Sethi sir.",
      },
      { id: "d-2", from: "owner", at: "17:31", day: "18/11", text: "haan. waistcoat mein hi aa jaana, tere candid bhi lenge 😄", english: "Yes. Come in the waistcoat, I'll take some candids of you too." },
      { id: "d-3", from: "them", at: "19:10", day: "22/11", text: "Bhaiya Mumbai wali baat pakki na? 🙏", english: "Bhaiya, the Mumbai thing is for sure, right?", evidence: "promise" },
      { id: "d-4", from: "owner", at: "19:12", day: "22/11", text: "pakki. shaadi ke baad baat karte hain. aaj light tu pakdega", english: "For sure. We'll talk after the wedding. Tonight you're holding the light." },
      { id: "d-5", from: "them", at: "01:07", day: "Sunday", text: "Bhaiya dard ho raha hai. Aap aa rahe ho na?", english: "Bhaiya, it hurts. You're coming, aren't you?", evidence: "chhotu-107" },
      { id: "d-6", from: "owner", at: "01:08", day: "Sunday", text: "aa raha hoon. hospital le jayenge. bas thodi der", english: "I'm coming. We'll take you to hospital. Just a little longer." },
    ],
  },
  /* Locked with Dilip's at 11:10 PM, after his 1:52 message was deleted "for
     me": nothing marks the hole, and Nitin's 1:53 answers a message that
     isn't there (CHAPTER1.md C3). */
  {
    id: "nitin",
    app: "whatsapp",
    name: "Nitin",
    locked: true,
    messages: [
      { id: "n-1", from: "owner", at: "22:40", day: "21/11", text: "kal 5 baje van. batteries sab charge kar lena. B cam tu", english: "Van at 5 tomorrow. Charge all the batteries. You're on B cam." },
      { id: "n-2", from: "them", at: "22:41", day: "21/11", text: "done bhai 👍" },
      { id: "n-3", from: "them", at: "00:58", day: "Sunday", text: "Bhai kya hua? andar se awaaz aayi. sab bhaag rahe hain", english: "Bro, what happened? There was a sound from inside. Everyone's running." },
      {
        id: "n-4",
        from: "them",
        at: "01:22",
        day: "Sunday",
        text: "maine Vicky ko bola hai, uski gaadi hai. 20 min. service gate pe laata hoon. Dilip ko wahan le aao",
        english: "I've told Vicky, he has a car. 20 minutes. I'll bring it to the service gate. Get Dilip there.",
        evidence: "nitin-car",
      },
      { id: "n-5", from: "them", at: "01:40", day: "Sunday", text: "Vicky 10 min. service gate — Mandi Road wala na?", english: "Vicky, 10 minutes. The service gate on Mandi Road, right?", evidence: "nitin-gate" },
      {
        id: "n-6",
        from: "them",
        at: "01:53",
        day: "Sunday",
        text: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bhej deta hoon",
        english: "OK bro. If they've taken him, I'll send Vicky back.",
        evidence: "nitin-reply",
      },
      { id: "n-7", from: "them", at: "02:04", day: "Sunday", text: "Vicky wapas aa gaya. bhai sab theek hai na?", english: "Vicky's back. Bro, everything's OK, right?", evidence: "nitin-back" },
      { id: "n-8", from: "them", at: "09:31", day: "Sunday", text: "bhai?" },
    ],
  },
  /* Messages is mostly the lender. */
  {
    id: "zipemi",
    app: "messages",
    name: "ZipEMI",
    messages: [
      { id: "z-1", from: "them", at: "09:00", day: "Friday", text: "Your EMI of Rs 14,200 for Sony A7 IV (loan ZE-88213) is overdue. Late fee applies after 3 days." },
    ],
  },
  /* His carrier, on the day's data: why nothing large will come down in
     Episode 1, and, once the phone is back on after midnight, why it can. */
  {
    id: "jio",
    app: "messages",
    name: "JIO",
    messages: [
      { id: "j-1", from: "them", at: "17:05", day: "Saturday", text: "50% of your daily data quota of 1.5 GB has been used." },
      {
        id: "j-2",
        from: "them",
        at: "21:14",
        day: "Saturday",
        text: "100% of your daily data quota of 1.5 GB has been used. Internet speed is now 64 Kbps. Stay connected with a data add-on in the MyJio app.",
      },
      {
        id: "j-3",
        from: "them",
        at: "00:33",
        day: "30/11",
        with: "data-renewed",
        requires: ["fired:data-renewed"],
        text: "Your daily data quota of 1.5 GB has been renewed. Enjoy high-speed internet.",
      },
    ],
  },
];

/** Bhasin's group as Sameer screenshotted it on Sunday morning, before it could disappear. */
const GROUP = { name: "Banyan — Security", sub: "Bhasin, Kunal, Pappu, Ramesh, You" } as const;

/**
 * Free-licence stand-ins (Pexels; ASSETS.md "Stock stand-ins"), for frames
 * with no character's face in them. The cast shoot replaces them.
 */
const STOCK: Readonly<Record<string, string>> = {
  "w-0": "/found/shagun/w-0.jpg",
  "w-1": "/found/shagun/w-1.jpg",
  "w-8": "/found/shagun/w-8.jpg",
  "w-11": "/found/shagun/w-11.jpg",
  "w-14": "/found/shagun/w-14.jpg",
};

/** A wedding photographer's night: most of it is just the wedding (ASSETS.md §1). */
const WEDDING: readonly [string, string][] = [
  ["16:40", "The mandap going up, marigold strings on ladders"],
  ["18:40", "Ishita's hands, mehendi, the groom's name hidden in it"],
  ["19:05", "The Sehgal cousins, matching sherwanis, one yawning"],
  ["19:20", "Rohan on the white mare, sehra over his face"],
  ["19:41", "Dhol players mid-jump at the gate"],
  ["19:58", "The varmala: Ishita lifted by her brothers"],
  ["20:25", "The couple on the stage, a queue of relatives with envelopes"],
  ["20:52", "A shagun envelope changing hands: Ishita weds Rohan, in gold"],
  ["21:15", "The buffet under fairy lights, steam off the tandoor"],
  ["21:31", "Waiters in maroon waistcoats, trays up, a line of them"],
  ["22:10", "Mrs Sehgal dancing with the bride's grandmother"],
  ["22:36", "The sangeet floor from the stage, phones in the air"],
  ["23:05", "Kunal and his friends on the floor, a bottle passed along"],
  ["23:20", "Nitin on B cam, gimbal up, grinning at the lens"],
  ["23:48", "Confetti cannons, the couple ducking"],
  ["00:05", "The mandap at midnight, empty chairs, the pandit's plate"],
];

export const photos: readonly Photo[] = [
  // The Sehgal wedding: a few of the 1,284, until the shoot (ASSETS.md §1).
  ...WEDDING.map(([at, title], i): Photo => ({
    id: `w-${i}`,
    album: "Sehgal wedding",
    at,
    day: at < "12:00" ? "Sunday" : "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title,
    src: STOCK[`w-${i}`],
  })),
  { id: "w-baraat", album: "Sehgal wedding", at: "19:34", day: "22/11", place: "Chhattarpur", kind: "scene", title: "The baraat at the gate, dhol and marigolds" },
  { id: "w-couple", album: "Sehgal wedding", at: "20:10", day: "22/11", place: "Chhattarpur", kind: "scene", title: "Ishita and Rohan under fairy lights" },
  { id: "w-family", album: "Sehgal wedding", at: "21:05", day: "22/11", place: "Chhattarpur", kind: "scene", title: "The Sehgals on the stage, Kunal at the end" },
  {
    id: "w-portrait",
    album: "Sehgal wedding",
    favorite: true,
    at: "21:48",
    day: "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title: "A waiter with a tray, smiling into the lens",
    camera: "iPhone 14 Pro — Back Camera",
    // His name badge, on the caterer's waistcoat: too small to read without leaning in.
    zoom: { at: { x: 34, y: 66 }, reveal: "CHHOTU", evidence: "badge" },
    evidence: "portrait",
  },
  { id: "w-dance", album: "Sehgal wedding", at: "23:40", day: "22/11", place: "Chhattarpur", kind: "scene", title: "The dance floor, phones in the air", src: "/found/shagun/w-dance.jpg" },
  { id: "w-pheras", album: "Sehgal wedding", at: "01:20", day: "Sunday", place: "Chhattarpur", kind: "scene", title: "Pheras, late, the fire in the middle", src: "/found/shagun/w-pheras.jpg" },
  /* Kunal's photo of the reel's setup: Sameer deleted the message, and WhatsApp
     had already saved the picture to Photos (CHAPTER1.md E). Like the reel
     take, only its thumbnail is on the phone: the rest is in iCloud, and
     comes down once the phone is back on power with data (Episode 2). */
  {
    id: "bts",
    album: "WhatsApp",
    at: "00:29",
    day: "Sunday",
    kind: "scene",
    title: "Back lawn, fairy lights in the trees: two figures, one holding something up",
    caption: "Saved from WhatsApp",
    inCloud: ["ep:2"],
    evidence: "bts",
  },
  /* A photographer's bin: what he culled from the wedding, and the reel take,
     deleted on Thursday at 10:48 PM with 28 days left. */
  {
    id: "w-blur",
    album: "Sehgal wedding",
    at: "20:12",
    day: "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title: "The varmala, out of focus",
    src: "/found/shagun/w-blur.jpg",
    deletedAt: "11:20",
    daysLeft: 25,
  },
  {
    id: "w-twice",
    album: "Sehgal wedding",
    at: "19:35",
    day: "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title: "The baraat at the gate, again, a horse's head in the way",
    deletedAt: "11:21",
    daysLeft: 25,
  },
  {
    id: "reel-take",
    at: "00:31",
    day: "Sunday",
    kind: "scene",
    title: "A tripod shot of the back lawn",
    src: "/found/shagun/reel-take.jpg",
    deletedAt: "22:48",
    daysLeft: 28,
    inCloud: ["ep:2"],
    video: {
      seconds: 14,
      captions: [
        { at: 1, who: "Kunal", line: "Rolling, bhai?" },
        { at: 3, who: "Sameer", line: "Haan. Light upar, Chhotu.", english: "Yes. Light up, Chhotu." },
        { at: 6, line: "[one shot, straight up]" },
        { at: 8, line: "[laughter]" },
        { at: 11, who: "Sameer", line: "Ek aur, pose mein—", english: "One more, posing—" },
        { at: 13, line: "[recording stops]" },
      ],
    },
    evidence: "reel-take",
  },
  /* The fire, 4:47 AM: trimmed to its last nine seconds on Thursday with
     Save Video as New Clip, and the new clip favourited. The whole of it went
     into his locked note ("Agar kuch hua", below). No body, ever. */
  {
    id: "fire",
    favorite: true,
    at: "04:47",
    day: "Sunday",
    kind: "scene",
    title: "A fire before dawn, smoke across the fairy lights",
    src: "/found/shagun/fire.jpg",
    video: {
      seconds: 9,
      captions: [
        { at: 1, line: "[crackle]" },
        { at: 3, line: "[wind, smoke]" },
        { at: 6, who: "A man, off camera", line: "Jaldi karo.", english: "Hurry up." },
      ],
    },
    evidence: "fire-clip",
  },
  /* Bhasin's group, screenshotted on the Sunday morning before it could
     disappear, which is what "For M" means by "Bhasin wala group". Like
     everything he took that week, only thumbnails are on the phone until
     it can reach iCloud (Episode 2). The first one, with his own name in the
     order, he deleted on Thursday: the only screenshot he did. */
  {
    id: "group-1",
    album: "Screenshots",
    at: "08:52",
    day: "Sunday",
    kind: "chat",
    title: "Screenshot: Banyan — Security",
    camera: "Screenshot",
    deletedAt: "22:47",
    daysLeft: 28,
    inCloud: ["ep:2"],
    chat: {
      ...GROUP,
      lines: [
        { system: true, at: "00:36", text: "Vinod Bhasin created group “Banyan — Security”" },
        { system: true, at: "00:36", text: "Vinod Bhasin turned on disappearing messages." },
        { who: "Bhasin", at: "00:36", text: "Sameer, gun Kunal ko do. Abhi.", english: "Sameer, give the gun to Kunal. Now.", evidence: "gun-to-kunal" },
      ],
    },
  },
  {
    id: "group-2",
    album: "Screenshots",
    at: "08:52",
    day: "Sunday",
    kind: "chat",
    title: "Screenshot: Banyan — Security",
    camera: "Screenshot",
    inCloud: ["ep:2"],
    chat: {
      ...GROUP,
      lines: [
        { who: "Bhasin", at: "00:38", text: "Koi 112 nahi karega. Ladke ko service room le jao. Main sambhaal raha hoon.", english: "Nobody calls 112. Take the boy to the service room. I'm handling it.", evidence: "no-112" },
        { who: "Bhasin", at: "00:52", text: "Doctor ka intezaam ho raha hai.", english: "A doctor is being arranged.", evidence: "doctor" },
        { who: "Pappu", at: "01:14", text: "Sir ladka hosh mein hai. Paani maang raha hai.", english: "Sir, the boy is conscious. He's asking for water.", evidence: "conscious" },
      ],
    },
  },
  {
    id: "group-3",
    album: "Screenshots",
    at: "08:53",
    day: "Sunday",
    kind: "chat",
    title: "Screenshot: Banyan — Security",
    camera: "Screenshot",
    inCloud: ["ep:2"],
    chat: {
      ...GROUP,
      lines: [
        { who: "Bhasin", at: "01:31", text: "Doctor aa raha hai. Sab shaant raho.", english: "The doctor's coming. Everyone stay calm." },
        { who: "Ramesh", at: "01:49", text: "Sir, Sameer sir service room mein hain ladke ke paas.", english: "Sir, Sameer sir is in the service room with the boy.", evidence: "sameer-room" },
        { who: "Pappu", at: "01:59", text: "Sir service gate pe ek Swift aayi hai, kisi ko lene.", english: "Sir, a Swift has come to the service gate, to pick someone up.", evidence: "swift" },
        { who: "Bhasin", at: "02:00", text: "Kaun? Pata karo.", english: "Who? Find out." },
      ],
    },
  },
  {
    id: "group-4",
    album: "Screenshots",
    at: "08:53",
    day: "Sunday",
    kind: "chat",
    title: "Screenshot: Banyan — Security",
    camera: "Screenshot",
    inCloud: ["ep:2"],
    chat: {
      ...GROUP,
      lines: [
        { who: "Pappu", at: "02:04", text: "Chali gayi sir. Driver bol raha tha cancel ho gaya.", english: "It's gone, sir. The driver said it was cancelled.", evidence: "left-empty" },
        { who: "Pappu", at: "02:41", text: "Sir ladka bol nahi raha.", english: "Sir, the boy isn't speaking.", evidence: "not-speaking" },
        { who: "Bhasin", at: "02:42", text: "Call karo mujhe.", english: "Call me." },
      ],
    },
  },
  /* What he hid, and then hid the album: the EMI he couldn't pay, twice.
     Settings › Show Hidden Album finds his shame, not the case (CHAPTER1.md E). */
  {
    id: "emi-1",
    hidden: true,
    at: "10:15",
    day: "Monday",
    kind: "scene",
    title: "Screenshot: ZipEMI, “EMI of Rs 14,200 due 25 Nov. Pay now to avoid a late fee.”",
    camera: "Screenshot",
  },
  {
    id: "emi-2",
    hidden: true,
    at: "23:47",
    day: "Tuesday",
    kind: "scene",
    title: "Screenshot: a loan app, “₹50,000 in 10 minutes. No documents.”",
    camera: "Screenshot",
  },
];

export const notes: readonly Note[] = [
  {
    id: "for-m",
    title: "For M",
    at: "23:20",
    day: "Thursday",
    edited: "Thursday 11:26 PM",
    body: ["1. Voice notes — M chat", "2. Favorites — video", "3. Bhasin wala group — screenshots", "4. Nitin —"],
    evidence: "for-m",
  },
  /* What he kept for himself, locked with a Notes password of its own
     (CHAPTER1.md E): the whole fire clip, from before he trimmed it, and the
     screenshot of Kunal's frame, moved out of Photos. The password is the
     minute he told Nitin Dilip had gone. Nothing on the phone says 1:52
     before Episode 3 opens on it, and the hint is his own. */
  {
    id: "insurance",
    title: "Agar kuch hua",
    at: "23:16",
    day: "Thursday",
    edited: "Thursday 11:16 PM",
    body: ["If they use theirs, I use mine."],
    locked: true,
    password: "0152",
    hint: "When I told N",
    knownAfter: ["ep:3"],
    attachments: [
      {
        id: "fire-whole",
        at: "04:47",
        day: "Sunday",
        kind: "scene",
        title: "A fire before dawn, smoke across the fairy lights",
    src: "/found/shagun/fire.jpg",
        video: {
          seconds: 31,
          captions: [
            { at: 1, line: "[footsteps on gravel]" },
            { at: 4, who: "Sameer", line: "Bhasin sir, yahan?", english: "Bhasin sir, here?" },
            { at: 9, line: "[a jerrycan, set down]" },
            { at: 15, line: "[breathing, close to the phone]" },
            { at: 23, line: "[crackle]" },
            { at: 26, line: "[wind, smoke]" },
            { at: 29, who: "A man, off camera", line: "Jaldi karo.", english: "Hurry up." },
          ],
        },
        evidence: "fire-original",
      },
      {
        id: "frame",
        at: "15:11",
        day: "Monday",
        kind: "scene",
        // Screenshotted with WhatsApp's chrome: Kunal's words are in the picture (ASSETS.md §1).
        title: "WhatsApp, Kunal: a video frame (an arm coming down, a flash, a boy behind a light) and “Humare paas bhi hai. Soch samajh ke.”",
        camera: "Screenshot",
        evidence: "frame",
      },
    ],
  },
  {
    id: "shot-list",
    title: "Sehgal — shot list",
    at: "23:02",
    day: "21/11",
    body: [
      "19:30 baraat — gate, drone off (venue said no)",
      "20:00 varmala — 2 angles",
      "21:45 staff candids — Chhotu portrait!!",
      "23:30 sangeet floor — Nitin on B cam",
      "12:15 — KS reel. back lawn, mango trees. Dilip — light. Nitin — van/batteries.",
      "01:00 pheras",
    ],
    evidence: "shot-list",
  },
  {
    id: "flats",
    title: "Mumbai flats",
    at: "14:10",
    day: "Tuesday",
    body: ["Andheri W 1RK — 22k, deposit 35k ✔", "Versova — 28k, too much", "Join Rangmanch Mon 1 Dec"],
  },
];

export const mail: readonly Mail[] = [
  {
    id: "invoice",
    from: "SK Films",
    address: "sameer@skfilms.example",
    subject: "Invoice SK-1127 — Sehgal wedding coverage",
    at: "10:30",
    day: "03/11",
    body: ["Please find the invoice attached. Advance received with thanks.", "Sameer Khurana, SK Films"],
    attachment: {
      name: "SK-1127.pdf",
      pages: [
        "SK FILMS · Sameer Khurana\nWedding films & photographs · South Delhi\n\nInvoice SK-1127 · 3 Nov\nTo: Sehgal Enterprises\n\nSehgal wedding, 22 Nov, Banyan Farms, Chhattarpur\nPhotography + film, 2 cameras + drone\n\nTotal ₹2,60,000\nAdvance received ₹80,000\nBalance due on delivery ₹1,80,000",
      ],
    },
    evidence: "invoice",
  },
  {
    id: "offer",
    from: "Rangmanch Productions",
    address: "hr@rangmanch.example",
    subject: "Offer: Second Unit DOP",
    at: "18:02",
    day: "Monday",
    body: [
      "Dear Sameer, we're happy to offer you the role of Second Unit DOP, joining Monday 1 December at our Andheri office.",
      "Please bring your ID and bank details on the first day.",
    ],
    evidence: "offer",
  },
  {
    id: "ticket",
    from: "RailBook",
    address: "tickets@railbook.example",
    subject: "E-ticket: New Delhi → Mumbai Central, Sun 30 Nov",
    at: "21:14",
    day: "Tuesday",
    body: ["PNR 482 •••• 17 · Train 12952 · Sun 30 Nov, 16:55 · 3A · 1 passenger: Sameer Khurana"],
  },
  {
    id: "site-plan",
    from: "Aanya · Wedding Planner",
    address: "aanya@celebrate.example",
    subject: "Banyan Farms site plan for your shot list",
    at: "12:40",
    day: "19/11",
    body: ["Sharing the site plan so your team knows the service lanes. Please keep drones off the back plot."],
    attachment: {
      name: "Banyan-Farms-plan.pdf",
      pages: [
        "BANYAN FARMS · CHHATTARPUR · SITE PLAN\n\nMain gate — driveway — dance-floor lawn\nStage and mandap — east\nBack lawn (mango trees) — behind the stage\nService room — beside the kitchen, 40 m from the service gate\nService gate — Mandi Road\nBack plot, old tube well — beyond the service lane (no guests)",
      ],
      evidence: "site-plan",
    },
  },
];

export const payments: readonly Payment[] = [
  { id: "p-balance", who: "SEHGAL ENTERPRISES", handle: "sehgalent@paytap", amount: 180000, note: "Final balance – wedding coverage", at: "11:04", day: "Sunday", evidence: "balance" },
  { id: "p-deposit", who: "Anjali Mehra", handle: "anjali.m@paytap", amount: -35000, note: "Deposit, Andheri 1RK", at: "14:22", day: "Tuesday", evidence: "deposit" },
  { id: "p-emi", who: "ZipEMI", amount: -14200, note: "EMI · Sony A7 IV", at: "09:00", day: "Friday", failed: true },
  { id: "p-nitin", who: "Nitin", handle: "nitin.cam@paytap", amount: -3000, note: "B cam day rate", at: "12:30", day: "Sunday" },
];

/* Voice Memos: what he rehearsed, and, in Recently Deleted, what he said to
   nobody on Monday afternoon and deleted on Thursday at 10:52 PM. */
export const memos: readonly Memo[] = [
  {
    id: "memo-rangmanch",
    title: "Rangmanch — interview",
    at: "11:05",
    day: "17/11",
    seconds: 16,
    lines: [
      { at: 1, who: "Sameer", line: "Main wedding films karta hoon, par mera frame cinema ka hai.", english: "I make wedding films, but my frame is cinema's." },
      { at: 7, who: "Sameer", line: "Nahi. Phir se. …Main shaadiyon mein kahaniyan dhoondhta hoon.", english: "No. Again. …I find stories at weddings." },
      { at: 13, line: "[a laugh]" },
    ],
  },
  {
    id: "memo-458",
    title: "New Recording 14",
    at: "16:58",
    day: "Monday",
    seconds: 14,
    lines: [
      { at: 1, line: "[a long breath]" },
      { at: 3, who: "Sameer", line: "Pehli camera ke liye thi.", english: "The first was for the camera." },
      { at: 7, who: "Sameer", line: "Doosri… main pose kar raha tha.", english: "The second… I was posing." },
      { at: 11, who: "Sameer", line: "Mujhe laga khaali hai.", english: "I thought it was empty." },
    ],
    deletedAt: "22:52",
    daysLeft: 28,
    evidence: "memo",
  },
  /* Thursday, 11:12 PM, straight after locking the two chats: he started to
     tell M the code, and didn't, the same way "For M" stops at "4. Nitin —".
     Deleted a minute later; the only other way to the code is Sameer. */
  {
    id: "memo-code",
    title: "New Recording 15",
    at: "23:12",
    day: "Thursday",
    seconds: 16,
    lines: [
      { at: 1, line: "[a breath]" },
      { at: 2, who: "Sameer", line: "M. Nitin aur Chhotu ki chat maine lock kar di hai.", english: "M. I've locked Nitin's and Chhotu's chats." },
      { at: 7, who: "Sameer", line: "Code hai… pakki.", english: "The code is… pakki." },
      { at: 10, line: "[a long pause]" },
      { at: 13, who: "Sameer", line: "Nahi. Rehne de.", english: "No. Leave it." },
    ],
    deletedAt: "23:13",
    daysLeft: 28,
  },
];

export const profiles: readonly Profile[] = [
  {
    handle: "skfilms.delhi",
    name: "Sameer Khurana",
    own: true,
    bio: "SK Films · weddings that feel like films\nDelhi → Mumbai, soon",
    posts: [
      { id: "i-1", title: "Pheras under fairy lights", caption: "Ishita & Rohan ✨", src: "/found/shagun/w-pheras.jpg" },
      { id: "i-2", title: "A selfie, camera up, a silver kada on his wrist", caption: "New gimbal day" },
      { id: "i-3", title: "A haldi, yellow everywhere" },
      { id: "i-4", title: "A bride laughing at a mirror" },
      { id: "i-5", title: "Sameer with his crew, arms round Nitin and a boy in a waistcoat", caption: "Team 🤍 @nitin.cam" },
      { id: "i-6", title: "A baraat from above" },
    ],
    evidence: "sk-films",
  },
];

export const calls: readonly CallEntry[] = [
  { id: "c-raju", name: RAJU, number: RAJU, kind: "missed", at: "23:38", day: "Saturday", count: 47 },
  { id: "c-mummy", name: "Mummy", kind: "missed", at: "22:50", day: "Saturday", count: 6 },
  { id: "c-bhasin-fri", name: "Bhasin Uncle", kind: "missed", at: "19:02", day: "Friday", count: 2 },
  { id: "c-bhasin-331", name: "Bhasin Uncle", kind: "in", at: "03:31", day: "Sunday", seconds: 252 },
  { id: "c-nitin", name: "Nitin", kind: "missed", at: "02:06", day: "Sunday", count: 3 },
];

/* Safari, which he never thought to tidy: he believed it showed a man trying to help. */
export const searches: readonly Search[] = [
  { id: "q-lock", text: "whatsapp chat lock hide chats secret code", at: "23:06", day: "Thursday" },
  { id: "q-1", text: "goli lagne pe kya karein", at: "00:44", day: "Sunday", evidence: "search-1244" },
  { id: "q-2", text: "gunshot hospital without police case delhi", at: "00:47", day: "Sunday" },
  { id: "q-3", text: "lifeline hospital mehrauli emergency number", at: "00:52", day: "Sunday" },
  { id: "q-4", text: "private ambulance chhattarpur 24 hours", at: "01:56", day: "Sunday", evidence: "search-156" },
  { id: "q-5", text: "goli lagne ke baad kitne ghante", at: "01:57", day: "Sunday" },
  { id: "q-6", text: "andheri west 1rk rent", at: "13:40", day: "Tuesday" },
];

export const settings: readonly SettingsGroup[] = [
  { rows: [{ title: "Sameer Khurana", sub: "Apple Account, iCloud and more", evidence: "apple-account" }] },
  {
    rows: [
      {
        title: "Face ID & Passcode",
        value: "Off",
        detail: {
          heading: "Face ID & Passcode",
          rows: [
            { label: "Passcode", value: "Off" },
            { label: "Turned off", value: "Thu 11:41 PM" },
            { label: "Use Face ID for iPhone Unlock", value: "Off" },
          ],
          footer: "Anyone who has this iPhone can open it.",
        },
        evidence: "passcode-off",
      },
      { title: "Battery Percentage", value: "On" },
      { title: "Low Power Mode", value: "On" },
      /* A photographer's phone is always full. What he offloaded is here too,
         and how to get it back. */
      {
        title: "iPhone Storage",
        value: "121 GB of 128 GB",
        detail: {
          heading: "iPhone Storage",
          rows: [
            { label: "Photos", value: "84.6 GB" },
            { label: "WhatsApp", value: "17.2 GB" },
            { label: "Instagram", value: "2.1 GB" },
            { label: "Voice Memos", value: "Offloaded" },
          ],
          footer: "Offloading an app removes it and keeps its documents and data. Tap its icon on the Home Screen to download it again.",
        },
      },
    ],
  },
  {
    label: "Apps",
    rows: [
      {
        title: "Photos",
        detail: {
          heading: "Photos",
          rows: [
            { label: "iCloud Photos", value: "On" },
            { label: "Optimise iPhone Storage", value: "On" },
            { label: "Show Hidden Album", toggle: { sets: ["did:show-hidden-album"] } },
          ],
          footer: "With Optimise iPhone Storage, full-resolution photos and videos stay in iCloud and download when they're opened. The Hidden album appears in Utilities once it's shown.",
        },
      },
    ],
  },
];
