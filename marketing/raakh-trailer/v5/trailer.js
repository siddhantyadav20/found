// RAAKH trailer v5: the compositor. window.renderAt(t) draws trailer second t.
import { FPS, W, H, SW, SH, M, LENGTH, MONTAGE, CARDS, SUBS } from "./timeline.js";
import { LOGO_VIEWBOX, LOGO_PATH } from "../logo.js";

const R = "/public/found/raakh/";
const FR = "/marketing/raakh-trailer/v5/frames/";
const $ = (s) => document.querySelector(s);
const screen = $("#screen"), phone = $("#phone"), full = $("#full"), glow = $("#glow");
const cardsEl = $("#cards"), subsEl = $("#subs"), titleEl = $("#title"), endEl = $("#end");
const black = $("#black"), flash = $("#flash");
const grain = $("#grain").getContext("2d"), embers = $("#embers").getContext("2d");

// ---------- small helpers ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const fade = (t, t0, t1, fi = 0.25, fo = 0.25) => (t < t0 || t > t1 ? 0 : Math.min(1, (t - t0) / fi, (t1 - t) / fo));
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pad = (n) => String(n).padStart(4, "0");

// ---------- svg bits ----------
const SVG = {
  chev: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  person: `<svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.5-8 5.6V21h16v-1.4c0-3.1-3.6-5.6-8-5.6Z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1Z"/></svg>`,
  wa: `<svg viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.6 21.4l4.7-1.2A9.5 9.5 0 1 0 12 2.5Zm0 17.3a7.8 7.8 0 0 1-4-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.8 7.8 0 1 1 12 19.8Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.2.2 1.9 2.9 4.6 4 1.7.7 2.3.8 3.2.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.4-.2Z"/></svg>`,
  torch: `<svg viewBox="0 0 24 24"><path d="M8 3h8v3.2l-2 2.6V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8.8L8 6.2Zm4 9.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24"><path d="M4.5 7.5h3l1.5-2.2h6l1.5 2.2h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5Zm7.5 3a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z"/></svg>`,
  wifi: `<svg class="wifi" viewBox="0 0 16 12"><path d="M8 11.3 10.1 9A3 3 0 0 0 5.9 9ZM8 7.4a5 5 0 0 1 3.6 1.5l1.5-1.6A7.1 7.1 0 0 0 2.9 7.3l1.5 1.6A5 5 0 0 1 8 7.4Zm0-3.7a8.8 8.8 0 0 1 6.3 2.6L16 4.7A10.9 10.9 0 0 0 0 4.7l1.7 1.6A8.8 8.8 0 0 1 8 3.7Z"/></svg>`,
  ticks: (blue) => `<svg class="${blue ? "blue" : ""}" viewBox="0 0 16 11"><path d="M1 6l3 3 6-7M6 9l1 1 7-8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tick: `<svg viewBox="0 0 16 11"><path d="M3 6l3 3 7-8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fwd: `<svg viewBox="0 0 24 24"><path d="M14 5v4C7 10 4 14 3 19c2.5-3.5 6-5 11-5v4l7-6.5Z"/></svg>`,
  video: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3Z"/></svg>`,
  call: `<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1Z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10Z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z"/></svg>`,
  send: `<svg viewBox="0 0 24 24"><path d="M21 3 3 10.5l7.5 3L13.5 21Z"/><path d="M10.5 13.5 21 3"/></svg>`,
  save: `<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21Z"/></svg>`,
};

