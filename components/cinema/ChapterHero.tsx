"use client";

import { useSyncExternalStore } from "react";

import type { Reel } from "@/content/site";
import { describeCase } from "@/lib/found/keeping";
import { useYourCases } from "@/lib/found/shelf";
import { SiteLink } from "./Chrome";
import ExploreFace from "./ExploreFace";
import Title from "./Title";
import styles from "./ChapterHero.module.css";

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/**
 * The top of a chapter's page: the still, the way back, the ruled title. The
 * rest of the page is still to come; the ticket on the band is the way into
 * the game, and says Continue to anyone already part-way through it.
 */
export default function ChapterHero({ item }: { item: Reel }) {
  const cases = useYourCases();
  const now = useSyncExternalStore(never, minute, () => 0);
  const card = cases?.find((c) => c.id === item.id);
  const line = card ? describeCase(card.save, card.solved, now) : null;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <picture>
          <source media="(max-width: 767px)" srcSet={item.tall} />
          <img className={styles.image} src={item.still} alt="" draggable={false} />
        </picture>
        <SiteLink href="/chapters" className={styles.back}>
          <span className={styles.round}>
            <svg viewBox="0 0 11 10" fill="currentColor" aria-hidden="true">
              <path d="M6.519.005a6.65 6.65 0 0 0-6.46 4.659 1.1 1.1 0 0 0 .003.706C.698 7.105 2.682 10 6.52 10V8.39c-.941.127-2.922-.257-4.442-2.603H11V4.208H2.062c.756-1.229 2.216-2.78 4.457-2.78V.006Z" />
            </svg>
          </span>
          All chapters
        </SiteLink>
      </section>
      <section className={styles.band}>
        <div className={styles.eyebrow}>{item.eyebrow}</div>
        <div className={styles.rules}>
          <Title text={item.title} className={styles.title} />
        </div>
        <span className={styles.down} aria-hidden="true">
          <svg viewBox="0 0 11 10" fill="currentColor">
            <path d="M4.481.005a6.65 6.65 0 0 1 6.46 4.659c.078.229.08.479-.003.706C10.302 7.105 8.318 10 4.48 10V8.39c.941.127 2.922-.257 4.442-2.603H0V4.208h8.938c-.756-1.229-2.216-2.78-4.457-2.78V.006Z" />
          </svg>
        </span>
        <SiteLink href={item.play} className={styles.play} data-btn="explore" aria-label={`Play ${item.title}`}>
          <ExploreFace label={(line?.cta ?? "Play").toUpperCase()} />
        </SiteLink>
      </section>
    </main>
  );
}
