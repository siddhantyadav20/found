import type { FileClaim, Question } from "../types";

/* ===========================================================================
   The case file: eight questions, and Q1 again (RAAKH-V3 §10, §12).

   Each is a sentence with blanks, every word offered from the start. The
   player fills the blanks, tables the proof, and files. The truth gets a
   result line; Sameer's version is filed without comment and labelled his
   ("On the record, as Sameer tells it."), and holds until the truth is
   filed over it; a hunch is filed on less, and pays off later. A refusal
   always points somewhere. Any one listed bundle of proof is enough.

   Contested (the end card's "Your story held on N of 4"): Q4, Q6, Q7, Q8.
   Q7's version falls the moment Q8 is filed, because Dilip is alive.
   =========================================================================== */

/** A refusal for a sentence: never filed, only answered. */
const refuse = (id: string, words: Record<string, string>, text: string, more: Partial<FileClaim> = {}): FileClaim => ({
  id,
  words,
  text: "",
  proof: [],
  reply: "",
  refuse: text,
  ...more,
});

/** Every way of tabling one thing from each of these groups. */
const each = (...groups: readonly (readonly (readonly string[])[])[]): string[][] =>
  groups.reduce<string[][]>((routes, group) => routes.flatMap((r) => group.map((g) => [...r, ...g])), [[]]);

/** How the player can show it's them (RAAKH-V3 §10): the photo, the case file's own info, or the waybill and his account. */
const ME = [["camera-photo"], ["case-meta"], ["waybill", "apple-account"]] as const;

const ON_RECORD = "On the record, as Sameer tells it.";

