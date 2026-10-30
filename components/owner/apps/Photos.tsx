"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Photo, Story } from "@/content/types";
import { evidenceIn, has, type CaseState } from "@/lib/game/engine";
import { sentFlag } from "@/lib/game/reading";
import {
  calendarOf,
  clipOf,
  library,
  loaded,
  mmss,
  revertible,
  syncPaused,
} from "@/lib/game/phone";
import Alert from "../ios/Alert";
import app from "../ios/App.module.css";
import AppBar, { Chevron } from "../ios/AppBar";
import Clip from "../ios/Clip";
import frame from "../ios/PhotoFrame.module.css";
import styles from "../ios/Photos.module.css";
import paper from "./Photos.module.css";
import Sketch from "./Sketch";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   Photos, as current iOS lays it out and as the pilot drew it: Library and
   Collections under a floating glass tab bar; albums, Favorites, and the
   Utilities at the bottom (Hidden, once Settings shows it, and Recently
   Deleted with the days each thing has left). A viewer with the place and
   time on top and a toolbar underneath.

   Five things in here are real iOS behaviour a chapter can hide something
   behind (CHAPTER1.md E):
   - Recently Deleted keeps a photo or video for 30 days, and Recover puts it
     back
   - the Hidden album only appears once Settings › Photos says to show it
   - an edited clip keeps its original, and Edit › Revert brings it back
   - a photograph can hold something only leaning in finds (zoom that counts)
   - with Optimise iPhone Storage, a photo or video can be only a blurred
     thumbnail here, the rest in iCloud: until it can come down, opening it
     spins and then says it couldn't (`Photo.inCloud`)

   Until the shoot, `paper` is a page in somebody's hand and `scene` a titled
   card; `src` swaps in the real thing.
   =========================================================================== */

type Tab = "library" | "collections";
type Album = {
  readonly name: string;
  readonly photos: readonly Photo[];
  readonly bin?: boolean;
};

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
const HIDDEN =
  "M3.5 12s3.2-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3.2 5.5-8.5 5.5S3.5 12 3.5 12ZM4.5 4.5l15 15M12 9.5a2.5 2.5 0 0 1 2.5 2.5";
const HEART =
  "M12 19.6s-7.2-4.3-7.2-9.5A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.2 2.4c0 5.2-7.2 9.5-7.2 9.5Z";
const INFO =
  "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM12 11v5.2M12 7.6v.2";
const SHARE =
  "M12 14.5V3.5M12 3.5 8.5 7M12 3.5 15.5 7M7.5 10H6a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18 10h-1.5";

function RowGlyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.rowGlyph} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Until the shoot, each photograph is a dark exposure in its own light: warm for most of a wedding night. */
const HUES = [24, 34, 18, 42, 12, 205, 30, 300, 160, 38];
const hueOf = (id: string) =>
  HUES[
    [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7) % HUES.length
  ];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/** A day number from the phone's calendar, as Photos heads the Library: "22 Nov". */
const shortDay = (n: number) => {
  const d = new Date(n * 86_400_000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

/**
 * A photograph, a video's poster, or a handwritten page as a phone camera sees
 * paper. `veiled`: only the thumbnail is on the phone, blurred past reading.
 */
function Picture({
  photo,
  big,
  seconds,
  veiled,
}: {
  photo: Photo;
  big?: boolean;
  seconds?: number;
  veiled?: boolean;
}) {
  // A screenshot of a chat: WhatsApp's own dark bubbles, with the group's name on top.
  if (photo.kind === "chat" && photo.chat)
    return (
      <div
        className={paper.shot}
        data-big={big || undefined}
        data-veiled={veiled || undefined}
      >
        <p className={paper.shotHead}>
          <b>{photo.chat.name}</b>
          {photo.chat.sub && <span>{photo.chat.sub}</span>}
        </p>
        {/* Still in iCloud: the shapes of the messages, none of their words. */}
        {veiled
          ? photo.chat.lines.map((l, i) => (
              <span
                key={i}
                className={paper.shotBar}
                data-system={l.system || undefined}
                aria-hidden="true"
              />
            ))
          : photo.chat.lines.map((l, i) =>
              l.system ? (
                <p key={i} className={paper.shotSystem}>
                  {l.text}
                </p>
              ) : (
                <p key={i} className={paper.shotLine}>
                  {l.who && <b>{l.who}</b>}
                  <span lang={l.english ? "hi-Latn" : undefined}>{l.text}</span>
                  {big && l.english && <small>{l.english}</small>}
                  <i>{stamp(l.at)}</i>
                </p>
              ),
            )}
      </div>
    );
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
    <div
      className={paper.scene}
      data-big={big || undefined}
      data-video={photo.video ? "" : undefined}
      data-wide={photo.wide || undefined}
      data-veiled={veiled || undefined}
      style={{ "--hue": hueOf(photo.id) } as CSSProperties}
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={veiled ? "" : photo.title}
          fill
          sizes={big ? "400px" : "140px"}
          className={frame.image}
        />
      ) : (
        !veiled && (
          <Sketch
            id={photo.id}
            title={photo.title}
            hue={hueOf(photo.id)}
            big={big}
          />
        )
      )}
      {seconds !== undefined && !big && (
        <span className={paper.duration}>{mmss(seconds)}</span>
      )}
    </div>
  );
}

