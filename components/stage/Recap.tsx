"use client";

import { useEffect, useState } from "react";

import type { Story } from "@/content/types";
import { answered, caseFile, filedClaim, traced, type CaseState } from "@/lib/game/engine";
import styles from "./Recap.module.css";

/* ===========================================================================
   The end of an episode, said as one (2026-10-23). It used to stop on a
   battery warning, mid-thought. Now it lands: the episode stamped closed,
   what the player has to show for it (questions filed, things found, links
   traced, hunches that came good), the line it ends on, and what's still
   open. Then the cliffhanger's own action: the charger, or the next title.
   =========================================================================== */

/** A number that counts itself up, once, when the card arrives. */
function Count({ to, of }: { to: number; of?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to <= 0) return undefined;
    const began = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - began) / 900);
      setN(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <b className={styles.count}>
      {n}
      {of !== undefined && <span>/{of}</span>}
    </b>
  );
}

export default function Recap({ story, state, episode, onDone }: { story: Story; state: CaseState; episode: 1 | 2; onDone: () => void }) {
  const recap = story.recaps?.[episode];
  const qs = story.questions.filter((q) => q.episode === episode && !q.optional);
  const filed = qs.filter((q) => answered(state, q.id)).length;
  const found = caseFile(story, state).length;
  const links = traced(story, state).length;
  // Hunches the player filed early that the night has since borne out.
  const called = story.questions
    .map((q) => filedClaim(q, state))
    .filter((c) => c?.hunch && story.chain.some((l) => l.id === c.hunch && traced(story, state).includes(l))).length;
  const next = story.episodes[episode];
  if (!recap) return null;

  return (
    <div className={styles.recap} role="dialog" aria-label={`Episode ${episode} complete`}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Episode {String(episode).padStart(2, "0")} · {story.episodes[episode - 1]}</p>
        <p className={styles.stamp}>Complete</p>

        <dl className={styles.stats}>
          <div>
            <dt>Filed</dt>
            <dd>
              <Count to={filed} of={qs.length} />
            </dd>
          </div>
          <div>
            <dt>Found</dt>
            <dd>
              <Count to={found} />
            </dd>
          </div>
          {/* Episode 1 traces nothing yet: what's ahead, said as a number to chase. */}
          <div>
            <dt>{links ? "Links traced" : "Links to trace"}</dt>
            <dd>{links ? <Count to={links} of={story.chain.length} /> : <Count to={story.chain.length} />}</dd>
          </div>
          {called > 0 && (
            <div>
              <dt>Called it</dt>
              <dd>
                <Count to={called} />
              </dd>
            </div>
          )}
        </dl>

        <figure className={styles.cliff}>
          {recap.who && <figcaption>{recap.who}</figcaption>}
          <blockquote lang="hi-Latn">“{recap.cliff}”</blockquote>
          {recap.english && <p className={styles.english}>{recap.english}</p>}
        </figure>

        <div className={styles.open}>
          <p className={styles.openHead}>Still open</p>
          <ol>
            {recap.open.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>

        <button type="button" className={styles.go} onClick={onDone}>
          {episode === 1 ? "His phone is dying. Keep it alive" : `Episode ${episode + 1}: ${next}`}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
