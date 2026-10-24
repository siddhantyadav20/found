import { describe, expect, it } from "vitest";

import { conversation } from "@/lib/game/chat";
import { PARTLY, TOO_MUCH, add, answer, answered, episodeOf, readSentence } from "@/lib/game/engine";
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
    expect(file(["poster", "badge", "apple-account"])).toMatchObject({ ok: false, reply: expect.stringContaining(TOO_MUCH) });
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

/* The board became a sentence on 2026-10-23: players stalled on five lanes. */
describe("Q10, said as a sentence (2026-10-23)", () => {
  const s = play((x, scene) => episodeOf(x) === 3 && scene.kind === "table");
  const kept = { where: "service room", who: "Bhasin", state: "awake" };

  it("files Bhasin's service room with his 12:38 order and Pappu's 1:14", () => {
    const r = answer(ep, add(s, "saw:no-112", "saw:conscious"), "q10", { claim: "kept", proof: ["no-112", "conscious"] });
    expect(r.ok).toBe(true);
    // The three moments the board used to light, said in its answer, as the bridge to Q11.
    expect(r.reply).toMatch(/1:49[\s\S]*1:53[\s\S]*1:56/);
  });

  it("points at the wrong word, and answers a near miss in its own words", () => {
    const q10 = q("q10");
    expect(readSentence(q10, { ...kept, where: "hospital" }).why).toMatch(/Koi 112 nahi karega/);
    expect(readSentence(q10, { ...kept, where: "hospital" }).wrong).toEqual(["where"]);
    expect(readSentence(q10, { ...kept, state: "unconscious" }).wrong).toEqual(["state"]);
    expect(readSentence(q10, kept).claim?.id).toBe("kept");
  });
});

describe("a record kept without a name survives a reload (#54)", () => {
  it("keeps “Without his name” in the save", () => {
    const s = { version: 4, run: "r", flags: [], started: 1, at: {}, record: { car: "anon", lie: "anon", price: "out" } };
    expect(upgrade(s)?.record).toEqual({ car: "anon", lie: "anon", price: "out" });
  });
});
