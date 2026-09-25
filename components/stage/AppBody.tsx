"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

import type { AppId, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { restored, reverted, unlocked } from "@/lib/game/phone";
import CaseFile from "./CaseFile";
import { flag, read, save, say } from "./playthrough";

/* Each app's code arrives when it's first opened, and all of it is fetched
   while the phone sits idle (`preloadApps`), so opening one is still instant
   and the case page stays inside its budget (scripts/check-budget.mjs). */
const load = {
  chat: () => import("@/components/owner/apps/Chat"),
  instagram: () => import("@/components/owner/apps/Instagram"),
  mail: () => import("@/components/owner/apps/Mail"),
  paytap: () => import("@/components/owner/apps/Paytap"),
  voicememos: () => import("@/components/owner/apps/VoiceMemos"),
  messages: () => import("@/components/owner/apps/Messages"),
  notes: () => import("@/components/owner/apps/Notes"),
  photos: () => import("@/components/owner/apps/Photos"),
  recents: () => import("@/components/owner/apps/Recents"),
  safari: () => import("@/components/owner/apps/Safari"),
  settings: () => import("@/components/owner/apps/Settings"),
};

const Chat = dynamic(load.chat, { ssr: false });
const Instagram = dynamic(load.instagram, { ssr: false });
const Mail = dynamic(load.mail, { ssr: false });
const Paytap = dynamic(load.paytap, { ssr: false });
const VoiceMemos = dynamic(load.voicememos, { ssr: false });
const Messages = dynamic(load.messages, { ssr: false });
const Notes = dynamic(load.notes, { ssr: false });
const Photos = dynamic(load.photos, { ssr: false });
const Recents = dynamic(load.recents, { ssr: false });
const Safari = dynamic(load.safari, { ssr: false });
const Settings = dynamic(load.settings, { ssr: false });

/** Fetch every app's code ahead of its first opening. */
export function preloadApps() {
  for (const get of Object.values(load)) void get();
}

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
  const onSay = useCallback((option: Parameters<typeof say>[0], replyId?: string) => say(option, replyId), []);

  switch (app) {
    case "casefile":
      return <CaseFile story={story} state={state} save={save} />;
    case "instagram":
      return <Instagram story={story} state={state} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "messages":
      return <Messages story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "whatsapp":
      return <Chat story={story} state={state} app={app} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "phone":
      return <Recents story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "photos":
      return (
        <Photos
          story={story}
          state={state}
          onBack={onHome}
          onRead={onRead}
          onRestore={(id) => flag(restored(id))}
          onRevert={(id) => flag(reverted(id))}
        />
      );
    case "notes":
      return (
        <Notes
          story={story}
          state={state}
          onRead={onRead}
          onHome={onHome}
          onPassword={(id) => flag(unlocked(id))}
        />
      );
    case "settings":
      return <Settings story={story} state={state} onAct={(sets) => flag(...sets)} onRead={onRead} onHome={onHome} />;
    case "voicememos":
      return <VoiceMemos story={story} state={state} onRead={onRead} onHome={onHome} onRestore={(id) => flag(restored(id))} />;
    case "mail":
      return <Mail story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "paytap":
      return <Paytap story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "safari":
      return <Safari story={story} state={state} onRead={onRead} onHome={onHome} />;
    default:
      // Not on this phone. Nothing on the home screen opens this.
      return null;
  }
}
