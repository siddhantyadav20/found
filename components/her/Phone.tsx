"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { drag } from "@/components/stage/drag";
import type { AppId } from "@/content/types";
import { buzz, warmBuzz } from "@/lib/found/buzz";
import { useWakeLock } from "@/lib/found/wakeLock";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/Screen.module.css";

/* ===========================================================================
   Her phone: an iPhone in current iOS, and it behaves like one.

   This is the pilot's shell (commit c03aa03, FoundPhone/index.tsx), brought
   back for the new story after the QA pass of 2026-09-18 found the first
   rebuild had kept the look and lost the behaviour:

   - on a real phone the frame disappears and the screen *is* the viewport;
     the container query lives on `.surface`, which the stage renders
   - an app zooms out of the icon it was opened from, and back into it
   - swipe right from anywhere with a back button; swipe up from the home bar
   - pull down from the top edge for Notification Centre
   - banners arrive with the buzz, flick up to dismiss, hold to read

   Every gesture follows the finger by styling the element directly while it
   moves: re-rendering React sixty times a second would be the wrong trade.

   And one thing that is the chapter: **the blue pill around her clock.** iOS
   draws it while the screen is being shared, and it has been since Thursday.
   =========================================================================== */

export type Origin = { x: number; y: number; w: number; h: number };
export type Notice = {
  key: string;
  app: AppId;
  from: string;
  text: string;
  time?: string;
  /** Whose icon it wears, when that isn't the app it opens. */
  icon?: AppId;
  /** On a replay, its icon can be held and looked at closely (PLAYER-JOURNEY Stage 11). */
  look?: boolean;
};

const CLOSE_MS = 300;
const BACK_MS = 260;
const HOLD_MS = 450;

/** The transform that lays a full-screen layer exactly over an icon. */
function zoomOver(o: Origin, width: number, height: number) {
  const sx = o.w / width;
  const sy = o.h / height;
  return {
    translate: `${o.x - 0.5 * width * (1 - sx)}px ${o.y - 0.7 * height * (1 - sy)}px`,
    scale: `${sx} ${sy}`,
    radius: `${0.225 * width}px / ${0.225 * height}px`,
  };
}

function StatusBar({ time, battery, recording }: { time: string; battery: number; recording?: boolean }) {
  // At 4–7% a true-width fill is a hairline, so the low end is drawn generously.
  const width = Math.max(8, Math.min(100, battery < 20 ? battery * 6 : battery));
  return (
    <div className={styles.status} aria-hidden="true">
      <span className={recording ? styles.recording : undefined}>{time}</span>
      <span className={styles.statusIcons}>
        <svg viewBox="0 0 18 12" className={styles.signal}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" opacity={i < 3 ? 1 : 0.3} />
          ))}
        </svg>
        <svg viewBox="0 0 16 12" className={styles.wifi}>
          <path d="M8 11.2 5.7 8.9a3.3 3.3 0 0 1 4.6 0L8 11.2Z" />
          <path d="M3.6 6.8a6.2 6.2 0 0 1 8.8 0l-1.3 1.3a4.4 4.4 0 0 0-6.2 0L3.6 6.8Z" />
          <path d="M1.4 4.6a9.3 9.3 0 0 1 13.2 0l-1.3 1.3a7.5 7.5 0 0 0-10.6 0L1.4 4.6Z" />
        </svg>
        <span className={styles.battery} data-low={battery <= 7 || undefined}>
          <span className={styles.cell}>
            <span className={styles.fill} style={{ width: `${width}%` }} />
            <span className={styles.cellNum} data-dark={width >= 55 || undefined}>
              {battery}
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}

