"use client";

import { useEffect, useRef } from "react";

import { soundOn, subscribeSound } from "@/lib/sound";

/* ===========================================================================
   Voices (2026-10-23): the recordings under a voice note, a memo, a clip or
   a call (`Story.voices`). One plays at a time, as on a phone: starting one
   stops whatever else was talking. Sound off means silent, and the captions
   carry it, as they always have. A file that won't play is no error.
   =========================================================================== */

let talking: HTMLAudioElement | null = null;

function hush(except?: HTMLAudioElement) {
  if (talking && talking !== except) talking.pause();
  talking = except ?? null;
}

// Turning the sound off stops whoever is talking.
if (typeof window !== "undefined") subscribeSound((on) => !on && hush());

/** Play a recording once, from the top: a caller's line. Returns how to stop it. */
export function say(src: string | undefined): () => void {
  if (!src || typeof window === "undefined" || !soundOn()) return () => {};
  const a = new Audio(src);
  hush(a);
  void a.play().catch(() => {});
  return () => {
    a.pause();
    if (talking === a) talking = null;
  };
}

/**
 * A recording that follows a player: plays while `playing`, pauses when not.
 * With `at` (a clip's or a memo's clock), a scrub or a skip moves it there;
 * without, it plays through from wherever it was.
 */
export function useVoice(src: string | undefined, playing: boolean, at?: number) {
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!src) return undefined;
    const a = new Audio(src);
    a.preload = "auto";
    ref.current = a;
    return () => {
      a.pause();
      if (talking === a) talking = null;
      ref.current = null;
    };
  }, [src]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (!playing || !soundOn()) {
      a.pause();
      return;
    }
    if (at !== undefined) a.currentTime = at;
    else if (a.ended) a.currentTime = 0;
    hush(a);
    void a.play().catch(() => {});
    // Only a change of playing starts or stops it; a scrub is the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    const a = ref.current;
    if (!a || at === undefined || !playing) return;
    if (Math.abs(a.currentTime - at) > 1.2) a.currentTime = at;
  }, [at, playing]);
}
