"use client";

import { useEffect } from "react";

import { buzz, warmBuzz } from "@/lib/found/buzz";
import styles from "./Seat.module.css";

/* ===========================================================================
   Found on a seat, not in a parcel (Last Local): the steel bench of a Mumbai
   local at night, a phone face down where a girl was sitting, buzzing. One
   line, the content note, and one thing to do.
   =========================================================================== */

export default function Seat({ seat, onOpen }: { seat: { line: string; note: string; act: string }; onOpen: () => void }) {
  useEffect(() => {
    warmBuzz();
    let n = 0;
    const t = window.setInterval(() => (++n > 8 ? window.clearInterval(t) : buzz()), 2600);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.bench} aria-hidden="true">
        <span className={styles.phone} />
      </div>
      <p className={styles.line}>{seat.line}</p>
      <p className={styles.note}>{seat.note}</p>
      <button type="button" className={`act ${styles.act}`} onClick={onOpen}>
        {seat.act}
      </button>
    </div>
  );
}
