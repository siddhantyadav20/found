"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { all, seen, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Page } from "../AppView";
import { Chevron } from "../ios/AppBar";
import Avatar from "../ios/Avatar";
import app from "../ios/App.module.css";
import styles from "./Mail.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Mail, as iOS 26 draws it: the Inbox under its categories, one plain row a
   message (the sender's face, name and time, the subject, two lines of what
   it says, a blue dot until it's read), the toolbar floating at the bottom;
   a message with its sender on top; and whatever is attached, opened as the
   pages it holds. Where a photographer keeps the business half of his life:
   invoices, offers, a venue's site plan.
   =========================================================================== */

/** The category pills over the Inbox. Primary is where everything here lands. */
const CATEGORIES = [
  { id: "primary", label: "Primary", d: "M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.5 8c.8-3.9 3.9-6 7.5-6s6.7 2.1 7.5 6Z" },
  { id: "transactions", label: "Transactions", d: "M3 4.5h2.4l2.3 10.3h10.6l2-7.3H6.6M9.2 19.5a1.3 1.3 0 1 0 0 .01M16.6 19.5a1.3 1.3 0 1 0 0 .01" },
  { id: "updates", label: "Updates", d: "M4 5.5h16v10.5H9.5L5.5 19.5V16H4Z" },
  { id: "promotions", label: "Promotions", d: "M4 10v4h3l7 4.5v-13L7 10Zm13-1.5a4 4 0 0 1 0 7" },
];

export default function Mail({
  story,
  state,
  onRead,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onHome?: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  // iOS keeps the sender's address behind their name, until the name is tapped.
  const [details, setDetails] = useState<string | null>(null);
  const cal = calendarOf(story, state);
  const letters = story.mail.filter((m) => all(state, m.requires)).sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  const letter = letters.find((m) => m.id === open);
  const when = (m: (typeof letters)[number]) => (cal.isToday(m.day) ? stamp(m.at) : cal.label(m.day));

  if (letter && reading && letter.attachment)
    return (
      <Page title={letter.attachment.name} onBack={() => setReading(false)} backLabel={letter.subject}>
        <div className={styles.pages}>
          {letter.attachment.pages.map((p, i) => (
            <p key={i} className={styles.page}>
              {p}
            </p>
          ))}
        </div>
      </Page>
    );

  if (letter)
    return (
      <Page title="" onBack={() => setOpen(null)} backLabel="Inbox">
        <article className={styles.letter}>
          <header className={styles.head}>
            <Avatar name={letter.from} size="head" />
            <span className={styles.headMain}>
              {letter.address ? (
                <button
                  type="button"
                  className={styles.from}
                  onClick={() => setDetails(details === letter.id ? null : letter.id)}
                  aria-expanded={details === letter.id}
                >
                  {letter.from}
                </button>
              ) : (
                <span className={styles.from}>{letter.from}</span>
              )}
              {letter.address && details === letter.id ? (
                <span className={styles.to}>{letter.address}</span>
              ) : (
                <span className={styles.to}>To: {story.owner.name.split(" ")[0]}</span>
              )}
            </span>
            <span className={styles.date}>{when(letter)}</span>
          </header>
          <h3 className={styles.subject}>{letter.subject}</h3>
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
              <span className={styles.docMain}>
                <span className={styles.docName}>{letter.attachment.name}</span>
                <span className={styles.docSize}>PDF Document</span>
              </span>
            </button>
          )}
        </article>
      </Page>
    );

  return (
    <Page title="Inbox" large root onBack={onHome} backLabel="Mailboxes" tabbed>
      <div className={styles.categories} aria-hidden="true">
        {CATEGORIES.map((c, i) => (
          <span key={c.id} className={styles.category} data-on={i === 0 || undefined}>
            <svg viewBox="0 0 24 24">
              <path d={c.d} />
            </svg>
            {i === 0 && c.label}
          </span>
        ))}
      </div>

      {letters.length === 0 ? (
        <p className={app.empty}>No mail.</p>
      ) : (
        <ul className={styles.list}>
          {letters.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className={styles.row}
                onClick={() => {
                  setOpen(m.id);
                  if (m.evidence) onRead([m.evidence]);
                }}
              >
                <span className={styles.dot} data-on={(m.evidence && !seen(state, m.evidence)) || undefined} />
                <Avatar name={m.from} size="head" />
                <span className={styles.rowMain}>
                  <span className={styles.rowTop}>
                    <b className={styles.rowFrom}>{m.from}</b>
                    <span className={styles.rowWhen}>
                      {when(m)}
                      <Chevron />
                    </span>
                  </span>
                  <span className={styles.rowSubject}>{m.subject}</span>
                  <span className={styles.rowPreview}>{m.body[0]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* The toolbar floats over the list: filter, the status, compose. */}
      <div className={styles.toolbar} aria-hidden="true">
        <span className={`${styles.tool} lg`}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 10h8M9.5 13h5M11 16h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <span className={styles.status}>Updated Just Now</span>
        <span className={`${styles.tool} lg`}>
          <svg viewBox="0 0 24 24">
            <path d="M5 19.5h14M14.8 4.6l3.6 3.6-8.6 8.6-4.3.7.7-4.3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Page>
  );
}
