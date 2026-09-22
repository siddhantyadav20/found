#!/usr/bin/env node
/**
 * Fail the build when the site gets heavier than it is allowed to be.
 *
 * WHY THIS AND NOT LIGHTHOUSE CI
 *
 * `app/vitals.tsx` already measures Core Web Vitals on real visits, which is
 * the answer rather than a hypothesis — a synthetic run on a wired connection
 * is least likely to catch exactly the heavy things on this site. What real
 * user monitoring cannot do is *stop* a regression: it reports one after
 * strangers have already paid for it.
 *
 * So this is the other half, and it is deliberately narrow. It checks the two
 * numbers that actually move here:
 *
 *   1. The JavaScript the homepage ships. The whole architecture is a server
 *      component with a few client islands, and the way that erodes is one
 *      island at a time, invisibly.
 *
 *   2. Every file in `public/`. This is the one that has already happened: 35MB
 *      of full-length audio, an 8.7MB video and a 2.1MB GIF all landed in the
 *      repo without anything objecting. A budget would have objected.
 *
 * Run after `next build`, which is where the numbers come from.
 *
 *   node scripts/check-budget.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The budgets.
 *
 * Set a little above where the site sits today, not at a round number — a
 * budget with no headroom fails on noise and gets raised until it means
 * nothing, and one with too much never fires. Raise these deliberately, in a
 * commit that says what bought the increase.
 */
const BUDGET = {
  /**
   * The homepage's client JavaScript, in KB, uncompressed — the same basis
   * Next's own build table uses, minus the one chunk that basis over-counts.
   *
   * Inherited from the portfolio (428KB there, ~379KB of it the React and
   * Next runtime). Found's page is one big client island, so re-measure
   * after the first build and set this a little above what it prints.
   *
   * WHAT IS NOT IN THIS NUMBER, AND WHY
   *
   * Next also emits a ~110KB polyfill chunk, and this check used to add it in
   * — which made the reported figure 538KB and the headroom mean much less
   * than it looked. No visitor pays it. The chunk is linked with `noModule`,
   * so every browser that understands `<script type="module">` skips it, and
   * Next's default browserslist target is already Chrome/Edge/Firefox 111 and
   * Safari 16.4. It exists for browsers this site does not have.
   *
   * That is the same reasoning `homepageJsBytes` already applies when it
   * deduplicates a chunk shared between the layout and the page: report the
   * number a real visitor is charged, not the number the build produced. It is
   * still measured and still printed, on its own line, so it cannot grow
   * unwatched — it just does not eat this budget.
   */
  homepageJs: 480,
  /**
   * Every route a player lands on, in KB uncompressed: the layout's chunks
   * plus the page's own (ROADMAP P12). Measured 2026-09-19 at 495 / 646 /
   * 472; the case page is the whole phone and every app on it.
   */
  routes: { "/": 540, "/c/[case]": 700 },
  /** The largest single file allowed in `public/`, in KB. */
  asset: 1200,
  /**
   * Everything in `public/` together, in MB. About 1.1MB today: Episodes 1
   * and 2's photographs, two memos and the buzz. Raise it deliberately, in
   * the commit that adds an episode's assets.
   */
  publicTotal: 3,
};

/** Files that are allowed to be over `asset`, and why. Anything not on this
 *  list has to fit the budget or earn a line here. */
const ALLOWED_LARGE = {};

const KB = 1024;
const MB = 1024 * 1024;
const failures = [];
const notes = [];

/* --- 1. The homepage's JavaScript ------------------------------------------
   Read off the build manifests rather than the terminal output, so this works
   in CI where nobody is reading a table. */

