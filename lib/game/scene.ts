import type { Flag, IncomingCall, Story } from "@/content/types";
import { all, has, type CaseState } from "./engine";
import { ENDING_SEEN } from "./endings";

/* ===========================================================================
   Where the player is.

   The chapter is a table with two phones on it, interrupted by full-screen
   moments: the note, the charger, "Good morning, #9.", the morning, a call
   ringing, the choice. Which one is showing is decided by the save alone, so
   a reload always lands in the same place — and so it can be tested without
   a browser, which is how the blockers in QA.md got past 61 tests.
   =========================================================================== */

export type Scene =
  | { readonly kind: "pouch" }
  | { readonly kind: "note" }
  | { readonly kind: "charge" }
  | { readonly kind: "title"; readonly episode: 2 }
  | { readonly kind: "seen-by-them" }
  | { readonly kind: "morning" }
  | { readonly kind: "choice" }
  | { readonly kind: "ending" }
  | { readonly kind: "end-card" }
  | { readonly kind: "ringing"; readonly call: IncomingCall }
  | { readonly kind: "table" };

/** What plugging in sets: the phone is charging, and Episode 2 has begun. */
export const PLUGGED_IN: readonly Flag[] = ["did:charged", "ep:2"];

/**
 * The call ringing now, if any. Her son can be declined and doesn't ring
 * back; a call that insists can only be answered.
 */
export const ringingNow = (story: Story, s: CaseState): IncomingCall | undefined =>
  story.incoming.find(
    (c) => all(s, c.after) && !has(s, `did:done-${c.id}`) && !(!c.insists && has(s, `did:declined-${c.id}`)),
  );

export function sceneOf(story: Story, s: CaseState | null): Scene {
  if (!s) return { kind: "pouch" };
  if (!has(s, "did:unlock")) return { kind: "note" };

  /* The power bank is out and he has asked the dark whether she is still
     there. A player who cut the call hears nobody ask, and plugs in anyway:
     the phone is at 4%, and it is all they have of her. */
  if (has(s, "did:needs-charge") && !has(s, "did:charged")) return { kind: "charge" };

  /* Plugged in: a title, and the night moves on to 2:35 before the table
     comes back (PLAYTEST.md #34, #46). */
  if (has(s, "ep:2") && !has(s, "ep:3") && !has(s, "fired:title-2")) return { kind: "title", episode: 2 };

  if (has(s, "did:seen-by-them") && !has(s, "did:ep2-done")) return { kind: "seen-by-them" };
  if (has(s, "did:ep2-done") && !has(s, "did:woke")) return { kind: "morning" };
  /* The choice, the act that makes it, what it costs, and the card. Once a
     row's act is done there is no going back to the rows. */
  if (has(s, ENDING_SEEN)) return { kind: "end-card" };
  if (has(s, "did:chose")) return { kind: "ending" };
  if (has(s, "did:choice")) return { kind: "choice" };

  const call = ringingNow(story, s);
  if (call) return { kind: "ringing", call };
  return { kind: "table" };
}
