import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { homeIcons } from "@/lib/game/engine";

/**
 * The chapter, held to its own promises (PLAYER-JOURNEY law 3):
 *
 * - every question has at least two ways in and exactly three hints
 * - every piece of evidence lives in exactly one place on the phone
 * - nothing points at evidence that doesn't exist
 *
 * *Shagun* is a stub since ROADMAP S1, so these hold vacuously until S6–S8
 * write its episodes. S12 adds the solver runs CHAPTER1.md promises: the full
 * chain (11 of 11, Ending A), Sameer's version (B), an early post (C) and
 * Return to Sender, and two sources per link that survive any closed route.
 */

const ep = STORIES.shagun;

describe("every question", () => {
  it("has three hints, the last of them the answer", () => {
    for (const q of ep.questions) {
      expect(q.hints, q.id).toHaveLength(3);
      for (const h of q.hints) expect(h.trim().length, q.id).toBeGreaterThan(10);
    }
  });

  it("has at least two ways in", () => {
    for (const q of ep.questions) {
      const ways =
        q.kind === "pick"
          ? 1 + (q.orProof?.length ?? 0)
          : q.kind === "type"
            ? q.accepts.length
            : q.kind === "timeline"
              ? new Set(q.rows.map((r) => r.evidence)).size
              : q.claims.length;
      expect(ways, q.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("points only at apps the phone has", () => {
    const apps = new Set(homeIcons(ep).map((i) => i.app));
    for (const q of ep.questions) for (const a of q.whereToLook) expect(apps.has(a), `${q.id}: ${a}`).toBe(true);
  });
});

describe("every piece of evidence", () => {
  /** Where each evidence id is filed: every `evidence: "…"` outside the case file and the questions. */
  const places = (() => {
    const count = new Map<string, number>();
    const walk = (x: unknown): void => {
      if (Array.isArray(x)) return x.forEach(walk);
      if (!x || typeof x !== "object") return;
      for (const [k, v] of Object.entries(x)) {
        if (k === "evidence" && typeof v === "string") count.set(v, (count.get(v) ?? 0) + 1);
        else walk(v);
      }
    };
    for (const [key, value] of Object.entries(ep)) if (key !== "evidence" && key !== "questions") walk(value);
    return count;
  })();

  it("is never filed in two places (opening its app finds the rest)", () => {
    for (const e of ep.evidence) {
      const n = places.get(e.id) ?? 0;
      expect(n, `${e.id} is filed in ${n} places`).toBeLessThanOrEqual(1);
    }
  });

  it("that has to be looked for is somewhere it can be looked at", () => {
    // The note is found by reading it, before the phone is even on.
    const gestures = new Set(["note"]);
    for (const e of ep.evidence.filter((x) => x.manual && !gestures.has(x.id)))
      expect(places.get(e.id) ?? 0, `${e.id} can never be seen`).toBeGreaterThanOrEqual(1);
  });

  it("points only at evidence that exists", () => {
    const ids = new Set(ep.evidence.map((e) => e.id));
    for (const id of places.keys()) expect(ids.has(id), id).toBe(true);
  });
});

describe("the phone itself", () => {
  it("is its owner's, with the case file in the dock", () => {
    expect(ep.owner.name).toBe("Sameer Khurana");
    expect(ep.hersHome.dock.map((i) => i.app)).toContain("casefile");
  });

  it("opens each episode on the minute CHAPTER1.md gives it", () => {
    expect(ep.clocks.map((c) => `${c.day} ${c.base}`)).toEqual(["Saturday 23:40", "Sunday 00:32", "Sunday 01:52"]);
    expect(ep.episodes).toEqual(["Missed Calls", "The Second Shot", "The Cancelled Rescue"]);
  });
});
