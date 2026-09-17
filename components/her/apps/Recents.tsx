"use client";

import { useState } from "react";

import type { CallEntry, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";
import styles from "../ios/Chats.module.css";

/* ===========================================================================
   Phone › Recents: thirty-one hours of a woman trying to get someone to
   listen.

   The call log is the quietest evidence in the chapter. A helpline she held
   for twenty-four minutes. Eight numbers she rang between 10:02 and 10:31 and
   what happened on each. Her son, at 11:58, who did not pick up.

   iOS records calls now and she had it on, so some rows open into a
   transcript (CHAPTER1.md, Episode 2).
   =========================================================================== */

const KIND: Record<CallEntry["kind"], string> = { in: "↙ Incoming", out: "↗ Outgoing", missed: "✕ No answer" };

const length = (s?: number) => {
  if (!s) return "No answer";
  if (s >= 3600) return `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`;
  if (s >= 60) return `${Math.floor(s / 60)} min`;
  return `${s} sec`;
};

export default function Recents({
  story,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (evidenceIds: readonly string[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const call = story.calls.find((c) => c.id === open);

  if (call?.recording)
    return (
      <div className={styles.messages}>
        <p className={styles.day}>
          {call.name} · {call.day} {call.at} · {length(call.seconds)}
        </p>
        {call.recording.lines.map((l, i) => (
          <div key={i} className={styles.bubble} data-out={l.who === "Vasu" || undefined}>
            <span className={styles.sender}>{l.who}</span>
            <span className={styles.text}>{l.line}</span>
            {l.english && <span className={styles.docMeta}>{l.english}</span>}
          </div>
        ))}
        <button type="button" className={styles.backButton} onClick={() => setOpen(null)}>
          ‹ Recents
        </button>
      </div>
    );

  return (
    <Group label="Recents">
      {story.calls.map((c) => (
        <Row
          key={c.id}
          title={c.name}
          sub={`${KIND[c.kind]} · ${c.day} ${c.at}`}
          meta={length(c.seconds)}
          onClick={
            c.recording
              ? () => {
                  setOpen(c.id);
                  if (c.evidence) onRead([c.evidence]);
                }
              : undefined
          }
        />
      ))}
    </Group>
  );
}
