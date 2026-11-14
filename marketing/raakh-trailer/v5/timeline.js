// RAAKH trailer v5: the edit as data. Plain data only: render.mjs (node) and
// trailer.html (browser) both import it. Times are trailer seconds.
export const FPS = 24, W = 1920, H = 1080;
export const SW = 432, SH = 936; // the phone's screen, in layout px

// ---- Marks: one place for every moment the sound and the picture share ----
export const M = {
  lightOn: 0.6,
  buzz1: 1.3, buzz2: 2.15,
  answer: 2.9,
  rajuA: 3.0,            // "Hello? Sameer bhaiya?"  (file speech 0.15-1.9)
  rajuB: 5.15,           // "Dilip kahan hai?"        (file speech 0.15-1.25)
  act1: 6.7,
  ig: 6.7, reel: 10.1, k3: 13.5,
  shot: 18.5,            // k-3 frame 121 (clip 5.00 s) is the flash
  card1: [19.9, 22.6],   // ONE BOY DIDN'T GO HOME.
  act2: 23.0,
  poster: 23.0, rajuMsg: 26.4, mNote: 28.6,
  mVoice: 28.9,          // voice-m-1, file 5.0-12.6
  boom1: 33.2, sethi: 34.6,
  boom2: 37.6, m2Voice: 38.0, bhasinChat: 39.0,   // voice-m-2, file 0.5-7.3
  boom3: 42.0, locked: 43.4,
  casefile: 46.4, meera: 47.6,                      // prev-meera-delete, file 0.1-1.7
  card5: [50.4, 52.6],   // FIND OUT WHAT THEY DID.
  act3: 52.6,
  bhasinVN: 52.6, bVoice1: 52.9, bVoice3: 55.6, bVoice4: 61.0,
  battery: 58.0, call: 59.6, montage: 62.8,
  drop: 68.6,
  zinda: 69.4,           // msg-r-9, file 0.6-2.0
  title: 72.6,
  end: 77.4,
  tag: 82.4, tagLight: 83.0,
  out: 85.0,
};
export const LENGTH = 85.5;

// ---- The montage: the night in the phone's own pictures, each cut shorter ----
// kind: img | fire | lock | poster | battery | black
export const MONTAGE = [
  ["img", "w-kunal", 0.9],
  ["black", null, 0.08],
  ["img", "key-lawn", 0.75],
  ["img", "kunal-frame", 0.55],
  ["black", null, 0.08],
  ["fire", null, 0.5],
  ["lock", null, 0.42],
  ["img", "w-blur", 0.34],
  ["poster", null, 0.3],
  ["fire", null, 0.26],
  ["img", "kunal-frame", 0.22],
  ["battery", 1, 0.22],
  ["img", "w-kunal", 0.18],
  ["black", null, 0.06],
  ["fire", null, 0.14],
  ["lock", null, 0.12],
  ["img", "key-lawn", 0.1],
  ["black", null, 0.5],
];

// ---- Cards (tracked capitals). kind: pic (over the picture) | blk (on black) ----
export const CARDS = [
  { t: [7.3, 9.9], kind: "pic", text: "21 NOVEMBER. BANYAN FARMS." },
  { t: [14.6, 17.9], kind: "pic", text: "EVERY PHONE WAS RECORDING." },
  { t: M.card1, kind: "blk", text: "ONE BOY DIDN'T GO HOME." },
  { t: [M.boom1, M.sethi], kind: "blk", text: "NO POLICE." },
  { t: [M.boom2, M.bhasinChat], kind: "blk", text: "NO HOSPITAL." },
  { t: [M.boom3, M.locked], kind: "blk", text: "NO BODY." },
  { t: M.card5, kind: "blk", text: "FIND OUT WHAT THEY DID." },
];

// ---- Subtitles (English, for what is heard in Hindi) ----
export const SUBS = [
  { t: [3.1, 5.0], text: "Hello? Sameer bhaiya?" },
  { t: [5.25, 6.65], text: "Where’s Dilip?" },
  { t: [29.1, 33.0], text: "Last night, at the wedding… Kunal was firing." },
  { t: [35.0, 37.4], text: "A boy fell." },
  { t: [38.5, 41.0], text: "They didn’t take him to a hospital." },
  { t: [42.1, 45.6], text: "Bhasin didn’t let anyone leave." },
  { t: [47.8, 49.6], text: "Don’t delete anything." },
  { t: [53.0, 55.4], text: "Whoever has this phone." },
  { t: [55.7, 60.9], text: "Leave it at Gate 2 by seven in the morning." },
  { t: [61.1, 63.0], text: "We’ll handle the rest." },
  { t: [70.2, 72.3], text: "…Is he alive?" },
];
