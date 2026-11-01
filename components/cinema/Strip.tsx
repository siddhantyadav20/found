"use client";

import { useEffect, useRef, useState } from "react";

import { REELS, type Reel } from "@/content/site";
import { SiteLink } from "./Chrome";
import { ENTERED_EVENT } from "./entered";
import ExploreFace from "./ExploreFace";
import { reel, useReel } from "./reel";
import { clamp, expoOut, lerp, wrap } from "./scroll";
import { cameraHalt } from "./sounds";
import { createStripGl, type Picture } from "./stripGl";
import styles from "./Strip.module.css";

/* ===========================================================================
   The chapters page (2026-11-01), 1:1 with siena.film's work page: the posters
   side by side on a wheel that drag, wheel, touch and the arrow keys all push,
   and footage mode, where the chapter on the wheel flies down into a corner
   and its stills come in as two rows passing each other.

   Two chapters can't fill a wheel five posters wide, so they're dealt three
   times; the later hands are hidden from assistive tech and the keyboard.
   =========================================================================== */

const SLOTS = [...REELS, ...REELS, ...REELS];
const COUNT = SLOTS.length;
/** Sixteen whole turns, spun off as the page arrives. */
const INTRO = -COUNT * 16;
const NOTCH = 80;
const NOTCH_MS = 450;
const WHEEL = 0.5;
const CELLS = 24;
const TICKS = 9;
/** Below this the row's callouts have no room beside the title in the corner. */
const ROOM_FOR_CALLOUTS = 1500;

const mod = (v: number, n: number) => ((v % n) + n) % n;

type Tween = { from: number; to: number; start: number; length: number };

const at = (t: Tween, now: number) => lerp(t.from, t.to, expoOut((now - t.start) / t.length));
const aim = (t: Tween, now: number, to: number, length: number) => {
  t.from = at(t, now);
  t.to = to;
  t.start = now;
  t.length = length;
};

