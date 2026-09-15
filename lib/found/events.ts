import type { Flag, Story } from "@/content/found/types";

/* ===========================================================================
   What Found measures, and nothing it doesn't.

   Whether strangers start a case, where they get stuck, whether they finish,
   whether the turn lands, and whether they pass the phone on:

     open → unlock → d1 → d2 → vault → d3 → end                   Episode 1
     ep2-start → e2-who → e2-wanted → e2-why → e2-wifi →
       e2-alive → e2-trust → e2-delivered → ep2-end               Episode 2
     e2-saw:yes|maybe|no                                          did the turn land
     mum:lie|truth|silence, k:threat                              what they chose
     wrong:<id>, hint:<id>:<tier>                                 where it's too hard
     resume                                                       whether they come back
     ep2:yes|no, ep3:yes|no, email                                whether they want more
     share:open|whatsapp|native|copy, drop:create                 whether they pass it on
     drop:arrive → drop:open → drop:unlock → drop:end             whether that worked

   An allowlist per case, shared by the browser and the route, so the store's
   keys are bounded by this file rather than by whatever a request body says.
   No identifier of any kind is sent.
   =========================================================================== */

const MILESTONES = [
  "open",
  "resume",
  "unlock",
  "d1",
  "d2",
  "vault",
  "d3",
  "end",
  "ep2-start",
  "e2-who",
  "e2-wanted",
  "e2-why",
  "e2-wifi",
  "e2-alive",
  "e2-trust",
  "e2-delivered",
  "ep2-end",
] as const;

const CHOICES = ["mum:lie", "mum:truth", "mum:silence", "k:threat"] as const;
const VERDICTS = ["ep2:yes", "ep2:no", "ep3:yes", "ep3:no", "email", "e2-saw:yes", "e2-saw:maybe", "e2-saw:no"] as const;

/**
 * The loop that brings new players. The browser sends `drop:arrive` when a
 * passed-on link is opened; the server counts `drop:open|unlock|end` itself
 * when a player who arrived through a drop reaches `open`, `unlock` or `end`.
 */
export const SHARING = [
  "share:open",
  "share:whatsapp",
  "share:native",
  "share:copy",
  "drop:create",
  "drop:arrive",
  "drop:open",
  "drop:unlock",
  "drop:end",
] as const;

/** Which milestones also count against the drop a player arrived through. */
export const DROP_LEGS: Readonly<Record<string, "arrive" | "open" | "unlock" | "end">> = {
  "drop:arrive": "arrive",
  open: "open",
  unlock: "unlock",
  end: "end",
};

/** How Episode 2's phone came back: the player's real charger, one already
 *  plugged in, or the on-screen cable where the browser can't read a battery. */
export const POWER = ["charge:real", "charge:already", "charge:tap"] as const;

const cache = new WeakMap<Story, readonly string[]>();

/** Every event a case can report. */
export function eventsFor(ep: Story): readonly string[] {
  let list = cache.get(ep);
  if (!list) {
    const puzzles = [...ep.locks.map((l) => l.id), ...ep.deductions.map((d) => d.id)];
    list = [
      ...MILESTONES,
      ...CHOICES,
      ...puzzles.flatMap((id) => [`wrong:${id}`, `hint:${id}:1`, `hint:${id}:2`, `hint:${id}:3`]),
      ...VERDICTS,
      ...SHARING,
      ...POWER,
    ];
    cache.set(ep, list);
  }
  return list;
}

export const isFoundEvent = (ep: Story, x: unknown): x is string => typeof x === "string" && eventsFor(ep).includes(x);

type Tracked = (typeof MILESTONES)[number] | (typeof CHOICES)[number];

/** The flag that marks each milestone or choice, so it's counted where it's saved. */
export const MILESTONE_OF: Partial<Record<Flag, Tracked>> = {
  "lock:passcode": "unlock",
  "solved:went-home": "d1",
  "solved:dev": "d2",
  "lock:vault": "vault",
  "solved:last-seen": "d3",
  dead: "end",
  "ep:2": "ep2-start",
  "solved:e2-who": "e2-who",
  "solved:e2-wanted": "e2-wanted",
  "solved:e2-why": "e2-why",
  "did:wifi-on": "e2-wifi",
  "solved:e2-alive": "e2-alive",
  "said:r3107-b": "e2-trust",
  "solved:e2-delivered": "e2-delivered",
  "ep:2-done": "ep2-end",
  "said:r-mum:lie": "mum:lie",
  "said:r-mum:truth": "mum:truth",
  "said:r-mum:silence": "mum:silence",
  "said:r5520:threat": "k:threat",
};
