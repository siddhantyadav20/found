"use client";

import { useCallback } from "react";

import Chat from "@/components/her/apps/Chat";
import Instagram from "@/components/her/apps/Instagram";
import HerMessages from "@/components/her/apps/Messages";
import HerNews from "@/components/her/apps/News";
import HerNotes from "@/components/her/apps/Notes";
import HerPhotos from "@/components/her/apps/Photos";
import PikDrop from "@/components/her/apps/PikDrop";
import Recents from "@/components/her/apps/Recents";
import Safari from "@/components/her/apps/Safari";
import HerSettings from "@/components/her/apps/Settings";
import type { AppId, Story } from "@/content/types";
import { episodeOf, type CaseState } from "@/lib/game/engine";
import CaseFile from "./CaseFile";
import { flag, give, read, save, say } from "./playthrough";

/* ===========================================================================
   What each of her apps shows, and what doing something in it writes to the
   save. The apps only draw; every change goes through `playthrough`.
   =========================================================================== */

export default function AppBody({
  app,
  story,
  state,
  onHome,
}: {
  app: AppId;
  story: Story;
  state: CaseState;
  onHome: () => void;
}) {
  // Stable, because the apps mark things read from effects that depend on them.
  const onRead = useCallback((ids: readonly string[]) => read(story, ids), [story]);
  const onSay = useCallback((option: Parameters<typeof say>[1]) => say(story, option), [story]);

  switch (app) {
    case "casefile":
      return <CaseFile story={story} state={state} save={save} />;
    case "instagram":
      return <Instagram story={story} state={state} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "messages":
      return <HerMessages story={story} state={state} onRead={onRead} />;
    case "whatsapp":
      return <Chat story={story} state={state} app={app} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "phone":
      return <Recents story={story} state={state} onRead={onRead} />;
    case "photos":
      return (
        <HerPhotos
          story={story}
          state={state}
          onBack={onHome}
          onRead={onRead}
          onRestore={(id) => flag(`did:restored-${id}`)}
        />
      );
    case "notes":
      return (
        <HerNotes
          story={story}
          state={state}
          onRead={onRead}
          // They watched the keypad. She kept this from them for 31 hours.
          // In the night they use it at 3:02; typed in the morning, at once.
          onPassword={() =>
            give(story, "pin", "did:typed-password", episodeOf(state) === 3 ? "did:typed-late" : "did:typed-early")
          }
        />
      );
    case "settings":
      return <HerSettings story={story} state={state} onAct={(sets) => flag(...sets)} onRead={onRead} />;
    case "pikdrop":
      return <PikDrop story={story} state={state} onRead={onRead} />;
    case "safari":
      return <Safari story={story} state={state} onRead={onRead} />;
    case "news":
      return <HerNews story={story} />;
    default:
      // Not on her phone. Nothing on the home screen opens this.
      return null;
  }
}
