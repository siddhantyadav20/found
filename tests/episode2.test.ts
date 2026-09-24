import { describe, expect, it } from "vitest";

import { conversation, openReply } from "@/lib/game/chat";
import {
  add,
  answer,
  dueEvents,
  episodeOf,
  filedClaim,
  filedClaims,
  needsRevisit,
  openQuestion,
  see,
  seen,
  sideQuestions,
  THIN,
} from "@/lib/game/engine";
import type { Flag } from "@/content/types";
import { ep, look, play, solve } from "./support/play";

/**
 * Episode 2, "The Second Shot", played the way a player can
 * (tests/support/play.ts): from the charger to the title card of Episode 3.
 */

const q = (id: string) => ep.questions.find((x) => x.id === id)!;
const toThree = (say: readonly Flag[] = []) => play((_, scene) => scene.kind === "title" && scene.episode === 3, say);
/** Episode 2, just opened: the title card seen, nothing yet found. */
const opened = () => play((s, scene) => episodeOf(s) === 2 && scene.kind === "table");

describe("Episode 2", () => {
  const s = toThree();

  it("plays from the charger to 1:52, answering Q5–Q9", () => {
    for (const id of ["q5", "q6", "q7", "q8", "q9"]) expect(s.flags, id).toContain(`ask:${id}`);
    expect(episodeOf(s)).toBe(3);
  });

  it("traces the spine it's written for: the reel, Kunal's gun, two firings, the shot, alive, the car", () => {
    const links = s.flags.filter((f) => f.startsWith("link:"));
    expect(links).toEqual(
      expect.arrayContaining(["link:reel", "link:kunals-gun", "link:two-firings", "link:shot", "link:alive", "link:car"]),
    );
    // Kept there is Episode 3's board, and the deep links are Episode 3's too (the price is on the side).
    for (const l of ["link:kept", "link:lie", "link:fire", "link:edit"]) expect(links).not.toContain(l);
  });

  it("strikes Episode 1's line once the two firings are traced, before anything else is asked", () => {
    expect(filedClaims(q("q3"), s).map((c) => c.id)).toEqual(["his", "two"]);
    const at = (f: string) => s.flags.indexOf(f as Flag);
    expect(at("claim:q3:two")).toBeGreaterThan(at("link:two-firings"));
    expect(at("claim:q3:two")).toBeLessThan(at("ask:q7"));
  });

  it("ends on the gap: Episode 3 opens only once the car is known to have left empty", () => {
    expect(s.flags.indexOf("ep:3")).toBeGreaterThan(s.flags.indexOf("ask:q9"));
  });
});

describe("the two firings", () => {
  it("won't be proved by a board holding one row", () => {
    const s = see(ep, opened(), "kunal-clip");
    expect(answer(ep, s, "q6", ["t-kunal@dance"]).reply).toBe(THIN);
    const full = see(ep, s, "reel-take");
    expect(answer(ep, full, "q6", ["t-kunal@dance", "t-take@back"]).ok).toBe(true);
  });

  it("brings Q3 back as a Revisit that has to be done, and won't take his version twice", () => {
    let s = opened();
    s = solve(look(s), q("q5"));
    s = solve(look(s), q("q6"));
    expect(openQuestion(ep, s)?.id).toBe("q3");
    expect(answer(ep, s, "q3", { claim: "his", proof: ["vn-kunal", "fire-clip"] }).ok).toBe(false);
  });
});

describe("the money, on the side", () => {
  const base = () => opened();

  it("is offered on the side and holds nothing up", () => {
    expect(sideQuestions(ep, base()).map((x) => x.id)).toContain("qm");
    expect(q("qm").optional).toBe(true);
  });

  it("accepts it as hush money, and comes back only if Bhasin's message is found afterwards", () => {
    const before = ["balance", "sethi-list"].reduce((acc, id) => see(ep, acc, id), base());
    let s = answer(ep, before, "qm", { claim: "hush", proof: ["balance", "sethi-list"] }).state;
    expect(filedClaim(q("qm"), s)?.id).toBe("hush");
    expect(needsRevisit(q("qm"), s)).toBe(false);
    s = see(ep, s, "bhasin-balance");
    expect(needsRevisit(q("qm"), s)).toBe(true);
    expect(sideQuestions(ep, s).map((x) => x.id)).toContain("qm");
  });

  it("doesn't ask again of a player who filed his version with Bhasin's message already in hand", () => {
    const all = ["balance", "sethi-list", "bhasin-balance", "invoice"].reduce((acc, id) => see(ep, acc, id), base());
    const s = answer(ep, all, "qm", { claim: "hush", proof: ["balance", "sethi-list"] }).state;
    expect(needsRevisit(q("qm"), s)).toBe(false);
  });

  it("traces the price with the invoice, or the payment itself, and Bhasin's message", () => {
    const s = ["balance", "bhasin-balance"].reduce((acc, id) => see(ep, acc, id), base());
    expect(answer(ep, s, "qm", { claim: "held", proof: ["balance", "bhasin-balance"] }).state.flags).toContain("link:price");
  });
});

describe("who writes, and when", () => {
  it("has Bhasin write early to a player who told Sameer's mother a stranger has the phone", () => {
    const told = add(opened(), "did:mummy-stranger");
    expect(dueEvents(ep, told).map((e) => e.id)).toContain("bhasin-knows");
    const late = add(told, "ask:q8");
    expect(dueEvents(ep, late).map((e) => e.id)).not.toContain("bhasin-writes");
    expect(dueEvents(ep, add(opened(), "ask:q8")).map((e) => e.id)).toContain("bhasin-writes");
  });

  it("gives what Dilip told his brother only to a player Raju trusts", () => {
    const trusted = toThree(["did:raju-trusts"]);
    const other = toThree(["did:raju-told-kunal"]);
    expect(seen(trusted, "raju-promise")).toBe(true);
    expect(seen(other, "raju-promise")).toBe(false);
    // Dilip's own chat keeps the promise for everyone.
    expect(seen(other, "promise")).toBe(true);
  });

  it("keeps Sameer's chat in the order it happened: his Episode 1 messages, then the exchange", () => {
    const s = toThree(["did:sameer-where", "did:told-sameer-shot"]);
    const merged = ep.threads.filter((t) => t.name.startsWith("+91 70"));
    const thread = { ...merged[0], messages: merged.flatMap((t) => t.messages), replies: merged.flatMap((t) => t.replies ?? []) };
    const ids = conversation(s, thread, "Sunday").map((m) => m.id);
    expect(ids.slice(0, 3)).toEqual(["sn-1", "sn-2", "sn-3"]);
    expect(ids.indexOf("said-where")).toBeGreaterThan(ids.indexOf("sn-4"));
    expect(ids.indexOf("sn-5")).toBeGreaterThan(ids.indexOf("sn-12"));
    expect(ids.indexOf("said-shot")).toBeGreaterThan(ids.indexOf("sn-6"));
    expect(openReply(s, thread)).toBeUndefined();
  });
});

describe("Episode 2's finds", () => {
  it("are behind a hard route wherever Sameer tucked them away", () => {
    for (const id of ["reel-take", "memo", "chhotu-107", "nitin-car", "nitin-reply"])
      expect(ep.evidence.find((e) => e.id === id)?.manual, id).toBe(true);
  });
});
