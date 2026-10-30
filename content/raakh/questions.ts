import type { FileClaim, Question } from "../types";

/* ===========================================================================
   The case file: nine questions, and Q1 again (RAAKH-V3 §10, §12; the fix
   brief of 30 Oct 2026, §8).

   Each is a sentence with blanks, every word offered from the start. The
   player fills the blanks, tables the proof, and files. The truth gets a
   result line; Sameer's version is filed without comment and labelled his
   ("On the record, as Sameer tells it."), and holds until the truth is
   filed over it; a hunch is filed on less, and pays off later. A refusal
   always points somewhere.

   Proof is judged fact by fact (fix brief §8.1): each sentence lists what it
   claims (`facts`) and what proves each, any one route enough. Two things
   proving the same fact never fail a filing, and a refusal names the fact
   that still has nothing behind it. `proof` and `orProof` stay as the
   shortest whole sets, for the solver.

   Three of them can't be filed without a door clue (fix brief §6): Q3 the
   waybill, Q5b Mummy's map, and the last question the kada.

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

/**
 * How the player shows it's them (fix brief §6, Episode 3's door): the
 * front camera's photo, with the kada on their wrist, beside the same kada
 * on Sameer's hand, at the fire, at 12:29, or in his own selfie.
 */
const KADA = [["camera-photo", "fire-original"], ["camera-photo", "bts"], ["camera-photo", "kada-selfie"]] as const;
const ME = { fact: "S is me: the same kada, on his hand and on mine", what: "that S is you", by: KADA };

/** Where Dilip is, as the last question needs it for Fatehpur Beri. */
const BEDI = ["slip", "belongings", "dilip-plea", "anita", "anita-voice"] as const;

