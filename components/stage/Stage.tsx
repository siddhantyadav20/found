"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { useCase } from "@/components/found/StoryContext";
import LiveCall from "@/components/call/LiveCall";
import AppView from "@/components/her/AppView";
import Home from "@/components/her/Home";
import LockScreen from "@/components/her/LockScreen";
import Phone, { type Notice, type Origin } from "@/components/her/Phone";
import phoneStyles from "@/components/her/ios/Screen.module.css";
import YourPhone from "@/components/yours/Phone";
import type { AppId, CallCue, Flag } from "@/content/types";
import { nextCue } from "@/lib/game/call";
import {
  add,
  all,
  appLabel,
  battery,
  clockNow,
  dueEvents,
  expose,
  fire,
  has,
  newCase,
  openApp as findIn,
  see,
  type CaseState,
} from "@/lib/game/engine";
import { bindProgress, commit, readProgress, subscribeProgress } from "@/lib/found/progress";
import { track } from "@/lib/found/track";
import Chat from "@/components/her/apps/Chat";
import HerNotes from "@/components/her/apps/Notes";
import HerMessages from "@/components/her/apps/Messages";
import HerNews from "@/components/her/apps/News";
import HerPhotos from "@/components/her/apps/Photos";
import PikDrop from "@/components/her/apps/PikDrop";
import Safari from "@/components/her/apps/Safari";
import Recents from "@/components/her/apps/Recents";
import Instagram from "@/components/her/apps/Instagram";
import HerSettings from "@/components/her/apps/Settings";
import CaseFile from "./CaseFile";
import Charge from "./Charge";
import Choice from "./Choice";
import Morning from "./Morning";
import Ringing from "./Ringing";
import SeenByThem from "./SeenByThem";
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

/** A banner is written as "Who · what", the way a phone shows one. */
const bannerFrom = (banner: string) => banner.split(" · ")[0];
const bannerText = (banner: string) => banner.split(" · ").slice(1).join(" · ");

/** How often he says something while nothing else is happening. */
const IDLE_MS = 11_000;

