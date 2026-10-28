"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import KeepCase from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import type { CaseId } from "@/content/cases";
import type { EpisodeNo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { chosen, earned, rewindToChoice } from "@/lib/game/endings";
import { heldOn, impulseOf, topLines, vowsOf, walkedPast } from "@/lib/game/reading";
import { commit } from "@/lib/found/progress";
import { resultOf } from "@/lib/found/result";
import { markSolved } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import { DETECTIVE, UNOPENED } from "@/lib/game/scene";
import PassItOn from "../PassItOn";
import Night from "../ending/Night";
import Notify from "../ending/Notify";
import ending from "../ending/Ending.module.css";
import styles from "./EndCard.module.css";

/* ===========================================================================
   The end card (RAAKH-V3 §11): every ending but Unopened.

     the headline, and the line under it
     Endings found: N of 4, and Choose differently
     Which Sameer read the phone: two bars, each with its most weighted line
     Your story held on N of 4
     Promises made: N. Kept: N.
     Clues you walked past: N of 15, and Look again
     Your night
     the ending split across everyone, once 500 have finished
     the share (spoiler-safe; a full version for those who've finished)
     Chapter 2

   Unopened is minimal: its name, and "Open it again", which puts the
   phone back exactly as it was.
   =========================================================================== */

type Others = Record<string, number> | null;

export function Unopened({ story, onOpen }: { story: Story; onOpen: () => void }) {
  return (
    <div className={`${ending.screen} ${ending.card}`}>
      <section className={ending.section}>
        <p className={styles.headline}>Unopened</p>
        <button type="button" className={ending.button} onClick={onOpen}>
          {story.unopened?.again ?? "Open it again"}
        </button>
        <Link className={ending.quiet} href="/">
          Back to the desk
        </Link>
      </section>
    </div>
  );
}

export default function EndCardV3({ story, state, onLookAgain }: { story: Story; state: CaseState; onLookAgain?: () => void }) {
  const { id } = useCase();
  const end = chosen(story, state);
  const [result] = useState(() => resultOf(story, state, Date.now()));
  const [others, setOthers] = useState<Others>(null);
  const [full, setFull] = useState(false);
  const episodes = story.episodes.length as EpisodeNo;
  const copy = story.endCopy;
  const tally = impulseOf(story, state);
  const quotes = topLines(story, state);
  const total = Math.max(1, tally.auditor + tally.confessor);
  const held = heldOn(story, state);
  const vows = vowsOf(story, state);
  const clues = walkedPast(story, state);
  const of = story.clues?.length ?? 0;
  const notes = (end?.notes ?? []).filter((l) => earned(state, l));

  useEffect(() => {
    markSolved(id as CaseId, { episode: episodes, minutes: result.minutes, traced: 0, of: 0, at: Date.now() });
  }, [id, episodes, result.minutes]);

  useEffect(() => {
    let live = true;
    fetch(`/api/found/choices?case=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      // The server says nothing until 500 have finished (lib/found/store.ts).
      .then((d: { end?: Others } | null) => live && setOthers(d?.end ?? null))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id]);

  // Every ending this browser has reached, kept outside the save so a rewind doesn't forget it.
  const ways = story.endings.filter((e) => e.id !== "unopened");
  const [found] = useState(() => (end ? endingsFound(id, end.id) : []));
  const rewound = rewindToChoice(story, state);
  const chooseAgain = () => {
    if (!rewound) return;
    track({ case: id, event: "again" });
    // Marked outside the flags, which the rewind cuts: a second go isn't counted as a second player.
    commit({ ...rewound, at: { ...rewound.at, rewound: Date.now() } });
    window.scrollTo(0, 0);
  };

  const playAgain = () => {
    track({ case: id, event: "reset:yes" });
    commit(null);
    window.scrollTo(0, 0);
  };

  const fullShare = `${result.line ?? ""} ${story.impulse?.labels.auditor}: ${tally.auditor} · ${story.impulse?.labels.confessor}: ${tally.confessor}. ${copy?.held.replace("{n}", String(held.n)).replace("{of}", String(held.of)) ?? ""}`;

  return (
    <div className={`${ending.screen} ${ending.card}`}>
      <section className={ending.section} aria-label="How it ended">
        {end && <p className={ending.eyebrow}>Ending · {end.row}</p>}
        <p className={styles.headline}>{end?.headline}</p>
        {end?.line && <p className={styles.line}>{end.line}</p>}
        {notes.map((l) => (
          <p key={l.text} className={styles.note}>
            {l.text}
          </p>
        ))}
        {state.flags.includes(DETECTIVE) && <p className={ending.scoreMode}>Played as a detective</p>}
      </section>

      {/* Choose differently (2026-10-29): back to the last choice, not the start of the night. */}
      {rewound && ways.length > 1 && (
        <section className={ending.section} aria-labelledby="ways">
          <p className={ending.eyebrow} id="ways">
            Endings found · {found.filter((f) => ways.some((w) => w.id === f)).length} of {ways.length}
          </p>
          <ul className={styles.ways}>
            {ways.map((w) => (
              <li key={w.id} data-found={found.includes(w.id) || undefined}>
                {found.includes(w.id) ? w.row : "?"}
              </li>
            ))}
          </ul>
          <button type="button" className={`${ending.button} ${styles.again}`} onClick={chooseAgain}>
            Choose differently
          </button>
          <p className={styles.againNote}>Back to the last choice of the night. Everything before it stays as you played it.</p>
        </section>
      )}

      {/* Which Sameer read the phone: the two impulses, and the line each is best known by. */}
      {story.impulse && (
        <section className={ending.section} aria-labelledby="which">
          <p className={ending.eyebrow} id="which">
            {copy?.impulses ?? "Which Sameer read the phone"}
          </p>
          {(["auditor", "confessor"] as const).map((side) => (
            <div key={side} className={styles.bar}>
              <p className={styles.barHead}>
                <span>{story.impulse!.labels[side]}</span>
                <b>{tally[side]}</b>
              </p>
              <span className={styles.track} aria-hidden="true">
                <i data-side={side} style={{ width: `${Math.round((tally[side] / total) * 100)}%` }} />
              </span>
              {quotes[side] && (
                <p className={styles.quote} lang="hi-Latn">
                  “{quotes[side].replace(/“/g, "‘").replace(/”/g, "’")}”
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      <section className={ending.section}>
        {copy && <p className={styles.stat}>{copy.held.replace("{n}", String(held.n)).replace("{of}", String(held.of))}</p>}
        {copy && vows.length > 0 && (
          <p className={styles.stat}>
            {copy.promises.replace("{made}", String(vows.length)).replace("{kept}", String(vows.filter((v) => v.state === "kept").length))}
          </p>
        )}
        {vows.length > 0 && (
          <ul className={styles.vows}>
            {vows.map((v) => (
              <li key={v.id} data-state={v.state}>
                <span>To {v.to}</span> <span lang="hi-Latn">{v.text}</span> <b>{v.state === "kept" ? "Kept" : "Broken"}</b>
              </li>
            ))}
          </ul>
        )}
        {copy && of > 0 && <p className={styles.stat}>{copy.clues.replace("{n}", String(clues.length)).replace("{of}", String(of))}</p>}
        {onLookAgain && of > 0 && (
          <button type="button" className={ending.button} onClick={onLookAgain}>
            Look again
          </button>
        )}
      </section>

      <Night story={story} state={state} />

      {others && (
        <section className={ending.section}>
          <p className={ending.eyebrow}>Everyone who finished</p>
          <p className={ending.others}>{story.endings.filter((e) => e.id !== "unopened").map((e) => `${others[e.id] ?? 0}% · ${e.row}`).join("  ·  ")}</p>
        </section>
      )}

      {story.next && (
        <section className={ending.section} aria-label={story.next.title}>
          <p className={ending.eyebrow}>{story.next.title}</p>
          {story.next.lines.map((l) => (
            <p key={l.text} className={ending.nextLine}>
              <span className={ending.nextFrom}>{story.next!.from}</span>
              <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
              {l.english && <span className={ending.english}>{l.english}</span>}
            </p>
          ))}
          <p className={ending.only}>{story.next.note}</p>
          {story.next.href ? (
            <Link href={story.next.href} className={`act ${ending.nextAct}`}>
              {story.next.cta ?? "Open it"}
            </Link>
          ) : (
            <Notify caseId={id} />
          )}
        </section>
      )}

      <PassItOn result={full ? { ...result, line: fullShare } : result} />
      <section className={ending.section}>
        <button type="button" className={ending.button} onClick={() => setFull((f) => !f)} aria-pressed={full}>
          {full ? "Share the spoiler-safe card" : "Finished it? Share the full card"}
        </button>
      </section>

      <section className={ending.section}>
        <button type="button" className={ending.button} onClick={playAgain}>
          Play again
        </button>
        <KeepCase caseId={id as CaseId} />
        <Link className={ending.quiet} href="/">
          Back to the desk
        </Link>
      </section>

      <aside className={ending.outside} aria-label="Outside the story">
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
            {f.source && <span className={ending.source}>{f.source}</span>}
          </p>
        ))}
      </aside>
    </div>
  );
}

/** Remember an ending as found in this browser, and read back every one found. Never throws. */
function endingsFound(caseId: string, now: string): string[] {
  const key = `found:${caseId}:endings`;
  try {
    const had = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    const list = Array.isArray(had) ? had.filter((x): x is string => typeof x === "string") : [];
    if (!list.includes(now)) list.push(now);
    window.localStorage.setItem(key, JSON.stringify(list));
    return list;
  } catch {
    return [now];
  }
}

/** Unopened, as a flag: what "Open it again" takes away. */
export const UNOPENED_FLAG = UNOPENED;
