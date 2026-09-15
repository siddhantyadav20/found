"use client";

import { useState, useSyncExternalStore } from "react";

import { FEATURED, type CaseId } from "@/content/cases";
import { restorePath } from "@/lib/found/keeping";
import { useDevice } from "@/lib/found/platform";
import { claimCaseNumber, storageWorks, useCaseNumber } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import CaseQR from "./CaseQR";
import styles from "./KeepCase.module.css";

/**
 * The case number, offered and then shown: on end cards, on the desk, and on
 * the envelope when this browser won't keep anything.
 *
 * Once there's a number it's the whole card: the number on the envelope's
 * paper label, a way to send it to yourself, and on a laptop a QR code, so
 * the phone in your pocket can pick up where the laptop left off.
 */
export default function KeepCase({ caseId = FEATURED, variant = "card" }: { caseId?: CaseId; variant?: "card" | "warning" }) {
  const number = useCaseNumber();
  const { handheld } = useDevice();
  const [phase, setPhase] = useState<"idle" | "asking" | "failed" | "throttled">("idle");
  const [copied, setCopied] = useState(false);
  const warning = variant === "warning";
  const beat = (event: string) => track({ case: caseId, event });

  const claim = async () => {
    if (phase === "asking") return;
    setPhase("asking");
    const r = await claimCaseNumber();
    if (r.ok) {
      setPhase("idle");
      beat("keep:number");
    } else setPhase(r.reason === "throttled" ? "throttled" : "failed");
  };

  // Only ever set in the browser: the server's answer is "no number".
  const url = number ? `${window.location.origin}${restorePath(number)}` : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      beat("keep:copy");
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={styles.card} data-variant={variant} aria-labelledby={`keep-${variant}`}>
      <p className={styles.eyebrow} id={`keep-${variant}`}>
        {number ? "Your case number" : "Keep your place"}
      </p>

      {!number ? (
        <>
          <p className={styles.lede}>{warning ? "This browser won't keep your place." : "Carry on from any phone or laptop."}</p>
          <p className={styles.text}>
            {warning
              ? "It looks like private browsing, or storage is switched off, so closing this tab would lose the case. A case number keeps it for you instead."
              : "A case number keeps your cases for a year after you last play. No account, no email."}
          </p>
          <button type="button" className={styles.primary} onClick={claim} disabled={phase === "asking"}>
            {phase === "asking" ? "Getting one…" : "Get a case number"}
          </button>
          {phase === "failed" && <p className={styles.error}>Couldn&apos;t get one just now. Try again in a minute.</p>}
          {phase === "throttled" && <p className={styles.error}>That&apos;s a lot of case numbers from here. Try again in an hour.</p>}
        </>
      ) : (
        <>
          <p className={styles.number} aria-label={`Case number ${number.replaceAll("-", "").split("").join(" ")}`}>
            {number}
          </p>
          <p className={styles.text}>
            {handheld
              ? "Open its link on any phone or laptop, or type the number on Found's front page."
              : "Scan it with your phone to carry on there, or type the number on Found's front page."}
          </p>
          {!handheld && <CaseQR url={url} />}
          <div className={styles.row}>
            <a
              className={styles.whatsapp}
              href={`https://wa.me/?text=${encodeURIComponent(`My Found case number: ${number}\n${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => beat("keep:whatsapp")}
            >
              Send it to yourself
            </a>
            <button type="button" className={styles.secondary} onClick={copy}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
          <p className={styles.note}>
            {warning && "Write it down: this browser can't remember it for you. "}
            Anyone with this number can open your cases, so keep it to yourself.
          </p>
        </>
      )}
    </section>
  );
}

const never = () => () => {};

/** On the envelope, only when this browser refuses to keep anything. */
export function StorageWarning({ caseId }: { caseId: CaseId }) {
  const refused = useSyncExternalStore(never, () => !storageWorks(), () => false);
  return refused ? <KeepCase caseId={caseId} variant="warning" /> : null;
}
