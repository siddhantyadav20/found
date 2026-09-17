"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, ViewTransition } from "react";

import { useCase } from "@/components/found/StoryContext";
import type { AppId, LiveEvent, Story } from "@/content/found/types";
import { useMounted } from "@/lib/clientValue";
import { buzz, warmBuzz } from "@/lib/found/buzz";
import { dropLabel } from "@/lib/found/dropName";
import { battery, clockNow, dayNow, dueEvents, has, sessionVars, stage, stamp, type CaseState } from "@/lib/found/engine";
import { badgesOf, nextNudge } from "@/lib/found/guide";
import { wasAway } from "@/lib/found/keeping";
import { enterFullscreen } from "@/lib/found/platform";
import { useLargerText } from "@/lib/found/prefs";
import { progressServerSide, readProgress, subscribeProgress } from "@/lib/found/progress";
import { say } from "@/lib/found/voice";
import { useWakeLock } from "@/lib/found/wakeLock";

import Calculator from "../apps/Calculator";
import Food from "../apps/Food";
import Guardian from "../apps/Guardian";
import Health from "../apps/Health";
import Maps from "../apps/Maps";
import Memos from "../apps/Memos";
import Messages from "../apps/Messages";
import Chats from "../apps/Chats";
import News from "../apps/News";
import NightCam from "../apps/NightCam";
import Notes from "../apps/Notes";
import PhoneApp from "../apps/PhoneApp";
import Photos from "../apps/Photos";
import Settings from "../apps/Settings";
import SettingsList from "../apps/SettingsList";
import type { Nav } from "../apps/types";
import * as play from "./actions";
import Call from "./Call";
import Charge from "./Charge";
import { drag } from "./drag";
import EndCard from "./EndCard";
import Ending from "./Ending";
import Envelope from "./Envelope";
import Home from "./Home";
import { AppGlyph } from "./icons";
import LockScreen from "./LockScreen";
import styles from "./FoundPhone.module.css";
import toastStyles from "./Toast.module.css";

type Route = { app: AppId | "home"; arg?: string };
type Notice = { from: string; text: string; app: AppId; arg?: string };
type Banner = Notice & { key: number };
/** A box on the screen, relative to the screen: where an app was opened from. */
type Origin = { x: number; y: number; w: number; h: number };
/** An app layer laid over that box: the CSS values for zooming out of it or into it. */
type Zoom = { translate: string; scale: string; radius: string };

/** How long after the moment a live message waits before it arrives. Long
 *  enough to feel like someone typing; the big beats wait longer. */
const EVENT_DELAY: Record<string, number> = {
  "cliff-you": 2600,
  "cliff-voice-photo": 5200,
  "cliff-voice-read": 5200,
  "e2-open-notes": 2200,
  "e2-3107-sorry": 3400,
  "e2-letterbox": 3600,
  "e2-known": 3200,
  "e2-last": 2600,
  "e3-sync": 1800,
  "e3-stop": 3000,
  "e3-3107-guard": 3400,
  "e3-k-coming": 3200,
  "e3-k-stairs": 3200,
  "e3-3107-police": 4200,
  "e3-k-outside": 4600,
  // The phone rings a long beat after "Bring it down", time enough to read it.
  "e3-ring": 7000,
};
const DEFAULT_DELAY = 2400;
const BANNER_MS = 5200;
/** From the last text to the screen going dark, then the dark itself. */
const POWER_OFF_AFTER = 7500;
const DYING_MS = 3400;
/** From the player finding their own Wi-Fi to Episode 2's end card. */
const EPISODE_END_AFTER = 6000;
/** An app shrinking back into the home screen; a page sliding away after a swipe back. */
const CLOSE_MS = 300;
const BACK_MS = 260;
/** Holding a banner this long opens it out to the whole message. */
const HOLD_MS = 450;

/**
 * The transform that lays a full-screen app layer exactly over `o`, worked out
 * about the layer's own transform origin (50% 70%, in the CSS), so a layer
 * already shrinking under the finger carries on into the icon without a jump.
 * The corner radius is set per axis so it reads as the icon's own corner once
 * scaled.
 */
