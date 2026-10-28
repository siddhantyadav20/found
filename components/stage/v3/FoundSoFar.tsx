"use client";

import { useSyncExternalStore } from "react";

import Notify from "../ending/Notify";
import { useCase } from "@/components/found/StoryContext";
import type { Story } from "@/content/types";
import { filedClaim, type CaseState } from "@/lib/game/engine";
import { releaseLeft, releaseOf, releaseWhen, waitsForRelease } from "@/lib/found/release";
import styles from "./Screens.module.css";

/* ===========================================================================
   Between episodes (RAAKH-V3 §7.12, §8.12): "Found so far". The sentences
   the player filed, in their own words and marked where they're Sameer's or
   a hunch; the question still open; and one plain line about where that
   leaves things. Then "Next".
   =========================================================================== */

function subscribeTick(on: () => void): () => void {
  const t = window.setInterval(on, 1000);
  return () => window.clearInterval(t);
}

export default function FoundSoFar({ story, state, episode, onDone }: { story: Story; state: CaseState; episode: 1 | 2; onDone: () => void }) {
  const recap = story.recaps?.[episode];
  const { id } = useCase();
  const at = releaseOf(id, episode + 1);
  const now = useSyncExternalStore(at ? subscribeTick : () => () => {}, () => Math.floor(Date.now() / 1000), () => 0);
  const left = at && now && waitsForRelease() ? at - now * 1000 : 0;
  if (!recap) return null;
  /* Only what the player answered, in their words (2026-10-28: no "still
     open", no closing line, no "Next on"). A version or a hunch says so. */
  // Everything answered up to here, this episode's and the ones before it.
  const filed = story.questions
    .filter((q) => !q.final && !q.optional && (q.episode ?? 1) <= episode)
    .flatMap((q) => {
      const c = filedClaim(q, state);
      return c ? [{ id: q.id, text: c.text, tag: c.version ? "Sameer's version" : c.hunch ? "Your hunch" : undefined }] : [];
    });

  return (
    <div className={styles.recap} role="dialog" aria-label={`End of episode ${episode}`}>
      <div className={styles.recapInner}>
        <p className={styles.eyebrow}>
          End of episode {episode} · {story.episodes[episode - 1]}
        </p>
        <h2 className={styles.recapTitle}>What you&apos;ve answered</h2>
        <ol className={styles.filed}>
          {filed.map((f) => (
            <li key={f.id}>
              {f.text}
              {f.tag && <small>{f.tag}</small>}
            </li>
          ))}
        </ol>
        {left > 0 && at ? (
          <div>
            <p className={styles.openQ}>
              <small>
                Episode {episode + 1} · {story.episodes[episode]}
              </small>
              Arrives {releaseWhen(at)} · <b>{releaseLeft(left)}</b>
            </p>
            <Notify caseId={id} what="ep3" label="Tell me the moment it's out" small="One message, when it drops. The phone stays where you left it." />
          </div>
        ) : (
          <button type="button" className={styles.go} onClick={onDone}>
            Episode {episode + 1} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
