import { describe, expect, it } from "vitest";

import { CASES, CASE_IDS, isCaseId } from "@/content/cases";
import { STORIES } from "@/content/stories";
import { answer, hint, newCase, see, tryUnlock, type CaseState } from "@/lib/found/engine";
import { cleanDropName, displayName, dropLabel, NAME_MAX } from "@/lib/found/dropName";
import { SHARING, eventsFor, isFoundEvent } from "@/lib/found/events";
import { saveKey } from "@/lib/found/progress";
import { MARK_EMOJI, resultOf, shareText } from "@/lib/found/result";
import { MIN_ANSWERS, fasterThan, percentages } from "@/lib/found/store";

/**
 * The loop that brings new players: the result a finisher shares, the
 * envelope a friend receives, and what everyone else did. None of it may
 * spoil the case, and none of it may say something about too few people.
 */

const ep = STORIES["low-battery"];
const start = () => newCase({ gender: "girl", name: "Noor" }, "test", 0);

/** Through the passcode and the first question, the way the player chooses. */
function firstTwo({ wrongCode = false, wrongPick = false, hinted = false } = {}): CaseState {
  let s = start();
  if (wrongCode) s = tryUnlock(ep, s, "passcode", "0000").state;
  s = tryUnlock(ep, s, "passcode", "140306").state;
  s = see(ep, s, "group-home");
  s = see(ep, s, "health-walk");
  if (hinted) s = hint(ep, s, "went-home")!.state;
  if (wrongPick) s = answer(ep, s, "went-home", ["group-home"]).state;
  return answer(ep, s, "went-home", ["health-walk"]).state;
}

describe("the shared result", () => {
  it("marks each solved puzzle in the order it was solved", () => {
    expect(resultOf(ep, firstTwo(), 1).marks).toEqual(["clean", "clean"]);
    expect(resultOf(ep, firstTwo({ wrongCode: true }), 1).marks).toEqual(["wrong", "clean"]);
    expect(resultOf(ep, firstTwo({ hinted: true }), 1).marks).toEqual(["clean", "hinted"]);
    expect(resultOf(ep, firstTwo({ wrongPick: true }), 1).marks).toEqual(["clean", "wrong"]);
    expect(resultOf(ep, firstTwo({ hinted: true }), 1).hints).toBe(1);
  });

  it("keeps the episodes apart", () => {
    const s = firstTwo();
    const later: CaseState = { ...s, flags: [...s.flags, "ep:2", "solved:e2-who"] };
    expect(resultOf(ep, later, 1).marks).toHaveLength(2);
    expect(resultOf(ep, later, 2).marks).toEqual(["clean"]);
  });

  it("times an episode from the envelope to the battery dying", () => {
    const s: CaseState = { ...firstTwo(), started: 0, at: { dead: 31 * 60_000 } };
    expect(resultOf(ep, s, 1).minutes).toBe(31);
    expect(resultOf(ep, firstTwo(), 1).minutes).toBeNull();
  });

  it("names no puzzle and gives no answer away", () => {
    const text = shareText(ep.title, resultOf(ep, firstTwo({ hinted: true }), 1), "https://found.test/d/Abcd2345");
    const lines = text.split("\n");
    expect(lines[0]).toBe("Someone left this for you. Don't unlock it.");
    expect(lines[1]).toBe("https://found.test/d/Abcd2345");
    expect(text).toContain(`${MARK_EMOJI.clean}${MARK_EMOJI.hinted}`);
    expect(text).toContain("I got Noor");
    for (const d of ep.deductions) expect(text).not.toContain(d.question);
    for (const l of ep.locks) expect(text).not.toContain(l.answer);
  });
});

describe("the name on a passed-on envelope", () => {
  it("keeps letters in any script, and nothing else", () => {
    expect(cleanDropName("  ananya  ")).toBe("ANANYA");
    expect(cleanDropName("Ananya123!! <b>")).toBe("ANANYA B");
    expect(cleanDropName("अनन्या")).toBe("अनन्या");
    // Letters only, then cut to what the label holds.
    expect(cleanDropName("https://evil.example")).toBe("HTTPS EVIL EXAMP");
    expect(cleanDropName(42)).toBe("");
    expect(Array.from(cleanDropName("a".repeat(40)))).toHaveLength(NAME_MAX);
  });

  it("reads back as a name, and falls back to the story's own label", () => {
    expect(displayName("ANANYA RAO")).toBe("Ananya Rao");
    expect(dropLabel("ANANYA", ["TO YOU", "BY HAND"])).toEqual(["TO ANANYA", "BY HAND"]);
    expect(dropLabel("", ep.envelope.label)).toEqual(ep.envelope.label);
  });
});

describe("what others did", () => {
  it("says nothing until enough people have answered", () => {
    expect(percentages({ lie: 30, truth: MIN_ANSWERS - 31 })).toBeNull();
    expect(percentages({ lie: 30, truth: 20 })).toEqual({ lie: 60, truth: 40 });
  });

  it("places a finish time among the recent ones", () => {
    const times = Array.from({ length: 50 }, (_, i) => (i + 1) * 60);
    expect(fasterThan(times, 10 * 60)).toBe(80);
    expect(fasterThan(times.slice(0, 49), 10 * 60)).toBeNull();
    expect(fasterThan(times, undefined)).toBeNull();
  });
});

describe("cases", () => {
  it("gives every case a script, a save of its own, and the sharing events", () => {
    const keys = CASE_IDS.map(saveKey);
    expect(new Set(keys).size).toBe(CASE_IDS.length);
    for (const id of CASE_IDS) {
      expect(STORIES[id].title, id).toBe(CASES[id].title);
      for (const e of SHARING) expect(isFoundEvent(STORIES[id], e), e).toBe(true);
      expect(eventsFor(STORIES[id])).toContain("open");
    }
  });

  it("only knows its own case ids", () => {
    expect(isCaseId("low-battery")).toBe(true);
    for (const bad of ["toString", "__proto__", "", null, 3]) expect(isCaseId(bad)).toBe(false);
  });
});
