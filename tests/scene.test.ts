import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Story } from "@/content/types";
import { add, battery, clockNow, dayNow, fire, minutesSince, newCase, type CaseState } from "@/lib/game/engine";
import { ENDING_SEEN, finish } from "@/lib/game/endings";
import { darkDone, DEATH_SEEN, NEEDS_CHARGE, openerShown, PLUGGED_IN, recapShown, sceneOf, teaserShown, titleShown } from "@/lib/game/scene";

/**
 * Where the player is, decided by the save alone, so a reload always lands
 * in the same place: the parcel, the note, the table, the charger, a title
 * card, a call, the ending and the card.
 */

const ep = STORIES.raakh;
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

  it("dies, says Found so far, plays Next, waits on the charger, then Previously and the title, once (RAAKH-V3 §7.12, §8)", () => {
    let s = add(unlocked(), NEEDS_CHARGE);
    expect(sceneOf(ep, s)).toEqual({ kind: "death" });
    s = add(s, DEATH_SEEN);
    expect(sceneOf(ep, s)).toEqual({ kind: "recap", episode: 1 });
    s = add(s, recapShown(1));
    expect(sceneOf(ep, s)).toEqual({ kind: "next", episode: 1 });
    s = add(s, teaserShown(1));
    expect(sceneOf(ep, s).kind).toBe("charge");
    s = add(s, ...PLUGGED_IN);
    expect(sceneOf(ep, s)).toEqual({ kind: "opener", episode: 2 });
    s = add(s, openerShown(2));
    expect(sceneOf(ep, s)).toEqual({ kind: "title", episode: 2 });
    s = add(s, titleShown(2));
    expect(sceneOf(ep, s).kind).toBe("table");
    // Episode 2 ends on the 1:52 bubble, held on black; the freeze is what sets Episode 3.
    s = add(s, "did:freeze-2");
    expect(sceneOf(ep, s)).toMatchObject({ kind: "dark", dark: { id: "freeze-2" } });
    s = add(s, darkDone("freeze-2"), "ep:3");
    expect(sceneOf(ep, s)).toEqual({ kind: "recap", episode: 2 });
    s = add(s, recapShown(2));
    expect(sceneOf(ep, s)).toEqual({ kind: "next", episode: 2 });
    s = add(s, teaserShown(2));
    expect(sceneOf(ep, s)).toEqual({ kind: "opener", episode: 3 });
    s = add(s, openerShown(3));
    expect(sceneOf(ep, s)).toEqual({ kind: "title", episode: 3 });
    expect(sceneOf(ep, add(s, titleShown(3))).kind).toBe("table");
  });

  it("moves the clock only at beats, never by the wall (RAAKH-V3 §17)", () => {
    const s = unlocked();
    expect(clockNow(ep, s, 0)).toBe("23:40");
    expect(clockNow(ep, s, 500 * MIN)).toBe("23:40");
    expect(clockNow(ep, add(s, "did:past-lock"), 0)).toBe("23:44");
    expect(clockNow(ep, add(s, "did:past-lock", "ask:q1"), 0)).toBe("23:52");
    // Past midnight the day turns, in Episode 1 itself.
    const late = add(s, "did:past-lock", "ask:q1", "ask:q2");
    expect(clockNow(ep, late, 0)).toBe("00:00");
    expect(dayNow(ep, late)).toBe("Sunday");
    expect(dayNow(ep, s)).toBe("Saturday");
    const two = add(unlocked(), NEEDS_CHARGE, ...PLUGGED_IN);
    expect(clockNow(ep, two, 90 * MIN)).toBe("00:32");
  });

  it("counts how long ago a notification came on the story's clock", () => {
    const one = fire(ep, add(unlocked(), "did:past-lock"), "raju-rings", 0);
    expect(minutesSince(ep, one, "raju-rings", 0)).toBe(3);
    expect(minutesSince(ep, one, "never-came", 0)).toBeUndefined();
  });

  it("runs the battery down with the beats, and up on the charger with the story's clock", () => {
    expect(battery(ep, unlocked(), 0)).toBe(9);
    expect(battery(ep, add(unlocked(), "ask:q1", "ask:q2", "ask:q3", "fired:dying"), 0)).toBe(2);
    const charging = add(unlocked(), NEEDS_CHARGE, ...PLUGGED_IN);
    expect(battery(ep, charging, 999 * MIN)).toBe(2);
    expect(battery(ep, add(charging, "ask:q4"), 0)).toBe(2 + Math.floor(16 * 0.78));
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
    endings: [{ id: "a", row: "Send the record", when: { acts: ["send"] }, lines: [], last: [], onlyHere: "—" }],
  };

  it("goes from the table, by an act on your phone, to the ending and then the card", () => {
    let s = add(opened(), "did:unlock");
    expect(sceneOf(ending, s).kind).toBe("table");
    s = add(s, ...finish("a"));
    expect(sceneOf(ending, s).kind).toBe("ending");
    expect(sceneOf(ending, add(s, ENDING_SEEN)).kind).toBe("end-card");
  });
});

/* Q4 of the perfection pass (2026-10-26): each later episode opens on what
   the player filed, in their words, and a briefing. */
describe("Previously", () => {
  it("draws only on questions that exist and were asked before the episode it opens", () => {
    for (const [n, opener] of Object.entries(ep.openers ?? {})) {
      for (const id of opener!.previously) {
        const q = ep.questions.find((x) => x.id === id);
        expect(q, id).toBeDefined();
        expect(q!.episode, id).toBeLessThan(Number(n));
      }
      expect(ep.recaps?.[(Number(n) - 1) as 1 | 2]?.open.length, `episode ${n}`).toBeGreaterThan(0);
    }
  });
});
