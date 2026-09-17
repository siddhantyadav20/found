"use client";

import { useState } from "react";

import { useCase } from "@/components/found/StoryContext";
import type { EpisodeNo } from "@/content/found/types";
import { callAnswer, type CaseState } from "@/lib/found/engine";
import { resultOf } from "@/lib/found/result";
import { say } from "@/lib/found/voice";
import KeepCase from "../KeepCase";
import * as play from "./actions";
import PassItOn from "./PassItOn";
import WhatOthersDid from "./WhatOthersDid";
import styles from "./EndCard.module.css";

/**
 * Between episodes, in the site's voice: the questions left open and the way
 * on. After Episode 3 there are no questions left — the chapter closes — so
 * it says what the player said on the call, and how many others said it too.
 */
export default function EndCard({
  state,
  episode,
  onReplay,
}: {
  state: CaseState;
  episode: EpisodeNo;
  onReplay: () => void;
}) {
  const { id, story: ep } = useCase();
  const end = episode === 1 ? ep.end : episode === 2 ? ep.end2 : ep.end3;
  const result = resultOf(ep, state, episode);
  const [confirming, setConfirming] = useState(false);
  const said = episode === 3 ? ep.replies.find((r) => r.call)?.options.find((o) => o.id === callAnswer(ep, state))?.text : null;

  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>{end.title}</p>
      <h2 className={styles.title}>{ep.titles[episode - 1]}</h2>
      {said ? (
        <p className={styles.said}>
          You said: <q>{say(said, state.cast)}</q>
        </p>
      ) : (
        <ul className={styles.questions}>
          {end.questions.map((q) => (
            <li key={q}>{say(q, state.cast)}</li>
          ))}
        </ul>
      )}

      <WhatOthersDid state={state} episode={episode} />

      <div className={styles.ask}>
        <p className={styles.askText}>{end.ask}</p>
        {episode < 3 && (
          <div className={styles.choices}>
            <button type="button" className={styles.primary} onClick={() => play.perform(`start-ep${episode + 1}`)}>
              {end.cta ?? "Continue"}
            </button>
          </div>
        )}
      </div>

      <PassItOn result={result} />

      <KeepCase caseId={id} />

      <div className={styles.footer}>
        {confirming ? (
          <div className={styles.confirm} role="group" aria-labelledby="start-over">
            <p id="start-over">
              Start over? The phone goes back in its envelope, and someone else goes missing. Your result stays on the desk.
            </p>
            <div className={styles.row}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => {
                  play.verdict("reset:yes");
                  onReplay();
                }}
              >
                Start over
              </button>
              <button type="button" className={styles.secondary} onClick={() => setConfirming(false)}>
                Keep this one
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.link}
            onClick={() => {
              setConfirming(true);
              play.verdict("reset:ask");
            }}
          >
            Start over, with someone else missing
          </button>
        )}
        <a className={styles.link} href="https://sidbuilds.in">
          Made by Siddhant
        </a>
      </div>
    </div>
  );
}
