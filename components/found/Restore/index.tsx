"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { CASES } from "@/content/cases";
import { describeCase } from "@/lib/found/keeping";
import { restoreCases, useYourCases, type RestoreResult } from "@/lib/found/shelf";
import { track } from "@/lib/found/track";
import styles from "./Restore.module.css";

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

let counted = false;

/**
 * A restore link, opened: pull the number's cases down, keep whichever save
 * got further on each, and hand the player straight back to them.
 */
export default function Restore({ raw }: { raw: string }) {
  const [result, setResult] = useState<RestoreResult | null>(null);
  const cards = useYourCases();
  const now = useSyncExternalStore(never, minute, () => 0);

  useEffect(() => {
    let live = true;
    void restoreCases(raw).then((r) => {
      if (!live) return;
      setResult(r);
      if (r.ok && r.cases[0] && !counted) {
        counted = true;
        track({ case: r.cases[0], event: "keep:restore" });
      }
    });
    return () => {
      live = false;
    };
  }, [raw]);

  let body: React.ReactNode;
  if (!result) {
    body = <h1 className={styles.title}>Finding your cases…</h1>;
  } else if (result.ok) {
    const back = (cards ?? []).filter((c) => result.cases.includes(c.id));
    body = (
      <>
        <p className={styles.eyebrow}>Case number {result.number}</p>
        <h1 className={styles.title}>{back.length ? "Your cases are back." : "Nothing on this number yet."}</h1>
        <p className={styles.text}>
          {back.length
            ? "This device keeps them under the same number now, so you can carry on from either."
            : "It's a real case number, but no case has been played under it. Anything you play here now is kept under it."}
        </p>
        {back.length > 0 && (
          <ul className={styles.list}>
            {back.map((c) => {
              const line = describeCase(c.save, c.solved, now);
              return (
                <li key={c.id} className={styles.row}>
                  <div className={styles.caseText}>
                    <p className={styles.caseTitle}>{CASES[c.id].title}</p>
                    <p className={styles.caseStatus}>{line.status}</p>
                    {line.result && <p className={styles.caseResult}>{line.result}</p>}
                  </div>
                  <Link href={CASES[c.id].href} className={styles.cta}>
                    {line.cta}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <Link href="/" className={styles.link}>
          To the desk
        </Link>
      </>
    );
  } else {
    const copy = {
      format: ["That isn't a case number.", "Case numbers are 12 letters and numbers, like K7Q4-MX2P-R9TA."],
      missing: ["No cases under that number.", "Check it for a typo. A number is kept for a year after its last play."],
      throttled: ["Too many numbers tried from here.", "Wait an hour, then try again."],
      unavailable: ["Couldn't reach your cases just now.", "Check your connection and try again."],
    }[result.reason];
    body = (
      <>
        <h1 className={styles.title}>{copy[0]}</h1>
        <p className={styles.text}>{copy[1]}</p>
        {result.reason === "unavailable" && (
          <button type="button" className={styles.cta} onClick={() => window.location.reload()}>
            Try again
          </button>
        )}
        <Link href="/" className={styles.link}>
          To the desk
        </Link>
      </>
    );
  }

  return (
    <main className={styles.room} id="main">
      <p className={styles.brand}>Found</p>
      {body}
    </main>
  );
}
