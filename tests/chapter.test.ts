import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Flag } from "@/content/types";
import { homeIcons } from "@/lib/game/engine";

/**
 * The chapter, held to its own promises (PLAYER-JOURNEY law 3):
 *
 * - every question has at least two ways in and exactly three hints
 * - every piece of evidence lives in exactly one place on the phone
 * - nothing points at evidence that doesn't exist
 * - the chain is eleven links, and every one of them can be traced
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
              : q.kind === "file"
                ? // The traced answer, not the owner's version, is the one that must be reachable twice.
                  Math.min(...q.claims.filter((c) => !c.version).map((c) => 1 + (c.orProof?.length ?? 0)))
                : q.claims.length;
      expect(ways, q.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("that accepts the owner's version also accepts the truth, and says when it comes back", () => {
    for (const q of ep.questions) {
      if (q.kind !== "file" || !q.claims.some((c) => c.version)) continue;
      expect(q.claims.some((c) => !c.version), q.id).toBe(true);
      expect(q.reopenWhen?.length, `${q.id} can never be revisited`).toBeGreaterThan(0);
    }
  });

  it("puts every timeline row in a lane the board has", () => {
    for (const q of ep.questions) {
      if (q.kind !== "timeline") continue;
      const lanes = new Set(q.lanes.map((l) => l.id));
      for (const r of q.rows) expect(lanes.has(r.lane), `${q.id}: ${r.id}`).toBe(true);
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

  /**
   * Opening an app finds everything in it that isn't `manual`. So anything
   * behind one of the phone's hard routes (the bin, Hidden, an edit's
   * original, a zoom, an archived chat) must be manual, or opening the app
   * would find it for the player (found walking S4 with a fixture).
   */
  it("behind a hard route is found by taking the route, not by opening the app", () => {
    const hard = [
      ...ep.photos.flatMap((p) => [
        ...(p.deletedAt || p.hidden ? [p.evidence] : []),
        p.original?.evidence,
        p.zoom?.evidence,
      ]),
      ...ep.memos.filter((m) => m.deletedAt).map((m) => m.evidence),
      ...ep.threads.filter((t) => t.archived).flatMap((t) => t.messages.map((m) => m.evidence)),
    ].filter((id): id is string => Boolean(id));
    for (const id of hard) expect(ep.evidence.find((e) => e.id === id)?.manual, `${id} would be found just by opening its app`).toBe(true);
  });

  it("points only at evidence that exists", () => {
    const ids = new Set(ep.evidence.map((e) => e.id));
    for (const id of places.keys()) expect(ids.has(id), id).toBe(true);
  });
});

describe("the chain", () => {
  /** Every flag an answer can set: a question's own, and each of its claims'. */
  const setters = ep.questions.flatMap((q) => [
    ...(q.sets ?? []).map((f) => ({ f, q, version: false })),
    ...(q.kind === "file" ? q.claims.flatMap((c) => (c.sets ?? []).map((f) => ({ f, q, version: Boolean(c.version) }))) : []),
  ]);

  it("is the eleven links of CHAPTER1.md D, seven spine and four deep", () => {
    expect(ep.chain.map((l) => l.id)).toEqual([
      "reel", "kunals-gun", "two-firings", "shot", "alive", "kept", "car", "lie", "fire", "price", "edit",
    ]);
    expect(ep.chain.filter((l) => l.kind === "spine")).toHaveLength(7);
  });

  it("gives every deep link the owner's own version, with English under it", () => {
    for (const l of ep.chain.filter((x) => x.kind === "deep")) {
      expect(l.version, l.id).toBeTruthy();
      expect(l.english, l.id).toBeTruthy();
    }
  });

  it("is only ever traced by an answer that isn't his version", () => {
    for (const { f, q, version } of setters)
      if (f.startsWith("link:")) expect(version, `${q.id} traces ${f} with the owner's version`).toBe(false);
  });

  // Holds once the episodes are written (ROADMAP S6–S8); a stub has nothing to trace with.
  it.skipIf(ep.questions.length === 0)("can trace every link, and every spine link from a question nobody can skip", () => {
    for (const l of ep.chain) {
      const by = setters.filter((x) => x.f === (`link:${l.id}` as Flag));
      expect(by.length, `nothing traces ${l.id}`).toBeGreaterThan(0);
      if (l.kind === "spine") expect(by.some((x) => !x.q.optional), `${l.id} is spine but only optional`).toBe(true);
    }
  });
});

describe("the arrival", () => {
  // Script §8, beat 1: a note addressed to "M.", warning against the local
  // police station, naming Bhasin. The envelope it's on is ours (O2).
  it("holds the canon note, on the back of the Sehgal envelope", () => {
    const words = ep.arrival.note.join(" ");
    expect(ep.arrival.note[0]).toMatch(/^M\b/);
    expect(words).toMatch(/thane/i);
    expect(words).toContain("Bhasin");
    expect(ep.arrival.english).toMatch(/police station/);
    expect(ep.arrival.envelope?.front).toBe("Ishita weds Rohan");
  });
});

describe("the phone itself", () => {
  it("is its owner's, with the case file in the dock", () => {
    expect(ep.owner.name).toBe("Sameer Khurana");
    expect(ep.home.dock.map((i) => i.app)).toContain("casefile");
  });

  it("opens each episode on the minute CHAPTER1.md gives it", () => {
    expect(ep.clocks.map((c) => `${c.day} ${c.base}`)).toEqual(["Saturday 23:40", "Sunday 00:32", "Sunday 01:52"]);
    expect(ep.episodes).toEqual(["Missed Calls", "The Second Shot", "The Cancelled Rescue"]);
  });
});
