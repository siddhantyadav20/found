import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Question, Story } from "@/content/types";
import { add, answer, hint, newCase, see, TOO_MUCH, WRONG, type CaseState } from "@/lib/game/engine";

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
    { id: "poster", device: "hers", app: "whatsapp", label: "A missing-person poster" },
    { id: "portrait", device: "hers", app: "photos", label: "A waiter with a tray, 9:48 PM" },
    { id: "invoice", device: "hers", app: "messages", label: "An invoice" },
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
  it("wants exactly what proves it, and says so when there's more", () => {
    const q = ep.questions[0];
    const s = found("poster", "portrait", "invoice");
    expect(answer(ep, s, q.id, ["poster", "portrait"]).ok).toBe(true);
    expect(answer(ep, s, q.id, ["poster"]).ok).toBe(false);
    expect(answer(ep, s, q.id, ["poster", "portrait", "invoice"]).reply).toBe(TOO_MUCH);
    expect(answer(ep, s, q.id, ["invoice"]).reply).toBe(WRONG);

    // And nothing can be tabled that was never found.
    expect(answer(ep, start(), q.id, ["poster", "portrait"]).ok).toBe(false);
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

describe("the two lanes", () => {
  const story = withQuestions([
    {
      kind: "timeline",
      id: "who-used-it",
      ask: "What did the phone do while its owner was elsewhere?",
      episode: 1,
      whereToLook: ["notes"],
      hints: ["a", "b", "c"],
      rows: [
        { id: "away", at: "22:40", text: "Out of the house", lane: "her", evidence: "story" },
        { id: "edit", at: "23:02", text: "A video was trimmed", lane: "phone", evidence: "lure" },
        { id: "delete", at: "22:48", text: "A clip was deleted", lane: "phone", evidence: "list" },
      ],
      reply: "Somebody was busy on it.",
    },
  ]);

  it("is right only when every impossible act is on the phone's side", () => {
    // The board holds what has been found: the three rows' evidence.
    const s = ["story", "lure", "list"].reduce((acc, id) => add(acc, `saw:${id}`), start());
    expect(answer(story, s, "who-used-it", ["edit", "delete"]).ok).toBe(true);
    expect(answer(story, s, "who-used-it", ["edit"]).ok).toBe(false);
    expect(answer(story, s, "who-used-it", ["edit", "delete", "terrace"]).ok).toBe(false);
  });

  it("judges only the rows the player has actually found", () => {
    // Only the edit is known, so only the edit belongs on the phone's side.
    const partial = add(start(), "saw:lure");
    expect(answer(story, partial, "who-used-it", ["edit"]).ok).toBe(true);
    expect(answer(story, partial, "who-used-it", ["edit", "delete"]).ok).toBe(false);
  });
});

describe("true or bluff", () => {
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
    expect(s.ledger).toEqual([]);
  });

  it("names at least one app to look in, for every question", () => {
    for (const q of ep.questions) {
      expect(q.whereToLook.length, q.id).toBeGreaterThan(0);
      expect(new Set(q.hints).size, q.id).toBe(3);
    }
  });
});
