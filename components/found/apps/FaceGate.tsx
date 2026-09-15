"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { keyTap, refuse } from "@/lib/found/buzz";
import { digits } from "@/lib/found/engine";
import styles from "./FaceGate.module.css";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const LETTERS: Record<string, string> = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ" };

/** How long Face ID looks before it gives up, and how long it says so. */
const SCAN_MS = 1400;
const FAILED_MS = 1100;

function FaceGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={styles.face}>
      <path d="M15 5H10a5 5 0 0 0-5 5v5M33 5h5a5 5 0 0 1 5 5v5M15 43h-5a5 5 0 0 1-5-5v-5M33 43h5a5 5 0 0 0 5-5v-5" />
      <path d="M17 18v3M31 18v3M24 18v8h-2M18 32a9 9 0 0 0 12 0" />
    </svg>
  );
}

/**
 * What iOS puts in front of Recently Deleted: Face ID, which doesn't know the
 * player's face, then the phone's passcode. The player already knows it.
 * This makes reaching the deleted photo feel like what it is: going through
 * someone else's locked album.
 *
 * It asks once per visit to Photos, the way the album locks again when the
 * app closes. Nothing is saved: it's a door, not a step in the case.
 */
export default function FaceGate({ onOpen, onCancel }: { onOpen: () => void; onCancel: () => void }) {
  const ep = useStory();
  const answer = ep.locks.find((l) => l.id === "passcode")?.answer ?? "";
  const [phase, setPhase] = useState<"scan" | "failed" | "pad">("scan");
  const [code, setCode] = useState("");
  const [shakes, setShakes] = useState(0);

  useEffect(() => {
    if (phase === "pad") return;
    const timer = window.setTimeout(
      () => {
        if (phase === "scan") {
          refuse();
          setPhase("failed");
        } else setPhase("pad");
      },
      phase === "scan" ? SCAN_MS : FAILED_MS,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  const press = (d: string) => {
    if (code.length >= answer.length) return;
    keyTap();
    const next = code + d;
    setCode(next);
    if (next.length < answer.length) return;
    if (digits(next) === answer) {
      onOpen();
      return;
    }
    refuse();
    window.setTimeout(() => {
      setCode("");
      setShakes((n) => n + 1);
    }, 220);
  };

  useEffect(() => {
    if (phase !== "pad") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") setCode((c) => c.slice(0, -1));
      else if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase !== "pad") {
    return (
      <div className={styles.gate} role="dialog" aria-label="Face ID" data-no-swipe>
        <div className={styles.card} data-failed={phase === "failed" || undefined}>
          <FaceGlyph />
          <p className={styles.cardTitle} role="status">
            {phase === "scan" ? "Face ID" : "Face Not Recognised"}
          </p>
          <div className={styles.cardActions}>
            <button type="button" className={styles.cardButton} onClick={() => setPhase("pad")}>
              Enter Passcode
            </button>
            <button type="button" className={styles.cardButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gate} role="dialog" aria-label="Enter iPhone Passcode" data-no-swipe>
      <div className={styles.pad}>
        <p className={styles.title}>Enter iPhone Passcode</p>
        <p className={styles.sub}>Recently Deleted is locked.</p>
        <div key={shakes} className={styles.dots} data-shake={shakes > 0 || undefined}>
          {Array.from({ length: answer.length }, (_, i) => (
            <span key={i} className={styles.dot} data-on={i < code.length || undefined} />
          ))}
        </div>
        <div className={styles.keys}>
          {KEYS.map((k) => (
            <button type="button" key={k} className={styles.key} onClick={() => press(k)} aria-label={k}>
              <b>{k}</b>
              {LETTERS[k] && <small>{LETTERS[k]}</small>}
            </button>
          ))}
          <span />
          <button type="button" className={styles.key} onClick={() => press("0")} aria-label="0">
            <b>0</b>
          </button>
          <button type="button" className={styles.word} onClick={code ? () => setCode((c) => c.slice(0, -1)) : onCancel}>
            {code ? "Delete" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
