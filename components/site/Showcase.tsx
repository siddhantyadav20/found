"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import styles from "./Showcase.module.css";

/* ===========================================================================
   A screen-wide panel of slides (2026-10-25), as a game's site shows its
   featured titles: a picture behind, the title set huge, and the next ones
   waiting as cards on the right. Pick one, or wait, and that card grows
   out of its place in the row until it fills the panel; the title blurs
   from one to the next, and the number turns over.
   =========================================================================== */

export type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  line: string;
  tags: readonly string[];
  bg: ReactNode;
  thumb: ReactNode;
};

/** How long a slide stays before the next one grows in. */
const STAY = 6500;

type Grow = { from: number; t: number; r: number; b: number; l: number };

export default function Showcase({ slides, cta, label }: { slides: readonly Slide[]; cta?: ReactNode; label: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const thumbs = useRef(new Map<number, HTMLElement>());
  const [active, setActive] = useState(0);
  const [grow, setGrow] = useState<Grow | null>(null);
  const [seen, setSeen] = useState(false);
  const count = slides.length;
  const s = slides[active];
  // The others, in the order they'll come: the next one first.
  const queue = Array.from({ length: count - 1 }, (_, k) => (active + 1 + k) % count);

  const go = (to: number) => {
    if (to === active) return;
    const box = panel.current?.getBoundingClientRect();
    const card = thumbs.current.get(to)?.getBoundingClientRect();
    const g: Grow =
      box && card
        ? { from: active, t: card.top - box.top, r: box.right - card.right, b: box.bottom - card.bottom, l: card.left - box.left }
        : { from: active, t: 0, r: 0, b: 0, l: 0 };
    setGrow(g);
    setActive(to);
  };

  // Turning over on its own only while it's on screen and nobody's reading it.
  useEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    const watch = new IntersectionObserver(([e]) => setSeen(e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] });
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div ref={panel} className={styles.panel} data-run={(seen && !still) || undefined} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className={styles.bgs} aria-hidden="true">
        {slides.map((sl, i) => (
          <div
            key={sl.key}
            className={styles.bg}
            data-on={i === active || undefined}
            data-under={(grow && i === grow.from) || undefined}
            data-grow={(grow && i === active) || undefined}
            style={grow && i === active ? ({ "--t": `${grow.t}px`, "--r": `${grow.r}px`, "--b": `${grow.b}px`, "--l": `${grow.l}px` } as CSSProperties) : undefined}
            onAnimationEnd={() => setGrow(null)}
          >
            {sl.bg}
          </div>
        ))}
      </div>
      <span className={styles.shade} aria-hidden="true" />

      <div className={styles.body} key={s.key} aria-live="polite">
        <p className={styles.eyebrow}>{s.eyebrow}</p>
        <p className={styles.tags}>
          {s.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
        <h3 className={styles.title} aria-label={s.title}>
          {s.title.split(" ").map((word, w, all) => {
            // Each letter's place in the whole title, so the stagger runs on across the words.
            const at = all.slice(0, w).join(" ").length + (w ? 1 : 0);
            return (
              <span key={w} className={styles.word} aria-hidden="true">
                {[...word].map((ch, i) => (
                  <span key={i} style={{ "--i": at + i } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
            );
          })}
        </h3>
        <p className={styles.line}>{s.line}</p>
      </div>

      <div className={styles.foot}>
        {cta && <div className={styles.cta}>{cta}</div>}
        <div className={styles.arrows}>
          <button type="button" aria-label="Previous" onClick={() => go((active - 1 + count) % count)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" aria-label="Next" onClick={() => go((active + 1) % count)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <ul className={styles.thumbs}>
        {queue.map((i, k) => (
          <li key={slides[i].key} style={{ "--k": k } as CSSProperties}>
            <button
              type="button"
              ref={(el) => {
                if (el) thumbs.current.set(i, el);
                else thumbs.current.delete(i);
              }}
              onClick={() => go(i)}
              aria-label={slides[i].title}
            >
              {slides[i].thumb}
              <span className={styles.thumbText}>
                <small>{slides[i].eyebrow}</small>
                {slides[i].title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.index} aria-hidden="true">
        <span key={active}>{String(active + 1).padStart(2, "0")}</span>
        <i key={`bar-${active}`} style={{ "--stay": `${STAY}ms` } as CSSProperties} onAnimationEnd={() => go((active + 1) % count)} />
      </p>
    </div>
  );
}
