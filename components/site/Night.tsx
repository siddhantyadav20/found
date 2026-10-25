"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { Beat } from "./NightPhone";
import styles from "./Night.module.css";

/* The phone's code (and Raakh's script with it) comes down only as the
   section nears the screen, so the front page opens light. */
const NightPhone = dynamic(() => import("./NightPhone"), {
  ssr: false,
  loading: () => <span className={styles.waiting} />,
});

/* ===========================================================================
   The night, told down the page (2026-10-24): the beats are the page's own
   server-rendered text; this holds them beside his phone and turns the phone
   to whichever beat is being read. On a wide screen the phone stays put
   while the beats scroll past it; on a phone the beats are cards swiped
   sideways under it.
   =========================================================================== */

const WIDE = "(min-width: 900px)";

export default function Night({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState<Beat>("home");
  const [near, setNear] = useState(false);

  // Fetch the phone a screen or so before it's reached.
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const watch = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  // Whichever beat crosses the middle of the screen (or of the card row) is the one being read.
  useEffect(() => {
    const row = list.current;
    if (!row) return undefined;
    const wide = window.matchMedia(WIDE);
    let watch: IntersectionObserver | null = null;
    const start = () => {
      watch?.disconnect();
      const beats = [...row.querySelectorAll<HTMLElement>("[data-beat]")];
      watch = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const id = (e.target as HTMLElement).dataset.beat as Beat;
            setBeat(id);
            for (const b of beats) b.toggleAttribute("data-on", b === e.target);
          }
        },
        wide.matches ? { rootMargin: "-48% 0px -48% 0px" } : { root: row, rootMargin: "0px -48% 0px -48%" },
      );
      for (const b of beats) watch.observe(b);
    };
    start();
    wide.addEventListener("change", start);
    return () => {
      wide.removeEventListener("change", start);
      watch?.disconnect();
    };
  }, []);

  return (
    <div ref={root} className={styles.night} data-now={beat}>
      <div className={styles.phoneCol}>
        <div className={styles.sticky}>
          <div className={styles.phone}>{near ? <NightPhone beat={beat} /> : <span className={styles.waiting} />}</div>
        </div>
      </div>
      <div ref={list} className={styles.beats}>
        {children}
      </div>
    </div>
  );
}