function homepageJsBytes() {
  const dir = join(ROOT, ".next");
  if (!existsSync(dir)) {
    failures.push("No .next directory — run `next build` first.");
    return null;
  }

  /* Turbopack writes a build manifest per route rather than the single
     `app-build-manifest.json` the webpack builder produced. The homepage's
     lives here, and `rootMainFiles` is what the document actually links. */
  const manifestPath = join(dir, "server", "app", "page", "build-manifest.json");
  if (!existsSync(manifestPath)) {
    failures.push(
      "No build manifest for `/` at .next/server/app/page/build-manifest.json. " +
        "Next's layout changed — this check needs updating rather than " +
        "skipping, so it fails loudly instead of passing quietly.",
    );
    return null;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const modern = manifest.rootMainFiles ?? [];
  const polyfill = manifest.polyfillFiles ?? [];
  if (modern.length === 0) {
    failures.push("The homepage's build manifest lists no chunks.");
    return null;
  }

  // Deduplicated: a chunk shared between the layout and the page is downloaded
  // once, so counting it twice would report a number no visitor ever pays.
  const bytes = (files) => {
    let total = 0;
    for (const file of new Set(files)) {
      const at = join(dir, file);
      if (existsSync(at)) total += statSync(at).size;
    }
    return total;
  };

  return { modern: bytes(modern), polyfill: bytes(polyfill) };
}

const js = homepageJsBytes();
if (js !== null) {
  const kb = js.modern / KB;
  const line = `homepage JS   ${kb.toFixed(0)}KB / ${BUDGET.homepageJs}KB`;
  if (kb > BUDGET.homepageJs) failures.push(line);
  else notes.push(line);

  /* Printed, not budgeted — see BUDGET.homepageJs. Nobody downloads it, but a
     silent number is one nobody notices doubling. */
  if (js.polyfill > 0) {
    notes.push(
      `polyfills     ${(js.polyfill / KB).toFixed(0)}KB (noModule — not sent to any supported browser)`,
    );
  }
}

/* --- 1b. Every route a player lands on ------------------------------------
   The homepage number above counts only the layout's chunks. A player pays
   for the page's own too, so each landing route is measured whole: the
   layout's files plus the page's client entries, deduplicated, with the
   gzipped size printed beside it because that is what a 4G phone downloads. */

function routeJs(route) {
  const seg = route === "/" ? "page" : `${route.slice(1)}/page`;
  const dir = join(ROOT, ".next");
  const manifest = join(dir, "server", "app", seg, "build-manifest.json");
  const refs = join(dir, "server", "app", `${seg}_client-reference-manifest.js`);
  if (!existsSync(manifest) || !existsSync(refs)) {
    failures.push(`No build output for ${route}: run \`next build\`, or update this check if Next's layout changed.`);
    return null;
  }
  const scope = {};
  new Function("globalThis", readFileSync(refs, "utf8"))(scope);
  const client = Object.values(scope.__RSC_MANIFEST ?? {})[0] ?? {};
  const files = new Set([
    ...(JSON.parse(readFileSync(manifest, "utf8")).rootMainFiles ?? []),
    ...Object.values(client.entryJSFiles ?? {}).flat(),
  ]);
  let raw = 0;
  let gz = 0;
  for (const file of files) {
    const at = join(dir, file);
    if (!existsSync(at)) continue;
    const buf = readFileSync(at);
    raw += buf.length;
    gz += gzipSync(buf).length;
  }
  return { raw, gz };
}

for (const [route, limit] of Object.entries(BUDGET.routes)) {
  const size = routeJs(route);
  if (!size) continue;
  const kb = size.raw / KB;
  const line = `${route.padEnd(14)}${kb.toFixed(0)}KB / ${limit}KB  (${(size.gz / KB).toFixed(0)}KB gzipped)`;
  if (kb > limit) failures.push(line);
  else notes.push(line);
}

/* --- 2. Everything the browser can fetch ----------------------------------- */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const at = join(dir, entry.name);
    if (entry.isDirectory()) walk(at, out);
    else out.push(at);
  }
  return out;
}

const publicDir = join(ROOT, "public");
if (existsSync(publicDir)) {
  const files = walk(publicDir).map((at) => ({
    path: relative(publicDir, at),
    size: statSync(at).size,
  }));

  const total = files.reduce((n, f) => n + f.size, 0);
  const totalLine = `public/       ${(total / MB).toFixed(1)}MB / ${
    BUDGET.publicTotal
  }MB`;
  if (total / MB > BUDGET.publicTotal) failures.push(totalLine);
  else notes.push(totalLine);

  for (const file of files.sort((a, b) => b.size - a.size)) {
    if (file.size / KB <= BUDGET.asset) break; // sorted, so nothing else is over
    if (file.path in ALLOWED_LARGE) {
      notes.push(
        `allowed       ${file.path} (${(file.size / MB).toFixed(1)}MB)`,
      );
      continue;
    }
    failures.push(
      `${file.path} is ${(file.size / KB).toFixed(0)}KB, over the ${
        BUDGET.asset
      }KB per-asset budget. Shrink it, or add it to ALLOWED_LARGE in ` +
        `scripts/check-budget.mjs with a reason.`,
    );
  }
}

/* --- Report ---------------------------------------------------------------- */

for (const note of notes) console.log(`  ok    ${note}`);

if (failures.length > 0) {
  console.error("\nOver budget:\n");
  for (const failure of failures) console.error(`  FAIL  ${failure}`);
  console.error("");
  process.exit(1);
}

console.log("\nWithin budget.\n");
