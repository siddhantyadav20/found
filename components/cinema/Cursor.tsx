"use client";

import { useEffect, useRef } from "react";

import styles from "./Cursor.module.css";

const ARROW =
  "M20.108.974C32.215 5.824 34.855 16.886 34.59 22.15h-4.924c0-9.384-8.278-14.7-12.417-16.462C6.759 10.924 5.099 18.66 5.58 22.15H.015C-.423 10.453 8.293 3.74 14.419 1.034c1.806-.798 3.857-.794 5.69-.06Z";

/**
 * The ring that trails the pointer on the reel, on anything with a real mouse.
 * The element under it says what the ring should be: `data-cursor="hide"`,
 * `"prev"` or `"next"`. Its state is written to the DOM directly, because it
 * changes on every mouse move and nothing else on the page needs to know.
 */
export default function Cursor() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !window.matchMedia("(min-width: 992px) and (pointer: fine)").matches) return;

    const at = { x: innerWidth / 2, y: innerHeight / 2 };
    const to = { ...at };
    let raf = 0;

    const tick = () => {
      at.x += (to.x - at.x) * 0.2;
      at.y += (to.y - at.y) * 0.2;
      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: MouseEvent) => {
      to.x = e.clientX;
      to.y = e.clientY;
      const zone = (e.target as Element | null)?.closest?.("[data-cursor]")?.getAttribute("data-cursor");
      el.dataset.hide = zone === "hide" ? "true" : "";
      el.dataset.side = zone === "prev" ? "top" : zone === "next" ? "bottom" : "";
    };
    const down = () => (el.dataset.pressed = "true");
    const up = () => (el.dataset.pressed = "");
    const leave = () => (el.dataset.hide = "true");

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={box} className={styles.box} aria-hidden="true">
      <div className={styles.inner}>
        <span className={styles.arrow} data-at="top">
          <svg viewBox="0 0 35 23" fill="currentColor">
            <path d={ARROW} />
          </svg>
        </span>
        <span className={styles.circle} />
        <span className={styles.text}>SCROLL</span>
        <span className={styles.arrow} data-at="bottom">
          <svg viewBox="0 0 35 23" fill="currentColor">
            <path d={ARROW} />
          </svg>
        </span>
      </div>
    </div>
  );
}
