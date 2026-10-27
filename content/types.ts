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
  | "findmy"
  | "camera"
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
  /**
   * Found by opening the thing it's in (a chat, a photo, a note, a letter),
   * not just the app: on a phone this full, opening WhatsApp shouldn't find
   * every voice note unheard. Unlike `manual`, it still counts in the app's
   * badge, because there is something to open.
   */
  readonly within?: boolean;
  /**
   * Found by something the player did, once it holds, whenever that was: a
   * clip reverted, a recording recovered. Such acts can't be done twice, so
   * one done in an earlier episode still counts once this evidence's own
   * episode comes (the hybrid pacing: CHAPTER1.md F).
   */
  readonly foundBy?: readonly Flag[];
  /** Its number in the chapter's evidence register ("E30"), for anyone checking the data against the script. */
  readonly code?: string;
  /**
   * The phone lets it be deleted (RAAKH-V3 §17): to Recently Deleted, and
   * from there for good. Every question still has a way in that can't be.
   */
  readonly deletable?: boolean;
};

/**
 * Which of the two Sameers a choice comes from (RAAKH-V3 §2, §14): the one
 * checking whether the lie holds, or the one who wants it found. Read back
 * at the reveal and on the end card; it never decides what can happen.
 */
export type Impulse = { readonly side: "auditor" | "confessor"; readonly weight: number };

/** A turn of the story's clock: it reads `at` once these flags hold (RAAKH-V3 §5, §17). */
export type Beat = { readonly at: string; readonly after: readonly Flag[] };

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
  /**
   * True and on the point, but not proof by itself: the portrait beside the
   * badge that names him. It can sit beside a whole route without being
   * called wrong; it never completes one (PLAYTEST-SHAGUN.md #51).
   */
  readonly also?: readonly string[];
  readonly reply: string;
  readonly sets?: readonly Flag[];
  /** The owner's own framing: accepted now, and reopened by `reopenWhen`. */
  readonly version?: boolean;
  /**
   * The link this version stands in for, in the record: filed, it goes in
   * as fact, in the player's own words, until they say otherwise.
   */
  readonly link?: string;
  /**
   * The sentence as the player makes it, blank by blank (`Question.say`):
   * these words, and only these, file this claim.
   */
  readonly words?: Readonly<Record<string, string>>;
  /**
   * True, and more than this episode can show: filed on the player's word,
   * a bet on this link. When a later answer traces it, that answer says the
   * player called it, and when.
   */
  readonly hunch?: string;
  /**
   * A hunch with circumstance behind it: when the proof tabled includes any
   * of `by`, the reply says so, rather than treating a reasoned guess as a
   * wild one (it still can't trace the link).
   */
  readonly backed?: { readonly by: readonly string[]; readonly reply: string };
  /** Hunches this claim proves, as "question:claim": it says the player called it. */
  readonly pays?: readonly string[];
  /**
   * Said this way, it isn't filed: the reply says what the phone shows
   * instead. For the near miss that deserves a pointed answer, not "no".
   */
  readonly refuse?: string;
  /** The line that lands first, large, before the reply: the reveal itself. */
  readonly moment?: string;
  /**
   * A refusal that stops refusing once any of these routes has all been
   * seen: then the next claim with the same words is the one (Q1's "me",
   * "Not yet.", until the parcel and his account agree).
   */
  readonly liftedBy?: readonly (readonly string[])[];
  /** Filed on the words alone: nothing to table (the last question's "Sameer Khurrana"). */
  readonly free?: boolean;
  /** Filing it leans one way (RAAKH-V3 §14); a story-wide rule may add to it. */
  readonly impulse?: Impulse;
  /** The last question: the ending this files, and the one line that says what it means before it's done. */
  readonly ending?: string;
  readonly confirm?: string;
  /** Not offered once any of these holds (the Trade, once Bhasin's car has gone). */
  readonly unless?: readonly Flag[];
};

/**
 * A question asked as a sentence the player finishes (script §12: the
 * inference is theirs). Each blank is written {name} in the line, and offers
 * its words in order; which claim the finished sentence files is decided by
 * the claims' `words`.
 */
export type Say = {
  readonly line: string;
  readonly blanks: Readonly<Record<string, readonly string[]>>;
  /**
   * Where each word is learned, Golden Idol's way: a word listed here is
   * offered only once one of these pieces of evidence has been seen, so a
   * name nobody has met, or a twist nobody has found, never sits in the
   * list waiting to be picked. An entry can also be a whole flag
   * ("did:answered-raju": a call that said the name aloud). Words not listed
   * are plain words, always offered.
   */
  readonly learn?: Readonly<Record<string, readonly string[]>>;
};

/** One row on a timeline: an event, the lane it belongs in, and what shows it. */
export type TimelineRow = {
  readonly id: string;
  readonly at: string;
  readonly text: string;
  readonly lane: string;
  /**
   * A second lane that is just as true: Nitin's 1:40 is his message and the
   * car's arrival both (PLAYTEST-SHAGUN.md #53).
   */
  readonly orLane?: string;
  readonly evidence: string;
  /**
   * Doesn't fit the story somebody told: once the board is filed, the row
   * lights, and nothing says why (PLAYER-JOURNEY Stage 7).
   */
  readonly odd?: boolean;
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
  /**
   * Sameer's version and the truth can both be filed here, and which one
   * stands is read back: "Your story held on N of 4" (RAAKH-V3 §12).
   */
  readonly contestable?: boolean;
  /** Filed, it can be filed again (as a hunch) until any of these holds: Q1, until the reveal. */
  readonly editable?: readonly Flag[];
  /** The last question: asked once the night is over, in the first person. Filing it ends the chapter. */
  readonly final?: boolean;
  /** A heading over the question, when it isn't "Open question": "Q1, again". */
  readonly eyebrow?: string;
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
  /**
   * The same truth without a witness's name in it, for a player who promised
   * to keep it out (the record's "Without his name").
   */
  readonly unnamed?: string;
  /**
   * Traced by what the player found or did, without a question to answer it
   * (Last Local): any one of these sets of flags, all holding.
   */
  readonly when?: readonly (readonly Flag[])[];
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
      /**
       * What the board needs on it before it can prove anything: any one of
       * these routes, all found. Without it, a board holding a single row
       * would "prove" the whole question.
       */
      readonly enough?: readonly (readonly string[])[];
      /**
       * Once every row is in its lane, the board asks this, and the player
       * marks the rows (`odd`) that can't all be true at once. The game
       * never lights them for anybody.
       */
      readonly contradiction?: string;
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
      /** Asked as a sentence to finish, rather than a list of claims to choose from. */
      readonly say?: Say;
      /**
       * When these hold, a version on file is struck from the record by what
       * the player proved since: no Revisit to file, the line just crosses
       * out (the next episode answers the last one's question).
       */
      readonly struckWhen?: readonly Flag[];
    });

