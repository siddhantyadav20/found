"use client";

import Image from "next/image";
import { useState } from "react";

import type { Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import Alert from "../ios/Alert";
import styles from "@/components/stage/v3/Reveal.module.css";

/* ===========================================================================
   Camera (RAAKH-V3 §7.8): unavailable in Low Power Mode on this device, and
   it says so, until the reveal (a fiction rule, kept consistently: the
   camera opens only when Meera asks, and the phone is charged by then).
   After it, the front camera: the same face, and a shutter. Nothing real is
   ever asked for; the viewfinder is a picture (§17, privacy).
   =========================================================================== */

export default function Camera({ story, state, onHome, onPhoto }: { story: Story; state: CaseState; onHome: () => void; onPhoto: () => void }) {
  const cam = story.camera;
  const open = Boolean(cam && all(state, cam.after));
  const [flash, setFlash] = useState(false);
  if (!cam) return null;
  if (!open) return <Alert title="Camera" message={cam.unavailable} button="OK" onClose={onHome} />;
  const shot = has(state, "did:camera-photo");
  return (
    <div className={styles.camera} style={{ position: "absolute" }} role="dialog" aria-label="The front camera">
      <p className={styles.camTop}>PHOTO</p>
      <div className={styles.finder}>
        <Image src={cam.src} alt="The front camera: the man holding this phone" fill sizes="100vw" />
        <span className={styles.blink} aria-hidden="true" />
        {flash && <span className={styles.flash} onAnimationEnd={() => setFlash(false)} aria-hidden="true" />}
      </div>
      <div className={styles.camBar}>
        <button type="button" onClick={onHome}>
          Done
        </button>
        <button
          type="button"
          className={styles.shutter}
          aria-label="Take Photo"
          onClick={() => {
            setFlash(true);
            if (!shot) onPhoto();
          }}
        />
        <span className={styles.thumb}>{shot && <Image src={cam.src} alt="" fill sizes="52px" style={{ objectFit: "cover" }} />}</span>
      </div>
    </div>
  );
}
