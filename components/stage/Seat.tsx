"use client";

import { useEffect } from "react";

import type { CaseMeta } from "@/content/cases";
import { buzz, warmBuzz } from "@/lib/found/buzz";
import { Mast, Still } from "./Film";
import styles from "./Seat.module.css";

/* ===========================================================================
   Found on a seat, not in a parcel (Last Local): the steel bench of a Mumbai
   local at night, a phone face down where a girl was sitting, buzzing. One
   line, the content note, and one thing to do.
   =========================================================================== */

export default function Seat({ seat, meta, onOpen }: { seat: { line: string; note: string; act: string }; meta: CaseMeta; onOpen: () => void }) {
  useEffect(() => {
    warmBuzz();
    let n = 0;
    const t = window.setInterval(() => (++n > 8 ? window.clearInterval(t) : buzz()), 2600);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={styles.wrap}>
      <Mast label={`Chapter ${String(meta.chapter).padStart(2, "0")} · ${meta.city}`} />
      {meta.scene && <Still src={meta.scene.parcel} priority className={styles.photo} />}
      <section className={styles.cover}>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.line}>{seat.line}</p>
        <p className={styles.note}>{seat.note}</p>
        <button type="button" className={`act ${styles.act}`} onClick={onOpen}>
          {seat.act}
        </button>
      </section>
    </div>
  );
}
