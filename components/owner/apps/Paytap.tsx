"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { calendarOf, rupees } from "@/lib/game/phone";
import { Chevron } from "../ios/AppBar";
import styles from "./Paytap.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Paytap: a UPI payments app, and ours outright, because it's part of the
   story's money (PLAYER-JOURNEY law 6). It draws itself the way India's
   payment apps do rather than the way iOS would: its own bar, a bank card
   whose balance wants a PIN (this game never asks for anything real), the
   four things everybody taps, and the history, newest first. A receipt for
   each, as the app shows one.
   =========================================================================== */

/** Each contact's circle, coloured from their name so the same person always wears the same one. */
const HUES = [152, 206, 262, 28, 338, 186];
const hue = (name: string) => HUES[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % HUES.length];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ACTIONS = [
  { label: "Scan & Pay", d: "M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15M4 12h16" },
  { label: "To Contact", d: "M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 19.5c.7-3.3 3.3-5 6.5-5s5.8 1.7 6.5 5M17 8v6M14 11h6" },
  { label: "To Bank", d: "M3.5 9.5 12 4.5l8.5 5M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3.5 19.5h17" },
  { label: "Bills", d: "M6.5 3.5h11v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.3-1.5Zm3 5h5M9.5 12h5" },
];

function Face({ name }: { name: string }) {
  return (
    <span className={styles.face} style={{ background: `hsl(${hue(name)} 42% 34%)` }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export default function Paytap({
  story,
  state,
  onRead,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onHome?: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const cal = calendarOf(story, state);
  const history = story.payments.filter((p) => all(state, p.requires)).sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  const receipt = history.find((p) => p.id === open);

  if (receipt) {
    const received = receipt.amount > 0;
    return (
      <section className={styles.app} data-push aria-label="Receipt">
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={() => setOpen(null)} data-back aria-label="History">
            <Chevron back />
          </button>
          <span className={styles.barTitle}>Transaction details</span>
          <span />
        </header>
        <div className={styles.body}>
          <div className={styles.receipt}>
            <span className={styles.seal} data-failed={receipt.failed || undefined} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d={receipt.failed ? "M7 7l10 10M17 7 7 17" : "m6 12.5 4 4 8-9"} />
              </svg>
            </span>
            <p className={styles.status} data-failed={receipt.failed || undefined}>
              {receipt.failed ? "Payment failed" : received ? "Received" : "Paid successfully"}
            </p>
            <p className={styles.amount}>{rupees(receipt.amount)}</p>
            <p className={styles.when}>
              {cal.label(receipt.day)}, {stamp(receipt.at)}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.party}>
              <Face name={receipt.who} />
              <span className={styles.partyMain}>
                <span className={styles.partyLabel}>{received ? "From" : "To"}</span>
                <b>{receipt.who}</b>
                {receipt.handle && <span className={styles.handle}>{receipt.handle}</span>}
              </span>
            </div>
            {receipt.note && (
              <p className={styles.note}>
                <span className={styles.partyLabel}>Note</span>
                {receipt.note}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.app} aria-label="Paytap">
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span className={styles.brand}>
          <span className={styles.brandMark}>₹</span>
          Paytap
        </span>
        <Face name={story.owner.name} />
      </header>

      <div className={styles.body}>
        <div className={styles.bank}>
          <span className={styles.bankName}>Savings account ••2931</span>
          <span className={styles.bankBalance}>₹ ••••••</span>
          <span className={styles.bankPin}>Check balance · UPI PIN</span>
        </div>

        <div className={styles.actions} aria-hidden="true">
          {ACTIONS.map((a) => (
            <span key={a.label} className={styles.action}>
              <span className={styles.actionIcon}>
                <svg viewBox="0 0 24 24">
                  <path d={a.d} />
                </svg>
              </span>
              {a.label}
            </span>
          ))}
        </div>

        <h3 className={styles.section}>History</h3>
        {history.length === 0 ? (
          <p className={styles.empty}>No payments yet.</p>
        ) : (
          <ul className={styles.list}>
            {history.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => {
                    setOpen(p.id);
                    if (p.evidence) onRead([p.evidence]);
                  }}
                >
                  <Face name={p.who} />
                  <span className={styles.rowMain}>
                    <b>{p.who}</b>
                    <span className={styles.rowSub}>
                      {p.failed ? "Failed · " : ""}
                      {p.note ? `${p.note} · ` : ""}
                      {cal.label(p.day)} {stamp(p.at)}
                    </span>
                  </span>
                  <span className={styles.rowAmount} data-in={p.amount > 0 || undefined} data-failed={p.failed || undefined}>
                    {p.amount > 0 ? "+ " : "− "}
                    {rupees(p.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
