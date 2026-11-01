"use client";

import { useEffect, useRef } from "react";

import { onFrame, track, wrap } from "./scroll";
import styles from "./ChapterPage.module.css";

/** Two rows of stills that pass each other as the page goes by. */
export default function ChapterGallery({ frames }: { frames: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  // A short chapter still has to fill the screen and go round.
  const shots = Array.from({ length: Math.max(frames.length, 10) }, (_, i) => frames[i % frames.length]);
  const half = Math.ceil(shots.length / 2);
  const rows = [shots.slice(0, half), shots.slice(half)];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = [...el.querySelectorAll<HTMLElement>("[data-row]")].map((row) => ({
      items: [...row.children] as HTMLElement[],
    }));
    const place = track(el);
    let width = 0;
    let middle = 0;
    const measure = () => {
      width = lines[0].items[0].offsetWidth;
      middle = (el.offsetWidth - width) / 2;
    };
    measure();
    addEventListener("resize", measure);
    let last = -1;
    const off = onFrame(() => {
      const t = place.value() * 8;
      if (t === last) return;
      last = t;
      lines.forEach(({ items }, r) => {
        const n = items.length;
        items.forEach((item, i) => {
          const o = r === 0 ? wrap(i + t, n / 2) : wrap(i - t, n / 2);
          item.style.transform = `translateX(${o * width + middle}px)`;
          item.style.filter = `blur(${Math.abs(o) * 2}px)`;
        });
      });
    });
    return () => {
      off();
      place.destroy();
      removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={root} className={styles.gallery}>
      {rows.map((row, r) => (
        <div key={r} className={styles.galleryRow} data-row>
          {row.map((src, i) => (
            <div key={i} className={styles.galleryItem}>
              {/* eslint-disable-next-line @next/next/no-img-element -- moved by hand every frame */}
              <img src={src} alt="" draggable={false} loading="lazy" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
