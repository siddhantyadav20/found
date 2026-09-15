"use client";

import { createContext, useContext, useMemo } from "react";

import { CASES, type CaseId, type CaseMeta } from "@/content/cases";
import type { Story } from "@/content/found/types";
import { STORIES } from "@/content/stories";
import { bindCase } from "./FoundPhone/actions";

/* ===========================================================================
   Which case this page is playing.

   Components read the script through `useStory()` rather than importing one,
   so the same phone can play any case, and the server can render the right
   envelope for each request.

   The actions and the save are browser-only module state, so they're bound
   here as the provider renders in the browser, before any child reads the
   save. Binding is idempotent: a re-render with the same case does nothing.
   =========================================================================== */

export type CaseContext = {
  readonly id: CaseId;
  readonly story: Story;
  readonly meta: CaseMeta;
  /** The drop this page was opened through, when someone passed the phone on. */
  readonly via?: string;
  /** The name on that drop's envelope, already in capitals. Empty for "TO YOU". */
  readonly to?: string;
  /** How long the case usually takes, once enough people have finished it. */
  readonly minutes?: number;
};

const Ctx = createContext<CaseContext | null>(null);

export function CaseProvider({
  id,
  via,
  to,
  minutes,
  children,
}: {
  id: CaseId;
  via?: string;
  to?: string;
  minutes?: number;
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") bindCase(id, via);
  const value = useMemo(() => ({ id, story: STORIES[id], meta: CASES[id], via, to, minutes }), [id, via, to, minutes]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCase(): CaseContext {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCase() needs a CaseProvider above it");
  return c;
}

export const useStory = (): Story => useCase().story;
