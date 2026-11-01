import { acquire, prefersQuiet, soundOn, stage } from "@/lib/sound";

import { cameraStop, filmRun, perforation, type Stereo } from "./camera";

/* The site's sounds, through the same bus as the game's, so the mute a player
   set there holds here. Rendered the first time they're wanted and kept. Silent
   until the first real click: `wake` is refused before that, and nothing throws. */

const takes = new Map<(rate: number) => Stereo, AudioBuffer>();
let lastStop = 0;

function takeOf(ctx: BaseAudioContext, render: (rate: number) => Stereo) {
  let take = takes.get(render);
  if (!take) {
    const [left, right] = render(ctx.sampleRate);
    take = ctx.createBuffer(2, left.length, ctx.sampleRate);
    take.copyToChannel(left as Float32Array<ArrayBuffer>, 0);
    take.copyToChannel(right as Float32Array<ArrayBuffer>, 1);
    takes.set(render, take);
  }
  return take;
}

function play(render: (rate: number) => Stereo, level: number) {
  if (!soundOn() || prefersQuiet()) return;
  const voice = acquire();
  if (!voice) return;
  voice.wake();
  const source = voice.ctx.createBufferSource();
  source.buffer = takeOf(voice.ctx, render);
  source.connect(stage(voice, level));
  source.start();
}

/** Rendered while nothing's happening, so a slow phone's first click doesn't wait for one. */
export function warmCues() {
  const voice = acquire();
  if (!voice || !soundOn() || prefersQuiet()) return;
  [perforation, cameraStop, filmRun].forEach((render, i) => {
    window.setTimeout(() => takeOf(voice.ctx, render), 1200 + i * 400);
  });
}

const desktop = () => window.matchMedia("(hover: hover) and (min-width: 767px)").matches;

export const hoverTick = () => desktop() && play(perforation, 0.16);
export const menuTick = () => desktop() && play(perforation, 0.3);
/** Film pulled out of the camera, for the chapter list opening. Never for it closing. */
export const filmOut = () => play(filmRun, 0.62);

/** The camera stopping, for Explore. The pointer can cross it often; the camera stops once. */
export function cameraHalt() {
  const now = performance.now();
  if (now - lastStop < 900) return;
  lastStop = now;
  play(cameraStop, 0.8);
}
