"use client";

import { useState, useSyncExternalStore } from "react";

import { StorageWarning } from "@/components/found/KeepCase";
import { useCase } from "@/components/found/StoryContext";
import { add, has, newCase } from "@/lib/game/engine";
import { stamp } from "@/lib/found/time";
import { PLUGGED_IN, sceneOf, titleShown } from "@/lib/game/scene";
import { AWAY_MS } from "@/lib/found/keeping";
import { bindProgress, readProgress, subscribeProgress } from "@/lib/found/progress";
import { useReplay } from "@/lib/found/shelf";
import type { CaseId } from "@/content/cases";
import { track } from "@/lib/found/track";
import Charge from "./Charge";
import dynamic from "next/dynamic";
import Away from "./Away";
import InAppGuard from "./InAppGuard";
import Note from "./Note";
import Parcel from "./Parcel";
import Ringing from "./Ringing";
import TitleCard from "./TitleCard";
import Table from "./Table";
import { flag, save, say } from "./playthrough";
import styles from "./Stage.module.css";

/* ===========================================================================
   The stage: the parcel, then two phones on a table.

   It reads the save and decides which of the chapter's full-screen moments
   the player is in: the parcel, the note, the charger, a title card, a call
   ringing, the choice. Between them is the table, where the playing happens
   (`Table`). Resume lands on the right one because the save decides, never
   component state.
   =========================================================================== */

/* The ending and its card: loaded only when a play gets there. */
const Aftermath = dynamic(() => import("./ending/Aftermath"), { ssr: false });
const EndCard = dynamic(() => import("./ending/EndCard"), { ssr: false });

export default function Stage() {
  const { id, story, meta, to, minutes, via } = useCase();
  bindProgress(id);

  const state = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const replay = useReplay(id as CaseId);

  const scene = sceneOf(story, state);

  /* Opened after a real gap: when they were last here, read once per visit. */
  const [away, setAway] = useState<number | null>(() => {
    const s = readProgress();
    if (!s) return null;
    const last = Math.max(s.started, ...Object.values(s.at));
    return Date.now() - last >= AWAY_MS ? last : null;
  });
  const midCase = scene.kind === "table" || scene.kind === "ringing" || scene.kind === "charge";
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

  if (!state || scene.kind === "parcel") {
    return (
      <div className={styles.stage}>
        <p className={styles.eyebrow}>
          Episode 1 · {story.episodes[0]}
        </p>
        <Parcel
          meta={meta}
          to={to}
          minutes={minutes}
          replay={replay}
          onOpen={() => save(add(newCase(Math.random().toString(36).slice(2, 10), Date.now(), via), "did:opened"))}
        />
        <InAppGuard />
        {/* Private browsing: say so before the night starts, and offer a case number. */}
        <StorageWarning caseId={id as CaseId} />
      </div>
    );
  }

  switch (scene.kind) {
    /* The phone has no passcode. Somebody turned it off before it was sent. */
    case "note":
      return <Note arrival={story.arrival} onTurn={() => flag("did:unlock", "saw:note")} />;

    /* The only thing the player is given to do with their hands between
       episodes, and the reason anybody goes looking for a cable. */
    case "charge":
      return <Charge gate={story.gate} onPlugged={() => flag(...PLUGGED_IN)} />;

    /* A new episode: its title, and the minute it opens on, never explained. */
    case "title": {
      const clock = story.clocks[scene.episode - 1];
      return (
        <TitleCard
          n={scene.episode}
          title={story.episodes[scene.episode - 1]}
          when={`${clock.day} · ${stamp(clock.base)}`}
          onDone={() => flag(titleShown(scene.episode))}
        />
      );
    }

    /* The act is done. What it cost, the last image, and black. */
    case "ending":
      return <Aftermath story={story} state={state} />;

    case "end-card":
      return <EndCard story={story} state={state} />;

    /* A call arriving on its own, on either phone. */
    case "ringing": {
      const { call } = scene;
      return (
        <Ringing
          call={call}
          state={state}
          // The found phone's calls ring over its own wallpaper; yours, over nothing of his.
          wallpaper={call.device === "owner" ? meta.wallpaper : undefined}
          answered={has(state, `did:answered-${call.id}`)}
          onAnswer={() => flag(`did:answered-${call.id}`, ...(call.sets ?? []))}
          onDecline={call.insists ? undefined : () => flag(`did:declined-${call.id}`)}
          onSay={(option) => {
            say(option);
            flag(`did:done-${call.id}`);
          }}
        />
      );
    }
  }

  return <Table story={story} meta={meta} state={state} replay={replay} />;
}
