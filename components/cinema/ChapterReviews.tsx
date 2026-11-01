"use client";

import { useEffect, useRef, useState } from "react";

import type { Review } from "@/content/site";
import Arrow from "./Arrow";
import { lerp, onFrame, wrap } from "./scroll";
import Stars from "./Stars";
import styles from "./ChapterPage.module.css";

const mod = (v: number, n: number) => ((v % n) + n) % n;

/** Three words on a card; dealt until they fill a screen. Later hands are hidden from assistive tech. */
const HANDS = 4;

export default function ChapterReviews({ reviews }: { reviews: readonly Review[] }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState(0);
  const nudge = useRef<(by: number) => void>(() => {});
  const count = reviews.length;
  const slides = Array.from({ length: count * HANDS }, (_, i) => reviews[i % count]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const n = items.length;
    let width = items[0].offsetWidth;
    let middle = (el.offsetWidth - width) / 2;
    let target = 0;
    let current = 0;
    let down = false;
    let startX = 0;
    let startTarget = 0;

    const measure = () => {
      width = items[0].offsetWidth;
      middle = (el.offsetWidth - width) / 2;
    };
    const press = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startTarget = target;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (down) target = startTarget + (e.clientX - startX) * 0.005;
    };
    const release = () => {
      down = false;
      target = Math.round(target);
    };
    nudge.current = (by) => {
      target = Math.round(target) + by;
    };

    el.addEventListener("pointerdown", press);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    addEventListener("resize", measure);

    let last = NaN;
    let shown = 0;
    const off = onFrame(() => {
      current = lerp(current, target, 0.08);
      if (Math.abs(current - last) < 1e-4) return;
      last = current;
      items.forEach((item, i) => {
        item.style.transform = `translateX(${wrap(i + current, n / 2) * width + middle}px)`;
      });
      const place = mod(-current, count);
      if (bar.current) bar.current.style.transform = `translateX(${(place / count) * 100 * count}%)`;
      const whole = mod(Math.round(-current), count);
      if (whole !== shown) {
        shown = whole;
        setAt(whole);
      }
    });
    return () => {
      off();
      removeEventListener("resize", measure);
      el.removeEventListener("pointerdown", press);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
    };
  }, [count]);

  return (
    <>
      <div ref={root} className={styles.reviews}>
        {slides.map((r, i) => (
          <article key={i} className={styles.review} aria-hidden={i >= count || undefined}>
            <div className={styles.reviewCard}>
              <svg className={styles.reviewArch} viewBox="0 0 441 596" fill="none" stroke="currentColor" strokeDasharray="6 6" aria-hidden="true">
                <path d="M1 595V220C1 99 99 1 220.5 1S440 99 440 220v375H1Z" />
              </svg>
              <span className={styles.pause} aria-hidden="true">
                <i />
                <i />
              </span>
              <div className={styles.reviewText}>
                {r.stars && <Stars value={r.stars} className={styles.reviewStars} />}
                <p className={styles.reviewQuote}>{r.quote}</p>
                <p className={styles.eyebrow}>{r.source}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.reviewBar}>
        <span className={styles.reviewCount}>
          {at + 1}/{count}
        </span>
        <span className={styles.progress} aria-hidden="true">
          <span ref={bar} style={{ width: `${100 / count}%` }} />
        </span>
        <span className={styles.reviewButtons}>
          <button type="button" aria-label="Previous" onClick={() => nudge.current(1)}>
            <Arrow to="left" />
          </button>
          <button type="button" aria-label="Next" onClick={() => nudge.current(-1)}>
            <Arrow />
          </button>
        </span>
      </div>
      <p className={styles.dragHint}>Drag to discover</p>
    </>
  );
}
