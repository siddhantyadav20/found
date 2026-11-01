"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { REELS, type Reel } from "@/content/site";
import { describeCase } from "@/lib/found/keeping";
import { useYourCases } from "@/lib/found/shelf";
import { SiteLink } from "./Chrome";
import { reel } from "./reel";
import { onFrame, track } from "./scroll";
import styles from "./ChapterPage.module.css";

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/**
 * Where siena.film runs a film's trailer, the way into the game: the still
 * grows to fill the frame as the page reaches it, and says Continue to anyone
 * already part-way through.
 */
export default function ChapterPlay({ item }: { item: Reel }) {
  const cases = useYourCases();
  const now = useSyncExternalStore(never, minute, () => 0);
  const card = cases?.find((c) => c.id === item.id);
  const line = card ? describeCase(card.save, card.solved, now) : null;
  const frame = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLDivElement>(null);

  // The ticket follows whichever chapter's page this is.
  useEffect(() => reel.setSlot(REELS.findIndex((r) => r.id === item.id)), [item.id]);

  useEffect(() => {
    const el = frame.current;
    const inner = picture.current;
    if (!el || !inner) return;
    const phone = innerWidth <= 767;
    const place = track(el, "bottom", "bottom");
    let last = -1;
    const off = onFrame(() => {
      const e = 1 - place.value();
      if (e === last) return;
      last = e;
      const [outer, within] = phone ? [e * 5 + 95, 100 - e * 5 + 5] : [e * 20 + 80, 100 - e * 20 + 30];
      el.style.transform = `scale(${outer / 100})`;
      inner.style.transform = `scale(${within / 100})`;
    });
    return () => {
      off();
      place.destroy();
    };
  }, []);

  return (
    <section className={styles.action}>
      <div ref={frame} className={styles.actionFrame}>
        <div className={styles.actionClip}>
          <div ref={picture} className={styles.actionPicture} style={{ backgroundImage: `url(${item.still})` }} />
        </div>
        <SiteLink href={item.play} className={styles.actionCta} aria-label={`${line?.cta ?? item.cta}: ${item.title}`}>
          <span className={styles.playGhost} aria-hidden="true" />
          <svg className={styles.playMark} viewBox="0 0 88 95" fill="currentColor" aria-hidden="true">
            <path d="M84 41.6c4.4 2.6 4.4 9.1 0 11.8L9 93.9C4.6 96.4 0 93.2 0 88.1V6.9C0 1.8 4.6-1.4 9 1.1l75 40.5Z" />
          </svg>
          <span className={styles.actionEyebrow}>Action!</span>
          <span className={styles.actionText}>{line?.cta ?? item.cta}</span>
        </SiteLink>
      </div>
    </section>
  );
}
