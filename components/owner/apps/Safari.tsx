"use client";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Group, Row } from "../AppView";
import { stamp } from "@/lib/found/time";

/* Safari's history, with the time of every search: how a person thinks out
   loud, and often a question's second route in (CHAPTER1.md: every question
   has two). */

export default function Safari({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const cal = calendarOf(story, state);
  return (
    <Group label="History">
      {story.searches
        .filter((s) => all(state, s.requires))
        .map((s) => (
          <Row
            key={s.id}
            title={s.text}
            sub={`${cal.label(s.day)} ${stamp(s.at)}`}
            onClick={s.evidence ? () => onRead([s.evidence as string]) : undefined}
          />
        ))}
    </Group>
  );
}
