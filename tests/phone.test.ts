import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Photo, Story } from "@/content/types";
import { add, arrivedAt, fire, newCase } from "@/lib/game/engine";
import { calendar } from "@/lib/found/time";
import { SHOW_HIDDEN, clipOf, inBin, library, memos, mmss, restored, reverted, revertible, rupees } from "@/lib/game/phone";

/**
 * The found phone keeps iOS's promises, whatever the chapter: Recently
 * Deleted keeps things and gives them back, the Hidden album appears only
 * when Settings says so, and an edited clip keeps its original until it's
 * reverted (CHAPTER1.md E: every hard route is a real one).
 */

const shot = (id: string, more: Partial<Photo> = {}): Photo => ({ id, at: "12:31", day: "Sunday", kind: "scene", title: id, ...more });

const story: Story = {
  ...STORIES.shagun,
  photos: [
    shot("portrait", { album: "Sehgal wedding", favorite: true }),
    shot("bts", { album: "WhatsApp" }),
    shot("take", { deletedAt: "22:48", daysLeft: 28 }),
    shot("frame", { hidden: true }),
    shot("fire", {
      favorite: true,
      video: { seconds: 9, captions: [{ at: 1, line: "Jaldi karo." }] },
      original: { seconds: 31, captions: [{ at: 2, who: "Sameer", line: "Bhasin sir, yahan?" }], evidence: "fire-original" },
    }),
    shot("later", { requires: ["ep:2"] }),
  ],
  memos: [
    { id: "note", title: "New Recording", at: "16:58", day: "Monday", seconds: 12, lines: [] },
    { id: "doosri", title: "New Recording 2", at: "16:58", day: "Monday", seconds: 9, lines: [], deletedAt: "22:52", daysLeft: 28 },
  ],
};
const start = () => newCase("t", 0);
const ids = (ps: readonly { id: string }[]) => ps.map((p) => p.id);

describe("Photos", () => {
  it("keeps Recents, albums and Favorites apart from the bin and the hidden", () => {
    const lib = library(story, start());
    expect(ids(lib.recents)).toEqual(["portrait", "bts", "fire"]);
    expect(ids(lib.favorites)).toEqual(["portrait", "fire"]);
    expect(lib.albums.map((a) => [a.name, ids(a.photos)])).toEqual([
      ["Sehgal wedding", ["portrait"]],
      ["WhatsApp", ["bts"]],
    ]);
    expect(ids(lib.bin)).toEqual(["take"]);
  });

  it("lays the Library out oldest first, by when each was taken, whatever order the story lists them in", () => {
    const out = library(STORIES.shagun, start()).recents.map((p) => `${p.day} ${p.at}`);
    expect(out.indexOf("Sunday 00:29")).toBeLessThan(out.indexOf("Sunday 01:20"));
    expect(out.indexOf("22/11 23:40")).toBeLessThan(out.indexOf("Sunday 00:29"));
  });

  it("shows the Hidden album only once Settings says so", () => {
    expect(library(story, start()).hidden).toBeNull();
    expect(ids(library(story, add(start(), SHOW_HIDDEN)).hidden ?? [])).toEqual(["frame"]);
  });

  it("puts a recovered photo back in Recents", () => {
    const s = add(start(), restored("take"));
    expect(inBin(s, story.photos[2])).toBe(false);
    expect(ids(library(story, s).recents)).toContain("take");
    expect(library(story, s).bin).toEqual([]);
  });

  it("plays the edit until Revert, then the original, for good", () => {
    const fire = story.photos[4];
    expect(clipOf(start(), fire)?.seconds).toBe(9);
    expect(revertible(start(), fire)).toBe(true);
    const s = add(start(), reverted("fire"));
    expect(clipOf(s, fire)?.seconds).toBe(31);
    expect(clipOf(s, fire)?.captions[0].who).toBe("Sameer");
    expect(revertible(s, fire)).toBe(false);
    expect(revertible(start(), story.photos[0])).toBe(false);
  });

  it("holds back what the story hasn't reached", () => {
    expect(ids(library(story, start()).recents)).not.toContain("later");
    expect(ids(library(story, add(start(), "ep:2")).recents)).toContain("later");
  });
});

describe("Voice Memos", () => {
  it("keeps a deleted recording in its own bin, and gives it back", () => {
    expect(ids(memos(story, start()).recordings)).toEqual(["note"]);
    expect(ids(memos(story, start()).bin)).toEqual(["doosri"]);
    expect(ids(memos(story, add(start(), restored("doosri"))).recordings)).toEqual(["note", "doosri"]);
  });
});

describe("how the phone writes things", () => {
  it("writes a length and an amount the way an Indian iPhone would", () => {
    expect(mmss(31)).toBe("0:31");
    expect(mmss(125)).toBe("2:05");
    expect(rupees(180000)).toBe("₹1,80,000");
    expect(rupees(-14200)).toBe("₹14,200");
  });
});

describe("what arrives during the night", () => {
  it("is stamped when it arrived, on the story's clock, never in the future", () => {
    const s = fire(STORIES.shagun, add(newCase("t", 0), "did:prepared"), "sameer-writes", 6 * 60_000);
    // The chapter opens at 11:40 PM; six minutes in, that's 11:46, whatever the script's own guess.
    expect(arrivedAt(STORIES.shagun, s, { at: "00:06", with: "sameer-writes" })).toBe("23:46");
    expect(arrivedAt(STORIES.shagun, s, { at: "00:06" })).toBe("00:06");
    expect(arrivedAt(STORIES.shagun, s, { at: "00:06", with: "never-fired" })).toBe("00:06");
  });

  it("keeps the time it arrived by once the next episode's clock has taken over", () => {
    let s = fire(STORIES.shagun, add(newCase("t", 0), "did:prepared"), "sameer-writes", 6 * 60_000);
    s = { ...add(s, "ep:2"), began: { 2: 20 * 60_000 } };
    s = fire(STORIES.shagun, s, "sameer-online", 23 * 60_000);
    expect(arrivedAt(STORIES.shagun, s, { at: "00:06", with: "sameer-writes" })).toBe("23:46");
    expect(arrivedAt(STORIES.shagun, s, { at: "00:33", with: "sameer-online" })).toBe("00:35");
  });
});

describe("the phone's calendar", () => {
  // The chapter's first night is Saturday 29/11: a weekday written in the story means that week's.
  const first = { day: "Saturday", date: "29/11" };

  it("labels days the way iOS does, from the night the player is in", () => {
    const sat = calendar(first, "29/11");
    expect(["Saturday", "Friday", "Sunday", "22/11"].map(sat.label)).toEqual(["Today", "Yesterday", "Sunday", "22/11"]);
    // A night later, last Sunday is more than a week ago, and Saturday is yesterday.
    const sun = calendar(first, "30/11");
    expect(["30/11", "Saturday", "Monday", "Sunday"].map(sun.label)).toEqual(["Today", "Yesterday", "Monday", "23/11"]);
    expect(sun.isToday("Sunday")).toBe(false);
  });

  it("orders a week of days newest first, across a month's end", () => {
    const sun = calendar(first, "30/11");
    const order = [
      ["30/11", "00:40"],
      ["Saturday", "23:31"],
      ["Saturday", "22:52"],
      ["Monday", "10:12"],
      ["Sunday", "09:10"],
      ["22/11", "23:58"],
      ["03/11", "10:30"],
    ].map(([d, a]) => sun.when(d, a));
    expect([...order].sort((a, b) => b - a)).toEqual(order);
  });
});
