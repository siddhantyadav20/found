"use client";

import { useEffect, useState } from "react";

import type { Story, Voices } from "@/content/types";
import { FAR_DHOL, sound, TRAIN, useBed, warmNight } from "@/lib/found/nightSound";
import { say } from "@/lib/found/voice";
import styles from "./ColdOpen.module.css";

/* ===========================================================================
   Before the parcel, the first time: the night, in captions on black
   (ROADMAP T1). The player hears a shot before they know a single name, and
   the parcel that follows is what that night left behind.

   Captioned and, since 2026-10-23, voiced: the captions stay for anyone with
   the sound off ("Press play. Captions on."). A shot flashes the screen
   and, where a phone can, buzzes it once. A tap moves it on; Skip ends it.
   =========================================================================== */

const LINE_MS = 1700;
/** How long a shot's flash is on screen: gone on a timer, whatever the animation does. */
const FLASH_MS = 420;
const AFTER_MS = 2600;

type Cold = NonNullable<Story["coldOpen"]>;

export default function ColdOpen({
  cold,
  onDone,
  voices,
  replay = false,
  warning,
}: {
  cold: Cold;
  onDone: () => void;
  voices?: Voices;
  /** Said before a sound is played (2026-10-28: it used to come after the shots). */
  warning?: string;
  /**
   * Played before (PG-COLD, RAAKH-V3 §6): the words show, and it can be
   * skipped. The first time it's sound on true black, if every voice in it
   * is recorded; the captions are still there for a screen reader.
   */
  replay?: boolean;
}) {
  /* The words are always on screen, as they are in every other scene that
     plays a voice (2026-10-28: heard-only, the night opened on a black
     screen for anyone with the sound low, and read as broken). */
  // 0: the place; 1..n: lines; n + 1: "Seven days later".
  const [step, setStep] = useState(0);
  const last = cold.lines.length + 1;
  const flash = step >= 1 && step <= cold.lines.length && cold.lines[step - 1].flash;
  const [lit, setLit] = useState<number | null>(null);

  /* Heard, where the browser allows it: the wedding far off from the first
     second, and each line's own sound as it comes up (a shot, the laughter).
     Before any tap there's no sound to be had; a tap starts it. */
  // Arriving from the desk's button counts as the tap (the page's activation is sticky).
  const [heard, setHeard] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } };
    return nav.userActivation?.hasBeenActive === true;
  });
  // The content note first, and a tap to begin: nothing plays before it.
  const [begun, setBegun] = useState(!warning || replay);
  useEffect(() => warmNight(), []);
  useBed(cold.bed === "train" ? TRAIN : FAR_DHOL, begun && heard && step <= cold.lines.length);
  useEffect(() => {
    if (!begun || !heard || step < 1 || step > cold.lines.length) return;
    sound(cold.lines[step - 1].line);
    // A line somebody says, said (2026-10-23: the cast is voiced).
    say(voices?.[`cold:${step - 1}`]?.src);
  }, [begun, heard, step, cold.lines, voices]);

  useEffect(() => {
    if (!begun) return undefined;
    // A voiced line holds until it has been said: a recording is never cut off by the next.
    const said = step >= 1 && step <= cold.lines.length ? (voices?.[`cold:${step - 1}`]?.seconds ?? 0) * 1000 + 250 : 0;
    const t = window.setTimeout(() => (step < last ? setStep(step + 1) : onDone()), step === last ? AFTER_MS : step === 0 ? 1400 : Math.max(LINE_MS, said));
    return () => window.clearTimeout(t);
  }, [begun, step, last, onDone, voices, cold.lines.length]);

  useEffect(() => {
    if (!flash) return undefined;
    // On for a moment, then off for certain (a paused animation must never leave it lit).
    const on = window.setTimeout(() => setLit(step), 0);
    const off = window.setTimeout(() => setLit(null), FLASH_MS);
    const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } };
    try {
      if (nav.userActivation?.hasBeenActive !== false) nav.vibrate?.(60);
    } catch {
      // No buzz here; the flash carries it.
    }
    return () => {
      window.clearTimeout(on);
      window.clearTimeout(off);
    };
  }, [flash, step]);

  const shown = cold.lines.slice(0, Math.min(step, cold.lines.length));

  if (!begun)
    return (
      <div className={styles.cold}>
        <div className={styles.gate}>
          <p className={styles.where}>Before you begin</p>
          <p className={styles.gateNote}>{warning}</p>
          <p className={styles.gateSmall}>Best with sound on.</p>
          <button
            type="button"
            className={styles.begin}
            onClick={() => {
              setHeard(true);
              setBegun(true);
            }}
          >
            Begin
          </button>
        </div>
      </div>
    );

  return (
    <div
      className={styles.cold}
      data-flash={lit ?? undefined}
      onClick={() => {
        setHeard(true);
        if (step < last) setStep(step + 1);
        else onDone();
      }}
      role="presentation"
    >
      {replay && (
        <button
          type="button"
          className={styles.skip}
          onClick={(e) => {
            e.stopPropagation();
            onDone();
          }}
        >
          Skip
        </button>
      )}
      {step < last ? (
        <div className={styles.captions} aria-live="polite">
          <p className={styles.where}>{cold.where}</p>
          {shown.map((l, i) => (
            <p key={i} className={l.who ? styles.said : styles.sound} data-old={i < shown.length - 3 || undefined}>
              {l.who && <span className={styles.who}>{l.who}</span>}
              <span lang={l.english ? "hi-Latn" : undefined}>{l.line}</span>
              {l.english && <span className={styles.english}>{l.english}</span>}
            </p>
          ))}
        </div>
      ) : (
        <p className={styles.after}>{cold.after}</p>
      )}
      {lit !== null && <span key={lit} className={styles.flash} aria-hidden="true" />}
    </div>
  );
}
