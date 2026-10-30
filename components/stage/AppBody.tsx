"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";

import type { AppId, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { goneOf } from "@/lib/game/engine";
import { CHATS_UNLOCKED, restored, reverted, unlocked } from "@/lib/game/phone";
import { onHeard } from "@/lib/found/heard";
import CaseFile from "./CaseFile";
import { deleteItem, flag, heardIt, markRead, read, recoverItem, save, say, sendToM } from "./playthrough";

/* Each app's code arrives when it's first opened, and all of it is fetched
   while the phone sits idle (`preloadApps`), so opening one is still instant
   and the case page stays inside its budget (scripts/check-budget.mjs). */
const load = {
  chat: () => import("@/components/owner/apps/Chat"),
  findmy: () => import("@/components/owner/apps/FindMy"),
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
  camera: () => import("@/components/owner/apps/Camera"),
};

const Chat = dynamic(load.chat, { ssr: false });
const FindMy = dynamic(load.findmy, { ssr: false });
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
const Camera = dynamic(load.camera, { ssr: false });

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
  onOpen,
  thread,
}: {
  /** A chat to open on (a tapped banner). */
  thread?: string;
  app: AppId;
  story: Story;
  state: CaseState;
  onHome: () => void;
  /** Open another app from this one (the case file, from its note in Notes). */
  onOpen?: (app: AppId) => void;
}) {
  /* Put back from Recently Deleted: what was there before the phone reached
     the player comes back by iOS's own Recover; what the player deleted, the
     same way, from the save's list of what they deleted (RAAKH-V3 §17). */
  const putBack = (id: string) => (goneOf(state, id) === "soft" ? recoverItem(id) : flag(restored(id)));
  // Stable, because the apps mark things read from effects that depend on them.
  const onRead = useCallback((ids: readonly string[]) => read(story, ids), [story]);
  // A clip or memo played past its moment (fix brief H-23).
  useEffect(() => onHeard((id) => heardIt(story, id)), [story]);
  const onSay = useCallback((option: Parameters<typeof say>[0], replyId?: string) => say(option, replyId), []);

  switch (app) {
    case "casefile":
      return <CaseFile story={story} state={state} save={save} />;
    case "instagram":
      return <Instagram story={story} state={state} onHome={onHome} onRead={onRead} onSay={onSay} />;
    case "messages":
      return <Messages story={story} state={state} onRead={onRead} onHome={onHome} onMark={markRead} />;
    case "whatsapp":
      return (
        <Chat
          story={story}
          state={state}
          app={app}
          opened={thread}
          onHome={onHome}
          onRead={onRead}
          onSay={onSay}
          onMark={markRead}
          onUnlock={() => flag(CHATS_UNLOCKED)}
          onDelete={(id) => deleteItem(id, "perm")}
        />
      );
    case "phone":
      return <Recents story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "photos":
      return (
        <Photos
          story={story}
          state={state}
          onBack={onHome}
          onRead={onRead}
          onRestore={putBack}
          onRevert={(id) => flag(reverted(id))}
          onDelete={deleteItem}
          onSend={sendToM}
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
          onCaseFile={onOpen ? () => onOpen("casefile") : undefined}
          onDelete={deleteItem}
          onRecover={recoverItem}
        />
      );
    case "settings":
      return <Settings story={story} state={state} onAct={(sets) => flag(...sets)} onRead={onRead} onHome={onHome} />;
    case "voicememos":
      return <VoiceMemos story={story} state={state} onRead={onRead} onHome={onHome} onRestore={putBack} onDelete={deleteItem} />;
    case "mail":
      return <Mail story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "paytap":
      return <Paytap story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "findmy":
      // Find My: the phone records what's opened; stopping sharing is a move the story answers.
      return <FindMy story={story} state={state} onHome={onHome} onStop={(sets) => flag(...sets)} />;
    case "safari":
      return <Safari story={story} state={state} onRead={onRead} onHome={onHome} />;
    case "camera":
      return <Camera story={story} state={state} onHome={onHome} onPhoto={() => flag("did:camera-photo")} />;
    default:
      // Not on this phone. Nothing on the home screen opens this.
      return null;
  }
}
