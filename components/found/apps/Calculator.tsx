"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { all, has, threadMessages } from "@/lib/found/engine";
import { keyTap, refuse } from "@/lib/found/buzz";
import { calc } from "@/lib/found/calc";
import * as play from "../FoundPhone/actions";
import AppBar, { Chevron } from "./AppBar";
import Thread from "./Thread";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Calculator.module.css";

const OPS = ["÷", "×", "−", "+"];

/**
 * The keys as iOS 18 lays them out: the top-left key is ⌫ while there's
 * something to delete and AC when there isn't, and the bottom-left key
 * switches calculator modes (here it only buzzes: this isn't your phone).
 */
const KEYS: { k: string; kind: "fn" | "num" | "op" }[] = [
  { k: "AC", kind: "fn" },
  { k: "±", kind: "fn" },
  { k: "%", kind: "fn" },
  { k: "÷", kind: "op" },
  { k: "7", kind: "num" },
  { k: "8", kind: "num" },
  { k: "9", kind: "num" },
  { k: "×", kind: "op" },
  { k: "4", kind: "num" },
  { k: "5", kind: "num" },
  { k: "6", kind: "num" },
  { k: "−", kind: "op" },
  { k: "1", kind: "num" },
  { k: "2", kind: "num" },
  { k: "3", kind: "num" },
  { k: "+", kind: "op" },
  { k: "mode", kind: "num" },
  { k: "0", kind: "num" },
  { k: ".", kind: "num" },
  { k: "=", kind: "op" },
];

const KEYBOARD: Record<string, string> = { "*": "×", x: "×", "/": "÷", "-": "−", "+": "+", Enter: "=", "=": "=", ".": "." };

function ModeGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.mode}>
      <rect x="5" y="3.5" width="14" height="17" rx="3" />
      <path d="M8.5 7.5h7M8.5 12h1M12 12h0M15.5 12h0M8.5 15.5h1M12 15.5h0M15.5 15.5h0" />
    </svg>
  );
}

/**
 * A working calculator, and a vault behind it: type the code, press =.
 * A wrong code does nothing a calculator wouldn't, because a vault app that
 * reacts to wrong codes isn't hiding anything.
 */
export default function Calculator({ state }: AppProps) {
  const [entry, setEntry] = useState("0");
  const [fresh, setFresh] = useState(true);
  const [inVault, setInVault] = useState(() => has(state, "lock:vault"));
  const clearing = fresh || entry === "0";

  const backspace = () => setEntry((e) => (e.length > 1 ? e.slice(0, -1) : "0"));

  const press = (k: string) => {
    keyTap();
    if (/^\d$/.test(k)) {
      setEntry((e) => (fresh || e === "0" ? k : e.length < 16 ? e + k : e));
      setFresh(false);
    } else if (k === ".") {
      setEntry((e) => {
        if (fresh) return "0.";
        const tail = e.split(/[+−×÷]/).at(-1) ?? "";
        return tail.includes(".") ? e : e + ".";
      });
      setFresh(false);
    } else if (k === "AC") {
      if (!clearing) {
        backspace();
        return;
      }
      setEntry("0");
      setFresh(true);
    } else if (k === "±") {
      setEntry((e) => (/^-?[\d.]+$/.test(e) && e !== "0" ? (e.startsWith("-") ? e.slice(1) : `-${e}`) : e));
    } else if (k === "%") {
      setEntry((e) => (/^-?[\d.]+$/.test(e) ? String(Number(e) / 100) : e));
    } else if (OPS.includes(k)) {
      setEntry((e) => (/[+−×÷]$/.test(e) ? e.slice(0, -1) + k : e + k));
      setFresh(false);
    } else if (k === "=") {
      if (!has(state, "lock:vault") && /^\d{4,}$/.test(entry) && play.unlock("vault", entry)) {
        setInVault(true);
        setEntry("0");
        setFresh(true);
        return;
      }
      setEntry(calc(entry));
      setFresh(true);
    }
  };

  useEffect(() => {
    if (inVault) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (KEYBOARD[e.key]) press(KEYBOARD[e.key]);
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") {
        setEntry("0");
        setFresh(true);
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (inVault) return <Vault state={state} onLock={() => setInVault(false)} />;

  const display = entry.replace(/-/g, "−");
  return (
    <section className={styles.calc}>
      <p className={styles.display} data-long={display.length > 9 || undefined} aria-live="polite">
        {display}
      </p>
      <div className={styles.keys}>
        {KEYS.map(({ k, kind }) =>
          k === "mode" ? (
            <button type="button" key={k} className={styles.key} data-kind={kind} onClick={() => refuse()} aria-label="Calculator modes">
              <ModeGlyph />
            </button>
          ) : (
            <button
              type="button"
              key={k}
              className={styles.key}
              data-kind={kind}
              onClick={() => press(k)}
              aria-label={k === "AC" && !clearing ? "Delete" : undefined}
            >
              {k === "AC" && !clearing ? "⌫" : k}
            </button>
          ),
        )}
      </div>
    </section>
  );
}

function Vault({ state, onLock }: { state: AppProps["state"]; onLock: () => void }) {
  const ep = useStory();
  const [open, setOpen] = useState<string | null>(null);
  const notes = ep.vault.notes.filter((n) => all(state, n.requires));
  const note = notes.find((n) => n.id === open);
  const thread = ep.vault.thread;
  const messages = threadMessages(ep, state, thread.id);

  useEffect(() => {
    play.see(note?.evidence);
  }, [note]);

  return (
    <section className={app.view}>
      <AppBar title="Vault" onBack={onLock} backLabel="Lock" />
      <div className={app.body}>
        <p className={styles.vaultNote}>Hidden from Photos, Messages and search.</p>
        <ul className={app.group}>
          <li>
            <button type="button" className={app.row} onClick={() => setOpen(thread.id)}>
              <span className={app.rowMain}>
                <span className={app.rowTitle}>{thread.contact}</span>
                <span className={app.rowSub}>{messages.length} messages</span>
              </span>
              <Chevron />
            </button>
          </li>
          {notes.map((n) => (
            <li key={n.id}>
              <button type="button" className={app.row} onClick={() => setOpen(n.id)}>
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{n.title}</span>
                  <span className={app.rowSub}>{n.kind === "receipt" ? "Photo of a receipt" : "Note"}</span>
                </span>
                <Chevron />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open === thread.id && (
        <Thread
          threadId={thread.id}
          contact={thread.contact}
          messages={messages}
          state={state}
          composer="none"
          onBack={() => setOpen(null)}
          backLabel="Vault"
        />
      )}
      {note && (
        <section className={app.view}>
          <AppBar title={note.title} onBack={() => setOpen(null)} backLabel="Vault" />
          <div className={app.body}>
            {note.kind === "receipt" ? (
              /* K.'s hand, on a slip of paper, photographed flat. Block
                 capitals like the envelope's label: the same person wrote both. */
              <p className={styles.receipt}>{note.body}</p>
            ) : (
              <p className={styles.noteBody}>{note.body}</p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
