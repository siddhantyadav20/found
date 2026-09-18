"use client";

import { useEffect, useState } from "react";

import CallFeed from "@/components/call/CallFeed";
import type { Ending, EndingLine } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { linesFor } from "@/lib/game/endings";
import { flag } from "../playthrough";
import { Line } from "./parts";
import styles from "./Ending.module.css";

/* ===========================================================================
   The last image of each ending, and then black before anything resolves.

     01  a real police video call, three weeks later; your thumb goes to the
         clock on the wall; black before the zoom lands
     02  your family group, a forwarded reel, a sentence typed and deleted
     03  your friend at 11:52 PM, and the only reply box in the chapter
   =========================================================================== */

type LastProps = { ending: Ending; state: CaseState; friend: string; onDone: () => void };

/** One step at a time, on a timer: how a scene plays when nobody is asked anything. */
function useSteps(count: number, ms: number, run = true): number {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!run || step >= count) return undefined;
    const t = window.setTimeout(() => setStep((n) => n + 1), ms);
    return () => window.clearTimeout(t);
  }, [run, step, count, ms]);
  return step;
}

export function Last(props: LastProps) {
  if (props.ending.id === "police") return <Statement {...props} />;
  if (props.ending.id === "bin") return <Family {...props} />;
  return <Friend {...props} />;
}

/* --- 01 ------------------------------------------------------------------ */

function Statement({ ending, state, onDone }: LastProps) {
  const [ring, spoken, doubt] = linesFor(state, ending.last) as EndingLine[];
  const [answered, setAnswered] = useState(false);
  const step = useSteps(3, 3200, answered);

  // The zoom starts, and the screen goes out before it resolves.
  useEffect(() => {
    if (step < 3) return undefined;
    const t = window.setTimeout(onDone, 1700);
    return () => window.clearTimeout(t);
  }, [step, onDone]);

  if (!answered)
    return (
      <div className={styles.ringing}>
        {ring.at && <p className={styles.eyebrow}>{ring.at}</p>}
        <p className={styles.ringWho}>{ring.text.split(" · ")[0]}</p>
        <p className={styles.sub}>{ring.text.split(" · ")[1]}</p>
        <button type="button" className={styles.answer} onClick={() => setAnswered(true)}>
          Answer
        </button>
      </div>
    );

  return (
    <div className={styles.column}>
      <div className={styles.feedFrame}>
        <div className={step >= 3 ? styles.zoomIn : undefined}>
          {/* Mumbai's time on the clock, Marathi on the extinguisher: this one is
              real. The player zooms anyway, and never finds out. */}
          <CallFeed board="MUMBAI POLICE" clock="11:04" supervisor={false} label="अग्निशामक" />
        </div>
      </div>
      <div aria-live="polite" style={{ minHeight: "6rem" }}>
        {step >= 1 && <Line line={spoken} friend="" />}
        {step >= 2 && doubt && <Line line={doubt} friend="" />}
      </div>
    </div>
  );
}

/* --- 02 ------------------------------------------------------------------ */

const TYPED = "She wasn't scared. She was the only one who—";

function Family({ ending, state, onDone }: LastProps) {
  const [group, mausi, , typing] = linesFor(state, ending.last) as EndingLine[];
  const step = useSteps(2, 2400);
  // Typed a letter at a time, held, and deleted a letter at a time.
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"wait" | "type" | "hold" | "delete" | "typing">("wait");

  useEffect(() => {
    if (step >= 2 && phase === "wait") {
      const t = window.setTimeout(() => setPhase("type"), 900);
      return () => window.clearTimeout(t);
    }
    if (phase === "type") {
      if (chars >= TYPED.length) {
        const t = window.setTimeout(() => setPhase("delete"), 1600);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setChars((n) => n + 1), 70);
      return () => window.clearTimeout(t);
    }
    if (phase === "delete") {
      if (chars <= 0) {
        const t = window.setTimeout(() => setPhase("typing"), 500);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setChars((n) => n - 1), 28);
      return () => window.clearTimeout(t);
    }
    if (phase === "typing") {
      const t = window.setTimeout(onDone, 2400);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [step, phase, chars, onDone]);

  return (
    <div className={styles.thread}>
      <div className={styles.threadHead}>
        <span className={styles.threadName}>Family ❤️</span>
        <span className={styles.threadSub} aria-live="polite">
          {phase === "typing" ? typing.text : "Mausi, Papa, Didi, you"}
        </span>
      </div>
      {step >= 1 && (
        <>
          <p className={`${styles.from} ${styles.beat}`}>{group.text}</p>
          <div className={`${styles.reel} ${styles.beat}`}>
            <b>Nikhil Kulkarni</b>
            <span lang="hi-Latn">Meri Aai ne kisi ko nahi bataya…</span>
            <span className={styles.from}>4.2M views</span>
          </div>
        </>
      )}
      {step >= 2 && <Line line={mausi} friend="" />}
      <div className={styles.input} aria-label="Your message">
        <span>{TYPED.slice(0, chars)}</span>
        <span className={styles.caret} aria-hidden="true" />
      </div>
    </div>
  );
}

/* --- 03 ------------------------------------------------------------------ */

function Friend({ ending, state, friend, onDone }: LastProps) {
  const lines = linesFor(state, ending.last);
  const step = useSteps(lines.length, 2200);
  const [sent, setSent] = useState<string | null>(null);

  // Black the moment it's sent, before any answer can arrive.
  useEffect(() => {
    if (sent === null) return undefined;
    const t = window.setTimeout(onDone, 1100);
    return () => window.clearTimeout(t);
  }, [sent, onDone]);

  return (
    <div className={styles.thread}>
      <div className={styles.threadHead}>
        <span className={styles.threadName}>{friend}</span>
        <span className={styles.threadSub}>{step < lines.length && sent === null ? "typing…" : ""}</span>
      </div>
      <div aria-live="polite" className={styles.thread}>
        {lines.slice(0, step + 1).map((l, i) => (
          <Line key={i} line={l} friend={friend} named={false} />
        ))}
        {sent && <p className={`${styles.bubble} ${styles.beat}`} data-mine>{sent}</p>}
      </div>
      {step >= lines.length && sent === null && ending.reply && (
        <div className={styles.rows}>
          {ending.reply.map((o) => (
            <button
              key={o.id}
              type="button"
              className={styles.row}
              onClick={() => {
                flag(...(o.sets ?? []));
                if (o.id === "nothing") onDone();
                else setSent(o.text);
              }}
            >
              <span className={styles.label} lang={o.english ? "hi-Latn" : undefined}>
                {o.text}
                {o.english && <span className={styles.english}>{o.english}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
