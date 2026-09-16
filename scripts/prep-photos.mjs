#!/usr/bin/env node
/**
 * The phone's photographs, prepared for the phone.
 *
 *   node scripts/prep-photos.mjs            # ~/Desktop/Found photos → public/found/photos
 *   node scripts/prep-photos.mjs --in <dir> # somewhere else
 *   node scripts/prep-photos.mjs --check    # what's shipped: sizes, and no metadata left
 *   node scripts/prep-photos.mjs --strip    # shipped files, in place: metadata off, nothing re-framed
 *
 * WHY A SCRIPT AND NOT "EXPORT SMALLER FROM PHOTOS"
 *
 * Every photo that lands here comes off a phone, and a phone's photo carries
 * where it was taken, when, on whose camera, and often which way up. That
 * metadata must never ship: the story's places are Parel and Lalbaug, but the
 * photographs are Siddhant's real street, and the game is played by strangers.
 * Rotating and re-encoding drops all of it (sharp copies no metadata unless
 * it's asked to), and `--check` proves it afterwards rather than trusting it.
 *
 * It also does the two things by hand that can't be automated away:
 *
 *   `blur`  Rectangles, in fractions of the image, painted out before the
 *           resize: a flat number on a letterbox, a name on a door, a plate.
 *           They're written per slot below, next to the photo they belong to.
 *
 *   `crop`  Where the story's frame isn't the camera's. A story is vertical
 *           whatever way it was shot.
 *
 * The target is a photo taken on a phone and looked at on a phone: 4:3, 720px
 * on the long edge (the frames are at most 400 CSS px, so that's a retina
 * screen's worth), and quality stepped down until it fits `MAX_KB`. The budget
 * (`npm run budget`) caps all of public/, and photographs are most of it.
 */

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/found/photos");
const DEFAULT_IN = join(homedir(), "Desktop", "Found photos");
/** Big enough for a retina phone screen, small enough to send over 4G. */
const LONG_EDGE = 720;
const MAX_KB = 130;

/**
 * Every slot the story has (PHOTOS.md), with what this script must do to it.
 * `shape`: landscape 4:3 unless it's a photo the phone holds upright.
 */
const SLOTS = {
  locker: { shape: "landscape" },
  van: { shape: "landscape" },
  cake: { shape: "landscape" },
  story: { shape: "story" },
  shoes: { shape: "portrait" },
  letterbox: { shape: "landscape", blur: [] },
  fuel: { shape: "landscape" },
  cinema: { shape: "landscape" },
  street: { shape: "landscape" },
  balcony: { shape: "landscape" },
  wallpaper: { shape: "wallpaper", out: join(ROOT, "public/found/wallpaper.jpg") },
};

const SHAPES = {
  landscape: { width: LONG_EDGE, height: Math.round((LONG_EDGE / 4) * 3) },
  portrait: { width: Math.round((LONG_EDGE / 4) * 3), height: LONG_EDGE },
  /** A story fills a phone screen. */
  story: { width: 540, height: 960 },
  wallpaper: { width: 675, height: 1200 },
};

const kb = (bytes) => Math.round(bytes / 1024);

/** Paint out a rectangle given in fractions of the image, before anything is scaled. */
async function blurOut(input, rects, { width, height }) {
  let image = sharp(input);
  for (const r of rects) {
    const box = {
      left: Math.round(r.x * width),
      top: Math.round(r.y * height),
      width: Math.round(r.w * width),
      height: Math.round(r.h * height),
    };
    const patch = await sharp(await image.clone().extract(box).toBuffer())
      .blur(Math.max(6, box.width / 12))
      .toBuffer();
    image = sharp(await image.composite([{ input: patch, left: box.left, top: box.top }]).toBuffer());
  }
  return image.toBuffer();
}

