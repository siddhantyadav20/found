import { describe, expect, it } from "vitest";

import { conversation, openReply } from "@/lib/game/chat";
import {
  add,
  answer,
  dueEvents,
  episodeOf,
  filedClaim,
  filedClaims,
  calledIt,
  claimFor,
  needsRevisit,
  see,
  seen,
  sideQuestions,
  struckOut,
} from "@/lib/game/engine";
import type { Flag } from "@/content/types";
import { ep, play } from "./support/play";

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

  it("crosses out Episode 1's version the moment Sameer is proved to have fired, with nothing to refile", () => {
    const his = play((_, scene) => scene.kind === "title" && scene.episode === 3, [], undefined, { prefer: "version" });
    expect(filedClaims(q("q3"), his).map((c) => c.id)).toEqual(["his"]);
    expect(struckOut(q("q3"), his)).toBe(true);
    // A careful player's line stands: it never named Kunal.
    expect(struckOut(q("q3"), s)).toBe(false);
  });

  it("says a player called it when they'd filed Sameer as the shooter in Episode 1", () => {
    const ahead = play((x) => x.flags.includes("ask:q6"), [], undefined, { hunch: true });
    const shot = q("q6");
    const c = shot.kind === "file" ? shot.claims.find((x) => x.id === "sameer") : undefined;
    expect(c && calledIt(ep, ahead, c)).toBeDefined();
    expect(c && calledIt(ep, s, c)).toBeUndefined();
  });

  it("ends on its own question, filed as his version, what the phone shows, or a hunch", () => {
    expect(filedClaim(q("q9"), s)?.id).toBe("someone");
    const his = play((_, scene) => scene.kind === "title" && scene.episode === 3, [], undefined, { prefer: "version" });
    expect(filedClaim(q("q9"), his)?.id).toBe("turned");
  });

  it("ends on the gap: Episode 3 opens only once the car is known to have left empty", () => {
    expect(s.flags.indexOf("ep:3")).toBeGreaterThan(s.flags.indexOf("ask:q9"));
  });

  it("turns to Episode 3 only once Raju, Sameer and Bhasin have had their say, and the phone is put down", () => {
    const order = ep.events.map((e) => e.id);
    for (const last of ["sameer-asks", "sameer-code", "raju-rings-2", "bhasin-writes"]) expect(order.indexOf(last), last).toBeLessThan(order.indexOf("the-gap"));
    expect(ep.events.find((e) => e.id === "the-gap")?.quiet).toBe(true);
  });
});

describe("who fired, said by the player", () => {
  it("files Sameer and the second shot only with the reel take and what shows the second shot was his", () => {
    const s = ["kunal-clip", "reel-take"].reduce((acc, id) => see(ep, acc, id), opened());
    expect(answer(ep, s, "q6", { claim: "sameer", proof: ["kunal-clip", "reel-take"] }).ok).toBe(false);
    const full = see(ep, s, "gun-to-kunal");
    const r = answer(ep, full, "q6", { claim: "sameer", proof: ["kunal-clip", "reel-take", "gun-to-kunal"] });
    expect(r.ok).toBe(true);
    expect(r.state.flags).toEqual(expect.arrayContaining(["link:two-firings", "link:shot"]));
  });

  it("answers a near miss pointedly, and never files it", () => {
    const shot = q("q6");
    expect(shot.kind === "file" && claimFor(shot, { place: "dance floor", who: "Kunal", which: "second" }).claim?.refuse).toBeTruthy();
    expect(shot.kind === "file" && claimFor(shot, { place: "back lawn", who: "Sameer", which: "second" }).close).toBe(true);
    expect(shot.kind === "file" && claimFor(shot, { place: "service lane", who: "Bhasin", which: "first" }).close).toBe(false);
  });

  it("gives a player the locked chats' code, from Sameer or from the memo he deleted", () => {
    const code = ep.chatLock?.knownWhen ?? [];
    expect(code).toEqual(expect.arrayContaining([["fired:sameer-code"], ["did:installed-voicememos"]]));
    expect(ep.memos.find((m) => m.id === "memo-code")?.lines.some((l) => l.line.includes(ep.chatLock!.code))).toBe(true);
    for (const t of ep.threads.filter((x) => x.name === "Nitin" || x.name === "Chhotu")) expect(t.locked, t.id).toBe(true);
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
    const late = add(told, "ask:q7");
    expect(dueEvents(ep, late).map((e) => e.id)).not.toContain("bhasin-writes");
    expect(dueEvents(ep, add(opened(), "ask:q7")).map((e) => e.id)).toContain("bhasin-writes");
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
    for (const id of ["reel-take", "memo", "gun-to-kunal", "chhotu-107", "nitin-car", "nitin-reply"])
      expect(ep.evidence.find((e) => e.id === id)?.manual, id).toBe(true);
  });
});
