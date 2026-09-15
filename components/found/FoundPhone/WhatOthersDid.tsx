"use client";

import { useEffect, useState } from "react";

import { has, type CaseState } from "@/lib/found/engine";
import { useCase } from "../StoryContext";
import styles from "./EndCard.module.css";

type Choices = {
  mum: { lie: number; truth: number; silence: number } | null;
  fasterThan: number | null;
};

const MUM = ["lie", "truth", "silence"] as const;

/**
 * One or two lines of what everyone else did, the moment a player can
 * compare: how fast they were (Episode 1), and what they sent Mum (Episode
 * 2). The route says nothing until enough people have answered, and this
 * says nothing when the route doesn't.
 */
export default function WhatOthersDid({ state, episode }: { state: CaseState; episode: 1 | 2 }) {
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
  if (!lines.length) return null;

  return (
    <ul className={styles.others}>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
