"use client";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";

/* Safari's history: a woman working out, on her own, what was being done to
   her. It is the second way to reach Myawaddy, for a player who never opens
   her diary (CHAPTER1.md: every question has two routes in). */

export default function Safari({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  return (
    <Group label="History">
      {story.searches
        .filter((s) => all(state, s.requires))
        .map((s) => (
          <Row
            key={s.id}
            title={s.text}
            sub={`${s.day} ${s.at}`}
            onClick={s.evidence ? () => onRead([s.evidence as string]) : undefined}
          />
        ))}
    </Group>
  );
}
