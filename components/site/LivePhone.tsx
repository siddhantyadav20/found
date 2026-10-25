"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import type { Beat } from "./NightPhone";
import styles from "./Live.module.css";
import { useNear } from "./useNear";

/* His phone, working, wherever a page wants one (2026-10-25): the game's
   own screens on Raakh's script, fetched only as it nears the screen. */

const NightPhone = dynamic(() => import("./NightPhone"), {
  ssr: false,
  loading: () => <span className={styles.shell} />,
});

export default function LivePhone({ beat, className }: { beat: Beat; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  return (
    <div ref={box} className={`${styles.phone} ${className ?? ""}`}>
      {near ? <NightPhone beat={beat} /> : <span className={styles.shell} />}
    </div>
  );
}
