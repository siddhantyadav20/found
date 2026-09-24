import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Question, Story } from "@/content/types";
import {
  add,
  answer,
  filedClaim,
  filedClaims,
  hint,
  needsRevisit,
  newCase,
  offeredClaims,
  openApp,
  settle,
  unseenIn,
  openQuestion,
  PARTLY,
  see,
  sideQuestions,
  STRUCK,
  TOO_MUCH,
  WRONG,
  type CaseState,
} from "@/lib/game/engine";

/**
 * The four kinds of question, judged away from the DOM. A wrong answer costs
 * nothing but being wrong; a hint never costs anything at all; and a claim is
 * only true when the player actually did it.
 */

/**
 * A story is just data, so a test can write its own evidence and questions.
 * These are made up, on the chapter's own phone.
 */
const ep: Story = {
  ...STORIES.shagun,
  evidence: [
    { id: "poster", device: "owner", app: "whatsapp", label: "A missing-person poster" },
    { id: "portrait", device: "owner", app: "photos", label: "A waiter with a tray, 9:48 PM" },
    { id: "invoice", device: "owner", app: "messages", label: "An invoice" },
  ],
  questions: [
    {
      kind: "pick",
      id: "who-is-he",
      ask: "Who is the boy in the poster?",
      episode: 1,
      whereToLook: ["whatsapp", "photos"],
      hints: ["The poster has a face on it.", "So does a photograph from the wedding.", "The poster and the 9:48 PM portrait."],
      proof: ["poster", "portrait"],
      reply: "The waiter from 9:48 PM.",
      sets: ["did:named-him"],
    },
  ],
};
const start = () => newCase("t", 0);

/** A player who has found these things, which is the only way to table them. */
const found = (...ids: string[]): CaseState => ids.reduce((s, id) => see(ep, s, id), start());

const withQuestions = (questions: Question[]): Story => ({ ...ep, questions });

describe("picking the proof", () => {
  it("wants a whole route, and says what's wrong when it isn't one", () => {
    const q = ep.questions[0];
    const s = found("poster", "portrait", "invoice");
    expect(answer(ep, s, q.id, ["poster", "portrait"]).ok).toBe(true);
    expect(answer(ep, s, q.id, ["poster"]).reply).toBe(PARTLY);
    expect(answer(ep, s, q.id, ["poster", "portrait", "invoice"]).reply).toBe(TOO_MUCH);
    expect(answer(ep, s, q.id, ["invoice"]).reply).toBe(WRONG);

    // And nothing can be tabled that was never found.
    expect(answer(ep, start(), q.id, ["poster", "portrait"]).ok).toBe(false);
  });

  it("takes more true proof than a route needs, but nothing that proves nothing", () => {
    const story: Story = {
      ...ep,
      evidence: [...ep.evidence, { id: "caterer", device: "owner", app: "whatsapp", label: "The caterer: he hasn't come in" }],
      questions: [{ ...(ep.questions[0] as Extract<Question, { kind: "pick" }>), orProof: [["poster", "caterer"]] }],
    };
    const s = ["poster", "portrait", "caterer", "invoice"].reduce((acc, id) => see(story, acc, id), start());
    expect(answer(story, s, "who-is-he", ["poster", "caterer"]).ok).toBe(true);
    // Both routes at once: everything on the table proves it.
    expect(answer(story, s, "who-is-he", ["poster", "portrait", "caterer"]).ok).toBe(true);
    // A whole route, beside something that proves nothing.
    expect(answer(story, s, "who-is-he", ["poster", "caterer", "invoice"]).reply).toBe(TOO_MUCH);
    // Nothing but true things, and still no whole route.
    expect(answer(story, s, "who-is-he", ["portrait", "caterer"]).reply).toBe(PARTLY);
  });

  /* What a player tabled in the playtest of 2026-09-24 (PLAYTEST-SHAGUN.md
     #12–13): every item true, and each once turned away. */
  describe("in the chapter, proved more than it needs", () => {
    const shagun = STORIES.shagun;
    const has = (...ids: string[]): CaseState => {
      for (const id of ids) expect(shagun.evidence.some((e) => e.id === id), id).toBe(true);
      return add(start(), "ep:2", "ep:3", ...ids.map((id) => `saw:${id}` as const));
    };

    it("takes the Apple Account, his Instagram and the invoice for whose phone it is", () => {
      const s = has("apple-account", "sk-films", "invoice", "poster");
      expect(answer(shagun, s, "q1", ["apple-account", "sk-films", "invoice"]).ok).toBe(true);
      expect(answer(shagun, s, "q1", ["apple-account", "sk-films", "poster"]).reply).toBe(TOO_MUCH);
    });

    it("takes all three voice notes with the fire for his version", () => {
      const s = has("vn-kunal", "vn-hospital", "vn-burned", "fire-clip");
      expect(answer(shagun, s, "q3", { claim: "his", proof: ["vn-kunal", "vn-hospital", "vn-burned", "fire-clip"] }).ok).toBe(true);
    });

    it("takes the 12:29 photo, the shot list and Kunal's promise for the back lawn", () => {
      const s = has("bts", "shot-list", "kunal-papa");
      expect(answer(shagun, s, "q5", ["bts", "shot-list", "kunal-papa"]).ok).toBe(true);
    });

    it("takes Nitin's copy of 1:52 as the edit it is", () => {
      const s = has("frame", "fire-original", "nitin-shot-152");
      expect(answer(shagun, s, "q13", { claim: "counter", proof: ["frame", "fire-original", "nitin-shot-152"] }).ok).toBe(true);
    });
  });

  it("sets what the script says it sets, once", () => {
    const q = ep.questions[0];
    const after = answer(ep, found("poster", "portrait"), q.id, ["poster", "portrait"]).state;
    expect(after.flags).toContain("did:named-him");
    expect(answer(ep, after, q.id, ["poster", "portrait"]).ok).toBe(false);
  });
});

