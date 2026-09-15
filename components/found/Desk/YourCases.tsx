"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { CASES } from "@/content/cases";
import { describeCase, normalizeCaseNumber, restorePath } from "@/lib/found/keeping";
import { useCaseNumber, useYourCases, type CaseCard } from "@/lib/found/shelf";
import KeepCase from "../KeepCase";
import styles from "./Desk.module.css";

const never = () => () => {};
/** To the minute, so "12 min ago" doesn't change the snapshot on every read. */
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/**
 * Under the desk, once the browser can say: the cases you've touched (in
 * progress, between episodes, solved), the case number that keeps them, and
 * a way in for a number from another device. The desk itself stays
 * server-rendered; this is the one part only this browser knows.
 */
export default function YourCases() {
  const cases = useYourCases();
  const number = useCaseNumber();
  const now = useSyncExternalStore(never, minute, () => 0);

  if (cases === null) return null;
  return (
    <section className={styles.yours} aria-label="Your cases">
      {cases.length > 0 && (
        <>
          <p className={styles.eyebrow}>Your cases</p>
          <ul className={styles.caseList}>
            {cases.map((c) => (
              <CaseRow key={c.id} card={c} now={now} />
            ))}
          </ul>
        </>
      )}
      {(cases.length > 0 || number) && (
        <details className={styles.keep}>
          <summary>{number ? `Case number ${number}` : "Keep them on another device"}</summary>
          <KeepCase />
        </details>
      )}
      <HaveNumber />
    </section>
  );
}

function CaseRow({ card, now }: { card: CaseCard; now: number }) {
  const meta = CASES[card.id];
  const line = describeCase(card.save, card.solved, now);
  return (
    <li className={styles.caseRow}>
      <div className={styles.caseText}>
        <p className={styles.caseTitle}>{meta.title}</p>
        <p className={styles.caseStatus}>{line.status}</p>
        {line.result && <p className={styles.caseResult}>{line.result}</p>}
      </div>
      <Link href={meta.href} className={styles.caseCta}>
        {line.cta}
      </Link>
    </li>
  );
}

function HaveNumber() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  if (!open) {
    return (
      <button type="button" className={styles.haveLink} onClick={() => setOpen(true)}>
        Have a case number?
      </button>
    );
  }
  return (
    <form
      className={styles.haveForm}
      onSubmit={(e) => {
        e.preventDefault();
        const n = normalizeCaseNumber(value);
        if (n) router.push(restorePath(n));
        else setWrong(true);
      }}
    >
      <label className={styles.haveLabel} htmlFor="case-number">
        Your case number
      </label>
      <div className={styles.haveRow}>
        <input
          id="case-number"
          className={styles.haveInput}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setWrong(false);
          }}
          placeholder="K7Q4-MX2P-R9TA"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={wrong || undefined}
          aria-describedby={wrong ? "case-number-error" : undefined}
        />
        <button type="submit" className={styles.haveGo}>
          Open
        </button>
      </div>
      {wrong && (
        <p className={styles.haveError} id="case-number-error">
          That doesn&apos;t look like one. It&apos;s 12 letters and numbers, like K7Q4-MX2P-R9TA.
        </p>
      )}
    </form>
  );
}
