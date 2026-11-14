import { SLOTS, FPS } from "./timeline.js";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const FF = process.argv[2];
const PROBE = process.argv[3];
const only = process.argv.slice(4);
const here = path.dirname(new URL(import.meta.url).pathname);
const G = {
  night: (e) => `eq=contrast=1.1:saturation=0.8:brightness=${e}:gamma=0.95,colorbalance=rs=-0.06:gs=-0.01:bs=0.08:rm=-0.03:bm=0.03:rh=0.06:gh=0.02:bh=-0.05`,
  cold: (e) => `eq=contrast=1.12:saturation=0.55:brightness=${e},colorbalance=rs=-0.08:bs=0.1:rm=-0.04:bm=0.05:bh=0.02`,
  fire: (e) => `eq=contrast=1.12:saturation=1.0:brightness=${e}:gamma=0.92,colorbalance=rs=-0.02:bs=0.03:rh=0.04:bh=-0.06`,
  day2night: (e) => `eq=contrast=1.15:saturation=0.45:brightness=${e}:gamma=0.72,colorbalance=rs=-0.12:bs=0.14:rm=-0.06:bm=0.08:rh=-0.04:bh=0.06,vignette=PI/3.2`,
};
for (const s of Object.values(SLOTS)) {
  if (only.length && !only.includes(s.id)) continue;
  const file = path.resolve(here, s.file);
  const total = Number(execFileSync(PROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
  const start = Math.min(s.in, Math.max(0, total - s.dur - 0.05));
  const out = path.join(here, "frames", s.id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const vf = [
    `setpts=PTS/${s.speed}`,
    `fps=${FPS}`,
    "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos",
    "crop=1920:1080",
    G[s.grade](s.exp),
    "curves=master='0/0.025 0.5/0.47 1/0.95'",
  ].join(",");
  execFileSync(FF, ["-nostdin", "-v", "error", "-y", "-ss", String(start), "-t", String(s.dur), "-i", file, "-vf", vf, "-q:v", "2", path.join(out, "%05d.jpg")]);
  const n = fs.readdirSync(out).length;
  console.log(s.id.padEnd(11), `src ${total.toFixed(1)}s from ${start.toFixed(2)} → ${n} frames (${(n / FPS).toFixed(2)}s)`);
}