describe("typing a name", () => {
  const story = withQuestions([
    {
      kind: "type",
      id: "whose-number",
      ask: "Whose number keeps ringing?",
      episode: 1,
      whereToLook: ["phone"],
      hints: ["a", "b", "c"],
      accepts: ["his brother", "Raju", "Raju Mahto"],
      reply: "His brother.",
    },
  ]);

  it("forgives case, spacing and punctuation", () => {
    for (const said of ["Raju", "  raju  ", "RAJU MAHTO", "his brother"])
      expect(answer(story, start(), "whose-number", said).ok, said).toBe(true);
    expect(answer(story, start(), "whose-number", "the police").ok).toBe(false);
  });
});

describe("the lanes", () => {
  const story = withQuestions([
    {
      kind: "timeline",
      id: "the-interval",
      ask: "Who was doing what, and when?",
      episode: 1,
      whereToLook: ["whatsapp"],
      hints: ["a", "b", "c"],
      lanes: [
        { id: "dilip", label: "Dilip" },
        { id: "sameer", label: "Sameer" },
        { id: "nitin", label: "Nitin" },
      ],
      rows: [
        { id: "pain", at: "01:07", text: "“Aap aa rahe ho na?”", lane: "dilip", evidence: "poster" },
        { id: "said", at: "01:52", text: "A message that isn't there", lane: "sameer", evidence: "portrait" },
        { id: "back", at: "01:53", text: "“Agar le gaye hain…”", lane: "nitin", evidence: "invoice" },
      ],
      reply: "Three people, one interval.",
    },
  ]);
  const all3 = () => found("poster", "portrait", "invoice");

  it("is right only when every row sits in its own lane", () => {
    expect(answer(story, all3(), "the-interval", ["pain@dilip", "said@sameer", "back@nitin"]).ok).toBe(true);
    expect(answer(story, all3(), "the-interval", ["pain@dilip", "said@nitin", "back@sameer"]).ok).toBe(false);
    expect(answer(story, all3(), "the-interval", ["pain@dilip", "said@sameer"]).ok).toBe(false);
    expect(answer(story, all3(), "the-interval", ["pain@dilip", "said@sameer", "back@nitin", "back@dilip"]).ok).toBe(false);
  });

  it("judges only the rows the player has actually found", () => {
    const partial = found("portrait");
    expect(answer(story, partial, "the-interval", ["said@sameer"]).ok).toBe(true);
    expect(answer(story, partial, "the-interval", ["said@sameer", "pain@dilip"]).ok).toBe(false);
  });
});

