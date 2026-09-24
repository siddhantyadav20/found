# Found — Build plan
## The pivot to *Shagun* (2026-09-22)

Chapter One is now *Shagun*: Sameer Khurana's phone, a Delhi wedding, a
shooting, a cover-up. The canon is [SCRIPT.md](SCRIPT.md); the game
adaptation is [CHAPTER1.md](CHAPTER1.md); the experience rules are
[PLAYER-JOURNEY.md](PLAYER-JOURNEY.md); the decisions are
[PROJECT.md](PROJECT.md).

*Don't Cut the Call* (P0–P12, playtested 2026-09-19) is retired to git
history, like Low Battery and The Blue Room. Its last commit is `1de34a2`.

**How a phase ends:** typecheck, lint, tests, build, budget; walk it in the
browser at 375 × 812; tick this file; commit when Siddhant says.

---

## The shape of the rebuild

| | Module | What it is |
|---|---|---|
| **S0** ✔ | Canon and docs | SCRIPT.md, the adaptation, the journey, this plan, the assets list |
| **S1** ✔ | Retire | Remove *Don't Cut the Call*; one case, `shagun` |
| **S2** ✔ | Story-agnostic engine | No call, courier, charger or ending ids baked in (mostly in S1, the rest folded into S3) |
| **S3** ✔ | The chain and the record | Links, claims, Sameer's version, Revisit, the multi-lane board |
| **S4** ✔ | His phone | Photos with media, Voice Memos, WhatsApp's archive, Mail, Paytap |
| **S5** ✔ | Arrival | Parcel, envelope, the note, the phone waking, the charger |
| **S6** ✔ | Episode 1 | *Missed Calls* as data |
| **S7** ✔ | Episode 2 | *The Second Shot* as data |
| **S8** ✔ | Episode 3 | *The Cancelled Rescue* as data, and the people's routes |
| **S9** ✔ | The record and the endings | Your phone, the draft, A/B/C/Return, the end card |
| **S10** | Growth | Pass it on, drops, share images, The First Minute |
| **S11** | The real assets | ASSETS.md: photographs, clips, voices, handwriting |
| **S12** | Ship-ready | The chapter held to its laws, a budget, a human playtest |

S1 was the only destructive phase; it ran on 2026-09-23, once Siddhant had
read the adaptation.

---

## S0 — Canon and docs · **done (2026-09-22)**

- `SCRIPT.md`: the .docx word for word (checked: no word lost), never edited.
- `CHAPTER1.md`: the adaptation, with a canon trace appendix (N) covering
  script §5, §7, §11, §15, §16, §18, §20 and §21.
- `PLAYER-JOURNEY.md`, `PROJECT.md`, `ASSETS.md` and `README.md` rewritten for
  *Shagun*.
- A `.docx` of the adaptation beside the original in Downloads.

---

## S1 — Retire *Don't Cut the Call* · **done (2026-09-23)**

**Built:** the last commit of the old chapter is tagged `dont-cut-the-call`
(`1de34a2`). Deleted: `content/dont-cut-the-call/`, the live call
(`components/call/*`, `lib/game/call.ts`), `SeenByThem`, `Morning`, the old
acts and last images (`Acts`, `Last`, `parts`, `CutSlider`), The First Minute
(`components/minute/*`, `app/first-minute/`, its share card and events),
PikDrop, City Desk and the Instagram story, and the old chapter's
episode, call and blocker tests. One case, `shagun`, is the stub in
`content/shagun/` (real arrival, clocks, lock screen and home screen; empty
episodes). Saves are `found:shagun:save`, version 4.

**Kept and made neutral rather than deleted** (the plan said delete; each was
cheaper to keep than to rebuild): the pouch is now `Parcel` (the tear gesture,
the label with the content note and the promise); `Note` draws
`story.arrival`; `Charge` draws `story.gate`; `Away` and `TitleCard` share
`Interstitial.module.css`, and the title card now shows for every episode,
on its clock's minute.

**Pulled forward from S2, because removing the call broke them:** the table
has no call and no banner suppression; the lock screen's waiting notices are
`story.lockScreen`; the battery curve is `Clock.drain` and `Clock.charging`;
`Story.owner` names whose phone it is; `Ending.id` is a string and `endings`
a list; the funnel's `end:<id>` events and the "what others did" buckets come
from the story's endings; `Choice`, `Aftermath` and `EndCard` are generic
(the rows finish directly until S9 builds the acts); the day shown in chats
is the story's own day. The case's share question is `CaseMeta.ask`
("Where does it end?").

