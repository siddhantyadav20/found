"use client";

import Link from "next/link";
import { useEffect } from "react";

import Mark from "@/components/site/Mark";
import type { CaseMeta } from "@/content/cases";
import { buzz, warmBuzz } from "@/lib/found/buzz";
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
      {/* The way home, and which chapter this is, as every chapter's first screen has them. */}
      <header className={styles.bar}>
        <Link href="/" className={styles.home} aria-label="Found, home">
          <Mark size={17} />
        </Link>
        <span className={styles.crumb}>
          Chapter {String(meta.chapter).padStart(2, "0")} · {meta.city}
        </span>
      </header>
      <div className={styles.bench} aria-hidden="true">
        <span className={styles.phone} />
      </div>
      <h1 className={styles.title}>{meta.title}</h1>
      <p className={styles.line}>{seat.line}</p>
      <p className={styles.note}>{seat.note}</p>
      <button type="button" className={`act ${styles.act}`} onClick={onOpen}>
        {seat.act}
      </button>
    </div>
  );
}
