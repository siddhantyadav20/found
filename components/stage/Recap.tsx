"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import Notify from "./ending/Notify";
import { useCase } from "@/components/found/StoryContext";
import { releaseLeft, releaseOf, releaseWhen, waitsForRelease } from "@/lib/found/release";

import type { Story } from "@/content/types";
import { answered, caseFile, filedClaim, traced, type CaseState } from "@/lib/game/engine";
import styles from "./Recap.module.css";

/* ===========================================================================
   The end of an episode, said as one (2026-10-23). It used to stop on a
   battery warning, mid-thought. Now it lands: the episode stamped closed,
   what the player has to show for it (questions filed, things found, links
   traced, hunches that came good), and the line it ends on. What's still
   open is the next episode's briefing (Previously.tsx) where there is one.
   Then the cliffhanger's own action: the charger, or the next title.
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

/** A second's tick, shared, only while something is counting down. */
function subscribeTick(on: () => void): () => void {
  const t = window.setInterval(on, 1000);
  return () => window.clearInterval(t);
}

/** The next episode, if it's held back: when it arrives, and how long is left. Re-read every second. */
function useHeld(caseId: string, episode: number): { at: number; left: number } | null {
  const at = releaseOf(caseId, episode);
  const now = useSyncExternalStore(
    at ? subscribeTick : () => () => {},
    () => Math.floor(Date.now() / 1000),
    () => 0,
  );
  if (!at || !now || !waitsForRelease()) return null;
  const left = at - now * 1000;
  return left > 0 ? { at, left } : null;
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
  const { id } = useCase();
  const held = useHeld(id, episode + 1);
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

        {/* What's still open moved to the next episode's briefing (Previously.tsx, 2026-10-26), unless there's no briefing to carry it. */}
        {!story.openers?.[(episode + 1) as 2 | 3] && (
          <div className={styles.open}>
            <p className={styles.openHead}>Still open</p>
            <ol>
              {recap.open.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>
        )}

        {held ? (
          /* Held back for a launch: when it arrives, a countdown, and a way to hear (lib/found/release.ts). */
          <div className={styles.held}>
            <p className={styles.heldHead}>
              Episode {episode + 1} · {next}
            </p>
            <p className={styles.heldWhen}>
              Arrives {releaseWhen(held.at)} · <b>{releaseLeft(held.left)}</b>
            </p>
            <Notify
              caseId={id}
              what="ep3"
              label="Tell me the moment it's out"
              small="One message, when Episode 3 drops. Your phone stays where you left it."
            />
          </div>
        ) : (
          <button type="button" className={styles.go} onClick={onDone}>
            {episode === 1 ? "His phone is dying. Keep it alive" : `Episode ${episode + 1}: ${next}`}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
