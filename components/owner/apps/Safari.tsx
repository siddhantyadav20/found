"use client";

import type { Search, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf } from "@/lib/game/phone";
import { Page, SearchField } from "../AppView";
import styles from "./Safari.module.css";
import { stamp } from "@/lib/found/time";

/* Safari's History, as iOS lists it: newest first under each day, every
   search a Google results page with its favicon, and the time it was made.
   How a person thinks out loud, and often a question's second route in
   (CHAPTER1.md: every question has two). */

export default function Safari({
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
  const cal = calendarOf(story, state);
  const searches = story.searches.filter((s) => all(state, s.requires)).sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  // One section a day, in the order the days come.
  const days: { label: string; items: Search[] }[] = [];
  for (const s of searches) {
    const label = cal.label(s.day);
    const day = days.find((d) => d.label === label);
    if (day) day.items.push(s);
    else days.push({ label, items: [s] });
  }

  return (
    <Page title="History" large root onBack={onHome} backLabel="Home">
      <SearchField prompt="Search History" />
      {days.map((d) => (
        <div key={d.label}>
          <p className={styles.day}>{d.label}</p>
          <ul className={styles.group}>
            {d.items.map((s) => (
              <li key={s.id}>
                <button type="button" className={styles.row} onClick={s.evidence ? () => onRead([s.evidence as string]) : undefined}>
                  <span className={styles.favicon} aria-hidden="true">
                    G
                  </span>
                  <span className={styles.main}>
                    <span className={styles.title}>{s.text} - Google Search</span>
                    <span className={styles.url}>google.com · {stamp(s.at)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Page>
  );
}