// ---------- phone chrome ----------
function statusBar(time, battery) {
  const lo = battery <= 20;
  const w = Math.max(3, Math.round(26 * battery / 100));
  return `<div class="sb"><span>${time}</span><span class="r">
    <span class="sig"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px;opacity:.35"></i></span>${SVG.wifi}
    <span class="bat ${lo ? "lo" : ""}"><b class="${battery <= 10 ? "red" : ""}" style="width:${w}px"></b><span>${battery}</span></span></span></div>`;
}
const NOTES = [
  { ic: "icphone", from: "Phone", txt: "47 Missed Calls", when: "" },
  { ic: "icwa", from: "Mummy", txt: "Beta, phone kyun nahi utha raha? Khana khaya?", en: "Why aren’t you picking up? Have you eaten?", when: "" },
  { ic: "icphone", from: "Mummy", txt: "6 missed calls", when: "" },
  { ic: "icphone", from: "Bhasin Uncle", txt: "2 missed calls", when: "" },
];
function lockScreen({ time = "11:41", day = "Saturday 28 November", battery = 9, notes = NOTES, banner = null, top = null } = {}) {
  return `<div class="lock"><img class="wall" src="/public/found/raakh-wallpaper.jpg"><div class="shade"></div>${statusBar("", battery)}
    <div class="day">${day}</div><div class="clock">${time}</div>
    ${banner ? `<div class="banner"><div class="av">${SVG.person}</div><div class="who"><b>${banner.name}</b><span>${banner.sub}</span></div>
      <div class="btn red"><svg viewBox="0 0 24 24" style="transform:rotate(135deg)"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1Z"/></svg></div><div class="btn green">${SVG.call}</div></div>` : ""}
    ${top ? `<div class="notes" style="bottom:auto;top:${top.y}px"><div class="note" id="topnote"><div class="ic ${top.ic}">${SVG[top.ic === "icwa" ? "wa" : "phone"]}</div><div class="bd"><div class="from">${top.from}</div><div class="txt">${top.txt}</div>${top.en ? `<div class="en">${top.en}</div>` : ""}</div><div class="when">now</div></div></div>` : ""}
    <div class="notes">${notes.map((n, i) => `<div class="note" id="note${i}"><div class="ic ${n.ic}">${SVG[n.ic === "icwa" ? "wa" : "phone"]}</div><div class="bd"><div class="from">${n.from}</div><div class="txt">${n.txt}</div>${n.en ? `<div class="en">${n.en}</div>` : ""}</div></div>`).join("")}</div>
    <div class="bottom"><div class="round">${SVG.torch}</div><div class="swipe">Swipe up to open</div><div class="round">${SVG.camera}</div></div></div>`;
}
function callScreen({ name, secs, battery = 9, time = "11:41" }) {
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(Math.floor(secs % 60)).padStart(2, "0");
  return `<div class="call"><img class="wall" src="/public/found/raakh-wallpaper.jpg">${statusBar(time, battery)}
    <div class="name">${name}</div><div class="sub">${mm}:${ss}</div><div class="av">${SVG.person}</div>
    <div class="grid">${["mute", "keypad", "audio", "add call", "FaceTime", "contacts"].map((k) => `<div class="k"><i></i>${k}</div>`).join("")}</div>
    <div class="end">${SVG.call}</div></div>`;
}
function incomingScreen({ name, sub = "mobile", time, battery }) {
  return `<div class="call incoming"><img class="wall" src="/public/found/raakh-wallpaper.jpg">${statusBar(time, battery)}
    <div class="name">${name}</div><div class="sub">${sub}</div>
    <div class="small"><div><i></i>Remind Me</div><div><i></i>Message</div></div>
    <div class="two"><div><i style="background:#ff3b30"><svg viewBox="0 0 24 24" style="transform:rotate(135deg)"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1Z"/></svg></i>Decline</div><div><i style="background:#34c759">${SVG.call}</i>Accept</div></div></div>`;
}
function igPost({ time = "11:44", battery = 9 }) {
  return `<div class="ig">${statusBar(time, battery)}<div class="top">${SVG.chev.replace("<svg", '<svg class="back"')}Posts<span class="dots">···</span></div>
    <div class="user"><img src="${R}dp-sameer.jpg"><b>sk.weddings</b><span class="dots">···</span></div>
    <img class="photo" id="igphoto" src="${R}w-pheras.jpg">
    <div class="acts">${SVG.heart}${SVG.comment}${SVG.send}<span class="save">${SVG.save}</span></div>
    <div class="likes">2,106 likes</div><div class="cap"><b>sk.weddings</b>Pheras at 1:20 AM. Worth every minute. 🔥</div><div class="ago">6 days ago</div></div>`;
}
function mediaViewer({ name, sub, frame, cap, en, time = "11:46", battery = 9 }) {
  return `<div class="mv">${statusBar(time, battery)}<div class="bar">${SVG.chev}<div><b>${name}</b><span>${sub}</span></div></div>
    <img class="v" id="vid" src="${frame}"><div class="cap">${cap}<span>${en}</span></div></div>`;
}
function waveBars(seed, n = 34, progress = 0) {
  const r = rng(seed); let s = "";
  for (let i = 0; i < n; i++) { const h = 6 + Math.round(r() * 16); s += `<i class="${i / n < progress ? "on" : ""}" style="height:${h}px"></i>`; }
  return s + `<span class="dot" style="left:${(progress * 100).toFixed(1)}%"></span>`;
}
function fmt(s) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`; }
function bubble(m) {
  if (m.pill) return `<div class="pill ${m.sys ? "sys" : ""}">${m.pill}</div>`;
  const meta = `<div class="meta">${m.at || ""}${m.side === "out" ? (m.ticks === "read" ? SVG.ticks(true) : m.ticks === "sent" ? SVG.tick : SVG.ticks(false)) : ""}</div>`;
  let body = "";
  if (m.kind === "poster") body = `<div class="fwd">${SVG.fwd}Forwarded many times</div><div class="poster" id="poster"><div class="hi">लापता</div><div class="lp">LAPATA · MISSING</div><img src="${R}poster-dilip.jpg"><div class="nm">Dilip Kumar Mahto</div><div class="d">Umar 19 saal · Age 19<br>Aakhri baar dekha: Shanivaar, 21 November<br>Last seen: Banyan Farms, Chhattarpur<br>Ghar: Samastipur, Bihar</div><div class="ct">Sampark: Raju (bhai) · +91 62••• •4417</div></div>`;
  else if (m.kind === "voice") body = `<div class="vn"><div class="play"></div><div class="wave">${waveBars(m.seed || 7, 34, m.progress || 0)}</div><div class="dur">${fmt(m.progress ? m.progress * m.secs : m.secs)}</div></div>${m.text ? `<div class="tr">${m.text}${m.en ? `<span class="en">${m.en}</span>` : ""}</div>` : ""}`;
  else body = `${m.text}${m.en ? `<span class="en">${m.en}</span>` : ""}`;
  return `<div class="b ${m.side}" id="${m.id || ""}">${body}${meta}</div>`;
}
function chat({ name, sub = "tap here for contact info", avatar = null, msgs, align = "bottom", time = "11:44", battery = 9, scroll = 0 }) {
  return `<div class="wa">${statusBar(time, battery)}<div class="hdr"><div class="back">${SVG.chev}</div><div class="av">${avatar ? `<img src="${avatar}">` : SVG.person}</div><div class="who"><b>${name}</b><span>${sub}</span></div><div class="acts">${SVG.video}${SVG.call.replace("<svg", '<svg style="fill:none;stroke:#fff"')}</div></div>
    <div class="body"><div class="msgs" data-align="${align}" style="transform:translateY(${-scroll}px)">${msgs.map(bubble).join("")}</div></div></div>`;
}
function lockedChats({ time = "1:31", battery = 5 }) {
  return `<div class="lc">${statusBar(time, battery)}<div class="back">${SVG.chev}</div><h1>Locked chats</h1><p>Hidden from your chat list. Found with your secret code.</p>
    <div class="row" id="rowDilip"><img src="${R}dp-dilip.jpg"><div class="r"><div class="l1">Dilip<span>Monday</span></div><div class="l2">${SVG.ticks(true)}maaf kar de</div></div></div>
    <div class="row"><img src="${R}dp-nitin.jpg"><div class="r"><div class="l1">Nitin<span>22/11</span></div><div class="l2">bhai?</div></div></div>
    <div class="tabs"><div><i></i>Updates</div><div><i></i>Calls</div><div><i></i>Communities</div><div class="on"><i></i>Chats</div><div><i></i>Settings</div></div></div>`;
}
function caseFile(k) {
  // k: 0..1 progress of the sentence filling in
  const b = (txt, on, sel) => `<span class="blank ${on ? "on" : ""} ${sel ? "sel" : ""}">${on ? txt : "…"}</span>`;
  const f1 = k > 0.18, f2 = k > 0.48, f3 = k > 0.78, done = k > 0.95;
  return `<div class="cf"><h2>Case file</h2><div class="where">ON THIS IPHONE · TODAY 11:44 PM</div>
    <div class="cfcard"><div class="eye">Episode 1 · Question 2 of 3</div><div class="q">Dilip is missing. Who is he, and where was he last seen?</div><div class="look">Look in WhatsApp · Photos · Notes</div>
    <div class="sent">Dilip is a ${b("catering worker", f1, !f1)}, last seen ${b("Banyan Farms", f2, f1 && !f2)}, holding ${b("light", f3, f2 && !f3)} for Sameer.</div>
    <div class="chips"><span class="chip">catering worker</span><span class="chip">guest</span><span class="chip">driver</span></div>
    <div class="foot"><div class="hint">${done ? "Right. Now pick the proof." : "Fill in the blanks."}</div><div class="btns"><span class="btn ${done ? "on" : ""}">File it</span><span class="btn ghost">Hint</span></div></div></div>
    <div class="ans"><small>ANSWERED</small>S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he’s on a train to Mumbai.</div></div>`;
}

// ---------- the chats ----------
const RAJU = [
  { pill: "Monday" },
  { side: "in", kind: "poster", at: "1:12 PM" },
  { side: "in", id: "rajuAsk", text: "Aap Sameer bhaiya ho na? Dilip ne aapka number diya tha. Woh aapke saath kaam kar raha tha.", en: "You’re Sameer bhaiya, right? Dilip gave me your number. He was working with you.", at: "1:13 PM" },
  { pill: "Wednesday" },
  { side: "in", text: "Bhaiya ek baar baat kar lo 🙏", en: "Bhaiya, please talk to me once.", at: "8:02 PM" },
  { pill: "Saturday" },
  { side: "in", id: "rajuWhere", text: "Bhaiya, Dilip kahan hai? Bas itna bata do.", en: "Bhaiya, where is Dilip? Just tell me that.", at: "11:31 PM" },
];
const MCHAT = (p1, p2) => [
  { pill: "21/09" },
  { side: "in", text: "Sameer, mujhe ab message mat karna.", en: "Sameer, don’t message me any more.", at: "1:14 AM" },
  { side: "out", text: "M please. ek baar baat kar", en: "M, please. Talk to me once.", at: "1:15 AM", ticks: "sent" },
  { pill: "Sunday" },
  { side: "out", id: "vn1", kind: "voice", secs: 18, seed: 11, progress: p1, text: "M… main jaanta hoon tu reply nahi karegi. Kal shaadi mein… Kunal firing kar raha tha. Ek ladka gir gaya.", en: "M… I know you won’t reply. Last night, at the wedding… Kunal was firing. A boy fell.", at: "12:06 AM", ticks: "sent" },
  { side: "out", id: "vn2", kind: "voice", secs: 11, seed: 5, progress: p2, text: "Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya.", en: "They didn’t take him to a hospital. Bhasin didn’t let anyone leave.", at: "12:09 AM", ticks: "sent" },
];
const SETHI = [
  { pill: "Monday" },
  { side: "out", text: "Dilip aaya kya aaj?", en: "Did Dilip come in today?", at: "9:58 AM", ticks: "read" },
  { side: "in", id: "sethi", text: "Dilip ka hisaab Bhasin sir ne kar diya. List se naam hata diya.", en: "Bhasin sir settled Dilip’s account. Took him off the list.", at: "10:12 AM" },
];
const BANYAN = [
  { pill: "22/11" },
  { pill: "🕓 Bhasin Sehgal turned on disappearing messages. New messages will disappear from this chat 24 hours after they’re sent.", sys: true },
  { side: "in", text: "<b style='color:#e6a15a;font-weight:600;display:block;font-size:13px'>Bhasin Sehgal</b>Sab apne apne ghar. Kal baat hogi.", en: "Everyone home. We talk tomorrow.", at: "12:36 AM" },
];
const BHASIN = (vnp) => [
  { pill: "22/11" },
  { side: "in", id: "balance", text: "Balance aaj aa jayega. Tab tak kisi se baat nahi. Nitin se bhi nahi.", en: "The balance comes today. Till then, talk to nobody. Not even Nitin.", at: "9:10 AM" },
  ...(vnp == null ? [] : [
    { pill: "Today" },
    { side: "in", text: "Ghar pe hi hai. Achha hai.", en: "It’s at home. Good.", at: "12:12 AM" },
    { side: "in", id: "bvn", kind: "voice", secs: 16, seed: 23, progress: vnp, text: "Jiske paas bhi ye phone hai. … Subah saat baje tak phone Gate 2 pe chhod dena. Baaki hum dekh lenge.", en: "Whoever has this phone. … Leave it at Gate 2 by seven. We’ll handle the rest.", at: "12:40 AM" },
  ]),
];

// ---------- camera ----------
// A camera is {sx, sy, s, cx, cy}: screen point (sx, sy) sits at frame point (cx, cy) at scale s.
// A keyframe may name an element instead: {sel, dy, s}.
let camNow = { sx: SW / 2, sy: SH / 2, s: 1, cx: W / 2, cy: H / 2 };
function resolve(k) {
  const o = { sx: SW / 2, sy: SH / 2, s: 1, cx: W / 2, cy: H / 2, ...k };
  if (k.sel) {
    const el = screen.querySelector(k.sel);
    if (el) {
      const r = el.getBoundingClientRect(), sr = screen.getBoundingClientRect();
      const sc = sr.width / SW;
      o.sx = (r.left - sr.left) / sc + r.width / sc / 2 + (k.dx || 0);
      o.sy = (r.top - sr.top) / sc + r.height / sc / 2 + (k.dy || 0);
    }
  }
  return o;
}
function setCam(c, shake = 0) {
  camNow = c;
  const x = c.cx - (c.sx + 12) * c.s + shake, y = c.cy - (c.sy + 12) * c.s;
  phone.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${c.s.toFixed(4)})`;
  // light spill under the phone, only while the phone's edges are in frame
  const px = c.cx + (SW / 2 - c.sx) * c.s, py = c.cy + (SH / 2 - c.sy) * c.s;
  glow.style.transform = `translate(${(px - 800).toFixed(0)}px, ${(py - 550 + 60).toFixed(0)}px) scale(${(0.6 + c.s * 0.5).toFixed(2)})`;
  glow.style.opacity = String(clamp((1.8 - c.s) / 0.8));
}
function tween(a, b, k) { const e = ease(clamp(k)); return { sx: lerp(a.sx, b.sx, e), sy: lerp(a.sy, b.sy, e), s: lerp(a.s, b.s, e), cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e) }; }
function setGlow(color) { glow.style.background = `radial-gradient(ellipse at center, ${color} 0%, rgba(0,0,0,0) 60%)`; }

