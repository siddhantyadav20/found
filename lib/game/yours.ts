import type { Story, Thread } from "@/content/types";
import { conversation, openReply } from "./chat";
import { all, dateNow, type CaseState } from "./engine";
import { recordRows } from "./record";

/* ===========================================================================
   Your phone: what's on it, and whether anything on it is new.

   Its messages (the chats a story puts on "yours:chats"), the draft post and
   the record once there's anything to put in one, and the parcel, always.
   New means something to answer, a message not yet seen, or a draft not yet
   looked at: the only reasons your phone's edge ever lights.
   =========================================================================== */

/** The player's own chats, as the phone shows them. */
export const yourThreads = (story: Story, s: CaseState): Thread[] =>
  story.threads.filter((t) => t.app === "yours:chats" && all(s, t.requires));

/** How many messages the player's own chats hold now. */
export const yourMessages = (story: Story, s: CaseState): number =>
  yourThreads(story, s).reduce((n, t) => n + conversation(s, t, dateNow(story, s)).length, 0);

/** Set when the player has looked at the record or the draft. */
export const SAW_RECORD = "did:saw-record" as const;

/** Where the player got to in their own messages: `at` keeps a count, not a time. */
export const READ_KEY = "yours:read";

/** There's a record to send or post once anything would go into it. */
export const hasRecord = (story: Story, s: CaseState): boolean => recordRows(story, s).some((r) => r.line !== null);

export function somethingNew(story: Story, s: CaseState): boolean {
  const toAnswer = yourThreads(story, s).some((t) => openReply(s, t));
  const unread = yourMessages(story, s) > (s.at[READ_KEY] ?? 0);
  const draft = hasRecord(story, s) && !s.flags.includes(SAW_RECORD);
  return toAnswer || unread || draft;
}
