import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import Logo from "@/components/cinema/Logo";
import { drawFlicker, prepareFlicker, stopFlicker } from "@/components/cinema/Title";
import styles from "./Film.module.css";

/* ===========================================================================
   The site's frame, for the game's own screens (2026-11-01): the wordmark at
   the top of a page, and a still in a card with hand-filed edges. Tickets and
   small caps are global (`.act`, `.act-quiet`, `.eyebrow`), because the screens
   that use them are scattered through the stage.
   =========================================================================== */

/** The site's title flicker, once, as a screen arrives. Put the ref round a `Title`. */
export function useFlicker<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const flicker = prepareFlicker([...ref.current.querySelectorAll<HTMLElement>("[data-char]")]);
    const began = performance.now();
    let raf = requestAnimationFrame(function frame(now) {
      if (drawFlicker(flicker, (now - began) / 1000)) raf = requestAnimationFrame(frame);
    });
    return () => {
      cancelAnimationFrame(raf);
      stopFlicker(flicker);
    };
  }, []);
  return ref;
}

export function Mast({ label }: { label?: string }) {
  return (
    <header className={styles.mast}>
      <Link href="/" className={styles.home} aria-label="Found, home">
        <Logo className={styles.logo} />
      </Link>
      {label && <span className={`eyebrow ${styles.label}`}>{label}</span>}
    </header>
  );
}

export function Still({
  src,
  sizes = "(min-width: 960px) 50vw, 100vw",
  priority = false,
  className,
  children,
}: {
  src: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={`${styles.still} ${className ?? ""}`}>
      <Image src={src} alt="" fill sizes={sizes} priority={priority} />
      {children}
    </span>
  );
}
