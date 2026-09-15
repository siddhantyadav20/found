"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { useCase } from "@/components/found/StoryContext";
import { chromeIntent, inAppBrowser, useDevice, type InApp } from "@/lib/found/platform";
import { track } from "@/lib/found/track";
import styles from "./Envelope.module.css";

const NAMES: Record<InApp, string> = { instagram: "Instagram", facebook: "Facebook" };

const never = () => () => {};

/** `?inapp=instagram` / `?inapp=facebook` in dev. */
function readInApp(): InApp | null {
  if (process.env.NODE_ENV === "development") {
    const forced = new URLSearchParams(window.location.search).get("inapp");
    if (forced === "instagram" || forced === "facebook") return forced;
  }
  return inAppBrowser(navigator.userAgent);
}

let counted = false;

/**
 * On the envelope, inside Instagram's or Facebook's own browser: a note, not
 * a wall. Those browsers forget everything when they close, and a case is
 * longer than a scroll. On Android it opens the page in Chrome; on an iPhone
 * it can only say where the menu is.
 */
export default function InAppGuard() {
  const { id } = useCase();
  const app = useSyncExternalStore(never, readInApp, () => null);
  const { os } = useDevice();
  const [stay, setStay] = useState(false);

  useEffect(() => {
    if (!app || counted) return;
    counted = true;
    track({ case: id, event: "guard:inapp" });
  }, [app, id]);

  if (!app || stay) return null;
  return (
    <div className={styles.guard} role="note">
      <p className={styles.guardTitle}>You&apos;re inside {NAMES[app]}.</p>
      <p className={styles.guardText}>
        It forgets everything when you close it, and this case takes a while. Open it in your browser to keep your place.
      </p>
      {os === "android" ? (
        <a className={styles.guardCta} href={chromeIntent(window.location.href)} onClick={() => track({ case: id, event: "guard:chrome" })}>
          Open in Chrome
        </a>
      ) : (
        <p className={styles.guardText}>
          Tap <b>•••</b> at the top, then open it in Safari.
        </p>
      )}
      <button type="button" className={styles.guardStay} onClick={() => setStay(true)}>
        Play here anyway
      </button>
    </div>
  );
}
