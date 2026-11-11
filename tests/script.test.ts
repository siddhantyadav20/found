import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { lintStory, type CodeFlags } from "@/lib/game/lint";

/* ===========================================================================
   Every chapter's script, checked (lib/game/lint.ts): the things a rewrite
   breaks without a type error. A failure names what broke and where.
   =========================================================================== */

/** Every source file of the game itself, outside the chapters' own data. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.(ts|tsx)$/.test(f) ? [p] : [];
  });
}

/** What the code sets by itself: literal flags, and the families it builds from an id. */
export function codeFlags(): CodeFlags {
  const text = ["lib", "components", "app"].flatMap(sources).map((f) => readFileSync(f, "utf8")).join("\n");
  const flags = new Set([...text.matchAll(/["'`]((?:did|fired|saw|ask|claim|link|hint|ep):[a-z0-9:-]+)["'`]/g)].map((m) => m[1]));
  // `did:answered-${id}` → "did:answered-": a family. A bare `did:${x}` names nothing.
  const prefixes = [...new Set([...text.matchAll(/`((?:did|fired|saw|ask|claim|link|hint):[a-z0-9:-]+)\$\{/g)].map((m) => m[1]))];
  return { flags, prefixes };
}

describe("every chapter's script", () => {
  const code = codeFlags();
  for (const [id, story] of Object.entries(STORIES)) {
    it(`${id}: names nothing that isn't there, and waits on nothing that never comes`, () => {
      expect(lintStory(story, code).map((p) => `${p.where}: ${p.what}`)).toEqual([]);
    });
  }
});

/* The checker, checked: each mistake a rewrite makes, planted in a copy of Raakh. */
describe("the script checker", () => {
  const code = codeFlags();
  const raakh = STORIES.raakh;
  const said = (story: typeof raakh) => lintStory(story, code).map((p) => `${p.where}: ${p.what}`).join("\n");

  it("catches a flag that's waited on and never set", () => {
    const events = raakh.events.map((e, i) => (i === 0 ? { ...e, after: [...e.after, "did:nitin-replyed" as const] } : e));
    expect(said({ ...raakh, events })).toMatch(/waits on “did:nitin-replyed”, which nothing sets/);
  });

  it("catches proof that names evidence the register doesn't have", () => {
    const questions = raakh.questions.map((q) =>
      q.kind === "file" && q.id === "q1" ? { ...q, claims: q.claims.map((c, i) => (i === 0 ? { ...c, proof: ["the-ticket"] } : c)) } : q,
    );
    expect(said({ ...raakh, questions })).toMatch(/names evidence “the-ticket”, which doesn't exist/);
  });

  it("catches evidence nothing on the phone carries", () => {
    const evidence = [...raakh.evidence, { id: "orphan", device: "owner" as const, app: "notes" as const, label: "Nobody put me anywhere" }];
    expect(said({ ...raakh, evidence })).toMatch(/evidence orphan: nothing on the phone carries it/);
  });

  it("catches two things sharing an id", () => {
    expect(said({ ...raakh, events: [...raakh.events, raakh.events[0]] })).toMatch(/two events are called/);
  });

  it("catches a row that says its answer before it's shown", () => {
    const questions = raakh.questions.map((q) =>
      q.kind === "file" && q.id === "q1"
        ? { ...q, claims: q.claims.map((c, i) => (i === 0 && c.facts ? { ...c, facts: c.facts.map((f, j) => (j === 0 ? { ...f, what: "that S is Sameer" } : f)) } : c)) }
        : q,
    );
    expect(said({ ...raakh, questions })).toMatch(/the row “that S is Sameer” says its answer/);
  });

  it("catches a question whose only proof comes in a later episode", () => {
    const q1 = raakh.questions.find((q) => q.id === "q1");
    const lead = q1?.kind === "file" ? q1.claims[0] : undefined;
    const ids = new Set((lead?.facts ?? []).flatMap((f) => f.by.flat()));
    const evidence = raakh.evidence.map((e) => (ids.has(e.id) ? { ...e, requires: [...(e.requires ?? []), "ep:3" as const] } : e));
    expect(said({ ...raakh, evidence })).toMatch(/question q1\.\w+: .* can't be shown in time: .* waits for Episode 3/);
  });

  it("catches a near miss that's really one of the row's own ways in", () => {
    const questions = raakh.questions.map((q) =>
      q.kind === "file" && q.id === "q5"
        ? { ...q, claims: q.claims.map((c, i) => (i === 0 && c.facts ? { ...c, facts: c.facts.map((f, j) => (j === 0 ? { ...f, misses: { conscious: "Look earlier." } } : f)) } : c)) }
        : q,
    );
    expect(said({ ...raakh, questions })).toMatch(/calls “conscious” a near miss, and it's one of the row's own ways in/);
  });

  it("catches Sameer's account that doesn't say where it breaks", () => {
    const questions = raakh.questions.map((q) => (q.kind === "file" && q.id === "q4" ? { ...q, claims: q.claims.map((c) => (c.version ? { ...c, against: ["Kunal fired twice"] } : c)) } : q));
    expect(said({ ...raakh, questions })).toMatch(/against “Kunal fired twice”, which isn't one of the true line's facts/);
  });

  it("catches a question the note can't open on", () => {
    const questions = raakh.questions.map((q) => (q.id === "q2" ? { ...q, scene: undefined } : q));
    expect(said({ ...raakh, questions })).toMatch(/question q2: a lines case file needs a scene/);
  });

  it("catches an ending filed that doesn't exist", () => {
    const questions = raakh.questions.map((q) => (q.kind === "file" && q.final ? { ...q, claims: q.claims.map((c, i) => (i === 0 ? { ...c, ending: "room7" } : c)) } : q));
    expect(said({ ...raakh, questions })).toMatch(/files the ending “room7”/);
  });
});
