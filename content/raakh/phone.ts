import type {
  CallEntry,
  Mail,
  Memo,
  Note,
  Payment,
  Photo,
  Search,
  SettingsGroup,
  Thread,
} from "../types";

/* ===========================================================================
   Sameer's phone, as he left it on Thursday night (RAAKH-V3 §4, "The edit")
   and as it came back to his door on Saturday.

   Everything here is on the phone from the first minute. What he tucked
   away is here too, behind a door the night opens (RAAKH-V3 §7.8, the
   Episode 1 table): the shared album, the screenshots and the bin's videos
   are still in iCloud on the day's spent data; Voice Memos is offloaded;
   Dilip's and Nitin's chats are locked and hidden behind "pakki"; the locked
   note hasn't finished downloading. Evidence counts the moment it's seen
   (§2, rule 6); the doors are what the episodes are made of.

   Days (RAAKH-V3 §1): the wedding was Saturday 21/11, and the player's
   night is Saturday 28/11 into Sunday 29/11. A weekday name means that day
   of the week that ends on Saturday 28th, so "Sunday" is 22/11, the morning
   after the shot. Times are 24-hour "HH:MM"; the phone writes them its way.
   =========================================================================== */

/** Raju's number, unsaved. Masked, so no real person's number is ever on screen. */
export const RAJU = "+91 62••• •4417";

/** His Apple Account's address: the sender's address on the waybill (IC1). */
export const HOME = "B-14 Navjeevan Apartments, Malviya Nagar, New Delhi 110017";

