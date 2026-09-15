"use client";

import { useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Photo } from "@/content/found/types";
import { all, has } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import AppBar, { Chevron } from "./AppBar";
import FaceGate from "./FaceGate";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Photos.module.css";

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

function LockGlyph() {
  return (
    <svg viewBox="0 0 20 20" className={styles.lockGlyph} aria-label="Locked">
      <path d="M6.5 9V6.8a3.5 3.5 0 0 1 7 0V9" />
      <rect x="4.8" y="9" width="10.4" height="7.8" rx="2" />
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

/**
 * Photos, as current iOS lays it out: Library and Collections under a
 * floating glass tab bar. The Library grid opens at the newest photo, the
 * way the real one does. Recently Deleted is under Collections, in
 * Utilities, with its own Recover All; that's where the case turns.
 */
export default function Photos({ state }: AppProps) {
  const ep = useStory();
  const [tab, setTab] = useState<Tab>("library");
  const [album, setAlbum] = useState<"recents" | "deleted">("recents");
  const [viewing, setViewing] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);
  // Recently Deleted is behind Face ID, once per visit to Photos (FaceGate).
  const [unlocked, setUnlocked] = useState(false);
  const [gate, setGate] = useState(false);
  const recovered = has(state, "did:recover-van");
  // A recovered photo moves back to the Library, dated when it was put back.
  const where = (p: Photo) => (p.album === "deleted" && p.recoverable && recovered ? "recents" : p.album);
  const inDeleted = album === "deleted";
  const library = ep.photos.filter((p) => where(p) === "recents" && all(state, p.requires));
  const bin = ep.photos.filter((p) => where(p) === "deleted" && all(state, p.requires));
  const list = inDeleted ? bin : library;
  const shown = ep.photos.find((p) => p.id === viewing);
  const canRecover = inDeleted && shown?.recoverable && !recovered;
  // The album's own "Recover All", where a phone puts it, so nobody has to
  // open the photo to learn it can come back.
  const canRecoverAll = inDeleted && !recovered && bin.some((p) => p.recoverable);

  // The Library opens at its newest photo, at the bottom, like the real one.
  useEffect(() => {
    const el = body.current;
    if (el && tab === "library" && !inDeleted) el.scrollTop = el.scrollHeight;
  }, [tab, inDeleted, library.length]);

  const recover = () => {
    play.perform("recover-van");
    setViewing(null);
    setAlbum("recents");
    setTab("library");
  };

  const grid = (
    <div className={styles.grid}>
      {list.map((p) => (
        <button type="button" key={p.id} className={styles.thumb} onClick={() => setViewing(p.id)} aria-label={`${p.place}, ${p.takenAt}`}>
          <PhotoFrame id={p.id} cast={state.cast} size="thumb" />
          {inDeleted && <span className={styles.days}>23 days</span>}
        </button>
      ))}
    </div>
  );

  return (
    <section className={app.view}>
      {inDeleted ? (
        <AppBar
          title="Recently Deleted"
          onBack={() => setAlbum("recents")}
          backLabel="Collections"
          end={
            canRecoverAll ? (
              <button type="button" className={app.pill} onClick={recover}>
                Recover All
              </button>
            ) : undefined
          }
        />
      ) : (
        <AppBar />
      )}

      <div className={app.body} ref={body} data-tabbed={!inDeleted || undefined}>
        {inDeleted ? (
          <>
            <p className={styles.kept}>Photos and videos show the days remaining before they&apos;re deleted.</p>
            {grid}
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
                  <span className={styles.albumThumb}>
                    {library.at(-1) && <PhotoFrame id={library.at(-1)!.id} cast={state.cast} size="thumb" />}
                  </span>
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
                <button type="button" className={app.row} onClick={() => (unlocked ? setAlbum("deleted") : setGate(true))}>
                  <TrashGlyph />
                  <span className={app.rowMain}>
                    <span className={app.rowTitle}>Recently Deleted</span>
                  </span>
                  {unlocked ? <span className={app.rowMeta}>{bin.length}</span> : <LockGlyph />}
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
            <button
              type="button"
              className={styles.tab}
              data-on={tab === "collections" || undefined}
              onClick={() => setTab("collections")}
            >
              <CollectionsGlyph />
              Collections
            </button>
          </span>
        </nav>
      )}

      {gate && (
        <FaceGate
          onOpen={() => {
            setUnlocked(true);
            setGate(false);
            setAlbum("deleted");
          }}
          onCancel={() => setGate(false)}
        />
      )}

      {viewing && (
        <PhotoViewer
          id={viewing}
          cast={state.cast}
          deleted={inDeleted}
          onClose={() => setViewing(null)}
          onRecover={canRecover ? recover : undefined}
        />
      )}
    </section>
  );
}
