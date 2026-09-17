"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Cast, CallLine } from "@/content/found/types";
import { refuse } from "@/lib/found/buzz";
import { say } from "@/lib/found/voice";
import * as play from "../FoundPhone/actions";
import { drag } from "../FoundPhone/drag";
import { Chevron } from "./AppBar";
import styles from "./PhotoFrame.module.css";

/** A stable tone per photo, so placeholders are tellable apart in a grid. */
function hueOf(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/**
 * One of the phone's photographs. Until the real photograph exists (`src`),
 * the frame is a dark exposure with the description written on it.
 */
export default function PhotoFrame({ id, cast, size }: { id: string; cast: Cast; size: "thumb" | "bubble" | "full" }) {
  const ep = useStory();
  const photo = ep.photos.find((p) => p.id === id);
  if (!photo) return null;
  const alt = say(photo.alt, cast);
  return (
    // A NightCam frame is graded as the trespass camera saved it, not as the
    // photograph was taken: green night vision, over its own grain.
    <span className={styles.frame} data-size={size} data-grade={photo.album === "nightcam" ? "night" : undefined} style={{ "--hue": hueOf(id) } as CSSProperties}>
      {photo.src ? (
        <Image src={photo.src} alt={alt} fill sizes={size === "thumb" ? "140px" : "400px"} className={styles.image} />
      ) : (
        <span className={styles.pending}>{alt}</span>
      )}
      {photo.overlay && <span className={styles.overlay}>{photo.overlay}</span>}
    </span>
  );
}

/* --- The viewer's tools ------------------------------------------------------ */

function Glyph({ d, filled = false }: { d: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={filled || undefined}>
      <path d={d} />
    </svg>
  );
}

const SHARE = "M12 3.5v11M8 7.2 12 3.5l4 3.7M7.5 10.5H6.8A1.8 1.8 0 0 0 5 12.3v6.4a1.8 1.8 0 0 0 1.8 1.8h10.4a1.8 1.8 0 0 0 1.8-1.8v-6.4a1.8 1.8 0 0 0-1.8-1.8h-.7";
const HEART = "M12 19.6s-7.2-4.3-7.2-9.5A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.2 2.4c0 5.2-7.2 9.5-7.2 9.5Z";
const INFO = "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM12 11v5.2M12 7.6v.2";
const TRASH =
  "M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.9 12.2c.1 1 .9 1.8 1.9 1.8h5.4c1 0 1.8-.8 1.9-1.8l.9-12.2";
const LIVE_TEXT = "M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8.5 9.5h7M8.5 12.5h5M8.5 15.5h6";

/** Past this, what's at the edge of a zoomable photo is visible. */
const REVEAL_AT = 2.2;
/** Where a zoomable detail sits when the story doesn't say: high on the right. */
const DEFAULT_SPOT = { x: 81, y: 30 };

/** Is a point of the photo (percent) inside the visible frame at this zoom? */
function onScreen(spot: { x: number; y: number }, z: { scale: number; x: number; y: number; w: number; h: number }): boolean {
  const { w, h } = z;
  if (!w || !h) return false;
  // Transforms scale about the centre, then translate.
  const px = (spot.x / 100 - 0.5) * w * z.scale + z.x;
  const py = (spot.y / 100 - 0.5) * h * z.scale + z.y;
  // Near enough the middle that the words are readable, not just on the edge.
  const margin = 0.3;
  return Math.abs(px) <= w * margin && Math.abs(py) <= h * margin;
}
const MAX_ZOOM = 4;
const TAP_ZOOM = 3;

/**
 * Full screen, as current iOS shows a photo: a glass back button and the
 * place and time on top, the Live Text button over the picture when there's
 * text in it, and a glass toolbar underneath. In Recently Deleted the
 * toolbar is Delete and Recover, as it is on the phone.
 *
 * It isn't the player's phone, so Share and Delete refuse: a buzz, and nothing
 * leaves. The info card is where the deletion time lives. Pull the photo down
 * to put it away.
 */
export function PhotoViewer({
  id,
  cast,
  onClose,
  onRecover,
  deleted = false,
}: {
  id: string;
  cast: Cast;
  onClose: () => void;
  /** Offered in Recently Deleted. Putting a photo back is something the phone remembers doing. */
  onRecover?: () => void;
  /** Opened from Recently Deleted. */
  deleted?: boolean;
}) {
  const ep = useStory();
  const photo = ep.photos.find((p) => p.id === id);
  const [info, setInfo] = useState(false);
  const [reading, setReading] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    play.see(photo?.evidence);
  }, [photo]);

  /* Leaning in. Only a photo with something at its edge can be zoomed: pinch,
     double-tap (or double-click), or scroll. Past double size, what's there
     is there, and seeing it counts. */
  const zoomable = !!photo?.zoom;
  // The frame's size is kept with the zoom, measured when a gesture sets it.
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0, w: 0, h: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  // Close enough, and the detail itself on screen: double-tapping the wrong
  // corner of the photo finds nothing.
  const spot = photo?.zoom?.at ?? DEFAULT_SPOT;
  const revealed = zoomable && zoom.scale >= REVEAL_AT && onScreen(spot, zoom);

  useEffect(() => {
    if (revealed) play.see(photo?.zoom?.evidence);
  }, [revealed, photo]);

  const clampZoom = (scale: number, x: number, y: number) => {
    const s = Math.min(MAX_ZOOM, Math.max(1, scale));
    // Keep the photo covering its box: it can slide as far as it has grown.
    const el = frame.current;
    const fw = el?.clientWidth ?? 0;
    const fh = el?.clientHeight ?? 0;
    const w = (fw * (s - 1)) / 2;
    const h = (fh * (s - 1)) / 2;
    return { scale: s, x: Math.min(w, Math.max(-w, x)), y: Math.min(h, Math.max(-h, y)), w: fw, h: fh };
  };

  const zoomDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: zoom.scale };
    }
  };
  const zoomMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const scale = (pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, pinch.current.dist);
      setZoom((z) => clampZoom(scale, z.x, z.y));
    } else if (pointers.current.size === 1 && zoom.scale > 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setZoom((z) => clampZoom(z.scale, z.x + dx, z.y + dy));
    }
  };
  const zoomUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const zoomToggle = (e: React.MouseEvent) => {
    if (zoom.scale > 1) {
      setZoom({ scale: 1, x: 0, y: 0, w: zoom.w, h: zoom.h });
      return;
    }
    // Bring what was tapped to the middle, as far as the photo's edges allow.
    const box = e.currentTarget.getBoundingClientRect();
    const ox = e.clientX - (box.left + box.width / 2);
    const oy = e.clientY - (box.top + box.height / 2);
    setZoom(clampZoom(TAP_ZOOM, -ox * TAP_ZOOM, -oy * TAP_ZOOM));
  };
  const zoomWheel = (e: React.WheelEvent) => {
    const scale = zoom.scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002));
    setZoom((z) => clampZoom(scale, z.x, z.y));
  };

  // The photo follows the finger down and shrinks a little while the black
  // behind it thins; past a point, or on a flick, it goes.
  const pullDown = (e: React.PointerEvent) => {
    const bg = shell.current;
    const img = frame.current;
    if (!bg || !img) return;
    drag(e, {
      engage: (dx, dy) => dy > 0 && dy > Math.abs(dx),
      move: (dx, dy) => {
        const d = Math.max(0, dy);
        img.style.transition = "none";
        img.style.transform = `translate(${dx * 0.4}px, ${d}px) scale(${1 - Math.min(d / 900, 0.3)})`;
        bg.style.transition = "none";
        bg.style.backgroundColor = `rgba(0, 0, 0, ${1 - Math.min(d / 360, 0.75)})`;
      },
      end: ({ dy, vy }) => {
        if (dy > 110 || vy > 0.55) {
          onClose();
          return;
        }
        img.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.1)";
        img.style.transform = "";
        bg.style.transition = "background-color 0.3s";
        bg.style.backgroundColor = "";
      },
    });
  };

  if (!photo) return null;
  const [day, time] = photo.takenAt.split(" ");

  return (
    <div ref={shell} className={styles.viewer} data-no-swipe>
      <div className={styles.viewerBar}>
        <button type="button" className={styles.round} onClick={onClose} aria-label="Back">
          <Chevron back />
        </button>
        <span className={styles.viewerWhen}>
          <strong>{photo.place}</strong>
          <span>{photo.takenAt}</span>
        </span>
        <span />
      </div>

      <div
        ref={frame}
        className={styles.viewerImage}
        data-video={photo.video ? "" : undefined}
        onPointerDown={zoomable ? zoomDown : pullDown}
        onPointerMove={zoomable ? zoomMove : undefined}
        onPointerUp={zoomable ? zoomUp : undefined}
        onPointerCancel={zoomable ? zoomUp : undefined}
        onDoubleClick={zoomable ? zoomToggle : undefined}
        onWheel={zoomable ? zoomWheel : undefined}
      >
        {zoomable ? (
          <div
            className={styles.zoomable}
            data-zoomed={zoom.scale > 1 || undefined}
            style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}
          >
            <PhotoFrame id={id} cast={cast} size="full" />
            {/* Small, at the edge of the frame: nothing anyone would see without leaning in. */}
            <span
              className={styles.zoomReveal}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              data-on={revealed || undefined}
              aria-hidden={!revealed}
            >
              {say(photo.zoom?.reveal ?? "", cast)}
            </span>
          </div>
        ) : (
          <PhotoFrame id={id} cast={cast} size="full" />
        )}
        {/* Live Text: the phone read something in the picture. Lifted and
            outlined the way the OS does it, so it reads as found, not added. */}
        {reading && photo.liveText && <span className={styles.recognised}>{photo.liveText}</span>}
        {photo.liveText && (
          <button
            type="button"
            className={styles.liveText}
            data-on={reading || undefined}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setReading((v) => !v)}
            aria-label="Live Text"
            aria-pressed={reading}
          >
            <Glyph d={LIVE_TEXT} />
          </button>
        )}
      </div>

      {photo.video && <VideoControls key={photo.id} seconds={photo.video.seconds} captions={photo.video.captions} />}

      {info && (
        <div className={styles.info}>
          <p className={styles.infoDay}>
            {day} · {time}
          </p>
          <p className={styles.infoCam}>
            {photo.album === "camera" ? "Canon EOS R50 · via CamLink" : photo.album === "telegram" ? "Saved from Telegram" : "Main Camera — 26 mm ƒ1.6"}
          </p>
          <dl className={styles.infoList}>
            <div>
              <dt>Location</dt>
              <dd>{photo.place}</dd>
            </div>
            {photo.note && (
              <div>
                <dt>Note</dt>
                <dd className={styles.infoNote}>{photo.note}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className={styles.toolbar}>
        {deleted ? (
          <>
            <button type="button" className={styles.toolText} data-danger onClick={() => refuse()}>
              Delete
            </button>
            <button type="button" className={styles.tool} data-on={info || undefined} onClick={() => setInfo((v) => !v)} aria-label="Info">
              <Glyph d={INFO} />
            </button>
            {onRecover ? (
              <button type="button" className={styles.toolText} onClick={onRecover}>
                Recover
              </button>
            ) : (
              <span className={styles.toolText} />
            )}
          </>
        ) : (
          <>
            <button type="button" className={styles.tool} onClick={() => refuse()} aria-label="Share">
              <Glyph d={SHARE} />
            </button>
            <button
              type="button"
              className={styles.tool}
              data-on={favourite || undefined}
              onClick={() => setFavourite((v) => !v)}
              aria-label="Favourite"
              aria-pressed={favourite}
            >
              <Glyph d={HEART} filled={favourite} />
            </button>
            <button type="button" className={styles.tool} data-on={info || undefined} onClick={() => setInfo((v) => !v)} aria-label="Info">
              <Glyph d={INFO} />
            </button>
            <button type="button" className={styles.tool} onClick={() => refuse()} aria-label="Delete">
              <Glyph d={TRASH} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A video's transport and its words. Play, a scrubber, the time, and the
 * captions underneath as they're said, with who said them and the English
 * under anything that isn't. Until the footage exists, the frame is the
 * photo's placeholder and the captions are the video.
 */
function VideoControls({ seconds, captions }: { seconds: number; captions: readonly CallLine[] }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const words = useRef<HTMLOListElement>(null);
  const shown = captions.filter((l) => l.at <= elapsed && (playing || elapsed > 0));

  useEffect(() => {
    if (!playing) return;
    const began = performance.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const e = Math.min(seconds, (performance.now() - began) / 1000);
      setElapsed(e);
      if (e >= seconds) setPlaying(false);
    }, 150);
    return () => window.clearInterval(timer);
    // Restarted by play and by a scrub, not by its own ticks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seconds]);

  // The newest line stays in view.
  useEffect(() => {
    words.current?.scrollTo({ top: words.current.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div className={styles.video} onPointerDown={(e) => e.stopPropagation()}>
      <div className={styles.transport}>
        <button
          type="button"
          className={styles.videoPlay}
          onClick={() => {
            if (elapsed >= seconds) setElapsed(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5Z" />}
          </svg>
        </button>
        <span className={styles.videoTime}>{mmss(elapsed)}</span>
        <input
          type="range"
          className={styles.scrub}
          min={0}
          max={seconds}
          step={0.5}
          value={elapsed}
          onChange={(e) => setElapsed(Number(e.target.value))}
          aria-label="Position"
        />
        <span className={styles.videoTime}>{mmss(seconds)}</span>
      </div>
      <ol ref={words} className={styles.words} aria-live="polite">
        {shown.length === 0 ? (
          <li className={styles.wordsIdle}>Press play. Captions on.</li>
        ) : (
          shown.map((l) => (
            <li key={l.at} data-sound={l.text.startsWith("[") || undefined}>
              {l.who && <b>{l.who}</b>}
              {l.text}
              {l.en && <small>{l.en}</small>}
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