**Tests:** `chapter.test.ts` keeps the laws (vacuous until S6); new
`scene.test.ts` holds the flow (parcel → note → table, the gate, the title
cards, a call, the ending); `questions.test.ts` and `endings.test.ts` run on
made-up data. 55 tests. `/c/[case]` went from 646KB to 577KB.

**Walked** at 375 × 812 on the production build: desk, parcel, note, lock
screen, home, all nine apps, resume after reload; the charger gate and the
Episode 2 card on `next dev` (`?battery=unplugged` is dev-only).

## S2 — Story-agnostic engine · **done (S1 and S3)**

Most of it landed in S1 (see there). The rest went in with S3 on 2026-09-23:
`components/her` is `components/owner`; `DeviceId` is `"owner" | "yours"`,
`Story.hersHome` is `Story.home`, a message from the owner is
`from: "owner"`; a chapter's own choices are `Story.choices`, reported by
name. **Not done, on purpose:** declaring the scene order in the story. Since
S1 the sequence (parcel → note → table, the gate, title cards, a call, the
choice, the ending, the card) holds no chapter's names or flags, and S9 adds
the record's screen to it the same way.

## S3 — The chain and the record · **done (2026-09-23)**

**Built:**
- **The chain.** `Link` in `content/types.ts`; Shagun's eleven in
  `content/shagun/chain.ts` (CHAPTER1.md D, with Sameer's words and the
  English for each deep link). A link is traced when an answer sets
  `link:<id>`; `traced()` in `lib/game/engine.ts`.
- **Filing a claim** (question kind `file`): the player picks what they think
  happened and tables its proof. A claim marked `version` is Sameer's reading,
  filed like any other and never called wrong. Filed claims are flags
  (`claim:<question>:<claim>`); the last one stands.
- **Revisit.** `reopenWhen` brings a question back once the claim on file is
  a version and the contradicting evidence has been seen. `mustRevisit` puts
  it in front of everything (Q3); otherwise it waits on the side. The player
  strikes the old line with a button before the board returns, the struck line
  can't be filed again, and the record keeps it, struck through.
- **Side questions** (`optional`): offered under "Also open", never block an
  episode (QM).
- **Timelines with any number of lanes**, declared on the question; rows show
  in time order and a tap moves one to the next lane. *(The plan's "ordered"
  timelines were dropped: every row carries its time.)*
- **The record** (`CaseFile.tsx`): the open question, then "Also open", then
  every answer as a line with its sources, then what's been found.
- **The score.** `resultOf` counts links; the share line is "I traced N of 11
  links"; finishes keep `traced`; drops carry it, and the drop's share image
  prints it (`CaseMeta.links`, so the image never loads a story); the desk
  says "· N links traced"; a replay counts the chain live.
- **The end card** draws the chain, one row at a time: traced links in the
  record's words, untraced ones in Sameer's, then the count.
- **The ledger is gone** (`Exposure`, `expose`, `CaseState.ledger`,
  `ReplyOption.exposes`): the chain replaced it. Old version-4 saves load; their
  ledger is dropped.
- **The funnel** counts `claim:<q>:<c>` (which reading was filed) and
  `link:<id>` (how far past his version players get).

**Tests:** 66, one skipped until the episodes exist. They cover filing,
Revisit, `STRUCK`, must-vs-side revisits, side questions, lanes, the chain's
laws (eleven links, seven spine, a version on every deep link, never traced by
a version claim, and every link traceable once S6–S8 write questions), and the
share line.

**Walked** at 375 × 812 in dev, with a throwaway question on the real phone
(removed afterwards):
- file Sameer's version
- find the evidence against it, and see it offered as Revisit
- strike it, file the truth
- see the record with the struck line and sources
- place three rows in three lanes
- end card: 2 of 11 in the right words
- desk: "2 links traced"

## S4 — His phone · **done (2026-09-24)**

