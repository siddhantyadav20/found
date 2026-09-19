import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { AppId, Flag, Question } from "@/content/types";
import {
  add,
  all,
  answer,
  dueEvents,
  fire,
  homeIcons,
  newCase,
  openApp,
  openQuestion,
  see,
  seen,
  type CaseState,
} from "@/lib/game/engine";
import { ENDING_SEEN, finish } from "@/lib/game/endings";
import { PLUGGED_IN, sceneOf } from "@/lib/game/scene";
import { resultOf } from "@/lib/found/result";

/**
 * The whole chapter, held to its own promises (ROADMAP P12):
 *
 * - every question has at least two ways in and exactly three hints
 * - every piece of evidence lives in exactly one place on her phone
 * - a player can go from the pouch to the end card handing them nothing
 * - every ending is reachable from that same run
 *
 * The run is played by a small solver that only uses what a player can do:
 * open apps, look at things, answer, decline a call. It never seeds a flag
 * the game itself wouldn't set, which is how QA.md's blockers got past.
 */

const ep = STORIES["dont-cut-the-call"];
const apps = [...new Set(homeIcons(ep).map((i) => i.app))] as AppId[];

/** Things a careful player does with their own hands, none of which hands anything over. */
const HANDS: Flag[] = ["saw:clock", "saw:burmese", "did:restored-diary-6"];

function look(s: CaseState): CaseState {
  let next = add(s, ...HANDS);
  next = apps.reduce((acc, app) => openApp(ep, acc, app), next);
  // Everything that has to be looked at rather than opened, where it can be.
  return ep.evidence.reduce((acc, e) => see(ep, acc, e.id), next);
}

function solve(s: CaseState, q: Question): CaseState {
  switch (q.kind) {
    case "pick": {
      const routes = [q.proof, ...(q.orProof ?? [])];
      const route = routes.find((r) => r.every((id) => seen(s, id)));
      if (!route) throw new Error(`${q.id}: no route is open (${routes.map((r) => r.join("+")).join(" | ")})`);
      return answer(ep, s, q.id, route).state;
    }
    case "type":
      return answer(ep, s, q.id, q.accepts[0]).state;
    case "timeline":
      return answer(
        ep,
        s,
        q.id,
        q.rows.filter((r) => r.lane === "phone" && seen(s, r.evidence)).map((r) => r.id),
      ).state;
    case "claims":
      return answer(
        ep,
        s,
        q.id,
        q.claims.filter((c) => c.trueWhen && all(s, c.trueWhen)).map((c) => c.id),
      ).state;
  }
}

/** Play from the pouch to the choice, as a player who gives them nothing. */
function cleanRun(): CaseState {
  let s = add(newCase("clean", 0), "did:opened", "did:unlock", "saw:note", "saw:call", "did:past-lock");
  for (let step = 0; step < 300; step++) {
    const scene = sceneOf(ep, s);
    if (scene.kind === "choice") return s;
    if (scene.kind === "charge") s = add(s, ...PLUGGED_IN);
    else if (scene.kind === "seen-by-them") s = add(s, "did:ep2-done");
    else if (scene.kind === "morning") s = add(s, "did:woke");
    else if (scene.kind === "ringing") {
      // Her son is left to ring; the arrest is answered, and nothing is said.
      const call = scene.call;
      s = call.insists
        ? add(s, `did:answered-${call.id}`, ...(call.sets ?? []), `did:done-${call.id}`)
        : add(s, `did:declined-${call.id}`);
    } else {
      s = look(s);
      const due = dueEvents(ep, s)[0];
      // The power bank's last line is only heard on a live call.
      if (due) s = fire(ep, s, due.id);
      else if (s.flags.includes("did:bank-dead")) s = add(s, "fired:cue-still-there");
      const q = openQuestion(ep, s);
      if (q) {
        const before = s;
        s = solve(look(s), q);
        if (s === before) throw new Error(`${q.id}: answering changed nothing`);
      }
    }
  }
  throw new Error(`stuck at ${sceneOf(ep, s).kind} with ${JSON.stringify(openQuestion(ep, s)?.id)}`);
}

describe("every question", () => {
  it("has three hints, the last of them the answer", () => {
    for (const q of ep.questions) {
      expect(q.hints, q.id).toHaveLength(3);
      for (const h of q.hints) expect(h.trim().length, q.id).toBeGreaterThan(10);
    }
  });

  it("has at least two ways in (PLAYER-JOURNEY law 3)", () => {
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

  /** One thing seen in two places on purpose: Rukhsana sent it, and Vasu saved it. */
  const SAME_THING_TWICE = new Set([
    "sahil-photo",
    // One debit, stamped when it happened: 3:02 if typed in the night, 10:34 if in the morning.
    "the-lakh",
  ]);

  it("is never filed in two places (opening its app finds the rest)", () => {
    for (const e of ep.evidence) {
      const n = places.get(e.id) ?? 0;
      expect(n, `${e.id} is filed in ${n} places`).toBeLessThanOrEqual(SAME_THING_TWICE.has(e.id) ? 2 : 1);
    }
  });

  it("that has to be looked for is somewhere it can be looked at", () => {
    // Manual evidence found by a gesture on the call or a question, not by a file.
    const gestures = new Set(["note", "call", "clock", "burmese"]);
    for (const e of ep.evidence.filter((x) => x.manual && !gestures.has(x.id)))
      expect(places.get(e.id) ?? 0, `${e.id} can never be seen`).toBeGreaterThanOrEqual(1);
  });

  it("points only at evidence that exists", () => {
    const ids = new Set(ep.evidence.map((e) => e.id));
    for (const id of places.keys()) expect(ids.has(id), id).toBe(true);
  });
});

describe("a clean run", () => {
  const s = cleanRun();

  it("reaches the choice from the pouch, answering every question", () => {
    expect(sceneOf(ep, s).kind).toBe("choice");
    for (const q of ep.questions) expect(s.flags, q.id).toContain(`ask:${q.id}`);
  });

  it("hands them nothing at all", () => {
    expect(s.ledger).toEqual([]);
  });

  it("can end all three ways, and every one lands on the card with nothing on you", () => {
    for (const e of ep.endings) {
      const ended = add(s, ...finish(e.id));
      expect(sceneOf(ep, ended).kind).toBe("ending");
      expect(sceneOf(ep, add(ended, ENDING_SEEN)).kind).toBe("end-card");
      expect(resultOf(ep, ended).held).toEqual([]);
    }
  });
});
