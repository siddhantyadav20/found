"use client";

import phone from "@/components/owner/ios/Screen.module.css";
import { useDevice } from "@/lib/found/platform";
import styles from "./Phone.module.css";

/* ===========================================================================
   Your phone: the second device on the table.

   It matches the player's own platform, because it is meant to be theirs:
   an iPhone's lock screen for an iPhone, a Pixel's for Android. It is almost
   empty on purpose — a plain wallpaper, the time, nothing waiting. ROADMAP S9
   puts the draft post and the record on it; the emptiness until then is what
   makes those land.

   Drawn with the found phone's own device frame, a size smaller, so the two read as
   two real phones on one table rather than one phone and a sketch.
   =========================================================================== */

export default function YourPhone({ time, day, ringing }: { time: string; day: string; ringing?: boolean }) {
  const { os } = useDevice();
  const [h, m] = time.split(":");

  return (
    <div className={styles.holder} data-ringing={ringing || undefined} aria-label="Your own phone">
      <div className={phone.device}>
        <div className={`${phone.screen} ${styles.screen}`} data-os={os}>
          {os === "ios" && <span className={phone.osIsland} aria-hidden="true" />}
          {os === "ios" ? (
            <div className={styles.ios}>
              <p className={styles.day}>{day}</p>
              <p className={styles.clock}>{time}</p>
            </div>
          ) : (
            <div className={styles.android}>
              <p className={styles.bigClock}>
                <span>{h}</span>
                <span>{m}</span>
              </p>
              <p className={styles.date}>{day}</p>
            </div>
          )}
          <p className={styles.nothing}>No notifications</p>
        </div>
      </div>
    </div>
  );
}
