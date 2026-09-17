"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { useCase } from "@/components/found/StoryContext";
import LiveCall from "@/components/call/LiveCall";
import AppView from "@/components/her/AppView";
import Home from "@/components/her/Home";
import Screen from "@/components/her/Screen";
import YourPhone from "@/components/yours/Phone";
import type { AppId, CallCue, Flag } from "@/content/types";
import { nextCue } from "@/lib/game/call";
import { add, appLabel, battery, clockNow, expose, has, newCase, openApp as findIn, see, type CaseState } from "@/lib/game/engine";
import { bindProgress, commit, readProgress, subscribeProgress } from "@/lib/found/progress";
import { track } from "@/lib/found/track";
import Chat from "@/components/her/apps/Chat";
import HerNotes from "@/components/her/apps/Notes";
import HerNews from "@/components/her/apps/News";
import HerPhotos from "@/components/her/apps/Photos";
import PikDrop from "@/components/her/apps/PikDrop";
import Safari from "@/components/her/apps/Safari";
import Recents from "@/components/her/apps/Recents";
import HerSettings from "@/components/her/apps/Settings";
import CaseFile from "./CaseFile";
import Charge from "./Charge";
import InAppGuard from "./InAppGuard";
import Note from "./Note";
import Pouch from "./Pouch";
import styles from "./Stage.module.css";

/* ===========================================================================
   The stage: the pouch, then two phones and a call that won't end.

   It owns the playthrough — the save, the story's clock, which app is open
   and what he is saying — and hands each piece to something that only knows
   how to draw itself. Everything decidable without a DOM lives in
   `lib/game` (ROADMAP.md P1, P2).

   Episodes 2 and 3 are not here yet. The opening plays: the pouch, the note,
   the call, her home screen, the first notification and the first question.
   =========================================================================== */

/** How often he says something while nothing else is happening. */
const IDLE_MS = 11_000;
/** The news alert lands a beat after the player has the home screen. */
const ALERT_MS = 8_000;