export default function Phone({
  time,
  day,
  battery,
  wallpaper,
  recording,
  lock,
  home,
  app,
  appKey,
  origin,
  onCloseApp,
  banner,
  onBanner,
  onDismissBanner,
  notices,
  onNotice,
  overlay,
}: {
  time: string;
  day: string;
  battery: number;
  wallpaper: string;
  recording?: boolean;
  /** The lock screen, when the phone is showing it; nothing else is drawn then. */
  lock?: ReactNode;
  home: ReactNode;
  /** The open app, or nothing. */
  app?: ReactNode;
  appKey?: string;
  /** Where the open app was opened from, so it zooms out of there. */
  origin?: Origin | null;
  onCloseApp: () => void;
  banner?: Notice | null;
  onBanner?: () => void;
  onDismissBanner?: () => void;
  notices: readonly Notice[];
  onNotice: (n: Notice) => void;
  /** Drawn over everything on the screen: the call. */
  overlay?: ReactNode;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const [shade, setShade] = useState<"closed" | "dragging" | "open">("closed");
  /* A banner held open stays open until the next one: keyed, not reset. */
  const [heldOpen, setHeldOpen] = useState<string | null>(null);
  const expanded = Boolean(banner && heldOpen === banner.key);
  const held = useRef(false);

  useWakeLock(true);
  useEffect(() => warmBuzz(), []);

  /* A banner arriving is a motor against a table before it is anything else. */
  const bannerKey = banner?.key;
  useEffect(() => {
    if (bannerKey) buzz();
  }, [bannerKey]);

  /* The zoom out of the icon is laid on as the app mounts, before paint, so
     the first frame is already sitting over the icon. */
  const [zoom, setZoom] = useState<ReturnType<typeof zoomOver> | null>(null);
  useLayoutEffect(() => {
    const el = screenRef.current;
    setZoom(appKey && origin && el ? zoomOver(origin, el.clientWidth, el.clientHeight) : null);
  }, [appKey, origin]);

  /* The open app shrinks back into the icon it came out of. */
  const closeApp = () => {
    const el = appRef.current;
    if (!el) return onCloseApp();
    const ease = `${CLOSE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    el.style.transition = `scale ${ease}, translate ${ease}, border-radius ${ease}, opacity ${CLOSE_MS}ms cubic-bezier(0.6, 0, 1, 1)`;
    const into = origin && zoomOver(origin, el.clientWidth, el.clientHeight);
    el.style.scale = into ? into.scale : "0.3";
    el.style.translate = into ? into.translate : "0 -18%";
    el.style.borderRadius = into ? into.radius : "56px";
    el.style.opacity = into ? "0.15" : "0";
    window.setTimeout(onCloseApp, CLOSE_MS - 30);
  };

  /* Swipe up from the home bar: the app shrinks toward a card as it rises,
     and past a point (or on a flick) it goes. */
  const pullHome = (e: React.PointerEvent) => {
    const el = appRef.current;
    if (!el) return;
    drag(e, {
      engage: (dx, dy) => dy < 0 && -dy > Math.abs(dx),
      move: (dx, dy) => {
        const p = Math.min(1, -dy / 360);
        el.style.transition = "none";
        el.style.scale = String(1 - p * 0.42);
        el.style.translate = `${dx * 0.25}px ${Math.min(0, dy) * 0.4}px`;
        el.style.borderRadius = `${Math.round(10 + p * 44)}px`;
      },
      end: ({ dy, vy }) => {
        if (dy < -80 || vy < -0.5) return closeApp();
        const spring = "0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1)";
        el.style.transition = `scale ${spring}, translate ${spring}, border-radius ${spring}`;
        el.style.scale = "";
        el.style.translate = "";
        el.style.borderRadius = "";
      },
    });
  };

  /* Swipe right on anything with a back button, as iOS now allows. Touch
     only — with a mouse a sideways drag is somebody selecting text — and not
     from inside a field, a photo or a sheet (`data-no-swipe`). */
  const swipeBack = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || !app) return;
    if ((e.target as Element).closest("input, textarea, [data-no-swipe]")) return;
    const backs = screenRef.current?.querySelectorAll<HTMLButtonElement>("[data-back]");
    const back = backs?.[backs.length - 1];
    const view = back?.closest("section");
    if (!back || !view) return;
    const width = view.clientWidth;
    drag(e, {
      engage: (dx, dy) => dx > 0 && dx > Math.abs(dy) * 1.3,
      move: (dx) => {
        view.style.transition = "none";
        view.style.translate = `${Math.max(0, dx)}px 0`;
        view.style.boxShadow = "-16px 0 36px rgba(0, 0, 0, 0.5)";
      },
      end: ({ dx, vx }) => {
        const go = dx > width * 0.33 || vx > 0.45;
        view.style.transition = `translate ${BACK_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
        view.style.translate = go ? `${width}px 0` : "0px 0";
        window.setTimeout(() => {
          if (go) back.click();
          view.style.transition = "";
          view.style.translate = "";
          view.style.boxShadow = "";
        }, BACK_MS);
      },
    });
  };

  /* Notification Centre comes down from the top edge with the finger. */
  const pullShade = (e: React.PointerEvent) =>
    drag(e, {
      engage: (dx, dy) => dy > 0 && dy > Math.abs(dx),
      move: (_dx, dy) => {
        setShade("dragging");
        const el = shadeRef.current;
        if (!el) return;
        el.style.transition = "none";
        el.style.translate = `0 calc(-100% + ${Math.max(0, dy)}px)`;
      },
      end: ({ dy, vy }) => {
        const el = shadeRef.current;
        if (el) {
          el.style.transition = "";
          el.style.translate = "";
        }
        setShade(dy > 90 || vy > 0.45 ? "open" : "closed");
      },
    });

  const pushShade = (e: React.PointerEvent) => {
    const el = shadeRef.current;
    if (!el) return;
    drag(e, {
      engage: (dx, dy) => dy < 0 && -dy > Math.abs(dx),
      move: (_dx, dy) => {
        el.style.transition = "none";
        el.style.translate = `0 ${Math.min(0, dy)}px`;
      },
      end: ({ dy, vy }) => {
        el.style.transition = "";
        el.style.translate = "";
        if (dy < -80 || vy < -0.45) setShade("closed");
      },
    });
  };

  /* A banner flicked up goes away; held, it opens out to the whole message. */
  const flickBanner = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    held.current = false;
    const hold = window.setTimeout(() => {
      held.current = true;
      setHeldOpen(banner?.key ?? null);
    }, HOLD_MS);
    const release = () => {
      window.clearTimeout(hold);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    drag(e, {
      engage: (dx, dy) => {
        const flick = dy < 0 && -dy > Math.abs(dx);
        if (flick) window.clearTimeout(hold);
        return flick;
      },
      move: (_dx, dy) => {
        el.style.transition = "none";
        el.style.transform = `translateY(${Math.min(0, dy)}px)`;
      },
      end: ({ dy, vy }) => {
        if (dy < -26 || vy < -0.3) {
          el.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 1, 1)";
          el.style.transform = "translateY(-160%)";
          window.setTimeout(() => onDismissBanner?.(), 220);
          return;
        }
        el.style.transition = "transform 0.3s cubic-bezier(0.2, 1.2, 0.3, 1)";
        el.style.transform = "";
      },
    });
  };

  return (
    <div className={styles.device}>
      <div
        ref={screenRef}
        className={styles.screen}
        style={{ "--wallpaper": `url(${wallpaper})` } as CSSProperties}
        onPointerDown={swipeBack}
      >
        <span className={styles.osIsland} aria-hidden="true" />
        <StatusBar time={time} battery={battery} recording={recording} />

        {lock ?? (
          <>
            {home}
            {app && (
              <div
                ref={appRef}
                key={appKey}
                className={styles.appLayer}
                data-zoom={zoom ? "" : undefined}
                style={zoom ? ({ "--zt": zoom.translate, "--zs": zoom.scale, "--zr": zoom.radius } as CSSProperties) : undefined}
              >
                {app}
              </div>
            )}
            <button type="button" className={styles.homeBar} aria-label="Home" onClick={closeApp} onPointerDown={pullHome} />

            <button
              type="button"
              className={styles.pullZone}
              aria-label="Notification Centre"
              onClick={() => setShade("open")}
              onPointerDown={pullShade}
            />
            <div
              ref={shadeRef}
              className={styles.shade}
              data-state={shade}
              role="dialog"
              aria-label="Notification Centre"
              aria-hidden={shade === "closed" || undefined}
              inert={shade === "closed"}
              onPointerDown={pushShade}
              data-no-swipe
            >
              <div className={styles.shadeHead}>
                <span className={styles.shadeDay}>{day}</span>
                <span className={styles.shadeClock}>{time}</span>
              </div>
              <p className={styles.shadeLabel}>Notification Centre</p>
              <ul className={styles.shadeList}>
                {notices.map((n) => (
                  <li key={n.key}>
                    <button
                      type="button"
                      className={styles.notice}
                      data-look={n.look || undefined}
                      onClick={() => {
                        setShade("closed");
                        onNotice(n);
                      }}
                    >
                      <span className={styles.noticeIcon}>
                        <AppGlyph app={n.icon ?? n.app} />
                      </span>
                      <span className={styles.noticeBody}>
                        <span className={styles.noticeTop}>
                          <b>{n.from}</b>
                          {n.time && <span>{n.time}</span>}
                        </span>
                        <span className={styles.noticeText}>{n.text}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className={styles.shadeClose} onClick={() => setShade("closed")} aria-label="Close Notification Centre">
                <span />
              </button>
            </div>
          </>
        )}

        {banner && (
          <button
            type="button"
            key={banner.key}
            className={styles.banner}
            data-expanded={expanded || undefined}
            onClick={() => {
              if (held.current) {
                held.current = false;
                return;
              }
              onBanner?.();
            }}
            onPointerDown={flickBanner}
          >
            <span className={styles.bannerIcon}>
              <AppGlyph app={banner.icon ?? banner.app} />
            </span>
            <span className={styles.bannerText}>
              <span className={styles.bannerFrom}>{banner.from}</span>
              <span className={styles.bannerBody}>{banner.text}</span>
              {expanded && <span className={styles.bannerHint}>Tap to open · flick up to dismiss</span>}
            </span>
            <span className={styles.bannerNow}>now</span>
          </button>
        )}

        {/* Announced the moment it lands, before anybody has to find it. */}
        <p className="sr" role="status" aria-live="polite">
          {banner ? `${banner.from}: ${banner.text}` : ""}
        </p>

        {overlay}
      </div>
    </div>
  );
}
