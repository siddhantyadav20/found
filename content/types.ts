/* ===========================================================================
   The vocabulary a chapter is written in.

   One chapter is two devices (the found phone and the player's own), a pile
   of evidence, a handful of questions, some people who ring or write, and the
   endings. Nothing here knows about any one story; `content/<case>/` does.

   Written for the pivot of 2026-09-17, and stripped of the retired chapter's
   call, courier and news app at the pivot to *Shagun* (ROADMAP.md S1).
   =========================================================================== */

export type EpisodeNo = 1 | 2 | 3;

/** Whose phone a thing lives on: the found phone's owner's, or yours. */
export type DeviceId = "owner" | "yours";

export type AppId =
  // The found phone
  | "whatsapp"
  | "phone"
  | "photos"
  | "settings"
  | "instagram"
  | "messages"
  | "notes"
  | "safari"
  | "voicememos"
  | "mail"
  | "paytap"
  | "casefile"
  // Your phone
  | "yours:chats"
  | "yours:phone"
  | "yours:share";

/**
 * What the save remembers. Free-form on purpose, but every flag belongs to one
 * of these families, so a test can hold the script to them:
 *
 *   ep:2 / ep:3            the episode the player has reached
 *   saw:<evidence>         a piece of evidence has been opened
 *   did:<thing>            the player did something the story cares about
 *   ask:<question>         a question has been answered
 *   claim:<question>:<id>  the claim the player filed for it; the latest wins
 *   link:<link>            a link in the chain has been traced
 *   hint:<question>        a hint was taken (never counted against the player)
 *   fired:<event>          a live event has played, so it never plays twice
 */
export type Flag =
  | "ep:2"
  | "ep:3"
  | `saw:${string}`
  | `did:${string}`
  | `ask:${string}`
  | `claim:${string}`
  | `link:${string}`
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
   * Found by doing something particular — zooming into a face, reverting an
   * edit — rather than by opening the app it is filed under. Manual
   * evidence never puts a badge on an icon, because a badge would give the
   * doing away.
   */
  readonly manual?: boolean;
};

/** Three steps: a nudge, a push, and the answer. Never fewer. */
export type Hints = readonly [string, string, string];

/** A statement the player marks proven or not, with what settles it. */
export type Claim = {
  readonly id: string;
  readonly text: string;
  readonly english?: string;
  /** Proven when these hold. Otherwise it isn't. */
  readonly trueWhen?: readonly Flag[];
  readonly proof: string;
};

/**
 * One answer a "file" question will accept: a line for the record and the
 * proof that supports it. A question can accept more than one, because the
 * evidence Sameer left supports his version too (CHAPTER1.md G): a claim
 * marked `version` is filed like any other and never called wrong.
 */
export type FileClaim = {
  readonly id: string;
  /** The line as it goes into the record. */
  readonly text: string;
  readonly english?: string;
  readonly proof: readonly string[];
  readonly orProof?: readonly (readonly string[])[];
  readonly reply: string;
  readonly sets?: readonly Flag[];
  /** The owner's own framing: accepted now, and reopened by `reopenWhen`. */
  readonly version?: boolean;
};

/** One row on a timeline: an event, the lane it belongs in, and what shows it. */
export type TimelineRow = {
  readonly id: string;
  readonly at: string;
  readonly text: string;
  readonly lane: string;
  readonly evidence: string;
};

/** What every question has, whatever kind it is. */
type Asked = {
  readonly id: string;
  readonly ask: string;
  readonly episode: EpisodeNo;
  readonly whereToLook: readonly AppId[];
  readonly hints: Hints;
  /** Not asked until these are true: nobody is asked about a call that hasn't come. */
  readonly requires?: readonly Flag[];
  /** Doesn't hold the episode up: the case file offers it on the side. */
  readonly optional?: boolean;
  readonly reply: string;
  readonly sets?: readonly Flag[];
};

/**
 * A link in the night's chain of responsibility (CHAPTER1.md D). Traced when
 * `link:<id>` is set, which a question's answer does. An untraced link is
 * shown on the end card in the owner's own words.
 */
export type Link = {
  readonly id: string;
  /** Its name: "The shot". */
  readonly label: string;
  /** What the record says once it is traced. */
  readonly truth: string;
  /** Whose link it is. */
  readonly owner: string;
  /** Spine links every finisher traces; deep links are optional. */
  readonly kind: "spine" | "deep";
  /** The owner's version of it, in his words, if he has one. */
  readonly version?: string;
  readonly english?: string;
};

