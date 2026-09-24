import type { Flag, IncomingCall, Story } from "@/content/types";
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
  | { readonly kind: "title"; readonly episode: 2 | 3 }
  | { readonly kind: "ending" }
  | { readonly kind: "end-card" }
  | { readonly kind: "ringing"; readonly call: IncomingCall }
  | { readonly kind: "table" };

/** What plugging in sets: the phone is charging, and Episode 2 has begun. */
export const PLUGGED_IN: readonly Flag[] = ["did:charged", "ep:2"];

/** Set by the story when the phone is about to die and needs the player's charger. */
export const NEEDS_CHARGE: Flag = "did:needs-charge";

/** Set when an episode's title card has been shown, so it shows once. */
export const titleShown = (episode: 2 | 3): Flag => `fired:title-${episode}`;

/**
 * The call ringing now, if any. A call that can be declined doesn't ring
 * back; a call that insists can only be answered.
 */
export const ringingNow = (story: Story, s: CaseState): IncomingCall | undefined =>
  // In airplane mode nothing rings.
  has(s, AIRPLANE) ? undefined : story.incoming.find(
    (c) => all(s, c.after) && !has(s, `did:done-${c.id}`) && !(!c.insists && has(s, `did:declined-${c.id}`)),
  );

export function sceneOf(story: Story, s: CaseState | null): Scene {
  if (!s) return { kind: "parcel" };
  if (!has(s, "did:unlock")) return { kind: "note" };

  /* The phone is about to die, and only the player's charger keeps it. */
  if (has(s, NEEDS_CHARGE) && !has(s, "did:charged")) return { kind: "charge" };

  /* A new episode opens on its title and its minute before the table comes back. */
  const ep = episodeOf(s);
  if (ep > 1 && !has(s, titleShown(ep as 2 | 3))) return { kind: "title", episode: ep as 2 | 3 };

  /* The choice, what it costs, and the card. Once a choice is made there is
     no going back to the rows. */
  if (has(s, ENDING_SEEN)) return { kind: "end-card" };
  if (has(s, "did:chose")) return { kind: "ending" };

  const call = ringingNow(story, s);
  if (call) return { kind: "ringing", call };
  return { kind: "table" };
}