export const threads: readonly Thread[] = [
  /* The pinned chat: four voice notes to someone who blocked him, each with
     one grey tick (E04–E07). What he wanted read first. */
  {
    id: "m",
    app: "whatsapp",
    avatar: "/found/raakh/dp-meera.jpg",
    name: "M",
    pinned: true,
    sub: "last seen a long time ago",
    subLater: { after: ["did:meera-contact"], sub: "online" },
    // Who M is, as WhatsApp's contact info shows anyone: the number, and the line she wrote.
    contact: { number: "+91 98••• •1206", about: "Meera Arora · Advocate · Saket District Courts", evidence: "meera" },
    messages: [
      { id: "m-a", from: "them", at: "23:10", day: "14/08", text: "Sammy, ghar pahunch ke message kar dena. Baarish bahut hai.", english: "Sammy, text me when you get home. It's pouring." },
      { id: "m-b", from: "owner", at: "23:52", day: "14/08", text: "pahunch gaya M 🙂", english: "Home, M." },
      { id: "m-c", from: "owner", at: "20:31", day: "02/09", text: "aaj client bola 'aapki films cinema jaisi hain' 😎", english: "A client said today, 'your films are like cinema'." },
      { id: "m-d", from: "them", at: "20:40", day: "02/09", text: "Sammy!! Bola tha na. Ek din Mumbai.", english: "Sammy!! Told you. Mumbai, one day." },
      // Monday 21 September, 1:14 AM: she ends it, and blocks him.
      { id: "m-e", from: "them", at: "01:14", day: "21/09", text: "Sameer, mujhe ab message mat karna.", english: "Sameer, don't message me any more." },
      { id: "m-f", from: "owner", at: "01:15", day: "21/09", ticks: "sent", text: "M please. ek baar baat kar", english: "M, please. Talk to me once." },
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
          english: "They didn't take him to hospital. Bhasin let no one go.",
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
          english: "They burned him, M. I was there. I saw.",
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
          english: "If something happens to me… it's all on the phone.",
        },
        evidence: "vn-phone",
      },
    ],
  },
  /* His mother: Bhasin's gift of a phone with "the location thing" on, the
     knee bill he paid, his visit on Tuesday (E27), and tonight. */
  {
    id: "mummy",
    app: "whatsapp",
    name: "Mummy",
    unread: 1,
    messages: [
      {
        id: "mu-a",
        from: "them",
        at: "18:20",
        day: "14/10",
        text: "Bhasin uncle ne naya phone dilaya. Location wala bhi on kar diya, bole tu dikhta rahega toh mujhe tension nahi hogi.",
        english: "Bhasin uncle got me a new phone. Switched the location thing on, said if you stay visible I won't worry.",
        evidence: "mummy-phone",
      },
      { id: "mu-b", from: "owner", at: "18:41", day: "14/10", text: "achha hai mummy 👍", english: "That's good, Mummy." },
      {
        id: "mu-c",
        from: "them",
        at: "12:05",
        day: "30/10",
        text: "Bhasin uncle ne ghutne ka bill de diya. Kitne achhe hain.",
        english: "Bhasin uncle paid the knee bill. So kind.",
        evidence: "mummy-bill",
      },
      { id: "mu-1", from: "them", at: "13:02", day: "Sunday", text: "Beta shaadi kaisi rahi? Photo bhejna 😊", english: "How was the wedding? Send photos." },
      { id: "mu-2", from: "owner", at: "15:40", day: "Sunday", text: "theek thi mummy. thak gaya hoon", english: "It was fine, Mummy. I'm tired." },
      {
        id: "mu-3",
        from: "them",
        at: "11:30",
        day: "Tuesday",
        text: "Bhasin uncle aaye the. Pooch rahe the tu Mumbai kab ja raha hai.",
        english: "Bhasin uncle came by. Asking when you leave for Mumbai.",
        evidence: "mummy-visit",
      },
      { id: "mu-4", from: "them", at: "20:15", day: "Thursday", text: "Mumbai ka ticket le liya? Rent ka kya socha?", english: "Did you get the Mumbai ticket? What about the rent?" },
      { id: "mu-5", from: "them", at: "22:52", day: "Saturday", text: "Beta, phone kyun nahi utha raha? Khana khaya?", english: "Why aren't you picking up? Have you eaten?" },
    ],
  },
  /* Unsaved: the number and the name its owner gave WhatsApp. Dilip's
     brother, who has never met or heard Sameer: Dilip gave him the number
     on 18 November. */
  {
    id: "raju",
    app: "whatsapp",
    name: RAJU,
    number: RAJU,
    sub: "~Raju Mahto",
    avatar: "/found/raakh/dp-raju.jpg",
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
          label: "LAPATA — Dilip Kumar Mahto, 19. Last seen Saturday 21 November, Banyan Farms, Chhattarpur. Home: Samastipur, Bihar.",
          heading: "लापता",
          subheading: "LAPATA · MISSING",
          name: "Dilip Kumar Mahto",
          lines: ["Umar 19 saal · Age 19", "Aakhri baar dekha: Shanivaar, 21 November", "Last seen: Banyan Farms, Chhattarpur", "Ghar: Samastipur, Bihar"],
          contact: "Sampark: Raju (bhai) · +91 62••• •4417",
        },
        evidence: "poster",
      },
      {
        id: "r-2",
        from: "them",
        at: "13:13",
        day: "Monday",
        text: "Aap Sameer bhaiya ho na? Dilip ne aapka number diya tha. Woh aapke saath kaam kar raha tha.",
        english: "You're Sameer bhaiya, right? Dilip gave me your number. He was working with you.",
      },
      { id: "r-3", from: "them", at: "19:40", day: "Wednesday", text: "Bhaiya ek baar baat kar lo 🙏", english: "Bhaiya, please talk to me once." },
      { id: "r-4", from: "them", at: "23:31", day: "Saturday", text: "Bhaiya, Dilip kahan hai? Bas itna bata do.", english: "Bhaiya, where is Dilip? Just tell me that." },
    ],
  },
  /* Kunal, his college junior, the bride's brother: the gun for the reel,
     and his own two shots on the dance floor (E16, E17). The frame he sent
     on Monday Sameer moved into his locked note, and deleted "for me" here. */
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
        day: "19/11",
        text: "Bhai reel mein Papa wali le aaunga. Asli feel aayegi 🔥",
        english: "I'll bring Dad's one for the reel. Real feel.",
        evidence: "kunal-papa",
      },
      { id: "k-2", from: "owner", at: "16:21", day: "19/11", text: "done. back lawn, 12:15" },
      {
        id: "k-3",
        from: "them",
        at: "23:58",
        day: "21/11",
        text: "bhai ye bhi daal dena film mein 🔥🔥",
        english: "Put this in the film too.",
        evidence: "kunal-clip",
        attachment: {
          kind: "video",
          label: "Dance floor, 11:52 PM",
          seconds: 14,
          film: "/found/raakh/clip-k-3.mp4",
          captions: [
            { at: 1, line: "[dhol]" },
            { at: 5, line: "[two shots into the air, close]" },
            { at: 7, line: "[cheering]" },
            { at: 10, who: "Kunal", line: "Oye hoye!" },
          ],
        },
      },
    ],
  },
  /* Bhasin's group, with disappearing messages on from its first minute: by
     Monday the night was gone from every phone in it. What survives is what
     Sameer screenshotted on Sunday morning (Photos), which is why "For M"
     sends M there. */
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
        id: "se-0",
        from: "them",
        at: "14:10",
        day: "21/11",
        text: "Sameer ji, Dilip ko aapke shoot ke liye 12 baje chhod dunga.",
        english: "Sameer ji, I'll send Dilip to your shoot at 12.",
        evidence: "sethi-shoot",
      },
      {
        id: "se-1",
        from: "them",
        at: "09:05",
        day: "Monday",
        text: "Sameer ji, Dilip Saturday ke baad se nahi aaya. Us raat aapke shoot pe tha na?",
        english: "Sameer ji, Dilip hasn't come in since Saturday. He was at your shoot that night, wasn't he?",
        evidence: "sethi-dilip",
      },
      {
        id: "se-2",
        from: "them",
        at: "10:12",
        day: "Monday",
        text: "Dilip ka hisaab Bhasin sir ne kar diya. List se naam hata diya.",
        english: "Bhasin sir settled Dilip's account. Took him off the list.",
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
        english: "The balance comes today. Till then, talk to nobody. Not even Nitin.",
        evidence: "bhasin-balance",
      },
    ],
  },
  /* Locked and hidden on Thursday with the code "pakki" (E36). The boy's own
     chat: the sea, his English, the promise, 1:07, and the Monday message
     somebody read on Tuesday at 3:12 AM. */
  {
    id: "dilip",
    app: "whatsapp",
    avatar: "/found/raakh/dp-dilip.jpg",
    name: "Dilip",
    sub: "last seen Tuesday at 3:12 AM",
    subLater: { after: ["fired:anita"], sub: "online" },
    locked: true,
    messages: [
      { id: "d-1", from: "them", at: "17:33", day: "17/11", text: "Bhaiya, Mumbai mein samundar roz dikhega? 😄", english: "Bhaiya, will I see the sea every day in Mumbai?", evidence: "dilip-sea" },
      { id: "d-1a", from: "owner", at: "17:34", day: "17/11", text: "Roz.", english: "Every day." },
      // His own voice, practising for the job he'd been promised.
      {
        id: "d-2c",
        from: "them",
        at: "21:02",
        day: "18/11",
        attachment: {
          kind: "voice",
          seconds: 11,
          transcript: "Bhaiya suno… “Sir, light is ready. Sir, battery full.” Theek bola na? Mumbai mein angrezi bolni padegi 😄",
          english: "Bhaiya, listen… “Sir, light is ready. Sir, battery full.” Did I say it right? I'll have to speak English in Mumbai.",
        },
      },
      /* Two minutes later, his introduction, on his front camera: the frame
         he wanted to be in (RAAKH-V3 §11, Room 6's coda). */
      {
        id: "d-2v",
        from: "them",
        at: "21:04",
        day: "18/11",
        attachment: {
          kind: "video",
          label: "Front camera: Dilip in his maroon waistcoat, grinning, in a corridor with a tube light",
          seconds: 9,
          src: "/found/raakh/dp-dilip.jpg",
          captions: [
            { at: 0.5, who: "Dilip", line: "Hello sir, my name is Dilip Kumar Mahto." },
            { at: 3.5, who: "Dilip", line: "I am from Samastipur." },
            { at: 5.5, who: "Dilip", line: "I can hold light, I can do anything." },
            { at: 8, line: "[he laughs]" },
          ],
        },
        evidence: "dilip-video",
      },
      { id: "d-2d", from: "owner", at: "21:06", day: "18/11", text: "ekdum first class. assistant sahab 😄", english: "First class. Mr Assistant." },
      { id: "d-3", from: "them", at: "19:10", day: "21/11", text: "Bhaiya Mumbai wali baat pakki na? 🙏", english: "The Mumbai thing is settled, right?", evidence: "promise" },
      { id: "d-4", from: "owner", at: "19:12", day: "21/11", text: "pakki. …aaj light tu pakdega", english: "Settled. Tonight you hold the light." },
      { id: "d-5", from: "them", at: "01:07", day: "Sunday", text: "Bhaiya dard ho raha hai. Aap aa rahe ho na?", english: "It hurts. You're coming, right?", evidence: "dilip-107" },
      { id: "d-6", from: "owner", at: "01:08", day: "Sunday", text: "aa raha hoon. hospital le jayenge.", english: "I'm coming. We'll take you to hospital." },
      // Blue ticks: read, by somebody, on Tuesday at 3:12 AM. A boy everyone says is dead.
      { id: "d-7", from: "owner", at: "01:10", day: "Monday", ticks: "read", text: "Dilip?", english: "Dilip?" },
      { id: "d-8", from: "owner", at: "01:10", day: "Monday", ticks: "read", text: "maaf kar de", english: "forgive me", evidence: "dilip-read" },
      { id: "d-8i", from: "system", at: "03:12", day: "Tuesday", text: "Read Tue 24 Nov, 3:12 AM" },
    ],
  },
  /* Locked with Dilip's (E37). His 1:52 message was deleted "for me", and
     nothing marks the hole: Nitin's 1:53 answers a message that isn't there. */
  {
    id: "nitin",
    app: "whatsapp",
    avatar: "/found/raakh/dp-nitin.jpg",
    name: "Nitin",
    locked: true,
    messages: [
      { id: "n-1", from: "them", at: "22:31", day: "20/11", text: "bhai 102 bukhaar hai 🤒 kal nahi aa paunga. sorry yaar", english: "102 fever. I can't come tomorrow. Sorry.", evidence: "nitin-sick" },
      { id: "n-2", from: "owner", at: "22:40", day: "20/11", text: "rest kar. Dilip light sambhaal lega.", english: "Rest. Dilip will handle the light." },
      { id: "n-3", from: "them", at: "00:58", day: "Sunday", text: "Kunal ki story pe goli ki awaaz?? tum log theek ho?", english: "A gunshot on Kunal's story?? Are you all okay?" },
      {
        id: "n-4",
        from: "them",
        at: "01:22",
        day: "Sunday",
        text: "Vicky ki Swift bhej raha hoon, 20 min. Dilip ko service gate pe le aao.",
        english: "Sending Vicky's Swift, 20 minutes. Bring Dilip to the service gate.",
        evidence: "nitin-car",
      },
      { id: "n-5", from: "them", at: "01:40", day: "Sunday", text: "Vicky 10 min. Service gate — Mandi Road wala na?", english: "Vicky, 10 minutes. The service gate on Mandi Road, right?", evidence: "nitin-gate" },
      {
        id: "n-6",
        from: "them",
        at: "01:53",
        day: "Sunday",
        text: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon.",
        english: "Okay. If they've taken him, I'll call Vicky back.",
        evidence: "nitin-reply",
      },
      { id: "n-7", from: "them", at: "02:04", day: "Sunday", text: "Vicky wapas aa gaya.", english: "Vicky's back.", evidence: "nitin-back" },
      { id: "n-8", from: "them", at: "09:31", day: "Sunday", text: "bhai?" },
    ],
  },
  /* Messages is mostly the lender, and his carrier: why nothing large comes
     down in Episode 1, and, after midnight, why it can. */
  {
    id: "zipemi",
    app: "messages",
    name: "ZipEMI",
    messages: [
      { id: "z-1", from: "them", at: "09:00", day: "Friday", text: "Your EMI of Rs 14,200 for Sony A7 IV (loan ZE-88213) is overdue. Late fee applies after 3 days." },
    ],
  },
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
        day: "29/11",
        with: "data-renewed",
        requires: ["fired:data-renewed"],
        text: "Your daily data quota of 1.5 GB has been renewed. Enjoy high-speed internet.",
      },
    ],
  },
];

