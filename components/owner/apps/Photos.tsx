"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Photo, Story } from "@/content/types";
import type { CaseState } from "@/lib/game/engine";
import { calendarOf, clipOf, library, mmss, revertible } from "@/lib/game/phone";
import app from "../ios/App.module.css";
import AppBar, { Chevron } from "../ios/AppBar";
import Clip from "../ios/Clip";
import frame from "../ios/PhotoFrame.module.css";
import styles from "../ios/Photos.module.css";
import paper from "./Photos.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Photos, as current iOS lays it out and as the pilot drew it: Library and
   Collections under a floating glass tab bar; albums, Favorites, and the
   Utilities at the bottom (Hidden, once Settings shows it, and Recently
   Deleted with the days each thing has left). A viewer with the place and
   time on top and a toolbar underneath.

   Four things in here are real iOS behaviour a chapter can hide something
   behind (CHAPTER1.md E):
   - Recently Deleted keeps a photo or video for 30 days, and Recover puts it
     back
   - the Hidden album only appears once Settings › Photos says to show it
   - an edited clip keeps its original, and Edit › Revert brings it back
   - a photograph can hold something only leaning in finds (zoom that counts)

   Until the shoot, `paper` is a page in somebody's hand and `scene` a titled
   card; `src` swaps in the real thing.
   =========================================================================== */

type Tab = "library" | "collections";
type Album = { readonly name: string; readonly photos: readonly Photo[]; readonly bin?: boolean };

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

const TRASH =
  "M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.9 12.2c.1 1 .9 1.8 1.9 1.8h5.4c1 0 1.8-.8 1.9-1.8l.9-12.2";
const HIDDEN = "M3.5 12s3.2-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3.2 5.5-8.5 5.5S3.5 12 3.5 12ZM4.5 4.5l15 15M12 9.5a2.5 2.5 0 0 1 2.5 2.5";
const HEART = "M12 19.6s-7.2-4.3-7.2-9.5A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.2 2.4c0 5.2-7.2 9.5-7.2 9.5Z";
const INFO = "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM12 11v5.2M12 7.6v.2";

function RowGlyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.rowGlyph} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** A photograph, a video's poster, or a handwritten page as a phone camera sees paper. */
function Picture({ photo, big, seconds }: { photo: Photo; big?: boolean; seconds?: number }) {
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
    <div className={paper.scene} data-big={big || undefined} data-video={photo.video ? "" : undefined}>
      {photo.src ? (
        <Image src={photo.src} alt={photo.title} fill sizes={big ? "400px" : "140px"} className={frame.image} />
      ) : (
        <span className={paper.sceneTitle}>{photo.title}</span>
      )}
      {seconds !== undefined && !big && <span className={paper.duration}>{mmss(seconds)}</span>}
    </div>
  );
}

/* --- Leaning in: the pilot's zoom that counts -------------------------------- */

/** Past this, what's at the edge of a zoomable photo is visible. */
const REVEAL_AT = 2.2;
const MAX_ZOOM = 4;
const TAP_ZOOM = 3;

type Zoom = { scale: number; x: number; y: number; w: number; h: number };

/** Is a point of the photo (percent) near enough the middle of the frame, at this zoom, to read? */
function onScreen(spot: { x: number; y: number }, z: Zoom): boolean {
  if (!z.w || !z.h) return false;
  const px = (spot.x / 100 - 0.5) * z.w * z.scale + z.x;
  const py = (spot.y / 100 - 0.5) * z.h * z.scale + z.y;
  return Math.abs(px) <= z.w * 0.3 && Math.abs(py) <= z.h * 0.3;
}

