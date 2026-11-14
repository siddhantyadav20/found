// RAAKH — trailer v3 ("It's all on the phone"). 1080×1920, 24 fps.
// The phone fills the screen; the world plays in a 4:5 window (0,285 → 1080×1350).
// One storyteller: the voice notes nobody heard. Long living holds, one strobe burst.
export const FPS = 24;
export const W = 1080, H = 1920;
export const WIN = { x: 0, y: 285, w: 1080, h: 1350 };
export const LENGTH = 75.0;

const A = "assets/";
// still: focus f = normalized point of the image held at window centre, a→b; s = scale a→b
const still = (t0, t1, img, o = {}) => ({ kind: "still", t0, t1, src: A + img, win: true, s: [1.02, 1.08], f: [[0.5, 0.5], [0.5, 0.5]], ...o });
// clip: frames/<dir>/%05d.jpg from frame `from`, at `rate` frames per output frame
const clip = (t0, t1, dir, o = {}) => ({ kind: "clip", t0, t1, dir, from: 1, rate: 1, win: true, s: [1.02, 1.06], f: [[0.5, 0.5], [0.5, 0.5]], ...o });
// ui: a real game screen (1170×2532) full-bleed; f in screen px
const ui = (t0, t1, img, o = {}) => ({ kind: "ui", t0, t1, src: A + img, win: false, s: [1.0, 1.04], f: [[585, 1266], [585, 1266]], ...o });
const pex = (slot) => `../build/frames/${slot}`;

export const SHOTS = [
  // ── COLD OPEN: your phone wakes up
  { kind: "black", t0: 0, t1: 0.55 },
  ui(0.55, 5.6, "a-00-start.png", { s: [1.0, 1.05], f: [[585, 1180], [585, 1240]], wake: 0.18, banner: [1.15, 5.45], shake: 0.6 }),
  { kind: "black", t0: 5.6, t1: 6.4 },
  // ── THE PARCEL
  still(6.4, 10.6, "raakh-parcel.jpg", { s: [1.04, 1.16], f: [[0.52, 0.56], [0.47, 0.6]], dust: 1, flick: 0.03, shake: 1 }),
  still(10.6, 15.0, "left-down.jpg", { s: [1.06, 1.16], f: [[0.5, 0.55], [0.48, 0.6]], dust: 0.7, shake: 0.8 }),
  // ── THE VOICE NOTE
  ui(15.0, 20.3, "b-03-m.png", { s: [1.55, 1.7], f: [[720, 760], [760, 744]], play: { x0: 486, x1: 1020, y: 738, h: 64, t0: 15.85, t1: 27.8 }, shake: 0.6 }),
  still(20.3, 22.5, "raakh-baraat.jpg", { s: [1.12, 1.2], f: [[0.4, 0.42], [0.46, 0.44]], ov: { dir: "sparks", n: 180, a: 0.55 }, flick: 0.06, shake: 1.6 }),
  clip(22.5, 25.4, "frames/k3", { from: 4, n: 83, rate: 0.9, s: [1.1, 1.16], f: [[0.5, 0.36], [0.5, 0.33]], shake: 2.2, flick: 0.05 }),
  still(25.4, 28.0, "raakh-key.jpg", { s: [1.0, 1.08], f: [[0.6, 0.55], [0.62, 0.55]], ov: { dir: "fog", n: 274, a: 0.22 }, shake: 0.5 }),
  { kind: "black", t0: 28.0, t1: 29.2 },
  // ── WHO HE WAS
  clip(29.2, 34.4, "frames/reel", { from: 1, n: 108, rate: 0.82, s: [1.06, 1.14], f: [[0.45, 0.66], [0.42, 0.62]], shake: 1.2 }),
  still(34.4, 38.0, "raakh-poster.jpg", { s: [1.02, 1.14], f: [[0.5, 0.5], [0.5, 0.42]], dust: 0.5, shake: 0.8 }),
  still(38.0, 42.6, "raakh-photo.jpg", { s: [1.06, 1.2], f: [[0.5, 0.55], [0.47, 0.6]], ov: { dir: "fog", n: 274, a: 0.3 }, shake: 0.9 }),
  // ── WHAT THEY DID
  still(42.6, 48.6, "raakh-bhasin.jpg", { s: [1.02, 1.14], f: [[0.5, 0.48], [0.5, 0.36]], ov: { dir: "fog", n: 274, a: 0.35 }, shake: 0.6 }),
  clip(48.6, 51.4, "frames/fire", { from: 1, n: 144, rate: 1, s: [1.1, 1.18], f: [[0.5, 0.55], [0.5, 0.6]], ov: { dir: "embers", n: 240, a: 0.7 }, flick: 0.1, shake: 1 }),
  // ── THE CLOCK
  ui(51.4, 53.8, "g-01-lock3.png", { s: [1.15, 1.3], f: [[585, 1500], [585, 1600]], shake: 1.2 }),
];

