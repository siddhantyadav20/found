import type { Story } from "@/content/found/types";

/* ===========================================================================
   The Blue Room — Episode 1: "The Job".

   The whole truth is in CHAPTER1.md, Part 2. What the player has at 4:17 AM
   on Saturday is Raghav Mehra's phone, five hours after the Malhotra house,
   and nothing else.

   So far: the opening (N1); WhatsApp, Telegram, contacts, Recents and
   Settings (N2); Photos, the walkthrough clips and the floor plan (N3). The
   questions land in N4.

   Dialogue is Hinglish in Roman script, as the script writes it, with the
   English beside anything spoken. Raghav is one person, not a dealt cast, so
   nothing here needs a cast token.
   =========================================================================== */

export const episode1: Story = {
  id: "blue-room",
  title: "The Blue Room",
  titles: ["The Job", "The Claim", "Who Hired Raghav?"],
  character: { gender: "boy", name: "Raghav" },
  names: { girl: [], boy: ["Raghav"] },
  surname: "Mehra",
  opensWith: "swipe",
  who: "Raghav Mehra, 19. Photographer. Nobody knows where he is.",

  clocks: {
    // Saturday morning, before it's light. Episodes 2 and 3 are the same night.
    1: { base: "04:17", day: "Saturday", cap: 45 },
    2: { base: "04:40", day: "Saturday", cap: 45 },
    3: { base: "05:20", day: "Saturday", cap: 60 },
  },

  home: {
    pages: [
      [
        { app: "telegram", label: "Telegram" },
        { app: "recorder", label: "Recorder" },
        { app: "files", label: "Files" },
        { app: "maps", label: "Maps" },
        { app: "settings", label: "Settings" },
      ],
    ],
    dock: [
      { app: "phone", label: "Phone" },
      { app: "whatsapp", label: "WhatsApp" },
      { app: "photos", label: "Photos" },
      { app: "notes", label: "Case file" },
    ],
  },

  envelope: {
    lines: [
      "4:17 AM. Something just came under your door.",
      "A padded envelope. No name on it. No return address.",
      "Inside, a phone. 5%.",
    ],
    cta: "Take it out",
    label: [],
    evidence: "envelope",
  },

  lockscreen: { notifications: [] },

  /* --- WhatsApp ----------------------------------------------------------------
     Raghav's life, and the night. Times are the phone's: 24-hour, "Fri 22:29".
     His outgoing lines are lowercase and quick; Maa writes in full sentences. */

  threads: [
    {
      id: "maa",
      app: "whatsapp",
      contact: "Maa ❤️",
      pinned: true,
      number: "+91 98921 •2207",
      lastSeen: "online",
      messages: [
        { from: "them", at: "Fri 18:02", text: "Friday ko late mat hona." },
        { from: "owner", at: "Fri 18:05", text: "Paise milenge toh late bhi chalega 😂" },
        { from: "them", at: "Fri 18:05", text: "Pehle ghar aa." },
        { from: "them", at: "Fri 23:58", text: "Kitna time lagega beta?" },
        { from: "them", at: "Sat 00:41", text: "Raghav?" },
        { from: "them", at: "Sat 01:15", text: "Phone kyun band hai" },
        { from: "them", at: "Sat 02:30", text: "Papa neeche gate pe khade hain. Bas ek message kar de." },
      ],
    },
    {
      id: "papa",
      app: "whatsapp",
      contact: "Papa",
      number: "+91 98922 •0318",
      lastSeen: "last seen today at 03:12",
      messages: [
        { from: "them", at: "Fri 14:05", text: "Fees ka form bhar diya?" },
        { from: "owner", at: "Fri 14:20", text: "haan papa. aur is baar thode paise main bhi de dunga" },
        { from: "them", at: "Fri 14:21", text: "Tu padhai kar. Paise ki fikar hum karenge." },
        { from: "owner", at: "Fri 14:21", text: "👍" },
      ],
    },
    {
      id: "rohan",
      app: "whatsapp",
      contact: "Rohan",
      number: "+91 99300 •8845",
      lastSeen: "online",
      messages: [
        { from: "them", at: "Fri 21:10", text: "Bhai 3k ke liye raat ko bungalow mein kya shoot kar raha hai?" },
        { from: "owner", at: "Fri 21:12", text: "Classified." },
        { from: "them", at: "Fri 21:12", text: "Pagal hai kya" },
        { from: "owner", at: "Fri 21:13", text: "Camera hai mere paas. Gun nahi." },
        {
          from: "owner",
          at: "Fri 22:29",
          text: "",
          evidence: "rohan-voice",
          attachment: {
            kind: "voice",
            seconds: 7,
            transcript: [
              { at: 0, text: "[a gate, traffic behind it]" },
              { at: 1, text: "“Client bolta hai, ten thirty sharp, don't be late.”", en: "The client says: ten thirty sharp, don't be late." },
              { at: 4, text: "“Teen hazaar ke liye bhi attitude dekh.”", en: "The attitude on him, for three thousand." },
            ],
          },
        },
        { from: "them", at: "Fri 22:31", text: "😂😂 bungalow ki photo bhej" },
        { from: "them", at: "Sat 01:02", text: "bhai pahunch gaya ghar?" },
        { from: "them", at: "Sat 03:40", text: "bhai reply kar" },
      ],
    },
    {
      id: "ishita",
      app: "whatsapp",
      contact: "Ishita",
      number: "+91 97029 •1172",
      lastSeen: "last seen Wednesday at 23:40",
      messages: [
        { from: "owner", at: "Mon 23:12", text: "saw your kasauli photos. the light in the third one was really good" },
        { from: "them", at: "Mon 23:40", text: "thanks raghav" },
        { from: "owner", at: "Wed 01:05", text: "you still have my 50mm btw. no rush" },
      ],
    },
    {
      id: "school",
      app: "whatsapp",
      contact: "Class of '24 🏏",
      group: true,
      messages: [
        { from: "them", sender: "Sahil", at: "Fri 20:30", text: "kal subah cricket? 7 baje" },
        { from: "owner", at: "Fri 20:34", text: "raat ko shoot hai. subah dekhte hain" },
        { from: "them", sender: "Kunal", at: "Fri 20:35", text: "raghav ka 'shoot' 🙄" },
        { from: "them", sender: "Sahil", at: "Sat 03:52", text: "raghav ki mummy ne call kiya. kisi ko pata hai woh kahan hai?" },
      ],
    },
    {
      // Unsaved. Prakash's own phone, not the one the house knows (CHAPTER1.md, Part 2).
      id: "unknown-2615",
      app: "whatsapp",
      contact: "+91 98191 •2615",
      number: "+91 98191 •2615",
      lastSeen: "last seen yesterday at 23:37",
      messages: [
        { from: "them", at: "Fri 23:19", text: "You missed something upstairs." },
        { from: "them", at: "Fri 23:19", text: "The blue room.", evidence: "blue-room-msg" },
        // What came after, which hadn't finished downloading when the phone was switched off.
        { from: "them", at: "Fri 23:20", text: "", pendingUntil: "ep:2", attachment: { kind: "document", file: "roster", name: "duty_roster_oct.xlsx", size: "48 KB" } },
        { from: "them", at: "Fri 23:21", text: "", forwarded: true, pendingUntil: "ep:2", photo: "kamat-screenshot" },
        { from: "them", at: "Fri 23:22", text: "", forwarded: true, pendingUntil: "ep:2", attachment: { kind: "document", file: "claim", name: "MALHOTRA_claim_draft.pdf", size: "2.1 MB" } },
        { from: "them", at: "Fri 23:23", text: "Isko maine andar nahi aane diya.", pendingUntil: "ep:2", attachment: { kind: "video", photo: "cctv-2312", seconds: 19 } },
      ],
    },
    {
      // Nobody the phone knows. The same number texts again at the end of Episode 2.
      id: "unknown-9081",
      app: "whatsapp",
      contact: "+91 98190 •9081",
      number: "+91 98190 •9081",
      notifyAs: "Unknown Number",
      lastSeen: "last seen recently",
      messages: [],
      requires: ["fired:e1-dont-call"],
    },

    /* --- Telegram ---------------------------------------------------------------
       The client. Everything before 22:02 was deleted from the chat; what the
       deletion couldn't reach is still in Photos (N3). */
    {
      id: "client",
      app: "telegram",
      contact: "AVM Property",
      username: "@AVM_Property",
      // "The client's profile picture is blank."
      noPhoto: true,
      number: "+91 97690 •7702",
      about: "",
      lastSeen: "last seen recently",
      pinned: true,
      infoEvidence: "client-number",
      messages: [
        { from: "system", at: "Fri 22:02", text: "Earlier messages in this chat were deleted by AVM Property.", evidence: "client-deleted" },
        { from: "them", at: "Fri 22:20", text: "10:30 sharp. Don't be late." },
        { from: "them", at: "Fri 22:20", text: "Share your live location when you reach. For security." },
        {
          from: "owner",
          at: "Fri 22:21",
          text: "",
          evidence: "live-location",
          attachment: { kind: "live-location", place: "Gulmohar Road, JVPD", until: "06:21", stops: "stop-live" },
        },
        { from: "owner", at: "Fri 22:30", text: "I'm here." },
        { from: "them", at: "Fri 22:30", text: "Guard will let you in." },
        { from: "owner", at: "Fri 22:33", text: "Who referred you to me?" },
        { from: "them", at: "Fri 22:34", text: "Just do the photos exactly as discussed." },
        { from: "owner", at: "Fri 22:35", text: "guard said kamat saab sent me. who is kamat?", evidence: "client-kamat" },
      ],
    },
    {
      id: "saved",
      app: "telegram",
      contact: "Saved Messages",
      messages: [
        { from: "owner", at: "Tue 00:14", text: "R50 mark II body: ₹78,999\n26 shoots at 3k\nor 1 wedding if mehta uncle calls back" },
        { from: "owner", at: "Thu 16:30", text: "fri night job. 3k. under an hour. DON'T tell maa it's at night" },
      ],
    },
  ],

  /* --- Phone ------------------------------------------------------------------- */

  contacts: [
    { id: "maa", name: "Maa ❤️", number: "+91 98921 •2207" },
    { id: "papa", name: "Papa", number: "+91 98922 •0318" },
    { id: "rohan", name: "Rohan", number: "+91 99300 •8845" },
    { id: "ishita", name: "Ishita", number: "+91 97029 •1172" },
    {
      // His old number. The SIM isn't in the phone any more (Settings).
      id: "raghav",
      name: "RAGHAV",
      number: "+91 70451 •3318",
      label: "SIM 2 · my other number",
      note: "old airtel. keep for gigs",
      evidence: "raghav-contact",
    },
    {
      id: "guard",
      name: "Guard (Malhotra)",
      number: "+91 97690 •7702",
      label: "Saved Fri 20:10",
      note: "juhu job. gate pe call karna",
      evidence: "guard-contact",
    },
  ],

  callLog: [
    { id: "c-raghav-in", who: "raghav", dir: "in", at: "Sat 04:19", duration: "0:14" },
    { id: "c-raghav-missed", who: "raghav", dir: "missed", at: "Sat 04:17", evidence: "raghav-called" },
    { id: "c-maa-3", who: "maa", dir: "missed", at: "Sat 03:31", count: 6 },
    { id: "c-maa-2", who: "maa", dir: "missed", at: "Sat 01:15", count: 3 },
    { id: "c-maa-1", who: "maa", dir: "missed", at: "Fri 23:58" },
    { id: "c-guard", who: "guard", dir: "out", at: "Fri 22:30", duration: "0:21" },
    { id: "c-rohan", who: "rohan", dir: "out", at: "Fri 22:12", duration: "2:40" },
    { id: "c-papa", who: "papa", dir: "in", at: "Fri 18:31", duration: "1:05" },
  ],

  cantCall: {
    from: "Jio",
    text: "Aapke account mein balance paryapt nahi hai. Kripya recharge karein.",
    en: "You don't have enough balance to make this call. Please recharge.",
  },

  /* --- Settings --------------------------------------------------------------- */

  settings: [
    {
      rows: [
        { title: "Face ID & Passcode", value: "Off", sub: "Passcode turned off Sat 03:58", evidence: "passcode-off" },
      ],
      footer: "Anyone who picks up this phone can open it.",
    },
    {
      title: "SIMs",
      rows: [
        { title: "Primary · Jio", value: "On", sub: "+91 93240 •5561" },
        { title: "Secondary · Airtel", value: "No SIM", sub: "RAGHAV · removed Sat 03:58", evidence: "sim2-removed" },
      ],
    },
    {
      title: "Connected camera",
      rows: [{ title: "EOS R50 · CamLink", value: "Not nearby", sub: "Sends every photo to this phone as it's taken" }],
    },
    {
      rows: [
        { title: "Low Power Mode", value: "On" },
        { title: "Location Services", value: "Off" },
      ],
    },
  ],

  calls: [
    {
      id: "opening",
      from: "RAGHAV",
      ends: "hangup-opening",
      lines: [
        { at: 0, text: "[nothing]" },
        { at: 3, text: "[breathing, close to the phone]" },
        { at: 9, text: "“Mujhe dhoondhna mat.”", en: "Don't look for me." },
      ],
    },
  ],

  events: [
    {
      id: "e1-dont-call",
      when: [],
      delay: 2400,
      thread: "unknown-9081",
      messages: [{ from: "them", at: "now", text: "If you found this phone, don't call him.", evidence: "dont-call" }],
    },
    {
      id: "e1-missed",
      when: ["fired:e1-dont-call"],
      delay: 3000,
      thread: null,
      messages: [],
      banner: "1 missed call",
      bannerFrom: "RAGHAV",
      bannerApp: "phone",
    },
    {
      // The phone rings. It rings until it's answered.
      id: "e1-ring",
      when: ["fired:e1-missed"],
      delay: 2600,
      thread: null,
      messages: [],
      effect: "ring",
    },
    {
      // Maa is awake too. Opening the phone doesn't make it quieter.
      id: "e1-maa-4am",
      when: ["did:call:opening", "did:unlock", "fired:e1-case-open"],
      delay: 9000,
      thread: "maa",
      messages: [{ from: "them", at: "now", text: "Raghav? 4 baj gaye beta." }],
    },
    {
      id: "e1-rohan-4am",
      when: ["fired:e1-maa-4am"],
      delay: 14000,
      thread: "rohan",
      messages: [{ from: "them", at: "now", text: "aunty ne mujhe call kiya. kahan hai tu" }],
    },
    {
      // The whole tutorial, as a notification: the case file says it exists.
      id: "e1-case-open",
      when: ["did:call:opening", "did:unlock"],
      delay: 1800,
      thread: null,
      messages: [],
      banner: "You started a note.",
      bannerApp: "notes",
    },
  ],

  stages: [
    { id: "e1-lock", episode: 1, when: [], battery: 5, screen: "lock" },
    // Swiped open before the call came: it still comes.
    { id: "e1-open-early", episode: 1, when: ["did:unlock"], battery: 5, screen: "phone" },
    { id: "e1-ringing", episode: 1, when: ["fired:e1-ring"], unless: ["did:call:opening"], battery: 5, screen: "call", call: "opening" },
    // A call answered on the lock screen goes back to the lock screen.
    { id: "e1-after-call", episode: 1, when: ["did:call:opening"], unless: ["did:unlock"], battery: 4, screen: "lock" },
    { id: "e1-phone", episode: 1, when: ["did:call:opening", "did:unlock"], battery: 4, screen: "phone" },
  ],

  actions: [
    { id: "unlock", sets: "did:unlock", requires: [] },
    // The one switch that matters: the client has been watching where this phone is.
    { id: "stop-live", sets: "did:stop-live", requires: ["did:unlock"], optional: true },
    { id: "hangup-opening", sets: "did:call:opening", requires: ["fired:e1-ring"] },
  ],

  evidence: [
    { id: "envelope", app: "envelope", label: "The envelope", detail: "Under your door at 4:17 AM. No name, no return address." },
    { id: "dont-call", app: "whatsapp", label: "“If you found this phone, don't call him.”", detail: "An unsaved number, a minute after the phone reached you.", requires: ["fired:e1-dont-call"] },
    { id: "raghav-called", app: "phone", label: "RAGHAV called at 04:17 and 04:19", detail: "A missed call, then the whisper: “Mujhe dhoondhna mat.” Don't look for me.", requires: ["did:call:opening"] },
    { id: "raghav-contact", app: "phone", label: "RAGHAV is this phone's other number", detail: "Saved as SIM 2, “my other number”. The owner of this phone called it." },
    { id: "sim2-removed", app: "settings", label: "SIM 2 removed at 03:58", detail: "The RAGHAV SIM came out of this phone twenty minutes before it reached you." },
    { id: "passcode-off", app: "settings", label: "Passcode turned off at 03:58", detail: "Someone made sure whoever found this phone could open it." },
    { id: "guard-contact", app: "phone", label: "Guard (Malhotra), saved Fri 20:10", detail: "“juhu job. gate pe call karna.” The number Raghav called when he reached the gate." },
    { id: "rohan-voice", app: "whatsapp", label: "Voice note to Rohan, 22:29", detail: "“Teen hazaar ke liye bhi attitude dekh.” Raghav, at the gate, laughing about the client." },
    { id: "client-deleted", app: "telegram", label: "The client deleted the brief", detail: "Everything before 22:02 in @AVM_Property's chat is gone." },
    { id: "client-kamat", app: "telegram", label: "“who is kamat?”", detail: "Raghav asked the client at 22:35 who Kamat was. Read. No reply." },
    { id: "client-number", app: "telegram", label: "@AVM_Property's number", detail: "+91 97690 •7702. The client's Telegram account runs on this number." },
    { id: "live-location", app: "telegram", label: "Live location, still sharing", detail: "Raghav shared his live location with the client at 22:21. For eight hours." },
    { id: "blue-room-msg", app: "whatsapp", label: "“The blue room.”", detail: "An unsaved number, 23:19: “You missed something upstairs.”" },
    { id: "sign", app: "photos", label: "MALHOTRA RESIDENCE, 22:28", detail: "The plate on the gate Raghav photographed when he arrived. Juhu, JVPD." },
    { id: "clip-kamat", app: "photos", label: "“Kamat saab ne bola hai…”", detail: "22:31. The guard says a contractor called Kamat sent Raghav. The client never mentioned one." },
    { id: "clip-cabinet", app: "photos", label: "A locked cabinet that's “empty”", detail: "22:44. “Khaali hai.” “Toh lock kyun hai?” The guard doesn't answer." },
    { id: "study", app: "photos", label: "The study at 22:47", detail: "A painting, a silver watch on the desk, a sculpture, a safe, and a whisky glass." },
    { id: "study-glass", app: "photos", label: "Someone else's drink, still cold", detail: "Zoomed in: the ice in the study's glass hadn't melted, and the prints on it aren't Raghav's.", requires: ["seen:study"] },
    { id: "clip-tuesday", app: "photos", label: "“Tuesday ko furniture le gayi”", detail: "22:52. The guard says Kamat's team took the furniture on Tuesday, for a renovation." },
    { id: "clip-wall", app: "photos", label: "“Painting yahan thi?” “Pata nahi.”", detail: "23:02, the master bedroom. “Aap photo lo, saab.”" },
    { id: "bedroom-wall", app: "photos", label: "The bedroom wall at 23:04", detail: "Empty. Four small marks where something heavy used to hang." },
    { id: "ref-painting", app: "photos", label: "The same wall at 20:00, with a painting", detail: "Saved from the client's deleted chat: the bedroom, photographed three hours earlier." },
    { id: "inventory-48", app: "photos", label: "Item 7: oil on canvas, ₹48,00,000", detail: "A page of the house's inventory, also saved from the client's chat." },
    { id: "plan-b2", app: "files", label: "B-2, on the floor plan", detail: "There's no blue room. Upstairs, one room has a code instead of a name." },
  ],
  locks: [],
  deductions: [],
  replies: [],
  headlines: [],

  /* --- Photos -------------------------------------------------------------------
     Three kinds: what the phone took itself (`recents`), what the camera sent
     it over CamLink as it shot (`camera`, the walkthrough clips too), and what
     Telegram saved from the client's chat before the chat was deleted. */

  photos: [
    {
      id: "gate",
      album: "recents",
      alt: "An iron gate, half open, wet from the rain. On the wall beside it, a brass plate.",
      liveText: "MALHOTRA RESIDENCE",
      takenAt: "Fri 22:28",
      place: "Gulmohar Road, JVPD",
      evidence: "sign",
    },
    {
      id: "clip-door",
      album: "camera",
      alt: "Video. A front door, and the guard holding it open: a man in his fifties in a grey uniform sweater.",
      takenAt: "Fri 22:31",
      place: "Malhotra Residence",
      evidence: "clip-kamat",
      video: {
        seconds: 24,
        captions: [
          { at: 0, text: "[rain dripping off the porch]" },
          { at: 3, who: "Prakash", text: "“Aap photographer ho?”", en: "You're the photographer?" },
          { at: 5, who: "Raghav", text: "“Haan. Raghav.”", en: "Yes. Raghav." },
          { at: 8, who: "Prakash", text: "“Kamat saab ne bola hai photos achhe aane chahiye.”", en: "Kamat saab said the photos have to come out well." },
          { at: 13, who: "Raghav", text: "“Kamat?”" },
          { at: 15, text: "[a pause, too long]" },
          { at: 18, who: "Prakash", text: "“Haan. Contractor.”", en: "Yes. The contractor." },
          { at: 21, text: "[keys; a lock turning]" },
        ],
      },
    },
    {
      id: "clip-cabinet",
      album: "camera",
      alt: "Video. A living room, slowly, left to right. A tall wooden cabinet with a brass padlock on it.",
      takenAt: "Fri 22:44",
      place: "Malhotra Residence",
      evidence: "clip-cabinet",
      video: {
        seconds: 20,
        captions: [
          { at: 0, text: "[footsteps on marble]" },
          { at: 3, who: "Raghav", text: "“Isme kya hai?”", en: "What's in this?" },
          { at: 6, who: "Prakash", text: "“Khaali hai.”", en: "It's empty." },
          { at: 9, who: "Raghav", text: "“Toh lock kyun hai?”", en: "Then why is it locked?" },
          { at: 12, text: "[no answer]" },
          { at: 16, who: "Raghav", text: "“Theek hai.”", en: "Okay." },
        ],
      },
    },
    {
      id: "study",
      album: "camera",
      alt: "The study, flash-lit. A painting of a harbour, a silver watch on the desk, a bronze horse, a wall safe. On the side table, a whisky glass.",
      takenAt: "Fri 22:47",
      place: "Malhotra Residence",
      evidence: "study",
      zoom: {
        reveal: "The glass is half full and the ice hasn't melted. Pressed into the condensation: somebody's fingerprints. Not Raghav's; he never touched it.",
        evidence: "study-glass",
        // The side table, low on the right.
        at: { x: 78, y: 66 },
      },
    },
    {
      id: "clip-tuesday",
      album: "camera",
      alt: "Video. A dining room with a long table and eight chairs. Dry floors, clean walls, curtains drawn.",
      takenAt: "Fri 22:52",
      place: "Malhotra Residence",
      evidence: "clip-tuesday",
      video: {
        seconds: 18,
        captions: [
          { at: 0, text: "[the camera panning]" },
          { at: 3, who: "Raghav", text: "“Yahan se kya gaya?”", en: "What was taken from here?" },
          { at: 6, who: "Prakash", text: "“Kamat saab ki team Tuesday ko furniture le gayi thi. Renovation hai.”", en: "Kamat saab's team took the furniture on Tuesday. There's a renovation." },
          { at: 12, who: "Raghav", text: "“Renovation? Sab toh bilkul theek hai.”", en: "A renovation? Everything here looks fine." },
        ],
      },
    },
    {
      id: "clip-wall",
      album: "camera",
      alt: "Video. A master bedroom. The camera stops on the wall above the bed.",
      takenAt: "Fri 23:02",
      place: "Malhotra Residence",
      evidence: "clip-wall",
      video: {
        seconds: 22,
        captions: [
          { at: 0, text: "[a door opening]" },
          { at: 3, who: "Raghav", text: "“Painting yahan thi?”", en: "Was there a painting here?" },
          { at: 6, who: "Prakash", text: "“Pata nahi.”", en: "No idea." },
          { at: 9, who: "Raghav", text: "“Aapko sab pata hota hoga.”", en: "You'd know everything that happens here." },
          { at: 13, text: "[Prakash laughs, once]" },
          { at: 15, who: "Prakash", text: "“Aap photo lo, saab.”", en: "You take your photos, sir." },
        ],
      },
    },
    {
      id: "bedroom",
      album: "camera",
      alt: "An empty stretch of wall above a bed, lit evenly. Four small marks in a rectangle, where something heavy used to hang.",
      takenAt: "Fri 23:04",
      place: "Malhotra Residence",
      evidence: "bedroom-wall",
    },
    {
      id: "ref-bedroom",
      album: "telegram",
      alt: "The same master bedroom, lit for an inventory. Above the bed, a large painting in a gilt frame: a woman on a verandah.",
      takenAt: "Fri 20:04",
      place: "Saved from Telegram",
      note: "Taken Fri 20:00",
      evidence: "ref-painting",
    },
    {
      id: "ref-inventory",
      album: "telegram",
      alt: "A typed page from an inventory, photographed on a desk.",
      liveText: "7 · OIL ON CANVAS · ₹48,00,000",
      takenAt: "Fri 20:04",
      place: "Saved from Telegram",
      evidence: "inventory-48",
    },
    {
      id: "b2-door",
      album: "recents",
      alt: "A dark upstairs corridor, taken without a flash. At the end of it, a door with a small plate.",
      liveText: "B-2",
      takenAt: "Fri 23:20",
      place: "Malhotra Residence",
      requires: ["seen:plan-b2"],
    },
    {
      id: "kamat-screenshot",
      album: "received",
      alt: "A screenshot of a WhatsApp chat with “Kamat Saab”. One message, sent Friday 21:41: “Jo bola tha wo nikal gaya.”",
      takenAt: "Fri 21:43",
      place: "Screenshot",
      requires: ["ep:2"],
    },
    {
      id: "cctv-2312",
      album: "received",
      alt: "CCTV, service gate, 23:12:40. A man in a dark shirt lets himself in. His face is turned away from the camera.",
      overlay: "CAM 4 · SERVICE GATE · 23:12:40",
      takenAt: "Fri 23:12",
      place: "Malhotra Residence",
      requires: ["ep:2"],
    },
  ],

  /* --- Files ------------------------------------------------------------------- */

  files: [
    {
      id: "floor-plan",
      name: "Malhotra_floor_plan.pdf",
      folder: "Telegram",
      at: "Fri 20:04",
      size: "1.2 MB",
      content: {
        kind: "plan",
        floors: [
          {
            name: "Ground floor",
            rooms: [
              { id: "g-hall", label: "Entrance hall", x: 36, y: 22, w: 28, h: 22 },
              { id: "g-living", label: "Living", x: 2, y: 2, w: 34, h: 36 },
              { id: "g-dining", label: "Dining", x: 64, y: 2, w: 34, h: 24 },
              { id: "g-kitchen", label: "Kitchen", x: 64, y: 26, w: 34, h: 20 },
              { id: "g-study", label: "Study", x: 2, y: 38, w: 34, h: 24 },
              { id: "g-guard", label: "Guard room", x: 64, y: 46, w: 18, h: 16 },
              { id: "g-service", label: "Service gate", x: 82, y: 46, w: 16, h: 16 },
              { id: "g-porch", label: "Porch", x: 36, y: 44, w: 28, h: 18 },
            ],
          },
          {
            name: "First floor",
            rooms: [
              { id: "f-master", label: "Master bedroom", x: 2, y: 2, w: 40, h: 34 },
              { id: "f-dressing", label: "Dressing", x: 2, y: 36, w: 20, h: 14 },
              { id: "f-bath", label: "Bath", x: 22, y: 36, w: 20, h: 14 },
              { id: "f-landing", label: "Landing", x: 42, y: 20, w: 18, h: 30 },
              { id: "f-bed2", label: "Bedroom 2", x: 60, y: 2, w: 38, h: 28 },
              // The only room with a code instead of a name.
              { id: "f-b2", label: "B-2", x: 60, y: 30, w: 24, h: 20, evidence: "plan-b2" },
              { id: "f-balcony", label: "Stairs out", x: 84, y: 30, w: 14, h: 20 },
              { id: "f-terrace", label: "Terrace", x: 2, y: 50, w: 96, h: 12 },
            ],
          },
        ],
      },
    },
  ],

  /* --- Low Battery's shape, unused here (removed with it in N8) ------------- */
  health: [],
  wifi: [],
  places: [],
  searches: [],
  memos: [],
  vault: { thread: { id: "vault", contact: "", messages: [] }, notes: [] },
  devices: [],
  guardian: { owner: "", since: "", sting: "", timeline: [] },
  nightcam: { items: 0 },
  food: [],
  keyboard: ["raghav", "kamat", "prakash"],

  end: {
    title: "End of Episode 1",
    questions: ["Who is in the blue room?", "Who texted Raghav at 23:19?", "Who is “him”?"],
    ask: "3%. The screen went dark.",
    cta: "Continue · Episode 2",
  },
  end2: { title: "", questions: [], ask: "" },
  end3: { title: "", questions: [], ask: "" },
  call: null,
};
