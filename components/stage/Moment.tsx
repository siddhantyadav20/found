"use client";

import { useEffect, useState } from "react";

import type { Flag, Moment as MomentT, Voices } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { buzz } from "@/lib/found/buzz";
import { say } from "@/lib/found/voice";
import styles from "./Moment.module.css";

/* ===========================================================================
   A moment the story stops for (Last Local): the screen is the world, not a
   phone. The place, what's happening, a line at a time, then the choices,
   all of one weight. Against a clock when the story says so: a red bar runs
   down, and when it's gone the story chooses for you (`timeout`).
   =========================================================================== */

const LINE_MS = 1300;

export default function Moment({
  moment,
  state,
  onChoose,
  voices,
}: {
  moment: MomentT;
  state: CaseState;
  onChoose: (sets: readonly Flag[]) => void;
  /** A line somebody says, said aloud where it's recorded ("moment:<id>:<line>"). */
  voices?: Voices;
}) {
  const [shown, setShown] = useState(1);
  const ready = shown >= moment.lines.length;
  const options = moment.options.filter((o) => all(state, o.requires) && !(o.unless ?? []).some((f) => state.flags.includes(f)));
  const [left, setLeft] = useState(moment.seconds ?? 0);

  // Each line as it comes up is heard, and the next waits for it to be said.
  const voice = (i: number) => voices?.[`moment:${moment.id}:${i}`];
  useEffect(() => say(voice(shown - 1)?.src), [shown]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (ready) return undefined;
    const t = window.setTimeout(() => setShown((n) => n + 1), Math.max(LINE_MS, (voice(shown - 1)?.seconds ?? 0) * 1000 + 350));
    return () => window.clearTimeout(t);
  }, [ready, shown]); // eslint-disable-line react-hooks/exhaustive-deps

  // The clock starts once everything has been said.
  useEffect(() => {
    if (!ready || !moment.seconds) return undefined;
    buzz();
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [ready, moment.seconds]);

  // The last seconds are felt: a buzz at ten, and at five.
  const urgent = Boolean(moment.seconds) && ready && left <= 10;
  useEffect(() => {
    if (ready && moment.seconds && (left === 10 || left === 5)) buzz();
  }, [left, ready, moment.seconds]);

  useEffect(() => {
    if (!moment.seconds || left > 0 || !ready) return;
    // When the clock runs out, the story chooses: the option it names, if it's on offer to this player.
    const open = moment.options.filter((o) => all(state, o.requires) && !(o.unless ?? []).some((f) => state.flags.includes(f)));
    const fallback = open.find((o) => o.id === moment.timeout) ?? open[0];
    onChoose(fallback.sets);
  }, [left, ready, moment, onChoose, state]);

  return (
    <div className={styles.moment} role="dialog" aria-label={moment.where} data-urgent={urgent || undefined}>
      {moment.seconds ? (
        <span className={styles.clock} aria-hidden="true">
          <span style={{ width: `${(left / moment.seconds) * 100}%` }} />
        </span>
      ) : null}
      <div className={styles.body}>
        <p className={styles.where}>{moment.where}</p>
        {moment.lines.slice(0, shown).map((l, i) => (
          <p key={i} className={l.who ? styles.said : styles.told}>
            {l.who && <span className={styles.who}>{l.who}</span>}
            <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
            {l.english && <span className={styles.english}>{l.english}</span>}
          </p>
        ))}
      </div>
      {ready && (
        <div className={styles.options}>
          {moment.seconds ? (
            <p className={styles.left} aria-live={urgent ? "assertive" : "off"}>
              0:{String(left).padStart(2, "0")}
            </p>
          ) : null}
          {options.map((o) => (
            <button key={o.id} type="button" className={styles.option} onClick={() => onChoose(o.sets)} data-faced={o.face || o.glyph ? "" : undefined}>
              {o.face ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.face} alt="" className={styles.face} />
              ) : o.glyph ? (
                <span className={styles.glyph} aria-hidden="true">
                  {o.glyph}
                </span>
              ) : null}
              <span>{o.text}</span>
            </button>
          ))}
        </div>
      )}
      {!ready && (
        <button type="button" className={styles.skip} onClick={() => setShown(moment.lines.length)}>
          Go on
        </button>
      )}
    </div>
  );
}