export const questions: readonly Question[] = [
  /* --- Episode 1 · Missed Calls --------------------------------------------- */
  {
    kind: "file",
    id: "q1",
    episode: 1,
    ask: "Who is S, and where is he running to?",
    whereToLook: ["settings", "instagram", "mail"],
    hints: [
      "Who does this phone belong to? Try Settings.",
      "The invoice and the train ticket name the same man.",
      "S is Sameer Khurrana, a wedding planner going to Mumbai.",
    ],
    say: {
      line: "S is {name}, a {job}, and tomorrow afternoon he's on a train to {city}.",
      blanks: {
        name: ["Sameer Khurrana", "Rohan", "Kunal", "Nitin", "me"],
        job: ["wedding planner", "wedding photographer", "caterer"],
        city: ["Mumbai", "Jaipur", "Samastipur"],
      },
      learn: { "Sameer Khurrana": ["apple-account", "invoice"], "wedding planner": ["invoice"], Mumbai: ["offer", "ticket"] },
    },
    claims: [
      {
        id: "him",
        words: { name: "Sameer Khurrana", job: "wedding planner", city: "Mumbai" },
        text: "S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he's on a train to Mumbai.",
        proof: ["sk-films", "invoice"],
        orProof: [["offer", "ticket"], ["apple-account", "invoice"]],
        also: ["apple-account", "offer", "ticket", "deposit", "sk-films", "invoice"],
        reply: "Sameer Khurrana, 28. SK Weddings, South Delhi. Leaving for a job in Mumbai that starts Monday. His train goes at 4:55 tomorrow.",
      },
      // "me", before the phone puts the player in it: the line every finisher remembers (IC15).
      refuse("me-early", { name: "me", job: "*", city: "*" }, "Nothing on the phone puts you in it. Not yet.", {
        liftedBy: [["waybill", "apple-account"], ["find-my"]],
      }),
      {
        id: "me",
        words: { name: "me", job: "wedding planner", city: "Mumbai" },
        text: "S is me, a wedding planner, and tomorrow afternoon I'm on a train to Mumbai. (A hunch.)",
        proof: ["waybill", "apple-account"],
        orProof: [["find-my"]],
        also: ["ticket", "offer", "invoice", "sk-films"],
        reply: "Filed, as your hunch. The parcel went back to the address on his account. It reached your door.",
        hunch: "me",
        sets: ["did:me-hunch"],
      },
    ],
    reply: "On the record.",
    // Filed, Q1 stays open to filing again, until the reveal.
    editable: ["did:reveal-start"],
  },
  {
    kind: "file",
    id: "q2",
    episode: 1,
    ask: "Dilip is missing. Who is he, and where was he last seen?",
    whereToLook: ["whatsapp", "photos", "notes"],
    hints: [
      "Zoom into the portrait in Favorites.",
      "The run sheet says who held the light.",
      "A catering worker, at the Sehgal wedding, holding the light.",
    ],
    say: {
      line: "Dilip is a {role}, last seen {where}, holding {what} for Sameer.",
      blanks: {
        role: ["catering worker", "guest", "driver"],
        where: ["at the Sehgal wedding", "at the caterer's kitchen", "at Samastipur bus stand"],
        what: ["the light", "the camera", "a tray"],
      },
      learn: { "catering worker": ["portrait", "sethi-shoot"], "at the Sehgal wedding": ["poster", "sethi-shoot"], "the light": ["shot-list"] },
    },
    claims: [
      {
        id: "dilip",
        words: { role: "catering worker", where: "at the Sehgal wedding", what: "the light" },
        text: "Dilip is a catering worker, last seen at the Sehgal wedding, holding the light for Sameer.",
        proof: ["poster", "badge", "shot-list"],
        orProof: [["sethi-shoot", "badge", "shot-list"]],
        also: ["portrait", "sethi-dilip", "sethi-list", "promise", "nitin-sick"],
        reply: "Dilip Kumar Mahto, nineteen, Sethi Caterers. At 9:48 Sameer photographed him smiling over a tray. At 12:15 he was holding Sameer's light. His family hasn't seen him since.",
      },
      refuse("tray", { role: "*", where: "*", what: "a tray" }, "That was 9:48. Where was he at 12:15?"),
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q3",
    episode: 1,
    ask: "Someone set this phone up for M. When, and where does the list stop?",
    whereToLook: ["notes", "settings"],
    hints: [
      "A phone with no passcode, and a note to M. When was he writing to her?",
      "Settings says the passcode is off. Notes has “For M”: when it was written, and where it stops.",
      "Thursday night, and it stops at Nitin. Table “For M”.",
    ],
    say: {
      line: "He got it ready on {when}: the passcode off, and a list for M that stops at {name}.",
      blanks: {
        when: ["Thursday night", "the wedding night", "Saturday morning"],
        name: ["Nitin", "Bhasin", "Kunal", "Dilip"],
      },
      learn: { "Thursday night": ["for-m"], Nitin: ["for-m"] },
    },
    claims: [
      {
        id: "ready",
        words: { when: "Thursday night", name: "Nitin" },
        text: "He got it ready on Thursday night: the passcode off, and a list for M that stops at Nitin.",
        proof: ["for-m"],
        also: ["passcode-off", "note", "call-thu"],
        reply: "Thursday night, 11:20: a reading order for M, and a phone anyone can open. The list stops mid-line, at a name.",
      },
    ],
    reply: "On the record.",
  },

  /* --- Episode 2 · The Second Shot ------------------------------------------ */
  {
    kind: "file",
    id: "q4",
    episode: 2,
    contestable: true,
    ask: "Who fired the shot that hit Dilip?",
    whereToLook: ["photos", "voicememos", "whatsapp"],
    hints: [
      "Kunal's clip is on the dance floor. What happened on the back lawn, forty minutes later?",
      "Photos › Recently Deleted has the reel take, and Kunal's shared album has 12:29. Voice Memos can come back down now.",
      "Sameer fired the second shot. Table Kunal's 11:52 clip and the reel take.",
    ],
    say: {
      line: "Kunal fired on the {place} at 11:52. Forty minutes later on the back lawn, {who} fired twice, and the {which} shot hit Dilip.",
      blanks: {
        place: ["dance floor", "back lawn"],
        who: ["Sameer", "Kunal", "Bhasin"],
        which: ["second", "first"],
      },
      learn: { "dance floor": ["kunal-clip"], Sameer: ["reel-take", "memo", "bts"], second: ["reel-take", "memo"] },
    },
    claims: [
      {
        id: "truth",
        words: { place: "dance floor", who: "Sameer", which: "second" },
        text: "Kunal fired on the dance floor at 11:52. Forty minutes later on the back lawn, Sameer fired twice, and the second shot hit Dilip.",
        proof: ["kunal-clip", "reel-take"],
        orProof: [["kunal-clip", "memo"], ["kunal-clip", "frame"], ["kunal-clip", "kunal-frame"], ["kunal-clip", "bts", "gun-to-kunal"], ["kunal-clip", "bts", "kunal-papa"]],
        also: ["shot-list", "kunal-story", "promise"],
        moment: "Sameer.",
        reply: "The first shot was for the camera. The second, as he posed for Kunal, went lower than he meant. That was 12:32. A week later, to the minute, his phone came back on.",
        pays: ["q4:hunch"],
      },
      // Filed on less: the run sheet and the gun, not the shot. It pays off when the truth is filed over it.
      {
        id: "hunch",
        words: { place: "dance floor", who: "Sameer", which: "second" },
        text: "Kunal fired on the dance floor at 11:52. Forty minutes later on the back lawn, Sameer fired twice, and the second shot hit Dilip. (A hunch.)",
        proof: ["shot-list", "kunal-papa"],
        reply: "Filed, as your hunch. Nothing you've tabled puts the gun in his hand. Not yet.",
        hunch: "shot",
      },
      {
        id: "version",
        words: { place: "dance floor", who: "Kunal", which: "second" },
        text: "Kunal fired on the dance floor at 11:52, and again on the back lawn forty minutes later. The second shot hit Dilip.",
        proof: ["vn-kunal", "kunal-story"],
        reply: ON_RECORD,
        version: true,
      },
      refuse("lawn", { place: "back lawn", who: "*", which: "*" }, "Look at the floor under Kunal's feet at 11:52."),
      refuse("first", { place: "*", who: "*", which: "first" }, "The first went straight up, for the camera. Listen again."),
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q5",
    episode: 2,
    ask: "After the shot, was Dilip alive, and what happened to the car that came for him?",
    whereToLook: ["whatsapp", "photos"],
    hints: [
      "Bhasin's group screenshots run on past 1 AM. One of the two chats Sameer locked is Dilip's own.",
      "Nitin's locked chat has a car in it, and when it came back. The screenshots saw it too.",
      "1:14, awake; Nitin sent the car; at 2:04 it left without him. Table Pappu's 1:14, Nitin's 1:22 and Nitin's 2:04.",
    ],
    say: {
      line: "At {time} Dilip was {state}. {who} sent a car to the service gate, and at 2:04 it left {how}.",
      blanks: {
        time: ["1:14", "2:41"],
        state: ["awake", "already gone"],
        who: ["Nitin", "Bhasin", "Sameer"],
        how: ["without him", "with him"],
      },
      learn: { "1:14": ["conscious"], Nitin: ["nitin-car"], "without him": ["left-empty", "nitin-back"] },
    },
    claims: [
      {
        id: "truth",
        words: { time: "1:14", state: "awake", who: "Nitin", how: "without him" },
        text: "At 1:14 Dilip was awake. Nitin sent a car to the service gate, and at 2:04 it left without him.",
        proof: ["conscious", "nitin-car", "nitin-back"],
        orProof: each([["conscious"], ["dilip-107"]], [["nitin-car"]], [["nitin-back"], ["left-empty"]]),
        also: ["nitin-gate", "swift", "site-plan", "no-112", "doctor", "call-115", "nitin-reply"],
        moment: "Alive.",
        reply: "At 1:14, forty minutes after the shot, he was awake and asking for water. Forty metres away, Nitin's car waited at the service gate on Mandi Road. At 2:04 it left without him.",
      },
      refuse("gone", { time: "2:41", state: "*", who: "*", how: "*" }, "At 2:41 he'd stopped speaking. That isn't the same thing. Look earlier."),
      refuse("sameer", { time: "*", state: "*", who: "Sameer", how: "*" }, "Who wrote “Dilip ko service gate pe le aao”?"),
    ],
    reply: "On the record.",
  },

  /* --- Episode 3 · Return to Origin ----------------------------------------- */
  {
    kind: "file",
    id: "q6",
    episode: 3,
    contestable: true,
    ask: "Why did the car leave empty?",
    whereToLook: ["whatsapp", "photos", "safari"],
    hints: [
      "Nitin answered someone at 1:53. Where was Sameer at 1:49?",
      "Nitin sent you what he kept. Or set Ramesh's 1:49 beside Nitin's 1:53 and what Safari searched at 1:56.",
      "He told Nitin Dilip had gone, knowing he hadn't. Table Nitin's copy of 1:52 and Ramesh's 1:49.",
    ],
    say: {
      line: "The car left empty because {cause}.",
      blanks: {
        cause: [
          "Sameer told Nitin Dilip had already gone, knowing he hadn't",
          "Bhasin's people turned it away at the gate",
          "Sameer told Nitin Dilip had already gone, believing it",
          "Nitin gave up waiting",
        ],
      },
    },
    claims: [
      {
        id: "truth",
        words: { cause: "Sameer told Nitin Dilip had already gone, knowing he hadn't" },
        text: "The car left empty because Sameer told Nitin Dilip had already gone, knowing he hadn't.",
        proof: ["nitin-152", "sameer-room"],
        orProof: [["sameer-room", "nitin-reply", "search-156"]],
        also: ["nitin-car", "nitin-gate", "nitin-back", "swift", "left-empty", "call-206", "site-plan"],
        moment: "He knew.",
        reply: "At 1:49 he was in the room with Dilip. At 1:52 he told Nitin Dilip had gone. At 1:56 he was still searching for an ambulance. A week later, to the minute, Nitin sent the message back.",
      },
      {
        id: "version",
        words: { cause: "Bhasin's people turned it away at the gate" },
        text: "The car left empty because Bhasin's people turned it away at the gate.",
        proof: ["swift", "left-empty"],
        reply: ON_RECORD,
        version: true,
      },
      refuse("believed", { cause: "Sameer told Nitin Dilip had already gone, believing it" }, "Believing it? Where was he at 1:49?"),
      refuse("gave-up", { cause: "Nitin gave up waiting" }, "Read 1:53 again. He's answering someone."),
    ],
    reply: "On the record.",
  },
  {
    kind: "file",
    id: "q7",
    episode: 3,
    contestable: true,
    ask: "What burned on the back plot?",
    whereToLook: ["notes", "photos", "whatsapp"],
    hints: [
      "The clip in Favorites is nine seconds of something longer. He kept the rest somewhere only he could open.",
      "Notes › “Agar kuch hua” is locked with his birthday, day then month. Settings has it.",
      "He lit it, on Bhasin's orders, and what burned was an empty mattress, sheets and clothes. Table the whole fire from the locked note (password 1403).",
    ],
    say: {
      line: "At 4:47 Sameer {role} on {whose} orders, and what burned was {what}.",
      blanks: {
        role: ["lit the fire", "only watched"],
        whose: ["Bhasin's", "Kunal's"],
        what: ["Dilip's body, rolled in a mattress", "an empty mattress, sheets and clothes"],
      },
      learn: { "lit the fire": ["fire-original", "kunal-jerrycan"], "an empty mattress, sheets and clothes": ["fire-original"] },
    },
    claims: [
      {
        id: "truth",
        words: { role: "lit the fire", whose: "Bhasin's", what: "an empty mattress, sheets and clothes" },
        text: "At 4:47 Sameer lit the fire on Bhasin's orders, and what burned was an empty mattress, sheets and clothes.",
        proof: ["fire-original"],
        orProof: [["car-255", "fire-clip", "kunal-jerrycan"]],
        also: ["note-text", "call-331", "vn-burned", "fire-clip", "not-speaking"],
        moment: "Empty.",
        reply: "…his own hand, with the kada, sets down a jerrycan beside a rolled mattress. “Uske kapde bhi.” Bhasin told him the boy was inside. He didn't look. When the mattress burns open, it's empty.",
        sets: ["did:fire-empty"],
      },
      {
        id: "version",
        words: { role: "only watched", whose: "Bhasin's", what: "Dilip's body, rolled in a mattress" },
        text: "At 4:47 Sameer only watched, on Bhasin's orders, and what burned was Dilip's body, rolled in a mattress.",
        proof: ["vn-burned", "fire-clip"],
        reply: ON_RECORD,
        version: true,
      },
      refuse("body", { role: "lit the fire", whose: "Bhasin's", what: "Dilip's body, rolled in a mattress" }, "Watch the whole clip. Watch the mattress when it opens."),
    ],
    reply: "On the record.",
    // Dilip is alive: whatever was filed about a body falls when Q8 is.
    struckWhen: ["ask:q8"],
  },
  {
    kind: "file",
    id: "q8",
    episode: 3,
    contestable: true,
    ask: "Who is the patient they call Deepak, and why does “For M” stop at Nitin?",
    whereToLook: ["whatsapp", "photos", "notes"],
    hints: [
      "Dilip's own number has written to this phone. Read what the nurse sent.",
      "The badge on the waistcoat in the bag: you've seen it before, in Favorites. And item 4 of “For M” is Nitin's chat. What does only Nitin still have?",
      "Dilip, alive; Nitin's chat is the one place 1:52 still exists. Table the bag photo, the badge, and Nitin's copy of 1:52.",
    ],
    say: {
      line: "The patient is {who}, alive. “For M” stops at Nitin because {why}.",
      blanks: {
        who: ["Dilip", "a stranger", "Nitin"],
        why: ["Nitin's chat is the one place 1:52 still exists", "Nitin wasn't there that night", "he ran out of time"],
      },
    },
    claims: [
      {
        id: "truth",
        words: { who: "Dilip", why: "Nitin's chat is the one place 1:52 still exists" },
        text: "The patient is Dilip, alive. “For M” stops at Nitin because Nitin's chat is the one place 1:52 still exists.",
        proof: ["slip", "badge", "nitin-152"],
        orProof: each([["slip"], ["belongings"]], [["badge"], ["portrait"]], [["nitin-152"], ["for-m", "lie-proved"]]),
        also: ["anita", "anita-voice", "car-255", "dilip-read", "search-ticks", "fire-original", "dilip-video"],
        moment: "Alive.",
        reply: "Dilip Kumar Mahto is alive, in a room in Fatehpur Beri, under somebody else's name. He has been there a week. Bhasin didn't kill him. He hid him, and let Sameer believe the rest. “For M” stops where it does because item 4 was the one place 1:52 still exists. They move him at seven.",
      },
      {
        id: "version",
        words: { who: "Dilip", why: "he ran out of time" },
        text: "The patient is Dilip, alive. “For M” stops at Nitin because he ran out of time.",
        proof: ["slip", "badge", "for-m", "vn-phone"],
        orProof: each([["slip"], ["belongings"]], [["badge"], ["portrait"]], [["for-m", "vn-phone"]]),
        reply: "Dilip Kumar Mahto is alive, in a room in Fatehpur Beri, under somebody else's name. He has been there a week. “For M” stops where it does, as Sameer tells it. They move him at seven.",
        version: true,
      },
      refuse("stranger", { who: "a stranger", why: "*" }, "Look at the badge in the bag. You've zoomed into it before."),
    ],
    reply: "On the record.",
  },

  /* --- The last question: Q1, again (RAAKH-V3 §10) --------------------------
     Asked once the reveal is over, in the first person. "Sameer Khurrana"
     turns the sentence back into Episode 1's and sends the phone back to
     origin; "me" has to be shown, and so does where. */
  {
    kind: "file",
    id: "qf",
    episode: 3,
    final: true,
    eyebrow: "Q1, again",
    requires: ["did:reveal-done"],
    ask: "Who is S, and where is he going?",
    whereToLook: ["camera", "whatsapp", "mail"],
    hints: [
      "You've seen who S is. Where will you be at seven?",
      "Room 6 needs Sister Anita, her slip, or Dilip's voice. Gate 2 needs Bhasin's terms. The 4:55 needs the ticket. “Me” needs the photo you took, the case file's info, or the waybill with his account.",
      "There's no right answer here. There is only what you do.",
    ],
    say: {
      line: "S is {who}, and at seven I'll be {where}.",
      blanks: {
        who: ["me", "Sameer Khurrana"],
        where: ["at Fatehpur Beri", "at Gate 2, with the phone", "on my way to the 4:55"],
      },
    },
    claims: [
      {
        id: "origin",
        words: { who: "Sameer Khurrana", where: "*" },
        text: "S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he's on a train to Mumbai.",
        proof: [],
        free: true,
        ending: "origin",
        confirm: "You send it back to M. It will come back here.",
        reply: "",
      },
      {
        id: "room6",
        words: { who: "me", where: "at Fatehpur Beri" },
        text: "S is me, and at seven I'll be at Fatehpur Beri.",
        proof: ["camera-photo", "slip"],
        // Anita's own words name the place (2026-10-28: they were turned away, though they're what says Fatehpur Beri).
        orProof: each(ME, [["slip"], ["belongings"], ["dilip-plea"], ["anita"], ["anita-voice"]]),
        ending: "room6",
        confirm: "You go to him. Whatever you say there goes on the record.",
        reply: "",
      },
      {
        id: "trade",
        words: { who: "me", where: "at Gate 2, with the phone" },
        text: "S is me, and at seven I'll be at Gate 2, with the phone.",
        proof: ["camera-photo", "bhasin-terms"],
        orProof: each(ME, [["bhasin-terms"]]),
        ending: "trade",
        confirm: "Bhasin gets the phone. Dilip gets the bus. You get the train.",
        reply: "",
        unless: ["did:bhasin-left"],
      },
      refuse("trade-gone", { who: "me", where: "at Gate 2, with the phone" }, "Bhasin's car has gone. Nobody is waiting at Gate 2."),
      {
        id: "train",
        words: { who: "me", where: "on my way to the 4:55" },
        text: "S is me, and at seven I'll be on my way to the 4:55.",
        proof: ["camera-photo", "ticket"],
        orProof: each(ME, [["ticket"]]),
        ending: "train",
        confirm: "You keep the phone and take the train. Bhasin keeps Dilip until he has it.",
        reply: "",
      },
    ],
    reply: "On the record.",
  },
];

/** Episode 1's sentence, which the last question turns back into for "Sameer Khurrana". */
export const FIRST_SENTENCE = "S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he's on a train to Mumbai.";
