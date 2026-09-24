import { describe, expect, it } from "vitest";

import { battery, filedClaim, seen } from "@/lib/game/engine";
import { sceneOf } from "@/lib/game/scene";
import { ep, play } from "./support/play";

/**
 * Episode 1, "Missed Calls", played the way a player can (tests/support/play.ts):
 * from the phone waking to the charger.
 */

const play1 = () => play((_, scene) => scene.kind === "charge");

describe("Episode 1", () => {
  const s = play1();

  it("plays from the phone waking to the charger, answering Q1–Q4", () => {
    for (const id of ["q1", "q2", "q3", "q4"]) expect(s.flags, id).toContain(`ask:${id}`);
    expect(sceneOf(ep, s).kind).toBe("charge");
    expect(battery(ep, s, 0)).toBe(2);
  });

  it("files what happened as Sameer tells it, because nothing on the phone can yet say otherwise", () => {
    const q3 = ep.questions.find((q) => q.id === "q3")!;
    expect(filedClaim(q3, s)?.id).toBe("his");
    expect(filedClaim(q3, s)?.version).toBe(true);
  });

  it("counts nothing that belongs to a later episode, however hard the player looked", () => {
    const later = ep.evidence.filter((e) => e.requires?.some((f) => f === "ep:2" || f === "ep:3"));
    expect(later.length).toBeGreaterThan(10);
    for (const e of later) expect(seen(s, e.id), e.id).toBe(false);
  });

  it("traces no link yet: Episode 1 is his version", () => {
    expect(s.flags.filter((f) => f.startsWith("link:"))).toEqual([]);
  });

  it("rings Raju within seconds, and lets him be declined", () => {
    expect(s.flags).toContain("did:declined-raju");
    expect(ep.incoming.find((c) => c.id === "raju")?.insists).toBeFalsy();
  });

  it("brings Mummy's message only once someone has looked for the phone, and then Sameer", () => {
    const order = s.flags.filter((f) => ["fired:find-my", "fired:mummy-where", "fired:sameer-writes", "fired:dying"].includes(f));
    expect(order).toEqual(["fired:find-my", "fired:mummy-where", "fired:sameer-writes", "fired:dying"]);
  });
});
