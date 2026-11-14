// node render-inserts.mjs [--stills] [names...]  → inserts/out/<name>.mp4 (1920x1080, 24 fps, no audio)
import { chromium } from "../../v5/node_modules/playwright-core/index.mjs";
import ffmpegPath from "../../v5/node_modules/ffmpeg-static/index.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const FPS = 24, W = 1920, H = 1080;
const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, "../../../..");
const args = process.argv.slice(2);
const stills = args.includes("--stills");
const names = args.filter((a) => !a.startsWith("--"));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/marketing/raakh-trailer/v6/inserts/trailer.html`);
await page.waitForFunction(() => typeof window.renderAt === "function");
await page.evaluate(() => window.ready);
const durs = await page.evaluate(() => window.INSERT_DURS);
const list = names.length ? names : Object.keys(durs);
fs.mkdirSync(path.join(here, "out"), { recursive: true });
for (const name of list) {
  const dur = await page.evaluate((n) => window.setInsert(n), name);
  if (stills) {
    await page.evaluate((t) => window.renderAt(t), dur * 0.5);
    await page.screenshot({ path: path.join(here, "out", `${name}.jpg`), type: "jpeg", quality: 88 });
    console.log("still", name); continue;
  }
  const out = path.join(here, "out", `${name}.mp4`);
  const ff = spawn(ffmpegPath, ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "fast", "-crf", "12", "-pix_fmt", "yuv420p", out], { stdio: ["pipe", "inherit", "inherit"] });
  const n1 = Math.round(dur * FPS);
  for (let n = 0; n < n1; n++) {
    await page.evaluate((t) => window.renderAt(t), n / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log("wrote", name, dur + "s");
}
await browser.close();
server.close();
