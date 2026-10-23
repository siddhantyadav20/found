"use client";

import { useState } from "react";

import { readContact } from "@/lib/waitlist";
import styles from "./Ending.module.css";

/* ===========================================================================
   "Tell me when it arrives": one field, an email or a phone number, for the
   next case. Written to once, by hand, when it's on the desk; nothing else
   (app/api/notify). Added with the review of 2026-10-01, because the end card
   promised Chapter 2 and gave nobody a way to hear about it.
   =========================================================================== */

export default function Notify({ caseId }: { caseId: string }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | { error: string }>("idle");
  const ok = Boolean(readContact(value));

  if (state === "done") return <p className={styles.notifyDone}>We&apos;ll write once, when it&apos;s on your desk.</p>;

  return (
    <form
      className={styles.notify}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!ok || state === "sending") return;
        setState("sending");
        try {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contact: value, case: caseId }),
          });
          const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
          setState(res.ok && body?.ok ? "done" : { error: body?.error ?? "That didn't go through. Try again in a moment." });
        } catch {
          setState({ error: "That didn't go through. Try again in a moment." });
        }
      }}
    >
      <label className={styles.notifyLabel} htmlFor="notify">
        Tell me when it arrives
      </label>
      <span className={styles.notifyRow}>
        <input
          id="notify"
          className={styles.notifyField}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Email or WhatsApp number"
          autoComplete="email"
          inputMode="email"
        />
        <button type="submit" className={styles.button} disabled={!ok || state === "sending"}>
          {state === "sending" ? "Sending…" : "Tell me"}
        </button>
      </span>
      {typeof state === "object" && <p className={styles.notifyError}>{state.error}</p>}
      <p className={styles.notifySmall}>One message, when Case 2 is on the desk. Nothing else, ever.</p>
    </form>
  );
}
