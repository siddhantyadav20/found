"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Group, Row } from "../AppView";
import app from "../ios/App.module.css";
import styles from "./Mail.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Mail: the Inbox, newest first; a letter with its sender, subject and date;
   and whatever is attached to it, opened as the pages it holds. Where a
   photographer keeps the business half of his life: invoices, offers, a
   venue's site plan.
   =========================================================================== */


export default function Mail({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const cal = calendarOf(story, state);
  const letters = story.mail.filter((m) => all(state, m.requires)).sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  const letter = letters.find((m) => m.id === open);

  if (letter && reading && letter.attachment)
    return (
      <div className={app.body}>
        <button type="button" className={styles.link} onClick={() => setReading(false)} data-back>
          ‹ {letter.subject}
        </button>
        <p className={styles.docName}>{letter.attachment.name}</p>
        <div className={styles.pages}>
          {letter.attachment.pages.map((p, i) => (
            <p key={i} className={styles.page}>
              {p}
            </p>
          ))}
        </div>
      </div>
    );

  if (letter)
    return (
      <div className={app.body}>
        <button type="button" className={styles.link} onClick={() => setOpen(null)} data-back>
          ‹ Inbox
        </button>
        <article className={styles.letter}>
          <p className={styles.from}>{letter.from}</p>
          {letter.address && <p className={styles.address}>{letter.address}</p>}
          <h3 className={styles.subject}>{letter.subject}</h3>
          <p className={styles.date}>
            {cal.label(letter.day)} · {stamp(letter.at)}
          </p>
          {letter.body.map((p, i) => (
            <p key={i} className={styles.para}>
              {p}
            </p>
          ))}
          {letter.attachment && (
            <button
              type="button"
              className={styles.attachment}
              onClick={() => {
                setReading(true);
                if (letter.attachment?.evidence) onRead([letter.attachment.evidence]);
              }}
            >
              <span className={styles.docIcon}>PDF</span>
              <span>{letter.attachment.name}</span>
            </button>
          )}
        </article>
      </div>
    );

  return (
    <div className={app.body}>
      <h2 className={app.big}>Inbox</h2>
      {letters.length === 0 ? (
        <p className={app.empty}>No mail.</p>
      ) : (
        <Group>
          {letters.map((m) => (
            <Row
              key={m.id}
              title={m.from}
              sub={
                <>
                  <b className={styles.rowSubject}>{m.subject}</b>
                  <br />
                  {m.body[0]}
                </>
              }
              meta={cal.isToday(m.day) ? stamp(m.at) : cal.label(m.day)}
              onClick={() => {
                setOpen(m.id);
                if (m.evidence) onRead([m.evidence]);
              }}
            />
          ))}
        </Group>
      )}
    </div>
  );
}
