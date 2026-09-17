import type { Story } from "@/content/found/types";

/* ===========================================================================
   The Blue Room — Episode 1: "The Job".

   The whole truth is in CHAPTER1.md, Part 2. What the player has at 4:17 AM
   on Saturday is Raghav Mehra's phone, five hours after the Malhotra house,
   and nothing else.

   So far (session N1): the opening. The envelope; a phone nobody locked, at
   5%; "don't call him"; a missed call from RAGHAV; the phone ringing; a
   whisper; 4%. The rest of the episode lands in N2–N4.

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

  /* --- The first minute ------------------------------------------------------ */

  threads: [
    {
      // Nobody the phone knows. The same number texts again at the end of Episode 2.
      id: "unknown-9081",
      contact: "+91 98190 •9081",
      notifyAs: "Unknown Number",
      app: "whatsapp",
      messages: [],
      requires: ["fired:e1-dont-call"],
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
      messages: [{ from: "them", at: "now", text: "If you found this phone, don't call him." }],
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
    { id: "hangup-opening", sets: "did:call:opening", requires: ["fired:e1-ring"] },
  ],

  evidence: [
    { id: "envelope", app: "envelope", label: "The envelope", detail: "Under your door at 4:17 AM. No name, no return address." },
  ],
  locks: [],
  deductions: [],
  replies: [],
  headlines: [],

  /* --- Low Battery's shape, unused here (removed with it in N8) ------------- */
  photos: [],
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
