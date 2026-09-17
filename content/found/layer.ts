import type { Part, Story, Thread } from "./types";

/* ===========================================================================
   A later episode, laid over the story so far.

   Each part only adds. A thread it names that already exists gets the new
   messages appended (Mum's Monday backlog lands in Mum's thread); every other
   list is concatenated. Everything a later part adds is gated on that
   episode's flag, so the merged story plays the earlier episodes exactly as
   they were.
   =========================================================================== */

function mergeThreads(base: readonly Thread[], more: readonly Thread[] = []): Thread[] {
  const out = base.map((t) => ({ ...t, messages: [...t.messages] }));
  for (const t of more) {
    const existing = out.find((x) => x.id === t.id);
    if (existing) existing.messages.push(...t.messages);
    else out.push({ ...t, messages: [...t.messages] });
  }
  return out;
}

const join = <T>(a: readonly T[] | undefined, b: readonly T[] | undefined): readonly T[] | undefined =>
  a || b ? [...(a ?? []), ...(b ?? [])] : undefined;

export function layer(story: Story, part: Part): Story {
  return {
    ...story,
    threads: mergeThreads(story.threads, part.threads),
    photos: [...story.photos, ...(part.photos ?? [])],
    wifi: [...(part.wifi ?? []), ...story.wifi],
    searches: [...story.searches, ...(part.searches ?? [])],
    food: [...(part.food ?? []), ...story.food],
    memos: [...story.memos, ...(part.memos ?? [])],
    devices: [...story.devices, ...(part.devices ?? [])],
    evidence: [...story.evidence, ...(part.evidence ?? [])],
    locks: [...story.locks, ...(part.locks ?? [])],
    deductions: [...story.deductions, ...(part.deductions ?? [])],
    events: [...story.events, ...(part.events ?? [])],
    replies: [...story.replies, ...(part.replies ?? [])],
    headlines: [...story.headlines, ...(part.headlines ?? [])],
    stages: [...story.stages, ...(part.stages ?? [])],
    actions: [...story.actions, ...(part.actions ?? [])],
    contacts: join(story.contacts, part.contacts),
    callLog: join(part.callLog, story.callLog),
    recordings: join(story.recordings, part.recordings),
    files: join(story.files, part.files),
    settings: join(story.settings, part.settings),
    vault: {
      thread: { ...story.vault.thread, messages: [...story.vault.thread.messages, ...(part.vaultMessages ?? [])] },
      notes: [...story.vault.notes, ...(part.vaultNotes ?? [])],
    },
    end2: part.end2 ?? story.end2,
    end3: part.end3 ?? story.end3,
    call: part.call ?? story.call,
  };
}
