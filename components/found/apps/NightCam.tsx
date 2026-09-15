"use client";

import { useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { has } from "@/lib/found/engine";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import type { AppProps } from "./types";
import styles from "./NightCam.module.css";

/**
 * {name}'s trespass camera: a third-party app in night-vision green. It saves
 * to the cloud and keeps nothing on the phone, so a guard who checks it finds
 * nothing. That's why Kiran found nothing either. The twelve are up there;
 * the phone needs Wi-Fi to fetch them, and sharing needs the owner's face.
 */
export default function NightCam({ state }: AppProps) {
  const ep = useStory();
  const online = has(state, "did:wifi-on");
  const ep2 = has(state, "ep:2");
  const first = ep.photos.find((p) => p.id === ep.nightcam.firstFrame);
  const [viewing, setViewing] = useState(false);
  const rest = ep.nightcam.items - 1;

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

      {!online || !first ? (
        <div className={styles.waiting}>
          <svg viewBox="0 0 64 44" className={styles.cloudArt} aria-hidden="true">
            <path d="M18 40h31a12 12 0 0 0 1.4-23.9A17 17 0 0 0 17.6 13 13.5 13.5 0 0 0 18 40Z" />
            <path d="M32 18v14M26 26l6 6 6-6" />
          </svg>
          <p className={styles.count}>11 photos and 1 video</p>
          <p className={styles.line}>In your cloud. Nothing is saved on this phone.</p>
          <p className={styles.state}>{ep2 ? "Waiting for Wi-Fi. Turn it on in Settings." : "Waiting for Wi-Fi. Low Power Mode is on."}</p>
        </div>
      ) : (
        <div className={styles.body}>
          <p className={styles.state}>Downloading 1 of {ep.nightcam.items}</p>
          <div className={styles.grid}>
            <button type="button" className={styles.tile} onClick={() => setViewing(true)} aria-label={`${first.place}, ${first.takenAt}`}>
              <PhotoFrame id={first.id} cast={state.cast} size="thumb" />
            </button>
            {Array.from({ length: rest }, (_, i) => (
              <span key={i} className={styles.pending} aria-hidden="true">
                <span className={styles.spin} />
              </span>
            ))}
          </div>
          <p className={styles.line}>Sharing from NightCam needs {state.cast.name}&apos;s face.</p>
        </div>
      )}

      {viewing && first && <PhotoViewer id={first.id} cast={state.cast} onClose={() => setViewing(false)} />}
    </section>
  );
}
