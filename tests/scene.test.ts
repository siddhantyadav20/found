import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Story } from "@/content/types";
import { add, battery, clockNow, dayNow, newCase, stamp, type CaseState } from "@/lib/game/engine";
import { ENDING_SEEN, finish } from "@/lib/game/endings";
import { NEEDS_CHARGE, PLUGGED_IN, sceneOf, titleShown } from "@/lib/game/scene";

/**
 * Where the player is, decided by the save alone, so a reload always lands
 * in the same place: the parcel, the note, the table, the charger, a title
 * card, a call, the choice, the ending and the card.
 */

const ep = STORIES.shagun;
const opened = (): CaseState => add(newCase("t", 0), "did:opened");
const MIN = 60_000;

describe("the way in", () => {
  it("goes parcel → note → table", () => {
    expect(sceneOf(ep, null).kind).toBe("parcel");
    expect(sceneOf(ep, opened()).kind).toBe("note");
    expect(sceneOf(ep, add(opened(), "did:unlock")).kind).toBe("table");
  });
});

describe("between episodes", () => {
  const unlocked = () => add(opened(), "did:unlock");

  it("waits on the charger, then shows each new episode's title once", () => {
    let s = add(unlocked(), NEEDS_CHARGE);
    expect(sceneOf(ep, s).kind).toBe("charge");
    s = add(s, ...PLUGGED_IN);
    expect(sceneOf(ep, s)).toEqual({ kind: "title", episode: 2 });
    s = add(s, titleShown(2));
    expect(sceneOf(ep, s).kind).toBe("table");
    s = add(s, "ep:3");
    expect(sceneOf(ep, s)).toEqual({ kind: "title", episode: 3 });
    expect(sceneOf(ep, add(s, titleShown(3))).kind).toBe("table");
  });

  it("opens each episode on its own clock, however long the last one took", () => {
    const s = add(unlocked(), NEEDS_CHARGE, ...PLUGGED_IN);
    const two = stamp(s, 90 * MIN);
    expect(clockNow(ep, two, 90 * MIN)).toBe("00:32");
    expect(clockNow(ep, two, 100 * MIN)).toBe("00:42");
    expect(dayNow(ep, two)).toBe("Sunday");
    expect(clockNow(ep, unlocked(), 5 * MIN)).toBe("23:45");
  });

  it("runs the battery down off the charger and up on it", () => {
    const drained: Story = { ...ep, clocks: [{ ...ep.clocks[0], drain: [{ after: "did:low", battery: 2 }] }, ep.clocks[1], ep.clocks[2]] };
    expect(battery(drained, unlocked(), 0)).toBe(9);
    expect(battery(drained, add(unlocked(), "did:low"), 0)).toBe(2);
    const charging = stamp(add(unlocked(), NEEDS_CHARGE, ...PLUGGED_IN), 0);
    expect(battery(ep, charging, 10 * MIN)).toBe(12);
    expect(battery(ep, charging, 500 * MIN)).toBe(100);
  });
});

describe("a call arriving", () => {
  const ringing: Story = {
    ...ep,
    incoming: [{ id: "raju", device: "owner", from: "+91 62…", at: "23:41", after: ["did:past-lock"], lines: [] }],
  };
  const past = () => add(opened(), "did:unlock", "did:past-lock");

  it("rings until it's answered or declined, and a declined call doesn't ring back", () => {
    expect(sceneOf(ringing, past()).kind).toBe("ringing");
    expect(sceneOf(ringing, add(past(), "did:declined-raju")).kind).toBe("table");
    expect(sceneOf(ringing, add(past(), "did:done-raju")).kind).toBe("table");
  });
});

describe("the end", () => {
  const ending: Story = {
    ...ep,
    endings: [{ id: "a", row: "Send the record", lines: [], last: [], onlyHere: "—" }],
  };

  it("goes choice → ending → card", () => {
    let s = add(opened(), "did:unlock", "did:choice");
    expect(sceneOf(ending, s).kind).toBe("choice");
    s = add(s, ...finish("a"));
    expect(sceneOf(ending, s).kind).toBe("ending");
    expect(sceneOf(ending, add(s, ENDING_SEEN)).kind).toBe("end-card");
  });
});
