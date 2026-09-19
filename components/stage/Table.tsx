"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import LiveCall from "@/components/call/LiveCall";
import AppView from "@/components/her/AppView";
import Home from "@/components/her/Home";
import LockScreen from "@/components/her/LockScreen";
import Phone, { type Notice, type Origin } from "@/components/her/Phone";
import phoneStyles from "@/components/her/ios/Screen.module.css";
import YourPhone from "@/components/yours/Phone";
import type { CaseMeta } from "@/content/cases";
import type { AppId, CallCue, Story } from "@/content/types";
import { nextCue } from "@/lib/game/call";
import {
  all,
  appLabel,
  battery,
  caseFile,
  clockNow,
  dueEvents,
  episodeOf,
  episodeStart,
  fire,
  has,
  openApp as findIn,
  openQuestion,
  whereToLook,
  type CaseState,
} from "@/lib/game/engine";
import { useNow } from "@/lib/found/now";
import { phoneClock, stamp } from "@/lib/found/time";
import { ended } from "@/lib/found/tones";
import { boundCase, readProgress } from "@/lib/found/progress";
import { noteBattery } from "@/lib/found/shelf";
import AppBody from "./AppBody";
import { flag, give, nudged, save, say } from "./playthrough";
import styles from "./Stage.module.css";

/* ===========================================================================
   The table: her phone, yours beside it, and the call over hers.

   Everything the player does between the full-screen moments happens here:
   which app is open, what he is saying, what has just arrived. What is
   decided rather than drawn lives in `lib/game`; what is written goes
   through `playthrough`.

   It re-renders when the save changes and when the story's minute turns,
   never on the second: only the call's own timer does that.
   =========================================================================== */

/** A banner is written as "Who · what", the way a phone shows one. */
const bannerFrom = (banner: string) => banner.split(" · ")[0];
const bannerText = (banner: string) => banner.split(" · ").slice(1).join(" · ");

/** How often he says something while nothing else is happening. */
const IDLE_MS = 11_000;
/** How long a player can find nothing before the case file offers where to look. */
const NUDGE_MS = 45_000;

type Banner = { app: AppId; from: string; text: string; icon?: AppId };

/** What is waiting on her lock screen at 1:11, before anything arrives. */
const WAITING: Notice[] = [
  // He rang twice on Friday evening, and she let it ring (diary, page 5).
  { key: "nikhil", app: "phone", from: "Nikhil ❤️", text: "2 missed calls", time: "Fri" },
  { key: "society", app: "whatsapp", from: "Shanti Kunj CHS", text: "Secretary: Please koi kuch forward mat karo.", time: "1:04 AM" },
  { key: "cb", app: "whatsapp", from: "Mumbai Crime Branch", text: "Do din nahi hain, madam.", time: "Fri" },
];

