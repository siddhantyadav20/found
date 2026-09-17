"use client";

import type { ReactNode } from "react";

import type { AppId } from "@/content/types";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/Screen.module.css";

/* ===========================================================================
   Her phone: an iPhone, in current iOS, drawn by us.

   It was Nikhil's, two handsets ago, and he set it up for her the way sons
   do: her Apple Account is still half his, the text is two sizes up, and
   nothing has been tidied since.

   **The blue pill around the clock** is the chapter. iOS puts it there
   whenever something is recording or sharing the screen, everyone has seen
   one, and nobody looks. It has been on since Thursday at 8:14 PM, and it
   is not explained until Episode 2 (CHAPTER1.md, the pivot to iOS).
   =========================================================================== */

export default function Screen({
  time,
  battery,
  wallpaper,
  recording,
  banner,
  onBanner,
  children,
}: {
  time: string;
  battery: number;
  /** Her grandson, taken on somebody else's phone and sent to her. */
  wallpaper: string;
  /** Something is sharing this screen. It has been, the whole time. */
  recording?: boolean;
  banner?: { readonly app: AppId; readonly from: string; readonly text: string } | null;
  onBanner?: () => void;
  children: ReactNode;
}) {
  // At 7% a true-width fill is a hairline, so Episode 1 draws it generously.
  const width = Math.max(8, Math.min(100, battery * 6));

  return (
    <div className={styles.device}>
      <div className={styles.screen} style={{ "--wallpaper": `url(${wallpaper})` } as React.CSSProperties}>
        <div className={styles.osIsland} aria-hidden="true" />

        <div className={styles.status} aria-hidden="true">
          <span data-recording={recording || undefined} className={recording ? styles.recording : undefined}>
            {time}
          </span>
          <span className={styles.statusIcons}>
            <svg viewBox="0 0 18 12" className={styles.signal}>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" opacity={i < 3 ? 1 : 0.3} />
              ))}
            </svg>
            <svg viewBox="0 0 16 12" className={styles.wifi}>
              <path d="M8 11.2 5.7 8.9a3.3 3.3 0 0 1 4.6 0L8 11.2Z" />
              <path d="M3.6 6.8a6.2 6.2 0 0 1 8.8 0l-1.3 1.3a4.4 4.4 0 0 0-6.2 0L3.6 6.8Z" />
              <path d="M1.4 4.6a9.3 9.3 0 0 1 13.2 0l-1.3 1.3a7.5 7.5 0 0 0-10.6 0L1.4 4.6Z" />
            </svg>
            <span className={styles.battery} data-low={battery <= 7 || undefined}>
              <span className={styles.cell}>
                <span className={styles.fill} style={{ width: `${width}%` }} />
                <span className={styles.cellNum} data-dark={width >= 55 || undefined}>
                  {battery}
                </span>
              </span>
            </span>
          </span>
        </div>

        {banner && (
          <button type="button" className={styles.banner} onClick={onBanner}>
            <span className={styles.bannerIcon}>
              <AppGlyph app={banner.app} />
            </span>
            <span className={styles.bannerText}>
              <span className={styles.bannerFrom}>{banner.from}</span>
              <span className={styles.bannerBody}>{banner.text}</span>
            </span>
          </button>
        )}

        {children}

        <span className={styles.homeBar} aria-hidden="true" />
      </div>
    </div>
  );
}
