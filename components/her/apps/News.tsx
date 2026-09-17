"use client";

import type { Story } from "@/content/types";
import styles from "./News.module.css";

/* City Desk, at 1:11 AM. The dateline is the story: the article the player
   reads here is the one that arrived on this phone before any newsroom had
   it. The real one is published at 6:42 (CHAPTER1.md, twist 7). */

export default function News({ story }: { story: Story }) {
  const a = story.article;
  return (
    <article className={styles.article}>
      <p className={styles.kicker}>{a.kicker}</p>
      <h3 className={styles.headline}>{a.headline}</h3>
      {a.body.map((p, i) => (
        <p key={i} className={styles.para}>
          {p}
        </p>
      ))}
      <p className={styles.note}>{a.note}</p>
    </article>
  );
}
