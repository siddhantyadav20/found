"use client";

import { useCase } from "@/components/found/StoryContext";
import styles from "./Envelope.module.css";

/**
 * The cold open, in the site's own voice: Canela, an orange eyebrow, a white
 * key. Everything after this is the phone's voice instead. The envelope
 * shivers every few seconds, because the phone inside it is buzzing.
 *
 * Server-rendered. A passed-on phone's label carries the friend's name
 * (`label`); otherwise it's the story's own "TO YOU / BY HAND".
 */
export default function Envelope({ onOpen, label }: { onOpen: () => void; label?: readonly string[] }) {
  const { story: ep, minutes } = useCase();
  return (
    <div className={styles.stage} data-envelope>
      <p className={styles.eyebrow}>Episode 1 · {ep.title}</p>
      <div className={styles.envelope} aria-hidden="true">
        <span className={styles.phone} />
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
      <button type="button" className={styles.cta} onClick={onOpen}>
        {ep.envelope.cta}
      </button>
      <p className={styles.small}>Sound on. About {minutes ?? 30} minutes. Your progress is saved on this device.</p>
    </div>
  );
}