export type Question =
  | (Asked & {
      readonly kind: "pick";
      /** Evidence ids that prove it. Picking anything else is wrong, not fatal. */
      readonly proof: readonly string[];
      /**
       * The other ways to prove the same thing. Every question has at least
       * two routes in, and a player who found the second one is not wrong
       * (PLAYER-JOURNEY law 3).
       */
      readonly orProof?: readonly (readonly string[])[];
    })
  | (Asked & { readonly kind: "type"; readonly accepts: readonly string[] })
  | (Asked & {
      readonly kind: "timeline";
      /** The lanes, in the order the board shows them. */
      readonly lanes: readonly { readonly id: string; readonly label: string }[];
      readonly rows: readonly TimelineRow[];
    })
  | (Asked & {
      readonly kind: "claims";
      readonly claims: readonly Claim[];
      /** What a marked and an unmarked claim are called: "proven" / "not proven" by default. */
      readonly labels?: readonly [string, string];
    })
  | (Asked & {
      readonly kind: "file";
      /** The answers it accepts, each a line for the record with its proof. */
      readonly claims: readonly FileClaim[];
      /**
       * When these hold and the claim on file is a `version`, the question
       * comes back as Revisit: the player strikes the old line and files the
       * new one (CHAPTER1.md G).
       */
      readonly reopenWhen?: readonly Flag[];
      /** A Revisit that holds everything up until it's done, not one offered on the side. */
      readonly mustRevisit?: boolean;
    });

/** Something the story does to a phone on its own: a message, a notification. */
export type LiveEvent = {
  readonly id: string;
  readonly device: DeviceId;
  readonly after: readonly Flag[];
  /** Seconds after the last flag in `after` landed. */
  readonly delay?: number;
  readonly app: AppId;
  readonly banner?: string;
  /** Whose icon the banner wears, when it isn't the app's own. */
  readonly icon?: AppId;
  /** Something that arrived while nobody was looking: it goes into the list at this time, with no banner. */
  readonly at?: string;
  readonly sets?: readonly Flag[];
};

/**
 * A line of an ending. Which lines a player reads is decided by what they
 * did: `needs` all of these flags, `any` at least one, `unless` none.
 */
export type EndingLine = {
  readonly text: string;
  readonly english?: string;
  /** A time cut before the line: "Nine days later". */
  readonly at?: string;
  /** Somebody saying it, as a message. Without one, it is narration. */
  readonly who?: string;
  readonly needs?: readonly Flag[];
  readonly any?: readonly Flag[];
  readonly unless?: readonly Flag[];
};

/** One of the things a player can do with what they know. */
export type Ending = {
  readonly id: string;
  readonly row: string;
  /** What happens afterwards, a line at a time. */
  readonly lines: readonly EndingLine[];
  /** The last image: who says what, before the black. */
  readonly last: readonly EndingLine[];
  /** The one thing only this ending shows, for the end card. */
  readonly onlyHere: string;
};

export type Clock = {
  /** The story's own time when an episode opens, as "23:40". */
  readonly base: string;
  readonly day: string;
  /** The found phone's battery when it opens. */
  readonly battery: number;
  /** On the player's charger: the battery climbs a point a minute from `battery`. */
  readonly charging?: boolean;
  /** The battery falling with the beats rather than with a timer: the last step whose flag is set wins. */
  readonly drain?: readonly { readonly after: Flag; readonly battery: number }[];
};

/** Waiting on the found phone's lock screen before anything arrives. */
export type LockNotice = {
  readonly key: string;
  readonly app: AppId;
  readonly from: string;
  readonly text: string;
  /** As the lock screen shows it: "Fri", "1:04 AM". */
  readonly time: string;
};

/** What the player finds with the phone, before they turn it on. */
export type Arrival = {
  /** The note, in the writer's own hand, a line at a time. */
  readonly note: readonly string[];
  readonly sign?: string;
  /** Ours, never written on the note. */
  readonly english: string;
  /** What lies beside it, in a line, once the note has been read. */
  readonly caption: string;
  /**
   * The note is on the back of an envelope: the player sees its front first,
   * and turns it over by hand to read what's written there.
   */
  readonly envelope?: {
    /** The front, in foil: "Ishita weds Rohan". */
    readonly front: string;
    /** Under it, small: "Sehgal Parivar · 22.11". */
    readonly small?: string;
    /** What the player is told before turning it over. */
    readonly caption: string;
  };
};

/** The charger gate between Episodes 1 and 2: asked once, warmly. */
export type Gate = {
  readonly level: string;
  readonly lines: readonly string[];
  readonly ask: string;
};

