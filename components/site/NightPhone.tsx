"use client";

import { useState } from "react";

import AppView from "@/components/owner/AppView";
import Home from "@/components/owner/Home";
import LockScreen from "@/components/owner/LockScreen";
import Chat from "@/components/owner/apps/Chat";
import Photos from "@/components/owner/apps/Photos";
import screen from "@/components/owner/ios/Screen.module.css";
import CaseFile from "@/components/stage/CaseFile";
import Ringing from "@/components/stage/Ringing";
import type { AppId } from "@/content/types";
import { CASES } from "@/content/cases";
import { story } from "@/content/raakh/story";
import { add, newCase, type CaseState } from "@/lib/game/engine";
import Device from "./Device";
import styles from "./Night.module.css";

/* ===========================================================================
   His phone through the night, on the front page (2026-10-24). Every screen
   is the game's own, drawn from Raakh's script: his home screen, M's chat
   with the voice notes in his own voice, Raju ringing, his camera roll, the
   case file. It works: notes play, Raju can be answered, the first question
   can be tried.

   It plays on a state of its own, the minute after the phone is opened, and
   nothing done here is saved: the apps only write through `playthrough`,
   which does nothing when no chapter is open (`boundCase`).
   =========================================================================== */

export type Beat = "home" | "voice" | "call" | "photos" | "file" | "seven";

/** The clock and the battery at each beat, as the night has them (story.clocks). */
const AT: Record<Beat, { time: string; battery: number; charging?: boolean }> = {
  home: { time: "11:41", battery: 9 },
  voice: { time: "11:46", battery: 7 },
  call: { time: "11:47", battery: 7 },
  photos: { time: "12:58", battery: 64, charging: true },
  file: { time: "1:52", battery: 64, charging: true },
  seven: { time: "6:52", battery: 81, charging: true },
};

/** What each beat opens on. */
const OPENS: Record<Beat, AppId | "lock" | "ringing"> = {
  home: "home" as AppId,
  voice: "whatsapp",
  call: "ringing",
  photos: "photos",
  file: "casefile",
  seven: "lock",
};

/** The apps that open from his home screen here; the rest wait for the game. */
const OPENABLE = new Set<string>(["whatsapp", "photos", "casefile"]);

const WALLPAPER = CASES.raakh.wallpaper;
const RAJU = story.incoming.find((c) => c.id === "raju")!;

/** The minute after the phone was opened: the note read, the lock screen swiped. */
export const opened = (): CaseState => add(newCase("front-page", Date.now()), "did:opened", "did:unlock", "saw:note", "did:past-lock");

export default function NightPhone({ beat }: { beat: Beat }) {
  const [state, setState] = useState<CaseState>(opened);
  // Somewhere else on his phone than the beat opened on, by the reader's own hand. A new beat starts on its own screen.
  const [moved, setMoved] = useState<{ beat: Beat; to: string } | null>(null);
  const open = moved?.beat === beat ? moved.to : null;
  const setOpen = (to: string) => setMoved({ beat, to });

  const showing = open ?? OPENS[beat];
  const home = () => setOpen("home");
  const read = (ids: readonly string[]) => setState((s) => add(s, ...ids.map((id) => `saw:${id}` as const)));
  const at = AT[beat];

  let body: React.ReactNode;
  switch (showing) {
    case "lock":
      body = (
        <LockScreen
          day="Sunday 30 November"
          clock="6:52"
          notes={[
            { key: "seven", app: "casefile", from: "Case file", text: "They move him at seven. Two calls, before anyone notices." },
            { key: "bhasin", app: "phone", from: "Bhasin Uncle", text: "Missed call" },
          ]}
          onOpen={() => {}}
        />
      );
      break;
    case "ringing":
      body = (
        <Ringing
          call={RAJU}
          state={state}
          answered={false}
          wallpaper={WALLPAPER}
          voices={story.voices}
          onAnswer={() => {}}
          onDecline={home}
          onSay={home}
        />
      );
      break;
    case "whatsapp":
      body = (
        <div className={screen.appLayer}>
          <Chat story={story} state={state} app="whatsapp" opened={open ? undefined : "m"} onHome={home} onRead={read} />
        </div>
      );
      break;
    case "photos":
      body = (
        <div className={screen.appLayer}>
          <Photos story={story} state={state} onBack={home} onRead={read} onRestore={() => {}} onRevert={() => {}} />
        </div>
      );
      break;
    case "casefile":
      body = (
        <div className={screen.appLayer}>
          <AppView title="Case file" onBack={home}>
            <CaseFile story={story} state={state} save={setState} />
          </AppView>
        </div>
      );
      break;
    default:
      body = <Home story={story} state={state} onOpen={(app) => OPENABLE.has(app) && setOpen(app)} />;
  }

  return (
    <Device
      time={at.time}
      battery={at.battery}
      charging={at.charging}
      locked={showing === "lock"}
      wallpaper={WALLPAPER}
      label="His phone, working: tap anything on it"
    >
      <div key={`${beat}:${showing}`} className={styles.scene}>
        {body}
      </div>
      {showing !== "home" && showing !== "lock" && showing !== "ringing" && (
        <button type="button" className={screen.homeBar} aria-label="Home" onClick={home} />
      )}
    </Device>
  );
}
