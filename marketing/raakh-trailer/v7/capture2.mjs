// node capture2.mjs → the M and Bhasin chats, by row text (their rows carry no accessible name)
import { chromium } from "../v5/node_modules/playwright-core/index.mjs";
import fs from "node:fs"; import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(here, "game", "desktop");
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--force-color-profile=srgb", "--disable-lcd-text"] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { sessionStorage.setItem("found:splash", "1"); for (const k of Object.keys(localStorage)) if (k.startsWith("found:")) localStorage.removeItem(k); } catch {} });
const page = await ctx.newPage();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
const shot = async (name) => { const f = path.join(out, `${name}.png`); await page.screenshot({ path: f }); console.log("shot", f); };
const clickText = async (t, timeout = 8000) => { const b = page.locator("button:visible", { hasText: t }).first(); await b.waitFor({ state: "visible", timeout }); await b.click(); };
const closeAlerts = async () => { for (let i = 0; i < 3; i++) { try { const c = page.locator("button:visible", { hasText: /^Close$/ }).first(); if (await c.count()) { await c.click({ timeout: 1500 }); await sleep(700); } else break; } catch { break; } } };
await page.goto("http://localhost:3001/c/raakh?battery=unplugged", { waitUntil: "networkidle" }); await sleep(1500);
await clickText("Begin"); await sleep(1500);
for (let i = 0; i < 16; i++) { if (/PULL THE STRIP/i.test(await text())) break; await page.mouse.click(960, 300); await sleep(650); }
await sleep(1000); await clickText("Pull the strip"); await sleep(1200);
await page.locator('[role="dialog"] button:visible').first().click(); await sleep(1200);
if (/PULL THE STRIP/i.test(await text())) { try { await clickText("Pull the strip", 4000); } catch {} }
await sleep(4000); await clickText("Turn the envelope over"); await sleep(1500); await clickText("Turn the phone over"); await sleep(3000);
await page.locator('[aria-label^="Swipe up to open"]:visible').first().click(); await sleep(2000);
await sleep(3000);
if (await page.locator('[aria-label="Decline"]:visible').count()) { await page.locator('[aria-label="Decline"]:visible').first().click(); await sleep(1500); }
await closeAlerts();
await page.locator('[aria-label^="WhatsApp"]:visible').first().click(); await sleep(2200);
const openRow = async (first) => page.evaluate((first) => { const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim().split("\n")[0].trim() === first); if (b) { b.click(); return true; } return false; }, first);
for (const [row, name] of [["M", "20-wa-m"], ["Bhasin Uncle", "21-wa-bhasin"], ["Banyan — Security", "22-wa-security"], ["Sethi Caterers", "23-wa-sethi"], ["Kunal", "24-wa-kunal"]]) {
  await closeAlerts();
  const ok = await openRow(row); console.log("row", row, ok); await sleep(1600);
  if (ok) { await shot(name); await page.evaluate(() => { const els = document.querySelectorAll('[class*="appLayer"] *'); for (const el of els) if (el.scrollHeight > el.clientHeight + 40) el.scrollTop = 0; }); await sleep(400); await shot(name + "-top"); }
  try { await page.locator("[data-back]").first().click({ timeout: 3000 }); await sleep(900); } catch {}
}
// the Instagram grid, and the voice memos
try { await page.locator("[data-back]").first().click({ timeout: 2000 }); await sleep(800); } catch {}
await closeAlerts();
try { await page.locator('[aria-label^="Instagram"]:visible').first().click({ timeout: 8000 }); await sleep(2500); await shot("25-instagram"); } catch (e) { console.log("instagram:", e.message.slice(0, 60)); }
console.log("end:", (await text()).slice(0, 200));
await browser.close();