export type HomeIcon = { readonly app: AppId; readonly label: string };

/* --- what is on the found phone -------------------------------------------
   Everything below is content, not mechanism: a chat is a list of messages, a
   call is a row in Recents, a setting is a line in a grouped list. Anything
   that can be *found* names an `evidence` id, and the engine does the rest. */

/** A line in a clip or a recording, at its second, with who says it and the English under it. */
export type Caption = {
  readonly at: number;
  readonly who?: string;
  /** "[dhol]" for a sound: shown as a sound, not as words. */
  readonly line: string;
  readonly english?: string;
};

export type Attachment =
  | { readonly kind: "document"; readonly label: string; readonly meta?: string }
  | { readonly kind: "photo"; readonly label: string; readonly src?: string }
  | { readonly kind: "voice"; readonly seconds: number; readonly transcript: string; readonly english?: string }
  | {
      readonly kind: "video";
      readonly label: string;
      readonly seconds: number;
      /** The poster frame, once the footage exists. */
      readonly src?: string;
      readonly captions?: readonly Caption[];
    }
  /** A page in someone's own hand, photographed: drawn as paper, in cursive. */
  | {
      readonly kind: "handwriting";
      readonly label: string;
      readonly lines: readonly string[];
      readonly sign?: string;
      /** A line in the writer's own language, under the signature. */
      readonly blessing?: string;
    };

export type Message = {
  readonly id: string;
  /** The phone's owner, the other side, or the app itself. */
  readonly from: "owner" | "them" | "system";
  /** In a group, who on the other side sent it. */
  readonly who?: string;
  /**
   * The owner's message, as WhatsApp marks it: one grey tick (sent, never
   * delivered, which is what a block looks like), two grey, or two blue.
   * Read, by default.
   */
  readonly ticks?: "sent" | "delivered" | "read";
  /** A reply to an earlier message, quoted above it. */
  readonly quote?: { readonly who: string; readonly text: string };
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
 * Never generated, always picked from a list.
 */
export type ReplyOption = {
  readonly id: string;
  readonly text: string;
  readonly english?: string;
  readonly sets?: readonly Flag[];
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
 * A call that arrives on its own. Answering is a choice, and so is
 * everything said afterwards.
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
    /** Only said when this happened earlier in the night. */
    readonly when?: Flag;
  }[];
  readonly reply?: Reply;
  /** What the button says when there is nothing to say back. */
  readonly dismiss?: string;
  readonly sets?: readonly Flag[];
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
  /** Moved out of the list into Archived, which is one tap further than most people look. */
  readonly archived?: boolean;
  readonly messages: readonly Message[];
  /** What the player may say back, once they have something to say. */
  readonly reply?: Reply;
  readonly requires?: readonly Flag[];
};

/**
 * A photograph or a video on the found phone. Until the shoot (ROADMAP S11)
 * `paper` draws a page in somebody's hand and `scene` a titled card; `src`
 * swaps in the real image, or a video's poster frame.
 */
