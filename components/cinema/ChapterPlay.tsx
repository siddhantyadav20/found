"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";

import { REELS, type Reel } from "@/content/site";
import { describeCase } from "@/lib/found/keeping";
import { soundOn } from "@/lib/sound";
import { useYourCases } from "@/lib/found/shelf";
import { SiteLink } from "./Chrome";
import ExploreFace from "./ExploreFace";
import { reel } from "./reel";
import { onFrame, track } from "./scroll";
import styles from "./ChapterPage.module.css";

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/** What the button into the game says: Play now, or where they left off. */
function useCta(item: Reel) {
  const cases = useYourCases();
  const now = useSyncExternalStore(never, minute, () => 0);
  const card = cases?.find((c) => c.id === item.id);
  return card ? describeCase(card.save, card.solved, now).cta : null;
}

/** The ticket into the game, in the site's own Explore face. */
export function PlayNow({ item, className }: { item: Reel; className?: string }) {
  const cta = useCta(item) ?? "Play now";
  return (
    <SiteLink href={item.play} className={className} data-btn="explore" aria-label={`${cta}: ${item.title}`}>
      <ExploreFace label={cta.toUpperCase()} />
    </SiteLink>
  );
}

/** A link that glides down to a part of the page rather than jumping to it. */
export function Jump({ to, className, children, label }: { to: string; className?: string; children: ReactNode; label?: string }) {
  const glide = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(to);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };
  return (
    <a href={`#${to}`} onClick={glide} className={className} aria-label={label}>
      {children}
    </a>
  );
}

/**
 * Where siena.film runs a film's trailer: ours, where a chapter has one, with
 * the ticket into the game under it. A chapter without one keeps the way into
 * the game here instead. Either way the frame grows to fill the screen as the
 * page reaches it.
 */
export default function ChapterPlay({ item }: { item: Reel }) {
  const cta = useCta(item);
  const frame = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { trailer } = item;

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

  const mark = (
    <>
      <span className={styles.playGhost} aria-hidden="true" />
      <svg className={styles.playMark} viewBox="0 0 88 95" fill="currentColor" aria-hidden="true">
        <path d="M84 41.6c4.4 2.6 4.4 9.1 0 11.8L9 93.9C4.6 96.4 0 93.2 0 88.1V6.9C0 1.8 4.6-1.4 9 1.1l75 40.5Z" />
      </svg>
    </>
  );

  if (!trailer) {
    return (
      <section className={styles.action}>
        <div ref={frame} className={styles.actionFrame}>
          <div className={styles.actionClip}>
            <div ref={picture} className={styles.actionPicture} style={{ backgroundImage: `url(${item.still})` }} />
          </div>
          <SiteLink href={item.play} className={styles.actionCta} aria-label={`${cta ?? item.cta}: ${item.title}`}>
            {mark}
            <span className={styles.actionEyebrow}>Action!</span>
            <span className={styles.actionText}>{cta ?? item.cta}</span>
          </SiteLink>
        </div>
      </section>
    );
  }

  return (
    <section id="trailer" className={styles.action}>
      <div ref={frame} className={styles.actionFrame} data-trailer>
        <div className={styles.actionClip}>
          <div ref={picture} className={styles.actionPicture} data-playing={playing || undefined} style={{ backgroundImage: `url(${trailer.poster})` }}>
            {playing && (
              <video
                className={styles.trailerVideo}
                src={trailer.src}
                poster={trailer.poster}
                autoPlay
                // The site's one sound setting decides how it starts; its own controls can change that.
                muted={!soundOn()}
                controls
                playsInline
                onEnded={() => setPlaying(false)}
              />
            )}
          </div>
        </div>
        {!playing && (
          <button type="button" className={styles.actionCta} onClick={() => setPlaying(true)} aria-label={`Watch the trailer: ${item.title}`}>
            {mark}
            <span className={styles.actionEyebrow}>Trailer · {trailer.length}</span>
            <span className={styles.actionText}>Watch it</span>
          </button>
        )}
      </div>
      <div className={styles.trailerFoot}>
        <span className={styles.eyebrow}>Then play it yourself</span>
        <PlayNow item={item} />
      </div>
    </section>
  );
}
