"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { StorageWarning } from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import { add, episodeOf, has, newCase } from "@/lib/game/engine";
import { stamp } from "@/lib/found/time";
import {
  darkDone,
  DEATH_SEEN,
  DETECTIVE,
  REALTIME,
  momentDone,
  openerShown,
  PLUGGED_IN,
  recapShown,
  sceneOf,
  teaserShown,
  titleShown,
  UNOPENED,
} from "@/lib/game/scene";
import { chosen } from "@/lib/game/endings";
import { AWAY_MS } from "@/lib/found/keeping";
import { bindProgress, readProgress, subscribeProgress } from "@/lib/found/progress";
import { useReplay } from "@/lib/found/shelf";
import type { CaseId } from "@/content/cases";
import { track } from "@/lib/found/track";
import Charge from "./Charge";
import ColdOpen from "./ColdOpen";
import Moment from "./Moment";
import Seat from "./Seat";
import dynamic from "next/dynamic";
import Away from "./Away";
import InAppGuard from "./InAppGuard";
import Note from "./Note";
import Parcel from "./Parcel";
import Recap from "./Recap";
import Finale from "./Finale";
import Loader from "@/components/site/Loader";
import Ringing from "./Ringing";
import TitleCard from "./TitleCard";
import Previously from "./Previously";
import styles from "./v3/Screens.module.css";
import Table, { backToChat, putAppsAway } from "./Table";
import BeforeEnding from "./v3/BeforeEnding";
import DarkScreen from "./v3/DarkScreen";
import FoundSoFar from "./v3/FoundSoFar";
import PhoneDeath from "./v3/PhoneDeath";
import Reel from "./v3/Reel";
import RevealDirector from "./v3/RevealDirector";
import UnopenedScene from "./v3/UnopenedScene";
import { flag, save, sayAll } from "./playthrough";

/* ===========================================================================
   The stage: the parcel, then two phones on a table.

   It reads the save and decides which of the chapter's full-screen moments
   the player is in: the parcel, the note, the charger, a title card, a call
   ringing, the choice. Between them is the table, where the playing happens
   (`Table`). Resume lands on the right one because the save decides, never
   component state.
   =========================================================================== */

/* The cold open plays once a visit, before a first parcel (ROADMAP T1). */
const coldKey = (id: string) => `found:${id}:cold`;
const noSubscribe = () => () => {};
function seenCold(id: string): boolean {
  try {
    return sessionStorage.getItem(coldKey(id)) === "1";
  } catch {
    return false;
  }
}

/* The ending and its card: loaded only when a play gets there. */
const Aftermath = dynamic(() => import("./ending/Aftermath"), { ssr: false, loading: () => <Loader full label="The morning after" /> });
const EndCard = dynamic(() => import("./ending/EndCard"), { ssr: false, loading: () => <Loader full label="Closing the file" /> });
const LookAgain = dynamic(() => import("./ending/LookAgain"), { ssr: false });
/* Raakh v3 (RAAKH-V3 §11): the endings on a lock screen, the end card, Look again. */
const LockscreenEnding = dynamic(() => import("./v3/LockscreenEnding"), { ssr: false, loading: () => <Loader full label="The morning after" /> });
const EndCardV3 = dynamic(() => import("./v3/EndCardV3"), { ssr: false, loading: () => <Loader full label="Closing the file" /> });
const LookAgainV3 = dynamic(() => import("./v3/LookAgainV3"), { ssr: false });

/**
 * Where the player put the phone down (2026-10-29): the scene on screen when
 * the tab is hidden or closed, told to the funnel once per scene per visit,
 * so the insights page can say where people stop.
 */
function usePutDown(id: string, where: string) {
  const now = useRef(where);
  useEffect(() => {
    now.current = where;
  }, [where]);
  useEffect(() => {
    const told = new Set<string>();
    const tell = () => {
      if (document.visibilityState !== "hidden" || told.has(now.current)) return;
      told.add(now.current);
      track({ case: id, event: `left:${now.current}` });
    };
    document.addEventListener("visibilitychange", tell);
    window.addEventListener("pagehide", tell);
    return () => {
      document.removeEventListener("visibilitychange", tell);
      window.removeEventListener("pagehide", tell);
    };
  }, [id]);
}

