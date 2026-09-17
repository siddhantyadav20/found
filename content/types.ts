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
  | "photos"
  | "settings"
  | "pikdrop"
  | "instagram"
  | "messages"
  | "notes"
  | "safari"
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
  /**
   * Found by doing something particular — zooming into a clock, tearing open
   * a pouch — rather than by opening the app it is filed under. Manual
   * evidence never puts a badge on an icon, because a badge would give the
   * doing away.
   */
  readonly manual?: boolean;
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
      /**
       * The other ways to prove the same thing. Every question in this
       * chapter has at least two routes in, and a player who found the second
       * one is not wrong (PLAYER-JOURNEY law 3).
       */
      readonly orProof?: readonly (readonly string[])[];
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

export type HomeIcon = { readonly app: AppId; readonly label: string };

/* --- what is on her phone -------------------------------------------------
   Everything below is content, not mechanism: a chat is a list of messages, a
   call is a row in Recents, a setting is a line in a grouped list. Anything
   that can be *found* names an `evidence` id, and the engine does the rest. */

export type Attachment =
  | { readonly kind: "document"; readonly label: string; readonly meta?: string }
  | { readonly kind: "photo"; readonly label: string; readonly src?: string }
  | { readonly kind: "voice"; readonly seconds: number; readonly transcript: string; readonly english?: string }
  | { readonly kind: "video"; readonly label: string; readonly seconds: number };

