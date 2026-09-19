import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { duration, hisClock, nextCue, ranFor, watched } from "@/lib/game/call";
import { add, newCase } from "@/lib/game/engine";

/**
 * The call: a timer that only goes up, and a man who has to keep talking.
 * Both are decided here, away from the DOM, because both are plot.
 */

const ep = STORIES["dont-cut-the-call"];
const start = () => newCase("test", 0);

describe("the timer", () => {
  it("counts past a day, because that is the point", () => {
    expect(duration(113_587)).toBe("31:33:07");
    expect(duration(0)).toBe("00:00:00");
    expect(duration(-5)).toBe("00:00:00");
  });

  it("carries on from where the pouch found it", () => {
    expect(ranFor(ep, start(), 0)).toBe(113_587);
    expect(duration(ranFor(ep, start(), 90_000))).toBe("31:34:37");
  });
});

describe("what he says next", () => {
  it("keeps each episode's idle lines to that episode", () => {
    const ep2 = add(start(), "ep:2");
    const two = [0, 1, 2, 3].map((i) => nextCue(ep, ep2, ["open", "ep2-open"], i)?.id);
    expect(two).not.toContain("idle-1");
    expect(two).toContain("ep2-idle");
  });

  it("talks to the stranger once one has spoken", () => {
    const heard = add(start(), "did:unmuted");
    expect(nextCue(ep, heard, ["open"], 0)?.id).toMatch(/^heard-/);
  });

  it("opens with the line he has been saying to an empty room", () => {
    expect(nextCue(ep, start(), [], 0)?.id).toBe("open");
  });

  it("answers a reach for the red button, once, and the whisper comes first", () => {
    const s = add(start(), "did:reach-for-end");
    const whisper = nextCue(ep, s, ["open"], 0);
    expect(whisper?.id).toBe("whisper");
    expect(whisper?.whisper).toBe(true);
    expect(watched(whisper)).toBe(false);

    const shouted = nextCue(ep, s, ["open", "whisper"], 0);
    expect(shouted?.id).toBe("script");
    expect(watched(shouted)).toBe(true);
  });

  it("idles in a fixed order, so two players see one performance", () => {
    const s = start();
    // Episode 1's own idle lines: it is not light outside at 1:13 AM.
    const idles = ep.cues.filter((c) => c.when === "idle" && (!c.episode || c.episode === 1) && !c.requires);
    const turns = idles.map((_, i) => nextCue(ep, s, ["open"], i)?.id);
    // Every idle line, in the script's order, then round again from the top.
    expect(turns).toEqual(idles.map((c) => c.id));
    expect(nextCue(ep, s, ["open"], idles.length)?.id).toBe(idles[0].id);
  });

  it("captions everything it says", () => {
    for (const c of ep.cues) expect(c.english, c.id).toBeTruthy();
  });
});

describe("his wall clock", () => {
  it("runs an hour ahead of Mumbai, which is the whole clue", () => {
    expect(hisClock("01:11")).toBe("02:11");
    expect(hisClock("23:40")).toBe("00:40");
  });
});
