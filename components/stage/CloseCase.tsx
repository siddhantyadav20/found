"use client";

import { useState } from "react";

import type { Act, Story } from "@/content/types";
import type { CaseState, RecordChoice } from "@/lib/game/engine";
import { actFlags, recordRows, setRow } from "@/lib/game/record";
import { hasRecord } from "@/lib/game/yours";
import { readProgress } from "@/lib/found/progress";
import note from "@/components/owner/ios/Notes.module.css";
import { flag, save } from "./playthrough";
import styles from "./CaseFile.module.css";

/* ===========================================================================
   Closing the case: the record, and what the player does with it
   (CHAPTER1.md I). It lived on "your phone" until 2026-10-23; now it's the
   case file's last page, because the record is the case file.

   One row per link of the night, in the chain's order, each with what it can
   be: in, in without a witness's name, left out, said as Sameer says it, or
   stated as fact. Then the acts, drawn alike: send it to the lawyer it was
   meant for, post it from his Instagram, or hand the parcel back. Nothing
   says which is right (PLAYER-JOURNEY Stage 8).

   Handing the parcel back is there from the first minute: the early exit.
   =========================================================================== */

const AS: Record<RecordChoice, string> = { in: "In", anon: "Without his name", out: "Leave out", says: "As he says it", fact: "As fact" };

export default function CloseCase({ story, state, open: openAtFirst = false }: { story: Story; state: CaseState; open?: boolean }) {
  const close = story.close;
  const [open, setOpen] = useState(openAtFirst);
  const [confirm, setConfirm] = useState<Act | null>(null);
  if (!close) return null;
  const record = hasRecord(story, state);
  const rows = recordRows(story, state);
  const inIt = rows.filter((r) => r.line).length;

  const ASK: Record<Act, { q: string; yes: string }> = {
    send: { q: `Send the record to ${close.sendTo}, with his phone? You can't take it back.`, yes: "Send it" },
    post: { q: `Post it on ${close.postTo}? Anyone can see it and share it. You can't take it back.`, yes: "Post it" },
    return: { q: close.parcel.ask, yes: "Give it back" },
  };
  const act = (a: Act) => {
    const s = readProgress();
    if (s) flag(...actFlags(story, s, a));
  };

  if (!open)
    return (
      <button type="button" className={styles.closeOpen} onClick={() => setOpen(true)}>
        <span>
          <b>Close the case</b>
          <span>{record ? `Your record has ${inIt} of ${rows.length} links. Send it, post it, or give the phone back.` : "Not getting involved? Give the parcel back to the courier."}</span>
        </span>
        <span aria-hidden="true">›</span>
      </button>
    );

  return (
    <section className={`${note.card} ${styles.close}`} aria-label="Close the case">
      <p className={note.eyebrow}>Close the case</p>
      <h3 className={note.question}>What happens to the record?</h3>
      {record && (
        <>
          <p className={styles.where}>Each link of the night, as it would go out. Tap to change what goes in.</p>
          <p className={styles.closeIntro}>{close.intro}</p>
          <ol className={styles.closeRows}>
            {rows.map((r) => (
              <li key={r.link.id} className={styles.closeRow} data-out={!r.line || undefined}>
                <span className={styles.closeLabel}>{r.link.label}</span>
                <span className={styles.closeLine}>{r.line ?? (r.options.length > 1 ? "Left out." : "Not traced. Nothing goes in.")}</span>
                {r.options.length > 1 && (
                  <span className={styles.closeChoices} role="group" aria-label={r.link.label}>
                    {r.options.map((o) => (
                      <button
                        key={o}
                        type="button"
                        className={styles.chip}
                        aria-pressed={r.choice === o}
                        onClick={() => {
                          const s = readProgress();
                          if (s) save(setRow(story, s, r.link.id, o));
                        }}
                      >
                        {AS[o]}
                      </button>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      <div className={styles.closeActs}>
        {record && (
          <>
            <button type="button" className={styles.closeAct} onClick={() => setConfirm("send")}>
              <b>Send it to {close.sendTo}</b>
              <span>{close.sendNote}</span>
            </button>
            <button type="button" className={styles.closeAct} onClick={() => setConfirm("post")}>
              <b>Post it on {close.postTo}</b>
              <span>{close.postNote}</span>
            </button>
          </>
        )}
        <button type="button" className={styles.closeAct} onClick={() => setConfirm("return")}>
          <b>{close.parcel.act}</b>
          <span>{close.parcel.note}</span>
        </button>
      </div>

      {confirm && (
        <div className={styles.closeConfirm} role="alertdialog" aria-label={ASK[confirm].q}>
          <p>{ASK[confirm].q}</p>
          <div className={note.actions}>
            <button type="button" className={note.primary} onClick={() => act(confirm)}>
              {ASK[confirm].yes}
            </button>
            <button type="button" className={note.secondary} onClick={() => setConfirm(null)}>
              Not yet
            </button>
          </div>
        </div>
      )}
      {!openAtFirst && (
        <button type="button" className={styles.more} onClick={() => setOpen(false)}>
          Not yet: keep investigating
        </button>
      )}
    </section>
  );
}