Current iOS, drawn by us, as before; everything story-driven from `content/`
(new: `Story.memos`, `mail`, `payments`, `profiles`, and on `Photo`: `src`,
`video`, `original`, `favorite`, `hidden`, `daysLeft`, `zoom`). The rules iOS
keeps whatever the chapter (what's in the bin, what Hidden shows and when,
what a clip plays before and after Revert) are pure, in `lib/game/phone.ts`.

| App | What it does now |
|---|---|
| **Photos** | Real images (`src`) or placeholders; video with captions (`components/owner/ios/Clip.tsx`, the pilot's player); Favorites and named albums; **Hidden** in Utilities once `SHOW_HIDDEN` is set; **Recently Deleted** with days left and Recover; Info with "Edited"; **Edit › Revert to Original** in a sheet, one way, and the original's evidence found by it; the pilot's **zoom that counts** on a photo with `zoom` |
| **Voice Memos** | New. All Recordings and **Recently Deleted** (Recover); a waveform player with ±15 s and captions (the pilot's Recorder) |
| **WhatsApp** | Group senders (`Message.who`); **one grey tick** (`ticks: "sent"`); quoted replies; video bubbles with captions; real photos; **Archived** at the top of Chats |
| **Instagram** | Profiles in rings (the owner's first); a profile's bio and three-across grid; a post opens with its caption |
| **Phone** | A run of calls as one row: "(47)" |
| **Settings** | One-way switches (`toggle`), on a row or on a page one level down (Apps › Photos › Show Hidden Album); pages are generic now, not a management profile's |
| **Mail** | New. Inbox, a letter, and its attachment as pages |
| **Paytap** | New, fictional. History in and out, a receipt each; the balance asks for a PIN, so it stays hidden |
| **Control Centre** | Pull from the top-right corner: airplane mode by hand (`AIRPLANE`), one way; the status bar shows the plane and data and Wi-Fi go dark |

**A law found on the walk:** opening an app finds everything in it that isn't
`manual`, so the fixture's deleted and hidden photos counted just by opening
Photos. `chapter.test.ts` now requires every piece of evidence behind a hard
route (the bin, Hidden, an original, a zoom, an archived chat) to be `manual`.

**Tests:** 74 (new `tests/phone.test.ts`: albums, Hidden, Recover, Revert,
memos, rupees). `/c/[case]` 624KB of 700KB.

**Walked** at 375 × 812 in dev on a throwaway fixture (removed afterwards):
- **Photos:** Collections before and after Settings showed Hidden; the fire
  clip from 9 s to 31 s on Revert, with Sameer's line and "Noted"; the
  portrait's zoom; the bin's "28 days" and Recover.
- **WhatsApp:** one grey tick, group names, a video with captions, Archived
  and a quoted reply.
- **Everything else:** Instagram profiles, Mail's PDF, Paytap, Voice Memos'
  bin, Recents' "(47)", and airplane mode.

**Left for S6–S8:** the content itself, and what airplane mode changes (which
people go quiet) is written with the routes in S8.

## S5 — Arrival · **done (2026-09-24)**

**Built:**
- **The envelope.** `Arrival.envelope` in the schema; Shagun's is the Sehgal
  shagun envelope (CHAPTER1.md O2, proposed). It's drawn in maroon with a gold
  border and the names in foil ("Ishita weds Rohan · Sehgal Parivar ·
  22.11").
- **Turning it over.** The player turns it over by hand (tap, or a sideways
  drag), a 3D flip, and the note is on the back: the flap, and the cream
  panel where people write who it's from, in a ballpoint-style hand. The
  English sits beneath, never on the note.
- **The phone.** Only then the phone: face-down, cracked at one corner, the
  ring/silent switch on its side. Turning it over buzzes it awake onto the
  lock screen with its missed calls.
- **The lock screen.** Sameer's placeholder wallpaper
  (`public/found/shagun-wallpaper.jpg`, fairy lights at night, 51KB). It
  replaces the retired chapter's Mumbai picture, which is deleted.
- **A replay.** The parcel sits already open ("OPENED", the postmark, the
  phone waiting) and "Take it out again" goes straight to the envelope
  (PLAYER-JOURNEY Stage 10).
- **Unchanged, already right since S1:** the label with the content note and
  the promise, the charger gate on `story.gate`, resume, and "You put it
  down" after a real gap.

**Still open:** the label's addressee ("TO —") waits on O1.

**Tests:** 75. `chapter.test.ts` now guards the canon note: addressed to M,
the local thana, Bhasin (script §8 beat 1).

**Walked** at 375 × 812 in dev:
- parcel, then envelope front, then flip
- the note on its back, then the cracked phone
- lock screen on the new wallpaper
- a replay's open parcel, then the envelope

No console errors.

## S6 — Episode 1 · **done (2026-09-24)**

**Decided with Siddhant: paced, with a hybrid.** What Sameer pointed M at is
in plain view from minute one (`content/shagun/phone.ts`: the pinned M chat,
Favorites, "For M", the security group). What he tucked away sits behind the
hard routes and only counts in its own episode (`requires: ["ep:2"]` and so
on). A player who digs early sees it but can't file it yet.

**Built:**
- **The phone as he prepared it** (`phone.ts`): threads (M with four voice
  notes on one grey tick, Mummy, Raju's poster, Kunal's clip, Banyan —
  Security, Sethi Caterers, Bhasin Uncle, ZipEMI), the Sehgal album and the
  9:48 PM portrait with a zoom on the CHHOTU badge, the fire clip and its
  original, "For M", the shot list, Mail (the invoice, the offer, the ticket,
  the site plan), Paytap, the SK Films profile, Recents, Safari searches and
  Settings.
- **Episode 1** (`episode1.ts`): Q1–Q4, three hints each, two routes each.
  Q3 is a `file` question: only Sameer's version can be filed now. Its truth
  claim waits on `link:two-firings`, and Q3 comes back as a Revisit in S7.
- **Raju rings over the lock screen** six seconds after it's unlocked, with
  three replies. Then Find My, then Mummy's *"phone ki location kahin aur
  dikha rahi hai"* with her own replies, then *"M? Tu hai?"* from a new
  number once Q4 is filed, then the phone dies to 2% and the charger.
- **Engine, for the pacing:**
  - `within`: evidence found by opening what it's inside (the voice notes
    by opening M's chat, not WhatsApp), which still badges.
  - `foundBy` and `settle()`: a one-way act done early (showing Hidden,
    Revert) counts once its episode opens.
  - `offeredClaims()`: a claim the player can't prove yet isn't offered.
    Before this, Q3's board showed the truth in Episode 1.
  - `arrivedAt()`: a message that arrives with an event carries the time it
    arrived on the story's clock, not a time written in advance.
- **Chat:** a reply the player picks shows as the owner's message, followed
  by its answer. The chat list is newest first after the pinned chat, sorted
  around the story's own day (`recency()` in `lib/found/time.ts`).
- **Fixes:** Mail, Paytap and Voice Memos were on the home screen twice (from
  S4); `chapter.test.ts` now checks the icons are unique. A reply was
  labelled with the caller's masked number; now with their name.

**Tests:** 89 and 1 skipped (every link traceable, which waits on Episode 3's
questions). `episode1.test.ts` is a solver: it plays Episode 1 from the
envelope to the charger, through each question's first route.

**Walked** at 375 × 812 in dev:
- the envelope, then Raju ringing over the lock screen (answered; the truth told)
- Q1 via Instagram, Q2 via the poster and the zoomed badge
- Q3 with only Sameer's version on the board, filed
- Find My and Mummy; replied "a stranger has it", and her answer shows
- Q4 via the passcode page and "For M"
- Sameer's messages, the phone dying, and the charger at 2%

No console errors.

**Left for S7:** the second-episode layer (the archived Nitin chat, the memo
in the bin, the reel take), and Q3's Revisit.

## S7 — Episode 2 · **done (2026-09-24)**

**Built:**
- **Episode 2** (`episode2.ts`): Q5–Q9, three hints and two routes each, and
  QM on the side (a `file` question: *hush money* is his version, *his own
  balance, held back* traces the price). Q6 is a two-lane board (dance
  floor, back lawn), and tracing the two firings brings Q3 back as a Revisit
  that has to be done before anything else.
- **What he tucked away** is on the phone from minute one and counts only
  now: the reel take in Photos › Recently Deleted, the memo in Voice Memos ›
  Recently Deleted, and two archived chats, Chhotu (new, CHAPTER1 E) and
  Nitin, whose 1:52 is simply missing.
- **Who writes:**
  - Sameer, seeing the phone back online, with three replies.
  - Sameer again once Q7 is answered, reshaping whatever the player gives
    him.
  - Raju once Q8 is answered: trust earns the promise.
  - Bhasin: early if Mummy was told a stranger has the phone, and otherwise
    after Q8.
  - The gap after Q9 opens Episode 3 at 1:52.
- **Engine:**
  - A chat holds several exchanges (`Thread.replies`), shown in the order
    they happened (`lib/game/chat.ts`); an unanswered older one lapses.
  - What's said back is timed when it was said.
  - Events can say `unless`.
  - A timeline can need `enough` on the board before it proves anything.
  - A Revisit reopens only on a find made *after* the version was filed.
- **The phone's calendar** (`calendar()` in `lib/found/time.ts`): a story
  writes a weekday (meaning that week, up to the first night) or a date, and
  every app labels it from the story's own date, as iOS does: Today,
  Yesterday, a weekday, then a date. Every clock now has a `date`.
  - Walking Episode 2 found last Sunday's messages reading as "today"
    (Bhasin's 9:10 AM at the top of the list).
  - Mail, Paytap and Recents had sorted Sunday after Saturday.
  - The shot list and Kunal's "Papa wali" were dated a week late.
- **Fixes found walking:**
  - Messages that arrived in an earlier episode kept its clock only until
    the next episode began (`clockAt`).
  - The Photos Library wasn't in date order.
  - A chat's unread badge counted a later episode's finds, which nobody
    could clear.

**Tests:** 109 and 1 skipped.
- The solver moved to `tests/support/play.ts`, and now also answers
  timelines and says things.
- `episode2.test.ts` plays from the charger to 1:52, and covers the Revisit,
  the thin board, QM's reopening, Bhasin's two timings, Raju's trust and
  Sameer's chat order.
- `chat.test.ts` covers conversation order.
- `phone.test.ts` adds the calendar, arrival times across episodes and the
  Library's order.

**Walked** at 375 × 812 in dev, from a seeded save at the charger, crossing
into Episode 2 through the real charger gate:
- Sameer online, then replied to
- Bhasin writing early, because this seed told Mummy a stranger has the phone
- Q5 via Kunal's chat and the shot list
- the thin board refusing, then the reel take in Recently Deleted, and Q6
- the Revisit struck and refiled
- Q7 via the deleted memo
- the archived chats, then Q8 and Q9
- Raju and Sameer writing, and the gap opening Episode 3 at 1:52 with 64%

A fresh tab showed no console errors.

**Left for S8:** the Kunal route (messaged as Sameer), Raju withdrawing if
told a lie he later hears taken back, and the second Sameer exchange's
answers as sources for his version (CHAPTER1 H).

## S8 — Episode 3 and the routes · **done (2026-09-24)**

**Built:**
- **Episode 3** (`episode3.ts`):
  - **Q10:** the five-lane board, with 13 rows from 12:38 to 2:41. It needs
    Bhasin's 12:38 order, Dilip alive, and the car leaving before it proves
    anything.
  - **Q11–Q13** are `file` questions, each accepting Sameer's version
    beside the truth: *turned away at the gate* or *the lie*; *proof against
    them* or *he took part*; *to confess* or *a counter-file*.
  - Each question reopens on the side if its decisive find (Nitin's copy,
    the reverted clip, the frame) turns up after filing.
- **Also on his phone:**
  - Kunal's frame, in the Hidden album, screenshotted with WhatsApp's
    chrome.
  - The fire clip's original, found by Revert (`foundBy`, so a Revert done
    earlier counts now).
  - The site plan, the group's other lines, and two Safari searches, tagged
    for Episode 3.
- **The routes** (CHAPTER1 H):
  - **Nitin**, in his archived chat. Protect him, and he sends the 1:52
    screenshot, Vicky's live location and *"Maine check bhi nahi kiya"*.
    Press him, and he shuts the door.
  - **Kunal**, messaged as Sameer once Q7 is answered. Confront him: *"Maine
    sirf gun di thi"* and *"Lakdi tu khud dhoke laaya tha"*. Hand him Nitin:
    *"Tera Nitin bhi andar hai"*, and the frame. Either way he names Nitin to
    Bhasin, and Nitin's route closes.
  - **Raju**, if told it was Kunal, hears otherwise at the Sehgals' and
    withdraws: *"Aap log sab ek jaise ho."*
  - **Sameer, one last time.** Give him the rescuer, and he takes it
    (*"Maine koshish ki thi"*, a source for his version). Or confront him,
    offered only with the shot, alive, the car and the lie traced: 14
    seconds of "typing…", then the line, and he never writes again.
  - **Sameer's own words from Episode 2** are sources for his version:
    *"Galti thi… woh Bhasin ne kiya"*, *"Maine koshish ki thi."*
  - **Airplane mode** silences everyone from Episode 2 on, and nothing can
    be sent. Episode 1's events carry the story, so they still arrive.
- **Engine and UI:**
  - A reply can lapse (`Reply.unless`).
  - An option can wait on what's traced (`ReplyOption.requires`).
  - A message can take longer to type (`Message.typing`).
  - A board with more than two lanes picks lanes from chips: about 26 taps
    for Q10, not 37.
  - A filed board lights the rows that don't fit (`TimelineRow.odd`), with
    nothing said about them (PLAYER-JOURNEY Stage 7).

**Tests:** 121.
- The chain law ("every link traceable, spine from a question nobody can
  skip") now runs.
- `episode3.test.ts` covers:
  - 10 of 11 traced for a full player (the price is on the side)
  - the confrontation's gate
  - the rescuer
  - Kunal closing Nitin, with the lie still traced on this phone
  - the exposed player's frame
  - the protected player's screenshot
  - Raju withdrawing
  - airplane mode
  - Q11 accepting his version, then reopening
- The solver now re-looks after every event, and never "sends" while
  offline.

**Walked** at 375 × 812 in dev, from a solver-made save at 1:52:
- the finds for the board, then the board by chips
- Raju's *"Aapne jhooth bola"*
- Nitin protected, then Q11 filed with his screenshot
- Revert to 0:31, then Show Hidden Album and the frame
- Q12 and Q13
- Sameer's last message, confronted, with the line after a long "typing…"
- the filed board's three lit rows

A fresh tab showed no console errors.

**Budget:** `/c/[case]` is at 685 of its 700 KB. S9 (the record, your
phone, the endings) needs to be lean, or the budget revisited.

**Left for S9:** Meera, the draft post, the record and the endings;
where airplane mode came from (Meera's advice).

## S6 · S7 · S8 — The episodes as data

| Phase | Content | Built against |
|---|---|---|
| **S6** | `content/shagun/episode1.ts` | CHAPTER1 F, Episode 1: fourteen beats, Q1–Q4, Raju's call, Mummy's Find My, "For M", *"M? Tu hai?"*, the charger |
| **S7** | `episode2.ts` | Q5–Q9 and QM, the Revisit of Q3, the memo, 1:07, Raju's trust, Bhasin's message, the archive, the 1:53 gap |
| **S8** | `episode3.ts` | Q10–Q13, the five-lane board, Nitin, Kunal, Meera, Revert, Hidden, Sameer's last message |

Each phase ends with the episode playable end to end on placeholders, every
question answerable two ways, three hints each, and a solver run through it.

## S9 — The record and the endings · **done (2026-09-24)**

**Built:**
- **Your phone** (`components/yours/Sheet.tsx`, loaded on first use).
  - On a phone-sized screen it's only its edge, at the right: tap to pick
    it up. The edge lights when something's new.
  - On a desktop, it's the phone beside his, now clickable, and its lock
    screen shows the one thing waiting.
  - On it: Messages, Pulse (the draft), the record, and the parcel.
- **Meera** (`content/shagun/yours.ts`) is found through WhatsApp's contact
  info on the pinned M chat (`Thread.contact`): her number, and her About
  line, *"Meera Arora · Advocate, Saket Courts"*. That works whatever O1
  decides.
  - Her first line doesn't say whether she expected the phone.
  - She says airplane mode. If it's done (`did:meera-preserved`), she reads
    his habits, then her bias shows (*"darpok hai, par jhooth nahi bolta"*),
    and she takes it back once the lie is traced.
- **The record** (`lib/game/record.ts`): one row per link, in the chain's
  order.
  - A traced link can be in or out.
  - An untraced link can be out, in as he says, or in as fact.
  - **A version the player filed goes in as fact by default, in their own
    words** (`FileClaim.link`): claiming more than the evidence supports is
    something the player did, not a trap.
  - The draft post is the record as the world would read it.
- **Endings** (`content/shagun/endings.ts`), each chosen by a declared rule
  (`Ending.when`):
  - **C:** posted with two firings untraced.
  - **A:** the lie and the edit in, and no untraced link stated as fact.
  - **B:** any other send or post.
  - **Return to Sender:** "send it back the way it came", which is O1-neutral.
  - Lines read NITIN, RAJU, MEERA, SAMEER, PUBLIC and what was left out.
    No verdicts.
- **The end card:**
  - the "For M" replay image, its cursor blinking after *"4. Nitin —"*,
    and *"He started to tell you."*
  - the facts outside the fiction (`story.outside`), each checked at its
    source on 2026-09-24:
    - Arms Act, 1959, s.25(9), as inserted by Act 48 of 2019
    - *Parmanand Katara v. Union of India*, AIR 1989 SC 2039
    - 112
    - Tele-MANAS 14416
- **The Choice screen is gone:** the record is the choice. The funnel's
  "choice" milestone is now reaching the record (`did:saw-record`).
- **The case file**, once everything is asked, says what's left is on your
  phone.

**Budget:** `/c/[case]` fell to 681 of 700 KB. The ending screens and your
phone now load on demand (`next/dynamic`), which paid for the new UI.

**Tests:** 132. `record.test.ts` covers:
- the rows and their defaults
- each ending's rule
- acts at every point
- the flags an act leaves
- the lines A and B read back

The no-signalling test now holds the record to one row style and the acts
to one.

**Walked** at 375 × 812 in dev, from a solver-made save at the end:
- M's contact info, then the edge, then Meera written to
- airplane mode, then her reading and her retraction
- the record, then sending to Meera, then A's aftermath, then the end card
  with the chain, "For M" and the facts
- desktop at 1280: your phone beside his, with "Pulse · Your draft is saved"
- a fresh tab from Episode 1: the draft (his version in the player's words),
  then posting it for C

No console errors.


| Module | Detail |
|---|---|
| Your phone | `components/yours/Phone.tsx` gains the draft post (from the end of Q3), Messages to Meera, and the record |
| The record | Links in and out, with sources; send or post; **no signalling** (one row style, fixed order, flat copy) |
| Endings | `content/shagun/endings.ts`: A, B, C and Return to Sender, read through `LINKS`, `LIE`, `FIRE`, `PRICE`, `EDIT`, `PUBLIC`, `NITIN`, `RAJU`, `MEERA`, `SAMEER`, `MUMMY`. No verdicts (script §18) |
| End card | The chain (untraced rows in Sameer's words), the count, one line only this ending shows, the "4. Nitin —" image, Pass it on, the case number |
| Outside the fiction | Celebratory firing is a crime; any hospital must treat first; 112; Tele-MANAS 14416. **Every fact checked against the source before the copy lands** |

## S10 — Growth

Pass it on (*"I traced 9 of 11 links"*), drops and the label, the share
images and OG routes, and **The First Minute**, redesigned for this chapter
(CHAPTER1 O5) or left out until it is.

## S11 — The real assets *(parallel, from S4)*

[ASSETS.md](ASSETS.md): the photographs and clips (a cast wedding shoot), the
voices, the handwriting, the documents.

## S12 — Ship-ready

- `tests/chapter.test.ts` rewritten for this chapter's laws: three hints per
  question; two sources per link that survive **any single closed route**;
  every evidence item filed once and reachable; solver runs for **the full
  chain (11/11 → A)**, **Sameer's version (→ B)**, **an early post (→ C)**
  and **Return to Sender**.
- Performance on a mid-range Android, the video-dead path, reduced motion,
  no sound, no storage.
- A full human playthrough on a phone, logged in the style of the last
  `PLAYTEST.md`.

---

## What only Siddhant can do

| | |
|---|---|
| Review the adaptation | CHAPTER1.md, before S1 |
| O1 | Why the phone reaches the player |
| The shoot | Cast Sameer, Dilip, Kunal and wedding extras; the reel; the fire clip |
| The voices | Sameer's four voice notes and the memo; Dilip (one message's worth); Raju; Nitin; Mummy |
| Handwriting | Sameer's note on the shagun envelope; the "For M" note is typed |
| Launch | Domain, deploy, and whether anyone should distribute the end card's message |