/** Who the patient is, and that he's alive (Q8, truth and version alike). */
const PATIENT = [
  { fact: "The patient they call Deepak is Dilip", what: "who the patient is", by: ["belongings", ["slip", "badge"], ["slip", "portrait"]] },
  { fact: "He's alive", what: "that he's alive", by: ["anita", "anita-voice", "anita-read", "dilip-read"] },
] as const;

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
      "The invoice says what he does. A ticket in Mail says where he's going.",
      "S is Sameer Khurrana, a wedding planner going to Mumbai. Table the invoice and the train ticket.",
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
        proof: ["ticket", "invoice"],
        orProof: [["ticket", "sk-films"], ["ticket", "offer"]],
        facts: [
          { fact: "S is Sameer Khurrana", what: "who S is", by: ["apple-account", "invoice", "ticket", "offer", "sk-films"] },
          { fact: "He's a wedding planner", what: "what he does", by: ["invoice", "sk-films", "offer"] },
          { fact: "Tomorrow afternoon he's on a train to Mumbai", what: "where he's going, and when", by: ["ticket"] },
        ],
        also: ["deposit", "offer-p2", "kada-selfie", "new-phone"],
        reply: "Sameer Khurrana, 28. SK Weddings, South Delhi. Leaving for a job in Mumbai that starts Monday. His train goes at 4:55 tomorrow afternoon.",
      },
      // "me", before the phone puts the player in it: the line every finisher remembers (IC15).
      refuse("me-early", { name: "me", job: "*", city: "*" }, "Nothing on the phone puts you in it. Not yet.", {
        liftedBy: [["waybill", "apple-account"], ["find-my"]],
        aloud: true,
      }),
      {
        id: "me",
        words: { name: "me", job: "wedding planner", city: "Mumbai" },
        text: "S is me, a wedding planner, and tomorrow afternoon I'm on a train to Mumbai. (A hunch.)",
        proof: ["waybill", "apple-account"],
        orProof: [["find-my"]],
        also: ["ticket", "offer", "invoice", "sk-films", "gate-note"],
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
      "The run sheet says who held the light. Raju's poster says where he was last seen.",
      "A catering worker, at the Sehgal wedding, holding the light. Table the badge, Raju's poster and the run sheet.",
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
        orProof: [["sethi-dilip", "shot-list"]],
        facts: [
          { fact: "Dilip is a catering worker", what: "what Dilip did there", by: ["badge", "sethi-shoot", "sethi-dilip", "sethi-list"] },
          { fact: "He was last seen at the Sehgal wedding", what: "where he was last seen", by: ["poster", "sethi-dilip"] },
          { fact: "He was holding the light for Sameer", what: "what he was holding", by: ["shot-list", "nitin-sick"] },
        ],
        also: ["portrait", "promise"],
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
    ask: "Someone set this phone up for M. When, and how did it reach her?",
    whereToLook: ["notes", "settings", "casefile"],
    hints: [
      "A phone with no passcode, and a note to M. When was he writing to her? And look at the waybill again.",
      "Settings says the passcode is off. Notes has “For M”. The waybill on the parcel says where it left from.",
      "Thursday night, it stops at Nitin, and it left from his own flat, B-14. Table “For M”, the passcode, and the waybill.",
    ],
    say: {
      line: "He got it ready on {when}: the passcode off, and a list for M that stops at {name}. On Saturday morning it went to her from {from}.",
      blanks: {
        when: ["Thursday night", "the wedding night", "Saturday morning"],
        name: ["Nitin", "Bhasin", "Kunal", "Dilip"],
        from: ["his own flat, B-14", "Banyan Farms", "a courier office in Saket"],
      },
      learn: { "Thursday night": ["for-m"], Nitin: ["for-m"], "his own flat, B-14": ["waybill"] },
    },
    claims: [
      {
        id: "ready",
        words: { when: "Thursday night", name: "Nitin", from: "his own flat, B-14" },
        text: "He got it ready on Thursday night: the passcode off, and a list for M that stops at Nitin. On Saturday morning it went to her from his own flat, B-14.",
        proof: ["for-m", "passcode-off", "waybill"],
        // Episode 1's door (fix brief §6): the waybill can't be left off.
        facts: [
          { fact: "On Thursday night he wrote M a list that stops at Nitin", what: "when he wrote the list", by: ["for-m"] },
          { fact: "He turned the passcode off", what: "that the passcode is off", by: ["passcode-off"] },
          { fact: "It went to her from his own flat, B-14", what: "where it was sent from", by: ["waybill"] },
        ],
        also: ["note", "call-thu", "apple-account", "gate-note", "find-my"],
        reply: "Thursday night, 11:20: a reading order for M, and a phone anyone can open. The list stops mid-line, at a name. On Saturday at 9:10 a courier collected it from B-14. M refused it at 11:10. At 10:50 PM it was back where it started.",
      },
      refuse("farm", { when: "*", name: "*", from: "Banyan Farms" }, "Read the waybill. Whose address is it from?"),
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
      "Sameer fired the second shot. Table Kunal's 11:52 clip and the reel take, played past the second shot.",
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
        orProof: [["kunal-clip", "memo"], ["kunal-clip", "frame"], ["kunal-clip", "kunal-frame"]],
        facts: [
          { fact: "Kunal fired on the dance floor at 11:52", what: "where Kunal fired first", by: ["kunal-clip"] },
          { fact: "Sameer fired twice on the back lawn", what: "who fired on the back lawn", by: ["reel-take", "memo", "frame", "kunal-frame", ["bts", "gun-to-kunal"]] },
          { fact: "The second shot hit Dilip", what: "which shot hit Dilip", by: ["reel-take", "memo", "frame", "kunal-frame"] },
        ],
        also: ["shot-list", "kunal-story", "promise", "kunal-papa", "dilip-107"],
        moment: "Sameer.",
        reply: "The first shot was for the camera. The second, as he posed for Kunal, went lower than he meant. That was 12:32. A week later, at 12:32, the alarm he'd set every night since went off.",
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
        facts: [
          { fact: "At 1:14 Dilip was awake", what: "that Dilip was alive after the shot", by: ["conscious", "dilip-107"] },
          { fact: "Nitin sent a car to the service gate", what: "who sent the car", by: ["nitin-car", "nitin-gate"] },
          { fact: "At 2:04 it left without him", what: "how the car left", by: ["nitin-back", "left-empty"] },
        ],
        also: ["swift", "site-plan", "no-112", "doctor", "call-115", "nitin-reply"],
        moment: "Alive.",
        reply: "At 1:14, forty minutes after the shot, he was awake and asking for water. Forty metres away, Nitin's car waited at the service gate on Mandi Road. At 2:04 it left without him.",
      },
      refuse("gone", { time: "2:41", state: "*", who: "*", how: "*" }, "At 2:41 he'd stopped speaking. That isn't the same thing. Look earlier."),
      refuse("sameer", { time: "*", state: "*", who: "Sameer", how: "*" }, "Who wrote “Dilip ko service gate pe le aao”?"),
    ],
    reply: "On the record.",
  },
  /* Episode 2's third question (fix brief §8.5), and its door (§6): how
     Bhasin knows where the phone is. Mummy's map shows the pin, B-14, Gate
     2 side: the door the player is sitting behind. */
  {
    kind: "file",
    id: "q5b",
    episode: 2,
    ask: "How does Bhasin know where this phone is?",
    whereToLook: ["whatsapp", "settings"],
    hints: [
      "Who in this phone's life did Bhasin do favours for this autumn?",
      "Mummy's chat: the phone he gave her in October, and what it showed her tonight at 12:02.",
      "Bhasin set up Mummy's phone, and tonight it shows this one at B-14. Table Mummy's 14 October, her map at 12:02, and Bhasin's voice note.",
    ],
    say: {
      line: "Bhasin set up {whose} phone in October. Tonight it shows this one at {where}, and he's watching.",
      blanks: {
        whose: ["Mummy's", "Meera's", "Kunal's"],
        where: ["B-14, Gate 2 side", "Banyan Farms", "Kalkaji"],
      },
      learn: { "Mummy's": ["mummy-phone"], "B-14, Gate 2 side": ["mummy-pin"] },
    },
    claims: [
      {
        id: "truth",
        words: { whose: "Mummy's", where: "B-14, Gate 2 side" },
        text: "Bhasin set up Mummy's phone in October. Tonight it shows this one at B-14, Gate 2 side, and he's watching.",
        proof: ["mummy-phone", "mummy-pin", "bhasin-vn"],
        facts: [
          { fact: "Bhasin gave Mummy a phone with location on", what: "whose phone Bhasin set up", by: ["mummy-phone"] },
          { fact: "Tonight it shows this phone at B-14, Gate 2 side", what: "where it shows this phone", by: ["mummy-pin"] },
          { fact: "He's watching it", what: "that Bhasin is watching", by: ["bhasin-vn", "bhasin-home", "bhasin-dark", "mummy-findmy"] },
        ],
        also: ["find-my", "mummy-bill", "mummy-visit"],
        reply: "On 14 October Bhasin gave Mummy a phone with location sharing on. At 12:02 she pressed Find My, and it showed one pin: B-14, Gate 2 side. He rang her within the minute.",
      },
      refuse("meera", { whose: "Meera's", where: "*" }, "Meera blocked this phone in September. Whose phone did Bhasin pay for in October?"),
      refuse("kunal", { whose: "Kunal's", where: "*" }, "Kunal's phone isn't watching this one. Whose did Bhasin set up in October?"),
      refuse("farm", { whose: "*", where: "Banyan Farms" }, "Look at Mummy's map at 12:02. Where's the pin?"),
      refuse("kalkaji", { whose: "*", where: "Kalkaji" }, "Kalkaji is where M lives. Look at Mummy's map at 12:02."),
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
      "Nitin sent you what he kept. Or set Ramesh's 1:49 beside Nitin's 1:53. Safari remembers what he searched at 1:54.",
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
        orProof: [["nitin-reply", "sameer-room"], ["nitin-152", "search-156"]],
        facts: [
          { fact: "Sameer told Nitin Dilip had already gone", what: "what Sameer told Nitin", by: ["nitin-152", "nitin-reply"] },
          { fact: "He knew Dilip was still there", what: "that Sameer knew Dilip hadn't gone", by: ["sameer-room", "search-156"] },
        ],
        // Why he lied, for anyone who looks (fix brief H-07): what a hospital would have meant.
        also: ["search-police", "search-mlc", "nitin-car", "nitin-gate", "nitin-back", "swift", "left-empty", "call-206", "site-plan", "doctor", "no-112"],
        moment: "He knew.",
        reply: "At 1:49 he was in the room with Dilip. At 1:52 he told Nitin Dilip had gone. At 1:54 he was reading why a bullet wound means a police case; at 1:56, still looking at ambulances. A week later, Nitin sent it back at the same minute, on purpose.",
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
      "Notes › “Agar kuch hua” is locked with his birthday, day then month. Settings has it. Watch the whole clip, to the end.",
      "He lit it, on Bhasin's orders, and what burned was an empty mattress. Table the whole fire and the note's 3:31 line (password 1403).",
    ],
    say: {
      line: "At 4:47 Sameer {role} on {whose} orders, and what burned was {what}.",
      blanks: {
        role: ["lit the fire", "only watched"],
        whose: ["Bhasin's", "Kunal's"],
        what: ["Dilip's body, rolled in a mattress", "an empty mattress, sheets and a shirt"],
      },
      learn: { "lit the fire": ["fire-original", "kunal-jerrycan", "vn-burned"], "an empty mattress, sheets and a shirt": ["fire-original"] },
    },
    claims: [
      {
        id: "truth",
        words: { role: "lit the fire", whose: "Bhasin's", what: "an empty mattress, sheets and a shirt" },
        text: "At 4:47 Sameer lit the fire on Bhasin's orders, and what burned was an empty mattress, sheets and a shirt.",
        proof: ["fire-original", "note-text"],
        // The whole clip can be deleted (RAAKH-V3 §17); the 2:55 car and his own voice note can't.
        orProof: [["fire-original", "call-331"], ["fire-original", "kunal-jerrycan"], ["car-255", "fire-clip", "vn-burned"]],
        facts: [
          { fact: "Sameer lit the fire", what: "who lit it", by: ["fire-original", "kunal-jerrycan", "vn-burned"] },
          { fact: "On Bhasin's orders", what: "whose orders he was following", by: ["note-text", "call-331", "kunal-jerrycan", "car-255"] },
          /* The whole clip shows it: the mattress burning open, empty (and the
             kada on the hand that lit it). Or reason it: the boy left in the
             2:55 car, his waistcoat with him, two hours before the fire. */
          { fact: "What burned was an empty mattress", what: "what burned", by: ["fire-original", ["car-255", "fire-clip"]] },
        ],
        also: ["fire-clip", "not-speaking"],
        moment: "Empty.",
        reply: "…his own hand, with the kada, sets down a jerrycan beside a rolled mattress. “Uski shirt bhi.” Bhasin told him the boy was inside. He didn't look. When the mattress burns open, it's empty.",
        sets: ["did:fire-empty"],
      },
      /* Sameer's version: he lit it (his own voice note says so), and he
         believes what he was told was in it. */
      {
        id: "version",
        words: { role: "lit the fire", whose: "Bhasin's", what: "Dilip's body, rolled in a mattress" },
        text: "At 4:47 Sameer lit the fire on Bhasin's orders, and what burned was Dilip's body, rolled in a mattress.",
        proof: ["vn-burned", "note-text"],
        orProof: [["vn-burned", "fire-clip"]],
        reply: ON_RECORD,
        version: true,
      },
      refuse("watched", { role: "only watched", whose: "*", what: "*" }, "Listen to his Monday voice note to M. He says who lit it."),
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
      "Dilip, alive; Nitin's chat is the one place 1:52 still exists. Table the bag photo, the nurse's voice note, and Nitin's copy of 1:52.",
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
        proof: ["belongings", "anita-voice", "nitin-152"],
        orProof: [["slip", "badge", "anita", "nitin-152"], ["belongings", "anita-voice", "for-m", "lie-proved"]],
        facts: [
          ...PATIENT,
          { fact: "Nitin's chat is the one place 1:52 still exists", what: "why the list stops at Nitin", by: ["nitin-152", ["for-m", "lie-proved"]] },
        ],
        also: ["car-255", "search-ticks", "fire-original", "dilip-video", "for-m"],
        moment: "Alive.",
        reply: "Dilip Kumar Mahto is alive, in a room in Fatehpur Beri, under somebody else's name. He has been there a week. Bhasin didn't kill him. He hid him, and let Sameer believe the rest. “For M” stops where it does because item 4 was the one place 1:52 still exists. It was also his own lie. He couldn't finish writing it. They move him at seven.",
      },
      {
        id: "version",
        words: { who: "Dilip", why: "he ran out of time" },
        text: "The patient is Dilip, alive. “For M” stops at Nitin because he ran out of time.",
        proof: ["belongings", "anita-voice", "for-m", "vn-phone"],
        facts: [...PATIENT, { fact: "He ran out of time", what: "why the list stops at Nitin", by: [["for-m", "vn-phone"]] }],
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
     origin; "me" has to be shown with the kada (fix brief §6), and so does
     where. "By seven" (fix brief H-13): the 4:55 is this afternoon's train,
     so by seven its player is only gone. */
  {
    kind: "file",
    id: "qf",
    episode: 3,
    final: true,
    eyebrow: "Q1, again",
    requires: ["did:reveal-done"],
    ask: "Who is S, and where is he going?",
    whereToLook: ["camera", "notes", "whatsapp", "mail"],
    hints: [
      "You've seen who S is. Where will you be by seven?",
      "“Me” needs the photo you took and the same kada on his hand: the whole fire, 12:29, or his own selfie. Room 6 needs Sister Anita, her slip, or Dilip's voice. Gate 2 needs Bhasin's terms. Gone needs the ticket.",
      "There's no right answer here. There is only what you do.",
    ],
    say: {
      line: "S is {who}, and by seven I'll be {where}.",
      blanks: {
        who: ["me", "Sameer Khurrana"],
        where: ["at Fatehpur Beri", "at Gate 2, with the phone", "gone, with the phone"],
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
        text: "S is me, and by seven I'll be at Fatehpur Beri.",
        proof: ["camera-photo", "fire-original", "slip"],
        orProof: each(KADA, BEDI.map((b) => [b])),
        facts: [ME, { fact: "Dilip is at Bedi Nursing Home, Fatehpur Beri", what: "where Dilip is", by: BEDI }],
        ending: "room6",
        confirm: "You go to him. Whatever you say there goes on the record.",
        reply: "",
      },
      {
        id: "trade",
        words: { who: "me", where: "at Gate 2, with the phone" },
        text: "S is me, and by seven I'll be at Gate 2, with the phone.",
        proof: ["camera-photo", "fire-original", "bhasin-terms"],
        orProof: each(KADA, [["bhasin-terms"]]),
        facts: [ME, { fact: "Bhasin wants the phone at Gate 2", what: "what Bhasin asked for", by: ["bhasin-terms"] }],
        ending: "trade",
        confirm: "Bhasin gets the phone. Dilip gets the bus. You get the train.",
        reply: "",
        unless: ["did:bhasin-left"],
      },
      refuse("trade-gone", { who: "me", where: "at Gate 2, with the phone" }, "Bhasin's car has gone. Nobody is waiting at Gate 2.", { aloud: true }),
      {
        id: "train",
        words: { who: "me", where: "gone, with the phone" },
        text: "S is me, and by seven I'll be gone, with the phone.",
        proof: ["camera-photo", "fire-original", "ticket"],
        orProof: each(KADA, [["ticket"]]),
        facts: [ME, { fact: "The 4:55 to Mumbai is booked in his name", what: "where you'd go", by: ["ticket"] }],
        ending: "train",
        confirm: "You keep the phone and go. The 4:55 leaves this afternoon. Bhasin keeps Dilip until he has the phone.",
        reply: "",
      },
    ],
    reply: "On the record.",
  },
];

/** Episode 1's sentence, which the last question turns back into for "Sameer Khurrana". */
export const FIRST_SENTENCE = "S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he's on a train to Mumbai.";
