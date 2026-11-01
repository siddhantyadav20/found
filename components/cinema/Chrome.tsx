"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

import Cursor from "./Cursor";
import { ENTERED_EVENT } from "./entered";
import { playIntro } from "./intro";
import Nav from "./Nav";
import { onFrame } from "./scroll";
import Shapes from "./Shapes";
import styles from "./Chrome.module.css";

/* ===========================================================================
   Everything that stays while the pages change (2026-10-31): the design's
   tokens, the nav, the cursor, and the page's fade. A link fades the page out
   for .2s and only then moves, and the new page comes in through the same CSS
   that brought the first one in from behind the preloader. Arriving home from
   inside the site puts the logo and the ticket back too, so that the home page
   opens the same way every time it's visited, not only on a reload.
   =========================================================================== */

type Route = "home" | "chapters" | "chapter" | "contact" | "page";

function routeOf(pathname: string): Route {
  if (pathname === "/") return "home";
  if (pathname === "/chapters") return "chapters";
  if (pathname.startsWith("/chapters/")) return "chapter";
  if (pathname === "/contact") return "contact";
  return "page";
}

const Fade = createContext<(href: string) => void>(() => {});

/** Go somewhere the way the site goes: page out first, then the route. */
export const useGo = () => useContext(Fade);

/** A `next/link` that leaves through the fade. Modified clicks stay the browser's. */
export function SiteLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const go = useGo();
  const follow = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(href);
  };
  return <Link href={href} onClick={follow} {...rest} />;
}

/** How fast the page catches the wheel, per second, and how far a turn of it goes. */
const CATCH = 11;
const REACH = 1.3;

/**
 * The long pages' wheel. It chases a target rather than restarting a curve on
 * every event: a trackpad sends one a frame, and a curve begun afresh each time
 * never gets off its slow start, which is what made these pages hard to push.
 */
function useSmoothWheel(on: boolean, page: string) {
  useEffect(() => {
    if (!on || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Kept here as fractions: scrollY comes back rounded, and tiny steps would vanish.
    let at = window.scrollY;
    let to = at;
    let last = 0;
    let stop: (() => void) | null = null;

    const frame = (now: number) => {
      const seconds = Math.min((now - last) / 1000, 0.05);
      last = now;
      at += (to - at) * (1 - Math.exp(-CATCH * Math.max(seconds, 0)));
      if (Math.abs(to - at) < 0.5) at = to;
      window.scrollTo(0, at);
      if (at === to) {
        stop?.();
        stop = null;
      }
    };
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      if (!stop) at = to = window.scrollY;
      const step = e.deltaMode === 1 ? e.deltaY * (100 / 6) : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      to = Math.min(Math.max(to + step * REACH, 0), document.documentElement.scrollHeight - window.innerHeight);
      if (stop) return;
      last = performance.now();
      stop = onFrame(frame);
    };
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheel);
      stop?.();
    };
  }, [on, page]);
}

export default function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [out, setOut] = useState(false);
  const [path, setPath] = useState(pathname);
  const [arriving, setArriving] = useState(false);
  const timer = useRef(0);

  // A new route has arrived: the page may come back in.
  if (path !== pathname) {
    setPath(pathname);
    setOut(false);
    setArriving(pathname === "/");
  }

  // One painted frame with the logo and ticket gone, and they come back in.
  useEffect(() => {
    if (!arriving) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setArriving(false));
    });
    return () => cancelAnimationFrame(raf);
  }, [arriving]);

  // In the click's own call, because a phone's browser won't start sound any later.
  useEffect(() => {
    if (window.__foundPressed) return playIntro();
    window.addEventListener(ENTERED_EVENT, playIntro, { once: true });
    return () => window.removeEventListener(ENTERED_EVENT, playIntro);
  }, []);

  const go = useCallback(
    (href: string) => {
      if (href === pathname) return;
      setOut(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => router.push(href), 200);
    },
    [pathname, router],
  );

  const route = routeOf(pathname);
  const cursor = route === "home" || route === "chapters";
  useSmoothWheel(route === "chapter" || route === "page" || route === "contact", pathname);

  return (
    <Fade.Provider value={go}>
      <div className={styles.site} data-route={route} data-arriving={arriving || undefined}>
        <Shapes />
        <Nav route={route} />
        {cursor && <Cursor sideways={route === "chapters"} />}
        <div className={styles.page} data-page data-out={out || undefined}>
          {children}
        </div>
      </div>
    </Fade.Provider>
  );
}
