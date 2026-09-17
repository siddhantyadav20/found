/* ===========================================================================
   Found — the shape of a story.

   A story is data: who texted what, what the photos say, which code opens
   which lock, which question needs which proof, and what the player can do
   and say. `lib/found/engine.ts` plays it; `components/found` draws it.
   Neither knows the plot.

   It arrives in episodes, and every piece of a later episode is gated on the
   flag that starts it (`ep:2`), so one story object holds the whole thing
   and a save from Episode 1 simply carries on.

   Any string that names the missing person goes through `say()` in
   `lib/found/voice.ts`, which fills `{name}`, `{they}`, `{them}`, `{their}`,
   `{theirs}`, `{they're}`, `{child}` and `{kid}` (capitalised forms too) for
   whichever cast this playthrough dealt, plus the player's own numbers
   (`{firstPickup}`, `{minutes}` …) from their session.
   =========================================================================== */

export type Gender = "girl" | "boy";

/** A case is three episodes long. */
export type EpisodeNo = 1 | 2 | 3;

/** Who went missing this time. Dealt once, when the envelope is opened. */
export type Cast = { readonly gender: Gender; readonly name: string };

export type AppId =
  | "envelope"
  | "lock"
  | "messages"
  | "photos"
  | "calculator"
  | "health"
  | "settings"
  | "maps"
  | "memos"
  | "notes"
  | "guardian"
  | "nightcam"
  | "news"
  | "food"
  | "phone"
  | "whatsapp"
  | "telegram"
  | "recorder"
  | "files";

/**
 * A fact about a playthrough. Everything that gates anything is one of these:
 *
 *   seen:<evidence>        the player looked at it
 *   lock:<lock>            they opened it
 *   solved:<deduction>     they proved it
 *   fired:<event>          a live message arrived
 *   did:<action>           they did something to the phone (charged it,
 *                          turned Wi-Fi on, got the passcode wrong …)
 *   said:<reply>:<option>  they sent that; `said:<reply>` once it's settled
 *   ep:<n>                 an episode began (`ep:2`) or ended (`ep:2-done`)
 *   said:call:<option>     what the player said on the phone call that ends it
 *   dead                   the battery gave out at the end of Episode 1
 */
export type Flag =
  | `seen:${string}`
  | `lock:${string}`
  | `solved:${string}`
  | `fired:${string}`
  | `did:${string}`
  | `said:${string}`
  | `ep:${string}`
  | "dead";

/** One entry in the case file. Seen by opening wherever it lives. */
export type Evidence = {
  readonly id: string;
  readonly app: AppId;
  /** The case file's row. Budget: `LABEL_MAX`. */
  readonly label: string;
  /** Why it matters, in a line. Budget: `DETAIL_MAX`. */
  readonly detail: string;
  /** Beyond the passcode, which every app but the lock screen and the envelope needs. */
  readonly requires?: readonly Flag[];
};

/** What a chat message carries besides its words. */
export type Attachment =
  /** A voice note: its length, and what's said in it, as captions. */
  | { readonly kind: "voice"; readonly seconds: number; readonly transcript: readonly CallLine[] }
  /** A file, opened in Files. */
  | { readonly kind: "document"; readonly file: string; readonly name: string; readonly size: string }
  /** A video, by the photo id of its first frame. */
  | { readonly kind: "video"; readonly photo: string; readonly seconds: number }
  /** A live location still being shared, until `until`. `stops` is the action that ends it. */
  | { readonly kind: "live-location"; readonly place: string; readonly until: string; readonly stops: string };

export type Message = {
  readonly from: "owner" | "them" | "system";
  /** Group threads only: who in the group said it. */
  readonly sender?: string;
  readonly at: string;
  /** Budget: `BUBBLE_MAX`. May be empty when the message is a photo or a card. */
  readonly text: string;
  /** A photo id, shown under the text. */
  readonly photo?: string;
  /** A card drawn from the player's own session, not from the script. */
  readonly card?: "guardian";
  /** Seen when this message is on screen. */
  readonly evidence?: string;
  /** Only in the thread once these are true (an episode's backlog, mostly). */
  readonly requires?: readonly Flag[];
  /** Deleted by its sender once this flag is set: K. scrubbing his side. */
  readonly scrubbedBy?: Flag;
  readonly attachment?: Attachment;
  /** "Forwarded", above the message. */
  readonly forwarded?: boolean;
  /** Deleted before the phone reached you: only the placeholder is left. */
  readonly deleted?: boolean;
  /** Shows "Waiting for this message" until this flag is set. */
  readonly pendingUntil?: Flag;
  /** Ticks on a sent message. Read, otherwise. */
  readonly ticks?: "sent" | "delivered" | "read";
};