function zoomOver(o: Origin, width: number, height: number): Zoom {
  const sx = o.w / width;
  const sy = o.h / height;
  return {
    translate: `${o.x - 0.5 * width * (1 - sx)}px ${o.y - 0.7 * height * (1 - sy)}px`,
    scale: `${sx} ${sy}`,
    radius: `${0.225 * width}px / ${0.225 * height}px`,
  };
}

/** What a live event shows as a notification, if anything: a text in a thread, or an app's own alert. */
function noticeOf(ep: Story, s: CaseState, e: LiveEvent): Notice | null {
  const vars = sessionVars(ep, s);
  const thread = e.thread ? ep.threads.find((t) => t.id === e.thread) : undefined;
  if (thread) {
    const first = e.messages.find((m) => m.text) ?? e.messages[0];
    return {
      from: s.names[thread.id] ?? thread.notifyAs ?? thread.contact,
      text: first?.text ? say(first.text, s.cast, vars) : "Photo",
      app: thread.app ?? "messages",
      arg: thread.id,
    };
  }
  if (e.banner) {
    const app: AppId = e.bannerApp ?? (e.id === "e2-nightcam" ? "nightcam" : e.id === "e2-vault" ? "calculator" : "maps");
    return { from: e.bannerFrom ?? BANNER_FROM[app] ?? "Maps", text: say(e.banner, s.cast, vars), app };
  }
  return null;
}

/**
 * Notification Centre's list, newest first: everything that arrived while the
 * player had the phone, then what was already on the lock screen when it
 * came. Rebuilt from the save, so it's all still there after a reload.
 */
function noticesOf(ep: Story, s: CaseState): (Notice & { key: string; time: string })[] {
  const arrived: (Notice & { key: string; time: string })[] = [];
  for (const f of s.flags) {
    if (!f.startsWith("fired:")) continue;
    const e = ep.events.find((x) => `fired:${x.id}` === f);
    const n = e && noticeOf(ep, s, e);
    if (!n) continue;
    const at = s.at[f];
    arrived.push({ ...n, key: f, time: at === undefined ? "" : (stamp(s, at, ep.clocks).split(" ")[1] ?? "") });
  }
  const waiting = ep.lockscreen.notifications.map((n) => ({
    from: n.from,
    text: say(n.text, s.cast),
    app: (n.from === "City Desk" ? "news" : "messages") as AppId,
    key: `lock:${n.from}:${n.text}`,
    time: "",
  }));
  return [...arrived.reverse(), ...waiting];
}

/** What piled up while the phone was dead, for the banner that says so. */
const backlogOf = (ep: Story): number =>
  ep.threads.reduce((n, t) => n + t.messages.filter((m) => m.requires?.length === 1 && m.requires[0] === "ep:2").length, 0) +
  ep.headlines.filter((h) => h.requires?.length === 1 && h.requires[0] === "ep:2").length;

/** Who a system banner is from, when it belongs to an app rather than a person. */
const BANNER_FROM: Partial<Record<AppId, string>> = {
  maps: "Maps",
  nightcam: "NightCam",
  calculator: "Calculator",
  notes: "Case file",
  phone: "Phone",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  recorder: "Recorder",
  files: "Files",
  guardian: "Guardian",
  news: "City Desk",
  settings: "Settings",
};

/** Stuck this long with something open, and the phone offers the next hint unasked. */
const NUDGE_AFTER = 45_000;
/** How long "Added to case file" stays up. Matches Toast.module.css. */
const TOAST_MS = 2200;

/** Whether this page load has already reported a returning player, and an arrival. */
let resumeCounted = false;
let arrivalCounted = false;
/** Whether this page load came back to a case after a while (`?away=1` in dev), and has said so. */
let awayFrom = false;
let awayShown = false;
/** From the phone's screen coming on to "While you were away". */
const AWAY_BANNER_AFTER = 1400;

/**
 * The phone, the room it's in, and the order things happen.
 *
 * Owns only what the screen is doing right now: which app is open, which
 * banner is showing, which threads have something new, and how long each app
 * has been on screen (Guardian counts it, so the story can too). Everything
 * about the case itself is in the progress store and changes through
 * `./actions`. What the screen shows is the story's current stage.
 *
 * It also owns the phone's gestures, the ones that belong to the OS rather
 * than an app: swipe up from the home bar to go home, swipe a screen right to
 * go back, flick a banner away.
 */