export type Message = {
  readonly id: string;
  /** Her, the other side, or the app itself ("Messages and calls are encrypted"). */
  readonly from: "her" | "them" | "system";
  readonly text?: string;
  /** The English under the Hinglish or Marathi. Never optional where it matters. */
  readonly english?: string;
  readonly at: string;
  readonly day?: string;
  readonly attachment?: Attachment;
  /** WhatsApp leaves the hole behind: "This message was deleted." */
  readonly deleted?: boolean;
  readonly forwarded?: boolean;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/**
 * What the player can say, when the story lets them say anything at all.
 * Four places in the chapter, and no more: the call, her son, her friend, and
 * the last message of Ending 03. Never generated, always picked from a list.
 */
export type ReplyOption = {
  readonly id: string;
  readonly text: string;
  readonly english?: string;
  readonly sets?: readonly Flag[];
  /** Saying this hands them something, and the ledger keeps it. */
  readonly exposes?: string;
  /** What comes back, and when. */
  readonly then?: readonly Message[];
};

export type Reply = {
  readonly id: string;
  readonly requires?: readonly Flag[];
  readonly prompt?: string;
  readonly options: readonly ReplyOption[];
};

/**
 * A call that arrives on its own: her son at 1:34 AM, and the one at 10:30
 * that is meant for the player. Answering is a choice, and so is everything
 * said afterwards.
 */
export type IncomingCall = {
  readonly id: string;
  readonly device: DeviceId;
  readonly from: string;
  readonly sub?: string;
  readonly at: string;
  readonly after: readonly Flag[];
  /** Left ringing, it rings again. Some calls cannot be refused forever. */
  readonly insists?: boolean;
  readonly lines: readonly {
    readonly who: string;
    readonly line: string;
    readonly english?: string;
    /** Only said when the ledger holds this, which is how an arrest is built. */
    readonly needs?: string;
  }[];
  readonly reply?: Reply;
  /** What the button says when there is nothing to say back. */
  readonly dismiss?: string;
  readonly sets?: readonly Flag[];
};

/** A story on Instagram, which expires, with something on the audio. */
export type Story24 = {
  readonly id: string;
  readonly who: string;
  readonly at: string;
  readonly expires: string;
  readonly caption: string;
  /** What the microphone caught above her, once the volume is up. */
  readonly audio: readonly { readonly who: string; readonly line: string; readonly english?: string }[];
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type Thread = {
  readonly id: string;
  readonly app: Extract<AppId, "whatsapp" | "messages" | "instagram">;
  /** Messages keeps what it doesn't trust in another folder, out of sight. */
  readonly folder?: "inbox" | "junk";
  readonly name: string;
  /** What the list shows under the name when it isn't the last message. */
  readonly sub?: string;
  readonly group?: boolean;
  readonly pinned?: boolean;
  /** Unsaved numbers show as numbers, which is how two of them get confused. */
  readonly number?: string;
  readonly messages: readonly Message[];
  /** What the player may say back, once they have something to say. */
  readonly reply?: Reply;
  readonly requires?: readonly Flag[];
};

/**
 * A photograph on her phone. Until the shoot (ROADMAP P11) these are drawn,
 * and the ones that matter most are drawn anyway: her diary, photographed
 * page by page at 11:40 PM, is paper with her handwriting on it.
 */
export type Photo = {
  readonly id: string;
  readonly album?: "diary" | "family" | "screenshots";
  readonly at: string;
  readonly day: string;
  readonly place?: string;
  /** `paper` draws a page; `scene` draws a photograph. */
  readonly kind: "paper" | "scene";
  readonly title: string;
  /** What is written on the page, in her hand. */
  readonly lines?: readonly string[];
  readonly caption?: string;
  /** In Recently Deleted, with the time it was deleted on it. */
  readonly deletedAt?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type Note = {
  readonly id: string;
  readonly title: string;
  readonly body: readonly string[];
  readonly at: string;
  readonly day: string;
  /** Notes shows this, and in one case it is the whole case. */
  readonly edited?: string;
  readonly sharedWith?: string;
  /** A locked note asks for a password. Whether it holds anything is another matter. */
  readonly locked?: boolean;
  readonly password?: string;
  /** What is inside once it opens. */
  readonly inside?: readonly string[];
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** The courier booking that brought this phone to the player's door. */
export type Courier = {
  readonly bookedAt: string;
  readonly day: string;
  readonly item: string;
  readonly from: string;
  readonly to: string;
  readonly rider: string;
  readonly fare: string;
  /** Where the bike went, in order. One of these stops was nobody's idea but theirs. */
  readonly route: readonly {
    readonly at: string;
    readonly place: string;
    readonly note?: string;
    readonly wrong?: boolean;
    readonly evidence?: string;
    readonly requires?: readonly Flag[];
  }[];
  readonly chat: readonly { readonly from: "rider" | "her"; readonly text: string; readonly english?: string; readonly at: string; readonly evidence?: string }[];
};

/** What she searched for, which is how a bank manager thinks out loud. */
export type Search = {
  readonly id: string;
  readonly text: string;
  readonly at: string;
  readonly day: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type Recording = {
  readonly seconds: number;
  readonly lines: readonly { readonly who: string; readonly line: string; readonly english?: string }[];
};

export type CallEntry = {
  readonly id: string;
  readonly name: string;
  readonly number?: string;
  readonly kind: "in" | "out" | "missed";
  readonly at: string;
  readonly day: string;
  readonly seconds?: number;
  /** iOS records calls now, and she had it on. */
  readonly recording?: Recording;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type SettingsRow = {
  readonly title: string;
  readonly sub?: string;
  readonly value?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
  /** A row that does something, once, and cannot be undone. */
  readonly action?: {
    readonly label: string;
    readonly confirm: string;
    readonly sets: readonly Flag[];
    readonly done: string;
  };
};

export type SettingsGroup = {
  readonly label?: string;
  readonly footer?: string;
  readonly rows: readonly SettingsRow[];
};

/** The call that is already running when the player opens the pouch. */
export type CallSpec = {
  readonly caller: string;
  /** How many seconds it had already run. 31:33:07 is 113,587 of them. */
  readonly since: number;
  /** What his room is meant to be, on the board behind him. */
  readonly board: string;
};

export type Story = {
  readonly id: string;
  readonly title: string;
  readonly call: CallSpec;
  readonly episodes: readonly [string, string, string];
  readonly clocks: readonly [Clock, Clock, Clock];
  /** Her home screen, as she left it: pages, and what she kept in the dock. */
  readonly hersHome: {
    readonly pages: readonly (readonly HomeIcon[])[];
    readonly dock: readonly HomeIcon[];
  };
  readonly evidence: readonly Evidence[];
  readonly threads: readonly Thread[];
  readonly photos: readonly Photo[];
  readonly notes: readonly Note[];
  readonly courier: Courier;
  readonly stories: readonly Story24[];
  readonly incoming: readonly IncomingCall[];
  /** What the player may say on the video call, once they unmute. */
  readonly callReplies: readonly Reply[];
  readonly searches: readonly Search[];
  readonly article: {
    readonly kicker: string;
    readonly headline: string;
    readonly body: readonly string[];
    readonly note: string;
  };
  readonly calls: readonly CallEntry[];
  readonly settings: readonly SettingsGroup[];
  readonly questions: readonly Question[];
  readonly cues: readonly CallCue[];
  readonly events: readonly LiveEvent[];
  readonly exposures: readonly Exposure[];
  readonly endings: readonly [Ending, Ending, Ending];
};
