"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

/* ===========================================================================
   The curtain (MOTION.md §3.1): what happens between one of the stage's
   scenes and the next.

   Every full-screen scene brings its own entrance; nobody owned the exit,
   so the chapter cut from a photograph of a room to a lock screen, from a
   lock screen to a call, from an app to black. Now a change of scene is a
   view transition on the document: the old scene and the new are each a
   snapshot, and app/curtain.css says how the one gives way to the other,
   by the pair's names (`html[data-curtain="note>table"]`): the phone wakes
   out of the photograph, a call slides down over the table and lifts away
   again, a dark screen dims the phone over 1.2 s, and anything else passes
   through a breath of black.

   The scene is kept until the browser has its snapshot, then swapped in one
   synchronous commit inside `startViewTransition`. A browser without it, a
   player who prefers reduced motion, and the first paint all cut, as before.
   =========================================================================== */

/** Scenes that never animate in or out: the first paint's loader. */
const CUTS = new Set(["loading"]);

type Shown = { kind: string; node: ReactNode };

export default function Curtain({ kind, children }: { kind: string; children: ReactNode }) {
  /* The scene on screen. While the kind is the same it follows the children
     (set during render, the way React keeps a value from the last render);
     when the kind changes it holds the old scene for the frame the browser
     takes its snapshot, and the swap happens inside the transition. */
  const [shown, setShown] = useState<Shown>({ kind, node: children });
  const same = shown.kind === kind;
  if (same && shown.node !== children) setShown({ kind, node: children });
  const pending = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (same) return;
    const pair = `${shown.kind}>${kind}`;
    if (pending.current === pair) return;
    const next = () => setShown({ kind, node: children });
    const start = document.startViewTransition?.bind(document);
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!start || quiet || CUTS.has(shown.kind) || CUTS.has(kind)) {
      next();
      return;
    }
    pending.current = pair;
    document.documentElement.dataset.curtain = pair;
    const t = start(() => flushSync(next));
    t.finished.finally(() => {
      if (pending.current !== pair) return;
      pending.current = null;
      delete document.documentElement.dataset.curtain;
    });
  }, [same, shown.kind, kind, children]);

  return <>{same ? children : shown.node}</>;
}
