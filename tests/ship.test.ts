import { describe, expect, it } from "vitest";

import type { Flag } from "@/content/types";
import { add, answered, dueEvents, episodeOf, traced, type CaseState } from "@/lib/game/engine";
import { AIRPLANE } from "@/lib/game/phone";
import { endingFor } from "@/lib/game/record";
import { ep, look, play, type Style } from "./support/play";

/**
 * The chapter, played to its end every way CHAPTER1.md promises (ROADMAP
 * S12): the full chain to The Complete Record, Sameer's reader to his
 * version, an early post to The Wrong Story, and the phone given back.
 * Then the fair-play law: whichever single route closes (Nitin, Kunal,
 * airplane mode, nobody answered at all), every link can still be traced,
 * and every piece of evidence is reachable by some way of playing.
 */

const TRUTH: Style = { prefer: "truth", side: true };
const HIS: Style = { prefer: "version" };

/** The last question answered (and the money, for a player who takes the side), nothing due, nothing left to find. */
const finished = (style: Style) => (s: CaseState) =>
  answered(s, "q13") && (!style.side || answered(s, "qm")) && dueEvents(ep, s).length === 0 && look(s) === s;

const run = (say: readonly Flag[] = [], style: Style = TRUTH, from?: CaseState) => play(finished(style), say, from, style);

describe("every ending, reached by playing", () => {
  it("the full chain, 11 of 11, sent: The Complete Record", () => {
    const s = run(["did:nitin-asked", "did:protect-nitin", "did:raju-trusts", "did:confronted-sameer"]);
    expect(traced(ep, s)).toHaveLength(11);
    expect(endingFor(ep, s, "send")?.id).toBe("complete");
  });

  it("the player ahead of the phone, filing hunches where they can, still traces the whole chain", () => {
    const ahead: Style = { prefer: "truth", side: true, hunch: true };
    const s = run(["did:nitin-asked", "did:protect-nitin", "did:raju-trusts", "did:confronted-sameer"], ahead);
    expect(s.flags).toEqual(expect.arrayContaining(["claim:q3:sameer", "claim:q9:sameer"]));
    expect(traced(ep, s)).toHaveLength(11);
    expect(endingFor(ep, s, "send")?.id).toBe("complete");
  });

  it("the reader Sameer was counting on, filing his version wherever it's on offer: Sameer's Version", () => {
    const s = run([], HIS);
    // Every finisher traces the spine; his reader traces nothing deeper.
    expect(traced(ep, s).map((l) => l.id)).toEqual(ep.chain.filter((l) => l.kind === "spine").map((l) => l.id));
    expect(endingFor(ep, s, "send")?.id).toBe("version");
    expect(endingFor(ep, s, "post")?.id).toBe("version");
  });

  it("the draft posted before the two firings are told apart: The Wrong Story", () => {
    const s = play((x) => answered(x, "q3"));
    expect(endingFor(ep, s, "post")?.id).toBe("wrong");
  });

  it("the phone given back, at any point: Return to Sender", () => {
    for (const s of [play((x) => x.flags.includes("did:unlock")), play((x) => episodeOf(x) === 2), run()])
      expect(endingFor(ep, s, "return")?.id).toBe("returned");
  });
});

describe("fair play: every link survives any one route closing", () => {
  const routes: Record<string, () => CaseState> = {
    "nobody answered at all": () => run(),
    "Nitin protected": () => run(["did:nitin-asked", "did:protect-nitin"]),
    "Nitin pressed": () => run(["did:nitin-pressed"]),
    "Kunal confronted, so Nitin closes": () => run(["did:confronted-kunal"]),
    "Nitin handed to Kunal": () => run(["did:exposed-nitin"]),
    "airplane mode from Episode 2": () => run([], TRUTH, add(play((x, scene) => episodeOf(x) === 2 && scene.kind === "table"), AIRPLANE)),
    "airplane mode from the first minute": () => run([], TRUTH, add(play((x) => x.flags.includes("did:unlock")), AIRPLANE)),
  };

  for (const [name, go] of Object.entries(routes))
    it(name, () => {
      expect(traced(ep, go()).map((l) => l.id)).toEqual(ep.chain.map((l) => l.id));
    });
});

describe("every piece of evidence", () => {
  it("is reachable by some way of playing", () => {
    // Each reply option opens something the others don't; between them, everything.
    const ways: (readonly Flag[])[] = [
      ["did:nitin-asked", "did:protect-nitin", "did:raju-trusts", "did:told-sameer-shot", "did:gave-rescuer", "did:wrote-meera"],
      ["did:exposed-nitin", "did:asked-sameer-after", "did:confronted-sameer"],
      ["did:confronted-kunal"],
    ];
    const seen = new Set(ways.flatMap((say) => run(say).flags.filter((f) => f.startsWith("saw:")).map((f) => f.slice(4))));
    const missing = ep.evidence.map((e) => e.id).filter((id) => !seen.has(id));
    expect(missing).toEqual([]);
  });
});
