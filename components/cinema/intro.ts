import { acquire, soundOn, stage, type Voice } from "@/lib/sound";

import { HEARD_KEY } from "./entered";

/* ===========================================================================
   Found's sound mark (2026-11-01), played once a browser, over the preloader's
   film as it goes from white to black.

   It's the premise in five seconds: a phone buzzing on a table, twice; a film
   gate starting up as the stripes swell, under a synth line in Raag Bhairav's
   scale (D, E flat, F sharp, A) rather than any film's; and as the screen shuts
   to black, two dhol strokes, a wide chord, and a phone's ping going up a fifth.
   Lost, then found.

   A browser won't let a page sound until it's been clicked. Some have been
   clicked before and say yes straight away; for the rest, the film holds on its
   first frame behind one button, so that sound and picture start together.

   Synthesised, not a file: there's nothing to wait for on the click.
   =========================================================================== */

/** The dhol's second stroke, timed to the stripes shutting to black. */
const LAND = 2.35;
const LENGTH = 7;
/** Long enough for a context that's allowed to start to have started. */
const ASK_MS = 120;
const PEAK = 0.8;

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** A hall made of decaying noise, a little different in each ear. */
function hall(ctx: BaseAudioContext, seconds: number) {
  const frames = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, frames, ctx.sampleRate);
  for (let c = 0; c < 2; c += 1) {
    const data = buffer.getChannelData(c);
    let low = 0;
    for (let i = 0; i < frames; i += 1) {
      low += (Math.random() * 2 - 1 - low) * 0.35;
      data[i] = low * (1 - i / frames) ** 3.2;
    }
  }
  const room = ctx.createConvolver();
  room.buffer = buffer;
  return room;
}

