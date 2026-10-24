import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { add, dueEvents, newCase } from "@/lib/game/engine";
import { eventsFor, reportFlag } from "@/lib/found/events";
import { nightOf, nightText } from "@/lib/found/night";
import { releaseLeft, releaseOf } from "@/lib/found/release";
import { momentDone, REALTIME, sceneOf } from "@/lib/game/scene";
import { ep, play } from "./support/play";

/* The enhancements of 2026-10-24: real time, everyone's outcome, your night,
   and episode drops. */

describe("real time", () => {
  const atAlive = (real: boolean) => {
    const s = play((st) => st.flags.includes("did:knows-alive"));
    return real ? add(s, REALTIME) : s;
  };

  it("holds the calls for the player instead of opening them", () => {
    const due = (s: ReturnType<typeof atAlive>) => dueEvents(ep, s).map((e) => e.id);
    expect(due(atAlive(false))).toContain("seven-clock");
    expect(due(atAlive(true))).not.toContain("seven-clock");
    expect(due(atAlive(true))).toContain("seven-clock-real");
  });

  it("makes the calls when asked", () => {
    const s = add(atAlive(true), "fired:seven-clock-real", ...ep.realtime!.go);
    const scene = sceneOf(ep, s);
    expect(scene.kind === "moment" && scene.moment.id).toBe("first-call");
  });

  it("run out, loses him at 3:30 and never offers the calls", () => {
    const s = add(atAlive(true), "fired:seven-clock-real", ...ep.realtime!.out);
    const scene = sceneOf(ep, s);
    expect(scene.kind === "moment" && scene.moment.id).toBe("late-clock");
    const after = add(s, momentDone("late-clock"), "did:rescue-told");
    expect(sceneOf(ep, after).kind).not.toBe("moment");
  });
});

describe("everyone's outcome", () => {
  it("is counted when the night decides it", () => {
    expect(reportFlag("did:saved", ep)).toBe("fate:yes");
    expect(reportFlag("did:lost", ep)).toBe("fate:no");
    expect(eventsFor(ep)).toEqual(expect.arrayContaining(["fate:yes", "fate:no", "share:night"]));
  });

  it("isn't counted for a chapter without one", () => {
    expect(eventsFor(STORIES.lastlocal)).not.toContain("fate:yes");
  });
});

describe("your night", () => {
  it("reads the player's own night, in order, and shares none of its names", () => {
    const s = add(newCase("t", 0), "did:opened", "did:answered-raju", "did:knows-alive", "did:moment-after-meera", "did:call-meera", "did:call-raju", "did:saved", "did:sent");
    const beats = nightOf(ep, s).map((b) => b.text);
    expect(beats[0]).toMatch(/parcel/);
    expect(beats).toContain("Called Meera first.");
    expect(beats).toContain("Then Raju.");
    expect(beats).not.toContain("Then Meera.");
    const text = nightText(ep.title, nightOf(ep, s), "Did you get there before seven?", "https://x/c/raakh");
    for (const name of ["Meera", "Raju", "Dilip", "Sameer", "Bhasin", "alive", "body"]) expect(text).not.toContain(name);
    expect(text).toContain("Got there before seven.");
  });
});

describe("episode drops", () => {
  it("holds nothing back unless a release is set", () => {
    expect(releaseOf("raakh", 3)).toBeUndefined();
    expect(releaseOf("raakh", 2)).toBeUndefined();
  });

  it("counts down the way a person says it", () => {
    expect(releaseLeft(3 * 3600_000 + 5 * 60_000)).toBe("3h 05m");
    expect(releaseLeft(200_000)).toBe("3m 20s");
    expect(releaseLeft(50 * 3600_000)).toBe("2d 02h");
  });
});

describe("the record waits for seven o'clock", () => {
  it("can't be sent between the twist and the calls", async () => {
    const { holding } = await import("@/lib/game/hold");
    const alive = play((st) => st.flags.includes("did:knows-alive"));
    expect(holding(ep, alive)).toBe(true);
    expect(holding(ep, add(alive, "did:rescue-told"))).toBe(false);
    expect(holding(ep, add(newCase("t", 0), "did:opened"))).toBe(false);
  });
});
