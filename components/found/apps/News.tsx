"use client";

import { useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { all, has, sessionVars } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import AppBar from "./AppBar";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./News.module.css";

/**
 * The city, reporting on what the player did. Laid out as a news app lays
 * out Today: the day, a large title, and stories as cards under their
 * publication's masthead, City Desk, in its red.
 *
 * Some paragraphs are only true for this player (the photo they restored,
 * the receipts they switched off, the reply they sent) because the police
 * are reading the same phone.
 */
export default function News({ state }: AppProps) {
  const ep = useStory();
  const vars = sessionVars(ep, state);
  const t = (x: string) => say(x, state.cast, vars);
  const list = ep.headlines.filter((h) => all(state, h.requires)).reverse();
  const [open, setOpen] = useState<string | null>(null);
  const story = list.find((h) => h.id === open);

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <p className={styles.date}>Monday</p>
        <h2 className={app.big}>Today</h2>
        {list.length === 0 ? (
          <p className={app.empty}>No new stories. Background refresh is off in Low Power Mode.</p>
        ) : (
          <ul className={styles.list}>
            {list.map((h) => (
              <li key={h.id}>
                <button type="button" className={styles.card} onClick={() => setOpen(h.id)}>
                  <span className={styles.source}>
                    <span className={styles.brand}>City Desk</span>
                    <span className={styles.time}>{h.at}</span>
                  </span>
                  <span className={styles.title}>{t(h.title)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {story && (
        <section className={app.view}>
          <AppBar onBack={() => setOpen(null)} backLabel="Today" />
          <div className={app.body}>
            <p className={styles.masthead}>City Desk</p>
            <h2 className={styles.articleTitle}>{t(story.title)}</h2>
            <p className={styles.byline}>City Desk · {story.at}</p>
            {story.lines
              .filter((l) => all(state, l.requires) && !(l.unless ?? []).some((f) => has(state, f)))
              .map((l) => (
                <p key={l.text} className={styles.para}>
                  {t(l.text)}
                </p>
              ))}
          </div>
        </section>
      )}
    </section>
  );
}