describe("filing a claim, and the owner's version of it", () => {
  const story = withQuestions([
    {
      kind: "file",
      id: "the-car",
      ask: "Why did the car leave empty?",
      episode: 1,
      whereToLook: ["whatsapp"],
      hints: ["a", "b", "c"],
      claims: [
        { id: "guards", text: "Bhasin's people turned it away.", proof: ["poster"], reply: "Filed.", version: true },
        {
          id: "told",
          text: "Sameer told Nitin that Dilip had gone.",
          proof: ["portrait", "invoice"],
          reply: "Filed.",
          sets: ["link:lie"],
        },
      ],
      reply: "Filed.",
      sets: ["did:car-asked"],
      reopenWhen: ["saw:portrait", "saw:invoice"],
    },
  ]);

  it("accepts his version, with its proof, and never calls it wrong", () => {
    const r = answer(story, found("poster"), "the-car", { claim: "guards", proof: ["poster"] });
    expect(r.ok).toBe(true);
    expect(r.state.flags).toEqual(expect.arrayContaining(["ask:the-car", "claim:the-car:guards", "did:car-asked"]));
    expect(r.state.flags).not.toContain("link:lie");
    expect(filedClaim(story.questions[0], r.state)?.id).toBe("guards");
  });

  it("wants the proof that goes with the claim, not any proof", () => {
    const s = found("poster", "portrait", "invoice");
    expect(answer(story, s, "the-car", { claim: "told", proof: ["poster"] }).reply).toBe(WRONG);
    expect(answer(story, s, "the-car", { claim: "told", proof: ["portrait", "invoice", "poster"] }).reply).toBe(TOO_MUCH);
    expect(answer(story, s, "the-car", { claim: "nobody", proof: ["poster"] }).ok).toBe(false);
    expect(answer(story, s, "the-car", ["poster"]).ok).toBe(false);
  });

  it("comes back as Revisit once something found says otherwise, and files the truth over it", () => {
    const q = story.questions[0];
    let s = answer(story, found("poster"), "the-car", { claim: "guards", proof: ["poster"] }).state;
    expect(needsRevisit(q, s)).toBe(false);
    s = see(story, see(story, s, "portrait"), "invoice");
    expect(needsRevisit(q, s)).toBe(true);
    // Not a must: it's offered on the side, and nothing waits on it.
    expect(sideQuestions(story, s).map((x) => x.id)).toEqual(["the-car"]);
    expect(openQuestion(story, s)).toBeUndefined();

    // The struck line can't be filed again.
    expect(answer(story, s, "the-car", { claim: "guards", proof: ["poster"] }).reply).toBe(STRUCK);
    const after = answer(story, s, "the-car", { claim: "told", proof: ["portrait", "invoice"] }).state;
    expect(filedClaims(q, after).map((c) => c.id)).toEqual(["guards", "told"]);
    expect(after.flags).toContain("link:lie");
    expect(needsRevisit(q, after)).toBe(false);
    expect(sideQuestions(story, after)).toEqual([]);
  });

  it("files the truth straight away for a player who found it first", () => {
    const s = answer(story, found("portrait", "invoice"), "the-car", { claim: "told", proof: ["portrait", "invoice"] }).state;
    expect(s.flags).toContain("link:lie");
    expect(needsRevisit(story.questions[0], s)).toBe(false);
  });

  it("puts a Revisit that must be done in front of everything, whatever the episode", () => {
    const must = withQuestions([{ ...story.questions[0], mustRevisit: true } as Question, { ...ep.questions[0], episode: 2 }]);
    let s = answer(must, found("poster"), "the-car", { claim: "guards", proof: ["poster"] }).state;
    s = add(see(must, see(must, s, "portrait"), "invoice"), "ep:2");
    expect(openQuestion(must, s)?.id).toBe("the-car");
    expect(sideQuestions(must, s)).toEqual([]);
  });
});

describe("a question on the side", () => {
  const story = withQuestions([{ ...ep.questions[0], optional: true }]);

  it("never holds the episode up, and is offered until it's answered", () => {
    expect(openQuestion(story, start())).toBeUndefined();
    expect(sideQuestions(story, start()).map((q) => q.id)).toEqual(["who-is-he"]);
    const s = answer(story, found("poster", "portrait"), "who-is-he", ["poster", "portrait"]).state;
    expect(sideQuestions(story, s)).toEqual([]);
  });
});

