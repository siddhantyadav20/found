/* Renders teaser.html into a 1080×1920 Reel, frame by frame, with its sound.

     node marketing/teaser/render.mjs            → marketing/teaser/out/shagun-teaser.mp4
     node marketing/teaser/render.mjs --stills   → a PNG every couple of seconds, to check the cut

   Needs Playwright (Chromium) and ffmpeg on the PATH. */

import { spawn, execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = (() => {
  try {
    return require("playwright");
  } catch {
    // A global install (npm i -g playwright).
    const root = execFileSync("npm", ["root", "-g"]).toString().trim();
    return require(path.join(root, "playwright"));
  }
})();

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "out");
mkdirSync(out, { recursive: true });

const FPS = 30;
const stills = process.argv.includes("--stills");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(here, "teaser.html")).href);
await page.evaluate(() => document.fonts.ready);
const { DURATION, SCENES } = await page.evaluate(() => window.TEASER);

if (stills) {
  const times = Object.values(SCENES).map(([a, b]) => +(a + (b - a) * 0.7).toFixed(2));
  for (const t of times) {
    await page.evaluate((t) => window.renderAt(t), t);
    await page.screenshot({ path: path.join(out, `still-${t.toFixed(2)}.png`) });
  }
  console.log(`stills → ${out}`);
  await browser.close();
  process.exit(0);
}

const silent = path.join(out, "video.mp4");
const ff = spawn(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
   "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", silent],
  { stdio: ["pipe", "inherit", "inherit"] },
);

const frames = Math.round(DURATION * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.renderAt(t), i / FPS);
  const jpg = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % FPS === 0) process.stdout.write(`\r${(i / FPS).toFixed(0)}s / ${DURATION}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("\nframes done");

// The sound, cut to the same list.
execFileSync("python3", [path.join(here, "sound.py"), JSON.stringify({ SCENES, DURATION }), path.join(out, "sound.wav")], { stdio: "inherit" });

const final = path.join(out, "shagun-teaser.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", silent, "-i", path.join(out, "sound.wav"),
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final], { stdio: "inherit" });
console.log(`→ ${final}`);
