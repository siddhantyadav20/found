"use client";

import { useState } from "react";

import type { Search, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { AIRPLANE, calendarOf } from "@/lib/game/phone";
import { Page, SearchField } from "../AppView";
import styles from "./Safari.module.css";
import { stamp } from "@/lib/found/time";

/* Safari's History, as iOS lists it: newest first under each day, every
   search a Google results page with its favicon, and the time it was made.
   How a person thinks out loud, and often a question's second route in
   (CHAPTER1.md: every question has two).

   Tapped, an entry opens its page again, as Safari does, and that needs the
   network: on a day's data used up (Episode 1) it sits loading; in airplane
   mode Safari can't open it; with data back, the results are what he read
   that night. One of them is the end card's fact, read by him at 12:47.

   Before its layer opens (`Story.safariWaits`, Episode 2 for Raakh), it's
   only the tab he left open, failing to reload: his History is Episode 2's. */

/** The data is back (Episode 2's Jio SMS) and the phone isn't in airplane mode. */
const online = (s: CaseState) => s.flags.includes("fired:data-renewed") && !s.flags.includes(AIRPLANE);

/** A page Safari still has open in a tab: there without the network. */
function Article({ search, onBack }: { search: Search & { page: NonNullable<Search["page"]> }; onBack: () => void }) {
  const { page } = search;
  return (
    <Page title={page.site} onBack={onBack} backLabel="History">
      <article className={styles.article}>
        <p className={styles.articleSite}>
          <span className={styles.wa} aria-hidden="true" /> WhatsApp Help Center
        </p>
        <h2 className={styles.articleTitle}>{page.title}</h2>
        {page.lead && <p className={styles.articleLead}>{page.lead}</p>}
        <ol className={styles.articleSteps}>
          {page.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {page.note && <p className={styles.articleNote}>{page.note}</p>}
      </article>
    </Page>
  );
}

function Results({ search, state, onBack }: { search: Search; state: CaseState; onBack: () => void }) {
  const offline = state.flags.includes(AIRPLANE);
  if (search.page) return <Article search={{ ...search, page: search.page }} onBack={onBack} />;
  return (
    <Page title="google.com" onBack={onBack} backLabel="History">
      <p className={styles.query}>
        <span className={styles.favicon} aria-hidden="true">
          G
        </span>
        {search.text}
      </p>
      {offline ? (
        <div className={styles.cant}>
          <b>Safari Can&apos;t Open the Page</b>
          <span>Your iPhone is not connected to the internet.</span>
        </div>
      ) : !online(state) ? (
        // 64 Kbps: the bar creeps, and nothing comes.
        <div className={styles.loading} role="status">
          <span className={styles.bar} />
          Loading…
        </div>
      ) : (
        <ol className={styles.results}>
          {(search.results ?? []).map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      )}
    </Page>
  );
}

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
  const [open, setOpen] = useState<string | null>(null);
  /* Before its layer: the last tab, reloading on 64 Kbps, and nothing behind it. */
  const waits = story.safariWaits;
  if (waits && !all(state, waits.until))
    return (
      <Page title={waits.site} root onBack={onHome} backLabel="Home">
        <div className={styles.loading} role="status">
          <span className={styles.bar} />
          Loading {waits.site}…
        </div>
        <p className={styles.waitNote}>{waits.note}</p>
      </Page>
    );
  const cal = calendarOf(story, state);
  const searches = story.searches.filter((s) => all(state, s.requires)).sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  const here = searches.find((s) => s.id === open);
  if (here) return <Results search={here} state={state} onBack={() => setOpen(null)} />;

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
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => {
                    if (s.evidence) onRead([s.evidence]);
                    setOpen(s.id);
                  }}
                >
                  <span className={styles.favicon} data-wa={s.page ? "" : undefined} aria-hidden="true">
                    {s.page ? (
                      /* WhatsApp's mark: a speech bubble with a handset, white on green. */
                      <svg viewBox="0 0 24 24">
                        <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="#fff" strokeWidth="1.6" />
                        <path d="M9.2 7.9c.2 0 .4 0 .6.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.3.6-.1.8-.9 1.6-1.8 1.6-2.9-.2-6.3-3.4-6.5-6.4 0-.9.6-1.7 1.3-1.8Z" fill="#fff" />
                      </svg>
                    ) : (
                      "G"
                    )}
                  </span>
                  <span className={styles.main}>
                    <span className={styles.title}>{s.page ? `${s.page.title} - WhatsApp Help Center` : `${s.text} - Google Search`}</span>
                    <span className={styles.url}>
                      {s.page ? s.page.site : "google.com"} · {stamp(s.at)}
                    </span>
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
