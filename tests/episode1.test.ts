import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { AppId, Question } from "@/content/types";
import {
  add,
  answer,
  battery,
  dueEvents,
  filedClaim,
  fire,
  homeIcons,
  newCase,
  openApp,
  openQuestion,
  see,
  seen,
  settle,
  type CaseState,
} from "@/lib/game/engine";
import { sceneOf } from "@/lib/game/scene";

/**
 * Episode 1, "Missed Calls", played the way a player can: open every app,
 * open what's inside them, lean in on a photo, answer what the case file
 * asks, and let the night happen (CHAPTER1.md F). It never sets a flag the
 * game itself wouldn't.
 */

const ep = STORIES.shagun;
const apps = [...new Set(homeIcons(ep).map((i) => i.app))] as AppId[];

/** Everything a careful player opens: each app, and each chat, photo, note and letter in it. */
function look(s: CaseState): CaseState {
  const opened = apps.reduce((acc, app) => openApp(ep, acc, app), s);
  return settle(ep, ep.evidence.reduce((acc, e) => see(ep, acc, e.id), opened));
}

function solve(s: CaseState, q: Question): CaseState {
  const has = (route: readonly string[]) => route.every((id) => seen(s, id));
  if (q.kind === "pick") {
    const route = [q.proof, ...(q.orProof ?? [])].find(has);
    if (!route) throw new Error(`${q.id}: nothing to table`);
    return answer(ep, s, q.id, route).state;
  }
  if (q.kind === "file") {
    // The truth if it can be proved; otherwise the version his phone supports.
    for (const c of [...q.claims].sort((a, b) => Number(Boolean(a.version)) - Number(Boolean(b.version)))) {
      const route = [c.proof, ...(c.orProof ?? [])].find(has);
      if (route) return answer(ep, s, q.id, { claim: c.id, proof: route }).state;
    }
    throw new Error(`${q.id}: no claim can be filed`);
  }
  throw new Error(`${q.id}: Episode 1 asks nothing of kind ${q.kind}`);
}

function play(): CaseState {
  let s = add(newCase("ep1", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
  for (let step = 0; step < 100; step++) {
    const scene = sceneOf(ep, s);
    if (scene.kind === "charge") return s;
    if (scene.kind === "ringing") {
      s = add(s, `did:declined-${scene.call.id}`);
      continue;
    }
    s = look(s);
    const due = dueEvents(ep, s)[0];
    if (due) s = fire(ep, s, due.id);
    const q = openQuestion(ep, s);
    if (q) s = solve(look(s), q);
  }
  throw new Error(`stuck at ${sceneOf(ep, s).kind}, question ${openQuestion(ep, s)?.id}`);
}

describe("Episode 1", () => {
  const s = play();

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
    for (const id of ["kunal-clip", "bts", "reel-take"]) expect(seen(s, id), id).toBe(false);
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
