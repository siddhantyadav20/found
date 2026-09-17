import type { Part } from "./types";

/* ===========================================================================
   Low Battery — Episode 3: Delivered. The prestige.

   Monday night. The phone is charged, the Wi-Fi is on, and the other eleven
   NightCam frames come down one at a time, each one waiting until the player
   has looked at the last. Never on a clock.

   Act 1, what {name} photographed: a taped sprinkler, the wiring over the
   engine bay, a clipboard reading HERITAGE CONDITION · 1923. {name} wasn't
   documenting a building. {name} was drawing the plan for burning it.

   Act 2, the guard: frame 11 is a hand over the lens, and the only
   photograph in the game that can be pinched. At the edge of the torch beam,
   two men carry something wrapped out of the engine house. Saturday's local
   column says a watchman never came home. And K.'s line from Episode 1 — the
   guard is off till 12 — reads the other way now.

   Act 3, two clocks and a call: K. comes for the phone (by the dot on the
   map, or, if the player stopped sharing in Episode 1, by a photograph of
   their stairwell), 3107 is outside a police station, and the phone rings.
   What the player says on that call is the ending.

   Everything here is gated on `ep:3`, so it lays over Episodes 1 and 2 and a
   finished Episode 2 save carries straight on.
   =========================================================================== */

const EP3 = "ep:3" as const;
const MILL = "Shree Ram Mills";

