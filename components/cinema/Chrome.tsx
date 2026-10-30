"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

import Cursor from "./Cursor";
import Nav from "./Nav";
import styles from "./Chrome.module.css";

/* ===========================================================================
   Everything that stays while the pages change (2026-10-31): the design's
   tokens, the nav, the cursor, and the page's fade. A link fades the page out
   for .2s and only then moves, and the new page comes in through the same CSS
   that brought the first one in from behind the preloader.
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

export default function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [out, setOut] = useState(false);
  const [path, setPath] = useState(pathname);
  const timer = useRef(0);

  // A new route has arrived: the page may come back in.
  if (path !== pathname) {
    setPath(pathname);
    setOut(false);
  }

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
  const cursor = useMemo(() => route === "home", [route]);

  return (
    <Fade.Provider value={go}>
      <div className={styles.site} data-route={route}>
        <Nav route={route} />
        {cursor && <Cursor />}
        <div className={styles.page} data-page data-out={out || undefined}>
          {children}
        </div>
      </div>
    </Fade.Provider>
  );
}
