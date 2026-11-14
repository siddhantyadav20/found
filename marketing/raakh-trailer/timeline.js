// Raakh — "Return to Origin" trailer. The cut, as data.
// Times in seconds at 24 fps, 1920×1080, 2.39:1 bars. Used by prep.mjs (footage),
// trailer.html (picture) and mix.py (sound, through cues.json).

export const FPS = 24;
export const W = 1920, H = 1080;
export const LENGTH = 100.8;

const SRC = "../src/";       // Pexels HD footage, by id
const UI = "../ui/";         // real screens from the live game

// ---------------------------------------------------------------------------
// Footage slots: one graded, trimmed frame folder each.
// grade: night (teal shadows, warm highlights), fire (keeps its colour), cold, day2night
export const SLOTS = {
  fog:        { src: "11789203", in: 2.0, dur: 5.0, speed: 0.85, grade: "night", exp: -0.02 },
  corridor:   { src: "9658661", in: 9.0, dur: 4.2, speed: 1.0, grade: "cold", exp: -0.10 },
  parcel:     { src: "6667264", in: 2.2, dur: 2.4, speed: 0.9, grade: "day2night", exp: -0.18 },
  letters:    { src: "7821643", in: 3.4, dur: 3.4, speed: 1.0, grade: "night", exp: -0.06 },
  hands:      { src: "13358555", in: 3.0, dur: 3.8, speed: 0.9, grade: "night", exp: 0.0 },
  havan:      { src: "15157547", in: 2.0, dur: 1.2, speed: 1.0, grade: "fire", exp: 0.0 },
  pheras:     { src: "15157549", in: 8.0, dur: 1.2, speed: 1.0, grade: "fire", exp: -0.04 },
  fountain:   { src: "18295465", in: 9.5, dur: 0.8, speed: 1.0, grade: "fire", exp: 0.0 },
  chunni:     { src: "15157545", in: 1.0, dur: 0.8, speed: 1.0, grade: "fire", exp: 0.0 },
  havan2:     { src: "15157496", in: 2.0, dur: 0.8, speed: 1.0, grade: "fire", exp: 0.0 },
  rice:       { src: "15157543", in: 0.6, dur: 0.8, speed: 1.0, grade: "fire", exp: 0.0 },
  aarti:      { src: "13953530", in: 6.0, dur: 0.8, speed: 1.0, grade: "fire", exp: -0.04 },
  reel:       { src: "12298744", in: 1.0, dur: 2.6, speed: 0.6, grade: "fire", exp: -0.10 },
  gun:        { src: "5243197", in: 4.6, dur: 2.2, speed: 0.75, grade: "cold", exp: -0.12 },
  rider:      { src: "10597765", in: 1.0, dur: 5.0, speed: 0.85, grade: "night", exp: -0.04 },
  headlights: { src: "13643105", in: 1.0, dur: 4.4, speed: 0.9, grade: "cold", exp: -0.04 },
  street:     { src: "11839649", in: 1.0, dur: 1.6, speed: 1.0, grade: "night", exp: 0.04 },
  tube:       { src: "4761733", in: 3.0, dur: 1.4, speed: 1.0, grade: "cold", exp: -0.06 },
  station:    { src: "14259308", in: 6.0, dur: 1.2, speed: 1.0, grade: "night", exp: -0.06 },
  fire1:      { src: "9121388", in: 3.0, dur: 1.0, speed: 1.0, grade: "fire", exp: 0.0 },
  window:     { src: "15928110", in: 8.0, dur: 1.0, speed: 1.0, grade: "cold", exp: -0.04 },
  torch:      { src: "18359612", in: 0.5, dur: 0.9, speed: 1.0, grade: "cold", exp: 0.06 },
  fire2:      { src: "12165392", in: 2.0, dur: 0.7, speed: 1.0, grade: "fire", exp: 0.0 },
  lights:     { src: "20319188", in: 3.0, dur: 0.6, speed: 1.0, grade: "night", exp: 0.08 },
  alarm:      { src: "1190185", in: 1.0, dur: 0.6, speed: 1.0, grade: "night", exp: 0.04 },
  fire3:      { src: "11788473", in: 4.0, dur: 0.5, speed: 1.0, grade: "fire", exp: 0.0 },
  corridor2:  { src: "7598737", in: 3.0, dur: 0.5, speed: 1.0, grade: "cold", exp: 0.04 },
  embers1:    { src: "13220869", in: 6.0, dur: 0.5, speed: 1.0, grade: "fire", exp: 0.04 },
  rain2:      { src: "4458845", in: 5.0, dur: 2.6, speed: 0.85, grade: "night", exp: -0.04 },
  rain:       { src: "4458845", in: 3.0, dur: 0.5, speed: 1.0, grade: "night", exp: 0.0 },
  sparks:     { src: "12298312", in: 3.0, dur: 0.5, speed: 1.0, grade: "fire", exp: 0.0 },
  embers2:    { src: "9667285", in: 40.0, dur: 0.5, speed: 1.0, grade: "fire", exp: 0.04 },
  skyline:    { src: "4538212", in: 4.0, dur: 0.5, speed: 1.0, grade: "cold", exp: 0.0 },
  fire4:      { src: "12165393", in: 4.0, dur: 0.5, speed: 1.0, grade: "fire", exp: 0.0 },
  title:      { src: "5155376", in: 4.0, dur: 11.6, speed: 0.7, grade: "fire", exp: -0.08 },
};
for (const [k, s] of Object.entries(SLOTS)) s.file = SRC + s.src + ".mp4", s.id = k;

