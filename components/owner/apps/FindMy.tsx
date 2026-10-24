"use client";

import { useState } from "react";

import type { Flag, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { peopleOf, placeOf, stationOf } from "@/lib/game/route";
import { Page } from "../AppView";
import styles from "./FindMy.module.css";

/* ===========================================================================
   Find My, People (Last Local): the map along the line the train is on, this
   iPhone on it, and whoever in the family can see it. Someone following
   shows as a moving pin. Share My Location can be stopped, once, and the
   family is told: that is how sharing works.
   =========================================================================== */

export default function FindMy({
  story,
  state,
  onHome,
  onStop,
}: {
  story: Story;
  state: CaseState;
  onHome: () => void;
  onStop: (sets: readonly Flag[]) => void;
}) {
  const route = story.route;
  const here = stationOf(story, state);
  const people = peopleOf(story, state);
  const stopped = Boolean(story.findMy && all(state, story.findMy.stopSharing));
  const [asking, setAsking] = useState(false);
  const stations = route?.stations ?? [];
  // The line, top to bottom: south to north, as the train runs.
  const y = (i: number) => 14 + (i * 72) / Math.max(1, stations.length - 1);
  const rowOf = (at: string) => stations.findIndex((st) => at.toLowerCase().includes(st.name.toLowerCase()));

  return (
    <Page title="People" large onBack={onHome} backLabel="Home" root>
      <div className={styles.map} role="img" aria-label={`Map: this iPhone near ${here?.here ?? "unknown"}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.sea} aria-hidden="true">
          <path d="M0 0H24C20 20 26 40 18 60C12 78 20 90 16 100H0Z" />
        </svg>
        <span className={styles.line} aria-hidden="true" />
        {stations.map((st, i) => (
          <span key={st.name} className={styles.station} style={{ top: `${y(i)}%` }} data-past={(here && i <= here.index) || undefined}>
            <i />
            {st.name}
          </span>
        ))}
        {here && (
          <span className={styles.me} style={{ top: `${y(here.index) + (here.next ? 4 : 0)}%` }}>
            <span className={styles.pulse} />
          </span>
        )}
        {people.map((p) => {
          const at = placeOf(p, state).at;
          const r = rowOf(at);
          if (r < 0) return null;
          return (
            <span key={p.name} className={styles.pin} data-following={p.following || undefined} style={{ top: `${y(r)}%` }}>
              {p.name.slice(0, 1)}
            </span>
          );
        })}
      </div>

      <ul className={styles.people}>
        {people.map((p) => {
          const where = placeOf(p, state);
          return (
            <li key={p.name} className={styles.person} data-following={p.following || undefined}>
              <span className={styles.avatar}>{p.name.slice(0, 1)}</span>
              <span className={styles.who}>
                <b>{p.name}</b>
                <span>{where.at}</span>
                {p.following && <span className={styles.following}>Viewing this iPhone&apos;s location</span>}
                {where.note && <span className={styles.note}>{where.note}</span>}
              </span>
              <span className={styles.when}>now</span>
            </li>
          );
        })}
      </ul>

      <div className={styles.me2}>
        <p className={styles.meHead}>Me</p>
        <p className={styles.meRow}>
          <span>Share My Location</span>
          <span className={styles.meValue}>{stopped ? "Off" : "On"}</span>
        </p>
        {!stopped &&
          (asking ? (
            <div className={styles.confirm}>
              <p>Stop sharing your location with Family? They&apos;ll be told.</p>
              <button type="button" className={styles.stop} onClick={() => story.findMy && onStop(story.findMy.stopSharing)}>
                Stop Sharing
              </button>
              <button type="button" className={styles.cancel} onClick={() => setAsking(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className={styles.stopRow} onClick={() => setAsking(true)}>
              Stop Sharing My Location
            </button>
          ))}
      </div>
    </Page>
  );
}
