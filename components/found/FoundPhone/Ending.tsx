"use client";

import { useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { buzz } from "@/lib/found/buzz";
import { all, callAnswer, has, sessionVars, type CaseState } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import * as play from "./actions";
import styles from "./Ending.module.css";

type Phase = "act" | "story" | "coda" | "desk";

/** How long the act takes once it's started: an upload, an erase, a door. */
const ACT_MS = 7000;
/** Knocking, while the player decides. */
const KNOCK_MS = 4200;
/** Between one line of what happened and the next. */
const LINE_MS = 2600;

/**
 * What the answer on the call did, start to finish, in four beats:
 *
 *   act    the minute after the call, while someone knocks: send it all,
 *          erase it, or open the door
 *   story  what happened because of it, a line at a time, some lines only
 *          true for this player, ending on one news item
 *   coda   Tara, once
 *   desk   the lamp moves off the phone and finds the next object
 *
 * Nothing here waits on a clock the player can lose to. The knocking only
 * knocks, and every beat moves on when they tap.
 */
export default function Ending({ state }: { state: CaseState }) {
  const ep = useStory();
  const vars = sessionVars(ep, state);
  const t = (x: string) => say(x, state.cast, vars);
  const answer = callAnswer(ep, state);
  const outcome = ep.call?.outcomes.find((o) => o.id === answer);
  const [phase, setPhase] = useState<Phase>("act");
  const [progress, setProgress] = useState<number | null>(null);
  const [shownLines, setShownLines] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  const acting = progress !== null;
  const acted = progress !== null && progress >= 1;

  // Someone at the door, until the act is done.
  useEffect(() => {
    if (phase !== "act" || acted) return;
    const timer = window.setInterval(buzz, KNOCK_MS);
    return () => window.clearInterval(timer);
  }, [phase, acted]);

  // The act runs once it's begun.
  useEffect(() => {
    if (!acting || acted) return;
    const began = Date.now();
    const timer = window.setInterval(() => setProgress(Math.min(1, (Date.now() - began) / ACT_MS)), 100);
    return () => window.clearInterval(timer);
  }, [acting, acted]);

  const lines = (outcome?.lines ?? []).filter((l) => all(state, l.requires) && !(l.unless ?? []).some((f) => has(state, f)));
  const total = lines.length + 1 + (outcome?.after?.length ?? 0) + (outcome?.last ? 1 : 0);

  // What happened arrives a line at a time.
  useEffect(() => {
    if (phase !== "story" || shownLines >= total) return;
    const timer = window.setTimeout(() => setShownLines((n) => n + 1), shownLines === 0 ? 400 : LINE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, shownLines, total]);

  // Follow the newest line down; everything before it stays a scroll away.
  useEffect(() => {
    const el = storyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shownLines]);

  if (!outcome || !ep.call) return null;
  const coda = ep.call.coda;

  if (phase === "act") {
    return (
      <div className={styles.ending} data-outcome={outcome.id} data-phase="act">
        {outcome.id === "run" && acted ? (
          <p className={styles.hello}>{outcome.act.done}</p>
        ) : (
          <div className={styles.act}>
            <p className={styles.knock} aria-live="polite">
              {acted ? "" : "[knocking]"}
            </p>
            <h2 className={styles.actTitle}>{outcome.act.title}</h2>
            <p className={styles.actDetail}>{t(outcome.act.detail)}</p>
            {acting ? (
              <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((progress ?? 0) * 100)}>
                <span style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
              </div>
            ) : (
              <button type="button" className={styles.actButton} onClick={() => setProgress(0)}>
                {outcome.act.button}
              </button>
            )}
            <p className={styles.actState} aria-live="polite">
              {acted ? t(outcome.act.done) : acting ? `${outcome.act.doing}…` : ""}
            </p>
          </div>
        )}
        {acted && (
          <button type="button" className={styles.next} onClick={() => setPhase("story")}>
            Continue
          </button>
        )}
      </div>
    );
  }

  if (phase === "story") {
    // Everything that happened, in order; `shownLines` of it has arrived so far.
    const beats: React.ReactNode[] = [
      ...lines.map((l) => (
        <p key={l.text} className={styles.line}>
          {t(l.text)}
        </p>
      )),
      <article key="headline" className={styles.headline}>
        <span className={styles.masthead}>
          City Desk <span>{outcome.headline.at}</span>
        </span>
        <span className={styles.headlineTitle}>{t(outcome.headline.title)}</span>
      </article>,
      ...(outcome.after ?? []).map((text) => (
        <p key={text} className={styles.line} data-last>
          {t(text)}
        </p>
      )),
      ...(outcome.last
        ? [
            <div key="last" className={styles.text}>
              <span className={styles.textFrom}>{outcome.last.from}</span>
              <span>{t(outcome.last.text)}</span>
            </div>,
          ]
        : []),
    ];
    return (
      <div className={styles.ending} data-outcome={outcome.id} data-phase="story">
        <div ref={storyRef} className={styles.story} aria-live="polite">
          {beats.slice(0, shownLines)}
        </div>
        <button
          type="button"
          className={styles.next}
          onClick={() => (shownLines >= total ? setPhase("coda") : setShownLines(total))}
        >
          {shownLines >= total ? "Continue" : "Skip ahead"}
        </button>
      </div>
    );
  }

  if (phase === "coda") {
    return (
      <div className={styles.ending} data-phase="coda">
        <div className={styles.text} data-coda>
          <span className={styles.textFrom}>{coda.from}</span>
          <span>{t(coda.text)}</span>
        </div>
        <button type="button" className={styles.next} onClick={() => setPhase("desk")}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className={styles.ending} data-phase="desk">
      {/* The desk the phone came from. The lamp moves off where it lay and finds
          one of the shapes that's been at the edge of the light all along. */}
      <div className={styles.desk} aria-hidden="true">
        <span className={styles.lamp} />
        <span className={styles.shape} />
      </div>
      <div className={styles.deskLines}>
        {coda.next.map((line, i) => (
          <p key={line} className={styles.deskLine} style={{ animationDelay: `${2.2 + i * 1.6}s` }}>
            {line}
          </p>
        ))}
      </div>
      <button type="button" className={styles.close} onClick={() => play.perform("finish-ep3")}>
        Close the case
      </button>
    </div>
  );
}