async function prepare(slot, file) {
  const spec = SLOTS[slot];
  const out = spec.out ?? join(OUT, `${slot}.jpg`);
  const meta = await sharp(file).metadata();
  // EXIF orientation is applied by `rotate()` and then thrown away with the
  // rest of the metadata, so a photo shot sideways ships the right way up.
  const upright = await sharp(file).rotate().toBuffer();
  const size = await sharp(upright).metadata();
  const source = spec.blur?.length ? await blurOut(upright, spec.blur, size) : upright;

  const { width, height } = SHAPES[spec.shape];
  let quality = 82;
  let data = null;
  while (quality >= 50) {
    data = await sharp(source).resize(width, height, { fit: "cover", position: "attention" }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (kb(data.length) <= MAX_KB) break;
    quality -= 6;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, data);
  const had = [meta.exif && "exif", meta.icc && "icc", meta.xmp && "xmp"].filter(Boolean);
  console.log(
    `  ${slot.padEnd(11)} ${String(meta.width)}×${meta.height} → ${width}×${height}  ${kb(data.length)}KB  q${quality}` +
      (had.length ? `  stripped: ${had.join(", ")}` : "") +
      (spec.blur?.length ? `  blurred: ${spec.blur.length}` : ""),
  );
}

/**
 * The photographs already in public/, in place: metadata off, and squeezed
 * under the cap. Nothing is re-framed, because a placeholder carried over
 * from the pilot has a composition someone chose and a size its slot's crop
 * would have to invent pixels for.
 */
async function strip() {
  for (const file of shipped()) {
    const meta = await sharp(file).metadata();
    const before = statSync(file).size;
    const carries = [meta.exif && "exif", meta.icc && "icc", meta.xmp && "xmp"].filter(Boolean);
    let quality = 82;
    let data = null;
    while (quality >= 50) {
      data = await sharp(file).rotate().jpeg({ quality, mozjpeg: true }).toBuffer();
      if (kb(data.length) <= MAX_KB) break;
      quality -= 6;
    }
    writeFileSync(file, data);
    console.log(
      `  ${file.replace(`${ROOT}/`, "").padEnd(34)} ${kb(before)}KB → ${kb(data.length)}KB  q${quality}` +
        (carries.length ? `  stripped: ${carries.join(", ")}` : "  (nothing to strip)"),
    );
  }
}

const shipped = () =>
  [...readdirSync(OUT).map((f) => join(OUT, f)), join(ROOT, "public/found/wallpaper.jpg")].filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(extname(f)),
  );

/** What's shipped: nothing may carry metadata, and nothing may be oversized. */
async function check() {
  const files = [...readdirSync(OUT).map((f) => join(OUT, f)), join(ROOT, "public/found/wallpaper.jpg")];
  let bad = 0;
  let total = 0;
  for (const file of files) {
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(extname(file))) continue;
    const meta = await sharp(file).metadata();
    const bytes = statSync(file).size;
    total += bytes;
    const carries = [meta.exif && "exif", meta.xmp && "xmp"].filter(Boolean);
    const heavy = kb(bytes) > MAX_KB;
    if (carries.length || heavy) bad++;
    console.log(
      `  ${file.replace(`${ROOT}/`, "").padEnd(34)} ${String(meta.width).padStart(4)}×${String(meta.height).padEnd(4)} ${String(kb(bytes)).padStart(4)}KB` +
        (carries.length ? `  ⚠ carries ${carries.join(", ")}` : "") +
        (heavy ? `  ⚠ over ${MAX_KB}KB` : ""),
    );
  }
  console.log(`\n  ${kb(total)}KB of photographs.`);
  if (bad) {
    console.error(`\n${bad} file(s) need re-running through this script.`);
    process.exitCode = 1;
  }
}

const args = process.argv.slice(2);
if (args.includes("--check")) {
  console.log("\nShipped photographs:\n");
  await check();
} else if (args.includes("--strip")) {
  console.log("\nIn place:\n");
  await strip();
  console.log("\nShipped photographs:\n");
  await check();
} else {
  const dir = args.includes("--in") ? args[args.indexOf("--in") + 1] : DEFAULT_IN;
  if (!existsSync(dir)) {
    console.error(`No photographs at ${dir}.\nPut them there named by slot (locker.jpg, van.jpg, …) — see PHOTOS.md.`);
    process.exit(1);
  }
  const found = readdirSync(dir).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f));
  const slots = found.map((f) => [f.replace(/\.[^.]+$/, "").toLowerCase(), join(dir, f)]).filter(([slot]) => slot in SLOTS);
  const unknown = found.length - slots.length;

  console.log(`\nFrom ${dir}:\n`);
  for (const [slot, file] of slots) await prepare(slot, file);
  if (!slots.length) console.log("  nothing named after a slot. See PHOTOS.md for the names.");
  if (unknown) console.log(`\n  ${unknown} file(s) ignored: not named after a slot.`);
  console.log("\nShipped photographs:\n");
  await check();
}
