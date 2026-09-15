"use client";

import { saveKey } from "@/lib/found/progress";

/**
 * Before the first paint: if this browser already has a save for the case,
 * hide the envelope the server drew, so a returning player never sees it
 * flash up before their phone does. It runs while the HTML is parsed, ahead
 * of the envelope's markup, which is what "before the first paint" takes.
 *
 * Only a full page load needs it. Arriving by a link inside the app (the desk's
 * "Pick it up"), the phone renders straight from the save, so the tag goes out
 * as `text/plain` there and is ignored: the pattern in Next's
 * preventing-flash-before-hydration guide, which also keeps React from warning
 * about a script it would never run.
 *
 * FoundPhone removes the attribute again whenever the envelope really is what
 * should show (a reset, or a save that turned out to be unreadable).
 */
export default function SaveScript({ caseId }: { caseId: string }) {
  const key = JSON.stringify(saveKey(caseId));
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `try{if(localStorage.getItem(${key}))document.documentElement.setAttribute("data-found-save","")}catch(e){}`,
      }}
    />
  );
}
