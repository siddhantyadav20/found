import { describe, expect, it } from "vitest";

import { offeredOptions, openReply } from "@/lib/game/chat";
import { add, answer, answered, dueEvents, episodeOf, filedClaim, needsRevisit, seen, sideQuestions, traced } from "@/lib/game/engine";
import { AIRPLANE } from "@/lib/game/phone";
import type { Flag, Thread } from "@/content/types";
import { ep, look, play } from "./support/play";

/**
 * Episode 3, "The Cancelled Rescue", played the way a player can
 * (tests/support/play.ts), and its routes (CHAPTER1.md H): Nitin protected
 * or pressed, Kunal confronted or handed Nitin's name, Raju lied to, airplane
 * mode, and Sameer, one last time.
 */

const q = (id: string) => ep.questions.find((x) => x.id === id)!;
/** The last question answered, nothing still to arrive, and nothing left on the phone to find. */
const done = (s: Parameters<typeof answered>[0]) => answered(s, "q13") && dueEvents(ep, s).length === 0 && look(s) === s;
const toEnd = (say: readonly Flag[] = []) => play(done, say);
/** Episode 3, just opened. */
const opened = () => play((s, scene) => episodeOf(s) === 3 && scene.kind === "table");

/** A chat as the phone shows it: every entry with its name, merged. */
const thread = (name: string): Thread => {
  const parts = ep.threads.filter((t) => t.name === name);
  return { ...parts[0], messages: parts.flatMap((t) => t.messages), replies: parts.flatMap((t) => t.replies ?? []) };
};

describe("Episode 3", () => {
  const s = toEnd(["did:protect-nitin", "did:confronted-sameer"]);

  it("plays from 1:52 to the last question, answering Q10–Q13", () => {
    for (const id of ["q10", "q11", "q12", "q13"]) expect(s.flags, id).toContain(`ask:${id}`);
  });

  it("traces every link but the money for a player who dug, protected Nitin and confronted Sameer", () => {
    expect(traced(ep, s).map((l) => l.id)).toEqual(["reel", "kunals-gun", "two-firings", "shot", "alive", "kept", "car", "lie", "fire", "edit"]);
  });

  it("hears Sameer say it, and only once the whole chain is traced", () => {
    expect(seen(s, "the-line")).toBe(true);
    expect(s.flags).toContain("did:confronted-sameer");
  });
});

describe("Sameer, one last time", () => {
  const last = thread("+91 70••• •2290");

  it("offers the confrontation only with the shot, alive, the car and the lie traced", () => {
    const base = add(opened(), "fired:sameer-last");
    expect(offeredOptions(base, openReply(base, last)!).map((o) => o.id)).toEqual(["rescuer"]);
    const chain = add(base, "link:shot", "link:alive", "link:car", "link:lie");
    expect(offeredOptions(chain, openReply(chain, last)!).map((o) => o.id)).toEqual(["rescuer", "confront"]);
  });

  it("takes the rescuer and keeps talking, and his words become a source for his version", () => {
    const s = toEnd(["did:gave-rescuer"]);
    expect(seen(s, "sameer-rescuer")).toBe(true);
    expect(seen(s, "the-line")).toBe(false);
  });
});

describe("the routes", () => {
  it("closes Nitin once Kunal has his name, and the lie is still traceable on this phone", () => {
    const s = toEnd(["did:confronted-kunal"]);
    expect(s.flags).toContain("did:nitin-closed");
    expect(openReply(s, thread("Nitin"))).toBeUndefined();
    expect(seen(s, "nitin-shot-152")).toBe(false);
    expect(s.flags).toContain("link:lie");
    expect(filedClaim(q("q11"), s)?.id).toBe("told");
  });

  it("gets Kunal's frame from Kunal himself for a player who handed him Nitin", () => {
    const s = toEnd(["did:exposed-nitin"]);
    expect(seen(s, "kunal-frame")).toBe(true);
    expect(s.flags).toContain("did:nitin-closed");
  });

  it("gets the 1:52 screenshot from a Nitin who was protected", () => {
    const s = toEnd(["did:protect-nitin"]);
    expect(seen(s, "nitin-shot-152")).toBe(true);
    expect(seen(s, "vicky-location")).toBe(true);
  });

  it("has Raju hear at the Sehgals' that he was lied to", () => {
    const s = toEnd(["did:raju-told-kunal"]);
    expect(s.flags).toContain("did:raju-withdrew");
    expect(toEnd(["did:raju-trusts"]).flags).not.toContain("did:raju-withdrew");
  });

  it("goes quiet in airplane mode: nobody writes, nothing can be sent, and every question can still be answered", () => {
    const quiet = add(opened(), AIRPLANE);
    const s = play(done, ["did:protect-nitin", "did:confronted-kunal"], quiet);
    for (const id of ["q10", "q11", "q12", "q13"]) expect(s.flags).toContain(`ask:${id}`);
    for (const f of ["fired:sameer-last", "fired:nitin-named"]) expect(s.flags).not.toContain(f);
    // Nothing could be sent, so Nitin was never asked, and the lie was traced on this phone alone.
    for (const f of ["did:protect-nitin", "did:confronted-kunal"]) expect(s.flags).not.toContain(f);
    expect(filedClaim(q("q11"), s)?.id).toBe("told");
    expect(s.flags).toContain("link:lie");
    expect(s.flags).toContain("link:edit");
  });
});

describe("his version, filed with confidence", () => {
  it("is accepted for why the car left empty, and comes back on the side once Nitin's copy turns up", () => {
    const s = add(opened(), "saw:swift", "saw:left-empty", "ask:q10");
    const filed = answer(ep, s, "q11", { claim: "turned", proof: ["swift", "left-empty"] });
    expect(filed.ok).toBe(true);
    expect(filed.state.flags).not.toContain("link:lie");
    expect(needsRevisit(q("q11"), filed.state)).toBe(false);
    const copy = add(filed.state, "did:protect-nitin", "saw:nitin-shot-152");
    expect(needsRevisit(q("q11"), copy)).toBe(true);
    expect(sideQuestions(ep, copy).map((x) => x.id)).toContain("q11");
  });
});
