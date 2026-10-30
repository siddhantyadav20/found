/* ===========================================================================
   Heard, not just opened (fix brief §8.3, H-23). A clip or a recording whose
   evidence is `heard` goes into the case file only once it has played past
   its revealing caption (the mattress opening, the second shot), or to its
   end. The players say so here; the app layer listens and files it.
   =========================================================================== */

const HEARD = "found:heard";

/** A player reached the moment that makes this evidence what it is. */
export function heard(evidence: string): void {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<string>(HEARD, { detail: evidence }));
}

/** Listen for it; returns the unsubscribe. */
export function onHeard(cb: (evidence: string) => void): () => void {
  const on = (e: Event) => cb((e as CustomEvent<string>).detail);
  window.addEventListener(HEARD, on);
  return () => window.removeEventListener(HEARD, on);
}

const OPEN = "found:open-app";

/** Ask the found phone to open an app (the case file's "Look at yourself" opens the camera). */
export function openOnPhone(app: string): void {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<string>(OPEN, { detail: app }));
}

/** The phone listens; returns the unsubscribe. */
export function onOpenOnPhone(cb: (app: string) => void): () => void {
  const on = (e: Event) => cb((e as CustomEvent<string>).detail);
  window.addEventListener(OPEN, on);
  return () => window.removeEventListener(OPEN, on);
}