export default function FoundPhone() {
  const { story: ep, meta, to } = useCase();
  const backlog = useMemo(() => backlogOf(ep), [ep]);
  const mounted = useMounted();
  const s = useSyncExternalStore(subscribeProgress, readProgress, progressServerSide);
  const [route, setRoute] = useState<Route>({ app: "home" });
  const [banner, setBanner] = useState<Banner | null>(null);
  const [unread, setUnread] = useState<ReadonlySet<string>>(() => new Set());
  const [dying, setDying] = useState(false);
  const [now, setNow] = useState(0);
  const bannerKey = useRef(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  // Where the open app came from (an icon, the widget): it zooms out of
  // there, and shrinks back into it.
  const origin = useRef<Origin | null>(null);
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const [shade, setShade] = useState<"closed" | "dragging" | "open">("closed");
  const shadeRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const held = useRef(false);
  const large = useLargerText();

  // The recorded buzz, decoded before the first text needs it.
  useEffect(() => warmBuzz(), []);

  // Counted once per page load, and only for a case that was already open.
  // The module flag, not the effect, is what makes it once: Strict Mode and
  // Fast Refresh both run mount effects again.
  useEffect(() => {
    const saved = readProgress();
    if (resumeCounted || !saved) return;
    resumeCounted = true;
    // Read before anything this visit touches the save.
    awayFrom =
      wasAway(saved, Date.now()) ||
      (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("away") === "1");
    play.resumed();
  }, []);

  // A passed-on link, opened. Once per page load, played before or not.
  useEffect(() => {
    if (arrivalCounted) return;
    arrivalCounted = true;
    play.arrived();
  }, []);

  // The envelope really is what should show (a reset, or a save that couldn't
  // be read), so SaveScript's "a phone is coming" no longer holds. Let it paint.
  useEffect(() => {
    if (mounted && !s) document.documentElement.removeAttribute("data-found-save");
  }, [mounted, s]);

  // The status bar's clock moves with the story's.
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 20_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const nav: Nav = useMemo(
    () => ({
      go: (app, arg, from) => {
        const screen = screenRef.current?.getBoundingClientRect();
        const o = from && screen ? { x: from.left - screen.left, y: from.top - screen.top, w: from.width, h: from.height } : null;
        origin.current = o;
        setZoom(o && screen ? zoomOver(o, screen.width, screen.height) : null);
        setRoute({ app, arg });
        setBanner(null);
        setShade("closed");
      },
      home: () => setRoute({ app: "home" }),
    }),
    [],
  );

  /* --- Gestures ---------------------------------------------------------------
     Each one follows the finger, then either lets go or springs back. The
     moving element is styled directly while the finger is down: a gesture
     re-rendering React sixty times a second would be the wrong trade. */

  // The open app shrinks back into the icon it came out of, over the home
  // screen that's been underneath it all along. Opened from a banner or from
  // another app, it has no icon to go back to, and shrinks toward the middle.
  const closeApp = () => {
    const el = appRef.current;
    if (!el) {
      setRoute({ app: "home" });
      return;
    }
    const ease = `${CLOSE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    el.style.transition = `scale ${ease}, translate ${ease}, border-radius ${ease}, opacity ${CLOSE_MS}ms cubic-bezier(0.6, 0, 1, 1)`;
    const into = origin.current && zoomOver(origin.current, el.clientWidth, el.clientHeight);
    el.style.scale = into ? into.scale : "0.3";
    el.style.translate = into ? into.translate : "0 -18%";
    el.style.borderRadius = into ? into.radius : "56px";
    el.style.opacity = into ? "0.15" : "0";
    window.setTimeout(() => setRoute({ app: "home" }), CLOSE_MS - 30);
  };

  // Notification Centre comes down from the top edge with the finger, and
  // stays if it came far enough (or was flicked).
  const pullShade = (e: React.PointerEvent) => {
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
  };

  // And goes back up the same way.
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

  // Swipe up from the home bar: the app shrinks toward a card as it rises,
  // and past a point (or on a flick) it goes.
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
        if (dy < -80 || vy < -0.5) {
          closeApp();
          return;
        }
        const spring = "0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1)";
        el.style.transition = `scale ${spring}, translate ${spring}, border-radius ${spring}`;
        el.style.scale = "";
        el.style.translate = "";
        el.style.borderRadius = "";
      },
    });
  };

  // Swipe right anywhere on a screen that has a back button, as iOS now
  // lets you: the screen follows the finger and lets go past a third. Touch
  // only, because with a mouse a sideways drag is someone selecting text;
  // and not from inside a field, a photo or a sheet (`data-no-swipe`).
  const swipeBack = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || route.app === "home") return;
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

  // A banner flicked up goes away without opening anything; held, it opens out
  // to the whole message and stays. `transform`, because its arrival animation
  // owns `translate`.
  const flickBanner = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    held.current = false;
    const hold = window.setTimeout(() => {
      held.current = true;
      setExpanded(true);
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
          window.setTimeout(() => setBanner(null), 220);
          return;
        }
        el.style.transition = "transform 0.3s cubic-bezier(0.2, 1.2, 0.3, 1)";
        el.style.transform = "";
      },
    });
  };

  // Time in each app, for Mum's report: counted from open to close, a pickup
  // each time one opens.
  useEffect(() => {
    if (route.app === "home") return;
    const app = route.app;
    const since = Date.now();
    play.openApp();
    return () => play.logUsage(app, Date.now() - since);
  }, [route.app]);

  const markRead = useCallback((thread: string) => {
    setUnread((u) => {
      if (!u.has(thread)) return u;
      const next = new Set(u);
      next.delete(thread);
      return next;
    });
  }, []);

  const showBanner = useCallback((b: Notice) => {
    bannerKey.current += 1;
    setExpanded(false);
    setBanner({ ...b, key: bannerKey.current });
  }, []);

  const notices = useMemo(() => (s ? noticesOf(ep, s) : []), [ep, s]);

  // What each app is carrying that hasn't been looked at, plus whatever
  // arrived in Messages while the player was elsewhere. Ten identical icons
  // become a lit path, which is most of the answer to "what do I do now".
  const badges = useMemo(() => {
    if (!s) return {};
    const b = { ...badgesOf(ep, s) };
    // Unread chats count on the app they arrived in.
    for (const id of unread) {
      const app = ep.threads.find((t) => t.id === id)?.app ?? "messages";
      b[app] = (b[app] ?? 0) + 1;
    }
    return b;
  }, [ep, s, unread]);

  /* Live events, one at a time, each after a beat. Whatever is due fires in
     script order; the next one is scheduled when the state changes again. */
  // Nothing arrives on a phone that's dead, charging from dead, or dying:
  // events wait until the screen is on again.
  const screenNow = s ? stage(ep, s).screen : null;
  const quiet = dying || screenNow === "charge" || screenNow === "end" || screenNow === "call" || screenNow === "ending";
  const due = s && !quiet ? dueEvents(ep, s)[0] : undefined;
  useEffect(() => {
    if (!due) return;
    const timer = window.setTimeout(() => {
      const cur = readProgress();
      if (!cur) return;
      play.fire(due.id);
      if (due.effect === "open-notes") {
        setRoute({ app: "notes" });
        return;
      }
      const n = noticeOf(ep, cur, due);
      if (!n) return;
      buzz();
      const thread = n.app === "messages" || n.app === "whatsapp" || n.app === "telegram" ? n.arg : undefined;
      if (thread) setUnread((u) => new Set(u).add(thread));
      showBanner(n);
    }, due.delay ?? EVENT_DELAY[due.id] ?? DEFAULT_DELAY);
    return () => window.clearTimeout(timer);
  }, [due, showBanner, ep]);

  // A banner goes on its own, unless it's been held open.
  useEffect(() => {
    if (!banner || expanded) return;
    const timer = window.setTimeout(() => setBanner(null), BANNER_MS);
    return () => window.clearTimeout(timer);
  }, [banner, expanded]);

  /* Episode 2 opens on three days of backlog: say so once, as it lands. */
  const unlocked2 = !!s && has(s, "did:unlock-2");
  const announced = useRef(false);
  useEffect(() => {
    if (!unlocked2 || announced.current) return;
    announced.current = true;
    const timer = window.setTimeout(() => {
      buzz();
      showBanner({ from: "While it was off", text: `${backlog} notifications`, app: "messages" });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [unlocked2, showBanner, backlog]);

  /* Back after a while: once the phone is unlocked, and after anything that
     was already due has arrived (so it isn't talked over), the case file
     offers the case so far. Once per page load. */
  useEffect(() => {
    if (awayShown || !awayFrom || screenNow !== "phone" || due) return;
    const timer = window.setTimeout(() => {
      awayShown = true;
      buzz();
      showBanner({ from: "Case file", text: "While you were away: here's the case so far.", app: "notes", arg: "so-far" });
    }, AWAY_BANNER_AFTER);
    return () => window.clearTimeout(timer);
  }, [screenNow, showBanner, due]);

  /* Everything found is worth saying out loud: opening things is progress,
     and until now nothing on screen said so. */
  const found = s ? s.flags.filter((f) => f.startsWith("seen:")).length : 0;
  const [toast, setToast] = useState<{ n: number; key: number } | null>(null);
  const lastFound = useRef(found);
  useEffect(() => {
    if (found <= lastFound.current) {
      lastFound.current = found;
      return;
    }
    lastFound.current = found;
    const show = window.setTimeout(() => setToast({ n: found, key: Date.now() }), 0);
    const hide = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [found]);

  /* Stuck: rather than hiding help behind a button in an app they haven't
     found, the phone buzzes and offers the next rung of the ladder. The timer
     restarts whenever the player gets anywhere. */
  useEffect(() => {
    if (!s || screenNow !== "phone" || banner) return;
    const timer = window.setTimeout(() => {
      const cur = readProgress();
      const next = cur && nextNudge(ep, cur);
      if (!cur || !next) return;
      play.nudge(next.id);
      buzz();
      showBanner({ from: "Case file", text: say(next.text, cur.cast, sessionVars(ep, cur)), app: "notes" });
    }, NUDGE_AFTER);
    return () => window.clearTimeout(timer);
  }, [ep, s, screenNow, banner, showBanner]);

  // The screen stays on while there's a case in hand: not on the envelope,
  // and not on an end card.
  useWakeLock(!!s && screenNow !== "end");

  const clocks = ep.clocks;

  /* The end of Episode 1: the last text lands, the phone holds, then the
     battery goes. Re-armed on a reload that lands in between. */
  const lastWords = !!s && (has(s, "fired:cliff-voice-photo") || has(s, "fired:cliff-voice-read")) && !has(s, "dead");
  useEffect(() => {
    if (!lastWords) return;
    const timer = window.setTimeout(() => setDying(true), POWER_OFF_AFTER);
    return () => window.clearTimeout(timer);
  }, [lastWords]);

  useEffect(() => {
    if (!dying) return;
    const timer = window.setTimeout(() => {
      play.die();
      setDying(false);
    }, DYING_MS);
    return () => window.clearTimeout(timer);
  }, [dying]);

  /* The end of Episode 2: their own network, a long beat, then the end card. */
  const thanked = !!s && has(s, "fired:e2-last") && !has(s, "ep:2-done");
  useEffect(() => {
    if (!thanked) return;
    const timer = window.setTimeout(() => play.perform("finish-ep2"), EPISODE_END_AFTER);
    return () => window.clearTimeout(timer);
  }, [thanked]);

  // Escape goes home. Anything held with ⌘/Ctrl belongs to the site (⌘K).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (e.key !== "Escape") return;
      setShade("closed");
      setRoute({ app: "home" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const st = s ? stage(ep, s) : null;
  let body: React.ReactNode = null;

  // No save: the envelope, on the server too, so the hook paints before any
  // JavaScript arrives. A returning player's save only exists in the browser;
  // SaveScript keeps the envelope from flashing up before their phone does.
  if (!s) {
    const open = () => {
      enterFullscreen();
      play.start();
    };
    body = <Envelope onOpen={open} label={dropLabel(to ?? "", ep.envelope.label)} />;
  }
  else if (mounted && s && st?.screen === "end") body = <EndCard state={s} episode={st.episode} onReplay={play.reset} />;
  else if (mounted && s && st) {
    const charging = st.episode >= 2;
    body = (
      // The phone on the desk, picked up: it morphs into this one.
      <ViewTransition name="found-phone" share="morph" default="none">
      <div className={styles.device}>
        <div
          ref={screenRef}
          className={styles.screen}
          style={{ "--wallpaper": `url(${meta.wallpaper})` } as React.CSSProperties}
          data-large-text={large || undefined}
          onPointerDown={swipeBack}
        >
          <span className={styles.osIsland} aria-hidden="true" />
          {st.screen === "charge" ? (
            <Charge onPlug={() => play.perform("plug")} />
          ) : st.screen === "call" ? (
            <Call key={st.call ?? "call"} state={s} scripted={st.call ? ep.calls?.find((c) => c.id === st.call) : undefined} />
          ) : st.screen === "ending" ? (
            <Ending state={s} />
          ) : (
            <>
              <StatusBar
                percent={battery(ep, s)}
                clock={clockNow(s, now, clocks)}
                charging={charging}
                wifi={has(s, "did:wifi-on")}
                bars={charging ? 3 : 2}
              />
              {st.screen === "lock" || st.screen === "relock" ? (
                <LockScreen
                  state={s}
                  mode={st.screen === "relock" ? "restart" : ep.opensWith === "swipe" ? "open" : "first"}
                  clock={clockNow(s, now, clocks)}
                  day={dayNow(s, clocks)}
                  // Only what has arrived: a phone nobody locked has nothing waiting on it but that.
                  arrived={notices.filter((n) => n.key.startsWith("fired:"))}
                />
              ) : (
                <>
                  {/* Home stays underneath an open app, the way it does on a
                      phone: pulling the app away shows it. */}
                  <Home state={s} nav={nav} badges={badges} covered={route.app !== "home"} />
                  {route.app !== "home" && (
                    <div
                      ref={appRef}
                      className={styles.appLayer}
                      data-zoom={zoom ? "" : undefined}
                      style={zoom ? ({ "--zt": zoom.translate, "--zs": zoom.scale, "--zr": zoom.radius } as React.CSSProperties) : undefined}
                    >
                      <App
                        key={`${route.app}:${route.arg ?? ""}`}
                        route={route}
                        state={s}
                        nav={nav}
                        unread={unread}
                        markRead={markRead}
                      />
                    </div>
                  )}
                  <button type="button" className={styles.homeBar} aria-label="Home" onClick={closeApp} onPointerDown={pullHome} />

                  {/* The top edge: pull down (or tap) for Notification Centre. */}
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
                      <span className={styles.shadeDay}>{dayNow(s, clocks)}</span>
                      <span className={styles.shadeClock}>{clockNow(s, now, clocks)}</span>
                    </div>
                    <p className={styles.shadeLabel}>Notification Centre</p>
                    <ul className={styles.shadeList}>
                      {notices.map((n) => (
                        <li key={n.key}>
                          <button type="button" className={styles.notice} onClick={() => nav.go(n.app, n.arg)}>
                            <span className={styles.noticeIcon}>
                              <AppGlyph app={n.app} />
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
            </>
          )}
          {banner && (
            <button
              type="button"
              key={banner.key}
              className={styles.banner}
              data-expanded={expanded || undefined}
              onClick={() => {
                // The click that ends a long press only opens the banner out.
                if (held.current) {
                  held.current = false;
                  return;
                }
                nav.go(banner.app, banner.arg);
              }}
              onPointerDown={flickBanner}
              aria-live="polite"
            >
              <span className={styles.bannerIcon}>
                <AppGlyph app={banner.app} />
              </span>
              <span className={styles.bannerText}>
                <span className={styles.bannerFrom}>{banner.from}</span>
                <span className={styles.bannerBody}>{banner.text}</span>
                {expanded && <span className={styles.bannerHint}>Tap to open · flick up to dismiss</span>}
              </span>
              <span className={styles.bannerNow}>now</span>
            </button>
          )}
          {toast && (
            <div key={toast.key} className={toastStyles.toast} role="status">
              Added to case file · <span className={toastStyles.count}>{toast.n} found</span>
            </div>
          )}
          {dying && (
            <div className={styles.powerOff} role="status">
              <div className={styles.dying}>
                <span className={styles.bigCell} />
                <span>0%</span>
              </div>
              {/* The last thing the phone does before it dies: tells Mum. */}
              <p className={styles.sting}>{ep.guardian.sting}</p>
            </div>
          )}
        </div>
      </div>
      </ViewTransition>
    );
  }

  return (
    <div className={styles.surface} data-cursor="native">
      <h1 className={styles.hidden}>
        {meta.title}: {meta.hint}
      </h1>
      {body}
    </div>
  );
}

/** The phone's status bar: the clock, the signal, Wi-Fi once it's on, and
 *  the battery with its number inside, the way the phone draws it now. */
function StatusBar({
  percent,
  clock,
  charging,
  wifi,
  bars,
}: {
  percent: number;
  clock: string;
  charging: boolean;
  wifi: boolean;
  bars: number;
}) {
  // At 1–4% a true-width fill is a hairline; Episode 1 draws it generously.
  const width = Math.max(8, Math.min(100, charging ? percent : percent * 6));
  return (
    <div className={styles.status} aria-hidden="true">
      <span>{clock}</span>
      <span className={styles.statusIcons}>
        <svg viewBox="0 0 18 12" className={styles.signal}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" opacity={i < bars ? 1 : 0.3} />
          ))}
        </svg>
        {wifi && (
          <svg viewBox="0 0 16 12" className={styles.wifi}>
            <path d="M8 11.2 5.7 8.9a3.3 3.3 0 0 1 4.6 0L8 11.2Z" />
            <path d="M3.6 6.8a6.2 6.2 0 0 1 8.8 0l-1.3 1.3a4.4 4.4 0 0 0-6.2 0L3.6 6.8Z" />
            <path d="M1.4 4.6a9.3 9.3 0 0 1 13.2 0l-1.3 1.3a7.5 7.5 0 0 0-10.6 0L1.4 4.6Z" />
          </svg>
        )}
        <span
          className={styles.battery}
          data-low={(!charging && percent <= 2) || undefined}
          data-charging={charging || undefined}
        >
          <span className={styles.cell}>
            <span className={styles.fill} style={{ width: `${width}%` }} />
            {/* Dark digits once the level is under them, as the phone does. */}
            <span className={styles.cellNum} data-dark={width >= 55 || undefined}>
              {percent}
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}

function App({
  route,
  state,
  nav,
  unread,
  markRead,
}: {
  route: Route;
  state: CaseState;
  nav: Nav;
  unread: ReadonlySet<string>;
  markRead: (thread: string) => void;
}) {
  const props = { state, nav, arg: route.arg };
  switch (route.app) {
    case "messages":
      return <Messages {...props} unread={unread} onRead={markRead} />;
    case "photos":
      return <Photos {...props} />;
    case "calculator":
      return <Calculator {...props} />;
    case "health":
      return <Health />;
    case "settings":
      return <SettingsFor {...props} />;
    case "whatsapp":
    case "telegram":
      return <Chats {...props} app={route.app} unread={unread} onRead={markRead} />;
    case "phone":
      return <PhoneApp {...props} />;
    case "maps":
      return <Maps {...props} />;
    case "memos":
      return <Memos />;
    case "notes":
      return <Notes {...props} />;
    case "guardian":
      return <Guardian {...props} />;
    case "nightcam":
      return <NightCam {...props} />;
    case "news":
      return <News {...props} />;
    case "food":
      return <Food {...props} />;
    default:
      return null;
  }
}

/** A story that writes its settings as data gets them as rows; Low Battery keeps its own Settings. */
function SettingsFor(props: React.ComponentProps<typeof Settings>) {
  const { story } = useCase();
  return story.settings ? <SettingsList {...props} /> : <Settings {...props} />;
}