function hiss(ctx: BaseAudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function score(ctx: BaseAudioContext, out: AudioNode, t: number) {
  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -14;
  glue.ratio.value = 5;
  glue.attack.value = 0.006;
  glue.release.value = 0.22;
  glue.connect(out);

  const wet = ctx.createGain();
  wet.gain.value = 0.34;
  wet.connect(hall(ctx, 3.6)).connect(glue);

  const dry = ctx.createGain();
  dry.connect(glue);
  dry.connect(wet);

  const noise = hiss(ctx);

  const shot = (at: number, seconds: number, level: number, type: BiquadFilterType, freq: number, q: number) => {
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const env = ctx.createGain();
    env.gain.setValueAtTime(level, at);
    env.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    source.connect(filter).connect(env).connect(dry);
    source.start(at, Math.random());
    source.stop(at + seconds + 0.02);
  };

  // The phone: a motor at 150Hz, chopped, and the table rattling with it.
  for (const [at, seconds] of [[0, 0.24], [0.34, 0.3]] as const) {
    const motor = ctx.createOscillator();
    motor.type = "square";
    motor.frequency.value = 150;
    const chop = ctx.createOscillator();
    chop.type = "sawtooth";
    chop.frequency.value = 31;
    const depth = ctx.createGain();
    depth.gain.value = 0.18;
    const body = ctx.createBiquadFilter();
    body.type = "bandpass";
    body.frequency.value = 310;
    body.Q.value = 1.1;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t + at);
    env.gain.exponentialRampToValueAtTime(0.24, t + at + 0.02);
    env.gain.setValueAtTime(0.24, t + at + seconds - 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, t + at + seconds);
    chop.connect(depth).connect(env.gain);
    motor.connect(body).connect(env).connect(dry);
    motor.start(t + at);
    chop.start(t + at);
    motor.stop(t + at + seconds + 0.02);
    chop.stop(t + at + seconds + 0.02);
  }

  // The floor rising under everything, from D1 to D2.
  const sub = ctx.createOscillator();
  sub.type = "sawtooth";
  sub.frequency.setValueAtTime(hz(26), t);
  sub.frequency.exponentialRampToValueAtTime(hz(38), t + LAND);
  const subTone = ctx.createBiquadFilter();
  subTone.type = "lowpass";
  subTone.frequency.setValueAtTime(90, t);
  subTone.frequency.exponentialRampToValueAtTime(420, t + LAND);
  const subEnv = ctx.createGain();
  subEnv.gain.setValueAtTime(0.0001, t);
  subEnv.gain.exponentialRampToValueAtTime(0.34, t + LAND - 0.03);
  subEnv.gain.exponentialRampToValueAtTime(0.0001, t + LAND + 0.02);
  sub.connect(subTone).connect(subEnv).connect(dry);
  sub.start(t);
  sub.stop(t + LAND + 0.05);

  // The film gate: clicks closing up as the reel spins.
  for (let at = 0.5, gap = 0.1; at < LAND - 0.2; at += gap, gap = Math.max(gap * 0.95, 0.042)) {
    shot(t + at, 0.03, 0.09 + (at / LAND) * 0.12, "bandpass", 2100 + at * 500, 3);
  }

  // The line: two detuned saws through a closing, opening filter.
  const line = [50, 57, 62, 63, 62, 57, 54, 57];
  const gap = (LAND - 0.56) / line.length;
  line.forEach((note, i) => {
    const at = t + 0.56 + i * gap;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 7;
    const open = 340 + (i / line.length) ** 1.6 * 3100;
    filter.frequency.setValueAtTime(open * 2.2, at);
    filter.frequency.exponentialRampToValueAtTime(open * 0.5, at + gap * 1.1);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(0.3, at + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, at + gap * 1.5);
    const pan = ctx.createStereoPanner();
    pan.pan.value = i % 2 ? 0.34 : -0.34;
    filter.connect(env).connect(pan).connect(dry);
    for (const cents of [-7, 7]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = hz(note);
      osc.detune.value = cents;
      osc.connect(filter);
      osc.start(at);
      osc.stop(at + gap * 1.6);
    }
  });

  // Ta, then dum: the dhol's two faces, the second heavy enough to feel.
  const stroke = (at: number, from: number, to: number, seconds: number, level: number) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(from, at);
    osc.frequency.exponentialRampToValueAtTime(to, at + 0.09);
    const env = ctx.createGain();
    env.gain.setValueAtTime(level, at);
    env.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    osc.connect(env).connect(dry);
    osc.start(at);
    osc.stop(at + seconds + 0.02);
  };
  stroke(t + LAND - 0.2, 300, 190, 0.2, 0.42);
  shot(t + LAND - 0.2, 0.05, 0.3, "highpass", 1500, 0.7);
  stroke(t + LAND, 150, 49, 1.25, 0.8);
  shot(t + LAND, 0.09, 0.42, "lowpass", 2400, 0.7);

  // The chord: D and A wide open, F sharp and the raag's E flat rubbing inside.
  const chord = ctx.createBiquadFilter();
  chord.type = "lowpass";
  chord.Q.value = 0.9;
  chord.frequency.setValueAtTime(420, t + LAND);
  chord.frequency.exponentialRampToValueAtTime(2300, t + LAND + 0.14);
  chord.frequency.exponentialRampToValueAtTime(300, t + LAND + 3.6);
  const chordEnv = ctx.createGain();
  chordEnv.gain.setValueAtTime(0.0001, t + LAND);
  chordEnv.gain.exponentialRampToValueAtTime(0.13, t + LAND + 0.03);
  chordEnv.gain.exponentialRampToValueAtTime(0.0001, t + LAND + 4);
  chord.connect(chordEnv).connect(dry);
  [38, 45, 50, 54, 57, 63].forEach((note, i) => {
    for (const cents of [-9, 0, 9]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = hz(note);
      osc.detune.value = cents + i;
      const pan = ctx.createStereoPanner();
      pan.pan.value = (cents / 9) * 0.7;
      osc.connect(pan).connect(chord);
      osc.start(t + LAND);
      osc.stop(t + LAND + 4.05);
    }
  });

  // The ping, D then A: something that was lost, answering.
  ([[LAND + 0.72, 86], [LAND + 1.02, 93]] as const).forEach(([at, note], i) => {
    for (const [ratio, level] of [[1, 0.12], [2.76, 0.03]] as const) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz(note) * ratio;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t + at);
      env.gain.exponentialRampToValueAtTime(level, t + at + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t + at + (i ? 2.1 : 0.9));
      osc.connect(env).connect(dry);
      osc.start(t + at);
      osc.stop(t + at + 2.15);
    }
  });
}

function play(voice: Voice) {
  try {
    localStorage.setItem(HEARD_KEY, "1");
  } catch {
    // No memory for it here: better heard twice than not at all.
  }
  voice.wake();
  const out = stage(voice, PEAK);
  score(voice.ctx, out, voice.ctx.currentTime + 0.03);
  // The bus sleeps after two seconds of quiet from its cues; this one is longer.
  const awake = window.setInterval(voice.wake, 1000);
  window.setTimeout(() => {
    window.clearInterval(awake);
    out.disconnect();
  }, LENGTH * 1000);
  document.documentElement.setAttribute("data-run", "");
}

/** Called once on arrival. The script has already started the film if there's nothing to hear. */
export function armIntro() {
  const root = document.documentElement;
  if (root.hasAttribute("data-run") || window.__foundEntered || !soundOn()) return;
  const voice = acquire();
  if (!voice) return;
  window.__foundArmed = true;
  voice.wake();
  window.setTimeout(() => {
    if (voice.ctx.state === "running") return play(voice);
    root.setAttribute("data-gate", "");
    const press = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey)) return;
      document.removeEventListener("click", press);
      document.removeEventListener("keydown", press);
      play(voice);
    };
    document.addEventListener("click", press);
    document.addEventListener("keydown", press);
  }, ASK_MS);
}
