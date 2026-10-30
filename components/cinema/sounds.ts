import { acquire, burst, stage } from "@/lib/sound";

/* The site's two small sounds, through the same bus as the game's, so the
   mute a player set there holds here. Silent until the first real click:
   `wake` is refused before that, and nothing throws. */

function play(seconds: number, level: number, hz: number) {
  const voice = acquire();
  if (!voice) return;
  voice.wake();
  burst(voice.ctx, stage(voice, 1), {
    at: voice.ctx.currentTime,
    seconds,
    level,
    type: "bandpass",
    hz,
    q: 2,
  });
}

const desktop = () => window.matchMedia("(hover: hover) and (min-width: 767px)").matches;

export const hoverTick = () => desktop() && play(0.035, 0.05, 3200);
export const menuTick = () => desktop() && play(0.06, 0.1, 1700);
