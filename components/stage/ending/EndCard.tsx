"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import KeepCase from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import type { CaseId } from "@/content/cases";
import type { EpisodeNo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { chosen } from "@/lib/game/endings";
import { recordRows } from "@/lib/game/record";
import { commit } from "@/lib/found/progress";
import { resultOf } from "@/lib/found/result";
import { markSolved } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import { DETECTIVE } from "@/lib/game/scene";
import PassItOn from "../PassItOn";
import Night from "./Night";
import Notify from "./Notify";
import styles from "./Ending.module.css";

/* ===========================================================================
   After every ending, the same card (PLAYER-JOURNEY Stage 9):

   1. The count, which is the share, large, with the chain as eleven marks;
      then every link, traced ones in the record's words and the rest in
      Sameer's, a line at a time.
   2. The one thing only this ending showed, and what others chose.
   3. The replay image, the same for everyone: a note on his phone, its
      cursor still blinking after the last line (CHAPTER1.md J).
   4. Look again (his phone, to go back through, with what was there from
      the first minute), Play again, Pass it on, and keep your case number.
   5. Outside the fiction: the chapter's facts, each checked at its source,
      and what to do if any of this is close to home.
   =========================================================================== */

type Others = Record<string, number> | null;

export default function EndCard({ story, state, onLookAgain }: { story: Story; state: CaseState; onLookAgain?: () => void }) {
  const { id } = useCase();
  const ending = chosen(story, state);
  // Minutes are measured to the moment the card first appears.
  const [result] = useState(() => resultOf(story, state, Date.now()));
  const [others, setOthers] = useState<Others>(null);
  const [fated, setFated] = useState<{ yes: number; no: number } | null>(null);
  const done = result.traced;
  const episodes = story.episodes.length as EpisodeNo;
  const replay = story.notes.find((n) => n.id === story.replay?.note);
  // A name the player kept out of the record stays out of the card they may share (PLAYTEST-SHAGUN.md #54).
  const kept = new Set(recordRows(story, state).filter((r) => r.choice === "anon").map((r) => r.link.id));

  // A finish outlives "Play again", and goes on the shelf if they keep a number.
  useEffect(() => {
    markSolved(id as CaseId, { episode: episodes, minutes: result.minutes, traced: done.length, of: result.links, at: Date.now() });
  }, [id, episodes, result.minutes, done.length, result.links]);

  // What others did, once enough people have, and never as a count.
  useEffect(() => {
    let live = true;
    fetch(`/api/found/choices?case=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { end?: Others; fate?: { yes: number; no: number } | null } | null) => {
        if (!live) return;
        setOthers(d?.end ?? null);
        setFated(d?.fate ?? null);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id]);

  const playAgain = () => {
    track({ case: id, event: "reset:yes" });
    commit(null);
    window.scrollTo(0, 0);
  };

  const detective = state.flags.includes(DETECTIVE);

  return (
    <div className={`${styles.screen} ${styles.card}`}>
      {/* The score first: what people screenshot, and what they argue about. */}
      <section className={`${styles.section} ${styles.score}`} aria-label="Your score">
        {ending && <p className={styles.eyebrow}>Ending · {ending.row}</p>}
        {/* What the night decided, before the score: the line anyone asks about first. */}
        {story.fate && (state.flags.includes(story.fate.yes) || state.flags.includes(story.fate.no)) && (
          <p className={styles.fate} data-yes={state.flags.includes(story.fate.yes) || undefined}>
            {state.flags.includes(story.fate.yes) ? story.fate.headline.yes : story.fate.headline.no}
          </p>
        )}
        {/* Everyone else's night, as a share, once enough people have played it. */}
        {story.fate?.others && fated && <p className={styles.fateOthers}>{story.fate.others.replace("{yes}", String(fated.yes))}</p>}
        {detective && <p className={styles.scoreMode}>Played as a detective</p>}
        <p className={styles.scoreLine}>
          You traced {done.length} of {result.links} links.
        </p>
        <p className={styles.marks} aria-hidden="true">
          {story.chain.map((l) => (
            <span key={l.id} data-traced={done.includes(l.id) || undefined} />
          ))}
        </p>
      </section>

      <Night story={story} state={state} />

      <section className={styles.section} aria-labelledby="chain">
        <p className={styles.eyebrow} id="chain">
          The chain
        </p>
        <ol className={styles.chain}>
          {story.chain.map((l, i) => {
            const traced = done.includes(l.id);
            return (
              <li key={l.id} data-traced={traced || undefined} style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
                <span className={styles.linkLabel}>{l.label}</span>
                {traced ? (
                  <span className={styles.linkText}>{kept.has(l.id) ? (l.unnamed ?? l.truth) : l.truth}</span>
                ) : l.version ? (
                  /* Untraced: what the owner said happened, in his words. */
                  <span className={styles.linkText}>
                    <span lang="hi-Latn">&ldquo;{l.version}&rdquo;</span>
                    {l.english && <span className={styles.english}>{l.english}</span>}
                  </span>
                ) : (
                  <span className={styles.linkText}>Not traced.</span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {ending && (
        <section className={styles.section}>
          <p className={styles.eyebrow}>Only this ending showed</p>
          <p className={styles.only}>{ending.onlyHere}</p>
          {others && (
            <p className={styles.others}>
              Of everyone who finished:{" "}
              {story.endings.map((e) => `${others[e.id] ?? 0}% chose “${e.row}”`).join(", ")}.
            </p>
          )}
        </section>
      )}

      {replay && (
        <section className={styles.section}>
          <div className={styles.replay} aria-label={`The note “${replay.title}”`}>
            <p className={styles.replayTitle}>{replay.title}</p>
            {replay.body.map((line, i) => (
              <p key={i}>
                {line}
                {i === replay.body.length - 1 && <span className={styles.cursor} aria-hidden="true" />}
              </p>
            ))}
          </div>
          <p className={styles.only}>{story.replay?.caption}</p>
        </section>
      )}

      {/* The next case, reaching you the way this one did: through Meera. */}
      {story.next && (
        <section className={styles.section} aria-label={story.next.title}>
          <p className={styles.eyebrow}>{story.next.title}</p>
          {story.next.lines.map((l) => (
            <p key={l.text} className={styles.nextLine}>
              <span className={styles.nextFrom}>{story.next!.from}</span>
              <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
              {l.english && <span className={styles.english}>{l.english}</span>}
            </p>
          ))}
          {story.next.trailer && (
            /* Its teaser: silent until tapped, the way a feed plays one. */
            <video className={styles.teaser} src={story.next.trailer} playsInline muted autoPlay loop controls preload="metadata" aria-label={`${story.next.title}: teaser`} />
          )}
          <p className={styles.only}>{story.next.note}</p>
          {story.next.href ? (
            <Link href={story.next.href} className={`act ${styles.nextAct}`}>
              {story.next.cta ?? "Open it"}
            </Link>
          ) : (
            <Notify caseId={id} />
          )}
        </section>
      )}

      <section className={styles.section}>
        {onLookAgain && story.lookAgain?.length ? (
          <button type="button" className={styles.button} onClick={onLookAgain}>
            Look again
          </button>
        ) : null}
        <button type="button" className={styles.button} onClick={playAgain}>
          Play again
        </button>
      </section>

      <PassItOn result={result} />

      <section className={styles.section}>
        <KeepCase caseId={id as CaseId} />
        <Link className={styles.quiet} href="/">
          Back to the desk
        </Link>
      </section>

      <aside className={styles.outside} aria-label="Outside the story">
        {story.outside.map((f) => (
          <p key={f.text}>
            {f.tel ? (
              <>
                {f.text.slice(0, f.text.lastIndexOf(f.tel))}
                <a href={`tel:${f.tel}`}>{f.tel}</a>
                {f.text.slice(f.text.lastIndexOf(f.tel) + f.tel.length)}
              </>
            ) : (
              f.text
            )}
            {f.source && <span className={styles.source}>{f.source}</span>}
          </p>
        ))}
      </aside>
    </div>
  );
}