// The strobe: Bhasin's deadline over the night, cutting faster and faster (Weapons' bursts).
const STROBE = [
  [pex("headlights"), "pex", 0.42], ["corridor.jpg", "still", 0.36], ["h-01-banyan1.png", "ui", 0.32, [585, 520]],
  [pex("fire1"), "pex", 0.28], ["frames/k3", "clip", 0.25], ["counter.jpg", "still", 0.22], [pex("torch"), "pex", 0.2],
  ["c-01-case.png", "ui", 0.2, [585, 640]], ["raakh-fire.jpg", "still", 0.18], [pex("station"), "pex", 0.16],
  ["b-02-raju.png", "ui", 0.16, [585, 480]], [pex("alarm"), "pex", 0.14], ["raakh-meera.jpg", "still", 0.13],
  [pex("fire2"), "pex", 0.12], ["evidence.jpg", "still", 0.11], [pex("lights"), "pex", 0.1], ["frames/fire", "clip", 0.1],
  [pex("corridor2"), "pex", 0.09], ["raakh-baraat.jpg", "still", 0.09], [pex("embers1"), "pex", 0.08], ["raakh-bhasin.jpg", "still", 0.08],
  [pex("fire3"), "pex", 0.08], ["raakh-poster.jpg", "still", 0.08],
];
{
  let t = 53.8;
  const k = (58.2 - 53.8) / STROBE.reduce((a, x) => a + x[2], 0);
  STROBE.forEach(([src, kind, d0, foc], i) => {
    const d = d0 * k;
    const t1 = i === STROBE.length - 1 ? 58.2 : +(t + d).toFixed(3);
    const z = [1.12 + (i % 3) * 0.06, 1.2 + (i % 3) * 0.06];
    if (kind === "still") SHOTS.push(still(t, t1, src, { s: z, f: [[0.5, 0.45], [0.5, 0.45]], shake: 3 }));
    else if (kind === "ui") SHOTS.push(ui(t, t1, src, { s: [1.12, 1.2], f: [foc, foc], shake: 3 }));
    else if (kind === "clip") SHOTS.push(clip(t, t1, src, { from: 20 + i * 3, n: 80, s: z, shake: 3 }));
    else SHOTS.push({ kind: "pex", t0: t, t1, dir: src, win: true, s: z, f: [[0.5, 0.5], [0.5, 0.5]], shake: 3 });
    if (i % 4 === 3) SHOTS.push({ kind: "flash", t0: t1 - 1 / 24, t1: t1 + 1 / 24 });
    t = t1;
  });
  SHOTS.push({ kind: "black", t0: t, t1: 63.9 });          // ~58.2: everything stops
}
SHOTS.push(
  { kind: "title", t0: 63.9, t1: 68.4, ov: { dir: "embers2", n: 240, a: 0.8 } },
  { kind: "black", t0: 68.4, t1: 70.8 },
  { kind: "end", t0: 70.8, t1: LENGTH },
);

