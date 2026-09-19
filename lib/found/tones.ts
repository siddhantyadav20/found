import { acquire, prefersQuiet, type Voice } from "@/lib/sound";

/* ===========================================================================
   The phone's tones: a ringtone, a call connecting and ending, a message
   going and arriving (PLAYTEST.md #64).

   Synthesised, and allowed to be: lib/sfx.ts draws the line at "is this cue
   a picture of a real object?". A ringtone, a connect chime and a message
   tone are chimes, not objects, so they are built here from sine and
   triangle notes and routed through the one master in lib/sound, which
   means the site's mute silences every one of them.

   All of them are quiet. The phone in the story is at 4%, in a dark room.
   =========================================================================== */

type Note = { f: number; at: number; len: number; peak: number; type?: OscillatorType };

function play(v: Voice, notes: readonly Note[]): void {
  const t0 = v.ctx.currentTime + 0.02;
  for (const n of notes) {
    const o = v.ctx.createOscillator();
    const g = v.ctx.createGain();
    o.type = n.type ?? "sine";
    o.frequency.value = n.f;
    const at = t0 + n.at;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(n.peak, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + n.len);
    o.connect(g).connect(v.out);
    o.start(at);
    o.stop(at + n.len + 0.05);
  }
}

function voice(): Voice | null {
  if (prefersQuiet()) return null;
  const v = acquire();
  v?.wake();
  return v;
}

/** A struck bar: the note, and a quieter overtone that dies first. */
const bar = (f: number, at: number, peak = 0.07): Note[] => [
  { f, at, len: 0.55, peak },
  { f: f * 4, at, len: 0.12, peak: peak * 0.25 },
];

/* E5 B4 E5 F#5 · B5 A5 F#5: a phrase in the family of every phone's
   default, not a copy of any of them. */
const PHRASE: readonly Note[] = [
  ...bar(659.3, 0),
  ...bar(493.9, 0.16),
  ...bar(659.3, 0.32),
  ...bar(740.0, 0.48),
  ...bar(987.8, 0.8),
  ...bar(880.0, 0.96),
  ...bar(740.0, 1.12),
];
const RING_EVERY_MS = 2600;

/**
 * Start ringing. Returns the function that stops it. Where a phone can buzz
 * (Android), it buzzes in step.
 */
export function ringtone(): () => void {
  const ring = () => {
    const v = voice();
    if (v) play(v, PHRASE);
    try {
      navigator.vibrate?.([400, 200, 400]);
    } catch {
      // No vibration here; the sound carries it.
    }
  };
  ring();
  const timer = window.setInterval(ring, RING_EVERY_MS);
  return () => {
    window.clearInterval(timer);
    try {
      navigator.vibrate?.(0);
    } catch {
      // Nothing was buzzing.
    }
  };
}

/** Answered: two rising notes. */
export function connected(): void {
  const v = voice();
  if (v) play(v, [{ f: 523.3, at: 0, len: 0.18, peak: 0.05 }, { f: 784.0, at: 0.1, len: 0.25, peak: 0.05 }]);
}

/** Ended: two falling beeps, the way a call cuts. */
export function ended(): void {
  const v = voice();
  if (v)
    play(v, [
      { f: 480, at: 0, len: 0.16, peak: 0.06, type: "triangle" },
      { f: 360, at: 0.2, len: 0.24, peak: 0.06, type: "triangle" },
    ]);
}

/** A message going: a short upward swoop. */
export function sent(): void {
  const v = voice();
  if (!v) return;
  const t = v.ctx.currentTime + 0.01;
  const o = v.ctx.createOscillator();
  const g = v.ctx.createGain();
  o.frequency.setValueAtTime(420, t);
  o.frequency.exponentialRampToValueAtTime(1100, t + 0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.04, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g).connect(v.out);
  o.start(t);
  o.stop(t + 0.2);
}

/** A message arriving in an open chat: two soft notes. */
export function received(): void {
  const v = voice();
  if (v) play(v, [{ f: 1046.5, at: 0, len: 0.2, peak: 0.035 }, { f: 1318.5, at: 0.09, len: 0.28, peak: 0.035 }]);
}