// ---------- shots ----------
// Each shot: t0, t1, draw(tl) -> {html | full, cam:[k0,k1] (push from k0 to k1 over the shot), glow, noPhone, noSubs}
const S = [];
const shot = (t0, t1, draw, o = {}) => S.push({ t0, t1, draw, ...o });
const WARM = "rgba(214,160,96,.38)", AMBER = "rgba(200,120,70,.42)", COOL = "rgba(96,118,138,.22)", DIM = "rgba(120,110,100,.18)";
const INC = { name: "+91 62••• •4417", sub: "mobile" };

// Cold open
shot(0, M.answer, (tl, t) => ({
  html: lockScreen({ banner: t >= M.buzz1 - 0.05 ? INC : null }),
  cam: [{ s: 0.78 }, { s: 0.86 }], glow: WARM,
  dark: t < M.lightOn ? 1 : 1 - easeOut(clamp((t - M.lightOn) / 0.3)),
}));
shot(M.answer, M.act1, (tl, t) => ({ html: callScreen({ name: INC.name, secs: tl }), cam: [{ s: 0.86 }, { s: 0.92 }], glow: COOL }));
// Act 1: the wedding, through the phone
shot(M.ig, M.reel, () => ({ html: igPost({}), cam: [{ sel: "#igphoto", s: 2.3 }, { sel: "#igphoto", s: 2.55 }], glow: AMBER }));
shot(M.reel, M.k3, (tl) => ({ html: mediaViewer({ name: "Kunal", sub: "21/11, 12:20 AM · video", frame: `${FR}reel/${pad(1 + Math.min(100, Math.floor(tl * FPS)))}.jpg`, cap: "bhai ye bhi daal dena film mein 🔥🔥", en: "Put this in the film too." }), cam: [{ sx: 216, sy: 468, s: 1.42 }, { sx: 216, sy: 460, s: 1.5 }], glow: AMBER }));
shot(M.k3, M.shot + 1 / FPS, (tl) => ({ html: mediaViewer({ name: "Kunal", sub: "21/11, 11:52 PM · video", frame: `${FR}k3/${pad(1 + Math.min(138, Math.floor(tl * FPS)))}.jpg`, cap: "Dance floor, 11:52 PM", en: "Put this in the film too.", time: "11:47" }), cam: [{ sx: 216, sy: 440, s: 1.5 }, { sx: 216, sy: 420, s: 1.75 }], glow: AMBER }));
// Black until act 2 (cards live in their own layer)
shot(M.shot + 1 / FPS, M.act2, () => ({ noPhone: true }));
// Act 2: inside the phone
shot(M.poster, M.rajuMsg, () => ({ html: chat({ name: INC.name, msgs: RAJU, align: "top", battery: 9 }), cam: [{ sel: "#poster", s: 1.95, dy: -10 }, { sel: "#poster", s: 2.15, dy: 10 }], glow: COOL }));
shot(M.rajuMsg, M.mNote, () => ({ html: chat({ name: INC.name, msgs: RAJU, align: "bottom", battery: 9 }), cam: [{ sel: "#rajuAsk", s: 2.25, dy: 40 }, { sel: "#rajuWhere", s: 2.4, dy: -10 }], glow: COOL }));
shot(M.mNote, M.boom1, (tl, t) => ({ html: chat({ name: "M", msgs: MCHAT(clamp((t - M.mVoice + 5) / 18), 0), align: "bottom", time: "12:06", battery: 8 }), cam: [{ sel: "#vn1", s: 2.3, dy: 10 }, { sel: "#vn1", s: 2.45, dy: 0 }], glow: COOL, noSubs: true }));
shot(M.boom1, M.sethi, () => ({ noPhone: true }));
shot(M.sethi, M.sethi + 1.6, () => ({ html: chat({ name: "Sethi Caterers", msgs: SETHI, time: "12:14", battery: 8 }), cam: [{ sel: "#sethi", s: 2.35 }, { sel: "#sethi", s: 2.5 }], glow: COOL }));
shot(M.sethi + 1.6, M.boom2, () => ({ html: chat({ name: "Banyan — Security", sub: "Bhasin Sehgal, Nitin, you", msgs: BANYAN, time: "12:21", battery: 8 }), cam: [{ sel: ".pill.sys", s: 2.5, dy: 6 }, { sel: ".pill.sys", s: 2.7 }], glow: COOL }));
shot(M.boom2, M.bhasinChat, () => ({ noPhone: true }));
shot(M.bhasinChat, M.boom3, () => ({ html: chat({ name: "Bhasin Uncle", avatar: `${R}dp-bhasin.jpg`, msgs: BHASIN(null), time: "12:40", battery: 7 }), cam: [{ sel: "#balance", s: 2.3, dy: 6 }, { sel: "#balance", s: 2.5 }], glow: COOL }));
shot(M.boom3, M.locked, () => ({ noPhone: true }));
shot(M.locked, M.casefile, (tl) => ({ html: lockedChats({ time: "1:31", battery: 6 }), cam: tl < 1.3 ? [{ s: 1.08, sy: 430 }, { s: 1.1, sy: 426 }] : [{ sel: "#rowDilip", s: 2.5, dy: 4 }, { sel: "#rowDilip", s: 2.7, dy: 0 }], camSplit: 1.3, glow: DIM }));
shot(M.casefile, M.card5[0], (tl) => ({ html: chat({ name: INC.name, msgs: RAJU, align: "bottom", time: "1:33", battery: 6 }), full: caseFile(clamp((tl - 0.3) / 3.2)), cam: [{ s: 0.84, cx: 700, cy: 540 }, { s: 0.84, cx: 700, cy: 540 }], glow: COOL }));
shot(M.card5[0], M.act3, () => ({ noPhone: true }));
// Act 3: the clock
shot(M.bhasinVN, M.battery, (tl, t) => ({ html: chat({ name: "Bhasin Uncle", avatar: `${R}dp-bhasin.jpg`, msgs: BHASIN(clamp((t - M.bVoice1 + 0.6) / 16)), time: "2:58", battery: 7 }), cam: [{ sel: "#bvn", s: 2.2, dy: 14 }, { sel: "#bvn", s: 2.4, dy: 4 }], glow: COOL, noSubs: true }));
shot(M.battery, M.call, (tl) => ({ html: chat({ name: "Bhasin Uncle", avatar: `${R}dp-bhasin.jpg`, msgs: BHASIN(1), time: "3:04", battery: tl < 0.55 ? 7 : tl < 1.1 ? 5 : 3 }), cam: [{ sel: ".bat", s: 7.5 }, { sel: ".bat", s: 8.2 }], glow: COOL }));
shot(M.call, M.montage, (tl) => ({ html: incomingScreen({ name: "Mummy", time: "3:12", battery: 3 }), cam: [{ s: 1.0, sy: 470 }, { s: 1.12, sy: 480 }], glow: COOL, shakeAt: [0, 0.9, 1.8, 2.7] }));
// Montage
{
  let t = M.montage;
  for (const [kind, arg, d] of MONTAGE) {
    const t0 = t, t1 = t + d; t = t1;
    if (kind === "black") shot(t0, t1, () => ({ noPhone: true }));
    else if (kind === "img") shot(t0, t1, (tl) => ({ noPhone: true, full: `<img class="pic" src="${R}${arg}.jpg" style="width:${1920 * (1.06 + tl * 0.06)}px;height:${1080 * (1.06 + tl * 0.06)}px">` }));
    else if (kind === "fire") shot(t0, t1, (tl) => ({ noPhone: true, full: `<img class="pic" src="${R}fire-mattress.jpg" style="width:${1920 * (1.1 + tl * 0.1)}px;height:${1080 * (1.1 + tl * 0.1)}px;filter:brightness(${(0.9 + 0.25 * Math.sin(tl * 37) * Math.sin(tl * 53 + 1)).toFixed(3)})">` }));
    else if (kind === "lock") shot(t0, t1, () => ({ html: lockScreen({ time: "3:40", battery: 2 }), cam: [{ sel: "#note0", s: 3.2, dy: 0 }, { sel: "#note0", s: 3.4 }], glow: WARM }));
    else if (kind === "poster") shot(t0, t1, () => ({ html: chat({ name: INC.name, msgs: RAJU, align: "top", time: "3:41", battery: 2 }), cam: [{ sel: "#poster", s: 3.4, dy: -120 }, { sel: "#poster", s: 3.6, dy: -110 }], glow: COOL }));
    else if (kind === "battery") shot(t0, t1, () => ({ html: lockScreen({ time: "3:58", battery: 1 }), cam: [{ sel: ".bat", s: 8 }, { sel: ".bat", s: 8.6 }], glow: COOL }));
  }
}
shot(M.drop, M.tag, () => ({ noPhone: true }));
// Tag: the phone lights once more in the dark
shot(M.tag, LENGTH, (tl, t) => ({
  html: lockScreen({ time: "4:40", battery: 1, notes: [], top: { ic: "icwa", from: "Mummy", txt: "Beta? Khana khaya?", en: "Have you eaten?", y: 300 } }),
  cam: [{ s: 0.62, cy: 600 }, { s: 0.66, cy: 596 }], glow: WARM,
  dark: t < M.tagLight ? 1 : 1 - easeOut(clamp((t - M.tagLight) / 0.3)),
}));

