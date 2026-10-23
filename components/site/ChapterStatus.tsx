"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { CASES, type CaseId } from "@/content/cases";
import { describeCase } from "@/lib/found/keeping";
import { useYourCases } from "@/lib/found/shelf";
import styles from "./Landing.module.css";

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/**
 * A chapter's button, as this browser knows it: "Play" for someone new,
 * "Continue · Episode 2" mid-way, the result once it's solved. The page is
 * server-rendered with "Play"; this swaps in what only this browser can say.
 */
export default function ChapterStatus({ id, cta, primary = false }: { id: CaseId; cta: string; primary?: boolean }) {
  const cases = useYourCases();
  const now = useSyncExternalStore(never, minute, () => 0);
  const card = cases?.find((c) => c.id === id);
  const line = card ? describeCase(card.save, card.solved, now) : null;
  const meta = CASES[id];
  return (
    <div className={styles.status}>
      <Link href={meta.href} className={primary ? styles.btnPrimary : styles.btnGhost}>
        {line?.cta ?? cta}
        <span aria-hidden="true">→</span>
      </Link>
      {line && (
        <span className={styles.statusLine}>
          {line.status}
          {line.result ? ` · ${line.result}` : ""}
        </span>
      )}
    </div>
  );
}
