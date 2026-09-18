import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { AppId, Flag } from "@/content/types";
import { duration, ranFor } from "@/lib/game/call";
import { add, answer, clockNow, dueEvents, fire, newCase, openApp, see, stamp, UNCHECKED, type CaseState } from "@/lib/game/engine";
import { eventsFor, MILESTONE_OF, reportFlag } from "@/lib/found/events";
import { PLUGGED_IN, ringingNow, sceneOf } from "@/lib/game/scene";

/**
 * Every blocker QA.md found, held down by a test, so none of them can come
 * back quietly. Each was a way to get stuck, and each passed the 61 tests
 * that existed when it was found.
 */

const ep = STORIES["dont-cut-the-call"];
const opens = (s: CaseState, apps: readonly AppId[]) => apps.reduce((acc, app) => openApp(ep, acc, app), s);
const MIN = 60_000;

/** Fire whatever is due, the way the table does after each delay. */
const settle = (s: CaseState): CaseState => {
  let next = s;
  for (let i = 0; i < 10; i++) {
    const due = dueEvents(ep, next)[0];
    if (!due) break;
    next = fire(ep, next, due.id);
  }
  return next;
};

const unlocked = () => add(newCase("t", 0), "did:opened", "did:unlock", "saw:note", "saw:call");

describe("Episode 1 hands over to Episode 2 (found in R2)", () => {
  it("lets the power bank die once he has been placed, with nobody seeding the save", () => {
    let s = settle(add(unlocked(), "ask:whose", "ask:knew", "ask:number", "did:placed-him", "ask:where"));
    expect(s.flags).toContain("did:bank-dead");
    // He asks the dark whether she is still there; then the charger.
    expect(sceneOf(ep, s).kind).toBe("table");
    s = add(s, "fired:cue-still-there");
    expect(sceneOf(ep, s).kind).toBe("charge");
    s = add(s, ...PLUGGED_IN);
    expect(s.flags).toContain("ep:2");
  });
});

describe("L1: cutting the call at 1:11", () => {
  it("still lets the player place him, from her diary and her searches", () => {
    let s = add(unlocked(), "did:cut-early", "ask:whose", "ask:knew", "ask:number");
    s = opens(s, ["photos", "safari"]);
    // Nothing from his room: the feed is gone.
    expect(s.flags).not.toContain("saw:clock");
    expect(s.flags).not.toContain("saw:burmese");
    expect(answer(ep, s, "where", ["diary-4", "she-searched-mw"]).ok).toBe(true);
    expect(answer(ep, s, "where", ["diary-4", "sahil-photo"]).ok).toBe(true);
  });

  it("reaches the charger without a line he never got to say", () => {
    const s = settle(add(unlocked(), "did:cut-early", "did:placed-him"));
    expect(s.flags).not.toContain("fired:cue-still-there");
    expect(sceneOf(ep, s).kind).toBe("charge");
  });
});

describe("L2: her son's call can be left to ring", () => {
  const ep2 = () => add(unlocked(), "did:bank-dead", "did:charged", "ep:2");

  it("rings at the start of Episode 2, and can be declined for good", () => {
    const s = ep2();
    const call = ringingNow(ep, s);
    expect(call?.id).toBe("nikhil");
    expect(call?.insists).toBeFalsy();
    const declined = add(s, "did:declined-nikhil");
    expect(ringingNow(ep, declined)).toBeUndefined();
    expect(sceneOf(ep, declined).kind).toBe("table");
  });

  it("doesn't stop the arrest from ringing at 10:30", () => {
    const s = add(ep2(), "did:declined-nikhil", "ep:3", "did:seen-by-them", "did:ep2-done", "did:woke");
    const call = ringingNow(ep, s);
    expect(call?.id).toBe("arrest");
    // The arrest can only be answered.
    expect(call?.insists).toBe(true);
    expect(ringingNow(ep, add(s, "did:declined-arrest"))?.id).toBe("arrest");
  });
});

