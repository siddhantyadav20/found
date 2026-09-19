"use client";

import { useState } from "react";

import type { Photo, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import app from "../ios/App.module.css";
import AppBar, { Chevron } from "../ios/AppBar";
import frame from "../ios/PhotoFrame.module.css";
import styles from "../ios/Photos.module.css";
import paper from "./Photos.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Photos, as current iOS lays it out and as the pilot drew it: Library and
   Collections under a floating glass tab bar, Recently Deleted down in
   Utilities, and a viewer with a glass back button, the place and time on
   top, and a toolbar underneath.

   What is in it is the story's. At 11:40 PM on Friday she photographed every
   page of her diary, the way she used to photograph a cheque before
   depositing it. Page six went to the bin at 12:37 AM, while she was on a
   terrace and this phone was in Andheri East; recovering it is how the player
   learns there was a list, and that they are on it.

   The pages are drawn until the handwriting is shot (ROADMAP P11): the words
   matter now.
   =========================================================================== */

type Tab = "library" | "collections";

function LibraryGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m6.5 16 3.6-4.2 2.6 3 1.9-2.1 3 3.3" />
      <circle cx="15.8" cy="9.4" r="1.4" />
    </svg>
  );
}

function CollectionsGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

function TrashGlyph() {
  return (
    <svg viewBox="0 0 24 24" className={styles.rowGlyph} aria-hidden="true">
      <path d="M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.9 12.2c.1 1 .9 1.8 1.9 1.8h5.4c1 0 1.8-.8 1.9-1.8l.9-12.2" />
    </svg>
  );
}

/** A photograph, or a page of her diary as a phone camera sees paper. */
function Picture({ photo, big }: { photo: Photo; big?: boolean }) {
  if (photo.kind === "paper")
    return (
      <div className={paper.paper} data-big={big || undefined}>
        <p className={paper.paperTitle}>{photo.title}</p>
        {photo.lines?.map((l, i) => (
          <p key={i} className={paper.hand}>
            {l}
          </p>
        ))}
      </div>
    );
  return (
    <div className={paper.scene} data-big={big || undefined}>
      <span className={paper.sceneTitle}>{photo.title}</span>
    </div>
  );
}

function Viewer({
  photo,
  onClose,
  onRecover,
}: {
  photo: Photo;
  onClose: () => void;
  onRecover?: () => void;
}) {
  const [info, setInfo] = useState(false);
  return (
    <div className={frame.viewer} data-no-swipe>
      <div className={frame.viewerBar}>
        <button type="button" className={frame.round} onClick={onClose} aria-label="Back" data-back>
          <Chevron back />
        </button>
        <span className={frame.viewerWhen}>
          <strong>{photo.place ?? "Dadar East"}</strong>
          <span>
            {photo.day} {stamp(photo.at)}
          </span>
        </span>
        <span />
      </div>

      <div className={frame.viewerImage}>
        <Picture photo={photo} big />
      </div>

      {info && (
        <div className={frame.info}>
          <p className={frame.infoDay}>
            {photo.day} · {stamp(photo.at)}
          </p>
          <p className={frame.infoCam}>iPhone 12 — Back Camera</p>
          {photo.caption && <p className={frame.infoNote}>{photo.caption}</p>}
          {photo.deletedAt && <p className={frame.infoNote}>Deleted at {stamp(photo.deletedAt)}. Kept for 30 days.</p>}
        </div>
      )}

      <div className={frame.toolbar}>
        <span className={frame.toolText} />
        <button type="button" className={frame.tool} data-on={info || undefined} onClick={() => setInfo((v) => !v)} aria-label="Info">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 11v5M12 8.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {onRecover ? (
          <button type="button" className={frame.toolText} onClick={onRecover}>
            Recover
          </button>
        ) : (
          <span className={frame.toolText} />
        )}
      </div>
    </div>
  );
}

