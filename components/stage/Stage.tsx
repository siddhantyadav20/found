"use client";

import { useState, useSyncExternalStore } from "react";

import { useCase } from "@/components/found/StoryContext";
import { add, clockNow, has, newCase } from "@/lib/game/engine";
import { PLUGGED_IN, sceneOf } from "@/lib/game/scene";
import { AWAY_MS } from "@/lib/found/keeping";
import { useNow } from "@/lib/found/now";
import { bindProgress, readProgress, subscribeProgress } from "@/lib/found/progress";
import { useReplay } from "@/lib/found/shelf";
import type { CaseId } from "@/content/cases";
import { track } from "@/lib/found/track";
import Charge from "./Charge";
import Aftermath from "./ending/Aftermath";
import Away from "./Away";
import Choice from "./ending/Choice";
import EndCard from "./ending/EndCard";
import InAppGuard from "./InAppGuard";
import Morning from "./Morning";
import Note from "./Note";
import Pouch from "./Pouch";
import Ringing from "./Ringing";
import SeenByThem from "./SeenByThem";
import Table from "./Table";
import { flag, save, say } from "./playthrough";
import styles from "./Stage.module.css";

/* ===========================================================================
   The stage: the pouch, then two phones and a call that won't end.

   It reads the save and decides which of the chapter's full-screen moments
   the player is in: the pouch, the note, the charger, "Good morning, #9.",
   the morning, a call ringing, the choice. Between them is the table, where
   the playing happens (`Table`). Resume lands on the right one because the
   save decides, never component state (PLAYER-JOURNEY Stage 5).
   =========================================================================== */

export default function Stage() {
  const { id, story, meta, to, minutes, via } = useCase();
  bindProgress(id);

  const state = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const now = useNow(60_000);
  const replay = useReplay(id as CaseId);

  const scene = sceneOf(story, state);

  /* Opened after a real gap: when they were last here, read once per visit. */
  const [away, setAway] = useState<number | null>(() => {
    const s = readProgress();
    if (!s) return null;
    const last = Math.max(s.started, ...Object.values(s.at));
    return Date.now() - last >= AWAY_MS ? last : null;
  });
  const midCase = scene.kind === "table" || scene.kind === "ringing" || scene.kind === "choice" || scene.kind === "charge";
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

  if (!state || scene.kind === "pouch") {
    return (
      <div className={styles.stage}>
        <p className={styles.eyebrow}>
          {story.title} · Episode 1 · {story.episodes[0]}
        </p>
        <Pouch
          meta={meta}
          to={to}
          minutes={minutes}
          replay={replay}
          onOpen={() => save(add(newCase(Math.random().toString(36).slice(2, 10), Date.now(), via), "did:opened"))}
        />
        <InAppGuard />
      </div>
    );
  }

  switch (scene.kind) {
    /* The phone has no screen lock: she was told to turn it off on Thursday,
       and she did, because that is what the call told her to do. */
    case "note":
      return <Note onTurn={() => flag("did:unlock", "saw:note", "saw:call")} />;

    /* The only thing the player is given to do with their hands in Episode 1,
       and the reason anybody goes looking for a cable. */
    case "charge":
      return <Charge cut={has(state, "did:cut-early")} onPlugged={() => flag(...PLUGGED_IN)} />;

    /* The end of Episode 2. They have watched every tap since 1:11, and now
       they say so. One line, at reading speed, and then the screen goes out
       on its own: no button, nothing to answer (PLAYER-JOURNEY Stage 6). */
    case "seen-by-them":
      return <SeenByThem onDone={() => flag("did:ep2-done")} />;

    /* The night ends. Sunlight, a warm phone, and the only good thing that
       happens in the whole chapter waiting in her messages. */
    case "morning":
      return <Morning story={story} state={state} onUp={() => flag("did:woke")} />;

    /* Everything has been asked. Three rows, and a call still running. */
    case "choice":
      return <Choice story={story} state={state} clock={clockNow(story, state, now)} />;

    /* The act is done. What it cost, the last image, and black. */
    case "ending":
      return <Aftermath story={story} state={state} />;

    case "end-card":
      return <EndCard story={story} state={state} />;

    /* Her son at 1:34, the Crime Branch at 10:30. */
    case "ringing": {
      const { call } = scene;
      return (
        <Ringing
          call={call}
          state={state}
          answered={has(state, `did:answered-${call.id}`)}
          onAnswer={() => flag(`did:answered-${call.id}`, ...(call.sets ?? []))}
          onDecline={call.insists ? undefined : () => flag(`did:declined-${call.id}`)}
          onSay={(option) => {
            say(story, option);
            flag(`did:done-${call.id}`);
          }}
        />
      );
    }
  }

  return <Table story={story} meta={meta} state={state} replay={replay} />;
}
