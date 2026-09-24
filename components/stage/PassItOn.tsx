"use client";

import { useEffect, useState } from "react";

import { cleanDropName, displayName, NAME_MAX } from "@/lib/found/dropName";
import type { DropStatus } from "@/lib/found/dropStore";
import { createDrop } from "@/lib/found/drops";
import { resultLine, shareText, type Result } from "@/lib/found/result";
import { useCase } from "@/components/found/StoryContext";
import { track } from "@/lib/found/track";
import styles from "./PassItOn.module.css";

/* ===========================================================================
   "Pass it on": the end card's way of doing to a friend what was done to you.

   Address an envelope (a first name, or nobody), seal it, send it. Sealing
   makes a drop: a link whose envelope carries that name. Sending is WhatsApp
   first, because that is where the people this is for share things, then the
   phone's own share sheet, then a link to copy. All three are real links or
   taps, never a popup opened after an await, so no in-app browser blocks them.

   This browser remembers the envelopes it sealed (their codes, nothing else)
   and asks how far each has got, which is the reason to come back.
   =========================================================================== */

type Sent = { code: string; to: string; case: string; at: number };

const SENT_KEY = "found:sent";
const KEEP = 12;
/** How many sealed envelopes the card follows at once. */
const FOLLOW = 5;
const POLL_MS = 30_000;

const isSent = (x: unknown): x is Sent =>
  !!x && typeof x === "object" && typeof (x as Sent).code === "string" && typeof (x as Sent).to === "string" && typeof (x as Sent).case === "string";

function readAll(): Sent[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(SENT_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter(isSent) : [];
  } catch {
    return [];
  }
}

function remember(entry: Sent): void {
  try {
    window.localStorage.setItem(SENT_KEY, JSON.stringify([entry, ...readAll()].slice(0, KEEP)));
  } catch {
    // Storage refused: the envelope still goes, it just can't be followed.
  }
}

function progress(st: DropStatus | undefined): string {
  if (!st) return "…";
  if (st.finished) return st.seconds ? `got to the end in ${Math.max(1, Math.round(st.seconds / 60))} min` : "got to the end";
  if (st.unlocked) return "unlocked the phone";
  if (st.opened) return "opened the parcel";
  if (st.arrived) return "has it in their hands";
  return "hasn't opened it yet";
}

/** Counted once per page load, however often the card re-renders. */
let offered = false;

export default function PassItOn({ result }: { result: Result | null }) {
  const { id, meta } = useCase();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"address" | "sealing" | "sealed">("address");
  const [link, setLink] = useState<{ url: string; to: string } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState<Sent[]>(() => readAll().filter((s) => s.case === id));
  const [status, setStatus] = useState<Record<string, DropStatus>>({});
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (offered) return;
    offered = true;
    track({ case: id, event: "share:open" });
  }, [id]);

  // How far each followed envelope has got: once on arrival, again whenever
  // the tab comes back into view, and on a timer only while it's being looked at.
  const codes = sent
    .slice(0, FOLLOW)
    .map((s) => s.code)
    .join(",");
  useEffect(() => {
    if (!codes) return;
    let live = true;
    const load = () => {
      for (const code of codes.split(",")) {
        fetch(`/api/drop/${code}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d: DropStatus | null) => {
            if (live && d) setStatus((all) => ({ ...all, [code]: d }));
          })
          .catch(() => {});
      }
    };
    const whenSeen = () => {
      if (document.visibilityState === "visible") load();
    };
    load();
    const timer = window.setInterval(whenSeen, POLL_MS);
    document.addEventListener("visibilitychange", whenSeen);
    return () => {
      live = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", whenSeen);
    };
  }, [codes]);

  const seal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sealing") return;
    setPhase("sealing");
    const origin = window.location.origin;
    const r = await createDrop(id, name, result?.minutes != null ? result.traced.length : undefined).catch(() => null);
    if (r?.ok) {
      const entry: Sent = { code: r.code, to: r.to, case: id, at: Date.now() };
      remember(entry);
      setSent((list) => [entry, ...list].slice(0, KEEP));
      setLink({ url: `${origin}/d/${r.code}`, to: r.to });
      setNote(null);
      track({ case: id, event: "drop:create" });
    } else {
      setLink({ url: `${origin}${meta.href}`, to: "" });
      setNote(
        r?.ok === false && r.reason === "throttled"
          ? "That's a lot of envelopes for one hour. Here's the plain link instead."
          : "Couldn't address it just now. Here's the plain link instead.",
      );
    }
    setCopied(false);
    setPhase("sealed");
  };

  const text = link ? shareText(meta.title, result, link.url, meta.ask, meta.hook) : "";

  const nativeShare = async () => {
    try {
      await navigator.share({ title: meta.title, text });
      track({ case: id, event: "share:native" });
    } catch {
      // Dismissed. Nothing to do.
    }
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      track({ case: id, event: "share:copy" });
    } catch {
      setCopied(false);
    }
  };

  const again = () => {
    setName("");
    setLink(null);
    setNote(null);
    setPhase("address");
  };

  const preview = cleanDropName(name);

  return (
    <section className={styles.card} aria-labelledby="pass-it-on">
      <p className={styles.eyebrow} id="pass-it-on">
        Pass it on
      </p>
      <p className={styles.lede}>Someone left this for you. Leave it for someone else.</p>

      {result && (
        <p className={styles.result}>
          <span className={styles.marks}>{resultLine(result)}</span>
        </p>
      )}

      {phase !== "sealed" ? (
        <form className={styles.form} onSubmit={seal}>
          <span className={styles.label} aria-hidden="true">
            <span>TO {preview || "YOU"}</span>
            <span>BY HAND</span>
          </span>
          <label className={styles.formLabel} htmlFor="pass-name">
            Who&apos;s it for? A first name goes on the label.
          </label>
          <div className={styles.row}>
            <input
              id="pass-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX + 8}
              autoComplete="off"
              autoCapitalize="words"
              placeholder="Their first name (optional)"
            />
            <button type="submit" className={styles.primary} disabled={phase === "sealing"}>
              {phase === "sealing" ? "Sealing…" : "Seal it"}
            </button>
          </div>
        </form>
      ) : (
        link && (
          <div className={styles.send}>
            <p className={styles.sealed}>
              {link.to ? `Sealed for ${displayName(link.to)}.` : "Sealed."} Now get it to them.
            </p>
            {note && <p className={styles.note}>{note}</p>}
            <div className={styles.row}>
              <a
                className={styles.whatsapp}
                href={`https://wa.me/?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ case: id, event: "share:whatsapp" })}
              >
                Send on WhatsApp
              </a>
              {canShare && (
                <button type="button" className={styles.secondary} onClick={nativeShare}>
                  Share…
                </button>
              )}
              <button type="button" className={styles.secondary} onClick={copy}>
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
            <button type="button" className={styles.again} onClick={again}>
              Address another
            </button>
          </div>
        )
      )}

      {sent.length > 0 && (
        <ul className={styles.sent} aria-label="Envelopes you passed on">
          {sent.slice(0, FOLLOW).map((s) => (
            <li key={s.code}>
              <span className={styles.to}>{s.to ? displayName(s.to) : "Someone"}</span>
              <span>{progress(status[s.code])}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