export default function Table({
  story,
  meta,
  state,
  replay,
}: {
  story: Story;
  meta: CaseMeta;
  state: CaseState;
  /** Finished before: the ledger is counted live, and the first alert can be looked at closely. */
  replay?: boolean;
}) {
  const now = useNow(60_000);
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  /* The call fills the screen when it arrives, and once the player has put
     it down it stays down across a reload: resume lands where they were. */
  const [expanded, setExpanded] = useState(() => !has(state, "did:minimised"));
  const [idleTurn, setIdleTurn] = useState(0);
  const [banner, setBanner] = useState<Banner | null>(null);
  // Read by the events timer without restarting it every time the call moves.
  const expandedNow = useRef(expanded);
  useEffect(() => {
    expandedNow.current = expanded;
  }, [expanded]);

  // Cut by the player at 1:11, or ended by them once the profile is gone.
  const cut = has(state, "did:cut-early") || has(state, "did:they-hung-up");
  const muted = !has(state, "did:unmuted");
  const mumbai = clockNow(story, state, now);

  useEffect(() => {
    const t = window.setInterval(() => setIdleTurn((n) => n + 1), IDLE_MS);
    return () => window.clearInterval(t);
  }, []);

  /* A line he has already delivered is remembered in the save, so coming back
     to the tab doesn't make him say it again. */
  const spoken = useMemo(
    () => state.flags.filter((f) => f.startsWith("fired:cue-")).map((f) => f.slice(10)),
    [state],
  );
  const cue: CallCue | null = useMemo(
    () => (cut ? null : nextCue(story, state, spoken, idleTurn)),
    [state, cut, story, spoken, idleTurn],
  );

  /* A line he has just delivered doesn't come round again; the idle loop does. */
  useEffect(() => {
    if (cue && cue.when !== "idle" && !spoken.includes(cue.id)) {
      const t = window.setTimeout(() => flag(`fired:cue-${cue.id}`), 4200);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [cue, spoken]);

  /* Live events: anything the story says is due, once whatever it waits for
     is true. The news alert at 1:11, the power bank going out, "Good
     morning, #9." at the end of Episode 2. */
  const next = dueEvents(story, state)[0];
  useEffect(() => {
    if (!next) return undefined;
    const t = window.setTimeout(
      () => {
        const s = readProgress();
        if (!s) return;
        save(fire(story, s, next.id));
        // What happens next happens on the call: bring it back up.
        if (next.expands) setExpanded(true);
        // They hung up: the two falling tones of a call that's gone.
        if (next.sets?.includes("did:they-hung-up")) ended();
        // Arrived while nobody was looking: into the list, no banner.
        // On the lock screen it lands in the list; it doesn't pop again after unlocking.
        if (next.banner && !next.at && s.flags.includes("did:past-lock")) {
          setBanner({ app: next.app, from: bannerFrom(next.banner), text: bannerText(next.banner), icon: next.icon });
          // Put away by what arrived, and remembered that way across a reload.
          if (expandedNow.current) {
            setExpanded(false);
            flag("did:minimised");
          }
        }
      },
      (next.delay ?? 0) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [next, story]);

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

  /* Found by looking rather than by opening: a zoom into his clock, a page
     read in the bin, a note from Shaila. Say so, once, quietly, so the
     player knows it counted (PLAYTEST.md #28). */
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
    // Where the tap landed, relative to her screen, so the app zooms out of it.
    const screen = document.querySelector(`.${phoneStyles.screen}`)?.getBoundingClientRect();
    setOrigin(from && screen ? { x: from.left - screen.left, y: from.top - screen.top, w: from.width, h: from.height } : null);
    setOpenApp(app);
    setBanner(null);
    const s = readProgress();
    // Opening the app that holds something is how it gets found. What has to
    // be looked for rather than opened stays hidden until it is.
    if (s) save(findIn(story, s, app));
  };

  /* Everything that has arrived since 1:11, newest first, for Notification
     Centre and the lock screen. */
  const arrived: Notice[] = story.events
    .filter((e) => e.banner && has(state, `fired:${e.id}`))
    .map((e) => ({
      key: e.id,
      app: e.app,
      icon: e.icon,
      look: replay && e.id === "alert",
      from: bannerFrom(e.banner!),
      text: bannerText(e.banner!),
      time: e.at ? stamp(e.at) : "now",
    }))
    .reverse();
  const notices = [...arrived, ...WAITING];

  /* Her battery, falling with the beats rather than with a timer: 7% while
     the power bank still has something in it, 5% once the player knows she
     knew, 4% when it dies. The number is a clock the player can feel. */
  const episode = episodeOf(state);
  // Episode 2 is on the player's charger: from 4%, a point a minute. By
  // morning it has been charging all night (the story's own 61%).
  const charging = episode === 2;
  const percent =
    episode === 3
      ? battery(story, state)
      : episode === 2
        ? Math.min(100, 4 + Math.max(0, Math.floor((now - episodeStart(state)) / 60_000)))
        : has(state, "did:bank-dead")
          ? 4
          : has(state, "did:she-knew")
            ? 5
            : battery(story, state);

  // The desk draws her phone at the battery the player left it on.
  useEffect(() => {
    const id = boundCase();
    if (id) noteBattery(id, percent);
  }, [percent]);

  const call = cut ? null : (
    <LiveCall
      story={story}
      mumbaiTime={mumbai}
      state={state}
      cue={cue}
      expanded={expanded}
      muted={muted}
      onExpand={() => setExpanded(true)}
      onCollapse={() => {
        setExpanded(false);
        flag("did:minimised");
      }}
      onReachEnd={() => flag("did:reach-for-end")}
      onCut={() => {
        ended();
        flag("did:cut-early");
      }}
      // They can hear the room now, and a voice is a thing they can keep.
      onUnmute={() => give(story, "voice", "did:unmuted")}
      onReadClock={() => flag("saw:clock", "did:read-clock")}
      onReadLabel={() => flag("saw:burmese")}
      reply={story.callReplies.find(
        (r) => all(state, r.requires) && !r.options.some((o) => o.sets?.some((f) => has(state, f))),
      )}
      onSay={(o) => say(story, o)}
    />
  );

  return (
    <div className={phoneStyles.surface}>
      {/* A clean run is a goal once you know what they collect. */}
      {replay && (
        <p className={phoneStyles.ledgerCount} aria-live="polite">
          {state.ledger.length === 0 ? "They have nothing on you" : `They have ${state.ledger.length} on you`}
        </p>
      )}
      <div className={styles.table}>
        <Phone
          time={phoneClock(mumbai)}
          day={story.clocks[0].day}
          battery={percent}
          charging={charging}
          wallpaper={meta.wallpaper}
          recording={!has(state, "did:removed-profile")}
          lock={
            has(state, "did:past-lock") ? undefined : (
              <LockScreen day={story.clocks[0].day} clock={phoneClock(mumbai)} notes={notices} onOpen={() => flag("did:past-lock")} />
            )
          }
          home={<Home story={story} state={state} onOpen={onOpenApp} covered={Boolean(openApp)} />}
          app={
            openApp ? (
              <AppView
                title={appLabel(story, openApp)}
                onBack={() => setOpenApp(null)}
                own={openApp === "messages"}
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
          banner={expanded || !banner || !has(state, "did:past-lock") ? null : { key: `${banner.app}-${banner.text}`, ...banner }}
          onBanner={() => banner && onOpenApp(banner.app)}
          onDismissBanner={dismissBanner}
          notices={notices}
          onNotice={(n) => onOpenApp(n.app)}
          overlay={call}
        />

        <div className={styles.yours}>
          <YourPhone time={phoneClock(mumbai)} day={story.clocks[0].day} />
          <p className={styles.yoursNote}>
            {has(state, "did:arrested")
              ? "Yours. Still on a WhatsApp video call with them."
              : "Yours. It stays quiet until 10:30."}
          </p>
        </div>
      </div>
    </div>
  );
}