/** Bhasin's group as Sameer screenshotted it on Sunday morning, before it could disappear. */
const GROUP = { name: "Banyan — Security", sub: "Bhasin, Kunal, Pappu, Ramesh, You" } as const;

/** What the day's data has to be back for before iCloud brings anything down (RAAKH-V3 §8.2). */
const SYNCED = ["fired:data-renewed"] as const;

/** Free-licence stand-ins and generated frames for the wedding itself (ASSETS.md). */
const STOCK: Readonly<Record<string, string>> = {
  "w-0": "/found/raakh/w-0.jpg",
  "w-3": "/found/raakh/w-3.jpg",
  "w-4": "/found/raakh/w-4.jpg",
  "w-5": "/found/raakh/w-5.jpg",
  "w-9": "/found/raakh/w-9.jpg",
  "w-11": "/found/raakh/w-11.jpg",
  "w-8": "/found/raakh/w-8.jpg",
  "w-15": "/found/raakh/w-15.jpg",
};

/** A wedding planner's night on his own phone: most of it is just the wedding. */
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
  ...WEDDING.map(([at, title], i): Photo => ({
    id: `w-${i}`,
    album: "Sehgal wedding",
    at,
    day: at < "12:00" ? "Sunday" : "21/11",
    place: "Chhattarpur",
    kind: "scene",
    title,
    src: STOCK[`w-${i}`],
  })).filter((p) => p.src),
  /* 9:48 PM, in Favorites: the boy with a tray. His badge says DILIP, too
     small to read without leaning in (E10). */
  {
    id: "w-portrait",
    album: "Sehgal wedding",
    favorite: true,
    at: "21:48",
    day: "21/11",
    place: "Chhattarpur",
    kind: "scene",
    src: "/found/raakh/w-portrait.jpg",
    title: "A catering boy in a maroon waistcoat with a tray, smiling into the lens",
    camera: "iPhone 14 Pro — Back Camera",
    zoom: { at: { x: 60, y: 68 }, reveal: "DILIP", evidence: "badge" },
    evidence: "portrait",
  },
  /* 12:29 AM, in the album Kunal shared: Sameer with the revolver raised, a
     silver kada on the hand that holds it, and Dilip on the light (E29, IC9).
     In iCloud until the day's data comes back. */
  {
    id: "bts",
    album: "Sehgal Shaadi · Shared",
    at: "00:29",
    day: "Sunday",
    place: "Banyan Farms",
    kind: "scene",
    src: "/found/raakh/bts.jpg",
    title: "Back lawn, fairy lights in the trees: Sameer, revolver raised, a silver kada on his wrist; beside him a boy in a maroon waistcoat holds up an LED panel",
    caption: "Shared Album · Added by Kunal",
    camera: "Kunal's iPhone",
    inCloud: SYNCED,
    evidence: "bts",
  },
  /* The bin: what he culled, and what he deleted on Thursday night between
     10:47 and 11:26 (RAAKH-V3 §4, the edit). */
  { id: "w-blur", album: "Sehgal wedding", at: "20:12", day: "21/11", place: "Chhattarpur", kind: "scene", title: "The varmala, out of focus", src: "/found/raakh/w-blur.jpg", deletedAt: "11:20", daysLeft: 25 },
  { id: "w-twice", album: "Sehgal wedding", at: "19:35", day: "21/11", place: "Chhattarpur", kind: "scene", title: "The baraat at the gate, again, a horse's head in the way", src: "/found/raakh/w-twice.jpg", deletedAt: "11:21", daysLeft: 25 },
  /* The reel take, 12:31 AM, on his tripod (E30): eighteen seconds, the
     second shot at the thirteenth. Deleted at 10:47 PM on Thursday. */
  {
    id: "reel-take",
    at: "00:31",
    day: "Sunday",
    place: "Banyan Farms",
    kind: "scene",
    title: "A tripod shot of the back lawn",
    src: "/found/raakh/reel-take.jpg",
    deletedAt: "22:47",
    daysLeft: 28,
    inCloud: SYNCED,
    video: {
      seconds: 18,
      film: "/found/raakh/clip-reel-take.mp4",
      captions: [
        { at: 0.5, who: "A boy, behind the light", line: "Bhaiya, light yahan theek hai?", english: "Bhaiya, is the light okay here?" },
        { at: 3.2, who: "The boy", line: "Bhaiya… Mumbai pakki na?", english: "Mumbai's settled, right?" },
        { at: 4.6, who: "Sameer", line: "Pakki. Ab hilna mat.", english: "Settled. Now don't move." },
        { at: 7, line: "[a shot, straight up; the sound clips]" },
        { at: 7.8, line: "[laughter]" },
        { at: 10, who: "Sameer", line: "Ek aur, pose mein—", english: "One more, posing—" },
        { at: 13, line: "[a second shot; the light tips out of frame]" },
        { at: 14, line: "[nobody speaks; a chair scrapes]" },
        { at: 15, who: "Sameer, very quietly", line: "Dilip?" },
        { at: 16.5, line: "[legs cross the frame toward the tripod]" },
      ],
    },
    evidence: "reel-take",
  },
  /* The fire, trimmed on Thursday to its first nine seconds (E28): the back
     plot before anything is lit, framed on the bundle. The whole of it went
     into his locked note. */
  {
    id: "fire",
    favorite: true,
    at: "04:47",
    day: "Sunday",
    place: "Banyan Farms",
    kind: "scene",
    title: "The back plot before dawn: a rolled mattress and a bundle of sheets on the ground",
    src: "/found/raakh/fire-trim.jpg",
    video: {
      seconds: 9,
      film: "/found/raakh/clip-fire.mp4",
      captions: [
        { at: 1, line: "[footsteps on gravel; something heavy set down]" },
        { at: 6, who: "A man, off camera", line: "Uske kapde bhi.", english: "His clothes too." },
        { at: 7.5, line: "[a bag and a shirt thrown on the pile]" },
      ],
    },
    trimmed: true,
    evidence: "fire-clip",
  },
  /* Bhasin's group, screenshotted at 8:52 on the Sunday morning before it
     could disappear (E33). The first, with his own name in the order, he
     deleted on Thursday: the only screenshot he did (E34). */
  {
    id: "group-1",
    album: "Screenshots",
    at: "08:52",
    day: "Sunday",
    kind: "chat",
    title: "Screenshot: Banyan — Security",
    camera: "Screenshot",
    deletedAt: "22:49",
    daysLeft: 28,
    inCloud: SYNCED,
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
    inCloud: SYNCED,
    chat: {
      ...GROUP,
      lines: [
        { who: "Bhasin", at: "00:38", text: "Koi 112 nahi karega. Ladke ko service room le jao.", english: "Nobody calls 112. Take the boy to the service room.", evidence: "no-112" },
        { who: "Bhasin", at: "00:52", text: "Doctor ka intezaam ho raha hai.", english: "A doctor's being arranged.", evidence: "doctor" },
        { who: "Pappu", at: "01:14", text: "Sir ladka hosh mein hai. Paani maang raha hai.", english: "Sir, the boy's conscious. Asking for water.", evidence: "conscious" },
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
    inCloud: SYNCED,
    chat: {
      ...GROUP,
      lines: [
        { who: "Bhasin", at: "01:31", text: "Doctor aa raha hai. Sab shaant raho.", english: "Doctor's coming. Everyone stay calm." },
        { who: "Ramesh", at: "01:49", text: "Sameer sir service room mein hain, ladke ke saath.", english: "Sameer sir is in the service room with the boy.", evidence: "sameer-room" },
        { who: "Pappu", at: "01:59", text: "Service gate pe ek Swift aayi hai.", english: "A Swift has come to the service gate.", evidence: "swift" },
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
    inCloud: SYNCED,
    chat: {
      ...GROUP,
      lines: [
        { who: "Pappu", at: "02:04", text: "Chali gayi sir. Driver bol raha tha cancel ho gaya.", english: "It left, sir. The driver said it was cancelled.", evidence: "left-empty" },
        { who: "Pappu", at: "02:41", text: "Sir ladka bol nahi raha.", english: "Sir, the boy isn't speaking.", evidence: "not-speaking" },
        { who: "Bhasin", at: "02:41", text: "Call karo mujhe.", english: "Call me." },
        { who: "Pappu", at: "02:55", text: "Sir gaadi nikal gayi.", english: "Sir, the car's left.", evidence: "car-255" },
        { who: "Bhasin", at: "02:55", text: "Baaki back plot pe.", english: "The rest to the back plot." },
      ],
    },
  },
  /* What he hid, and then hid the album: the EMI he couldn't pay. Settings ›
     Show Hidden Album finds his shame, not the case. */
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

/** The note he locked for himself: what it says once it opens (E46b). */
export const INSURANCE_TEXT = [
  "If they use theirs, I use mine.",
  "3:31 — B: “Body gadde mein lapet di hai. Tu bas aag laga. Dekhna mat.”",
  "Maine dekha nahi.",
] as const;

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
  /* "Agar kuch hua" (If something happens), locked with his birthday, day
     then month (Settings has it; Meera says so). It hasn't finished coming
     down from iCloud until the data renews in Episode 2. */
  {
    id: "insurance",
    title: "Agar kuch hua",
    at: "23:16",
    day: "Thursday",
    edited: "Thursday 11:16 PM",
    body: [INSURANCE_TEXT[0]],
    inside: INSURANCE_TEXT,
    locked: true,
    password: "1403",
    hint: "birthday · ddmm",
    knownAfter: ["saw:apple-account"],
    downloadsAfter: ["fired:data-renewed"],
    evidence: "note-text",
    attachments: [
      {
        id: "fire-whole",
        at: "04:47",
        day: "Sunday",
        kind: "scene",
        title: "The back plot before dawn: a jerrycan, a rolled mattress, then fire",
        src: "/found/raakh/jerrycan.jpg",
        video: {
          seconds: 31,
          film: "/found/raakh/clip-fire-whole.mp4",
          captions: [
            { at: 1, line: "[a hand with a silver kada sets down a jerrycan beside a rolled mattress and a bundle of sheets]" },
            { at: 6, who: "A man, off camera", line: "Uske kapde bhi.", english: "His clothes too." },
            { at: 7.5, line: "[a bag and a shirt thrown on the pile]" },
            { at: 9.5, line: "[pouring]" },
            { at: 11.5, line: "[a breath; the hand waits]" },
            { at: 13, line: "[a lighter catches]" },
            { at: 16, line: "[fire; the camera drifts, stays on the pile]" },
            { at: 24, line: "[the rolled mattress burns open and falls flat]" },
            { at: 27, line: "[it is empty: foam, springs, nothing else]" },
          ],
        },
        evidence: "fire-original",
      },
      {
        id: "frame",
        at: "15:11",
        day: "Monday",
        kind: "scene",
        title: "WhatsApp, Kunal: a frame from a second angle (Sameer's arm coming down, a flash, a boy behind a light) and “Humare paas bhi hai. Soch samajh ke.”",
        src: "/found/raakh/kunal-frame.jpg",
        caption: "Kunal · “Humare paas bhi hai. Soch samajh ke.” (We have one too. Think carefully.)",
        camera: "Screenshot",
        evidence: "frame",
      },
    ],
  },
  {
    id: "shot-list",
    title: "Sehgal — run sheet",
    at: "23:02",
    day: "20/11",
    body: [
      "19:30 baraat at the gate — dhol, phool, no drone (venue said no)",
      "20:00 varmala — stage lights check, 2 angles",
      "21:45 staff candids for the IG reel — Dilip portrait!!",
      "23:30 sangeet floor — bar shut till 11, Kunal's gang 🙄",
      "12:15 — SK reel w/ Kunal. back lawn. D — light (N sick)",
      "01:00 pheras",
    ],
    evidence: "shot-list",
  },
  {
    id: "flats",
    title: "Mumbai flats",
    at: "14:10",
    day: "Tuesday",
    body: ["Andheri W 1RK — 22k, deposit 35k ✔", "Versova — 28k, too much", "Rangmanch — join Mon 30 Nov", "Train Sun 4:55 ✔"],
  },
];

export const mail: readonly Mail[] = [
  {
    id: "invoice",
    from: "SK Weddings",
    address: "sameer@skweddings.example",
    subject: "Invoice SK-1127 — Sehgal wedding, planning & film",
    at: "10:30",
    day: "02/11",
    body: ["Please find the invoice attached. Advance received with thanks.", "Sameer Khurrana, SK Weddings"],
    attachment: {
      name: "SK-1127.pdf",
      pages: [
        "SK WEDDINGS · Sameer Khurrana\nWedding planning & films · South Delhi\n\nInvoice SK-1127 · 2 Nov 2026\nTo: Sehgal Enterprises\n\nSehgal wedding, 21 Nov, Banyan Farms, Chhattarpur\nPlanning & coordination, décor, and the wedding film\n\nTotal ₹3,60,000\nAdvance received ₹1,80,000\nBalance due on delivery ₹1,80,000",
      ],
    },
    evidence: "invoice",
  },
  /* Monday, 6:02 PM. The offer, and on page 2 who sent him (E20). */
  {
    id: "offer",
    from: "Rangmanch Weddings, Mumbai",
    address: "hr@rangmanch.example",
    subject: "Offer: Senior Wedding Producer",
    at: "18:02",
    day: "Monday",
    body: [
      "Dear Sameer, we're happy to offer you the role of Senior Wedding Producer, joining Monday 30 November at our Andheri office.",
      "Your offer letter is attached. Please bring your ID, bank details and an updated showreel on the first day.",
    ],
    attachment: {
      name: "Rangmanch-offer-Khurrana.pdf",
      pages: [
        "RANGMANCH WEDDINGS · MUMBAI\n\nOffer of employment\n\nSameer Khurrana\nSenior Wedding Producer\nJoining: Monday 30 November 2026, Andheri West\nCTC: ₹14,40,000 per annum\n\nWe look forward to stories that feel like cinema.",
        "Page 2 of 2\n\nTerms: probation 6 months · notice 30 days\n\nReferred by: Mr B. Sehgal, Sehgal Enterprises\n\nFor Rangmanch Weddings\nHR Department",
      ],
      evidence: "offer-p2",
    },
    evidence: "offer",
  },
  {
    id: "ticket",
    from: "RailBook",
    address: "tickets@railbook.example",
    subject: "E-ticket: New Delhi → Mumbai Central, Sun 29 Nov",
    at: "21:14",
    day: "Tuesday",
    body: ["PNR 482 •••• 17 · Train 12952 · Sun 29 Nov, 16:55 · Coach B3, berth 41 · 1 passenger: Sameer Khurrana"],
    evidence: "ticket",
  },
  {
    id: "site-plan",
    from: "Banyan Farms · Venue Manager",
    address: "events@banyanfarms.example",
    subject: "Banyan Farms site plan for your run sheet",
    at: "12:40",
    day: "18/11",
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
  { id: "p-balance", who: "SEHGAL ENTERPRISES", handle: "sehgalent@paytap", amount: 180000, note: "SK-1127 balance", at: "11:04", day: "Sunday", evidence: "balance" },
  { id: "p-nitin", who: "Nitin Kumar", handle: "nitin.edits@paytap", amount: -5000, note: "Edit advance · Sehgal film", at: "12:30", day: "Sunday", evidence: "nitin-pay" },
  { id: "p-deposit", who: "Anjali Mehra", handle: "anjali.m@paytap", amount: -35000, note: "Deposit, Andheri 1RK", at: "14:22", day: "Tuesday", evidence: "deposit" },
  { id: "p-emi", who: "ZipEMI", amount: -14200, note: "EMI · Sony A7 IV", at: "09:00", day: "Friday", failed: true },
];

/* Voice Memos, offloaded on Thursday night (E31, E32): what he rehearsed,
   and in Recently Deleted what he said to nobody on Monday, and the code
   he started to give M and didn't. */
export const memos: readonly Memo[] = [
  {
    id: "memo-rangmanch",
    title: "Rangmanch — pitch",
    at: "11:05",
    day: "16/11",
    seconds: 16,
    lines: [
      { at: 1, who: "Sameer", line: "Main shaadiyan plan karta hoon, par mera har function ek film jaisa hota hai.", english: "I plan weddings, but every function I do plays like a film." },
      { at: 7, who: "Sameer", line: "Nahi. Phir se. …Main shaadiyon mein kahaniyan dhoondhta hoon.", english: "No. Again. …I find stories in weddings." },
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
  {
    id: "memo-code",
    title: "New Recording 15",
    at: "23:12",
    day: "Thursday",
    seconds: 14,
    lines: [
      { at: 1, line: "[a breath]" },
      { at: 2, who: "Sameer", line: "M. Code woh hai… jo woh roz poochta tha.", english: "M. The code is… what he asked every day." },
      { at: 8, line: "[a long pause]" },
      { at: 11, who: "Sameer", line: "Nahi. Rehne de.", english: "No. Leave it." },
    ],
    deletedAt: "23:13",
    daysLeft: 28,
    evidence: "memo-code",
  },
];

export const calls: readonly CallEntry[] = [
  { id: "c-raju", name: RAJU, number: RAJU, kind: "missed", at: "23:38", day: "Saturday", count: 47 },
  { id: "c-mummy", name: "Mummy", kind: "missed", at: "22:50", day: "Saturday", count: 6 },
  { id: "c-bhasin-sat", name: "Bhasin Uncle", kind: "missed", at: "21:40", day: "Saturday", count: 2 },
  // Thursday, 11:24 PM: four minutes after "4. Nitin —". One ring, and he hung up; Nitin rang back.
  { id: "c-nitin-thu", name: "Nitin", kind: "out", at: "23:24", day: "Thursday", evidence: "call-thu" },
  { id: "c-nitin-thu-back", name: "Nitin", kind: "missed", at: "23:25", day: "Thursday" },
  { id: "c-bhasin-331", name: "Bhasin Uncle", kind: "in", at: "03:31", day: "Sunday", seconds: 252, evidence: "call-331" },
  { id: "c-nitin", name: "Nitin", kind: "missed", at: "02:06", day: "Sunday", count: 3, evidence: "call-206" },
  // He did call for help: Nitin, at home with a fever, at 1:15, for two minutes thirty-eight.
  { id: "c-nitin-115", name: "Nitin", kind: "out", at: "01:15", day: "Sunday", seconds: 158, evidence: "call-115" },
];

/* Safari (E35), which he never thought to tidy: the last tab he had open
   shows from the first minute; the history waits for the data. */
export const searches: readonly Search[] = [
  {
    id: "q-lock",
    text: "whatsapp chat lock hide chats secret code",
    at: "22:58",
    day: "Thursday",
    results: ["How to lock and hide chats · WhatsApp Help Center", "Set a secret code: locked chats leave your chat list", "Can't see a locked chat? Type the secret code into Search"],
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
    results: [
      "Can a hospital refuse an injured person without a police case? No: treatment comes first",
      "Supreme Court, 1989: every doctor must treat to save a life; formalities can wait",
      "Medico-legal cases in Delhi: the hospital informs the police, after treating",
    ],
  },
  {
    id: "q-3",
    text: "lifeline hospital mehrauli",
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
  /* Tuesday, 3:20 AM: eight minutes after somebody read "maaf kar de". */
  {
    id: "q-5",
    text: "whatsapp blue tick matlab kisi ne padh liya",
    at: "03:20",
    day: "Tuesday",
    evidence: "search-ticks",
    results: ["Two blue ticks mean your message has been read", "Blue tick: the recipient has opened the chat", "Can someone else read messages on a lost phone?"],
  },
  { id: "q-6", text: "andheri west 1rk rent", at: "13:40", day: "Tuesday", results: ["1RK flats for rent in Andheri West from ₹20,000", "Andheri West 1RK, 22k, near the metro, deposit 35k"] },
];

export const settings: readonly SettingsGroup[] = [
  {
    rows: [
      {
        title: "Sameer Khurrana",
        sub: "Apple Account, iCloud and more",
        /* What Apple keeps about him (E13): his birthday is the password he
           uses everywhere, and his address is the sender's on the waybill. */
        detail: {
          heading: "Personal Information",
          rows: [
            { label: "Name", value: "Sameer Khurrana" },
            { label: "Date of Birth", value: "14 March 1998" },
            { label: "Address", value: HOME },
            { label: "Apple Account", value: "sameer@skweddings.example" },
            { label: "Phone", value: "+91 98••• •3307" },
          ],
          footer: "Your Apple Account name, birthday and address are used across Apple services.",
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
      /* Find My (E15, IC2): where this iPhone is, and who sees it. Bhasin
         set it up on Mummy's new phone on 14 October. */
      {
        title: "Find My",
        value: "On",
        detail: {
          heading: "Find My",
          title: "This iPhone",
          rows: [
            { label: "Location", value: "Home · Malviya Nagar" },
            { label: "Find My iPhone", value: "On" },
            { label: "Share My Location", value: "On" },
            { label: "Sharing location with", value: "Mummy" },
          ],
          footer: "Family members you share location with can see this iPhone's location in Find My.",
        },
        evidence: "find-my",
      },
      { title: "Battery Percentage", value: "On" },
      { title: "Low Power Mode", value: "On" },
      {
        title: "iPhone Storage",
        value: "121 of 128 GB",
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
      {
        title: "Camera",
        detail: {
          heading: "Camera",
          rows: [{ label: "Low Power Mode", value: "Camera unavailable" }],
          footer: "Camera is unavailable in Low Power Mode on this device.",
        },
      },
    ],
  },
];
