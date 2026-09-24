"use client";

import { useState } from "react";

import type { CallEntry, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Group, Row } from "../AppView";
import styles from "../ios/Chats.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Phone › Recents, newest first, as iOS lists them: in, out and missed, how
   long, and several calls in a row from one number as one row, "(47)". A
   recorded call opens into its transcript (iOS records calls now, for
   anyone who turns it on).

   =========================================================================== */

const KIND: Record<CallEntry["kind"], string> = { in: "↙ Incoming", out: "↗ Outgoing", missed: "✕ Missed" };

/** Newest first, as iOS lists them: by day, then by time. */

const length = (s?: number) => {
  if (!s) return "No answer";
  if (s >= 3600) return `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`;
  if (s >= 60) return `${Math.floor(s / 60)} min`;
  return `${s} sec`;
};

export default function Recents({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (evidenceIds: readonly string[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const cal = calendarOf(story, state);
  const when = (c: CallEntry) => cal.when(c.day, c.at);
  const call = story.calls.find((c) => c.id === open);

  if (call?.recording)
    return (
      <div className={styles.messages}>
        <p className={styles.day}>
          {call.name} · {cal.label(call.day)} {stamp(call.at)} · {length(call.seconds)}
        </p>
        {call.recording.lines.map((l, i) => (
          <div key={i} className={styles.bubble} data-out={l.who === story.owner.short || undefined}>
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
      {story.calls
        .filter((c) => all(state, c.requires))
        .sort((a, b) => when(b) - when(a))
        .map((c) => (
        <Row
          key={c.id}
          title={c.count ? `${c.name} (${c.count})` : c.name}
          sub={`${KIND[c.kind]} · ${cal.label(c.day)} ${stamp(c.at)}`}
          meta={c.ongoing ? "On call" : length(c.seconds)}
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