/* --- Leaning in: the pilot's zoom that counts -------------------------------- */

/** Past this, what's at the edge of a zoomable photo is visible. */
const REVEAL_AT = 2.2;
const MAX_ZOOM = 4;
const TAP_ZOOM = 3;

/** The zoom, with the window it's seen through (`w`, `h`) and the photo's own size in it (`pw`, `ph`). */
type Zoom = {
  scale: number;
  x: number;
  y: number;
  w: number;
  h: number;
  pw: number;
  ph: number;
};

/** Is a point of the photo (percent) near enough the middle of the window, at this zoom, to read? */
function onScreen(spot: { x: number; y: number }, z: Zoom): boolean {
  if (!z.w || !z.h) return false;
  const px = (spot.x / 100 - 0.5) * z.pw * z.scale + z.x;
  const py = (spot.y / 100 - 0.5) * z.ph * z.scale + z.y;
  return Math.abs(px) <= z.w * 0.3 && Math.abs(py) <= z.h * 0.3;
}

function Zoomable({
  photo,
  onFound,
}: {
  photo: Photo & { zoom: NonNullable<Photo["zoom"]> };
  onFound: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<Zoom>({
    scale: 1,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    pw: 0,
    ph: 0,
  });
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
    // Untransformed, so the size of the photo itself whatever the zoom.
    const pw = pic.current?.offsetWidth ?? fw;
    const ph = pic.current?.offsetHeight ?? fh;
    // As far as the photo reaches past the window, and no further into the black.
    const w = Math.max(0, (pw * s - fw) / 2);
    const h = Math.max(0, (ph * s - fh) / 2);
    return {
      scale: s,
      x: Math.min(w, Math.max(-w, x)),
      y: Math.min(h, Math.max(-h, y)),
      w: fw,
      h: fh,
      pw,
      ph,
    };
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
          pinch.current = {
            dist: Math.hypot(a.x - b.x, a.y - b.y),
            scale: zoom.scale,
          };
        }
      }}
      onPointerMove={(e) => {
        const prev = pointers.current.get(e.pointerId);
        if (!prev) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2 && pinch.current) {
          const [a, b] = [...pointers.current.values()];
          const scale =
            (pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) /
            Math.max(1, pinch.current.dist);
          setZoom((z) => clamp(scale, z.x, z.y));
        } else if (pointers.current.size === 1 && zoom.scale > 1) {
          setZoom((z) =>
            clamp(z.scale, z.x + e.clientX - prev.x, z.y + e.clientY - prev.y),
          );
        }
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
      }}
      onDoubleClick={(e) => {
        if (zoom.scale > 1) return setZoom({ ...zoom, scale: 1, x: 0, y: 0 });
        // Bring what was tapped to the middle, as far as the photo's edges allow.
        const r = e.currentTarget.getBoundingClientRect();
        setZoom(
          clamp(
            TAP_ZOOM,
            -(e.clientX - (r.left + r.width / 2)) * TAP_ZOOM,
            -(e.clientY - (r.top + r.height / 2)) * TAP_ZOOM,
          ),
        );
      }}
      onWheel={(e) =>
        setZoom((z) =>
          clamp(
            z.scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)),
            z.x,
            z.y,
          ),
        )
      }
    >
      <div
        ref={pic}
        className={frame.zoomable}
        data-zoomed={zoom.scale > 1 || undefined}
        style={{
          transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
        }}
      >
        <Picture photo={photo} big />
        {/* Small, at the edge of the frame: nothing anyone would see without leaning in.
            A real photograph has the words on it already: only a drawn one needs them laid on. */}
        <span
          hidden={Boolean(photo.src)}
          className={frame.zoomReveal}
          style={{ left: `${photo.zoom.at.x}%`, top: `${photo.zoom.at.y}%` }}
          data-on={revealed || undefined}
          aria-hidden={!revealed}
        >
          {photo.zoom.reveal}
        </span>
      </div>
      {/* Said once, on the photo itself: leaning in is something this frame rewards. */}
      {zoom.scale === 1 && !revealed && (
        <span className={frame.zoomHint}>
          Double-tap or pinch to look closer
        </span>
      )}
    </div>
  );
}

