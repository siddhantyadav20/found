"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import AppView from "@/components/owner/AppView";
import Home from "@/components/owner/Home";
import LockScreen from "@/components/owner/LockScreen";
import Phone, { type Notice, type Origin } from "@/components/owner/Phone";
import phoneStyles from "@/components/owner/ios/Screen.module.css";
import YourPhone from "@/components/yours/Phone";
import type { CaseMeta } from "@/content/cases";
import type { AppId, Story } from "@/content/types";
import {
  appLabel,
  battery,
  caseFile,
  charging as onCharger,
  clockAt,
  clockNow,
  dateNow,
  dayNow,
  dueEvents,
  eventClock,
  episodeOf,
  fire,
  has,
  minutesSince,
  openApp as findIn,
  openQuestion,
  traced,
  whereToLook,
  type CaseState,
} from "@/lib/game/engine";
import { AIRPLANE, installed } from "@/lib/game/phone";
import { offline } from "@/lib/game/engine";
import RealClock from "./RealClock";
import { DETECTIVE } from "@/lib/game/scene";
import { newsOnYours, yourMessages, yourUnread } from "@/lib/game/yours";
import { TRAIN_UNDER, useBed } from "@/lib/found/nightSound";
import { useNow } from "@/lib/found/now";
import { longDay, phoneClock, stamp } from "@/lib/found/time";
import { boundCase, readProgress } from "@/lib/found/progress";
import { noteBattery } from "@/lib/found/shelf";
import AppBody, { preloadApps } from "./AppBody";
import CaseFile from "./CaseFile";
import { flag, nudged, save, toggleAirplane } from "./playthrough";
import styles from "./Stage.module.css";

/* ===========================================================================
   The table: the found phone, and yours beside it.

   Everything the player does between the full-screen moments happens here:
   which app is open, what has just arrived, where to look when they're
   stuck. What is decided rather than drawn lives in `lib/game`; what is
   written goes through `playthrough`.

   It re-renders when the save changes and when the story's minute turns,
   never on the second.
   =========================================================================== */

/** Your phone, picked up: loaded the first time it is, since most of a play never needs it. */
const YourSheet = dynamic(() => import("@/components/yours/Sheet"), { ssr: false });

/** A banner is written as "Who · what", the way a phone shows one. */
const bannerFrom = (banner: string) => banner.split(" · ")[0];
const bannerText = (banner: string) => banner.split(" · ").slice(1).join(" · ");

/** How long a player can find nothing before the case file offers where to look. */
const NUDGE_MS = 45_000;

/** The least time between two of the night's turns, so they land one at a time (the 2026-10-01 review). */
const GAP_MS = 10_000;

/** Wide enough for the case file to lie on the table beside the phones, as a notebook. */
const NOTEBOOK = "(min-width: 1100px) and (min-height: 640px)";

/* What was open on his phone, kept across a call that takes the screen (the
   table comes back when it ends, and iOS goes back to the app you were in). */
let lastOpen: AppId | null = null;
/**
 * Back to the home screen when the table returns: after a dark screen the
 * night moves on, and nothing arrives while the case file is open
 * (RAAKH-V3 §6, PG-DARK).
 */
export function putAppsAway(): void {
  lastOpen = null;
}
/** Your phone's news already said at its edge, kept across a call or a reload of the table, so it's said once. */
let lastTold: string | undefined;
let lastFired = 0;

/** Whether the table is wide enough for the notebook. */
function useWide(): boolean {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(NOTEBOOK);
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return wide;
}

type Banner = { app: AppId; from: string; text: string; icon?: AppId };