export type Photo = {
  readonly id: string;
  /** The album it belongs to besides Recents: "Sehgal wedding", "WhatsApp". */
  readonly album?: string;
  readonly at: string;
  readonly day: string;
  readonly place?: string;
  /** `paper` draws a page; `scene` draws a photograph. */
  readonly kind: "paper" | "scene";
  readonly title: string;
  readonly src?: string;
  /** What is written on the page, in the writer's hand. */
  readonly lines?: readonly string[];
  readonly caption?: string;
  /** What Info says took it: "iPhone 14 Pro — Back Camera". */
  readonly camera?: string;
  /** A video: its length and its words. */
  readonly video?: { readonly seconds: number; readonly captions: readonly Caption[] };
  /**
   * Edited on the phone, and iOS kept the original: Edit › Revert brings it
   * back, and with it whatever the edit cut (`evidence`).
   */
  readonly original?: { readonly seconds: number; readonly captions: readonly Caption[]; readonly evidence?: string };
  readonly favorite?: boolean;
  /** In the Hidden album, which Photos shows only once Settings says to (`SHOW_HIDDEN`). */
  readonly hidden?: boolean;
  /** In Recently Deleted, with the time it was deleted and the days it has left. */
  readonly deletedAt?: string;
  readonly daysLeft?: number;
  /**
   * Something at the edge of the frame that only leaning in finds: past
   * double size, with the spot (percent across, down) on screen.
   */
  readonly zoom?: { readonly at: { readonly x: number; readonly y: number }; readonly reveal: string; readonly evidence: string };
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** A recording in Voice Memos. */
export type Memo = {
  readonly id: string;
  readonly title: string;
  readonly at: string;
  readonly day: string;
  readonly seconds: number;
  readonly lines: readonly Caption[];
  /** In Recently Deleted, with the time it was deleted and the days it has left. */
  readonly deletedAt?: string;
  readonly daysLeft?: number;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** A letter in Mail, and the document attached to it, if any. */
export type Mail = {
  readonly id: string;
  readonly from: string;
  readonly address?: string;
  readonly subject: string;
  readonly at: string;
  readonly day: string;
  readonly body: readonly string[];
  readonly attachment?: { readonly name: string; readonly pages: readonly string[]; readonly evidence?: string };
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** A line in the payments app: money in (+) or out (−), in rupees. */
export type Payment = {
  readonly id: string;
  readonly who: string;
  /** The UPI id, as the receipt shows it. */
  readonly handle?: string;
  readonly amount: number;
  readonly note?: string;
  readonly at: string;
  readonly day: string;
  readonly failed?: boolean;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** An Instagram profile: the owner's, or anybody's the story needs. */
export type Profile = {
  readonly handle: string;
  readonly name: string;
  readonly bio?: string;
  /** The owner's own: its ring says "Your story". */
  readonly own?: boolean;
  readonly posts: readonly {
    readonly id: string;
    readonly title: string;
    readonly src?: string;
    readonly caption?: string;
    readonly evidence?: string;
  }[];
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

/** What the owner searched for, with the time: how a person thinks out loud. */
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
  /** One row for several calls in a row, as Recents shows it: "(47)". */
  readonly count?: number;
  /** Still connected: Recents shows it as live, not as a length. */
  readonly ongoing?: boolean;
  /** iOS records calls now, for anyone who turns it on. */
  readonly recording?: Recording;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type SettingsRow = {
  readonly title: string;
  readonly sub?: string;
  readonly value?: string;
  /** A page one level down, as iOS keeps a profile: tapping the row opens it. */
  /** A page one level down: tapping the row opens it. */
  readonly detail?: {
    readonly heading: string;
    /** A first row carrying the row's own tile, as iOS heads a page about one thing. */
    readonly title?: string;
    readonly rows: readonly {
      readonly label: string;
      readonly value?: string;
      readonly toggle?: { readonly sets: readonly Flag[] };
    }[];
    readonly footer?: string;
  };
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
  /** A switch. Turning it on sets these; on this phone, nobody turns it back off. */
  readonly toggle?: { readonly sets: readonly Flag[] };
  /** A row that does something, once, and cannot be undone. */
  readonly action?: {
    readonly label: string;
    readonly confirm: string;
    readonly sets: readonly Flag[];
    readonly done: string;
    /** Only offered once these are true. */
    readonly requires?: readonly Flag[];
  };
};

export type SettingsGroup = {
  readonly label?: string;
  readonly footer?: string;
  readonly rows: readonly SettingsRow[];
};

export type Story = {
  readonly id: string;
  readonly title: string;
  /** Whose phone it is: the name on the account, and what transcripts call them. */
  readonly owner: { readonly name: string; readonly short: string };
  readonly episodes: readonly [string, string, string];
  readonly clocks: readonly [Clock, Clock, Clock];
  readonly arrival: Arrival;
  readonly gate: Gate;
  readonly lockScreen: readonly LockNotice[];
  /** The found phone's home screen, as its owner left it: pages, and the dock. */
  readonly home: {
    readonly pages: readonly (readonly HomeIcon[])[];
    readonly dock: readonly HomeIcon[];
  };
  readonly evidence: readonly Evidence[];
  readonly threads: readonly Thread[];
  readonly photos: readonly Photo[];
  readonly notes: readonly Note[];
  readonly memos: readonly Memo[];
  readonly mail: readonly Mail[];
  readonly payments: readonly Payment[];
  readonly profiles: readonly Profile[];
  readonly incoming: readonly IncomingCall[];
  readonly searches: readonly Search[];
  readonly calls: readonly CallEntry[];
  readonly settings: readonly SettingsGroup[];
  readonly questions: readonly Question[];
  readonly events: readonly LiveEvent[];
  /** The night's chain of responsibility, in order: the score and what the endings read. */
  readonly chain: readonly Link[];
  /** Flags the funnel counts by name ("did:raju-answered" → "raju-answered"): the chapter's own choices. */
  readonly choices?: readonly Flag[];
  readonly endings: readonly Ending[];
};
