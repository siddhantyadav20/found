"use client";

import { useState } from "react";

import type { Payment, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { rupees } from "@/lib/game/phone";
import { Group, Row } from "../AppView";
import app from "../ios/App.module.css";
import styles from "./Paytap.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Paytap: a payments app, and ours outright, because it's part of the
   story's money (PLAYER-JOURNEY law 6). The history, newest first, money in
   and money out; a receipt for each. The balance asks for a PIN, and this
   game never asks for anything real, so it stays hidden.
   =========================================================================== */

const DAY: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
const order = (p: Payment) => (DAY[p.day] ?? 0) * 10_000 + Number(p.at.replace(":", ""));

export default function Paytap({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const history = story.payments.filter((p) => all(state, p.requires)).sort((a, b) => order(b) - order(a));
  const receipt = history.find((p) => p.id === open);

  if (receipt)
    return (
      <div className={app.body}>
        <button type="button" className={styles.link} onClick={() => setOpen(null)} data-back>
          ‹ History
        </button>
        <div className={styles.receipt}>
          <p className={styles.status} data-failed={receipt.failed || undefined}>
            {receipt.failed ? "Failed" : receipt.amount > 0 ? "Received" : "Paid"}
          </p>
          <p className={styles.amount} data-in={receipt.amount > 0 || undefined}>
            {receipt.amount > 0 ? "+" : "−"}
            {rupees(receipt.amount)}
          </p>
          <p className={styles.who}>
            {receipt.amount > 0 ? "From" : "To"} {receipt.who}
          </p>
          {receipt.handle && <p className={styles.handle}>{receipt.handle}</p>}
          {receipt.note && <p className={styles.note}>“{receipt.note}”</p>}
          <p className={styles.handle}>
            {receipt.day} · {stamp(receipt.at)}
          </p>
        </div>
      </div>
    );

  return (
    <div className={app.body}>
      <h2 className={app.big}>Paytap</h2>
      <p className={styles.balance}>Balance · Check with your PIN</p>
      {history.length === 0 ? (
        <p className={app.empty}>No payments yet.</p>
      ) : (
        <Group label="History">
          {history.map((p) => (
            <Row
              key={p.id}
              title={p.who}
              sub={`${p.failed ? "Failed · " : ""}${p.note ? `${p.note} · ` : ""}${p.day} ${stamp(p.at)}`}
              meta={
                <span className={styles.rowAmount} data-in={p.amount > 0 || undefined}>
                  {p.amount > 0 ? "+" : "−"}
                  {rupees(p.amount)}
                </span>
              }
              onClick={() => {
                setOpen(p.id);
                if (p.evidence) onRead([p.evidence]);
              }}
            />
          ))}
        </Group>
      )}
    </div>
  );
}
