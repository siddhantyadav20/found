import type { Flag, IncomingCall, Story } from "@/content/types";
import { all, has, type CaseState } from "./engine";

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
  | { readonly kind: "seen-by-them" }
  | { readonly kind: "morning" }
  | { readonly kind: "choice" }
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
  const asked = has(s, "did:cut-early") || has(s, "fired:cue-still-there");
  if (has(s, "did:bank-dead") && asked && !has(s, "did:charged")) return { kind: "charge" };

  if (has(s, "did:seen-by-them") && !has(s, "did:ep2-done")) return { kind: "seen-by-them" };
  if (has(s, "did:ep2-done") && !has(s, "did:woke")) return { kind: "morning" };
  if (has(s, "did:choice")) return { kind: "choice" };

  const call = ringingNow(story, s);
  if (call) return { kind: "ringing", call };
  return { kind: "table" };
}
