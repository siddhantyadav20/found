"use client";

import type { ReactNode } from "react";

import type { AppId, Story } from "@/content/types";
import { unseenIn, type CaseState } from "@/lib/game/engine";
import styles from "./Phone.module.css";

/* ===========================================================================
   Her phone: a mid-range Android, set up by a 64-year-old who has had it for
   four years. The font is two steps larger than the default, the wallpaper is
   her grandson, and there are 3,412 unread good mornings.

   The phone is characterisation (PROJECT.md, the pivot): none of this is
   decoration, and none of it is the player's own platform.

   One thing on this screen is the chapter: **the grey shield in the status
   bar**, on from the first second, explained by nobody until Episode 2.
   =========================================================================== */

const TINT: Partial<Record<AppId, string>> = {
  whatsapp: "#1f7a4d",
  phone: "#2f6fd0",
  gallery: "#b4532f",
  settings: "#5a5f66",
  pikdrop: "#b98a1d",
  instagram: "#a8336b",
  messages: "#2f7fb0",
  notes: "#b39412",
  chrome: "#4a6ea8",
  news: "#8a2f2f",
  casefile: "#c96a25",
};

export default function Phone({
  story,
  state,
  time,
  battery,
  open,
  onOpen,
  onBack,
  banner,
  onBanner,
  children,
}: {
  story: Story;
  state: CaseState;
  /** Her clock, in her time zone: the one the wall clock disagrees with. */
  time: string;
  battery: number;
  open: AppId | null;
  onOpen: (app: AppId) => void;
  onBack: () => void;
  banner?: { readonly app: AppId; readonly text: string } | null;
  onBanner?: () => void;
  children?: ReactNode;
}) {
  const label = story.hersHome.find((a) => a.app === open)?.label ?? "";

  return (
    <div className={styles.phone}>
      <div className={styles.status}>
        <span className={styles.time}>{time}</span>
        <span className={styles.icons}>
          {/* Nobody ever asks what this one is. That is the point. */}
          <span className={styles.shield} title="RBI KYC Assist" aria-label="An app is watching this screen">
            <svg viewBox="0 0 12 14" width="9" height="11" aria-hidden="true">
              <path d="M6 0 11.5 2v5.5C11.5 11 9 13.2 6 14 3 13.2.5 11 .5 7.5V2z" fill="#8f8a83" />
            </svg>
          </span>
          <span className={styles.signal} aria-hidden="true" />
          <span className={styles.battery} data-low={battery <= 10 ? "" : undefined}>
            {battery}%
          </span>
        </span>
      </div>

      {banner && (
        <button type="button" className={styles.banner} onClick={onBanner}>
          <span className={styles.bannerDot} style={{ background: TINT[banner.app] }} aria-hidden="true" />
          <span className={styles.bannerText}>{banner.text}</span>
        </button>
      )}

      {open ? (
        <section className={styles.app} aria-label={label}>
          <header className={styles.appBar}>
            <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
              ‹
            </button>
            <h2 className={styles.appTitle}>{label}</h2>
          </header>
          <div className={styles.appBody}>{children}</div>
        </section>
      ) : (
        <div className={styles.home}>
          <p className={styles.homeClock}>
            {time}
            <span className={styles.homeDay}>{story.clocks[0].day}</span>
          </p>
          <div className={styles.grid}>
            {story.hersHome.map(({ app, label: name }) => {
              const unseen = unseenIn(story, state, app);
              return (
                <button key={app} type="button" className={styles.icon} onClick={() => onOpen(app)}>
                  <span className={styles.tile} style={{ background: TINT[app] ?? "#4a4f55" }} aria-hidden="true">
                    {name.slice(0, 1)}
                  </span>
                  {unseen > 0 && <span className={styles.badge}>{unseen}</span>}
                  <span className={styles.name}>{name}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.navBar} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