export default function Stage() {
  const { id, story, meta, to, minutes, via } = useCase();
  bindProgress(id);

  const state = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const [now, setNow] = useState(() => Date.now());
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  /* The call fills the screen when it arrives, and once the player has put
     it down it stays down across a reload: resume lands where they were. */
  const [expanded, setExpanded] = useState(() => !readProgress()?.flags.includes("did:minimised"));
  const [muted, setMuted] = useState(true);
  const [idleTurn, setIdleTurn] = useState(0);
  const [banner, setBanner] = useState<{ app: AppId; from: string; text: string } | null>(null);
  const [declined, setDeclined] = useState(0);
  const [origin, setOrigin] = useState<Origin | null>(null);

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

  /** Saying something: what it sets, and what it hands over. */
  const say = (option: { sets?: readonly Flag[]; exposes?: string }) => {
    const now = readProgress();
    if (!now) return;
    let next = add(now, ...(option.sets ?? []));
    if (option.exposes) next = expose(story, next, option.exposes);
    save(next);
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

  /* Live events: anything the story says is due, once whatever it waits for
     is true. The news alert at 1:11, "Good morning, #9." at the end of
     Episode 2, and whatever P7 adds. */
  const due = state ? dueEvents(story, state) : [];
  const next = due[0];
  useEffect(() => {
    if (!next) return undefined;
    const t = window.setTimeout(
      () => {
        const now = readProgress();
        if (!now) return;
        save(fire(story, now, next.id));
        if (next.banner) setBanner({ app: next.app, from: bannerFrom(next.banner), text: bannerText(next.banner) });
        setExpanded(false);
      },
      (next.delay ?? 0) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [next, story, save]);

  /* A call that arrives on its own: her son at 1:34, the Crime Branch at
     10:30. A declined call that insists comes back. */
  const ringing = state
    ? story.incoming.find((c) => all(state, c.after) && !has(state, `did:done-${c.id}`))
    : undefined;
  const isRinging = Boolean(ringing && (ringing.insists || declined === 0));

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

  /* The end of Episode 2. They have watched every tap since 1:11, and now
     they say so. One line, at reading speed, and then the screen goes out on
     its own: no button, nothing to answer (PLAYER-JOURNEY Stage 6). */
  if (has(state, "did:seen-by-them") && !has(state, "did:ep2-done"))
    return <SeenByThem onDone={() => flag("did:ep2-done")} />;

  /* The night ends. Sunlight, a warm phone, and the only good thing that
     happens in the whole chapter waiting in her messages. */
  if (has(state, "did:ep2-done") && !has(state, "did:woke"))
    return <Morning story={story} elapsedMs={elapsed} onUp={() => flag("did:woke")} />;

  /* Everything has been asked. Three rows, and a call still running. */
  if (has(state, "did:choice")) return <Choice story={story} state={state} />;

  if (ringing && isRinging)
    return (
      <Ringing
        call={ringing}
        state={state}
        answered={has(state, `did:answered-${ringing.id}`)}
        onAnswer={() => flag(`did:answered-${ringing.id}`, ...((ringing.sets ?? []) as Flag[]))}
        onDecline={() => setDeclined((n) => n + 1)}
        onSay={(option) => {
          say(option);
          flag(`did:done-${ringing.id}`);
        }}
      />
    );

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

  /* What is waiting on her lock screen at 1:11, and everything that has
     arrived since, for Notification Centre. */
  const waiting: Notice[] = [
    { key: "nikhil", app: "phone", from: "Nikhil ❤️", text: "Missed call", time: "11:58 PM" },
    { key: "society", app: "whatsapp", from: "Shanti Kunj CHS", text: "Secretary: Please koi kuch forward mat karo.", time: "1:04 AM" },
    { key: "cb", app: "whatsapp", from: "Mumbai Crime Branch", text: "Do din nahi hain, madam.", time: "Fri" },
  ];
  const arrived: Notice[] = story.events
    .filter((e) => e.banner && has(state, `fired:${e.id}`))
    .map((e) => ({ key: e.id, app: e.app, from: bannerFrom(e.banner!), text: bannerText(e.banner!), time: "now" }))
    .reverse();
  const notices = [...arrived, ...waiting];

  const pastLock = has(state, "did:past-lock");

  const call = !cut ? (
    <LiveCall
      story={story}
      mumbaiTime={mumbai}
      elapsedMs={elapsed}
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
      reply={story.callReplies.find(
        (r) => all(state, r.requires) && !r.options.some((o) => o.sets?.some((f) => has(state, f))),
      )}
      onSay={say}
    />
  ) : null;

  return (
    <div className={phoneStyles.surface}>
      <div className={styles.table}>
        <Phone
          time={mumbai}
          day={story.clocks[0].day}
          battery={percent(state)}
          wallpaper={meta.wallpaper}
          recording
          lock={
            pastLock ? undefined : (
              <LockScreen day={story.clocks[0].day} clock={mumbai} notes={notices} onOpen={() => flag("did:past-lock")} />
            )
          }
          home={<Home story={story} state={state} onOpen={onOpenApp} covered={Boolean(openApp)} />}
          app={
            openApp ? (
              <AppView
                title={appLabel(story, openApp)}
                onBack={() => setOpenApp(null)}
                bare={openApp === "whatsapp" || openApp === "instagram"}
                own={openApp === "messages"}
                whole={openApp === "photos"}
              >
                <AppBody app={openApp} story={story} state={state} save={save} onHome={() => setOpenApp(null)} />
              </AppView>
            ) : undefined
          }
          appKey={openApp ?? undefined}
          origin={origin}
          onCloseApp={() => setOpenApp(null)}
          banner={expanded || !banner ? null : { key: `${banner.app}-${banner.text}`, ...banner }}
          onBanner={() => banner && onOpenApp(banner.app)}
          onDismissBanner={() => setBanner(null)}
          notices={notices}
          onNotice={(n) => onOpenApp(n.app)}
          overlay={call}
        />

        <div className={styles.yours}>
          <YourPhone time={mumbai} day={story.clocks[0].day} />
          <p className={styles.yoursNote}>Yours. It stays quiet until 10:30.</p>
        </div>
      </div>
    </div>
  );
}

/** What each app shows. Only the opening's screens are real (ROADMAP.md P4). */
function AppBody({
  app,
  story,
  state,
  save,
  onHome,
}: {
  app: AppId;
  onHome: () => void;
  story: ReturnType<typeof useCase>["story"];
  state: CaseState;
  save: (next: CaseState) => void;
}) {
  const read = (ids: readonly string[]) => {
    const now = readProgress();
    if (now) save(ids.reduce((acc, id) => see(story, acc, id), now));
  };

  if (app === "casefile") return <CaseFile story={story} state={state} save={save} />;
  const say = (option: Parameters<NonNullable<Parameters<typeof Chat>[0]["onSay"]>>[0]) => {
    const now = readProgress();
    if (!now) return;
    let next = add(now, ...(option.sets ?? []));
    if (option.exposes) next = expose(story, next, option.exposes);
    save(next);
  };

  if (app === "instagram") return <Instagram story={story} state={state} onRead={read} onSay={say} />;

  if (app === "messages") return <HerMessages story={story} state={state} onRead={read} />;

  if (app === "whatsapp")
    return (
      <>
        <Chat
          story={story}
          state={state}
          app={app}
          onRead={read}
          onSay={say}
        />
      </>
    );
  if (app === "phone") return <Recents story={story} state={state} onRead={read} />;
  if (app === "photos")
    return (
      <HerPhotos
        story={story}
        state={state}
        onBack={onHome}
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
  if (app === "settings")
    return (
      <HerSettings
        story={story}
        state={state}
        onAct={(sets) => {
          const now = readProgress();
          if (now) save(add(now, ...sets));
        }}
      />
    );
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
