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
  dayNow,
  dueEvents,
  fire,
  has,
  minutesSince,
  openApp as findIn,
  openQuestion,
  traced,
  whereToLook,
  type CaseState,
} from "@/lib/game/engine";
import { AIRPLANE } from "@/lib/game/phone";
import { hasRecord, SAW_RECORD, somethingNew, yourMessages } from "@/lib/game/yours";
import { useNow } from "@/lib/found/now";
import { phoneClock, stamp } from "@/lib/found/time";
import { boundCase, readProgress } from "@/lib/found/progress";
import { noteBattery } from "@/lib/found/shelf";
import AppBody from "./AppBody";
import { flag, nudged, save } from "./playthrough";
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

type Banner = { app: AppId; from: string; text: string; icon?: AppId };

export default function Table({
  story,
  meta,
  state,
  replay,
}: {
  story: Story;
  meta: CaseMeta;
  state: CaseState;
  /** Finished before: the chain is counted live, so eleven of eleven is a goal. */
  replay?: boolean;
}) {
  const now = useNow(60_000);
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [holding, setHolding] = useState(false);
  const clock = clockNow(story, state, now);
  // What your phone would show on its lock screen, and whether its edge lights.
  const fresh = somethingNew(story, state);
  const yoursNews = !fresh
    ? undefined
    : hasRecord(story, state) && !has(state, SAW_RECORD)
      ? `${story.yours.social} · Your draft is saved.`
      : "Messages · New message";
  /* On a phone-sized screen yours is only its edge, so whatever lands on it
     is said there, once each: a note that slides out from the edge. */
  const newsKey = yoursNews && `${yoursNews}|${yourMessages(story, state)}`;
  const [told, setTold] = useState<string | undefined>(undefined);
  const telling = newsKey && newsKey !== told && !holding ? newsKey : undefined;
  useEffect(() => {
    if (!telling) return undefined;
    const t = window.setTimeout(() => setTold(telling), 6000);
    return () => window.clearTimeout(t);
  }, [telling]);
  const pickUp = () => {
    setTold(newsKey);
    setHolding(true);
  };

  /* Live events: anything the story says is due, once whatever it waits for
     is true: a message, a missed call, the phone beginning to die. */
  const next = dueEvents(story, state)[0];
  // A quiet event waits while the player is reading something.
  const held = Boolean(next?.quiet && (openApp || holding));
  useEffect(() => {
    if (!next || held) return undefined;
    const t = window.setTimeout(
      () => {
        const s = readProgress();
        if (!s) return;
        save(fire(story, s, next.id, Date.now()));
        // Arrived while nobody was looking: into the list, no banner.
        // On the lock screen it lands in the list; it doesn't pop again after unlocking.
        if (next.banner && !next.at && s.flags.includes("did:past-lock")) {
          setBanner({ app: next.app, from: bannerFrom(next.banner), text: bannerText(next.banner), icon: next.icon });
        }
      },
      (next.delay ?? 0) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [next, held, story]);

  /* Forty-five seconds with nothing new found, and the case file says where
     to look. Once per question, never counted as a hint (PLAYER-JOURNEY
     Stage 4): being lost is not held against anybody. */
  const q = openQuestion(story, state);
  const qid = q?.id;
  const nudgeDone = !q || has(state, `fired:nudge-${q.id}`);
  const nudgeText = q ? `${q.ask} Look in ${whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}.` : "";
  const progress = state.flags.length;
  useEffect(() => {
    if (!qid || nudgeDone) return undefined;
    const t = window.setTimeout(() => {
      flag(`fired:nudge-${qid}`);
      nudged(qid);
      setBanner({ app: "casefile", from: "Case file", text: nudgeText });
    }, NUDGE_MS);
    return () => window.clearTimeout(t);
  }, [qid, nudgeDone, nudgeText, progress]);

  const dismissBanner = useCallback(() => setBanner(null), []);

  /* Found by looking rather than by opening: a zoom into a face, a clip
     restored from the bin. Say so, once, quietly, so the player knows it
     counted (PLAYTEST.md #28). */
  const manual = caseFile(story, state)
    .filter((e) => e.manual)
    .map((e) => e.id)
    .join(",");
  const knownManual = useRef(manual);
  useEffect(() => {
    const before = new Set(knownManual.current.split(","));
    knownManual.current = manual;
    const fresh = story.evidence.find((e) => manual.split(",").includes(e.id) && !before.has(e.id));
    if (!fresh) return undefined;
    const t = window.setTimeout(() => setBanner({ app: "casefile", from: "Case file", text: `Noted: ${fresh.label}` }), 350);
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
    // be looked for rather than opened stays hidden until it is.
    if (s) save(findIn(story, s, app));
  };

  /* When a notification came, as iOS lists it: "now", then minutes ago, then
     the time it came, on the story's clock. */
  const cameAt = (id: string): string => {
    const ago = minutesSince(story, state, id, now);
    const when = state.at[`event:${id}`];
    if (ago === undefined || when === undefined || ago < 1) return "now";
    return ago < 60 ? `${ago}m ago` : stamp(clockAt(story, state, when));
  };

  /* Everything that has arrived since the phone was opened, newest first,
     for Notification Centre and the lock screen, above what was waiting. */
  const arrived: Notice[] = story.events
    .filter((e) => e.banner && has(state, `fired:${e.id}`))
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
      {replay && (
        <p className={phoneStyles.chainCount} aria-live="polite">
          {traced(story, state).length} of {story.chain.length} links
        </p>
      )}
      <div className={styles.table}>
        <Phone
          time={phoneClock(clock)}
          day={dayNow(story, state)}
          battery={percent}
          charging={charging}
          wallpaper={meta.wallpaper}
          lock={
            has(state, "did:past-lock") ? undefined : (
              <LockScreen day={dayNow(story, state)} clock={phoneClock(clock)} notes={notices} onOpen={() => flag("did:past-lock")} />
            )
          }
          home={<Home story={story} state={state} onOpen={onOpenApp} covered={Boolean(openApp)} />}
          app={
            openApp ? (
              <AppView
                title={appLabel(story, openApp)}
                onBack={() => setOpenApp(null)}
                own={openApp === "messages" || openApp === "voicememos" || openApp === "mail" || openApp === "paytap"}
                whole={openApp === "photos" || openApp === "whatsapp" || openApp === "instagram"}
              >
                <AppBody app={openApp} story={story} state={state} onHome={() => setOpenApp(null)} />
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
          airplane={has(state, AIRPLANE)}
          onAirplane={() => flag(AIRPLANE)}
        />

        <div className={styles.yours}>
          <button type="button" className={styles.yoursButton} onClick={() => setHolding(true)} aria-label="Pick up your phone">
            <YourPhone time={phoneClock(clock)} day={dayNow(story, state)} news={yoursNews} />
          </button>
          <p className={styles.yoursNote}>Yours.</p>
        </div>
      </div>

      {/* On a phone-sized screen, yours is only its edge, at the side. */}
      <button type="button" className={styles.edge} data-new={fresh || undefined} onClick={pickUp} aria-label={fresh ? "Your phone: something new" : "Your phone"} />
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