// ---------- overlays ----------
function drawGrain(frameNo) {
  const img = grain.createImageData(960, 540), d = img.data, r = rng(frameNo * 7919 + 13);
  for (let i = 0; i < d.length; i += 4) { const v = 96 + (r() * 128) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  grain.putImageData(img, 0, 0);
}
function drawEmbers(t, a) {
  embers.clearRect(0, 0, 960, 540);
  if (a <= 0) return;
  const r = rng(99);
  for (let i = 0; i < 70; i++) {
    const x0 = r() * 960, y0 = r() * 540, sp = 4 + r() * 10, ph = r() * 6.28, sz = 0.6 + r() * 1.4, dr = (r() - 0.5) * 8;
    const y = ((y0 - (t - M.title) * sp) % 600 + 600) % 600 - 30, x = x0 + Math.sin(t * 0.7 + ph) * dr;
    const tw = 0.5 + 0.5 * Math.sin(t * (2 + r() * 3) + ph);
    embers.fillStyle = `rgba(255,${120 + (tw * 80) | 0},40,${(a * (0.25 + 0.55 * tw)).toFixed(3)})`;
    embers.beginPath(); embers.arc(x, y, sz, 0, 6.283); embers.fill();
  }
}
function overlays(t) {
  // cards
  cardsEl.innerHTML = CARDS.map((c) => { const a = fade(t, c.t[0], c.t[1], 0.22, 0.26); if (!a) return ""; const k = clamp((t - c.t[0]) / (c.t[1] - c.t[0])); return `<div class="card ${c.kind}" style="opacity:${a.toFixed(3)};letter-spacing:${(0.44 + k * 0.03).toFixed(3)}em">${c.text}</div>`; }).join("");
  // title
  let th = "";
  if (t >= M.title && t < M.end) { const a = fade(t, M.title, M.end - 0.25, 0.12, 0.25), k = (t - M.title) / (M.end - M.title); th = `<div class="ttl" style="opacity:${a.toFixed(3)};transform:scale(${(1.025 - k * 0.025).toFixed(4)})">RAAKH</div>` + (t > M.title + 0.8 ? `<div class="ch" style="opacity:${fade(t, M.title + 0.8, M.end - 0.25, 0.4, 0.25).toFixed(3)}">CHAPTER ONE</div>` : ""); }
  titleEl.innerHTML = th;
  // end card
  if (t >= M.end && t < M.tag) { endEl.classList.remove("hide"); endEl.style.opacity = fade(t, M.end, M.tag - 0.2, 0.3, 0.3).toFixed(3); endEl.innerHTML = `<svg viewBox="${LOGO_VIEWBOX}"><path d="${LOGO_PATH}"/></svg><div class="t">A thriller you play on a phone.</div><div class="l1">CHAPTER ONE  ·  PLAY FREE IN YOUR BROWSER</div><div class="l2">found-game.vercel.app</div>`; }
  else endEl.classList.add("hide");
  drawEmbers(t, t >= M.title && t < M.tag ? fade(t, M.title, M.tag - 0.2, 1.5, 0.4) * 0.7 : 0);
}

// ---------- the frame ----------
window.renderAt = async function (t) {
  const sh = S.find((s) => t >= s.t0 && t < s.t1) || S[S.length - 1];
  const tl = t - sh.t0;
  const d = sh.draw(tl, t);
  full.innerHTML = d.full || "";
  if (d.noPhone) { phone.style.display = "none"; glow.style.opacity = "0"; }
  else {
    phone.style.display = "";
    screen.innerHTML = d.html || "";
    setGlow(d.glow || DIM);
    const dur = sh.t1 - sh.t0;
    let k = dur > 0 ? tl / dur : 0;
    if (d.camSplit != null) k = tl < d.camSplit ? tl / d.camSplit : (tl - d.camSplit) / (dur - d.camSplit);
    const a = resolve(d.cam[0]), b = resolve(d.cam[1]);
    let shake = 0;
    const buzzes = d.shakeAt ? d.shakeAt.map((x) => sh.t0 + x) : [M.buzz1, M.buzz2, M.tagLight];
    for (const tb of buzzes) if (t >= tb && t < tb + 0.42) shake += 2.2 * Math.sin((t - tb) * 2 * Math.PI * 55) * (1 - (t - tb) / 0.42);
    setCam(tween(a, b, k), shake);
  }
  // subtitles
  const sub = SUBS.find((s) => t >= s.t[0] && t < s.t[1]);
  subsEl.innerHTML = sub && !d.noSubs ? `<div class="sub" style="opacity:${fade(t, sub.t[0], sub.t[1], 0.12, 0.18).toFixed(3)}">${sub.text}</div>` : "";
  overlays(t);
  // the gunshot: one white frame, then black
  flash.style.opacity = t >= M.shot && t < M.shot + 1 / FPS ? "1" : "0";
  let dark = d.dark != null ? d.dark : 0;
  if (t >= M.out) dark = Math.max(dark, clamp((t - M.out) / 0.45));
  black.style.opacity = dark.toFixed(3);
  drawGrain(Math.round(t * FPS));
  // let images land
  const imgs = [...document.images].filter((i) => !i.complete);
  if (imgs.length) await Promise.all(imgs.map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return true;
};

// preload: every image we will ever show
const PRE = ["raakh-wallpaper.jpg", ...["dp-sameer", "dp-bhasin", "dp-dilip", "dp-nitin", "w-pheras", "poster-dilip", "w-kunal", "key-lawn", "kunal-frame", "w-blur", "fire-mattress"].map((n) => `raakh/${n}.jpg`)].map((p) => "/public/found/" + p);
for (let i = 1; i <= 101; i++) PRE.push(`${FR}reel/${pad(i)}.jpg`);
for (let i = 1; i <= 139; i++) PRE.push(`${FR}k3/${pad(i)}.jpg`);
window.ready = Promise.all([document.fonts.ready, ...PRE.map((src) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = r; im.src = src; }))]).then(() => true);
window.LENGTH = LENGTH;