// ── Words. who: speaker line above the subtitle. sub: what is said, in English.
export const TEXTS = [
  { t0: 1.6, t1: 5.5, style: "who", text: "CALL  ·  +91 62••• •4417" },
  { t0: 1.65, t1: 3.6, style: "sub", text: "Hello? Sameer bhaiya?" },
  { t0: 4.05, t1: 5.5, style: "sub", text: "Where’s Dilip?" },

  { t0: 7.0, t1: 10.4, style: "stamp", text: "RETURN TO ORIGIN", under: "REFUSED BY ADDRESSEE  ·  KALKAJI" },
  { t0: 10.9, t1: 14.95, style: "who", text: "M  ·  CALLING" },
  { t0: 10.95, t1: 11.9, style: "sub", text: "Listen." },
  { t0: 12.55, t1: 14.1, style: "sub", text: "Don’t delete anything." },
  { t0: 14.25, t1: 14.95, style: "sub", text: "Anything." },

  { t0: 15.6, t1: 27.95, style: "who", text: "VOICE NOTE  ·  NEVER HEARD" },
  { t0: 15.85, t1: 16.9, style: "sub", text: "M…" },
  { t0: 17.4, t1: 20.2, style: "sub", text: "I know you won’t reply." },
  { t0: 20.45, t1: 22.3, style: "sub", text: "Last night, at the wedding…" },
  { t0: 22.64, t1: 24.8, style: "sub", text: "Kunal was firing." },
  { t0: 26.45, t1: 27.95, style: "sub", text: "A boy fell." },

  { t0: 30.0, t1: 37.9, style: "who", text: "DILIP KUMAR MAHTO  ·  19" },
  { t0: 29.7, t1: 32.1, style: "sub", text: "Hello sir, my name is Dilip Kumar Mahto." },
  { t0: 32.25, t1: 34.3, style: "sub", text: "I am from Samastipur." },
  { t0: 34.65, t1: 37.4, style: "sub", text: "I can hold light. I can do anything." },

  { t0: 38.1, t1: 42.55, style: "who", text: "RAJU  ·  HIS BROTHER" },
  { t0: 38.25, t1: 41.35, style: "sub", text: "Every day he’d ask, “Mumbai’s for real, right?”" },
  { t0: 41.6, t1: 42.55, style: "sub", text: "Every time." },

  { t0: 43.1, t1: 51.3, style: "who", text: "VOICE NOTE  ·  NEVER HEARD" },
  { t0: 43.35, t1: 45.5, style: "sub", text: "They didn’t take him to a hospital." },
  { t0: 46.05, t1: 48.6, style: "sub", text: "Bhasin didn’t let anyone go." },
  { t0: 48.85, t1: 51.3, style: "sub", text: "They burned him, M." },

  { t0: 51.5, t1: 58.3, style: "who", text: "BHASIN  ·  VOICE MESSAGE" },
  { t0: 51.6, t1: 53.8, style: "sub", text: "Whoever has this phone." },
  { t0: 53.95, t1: 58.3, style: "sub", text: "Leave it at Gate 2 by seven in the morning." },

  { t0: 58.6, t1: 60.3, style: "who", text: "RAJU" },
  { t0: 58.7, t1: 60.3, style: "sub", text: "…is he alive?" },

  { t0: 60.7, t1: 62.2, style: "subMid", text: "If anything happens to me…" },
  { t0: 62.55, t1: 63.75, style: "subMid", text: "…it’s all on the phone." },

  { t0: 64.4, t1: 68.3, style: "chapter", text: "CHAPTER ONE  ·  DELHI" },
  { t0: 63.9, t1: 68.3, style: "title", text: "RAAKH" },
  { t0: 65.4, t1: 68.3, style: "tag", text: "A thriller you play on a phone." },

  { t0: 69.15, t1: 70.6, style: "subMid", text: "I lit the fire." },
];

export const HITS = [5.6, 28.0, 53.8, 58.2, 63.9];
