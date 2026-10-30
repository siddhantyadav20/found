"use client";

import { useEffect, useRef } from "react";

import { REELS, type Reel, type Review } from "@/content/site";
import { SiteLink } from "./Chrome";
import { ENTERED_EVENT } from "./entered";
import ExploreFace from "./ExploreFace";
import { reel } from "./reel";
import { createRollGl, type Plane } from "./rollGl";
import { hoverTick } from "./sounds";
import Title, { drawFlicker, prepareFlicker, stopFlicker, type Flicker } from "./Title";
import styles from "./Roll.module.css";

/* ===========================================================================
   The reel (2026-10-31): the home page, one screen tall, chapters stacked in a
   loop that never scrolls the document. 1:1 with siena.film's: wheel, drag,
   touch and arrow keys all push one number, a lerp chases it and snaps to the
   nearest whole chapter, and everything on a slide takes its position, its
   blur and its parallax from where that number has got to.

   Two chapters can't fill a wheel that needs one above, one on and one below,
   so the same two are dealt twice; the second pair is hidden from assistive
   tech and the keyboard.
   =========================================================================== */

const SLOTS = [...REELS, ...REELS];
const COUNT = SLOTS.length;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mod = (v: number, n: number) => ((v % n) + n) % n;
/** Into [-e, e): how far a slot is from the middle of the wheel. */
const wrap = (v: number, e: number) => mod(v + e, e * 2) - e;

/** Six whole turns of a four-slot wheel, spun off as the page arrives. */
const INTRO = -60;
/** A mouse's notch, not a trackpad's drift: it moves one chapter on its own. */
const NOTCH = 80;
const NOTCH_MS = 450;
const FLICKER_FIRST_MS = 2800;
const FLICKER_AGAIN_MS = 6000;
const WHEEL = 0.5;
const TOUCH = 5;

const STAR = "m8 0 2.35 5.2 5.65.62-4.2 3.82 1.17 5.56L8 12.36 3.03 15.2 4.2 9.64 0 5.82l5.65-.62L8 0Z";
const HALF_STAR = "M8 0v12.36L3.03 15.2 4.2 9.64 0 5.82l5.65-.62L8 0Z";

