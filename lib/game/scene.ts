import type { Flag, IncomingCall, Moment, Story } from "@/content/types";
import { all, episodeOf, has, type CaseState } from "./engine";
import { ENDING_SEEN } from "./endings";
import { AIRPLANE } from "./phone";

/* ===========================================================================
   Where the player is.

   The chapter is a table with two phones on it, interrupted by full-screen
   moments: the note, the charger, a title card, a call ringing, the ending.
   Which one is showing is decided by the save alone, so a reload always
   lands in the same place, and so it can be tested without a browser.

   ROADMAP S2 moves the sequence itself into the story; until then the
   moments every chapter shares are decided here.
   =========================================================================== */

export type Scene =
  | { readonly kind: "parcel" }
  | { readonly kind: "note" }
  | { readonly kind: "charge" }
  | { readonly kind: "recap"; readonly episode: 1 | 2 }
  | { readonly kind: "title"; readonly episode: 2 | 3 }
  | { readonly kind: "opener"; readonly episode: 2 | 3 }
  | { readonly kind: "ending" }
  | { readonly kind: "end-card" }
  | { readonly kind: "ringing"; readonly call: IncomingCall }
  | { readonly kind: "moment"; readonly moment: Moment }
  | { readonly kind: "finale" }
  | { readonly kind: "table" };

/** What plugging in sets: the phone is charging, and Episode 2 has begun. */
export const PLUGGED_IN: readonly Flag[] = ["did:charged", "ep:2"];

/** Set by the story when the phone is about to die and needs the player's charger. */
export const NEEDS_CHARGE: Flag = "did:needs-charge";

/**
 * Chosen at the parcel: no where-to-look, no nudges, the proof in the order
 * it was found. The score says so when it's shared.
 */
export const DETECTIVE: Flag = "did:detective";

/** Chosen at the parcel too (2026-10-24): the night's last hours run on a real clock (`Story.realtime`). */
export const REALTIME: Flag = "did:realtime";

/** Set when an episode's title card has been shown, so it shows once. */
export const titleShown = (episode: 2 | 3): Flag => `fired:title-${episode}`;

/** Set once an episode's "Previously" and briefing have been seen, so they show once. */
export const openerShown = (episode: 2 | 3): Flag => `did:opener-${episode}`;

/** Set once an episode's recap has been seen, so it shows once. */
export const recapShown = (episode: 1 | 2): Flag => `did:recap-${episode}`;

/** Set once a moment has been chosen, so it never comes back. */
export const momentDone = (id: string): Flag => `did:moment-${id}`;

/** The moment the story has stopped for, if any. */
export const momentNow = (story: Story, s: CaseState): Moment | undefined =>
  (story.moments ?? []).find((m) => all(s, m.after) && !has(s, momentDone(m.id)) && !(m.unless ?? []).some((f) => has(s, f)));

/**
 * The call ringing now, if any. A call that can be declined doesn't ring
 * back; a call that insists can only be answered.
 */
export const ringingNow = (story: Story, s: CaseState): IncomingCall | undefined =>
  story.incoming.find(
    (c) =>
      // His airplane mode silences his phone; yours still rings.
      !(c.device === "owner" && has(s, AIRPLANE)) &&
      all(s, c.after) &&
      !has(s, `did:done-${c.id}`) &&
      !(!c.insists && has(s, `did:declined-${c.id}`)),
  );

export function sceneOf(story: Story, s: CaseState | null): Scene {
  if (!s) return { kind: "parcel" };
  if (!has(s, "did:unlock")) return { kind: "note" };

  /* The phone is about to die: Episode 1 is said to be over, then only the player's charger keeps it. */
  if (has(s, NEEDS_CHARGE) && !has(s, "did:charged")) {
    if (story.recaps?.[1] && !has(s, recapShown(1))) return { kind: "recap", episode: 1 };
    return { kind: "charge" };
  }

  /* A new episode opens on its title and its minute before the table comes back. */
  const ep = episodeOf(s);
  if (ep === 3 && story.recaps?.[2] && !has(s, titleShown(3)) && !has(s, recapShown(2))) return { kind: "recap", episode: 2 };
  /* "Previously", then the title: as television does it, before the minute it opens on. */
  if (ep > 1 && story.openers?.[ep as 2 | 3] && !has(s, titleShown(ep as 2 | 3)) && !has(s, openerShown(ep as 2 | 3)))
    return { kind: "opener", episode: ep as 2 | 3 };
  if (ep > 1 && !has(s, titleShown(ep as 2 | 3))) return { kind: "title", episode: ep as 2 | 3 };

  /* The choice, what it costs, and the card. Once a choice is made there is
     no going back to the rows. */
  if (has(s, ENDING_SEEN)) return { kind: "end-card" };
  if (has(s, "did:chose")) return { kind: "ending" };

  const moment = momentNow(story, s);
  if (moment) return { kind: "moment", moment };

  const call = ringingNow(story, s);
  if (call) return { kind: "ringing", call };

  /* The last hour: everything's asked, and the record is the player's to send, post or hand back. */
  if (story.finale && has(s, "did:last-hour") && !has(s, "did:decide-later")) return { kind: "finale" };
  return { kind: "table" };
}
