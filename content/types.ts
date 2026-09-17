/* ===========================================================================
   The vocabulary a chapter is written in.

   One chapter is two devices, a call that never ends, a pile of evidence, a
   handful of questions, and a ledger of everything the player gave away.
   Nothing here knows about Vasundhara Kulkarni; the script in
   `content/dont-cut-the-call/` does.

   Written for the pivot of 2026-09-17 (CHAPTER1.md, ROADMAP.md P0).
   =========================================================================== */

export type EpisodeNo = 1 | 2 | 3;

/** Whose phone a thing lives on. Hers is the found phone; yours is yours. */
export type DeviceId = "hers" | "yours";

export type AppId =
  // Her phone
  | "whatsapp"
  | "phone"
  | "gallery"
  | "settings"
  | "pikdrop"
  | "instagram"
  | "messages"
  | "notes"
  | "chrome"
  | "news"
  | "casefile"
  // Your phone
  | "yours:chats"
  | "yours:phone"
  | "yours:share";

/**
 * What the save remembers. Free-form on purpose, but every flag belongs to one
 * of these families, so a test can hold the script to them:
 *
 *   ep:2 / ep:3        the episode the player has reached
 *   saw:<evidence>     a piece of evidence has been opened
 *   did:<thing>        the player did something the story cares about
 *   ask:<question>     a question has been answered
 *   hint:<question>    a hint was taken (never counted against the player)
 *   fired:<event>      a live event has played, so it never plays twice
 */
export type Flag =
  | "ep:2"
  | "ep:3"
  | `saw:${string}`
  | `did:${string}`
  | `ask:${string}`
  | `hint:${string}`
  | `fired:${string}`;

/** Something on a phone that can be opened, and counts once it has been. */
export type Evidence = {
  readonly id: string;
  readonly device: DeviceId;
  readonly app: AppId;
  /** What the case file calls it once it's found. */
  readonly label: string;
  /** Reachable only once these are true. Badges count reachable-but-unseen. */
  readonly requires?: readonly Flag[];
};

/** Three steps: a nudge, a push, and the answer. Never fewer. */
export type Hints = readonly [string, string, string];

/** A statement the player marks true or bluff, with what settles it. */
export type Claim = {
  readonly id: string;
  readonly text: string;
  readonly english?: string;
  /** True when the player gave them this. Otherwise it's a bluff. */
  readonly trueWhen?: readonly Flag[];
  readonly proof: string;
};

/** One row on the two-lane timeline: where she was, or what the phone did. */
export type TimelineRow = {
  readonly id: string;
  readonly at: string;
  readonly text: string;
  readonly lane: "her" | "phone";
  readonly evidence: string;
};

export type Question =
  | {
      readonly kind: "pick";
      readonly id: string;
      readonly ask: string;
      readonly episode: EpisodeNo;
      readonly whereToLook: readonly AppId[];
      readonly hints: Hints;
      /** Evidence ids that prove it. Picking anything else is wrong, not fatal. */
      readonly proof: readonly string[];
      readonly reply: string;
      readonly sets?: readonly Flag[];
    }
  | {
      readonly kind: "type";
      readonly id: string;
      readonly ask: string;
      readonly episode: EpisodeNo;
      readonly whereToLook: readonly AppId[];
      readonly hints: Hints;
      readonly accepts: readonly string[];
      readonly reply: string;
      readonly sets?: readonly Flag[];
    }
  | {
      readonly kind: "timeline";
      readonly id: string;
      readonly ask: string;
      readonly episode: EpisodeNo;
      readonly whereToLook: readonly AppId[];
      readonly hints: Hints;
      readonly rows: readonly TimelineRow[];
      readonly reply: string;
      readonly sets?: readonly Flag[];
    }
  | {
      readonly kind: "claims";
      readonly id: string;
      readonly ask: string;
      readonly episode: EpisodeNo;
      readonly whereToLook: readonly AppId[];
      readonly hints: Hints;
      readonly claims: readonly Claim[];
      readonly reply: string;
      readonly sets?: readonly Flag[];
    };

/**
 * A line on the call. `when` is what brings it: "idle" plays on a loop between
 * cues, a flag plays it once that flag lands, and "supervisor" cues are the
 * ones where someone is standing behind him.
 */
export type CallCue = {
  readonly id: string;
  readonly when: "idle" | "open" | Flag;
  readonly speaker: "rathore" | "supervisor";
  readonly line: string;
  /** The English under the Hinglish. Captions are never optional. */
  readonly english?: string;
  readonly supervisorPresent?: boolean;
  /** A whisper is played quieter, and the script means it. */
  readonly whisper?: boolean;
  readonly clip?: string;
};

/** Something the story does to a phone on its own: a message, a notification. */
export type LiveEvent = {
  readonly id: string;
  readonly device: DeviceId;
  readonly after: readonly Flag[];
  /** Seconds after the last flag in `after` landed. */
  readonly delay?: number;
  readonly app: AppId;
  readonly banner?: string;
  readonly sets?: readonly Flag[];
};

/**
 * Something the player can do that the syndicate can use. The ledger is the
 * chapter's spine: it writes Episode 3's accusations, the endings' variables
 * and the end card (CHAPTER1.md G1.4).
 */
export type Exposure = {
  readonly id: string;
  /** How the end card names it: "Her PIN", "Your voice", "Shaila's name". */
  readonly what: string;
  /** The line Episode 3's officer reads when they have this. */
  readonly used: string;
  readonly english?: string;
};

/** One of the three things a player can do with what they know. */
export type Ending = {
  readonly id: "police" | "bin" | "friend";
  readonly row: string;
  /** Lines in order. A line can depend on what the ledger holds. */
  readonly lines: readonly {
    readonly text: string;
    readonly english?: string;
    readonly needs?: readonly string[];
    readonly unless?: readonly string[];
  }[];
  /** The one thing only this ending shows, for the end card. */
  readonly onlyHere: string;
};

export type Clock = {
  /** The story's own time when an episode opens, as "01:11". */
  readonly base: string;
  readonly day: string;
  /** Her phone's battery when it opens. */
  readonly battery: number;
};

export type Story = {
  readonly id: string;
  readonly title: string;
  readonly episodes: readonly [string, string, string];
  readonly clocks: readonly [Clock, Clock, Clock];
  /** Her home screen, in the order she left it. */
  readonly hersHome: readonly { readonly app: AppId; readonly label: string }[];
  readonly evidence: readonly Evidence[];
  readonly questions: readonly Question[];
  readonly cues: readonly CallCue[];
  readonly events: readonly LiveEvent[];
  readonly exposures: readonly Exposure[];
  readonly endings: readonly [Ending, Ending, Ending];
};
