"use client";

import { useEffect } from "react";

import { useStory } from "@/components/found/StoryContext";
import { has, morning } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import GuardianCard from "./GuardianCard";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Guardian.module.css";

function Shield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.shield}>
      <path d="M12 2.8 4.8 5.5v5.6c0 4.6 3.1 7.9 7.2 9.6 4.1-1.7 7.2-5 7.2-9.6V5.5L12 2.8Z" />
      <path d="m8.8 12 2.3 2.3 4.2-4.5" className={styles.tick} />
    </svg>
  );
}

/**
 * Mum's monitoring app, on page two of the home screen where it's sat since
 * {name} was fifteen. A third-party app with its own look, light and
 * reassuring (it never learned dark mode), so the status bar turns dark over
 * it. In Episode 1 it's a boring screen that happens to be counting you. In
 * Episode 2 it's Monday's report.
 */
export default function Guardian({ state }: AppProps) {
  const ep = useStory();
  const ep2 = has(state, "ep:2");
  const ms = Object.entries(state.usage)
    .filter(([k]) => k.startsWith("1:"))
    .reduce((n, [, v]) => n + v, 0);
  const top = Object.entries(state.usage)
    .filter(([k]) => k.startsWith("1:"))
    .sort((a, b) => b[1] - a[1])[0]?.[0]
    .slice(2);
  const unlocked = state.at["lock:passcode"];
  const earlier = ep.guardian.earlier;

  // The app never stopped counting, so it counted him too. Looking at that is
  // finding it: it goes to the case file like anything else on this phone.
  useEffect(() => {
    if (!ep2 && earlier) play.see(earlier.evidence);
  }, [ep2, earlier]);

  return (
    <section className={`${app.view} ${styles.light}`} data-light-app>
      <header className={styles.top}>
        <span className={styles.brand}>
          <Shield />
          Guardian
        </span>
        <span className={styles.plan}>Family</span>
      </header>
      <div className={app.body}>
        <div className={styles.hero}>
          <span className={styles.badge}>Monitoring on</span>
          <p className={styles.heroTitle}>This phone is monitored by {ep.guardian.owner}.</p>
          <p className={styles.heroSub}>Reports are sent every day at 11:00.</p>
        </div>

        {ep2 ? (
          <>
            <p className={styles.section}>Monday&apos;s report</p>
            <GuardianCard state={state} />
            <p className={styles.small}>Viewed by Anjali · Mon 11:40</p>
          </>
        ) : (
          <>
            <p className={styles.section}>Today so far</p>
            <ul className={styles.list}>
              <li className={styles.row}>
                <span>First pickup</span>
                <b>{unlocked ? morning(state, unlocked) : "—"}</b>
              </li>
              <li className={styles.row}>
                <span>On screen</span>
                <b>{Math.max(1, Math.round(ms / 60_000))} min</b>
              </li>
              <li className={styles.row}>
                <span>Most used</span>
                <b>{top ? top[0].toUpperCase() + top.slice(1) : "—"}</b>
              </li>
            </ul>

            {earlier && (
              <>
                <p className={styles.section}>{earlier.day}</p>
                <ul className={styles.list}>
                  {earlier.rows.map((r) => (
                    <li key={r.at} className={`${styles.row} ${styles.log}`}>
                      <span className={styles.when}>{r.at}</span>
                      <span>{r.label}</span>
                    </li>
                  ))}
                </ul>
                <p className={styles.small}>Reported to {ep.guardian.owner} · Sat 11:00</p>
              </>
            )}
          </>
        )}

        <p className={styles.section}>Settings</p>
        <ul className={styles.list}>
          <li className={styles.row}>
            <span>Monitoring since</span>
            <b>{ep.guardian.since}</b>
          </li>
          <li className={styles.row}>
            <span>Daily activity report</span>
            <b>On</b>
          </li>
          <li className={styles.row}>
            <span>Location</span>
            <b>On</b>
          </li>
        </ul>
      </div>
    </section>
  );
}
