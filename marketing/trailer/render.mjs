/* Renders trailer.html into a 1080×1920 Reel, frame by frame, with its sound.

     node marketing/trailer/render.mjs              → marketing/trailer/out/shagun-trailer.mp4
     node marketing/trailer/render.mjs --stills     → a PNG in each shot and card, to check the cut
     node marketing/trailer/render.mjs --from 30    → only from 30 s on (a quick look at the end)

   Footage: drop a clip at footage/<slot>.mp4 (slots are in edit.json and
   SHOTLIST.md) and it replaces that slot's stand-in on the next render.

   Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy. */

import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = (() => {
  try {
    return require("playwright");
  } catch {
    const root = execFileSync("npm", ["root", "-g"]).toString().trim();
    return require(path.join(root, "playwright"));
  }
})();

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "out");
mkdirSync(out, { recursive: true });
const EDIT = JSON.parse(readFileSync(path.join(here, "edit.json"), "utf8"));
const stills = process.argv.includes("--stills");
const from = process.argv.includes("--from") ? Number(process.argv[process.argv.indexOf("--from") + 1]) : 0;

// Footage → graded-later JPEG frames, cropped to the picture's size.
const FOOTAGE = {};
const footDir = path.join(here, "footage");
if (existsSync(footDir)) {
  for (const file of readdirSync(footDir)) {
    const m = file.match(/^(.+)\.(mp4|mov|webm|mkv)$/i);
    if (!m) continue;
    const slot = m[1];
    const dir = path.join(out, "frames", slot);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      execFileSync("ffmpeg", ["-loglevel", "error", "-i", path.join(footDir, file), "-t", "12",
        "-vf", `fps=${EDIT.fps},scale=1220:2060:force_original_aspect_ratio=increase,crop=1220:2060`,
        "-q:v", "3", path.join(dir, "%05d.jpg")], { stdio: "inherit" });
    }
    FOOTAGE[slot] = { dir: `out/frames/${slot}`, frames: readdirSync(dir).length };
  }
}
console.log(`footage: ${Object.keys(FOOTAGE).join(", ") || "none yet, stand-ins throughout"}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.addInitScript(([e, f]) => { window.EDIT = e; window.FOOTAGE = f; }, [EDIT, FOOTAGE]);
await page.goto(pathToFileURL(path.join(here, "trailer.html")).href);
await page.evaluate(() => document.fonts.ready);

// Every frame waits for its picture to be decoded before it's taken.
const draw = (t) => page.evaluate(async (t) => {
  window.renderAt(t);
  const bg = getComputedStyle(document.getElementById("pic")).backgroundImage.match(/url\("(.*)"\)/);
  if (bg) { const img = new Image(); img.src = bg[1]; await img.decode().catch(() => {}); }
}, t);

if (stills) {
  const times = [...EDIT.shots.filter((s) => s.t1 - s.t0 > .5), ...EDIT.cards].map((x) => +(x.t0 + (x.t1 - x.t0) * .6).toFixed(2)).sort((a, b) => a - b);
  rmSync(path.join(out, "stills"), { recursive: true, force: true });
  mkdirSync(path.join(out, "stills"));
  for (const t of times) {
    await draw(t);
    await page.screenshot({ path: path.join(out, "stills", `${t.toFixed(2).padStart(6, "0")}.png`) });
  }
  console.log(`${times.length} stills → ${path.join(out, "stills")}`);
  await browser.close();
  process.exit(0);
}

const silent = path.join(out, "video.mp4");
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(EDIT.fps), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-tune", "grain", "-pix_fmt", "yuv420p", "-movflags", "+faststart", silent],
  { stdio: ["pipe", "inherit", "inherit"] });
const frames = Math.round(EDIT.duration * EDIT.fps);
for (let i = Math.round(from * EDIT.fps); i < frames; i++) {
  await draw(i / EDIT.fps);
  const jpg = await page.screenshot({ type: "jpeg", quality: 94 });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % EDIT.fps === 0) process.stdout.write(`\r${i / EDIT.fps}s / ${EDIT.duration}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("\nframes done");

const wav = path.join(out, "sound.wav");
execFileSync("python3", [path.join(here, "sound.py"), path.join(here, "edit.json"), wav], { stdio: "inherit" });
const final = path.join(out, from ? "preview.mp4" : "shagun-trailer.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", silent, "-ss", String(from), "-i", wav,
  "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", final], { stdio: "inherit" });
console.log(`→ ${final}`);
