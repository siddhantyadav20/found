import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Story } from "@/content/types";
import { add, newCase } from "@/lib/game/engine";
import { chosen, finish, linesFor } from "@/lib/game/endings";
import { eventsFor, reportFlag } from "@/lib/found/events";

/**
 * The endings (CHAPTER1.md I): none signalled as the right one, each read
 * back through what the player did, and every one counted by name. The
 * chapter's own four arrive in ROADMAP S9; these hold the machinery to it.
 */

const ep: Story = {
  ...STORIES.shagun,
  endings: [
    {
      id: "complete",
      row: "Send the record",
      when: { acts: ["send"] },
      lines: [
        { text: "Everyone is named." },
        { text: "Nitin is named too.", needs: ["did:nitin-protected"] },
        { text: "Nobody asks Nitin anything.", unless: ["did:nitin-protected"] },
      ],
      last: [],
      onlyHere: "What Nitin said.",
    },
    { id: "wrong", row: "Post it", when: { acts: ["post"] }, lines: [], last: [], onlyHere: "The frame." },
  ],
};

describe("the record, and what ends the chapter", () => {
  it("draws every link of the record with one style, and the acts alike, so the layout has no opinion", () => {
    const src = readFileSync("components/yours/Sheet.tsx", "utf8");
    // One row, mapped over the chain; one style for every act.
    expect(src.match(/className=\{styles\.row\}/g)).toHaveLength(1);
    expect(src).toContain("rows.map");
    expect(src.match(/className=\{styles\.act\}/g)?.length).toBeGreaterThanOrEqual(3);
    expect(src).not.toMatch(/styles\.(primary|recommended|danger)/);
  });

  it("knows which ending was chosen", () => {
    expect(chosen(ep, add(newCase("t", 0), ...finish("wrong")))?.id).toBe("wrong");
  });

  it("tells the funnel which ending, and that it ended, and only for endings the case has", () => {
    expect(finish("complete").map((f) => reportFlag(f))).toEqual(["end:complete", "end"]);
    expect(eventsFor(ep)).toContain("end:complete");
    expect(eventsFor(ep)).toContain("end:wrong");
    expect(eventsFor(ep)).not.toContain("end:police");
  });
});

describe("an ending reads the night back", () => {
  const lines = (s = newCase("t", 0)) => linesFor(s, ep.endings[0].lines).map((l) => l.text);

  it("shows a line only when the player did what it needs, and none of what it can't bear", () => {
    expect(lines()).toEqual(["Everyone is named.", "Nobody asks Nitin anything."]);
    expect(lines(add(newCase("t", 0), "did:nitin-protected"))).toEqual(["Everyone is named.", "Nitin is named too."]);
  });
});
