// node capture.mjs [desktop|phone]  → captures the real game from the dev server into v7/game/<mode>/*.png
// Walks the chapter the way a player does: Begin, Skip the cold open, the parcel, the note, the lock
// screen, the home screen, WhatsApp (the poster, M, Bhasin, Security), Photos, the case file.
import { chromium } from "../v5/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const mode = process.argv[2] || "desktop";
const out = path.join(here, "game", mode); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--force-color-profile=srgb", "--disable-lcd-text"] });
const ctx = await browser.newContext(mode === "phone"
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
  : { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { sessionStorage.setItem("found:splash", "1"); for (const k of Object.keys(localStorage)) if (k.startsWith("found:")) localStorage.removeItem(k); } catch {} });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message));
let n = 0;
const shot = async (name) => { n++; const f = path.join(out, `${String(n).padStart(2, "0")}-${name}.png`); await page.screenshot({ path: f }); console.log("shot", f); };
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 400);
const clickText = async (t, timeout = 8000) => {
  const b = page.locator(`button:visible`, { hasText: t }).first();
  await b.waitFor({ state: "visible", timeout }); await b.click(); console.log("clicked", t);
};
const clickLabel = async (prefix, timeout = 8000) => {
  const b = page.locator(`[aria-label^="${prefix}"]:visible`).first();
  await b.waitFor({ state: "visible", timeout }); await b.click(); console.log("clicked label", prefix);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.goto("http://localhost:3001/c/raakh?battery=unplugged", { waitUntil: "networkidle" });
await sleep(1500);
await shot("desk");
try { await clickText("Begin", 8000); await sleep(1500); await shot("coldopen"); } catch (e) { console.log("no Begin:", e.message.slice(0, 60)); }
// the cold open advances on a tap anywhere; tap until the parcel is on screen
for (let i = 0; i < 16; i++) {
  const t = await text(); if (/PULL THE STRIP/i.test(t)) break;
  await page.mouse.click(960, 300); await sleep(650);
}
await sleep(1200);
await shot("parcel");
console.log("parcel text:", await text());
try { await clickText("Pull the strip"); await sleep(1200); } catch (e) { console.log("no strip:", e.message.slice(0, 80)); }
await shot("mode-ask");
try { await page.locator('[role="dialog"] button:visible').first().click(); await sleep(1200); } catch (e) { console.log("mode:", e.message.slice(0, 80)); }
if (/PULL THE STRIP/i.test(await text())) { try { await clickText("Pull the strip", 4000); } catch {} }
await sleep(4000);
await shot("after-strip");
console.log("after strip:", await text());
try { await clickText("Turn the envelope over", 8000); await sleep(1600); await shot("envelope-back"); } catch (e) { console.log("no envelope:", e.message.slice(0, 80)); }
try { await clickText("Turn the phone over", 8000); await sleep(3000); } catch (e) { console.log("no turn phone:", e.message.slice(0, 80)); }
await shot("lock");
console.log("lock:", await text());
try { await clickLabel("Swipe up to open"); await sleep(1800); await shot("home"); } catch (e) { console.log("no lock swipe:", e.message.slice(0, 80)); }
await sleep(3000);
if (await page.locator('[aria-label="Decline"]:visible').count()) { await shot("incoming-call"); await page.locator('[aria-label="Decline"]:visible').first().click(); await sleep(1500); console.log("declined the call"); }
await shot("low-battery");
for (let i = 0; i < 3; i++) { try { const c = page.locator("button:visible", { hasText: /^Close$/ }).first(); if (await c.count()) { await c.click({ timeout: 2000 }); await sleep(900); console.log("closed alert"); } else break; } catch { break; } }
for (const lbl of ["Close Notification Centre", "Close"]) { try { const c = page.locator(`[aria-label="${lbl}"]:visible`).first(); if (await c.count()) { await c.click({ timeout: 2000 }); await sleep(800); console.log("closed", lbl); } } catch {} }
await shot("home-2");
console.log("home buttons:", (await page.evaluate(() => [...document.querySelectorAll("button")].map((b) => b.getAttribute("aria-label") || b.innerText.trim()).filter(Boolean).slice(0, 30))).join(" | "));
const app = async (label, name, inside) => {
  try { const c = page.locator("button:visible", { hasText: /^Close$/ }).first(); if (await c.count()) { await c.click({ timeout: 1500 }); await sleep(600); } } catch {}
  try { await clickLabel(label, 15000); await sleep(2200); await shot(name); if (inside) await inside(); } catch (e) { console.log("app", label, "failed:", e.message.slice(0, 100)); }
  try { await page.locator("[data-back]").first().click({ timeout: 3000 }); await sleep(900); } catch {}
  try { await page.locator("[data-back]").first().click({ timeout: 1500 }); await sleep(700); } catch {}
};
const chat = async (needle, name) => {
  const row = page.locator("button", { hasText: needle }).first();
  await row.waitFor({ state: "visible", timeout: 6000 }); await row.click(); await sleep(1500);
  await shot(name);
  await page.evaluate(() => { const el = document.querySelector('[class*="appLayer"] [class*="scroll"], [class*="appLayer"]'); if (el) el.scrollTop = 0; });
  await sleep(400); await shot(name + "-top");
  await page.evaluate(() => { const els = document.querySelectorAll('[class*="appLayer"] *'); for (const el of els) if (el.scrollHeight > el.clientHeight + 40) { el.scrollTop = el.scrollHeight; } });
  await sleep(400); await shot(name + "-bottom");
  try { await page.locator("[data-back]").first().click({ timeout: 3000 }); await sleep(900); } catch {}
};
await app("WhatsApp", "whatsapp", async () => {
  await chat("+91 62", "wa-raju");
  await chat("M", "wa-m");
  await chat("Bhasin", "wa-bhasin");
  await chat("Banyan", "wa-security");
  await chat("Sethi", "wa-sethi");
});
await app("Photos", "photos");
await app("Instagram", "instagram");
await app("Notes", "notes");
await app("Case file", "casefile");
console.log("end:", await text());
await browser.close();