export default function Photos({
  story,
  state,
  onBack,
  onRead,
  onRestore,
}: {
  story: Story;
  state: CaseState;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const [album, setAlbum] = useState<"recents" | "deleted">("recents");
  const [viewing, setViewing] = useState<string | null>(null);

  const visible = story.photos.filter((p) => all(state, p.requires));
  const bin = visible.filter((p) => p.deletedAt && !state.flags.includes(`did:restored-${p.id}`));
  const library = visible.filter((p) => !bin.includes(p));
  const inDeleted = album === "deleted";
  const list = inDeleted ? bin : library;
  const photo = list.find((p) => p.id === viewing);

  if (photo)
    return (
      <Viewer
        photo={photo}
        onClose={() => setViewing(null)}
        onRecover={
          photo.deletedAt
            ? () => {
                onRestore(photo.id);
                if (photo.evidence) onRead([photo.evidence]);
                setViewing(null);
                setAlbum("recents");
                setTab("library");
              }
            : undefined
        }
      />
    );

  const grid = (
    <div className={styles.grid}>
      {list.map((p) => (
        <button
          type="button"
          key={p.id}
          className={styles.thumb}
          onClick={() => {
            setViewing(p.id);
            // Read in the bin is read: the list counts from the moment it's opened (PLAYTEST.md #44).
            if (p.evidence) onRead([p.evidence]);
          }}
          aria-label={`${p.title}, ${p.day} ${stamp(p.at)}`}
        >
          <Picture photo={p} />
          {inDeleted && <span className={styles.days}>29 days</span>}
        </button>
      ))}
    </div>
  );

  return (
    <section className={app.view} aria-label="Photos">
      {inDeleted ? (
        <AppBar title="Recently Deleted" onBack={() => setAlbum("recents")} backLabel="Collections" />
      ) : (
        <AppBar onBack={onBack} backLabel="Home" />
      )}

      <div className={app.body} data-tabbed={!inDeleted || undefined}>
        {inDeleted ? (
          <>
            <p className={styles.kept}>Photos and videos show the days remaining before they&apos;re deleted.</p>
            {grid}
            {bin.length === 0 && <p className={styles.sub}>No photos or videos.</p>}
          </>
        ) : tab === "library" ? (
          <>
            <h2 className={app.big}>Library</h2>
            <p className={styles.sub}>{library.length} Items</p>
            {grid}
          </>
        ) : (
          <>
            <h2 className={app.big}>Collections</h2>
            <p className={app.groupLabel}>Albums</p>
            <ul className={app.group}>
              <li>
                <button type="button" className={app.row} onClick={() => setTab("library")}>
                  <span className={styles.albumThumb}>{library.at(-1) && <Picture photo={library.at(-1)!} />}</span>
                  <span className={app.rowMain}>
                    <span className={app.rowTitle}>Recents</span>
                  </span>
                  <span className={app.rowMeta}>{library.length}</span>
                  <Chevron />
                </button>
              </li>
            </ul>
            <p className={app.groupLabel}>Utilities</p>
            <ul className={app.group}>
              <li>
                <button type="button" className={app.row} onClick={() => setAlbum("deleted")}>
                  <TrashGlyph />
                  <span className={app.rowMain}>
                    <span className={app.rowTitle}>Recently Deleted</span>
                  </span>
                  <span className={app.rowMeta}>{bin.length}</span>
                  <Chevron />
                </button>
              </li>
            </ul>
          </>
        )}
      </div>

      {!inDeleted && (
        <nav className={styles.tabs} aria-label="Photos">
          <span className={styles.tabGroup}>
            <button type="button" className={styles.tab} data-on={tab === "library" || undefined} onClick={() => setTab("library")}>
              <LibraryGlyph />
              Library
            </button>
            <button type="button" className={styles.tab} data-on={tab === "collections" || undefined} onClick={() => setTab("collections")}>
              <CollectionsGlyph />
              Collections
            </button>
          </span>
        </nav>
      )}
    </section>
  );
}
