import type { Message, Reply, ReplyOption, Thread } from "@/content/types";
import { all, has, type CaseState } from "./engine";

/* ===========================================================================
   What a chat holds, in the order it happened.

   A thread is its messages, some of which arrive during the player's night,
   and the exchanges the player can have in it: each reply they pick shows as
   the owner's message, followed by whatever comes back. The order is the
   playthrough's own: a message or an exchange sits where the flag that
   brought it landed, so a reply made in Episode 2 comes after what arrived
   in Episode 1, and before whatever Episode 3 brings.
   =========================================================================== */

/** The option picked in an exchange, if one was. */
export const chosenIn = (s: CaseState, r: Reply) => r.options.find((o) => o.sets?.some((f) => s.flags.includes(f)));

/** Where a set of flags landed in the playthrough: the latest of them, or before everything. */
const landed = (s: CaseState, flags: readonly string[] = []): number =>
  Math.max(-1, ...flags.map((f) => s.flags.indexOf(f as CaseState["flags"][number])));

export function conversation(s: CaseState, t: Thread, today: string): Message[] {
  const items: { m: Message; key: number }[] = t.messages
    .filter((m) => all(s, m.requires))
    .map((m) => ({ m, key: landed(s, m.requires) }));

  for (const r of t.replies ?? []) {
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
export const offeredOptions = (s: CaseState, r: Reply): ReplyOption[] => r.options.filter((o) => all(s, o.requires));
