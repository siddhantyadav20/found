import type { Story, Thread } from "@/content/types";
import { conversation, openReply, unreadCount } from "./chat";
import { all, dateNow, has, type CaseState } from "./engine";
import { recordRows } from "./record";

/* ===========================================================================
   Your phone: what's on it, and whether anything on it is new.

   Two apps, as a person has them (the rebuild of 2026-10-01): Messages
   (Meera, and the courier who brought the parcel back) and the social app,
   whose feed is the night spreading in public with your unposted draft on
   top. The record is what opens when you post, or attach it for Meera; giving
   the phone back is the courier's own "Book a return pickup".

   It speaks rarely: its own notifications (a story event on device
   "yours", with a banner), and messages that wait to be read. Never a
   "your draft is saved" (PLAYTEST-SHAGUN.md #57).
   =========================================================================== */

/** The player's own chats, as the phone shows them. */
export const yourThreads = (story: Story, s: CaseState): Thread[] =>
  story.threads.filter((t) => t.app === "yours:chats" && all(s, t.requires));

/** How many messages the player's own chats hold now. */
export const yourMessages = (story: Story, s: CaseState): number =>
  yourThreads(story, s).reduce((n, t) => n + conversation(s, t, dateNow(story, s)).length, 0);

/**
 * Messages waiting unread on the player's own phone: the count its edge
 * carries, so a sliver beside his open app still says Meera wrote
 * (PLAYTEST-SHAGUN.md #98).
 */
export const yourUnread = (story: Story, s: CaseState): number => {
  const today = dateNow(story, s);
  return yourThreads(story, s).reduce((n, t) => n + unreadCount(s, t, today), 0);
};

/** Set when the player has looked at the record or the draft. */
export const SAW_RECORD = "did:saw-record" as const;

/** When the player last picked their phone up: what its notifications count from. */
export const LOOKED_KEY = "yours:looked";

/** There's a record to send or post once anything would go into it. */
export const hasRecord = (story: Story, s: CaseState): boolean => recordRows(story, s).some((r) => r.line !== null);

/**
 * What your phone would say on its lock screen now, as "Who · what": its own
 * newest notification since it was last picked up, or a message waiting.
 */
export function newsOnYours(story: Story, s: CaseState): string | undefined {
  const looked = s.at[LOOKED_KEY] ?? 0;
  const news = story.events
    .filter((e) => e.device === "yours" && e.banner && has(s, `fired:${e.id}`) && (s.at[`event:${e.id}`] ?? 0) > looked)
    .sort((a, b) => (s.at[`event:${b.id}`] ?? 0) - (s.at[`event:${a.id}`] ?? 0))[0];
  if (news?.banner) return news.banner;
  const today = dateNow(story, s);
  // A message from someone, unread as his apps count it, or an exchange waiting on the player.
  const waiting = yourThreads(story, s).find(
    (t) => unreadCount(s, t, today) > 0 || (openReply(s, t) && conversation(s, t, today).some((m) => m.from === "them")),
  );
  if (!waiting) return undefined;
  const last = conversation(s, waiting, today).filter((m) => m.from === "them").at(-1);
  const text = last?.text ?? "New message";
  return `${waiting.name} · ${text.length > 72 ? `${text.slice(0, 70).trimEnd()}…` : text}`;
}

export const somethingNew = (story: Story, s: CaseState): boolean => Boolean(newsOnYours(story, s));
