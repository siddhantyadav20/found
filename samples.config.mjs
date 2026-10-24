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

  /* The cold open (ROADMAP T1), and the clips that play the night back.
     All CC0 from Freesound; sections picked off a measured loudness envelope
     (steady, no gaps), and mixed low at playback so they sit far off. */
  // A wedding's dhol at full tilt (Freesound 418780, "Indian Wedding Dhols").
  "found-dhol": { gain: 0.42, loop: true, takes: [
      { src: "found-dhol/418780.mp3", start: 30, duration: 12 },
  ] },
  // One handgun shot, outdoors, with its tail (Freesound 386745).
  "found-shot": { gain: 0.75, takes: [
      { src: "found-shot/386745.mp3", start: 0.03, duration: 1.05 },
  ] },
  // A few people laughing (Freesound 337795).
  "found-laugh": { gain: 0.32, takes: [
      { src: "found-laugh/337795.mp3", start: 0, duration: 4.4 },
  ] },
  // A train interior at speed, rattling (Freesound 525058): Last Local's bed.
  "found-train": { gain: 0.6, loop: true, takes: [
      { src: "found-train/525058.mp3", start: 21, duration: 12 },
  ] },
  // A small fire outdoors, crackling, with air (Freesound 637523).
  "found-fire": { gain: 0.55, loop: true, takes: [
      { src: "found-fire/637523.mp3", start: 4, duration: 10 },
  ] },
};

export default samples;
