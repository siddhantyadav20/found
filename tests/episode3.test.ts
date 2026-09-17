import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Flag } from "@/content/types";
import { add, answer, exposed, expose, newCase, type CaseState } from "@/lib/game/engine";

/**
 * Episode 3. The scam is fake and the evidence is real, because the player
 * made it: the officer only reads out a charge when the ledger holds the
 * thing behind it, and the claims board is only true where they did it.
 *
 * The chapter's best possible run — nothing handed over — must therefore hear
 * an arrest made entirely of bluffs, and be able to say so.
 */

const ep = STORIES["dont-cut-the-call"];
const arrest = ep.incoming.find((c) => c.id === "arrest")!;

const awake = (): CaseState => ({
  ...newCase("t", 0),
  flags: ["did:opened", "did:unlock", "ep:2", "ep:3", "did:woke"] as Flag[],
});

/** What he can actually say, given what they gave him. */
const chargesFor = (s: CaseState) => arrest.lines.filter((l) => !l.needs || exposed(s, l.needs)).map((l) => l.line);

describe("the arrest", () => {
  it("is assembled out of the player's own night", () => {
    const clean = awake();
    const messy = ["pin", "voice", "shaila", "nikhil"].reduce((acc, id) => expose(ep, acc, id), clean);

    expect(chargesFor(clean)).toHaveLength(3);
    expect(chargesFor(messy)).toHaveLength(7);
    // Two lines are said to everyone: the delivery, and the case number.
    expect(chargesFor(clean).some((l) => l.includes("1:11 AM"))).toBe(true);
    expect(chargesFor(clean).some((l) => l.includes("one… nine… three… zero"))).toBe(true);
    // And these are only ever said to somebody who handed them over.
    expect(chargesFor(clean).some((l) => l.includes("ek lakh"))).toBe(false);
    expect(chargesFor(messy).some((l) => l.includes("ek lakh"))).toBe(true);
  });

  it("insists, because a real one does", () => {
    expect(arrest.insists).toBe(true);
    expect(arrest.device).toBe("yours");
  });
});

describe("checking what he says", () => {
  const ask = (s: CaseState, picked: readonly string[]) => answer(ep, s, "against-you", picked);

  it("is all bluff for a player who gave them nothing", () => {
    const clean = awake();
    // Only the delivery is true, and it is true of everybody.
    expect(ask(clean, ["delivered"]).ok).toBe(true);
    expect(ask(clean, ["delivered", "transfer"]).ok).toBe(false);
    expect(ask(clean, ["delivered", "inside"]).ok).toBe(false);
  });

  it("turns into a confession for a player who gave them everything", () => {
    const messy = add(awake(), "did:typed-password", "did:unmuted", "did:shaila-told", "did:nikhil-lied");
    expect(ask(messy, ["delivered", "transfer", "voice", "witness", "son"]).ok).toBe(true);
    // The one he invented stays a bluff however bad the night was.
    expect(ask(messy, ["delivered", "transfer", "voice", "witness", "son", "inside"]).ok).toBe(false);
  });
});

describe("his last risk", () => {
  it("hides the helpline in a case number", () => {
    const line = arrest.lines.find((l) => l.line.includes("case number"))!;
    expect(line.line).toContain("one… nine… three… zero");
    const q = ep.questions.find((x) => x.id === "case-number")!;
    expect(q.kind === "type" && q.accepts).toContain("1930");
  });

  it("ends the chapter at the choice, and nowhere else", () => {
    const q = ep.questions.find((x) => x.id === "case-number")!;
    expect(q.sets).toContain("did:choice");
  });
});

describe("the profile", () => {
  it("can be removed, once, and says what that costs", () => {
    const row = ep.settings.flatMap((g) => g.rows).find((r) => r.action);
    expect(row?.title).toBe("VPN & Device Management");
    expect(row?.action?.sets).toContain("did:removed-profile");
    expect(row?.action?.confirm).toMatch(/will know/);
  });
});
