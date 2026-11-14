import { chromium } from "playwright-core";
import fs from "node:fs";
const [,, seedFile, outPrefix, ...steps] = process.argv;
const seed = seedFile === "none" ? null : JSON.parse(fs.readFileSync(seedFile, "utf8"));
const now = Date.now();
if (seed) {
  seed.started = now - 25 * 60e3;
  for (const k of Object.keys(seed.at)) if (!k.startsWith("clock:")) seed.at[k] = now - 20 * 60e3 + seed.at[k] * 1000;
  seed.at.last = now - 5000;
  seed.run = "trailer";
}
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--autoplay-policy=user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
await ctx.addInitScript(([s]) => {
  try {
    if (!sessionStorage.getItem("__seeded")) {
      sessionStorage.setItem("__seeded", "1");
      sessionStorage.setItem("found:splash", "1");
      localStorage.setItem("found:entered", String(Date.now()));
      localStorage.setItem("found:intro", "1");
      localStorage.setItem("sy-sound", "off");
      if (s) localStorage.setItem("found:raakh:save", JSON.stringify(s)); else localStorage.removeItem("found:raakh:save");
    }
  } catch {}
}, [seed]);
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message.slice(0, 200)));
await page.goto("https://found-game.vercel.app/c/raakh", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
let n = 0;
const shot = async (name) => { await page.screenshot({ path: `${outPrefix}-${String(n++).padStart(2, "0")}-${name}.png` }); };
await shot("start");
for (const st of steps) {
  const [kind, ...rest] = st.split(":"); const arg = rest.join(":");
  try {
    if (kind === "click") await page.locator(arg).first().click({ timeout: 8000 });
    else if (kind === "text") await page.getByText(arg, { exact: false }).first().click({ timeout: 8000 });
    else if (kind === "label") await page.locator(`[aria-label^="${arg}"]`).first().click({ timeout: 8000 });
    else if (kind === "wait") await page.waitForTimeout(Number(arg));
    else if (kind === "shot") await shot(arg);
    else if (kind === "js") console.log(await page.evaluate(arg));
    else if (kind === "scroll") await page.mouse.wheel(0, Number(arg));
  } catch (e) { console.log("step failed", st, e.message.split("\n")[0]); }
}
await shot("end");
console.log("text:", (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 900));
await browser.close();
