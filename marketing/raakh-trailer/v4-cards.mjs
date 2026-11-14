import { chromium } from "playwright-core";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname);
const list = JSON.parse(fs.readFileSync(path.join(here, "cards.json")));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => { const f = path.join(here, decodeURIComponent(req.url.split("?")[0])); if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); } res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--mute-audio", "--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${server.address().port}/cards.html`);
await page.waitForFunction(() => typeof window.show === "function");
fs.mkdirSync(path.join(here, "cards"), { recursive: true });
for (const [i, k] of list.entries()) {
  await page.evaluate(([a, b]) => window.show(a, b), [k.kind, k.text]);
  await page.waitForTimeout(60);
  await page.screenshot({ path: path.join(here, "cards", `c${String(i).padStart(2, "0")}.png`), omitBackground: true });
}
await browser.close(); server.close(); console.log("cards", list.length);