function Zoomable({ photo, onFound }: { photo: Photo & { zoom: NonNullable<Photo["zoom"]> }; onFound: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<Zoom>({ scale: 1, x: 0, y: 0, w: 0, h: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const revealed = zoom.scale >= REVEAL_AT && onScreen(photo.zoom.at, zoom);

  useEffect(() => {
    if (revealed) onFound();
  }, [revealed, onFound]);

  const clamp = (scale: number, x: number, y: number): Zoom => {
    const s = Math.min(MAX_ZOOM, Math.max(1, scale));
    const fw = box.current?.clientWidth ?? 0;
    const fh = box.current?.clientHeight ?? 0;
    const w = (fw * (s - 1)) / 2;
    const h = (fh * (s - 1)) / 2;
    return { scale: s, x: Math.min(w, Math.max(-w, x)), y: Math.min(h, Math.max(-h, y)), w: fw, h: fh };
  };

  return (
    <div
      ref={box}
      className={frame.viewerImage}
      onPointerDown={(e) => {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        e.currentTarget.setPointerCapture?.(e.pointerId);
        if (pointers.current.size === 2) {
          const [a, b] = [...pointers.current.values()];
          pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: zoom.scale };
        }
      }}
      onPointerMove={(e) => {
        const prev = pointers.current.get(e.pointerId);
        if (!prev) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2 && pinch.current) {
          const [a, b] = [...pointers.current.values()];
          const scale = (pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, pinch.current.dist);
          setZoom((z) => clamp(scale, z.x, z.y));
        } else if (pointers.current.size === 1 && zoom.scale > 1) {
          setZoom((z) => clamp(z.scale, z.x + e.clientX - prev.x, z.y + e.clientY - prev.y));
        }
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
      }}
      onDoubleClick={(e) => {
        if (zoom.scale > 1) return setZoom({ scale: 1, x: 0, y: 0, w: zoom.w, h: zoom.h });
        // Bring what was tapped to the middle, as far as the photo's edges allow.
        const r = e.currentTarget.getBoundingClientRect();
        setZoom(clamp(TAP_ZOOM, -(e.clientX - (r.left + r.width / 2)) * TAP_ZOOM, -(e.clientY - (r.top + r.height / 2)) * TAP_ZOOM));
      }}
      onWheel={(e) => setZoom((z) => clamp(z.scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), z.x, z.y))}
    >
      <div
        className={frame.zoomable}
        data-zoomed={zoom.scale > 1 || undefined}
        style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}
      >
        <Picture photo={photo} big />
        {/* Small, at the edge of the frame: nothing anyone would see without leaning in. */}
        <span
          className={frame.zoomReveal}
          style={{ left: `${photo.zoom.at.x}%`, top: `${photo.zoom.at.y}%` }}
          data-on={revealed || undefined}
          aria-hidden={!revealed}
        >
          {photo.zoom.reveal}
        </span>
      </div>
    </div>
  );
}

function Glyph({ d, filled = false }: { d: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={filled || undefined}>
      <path d={d} />
    </svg>
  );
}

