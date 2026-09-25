import { describe, expect, it } from "vitest";

import { conversation } from "@/lib/game/chat";
import { PARTLY, TOO_MUCH, UNPLACED, add, answer, answered, episodeOf } from "@/lib/game/engine";
import { upgrade } from "@/lib/found/progress";
import type { Thread } from "@/content/types";
import { ep, play } from "./support/play";

/**
 * The fourth play, as a stranger (PLAYTEST-SHAGUN.md #51–54): the obvious
 * proof isn't called wrong, the chat shows what was chosen, and the board
 * says how far off it is.
 */

const q = (id: string) => ep.questions.find((x) => x.id === id)!;

describe("proof that is true and on the point (#51)", () => {
  const s = add(
    play((x) => answered(x, "q1")),
    "saw:poster",
    "saw:badge",
    "saw:portrait",
    "saw:apple-account",
  );
  const file = (proof: string[]) => answer(ep, s, "q2", { claim: "dilip", proof });

  it("lets the waiter's portrait sit beside the badge that names him", () => {
    expect(file(["poster", "badge", "portrait"]).ok).toBe(true);
  });

  it("never lets it stand in for the proof", () => {
    expect(file(["poster", "portrait"])).toMatchObject({ ok: false, reply: PARTLY });
  });

  it("still asks for what proves nothing here to come off the table", () => {
    expect(file(["poster", "badge", "apple-account"])).toMatchObject({ ok: false, reply: TOO_MUCH });
  });

  it("names only evidence the chapter has, and never the claim's own refusals", () => {
    const ids = new Set(ep.evidence.map((e) => e.id));
    for (const x of ep.questions)
      if (x.kind === "file") for (const c of x.claims) for (const id of c.also ?? []) expect(ids.has(id), `${x.id}/${c.id}: ${id}`).toBe(true);
  });
});

describe("what the chat shows was said (#52)", () => {
  const nitin: Thread = (() => {
    const parts = ep.threads.filter((t) => t.name === "Nitin");
    return { ...parts[0], messages: parts.flatMap((t) => t.messages), replies: parts.flatMap((t) => t.replies ?? []) };
  })();
  const opened = play((x, scene) => episodeOf(x) === 3 && scene.kind === "table");
  const said = (...flags: Parameters<typeof add>[1][]) =>
    conversation(add(opened, "did:nitin-asked", ...flags), nitin, "Sunday").map((m) => m.text);

  it("shows the promise when the player promised, though it protects him as the Raju reason does", () => {
    const text = said("did:protect-nitin", "did:promised-nitin");
    expect(text).toContain("Tumhara naam kahin nahi aayega. Promise.");
    expect(text).not.toContain("Nahi. Dilip ke bhai Raju ke liye poochh raha hoon.");
  });

  it("shows the Raju reason when that was the one given", () => {
    const text = said("did:raju-trusts", "did:protect-nitin");
    expect(text).toContain("Nahi. Dilip ke bhai Raju ke liye poochh raha hoon.");
    expect(text).not.toContain("Tumhara naam kahin nahi aayega. Promise.");
  });
});

describe("the board says how far off it is (#53)", () => {
  const board = q("q10");
  if (board.kind !== "timeline") throw new Error("q10 is the board");
  const s = add(
    play((x, scene) => episodeOf(x) === 3 && scene.kind === "table"),
    ...board.rows.map((r) => `saw:${r.evidence}` as Parameters<typeof add>[1]),
  );
  const right = board.rows.map((r) => `${r.id}@${r.lane}`);
  const with_ = (id: string, lane: string) => right.map((p) => (p.startsWith(`${id}@`) ? `${id}@${lane}` : p));

  it("takes Nitin's 1:40 in his own lane as well as the car's", () => {
    expect(answer(ep, s, "q10", with_("v-140", "nitin")).ok).toBe(true);
    expect(answer(ep, s, "q10", right).ok).toBe(true);
  });

  it("counts the rows in the wrong lane, without saying which", () => {
    expect(answer(ep, s, "q10", with_("v-112", "dilip")).reply).toBe("One row is in the wrong lane.");
    const two = with_("v-112", "dilip").map((p) => (p.startsWith("v-241@") ? "v-241@car" : p));
    expect(answer(ep, s, "q10", two).reply).toBe("2 rows are in the wrong lane.");
  });

  it("asks for every row to have a lane first", () => {
    expect(answer(ep, s, "q10", right.slice(1)).reply).toBe(UNPLACED);
  });
});

describe("a record kept without a name survives a reload (#54)", () => {
  it("keeps “Without his name” in the save", () => {
    const s = { version: 4, run: "r", flags: [], started: 1, at: {}, record: { car: "anon", lie: "anon", price: "out" } };
    expect(upgrade(s)?.record).toEqual({ car: "anon", lie: "anon", price: "out" });
  });
});
