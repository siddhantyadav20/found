import { describe, expect, it } from "vitest";

import { CASES, CASE_IDS, isCaseId } from "@/content/cases";
import { STORIES } from "@/content/stories";
import { add, newCase, type CaseState } from "@/lib/game/engine";
import { cleanDropName, displayName, dropLabel, NAME_MAX } from "@/lib/found/dropName";
import { SHARING, eventsFor, isFoundEvent } from "@/lib/found/events";
import { saveKey } from "@/lib/found/progress";
import { resultLine, resultOf, shareText } from "@/lib/found/result";
import { MIN_ANSWERS, fasterThan, percentages } from "@/lib/found/store";

/**
 * The loop that brings new players: the result a finisher shares, the
 * parcel a friend receives, and what everyone else did. None of it may
 * spoil the case, and none of it may say something about too few people.
 */

const ep = STORIES.shagun;
const start = () => newCase("test", 0);

/** A playthrough that traced two links, and then chose an ending. */
function tracedTwo(): CaseState {
  const s = add(start(), "link:shot", "link:reel", "did:chose");
  return { ...s, at: { whatsapp: 42 * 60_000 } };
}

describe("the shared result", () => {
  it("counts the links traced, in the chain's own order", () => {
    expect(resultOf(ep, start()).traced).toEqual([]);
    expect(resultOf(ep, tracedTwo()).traced).toEqual(["reel", "shot"]);
    expect(resultOf(ep, tracedTwo()).links).toBe(11);
  });

  it("says it in a line that gives nothing away", () => {
    expect(resultLine(resultOf(ep, start()))).toBe("I traced 0 of 11 links.");
    expect(resultLine(resultOf(ep, tracedTwo()))).toBe("I traced 2 of 11 links.");
  });

  it("times the chapter, and only once it has ended", () => {
    expect(resultOf(ep, tracedTwo()).minutes).toBe(42);
    expect(resultOf(ep, start()).minutes).toBeNull();
  });

  it("carries the case's own question, and names no answer", () => {
    const text = shareText(ep.title, resultOf(ep, tracedTwo()), "https://found.test/d/Abcd2345", CASES.shagun.ask);
    expect(text).toContain("I traced 2 of 11 links.");
    expect(text).toContain(CASES.shagun.ask);
    expect(text).toContain("https://found.test/d/Abcd2345");
    // Nothing from the chain itself: not a label, not a line, not his words.
    for (const l of ep.chain) {
      expect(text).not.toContain(l.truth);
      if (l.version) expect(text).not.toContain(l.version);
    }
  });
});

describe("the name on a passed-on parcel", () => {
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
    expect(dropLabel("", ["BY HAND"])).toEqual(["BY HAND"]);
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
  it("gives every case a script, a save of its own, the sharing events and a question to share", () => {
    const keys = CASE_IDS.map(saveKey);
    expect(new Set(keys).size).toBe(CASE_IDS.length);
    for (const id of CASE_IDS) {
      expect(STORIES[id].title, id).toBe(CASES[id].title);
      expect(CASES[id].ask.trim().length, id).toBeGreaterThan(0);
      // The share images count links without loading a story, so the two must agree.
      expect(CASES[id].links, id).toBe(STORIES[id].chain.length);
      for (const e of SHARING) expect(isFoundEvent(STORIES[id], e), e).toBe(true);
      expect(eventsFor(STORIES[id])).toContain("open");
    }
  });

  it("only knows its own case ids", () => {
    expect(isCaseId("shagun")).toBe(true);
    expect(isCaseId("dont-cut-the-call")).toBe(false);
    for (const bad of ["toString", "__proto__", "", null, 3]) expect(isCaseId(bad)).toBe(false);
  });
});
