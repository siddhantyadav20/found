import Link from "next/link";

import type { CaseMeta } from "@/content/cases";
import Mark from "./Mark";
import styles from "./CaseHeader.module.css";

/* ===========================================================================
   The top of a case's page, above its parcel (2026-10-23): the way home, and
   the chapter's cover in the site's own voice: its number and city, its
   name, the premise, and what to expect. The parcel underneath is the game.
   =========================================================================== */

export default function CaseHeader({ meta, episode }: { meta: CaseMeta; episode: string }) {
  const minutes = meta.tone.split(" · ").at(-1);
  return (
    <header className={styles.head}>
      <nav className={styles.bar}>
        <Link href="/" className={styles.home} aria-label="Found, home">
          <Mark size={17} />
        </Link>
        <span className={styles.crumb}>
          Chapter {String(meta.chapter).padStart(2, "0")} · {meta.city}
        </span>
      </nav>
      <div className={styles.cover}>
        <p className={styles.kicker}>Episode 1 · {episode}</p>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.logline}>{meta.logline}</p>
        <ul className={styles.meta}>
          <li>{meta.episodes} episodes</li>
          {minutes && <li>{minutes}</li>}
          <li>Sound on</li>
        </ul>
      </div>
    </header>
  );
}
