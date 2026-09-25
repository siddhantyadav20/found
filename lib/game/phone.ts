import type { AppId, Caption, Flag, HomeIcon, Memo, Photo, Story } from "@/content/types";
import { calendar, type Calendar } from "@/lib/found/time";
import { all, episodeOf, has, type CaseState } from "./engine";

/* ===========================================================================
   How the found phone's own apps behave, as far as that can be decided
   without a screen: what is in Recently Deleted and what has been put back,
   what the Hidden album shows and when, what an edited clip plays before and
   after Revert, what is still in iCloud, which app is offloaded, which note
   is locked. iOS's behaviour, not any story's, so every chapter's phone
   keeps the same promises (CHAPTER1.md E: every hard route is a real one).
   =========================================================================== */

/** Settings › Apps › Photos › Show Hidden Album, once it's on. */
export const SHOW_HIDDEN: Flag = "did:show-hidden-album";

/** Control Centre's airplane mode, turned on by hand. */
export const AIRPLANE: Flag = "did:airplane";

/** Put back from Recently Deleted. */
export const restored = (id: string): Flag => `did:restored-${id}`;

/** Edit › Revert, on an edited photo or video. It can't be undone on this phone either. */
export const reverted = (id: string): Flag => `did:reverted-${id}`;

/** A locked note, opened with its password. */
export const unlocked = (id: string): Flag => `did:unlocked-${id}`;

/** WhatsApp's hidden locked chats, shown once their secret code has been typed into Search. */
export const CHATS_UNLOCKED: Flag = "did:unlocked-chats";

/** Is this what the player typed into WhatsApp's Search the story's secret code? Case and spaces aside. */
export const isCode = (story: Story, typed: string): boolean =>
  Boolean(story.chatLock) && typed.trim().toLowerCase() === story.chatLock!.code.toLowerCase();

/** An offloaded app, downloaded again from its Home Screen icon. */
export const installed = (app: AppId): Flag => `did:installed-${app}`;

/** Here in full, or still only a thumbnail with the rest in iCloud. */
export const loaded = (s: CaseState, p: Photo): boolean => all(s, p.inCloud);

/** Whether iCloud Photos has anything it hasn't brought down yet: the Library's footer says so. */
export const syncPaused = (story: Story, s: CaseState): boolean => story.photos.some((p) => !loaded(s, p));

/** What the Home Screen icon is now: the app, gone with its data kept, or on its way back. */
export function offload(s: CaseState, icon: HomeIcon): "installed" | "offloaded" | "available" {
  if (!icon.offloaded || has(s, installed(icon.app))) return "installed";
  return all(s, icon.offloaded) ? "available" : "offloaded";
}

/** In the bin: deleted, and not put back. */
export const inBin = (s: CaseState, item: { readonly id: string; readonly deletedAt?: string }): boolean =>
  Boolean(item.deletedAt) && !has(s, restored(item.id));

export type Library = {
  /** Recents: everything that isn't hidden or in the bin, oldest first. */
  readonly recents: readonly Photo[];
  readonly favorites: readonly Photo[];
  /** Albums by name, in the order their first photograph appears. */
  readonly albums: readonly { readonly name: string; readonly photos: readonly Photo[] }[];
  /** The Hidden album, or null while Photos isn't showing it. */
  readonly hidden: readonly Photo[] | null;
  readonly bin: readonly Photo[];
};

export function library(story: Story, s: CaseState): Library {
  // Oldest first, by when each was taken, as the Library grid is.
  const cal = calendarOf(story, s);
  const visible = story.photos.filter((p) => all(s, p.requires)).toSorted((a, b) => cal.when(a.day, a.at) - cal.when(b.day, b.at));
  const bin = visible.filter((p) => inBin(s, p));
  const kept = visible.filter((p) => !inBin(s, p));
  const recents = kept.filter((p) => !p.hidden);
  const names = [...new Set(recents.map((p) => p.album).filter((a): a is string => Boolean(a)))];
  return {
    recents,
    favorites: recents.filter((p) => p.favorite),
    albums: names.map((name) => ({ name, photos: recents.filter((p) => p.album === name) })),
    hidden: has(s, SHOW_HIDDEN) ? kept.filter((p) => p.hidden) : null,
    bin,
  };
}

/** What a clip plays now: the edit, or, once reverted, the original. */
export function clipOf(s: CaseState, p: Photo): { readonly seconds: number; readonly captions: readonly Caption[] } | undefined {
  if (p.original && has(s, reverted(p.id))) return p.original;
  return p.video;
}

/** Edited, and the original still kept: Edit offers Revert. */
export const revertible = (s: CaseState, p: Photo): boolean => Boolean(p.original) && !has(s, reverted(p.id));

export function memos(story: Story, s: CaseState): { readonly recordings: readonly Memo[]; readonly bin: readonly Memo[] } {
  const visible = story.memos.filter((m) => all(s, m.requires));
  return { recordings: visible.filter((m) => !inBin(s, m)), bin: visible.filter((m) => inBin(s, m)) };
}

/** "0:31", "2:05". */
export const mmss = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** "₹1,80,000", the Indian way. */
export const rupees = (n: number): string => `₹${Math.abs(n).toLocaleString("en-IN")}`;

/** The phone's calendar now: days labelled from the date of the episode the player is in. */
export const calendarOf = (story: Story, s: CaseState): Calendar =>
  calendar(story.clocks[0], story.clocks[episodeOf(s) - 1].date);