/** Something the story does to a phone on its own: a message, a notification. */
export type LiveEvent = {
  readonly id: string;
  readonly device: DeviceId;
  readonly after: readonly Flag[];
  /** Never plays once any of these is true: what the player did made it someone else's moment. */
  readonly unless?: readonly Flag[];
  /** Seconds after the last flag in `after` landed. */
  readonly delay?: number;
  /**
   * Waits for the phone to be put down: its `delay` only runs on the home
   * screen, with no app open and nothing in the player's hand. For a turn of
   * the night, so an episode never ends under someone reading.
   */
  readonly quiet?: boolean;
  readonly app: AppId;
  readonly banner?: string;
  /** Whose icon the banner wears, when it isn't the app's own. */
  readonly icon?: AppId;
  /** Something that arrived while nobody was looking: it goes into the list at this time, with no banner. */
  readonly at?: string;
  readonly sets?: readonly Flag[];
  /**
   * Where the story's clock stands once it has happened, as "00:51": with
   * `Story.beats`, the clock moves only at beats and at events like this one.
   */
  readonly clock?: string;
  /**
   * Happens on the phone itself (a low-battery warning, a note being
   * written): airplane mode doesn't hold it back. Everything else waits for
   * the network when the story's airplane mode can be switched off again.
   */
  readonly local?: boolean;
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
  /** Where the lock screen's clock stands for it, as "06:40", when `at` isn't itself a time (T21). */
  readonly clock?: string;
  /** The lock screen's day and date from this line on, when the ending moves past the night's own ("29/12", "Monday"). */
  readonly day?: { readonly day: string; readonly date: string };
  /** Somebody saying it, as a message. Without one, it is narration. */
  readonly who?: string;
  /** A photograph they send with it: the ending's last image, once it exists. */
  readonly src?: string;
  /** A voice note they send: its recording ("ending:<id>" in `Story.voices`), played as it lands; the text is what it says. */
  readonly voice?: string;
  /** A printed notice they send, drawn as the notice (the reprinted LAPATA poster). */
  readonly poster?: Extract<NonNullable<Message["attachment"]>, { kind: "poster" }>;
  readonly needs?: readonly Flag[];
  readonly any?: readonly Flag[];
  readonly unless?: readonly Flag[];
  /**
   * How it's shown, when it isn't a notification or a line under the clock
   * (RAAKH-V3 §6): `card`, white serif on black; `media`, full screen and
   * played through once (`film`, `src`, `captions`); `final`, the ending's
   * last photograph, full bleed; `cold`, the cold open again, as it was;
   * `parcel`, the waybill coming back (`text` is its attempt line);
   * `statement`, said to his own camera, assembled from what was filed
   * (one line each, read off the save, shown together); `glow`, a
   * notification seen through an envelope's paper.
   */
  readonly kind?: "card" | "media" | "final" | "cold" | "parcel" | "statement" | "glow";
  readonly film?: string;
  readonly seconds?: number;
  readonly captions?: readonly Caption[];
};

/**
 * One beat of the player's night, on the end card's timeline: when, what they
 * did, and the same without spoilers for the share (`share`; left out of the
 * share when there's none). Read off the save like an ending line.
 */
export type NightBeat = {
  readonly at: string;
  readonly text: string;
  readonly share?: string;
  readonly needs?: readonly Flag[];
  readonly any?: readonly Flag[];
  readonly unless?: readonly Flag[];
};

/** Recorded voices, by what they belong to ("voice:m-1", "call:raju:0"): a file, and how long it runs. */
export type Voices = Readonly<Record<string, { readonly src: string; readonly seconds: number }>>;

/** What the player does with the record: send it, post it, or give the phone back unread. */
export type Act = "send" | "post" | "return";

/** Set by the story when everything the player did should now decide the ending (`Ending.when.flags`). */
export const RESOLVE = "did:resolve" as const;

/** One of the things a player can do with what they know. */
export type Ending = {
  readonly id: string;
  readonly row: string;
  /**
   * When it's the ending: the act, and what the record held. The first
   * ending in the story's order whose rule fits is the one.
   */
  readonly when: {
    /** Chosen by an act on your phone (Shagun's send, post or return). */
    readonly acts?: readonly Act[];
    /**
     * Or chosen by what the player did, once the story says it's over
     * (`RESOLVE`): all of `flags`, none of `not`, the first that fits.
     */
    readonly flags?: readonly Flag[];
    readonly not?: readonly Flag[];
    /** Links that must be traced and left in. */
    readonly in?: readonly string[];
    /** Links that must still be untraced. */
    readonly untraced?: readonly string[];
    /** No untraced link may go in as fact. */
    readonly noFacts?: boolean;
  };
  /** What happens afterwards, a line at a time. */
  readonly lines: readonly EndingLine[];
  /** The last image: who says what, before the black. */
  readonly last: readonly EndingLine[];
  /** The one thing only this ending shows, for the end card. */
  readonly onlyHere: string;
  /** The end card's headline and the line under it (RAAKH-V3 §11), and lines the night adds to it. */
  readonly headline?: string;
  readonly line?: string;
  readonly notes?: readonly EndingLine[];
  /** Whose lock screen it plays on: his phone (the default), or the plainer one that slides up (`yours`). */
  readonly on?: "his" | "yours";
  /** The ending's own day and date on the lock screen, before any line moves it. */
  readonly day?: { readonly day: string; readonly date: string };
};

