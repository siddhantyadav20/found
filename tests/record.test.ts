import { describe, expect, it } from "vitest";

import { answered, dueEvents } from "@/lib/game/engine";
import { linesFor } from "@/lib/game/endings";
import { actFlags, endingFor, recordRows, setRow } from "@/lib/game/record";
import { ep, look, play } from "./support/play";

/**
 * The record and the act that ends the chapter (CHAPTER1.md I): what the
 * player filed goes in as they filed it, can be changed, and decides the
 * ending together with what they do with it.
 */

/** Q3 filed as Sameer tells it: his version, carried into the record as fact. */
const afterQ3 = () => play((s) => answered(s, "q3"), [], undefined, { prefer: "version" });
const toEnd = (say = [] as Parameters<typeof play>[1]) =>
  play((s) => answered(s, "q13") && dueEvents(ep, s).length === 0 && look(s) === s, say);

describe("the record", () => {
  it("has one row per link, in the chain's order", () => {
    expect(recordRows(ep, afterQ3()).map((r) => r.link.id)).toEqual(ep.chain.map((l) => l.id));
  });

  it("carries a filed version as fact, in the player's own words, until they say otherwise", () => {
    const s = afterQ3();
    const row = recordRows(ep, s).find((r) => r.link.id === "two-firings")!;
    expect(row.traced).toBe(false);
    expect(row.choice).toBe("fact");
    expect(row.line).toMatch(/while Kunal Sehgal was firing/);
    expect(row.options).toEqual(["out", "says", "fact"]);
    const says = recordRows(ep, setRow(ep, s, "two-firings", "says")).find((r) => r.link.id === "two-firings")!;
    expect(says.line).toMatch(/^Sameer says:/);
  });

  it("puts a traced link in, in the record's words, and lets it be left out, but never passed off as a version", () => {
    const s = toEnd(["did:nitin-asked", "did:protect-nitin"]);
    const lie = recordRows(ep, s).find((r) => r.link.id === "lie")!;
    // The lie names Nitin, so it can go in without his name.
    expect([lie.traced, lie.choice, lie.options]).toEqual([true, "in", ["in", "anon", "out"]]);
    expect(setRow(ep, s, "lie", "fact")).toBe(s);
    const shot = recordRows(ep, s).find((r) => r.link.id === "shot")!;
    expect(shot.options).toEqual(["in", "out"]);
    const kept = recordRows(ep, setRow(ep, s, "lie", "anon")).find((r) => r.link.id === "lie")!;
    expect(kept.line).not.toMatch(/Nitin/);
    expect(endingFor(ep, setRow(ep, s, "lie", "anon"), "send")?.id).toBe("complete");
  });
});

describe("the act", () => {
  it("posted before the two firings are told apart, is The Wrong Story; sent, it's his version", () => {
    const s = afterQ3();
    expect(endingFor(ep, s, "post")?.id).toBe("wrong");
    expect(endingFor(ep, s, "send")?.id).toBe("version");
  });

  it("with the lie and the edit traced and in, and nothing passed off, is The Complete Record, sent or posted", () => {
    const s = toEnd(["did:nitin-asked", "did:protect-nitin"]);
    expect(endingFor(ep, s, "send")?.id).toBe("complete");
    expect(endingFor(ep, s, "post")?.id).toBe("complete");
    expect(actFlags(ep, s, "post")).toEqual(expect.arrayContaining(["did:end-complete", "did:chose", "did:posted"]));
  });

  it("with the lie left out, is Sameer's Version, and remembers it was left out", () => {
    const s = setRow(ep, toEnd(["did:nitin-asked", "did:protect-nitin"]), "lie", "out");
    expect(endingFor(ep, s, "send")?.id).toBe("version");
    expect(actFlags(ep, s, "send")).toContain("did:left-out-lie");
  });

  it("with an untraced link passed off as fact, is Sameer's Version too", () => {
    // The money is on the side, so a full play can leave it untraced; saying his version of it as fact costs A.
    const s = setRow(ep, toEnd(["did:nitin-asked", "did:protect-nitin"]), "price", "fact");
    expect(endingFor(ep, s, "send")?.id).toBe("version");
    expect(actFlags(ep, s, "send")).toContain("did:fact-price");
  });

  it("gives the phone back from minute one", () => {
    expect(endingFor(ep, play((s) => s.flags.includes("did:unlock")), "return")?.id).toBe("returned");
  });

  it("has an ending for every act at every point, so no act can do nothing", () => {
    for (const s of [afterQ3(), toEnd()]) for (const act of ["send", "post", "return"] as const) expect(endingFor(ep, s, act), act).toBeDefined();
  });
});

describe("what the ending reads back", () => {
  const lines = (flags: readonly string[], say: Parameters<typeof play>[1]) => {
    const s = toEnd(say);
    const done = { ...s, flags: [...s.flags, ...(flags as typeof s.flags)] };
    const e = ep.endings.find((x) => done.flags.includes(`did:end-${x.id}`))!;
    return [...linesFor(done, e.lines), ...linesFor(done, e.last)].map((l) => l.text);
  };

  it("in The Complete Record: Meera reading it, Nitin if his name was kept out, Raju's photograph if you told him", () => {
    const say = ["did:nitin-asked", "did:protect-nitin", "did:raju-trusts", "did:told-raju"] as const;
    const s = ["car", "lie"].reduce((acc, id) => setRow(ep, acc, id, "anon"), toEnd([...say]));
    const text = lines(actFlags(ep, s, "send"), [...say]);
    expect(text[0]).toMatch(/^Ye complete hai/);
    expect(text).toContain("Theek hai. Sach hai.");
    expect(text).not.toContain("Nitin's name is in it: the one person who tried.");
    expect(text.at(-2)).toMatch(/Chhath/);
    expect(text.at(-1)).toMatch(/He held the light/);
  });

  it("in The Complete Record: says so when the player named Nitin after promising him", () => {
    const say = ["did:nitin-asked", "did:protect-nitin"] as const;
    const s = toEnd([...say]);
    const text = lines([...actFlags(ep, s, "send"), "did:promised-nitin"], [...say]);
    expect(text).toContain("Nitin reads his own name in it. You'd promised him it wouldn't be there.");
    expect(text).not.toContain("Theek hai. Sach hai.");
  });

  it("in Sameer's Version: says, flatly, what was left out, and nothing more", () => {
    const s = setRow(ep, toEnd(["did:nitin-asked", "did:protect-nitin"]), "lie", "out");
    const text = lines(actFlags(ep, s, "send"), ["did:protect-nitin"]);
    expect(text).toContain("You knew about 1:52. You left it out.");
  });
});
