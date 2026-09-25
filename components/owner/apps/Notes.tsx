"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import type { Note, Photo, Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import { calendarOf, unlocked } from "@/lib/game/phone";
import { Page, SearchField } from "../AppView";
import app from "../ios/App.module.css";
import Clip from "../ios/Clip";
import frame from "../ios/PhotoFrame.module.css";
import styles from "./Notes.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Notes, as iOS 26 draws it: the folder's notes under when they were last
   touched ("Previous 7 Days"), each a bold title over its time and first
   line, the count in the toolbar at the foot and Notes' yellow on every
   glass button; a note with its date over it. A locked note asks for a
   password (a Notes password is its own, whatever the phone's passcode is)
   and gives the owner's hint after a wrong one; once it opens it stays open,
   with whatever was put in it under its text.
   =========================================================================== */

/** A wrong password shakes the field, then clears it. */
const SHAKE_MS = 420;

/** A photo or video put in a note: as big as the note is wide, a video with its transport under it. */
function Attachment({ photo }: { photo: Photo }) {
  return (
    <figure className={styles.attachment}>
      <div className={frame.frame} data-size={photo.video ? undefined : "full"} data-wide={photo.video ? "" : undefined} style={{ "--hue": photo.video ? 24 : 205 } as CSSProperties}>
        {photo.src ? (
          <Image src={photo.src} alt={photo.title} fill sizes="400px" className={frame.image} />
        ) : (
          <span className={frame.pending}>{photo.title}</span>
        )}
      </div>
      {photo.video && <Clip seconds={photo.video.seconds} captions={photo.video.captions} />}
    </figure>
  );
}

const YELLOW = "#ffd60a";

/** Where a note falls, as Notes heads its sections. */
function section(back: number): string {
  if (back <= 0) return "Today";
  if (back === 1) return "Yesterday";
  if (back < 7) return "Previous 7 Days";
  if (back < 30) return "Previous 30 Days";
  return "Earlier";
}

function Open({
  note,
  day,
  opened,
  onOpened,
  onSeen,
}: {
  note: Note;
  day: string;
  /** Unlocked before, and the save remembers. */
  opened: boolean;
  onOpened: (id: string) => void;
  onSeen: (ids: readonly string[]) => void;
}) {
  const [typed, setTyped] = useState("");
  const [open, setOpen] = useState(!note.locked || opened);
  const [shaking, setShaking] = useState(false);
  const [missed, setMissed] = useState(false);

  useEffect(() => {
    if (!shaking) return undefined;
    const t = window.setTimeout(() => {
      setShaking(false);
      setTyped("");
    }, SHAKE_MS);
    return () => window.clearTimeout(t);
  }, [shaking]);

  // What's in it is seen the moment it opens.
  const inside = open ? (note.attachments ?? []).map((a) => a.evidence).filter((id): id is string => Boolean(id)).join(",") : "";
  useEffect(() => {
    if (inside) onSeen(inside.split(","));
  }, [inside, onSeen]);

  if (!open)
    return (
      <div className={styles.locked}>
        <svg viewBox="0 0 24 24" className={styles.lock} aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </svg>
        <p className={styles.lockTitle}>This note is locked.</p>
        <input
          className={styles.pin}
          inputMode="numeric"
          maxLength={4}
          value={typed}
          placeholder="Password"
          data-shake={shaking || undefined}
          readOnly={shaking}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setTyped(v);
            if (v === note.password) {
              setOpen(true);
              onOpened(note.id);
            } else if (note.password && v.length >= note.password.length) {
              setShaking(true);
              setMissed(true);
            }
          }}
          aria-label="Note password"
          aria-invalid={shaking || undefined}
        />
        <p className={styles.lockHint}>Enter the password for “{note.title}”.</p>
        {missed && note.hint && (
          <p className={styles.lockClue} aria-live="polite">
            Hint: {note.hint}
          </p>
        )}
      </div>
    );

  return (
    <article className={styles.note}>
      <p className={styles.noteMeta}>
        {day} at {stamp(note.at)}
        {note.edited && ` · Edited ${note.edited}`}
        {note.sharedWith && ` · Shared with ${note.sharedWith}`}
      </p>
      <h3 className={styles.noteTitle}>{note.title}</h3>
      {(note.inside ?? note.body).map((line, i) => (
        <p key={i} className={styles.line}>
          {line}
        </p>
      ))}
      {note.attachments?.map((a) => <Attachment key={a.id} photo={a} />)}
    </article>
  );
}

export default function Notes({
  story,
  state,
  onRead,
  onPassword,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  /** Opening a locked note is a thing the player did, and the save keeps it. */
  onPassword: (id: string) => void;
  onHome?: () => void;
}) {
  const cal = calendarOf(story, state);
  const [open, setOpen] = useState<string | null>(null);
  const notes = story.notes.filter((n) => all(state, n.requires));
  const here = notes.find((n) => n.id === open);

  const more = (
    <span className={`${app.back} lg`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={styles.more}>
        <circle cx="6" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="18" cy="12" r="1.8" />
      </svg>
    </span>
  );

  if (here)
    return (
      <Page title="" onBack={() => setOpen(null)} backLabel="Notes" tint={YELLOW} end={more}>
        <Open
          key={here.id}
          note={here}
          day={cal.label(here.day)}
          opened={has(state, unlocked(here.id))}
          onSeen={onRead}
          onOpened={() => {
            onPassword(here.id);
            if (here.evidence) onRead([here.evidence]);
          }}
        />
      </Page>
    );

  // Newest first, under the heading Notes gives how long ago they were touched.
  const today = cal.dayOf(undefined);
  const sorted = [...notes].sort((a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at));
  const sections: { title: string; notes: Note[] }[] = [];
  for (const n of sorted) {
    const title = section(today - cal.dayOf(n.day));
    const s = sections.find((x) => x.title === title);
    if (s) s.notes.push(n);
    else sections.push({ title, notes: [n] });
  }

  return (
    <Page title="Notes" large root onBack={onHome} backLabel="Folders" tint={YELLOW} end={more} tabbed>
      <SearchField />
      {sections.map((s) => (
        <div key={s.title}>
          <h3 className={styles.section}>{s.title}</h3>
          <ul className={styles.list}>
            {s.notes.map((n) => (
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
                    {n.locked && (
                      <svg viewBox="0 0 24 24" className={styles.rowLock} aria-label="Locked">
                        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                      </svg>
                    )}
                    {n.title}
                  </span>
                  <span className={styles.rowSub}>
                    <span className={styles.rowWhen}>{n.edited ? stamp(n.edited) : cal.label(n.day)}</span>
                    <span className={styles.rowPreview}>{n.locked ? "Locked" : n.body[0]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Notes' toolbar: how many, and a new one. */}
      <div className={styles.toolbar} aria-hidden="true">
        <span />
        <span className={styles.count}>{notes.length} Notes</span>
        <span className={`${styles.compose} lg`}>
          <svg viewBox="0 0 24 24">
            <path d="M12.5 5.5h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M16.8 4.2l3 3-7.6 7.6-3.7.7.7-3.7Z" />
          </svg>
        </span>
      </div>
    </Page>
  );
}
