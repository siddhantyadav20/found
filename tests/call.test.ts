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
    expect(ranFor(ep, 0)).toBe(113_587);
    expect(duration(ranFor(ep, 90_000))).toBe("31:34:37");
  });
});

describe("what he says next", () => {
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
    const a = nextCue(ep, s, ["open"], 0);
    const b = nextCue(ep, s, ["open"], 1);
    expect(a?.when).toBe("idle");
    expect(nextCue(ep, s, ["open"], 2)?.id).toBe(a?.id);
    expect(b).toBeTruthy();
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
