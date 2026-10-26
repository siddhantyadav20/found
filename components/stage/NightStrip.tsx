"use client";

import type { NightMark, Story } from "@/content/types";
import { all, clockNow, type CaseState } from "@/lib/game/engine";
import { useNow } from "@/lib/found/now";
import { nightly, stamp } from "@/lib/found/time";
import styles from "./NightStrip.module.css";

/* ===========================================================================
   The two nights, one clock (2026-10-26). The wedding night and the
   player's own share their minutes a week apart, and a player asked about
   1:52 at 1:52 had no way to tell which was meant. The strip keeps them
   apart: that night above, pinned only as each minute is traced (never a
   minute the player hasn't earned), and tonight below, faint, with where
   each episode opened and where the clock is now.
   =========================================================================== */

const shown = (s: CaseState, m: NightMark) => m.when.some((set) => all(s, set));

/** "1:52", without its AM: the strip is all one night. */
const short = (at: string) => stamp(at).replace(/ [AP]M$/, "");

export default function NightStrip({ story, state }: { story: Story; state: CaseState }) {
  const now = useNow(60_000);
  const t = story.timeline;
  if (!t) return null;
  const from = nightly(t.from);
  const span = nightly(t.to) - from;
  const x = (at: string) => `${Math.min(100, Math.max(0, ((nightly(at) - from) / span) * 100))}%`;

  const marks = t.marks.filter((m) => shown(state, m));
  const major = marks.filter((m) => !m.minor);
  const minor = marks.filter((m) => m.minor);
  const opened = t.now.filter((m) => shown(state, m));
  const clock = clockNow(story, state, now);

  return (
    <figure className={styles.strip} aria-label="The two nights">
      <figcaption className={styles.head}>{t.thatNight}</figcaption>
      <div className={styles.line} data-night="then">
        {minor.map((m) => (
          <i key={m.at} className={styles.tick} style={{ left: x(m.at) }} title={`${stamp(m.at)} · ${m.label}`} />
        ))}
        {major.map((m, i) => (
          <span key={m.at} className={styles.mark} style={{ left: x(m.at) }} data-below={i % 2 === 1 || undefined}>
            <i className={styles.dot} />
            <b className={styles.label}>{short(m.at)}</b>
          </span>
        ))}
        {marks.length === 0 && <span className={styles.empty}>Nothing pinned yet</span>}
      </div>
      <div className={styles.line} data-night="now">
        {opened.map((m) => (
          <i key={m.at} className={styles.tick} data-now style={{ left: x(m.at) }} title={`${stamp(m.at)} · ${m.label}`} />
        ))}
        <span className={styles.clock} style={{ left: x(clock) }} title={`${story.nowLabel ?? "Now"} · ${stamp(clock)}`} />
      </div>
      <p className={styles.foot}>
        <span>{t.tonight}</span>
        <span>{stamp(clock)}</span>
      </p>
      {/* What each pinned minute was, in the night's order: the strip only says when. */}
      {marks.length > 0 && (
        <p className={styles.legend}>
          {marks.map((m) => (
            <span key={m.at} data-minor={m.minor || undefined}>
              <b>{short(m.at)}</b> {m.label}
            </span>
          ))}
        </p>
      )}
    </figure>
  );
}
