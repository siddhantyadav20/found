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

  /* Q3 is said, not chosen: his version (Kunal), only what the phone shows
     (someone), or a hunch that runs ahead of it (Sameer). None of the three
     is called wrong; the next episode tests them (PLAYTEST-SHAGUN.md #35). */
  it("files what happened as only the phone shows it, for a careful player", () => {
    const q3 = ep.questions.find((q) => q.id === "q3")!;
    expect(filedClaim(q3, s)?.id).toBe("someone");
    expect(filedClaim(q3, s)?.version).toBeFalsy();
  });

  it("files it as Sameer tells it, for the reader he was counting on", () => {
    const q3 = ep.questions.find((q) => q.id === "q3")!;
    const his = play((_, scene) => scene.kind === "charge", [], undefined, { prefer: "version" });
    expect(filedClaim(q3, his)?.id).toBe("his");
    expect(filedClaim(q3, his)?.version).toBe(true);
  });

  it("files a hunch that Sameer fired, for a player ahead of the phone, and doesn't call it proved", () => {
    const q3 = ep.questions.find((q) => q.id === "q3")!;
    const ahead = play((_, scene) => scene.kind === "charge", [], undefined, { hunch: true });
    expect(filedClaim(q3, ahead)?.id).toBe("sameer");
    expect(ahead.flags).not.toContain("link:shot");
  });

  it("won't file Bhasin as the shooter: nothing on the phone puts a gun in his hand", () => {
    const q3 = ep.questions.find((q) => q.id === "q3")!;
    const bhasin = q3.kind === "file" ? q3.claims.find((c) => c.words?.who === "Vinod Bhasin") : undefined;
    expect(bhasin?.refuse).toBeTruthy();
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