export type Thread = {
  readonly id: string;
  readonly contact: string;
  readonly group?: boolean;
  /** The thread is in the list but its messages are somewhere else. */
  readonly moved?: boolean;
  /** An unknown number the player can give a name to. */
  readonly nameable?: boolean;
  /** What its notifications say it's from, when that isn't the contact ("Unknown Number"). */
  readonly notifyAs?: string;
  /** Which chat app it lives in. Messages, otherwise. */
  readonly app?: "whatsapp" | "telegram";
  /** On its info page: the number, the @username, the about line. */
  readonly number?: string;
  readonly username?: string;
  readonly about?: string;
  /** Under the name in the chat's header: "last seen today at 23:47". */
  readonly lastSeen?: string;
  /** Kept at the top of the chat list. */
  readonly pinned?: boolean;
  /** No profile photo: the empty silhouette, whatever the name. */
  readonly noPhoto?: boolean;
  /** Seen when its info page is opened. */
  readonly infoEvidence?: string;
  readonly messages: readonly Message[];
  /** A thread that only exists once something writes into it. */
  readonly requires?: readonly Flag[];
};

export type Photo = {
  readonly id: string;
  /** `received` photos arrive inside messages; `nightcam` ones live in NightCam. */
  readonly album: "recents" | "deleted" | "received" | "nightcam";
  /** Under /public. Absent until the real photograph exists. */
  readonly src?: string;
  /** What the photograph shows. It is also the placeholder until `src` exists. */
  readonly alt: string;
  readonly takenAt: string;
  readonly place: string;
  /** A second line on the info sheet, like "Deleted Sat 00:07". */
  readonly note?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
  /** What the phone's text recognition reads off the photo (Live Text). */
  readonly liveText?: string;
  /** Drawn over the photo itself, the way a story carries its timestamp. */
  readonly overlay?: string;
  /** Recently Deleted offers "Recover" for it (a player action). */
  readonly recoverable?: boolean;
  /**
   * Only there if you lean in. The one photograph that can be pinched: past
   * double size, `reveal` is what's at the edge of the frame, and seeing it
   * is its own evidence.
   */
  readonly zoom?: { readonly reveal: string; readonly evidence: string };
};

export type HealthDay = {
  readonly day: string;
  /** Steps per hour, midnight first. The total is their sum. */
  readonly hours: readonly number[];
  readonly walk?: { readonly from: string; readonly to: string; readonly km: number };
  readonly evidence?: string;
};

