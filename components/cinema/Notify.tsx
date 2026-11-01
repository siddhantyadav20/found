"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type State = { state: "idle" | "sending" | "done" } | { state: "error"; message: string };

/** Asks only for a way to write back, and it reaches Siddhant by hand-written mail (app/api/notify). */
export function useNotify(what: "site" | "talk") {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<State>({ state: "idle" });

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (status.state === "sending") return;
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: value, what }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      setStatus(body.ok ? { state: "done" } : { state: "error", message: body.error ?? "That didn't go through." });
    } catch {
      setStatus({ state: "error", message: "That didn't go through. Try again in a moment." });
    }
  };

  return { value, setValue, status, send };
}

export function Sent({ children }: { children: ReactNode }) {
  return <span role="status">{children}</span>;
}
