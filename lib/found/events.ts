import type { Flag, Story } from "@/content/types";

/* ===========================================================================
   What Found measures, and nothing it doesn't.

   Whether strangers start a case, where they get stuck, whether they finish,
   what they gave away, and whether they pass the phone on:

     open → unlock → past-lock → ep2-start → ep3-start →
       arrested → choice → end                                    the chapter
     solved:<id>, wrong:<id>, hint:<id>:<tier>, nudge:<id>        where it's too hard
     cut:early, voice:on, pin:typed, shaila:told, nikhil:*,
       profile:removed                                            what they gave away
     end:police|bin|friend                                        what they did with it
     resume                                                       whether they come back
     share:open|whatsapp|native|copy, drop:create                 whether they pass it on
     drop:arrive → drop:open → drop:unlock → drop:end             whether that worked
     keep:number|copy|whatsapp|restore, reset:ask|yes             whether cases are kept
     guard:inapp|chrome                                           in-app browsers, and leaving them

   Nearly all of it is reported from the save (`reportFlag`): a flag that
   means something is sent the first time it lands, so the funnel can't drift
   from what the game actually recorded.

   An allowlist per case, shared by the browser and the route, so the store's
   keys are bounded by this file rather than by whatever a request body says.
   No identifier of any kind is sent.
   =========================================================================== */

const MILESTONES = [
  "open",
  "resume",
  "unlock",
  "past-lock",
  "ep2-start",
  "ep3-start",
  "arrested",
  "choice",
  "end",
] as const;

/** What a player gave away, and what they finally did with the phone. */
const CHOICES = [
  "cut:early",
  "voice:on",
  "pin:typed",
  "shaila:told",
  "nikhil:declined",
  "nikhil:truth",
  "nikhil:lied",
  "nikhil:silent",
  "profile:removed",
] as const;

const VERDICTS = ["end:police", "end:bin", "end:friend"] as const;


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

/** Never losing a case: case numbers, restores, starting over, and in-app browsers. */
export const KEEPING = [
  "keep:number",
  "keep:copy",
  "keep:whatsapp",
  "keep:restore",
  "reset:ask",
  "reset:yes",
  "guard:inapp",
  "guard:chrome",
] as const;

const cache = new WeakMap<Story, readonly string[]>();

/** Every event a case can report. */
export function eventsFor(ep: Story): readonly string[] {
  let list = cache.get(ep);
  if (!list) {
    const puzzles = ep.questions.map((q) => q.id);
    list = [
      ...MILESTONES,
      ...CHOICES,
      ...puzzles.flatMap((id) => [
        `solved:${id}`,
        `wrong:${id}`,
        `hint:${id}:1`,
        `hint:${id}:2`,
        `hint:${id}:3`,
        // Offered rather than asked for: where the game noticed a player was stuck.
        `nudge:${id}`,
      ]),
      ...VERDICTS,
      ...SHARING,
      ...POWER,
      ...KEEPING,
    ];
    cache.set(ep, list);
  }
  return list;
}

export const isFoundEvent = (ep: Story, x: unknown): x is string => typeof x === "string" && eventsFor(ep).includes(x);

type Tracked = (typeof MILESTONES)[number] | (typeof CHOICES)[number];

/** The flag that marks each milestone or choice, so it's counted where it's saved. */
export const MILESTONE_OF: Partial<Record<Flag, Tracked>> = {
  "did:opened": "open",
  "did:unlock": "unlock",
  "did:past-lock": "past-lock",
  "ep:2": "ep2-start",
  "ep:3": "ep3-start",
  "did:arrested": "arrested",
  "did:choice": "choice",
  "did:chose": "end",
  "did:cut-early": "cut:early",
  "did:unmuted": "voice:on",
  "did:typed-password": "pin:typed",
  "did:shaila-told": "shaila:told",
  "did:declined-nikhil": "nikhil:declined",
  "did:nikhil-truth": "nikhil:truth",
  "did:nikhil-lied": "nikhil:lied",
  "did:nikhil-silent": "nikhil:silent",
  "did:removed-profile": "profile:removed",
};

/**
 * What the funnel hears when a flag lands, if anything. A solved question and
 * an asked-for hint are flags already; everything else is looked up.
 */
export function reportFlag(flag: Flag): string | null {
  if (flag.startsWith("ask:")) return `solved:${flag.slice(4)}`;
  if (flag.startsWith("hint:")) return flag;
  return MILESTONE_OF[flag] ?? null;
}