function Viewer({
  photo,
  day,
  state,
  onClose,
  onRead,
  onRecover,
  onRevert,
}: {
  photo: Photo;
  /** How the phone names the day it was taken. */
  day: string;
  state: CaseState;
  onClose: () => void;
  onRead: (ids: readonly string[]) => void;
  onRecover?: () => void;
  onRevert: () => void;
}) {
  const [info, setInfo] = useState(false);
  const [editing, setEditing] = useState(false);
  const clip = clipOf(state, photo);
  const zoomed = photo.zoom;

  return (
    <div className={frame.viewer} data-no-swipe>
      <div className={frame.viewerBar}>
        <button type="button" className={frame.round} onClick={onClose} aria-label="Back" data-back>
          <Chevron back />
        </button>
        <span className={frame.viewerWhen}>
          {photo.place && <strong>{photo.place}</strong>}
          <span>
            {day} {stamp(photo.at)}
          </span>
        </span>
        <span />
      </div>

      {zoomed ? (
        <Zoomable photo={{ ...photo, zoom: zoomed }} onFound={() => onRead([zoomed.evidence])} />
      ) : (
        <div className={frame.viewerImage} data-video={clip ? "" : undefined}>
          <Picture photo={photo} big />
        </div>
      )}

      {/* Keyed on the length, so a reverted clip starts again from the top. */}
      {clip && <Clip key={clip.seconds} seconds={clip.seconds} captions={clip.captions} />}

      {info && (
        <div className={frame.info}>
          <p className={frame.infoDay}>
            {day} · {stamp(photo.at)}
          </p>
          {photo.camera && <p className={frame.infoCam}>{photo.camera}</p>}
          {revertible(state, photo) && <p className={frame.infoNote}>Edited</p>}
          {photo.caption && <p className={frame.infoNote}>{photo.caption}</p>}
          {photo.deletedAt && (
            <p className={frame.infoNote}>
              Deleted at {stamp(photo.deletedAt)}. {photo.daysLeft ?? 30} days left.
            </p>
          )}
        </div>
      )}

      {/* Edit, as iOS offers it on anything it changed: Revert, and it can't be undone. */}
      {editing && (
        <div className={frame.sheet} role="dialog" aria-label="Revert">
          <p className={frame.sheetText}>Revert to original? This will remove all edits made to this {clip ? "video" : "photo"}.</p>
          <button
            type="button"
            className={frame.sheetDanger}
            onClick={() => {
              onRevert();
              if (photo.original?.evidence) onRead([photo.original.evidence]);
              setEditing(false);
            }}
          >
            Revert to Original
          </button>
          <button type="button" className={frame.sheetCancel} onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className={frame.toolbar}>
        {onRecover ? (
          <span className={frame.toolText} />
        ) : (
          <span className={frame.tool} data-on={photo.favorite || undefined} aria-label={photo.favorite ? "Favourite" : "Not a favourite"}>
            <Glyph d={HEART} filled={photo.favorite} />
          </span>
        )}
        <button type="button" className={frame.tool} data-on={info || undefined} onClick={() => setInfo((v) => !v)} aria-label="Info">
          <Glyph d={INFO} />
        </button>
        {onRecover ? (
          <button type="button" className={frame.toolText} onClick={onRecover}>
            Recover
          </button>
        ) : revertible(state, photo) ? (
          <button type="button" className={frame.toolText} onClick={() => setEditing(true)}>
            Edit
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
  onRevert,
}: {
  story: Story;
  state: CaseState;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
  onRevert: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const [album, setAlbum] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  const lib = library(story, state);
  const cal = calendarOf(story, state);
  const albums: Album[] = [
    ...(lib.favorites.length ? [{ name: "Favorites", photos: lib.favorites }] : []),
    ...lib.albums,
  ];
  const utilities: Album[] = [
    ...(lib.hidden ? [{ name: "Hidden", photos: lib.hidden }] : []),
    { name: "Recently Deleted", photos: lib.bin, bin: true },
  ];
  const open = [...albums, ...utilities].find((a) => a.name === album);
  const list = open?.photos ?? lib.recents;
  const photo = list.find((p) => p.id === viewing);

  if (photo)
    return (
      <Viewer
        day={cal.label(photo.day)}
        photo={photo}
        state={state}
        onClose={() => setViewing(null)}
        onRead={onRead}
        onRevert={() => onRevert(photo.id)}
        onRecover={
          open?.bin
            ? () => {
                onRestore(photo.id);
                if (photo.evidence) onRead([photo.evidence]);
                setViewing(null);
                setAlbum(null);
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
            // Seen in the bin is seen: it counts from the moment it's opened (PLAYTEST.md #44).
            if (p.evidence) onRead([p.evidence]);
          }}
          aria-label={`${p.title}, ${cal.label(p.day)} ${stamp(p.at)}`}
        >
          <Picture photo={p} seconds={clipOf(state, p)?.seconds} />
          {open?.bin && <span className={styles.days}>{p.daysLeft ?? 30} days</span>}
        </button>
      ))}
    </div>
  );

  const row = (a: Album, glyph?: string) => (
    <li key={a.name}>
      <button type="button" className={app.row} onClick={() => setAlbum(a.name)}>
        {glyph ? <RowGlyph d={glyph} /> : <span className={styles.albumThumb}>{a.photos.at(-1) && <Picture photo={a.photos.at(-1)!} />}</span>}
        <span className={app.rowMain}>
          <span className={app.rowTitle}>{a.name}</span>
        </span>
        <span className={app.rowMeta}>{a.photos.length}</span>
        <Chevron />
      </button>
    </li>
  );

  return (
    <section className={app.view} aria-label="Photos">
      {open ? (
        <AppBar title={open.name} onBack={() => setAlbum(null)} backLabel="Collections" />
      ) : (
        <AppBar onBack={onBack} backLabel="Home" />
      )}

      <div className={app.body} data-tabbed={!open || undefined}>
        {open ? (
          <>
            {open.bin && <p className={styles.kept}>Photos and videos show the days remaining before they&apos;re deleted.</p>}
            {grid}
            {list.length === 0 && <p className={styles.sub}>No photos or videos.</p>}
          </>
        ) : tab === "library" ? (
          <>
            <h2 className={app.big}>Library</h2>
            <p className={styles.sub}>{lib.recents.length} Items</p>
            {grid}
          </>
        ) : (
          <>
            <h2 className={app.big}>Collections</h2>
            <p className={app.groupLabel}>Albums</p>
            <ul className={app.group}>
              <li>
                <button type="button" className={app.row} onClick={() => setTab("library")}>
                  <span className={styles.albumThumb}>{lib.recents.at(-1) && <Picture photo={lib.recents.at(-1)!} />}</span>
                  <span className={app.rowMain}>
                    <span className={app.rowTitle}>Recents</span>
                  </span>
                  <span className={app.rowMeta}>{lib.recents.length}</span>
                  <Chevron />
                </button>
              </li>
              {albums.map((a) => row(a))}
            </ul>
            <p className={app.groupLabel}>Utilities</p>
            <ul className={app.group}>{utilities.map((a) => row(a, a.bin ? TRASH : HIDDEN))}</ul>
          </>
        )}
      </div>

      {!open && (
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