function Glyph({ d, filled = false }: { d: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-filled={filled || undefined}
    >
      <path d={d} />
    </svg>
  );
}

/** Whether the phone lets this item go (RAAKH-V3 §17): what's in it is marked deletable. */
const deletable = (story: Story, item: string): boolean =>
  evidenceIn(story, item).some((id) => story.evidence.find((e) => e.id === id)?.deletable);

/** How long the viewer spins on something still in iCloud before it gives up. */
const LOAD_TRY_MS = 1600;

function Viewer({
  photo,
  day,
  state,
  onClose,
  onRead,
  onRecover,
  onRevert,
  onStep,
  place,
  voice,
  onDelete,
  onSend,
  sent,
}: {
  /** The phone lets this one go (RAAKH-V3 §17): to Recently Deleted, or, from there, for good. */
  onDelete?: () => void;
  /** Send to M, once she's asked for things (`Story.sendTo`); `sent` once it has gone. */
  onSend?: () => void;
  sent?: boolean;
  photo: Photo;
  /** The recording under a video, where there is one. */
  voice?: string;
  /** Swipe or an arrow key: the photo before (-1) or after (+1), when there is one. */
  onStep?: (by: -1 | 1) => void;
  /** Where it is in what's being looked through: "3 of 12". */
  place?: { at: number; of: number };
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
  const [deleting, setDeleting] = useState(false);
  // Still in iCloud: it tries, and then says it couldn't, the way Photos does.
  const here = loaded(state, photo);
  const [failed, setFailed] = useState(false);
  const [told, setTold] = useState(false);
  useEffect(() => {
    if (here) return undefined;
    const t = window.setTimeout(() => setFailed(true), LOAD_TRY_MS);
    return () => window.clearTimeout(t);
  }, [here]);
  const clip = here ? clipOf(state, photo) : undefined;
  const zoomed = here ? photo.zoom : undefined;
  const video = Boolean(photo.video);

  /* Left and right through the album, by key or by swipe, as Photos does
     (2026-10-23). Escape puts it away. A zoomed photo pans instead. */
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onStep?.(-1);
      else if (e.key === "ArrowRight") onStep?.(1);
      else if (e.key === "Escape") onClose();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onStep, onClose]);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("[data-zoomed]")) return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const from = swipe.current;
    swipe.current = null;
    if (!from || (e.target as Element).closest("[data-zoomed]")) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4)
      onStep?.(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={frame.viewer}
      data-no-swipe
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => (swipe.current = null)}
    >
      <div className={frame.viewerBar}>
        <button
          type="button"
          className={`${frame.round} lg`}
          onClick={onClose}
          aria-label="Back"
          data-back
        >
          <Chevron back />
        </button>
        <span className={frame.viewerWhen}>
          {photo.place && <strong>{photo.place}</strong>}
          <span>
            {day} {stamp(photo.at)}
            {photo.trimmed && " · Trimmed"}
          </span>
        </span>
        {place && place.of > 1 ? (
          <span className={frame.viewerCount}>
            {place.at} of {place.of}
          </span>
        ) : (
          <span />
        )}
      </div>

      {onStep && place && place.of > 1 && (
        <>
          <button
            type="button"
            className={`${frame.step} lg`}
            data-side="prev"
            onClick={() => onStep(-1)}
            disabled={place.at <= 1}
            aria-label="Previous photo"
          >
            <Chevron back />
          </button>
          <button
            type="button"
            className={`${frame.step} lg`}
            data-side="next"
            onClick={() => onStep(1)}
            disabled={place.at >= place.of}
            aria-label="Next photo"
          >
            <Chevron />
          </button>
        </>
      )}

      {zoomed ? (
        <Zoomable
          photo={{ ...photo, zoom: zoomed }}
          onFound={() => onRead([zoomed.evidence])}
        />
      ) : clip?.film ? null : (
        <div
          className={frame.viewerImage}
          data-video={photo.video ? "" : undefined}
        >
          <Picture photo={photo} big veiled={!here} />
          {!here &&
            (failed ? (
              <span
                className={frame.failed}
                aria-label="Couldn't load"
                role="img"
              />
            ) : (
              <span className={frame.loading} aria-label="Loading" role="img" />
            ))}
        </div>
      )}

      {/* Keyed on the length, so a reverted clip starts again from the top. */}
      {clip && (
        <Clip
          key={clip.seconds}
          seconds={clip.seconds}
          captions={clip.captions}
          voice={voice}
          film={clip.film}
          evidence={photo.original && clip === photo.original ? photo.original.evidence : photo.evidence}
        />
      )}

      {info && (
        <div className={frame.info}>
          <p className={frame.infoDay}>
            {day} · {stamp(photo.at)}
          </p>
          {photo.camera && <p className={frame.infoCam}>{photo.camera}</p>}
          {revertible(state, photo) && <p className={frame.infoNote}>Edited</p>}
          {photo.trimmed && (
            <p className={frame.infoNote}>
              Trimmed from a longer video. The original isn&apos;t in this
              library.
            </p>
          )}
          {photo.caption && <p className={frame.infoNote}>{photo.caption}</p>}
          {photo.deletedAt && (
            <p className={frame.infoNote}>
              Deleted at {stamp(photo.deletedAt)}. {photo.daysLeft ?? 30} days
              left.
            </p>
          )}
        </div>
      )}

      {/* Edit, as iOS offers it on anything it changed: Revert, and it can't be undone. */}
      {editing && (
        <div className={frame.sheet} role="dialog" aria-label="Revert">
          <p className={frame.sheetText}>
            Revert to original? This will remove all edits made to this{" "}
            {clip ? "video" : "photo"}.
          </p>
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
          <button
            type="button"
            className={frame.sheetCancel}
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Delete, as Photos asks it: from the library to Recently Deleted; from there, for good. */}
      {deleting && onDelete && (
        <div className={frame.sheet} role="dialog" aria-label="Delete">
          <p className={frame.sheetText}>
            {onRecover
              ? `This ${video ? "video" : "photo"} will be deleted. This action can't be undone.`
              : `This ${video ? "video" : "photo"} will be moved to Recently Deleted.`}
          </p>
          <button
            type="button"
            className={frame.sheetDanger}
            onClick={() => {
              setDeleting(false);
              onDelete();
            }}
          >
            {onRecover ? `Delete ${video ? "Video" : "Photo"}` : `Delete ${video ? "Video" : "Photo"}`}
          </button>
          <button type="button" className={frame.sheetCancel} onClick={() => setDeleting(false)}>
            Cancel
          </button>
        </div>
      )}

      {failed && !told && (
        <Alert
          title={video ? "Unable to Load Video" : "Unable to Load Photo"}
          message={`An error occurred while loading a higher quality version of this ${video ? "video" : "photo"}.`}
          onClose={() => setTold(true)}
        />
      )}

      {/* iOS 26's viewer toolbar: share, then favourite, info and edit, then delete, on one pane of glass. */}
      <div className={`${frame.toolbar} lg`}>
        {onSend ? (
          <button type="button" className={frame.tool} onClick={onSend} disabled={sent} aria-label={sent ? "Sent to M" : "Send to M"} data-on={sent || undefined}>
            <Glyph d={SHARE} />
          </button>
        ) : (
          <span className={frame.tool} aria-hidden="true">
            <Glyph d={SHARE} />
          </span>
        )}
        {onRecover ? (
          <span className={frame.toolText} />
        ) : (
          <span
            className={frame.tool}
            data-on={photo.favorite || undefined}
            aria-label={photo.favorite ? "Favourite" : "Not a favourite"}
          >
            <Glyph d={HEART} filled={photo.favorite} />
          </span>
        )}
        <button
          type="button"
          className={frame.tool}
          data-on={info || undefined}
          onClick={() => setInfo((v) => !v)}
          aria-label="Info"
        >
          <Glyph d={INFO} />
        </button>
        {onRecover ? (
          <button type="button" className={frame.toolText} onClick={onRecover}>
            Recover
          </button>
        ) : revertible(state, photo) ? (
          <button
            type="button"
            className={frame.toolText}
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        ) : (
          <span className={frame.toolText} />
        )}
        {onDelete ? (
          <button type="button" className={frame.tool} onClick={() => setDeleting(true)} aria-label={onRecover ? "Delete permanently" : "Delete"}>
            <Glyph d={TRASH} />
          </button>
        ) : (
          <span className={frame.tool} aria-hidden="true">
            <Glyph d={TRASH} />
          </span>
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
  onDelete,
  onSend,
}: {
  story: Story;
  state: CaseState;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
  onRevert: (id: string) => void;
  /** Delete an item the phone lets go of: to the bin, or from the bin for good (RAAKH-V3 §17). */
  onDelete?: (id: string, how: "soft" | "perm") => void;
  /** Send what's in it to M (`Story.sendTo`). */
  onSend?: (evidence: readonly string[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("library");
  const [album, setAlbum] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  /* Photos opens on the newest, as iOS does, where the screenshots that
     matter are; back from a photo, it's where you left it. */
  const body = useRef<HTMLDivElement>(null);
  // Opened on a new place (the Library, an album), it starts at the newest; a photo put away leaves it where it was.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (tab === "library" && !album) el.scrollTop = el.scrollHeight;
    else el.scrollTop = 0;
  }, [tab, album]);

  const lib = library(story, state);
  const sendable = Boolean(story.sendTo && story.sendTo.after.every((f) => has(state, f)));
  const cal = calendarOf(story, state);
  const albums: Album[] = [
    ...(lib.favorites.length
      ? [{ name: "Favorites", photos: lib.favorites }]
      : []),
    ...lib.albums,
  ];
  const utilities: Album[] = [
    ...(lib.hidden ? [{ name: "Hidden", photos: lib.hidden }] : []),
    { name: "Recently Deleted", photos: lib.bin, bin: true },
  ];
  const open = [...albums, ...utilities].find((a) => a.name === album);
  const list = open?.photos ?? lib.recents;
  const photo = list.find((p) => p.id === viewing);

  /* Opening a photo: what counts in it is read, whichever way it was reached (a tap, or a swipe from the one beside it). */
  const show = (p: Photo) => {
    setViewing(p.id);
    // Seen in the bin is seen: it counts from the moment it's opened (PLAYTEST.md #44).
    // What's still in iCloud hasn't been seen, whenever it was tapped.
    if (loaded(state, p)) {
      const ids = [
        p.evidence,
        ...(p.chat?.lines.map((l) => l.evidence) ?? []),
      ].filter((id): id is string => Boolean(id));
      if (ids.length) onRead(ids);
    }
  };
  const at = photo ? list.indexOf(photo) : -1;
  /* The viewer lies over the grid rather than replacing it, so putting a
     photo away lands exactly where it was opened (2026-10-23). */
  const viewer = photo && (
    <Viewer
      key={photo.id}
      voice={story.voices?.[`clip:${photo.id}`]?.src}
      place={{ at: at + 1, of: list.length }}
      onStep={(by) => {
        const next = list[at + by];
        if (next) show(next);
      }}
      day={cal.label(photo.day)}
      photo={photo}
      state={state}
      onClose={() => setViewing(null)}
      onRead={onRead}
      onRevert={() => onRevert(photo.id)}
      onDelete={
        onDelete && deletable(story, photo.id)
          ? () => {
              onDelete(photo.id, open?.bin ? "perm" : "soft");
              setViewing(null);
            }
          : undefined
      }
      onSend={onSend && sendable && loaded(state, photo) && evidenceIn(story, photo.id).length ? () => onSend(evidenceIn(story, photo.id)) : undefined}
      sent={evidenceIn(story, photo.id).every((id) => has(state, sentFlag(id)))}
      onRecover={
        open?.bin
          ? () => {
              onRestore(photo.id);
              const ids = [
                photo.evidence,
                ...(photo.chat?.lines.map((l) => l.evidence) ?? []),
              ].filter((id): id is string => Boolean(id));
              if (ids.length && loaded(state, photo)) onRead(ids);
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
          onClick={() => show(p)}
          aria-label={
            loaded(state, p)
              ? `${p.title}, ${cal.label(p.day)} ${stamp(p.at)}`
              : `${p.video ? "Video" : "Photo"}, ${cal.label(p.day)} ${stamp(p.at)}`
          }
        >
          <Picture
            photo={p}
            seconds={clipOf(state, p)?.seconds}
            veiled={!loaded(state, p)}
          />
          {open?.bin && (
            <span className={styles.days}>{p.daysLeft ?? 30} days</span>
          )}
        </button>
      ))}
    </div>
  );

  const row = (a: Album, glyph?: string) => (
    <li key={a.name}>
      <button
        type="button"
        className={app.row}
        onClick={() => setAlbum(a.name)}
        aria-label={`${a.name}, ${a.photos.length}`}
      >
        {glyph ? (
          <RowGlyph d={glyph} />
        ) : (
          <span className={styles.albumThumb} aria-hidden="true">
            {a.photos.at(-1) && (
              <Picture
                photo={a.photos.at(-1)!}
                veiled={!loaded(state, a.photos.at(-1)!)}
              />
            )}
          </span>
        )}
        <span className={app.rowMain}>
          <span className={app.rowTitle}>{a.name}</span>
        </span>
        <span className={app.rowMeta}>{a.photos.length}</span>
        <Chevron />
      </button>
    </li>
  );

  // An album on the Collections shelf: its newest picture, big, and its name and count under it.
  const card = (name: string, photos: readonly Photo[], onOpen: () => void) => (
    // Named by the album, not by whatever its cover picture's caption says.
    <button
      key={name}
      type="button"
      className={styles.card}
      onClick={onOpen}
      aria-label={`${name}, ${photos.length}`}
    >
      <span className={styles.cardThumb} aria-hidden="true">
        {photos.at(-1) && (
          <Picture
            photo={photos.at(-1)!}
            veiled={!loaded(state, photos.at(-1)!)}
          />
        )}
      </span>
      <span className={styles.cardName}>{name}</span>
      <span className={styles.cardCount}>{photos.length}</span>
    </button>
  );

  // The Library's heading: the days it covers, as Photos gives them.
  const days = lib.recents.map((p) => cal.dayOf(p.day));
  const range = days.length
    ? `${shortDay(Math.min(...days))} – ${shortDay(Math.max(...days))}`
    : "";
  const videos = lib.recents.filter((p) => p.video).length;
  const stills = lib.recents.length - videos;

  return (
    <section className={app.view} aria-label="Photos">
      {open ? (
        <AppBar
          title={open.name}
          onBack={() => setAlbum(null)}
          backLabel="Collections"
        />
      ) : (
        <AppBar
          onBack={onBack}
          backLabel="Home"
          end={
            tab === "library" && (
              <>
                <span className={app.pill} aria-hidden="true">
                  Select
                </span>
                <span className={`${app.back} lg`} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.more}>
                    <circle cx="6" cy="12" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="18" cy="12" r="1.8" />
                  </svg>
                </span>
              </>
            )
          }
        />
      )}

      <div ref={body} className={app.body} data-tabbed={!open || undefined}>
        {open ? (
          <>
            {open.bin && (
              <p className={styles.kept}>
                Photos and videos show the days remaining before they&apos;re
                deleted.
              </p>
            )}
            {grid}
            {list.length === 0 && (
              <p className={styles.sub}>No photos or videos.</p>
            )}
          </>
        ) : tab === "library" ? (
          <>
            <h2 className={app.big}>Library</h2>
            <p className={styles.sub}>{range}</p>
            {grid}
            <p className={styles.count}>
              {stills} {stills === 1 ? "Photo" : "Photos"}
              {videos > 0 && `, ${videos} ${videos === 1 ? "Video" : "Videos"}`}
            </p>
            {/* iCloud's word, under the count, as the Library gives it. */}
            <p className={styles.synced}>
              {syncPaused(story, state)
                ? "Syncing Paused · Low Power Mode"
                : "Updated Just Now"}
            </p>
          </>
        ) : (
          <>
            <h2 className={app.big}>Collections</h2>
            <h3 className={styles.shelfTitle}>
              Albums <Chevron />
            </h3>
            <div className={styles.shelf}>
              {card("Recents", lib.recents, () => setTab("library"))}
              {albums.map((a) =>
                card(a.name, a.photos, () => setAlbum(a.name)),
              )}
            </div>
            <h3 className={styles.shelfTitle}>Utilities</h3>
            <ul className={app.group}>
              {utilities.map((a) => row(a, a.bin ? TRASH : HIDDEN))}
            </ul>
          </>
        )}
      </div>

      {!open && (
        <nav className={styles.tabs} aria-label="Photos">
          <span className={`${styles.tabGroup} lg`}>
            <button
              type="button"
              className={styles.tab}
              data-on={tab === "library" || undefined}
              onClick={() => setTab("library")}
            >
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
          <span className={`${styles.searchCircle} lg`} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m15.5 15.5 5 5" />
            </svg>
          </span>
        </nav>
      )}
      {viewer}
    </section>
  );
}