describe("L3: each episode keeps its own clock", () => {
  it("starts Episode 2 at 1:40 and Episode 3 at 10:29, however long the one before took", () => {
    let s = unlocked();
    expect(clockNow(ep, s, 5 * MIN)).toBe("01:16");

    // Forty minutes into Episode 1, the player plugs in.
    s = stamp(add(s, "did:charged", "ep:2"), 40 * MIN);
    expect(clockNow(ep, s, 40 * MIN)).toBe("01:40");
    expect(clockNow(ep, s, 43 * MIN)).toBe("01:43");

    // An hour later the night ends, and the morning begins where it should.
    s = stamp(add(s, "ep:3"), 100 * MIN);
    expect(clockNow(ep, s, 100 * MIN)).toBe("10:29");
  });

  it("reads 40:51 on the call in the morning, because it ran all night", () => {
    const s = stamp(add(unlocked(), "ep:2", "ep:3"), 100 * MIN);
    expect(duration(ranFor(ep, s, 100 * MIN))).toBe("40:51:07");
  });

  it("stamps an episode once, and leaves old saves on the playthrough's start", () => {
    const s = stamp(add(unlocked(), "ep:2"), 10 * MIN);
    expect(stamp(s, 20 * MIN)).toBe(s);
    expect(clockNow(ep, add(unlocked(), "ep:2"), 0)).toBe("01:40");
  });
});

describe("L5: the claims are checked, not guessed", () => {
  it("won't judge her death until each version has been looked at", () => {
    const s = add(unlocked(), "ask:whose", "ask:knew", "ask:number", "ask:where", "did:charged", "ep:2");
    expect(answer(ep, s, "how-died", ["murder"]).reply).toBe(UNCHECKED);
    const checked = opens(s, ["messages", "phone", "photos"]);
    expect(answer(ep, checked, "how-died", ["murder"]).ok).toBe(true);
  });
});

describe("the ₹1 lakh can be checked on her phone (L4)", () => {
  it("lands in Unknown Senders only if the password was typed", () => {
    const junk = ep.threads.find((t) => t.folder === "junk");
    const lakh = junk?.messages.find((m) => m.evidence === "the-lakh");
    expect(lakh?.requires).toContain("did:typed-password");
    const s = add(unlocked(), "did:typed-password");
    expect(see(ep, s, "the-lakh").flags).toContain("saw:the-lakh");
  });
});

describe("the funnel hears what the game records", () => {
  it("reports solved questions, hints and milestones from the flags themselves", () => {
    expect(reportFlag("ask:whose")).toBe("solved:whose");
    expect(reportFlag("hint:whose:2" as Flag)).toBe("hint:whose:2");
    expect(reportFlag("did:unlock")).toBe("unlock");
    expect(reportFlag("saw:note")).toBeNull();
  });

  it("only ever reports events the route will count", () => {
    const allowed = eventsFor(ep);
    for (const event of Object.values(MILESTONE_OF)) expect(allowed).toContain(event);
    for (const q of ep.questions) {
      expect(allowed).toContain(reportFlag(`ask:${q.id}`));
      expect(allowed).toContain(`hint:${q.id}:3`);
      expect(allowed).toContain(`wrong:${q.id}`);
      expect(allowed).toContain(`nudge:${q.id}`);
    }
  });
});

describe("the story keeps its own rules", () => {
  it("names no real courier in the crime (C1)", () => {
    expect(JSON.stringify(ep).toLowerCase()).not.toContain("fedex");
  });

  it("wears their shield on the 1:11 alert (C4)", () => {
    expect(ep.events.find((e) => e.id === "alert")?.icon).toBe("kyc");
  });

  it("lets every reply to him be answered once, silence included (L6)", () => {
    for (const r of ep.callReplies) for (const o of r.options) expect(o.sets?.length, `${r.id}/${o.id}`).toBeGreaterThan(0);
  });
});
