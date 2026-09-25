"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { drag } from "@/components/stage/drag";
import type { AppId } from "@/content/types";
import { buzz, warmBuzz } from "@/lib/found/buzz";
import { useWakeLock } from "@/lib/found/wakeLock";
import { AppGlyph } from "./ios/icons";
import styles from "./ios/Screen.module.css";

/* ===========================================================================
   The found phone: an iPhone in current iOS, and it behaves like one.

   This is the pilot's shell (commit c03aa03, FoundPhone/index.tsx), brought
   back for the new story after the QA pass of 2026-09-18 found the first
   rebuild had kept the look and lost the behaviour:

   - on a real phone the frame disappears and the screen *is* the viewport;
     the container query lives on `.surface`, which the stage renders
   - an app zooms out of the icon it was opened from, and back into it
   - swipe right from anywhere with a back button; swipe up from the home bar
   - pull down from the top edge for Notification Centre, or from the
     top-right corner for Control Centre (airplane mode, by hand)
   - banners arrive with the buzz, flick up to dismiss, hold to read

   Every gesture follows the finger by styling the element directly while it
   moves: re-rendering React sixty times a second would be the wrong trade.

   And one thing a chapter can switch on: **the blue pill around the clock**,
   which iOS draws while the screen is being shared or recorded.
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
/** How long a banner stays before it slides away on its own. */
const BANNER_MS = 5500;
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

/** The aeroplane iOS draws for airplane mode. */
const PLANE =
  "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z";

/** Wi-Fi: three arcs, as the status bar draws them. */
const WIFI =
  "M8 11.4 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.3 6.7a6.6 6.6 0 0 1 9.4 0l-1.5 1.5a4.5 4.5 0 0 0-6.4 0zM1 4.4a9.9 9.9 0 0 1 14 0l-1.5 1.5a7.8 7.8 0 0 0-11 0z";

