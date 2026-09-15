/**
 * Which recording becomes which cue, and where to cut it.
 *
 * `scripts/build-samples.mjs` reads this, cuts and encodes what it names out
 * of `samples-src/` (git-ignored, CC0 from Freesound), and rewrites the
 * generated half of `lib/sfx-manifest.ts`.
 *
 *   src        path under `samples-src/`
 *   start      seconds into the source
 *   duration   seconds to keep
 *   gain       per-cue trim, applied at playback
 *   loop       the take is a sustaining texture
 *
 * The memos are not cues — they are built by `scripts/build-found-audio.mjs`.
 */

const samples = {
  /* A phone vibrating on wood, one pulse per take; lib/found/buzz.ts plays two
     of them 450ms apart, the way a text lands. Pulses measured off the 50ms
     envelope (scripts/build-found-audio.mjs prints it). */
  "found-buzz": { gain: 1, takes: [
      { src: "found-buzz/708216.mp3", start: 0.080, duration: 0.400 },
      { src: "found-buzz/708216.mp3", start: 1.280, duration: 0.400 },
  ] },
};

export default samples;
