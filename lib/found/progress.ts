import { SAVE_VERSION, type CaseState } from "@/lib/game/engine";

/* ===========================================================================
   The playthrough, kept.

   A module value, read once from localStorage, written on every change, read
   by components through `useSyncExternalStore`. The server snapshot is always
   "no case yet", and the cast is only dealt when the envelope is opened (a
   click, never a render), so a random pick can't make the server and the
   browser disagree.

   One save per case. A page plays exactly one case, and `CaseProvider` binds
   this store to it (`bindProgress`) before anything reads it.

   Saves from before Episode 2 (v1) are upgraded in place: same flags, same
   cast, an empty record of use.
   =========================================================================== */

/** Where a case's save lives. The page's pre-paint script reads the same key. */
export const saveKey = (caseId: string): string => `found:${caseId}:save`;

let key: string | null = null;
let boundId: string | null = null;
let state: CaseState | null = null;
let loaded = false;
const listeners = new Set<() => void>();
let onCommit: ((caseId: string, next: CaseState | null) => void) | null = null;

/**
 * Point the store at one case's save. Idempotent, and cheap enough to call
 * while rendering: it doesn't notify, because whatever bound it is about to
 * re-render its subscribers anyway.
 */
export function bindProgress(caseId: string): void {
  const next = saveKey(caseId);
  if (next === key) return;
  key = next;
  boundId = caseId;
  state = null;
  loaded = false;
}

/** The case the store is pointed at, if any. */
export const boundCase = (): string | null => boundId;

/** Told about every save that's written: how a case number keeps up (lib/found/shelf.ts). */
export function afterCommit(fn: (caseId: string, next: CaseState | null) => void): void {
  onCommit = fn;
}

/** Read the save again: a restore has just written one from another device. */
export function reloadProgress(): void {
  state = null;
  loaded = false;
  for (const fn of listeners) fn();
}

const isRecord = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);

/**
 * A stored value, as today's shape — or null if it isn't one. Saves from the
 * retired chapters are dropped rather than upgraded: their cases don't exist
 * any more, so there is nothing for them to resume into.
 */
export function upgrade(x: unknown): CaseState | null {
  if (!isRecord(x)) return null;
  const ok =
    x.version === SAVE_VERSION &&
    typeof x.run === "string" &&
    Array.isArray(x.flags) &&
    x.flags.every((f) => typeof f === "string") &&
    typeof x.started === "number" &&
    isRecord(x.at);
  if (!ok) return null;
  // A version-4 save from before the chain still carries the old ledger: let it go.
  const { ledger: _ledger, ...rest } = x;
  void _ledger;
  return {
    ...(rest as unknown as CaseState),
    via: typeof x.via === "string" ? x.via : undefined,
    began: isRecord(x.began) && Object.values(x.began).every((n) => typeof n === "number") ? (x.began as Record<string, number>) : undefined,
    record:
      isRecord(x.record) && Object.values(x.record).every((v) => v === "in" || v === "anon" || v === "out" || v === "says" || v === "fact")
        ? (x.record as CaseState["record"])
        : undefined,
  };
}

export function readProgress(): CaseState | null {
  if (!loaded && key && typeof window !== "undefined") {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      state = raw ? upgrade(JSON.parse(raw)) : null;
    } catch {
      // Private mode, or storage refused: a fresh case, nothing broken.
    }
  }
  return state;
}

export const progressServerSide = (): CaseState | null => null;

export function subscribeProgress(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Save the playthrough, or `null` to put the phone back in the envelope. */
export function commit(next: CaseState | null): void {
  readProgress();
  if (next === state || !key) return;
  state = next;
  try {
    if (next) window.localStorage.setItem(key, JSON.stringify(next));
    else window.localStorage.removeItem(key);
  } catch {
    // Full or refused. The case still holds for this visit.
  }
  for (const fn of listeners) fn();
  if (boundId) onCommit?.(boundId, next);
}
