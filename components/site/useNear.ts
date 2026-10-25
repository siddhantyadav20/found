"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the element has come within `margin` of the screen, and from then on. */
export function useNear(ref: RefObject<Element | null>, margin = "800px 0px"): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const watch = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setNear(true);
      watch.disconnect();
    }, { rootMargin: margin });
    watch.observe(el);
    return () => watch.disconnect();
  }, [ref, margin]);
  return near;
}
