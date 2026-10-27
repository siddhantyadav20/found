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
  const filed = (recap.filed ?? []).flatMap((qid) => {
    const q = story.questions.find((x) => x.id === qid);
    const c = q && filedClaim(q, state);
    return c ? [{ id: qid, text: c.text, tag: c.version ? "Sameer's version" : c.hunch ? "Your hunch" : "Filed" }] : [];
  });

  return (
    <div className={styles.recap} role="dialog" aria-label={`Episode ${episode}: found so far`}>
      <div className={styles.recapInner}>
        <p className={styles.eyebrow}>
          Episode {episode} · {story.episodes[episode - 1]}
        </p>
        <h2 className={styles.recapTitle}>Found so far</h2>
        <ol className={styles.filed}>
          {filed.map((f, i) => (
            <li key={f.id} style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
              {f.text}
              <small>{f.tag}</small>
            </li>
          ))}
        </ol>
        {recap.open.map((q) => (
          <p key={q} className={styles.openQ}>
            <small>Still open</small>
            {q}
          </p>
        ))}
        {recap.last && <p className={styles.last}>{recap.last}</p>}
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
            Go on <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