// ---------------------------------------------------------------------------
// Picture, bottom to top. `clip` plays a slot from its first frame at t0.
// zoom: push-in scale a→b; pan: [dx0,dy0,dx1,dy1] in % of frame; blur: px a→b.
// fade: [in, out] seconds to/from black.
const c = (t0, t1, slot, o = {}) => ({ kind: "clip", t0, t1, slot, zoom: [1.02, 1.08], ...o });
// A real game screen in a phone. focus: point of the 1170×2532 screenshot that sits
// at frame centre (a→b); scale a→b (screen px per image px); tilt: rotateY deg a→b.
const u = (t0, t1, img, o = {}) => ({ kind: "ui", t0, t1, img: UI + img, ...o });

export const SHOTS = [
  // I. COLD OPEN — black. A call nobody answers properly.
  // II. THE PARCEL
  c(8.2, 12.6, "fog", { zoom: [1.04, 1.14], fade: [1.4, 0] }),
  c(12.6, 16.4, "corridor", { zoom: [1.0, 1.1] }),
  c(16.4, 18.4, "parcel", { zoom: [1.12, 1.2], pan: [0, 4, 0, 2] }),
  { kind: "black", t0: 18.4, t1: 19.6 },
  c(19.6, 22.6, "letters", { zoom: [1.16, 1.3], pan: [0, 0, -2, -2] }),
  u(22.6, 25.0, "g-start.png", { focus: [[585, 1500], [585, 1880]], scale: [0.62, 0.92], tilt: [-14, -6], blur: [6, 0], glow: 0.5 }),
  // III. WHAT IS ON IT
  u(25.0, 26.3, "e-01-ringing.png", { focus: [[585, 1150], [585, 1150]], scale: [0.5, 0.56], tilt: [10, 6], glow: 0.25 }),
  c(26.3, 29.6, "hands", { zoom: [1.04, 1.12] }),
  u(29.6, 31.0, "b-03-m.png", { at: [1340, 540], focus: [[585, 1000], [585, 1150]], scale: [0.6, 0.64], tilt: [-12, -8], dim: 0.15 }),
  // the wedding, on the beat (129 bpm: 0.465 s)
  c(31.0, 31.93, "havan", { zoom: [1.06, 1.1] }),
  c(31.93, 32.86, "pheras", { zoom: [1.06, 1.1] }),
  c(32.86, 33.33, "fountain", { zoom: [1.1, 1.14] }),
  c(33.33, 33.79, "chunni", { zoom: [1.08, 1.12] }),
  c(33.79, 34.26, "havan2", { zoom: [1.1, 1.14] }),
  u(34.26, 34.72, "d-01-photos.png", { focus: [[585, 900], [585, 960]], scale: [0.9, 0.95], tilt: [0, 0] }),
  c(34.72, 35.18, "rice", { zoom: [1.1, 1.14] }),
  c(35.18, 35.65, "aarti", { zoom: [1.1, 1.16] }),
  // the reel: a lawn's lights, out of focus; then a hand and a gun
  c(35.65, 37.9, "reel", { zoom: [1.2, 1.26], blur: [14, 18], dim: 0.35 }),
  c(37.9, 39.75, "gun", { zoom: [1.12, 1.26], pan: [-3, 0, -6, 0] }),
  { kind: "flash", t0: 39.75, t1: 39.84 },
  { kind: "black", t0: 39.84, t1: 42.0 },
  c(42.0, 46.4, "rider", { zoom: [1.04, 1.12], fade: [0.8, 0] }),
  u(46.4, 49.0, "b-02-raju.png", { at: [1380, 560], focus: [[585, 560], [585, 600]], scale: [0.8, 0.88], tilt: [-12, -7], blur: [3, 0] }),
  // IV. HOW YOU PLAY
  { kind: "black", t0: 49.0, t1: 51.0 },
  u(51.0, 53.6, "a-02-wa.png", { at: [1330, 540], focus: [[585, 1050], [585, 1300]], scale: [0.6, 0.64], tilt: [-14, -8], glow: 0.2 }),
  u(53.6, 56.6, "b-03-m.png", { at: [1330, 540], focus: [[585, 760], [585, 820]], scale: [0.78, 0.84], tilt: [-12, -7], blur: [4, 0] }),
  u(56.6, 59.4, "h-01-banyan1.png", { at: [1420, 540], focus: [[585, 700], [585, 720]], scale: [0.72, 0.78], tilt: [-12, -7], blur: [5, 0] }),
  u(59.4, 62.2, "c-01-case.png", { at: [1330, 540], focus: [[585, 820], [585, 880]], scale: [0.78, 0.84], tilt: [-12, -7] }),
  c(62.2, 64.4, "headlights", { zoom: [1.04, 1.12] }),
  u(64.4, 66.6, "g-01-lock3.png", { at: [1330, 540], focus: [[585, 1450], [585, 1520]], scale: [0.7, 0.76], tilt: [-12, -8], glow: 0.4 }),
  c(66.6, 68.8, "rain2", { zoom: [1.06, 1.12], dim: 0.15 }),
  // V. THE NIGHT, FASTER
  c(68.8, 70.2, "street", { zoom: [1.04, 1.1] }),
  c(70.2, 71.4, "tube", { zoom: [1.04, 1.1] }),
  c(71.4, 72.4, "station", { zoom: [1.06, 1.12] }),
  c(72.4, 73.3, "fire1", { zoom: [1.06, 1.12] }),
  c(73.3, 74.1, "window", { zoom: [1.06, 1.12] }),
  c(74.1, 74.8, "torch", { zoom: [1.06, 1.12] }),
  c(74.8, 75.4, "fire2", { zoom: [1.08, 1.14] }),
  c(75.4, 75.9, "lights", { zoom: [1.1, 1.16] }),
  c(75.9, 76.35, "alarm", { zoom: [1.1, 1.18] }),
  c(76.35, 76.75, "fire3", { zoom: [1.1, 1.16] }),
  c(76.75, 77.1, "corridor2", { zoom: [1.1, 1.16] }),
  c(77.1, 77.4, "embers1", { zoom: [1.1, 1.16] }),
  u(77.4, 77.7, "g-start.png", { focus: [[585, 1860], [585, 1860]], scale: [1.3, 1.36], tilt: [0, 0] }),
  c(77.7, 77.95, "rain", { zoom: [1.1, 1.14] }),
  c(77.95, 78.2, "sparks", { zoom: [1.1, 1.14] }),
  c(78.2, 78.42, "embers2", { zoom: [1.1, 1.14] }),
  c(78.42, 78.64, "skyline", { zoom: [1.1, 1.14] }),
  c(78.64, 78.84, "fire4", { zoom: [1.1, 1.14] }),
  u(78.84, 79.02, "h-01-banyan1.png", { focus: [[585, 620], [585, 620]], scale: [1.6, 1.6], tilt: [0, 0] }),
  c(79.02, 79.2, "fire1", { zoom: [1.2, 1.24] }),
  c(79.2, 79.36, "station", { zoom: [1.2, 1.24] }),
  c(79.36, 79.52, "tube", { zoom: [1.2, 1.24] }),
  c(79.52, 79.66, "fire2", { zoom: [1.2, 1.24] }),
  c(79.66, 79.8, "torch", { zoom: [1.2, 1.24] }),
  { kind: "flash", t0: 79.8, t1: 79.88 },
  { kind: "black", t0: 79.88, t1: 89.6 },
  // VI. TITLE
  c(89.6, 100.8, "title", { zoom: [1.0, 1.12], dim: 0.15, fade: [0, 1.2] }),
];

