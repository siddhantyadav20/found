"use client";

import { useState } from "react";

import type { Note, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import styles from "./Notes.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Notes, where she thought on Thursday and where somebody else typed at 12:39
   on Saturday morning.

   Three notes, and each is a different kind of evidence:
   - "Thursday" is her, fourteen minutes in, working out that it is a scam
   - "For whoever gets this phone" is her, edited by them: iOS says when, and
     the when is impossible
   - "FDs & papers" is locked, and the note above tells the player the
     password. Nothing about it is required, and there is nothing in it. It is
     the trap, and the trap is optional (PLAYER-JOURNEY Stage 6).
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
  /** Typing her password is a thing the player does, and a thing they keep. */
  onPassword: () => void;
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
            onPassword();
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
