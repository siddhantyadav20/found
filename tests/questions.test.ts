import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Question, Story } from "@/content/types";
import { add, answer, hint, newCase, see, TOO_MUCH, WRONG, type CaseState } from "@/lib/game/engine";

/**
 * The four kinds of question, judged away from the DOM. A wrong answer costs
 * nothing but being wrong; a hint never costs anything at all; and a claim is
 * only true when the player actually handed it over.
 */

const ep = STORIES["dont-cut-the-call"];
const start = () => newCase("t", 0);

/** A player who has found these things, which is the only way to table them. */
const found = (...ids: string[]): CaseState => ids.reduce((s, id) => see(ep, s, id), start());

/** A story is just data, so a test can write its own questions. */
const withQuestions = (questions: Question[]): Story => ({ ...ep, questions });

describe("picking the proof", () => {
  it("wants exactly what proves it, and says so when there's more", () => {
    const q = ep.questions[0];
    const s = found("alert", "wallpaper", "note");
    expect(answer(ep, s, q.id, ["alert", "wallpaper"]).ok).toBe(true);
    expect(answer(ep, s, q.id, ["alert"]).ok).toBe(false);
    expect(answer(ep, s, q.id, ["alert", "wallpaper", "note"]).reply).toBe(TOO_MUCH);
    expect(answer(ep, s, q.id, ["note"]).reply).toBe(WRONG);

    // And nothing can be tabled that was never found.
    expect(answer(ep, start(), q.id, ["alert", "wallpaper"]).ok).toBe(false);
  });

  it("sets what the script says it sets, once", () => {
    const q = ep.questions[0];
    const after = answer(ep, found("alert", "wallpaper"), q.id, ["alert", "wallpaper"]).state;
    expect(after.flags).toContain("did:named-her");
    expect(answer(ep, after, q.id, ["alert", "wallpaper"]).ok).toBe(false);
  });
});

describe("typing a name", () => {
  const story = withQuestions([
    {
      kind: "type",
      id: "whose-number",
      ask: "Whose number is 98204 57713?",
      episode: 1,
      whereToLook: ["phone"],
      hints: ["a", "b", "c"],
      accepts: ["his mother", "Rukhsana", "Rukhsana Ansari"],
      reply: "His mother.",
    },
  ]);

  it("forgives case, spacing and punctuation", () => {
    for (const said of ["Rukhsana", "  rukhsana  ", "RUKHSANA ANSARI", "his mother"])
      expect(answer(story, start(), "whose-number", said).ok, said).toBe(true);
    expect(answer(story, start(), "whose-number", "the police").ok).toBe(false);
  });
});

describe("the two lanes", () => {
  const story = withQuestions([
    {
      kind: "timeline",
      id: "who-used-it",
      ask: "Who used this phone after midnight?",
      episode: 1,
      whereToLook: ["notes"],
      hints: ["a", "b", "c"],
      rows: [
        { id: "terrace", at: "00:37", text: "On the terrace", lane: "her", evidence: "story" },
        { id: "edit", at: "00:39", text: "The note was edited", lane: "phone", evidence: "lure" },
        { id: "delete", at: "00:37", text: "A photo was deleted", lane: "phone", evidence: "list" },
      ],
      reply: "She was in Dadar. Her phone was not.",
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
        { id: "pin", text: "You opened her password.", trueWhen: ["did:typed-password"], proof: "messages" },
        { id: "voice", text: "We have your voice.", trueWhen: ["did:unmuted"], proof: "call" },
        { id: "invented", text: "You were in the building.", proof: "none" },
      ],
      reply: "The true ones are the ones you did.",
    },
  ]);

  it("depends on what the player actually handed over", () => {
    // Nothing is judged until what settles it has been looked at.
    expect(answer(story, start(), "against-you", []).ok).toBe(false);
    const checked = () => add(start(), "saw:call");

    // A player who gave them nothing: every charge is a bluff.
    expect(answer(story, checked(), "against-you", []).ok).toBe(true);

    const typed = add(checked(), "did:typed-password");
    expect(answer(story, typed, "against-you", ["pin"]).ok).toBe(true);
    expect(answer(story, typed, "against-you", []).ok).toBe(false);
    expect(answer(story, typed, "against-you", ["pin", "invented"]).ok).toBe(false);
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
