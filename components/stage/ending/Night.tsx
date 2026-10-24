"use client";

import { useState } from "react";

import { useCase } from "@/components/found/StoryContext";
import type { Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { nightOf, nightText } from "@/lib/found/night";
import { track } from "@/lib/found/track";
import styles from "./Ending.module.css";

/* ===========================================================================
   Your night (2026-10-24): what this player did, hour by hour, in full, and
   a share of it that names nobody and gives nothing away.
   =========================================================================== */

export default function Night({ story, state }: { story: Story; state: CaseState }) {
  const { id, meta } = useCase();
  const beats = nightOf(story, state);
  const [copied, setCopied] = useState(false);
  if (beats.length < 3) return null;

  const text = () => nightText(story.title, beats, meta.ask, `${window.location.origin}/c/${id}`);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <section className={styles.section} aria-labelledby="night">
      <p className={styles.eyebrow} id="night">
        Your night
      </p>
      <ol className={styles.night}>
        {beats.map((b, i) => (
          <li key={`${b.at}-${i}`} style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
            <span className={styles.nightAt}>{b.at}</span>
            <span className={styles.nightText}>{b.text}</span>
          </li>
        ))}
      </ol>
      <p className={styles.nightNote}>Shared, it reads without names or spoilers.</p>
      <div className={styles.nightActs}>
        {/* A real link, never a popup opened from script, so no in-app browser blocks it. */}
        <a
          className={styles.button}
          href={typeof window === "undefined" ? undefined : `https://wa.me/?text=${encodeURIComponent(text())}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({ case: id, event: "share:night" })}
        >
          Send on WhatsApp
        </a>
        {canShare ? (
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              track({ case: id, event: "share:night" });
              void navigator.share({ text: text() }).catch(() => {});
            }}
          >
            Share
          </button>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              track({ case: id, event: "share:night" });
              void navigator.clipboard?.writeText(text()).then(() => setCopied(true), () => {});
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </section>
  );
}
