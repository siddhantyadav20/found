"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import type { Note, Photo, Story } from "@/content/types";
import { all, dateNow, goneOf, has, type CaseState } from "@/lib/game/engine";
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
function Attachment({ photo, voice }: { photo: Photo; voice?: string }) {
  // A document photographed into the note: the page itself, typed, with its stamp.
  if (photo.kind === "paper")
    return (
      <figure className={styles.attachment}>
        <div className={styles.doc}>
          <p className={styles.docTitle}>{photo.title}</p>
          {photo.lines?.map((l) =>
            /REJECTED/.test(l) ? (
              <p key={l} className={styles.docStamp}>
                {l}
              </p>
            ) : (
              <p
                key={l}
                className={l.startsWith("(") ? styles.docAside : styles.docLine}
              >
                {l}
              </p>
            ),
          )}
        </div>
      </figure>
    );
  return (
    <figure className={styles.attachment}>
      {!photo.video?.film && (
        <div
          className={frame.frame}
          data-size={photo.video ? undefined : "full"}
          data-wide={photo.video ? "" : undefined}
          style={{ "--hue": photo.video ? 24 : 205 } as CSSProperties}
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="400px"
              className={frame.image}
            />
          ) : (
            <span className={frame.pending}>{photo.title}</span>
          )}
        </div>
      )}
      {photo.video && (
        <Clip
          seconds={photo.video.seconds}
          captions={photo.video.captions}
          voice={voice}
          film={photo.video.film}
        />
      )}
      {photo.src && photo.caption && (
        <figcaption className={styles.attachmentCaption}>
          {photo.caption}
        </figcaption>
      )}
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
  voices,
  downloading = false,
  gone,
  onDelete,
  canDelete,
}: {
  note: Note;
  day: string;
  voices?: Story["voices"];
  /** Unlocked before, and the save remembers. */
  opened: boolean;
  onOpened: (id: string) => void;
  onSeen: (ids: readonly string[]) => void;
  /** Still coming down from iCloud: it won't open yet. */
  downloading?: boolean;
  /** Whether an attachment has been deleted (to Recently Deleted, or for good). */
  gone?: (id: string) => boolean;
  /** Delete an attachment the phone lets go of, to Recently Deleted (RAAKH-V3 §17). */
  onDelete?: (attachment: Photo) => void;
  canDelete?: (attachment: Photo) => boolean;
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

  const kept = (note.attachments ?? []).filter((a) => !gone?.(a.id));
  // What's in it is seen the moment it opens.
  const inside = open
    ? kept
        .map((a) => a.evidence)
        .filter((id): id is string => Boolean(id))
        .join(",")
    : "";
  useEffect(() => {
    if (inside) onSeen(inside.split(","));
  }, [inside, onSeen]);

  const numeric = /^\d+$/.test(note.password ?? "");
  // On the day's spent data, iCloud hasn't brought it all down (RAAKH-V3 §7.8).
  if (downloading)
    return (
      <div className={styles.locked}>
        <svg viewBox="0 0 24 24" className={styles.lock} aria-hidden="true">
          <path d="M7 18.5h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.3A3.4 3.4 0 0 0 7 18.5ZM12 10v6m-2.4-2.4L12 16l2.4-2.4" />
        </svg>
        <p className={styles.lockTitle}>This note hasn&apos;t finished downloading.</p>
        <p className={styles.lockHint}>“{note.title}” will open once it&apos;s downloaded from iCloud.</p>
      </div>
    );
  if (!open)
    return (
      <div className={styles.locked}>
        <svg viewBox="0 0 24 24" className={styles.lock} aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </svg>
        <p className={styles.lockTitle}>This note is locked.</p>
        <span className={numeric ? styles.otpWrap : undefined}>
          {/* A numeric password is entered as an OTP is, a box a digit, so it's plain it wants numbers (2026-10-23). */}
          {numeric && (
            <span
              className={styles.otp}
              data-shake={shaking || undefined}
              aria-hidden="true"
            >
              {Array.from({ length: note.password!.length }, (_, i) => (
                <span
                  key={i}
                  className={styles.otpBox}
                  data-on={i === typed.length || undefined}
                  data-full={i < typed.length || undefined}
                >
                  {typed[i] ? "•" : ""}
                </span>
              ))}
            </span>
          )}
          <input
            className={numeric ? styles.otpInput : styles.pin}
            autoComplete={numeric ? "one-time-code" : "off"}
            autoFocus={numeric}
            // A PIN gets the number pad; a word gets the keyboard (Last Local's "rubina").
            inputMode={numeric ? "numeric" : "text"}
            maxLength={note.password?.length ?? 4}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={typed}
            placeholder={numeric ? "" : "Password"}
            data-shake={shaking || undefined}
            readOnly={shaking}
            onChange={(e) => {
              const v = numeric
                ? e.target.value.replace(/\D/g, "")
                : e.target.value.trim().toLowerCase();
              setTyped(v);
              if (v === note.password?.toLowerCase()) {
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
        </span>
        <p className={styles.lockHint} aria-live="polite">
          {/* Said, not only shaken: a cleared field alone reads as a tap that didn't take (2026-10-28). */}
          {missed
            ? "Wrong password. Try again."
            : numeric
              ? `Enter the ${note.password!.length}-digit password for “${note.title}”.`
              : `Enter the password for “${note.title}”.`}
        </p>
        {/* A number's hint is there from the start: a four-digit guess isn't a puzzle, it's a wall. */}
        {(missed || numeric) && note.hint && (
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
          {note.english?.[i] && <small className={styles.lineEnglish}>{note.english[i]}</small>}
        </p>
      ))}
      {kept.map((a) => (
        <div key={a.id}>
          <Attachment photo={a} voice={voices?.[`clip:${a.id}`]?.src} />
          {onDelete && canDelete?.(a) && (
            <button type="button" className={styles.deleteAttachment} onClick={() => onDelete(a)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </article>
  );
}

export default function Notes({
  story,
  state,
  onRead,
  onPassword,
  onHome,
  onCaseFile,
  onDelete,
  onRecover,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  /** Opening a locked note is a thing the player did, and the save keeps it. */
  onPassword: (id: string) => void;
  onHome?: () => void;
  /** The case file is a note on this iPhone too (RAAKH-V3 §17, IC4): opening it from here opens it. */
  onCaseFile?: () => void;
  /** Delete an attachment: to Recently Deleted, or from there for good. */
  onDelete?: (id: string, how: "soft" | "perm") => void;
  onRecover?: (id: string) => void;
}) {
  const [bin, setBin] = useState(false);
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
      <Page
        title=""
        onBack={() => setOpen(null)}
        backLabel="Notes"
        tint={YELLOW}
        end={more}
      >
        <Open
          voices={story.voices}
          key={here.id}
          note={here}
          day={cal.label(here.day)}
          opened={has(state, unlocked(here.id))}
          downloading={!all(state, here.downloadsAfter)}
          gone={(id) => Boolean(goneOf(state, id))}
          onDelete={onDelete ? (a) => onDelete(a.id, "soft") : undefined}
          canDelete={(a) => Boolean(a.evidence && story.evidence.find((e) => e.id === a.evidence)?.deletable)}
          onSeen={onRead}
          onOpened={() => {
            onPassword(here.id);
            if (here.evidence) onRead([here.evidence]);
          }}
        />
      </Page>
    );

  /* Notes' own Recently Deleted: attachments the player deleted, with
     Recover and Delete (RAAKH-V3 §17). */
  const binned = story.notes.flatMap((n) => n.attachments ?? []).filter((a) => goneOf(state, a.id) === "soft");
  if (bin)
    return (
      <Page title="Recently Deleted" onBack={() => setBin(false)} backLabel="Notes" tint={YELLOW}>
        {binned.length === 0 ? (
          <p className={app.empty}>No deleted attachments.</p>
        ) : (
          <ul className={styles.list}>
            {binned.map((a) => (
              <li key={a.id} className={styles.binRow}>
                <span className={styles.rowTitle}>{a.title}</span>
                <span className={styles.binActs}>
                  <button type="button" onClick={() => onRecover?.(a.id)}>
                    Recover
                  </button>
                  <button type="button" data-danger onClick={() => onDelete?.(a.id, "perm")}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Page>
    );

  // Newest first, under the heading Notes gives how long ago they were touched.
  const today = cal.dayOf(undefined);
  const sorted = [...notes].sort(
    (a, b) => cal.when(b.day, b.at) - cal.when(a.day, a.at),
  );
  const sections: { title: string; notes: Note[] }[] = [];
  for (const n of sorted) {
    const title = section(today - cal.dayOf(n.day));
    const s = sections.find((x) => x.title === title);
    if (s) s.notes.push(n);
    else sections.push({ title, notes: [n] });
  }

  return (
    <Page
      title="Notes"
      large
      root
      onBack={onHome}
      backLabel="Folders"
      tint={YELLOW}
      end={more}
      tabbed
    >
      <SearchField />
      {/* The case file: a note made on this iPhone tonight (IC4). */}
      {story.caseNote && onCaseFile && all(state, story.caseNote.when) && (
        <div>
          {/* Made at 11:44 PM: past midnight, that's yesterday. */}
          <h3 className={styles.section}>{dateNow(story, state) === story.clocks[0].date ? "Today" : "Yesterday"}</h3>
          <ul className={styles.list}>
            <li>
              <button type="button" className={styles.row} onClick={onCaseFile}>
                <span className={styles.rowTitle}>{story.caseNote.title}</span>
                <span className={styles.rowSub}>
                  <span className={styles.rowWhen}>{stamp(story.caseNote.created)}</span>
                  <span className={styles.rowPreview}>On this iPhone</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
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
                      <svg
                        viewBox="0 0 24 24"
                        className={styles.rowLock}
                        aria-label="Locked"
                      >
                        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                      </svg>
                    )}
                    {n.title}
                  </span>
                  <span className={styles.rowSub}>
                    <span className={styles.rowWhen}>
                      {n.edited ? stamp(n.edited) : cal.label(n.day)}
                    </span>
                    <span className={styles.rowPreview}>
                      {n.locked ? "Locked" : n.body[0]}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {binned.length > 0 && (
        <button type="button" className={styles.binLink} onClick={() => setBin(true)}>
          Recently Deleted ({binned.length})
        </button>
      )}

      {/* Notes' toolbar: how many, and a new one. */}
      <div className={`${styles.toolbar} bar-edge`} aria-hidden="true">
        <span />
        <span className={styles.count}>{notes.length} Notes</span>
        <span className={`${styles.compose} lg-bar`}>
          <svg viewBox="0 0 24 24">
            <path d="M12.5 5.5h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M16.8 4.2l3 3-7.6 7.6-3.7.7.7-3.7Z" />
          </svg>
        </span>
      </div>
    </Page>
  );
}