function StatusBar({
  time,
  battery,
  recording,
  charging,
  airplane,
  locked,
}: {
  time: string;
  battery: number;
  recording?: boolean;
  charging?: boolean;
  airplane?: boolean;
  /** On the Lock Screen the big clock tells the time, and the corner names the carrier. */
  locked?: boolean;
}) {
  // At 4–7% a true-width fill is a hairline, so the low end is drawn generously.
  const width = Math.max(8, Math.min(100, battery < 20 ? battery * 6 : battery));
  return (
    <div className={styles.status} aria-hidden="true">
      {locked && !recording ? (
        <span className={styles.carrier}>{airplane ? "" : "Jio"}</span>
      ) : (
        <span className={recording ? styles.recording : undefined}>{time}</span>
      )}
      <span className={styles.statusIcons}>
        {airplane ? (
          <svg viewBox="0 0 24 24" className={styles.plane}>
            <path d={PLANE} />
          </svg>
        ) : (
          <>
        <svg viewBox="0 0 18 12" className={styles.signal}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" opacity={i < 3 ? 1 : 0.3} />
          ))}
        </svg>
        <svg viewBox="0 0 16 12" className={styles.wifi}>
          <path d={WIFI} />
        </svg>
          </>
        )}
        <span className={styles.battery} data-low={(battery <= 7 && !charging) || undefined} data-charging={charging || undefined}>
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
  charging,
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
  airplane,
  onAirplane,
}: {
  time: string;
  day: string;
  battery: number;
  /** On the player's charger: the cell goes green and gets its bolt. */
  charging?: boolean;
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
  /** Drawn over everything on the screen. */
  overlay?: ReactNode;
  /** Airplane mode, and turning it on by hand in Control Centre. It doesn't go back off. */
  airplane?: boolean;
  onAirplane?: () => void;
}) {
  const [control, setControl] = useState(false);
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

  /* And then it goes, the way iOS banners do, unless it's being held open. */
  useEffect(() => {
    if (!bannerKey || expanded) return undefined;
    const t = window.setTimeout(() => onDismissBanner?.(), BANNER_MS);
    return () => window.clearTimeout(t);
  }, [bannerKey, expanded, onDismissBanner]);

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
        <StatusBar time={time} battery={battery} recording={recording} charging={charging} airplane={airplane} locked={Boolean(lock)} />

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
            {/* The top-right corner is Control Centre's, as on every iPhone without a home button. */}
            <button
              type="button"
              className={styles.controlZone}
              aria-label="Control Centre"
              onClick={() => setControl(true)}
              onPointerDown={(e) =>
                drag(e, {
                  engage: (dx, dy) => dy > 0 && dy > Math.abs(dx),
                  move: () => {},
                  end: ({ dy, vy }) => (dy > 50 || vy > 0.4) && setControl(true),
                })
              }
            />
            <div
              className={styles.control}
              data-open={control || undefined}
              role="dialog"
              aria-label="Control Centre"
              aria-hidden={!control || undefined}
              inert={!control}
              data-no-swipe
              onClick={(e) => e.target === e.currentTarget && setControl(false)}
            >
              {/* iOS 26's Control Centre, its default page. Only the connectivity
                  module answers here; the rest is the furniture of a real one. */}
              <div className={styles.ccGrid}>
                <div className={`${styles.ccModule} ${styles.ccConnect} lg`}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(airplane)}
                    aria-label="Airplane Mode"
                    className={styles.ccRound}
                    data-on={airplane || undefined}
                    data-tone="orange"
                    onClick={() => !airplane && onAirplane?.()}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={PLANE} />
                    </svg>
                  </button>
                  <span className={styles.ccRound} data-on={!airplane || undefined} data-tone="green" aria-label={airplane ? "Mobile data off" : "Mobile data on"} role="img">
                    <svg viewBox="0 0 18 12" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" />
                      ))}
                    </svg>
                  </span>
                  <span className={styles.ccRound} data-on={!airplane || undefined} data-tone="blue" aria-label={airplane ? "Wi-Fi off" : "Wi-Fi on"} role="img">
                    <svg viewBox="0 0 16 12" aria-hidden="true">
                      <path d={WIFI} />
                    </svg>
                  </span>
                  <span className={styles.ccRound} data-on data-tone="blue" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className={styles.ccStroke}>
                      <path d="m6.5 7.5 11 9-5.5 5V2.5l5.5 5-11 9" />
                    </svg>
                  </span>
                </div>
                <div className={`${styles.ccModule} ${styles.ccMedia} lg`} aria-hidden="true">
                  <span className={styles.ccMediaTitle}>Not Playing</span>
                  <span className={styles.ccMediaKeys}>
                    <svg viewBox="0 0 24 24"><path d="M11 12 20 6v12zM3 12l9-6v12z" /></svg>
                    <svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" /></svg>
                    <svg viewBox="0 0 24 24"><path d="m13 12-9 6V6zm8 0-9 6V6z" /></svg>
                  </span>
                </div>
                <span className={`${styles.ccModule} ${styles.ccSmall} lg`} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.ccStroke}>
                    <path d="M20 12a8 8 0 1 1-2.3-5.7M20 3.5v4h-4" />
                    <rect x="9.2" y="11" width="5.6" height="4.6" rx="1" fill="currentColor" stroke="none" />
                    <path d="M10.3 11V9.6a1.7 1.7 0 0 1 3.4 0V11" />
                  </svg>
                </span>
                <span className={`${styles.ccModule} ${styles.ccSmall} lg`} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.ccStroke}>
                    <rect x="2.5" y="4" width="13" height="10" rx="2" />
                    <rect x="8.5" y="10" width="13" height="10" rx="2" />
                  </svg>
                </span>
                <span className={`${styles.ccModule} ${styles.ccSlider} lg`} style={{ "--level": "58%" } as CSSProperties} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.ccStroke}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
                  </svg>
                </span>
                <span className={`${styles.ccModule} ${styles.ccSlider} lg`} style={{ "--level": "40%" } as CSSProperties} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3.5 9h4l5-4.5v15l-5-4.5h-4z" />
                    <path d="M16 8.5a5 5 0 0 1 0 7M18.8 5.8a9 9 0 0 1 0 12.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className={`${styles.ccModule} ${styles.ccFocus} lg`} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" /></svg>
                  Focus
                </span>
                {[
                  <path key="t" d="M9 2.5h6v3.5l-1.5 2.5V20a1.5 1.5 0 0 1-1.5 1.5h0a1.5 1.5 0 0 1-1.5-1.5V8.5L9 6z" />,
                  <g key="m" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="13.5" r="7.5" />
                    <path d="M12 13.5V9.5M10 2.8h4" />
                  </g>,
                  <g key="c">
                    <rect x="5" y="2.5" width="14" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <rect x="8" y="5.5" width="8" height="3" rx="0.8" />
                    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={8.8 + c * 3.2} cy={12.2 + r * 3.1} r="1" />))}
                  </g>,
                  <path key="k" d="M9 4.5 7.8 6.5H5A2.5 2.5 0 0 0 2.5 9v8.5A2.5 2.5 0 0 0 5 20h14a2.5 2.5 0 0 0 2.5-2.5V9A2.5 2.5 0 0 0 19 6.5h-2.8L15 4.5zM12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />,
                ].map((g) => (
                  <span key={g.key} className={`${styles.ccModule} ${styles.ccSmall} lg`} aria-hidden="true">
                    <svg viewBox="0 0 24 24">{g}</svg>
                  </span>
                ))}
              </div>
              <p className={styles.controlNote}>{airplane ? "Airplane Mode. Nothing can reach this phone." : "Tap outside to close."}</p>
            </div>
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
                      className={`${styles.notice} lg-thick`}
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
            className={`${styles.banner} lg-thick`}
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