export const episode3: Part = {
  /* --- The eleven, one at a time ----------------------------------------------
     Each frame arrives once the one before it has been opened, so the pace is
     the player's. The sync stops at 11 of 12 until they've named the man in
     frame 11. */

  photos: [
    {
      id: "nc-van-inside",
      album: "nightcam",
      alt: "Through a broken window: the white van, parked inside the compound, its back doors open.",
      takenAt: "Fri 23:40",
      place: MILL,
      evidence: "nc-van-inside",
      requires: [EP3],
    },
    {
      id: "nc-sprinkler",
      album: "nightcam",
      alt: "A ceiling sprinkler head, wrapped tight in grey tape. Fresh tape; the pipe around it is black with age.",
      takenAt: "Fri 23:41",
      place: MILL,
      evidence: "nc-sprinkler",
      requires: ["seen:nc-van-inside"],
    },
    {
      id: "nc-wiring",
      album: "nightcam",
      alt: "Old cloth-covered wiring running across the ceiling, directly above a huge iron engine. Lit and centred.",
      takenAt: "Fri 23:42",
      place: MILL,
      evidence: "nc-wiring",
      requires: ["seen:nc-sprinkler"],
    },
    {
      id: "nc-clipboard",
      album: "nightcam",
      alt: "A clipboard on a crate, a printed form clipped to it.",
      liveText: "ENGINE HOUSE · HERITAGE CONDITION · 1923",
      takenAt: "Fri 23:43",
      place: MILL,
      evidence: "nc-clipboard",
      requires: ["seen:nc-wiring"],
    },
    {
      id: "nc-plate",
      album: "nightcam",
      alt: "Gate 3 from the inside, and the van's number plate, sharp in the torchlight.",
      liveText: "MH 01 DK 4471",
      takenAt: "Fri 23:44",
      place: MILL,
      evidence: "nc-plate",
      requires: ["solved:e3-plan"],
    },
    {
      id: "nc-folder",
      album: "nightcam",
      alt: "A card folder on the van's front seat, a label typed on its spine.",
      liveText: "ENGINE HOUSE CLEARANCE",
      takenAt: "Fri 23:45",
      place: MILL,
      evidence: "nc-folder",
      requires: ["seen:nc-plate"],
    },
    {
      id: "nc-tracks",
      album: "nightcam",
      alt: "Torchlight on a dusty floor. Wet footprints, following the way the photographer came in.",
      takenAt: "Fri 23:45",
      place: MILL,
      evidence: "nc-tracks",
      requires: ["seen:nc-folder"],
    },
    {
      id: "nc-pumproom",
      album: "nightcam",
      alt: "A steel door with a new padlock on an old hasp. Stencilled on it: PUMP ROOM.",
      takenAt: "Fri 23:46",
      place: MILL,
      evidence: "nc-pumproom",
      requires: ["seen:nc-tracks"],
    },
    {
      id: "nc-router",
      album: "nightcam",
      alt: "A small travel router on a crate, its lights on, a label stuck to the top.",
      liveText: "SRM-GATE3-GUEST",
      takenAt: "Fri 23:46",
      place: MILL,
      evidence: "nc-router",
      requires: ["seen:nc-pumproom"],
    },
    {
      id: "nc-hand",
      album: "nightcam",
      alt: "A hand, close over the lens. Torchlight bleeds between the fingers onto a brick doorway.",
      takenAt: "Fri 23:47",
      place: MILL,
      evidence: "nc-hand",
      requires: ["seen:nc-router"],
      zoom: {
        reveal: "At the edge of the beam: two men, carrying something long and wrapped out of the engine house door.",
        evidence: "nc-carried",
      },
    },
    {
      id: "nc-reflection",
      album: "nightcam",
      alt: "The van's side window. In the glass: a wrist with a steel watch, and a document held up to a torch.",
      liveText: "SRM/EH/1923",
      takenAt: "Fri 23:50",
      place: MILL,
      evidence: "nc-reflection",
      requires: ["solved:e3-guard"],
    },
    {
      id: "stairwell",
      album: "received",
      alt: "A stairwell, taken from the bottom step. A broken tube light on the landing. A door at the top.",
      takenAt: "Mon 22:40",
      place: "Andheri West",
      requires: ["fired:e3-k-stairs"],
    },
  ],

  vaultNotes: [
    {
      // Synced from {name}'s notes once the cloud caught up. Never sent.
      id: "draft",
      title: "draft",
      body: "ask K what clearance means\n\nif this is just photos why does he care what survives\n\n(don't send)",
      evidence: "draft-clearance",
      requires: ["seen:nc-wiring"],
    },
  ],

  food: [
    {
      // {name} got out. Nobody says so.
      at: "Sat 23:34",
      item: "2 × vada pav, 1 × water",
      to: "Currey Road",
      price: "₹70",
      note: "Ordered on another device",
      evidence: "food-currey",
      requires: [EP3],
    },
  ],

  headlines: [
    {
      id: "h-watchman",
      at: "Sat 16:20",
      title: "Mill watchman missing after Friday night shift",
      requires: ["solved:e3-plan"],
      evidence: "news-watchman",
      lines: [
        { text: "The family of Ramesh Shinde, 61, a night watchman at the shut Shree Ram Mills in Lower Parel, say he did not come home after his shift on Friday." },
        { text: "His son said Mr Shinde had been told he could leave early that night, but went back for his tiffin box." },
        { text: "Police have registered a missing person report." },
      ],
    },
    {
      id: "h-clearing",
      at: "Mon 21:50",
      title: "No one hurt in mill fire, officials repeat; clearing to begin",
      requires: [EP3],
      lines: [
        { text: "Fire officials said on Monday that no one was hurt in Sunday's fire at Shree Ram Mills, and that clearing the engine house could begin within days." },
        { text: "Anand Realty said it would cooperate fully with the investigation." },
      ],
    },
  ],

  /* --- The case file ------------------------------------------------------- */

  evidence: [
    { id: "nc-van-inside", app: "nightcam", label: "NightCam 2: the van, inside the gate", detail: "Frame 2, 23:40. The white van parked inside the compound, its back doors open.", requires: [EP3] },
    { id: "nc-sprinkler", app: "nightcam", label: "NightCam 3: a sprinkler, taped over", detail: "Frame 3, 23:41. A sprinkler head in the engine house, freshly wrapped in tape.", requires: ["seen:nc-van-inside"] },
    { id: "nc-wiring", app: "nightcam", label: "NightCam 4: wiring above the engine", detail: "Frame 4, 23:42. Old wiring over the engine bay, lit and centred. Why photograph a ceiling?", requires: ["seen:nc-sprinkler"] },
    { id: "nc-clipboard", app: "nightcam", label: "NightCam 5: HERITAGE CONDITION · 1923", detail: "Frame 5, 23:43. A form on a clipboard: ENGINE HOUSE · HERITAGE CONDITION · 1923.", requires: ["seen:nc-wiring"] },
    { id: "nc-plate", app: "nightcam", label: "NightCam 6: the van's number plate", detail: "Frame 6, 23:44. Gate 3, and the van's plate, sharp enough to read: MH 01 DK 4471.", requires: ["solved:e3-plan"] },
    { id: "nc-folder", app: "nightcam", label: "NightCam 7: ENGINE HOUSE CLEARANCE", detail: "Frame 7, 23:45. A folder on the van's front seat, labelled ENGINE HOUSE CLEARANCE.", requires: ["seen:nc-plate"] },
    { id: "nc-tracks", app: "nightcam", label: "NightCam 8: wet footprints", detail: "Frame 8, 23:45. Wet footprints on the dust, following the way {name} came in.", requires: ["seen:nc-folder"] },
    { id: "nc-pumproom", app: "nightcam", label: "NightCam 9: the pump-room door", detail: "Frame 9, 23:46. A steel door marked PUMP ROOM, with a padlock newer than the door.", requires: ["seen:nc-tracks"] },
    { id: "nc-router", app: "nightcam", label: "NightCam 10: the crew's own router", detail: "Frame 10, 23:46. A travel router on a crate: SRM-GATE3-GUEST. The Wi-Fi {name} used.", requires: ["seen:nc-pumproom"] },
    { id: "nc-hand", app: "nightcam", label: "NightCam 11: a hand over the lens", detail: "Frame 11, 23:47. Someone's hand over the camera, torchlight between the fingers.", requires: ["seen:nc-router"] },
    { id: "nc-carried", app: "nightcam", label: "Frame 11: two men carrying something", detail: "Behind the hand, at the edge of the beam: two men carrying something long and wrapped out of the engine house.", requires: ["seen:nc-router"] },
    { id: "nc-reflection", app: "nightcam", label: "NightCam 12: a wrist in the van's glass", detail: "Frame 12, 23:50. Reflected in the van: a wrist, and a document marked SRM/EH/1923.", requires: ["solved:e3-guard"] },
    { id: "draft-clearance", app: "calculator", label: "An unsent note: “what clearance means”", detail: "In the vault: “ask K what clearance means” and “why does he care what survives”.", requires: ["seen:nc-wiring"] },
    { id: "food-currey", app: "food", label: "Dabba: an order to Currey Road, Sat", detail: "Saturday 23:34, two vada pav to Currey Road. Ordered on another device, after the phone was taken.", requires: [EP3] },
    { id: "news-watchman", app: "news", label: "City Desk: a mill watchman is missing", detail: "Saturday: Ramesh Shinde, 61, night watchman at Shree Ram Mills, never came home from his Friday shift.", requires: ["solved:e3-plan"] },
    { id: "map-k", app: "maps", label: "K.'s dot, coming closer", detail: "K. turned his location sharing back on. His dot is moving toward yours.", requires: ["fired:e3-k-coming"] },
    { id: "stairwell", app: "messages", label: "A photo of your stairwell", detail: "From 5520 on Monday night: your stairs, taken from the bottom step.", requires: ["fired:e3-k-stairs"] },
    { id: "3107-station", app: "messages", label: "“i'm outside byculla station”", detail: "3107, on Monday night, about to walk in and tell the police everything.", requires: ["fired:e3-3107-police"] },
  ],

  deductions: [
    {
      id: "e3-plan",
      question: "What was {name} really hired to photograph?",
      ask: "Not the building. Show what a fire would need to know.",
      requires: ["seen:nc-clipboard"],
      answer: { kind: "evidence", accepts: [["nc-wiring", "nc-sprinkler"], ["nc-wiring", "draft-clearance"]] },
      right: "Where a fire would start, and the one thing that could stop it. {name} wasn't photographing a mill. {name} was drawing the plan.",
      nudges: {
        "nc-clipboard": "That's why the building matters. What would a fire need?",
        "nc-van-inside": "That's who else was there. What was {name} told to point the camera at?",
        "nightcam-first": "The petrol was already there. What else would a fire need?",
        "k-brief": "That's when. You're looking for what.",
      },
      otherwise: "That doesn't say what the photographs were for.",
      look: ["nightcam", "calculator"],
      hints: [
        "Why would anyone photograph a ceiling, and not the building?",
        "Frames 3 and 4. And an unsent note in the vault asks what “clearance” means.",
        "Show the wiring above the engine and the taped sprinkler.",
      ],
    },
    {
      id: "e3-guard",
      question: "Who was carried out of the engine house on Friday night?",
      ask: "Frame 11 was taken at 23:47. Type a name.",
      requires: ["seen:nc-hand"],
      answer: { kind: "text", accepts: ["ramesh shinde", "shinde", "ramesh", "mr shinde", "ramesh shinde 61"] },
      right: "Ramesh Shinde, sixty-one, the night watchman. He was told he could go home early. He went back for his tiffin.",
      nudges: {
        "{name}": "{name} was the one holding the camera.",
        guard: "He had a name. City Desk printed it on Saturday.",
        "the guard": "He had a name. City Desk printed it on Saturday.",
        watchman: "He had a name. City Desk printed it on Saturday.",
        "the watchman": "He had a name. City Desk printed it on Saturday.",
        "the night watchman": "He had a name. City Desk printed it on Saturday.",
        k: "K. wasn't carried anywhere.",
        kiran: "K. wasn't carried anywhere.",
        dev: "Dev was at the party until one.",
      },
      otherwise: "Nobody by that name was at the mill on Friday.",
      look: ["nightcam", "news", "calculator"],
      hints: [
        "Someone was supposed to be off duty that night. Look closer at frame 11: pinch it, or double-tap.",
        "K. told {name} the guard was off till 12. City Desk ran four lines on Saturday about a man who didn't come home.",
        "Type: Ramesh Shinde",
      ],
    },
  ],

  /* --- The call -------------------------------------------------------------- */

  replies: [
    {
      id: "call",
      thread: "unknown",
      call: true,
      when: ["fired:e3-ring"],
      options: [
        { id: "send", text: "Go in. I'm sending them everything." },
        { id: "run", text: "Don't go in. Run." },
        { id: "fix", text: "Don't go in. I'll fix it." },
      ],
    },
  ],

  call: {
    thread: "unknown",
    lines: [
      { at: 0, text: "[a room with traffic outside it]" },
      { at: 3, text: "[a local train, close enough to shake the line]" },
      { at: 8, text: "“it's me. don't hang up.”" },
      { at: 13, text: "“i can see the station from here. there's a constable on the steps.”" },
      { at: 20, text: "“he's outside yours, isn't he. he goes wherever that phone goes.”" },
      { at: 28, text: "“everything i saw is on it. and everything you did.”" },
      { at: 35, text: "“if i walk in with nothing, it's my word against his.”" },
      { at: 41, text: "[breathing, held]" },
      { at: 45, text: "“i'm going in. tell me not to.”" },
    ],
    outcomes: [
      {
        id: "send",
        act: {
          title: "Send to Mumbai Police",
          detail: "12 NightCam frames · SRM-GATE3-GUEST · the vault · Guardian's report, as chain of custody",
          button: "Send everything",
          doing: "Sending",
          done: "Sent. Your name is in it.",
        },
        lines: [
          { text: "{name} walks into Byculla police station at 22:58." },
          { text: "The twelve frames arrive nine minutes later, with Mum's Guardian report attached. It names who has been holding the phone since Monday: you." },
          { text: "The van photo you recovered on Monday becomes exhibit 14.", requires: ["did:recover-van"] },
          { text: "Ramesh Shinde's death is reopened as culpable homicide." },
          { text: "Kiran Shetty and two others are arrested. The engine house's delisting is halted." },
          { text: "{name} is cleared." },
          { text: "Anjali Sethi tells reporters that a stranger told her the truth on Monday night.", requires: ["said:r-mum:truth"] },
          { text: "Anjali Sethi tells reporters that the message from {name}'s phone on Monday night, saying everything was fine, wasn't from {name}.", requires: ["said:r-mum:lie"] },
          { text: "You are a witness in a homicide case. Everything you opened is in the file." },
        ],
        headline: { at: "Tue 06:10", title: "Watchman's death reopened as homicide; three held over mill fire" },
        last: { from: "+91 98•• ••2231", text: "Hi, I'm a reporter with City Desk. Are you the person who had the phone? Can I have your name?" },
      },
      {
        id: "run",
        act: {
          title: "Erase This iPhone",
          detail: "All photos, messages, the vault and Guardian's history will be erased. This can't be undone.",
          button: "Erase iPhone",
          doing: "Erasing",
          done: "Hello",
        },
        lines: [
          { text: "You erase the phone while {name} walks away from the station." },
          { text: "No phone, no custody, no case. And the case against {name}, built almost entirely out of a stranger's Monday, falls apart with it." },
          { text: "Nobody is charged. The fire stays an accident." },
          { text: "{name} is free, and gone." },
          { text: "Anjali Sethi keeps calling a number that doesn't ring." },
          { text: "Ramesh Shinde's family are told he was sleeping somewhere he shouldn't have been." },
        ],
        headline: { at: "Fri 09:00", title: "Mill fire was accidental, police say; inquiry closed" },
      },
      {
        id: "fix",
        act: {
          title: "Someone's at the door",
          detail: "Three knocks. Then three more.",
          button: "Open the door",
          doing: "Opening",
          done: "He takes it. He doesn't come in.",
        },
        lines: [
          { text: "You open the door and hand it over, because it's the only way to make him leave." },
          { text: "He erases it on your stairs. The account dies with the phone." },
          { text: "{name} waits outside Byculla station for a call that doesn't come." },
          { text: "{name} is charged over the mill fire. No photographs. Only a story about a night {name} was paid to be there." },
          { text: "Ramesh Shinde's family receive a payment from a contractor's insurer." },
          { text: "Four months on, one news item." },
        ],
        headline: { at: "Four months later", title: "Engine house delisted; Shree Ram Mills site cleared" },
        after: ["The envelope is gone from your desk too.", "You were never in danger. That was the arrangement."],
      },
    ],
    coda: {
      from: "Tara",
      text: "{they} said you'd know what to do.",
      next: ["Someone in Delhi is about to lose something.", "Next Friday."],
    },
  },

  /* --- What happens because you got somewhere ------------------------------ */

  events: [
    { id: "e3-sync", when: [EP3], thread: null, messages: [], banner: "Downloading 2 of 12", bannerApp: "nightcam" },
    {
      // The same trick a third time: told not to, you look.
      id: "e3-stop",
      when: ["seen:nc-sprinkler"],
      thread: "burner",
      messages: [{ from: "them", at: "now", text: "Stop downloading." }],
    },
    { id: "e3-draft", when: ["seen:nc-wiring"], thread: null, messages: [], banner: "1 new item", bannerApp: "calculator" },
    {
      id: "e3-3107-plan",
      when: ["solved:e3-plan"],
      thread: "unknown",
      messages: [
        { from: "them", at: "now", text: "you saw the ceiling." },
        { from: "them", at: "now", text: "he said the client likes to know what they're buying. i thought he meant the building." },
      ],
    },
    {
      id: "e3-3107-guard",
      when: ["solved:e3-guard"],
      thread: "unknown",
      messages: [
        { from: "them", at: "now", text: "you found him." },
        { from: "them", at: "now", text: "i saw them carry him out. that's why he didn't just take my phone." },
        { from: "them", at: "now", text: "he took me too." },
      ],
    },
    { id: "e3-complete", when: ["solved:e3-guard"], thread: null, messages: [], banner: "Downloaded 12 of 12", bannerApp: "nightcam" },

    /* Two clocks. K. comes for the phone the way the player left him able to. */
    {
      id: "e3-k-coming",
      when: ["seen:nc-reflection"],
      unless: ["did:sharing-off"],
      thread: "burner",
      messages: [{ from: "them", at: "now", text: "Stay where you are." }],
    },
    {
      // Sharing was stopped in Episode 1, so he couldn't see it. He came to look.
      id: "e3-k-stairs",
      when: ["seen:nc-reflection", "did:sharing-off"],
      thread: "burner",
      messages: [
        { from: "them", at: "now", text: "", photo: "stairwell", evidence: "stairwell" },
        { from: "them", at: "now", text: "You turned it off. So I came to look." },
      ],
    },
    {
      id: "e3-3107-police",
      when: ["seen:nc-reflection"],
      whenAny: ["seen:map-k", "seen:stairwell"],
      thread: "unknown",
      messages: [
        { from: "them", at: "now", text: "the police want me." },
        { from: "them", at: "now", text: "i'm going to tell them what i saw." },
        { from: "them", at: "now", text: "i'm outside byculla station.", evidence: "3107-station" },
      ],
    },
    {
      id: "e3-k-outside",
      when: ["seen:3107-station"],
      thread: "burner",
      messages: [
        { from: "them", at: "now", text: "You said you knew what I did.", requires: ["said:r5520:threat"] },
        { from: "them", at: "now", text: "I'm outside. Bring it down." },
      ],
    },
    { id: "e3-ring", when: ["fired:e3-k-outside"], thread: null, messages: [], effect: "ring" },
  ],

  /* --- Where the story is -------------------------------------------------- */

  stages: [
    { id: "e3-sync", episode: 3, when: [EP3], battery: 84, screen: "phone" },
    { id: "e3-plan", episode: 3, when: [EP3, "solved:e3-plan"], battery: 90, screen: "phone" },
    { id: "e3-guard", episode: 3, when: [EP3, "solved:e3-plan", "solved:e3-guard"], battery: 96, screen: "phone" },
    { id: "e3-call", episode: 3, when: [EP3, "fired:e3-ring"], battery: 100, screen: "call" },
    { id: "e3-ending", episode: 3, when: [EP3, "fired:e3-ring", "said:call"], battery: 100, screen: "ending" },
    { id: "e3-end", episode: 3, when: [EP3, "ep:3-done"], battery: 100, screen: "end" },
  ],

  actions: [
    { id: "start-ep3", sets: EP3, requires: ["ep:2-done"] },
    { id: "finish-ep3", sets: "ep:3-done", requires: ["said:call"] },
  ],

  end3: {
    title: "End of Chapter One",
    questions: [],
    ask: "Case closed.",
  },
};
