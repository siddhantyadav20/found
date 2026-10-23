"use client";

import { useEffect } from "react";

import { play, sustain, warm, type Sustain } from "@/lib/sfx";
import type { SfxCue } from "@/lib/sfx-manifest";

/* ===========================================================================
   The night, heard: what a caption sounds like, and the bed under a scene.

   The captions are the script (every voice is still shown, not spoken), and
   where a caption names a sound there's a recording for it: a shot, two
   shots, laughter. A scene's bed (the wedding's dhol, a fire) runs under it
   while it plays. "[recording stops]" stops everything at once, which is the
   point of it: the second shot on the reel is never heard.

   All of it through lib/sound's one master, so the site's mute silences it.
   =========================================================================== */

export type Bed = { readonly cue: SfxCue; readonly level: number; readonly tone: number };

/** The wedding at a distance: the dhol through trees and a lawn. */
export const FAR_DHOL: Bed = { cue: "found-dhol", level: 0.55, tone: 750 };
/** The dance floor, close. */
const NEAR_DHOL: Bed = { cue: "found-dhol", level: 0.9, tone: 4200 };
const FIRE: Bed = { cue: "found-fire", level: 0.85, tone: 6000 };
/** The train, as the cold open hears it: close, full. */
export const TRAIN: Bed = { cue: "found-train", level: 0.9, tone: 5000 };
/** The train under everything once the phone's in hand: low, as if through your own ears. */
export const TRAIN_UNDER: Bed = { cue: "found-train", level: 0.32, tone: 1400 };

/** The bed a clip plays over, read off what its captions say is in it. */
export function bedFor(lines: readonly { readonly line: string; readonly who?: string }[]): Bed | undefined {
  const said = lines.map((l) => l.line.toLowerCase());
  if (said.some((l) => l.includes("[dhol"))) return NEAR_DHOL;
  if (said.some((l) => /crackle|smoke|fire/.test(l))) return FIRE;
  // The reel, on the back lawn: the wedding goes on behind it.
  if (lines.some((l) => l.who === "Kunal" || l.line.startsWith("Rolling"))) return FAR_DHOL;
  return undefined;
}

/** What a caption sounds like: shots, laughter, or the recording cut off. */
export function soundOf(line: string): "cut" | readonly { readonly cue: SfxCue; readonly delay: number }[] | undefined {
  const l = line.toLowerCase();
  if (!l.startsWith("[")) return undefined;
  if (l.includes("recording stops")) return "cut";
  if (/two shots/.test(l)) return [{ cue: "found-shot", delay: 0 }, { cue: "found-shot", delay: 0.38 }];
  if (/\bshot\b/.test(l) && !l.includes("stops")) return [{ cue: "found-shot", delay: 0 }];
  if (/laughter\]|cheering/.test(l) && !l.includes("stops")) return [{ cue: "found-laugh", delay: 0.15 }];
  return undefined;
}

/** Play a caption's sound now, if it has one. */
export function sound(line: string): "cut" | undefined {
  const s = soundOf(line);
  if (s === "cut" || !s) return s;
  for (const { cue, delay } of s) play(cue, { delay, spread: 0 });
  return undefined;
}

/** Fetch what a scene will need before it starts. */
export function warmNight(): void {
  warm("found-dhol", "found-shot", "found-laugh", "found-fire", "found-train");
}

/**
 * Keep a bed running while `on`. Starts as soon as its recording is decoded
 * (the first call only asks for it), and is always stopped on the way out:
 * a leaked loop is worse than silence.
 */
export function useBed(bed: Bed | undefined, on: boolean): void {
  const cue = bed?.cue;
  const level = bed?.level ?? 0;
  const tone = bed?.tone ?? 2000;
  useEffect(() => {
    if (!cue || !on) return undefined;
    warm(cue);
    let s: Sustain | null = null;
    const start = () => {
      s = sustain(cue);
      if (!s) return false;
      s.tone(tone);
      s.level(level);
      return true;
    };
    let tries = 0;
    const retry = start()
      ? undefined
      : window.setInterval(() => {
          if (start() || ++tries > 60) window.clearInterval(retry);
        }, 150);
    // A long scene keeps the shared voice awake (lib/sfx.ts, sustain).
    const awake = window.setInterval(() => s?.level(level), 2000);
    return () => {
      window.clearInterval(retry);
      window.clearInterval(awake);
      (s as Sustain | null)?.stop();
    };
  }, [cue, on, level, tone]);
}