// ---------------------------------------------------------------------------
// Words. type: typed on, a key at a time (sounds in mix). style: see trailer.html.
export const TEXTS = [
  // the call, in the dark
  { t0: 2.6, t1: 7.5, style: "who", text: "INCOMING CALL  ·  +91 62••• •4417" },
  { t0: 2.95, t1: 5.0, style: "sub", text: "Hello? Sameer bhaiya?" },
  { t0: 5.75, t1: 7.2, style: "sub", text: "Where’s Dilip?" },
  // the parcel
  { t0: 9.2, t1: 12.4, style: "label", type: true, text: "DELHI  ·  SATURDAY 28 NOVEMBER  ·  11:40 PM" },
  { t0: 13.4, t1: 16.2, style: "line", text: "On Saturday night, a parcel came back." },
  { t0: 18.45, t1: 19.6, style: "stamp", text: "RETURN TO ORIGIN", sub: "REFUSED BY ADDRESSEE  ·  KALKAJI  ·  11:10 AM" },
  { t0: 20.0, t1: 22.4, style: "line left", text: "Inside, a phone." },
  { t0: 21.2, t1: 22.4, style: "label2 left", type: true, text: "NO PASSCODE." },
  // what is on it
  { t0: 25.0, t1: 26.25, style: "who", text: "M  ·  CALLING" },
  { t0: 26.5, t1: 28.7, style: "who", text: "M" },
  { t0: 26.55, t1: 28.7, style: "sub", text: "Don’t delete anything." },
  { t0: 29.8, t1: 31.0, style: "line left", text: "On it,<br>the night of a wedding." },
  { t0: 35.85, t1: 37.95, style: "who", text: "DILIP  ·  12:31 AM" },
  { t0: 35.9, t1: 37.95, style: "sub", text: "Bhaiya… Mumbai’s for real, right?" },
  { t0: 38.05, t1: 39.7, style: "who", text: "SAMEER" },
  { t0: 38.1, t1: 39.7, style: "sub", text: "For real. Now don’t move." },
  { t0: 40.2, t1: 41.4, style: "label2", text: "12:32 AM" },
  { t0: 41.7, t1: 46.1, style: "who", text: "RAJU MAHTO  ·  HIS BROTHER" },
  { t0: 46.15, t1: 47.5, style: "who left", text: "RAJU MAHTO  ·  HIS BROTHER" },
  { t0: 41.75, t1: 45.8, style: "sub", text: "He asked every day: “Mumbai’s for real, right?” Every time." },
  { t0: 46.2, t1: 47.5, style: "sub left", text: "For real, for real." },
  { t0: 47.65, t1: 49.0, style: "line left", text: "Dilip Kumar Mahto, 19,<br>never came home." },
  // how you play
  { t0: 49.25, t1: 50.95, style: "slam", text: "YOU HAVE<br>HIS PHONE." },
  { t0: 51.3, t1: 53.5, style: "caption", type: true, text: "READ HIS CHATS." },
  { t0: 53.9, t1: 56.5, style: "caption", type: true, text: "HEAR WHAT SHE NEVER HEARD." },
  { t0: 54.0, t1: 56.85, style: "who left", text: "VOICE NOTE  ·  NOT DELIVERED" },
  { t0: 54.05, t1: 56.85, style: "sub left", text: "If anything happens to me…<br>it’s all on the phone." },
  { t0: 56.9, t1: 59.3, style: "caption", type: true, text: "FIND WHAT THEY TRIED TO ERASE." },
  { t0: 59.7, t1: 62.1, style: "caption", type: true, text: "PROVE WHAT HAPPENED." },
  { t0: 62.4, t1: 64.4, style: "who", text: "BHASIN UNCLE  ·  VOICE MESSAGE" },
  { t0: 64.45, t1: 68.7, style: "who left", text: "BHASIN UNCLE  ·  VOICE MESSAGE" },
  { t0: 62.45, t1: 64.45, style: "sub", text: "Whoever has this phone." },
  { t0: 64.7, t1: 68.7, style: "sub left", text: "Leave it at Gate 2 by seven." },
  // the night, faster: that night's own times
  { t0: 69.0, t1: 70.1, style: "time", text: "11:52 PM" },
  { t0: 70.3, t1: 71.3, style: "time", text: "12:32 AM" },
  { t0: 72.45, t1: 73.25, style: "time", text: "1:52 AM" },
  { t0: 73.0, t1: 74.0, style: "who", text: "RAJU" },
  { t0: 73.05, t1: 74.0, style: "sub", text: "…is he alive?" },
  { t0: 74.15, t1: 74.75, style: "time", text: "2:55 AM" },
  { t0: 75.45, t1: 75.85, style: "time", text: "3:31 AM" },
  { t0: 76.4, t1: 76.75, style: "time", text: "4:47 AM" },
  // the turn
  { t0: 81.0, t1: 85.2, style: "quiet", text: "By four in the morning you’ll know who fired, who lied,<br>and who is still alive." },
  { t0: 86.0, t1: 89.3, style: "quiet", text: "Then the phone tells you<br><em>whose door this is.</em>" },
  // title
  { t0: 89.6, t1: 96.2, style: "title", text: "RAAKH" },
  { t0: 90.4, t1: 96.2, style: "presents", text: "" },
  { t0: 91.4, t1: 96.2, style: "chapter", text: "CHAPTER ONE  ·  DELHI" },
  { t0: 93.0, t1: 96.2, style: "tag", text: "A thriller you play on somebody else’s phone." },
  { t0: 96.6, t1: 100.8, style: "end", text: "" },
];

// Flashes are in SHOTS; shake on these hits.
export const HITS = [18.45, 39.75, 49.25, 79.8, 89.6];
