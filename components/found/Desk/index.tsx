import Image from "next/image";
import Link from "next/link";

import { CASES, FEATURED } from "@/content/cases";
import YourCases from "./YourCases";
import styles from "./Desk.module.css";

/** How many of the teaser's notifications land on the desk phone. */
const SHOWN = 4;

/**
 * The homepage: a desk at night with things people left behind on it.
 *
 * The phone is the one live object. It buzzes as its lock screen fills up,
 * and picking it up opens the case. The shapes around it are other found
 * things, deliberately unnamed until their cases exist.
 *
 * Server-rendered: the buzzing and the arriving notifications are CSS. The
 * one island is "Your cases" underneath, which only the browser can know. A
 * passed-on link never comes here; it goes straight to its envelope
 * (`/d/[code]`).
 */
export default function Desk() {
  const meta = CASES[FEATURED];
  return (
    <main className={styles.room} id="main">
      <header className={styles.head}>
        <h1 className={styles.brand}>Found</h1>
        <p className={styles.tagline}>Mysteries played on the missing person&apos;s phone.</p>
      </header>

      <div className={styles.desk}>
        <span className={`${styles.thing} ${styles.thingA}`} aria-hidden="true" />
        <span className={`${styles.thing} ${styles.thingB}`} aria-hidden="true" />
        <Link href={meta.href} className={styles.phone} aria-label={`${meta.title}. ${meta.hint} Pick it up.`}>
          <span className={styles.screen}>
            <Image src={meta.wallpaper} alt="" fill priority sizes="220px" className={styles.wallpaper} />
            <span className={styles.time}>08:10</span>
            <span className={styles.notes}>
              {meta.teaser.slice(0, SHOWN).map((n, i) => (
                <span key={n.text} className={styles.note} style={{ "--i": i } as React.CSSProperties}>
                  <b>{n.from}</b>
                  <span>{n.text}</span>
                </span>
              ))}
            </span>
          </span>
        </Link>
      </div>

      <div className={styles.caption}>
        <p className={styles.eyebrow}>Case 1 · {meta.title}</p>
        <p className={styles.hint}>{meta.hint}</p>
        <Link href={meta.href} className={styles.cta}>
          Pick it up
        </Link>
        <p className={styles.small}>More are being found.</p>
      </div>

      <YourCases />
    </main>
  );
}
