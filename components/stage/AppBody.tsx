"use client";

import { useCallback } from "react";

import Chat from "@/components/owner/apps/Chat";
import Instagram from "@/components/owner/apps/Instagram";
import Messages from "@/components/owner/apps/Messages";
import Notes from "@/components/owner/apps/Notes";
import Photos from "@/components/owner/apps/Photos";
import Recents from "@/components/owner/apps/Recents";
import Safari from "@/components/owner/apps/Safari";
import Settings from "@/components/owner/apps/Settings";
import type { AppId, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import CaseFile from "./CaseFile";
import { flag, read, save, say } from "./playthrough";

/* ===========================================================================
   What each app on the found phone shows, and what doing something in it
   writes to the save. The apps only draw; every change goes through
   `playthrough`.
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
  const onSay = useCallback((option: Parameters<typeof say>[0]) => say(option), []);

  switch (app) {
    case "casefile":
      return <CaseFile story={story} state={state} save={save} />;
    case "instagram":
      return <Instagram story={story} state={state} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "messages":
      return <Messages story={story} state={state} onRead={onRead} />;
    case "whatsapp":
      return <Chat story={story} state={state} app={app} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "phone":
      return <Recents story={story} state={state} onRead={onRead} />;
    case "photos":
      return (
        <Photos
          story={story}
          state={state}
          onBack={onHome}
          onRead={onRead}
          onRestore={(id) => flag(`did:restored-${id}`)}
        />
      );
    case "notes":
      return (
        <Notes
          story={story}
          state={state}
          onRead={onRead}
          onPassword={(id) => flag(`did:unlocked-${id}`)}
        />
      );
    case "settings":
      return <Settings story={story} state={state} onAct={(sets) => flag(...sets)} onRead={onRead} />;
    case "safari":
      return <Safari story={story} state={state} onRead={onRead} />;
    default:
      // Not on this phone. Nothing on the home screen opens this.
      return null;
  }
}