function Card({ item, clone }: { item: Reel; clone: boolean }) {
  return (
    <div className={styles.item} data-slot aria-hidden={clone || undefined}>
      <SiteLink href={item.page} className={styles.hit} tabIndex={clone ? -1 : undefined} aria-label={`${item.title}, ${item.eyebrow}`} data-card />
      <div className={styles.picture} data-frame>
        {/* eslint-disable-next-line @next/next/no-img-element -- the fallback under the GL, which is what's usually seen */}
        <img className={styles.image} src={item.tall} alt="" draggable={false} />
      </div>
      <div className={styles.text} data-parallax>
        <div className={styles.block} data-block>
          <div className={styles.head} data-head>
            <div className={styles.eyebrow}>{item.eyebrow}</div>
            <h2 className={styles.title}>{item.title}</h2>
          </div>
          <ul className={styles.callouts} data-calls>
            {item.callouts.map(([label, value]) => (
              <li key={label} className={styles.callout}>
                <span className={styles.lineTop} />
                <span>{label}</span>
                <span>{value}</span>
                <span className={styles.lineBottom} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Strip() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLDivElement>(null);
  const [footage, setFootage] = useState(false);
  const toggle = useRef<() => void>(() => {});
  const { index } = useReel();

  useEffect(() => {
    const wrapper = root.current;
    if (!wrapper || !stage.current) return;

    const items = [...wrapper.querySelectorAll<HTMLElement>("[data-slot]")];
    const cards = items.map((it) => ({
      text: it.querySelector<HTMLElement>("[data-parallax]")!,
      block: it.querySelector<HTMLElement>("[data-block]")!,
      head: it.querySelector<HTMLElement>("[data-head]")!,
      calls: it.querySelector<HTMLElement>("[data-calls]")!,
    }));
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;

    let phone = window.innerWidth <= 767;
    let width = 0;
    let height = 0;
    let itemW = 0;
    let margin = 0;
    let frame = { x: 0, y: 0, w: 0, h: 0 };
    let dock = { x: 0, y: 0, w: 0, h: 0 };

    const start = quiet ? 0 : INTRO;
    const state = {
      current: start,
      target: start,
      footCurrent: 0,
      footTarget: 0,
      speed: 0,
      lspeed: 0,
      direction: 0,
      ldirection: 0,
      down: false,
      dragged: false,
      startX: 0,
      startTarget: 0,
      lastX: 0,
      lastY: 0,
      lastNotch: 0,
      lastKey: 0,
      scrolling: 0,
      keyFast: 0,
      lerp: touch ? 0.12 : 0.04,
      enteredAt: 0,
      slot: 0,
      footage: false,
      busy: false,
      focus: -1,
      time: 0,
    };
    // Spread and fade the posters, fly the chosen one to the corner, bring the stills in.
    const spread: Tween = { from: 0, to: 0, start: 0, length: 1 };
    const dive: Tween = { from: 0, to: 0, start: 0, length: 1 };
    const rise: Tween = { from: 0, to: 0, start: 0, length: 1 };

    // Its own canvas each mount: a context, once given up, can't be had back.
    const surface = document.createElement("canvas");
    surface.className = styles.canvas;
    stage.current.append(surface);
    const gl = createStripGl(surface);
    if (gl) wrapper.dataset.gl = "true";
    const lost = () => delete wrapper.dataset.gl;
    surface.addEventListener("webglcontextlost", lost);
    gl?.loadPosters(REELS.map((r) => r.tall));

    const posters: Picture[] = items.map((_, i) => ({ texture: i % REELS.length, x: 0, y: 0, w: 0, h: 0, depth: 0, alpha: 1 }));
    const stills: Picture[] = Array.from({ length: CELLS }, () => ({ texture: 0, x: 0, y: 0, w: 0, h: 0, depth: 0, alpha: 0 }));
    let frames = 1;

    const measure = () => {
      phone = window.innerWidth <= 767;
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      itemW = items[0].offsetWidth;
      margin = (width - itemW) / 2;
      const image = items[0].querySelector<HTMLElement>("[data-frame]");
      const row = items[0].parentElement;
      if (image && row) frame = { x: image.offsetLeft, y: image.offsetTop + row.offsetTop, w: image.offsetWidth, h: image.offsetHeight };
      const box = thumb.current?.getBoundingClientRect();
      if (box) dock = { x: box.left, y: box.top, w: box.width, h: box.height };
      gl?.resize(width, height, window.devicePixelRatio || 1);
    };

    const moved = () => {
      reel.setMoving(true);
      window.clearTimeout(state.scrolling);
      state.scrolling = window.setTimeout(() => reel.setMoving(false), 150);
    };

    const onTarget = (by: number) => {
      if (state.footage) state.footTarget += by;
      else state.target += by;
    };

    const nudge = (by: number) => {
      window.clearTimeout(state.keyFast);
      state.lerp = 0.08;
      state.keyFast = window.setTimeout(() => (state.lerp = touch ? 0.12 : 0.04), 700);
      if (state.footage) state.footTarget = Math.round(state.footTarget) + by;
      else state.target = Math.round(state.target) + by;
      state.speed += -by * 0.2;
    };

    reel.drive((chapter) => {
      if (state.footage) return;
      const here = mod(-Math.round(state.target), COUNT);
      const choices = SLOTS.flatMap((r, i) => (r === REELS[chapter] ? [wrap(i - here, COUNT / 2)] : []));
      state.target -= choices.sort((a, b) => Math.abs(a) - Math.abs(b))[0];
    });

    const onWheel = (e: WheelEvent) => {
      const raw = e.deltaMode === 1 ? (e.deltaY + e.deltaX) * 40 : e.deltaY + e.deltaX;
      moved();
      if (Math.abs(raw) >= NOTCH) {
        const now = performance.now();
        if (now - state.lastNotch < NOTCH_MS) return;
        state.lastNotch = now;
        nudge(-Math.sign(raw));
        return;
      }
      const delta = -raw * WHEEL;
      onTarget(delta * 0.001);
      state.speed = delta * 15e-5 * 5;
      state.direction = clamp(state.direction + delta * 0.001 * 0.3, -1, 1);
    };

    const onDown = (e: MouseEvent) => {
      if (touch || (e.target as Element).closest("button, [data-keep]")) return;
      state.down = true;
      state.dragged = false;
      state.startX = e.clientX;
      state.lastX = e.clientX;
      state.startTarget = state.footage ? state.footTarget : state.target;
      wrapper.dataset.dragging = "true";
    };
    const onMove = (e: MouseEvent) => {
      if (!state.down) return;
      const dx = e.clientX - state.startX;
      if (Math.abs(dx) > 5) state.dragged = true;
      state.speed = clamp(dx * 5e-4 * 2, -1, 1);
      state.direction = clamp(state.direction + (e.clientX - state.lastX) * 0.003, -1, 1);
      state.lastX = e.clientX;
      const to = state.startTarget + dx * 0.005;
      if (state.footage) state.footTarget = to;
      else state.target = to;
      moved();
    };
    const onUp = () => {
      state.down = false;
      state.direction = 0;
      wrapper.dataset.dragging = "";
    };
    const onCard = (e: MouseEvent) => {
      if (state.dragged && (e.target as Element).closest("[data-card]")) {
        e.preventDefault();
        e.stopPropagation();
      }
      state.dragged = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      state.lastX = e.touches[0].clientX;
      state.lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - state.lastX;
      const dy = e.touches[0].clientY - state.lastY;
      state.lastX = e.touches[0].clientX;
      state.lastY = e.touches[0].clientY;
      const delta = (dx + dy) * 3;
      onTarget(delta * 0.001);
      state.speed = clamp(delta * 75e-5, -1, 1);
      moved();
    };

    const onKey = (e: KeyboardEvent) => {
      const forward = e.code === "ArrowRight" || (e.code === "Space" && document.activeElement === document.body);
      const back = e.code === "ArrowLeft";
      if (!forward && !back) return;
      e.preventDefault();
      const now = performance.now();
      if (now - state.lastKey < 200) return;
      state.lastKey = now;
      nudge(forward ? -1 : 1);
    };

    const home = (card: (typeof cards)[number]) => {
      card.head.style.transform = "";
      card.head.style.textAlign = "";
      card.head.style.alignItems = "";
      card.calls.style.transform = "";
      card.calls.style.opacity = "";
    };

    const fly = (i: number) => {
      const card = cards[i];
      if (phone) {
        card.calls.style.opacity = "0";
        card.head.style.transform = `translateY(${card.head.textContent && card.head.textContent.length > 18 ? 60 : 100}%)`;
        return;
      }
      card.head.style.textAlign = "left";
      card.head.style.alignItems = "flex-start";
      const head = card.head.getBoundingClientRect();
      const to = first.current?.getBoundingClientRect();
      if (to) card.head.style.transform = `translate(${to.left - head.left}px, ${to.bottom - head.bottom}px) scale(.75)`;
      const calls = card.calls.getBoundingClientRect();
      const rest = last.current?.getBoundingClientRect();
      if (rest && width >= ROOM_FOR_CALLOUTS) {
        card.calls.style.transform = `translate(${rest.left - calls.left}px, ${rest.bottom - calls.bottom}px)`;
      } else card.calls.style.opacity = "0";
    };

    toggle.current = () => {
      if (state.busy) return;
      state.busy = true;
      const now = performance.now();
      state.footage = !state.footage;
      setFootage(state.footage);
      reel.setFootage(state.footage);
      if (state.footage) {
        measure();
        // It may still be coasting: the title's flight is worked out from where it stops.
        state.target = state.current = Math.round(state.target);
        state.slot = mod(-state.target, COUNT);
        reel.setSlot(state.slot);
        place(now);
        state.focus = state.slot;
        state.footTarget = state.footCurrent = 0;
        const shots = REELS[state.slot % REELS.length].more.frames;
        frames = shots.length;
        gl?.loadStills(shots);
        cards.forEach((card, i) => {
          if (i === state.focus) return fly(i);
          const l = wrap(state.current + i, COUNT / 2);
          card.block.style.opacity = "0";
          card.block.style.transform = `translateX(${l * 200}%)`;
        });
        aim(spread, now, 1, 800);
        aim(dive, now, 1, 1200);
        aim(rise, now, 1, 1200);
      } else {
        cards.forEach((card) => {
          home(card);
          card.block.style.opacity = "";
          card.block.style.transform = "";
        });
        aim(spread, now, 0, 800);
        aim(dive, now, 0, 800);
        aim(rise, now, 0, 800);
      }
      window.setTimeout(() => (state.busy = false), state.footage ? 950 : 850);
    };

    const place = (now: number) => {
      items.forEach((item, i) => {
        const o = wrap(state.current + i, COUNT / 2);
        const x = o * itemW + margin;
        if (!state.footage) {
          item.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
          item.style.visibility = "visible";
          if (!phone) {
            const text = cards[i].text;
            text.style.filter = o === 0 ? "none" : `blur(${(Math.abs(o) * 2).toFixed(2)}px)`;
            text.style.opacity = String(1 - Math.abs(o) * 0.4);
            text.style.transform = `translateX(${o * state.lspeed * 100}%)`;
          }
        }
        const plane = posters[i];
        const s = at(spread, now);
        const d = i === state.focus ? at(dive, now) : 0;
        const px = lerp(o * (1 + s * 3.5) * itemW + margin + frame.x, dock.x, d);
        plane.x = px;
        plane.y = lerp(frame.y, dock.y, d);
        plane.w = lerp(frame.w, dock.w, d);
        plane.h = lerp(frame.h, dock.h, d);
        plane.depth = o * (1 - d);
        plane.alpha = i === state.focus ? 1 : 1 - s;
      });
    };

    const roll = (now: number) => {
      const r = at(rise, now);
      if (r <= 0) {
        for (const s of stills) s.alpha = 0;
        return;
      }
      const size = Math.min(height * 0.25, 300);
      const gap = size * 0.1;
      const step = (size + gap) / 2;
      const middle = height * 0.486;
      stills.forEach((s, k) => {
        const d = k % 2;
        const x = (mod(k + state.footCurrent * (d - 0.5) * 4, CELLS) - CELLS / 2) / 2 + (d - 0.5) * (1 - r) * 20;
        s.texture = k % frames;
        s.w = s.h = size;
        s.x = width / 2 + x * 2 * step - size / 2;
        s.y = middle + (d ? gap / 2 : -size - gap / 2);
        s.depth = x;
        s.alpha = r * (1 - clamp((Math.abs(x) - 2.2) / 1.2));
      });
    };

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      // Per frame, not per second, as siena.film's are: the same feel on the same screen.
      state.speed = clamp(state.speed * 0.95 * 0.95, -1, 1);
      if (Math.abs(state.speed) < 0.001) state.speed = 0;
      state.direction *= 0.95;
      state.ldirection = lerp(state.ldirection, state.direction, 0.05);
      state.lspeed = lerp(state.lspeed, Math.abs(state.speed), 0.1);
      if (mark.current) mark.current.style.transform = `translateX(${state.ldirection * 500}%)`;

      if (!state.footage) {
        if (!state.down) state.target = lerp(state.target, Math.round(state.target), 0.1);
        state.current = lerp(state.current, state.target, state.lerp);
        const slot = mod(Math.round(-state.current), COUNT);
        if (slot !== state.slot) {
          state.slot = slot;
          reel.setSlot(slot);
        }
      } else {
        state.footCurrent = lerp(state.footCurrent, state.footTarget, state.lerp) - (touch ? 0.001 : 0.0003);
        state.footTarget -= touch ? 0.001 : 0.0003;
      }
      if (!state.footage && at(dive, now) <= 0) state.focus = -1;

      place(now);
      roll(now);

      if (gl) {
        const since = state.enteredAt ? (now - state.enteredAt) / 1000 : 0;
        const alpha = state.enteredAt ? clamp((since - 0.4) / 0.8) : 0;
        for (const p of posters) p.alpha *= alpha;
        state.time += 0.1;
        gl.render(posters, stills, at(spread, now), Math.min(state.lspeed, 1.2), state.time);
      }
    };

    const begin = () => {
      state.enteredAt = performance.now();
      wrapper.dataset.in = "true";
      if (quiet) return;
      window.setTimeout(() => {
        if (!touch) {
          state.speed = 1;
          state.lspeed = 5;
        }
        state.current = 0;
      }, 200);
    };

    reel.setSlot(0);
    measure();
    raf = requestAnimationFrame(tick);

    const onEntered = () => begin();
    if (window.__foundEntered) begin();
    else window.addEventListener(ENTERED_EVENT, onEntered, { once: true });

    window.addEventListener("resize", measure);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    wrapper.addEventListener("click", onCard, true);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(state.scrolling);
      window.clearTimeout(state.keyFast);
      reel.drive(null);
      reel.setMoving(false);
      reel.setFootage(false);
      surface.removeEventListener("webglcontextlost", lost);
      gl?.destroy();
      surface.remove();
      delete wrapper.dataset.gl;
      window.removeEventListener(ENTERED_EVENT, onEntered);
      window.removeEventListener("resize", measure);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("click", onCard, true);
    };
  }, []);

  const step = (key: string) => () => window.dispatchEvent(new KeyboardEvent("keydown", { code: key }));
  const page = REELS[index];

  return (
    <main ref={root} className={styles.strip} data-cursor="scroll" data-footage={footage || undefined}>
      <h1 className={styles.hidden}>Chapters</h1>
      <div ref={stage} className={styles.stage} aria-hidden="true" />
      <span className={styles.spine} aria-hidden="true" />

      <div className={styles.rollWrap}>
        <div className={styles.row}>
          {SLOTS.map((item, i) => (
            <Card key={i} item={item} clone={i >= REELS.length} />
          ))}
        </div>
      </div>

      <div className={styles.edgeTop} data-cursor="hide" data-keep>
        <div className={styles.toggle} data-on={footage || undefined}>
          <ul className={styles.toggleList}>
            <li>
              <button
                type="button"
                className={styles.switchBtn}
                data-active={!footage || undefined}
                aria-pressed={!footage}
                aria-label="Poster mode"
                onClick={() => footage && toggle.current()}
              >
                <svg viewBox="0 0 50 50" fill="currentColor" className={styles.fadeOne} aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 13v24h12V13H19Zm-3 25a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3H19a3 3 0 0 0-3 3v26ZM3 18v14h6V18H3Zm-3 15a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3V17a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v16Zm47-15v14h-6V18h6Zm3 15a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v16Z"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.switchBtn}
                data-active={footage || undefined}
                aria-pressed={footage}
                aria-label="Footage mode"
                onClick={() => !footage && toggle.current()}
              >
                <svg viewBox="0 0 50 50" fill="currentColor" className={styles.fadeTwo} aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M16 29v8h8v-8h-8Zm-3 8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-8a3 3 0 0 0-3 3v8Zm21-8v8h8v-8h-8Zm-3 8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-8a3 3 0 0 0-3 3v8ZM17 12v7H9v-7h8Zm3 7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7Zm6-7v7h8v-7h-8Zm-3 7a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-8a3 3 0 0 0-3 3v7Z"
                  />
                </svg>
              </button>
            </li>
          </ul>
          <svg className={styles.toggleBg} viewBox="0 0 147 68" aria-hidden="true">
            <path d="M146.5 62V6a6 6 0 0 1-6-6H6a6 6 0 0 1-6 6v56a6 6 0 0 1 6 6h134.5a6 6 0 0 1 6-6Z" />
          </svg>
          <div className={styles.switchWrap}>
            <div className={styles.switch}>
              <div className={styles.switchBg} />
              <div className={styles.switchLabel}>
                <div className={styles.swap}>
                  <div>FOOTAGE</div>
                  <div>POSTER</div>
                </div>
                <div className={styles.mode}>MODE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.edgeBottom} data-cursor="hide">
        <figure className={styles.ticks} aria-hidden="true">
          <div className={styles.tickRow}>
            {Array.from({ length: TICKS }, (_, i) => (
              <div key={i} className={styles.tick}>
                <i />
                <i />
                <i data-long />
                <i />
                <i data-last />
              </div>
            ))}
          </div>
          <div ref={mark} className={styles.marker} />
        </figure>
        <div className={styles.dock} aria-hidden="true">
          <div className={styles.dockThumb}>
            <div ref={thumb} className={styles.dockImage} />
          </div>
          <div ref={first} className={styles.dockFirst} />
          <div ref={last} className={styles.dockLast} />
        </div>
        <div className={styles.corner} data-keep>
          <SiteLink href={page.page} className={styles.explore} data-btn="explore" aria-label={`Explore ${page.title}`} onMouseEnter={cameraHalt} onClick={cameraHalt}>
            <ExploreFace label="EXPLORE" />
          </SiteLink>
        </div>
      </div>

      <button type="button" className={styles.prev} data-cursor="prev" aria-label="Previous chapter" onClick={step("ArrowLeft")} />
      <button type="button" className={styles.next} data-cursor="next" aria-label="Next chapter" onClick={step("ArrowRight")} />
    </main>
  );
}
