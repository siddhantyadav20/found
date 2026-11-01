"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { clamp, lerp, onFrame, track } from "./scroll";
import styles from "./AboutPage.module.css";

/** A tall arch; its picture settles as the page arrives and sinks as it's left. */
export function Arch({ src }: { src: string }) {
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = image.current;
    if (!img) return;
    const place = track(img.parentElement!, "top", "top");
    const off = onFrame(() => {
      img.style.translate = `0 ${place.value() * 10}%`;
    });
    return () => {
      off();
      place.destroy();
    };
  }, []);

  return (
    <div className={styles.arch} data-a="alpha">
      <div className={styles.archClip}>
        {/* eslint-disable-next-line @next/next/no-img-element -- moved by hand every frame */}
        <img ref={image} className={styles.archImage} src={src} alt="" />
      </div>
      <svg className={styles.archLine} viewBox="0 0 364 773" fill="none" stroke="currentColor" strokeDasharray="5 5" aria-hidden="true">
        <path d="M1 772V182C1 81.5 82.5 1 182 1s181 80.5 181 181v590H1Z" />
      </svg>
    </div>
  );
}

/** The hero's big lines lean apart as the page leaves. */
export function Lean({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = [...el.querySelectorAll<HTMLElement>("[data-lean]")];
    const place = track(el, "top", "top");
    const off = onFrame(() => {
      const v = place.value();
      lines.forEach((line, i) => (line.style.translate = `${v * 5 * (i % 2 ? -1 : 1)}% 0`));
    });
    return () => {
      off();
      place.destroy();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/**
 * The type section's timeline, scrubbed by the page: each part marked up with
 * where it starts and ends (`data-x`, `data-y` and `data-sx`, "from to") and
 * when, one part after another (`data-after` and `data-until`, 0 to 1).
 */
export function Scrub({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const pair = (v?: string) => v?.split(" ").map(Number) ?? [0, 0];
    const parts = [...el.querySelectorAll<HTMLElement>("[data-x],[data-y],[data-sx]")].map((node) => ({
      node,
      x: pair(node.dataset.x),
      y: pair(node.dataset.y),
      sx: node.dataset.sx ? pair(node.dataset.sx) : null,
      after: Number(node.dataset.after ?? 0),
      until: Number(node.dataset.until ?? 1),
    }));
    const place = track(el);
    let smooth = place.value();
    let last = -1;
    const off = onFrame(() => {
      smooth = lerp(smooth, place.value(), 0.1);
      if (Math.abs(smooth - last) < 1e-4) return;
      last = smooth;
      for (const { node, x, y, sx, after, until } of parts) {
        const p = clamp((smooth - after) / (until - after));
        node.style.transform = `translate(${lerp(x[0], x[1], p)}%, ${lerp(y[0], y[1], p)}%)${sx ? ` scaleX(${lerp(sx[0], sx[1], p)})` : ""}`;
      }
    });
    return () => {
      off();
      place.destroy();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

const STAGGER = 0.15;
const COLS = 9;
const ROWS = 4;

/** Thirty-six stills fly in out of the dark and lock into a wall, from the middle out. */
export function FlyGrid({ images }: { images: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const grid = section?.querySelector<HTMLElement>("[data-grid]");
    if (!section || !grid) return;
    const items = [...grid.children] as HTMLElement[];

    let from: { x: number; y: number; z: number; rx: number; ry: number; after: number }[] = [];
    const measure = () => {
      const middle = { x: innerWidth / 2, y: innerWidth <= 767 ? innerHeight / 5 : innerHeight / 2 };
      const far = Math.hypot(middle.x, middle.y);
      const lift = (el: HTMLElement, reach: number) => {
        const at = { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
        const angle = Math.atan2(Math.abs(middle.y - at.y), Math.abs(middle.x - at.x));
        return {
          left: at.x < middle.x,
          up: at.y < middle.y,
          cos: Math.abs(Math.cos(angle)),
          sin: Math.abs(Math.sin(angle)),
          depth: Math.hypot(middle.x - at.x, middle.y - at.y) / far,
          reach,
        };
      };
      from = items.map((el, i) => {
        const a = lift(el, 900);
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const spread = Math.hypot(col - (COLS - 1) / 2, row - (ROWS - 1) / 2) / Math.hypot((COLS - 1) / 2, (ROWS - 1) / 2);
        return {
          x: (a.left ? -1 : 1) * a.cos * 900,
          y: (a.up ? -1 : 1) * a.sin * 900,
          z: -3000 * a.depth,
          rx: (a.up ? -1 : 1) * a.sin * -160 * a.depth,
          ry: (a.left ? 1 : -1) * a.cos * -160 * a.depth,
          after: spread * STAGGER,
        };
      });
    };
    measure();
    addEventListener("resize", measure);

    const place = track(section, "center", "bottom");
    let smooth = 0;
    let last = -1;
    const off = onFrame(() => {
      smooth = lerp(smooth, place.value(), 0.1);
      if (Math.abs(smooth - last) < 1e-4) return;
      last = smooth;
      items.forEach((item, i) => {
        const f = from[i];
        const p = clamp(smooth * (1 + STAGGER) - f.after);
        const q = 1 - p;
        item.style.opacity = String(p >= 1 ? 1 : Math.min(0.05 + p * 1.15, 1));
        item.style.transform = `translate3d(${f.x * q}px, ${f.y * q}px, ${f.z * q}px) rotateX(${f.rx * q}deg) rotateY(${f.ry * q}deg) scale(${0.4 + p * 0.6})`;
      });
    });
    return () => {
      off();
      place.destroy();
      removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={root} className={styles.gridSection} aria-hidden="true">
      <div className={styles.gridStick}>
        <div className={styles.grid} data-grid>
          {images.map((src, i) => (
            <div key={i} className={styles.gridItem}>
              {/* eslint-disable-next-line @next/next/no-img-element -- moved by hand every frame */}
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
