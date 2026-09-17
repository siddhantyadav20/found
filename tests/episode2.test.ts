import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { AppId, Flag } from "@/content/types";
import { add, answer, newCase, openApp, openQuestion, see, type CaseState } from "@/lib/game/engine";

/**
 * Episode 2: three versions of a death, a girl who was frightened, a list
 * with the player on it, and the note they have been obeying since 1:11.
 *
 * The episode must also hold its own shape: nothing in it may be reachable
 * before the charger, because Episode 1 is a different game.
 */

const ep = STORIES["dont-cut-the-call"];

const opens = (s: CaseState, apps: readonly AppId[]) => apps.reduce((acc, app) => openApp(ep, acc, app), s);

const answered = (s: CaseState, id: string, given: readonly string[] | string): CaseState => {
  const r = answer(ep, s, id, given);
  expect(r.ok, `${id}: ${r.reply}`).toBe(true);
  return r.state;
};

/** Where Episode 1 leaves the player: plugged in, with four answers behind them. */
const afterEpisodeOne = (): CaseState => {
  const flags: Flag[] = [
    "did:opened",
    "did:unlock",
    "saw:note",
    "saw:call",
    "fired:alert",
    "ask:whose",
    "ask:knew",
    "ask:number",
    "ask:where",
    "did:placed-him",
    "did:bank-dead",
    "did:charged",
    "ep:2",
  ];
  return { ...newCase("t", 0), flags };
};

describe("Episode 2", () => {
  it("plays from the charger to \"Good morning, #9\"", () => {
    let s = opens(afterEpisodeOne(), ["news", "messages", "phone", "whatsapp", "photos", "instagram", "pikdrop", "notes", "settings"]);

    expect(openQuestion(ep, s)?.id).toBe("how-died");
    s = answered(s, "how-died", ["murder"]);

    s = answered(s, "who-told", "Tanvi");

    // The list is in the bin: it has to be recovered before it can be used.
    expect(answer(ep, s, "why-you", ["list", "booking"]).ok).toBe(false);
    s = see(ep, add(s, "did:restored-diary-6"), "list");
    s = answered(s, "why-you", ["list", "booking"]);
    expect(s.flags).toContain("did:number-nine");

    // Her friend, and the note she actually wrote.
    s = add(s, "did:shaila-told", "did:shaila-trusted");
    s = see(ep, s, "real-note");
    expect(s.flags).toContain("saw:real-note");
    s = answered(s, "who-wrote", ["real-note", "note"]);

    s = answered(s, "after-midnight", ["andheri", "reminder", "deleted", "forever", "edited"]);
    expect(s.flags).toContain("did:timeline");
  });

  it("answers the note question the hard way, without Shaila", () => {
    let s = opens(afterEpisodeOne(), ["pikdrop", "photos"]);
    s = answered(s, "how-died", ["murder"]);
    s = answered(s, "who-told", "the girl");
    s = see(ep, add(s, "did:restored-diary-6"), "list");
    s = answered(s, "why-you", ["list", "booking"]);
    // Handwriting and logistics, with no witness to help: the careful route.
    s = answered(s, "who-wrote", ["note", "detour"]);
    expect(s.flags).toContain("did:note-is-theirs");
    // And nobody was put in danger to get there.
    expect(s.ledger).toEqual([]);
  });

  it("keeps Episode 2 out of Episode 1", () => {
    const early = opens(newCase("e1", 0), ["photos", "instagram", "phone", "pikdrop", "settings"]);
    for (const id of ["diary-7", "list", "terrace", "detour", "collector", "profile"])
      expect(early.flags, id).not.toContain(`saw:${id}`);
    expect(openQuestion(ep, early)?.episode).toBe(1);
  });

  it("only lets them say something once there is something to say", () => {
    const shaila = ep.threads.find((t) => t.reply?.id === "shaila");
    expect(shaila?.requires).toContain("ep:2");
    const proof = ep.threads.find((t) => t.reply?.id === "shaila-proof");
    // She asks for the one thing a stranger could not know, and only after
    // the player has told her the truth.
    expect(proof?.requires).toContain("did:shaila-told");
    expect(proof?.reply?.options.some((o) => o.sets?.includes("did:shaila-trusted"))).toBe(true);
  });

  it("charges the player for what they hand over, and nothing else", () => {
    const told = ep.threads.flatMap((t) => t.reply?.options ?? []).find((o) => o.id === "truth");
    expect(told?.exposes).toBe("shaila");
    const quiet = ep.threads.flatMap((t) => t.reply?.options ?? []).find((o) => o.id === "nothing");
    expect(quiet?.exposes).toBeUndefined();
  });
});
