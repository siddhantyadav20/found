"use client";

import { useState } from "react";

import type { Note, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import styles from "./Notes.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Notes, as iOS draws them: a title, a preview, when it was last edited,
   who it's shared with. A locked note asks for a password, and whether it
   holds anything is the chapter's business, never required.

   =========================================================================== */

function Open({ note, onOpened }: { note: Note; onOpened: (id: string) => void }) {
  const [typed, setTyped] = useState("");
  const [open, setOpen] = useState(!note.locked);

  if (!open)
    return (
      <div className={styles.locked}>
        <p className={styles.lockTitle}>This note is locked</p>
        <input
          className={styles.pin}
          inputMode="numeric"
          maxLength={4}
          value={typed}
          placeholder="••••"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setTyped(v);
            if (v === note.password) {
              setOpen(true);
              onOpened(note.id);
            }
          }}
          aria-label="Note password"
        />
        <p className={styles.lockHint}>Enter the password for “{note.title}”.</p>
      </div>
    );

  return (
    <article className={styles.note}>
      <h3 className={styles.noteTitle}>{note.title}</h3>
      <p className={styles.noteMeta}>
        {note.day} {stamp(note.at)}
        {note.edited && ` · Edited ${note.edited}`}
        {note.sharedWith && ` · Shared with ${note.sharedWith}`}
      </p>
      {(note.inside ?? note.body).map((line, i) => (
        <p key={i} className={styles.line}>
          {line}
        </p>
      ))}
    </article>
  );
}

export default function Notes({
  story,
  state,
  onRead,
  onPassword,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  /** Opening a locked note is a thing the player did, and the save keeps it. */
  onPassword: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const notes = story.notes.filter((n) => all(state, n.requires));
  const here = notes.find((n) => n.id === open);

  if (here)
    return (
      <>
        <button type="button" className={styles.link} onClick={() => setOpen(null)} data-back>
          ‹ Notes
        </button>
        <Open
          note={here}
          onOpened={() => {
            onPassword(here.id);
            if (here.evidence) onRead([here.evidence]);
          }}
        />
      </>
    );

  /* iOS Notes: one inset group, each row a bold title with the time and the
     note's first line under it, and the count at the foot (PLAYTEST.md #18). */
  return (
    <>
      <p className={styles.folder}>iCloud</p>
      <ul className={styles.list}>
        {notes.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className={styles.row}
              onClick={() => {
                setOpen(n.id);
                if (n.evidence && !n.locked) onRead([n.evidence]);
              }}
            >
              <span className={styles.rowTitle}>
                {n.locked && "🔒 "}
                {n.title}
              </span>
              <span className={styles.rowSub}>
                <span className={styles.rowWhen}>{n.edited ? stamp(n.edited) : n.day}</span>
                <span className={styles.rowPreview}>{n.locked ? "Locked" : n.body[0]}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.count}>{notes.length} Notes</p>
    </>
  );
}
