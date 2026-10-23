/* Screenshots the props in inserts.html to footage/stills/<id>.png, for footage.py.

     node marketing/trailer/inserts.mjs */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = (() => {
  try {
    return require("playwright");
  } catch {
    return require(path.join(execFileSync("npm", ["root", "-g"]).toString().trim(), "playwright"));
  }
})();

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "footage", "stills");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1220, height: 2060 } });
await page.goto(pathToFileURL(path.join(here, "inserts.html")).href);
await page.evaluate(() => document.fonts.ready);
for (const id of ["poster", "note"]) {
  await page.locator(`#${id}`).screenshot({ path: path.join(out, `${id}.png`) });
  console.log(`${id} → ${path.join(out, `${id}.png`)}`);
}
await browser.close();
