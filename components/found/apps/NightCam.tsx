"use client";

import { useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { all, has } from "@/lib/found/engine";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import type { AppProps } from "./types";
import styles from "./NightCam.module.css";

/**
 * {name}'s trespass camera: a third-party app in night-vision green. It saves
 * to the cloud and keeps nothing on the phone, so a guard who checks it finds
 * nothing. That's why Kiran found nothing either. The twelve are up there;
 * the phone needs Wi-Fi to fetch them, and sharing needs the owner's face.
 *
 * In Episode 3 they come down one at a time. Each frame waits until the one
 * before it has been opened, so what paces the download is the player, and
 * the newest one lands soft and sharpens. The sync stops at 11 of 12 until the
 * player has understood the eleventh.
 */
export default function NightCam({ state }: AppProps) {
  const ep = useStory();
  const online = has(state, "did:wifi-on");
  const ep2 = has(state, "ep:2");
  const ep3 = has(state, "ep:3");
  const frames = ep.photos.filter((p) => p.album === "nightcam" && all(state, p.requires));
  const [viewing, setViewing] = useState<string | null>(null);
  const total = ep.nightcam.items;
  const pending = Math.max(0, total - frames.length);
  // One more is on its way once the newest has been looked at, unless the
  // story is holding the last one back.
  const newest = frames.at(-1);
  const waitingOnYou = !!newest?.evidence && !has(state, `seen:${newest.evidence}`);
  const status =
    frames.length >= total
      ? `All ${total} downloaded`
      : !ep3
        ? `Downloading ${frames.length} of ${total}`
        : waitingOnYou
          ? `${frames.length} of ${total} downloaded`
          : frames.length === total - 1
            ? `${frames.length} of ${total} · Sync paused`
            : `Downloading ${frames.length + 1} of ${total}`;

  return (
    <section className={styles.nightcam}>
      <header className={styles.bar}>
        <span className={styles.brand}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.6 4.2a8 8 0 1 0 4.2 11.4 6.4 6.4 0 0 1-4.2-11.4Z" />
          </svg>
          NightCam
        </span>
        <span className={styles.cloud}>Cloud only</span>
      </header>

      {!online || frames.length === 0 ? (
        <div className={styles.waiting}>
          <svg viewBox="0 0 64 44" className={styles.cloudArt} aria-hidden="true">
            <path d="M18 40h31a12 12 0 0 0 1.4-23.9A17 17 0 0 0 17.6 13 13.5 13.5 0 0 0 18 40Z" />
            <path d="M32 18v14M26 26l6 6 6-6" />
          </svg>
          <p className={styles.count}>{total} photos</p>
          <p className={styles.line}>In your cloud. Nothing is saved on this phone.</p>
          <p className={styles.state}>{ep2 ? "Waiting for Wi-Fi. Turn it on in Settings." : "Waiting for Wi-Fi. Low Power Mode is on."}</p>
        </div>
      ) : (
        <div className={styles.body}>
          <p className={styles.state} role="status">
            {status}
          </p>
          <div className={styles.grid}>
            {frames.map((p, i) => (
              <button
                type="button"
                key={p.id}
                className={styles.tile}
                data-new={(ep3 && i === frames.length - 1 && waitingOnYou) || undefined}
                onClick={() => setViewing(p.id)}
                aria-label={`Frame ${i + 1}, ${p.takenAt}`}
              >
                <PhotoFrame id={p.id} cast={state.cast} size="thumb" />
                <span className={styles.number} aria-hidden="true">
                  {i + 1}
                </span>
              </button>
            ))}
            {Array.from({ length: pending }, (_, i) => (
              <span key={i} className={styles.pending} aria-hidden="true">
                {/* Only the next one is really coming; the rest are queued. */}
                {(!ep3 || (i === 0 && !waitingOnYou && frames.length < total - 1)) && <span className={styles.spin} />}
              </span>
            ))}
          </div>
          {ep3 && waitingOnYou && <p className={styles.line}>The next one downloads once you&apos;ve opened this one.</p>}
          <p className={styles.line}>Sharing from NightCam needs {state.cast.name}&apos;s face.</p>
        </div>
      )}

      {viewing && <PhotoViewer id={viewing} cast={state.cast} onClose={() => setViewing(null)} />}
    </section>
  );
}
