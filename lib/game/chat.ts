import type { AppId, Message, Reply, ReplyOption, Story, Thread } from "@/content/types";
import { all, chosenIn, dateNow, has, type CaseState } from "./engine";

/* ===========================================================================
   What a chat holds, in the order it happened.

   A thread is its messages, some of which arrive during the player's night,
   and the exchanges the player can have in it: each reply they pick shows as
   the owner's message, followed by whatever comes back. The order is the
   playthrough's own: a message or an exchange sits where the flag that
   brought it landed, so a reply made in Episode 2 comes after what arrived
   in Episode 1, and before whatever Episode 3 brings.
   =========================================================================== */

export { chosenIn };

/** Where a set of flags landed in the playthrough: the latest of them, or before everything. */
const landed = (s: CaseState, flags: readonly string[] = []): number =>
  Math.max(-1, ...flags.map((f) => s.flags.indexOf(f as CaseState["flags"][number])));

export function conversation(s: CaseState, t: Thread, today: string): Message[] {
  const items: { m: Message; key: number }[] = t.messages
    .filter((m) => all(s, m.requires) && !(m.unless ?? []).some((f) => has(s, f)))
    .map((m) => ({ m, key: landed(s, m.requires) }));

  for (const r of t.replies ?? []) {
    // An exchange that never opened here wasn't had here, whatever was said elsewhere (a call, say).
    if (!all(s, r.requires)) continue;
    const o = chosenIn(s, r);
    if (!o) continue;
    // Where the choice landed: the first of its flags that's set.
    const key = Math.min(...(o.sets ?? []).map((f) => s.flags.indexOf(f)).filter((i) => i >= 0));
    const first = o.then?.[0];
    items.push({
      m: { id: `said-${o.id}`, from: "owner", text: o.text, english: o.english, at: first?.at ?? "00:00", day: first?.day ?? today, with: first?.with ?? r.id },
      key,
    });
    for (const m of o.then ?? []) items.push({ m: { ...m, day: m.day ?? today, with: m.with ?? r.id }, key });
  }

  // Stable: what landed together keeps the order it was written in.
  return items.map((x, i) => ({ ...x, i })).sort((a, b) => a.key - b.key || a.i - b.i).map((x) => x.m);
}

/**
 * The exchange open now: the newest one whose moment has come, if it hasn't
 * been answered. An older one left unanswered lapses when a newer one opens.
 */
export function openReply(s: CaseState, t: Thread): Reply | undefined {
  const ready = (t.replies ?? []).filter((r) => all(s, r.requires));
  const r = ready.at(-1);
  return r && !chosenIn(s, r) && !(r.unless ?? []).some((f) => has(s, f)) ? r : undefined;
}

/** What the player can say in an exchange now: the options whose `requires` hold. */
export const offeredOptions = (s: CaseState, r: Reply): ReplyOption[] =>
  r.options.filter((o) => all(s, o.requires) && (!o.any || o.any.some((f) => has(s, f))) && !(o.unless ?? []).some((f) => has(s, f)));

/**
 * A chat app's threads as it lists them: two entries with the same name are
 * one chat, because a later episode adds messages to a thread rather than
 * opening a second one.
 */
export function threadsIn(story: Story, s: CaseState, app: Thread["app"]): Thread[] {
  return story.threads
    .filter((t) => t.app === app && all(s, t.requires))
    .reduce<Thread[]>((acc, t) => {
      const same = acc.find((x) => x.name === t.name);
      if (!same) return [...acc, t];
      return acc.map((x) =>
        x === same
          ? { ...x, avatar: x.avatar ?? t.avatar, unread: (x.unread ?? 0) + (t.unread ?? 0), messages: [...x.messages, ...t.messages], replies: [...(x.replies ?? []), ...(t.replies ?? [])] }
          : x,
      );
    }, []);
}

/** Where the player has read a chat up to: how many of its messages have been on screen. */
export const readKey = (t: Thread): string => `read:${t.app}:${t.id}`;

/**
 * Unread, as the app counts it: messages from the other side that haven't
 * been on screen. Never opened tonight, it's what was already waiting
 * (`Thread.unread`) and whatever has arrived since.
 */
export function unreadCount(s: CaseState, t: Thread, today: string): number {
  const shown = conversation(s, t, today);
  const mark = s.at[readKey(t)];
  if (mark !== undefined) return shown.slice(mark).filter((m) => m.from === "them").length;
  return (t.unread ?? 0) + shown.filter((m) => m.from === "them" && m.with).length;
}

/**
 * The number on an app's icon, as iOS draws it, and only where iOS would:
 * unread messages in WhatsApp and Messages (his, and yours), missed calls in Phone until it's
 * opened. Nothing anywhere counts evidence: the game's help is the case file's
 * where-to-look, never a badge iOS wouldn't draw (the 2026-10-01 review).
 */
export function badgeFor(story: Story, s: CaseState, app: AppId): number {
  const today = dateNow(story, s);
  if (app === "whatsapp" || app === "messages" || app === "yours:chats")
    return threadsIn(story, s, app)
      .filter((t) => !t.archived && !t.locked)
      .reduce((n, t) => n + unreadCount(s, t, today), 0);
  if (app === "phone") return s.at[`opened:${app}`] ? 0 : story.calls.filter((c) => c.kind === "missed" && all(s, c.requires)).reduce((n, c) => n + (c.count ?? 1), 0);
  return 0;
}