describe("proven or not", () => {
  const story = withQuestions([
    {
      kind: "claims",
      id: "against-you",
      ask: "Which of these is true?",
      episode: 1,
      whereToLook: ["messages"],
      hints: ["a", "b", "c"],
      claims: [
        // Settled by something that can't be looked at: nothing to check first.
        { id: "note", text: "You opened a locked note.", trueWhen: ["did:unlocked-note"], proof: "none" },
        { id: "reply", text: "You replied from his phone.", trueWhen: ["did:replied"], proof: "poster" },
        { id: "invented", text: "You were at the wedding.", proof: "none" },
      ],
      reply: "The true ones are the ones you did.",
    },
  ]);

  it("depends on what the player actually did", () => {
    // Nothing is judged until what settles it has been looked at.
    expect(answer(story, start(), "against-you", []).ok).toBe(false);
    const checked = () => add(start(), "saw:poster");

    // A player who did none of it: every claim is a bluff.
    expect(answer(story, checked(), "against-you", []).ok).toBe(true);

    const opened = add(checked(), "did:unlocked-note");
    expect(answer(story, opened, "against-you", ["note"]).ok).toBe(true);
    expect(answer(story, opened, "against-you", []).ok).toBe(false);
    expect(answer(story, opened, "against-you", ["note", "invented"]).ok).toBe(false);
  });
});

describe("help", () => {
  it("steps from a nudge to the answer, and is never counted against anyone", () => {
    let s = start();
    const q = ep.questions[0];
    for (const tier of [1, 2, 3, 3] as const) {
      const h = hint(ep, s, q.id)!;
      expect(h.tier).toBe(tier);
      expect(h.text).toBe(q.hints[tier - 1]);
      s = h.state;
    }
    // Asking changes nothing but the count of hints taken.
    expect(s.flags.every((f) => f.startsWith("hint:"))).toBe(true);
  });

  it("names at least one app to look in, for every question", () => {
    for (const q of ep.questions) {
      expect(q.whereToLook.length, q.id).toBeGreaterThan(0);
      expect(new Set(q.hints).size, q.id).toBe(3);
    }
  });
});

describe("finding things", () => {
  const phone: Story = {
    ...STORIES.shagun,
    evidence: [
      { id: "on-screen", device: "owner", app: "settings", label: "Seen on opening" },
      { id: "in-a-chat", device: "owner", app: "whatsapp", label: "Inside a chat", within: true },
      { id: "by-hand", device: "owner", app: "photos", label: "Found by doing", manual: true },
      { id: "reverted", device: "owner", app: "photos", label: "The original", manual: true, foundBy: ["did:reverted-fire"], requires: ["ep:3"] },
    ],
  };

  it("finds on opening an app only what's on its surface", () => {
    expect(openApp(phone, start(), "settings").flags).toContain("saw:on-screen");
    expect(openApp(phone, start(), "whatsapp").flags).not.toContain("saw:in-a-chat");
    expect(see(phone, start(), "in-a-chat").flags).toContain("saw:in-a-chat");
  });

  it("badges what's inside something, never what has to be done by hand", () => {
    expect(unseenIn(phone, start(), "whatsapp")).toBe(1);
    expect(unseenIn(phone, start(), "photos")).toBe(0);
  });

  it("counts an act done in an earlier episode once its own episode comes", () => {
    const early = add(start(), "did:reverted-fire");
    expect(settle(phone, early).flags).not.toContain("saw:reverted");
    expect(settle(phone, add(early, "ep:2", "ep:3")).flags).toContain("saw:reverted");
  });
});

describe("what the player is offered to file", () => {
  const car = {
    kind: "file",
    id: "car",
    ask: "Why did the car leave empty?",
    episode: 1,
    whereToLook: ["whatsapp"],
    hints: ["a", "b", "c"],
    claims: [
      { id: "his", text: "Bhasin's people turned it away.", proof: ["poster"], reply: "Filed.", version: true },
      { id: "true", text: "Sameer told Nitin.", proof: ["portrait", "invoice"], reply: "Filed." },
    ],
    reply: "Filed.",
  } as const satisfies Question;

  it("is only what they could prove with what they've found, so no claim gives the next one away", () => {
    expect(offeredClaims(car, start()).map((c) => c.id)).toEqual([]);
    expect(offeredClaims(car, found("poster")).map((c) => c.id)).toEqual(["his"]);
    expect(offeredClaims(car, found("poster", "portrait")).map((c) => c.id)).toEqual(["his"]);
    expect(offeredClaims(car, found("poster", "portrait", "invoice")).map((c) => c.id)).toEqual(["his", "true"]);
  });
});
