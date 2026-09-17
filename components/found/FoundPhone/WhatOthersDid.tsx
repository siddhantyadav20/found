"use client";

import { useEffect, useState } from "react";

import type { EpisodeNo } from "@/content/found/types";
import { has, type CaseState } from "@/lib/found/engine";
import { useCase } from "../StoryContext";
import styles from "./EndCard.module.css";

type Choices = {
  mum: { lie: number; truth: number; silence: number } | null;
  call: { send: number; run: number; fix: number } | null;
  fasterThan: number | null;
};

const MUM = ["lie", "truth", "silence"] as const;
const CALL = ["send", "run", "fix"] as const;

/** "1 in 4": a percentage as the fraction a person would say out loud. */
function oneIn(percent: number): string {
  if (percent >= 95) return "Nearly everyone";
  if (percent <= 0) return "Almost nobody";
  const n = Math.max(1, Math.round(100 / percent));
  return n === 1 ? "Nearly everyone" : `1 in ${n} players`;
}

/**
 * One or two lines of what everyone else did, the moment a player can
 * compare: how fast they were (Episode 1), what they sent Mum (Episode 2),
 * and what they said on the call (Episode 3). The route says nothing until enough people have answered, and this
 * says nothing when the route doesn't.
 */
export default function WhatOthersDid({ state, episode }: { state: CaseState; episode: EpisodeNo }) {
  const { id } = useCase();
  const [choices, setChoices] = useState<Choices | null>(null);
  const dead = state.at["dead"];
  const seconds = episode === 1 && dead !== undefined ? Math.round((dead - state.started) / 1000) : undefined;

  useEffect(() => {
    let live = true;
    const q = new URLSearchParams({ case: id });
    if (seconds !== undefined) q.set("seconds", String(seconds));
    fetch(`/api/found/choices?${q}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((c: Choices | null) => {
        if (live) setChoices(c);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id, seconds]);

  const lines: string[] = [];
  if (episode === 1 && choices?.fasterThan != null) {
    lines.push(`You got here faster than ${choices.fasterThan}% of players.`);
  }
  if (episode === 2 && choices?.mum) {
    const pick = MUM.find((o) => has(state, `said:r-mum:${o}`));
    const p = pick ? choices.mum[pick] : 0;
    if (pick === "lie") lines.push(`You told Mum ${state.cast.name} was okay. So did ${p}% of players.`);
    if (pick === "truth") lines.push(`You told Mum the truth. So did ${p}% of players.`);
    if (pick === "silence") lines.push(`You left Mum on read. So did ${p}% of players.`);
  }
  if (episode === 3 && choices?.call) {
    const pick = CALL.find((o) => has(state, `said:call:${o}`));
    if (pick) lines.push(`${oneIn(choices.call[pick])} said what you said.`);
  }
  if (!lines.length) return null;

  return (
    <ul className={styles.others}>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
