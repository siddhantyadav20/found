"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { StatusBar } from "@/components/owner/ios/StatusBar";
import screen from "@/components/owner/ios/Screen.module.css";
import styles from "./Device.module.css";

/* ===========================================================================
   The found phone, as the front page shows it (2026-10-24): the game's own
   frame, screen, island and status bar, drawn at the size the game draws
   them (390 × 844 points) and scaled as one picture to whatever box the
   page gives it. Nothing is redrawn for the page: what's on this screen is
   what's on his.
   =========================================================================== */

/** The device at its own size: the 390-point screen and 11 points of frame round it. */
const W = 412;

export default function Device({
  time,
  battery,
  charging,
  locked,
  wallpaper,
  label,
  className,
  children,
}: {
  time: string;
  battery: number;
  charging?: boolean;
  locked?: boolean;
  wallpaper: string;
  /** What the phone is showing, for anyone who can't see it. */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => setK(el.clientWidth / W);
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className={`${styles.box} ${className ?? ""}`}
      data-ready={k !== null || undefined}
      style={k !== null ? ({ "--k": k } as CSSProperties) : undefined}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      <div className={styles.scaled}>
        <div className={`${screen.device} ${styles.device}`}>
          <div className={screen.screen} style={{ "--wallpaper": `url(${wallpaper})` } as CSSProperties}>
            <span className={screen.osIsland} aria-hidden="true" />
            <StatusBar time={time} battery={battery} charging={charging} locked={locked} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
