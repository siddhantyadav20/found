"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { useCase } from "@/components/found/StoryContext";
import LiveCall from "@/components/call/LiveCall";
import Phone from "@/components/her/Phone";
import YourPhone from "@/components/yours/Phone";
import type { AppId, CallCue, Flag } from "@/content/types";
import { nextCue } from "@/lib/game/call";
import { add, battery, clockNow, expose, has, newCase, openApp as findIn, type CaseState } from "@/lib/game/engine";
import { bindProgress, commit, readProgress, subscribeProgress } from "@/lib/found/progress";
import { track } from "@/lib/found/track";
import CaseFile from "./CaseFile";
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
  const [banner, setBanner] = useState<{ app: AppId; text: string } | null>(null);

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
  const alerted = Boolean(state && state.flags.includes("fired:alert"));
  useEffect(() => {
    if (!turned || alerted) return undefined;
    const t = window.setTimeout(() => {
      const s = readProgress();
      if (!s) return;
      const ev = story.events.find((e) => e.id === "alert");
      save(add(s, "fired:alert", ...((ev?.sets ?? []) as Flag[])));
      setBanner({ app: "news", text: ev?.banner ?? "" });
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
          <Phone
            story={story}
            state={state}
            time={mumbai}
            battery={battery(story, state)}
            open={openApp}
            onOpen={onOpenApp}
            onBack={() => setOpenApp(null)}
            banner={expanded ? null : banner}
            onBanner={() => banner && onOpenApp(banner.app)}
          >
            {openApp && <AppBody app={openApp} story={story} state={state} save={save} />}
          </Phone>
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
  if (app === "casefile") return <CaseFile story={story} state={state} save={save} />;

  if (app === "news")
    return (
      <article className={styles.article}>
        <p className={styles.kicker}>City Desk · Mumbai · 1:11 AM</p>
        <h3 className={styles.headline}>
          Dadar: retired bank manager, 64, found dead below her building
        </h3>
        <p>
          The body of Vasundhara Kulkarni, 64, was found at the foot of Shanti Kunj CHS,
          Hindu Colony, shortly after midnight. A family member said she had been under
          &ldquo;digital arrest&rdquo; for 31 hours.
        </p>
        <p className={styles.small}>No other outlet is carrying this yet.</p>
      </article>
    );

  if (app === "settings")
    return (
      <ul className={styles.rows}>
        <li>
          <b>Vasundhara Kulkarni</b>
          <span>vasu.kulkarni1962@gmail.com</span>
        </li>
        <li>
          <b>Screen lock</b>
          <span>Off · turned off Thursday 8:10 PM</span>
        </li>
        <li>
          <b>Font size</b>
          <span>Largest</span>
        </li>
        <li>
          <b>Battery</b>
          <span>{battery(story, state)}% · power saving off</span>
        </li>
      </ul>
    );

  return (
    <p className={styles.soon}>
      {story.hersHome.find((a) => a.app === app)?.label} is built in P4. Everything she kept
      in here — the chats, the diary, the courier, the spyware — arrives with it.
    </p>
  );
}
