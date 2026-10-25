"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import styles from "./Fan.module.css";

/* ===========================================================================
   A hand of cards, fanned (2026-10-25): one in the middle, lifted, the rest
   leaning away on an arc round a point far below. Every few seconds the
   hand turns and the next card comes to the middle; pick one and it comes
   to you. The cards themselves are drawn on the server; this only decides
   which one is in the middle.
   =========================================================================== */

export type FanCard = { key: string; label: string; color: string; node: ReactNode };

const EVERY = 3400;

export default function Fan({ cards, start = 0 }: { cards: readonly FanCard[]; start?: number }) {
  const [active, setActive] = useState(start);
  const [held, setHeld] = useState(false);
  const count = cards.length;

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const turn = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((a) => (a + 1) % count);
    }, EVERY);
    return () => window.clearInterval(turn);
  }, [held, count]);

  return (
    <ul className={styles.fan} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} aria-label="His apps">
      {cards.map((card, i) => {
        // How far this card is from the middle, the short way round.
        let o = i - active;
        if (o > count / 2) o -= count;
        if (o < -count / 2) o += count;
        const a = Math.abs(o);
        return (
          <li
            key={card.key}
            className={styles.slot}
            data-on={o === 0 || undefined}
            data-far={a > 2 || undefined}
            style={{ "--o": o, "--a": a, "--c": card.color, zIndex: 10 - a } as CSSProperties}
          >
            <button type="button" className={styles.card} aria-label={card.label} aria-pressed={o === 0} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
              {card.node}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
