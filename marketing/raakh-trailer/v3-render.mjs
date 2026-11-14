// node render.mjs <ffmpeg> [--stills t1,t2,...] [--from s --to s] [--out file]
import { chromium } from "playwright-core";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { FPS, LENGTH, W, H } from "./timeline.js";
const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, "..");
const args = process.argv.slice(2);
const FF = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream", "cache-control": "max-age=3600" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--force-color-profile=srgb", "--disable-lcd-text"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("console", m.text()); });
await page.goto(`http://127.0.0.1:${port}/v3/trailer.html`);
await page.evaluate(() => window.ready);
await page.waitForFunction(() => typeof window.renderAt === "function");
const stills = opt("--stills");
if (stills) {
  fs.mkdirSync(path.join(here, "stills"), { recursive: true });
  for (const t of stills.split(",").map(Number)) {
    await page.evaluate((t) => window.renderAt(t), t);
    await page.screenshot({ path: path.join(here, "stills", `t${t.toFixed(2).padStart(6, "0")}.jpg`), type: "jpeg", quality: 85 });
  }
} else {
  const from = Number(opt("--from", 0)), to = Number(opt("--to", LENGTH));
  const out = opt("--out", path.join(here, "out", "picture.mp4"));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const ff = spawn(FF, ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-tune", "grain", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  const n0 = Math.round(from * FPS), n1 = Math.round(to * FPS);
  const t0 = Date.now();
  for (let n = n0; n < n1; n++) {
    await page.evaluate((t) => window.renderAt(t), n / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (n % 120 === 0) console.log(`frame ${n}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log("wrote", out);
}
await browser.close();
server.close();