export default function Table({
  story,
  meta,
  state,
  replay,
  review = false,
}: {
  story: Story;
  meta: CaseMeta;
  state: CaseState;
  /** Finished before: the chain is counted live, so eleven of eleven is a goal. */
  replay?: boolean;
  /** Looking again, after the end: nothing happens on the phone any more. */
  review?: boolean;
}) {
  const now = useNow(60_000);
  const [openApp, setOpenAppHere] = useState<AppId | null>(() => lastOpen);
  const setOpenApp = (app: AppId | null) => {
    lastOpen = app;
    setOpenAppHere(app);
  };
  const wide = useWide();
  const detective = has(state, DETECTIVE);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [holding, setHolding] = useState(false);
  const clock = clockNow(story, state, now);
  // The train you're on, under everything, while the phone is in your hands (Last Local).
  useBed(story.ambience === "train" && !review ? TRAIN_UNDER : undefined, true);
  // What your phone would show on its lock screen, and whether its edge lights.
  // RAAKH has no phone of yours (2026-10-23): Instagram and the case file took its jobs.
  const hasYours = Boolean(story.yours);
  const yoursNews = hasYours ? newsOnYours(story, state) : undefined;
  const fresh = Boolean(yoursNews);
  const unread = hasYours ? yourUnread(story, state) : 0;
  /* On a phone-sized screen yours is only its edge, so whatever lands on it
     is said there, once each: a note that slides out from the edge. */
  const newsKey = yoursNews && `${yoursNews}|${yourMessages(story, state)}`;
  const [told, setToldHere] = useState<string | undefined>(() => lastTold);
  const setTold = (key: string | undefined) => {
    lastTold = key;
    setToldHere(key);
  };
  /* Not over his lock screen in the first second, and not over an app he's
     reading: said on his home screen, where it can't pass for one of his. */
  const telling = newsKey && newsKey !== told && !holding && has(state, "did:past-lock") && !openApp ? newsKey : undefined;
  useEffect(() => {
    if (!telling) return undefined;
    const t = window.setTimeout(() => setTold(telling), 6000);
    return () => window.clearTimeout(t);
  }, [telling]);
  const pickUp = () => {
    setTold(newsKey);
    setHolding(true);
  };

  // Every app's code, fetched once the phone is on screen and nothing else is going on.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
    idle(() => preloadApps());
  }, []);

  /* Live events: anything the story says is due, once whatever it waits for
     is true: a message, a missed call, the phone beginning to die. */
  const next = dueEvents(story, state)[0];
  /* A quiet event waits while the player is reading something. Every turn of
     the night waits while they're writing in the case file: nobody files and
     reads a banner at once, and nothing ends an episode under someone filing. */
  const held = review || Boolean(next && ((next.quiet && (openApp || holding)) || openApp === "casefile"));
  useEffect(() => {
    if (!next || held) return undefined;
    // One at a time: never two of the night's turns on top of each other.
    const wait = Math.max((next.delay ?? 0) * 1000, GAP_MS - (Date.now() - lastFired));
    const t = window.setTimeout(
      () => {
        const s = readProgress();
        if (!s) return;
        lastFired = Date.now();
        save(fire(story, s, next.id, Date.now()));
        // Arrived while nobody was looking: into the list, no banner.
        // On the lock screen it lands in the list; it doesn't pop again after unlocking.
        // Your own phone's news is said at its edge (`yoursNews`), never on his screen.
        if (next.banner && !next.at && next.device === "owner" && s.flags.includes("did:past-lock")) {
          setBanner({ app: next.app, from: bannerFrom(next.banner), text: bannerText(next.banner), icon: next.icon });
        }
      },
      wait,
    );
    return () => window.clearTimeout(t);
  }, [next, held, story]);

  /* Forty-five seconds with nothing new found, and the case file says where
     to look. Once per question, never counted as a hint (PLAYER-JOURNEY
     Stage 4): being lost is not held against anybody. */
  const q = openQuestion(story, state);
  const qid = q?.id;
  // A detective asked to be left alone.
  const nudgeDone = !q || detective || review || has(state, `fired:nudge-${q.id}`);
  const nudgeText = q ? `${q.ask} Look in ${whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}.` : "";
  const progress = state.flags.length;
  // Never inside the case file itself: the question there already says where to look.
  const inCaseFile = openApp === "casefile";
  useEffect(() => {
    if (!qid || nudgeDone || inCaseFile) return undefined;
    const t = window.setTimeout(() => {
      flag(`fired:nudge-${qid}`);
      nudged(qid);
      setBanner({ app: "casefile", from: "Case file", text: nudgeText });
    }, NUDGE_MS);
    return () => window.clearTimeout(t);
  }, [qid, nudgeDone, nudgeText, progress, inCaseFile]);

  const dismissBanner = useCallback(() => setBanner(null), []);

  /* Found by looking rather than by opening: a zoom into a face, a clip
     restored from the bin; and since 2026-10-02 anything found at all. Say
     so, once, quietly, so the player knows it counted (PLAYTEST.md #28). */
  const manual = `${episodeOf(state)}|${caseFile(story, state)
    .map((e) => e.id)
    .join(",")}`;
  const knownManual = useRef(manual);
  useEffect(() => {
    const [wasIn, was] = knownManual.current.split("|");
    const [nowIn, ids] = manual.split("|");
    knownManual.current = manual;
    // A new episode files what was read before it could count, all at once: nothing to say about that.
    if (wasIn !== nowIn) return undefined;
    // No case file, nothing to note in it: the story is played on the phone (Last Local).
    if (story.caseFile === false) return undefined;
    const before = new Set(was.split(","));
    /* Everything that just counted, not only what was found by looking (the
       2026-10-02 stress test: opening Settings counted the Apple Account and
       nothing said so, so players couldn't tell what to put on the table). */
    const fresh = story.evidence.filter((e) => ids.split(",").includes(e.id) && !before.has(e.id));
    if (!fresh.length) return undefined;
    const text = fresh.length === 1 ? `Noted: ${fresh[0].label}` : `Noted ${fresh.length}: ${fresh.map((e) => e.label).join(" · ")}`;
    const t = window.setTimeout(() => setBanner({ app: "casefile", from: "Case file", text }), 350);
    return () => window.clearTimeout(t);
  }, [manual, story]);

  const onOpenApp = (app: AppId, from?: DOMRect) => {
    // Where the tap landed, relative to the screen, so the app zooms out of it.
    const screen = document.querySelector(`.${phoneStyles.screen}`)?.getBoundingClientRect();
    setOrigin(from && screen ? { x: from.left - screen.left, y: from.top - screen.top, w: from.width, h: from.height } : null);
    setOpenApp(app);
    setBanner(null);
    const s = readProgress();
    // Opening the app that holds something is how it gets found. What has to
    // be looked for rather than opened stays hidden until it is. When it was
    // first opened clears what its icon was carrying (missed calls).
    if (s) {
      const found = findIn(story, s, app);
      save(found.at[`opened:${app}`] ? found : { ...found, at: { ...found.at, [`opened:${app}`]: Date.now() } });
    }
  };

  // An offloaded app, downloaded again from its icon. Stable, as Home waits on it.
  const onInstall = useCallback((app: AppId) => flag(installed(app)), []);

  /* When a notification came, as iOS lists it: "now", then minutes ago, then
     the time it came, on the story's clock. */
  const cameAt = (id: string): string => {
    const ago = minutesSince(story, state, id, now);
    const when = state.at[`event:${id}`];
    if (ago === undefined || when === undefined || ago < 1) return "now";
    if (ago < 60) return `${ago}m ago`;
    // On a chapter whose clock moves by beats, the time it came is its own clock, never wall time.
    const at = story.beats ? eventClock(story, state, id) : undefined;
    return stamp(at ?? clockAt(story, state, when));
  };

  /* Everything that has arrived since the phone was opened, newest first,
     for Notification Centre and the lock screen, above what was waiting. */
  const arrived: Notice[] = story.events
    // His phone's notifications only: yours land on yours.
    .filter((e) => e.banner && e.device === "owner" && has(state, `fired:${e.id}`))
    .map((e) => ({
      key: e.id,
      app: e.app,
      icon: e.icon,
      from: bannerFrom(e.banner!),
      text: bannerText(e.banner!),
      time: e.at ? stamp(e.at) : cameAt(e.id),
    }))
    .reverse();
  const notices: Notice[] = [...arrived, ...story.lockScreen];

  /* The battery falls with the beats and climbs on the charger; the chapter
     says how (`Clock.drain`, `Clock.charging`). The number is a clock the
     player can feel. */
  const percent = battery(story, state, now);
  const charging = onCharger(story, state);

  // The desk draws the phone at the battery the player left it on.
  useEffect(() => {
    const id = boundCase();
    if (id) noteBattery(id, percent);
  }, [percent]);

  return (
    <div className={phoneStyles.surface}>
      {!review && <RealClock story={story} state={state} />}
      {replay && story.chain.length > 0 && (
        <p className={phoneStyles.chainCount} aria-live="polite">
          {traced(story, state).length} of {story.chain.length} links
        </p>
      )}
      <div className={styles.table}>
        <Phone
          time={phoneClock(clock)}
          day={longDay(dayNow(story, state), dateNow(story, state))}
          battery={percent}
          charging={charging}
          wallpaper={meta.wallpaper}
          lock={
            has(state, "did:past-lock") ? undefined : (
              <LockScreen day={longDay(dayNow(story, state), dateNow(story, state))} clock={phoneClock(clock)} notes={notices} onOpen={(app) => {
                  flag("did:past-lock");
                  if (app) onOpenApp(app);
                }}
              />
            )
          }
          home={<Home story={story} state={state} onOpen={onOpenApp} onInstall={onInstall} covered={Boolean(openApp)} />}
          app={
            openApp ? (
              <AppView
                title={appLabel(story, openApp)}
                onBack={() => setOpenApp(null)}
                // Every app but the case file draws its own screens, each with its own bar.
                whole={openApp !== "casefile"}
              >
                <AppBody app={openApp} story={story} state={state} onHome={() => setOpenApp(null)} onOpen={(app) => onOpenApp(app)} />
              </AppView>
            ) : undefined
          }
          appKey={openApp ?? undefined}
          origin={origin}
          onCloseApp={() => setOpenApp(null)}
          // On the lock screen a notification lands in the list, never as a banner over it.
          banner={!banner || !has(state, "did:past-lock") ? null : { key: `${banner.app}-${banner.text}`, ...banner }}
          onBanner={() => banner && onOpenApp(banner.app)}
          onDismissBanner={dismissBanner}
          notices={notices}
          onNotice={(n) => onOpenApp(n.app)}
          airplane={offline(story, state)}
          airplaneToggles={story.airplaneToggles}
          onAirplane={() => (story.airplaneToggles ? toggleAirplane() : flag(AIRPLANE))}
        />

        {hasYours && (
          <div className={styles.yours}>
            <button type="button" className={styles.yoursButton} onClick={() => setHolding(true)} aria-label="Pick up your phone">
              <YourPhone time={phoneClock(clock)} day={dayNow(story, state)} news={yoursNews} />
            </button>
            <p className={styles.yoursNote}>Yours.</p>
          </div>
        )}

        {/* On a wide table, the case file lies beside the phones as a notebook:
            the evidence on his screen and the sentence in front of you at once. */}
        {wide && (
          <section className={styles.notebook} aria-label="Case file">
            <p className={styles.notebookHead}>Case file</p>
            <CaseFile story={story} state={state} save={save} />
          </section>
        )}
      </div>

      {/* On a phone-sized screen, yours is only its edge, at the side. */}
      {/* Slim while one of his apps is open, so it covers none of it. */}
      {hasYours && (
        <button
          type="button"
          className={styles.edge}
          data-new={fresh || undefined}
          data-slim={openApp ? "" : undefined}
          onClick={pickUp}
          aria-label={unread ? `Your phone: ${unread} unread` : fresh ? "Your phone: something new" : "Your phone"}
        >
          {unread > 0 && <span className={styles.edgeCount} aria-hidden="true">{unread}</span>}
        </button>
      )}
      {telling && yoursNews && (
        <button type="button" className={styles.edgeNote} onClick={pickUp}>
          <strong>Your phone</strong>
          <span>{yoursNews.split(" · ").join(": ")}</span>
        </button>
      )}

      {holding && <YourSheet story={story} state={state} time={phoneClock(clock)} onClose={() => setHolding(false)} />}
    </div>
  );
}