export type Network = {
  readonly ssid: string;
  readonly lastJoined: string;
  /** When the phone first knew this network, where that's the point. */
  readonly joinedFirst?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type Place = {
  readonly id: string;
  readonly label: string;
  /** On the map's 100 × 140 sheet. */
  readonly x: number;
  readonly y: number;
};

export type Search = {
  readonly query: string;
  readonly at: string;
  readonly place?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
  /** A search this phone made after it reached the player. */
  readonly byYou?: boolean;
};

export type Memo = {
  readonly id: string;
  readonly title: string;
  readonly at: string;
  readonly seconds: number;
  /** Under /public. Absent until the recording exists. */
  readonly src?: string;
  /** What you hear, as captions. Also the only version until `src` exists. */
  readonly transcript: readonly string[];
  readonly evidence?: string;
};

export type Note = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  /** A receipt is drawn as paper, in the hand that wrote it. */
  readonly kind?: "note" | "receipt";
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** A device signed in to the missing person's account (Settings). */
export type Device = {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** Three steps, in order: a nudge, a pointer, the answer. */
export type Hints = readonly [string, string, string];

export type Lock = {
  readonly id: string;
  readonly app: AppId;
  /** Digits only. Input is compared with everything but digits removed. */
  readonly answer: string;
  /** The evidence that, between them, gives the answer away. */
  readonly clues: readonly string[];
  readonly hints: Hints;
  readonly requires?: readonly Flag[];
  /** Which apps hold the answer. Shown for free, always: apps, never answers. */
  readonly look?: readonly AppId[];
};

export type Deduction = {
  readonly id: string;
  /** The case file's heading. Budget: `QUESTION_MAX`. */
  readonly question: string;
  /** What the player is asked to do about it. */
  readonly ask: string;
  /** When the question appears in the case file. */
  readonly requires: readonly Flag[];
  readonly answer:
    | { readonly kind: "evidence"; readonly accepts: readonly (readonly string[])[] }
    | { readonly kind: "place"; readonly place: string }
    /** Typed. Compared after `normaliseAnswer`, so write these normalised. */
    | { readonly kind: "text"; readonly accepts: readonly string[] };
  /** Said when it is solved. */
  readonly right: string;
  /** Typed answers only: said instead of `right` for a specific accepted answer. */
  readonly rightFor?: Readonly<Record<string, string>>;
  /** Said for a specific wrong pick: evidence id, place id, typed answer,
   *  or `{name}` for the missing person's own name typed in. */
  readonly nudges: Readonly<Record<string, string>>;
  /** Said for any other wrong pick. */
  readonly otherwise: string;
  readonly hints: Hints;
  /** Which apps hold the answer. Shown for free, always: apps, never answers. */
  readonly look?: readonly AppId[];
};

/**
 * Something that happens because the player got somewhere — never because a
 * clock ran out. Thinking slowly is never punished.
 */
export type LiveEvent = {
  readonly id: string;
  readonly when: readonly Flag[];
  /** …and at least one of these. */
  readonly whenAny?: readonly Flag[];
  /** …and none of these. */
  readonly unless?: readonly Flag[];
  /** Where the messages land. Null for an event that is only an effect. */
  readonly thread: string | null;
  readonly messages: readonly Message[];
  /** A system banner with no thread behind it. */
  readonly banner?: string;
  /** Which app that banner belongs to, and opens. */
  readonly bannerApp?: AppId;
  /** Who the banner says it's from, when that isn't the app's own name ("RAGHAV"). */
  readonly bannerFrom?: string;
  /** How long after its moment it arrives (ms). The phone's own default otherwise. */
  readonly delay?: number;
  readonly effect?: "show-you" | "power-off" | "episode-end" | "open-notes" | "ring";
};

export type ReplyOption = {
  readonly id: string;
  /** What gets sent from the phone. `null` is choosing not to answer. */
  readonly text: string | null;
  readonly requires?: readonly Flag[];
  /** In a `repeat` exchange, the pick that settles it. */
  readonly final?: boolean;
};

/**
 * A moment the player can answer, from a short list — never free text, so
 * the story can't be talked off its rails. Every pick is sent from the
 * missing person's phone, and every pick is something the phone did.
 */
export type Reply = {
  readonly id: string;
  readonly thread: string;
  /** Said out loud on a call from that thread's number, not typed into it. */
  readonly call?: boolean;
  readonly when: readonly Flag[];
  /** Picks stay open until a `final` one is chosen (a test that can be failed). */
  readonly repeat?: boolean;
  readonly options: readonly ReplyOption[];
};

export type Headline = {
  readonly id: string;
  readonly at: string;
  /** Budget: `HEADLINE_MAX`. */
  readonly title: string;
  /** Paragraphs, some only true for this player. */
  readonly lines: readonly {
    readonly text: string;
    readonly requires?: readonly Flag[];
    readonly unless?: readonly Flag[];
  }[];
  readonly requires?: readonly Flag[];
  /** Seen when the story is opened. */
  readonly evidence?: string;
};

/**
 * Where the story is: what the screen shows and where the battery sits.
 * The current stage is the last one in its episode whose flags all hold, so
 * the list is written in order, each stage carrying what came before it.
 */
export type Stage = {
  readonly id: string;
  readonly episode: EpisodeNo;
  readonly when: readonly Flag[];
  /** …and none of these. */
  readonly unless?: readonly Flag[];
  /** Which of the story's calls is on screen, when `screen` is `call`. */
  readonly call?: string;
  readonly battery: number;
  /** `call`: a full-bleed incoming call. `ending`: what the call's answer did. */
  readonly screen: "lock" | "phone" | "end" | "charge" | "relock" | "call" | "ending";
};

/** Something the player can do to the phone itself, and what it needs first. */
export type PlayerAction = {
  readonly id: string;
  readonly sets: Flag;
  readonly requires: readonly Flag[];
  /** Nothing waits on it: it only changes what the phone remembers. */
  readonly optional?: boolean;
};

export type Ending = {
  readonly title: string;
  readonly questions: readonly string[];
  readonly ask: string;
  readonly cta?: string;
};

/** A caption on the call, `at` seconds in, with the English under it when the line isn't in English. */
export type CallLine = { readonly at: number; readonly text: string; readonly en?: string };

/**
 * A call that plays to its end and hangs up by itself: something the player
 * listens to and can't answer. `ends` is the action that marks it heard.
 */
export type ScriptedCall = {
  readonly id: string;
  /** What the caller ID says. */
  readonly from: string;
  readonly lines: readonly CallLine[];
  readonly ends: string;
};

/** Where a story's clock starts in an episode, what day the phone says it is, and how far it runs (minutes). */
export type Clock = { readonly base: string; readonly day: string; readonly cap: number };

/** An icon on the home screen. */
export type HomeIcon = { readonly app: AppId; readonly label: string };

/** What one answer on the call does, start to finish. */
export type Outcome = {
  /** The option on the call that leads here. */
  readonly id: string;
  /** The thing the player does in the minute after, while someone knocks. */
  readonly act: { readonly title: string; readonly detail: string; readonly button: string; readonly doing: string; readonly done: string };
  /** What happened, a line at a time. Some lines are only true for this player. */
  readonly lines: readonly { readonly text: string; readonly requires?: readonly Flag[]; readonly unless?: readonly Flag[] }[];
  /** The one news item it ends on. */
  readonly headline: { readonly at: string; readonly title: string };
  /** Said after the news item, as the last lines. */
  readonly after?: readonly string[];
  /** The last word, from someone, as a text. */
  readonly last?: { readonly from: string; readonly text: string };
};

export type Story = {
  readonly id: string;
  readonly title: string;
  /** Each episode's own name, in order. The envelope and the end cards read these. */
  readonly titles: readonly [string, string, string];
  /** The one person this story is about, when it isn't dealt at random. */
  readonly character?: Cast;
  /** How the phone opens: a passcode to find (the default), or a swipe, because nobody locked it. */
  readonly opensWith?: "passcode" | "swipe";
  /** The case file's line under its title. */
  readonly who?: string;
  /** Each episode's clock. Monday morning, evening and night otherwise. */
  readonly clocks?: Partial<Record<EpisodeNo, Clock>>;
  /** The home screen: pages of icons, and the dock. */
  readonly home?: { readonly pages: readonly (readonly HomeIcon[])[]; readonly dock: readonly HomeIcon[] };
  /** Calls that play out and hang up by themselves. */
  readonly calls?: readonly ScriptedCall[];
  readonly contacts?: readonly Contact[];
  readonly callLog?: readonly CallEntry[];
  /** Settings as data: what this phone knows about itself. */
  readonly settings?: readonly SettingsSection[];
  /** What the phone says when the player tries to call anyone from it. */
  readonly cantCall?: { readonly from: string; readonly text: string; readonly en?: string };
  readonly names: Readonly<Record<Gender, readonly string[]>>;
  readonly surname: string;
  readonly envelope: {
    readonly lines: readonly string[];
    readonly cta: string;
    /** The label, line by line, in the hand that wrote it. */
    readonly label: readonly string[];
    readonly evidence: string;
  };
  readonly lockscreen: {
    readonly medical?: {
      readonly name: string;
      readonly born: string;
      readonly blood: string;
      readonly contact: string;
      readonly evidence: string;
    };
    readonly notifications: readonly { readonly from: string; readonly text: string }[];
  };
  readonly threads: readonly Thread[];
  readonly photos: readonly Photo[];
  readonly health: readonly HealthDay[];
  readonly wifi: readonly Network[];
  readonly places: readonly Place[];
  readonly searches: readonly Search[];
  readonly memos: readonly Memo[];
  readonly vault: { readonly thread: Thread; readonly notes: readonly Note[] };
  readonly devices: readonly Device[];
  readonly evidence: readonly Evidence[];
  readonly locks: readonly Lock[];
  readonly deductions: readonly Deduction[];
  readonly events: readonly LiveEvent[];
  readonly replies: readonly Reply[];
  readonly headlines: readonly Headline[];
  readonly stages: readonly Stage[];
  readonly actions: readonly PlayerAction[];
  /** Mum's monitoring app, and what its report is built from. */
  readonly guardian: {
    readonly owner: string;
    readonly since: string;
    /** The notification that flickers as Episode 1's battery dies. */
    readonly sting: string;
    /** Moments of the player's session the report lists, in the player's own time. */
    readonly timeline: readonly { readonly flag: Flag; readonly label: string }[];
    /**
     * A session that wasn't the player's and wasn't the owner's. The app has
     * been counting since before the phone arrived, and it counted him too.
     */
    readonly earlier?: {
      readonly day: string;
      readonly at: string;
      readonly rows: readonly { readonly at: string; readonly label: string }[];
      readonly evidence: string;
    };
  };
  /** How many items NightCam holds in the cloud. The frames are photos in its album. */
  readonly nightcam: { readonly items: number };
  readonly food: readonly Order[];
  /** What the keyboard suggests: the words this phone's owner types most. */
  readonly keyboard: readonly string[];
  readonly end: Ending;
  readonly end2: Ending;
  readonly end3: Ending;
  /** The call that ends the chapter: who rings, what they say, and what each answer does. */
  readonly call: {
    readonly thread: string;
    readonly lines: readonly CallLine[];
    readonly outcomes: readonly Outcome[];
    /** After every ending: one line from a friend, then the desk. */
    readonly coda: { readonly from: string; readonly text: string; readonly next: readonly string[] };
  } | null;
};

/** Someone in the phone's contacts. */
export type Contact = {
  readonly id: string;
  readonly name: string;
  readonly number: string;
  /** Under the number: "SIM 2 · My other number". */
  readonly label?: string;
  /** The card's note, as whoever saved it wrote it. */
  readonly note?: string;
  /** Seen when the card is opened. */
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** One row in the phone's Recents. */
export type CallEntry = {
  readonly id: string;
  /** A contact id, or a number nobody saved. */
  readonly who: string;
  readonly dir: "in" | "out" | "missed";
  readonly at: string;
  /** Missed several times in a row: "(6)". */
  readonly count?: number;
  readonly duration?: string;
  /** Seen when Recents is opened. */
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** A group of rows in Settings, each one a fact about the phone. */
export type SettingsSection = {
  readonly title?: string;
  readonly rows: readonly {
    readonly title: string;
    readonly value?: string;
    readonly sub?: string;
    /** Seen when Settings is opened. */
    readonly evidence?: string;
    readonly requires?: readonly Flag[];
  }[];
  /** A line under the group. */
  readonly footer?: string;
};

export type Order = {
  readonly at: string;
  readonly item: string;
  readonly to: string;
  readonly price: string;
  /** A line under the order, like "Ordered on another device". */
  readonly note?: string;
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** The pieces a later episode adds. Threads with an existing id add messages. */
export type Part = {
  readonly [K in
    | "threads"
    | "photos"
    | "wifi"
    | "searches"
    | "food"
    | "memos"
    | "devices"
    | "evidence"
    | "locks"
    | "deductions"
    | "events"
    | "replies"
    | "headlines"
    | "stages"
    | "actions"]?: Story[K];
} & {
  readonly vaultNotes?: readonly Note[];
  readonly vaultMessages?: readonly Message[];
  readonly end2?: Ending;
  readonly end3?: Ending;
  readonly call?: Story["call"];
};

/** Kept so older imports read the same. */
export type Episode = Story;