function Stars({ value }: { value: number }) {
  return (
    <svg className={styles.stars} viewBox="0 0 108 16" fill="currentColor" role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${i * 23})`}>
          <path d={STAR} fillOpacity={i + 1 <= value ? 1 : 0.25} />
          {i < value && i + 1 > value && <path d={HALF_STAR} />}
        </g>
      ))}
    </svg>
  );
}

function Quote({ review, parallax }: { review: Review; parallax?: number }) {
  return (
    <div className={styles.review} data-parallax={parallax}>
      {review.stars ? <Stars value={review.stars} /> : <span className={styles.noStars} />}
      <p className={styles.source}>{review.source}</p>
      <h3 className={styles.quote}>&ldquo;{review.quote}&rdquo;</h3>
    </div>
  );
}

function Seal({ word }: { word: string }) {
  // The laurel an award would sit in; what it holds is Found's own word.
  const leaf = "M0 0c3-1 6 0 7 3-3 1-6 0-7-3Z";
  const leaves = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg className={styles.seal} viewBox="0 0 100 62" aria-hidden="true">
      {[1, -1].map((side) => (
        <g key={side} transform={side === 1 ? "translate(14 8)" : "translate(86 8) scale(-1 1)"} fill="currentColor">
          {leaves.map((i) => (
            <path key={i} d={leaf} transform={`translate(${-Math.sin(i / 2.6) * 9 + 8} ${i * 6.2}) rotate(${70 - i * 16})`} />
          ))}
        </g>
      ))}
      <text x="50" y="35" textAnchor="middle" fill="currentColor" className={styles.sealWord}>
        {word}
      </text>
    </svg>
  );
}

function Slide({ item, clone }: { item: Reel; clone: boolean }) {
  const tab = clone ? -1 : undefined;
  return (
    <div className={styles.slot} data-slot aria-hidden={clone || undefined}>
      <div className={styles.frame}>
        <div className={styles.imageWrap} data-image>
          <picture>
            <source media="(max-width: 767px)" srcSet={item.tall} />
            <img className={styles.image} src={item.still} alt="" draggable={false} />
          </picture>
        </div>
        <div className={styles.overlay}>
          <div className={styles.content} data-parallax="2">
            <div className={styles.col}>
              <div className={styles.award} data-parallax="12">
                <div className={styles.awardYear}>{item.badge.year}</div>
                <div className={styles.awardHeadline}>{item.badge.headline}</div>
                <Seal word={item.badge.seal} />
              </div>
              <div className={styles.mobileReviews}>
                {item.reviews.slice(0, 2).map((r) => (
                  <Quote key={r.quote} review={r} />
                ))}
              </div>
              <div className={styles.item} data-parallax="15">
                <div className={styles.eyebrow}>{item.eyebrow}</div>
                <Title text={item.title} className={styles.title} />
                <ul className={styles.callouts}>
                  {item.callouts.map(([label, value]) => (
                    <li key={label} className={styles.callout}>
                      <span className={styles.lineTop} />
                      <span className={styles.calloutLabel}>{label}</span>
                      <span>{value}</span>
                      <span className={styles.lineBottom} />
                    </li>
                  ))}
                </ul>
                <SiteLink
                  href={item.page}
                  className={styles.exploreMobile}
                  data-btn="explore"
                  aria-label={`Explore ${item.title}`}
                  tabIndex={tab}
                >
                  <ExploreFace label="EXPLORE" />
                </SiteLink>
              </div>
            </div>
            <div className={styles.reviews}>
              <div className={styles.awards} data-parallax="2">
                {item.reviews.map((r, i) => (
                  <Quote key={r.quote} review={r} parallax={15 + i * 8} />
                ))}
              </div>
              <SiteLink
                href={item.page}
                className={styles.explore}
                data-btn="explore"
                data-parallax="24"
                data-cursor="hide"
                aria-label={`Explore ${item.title}`}
                tabIndex={tab}
                onMouseEnter={hoverTick}
              >
                <ExploreFace label="EXPLORE" />
              </SiteLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Roll() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = root.current;
    if (!wrapper || !stage.current) return;

    const items = [...wrapper.querySelectorAll<HTMLElement>("[data-slot]")];
    const parallax = items.map((it) =>
      [...it.querySelectorAll<HTMLElement>("[data-parallax]")].map((el) => ({
        el,
        value: Number(el.dataset.parallax),
      })),
    );
    const letters = items.map((it) => [...it.querySelectorAll<HTMLElement>("[data-char]")]);
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let phone = window.innerWidth <= 767;
    let itemH = 0;
    let marginH = 0;
    let frame = { x: 0, y: 0, w: 0, h: 0 };
    let radius = 40;

    const start = quiet ? 0 : INTRO - (reel.get().index % COUNT);
    const state = {
      current: start,
      target: start,
      speed: 0,
      lspeed: 0,
      scrolling: 0,
      down: false,
      dragY: 0,
      dragTarget: 0,
      lastY: 0,
      lastNotch: 0,
      lastKey: 0,
      enteredAt: 0,
      slot: -1,
    };

    // Its own canvas each mount: a context, once given up, can't be had back.
    const surface = document.createElement("canvas");
    surface.className = styles.canvas;
    stage.current.append(surface);
    const gl = createRollGl(surface);
    if (gl) wrapper.dataset.gl = "true";
    const lost = () => delete wrapper.dataset.gl;
    surface.addEventListener("webglcontextlost", lost);
    const stills = () => REELS.map((r) => (phone ? r.tall : r.still));
    gl?.load(stills());

    const measure = () => {
      const was = phone;
      phone = window.innerWidth <= 767;
      itemH = items[0].offsetHeight;
      marginH = (wrapper.clientHeight - itemH) / 2;
      const image = items[0].querySelector<HTMLElement>("[data-image]");
      if (image) frame = { x: image.offsetLeft, y: image.offsetTop, w: image.offsetWidth, h: image.offsetHeight };
      radius = phone ? 24 : Math.min(40, window.innerWidth / 36);
      gl?.resize(wrapper.clientWidth, wrapper.clientHeight, window.devicePixelRatio || 1);
      if (was !== phone) gl?.load(stills());
    };

    const moved = () => {
      reel.setMoving(true);
      window.clearTimeout(state.scrolling);
      state.scrolling = window.setTimeout(() => reel.setMoving(false), 150);
    };

    const step = (by: number) => {
      state.target -= by;
      state.speed += by * 0.05;
      moved();
    };

    reel.drive((chapter) => {
      const here = mod(-Math.round(state.target), COUNT);
      const candidates = [chapter, chapter + REELS.length];
      const distance = (e: number) => wrap(e - here, COUNT / 2);
      const best = candidates.map(distance).sort((a, b) => Math.abs(a) - Math.abs(b))[0];
      state.target -= best;
    });

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      moved();
      if (Math.abs(delta) >= NOTCH) {
        const now = performance.now();
        if (now - state.lastNotch < NOTCH_MS) return;
        state.lastNotch = now;
        step(Math.sign(delta));
        return;
      }
      const dY = -delta * WHEEL;
      state.speed += dY * 5e-4;
      state.target += dY * 0.001;
    };

    const onDown = (e: MouseEvent) => {
      if (phone || (e.target as Element).closest("a, button")) return;
      state.down = true;
      state.dragY = e.clientY;
      state.dragTarget = state.target;
      state.lastY = e.clientY;
      wrapper.dataset.dragging = "true";
    };
    const onMove = (e: MouseEvent) => {
      if (!state.down) return;
      state.target = state.dragTarget + (e.clientY - state.dragY) * 0.005;
      state.speed += (e.clientY - state.lastY) * 2e-4;
      state.lastY = e.clientY;
      moved();
    };
    const onUp = () => {
      state.down = false;
      wrapper.dataset.dragging = "";
    };

    const onTouchStart = (e: TouchEvent) => {
      state.lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dY = (y - state.lastY) * TOUCH;
      state.lastY = y;
      state.speed += dY * 5e-4;
      state.target += dY * 0.001;
      moved();
    };

    const onKey = (e: KeyboardEvent) => {
      const forward = e.key === "ArrowDown" || (e.key === " " && document.activeElement === document.body);
      const back = e.key === "ArrowUp";
      if (!forward && !back) return;
      e.preventDefault();
      const now = performance.now();
      if (now - state.lastKey < 200) return;
      state.lastKey = now;
      step(forward ? 1 : -1);
    };

    const begin = () => {
      state.enteredAt = performance.now();
      if (quiet) return;
      window.setTimeout(() => {
        state.speed = 10;
        state.lspeed = 10;
        state.current = 0;
      }, 200);
    };

    let flicker: Flicker[] | null = null;
    let flickerStart = 0;
    let flickerAt = 0;
    let time = 0;
    let raf = 0;
    const planes: Plane[] = items.map((_, i) => ({ texture: i % REELS.length, x: 0, y: 0, w: 0, h: 0, parallax: 0 }));

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      // Per frame, not per second, as siena.film's are: the same feel on the same screen.
      state.speed *= 0.85;
      state.lspeed = lerp(state.lspeed, Math.abs(state.speed), 0.1);
      if (!state.down) state.target = lerp(state.target, Math.round(state.target), 0.1);
      state.current = lerp(state.current, state.target, phone ? 0.09 : 0.05);

      const blur = phone || state.lspeed < 0.01 ? "none" : `blur(${(state.lspeed * 10).toFixed(2)}px)`;

      items.forEach((item, i) => {
        const o = wrap(state.current + i, COUNT / 2);
        const y = o * itemH + marginH;
        item.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        item.style.visibility = "visible";
        item.style.filter = blur;
        for (const { el, value } of parallax[i]) el.style.transform = `translate3d(0, ${(o * value * 10).toFixed(2)}%, 0)`;
        const plane = planes[i];
        plane.x = frame.x;
        plane.y = y + frame.y;
        plane.w = frame.w;
        plane.h = frame.h;
        plane.parallax = o;
      });

      const slot = mod(Math.round(-state.current), COUNT);
      if (slot !== state.slot) {
        state.slot = slot;
        reel.setSlot(slot);
        flickerAt = now + FLICKER_FIRST_MS;
        if (flicker) stopFlicker(flicker);
        flicker = null;
      }

      // The title flickers once the reel has been still a while, then every six seconds.
      const settled = Math.abs(state.current - state.target) < 0.01 && !reel.get().moving;
      if (!settled) {
        if (flicker) stopFlicker(flicker);
        flicker = null;
        flickerAt = Math.max(flickerAt, now + 1000);
      } else if (!quiet && !flicker && state.enteredAt && now >= flickerAt) {
        flicker = prepareFlicker(letters[slot]);
        flickerStart = now;
      }
      if (flicker && !drawFlicker(flicker, (now - flickerStart) / 1000)) {
        flicker = null;
        flickerAt = now + FLICKER_AGAIN_MS;
      }

      if (gl) {
        const since = state.enteredAt ? (now - state.enteredAt) / 1000 : 0;
        const alpha = state.enteredAt ? Math.min(Math.max((since - 0.4) / 0.8, 0), 1) : 0;
        time += 0.1;
        // Capped so a slow screen, still spinning as the picture fades in, can't burn to white.
        gl.render(planes, radius, alpha, Math.min(state.lspeed, 1.2), time);
      }
    };

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

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(state.scrolling);
      reel.drive(null);
      reel.setMoving(false);
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
    };
  }, []);

  const push = (by: number) => () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: by > 0 ? "ArrowDown" : "ArrowUp" }));
  };

  return (
    <main ref={root} className={styles.roll} data-cursor="scroll">
      <div ref={stage} aria-hidden="true" />
      <div className={styles.slots}>
        {SLOTS.map((item, i) => (
          <Slide key={i} item={item} clone={i >= REELS.length} />
        ))}
      </div>
      <span className={styles.gradTop} />
      <span className={styles.gradBottom} />
      <button type="button" className={styles.prev} data-cursor="prev" aria-label="Previous chapter" onClick={push(-1)} />
      <button type="button" className={styles.next} data-cursor="next" aria-label="Next chapter" onClick={push(1)} />
    </main>
  );
}
