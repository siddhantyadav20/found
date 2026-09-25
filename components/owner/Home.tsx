"use client";

import { useEffect, useState } from "react";

import type { AppId, HomeIcon, Story } from "@/content/types";
import { answered, needsRevisit, openQuestion, unseenIn, type CaseState } from "@/lib/game/engine";
import { offload } from "@/lib/game/phone";
import Alert from "./ios/Alert";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/Home.module.css";

/* ===========================================================================
   Her home screen, with one thing a real phone wouldn't have: the widget at
   the top is the player's open question.

   It is the quiet answer to "what am I supposed to be doing", it is always
   one tap from the case file, and it is the reason nobody has to be told how
   to play (PLAYER-JOURNEY Stage 4).

   Page two is where a son installed things for his mother once and she never
   opened them again.

   It stays mounted under an open app (`covered`): pushed back, dimmed and out
   of reach, so pulling the app away shows it, as a phone does.

   An offloaded app wears iOS's cloud before its name. Tapped, it waits for
   the App Store; until it can come down (`HomeIcon.offloaded`) the App Store
   says it can't, and after that it loads and is an app again.
   =========================================================================== */

/** How long the App Store takes to say no, and to bring an app back. */
const WAIT_MS = 1400;
const LOAD_MS = 1800;

/** iOS's cloud with an arrow, before an offloaded app's name. */
const CLOUD = "M5.5 13.5H5a3.5 3.5 0 0 1-.4-7A4.5 4.5 0 0 1 13.3 5.6a3.5 3.5 0 0 1 .2 7.9h-1M9 8.5v7.5m-2.4-2.4L9 16l2.4-2.4";

export default function Home({
  story,
  state,
  onOpen,
  onInstall,
  covered = false,
}: {
  story: Story;
  state: CaseState;
  /** Which app, and the box it was tapped in, relative to the viewport. */
  onOpen: (app: AppId, from?: DOMRect) => void;
  /** An offloaded app, downloaded again: the save keeps it. */
  onInstall?: (app: AppId) => void;
  covered?: boolean;
}) {
  const [page, setPage] = useState(0);
  // An offloaded app being asked for: waiting on the App Store, or on its way.
  const [fetching, setFetching] = useState<{ app: AppId; label: string; comes: boolean } | null>(null);
  const [refused, setRefused] = useState<string | null>(null);

  useEffect(() => {
    if (!fetching) return undefined;
    const t = window.setTimeout(
      () => {
        setFetching(null);
        if (fetching.comes) onInstall?.(fetching.app);
        else setRefused(fetching.label);
      },
      fetching.comes ? LOAD_MS : WAIT_MS,
    );
    return () => window.clearTimeout(t);
  }, [fetching, onInstall]);
  const open = openQuestion(story, state);
  // Everything the chapter asks has been answered: what's left is done on your own phone.
  const allAsked = story.questions.filter((q) => !q.optional).every((q) => answered(state, q.id));
  const { pages, dock } = story.home;

  const icon = ({ app, label, ...rest }: HomeIcon) => {
    const unseen = unseenIn(story, state, app);
    const where = offload(state, { app, label, ...rest });
    const busy = fetching?.app === app;
    return (
      <button
        key={`${app}-${label}`}
        type="button"
        className={styles.icon}
        data-offloaded={where !== "installed" || undefined}
        data-busy={busy ? (fetching?.comes ? "loading" : "waiting") : undefined}
        // The dock draws no labels, as iOS doesn't; a screen reader still gets one.
        aria-label={where !== "installed" ? `${label}, offloaded` : unseen > 0 ? `${label}, ${unseen} new` : label}
        onClick={(e) => {
          if (where === "installed") return onOpen(app, e.currentTarget.querySelector("span")?.getBoundingClientRect());
          if (!fetching) setFetching({ app, label, comes: where === "available" });
        }}
      >
        {/* The badge sits on the tile's corner, as iOS draws it. */}
        <span className={styles.tile}>
          <AppGlyph app={app} />
          {busy && <span className={styles.progress} aria-hidden="true" />}
          {unseen > 0 && where === "installed" && (
            <span className={styles.badge} aria-hidden="true">
              {unseen}
            </span>
          )}
        </span>
        <span className={styles.label}>
          {busy ? (
            fetching?.comes ? "Loading…" : "Waiting…"
          ) : (
            <>
              {where !== "installed" && (
                <svg viewBox="0 0 18 18" className={styles.cloud} aria-hidden="true">
                  <path d={CLOUD} />
                </svg>
              )}
              {label}
            </>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className={styles.home} data-covered={covered || undefined} inert={covered} aria-hidden={covered || undefined}>
      <button type="button" className={`${styles.widget} lg-thick`} onClick={(e) => onOpen("casefile", e.currentTarget.getBoundingClientRect())}>
        <span className={styles.widgetLabel}>{open ? (needsRevisit(open, state) ? "Revisit" : "Open question") : "Case file"}</span>
        <span className={styles.widgetText}>
          {open ? open.ask : allAsked ? "Everything's asked. What you do with it is on your phone." : "Look around. What you open, you keep."}
        </span>
      </button>

      <div
        className={styles.pages}
        onScroll={(e) => {
          const w = e.currentTarget.clientWidth || 1;
          setPage(Math.round(e.currentTarget.scrollLeft / w));
        }}
      >
        {pages.map((apps, i) => (
          <div key={i} className={styles.page}>
            <div className={styles.grid}>{apps.map((a) => icon(a))}</div>
          </div>
        ))}
      </div>

      {/* iOS 26 puts Search where the page dots were; the dots come back with a second page. */}
      {pages.length > 1 ? (
        <div className={`${styles.dots} lg`} aria-hidden="true">
          {pages.map((_, i) => (
            <span key={i} className={styles.pageDot} data-on={i === page || undefined} />
          ))}
        </div>
      ) : (
        <span className={`${styles.dots} ${styles.search} lg`} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <circle cx="6.8" cy="6.8" r="4.6" />
            <path d="m10.3 10.3 3.6 3.6" />
          </svg>
          Search
        </span>
      )}

      <div className={`${styles.dock} lg`}>{dock.map((a) => icon(a))}</div>

      {refused && (
        <Alert title="Unable to Download App" message={`“${refused}” could not be downloaded at this time.`} button="Done" onClose={() => setRefused(null)} />
      )}
    </div>
  );
}
