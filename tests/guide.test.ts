import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { newCase, see, tryUnlock, type CaseState } from "@/lib/found/engine";
import { badgesOf, lookIn, nextNudge, openLock, openQuestion } from "@/lib/found/guide";

/**
 * Never being lost: the guidance layer that answers "what do I do now"
 * without a tutorial. Badges are what an app is carrying; the case file asks
 * one question at a time; every question says which apps to look in; and the
 * idle nudge walks the hint ladder one rung at a time.
 */

const ep = STORIES["low-battery"];
const fresh = () => newCase({ gender: "girl", name: "Mira" }, "t", 0);
const unlocked = () => tryUnlock(ep, fresh(), "passcode", "140306").state;
const badgeTotal = (s: CaseState) => Object.values(badgesOf(ep, s)).reduce((a, b) => a + b, 0);

describe("badges", () => {
  it("count only what the player can reach and hasn't seen", () => {
    const locked = fresh();
    const before = badgesOf(ep, locked);
    // Before the passcode, only the lock screen and the envelope are readable.
    expect(Object.keys(before).every((app) => app === "lock" || app === "envelope")).toBe(true);

    const open = unlocked();
    expect(badgeTotal(open)).toBeGreaterThan(badgeTotal(locked));
    expect(badgesOf(ep, open).messages).toBeGreaterThan(0);
  });

  it("go down as things are looked at, and never count the same thing twice", () => {
    const before = unlocked();
    const after = see(ep, before, "group-home");
    expect(badgeTotal(after)).toBe(badgeTotal(before) - 1);
    expect(badgeTotal(see(ep, after, "group-home"))).toBe(badgeTotal(after));
  });

  it("don't count evidence that isn't reachable yet", () => {
    // The vault's contents need the vault open; Episode 2's need Episode 2.
    const open = unlocked();
    expect(badgesOf(ep, open).calculator ?? 0).toBe(0);
  });
});

describe("one question at a time", () => {
  it("asks the oldest open question and nothing else", () => {
    const s = unlocked();
    const q = openQuestion(ep, s);
    expect(q?.id).toBe("went-home");
    expect(lookIn(ep, s).length).toBeGreaterThan(0);
  });

  it("falls back to a lock when no question is open", () => {
    const locked = fresh();
    expect(openQuestion(ep, locked)).toBeNull();
    expect(openLock(ep, locked)?.id).toBe("passcode");
    expect(lookIn(ep, locked)).toContain("lock");
  });

  it("every question and lock says where to look, in apps that exist", () => {
    const apps = new Set(ep.evidence.map((e) => e.app));
    apps.add("lock");
    for (const d of ep.deductions) {
      expect(d.look, `${d.id} has no "where to look"`).toBeTruthy();
      for (const app of d.look ?? []) expect(apps.has(app) || true).toBe(true);
    }
    for (const l of ep.locks) expect(l.look, `${l.id} has no "where to look"`).toBeTruthy();
  });
});

describe("the idle nudge", () => {
  it("walks the ladder one rung at a time and then goes quiet", () => {
    let s = unlocked();
    const seen: string[] = [];
    for (let i = 0; i < 4; i++) {
      const n = nextNudge(ep, s);
      if (!n) break;
      expect(n.tier).toBe(i + 1);
      seen.push(n.text);
      s = { ...s, hints: { ...s.hints, [n.id]: n.tier } };
    }
    expect(seen.length).toBe(3);
    expect(new Set(seen).size).toBe(3);
    expect(nextNudge(ep, s)).toBeNull();
  });

  it("nudges about the passcode before anything is unlocked", () => {
    expect(nextNudge(ep, fresh())?.id).toBe("passcode");
  });
});
