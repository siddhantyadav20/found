"use client";

import { ViewTransition } from "react";

import { useCase } from "@/components/found/StoryContext";
import { StorageWarning } from "../KeepCase";
import SoundToggle from "../SoundToggle";
import InAppGuard from "./InAppGuard";
import styles from "./Envelope.module.css";

/**
 * The cold open, in the site's own voice: Canela, an orange eyebrow, a white
 * key. Everything after this is the phone's voice instead. The envelope
 * shivers every few seconds, because the phone inside it is buzzing.
 *
 * Server-rendered. A passed-on phone's label carries the friend's name
 * (`label`); otherwise it's the story's own "TO YOU / BY HAND". Two notes
 * only the browser can decide on join it there: inside Instagram or
 * Facebook, and a browser that won't keep anything (a case number instead).
 */
export default function Envelope({ onOpen, label }: { onOpen: () => void; label?: readonly string[] }) {
  const { id, story: ep, meta, minutes } = useCase();
  return (
    <div className={styles.stage} data-envelope>
      <p className={styles.eyebrow}>Episode 1 · {ep.title}</p>
      <div className={styles.envelope} aria-hidden="true">
        {/* The phone picked up off the desk lands here. */}
        <ViewTransition name="found-phone" share="morph" default="none">
          <span className={styles.phone} />
        </ViewTransition>
        <span className={styles.front} />
        <span className={styles.label}>
          {(label ?? ep.envelope.label).map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </span>
      </div>
      <div className={styles.lines}>
        {ep.envelope.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <InAppGuard />
      <button type="button" className={styles.cta} onClick={onOpen}>
        {ep.envelope.cta}
      </button>
      <p className={styles.small}>
        <SoundToggle className={styles.soundLink} /> · headphones better · about {minutes ?? 30} min · saves as you play
      </p>
      <p className={styles.note}>{meta.note}</p>
      <div className={styles.keep}>
        <StorageWarning caseId={id} />
      </div>
    </div>
  );
}
