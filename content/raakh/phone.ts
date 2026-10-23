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
    avatar: "/found/raakh/dp-meera.jpg",
    name: "M",
    pinned: true,
    sub: "last seen a long time ago",
    /* Who M is, as WhatsApp's contact info shows anyone: the number, and the
       line she wrote about herself. Found this way whatever brought the
       phone to the player (CHAPTER1.md O1). */
    contact: { number: "+91 98••• •1206", about: "Meera Arora · Advocate · Kalkaji, Delhi", evidence: "meera" },
    messages: [
      /* Before the block: what they were to each other, in her name for him
         and his for her. Read by anyone who scrolls up, which is how a
         player who claims to be M can be caught (episode2.ts). */
      { id: "m-a", from: "them", at: "23:10", day: "14/08", text: "Sammy, ghar pahunch ke message kar dena. Baarish bahut hai.", english: "Sammy, text me when you get home. It's pouring." },
      { id: "m-b", from: "owner", at: "23:52", day: "14/08", text: "pahunch gaya M 🙂", english: "Home, M." },
      { id: "m-c", from: "owner", at: "20:31", day: "02/09", text: "aaj client bola 'aapki films cinema jaisi hain' 😎", english: "A client said today, 'your films are like cinema'." },
      { id: "m-d", from: "them", at: "20:40", day: "02/09", text: "Sammy!! Bola tha na. Ek din Mumbai.", english: "Sammy!! Told you. Mumbai, one day." },
      { id: "m-e", from: "them", at: "01:14", day: "21/09", text: "Sameer, mujhe ab message mat karna. Main serious hoon.", english: "Sameer, don't message me any more. I mean it." },
      { id: "m-f", from: "owner", at: "01:15", day: "21/09", text: "M please. ek baar baat kar", english: "M, please. Talk to me once." },
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
    // Saturday's, which came after he'd sent the phone.
    unread: 1,
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
    unread: 1,
    messages: [
      {
        id: "r-1",
        from: "them",
        at: "13:12",
        day: "Monday",
        forwarded: true,
        attachment: {
          kind: "poster",
          src: "/found/raakh/poster-dilip.jpg",
          label: "LAPATA — Dilip Kumar Mahto, 19. Last seen Saturday 22 November, Delhi. Home: Samastipur, Bihar.",
          heading: "लापता",
          subheading: "LAPATA · MISSING",
          name: "Dilip Kumar Mahto",
          lines: ["Umar 19 saal · Age 19", "Aakhri baar dekha: Shanivaar, 22 November, Delhi", "Last seen: Saturday 22 November, Delhi", "Ghar: Samastipur, Bihar"],
          contact: "Sampark: Raju (bhai) · +91 62••• •4417",
        },
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
        text: "Bhaiya aap ho? Ya ye phone ab kisi aur ke paas hai?",
        english: "Bhaiya, is it you? Or does someone else have this phone now?",
      },
    ],
  },
  /* Kunal, his friend since college, whose sister's wedding he planned: sending a clip for the film. */
  {
    id: "kunal",
    app: "whatsapp",
    avatar: "/found/raakh/dp-kunal.jpg",
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
     as a man who retired from the police would: by Monday the night was gone from
     every phone in it. What survives is what Sameer screenshotted on Sunday
     morning (Photos, below), which is why "For M" sends M there. */
  {
    id: "security",
    app: "whatsapp",
    name: "Banyan — Security",
    group: true,
    sub: "Bhasin, Kunal, Pappu, Ramesh, You",
    messages: [
      { id: "s-0", from: "system", at: "00:36", day: "Sunday", text: "Bhasin Sehgal created group “Banyan — Security”" },
      {
        id: "s-dm",
        from: "system",
        at: "00:36",
        day: "Sunday",
        text: "Bhasin Sehgal turned on disappearing messages. New messages will disappear from this chat 24 hours after they're sent.",
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
        text: "Sameer ji, Dilip Saturday ke baad se nahi aaya. Us raat aapke crew ke saath tha na?",
        english: "Sameer ji, Dilip hasn't come in since Saturday. He was with your crew that night, wasn't he?",
        evidence: "sethi-dilip",
      },
      {
        id: "se-2",
        from: "them",
        at: "10:12",
        day: "Monday",
        text: "Dilip ka hisaab Bhasin sir ne kar diya. List se naam hata diya. Aap bhi kuch mat bolna.",
        english: "Bhasin sir has settled Dilip's account. His name is off the list. Don't you say anything either.",
        evidence: "sethi-list",
      },
    ],
  },
  {
    id: "bhasin",
    app: "whatsapp",
    avatar: "/found/raakh/dp-bhasin.jpg",
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
    id: "dilip",
    app: "whatsapp",
    avatar: "/found/raakh/dp-dilip.jpg",
    name: "Dilip",
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
      { id: "d-2a", from: "them", at: "17:33", day: "18/11", text: "Mumbai mein samundar roz dikhega? 😄", english: "Will I see the sea every day in Mumbai?" },
      { id: "d-2b", from: "owner", at: "17:34", day: "18/11", text: "roz. ab kaam kar 😄", english: "Every day. Now get to work." },
      { id: "d-3", from: "them", at: "19:10", day: "22/11", text: "Bhaiya Mumbai wali baat pakki na? 🙏", english: "Bhaiya, the Mumbai thing is for sure, right?", evidence: "promise" },
      { id: "d-4", from: "owner", at: "19:12", day: "22/11", text: "pakki. shaadi ke baad baat karte hain. aaj light tu pakdega", english: "For sure. We'll talk after the wedding. Tonight you're holding the light." },
      { id: "d-5", from: "them", at: "01:07", day: "Sunday", text: "Bhaiya dard ho raha hai. Aap aa rahe ho na?", english: "Bhaiya, it hurts. You're coming, aren't you?", evidence: "dilip-107" },
      { id: "d-6", from: "owner", at: "01:08", day: "Sunday", text: "aa raha hoon. hospital le jayenge. bas thodi der", english: "I'm coming. We'll take you to hospital. Just a little longer." },
    ],
  },
  /* Locked with Dilip's at 11:10 PM, after his 1:52 message was deleted "for
     me": nothing marks the hole, and Nitin's 1:53 answers a message that
     isn't there (CHAPTER1.md C3). */
  {
    id: "nitin",
    app: "whatsapp",
    avatar: "/found/raakh/dp-nitin.jpg",
    name: "Nitin",
    locked: true,
    messages: [
      { id: "n-1", from: "them", at: "22:31", day: "21/11", text: "bhai 102 bukhaar hai 🤒 kal nahi aa paunga. sorry yaar", english: "Bro, I've got a 102 fever. I can't come tomorrow. Sorry, man." },
      { id: "n-2", from: "owner", at: "22:40", day: "21/11", text: "rest kar. Dilip light sambhaal lega. edit tu hi karega 😄", english: "Rest. Dilip will handle the light. You're still doing the edit." },
      { id: "n-2a", from: "them", at: "22:41", day: "21/11", text: "done bhai 👍 reel ka footage raat ko hi bhej dena", english: "Done. Send me the reel footage tonight itself." },
      { id: "n-3", from: "them", at: "00:58", day: "Sunday", text: "Bhai Kunal ki story pe goli ki awaaz?? tum log theek ho?", english: "Bro, a gunshot on Kunal's story?? Are you all OK?" },
      {
        id: "n-4",
        from: "them",
        at: "01:22",
        day: "Sunday",
        text: "maine Vicky ko bola hai, uski gaadi hai. 20 min. service gate pe bhej raha hoon. Dilip ko wahan le aao",
        english: "I've told Vicky, he has a car. 20 minutes. I'm sending it to the service gate. Get Dilip there.",
        evidence: "nitin-car",
      },
      { id: "n-5", from: "them", at: "01:40", day: "Sunday", text: "Vicky 10 min. service gate — Mandi Road wala na?", english: "Vicky, 10 minutes. The service gate on Mandi Road, right?", evidence: "nitin-gate" },
      {
        id: "n-6",
        from: "them",
        at: "01:53",
        day: "Sunday",
        text: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon",
        english: "OK bro. If they've taken him, I'll call Vicky back.",
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
    unread: 2,
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
  "w-0": "/found/raakh/w-0.jpg",
  // Generated fictional people and places (2026-10-23, ASSETS.md "Raakh frames").
  "w-3": "/found/raakh/w-3.jpg",
  "w-4": "/found/raakh/w-4.jpg",
  "w-5": "/found/raakh/w-5.jpg",
  "w-9": "/found/raakh/w-9.jpg",
  "w-11": "/found/raakh/w-11.jpg",
  "w-8": "/found/raakh/w-8.jpg",
  // Generated fictional people (2026-10-17, ASSETS.md "Generated frames").
  "w-15": "/found/raakh/w-15.jpg",
};

/** A wedding planner's night on his own phone: most of it is just the wedding (ASSETS.md §1). */
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
  ["23:20", "The sangeet floor from the DJ booth, smoke and lasers"],
  ["23:48", "Confetti cannons, the couple ducking"],
  ["00:05", "The mandap at midnight, empty chairs, the pandit's plate"],
];

export const photos: readonly Photo[] = [
  /* The Sehgal wedding: a few of the 1,284, until the shoot (ASSETS.md §1).
     Only frames with a photograph are on the phone: a drawn card among real
     photographs reads as a storyboard (PLAYTEST-SHAGUN.md #94). */
  ...WEDDING.map(([at, title], i): Photo => ({
    id: `w-${i}`,
    album: "Sehgal wedding",
    at,
    day: at < "12:00" ? "Sunday" : "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title,
    src: STOCK[`w-${i}`],
  })).filter((p) => p.src),
  {
    id: "w-portrait",
    album: "Sehgal wedding",
    favorite: true,
    at: "21:48",
    day: "22/11",
    place: "Chhattarpur",
    kind: "scene", src: "/found/raakh/w-portrait.jpg",
    title: "A waiter with a tray, smiling into the lens",
    camera: "iPhone 14 Pro — Back Camera",
    // His name badge, on the caterer's waistcoat: too small to read without leaning in.
    zoom: { at: { x: 60, y: 68 }, reveal: "DILIP", evidence: "badge" },
    evidence: "portrait",
  },
  /* The polished frames (the couple, the family on stage, the pheras, the
     baraat) and Kunal's revolver at 12:24 are on Instagram now
     (instagram.ts): Photos keeps what he shot and didn't post. */
  /* Kunal's photo of the reel's setup: Sameer deleted the message, and WhatsApp
     had already saved the picture to Photos (CHAPTER1.md E). Like the reel
     take, only its thumbnail is on the phone: the rest is in iCloud, and
     comes down once the phone is back on power with data (Episode 2). */
  {
    id: "bts",
    album: "WhatsApp",
    at: "00:29",
    day: "Sunday",
    kind: "scene", src: "/found/raakh/bts.jpg",
    title: "Back lawn, fairy lights in the trees: Sameer with a revolver raised, grinning; beside him a boy in a maroon waistcoat holds up an LED panel",
    caption: "Saved from WhatsApp",
    inCloud: ["ep:2"],
    evidence: "bts",
  },
  /* A planner's bin: what he culled from the wedding, and the reel take,
     deleted on Thursday at 10:48 PM with 28 days left. */
  {
    id: "w-blur",
    album: "Sehgal wedding",
    at: "20:12",
    day: "22/11",
    place: "Chhattarpur",
    kind: "scene",
    title: "The varmala, out of focus",
    src: "/found/raakh/w-blur.jpg",
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
    src: "/found/raakh/w-twice.jpg",
    deletedAt: "11:21",
    daysLeft: 25,
  },
  {
    id: "reel-take",
    at: "00:31",
    day: "Sunday",
    kind: "scene",
    title: "A tripod shot of the back lawn",
    src: "/found/raakh/reel-take.jpg",
    deletedAt: "22:48",
    daysLeft: 28,
    inCloud: ["ep:2"],
    video: {
      seconds: 14,
      captions: [
        { at: 1, who: "Kunal", line: "Rolling, bhai?" },
        { at: 2, who: "Sameer", line: "Haan. Light upar, Dilip.", english: "Yes. Light up, Dilip." },
        { at: 4, who: "A boy, behind the light", line: "Bhaiya… Mumbai pakki na?", english: "Bhaiya… Mumbai's for sure, right?" },
        { at: 5, who: "Sameer", line: "Pakki. Ab hilna mat.", english: "For sure. Now don't move." },
        { at: 7, line: "[one shot, straight up]" },
        { at: 9, line: "[laughter]" },
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
    src: "/found/raakh/fire.jpg",
    video: {
      seconds: 9,
      captions: [
        { at: 1, line: "[crackle]" },
        { at: 3, line: "[wind, smoke]" },
        { at: 6, who: "A man, off camera", line: "Jaldi karo.", english: "Hurry up." },
      ],
    },
    // (game) T8: nine seconds of something longer. The rest is in his locked note.
    trimmed: true,
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
        { system: true, at: "00:36", text: "Bhasin Sehgal created group “Banyan — Security”" },
        { system: true, at: "00:36", text: "Bhasin Sehgal turned on disappearing messages." },
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
    kind: "chat",
    title: "Screenshot: ZipEMI, “EMI of Rs 14,200 due 25 Nov. Pay now to avoid a late fee.”",
    chat: { name: "ZipEMI", sub: "Text Message", lines: [{ at: "10:14", text: "EMI of Rs 14,200 for your Sony A7 IV is due on 25 Nov. Pay now to avoid a late fee of Rs 750." }] },
    camera: "Screenshot",
  },
  {
    id: "emi-2",
    hidden: true,
    at: "23:47",
    day: "Tuesday",
    kind: "chat",
    title: "Screenshot: a loan app, “₹50,000 in 10 minutes. No documents.”",
    chat: { name: "QuickRupee", sub: "Loan offer", lines: [{ at: "23:46", text: "Pre-approved: ₹50,000 in 10 minutes. No documents. Tap to claim." }] },
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
     screenshot of Kunal's frame, moved out of Photos. The password is his
     birthday, day then month, as he sets every password (Meera says so in
     Episode 3); his Apple Account in Settings shows it. Opened early, what's
     inside counts in Episode 3, where it belongs. */
  {
    id: "insurance",
    title: "Agar kuch hua",
    at: "23:16",
    day: "Thursday",
    edited: "Thursday 11:16 PM",
    body: ["If they use theirs, I use mine."],
    locked: true,
    password: "1403",
    hint: "birthday · ddmm",
    // His birthday is in Settings, at the top, from the first minute.
    knownAfter: ["saw:apple-account"],
    attachments: [
      {
        id: "fire-whole",
        at: "04:47",
        day: "Sunday",
        kind: "scene",
        title: "A fire before dawn, smoke across the fairy lights",
    src: "/found/raakh/fire.jpg",
        video: {
          seconds: 31,
          captions: [
            { at: 1, line: "[footsteps on gravel]" },
            { at: 4, who: "Sameer", line: "Bhasin sir, yahan?", english: "Bhasin sir, here?" },
            { at: 9, line: "[a hand in frame, a silver kada on the wrist, sets down a jerrycan]" },
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
        src: "/found/raakh/kunal-frame.jpg",
        caption: "Kunal · “Humare paas bhi hai. Soch samajh ke.” (We have it too. Think carefully.)",
        camera: "Screenshot",
        evidence: "frame",
      },
    ],
  },
  {
    id: "shot-list",
    title: "Sehgal — run sheet",
    at: "23:02",
    day: "21/11",
    body: [
      "19:30 baraat at the gate — dhol, phool, no drone (venue said no)",
      "20:00 varmala — stage lights check, 2 angles",
      "21:45 staff candids for the IG reel — Dilip portrait!!",
      "23:30 sangeet floor — bar shut till 11, Kunal's gang 🙄",
      "12:15 — SK reel w/ Kunal. back lawn, mango trees. D — light (N sick 🤒)",
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
    from: "SK Weddings",
    address: "sameer@skweddings.example",
    subject: "Invoice SK-1127 — Sehgal wedding, planning & film",
    at: "10:30",
    day: "03/11",
    body: ["Please find the invoice attached. Advance received with thanks.", "Sameer Khurrana, SK Weddings"],
    attachment: {
      name: "SK-1127.pdf",
      pages: [
        "SK WEDDINGS · Sameer Khurrana\nWedding planning & films · South Delhi\n\nInvoice SK-1127 · 3 Nov\nTo: Sehgal Enterprises\n\nSehgal wedding, 22 Nov, Banyan Farms, Chhattarpur\nPlanning & coordination, décor, and the wedding film\n\nTotal ₹3,60,000\nAdvance received ₹1,80,000\nBalance due on delivery ₹1,80,000",
      ],
    },
    evidence: "invoice",
  },
  {
    id: "offer",
    from: "Rangmanch Weddings",
    address: "hr@rangmanch.example",
    subject: "Offer: Senior Wedding Producer",
    at: "18:02",
    day: "Monday",
    body: [
      "Dear Sameer, we're happy to offer you the role of Senior Wedding Producer, joining Monday 1 December at our Andheri office.",
      "Please bring your ID, bank details and an updated portfolio reel on the first day.",
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
    body: ["PNR 482 •••• 17 · Train 12952 · Sun 30 Nov, 16:55 · 3A · 1 passenger: Sameer Khurrana"],
    evidence: "ticket",
  },
  {
    id: "site-plan",
    from: "Banyan Farms · Venue Manager",
    address: "events@banyanfarms.example",
    subject: "Banyan Farms site plan for your run sheet",
    at: "12:40",
    day: "19/11",
    body: ["Sharing the site plan so your team and the caterers know the service lanes. Please keep drones off the back plot."],
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
  { id: "p-nitin", who: "Nitin Kumar", handle: "nitin.edits@paytap", amount: -5000, note: "Edit advance · Sehgal film", at: "12:30", day: "Sunday" },
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
      { at: 1, who: "Sameer", line: "Main shaadiyan plan karta hoon, par mera har function ek film jaisa hota hai.", english: "I plan weddings, but every function I do plays like a film." },
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
     tell M the code, and gave her a riddle instead, the same way "For M"
     stops at "4. Nitin —". Deleted a minute later. What the boy asked every
     day is in the reel take, seconds before the shot (both Episode 2); the
     other ways to the code are Sameer and Raju. */
  {
    id: "memo-code",
    title: "New Recording 15",
    at: "23:12",
    day: "Thursday",
    seconds: 18,
    lines: [
      { at: 1, line: "[a breath]" },
      { at: 2, who: "Sameer", line: "M. Nitin aur Dilip ki chat maine lock kar di hai.", english: "M. I've locked Nitin's and Dilip's chats." },
      { at: 7, who: "Sameer", line: "Code woh hai… jo woh roz poochta tha. Aur jo maine usse kaha.", english: "The code is… what he asked me every day. And what I told him." },
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
    name: "Sameer Khurrana",
    own: true,
    bio: "SK Films · weddings that feel like films\nDelhi → Mumbai, soon",
    posts: [
      { id: "i-1", title: "Pheras under fairy lights", src: "/found/raakh/w-pheras.jpg", caption: "Ishita & Rohan ✨" },
      { id: "i-2", title: "A selfie, camera up, a silver kada on his wrist", src: "/found/raakh/ig-selfie.jpg", caption: "New gimbal day" },
      { id: "i-3", title: "A haldi, yellow everywhere", src: "/found/raakh/ig-haldi.jpg" },
      { id: "i-4", title: "A bride at her mirror", src: "/found/raakh/ig-mirror.jpg" },
      { id: "i-5", title: "Sameer with his crew, arms round Nitin and a boy in a waistcoat", src: "/found/raakh/ig-crew.jpg", caption: "Team 🤍 @nitin.cam" },
      { id: "i-6", title: "A farmhouse venue from above", src: "/found/raakh/ig-drone.jpg" },
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
  {
    id: "q-lock",
    text: "whatsapp chat lock hide chats secret code",
    at: "23:06",
    day: "Thursday",
    results: ["How to lock and hide chats · WhatsApp Help Center", "Set a secret code: locked chats leave your chat list", "Can't see a locked chat? Type the secret code into Search"],
    // Still open in a tab: he read it as he locked the two chats.
    page: {
      site: "faq.whatsapp.com",
      title: "How to lock and hide chats",
      lead: "Chat lock keeps your most private conversations behind a secret code.",
      steps: [
        "Locked chats move out of your Chats list into a Locked chats folder.",
        "Turn on Hide locked chats, and the folder disappears from your Chats list too. Nobody scrolling your chats will know it's there.",
        "To see hidden locked chats: open Chats, tap the Search bar at the top, and type your secret code. The Locked chats folder appears.",
        "Your secret code is a word you choose. Pick something you won't forget.",
      ],
      note: "Was this helpful?  Yes · No",
    },
  },
  {
    id: "q-1",
    text: "goli lagne pe kya karein",
    at: "00:44",
    day: "Sunday",
    evidence: "search-1244",
    results: ["Gunshot wound first aid: press hard on the wound and call 112", "Goli lagne par prathamik upchaar: ghaav ko dabaye rakhein", "Don't move the person more than you must. Get them to a hospital"],
  },
  {
    id: "q-2",
    text: "gunshot hospital without police case delhi",
    at: "00:47",
    day: "Sunday",
    // What he read at 12:47, and the end card's fact: he could have known.
    results: [
      "Can a hospital refuse an injured person without a police case? No: treatment comes first",
      "Supreme Court, 1989: every doctor must treat to save a life; formalities can wait",
      "Medico-legal cases in Delhi: the hospital informs the police, after treating",
    ],
  },
  {
    id: "q-3",
    text: "lifeline hospital mehrauli emergency number",
    at: "00:52",
    day: "Sunday",
    results: ["Lifeline Hospital, Mehrauli · Emergency, 24 hours", "4.2 km from Chhattarpur · about 12 minutes at night", "Emergency department: walk in, no appointment"],
  },
  {
    id: "q-4",
    text: "private ambulance chhattarpur 24 hours",
    at: "01:56",
    day: "Sunday",
    evidence: "search-156",
    results: ["24-hour private ambulance, South Delhi: at your door in 15–20 minutes", "Ambulance near Chhattarpur, call now", "Or dial 112 for a government ambulance"],
  },
  { id: "q-6", text: "andheri west 1rk rent", at: "13:40", day: "Tuesday", results: ["1RK flats for rent in Andheri West from ₹20,000", "Andheri West 1RK, 22k, near the metro, deposit 35k"] },
];

export const settings: readonly SettingsGroup[] = [
  {
    rows: [
      {
        title: "Sameer Khurrana",
        sub: "Apple Account, iCloud and more",
        /* What Apple keeps about him, one tap down. His birthday is the
           password he uses for everything (the locked note's hint says
           "birthday · ddmm"). */
        detail: {
          heading: "Personal Information",
          rows: [
            { label: "Name", value: "Sameer Khurrana" },
            { label: "Date of Birth", value: "14 March 1998" },
            { label: "Apple Account", value: "sameer@skweddings.example" },
            { label: "Phone", value: "+91 98••• •3307" },
          ],
          footer: "Your Apple Account name and birthday are used across Apple services.",
        },
        evidence: "apple-account",
      },
    ],
  },
  {
    rows: [
      {
        title: "Face ID & Passcode",
        value: "Off",
        detail: {
          heading: "Face ID & Passcode",
          rows: [
            { label: "Passcode", value: "Off" },
            { label: "Use Face ID for iPhone Unlock", value: "Off" },
          ],
          footer: "Anyone who has this iPhone can open it.",
        },
        evidence: "passcode-off",
      },
      { title: "Battery Percentage", value: "On" },
      { title: "Low Power Mode", value: "On" },
      /* A planner's phone is always full. What he offloaded is here too,
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
