"use client";

import { useState } from "react";

import type { CallEntry, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Page, TabBar } from "../AppView";
import Avatar from "../ios/Avatar";
import app from "../ios/App.module.css";
import chats from "../ios/Chats.module.css";
import styles from "./Recents.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Phone, as iOS 26 unified it: "Calls" in the bar, Recents newest first, a
   row a caller with their face, in, out or missed (missed in red), how many
   in a row, "(47)", and a glass call button at the end; the tab bar floating
   at the bottom. A recorded call opens into its transcript (iOS records
   calls now, for anyone who turns it on).
   =========================================================================== */

/** SF Symbols' arrows for a call's direction, and the cross-out for a missed one. */
const KIND: Record<CallEntry["kind"], { label: string; d: string }> = {
  in: { label: "Incoming", d: "M17 7 7 17M7 9.5V17h7.5" },
  out: { label: "Outgoing", d: "M7 17 17 7M9.5 7H17v7.5" },
  missed: { label: "Missed", d: "M17 7 7 17M7 9.5V17h7.5" },
};

const length = (s?: number) => {
  if (!s) return "";
  if (s >= 3600) return `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`;
  if (s >= 60) return `${Math.floor(s / 60)} min`;
  return `${s} sec`;
};

/** Ten dots, three rows and the zero: the keypad's glyph. */
const KEYPAD = [...[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => [6 + c * 6, 4.5 + r * 5])), [12, 19.5]]
  .map(([x, y]) => `M${x - 1.9} ${y}a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0-3.8 0Z`)
  .join("");

const TABS = [
  { label: "Calls", on: true, d: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm-.9 4.3v5.9l4.4 2.7.9-1.5-3.5-2.1V6.8Z" },
  { label: "Contacts", d: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 3.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Zm0 13.6a7.6 7.6 0 0 1-5.7-2.6c1.2-1.8 3.3-2.8 5.7-2.8s4.5 1 5.7 2.8a7.6 7.6 0 0 1-5.7 2.6Z" },
  { label: "Keypad", d: KEYPAD },
];

/** The receiver on a call button. */
const HANDSET =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

export default function Recents({
  story,
  state,
  onRead,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onRead: (evidenceIds: readonly string[]) => void;
  onHome?: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const cal = calendarOf(story, state);
  const when = (c: CallEntry) => cal.when(c.day, c.at);
  const call = story.calls.find((c) => c.id === open);

  if (call?.recording)
    return (
      <Page title={call.name} onBack={() => setOpen(null)} backLabel="Calls">
        <p className={chats.day}>
          {cal.label(call.day)} {stamp(call.at)} · {length(call.seconds)}
        </p>
        <div className={styles.transcript}>
          {call.recording.lines.map((l, i) => (
            <div key={i} className={chats.bubble} data-out={l.who === story.owner.short || undefined}>
              <span className={chats.sender}>{l.who}</span>
              <span className={chats.text}>{l.line}</span>
              {l.english && <span className={chats.docMeta}>{l.english}</span>}
            </div>
          ))}
        </div>
      </Page>
    );

  const calls = story.calls.filter((c) => all(state, c.requires)).sort((a, b) => when(b) - when(a));

  return (
    <Page
      title="Calls"
      root
      onBack={onHome}
      backLabel="Home"
      tabbed
      end={
        <span className={`${app.pill} ${styles.filter}`} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 7.5h14M7.5 12h9M10 16.5h4" />
          </svg>
        </span>
      }
    >
      <h3 className={styles.section}>Recents</h3>
      <ul className={styles.list}>
        {calls.map((c) => {
          const kind = KIND[c.kind];
          const stranger = c.name.startsWith("+");
          const inner = (
            <>
              <Avatar name={c.name} unknown={stranger} />
              <span className={styles.main}>
                <span className={styles.top}>
                  <b className={styles.name} data-missed={c.kind === "missed" || undefined}>
                    {c.name}
                    {c.count ? ` (${c.count})` : ""}
                  </b>
                  <span className={styles.when}>{cal.isToday(c.day) ? stamp(c.at) : cal.label(c.day)}</span>
                </span>
                <span className={styles.sub}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={kind.d} />
                  </svg>
                  {c.ongoing ? "On call" : c.kind === "missed" ? "Missed" : `Mobile · ${length(c.seconds)}`}
                </span>
              </span>
            </>
          );
          return (
            <li key={c.id}>
              {c.recording ? (
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => {
                    setOpen(c.id);
                    if (c.evidence) onRead([c.evidence]);
                  }}
                >
                  {inner}
                  <span className={styles.recorded}>Recorded</span>
                </button>
              ) : (
                <div className={styles.row}>
                  {inner}
                  <span className={`${styles.call} lg`} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={HANDSET} />
                    </svg>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <TabBar tabs={TABS} search />
    </Page>
  );
}
