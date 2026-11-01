"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { expoOut, onFrame, track } from "./scroll";
import styles from "./Motion.module.css";

/* ===========================================================================
   What makes the long pages feel like siena.film's (2026-11-01). The pages
   themselves are server-rendered; these wrap the parts of them that move.
   =========================================================================== */

/**
 * Inside it, `data-a="line"` rules draw across, `data-a="alpha"` fades up and
 * `data-a="item"` rises out of its clip, a beat after each other, the first
 * time the group comes on screen.
 */
export function Group({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
  "data-color"?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-a]").forEach((item, i) => {
      item.style.setProperty("--i", String(i));
      if (item.dataset.a === "line") item.style.transformOrigin = i % 2 ? "right" : "left";
    });
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "true";
        seen.disconnect();
      },
      { rootMargin: "10px" },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <Tag ref={root} className={`${styles.group} ${className ?? ""}`} style={{ "--delay": `${delay}s` } as CSSProperties} data-reveal {...rest}>
      {children}
    </Tag>
  );
}

/** A picture that drifts through its frame as the page passes it. */
export function Parallax({ src, amount = 1, className }: { src: string; amount?: number; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = frame.current;
    const img = image.current;
    if (!el || !img) return;
    const onTop = el.getBoundingClientRect().top + scrollY < 20;
    const place = track(el, onTop ? "top" : "bottom", "top");
    const scale = amount === 1 || innerWidth <= 767 ? 1.2 : 1.3;
    let last = -1;
    const off = onFrame(() => {
      const v = place.value();
      if (v === last) return;
      last = v;
      img.style.transform = `translateY(${-10 * amount + v * 20 * amount}%) scale(${scale})`;
    });
    return () => {
      off();
      place.destroy();
    };
  }, [amount]);

  return (
    <div ref={frame} className={`${styles.parallax} ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- moved by hand every frame; the optimiser would only get in its way */}
      <img ref={image} src={src} alt="" draggable={false} loading="lazy" />
    </div>
  );
}

/**
 * Letters that roll up and spin like a departure board, then land. Contact's
 * headline and the 404's numbers.
 */
export function Rollover({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.done = "true";
      return;
    }
    const chars = [...el.querySelectorAll<HTMLElement>("[data-c]")];
    const order = chars.map((_, i) => i).sort(() => Math.random() - 0.5);
    const steps = chars.map((c, i) => ({
      c,
      faces: [...c.children] as HTMLElement[],
      after: delay + 0.5 + order[i] * 0.1,
      turns: 6 + Math.floor(Math.random() * 5),
    }));
    const start = performance.now();
    const off = onFrame((now) => {
      const seconds = (now - start) / 1000;
      let alive = false;
      for (const { c, faces, after, turns } of steps) {
        const p = Math.max((seconds - after) / 2, 0);
        if (p < 1) alive = true;
        const at = expoOut(p) * (1 + turns);
        c.style.transform = `translateY(${at < 1 ? (1 - at) * 115 : 0}%)`;
        const y = p >= 1 ? 0 : at < 1 ? 0 : -((at - 1) % 1) * 115;
        for (const face of faces) face.style.transform = `translateY(${y}%)`;
      }
      if (!alive) off();
    });
    return off;
  }, [delay]);

  return (
    <span ref={root} className={`${styles.rollover} ${className ?? ""}`} aria-label={text}>
      {[...text].map((letter, i) =>
        letter === " " ? (
          <span key={i} aria-hidden="true">
            {" "}
          </span>
        ) : (
          <span key={i} className={styles.char} data-c aria-hidden="true">
            <span>{letter}</span>
            <span className={styles.clone}>{letter}</span>
          </span>
        ),
      )}
    </span>
  );
}
