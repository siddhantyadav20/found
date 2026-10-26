"use client";

import type { Story } from "@/content/types";
import { filedClaim, type CaseState } from "@/lib/game/engine";
import styles from "./Previously.module.css";

/* ===========================================================================
   Before a later episode's title (2026-10-26). Episodes can drop days apart
   (lib/found/release.ts), and a player coming back needs the night again,
   so each one opens the way episodic games do: "Previously", told in the
   player's own filed sentences (Life is Strange and Telltale recap what
   *you* did), only the beats this episode pays off, ending on the line the
   last one ended on. Then tonight's briefing, Hitman-style: what to find
   out, what's still open, who's against you, and the clock. Skippable from
   the first second.
   =========================================================================== */

/** A filed answer, retold: the "Yes." or "No." that answered its question goes. */
const retold = (text: string) => {
  const rest = text.replace(/^(Yes|No)\.\s+/, "");
  return rest.charAt(0).toUpperCase() + rest.slice(1);
};

export default function Previously({ story, state, episode, onDone }: { story: Story; state: CaseState; episode: 2 | 3; onDone: () => void }) {
  const opener = story.openers?.[episode];
  const before = story.recaps?.[(episode - 1) as 1 | 2];
  if (!opener) return null;

  const beats = opener.previously.flatMap((id) => {
    const q = story.questions.find((x) => x.id === id);
    const c = q && filedClaim(q, state);
    return q && c?.text ? [{ id, ask: q.ask, text: retold(c.text), version: c.version, hunch: Boolean(c.hunch) }] : [];
  });

  return (
    <div className={styles.sheet} role="dialog" aria-label={`Episode ${episode}: previously`}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Previously on {story.title}</p>

        {beats.length > 0 && (
          <ol className={styles.beats}>
            {beats.map((b, i) => (
              <li key={b.id} style={{ animationDelay: `${0.25 + i * 0.35}s` }}>
                <span className={styles.ask}>{b.ask}</span>
                <span className={styles.said}>
                  {b.text}
                  {b.version && <em className={styles.tag}>His version</em>}
                  {b.hunch && <em className={styles.tag}>Your hunch</em>}
                </span>
              </li>
            ))}
          </ol>
        )}

        {before && (
          <figure className={styles.cliff} style={{ animationDelay: `${0.25 + beats.length * 0.35}s` }}>
            {before.who && <figcaption>{before.who}</figcaption>}
            <blockquote lang="hi-Latn">“{before.cliff}”</blockquote>
            {before.english && <p className={styles.english}>{before.english}</p>}
          </figure>
        )}

        <section className={styles.brief} aria-label="Tonight" style={{ animationDelay: `${0.6 + beats.length * 0.35}s` }}>
          <p className={styles.briefHead}>
            Episode {String(episode).padStart(2, "0")} · {story.episodes[episode - 1]}
          </p>
          <dl className={styles.rows}>
            <div>
              <dt>Find out</dt>
              <dd className={styles.objective}>{opener.objective}</dd>
            </div>
            {before && before.open.length > 0 && (
              <div>
                <dt>Still open</dt>
                <dd>
                  <ol className={styles.open}>
                    {before.open.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </dd>
              </div>
            )}
            <div>
              <dt>Against you</dt>
              <dd>{opener.against}</dd>
            </div>
            <div>
              <dt>Clock</dt>
              <dd className={styles.clock}>{opener.clock}</dd>
            </div>
          </dl>
        </section>

        <button type="button" className={styles.go} onClick={onDone}>
          Begin Episode {episode}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