export default function Stage() {
  const { id, story, meta, to, minutes, via } = useCase();
  bindProgress(id);

  const state = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const replay = useReplay(id as CaseId);

  const scene = sceneOf(story, state);
  const coldSeen = useSyncExternalStore(noSubscribe, () => seenCold(id), () => false);
  const [coldDone, setColdDone] = useState(false);
  // After the end: his phone again, to go back through (script §20). A view, not a step in the save.
  const [looking, setLooking] = useState(false);
  usePutDown(id, scene.kind === "table" || scene.kind === "moment" || scene.kind === "finale" ? `ep${state ? episodeOf(state) : 1}` : scene.kind);

  /* Opened after a real gap: when they were last here, read once per visit. */
  const [away, setAway] = useState<number | null>(() => {
    const s = readProgress();
    if (!s) return null;
    const last = Math.max(s.started, ...Object.values(s.at));
    return Date.now() - last >= AWAY_MS ? last : null;
  });
  // Back from the end card (Choose differently) is a choice made now, not a return after a gap.
  if (away !== null && (scene.kind === "end-card" || scene.kind === "ending")) setAway(null);
  const midCase = scene.kind === "table" || scene.kind === "ringing" || scene.kind === "charge" || scene.kind === "recap";
  if (state && away !== null && midCase)
    return (
      <Away
        story={story}
        state={state}
        last={away}
        onBack={() => {
          track({ case: id, event: "resume", via: state.via });
          setAway(null);
        }}
      />
    );

  /* The cold open plays before a first parcel each visit; once the chapter
     has been finished, with its words and a Skip (PG-COLD). */
  if (!state && story.coldOpen && (!replay || story.reveal) && !coldSeen && !coldDone) {
    return (
      <ColdOpen
        cold={story.coldOpen}
        voices={story.voices}
        replay={replay}
        warning={story.warning}
        onDone={() => {
          try {
            sessionStorage.setItem(coldKey(id), "1");
          } catch {
            // Private browsing: it plays again next time, and that's all.
          }
          setColdDone(true);
        }}
      />
    );
  }

  // Found on a seat: no parcel, no note. Picking it up is opening it.
  if ((!state || scene.kind === "parcel") && story.seat) {
    return (
      <Seat
        seat={story.seat}
        meta={meta}
        onOpen={() => save(add(newCase(Math.random().toString(36).slice(2, 10), Date.now(), via), "did:opened", "did:unlock", "saw:note"))}
      />
    );
  }

  if (!state || scene.kind === "parcel") {
    return (
      <>
        <Parcel
          meta={meta}
          episode={story.episodes[0]}
          to={to}
          minutes={minutes}
          replay={replay}
          realtime={story.realtime?.offer}
          // Said once, before the night is heard: not again over the parcel.
          warning={story.coldOpen ? undefined : story.warning}
          onOpen={(detective, real) =>
            save(
              add(
                newCase(Math.random().toString(36).slice(2, 10), Date.now(), via),
                "did:opened",
                ...(detective ? [DETECTIVE] : []),
                ...(real && story.realtime ? [REALTIME] : []),
              ),
            )
          }
        />
        <InAppGuard />
        {/* Private browsing: say so before the night starts, and offer a case number. */}
        <StorageWarning caseId={id as CaseId} />
      </>
    );
  }

  switch (scene.kind) {
    /* The phone has no passcode. Somebody turned it off before it was sent. */
    case "note":
      return <Note arrival={story.arrival} scene={meta.scene?.open} onTurn={() => flag("did:unlock", "saw:note")} />;

    /* The only thing the player is given to do with their hands between
       episodes, and the reason anybody goes looking for a cable. */
    case "charge":
      return <Charge gate={story.gate} hand={Boolean(story.reveal)} waitMs={story.reveal ? 5000 : 30_000} onPlugged={() => flag(...PLUGGED_IN)} />;

    /* The phone dying: an alert, two flickers, a shape in the glass (PG-DEATH). */
    case "death":
      // Over the phone as it was, nothing on it moving (`review`), until the screen goes.
      return (
        <>
          <Table story={story} meta={meta} state={state} replay={replay} review />
          <PhoneDeath alert={story.death?.alert ?? ""} onDone={() => flag(DEATH_SEEN)} />
        </>
      );

    /* "Next on…", after an episode (PG-NEXT). */
    case "next":
      return (
        <Reel
          key={`next-${scene.episode}`}
          story={story}
          state={state}
          shots={story.teasers?.[scene.episode] ?? []}
          label={`Next on ${story.title}`}
          onDone={() => flag(teaserShown(scene.episode))}
        />
      );

    /* One line on black, a voice on black, or a bubble held before the black (PG-DARK). */
    case "dark": {
      const { dark } = scene;
      return (
        <DarkScreen
          key={dark.id}
          dark={dark}
          voices={story.voices}
          onDone={() => {
            if (dark.returnTo) backToChat(dark.returnTo.app, dark.returnTo.thread);
            else putAppsAway();
            flag(darkDone(dark.id), ...(dark.sets ?? []));
          }}
        />
      );
    }

    /* The reveal (RAAKH-V3 §9, scene 3.10). */
    case "reveal":
      return <RevealDirector story={story} state={state} />;

    /* The last question filed: what comes before the ending. */
    case "before":
      return <BeforeEnding story={story} state={state} ending={scene.ending} />;

    /* Put away before the reveal: it's still ringing. Opened again, it's as it was. */
    case "unopened":
      return <UnopenedScene story={story} onOpen={() => state && save({ ...state, flags: state.flags.filter((f) => f !== UNOPENED) })} />;

    /* The last hour: the record, and what the player does with it. */
    case "finale":
      return <Finale story={story} state={state} onLater={() => flag("did:decide-later")} />;

    /* An episode, closed: what the player has to show for it, and what's still open. */
    case "recap":
      return story.recaps?.[scene.episode]?.filed ? (
        <FoundSoFar story={story} state={state} episode={scene.episode} onDone={() => flag(recapShown(scene.episode))} />
      ) : (
        <Recap story={story} state={state} episode={scene.episode} onDone={() => flag(recapShown(scene.episode))} />
      );

    /* Before a later episode: what the player filed, and tonight's briefing. */
    case "opener":
      return story.previously?.[scene.episode] ? (
        <Reel
          key={`previously-${scene.episode}`}
          story={story}
          state={state}
          shots={story.previously[scene.episode]!}
          label={`Previously on ${story.title}`}
          onDone={() => flag(openerShown(scene.episode))}
        />
      ) : (
        <Previously story={story} state={state} episode={scene.episode} onDone={() => flag(openerShown(scene.episode))} />
      );

    /* A new episode: its title, and the minute it opens on, never explained. */
    case "title": {
      const clock = story.clocks[scene.episode - 1];
      // Episode 3 opens on the bubble that ended Episode 2 (RAAKH-V3 §9.1).
      const bubble = scene.episode === 3 ? story.dark?.find((d) => d.bubble)?.bubble : undefined;
      return (
        <TitleCard
          n={scene.episode}
          title={story.episodes[scene.episode - 1]}
          when={`${story.nowLabel ? `${story.nowLabel} · ` : ""}${clock.day} · ${stamp(clock.base)}`}
          small={clock.card}
          under={
            bubble ? (
              <p className={styles.bubble} lang="hi-Latn">
                <b>{bubble.who}</b>
                {bubble.text}
                <time>{stamp(bubble.at)}</time>
              </p>
            ) : undefined
          }
          onDone={() => flag(titleShown(scene.episode))}
        />
      );
    }

    /* The act is done. What it cost, the last image, and black. */
    case "ending": {
      const end = story.reveal ? chosen(story, state) : undefined;
      return end ? <LockscreenEnding story={story} state={state} end={end} /> : <Aftermath story={story} state={state} />;
    }

    case "end-card":
      if (looking)
        return (
          <>
            <Table story={story} meta={meta} state={state} replay={replay} review />
            {story.clues ? (
              <LookAgainV3 story={story} state={state} onDone={() => setLooking(false)} />
            ) : (
              <LookAgain story={story} state={state} onDone={() => setLooking(false)} />
            )}
          </>
        );
      return story.reveal ? (
        <EndCardV3 story={story} state={state} onLookAgain={() => setLooking(true)} />
      ) : (
        <EndCard story={story} state={state} onLookAgain={() => setLooking(true)} />
      );

    /* The story stops: the doors open, and the player chooses. */
    case "moment": {
      const { moment } = scene;
      return <Moment key={moment.id} moment={moment} state={state} voices={story.voices} onChoose={(sets) => flag(momentDone(moment.id), ...sets)} />;
    }

    /* A call arriving on its own, on either phone. */
    case "ringing": {
      const { call } = scene;
      return (
        <Ringing
          key={call.id}
          call={call}
          state={state}
          // The found phone's calls ring over its own wallpaper; yours, over nothing of his.
          wallpaper={call.device === "owner" ? meta.wallpaper : undefined}
          voices={story.voices}
          answered={has(state, `did:answered-${call.id}`)}
          onAnswer={() => flag(`did:answered-${call.id}`, ...(call.sets ?? []))}
          onDecline={call.insists ? undefined : () => flag(`did:declined-${call.id}`)}
          onSay={(said) => {
            sayAll(said);
            flag(`did:done-${call.id}`);
          }}
        />
      );
    }
  }

  return <Table story={story} meta={meta} state={state} replay={replay} />;
}
