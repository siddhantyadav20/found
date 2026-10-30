import type { Dark, Flag, IncomingCall, Moment, Story } from "@/content/types";
import { all, episodeOf, filedClaim, has, offline, type CaseState } from "./engine";
import { ENDING_SEEN } from "./endings";

/* ===========================================================================
   Where the player is.

   The chapter is a table with two phones on it, interrupted by full-screen
   moments: the note, the charger, a title card, a call ringing, the ending.
   Which one is showing is decided by the save alone, so a reload always
   lands in the same place, and so it can be tested without a browser.

   Raakh v3 (RAAKH-V3 §6) adds: the phone dying (PG-DEATH), the dark-screen
   moments (PG-DARK), "Next" after an episode (PG-NEXT), the reveal, what
   comes before an ending, and putting it away unopened.
   =========================================================================== */

export type Scene =
  | { readonly kind: "parcel" }
  | { readonly kind: "note" }
  | { readonly kind: "charge" }
  | { readonly kind: "death" }
  | { readonly kind: "recap"; readonly episode: 1 | 2 }
  | { readonly kind: "next"; readonly episode: 1 | 2 }
  | { readonly kind: "title"; readonly episode: 2 | 3 }
  | { readonly kind: "opener"; readonly episode: 2 | 3 }
  | { readonly kind: "dark"; readonly dark: Dark }
  | { readonly kind: "reveal" }
  | { readonly kind: "before"; readonly ending: string }
  | { readonly kind: "unopened" }
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

/** A detective who asked for help partway (fix brief §8.8): one way only, and the end card says so. */
export const SWITCHED: Flag = "did:switched-help";

/** Chosen at the parcel too (2026-10-24): the night's last hours run on a real clock (`Story.realtime`). */
export const REALTIME: Flag = "did:realtime";

/** Set when an episode's title card has been shown, so it shows once. */
export const titleShown = (episode: 2 | 3): Flag => `fired:title-${episode}`;

/** Set once an episode's "Previously" and briefing have been seen, so they show once. */
export const openerShown = (episode: 2 | 3): Flag => `did:opener-${episode}`;

/** Set once an episode's recap has been seen, so it shows once. */
export const recapShown = (episode: 1 | 2): Flag => `did:recap-${episode}`;

/** Set once "Next on…" has played after an episode. */
export const teaserShown = (episode: 1 | 2): Flag => `did:teaser-${episode}`;

/** Set once the phone's death has played. */
export const DEATH_SEEN: Flag = "did:death-seen";

/** Set once a moment has been chosen, so it never comes back. */
export const momentDone = (id: string): Flag => `did:moment-${id}`;

/** Set once a dark-screen moment has played. */
export const darkDone = (id: string): Flag => `did:dark-${id}-seen`;

/** The reveal: begun, and over. Face down at the camera ends it early. */
export const REVEAL_START: Flag = "did:reveal-start";
export const REVEAL_DONE: Flag = "did:reveal-done";
export const FACE_DOWN: Flag = "did:facedown";

/** Put away before the reveal (RAAKH-V3 §11, Unopened); opened again, it's as it was. */
export const UNOPENED: Flag = "did:unopened";

/** The moment the story has stopped for, if any. */
export const momentNow = (story: Story, s: CaseState): Moment | undefined =>
  (story.moments ?? []).find((m) => all(s, m.after) && !has(s, momentDone(m.id)) && !(m.unless ?? []).some((f) => has(s, f)));

/** The dark-screen moment due now, if any. */
export const darkNow = (story: Story, s: CaseState): Dark | undefined =>
  (story.dark ?? []).find((d) => all(s, d.after) && !has(s, darkDone(d.id)) && !(d.unless ?? []).some((f) => has(s, f)));

/**
 * The call ringing now, if any. A call that can be declined doesn't ring
 * back; a call that insists can only be answered.
 */
export const ringingNow = (story: Story, s: CaseState): IncomingCall | undefined =>
  story.incoming.find(
    (c) =>
      // His airplane mode silences his phone; yours still rings.
      !(c.device === "owner" && offline(story, s)) &&
      all(s, c.after) &&
      !has(s, `did:done-${c.id}`) &&
      !(!c.insists && has(s, `did:declined-${c.id}`)),
  );

/** The ending the last question filed (`FileClaim.ending`), once it's been filed. */
export function finalEnding(story: Story, s: CaseState): string | undefined {
  if (has(s, FACE_DOWN)) return "origin";
  const q = story.questions.find((x) => x.final);
  return q ? filedClaim(q, s)?.ending : undefined;
}

export function sceneOf(story: Story, s: CaseState | null): Scene {
  if (!s) return { kind: "parcel" };
  if (!has(s, "did:unlock")) return { kind: "note" };

  /* The choice, what it costs, and the card. Once a choice is made there is
     no going back to the rows. */
  if (has(s, ENDING_SEEN)) return { kind: "end-card" };
  if (has(s, "did:chose")) return { kind: "ending" };
  if (has(s, UNOPENED)) return { kind: "unopened" };

  /* The phone is about to die: it dies on screen, Episode 1 is said to be
     over, "Next" plays, then only the player's charger keeps it. */
  if (has(s, NEEDS_CHARGE) && !has(s, "did:charged")) {
    if (story.death && !has(s, DEATH_SEEN)) return { kind: "death" };
    if (story.recaps?.[1] && !has(s, recapShown(1))) return { kind: "recap", episode: 1 };
    if (story.teasers?.[1] && !has(s, teaserShown(1))) return { kind: "next", episode: 1 };
    return { kind: "charge" };
  }

  /* A dark screen comes before anything else that's due: it's what the
     moment is (the freeze that ends Episode 2 is one). */
  const dark = darkNow(story, s);
  if (dark) return { kind: "dark", dark };

  /* A new episode opens on its title and its minute before the table comes back. */
  const ep = episodeOf(s);
  if (ep === 3 && story.recaps?.[2] && !has(s, titleShown(3)) && !has(s, recapShown(2))) return { kind: "recap", episode: 2 };
  if (ep === 3 && story.teasers?.[2] && !has(s, titleShown(3)) && !has(s, teaserShown(2))) return { kind: "next", episode: 2 };
  /* "Previously", then the title: as television does it, before the minute it opens on. */
  if (ep > 1 && (story.openers?.[ep as 2 | 3] || story.previously?.[ep as 2 | 3]) && !has(s, titleShown(ep as 2 | 3)) && !has(s, openerShown(ep as 2 | 3)))
    return { kind: "opener", episode: ep as 2 | 3 };
  if (ep > 1 && !has(s, titleShown(ep as 2 | 3))) return { kind: "title", episode: ep as 2 | 3 };

  // The reveal: nine steps, nothing else let in (RAAKH-V3 §9, scene 3.10).
  if (story.reveal && has(s, REVEAL_START) && !has(s, REVEAL_DONE)) return { kind: "reveal" };

  // The last question filed: what comes before the ending, then the ending.
  const ending = finalEnding(story, s);
  if (ending) return { kind: "before", ending };

  const moment = momentNow(story, s);
  if (moment) return { kind: "moment", moment };

  const call = ringingNow(story, s);
  if (call) return { kind: "ringing", call };

  /* The last hour: everything's asked, and the record is the player's to send, post or hand back. */
  if (story.finale && has(s, "did:last-hour") && !has(s, "did:decide-later")) return { kind: "finale" };
  return { kind: "table" };
}
