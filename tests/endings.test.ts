import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Flag } from "@/content/types";
import { add, newCase, type CaseState } from "@/lib/game/engine";
import { chosen, ENDING_SEEN, finish, linesFor } from "@/lib/game/endings";
import { resultOf } from "@/lib/found/result";
import { reportFlag } from "@/lib/found/events";
import { sceneOf } from "@/lib/game/scene";

/**
 * The three endings (CHAPTER1.md E): each reads the night back, none of them
 * is signalled as the right one, and every one lands on the same card.
 */

const ep = STORIES["dont-cut-the-call"];
const atChoice = (...more: Flag[]): CaseState =>
  add(newCase("t", 0), "did:opened", "did:unlock", "ep:2", "ep:3", "did:woke", "did:done-arrest", "did:choice", ...more);
const texts = (id: "police" | "bin" | "friend", s: CaseState) =>
  linesFor(s, ep.endings.find((e) => e.id === id)!.lines).map((l) => l.text);

describe("the choice", () => {
  it("offers three rows in a fixed order, the same for everybody", () => {
    expect(ep.endings.map((e) => e.row)).toEqual(["Report to police", "Throw it away", "Share with a friend"]);
  });

  it("draws the three rows with one style, so the layout has no opinion", () => {
    const src = readFileSync("components/stage/ending/Choice.tsx", "utf8");
    // One button, mapped over the endings: no row can be styled apart.
    expect(src.match(/className=\{styles\.row\}/g)).toHaveLength(1);
    expect(src).toContain("story.endings.map");
  });

  it("goes choice → ending → card, and a reload lands in the same place", () => {
    let s = atChoice();
    expect(sceneOf(ep, s).kind).toBe("choice");
    s = add(s, ...finish("bin"));
    expect(sceneOf(ep, s).kind).toBe("ending");
    expect(chosen(ep, s)?.id).toBe("bin");
    s = add(s, ENDING_SEEN);
    expect(sceneOf(ep, s).kind).toBe("end-card");
  });

  it("tells the funnel which ending, and that it ended", () => {
    expect(finish("friend").map(reportFlag)).toEqual(["end:friend", "end"]);
  });
});

describe("the endings read the night back", () => {
  it("lets the police keep the phone only if she told you where, or you blinded them", () => {
    expect(texts("police", atChoice()).join(" ")).toContain("wipes itself");
    expect(texts("police", atChoice("saw:real-note")).join(" ")).toContain("airplane mode");
    expect(texts("police", atChoice("did:removed-profile")).join(" ")).toContain("Achha kiya app hataya");
    expect(texts("police", atChoice("saw:real-note")).join(" ")).not.toContain("wipes itself");
  });

  it("makes you a suspect if the password was typed, and clears you only with the route", () => {
    expect(texts("police", atChoice()).join(" ")).not.toContain("suspect");
    expect(texts("police", atChoice("did:typed-password")).join(" ")).toContain("and then for longer");
    expect(texts("police", atChoice("did:typed-password", "saw:detour")).join(" ")).toContain("route clears you");
  });

  it("changes her son, and the next victim, with what you did", () => {
    expect(texts("police", atChoice("did:nikhil-lied")).join(" ")).toContain("never writes");
    expect(texts("bin", atChoice("did:nikhil-lied")).join(" ")).toContain("police banke");
    expect(texts("bin", atChoice("did:shaila-told")).join(" ")).toContain("Shivaji Park woman");
    expect(texts("bin", atChoice()).join(" ")).toContain("row 7");
  });

  it("ends 03 on a reply, and 01 and 02 on one withheld", () => {
    expect(ep.endings.find((e) => e.id === "friend")?.reply?.map((r) => r.text)).toEqual(["Kaat de.", "Mat kaat.", "Send nothing"]);
    expect(ep.endings.find((e) => e.id === "police")?.reply).toBeUndefined();
    expect(ep.endings.find((e) => e.id === "bin")?.reply).toBeUndefined();
  });
});

describe("the card", () => {
  it("counts what they had on you, and the minutes, once the chapter has ended", () => {
    const clean = add(atChoice(), ...finish("police"));
    expect(resultOf(ep, clean, 30 * 60_000)).toMatchObject({ held: [], minutes: 30 });
    const messy = { ...add(atChoice(), ...finish("friend")), ledger: ["voice", "pin"] };
    expect(resultOf(ep, messy).held).toEqual(["Your voice", "Her password"]);
  });
});