export type Clock = {
  /** The story's own time when an episode opens, as "23:40". */
  readonly base: string;
  readonly day: string;
  /**
   * Its date, "29/11". The first clock's day and date anchor the phone's
   * calendar: a weekday written anywhere in the story means that weekday in
   * the week ending on the first night.
   */
  readonly date: string;
  /** The found phone's battery when it opens. */
  readonly battery: number;
  /** On the player's charger: the battery climbs a point a minute from `battery`. */
  readonly charging?: boolean;
  /** The battery falling with the beats rather than with a timer: the last step whose flag is set wins. */
  readonly drain?: readonly { readonly after: Flag; readonly battery: number }[];
  /** Under the episode's title card, smaller: what this minute was a week ago. */
  readonly card?: string;
  /** The day and date once the clock has passed midnight, when the episode opens before it. */
  readonly after?: { readonly day: string; readonly date: string };
  /** On the charger with `Story.beats`: points gained per minute of the story's clock. */
  readonly rate?: number;
};

/** Waiting on the found phone's lock screen before anything arrives. */
export type LockNotice = {
  readonly key: string;
  readonly app: AppId;
  readonly from: string;
  readonly text: string;
  readonly english?: string;
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

export type HomeIcon = {
  readonly app: AppId;
  readonly label: string;
  /**
   * Offloaded (Settings › General › iPhone Storage): the app is gone and its
   * data kept, and the icon wears a cloud. Tapped, it downloads again, but
   * only once these hold; before that the App Store says it can't.
   */
  readonly offloaded?: readonly Flag[];
};

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
  | {
      readonly kind: "photo";
      readonly label: string;
      readonly src?: string;
      /** A screenshot of a chat, drawn as the chat itself (2026-10-24). */
      readonly shot?: {
        readonly name: string;
        readonly sub?: string;
        readonly lines: readonly { readonly who?: string; readonly text: string; readonly english?: string; readonly at: string; readonly out?: boolean }[];
      };
      /** A screenshot of a live location on a map: who, when, where it stopped (2026-10-24). */
      readonly map?: { readonly title: string; readonly sub: string; readonly stop: string; readonly ended: string };
    }
  | { readonly kind: "voice"; readonly seconds: number; readonly transcript: string; readonly english?: string }
  | {
      readonly kind: "video";
      readonly label: string;
      readonly seconds: number;
      /** The poster frame, once the footage exists. */
      readonly src?: string;
      /** The footage, picture and sound (an mp4 under public/), once it exists. */
      readonly film?: string;
      readonly captions?: readonly Caption[];
    }
  /**
   * A printed missing-person notice, the kind a family makes at a cyber café
   * and forwards to every group they're in: drawn as the notice itself, with
   * its photograph a silhouette until the shoot (ROADMAP S11).
   */
  | {
      readonly kind: "poster";
      readonly label: string;
      /** The word across the top, in the script it was printed in: "लापता". */
      readonly heading: string;
      readonly subheading?: string;
      readonly name: string;
      readonly lines: readonly string[];
      /** Where to call, masked like every number here. */
      readonly contact?: string;
      /** His photograph, printed: a silhouette until there is one. */
      readonly src?: string;
      /** Lines that are new since the last printing, marked by hand (indexes into `lines`). */
      readonly marked?: readonly number[];
      /** Written over it in ballpoint, the heading struck through: "MIL GAYA". */
      readonly found?: string;
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
  /**
   * Arrives with this live event (or the reply of this id), during the
   * player's night: shown at the story's time when it arrived, not at `at`,
   * so nothing is ever stamped in the future (PLAYTEST.md #46).
   */
  readonly with?: string;
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
  /** How long "typing…" shows before it arrives, in seconds, when it takes someone longer than usual. */
  readonly typing?: number;
  /**
   * A link in the message that does something on the player's own phone: the
   * courier's "Book a return pickup" opens giving the phone back (`return`).
   */
  readonly link?: { readonly label: string; readonly to: "return" };
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
  /** Never shown once any of these holds: the other version of the same message. */
  readonly unless?: readonly Flag[];
};

/**
 * What the player can say, when the story lets them say anything at all.
 * Never generated, always picked from a list.
 */
export type ReplyOption = {
  readonly id: string;
  readonly text: string;
  readonly english?: string;
  /** Only on offer once these hold: nobody says what they can't yet back up. */
  readonly requires?: readonly Flag[];
  readonly sets?: readonly Flag[];
  /** What comes back, and when. */
  readonly then?: readonly Message[];
  /** Which Sameer said it, and how much (RAAKH-V3 §14). */
  readonly impulse?: Impulse;
  /** On a call: the conversation goes on, with another exchange, once the answer has been heard. */
  readonly next?: Reply;
  /** Not on offer once any of these holds. */
  readonly unless?: readonly Flag[];
  /** Only on offer once at least one of these holds. */
  readonly any?: readonly Flag[];
};

export type Reply = {
  readonly id: string;
  readonly requires?: readonly Flag[];
  /** Closed for good once any of these holds: the other side has stopped talking. */
  readonly unless?: readonly Flag[];
  readonly prompt?: string;
  /** On a call, what the other side says before this exchange's options (`ReplyOption.next`). */
  readonly before?: IncomingCall["lines"];
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
  /** "yours:chats" is the player's own phone's messages. */
  readonly app: Extract<AppId, "whatsapp" | "messages" | "instagram" | "yours:chats">;
  /** Messages keeps what it doesn't trust in another folder, out of sight. */
  readonly folder?: "inbox" | "junk";
  readonly name: string;
  /** What the list shows under the name when it isn't the last message. */
  readonly sub?: string;
  /** The header's line once the story says otherwise: the number that was "last seen Tuesday" is online tonight. */
  readonly subLater?: { readonly after: readonly Flag[]; readonly sub: string };
  readonly group?: boolean;
  readonly pinned?: boolean;
  /** Unsaved numbers show as numbers, which is how two of them get confused. */
  readonly number?: string;
  /** Their profile photo, where they've set one; without it, WhatsApp's grey silhouette. */
  readonly avatar?: string;
  /**
   * How many of its last messages from the other side were still unread
   * when the phone reached the player: what WhatsApp's count says before
   * anyone opens the chat. Whatever arrives during the night adds to it.
   */
  readonly unread?: number;
  /** Moved out of the list into Archived, which is one tap further than most people look. */
  readonly archived?: boolean;
  /**
   * WhatsApp's Chat Lock with "Hide locked chats" on: out of the list
   * altogether, until the secret code (`Story.chatLock`) is typed into search.
   */
  readonly locked?: boolean;
  /** What tapping the name at the top shows: WhatsApp's contact info. */
  readonly contact?: {
    readonly number: string;
    /** The "About" line its owner wrote. */
    readonly about?: string;
    readonly evidence?: string;
  };
  readonly messages: readonly Message[];
  /**
   * What the player may say back, once they have something to say: one
   * exchange at a time, each opening when its `requires` hold. A newer one
   * lets an unanswered older one lapse, as a conversation moves on.
   */
  readonly replies?: readonly Reply[];
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
  /** `paper` draws a page; `scene` draws a photograph; `chat` a screenshot of a chat (`chat`). */
  readonly kind: "paper" | "scene" | "chat";
  /** A screenshot of a chat: its name at the top and the messages it caught, each of which can count. */
  readonly chat?: {
    readonly name: string;
    readonly sub?: string;
    readonly lines: readonly {
      readonly who?: string;
      readonly text: string;
      readonly english?: string;
      readonly at: string;
      readonly system?: boolean;
      readonly evidence?: string;
    }[];
  };
  readonly title: string;
  readonly src?: string;
  /** What is written on the page, in the writer's hand. */
  readonly lines?: readonly string[];
  readonly caption?: string;
  /** What Info says took it: "iPhone 14 Pro — Back Camera". */
  readonly camera?: string;
  /** A video: its length and its words. */
  readonly video?: {
    readonly seconds: number;
    readonly captions: readonly Caption[];
    /** The footage, picture and sound (an mp4 under public/), once it exists. */
    readonly film?: string;
  };
  /**
   * A clip cut down from something longer, and saying so as Photos does
   * ("Trimmed"): the door, never what's behind it (ROADMAP T8).
   */
  readonly trimmed?: boolean;
  /** Taken in landscape: the viewer shows it wide rather than cropping it to portrait. */
  readonly wide?: boolean;
  /**
   * Edited on the phone, and iOS kept the original: Edit › Revert brings it
   * back, and with it whatever the edit cut (`evidence`).
   */
  readonly original?: { readonly seconds: number; readonly captions: readonly Caption[]; readonly evidence?: string; readonly film?: string };
  readonly favorite?: boolean;
  /** In the Hidden album, which Photos shows only once Settings says to (`SHOW_HIDDEN`). */
  readonly hidden?: boolean;
  /**
   * Kept in iCloud rather than on the phone (Optimize iPhone Storage): a
   * blurred thumbnail is all that's here, and opening it can't load the rest
   * until these hold.
   */
  readonly inCloud?: readonly Flag[];
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

/** A post on an Instagram profile: a photograph, or a card of words on a colour. */
export type ProfilePost = {
  readonly id: string;
  /** What the picture shows: its alt text, and what's drawn until there's a photograph. */
  readonly title: string;
  readonly src?: string;
  /** A post that's words on a colour (a story shared to the grid, a fever), drawn in this tint. */
  readonly card?: string;
  readonly caption?: string;
  readonly english?: string;
  /** When it went up, as Instagram says it: "6 days ago". */
  readonly when?: string;
  /** Taken off the grid by its owner and kept in their Archive, which only they can see: when, as Instagram says it. */
  readonly archived?: string;
  /** Where, as the post's header says it: "Banyan Farms · 12:24 AM". */
  readonly place?: string;
  readonly likes?: number;
  readonly comments?: readonly { readonly who: string; readonly text: string; readonly english?: string }[];
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
  /** The profile photo; without one, the initials. */
  readonly avatar?: string;
  readonly followers?: string;
  readonly following?: string;
  /** A private account: the head and the bio, and "This account is private" for the grid. */
  readonly private?: boolean;
  /** How many posts a private account says it has. */
  readonly postCount?: number;
  readonly posts: readonly ProfilePost[];
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
  /** Notes shows the owner's own hint once a wrong password has been tried. */
  readonly hint?: string;
  /** When the password can be known from what's on the phone: a solver unlocks it then, and not before. */
  readonly knownAfter?: readonly Flag[];
  /** Still coming down from iCloud until these hold: it won't open (RAAKH-V3 §7.8, "This note hasn't finished downloading"). */
  readonly downloadsAfter?: readonly Flag[];
  /** What is inside once it opens. */
  readonly inside?: readonly string[];
  /** Photos and videos put in the note, shown under its text once it opens. */
  readonly attachments?: readonly Photo[];
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

/** What the owner searched for, with the time: how a person thinks out loud. */
export type Search = {
  readonly id: string;
  readonly text: string;
  readonly at: string;
  readonly day: string;
  /** What the results page said, once the phone has the data to load it again. */
  readonly results?: readonly string[];
  /**
   * A page he read and Safari still has open in a tab: it shows without the
   * network, from the first minute (2026-10-23: the chat-lock help page, so
   * a player can see how locked chats are found).
   */
  readonly page?: { readonly site: string; readonly title: string; readonly lead?: string; readonly steps: readonly string[]; readonly note?: string };
  readonly evidence?: string;
  readonly requires?: readonly Flag[];
};

export type Recording = {
  readonly seconds: number;
  readonly lines: readonly { readonly who: string; readonly line: string; readonly english?: string }[];
};

/** An episode's way in: what the player filed before it, and tonight's briefing. */
export type Opener = {
  /** The questions whose filed claims are "Previously", in this order; unfiled ones are skipped. */
  readonly previously: readonly string[];
  /** Under "Find out": the episode's question, said as a phrase. */
  readonly objective: string;
  readonly against: string;
  readonly clock: string;
};

/** A minute on the case file's night strip, shown once any one of `when`'s flag sets is complete. */
export type NightMark = {
  readonly at: string;
  readonly label: string;
  readonly when: readonly (readonly Flag[])[];
  /** A tick without a caption: part of a cluster the caption beside it names. */
  readonly minor?: boolean;
  /**
   * Pinned as Sameer tells it, once any of these holds and `when` doesn't
   * (RAAKH-V3 §17: "Sameer says"); both holding, it's "Contradicted".
   */
  readonly says?: readonly (readonly Flag[])[];
  readonly saysLabel?: string;
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

/** A post on the player's own social app: somebody else's, about the night. */
export type FeedPost = {
  readonly id: string;
  readonly who: string;
  readonly handle: string;
  /** When it went up, as the feed says it: "2d", "Tuesday". */
  readonly when: string;
  readonly text: string;
  readonly english?: string;
  /** A picture or a clip, described until there's a real one. */
  readonly media?: string;
  /** The picture itself, once there is one. */
  readonly src?: string;
  /** A post that's words on a colour, drawn in this tint. */
  readonly card?: string;
  /** Shares, as the night goes on: in Episode 1, 2 and 3. */
  readonly shares: readonly [number, number, number];
  /** A comment or two under it, the way a feed shows the top ones. */
  readonly comments?: readonly { readonly who: string; readonly text: string; readonly english?: string }[];
  readonly requires?: readonly Flag[];
};

/**
 * The owner's trip, as a train app's Live Activity keeps it in the Dynamic
 * Island: the stations, and the flag that says the train is at each one.
 */
export type Route = {
  /** "Virar fast". */
  readonly train: string;
  readonly stations: readonly { readonly name: string; readonly at: string; readonly flag?: Flag }[];
};

/**
 * A moment the story stops for: the screen is the world, not a phone (the
 * doors at a station). The player chooses, against a clock if `seconds` is
 * set; when it runs out, `timeout` is chosen for them.
 */
export type Moment = {
  readonly id: string;
  readonly after: readonly Flag[];
  readonly unless?: readonly Flag[];
  /** The place and time, as a caption: "Vasai Road · 2:03 AM". */
  readonly where: string;
  readonly lines: readonly { readonly who?: string; readonly text: string; readonly english?: string }[];
  readonly options: readonly {
    readonly id: string;
    readonly text: string;
    readonly sets: readonly Flag[];
    readonly requires?: readonly Flag[];
    /** Not on offer once any of these holds. */
    readonly unless?: readonly Flag[];
    /** Whose face it is, when the choice is a person (a profile photo), or a mark when it isn't ("112"). */
    readonly face?: string;
    readonly glyph?: string;
  }[];
  readonly seconds?: number;
  readonly timeout?: string;
};

/** Find My, as the family shares it: who can see this phone, and where each of them is. */
export type FindMy = {
  readonly people: readonly {
    readonly name: string;
    readonly requires?: readonly Flag[];
    /** Where they are: the last step whose flag holds, as a station on the route (or a place). */
    readonly steps: readonly { readonly after?: Flag; readonly at: string; readonly note?: string }[];
    /** Following this phone. */
    readonly follows?: readonly Flag[];
  }[];
  /** Turning off Share My Location sets these. On this phone, nobody turns it back on. */
  readonly stopSharing: readonly Flag[];
};

/* --- Raakh v3 (RAAKH-V3.md, 27 Oct 2026) ----------------------------------
   The vocabulary for a chapter whose reader turns out to be its owner: a
   clock that moves only at authored beats, things the phone lets you delete,
   the two impulses a choice comes from, promises, the dark-screen moments,
   the reveal, and a last question asked in the first person. All optional:
   a chapter that doesn't name them plays as before. */

/**
 * A shot in "Previously" or "Next" (PG-PREV, PG-NEXT): what's on the screen,
 * and what's heard. Assembled from the save where it says so (`filed`,
 * `said`), and left out when the save has nothing for it.
 */
export type Shot = (
  | { readonly kind: "card"; readonly text: string; readonly sub?: string }
  /** A question's filed sentence, typed out. */
  | { readonly kind: "filed"; readonly question: string }
  /** A voice, heard, with its words. */
  | { readonly kind: "voice"; readonly who: string; readonly text: string; readonly english?: string; readonly voice?: string }
  /** What the player said in an exchange, quoted with the time they said it. */
  | { readonly kind: "said"; readonly reply: string; readonly to: string }
  | { readonly kind: "banner"; readonly from: string; readonly text: string; readonly english?: string }
  | { readonly kind: "battery"; readonly from: number; readonly to: number }
  | { readonly kind: "black"; readonly seconds?: number }
  | { readonly kind: "image"; readonly src: string; readonly blur?: boolean }
  | { readonly kind: "ring"; readonly from: string }
  | { readonly kind: "sound"; readonly text: string }
  | { readonly kind: "lock"; readonly digits: number }
  | { readonly kind: "bubble"; readonly who: string; readonly text: string; readonly english?: string; readonly at: string }
) & { readonly needs?: readonly Flag[]; readonly any?: readonly Flag[]; readonly unless?: readonly Flag[] };

/**
 * The screen goes dark for one line or one voice (PG-DARK, used three
 * times), or freezes on one bubble before an episode cuts to black.
 */
export type Dark = {
  readonly id: string;
  readonly after: readonly Flag[];
  readonly unless?: readonly Flag[];
  readonly line?: string;
  readonly sub?: string;
  /** A voice note on black: its waveform, and its words a line at a time. */
  readonly voice?: { readonly who: string; readonly key?: string; readonly seconds: number; readonly lines: readonly Caption[] };
  /** A message bubble, held, before the black. */
  readonly bubble?: { readonly who: string; readonly text: string; readonly english?: string; readonly at: string };
  readonly sets?: readonly Flag[];
};

/** Something said to the player at the reveal or before an ending, read off the save like an ending line. */
export type Said = {
  readonly who?: string;
  readonly text: string;
  readonly english?: string;
  readonly needs?: readonly Flag[];
  readonly any?: readonly Flag[];
  readonly unless?: readonly Flag[];
};

/** One of the player's own lines, for the reveal's montage: the flag that says they said it, and what it answered. */
export type MontageLine = { readonly said: Flag; readonly answering: Said };

/** The reveal (RAAKH-V3 §9, scene 3.10): nine steps, played in order, nothing else allowed in. */
export type Reveal = {
  readonly after: readonly Flag[];
  /** 1: a voice note, heard through. */
  readonly voice: { readonly who: string; readonly key?: string; readonly seconds: number; readonly lines: readonly Caption[] };
  /** 2: the second phone, ringing; declined, it rings twice more and texts. */
  readonly yours: { readonly call: IncomingCall; readonly text: string };
  /** 3: a call on this phone, ending on two buttons. */
  readonly call: IncomingCall;
  readonly look: { readonly open: string; readonly away: string; readonly awayLine: Said };
  /** The call's opening line instead, after an early reveal. */
  readonly early: Said;
  /** 4: his own face, from the front camera. */
  readonly camera: { readonly src: string; readonly alt: string };
  /** 5: the case file turns over: its info panel, and the line it lights. */
  readonly info: { readonly lines: readonly string[]; readonly question: string; readonly called: string };
  /** 6: the montage, from the player's own lines; at most `limit` of them, in this order of priority. */
  readonly montage: { readonly limit: number; readonly lines: readonly MontageLine[]; readonly cuts: readonly { readonly text: string; readonly src?: string; readonly sub?: string }[] };
  /** 7: what she says, by which Sameer read the phone, or after an early reveal. */
  readonly lines: { readonly confessor: Said; readonly auditor: Said; readonly early: Said };
  /** 8: the last dark screen, and the count under it ("{n} of {of}"). */
  readonly dark: { readonly line: string; readonly held: string };
  /** 9: the clock, on a card. */
  readonly card: string;
};

/** Something to do before an ending (RAAKH-V3 §10): a call, a message, a deletion, a line on the note. */
export type PreStep = {
  readonly id: string;
  readonly label: string;
  readonly requires?: readonly Flag[];
  readonly unless?: readonly Flag[];
  /** What's said, read off the save. */
  readonly lines?: readonly Said[];
  readonly sets?: readonly Flag[];
  /** A choice that must be made to go on with it (Raju, lied to, hears the truth first). */
  readonly choose?: readonly {
    readonly id: string;
    readonly text: string;
    readonly english?: string;
    readonly sets: readonly Flag[];
    readonly requires?: readonly Flag[];
    readonly unless?: readonly Flag[];
  }[];
  /** A clean-up row: this evidence, deleted for good. */
  readonly delete?: string;
};

/** The last question's endings: what comes before each, and what's echoed while choosing. */
export type Final = {
  readonly before: Readonly<Record<string, { readonly title: string; readonly steps: readonly PreStep[]; readonly go: string; readonly echo?: Said }>>;
  /** While the last question is open, besides answering it (call M, listen again). */
  readonly asides: readonly PreStep[];
};

/** An identity clue (RAAKH-V3 §15), for Look again: what, where, and when the player first saw it. */
export type Clue = {
  readonly id: string;
  readonly what: string;
  readonly where: string;
  /** Seen once any one of these sets of flags all hold. */
  readonly seen: readonly (readonly Flag[])[];
  readonly meant: string;
};

/** A promise the player can make (RAAKH-V3 §14), and what breaks it. */
export type Vow = {
  readonly id: string;
  readonly to: string;
  readonly text: string;
  readonly made: Flag;
  /** Broken once any one of these sets of flags all hold. */
  readonly broken: readonly (readonly Flag[])[];
};

export type Story = {
  /* Raakh v3, all optional (see above). */
  /** The clock moves only at these and at events with a `clock` (RAAKH-V3 §17). */
  readonly beats?: readonly Beat[];
  /** Airplane mode goes back off, and what's sent meanwhile waits rather than being lost. */
  readonly airplaneToggles?: boolean;
  /** The case file is a note on this phone: what it's called, when it was made, and what its info panel says. */
  readonly caseNote?: { readonly title: string; readonly created: string; readonly header: string; readonly when: readonly Flag[] };
  readonly reveal?: Reveal;
  readonly final?: Final;
  readonly dark?: readonly Dark[];
  /** The phone dying: an alert, two flickers, and someone's shape in the black glass (PG-DEATH). */
  readonly death?: { readonly after: readonly Flag[]; readonly alert: string; readonly cliff: Said };
  readonly clues?: readonly Clue[];
  readonly vows?: readonly Vow[];
  /** "Previously" before an episode, and "Next" after one, as shots. */
  readonly previously?: Readonly<Partial<Record<2 | 3, readonly Shot[]>>>;
  readonly teasers?: Readonly<Partial<Record<1 | 2, readonly Shot[]>>>;
  /** The two impulses (RAAKH-V3 §14): their names on the end card, and what besides choices counts. */
  readonly impulse?: {
    readonly labels: { readonly auditor: string; readonly confessor: string };
    readonly version: number;
    readonly truth: number;
    readonly soft: number;
    readonly perm: number;
    readonly recover: number;
    readonly send: number;
  };
  /** Anything found can be sent to someone, once they've asked for it. */
  readonly sendTo?: { readonly name: string; readonly after: readonly Flag[]; readonly label: string; readonly thread: string };
  /** The camera: unavailable, with this alert, until these hold. */
  readonly camera?: { readonly unavailable: string; readonly after: readonly Flag[]; readonly src: string };
  /** The second phone, sliding up from the bottom edge (PG-YOURPHONE). */
  readonly yourPhone?: { readonly wallpaper: string };
  /** Putting it away before the reveal (RAAKH-V3 §11, Unopened). */
  readonly unopened?: { readonly before: readonly Flag[]; readonly ask: string; readonly card: string; readonly again: string };
  /** The end card's own words, so every narrated string is in the content (RAAKH-V3 §15). */
  readonly endCopy?: {
    readonly impulses: string;
    readonly held: string;
    readonly promises: string;
    readonly clues: string;
    readonly share: string;
  };

  readonly id: string;
  readonly title: string;
  /** Whose phone it is: the name on the account, and what transcripts call them. */
  /** Whose phone it is; `photo` is his Apple Account picture, at the top of Settings. */
  readonly owner: { readonly name: string; readonly short: string; readonly photo?: string };
  readonly episodes: readonly [string, string, string];
  readonly clocks: readonly [Clock, Clock, Clock];
  /**
   * Before the parcel, the first time: the night itself, heard and never
   * seen, in captions, the way every voice on the phone is shown. Nobody in
   * it is named; what it plants pays off later (ROADMAP T1).
   */
  readonly coldOpen?: {
    readonly where: string;
    readonly lines: readonly {
      /** Who speaks, as a caption names someone it can't see: "A VOICE". Without one, it's a sound. */
      readonly who?: string;
      readonly line: string;
      readonly english?: string;
      /** A shot: the screen flashes, and a phone that can buzz does. */
      readonly flash?: boolean;
    }[];
    readonly after: string;
    /** What's heard under it: a wedding far off (the default), or the train you're on. */
    readonly bed?: "dhol" | "train";
  };
  readonly arrival: Arrival;
  /**
   * Found on a seat rather than in a parcel: no label, no note, the phone
   * face down and buzzing. The note scene is skipped (`did:unlock` at once).
   */
  readonly seat?: { readonly line: string; readonly note: string; readonly act: string };
  /** Heard under the whole chapter, low: the train (Last Local). */
  readonly ambience?: "train";
  /** Said on the parcel before anything is opened: what's in it (RAAKH-V3 §7, scene 1.0). */
  readonly warning?: string;
  /** False: no case file, no questions. The story is played through the phone. */
  readonly caseFile?: false;
  /** What the home screen's widget says instead of a question: the last line whose `requires` hold. */
  readonly status?: readonly { readonly text: string; readonly requires?: readonly Flag[]; readonly unless?: readonly Flag[] }[];
  readonly route?: Route;
  readonly moments?: readonly Moment[];
  readonly findMy?: FindMy;
  readonly gate: Gate;
  readonly lockScreen: readonly LockNotice[];
  /**
   * WhatsApp's secret code for its hidden locked chats, and when a player can
   * know it: any one of these sets of flags (for a solver and for tests).
   * `requires`: until these are all set, the code opens nothing, so a code
   * passed on by a friend can't skip an episode.
   */
  readonly chatLock?: { readonly code: string; readonly knownWhen: readonly (readonly Flag[])[]; readonly requires?: readonly Flag[] };
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
  /**
   * Safari before its layer opens (2026-10-26): it reopens on its last tab,
   * which can't reload on the day's data, and its History stays behind it
   * until every flag in `until` is set.
   */
  /**
   * The night it all happened, beside the player's own (2026-10-26): a strip
   * in the case file that pins the few minutes that matter as they're
   * traced, with tonight's clock running under it, a week later.
   */
  readonly timeline?: {
    readonly thatNight: string;
    readonly tonight: string;
    /** The strip's span, as clock times; the night turns at noon (`nightly`). */
    readonly from: string;
    readonly to: string;
    readonly marks: readonly NightMark[];
    /** Tonight's own marks: where each episode opened. */
    readonly now: readonly NightMark[];
  };
  /**
   * What the player's own night is called wherever its clock is shown (title
   * cards), when the story's past runs on the same clock: "Tonight".
   */
  readonly nowLabel?: string;
  readonly safariWaits?: { readonly until: readonly Flag[]; readonly site: string; readonly note: string };
  readonly calls: readonly CallEntry[];
  readonly settings: readonly SettingsGroup[];
  readonly questions: readonly Question[];
  readonly events: readonly LiveEvent[];
  /** The night's chain of responsibility, in order: the score and what the endings read. */
  readonly chain: readonly Link[];
  /** Flags the funnel counts by name ("did:raju-answered" → "raju-answered"): the chapter's own choices. */
  readonly choices?: readonly Flag[];
  readonly endings: readonly Ending[];
  /**
   * The end card's replay image, the same for everyone: a note on the phone,
   * its cursor still blinking after the last line, and one line under it.
   */
  readonly replay?: { readonly note: string; readonly caption: string };
  /**
   * "Look again", once it's over (script §20: the urge to reopen earlier
   * evidence): what was on the phone from the first minute, where, and what
   * it turned out to mean (CHAPTER1.md K1).
   */
  readonly lookAgain?: readonly { readonly what: string; readonly where: AppId; readonly meant: string }[];
  /**
   * What comes next, on the end card: the next case, as it reaches the
   * player (canon §21: a new mystery, never the missing half of this one).
   */
  readonly next?: {
    readonly title: string;
    readonly from: string;
    readonly lines: readonly { readonly text: string; readonly english?: string }[];
    readonly note: string;
    /** The next case already exists: where to play it. */
    readonly href?: string;
    readonly cta?: string;
    /** Its teaser, ten seconds, vertical (scripts/trailers.py). */
    readonly trailer?: string;
  };
  /**
   * Outside the fiction: the end card's last, quiet screen. Every line
   * checked at its source before it's written here (CHAPTER1.md L).
   */
  readonly outside: readonly { readonly text: string; readonly tel?: string; readonly source?: string }[];
  /**
   * What the player is doing tonight, said once at the top of the case file
   * until the first answer is filed (2026-10-24: a newcomer was never told).
   */
  readonly brief?: { readonly title: string; readonly lines: readonly string[] };
  /**
   * The last hour: once everything's asked, the night stops for the player
   * to decide what happens to the record (`did:last-hour`), full screen.
   */
  readonly finale?: {
    readonly when: string;
    readonly line: string;
    readonly sub: string;
    /** The same, once the night's decider has gone one way or the other (`fate`). */
    readonly after?: { readonly yes: string; readonly no: string };
  };
  /**
   * What the night's last hours decided, said first on the end card and in
   * the share (2026-10-24): set by `yes` or `no`, in the chapter's words. The
   * share line names nothing ("I got there before seven").
   */
  readonly fate?: {
    readonly yes: Flag;
    readonly no: Flag;
    readonly headline: { readonly yes: string; readonly no: string };
    readonly share: { readonly yes: string; readonly no: string };
    /** How everyone else's night went, once enough have played: "{yes}" is the percentage who got there. */
    readonly others?: string;
  };
  /** What's said aloud on the phone, recorded: see `Voices`. Without it, the captions are the sound. */
  readonly voices?: Voices;
  /**
   * Real-time mode (2026-10-24), offered at the parcel: from `after`, the
   * story's deadline runs on a real clock of `seconds`, shown over the phone
   * with what it's counting to. Tapping it sets `go`; running out sets `out`.
   */
  readonly realtime?: {
    readonly offer: string;
    readonly after: readonly Flag[];
    readonly seconds: number;
    /** The story's own clock at the start and at the deadline, as "02:58" and "07:00". */
    readonly from: string;
    readonly to: string;
    readonly label: string;
    readonly hint: string;
    readonly act: string;
    readonly go: readonly Flag[];
    readonly out: readonly Flag[];
    /** The live event it starts from (`event:<id>` in the save); "seven-clock-real" by default. */
    readonly event?: string;
    /** Stops it, without running out, once any of these holds (the last question filed). */
    readonly stop?: readonly Flag[];
  };
  /**
   * While the night's decider is coming (2026-10-24 QA): from `after` until
   * `until`, the record can't be sent or posted, and the case file and the
   * home screen say why. Without it, a player could file the record in the
   * minute between the twist and the calls, and skip the climax.
   */
  readonly hold?: { readonly after: readonly Flag[]; readonly until: readonly Flag[]; readonly note: string; readonly widget: string };
  /** The player's own night, as a timeline for the end card (2026-10-24): see `NightBeat`. */
  readonly night?: readonly NightBeat[];
  /**
   * The end of an episode, said as one (2026-10-23: "episode 1 seems to end
   * abruptly"): the line it ends on, and the questions the next one opens.
   * Keyed by the episode that's ending.
   */
  readonly recaps?: Readonly<
    Partial<
      Record<
        1 | 2,
        {
          readonly cliff: string;
          readonly english?: string;
          readonly who?: string;
          readonly open: readonly string[];
          /** "Found so far" (RAAKH-V3 §7.12): the questions whose filed sentences the card reads back. */
          readonly filed?: readonly string[];
          /** The card's last line, said plainly. */
          readonly last?: string;
        }
      >
    >
  >;
  /**
   * Before a later episode's title (2026-10-26, Q4 of the perfection pass):
   * "Previously", in the player's own filed words (Life is Strange, Telltale),
   * then tonight's briefing (Hitman, Alan Wake 2's board): what to find out,
   * what's still open (the ending recap's `open`), who's against you, and the
   * clock. Keyed by the episode that's starting.
   */
  readonly openers?: Readonly<Partial<Record<2 | 3, Opener>>>;
  /**
   * Instagram's home feed and Explore: other people's posts, and the night
   * spreading in public (RAAKH, since 2026-10-23, where it replaced your phone).
   */
  readonly feed?: readonly FeedPost[];
  /**
   * Closing the case from the case file (RAAKH): the record's first line, who
   * it can be sent to, where it can be posted, and giving the parcel back.
   */
  readonly close?: {
    readonly intro: string;
    readonly sendTo: string;
    /** Why the player can reach them: "Her number is on the parcel's label." */
    readonly sendNote: string;
    readonly postTo: string;
    readonly postNote: string;
    readonly parcel: { readonly note: string; readonly act: string; readonly ask: string };
  };
  /** Your phone: the app the draft post lives in, its first line, and who a record can be sent to, once they're known. */
  readonly yours?: {
    /** The social app the draft lives in; none, and your phone is Messages alone. */
    readonly social?: string;
    readonly intro: string;
    readonly sendTo: string;
    readonly sendRequires: readonly Flag[];
    /** The parcel, and giving the phone back: what it says, what the act is called, and what it asks first. */
    readonly parcel: { readonly note: string; readonly act: string; readonly ask: string };
    /**
     * The social app's feed: the night, spreading in public, with the
     * player's unposted draft at the top. What makes posting early tempting
     * (CHAPTER1.md H: publish early theory).
     */
    readonly feed?: readonly FeedPost[];
    /** What's trending above the feed: the last line whose `requires` hold. */
    readonly trending?: readonly { readonly text: string; readonly requires?: readonly Flag[] }[];
  };
};