export default function Stage() {
  const { id, story, meta, to, minutes, via } = useCase();
  bindProgress(id);

  const state = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const [now, setNow] = useState(() => Date.now());
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [muted, setMuted] = useState(true);
  const [idleTurn, setIdleTurn] = useState(0);
  const [banner, setBanner] = useState<{ app: AppId; from: string; text: string } | null>(null);

  /* Resume lands on the screen the player left, so the save decides where they
     are, never component state (PLAYER-JOURNEY Stage 5). */
  const turned = Boolean(state && has(state, "did:unlock"));

  /* The story's clock. It ticks while the tab is open and catches up when it
     isn't: the timer on the call is the one thing that must never look paused. */
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setIdleTurn((n) => n + 1), IDLE_MS);
    return () => window.clearInterval(t);
  }, []);

  const save = useCallback((next: CaseState) => commit(next), []);
  const flag = useCallback(
    (...flags: Flag[]) => {
      const s = readProgress();
      if (s) save(add(s, ...flags));
    },
    [save],
  );

  const open = () => {
    const fresh = newCase(Math.random().toString(36).slice(2, 10), Date.now(), via);
    save(add(fresh, "did:opened"));
    track({ case: id, event: "open", via });
  };

  /* The phone has no screen lock: she was told to turn it off on Thursday,
     and she did, because that is what the call told her to do. */
  const turnOver = () => {
    flag("did:unlock", "saw:note", "saw:call");
    track({ case: id, event: "unlock", via });
  };

  /* Her battery, falling with the beats rather than with a timer: 7% while
     the power bank still has something in it, 5% once the player knows she
     knew, 4% when it dies. The number is a clock the player can feel. */
  const percent = (s: CaseState): number =>
    has(s, "did:bank-dead") ? 4 : has(s, "did:she-knew") ? 5 : battery(story, s);

  const elapsed = state ? now - state.started : 0;
  const mumbai = state ? clockNow(story, state, now) : story.clocks[0].base;

  const cut = Boolean(state && has(state, "did:cut-early"));

  /* A line he has already delivered is remembered in the save, so coming back
     to the tab doesn't make him say it again. */
  const spoken = useMemo(
    () => (state ? state.flags.filter((f) => f.startsWith("fired:cue-")).map((f) => f.slice(10)) : []),
    [state],
  );

  const cue: CallCue | null = useMemo(
    () => (state && !cut ? nextCue(story, state, spoken, idleTurn) : null),
    [state, cut, story, spoken, idleTurn],
  );

  /* A line he has just delivered doesn't come round again; the idle loop does. */
  useEffect(() => {
    if (cue && cue.when !== "idle" && !spoken.includes(cue.id)) {
      const t = window.setTimeout(() => flag(`fired:cue-${cue.id}`), 4200);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [cue, spoken, flag]);

  /* The one live event the opening has: the alert that tells the player she
     is dead, five and a half hours before any newsroom knows it. */
  /* The last beat of Episode 1: the power bank's light goes out a few seconds
     after the player works out where he really is. */
  const placed = Boolean(state && has(state, "did:placed-him"));
  const bankDead = Boolean(state && has(state, "did:bank-dead"));
  useEffect(() => {
    if (!placed || bankDead) return undefined;
    const t = window.setTimeout(() => {
      flag("did:bank-dead");
      setExpanded(true);
    }, 6000);
    return () => window.clearTimeout(t);
  }, [placed, bankDead, flag]);

  const alerted = Boolean(state && state.flags.includes("fired:alert"));
  useEffect(() => {
    if (!turned || alerted) return undefined;
    const t = window.setTimeout(() => {
      const s = readProgress();
      if (!s) return;
      const ev = story.events.find((e) => e.id === "alert");
      save(add(s, "fired:alert", ...((ev?.sets ?? []) as Flag[])));
      setBanner({ app: "news", from: "City Desk", text: ev?.banner ?? "" });
      setExpanded(false);
    }, ALERT_MS);
    return () => window.clearTimeout(t);
    // Deliberately keyed on the two things that decide it, not on the whole
    // save: anything else changing must not restart the clock on the alert.
  }, [turned, alerted, story.events, save]);

  if (!state) {
    return (
      <div className={styles.stage}>
        <p className={styles.eyebrow}>
          {story.title} · Episode 1 · {story.episodes[0]}
        </p>
        <Pouch meta={meta} to={to} minutes={minutes} onOpen={open} />
        <InAppGuard />
      </div>
    );
  }

  if (!turned) return <Note onTurn={turnOver} />;

  /* The power bank is out, he has asked the dark whether she is still there,
     and only then is the player given one thing to do with their hands. The
     gate waits for that line: it is the last thing in the episode, and it is
     the reason anybody goes looking for a cable. */
  if (has(state, "fired:cue-still-there") && !has(state, "did:charged"))
    return <Charge onPlugged={() => flag("did:charged")} />;

  if (has(state, "did:charged"))
    return (
      <div className={styles.building}>
        <p className={styles.eyebrow}>Episode 1 · Call Mat Kaatna</p>
        <p>
          Her phone is charging. The call is still running, and the man on it still does not
          know she is dead.
        </p>
        <p className={styles.minutes}>
          Episode 2, &ldquo;Delete for Everyone&rdquo;, is written in CHAPTER1.md and arrives
          with P6: how she died, the girl whose account took the money, the list with your
          address on it, and the note you have been obeying since 1:11 AM.
        </p>
      </div>
    );

  const onOpenApp = (app: AppId) => {
    setOpenApp(app);
    setBanner(null);
    const s = readProgress();
    // Opening the app that holds something is how it gets found. What has to
    // be looked for rather than opened stays hidden until it is.
    if (s) save(findIn(story, s, app));
  };

  return (
    <div className={styles.stage} data-playing>
      <div className={styles.table}>
        <div className={styles.hers}>
          <Screen
            time={mumbai}
            battery={percent(state)}
            wallpaper={meta.wallpaper}
            recording
            banner={expanded ? null : banner}
            onBanner={() => banner && onOpenApp(banner.app)}
          >
            <Home story={story} state={state} onOpen={onOpenApp} covered={Boolean(openApp)} />
            {openApp && (
              <AppView
                title={appLabel(story, openApp)}
                onBack={() => setOpenApp(null)}
                bare={openApp === "whatsapp" || openApp === "messages" || openApp === "instagram"}
              >
                <AppBody app={openApp} story={story} state={state} save={save} />
              </AppView>
            )}
          </Screen>
        </div>
        <div className={styles.yours}>
          <YourPhone time={mumbai} />
          <p className={styles.yoursNote}>Yours. It stays quiet until 10:30.</p>
        </div>
      </div>

      {!cut ? (
        <LiveCall
          story={story}
          mumbaiTime={mumbai}
          elapsedMs={elapsed}
          cue={cue}
          expanded={expanded}
          muted={muted}
          onExpand={() => setExpanded(true)}
          onCollapse={() => setExpanded(false)}
          onReachEnd={() => flag("did:reach-for-end")}
          onCut={() => {
            flag("did:cut-early");
            track({ case: id, event: "cut:early", via });
          }}
          onUnmute={() => {
            if (!muted) return;
            setMuted(false);
            // They can hear the room now, and a voice is a thing they can keep.
            const s = readProgress();
            if (s) save(expose(story, add(s, "did:unmuted"), "voice"));
            track({ case: id, event: "voice:on", via });
          }}
          onReadClock={() => flag("saw:clock", "did:read-clock")}
          onReadLabel={() => flag("saw:burmese")}
        />
      ) : (
        <p className={styles.cutLine}>
          The call ended. The timer stopped at 31 hours. Somewhere, a man who needed it to
          keep running is explaining why it didn&apos;t.
        </p>
      )}

      {expanded && banner && (
        <button
          type="button"
          className={styles.overBanner}
          onClick={() => {
            setExpanded(false);
            onOpenApp("news");
          }}
        >
          {banner.text}
        </button>
      )}
    </div>
  );
}

/** What each app shows. Only the opening's screens are real (ROADMAP.md P4). */
function AppBody({
  app,
  story,
  state,
  save,
}: {
  app: AppId;
  story: ReturnType<typeof useCase>["story"];
  state: CaseState;
  save: (next: CaseState) => void;
}) {
  const read = (ids: readonly string[]) => {
    const now = readProgress();
    if (now) save(ids.reduce((acc, id) => see(story, acc, id), now));
  };

  if (app === "casefile") return <CaseFile story={story} state={state} save={save} />;
  if (app === "whatsapp" || app === "messages" || app === "instagram")
    return <Chat story={story} state={state} app={app} onRead={read} />;
  if (app === "phone") return <Recents story={story} state={state} onRead={read} />;
  if (app === "photos")
    return (
      <HerPhotos
        story={story}
        state={state}
        onRead={read}
        onRestore={(id) => {
          const now = readProgress();
          if (now) save(add(now, `did:restored-${id}`));
        }}
      />
    );
  if (app === "notes")
    return (
      <HerNotes
        story={story}
        state={state}
        onRead={read}
        onPassword={() => {
          const now = readProgress();
          // They watched the keypad. She kept this from them for 31 hours.
          if (now) save(expose(story, add(now, "did:typed-password"), "pin"));
        }}
      />
    );
  if (app === "settings") return <HerSettings story={story} state={state} />;
  if (app === "pikdrop") return <PikDrop story={story} state={state} onRead={read} />;
  if (app === "safari") return <Safari story={story} state={state} onRead={read} />;
  if (app === "news") return <HerNews story={story} />;

  return (
    <p className={styles.soon}>
      {appLabel(story, app)} is built in P4. Everything she kept
      in here — the chats, the diary, the courier, the spyware — arrives with it.
    </p>
  );
}
