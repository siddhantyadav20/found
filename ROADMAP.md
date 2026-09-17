# Found — Roadmap

Everything decided or asked for since Found became its own project on
2026-09-15, sorted into sessions. A session is one sitting with Claude: it
ends with a working build, checked at phone size, and a commit.

The *why* behind each item is in [PROJECT.md](PROJECT.md) (decisions) and the
design doc, [Found Design Calls](https://claude.ai/artifact/CzrAqirWp7Wyzhz3z4WTFP).
Photos have their own brief: [PHOTOS.md](PHOTOS.md).

## Done

- Standalone app carried over from the portfolio pilot, running on port 3001.
- **Phase 1, the viral loop:**
  - the desk homepage, and a case registry
  - an envelope drawn by the server, so it shows before JavaScript
  - "Pass it on" drops that put a friend's name on the envelope, WhatsApp first, and report back how far the friend got
  - the spoiler-free 🟩🟨🟥 result, and "what others did"
  - one save per case, and funnel events for sharing
- **Episode 2 needs a real charger** where the browser can tell; elsewhere, an on-screen cable.
- **Platform detection** (`useDevice`): Android for Android, iOS for everyone else.
- **iOS pass 1:**
  - Liquid Glass tokens, and Outfit throughout
  - the lock screen, with a Canela clock, glass notifications, and torch and camera
  - the passcode pad, with letters under the digits
  - the home screen, dock and page dots
  - every icon redrawn
- **Docs:** the design doc, [PHOTOS.md](PHOTOS.md) and this roadmap.

## How every session ends

1. Typecheck, lint, tests, build, budget.
2. Walk what changed in the browser at phone size, then clear any test save.
3. Tick this file and note anything new.
4. Commit (when Siddhant says so).

## Sessions

Ordered by what protects players first, then what makes the phone feel
real, then what brings people back. Sessions 1–15 happen before launch;
16–17 wait for evidence.

### S1 — iOS: Messages and Photos · *done 2026-09-15*
- **Messages list:** large title, a working search, unread dots, iOS monograms (a silhouette for unknown numbers, a cluster for groups), iOS time labels (a time for today, "Yesterday", weekdays), chevrons.
- **A thread:**
  - an avatar-and-name header that opens the person's details
  - grey bubbles in, blue out, with tails on the last of each run
  - centred time stamps at each new day and after an hour's quiet
  - "Delivered" under the last message sent
  - a glass composer, which stays Low Power Mode in Episode 1
  - glass reply chips in Episode 2
- **The contact card:** avatar, name, number, and Send Read Receipts.
- **Photos:**
  - Library and Collections behind a floating glass tab bar
  - the grid opens at the newest photo
  - Recently Deleted under Utilities, with Recover All
- **The photo viewer:**
  - a glass back button, and place and time on top
  - Live Text as a glass button on the photo
  - a toolbar of Share, Favourite, Info and Delete; Share and Delete refuse, because it isn't your phone
  - Delete, Info and Recover in Recently Deleted
  - an info card with a camera line, the location, and the deletion note
- **System colour:** iOS blue for the phone's own controls, Found's orange for game hints.

### S2 — iOS: every other app · *done 2026-09-16*
Built: shared chrome and switches; Notes as an iOS note (Notes yellow, a checklist for evidence, #tags); Maps (dark map, red pins, a glass sheet whose search filters Recents); Settings (coloured tiles, the account card, a locked Low Power Mode switch, "Face ID & Passcode"); Health; Voice Memos (red playhead, working ±15 s skips, a transcript); Calculator (the iOS 18 keys, ⌫ while typing); News ("Today", City Desk's masthead); Guardian and Dabba as light third-party apps with a dark status bar over them; NightCam in night-vision green; Medical ID's Done in blue; no banners while the phone is dead or charging. The charge screen and the power-off moment were already iOS-like and kept as they were.
- **Shared chrome:** large titles, inset grouped lists, sheets and switches, to iOS spacing.
- **Notes** (the case file):
  - question cards
  - the evidence picker
  - the keyboard for typed answers
  - the vault's notes
- **Maps:** the map, search results, the pin mode, Stop Sharing.
- **Settings:**
  - Wi-Fi (Episode 2)
  - devices
  - Battery (showing charging)
  - Share My Location
- **Health, Voice Memos** (a waveform player with transcript captions) **and Calculator**, including the vault behind it and K.'s chat inside the vault.
- **News** ("City Desk").
- **The story's own apps** (Guardian, NightCam, Dabba), styled as believable third-party apps rather than iOS clones.
- **Medical ID; the charge screen; the moment the battery dies.**
- **A guard:** no banners while the phone is dead or charging.

### S3 — iOS: the system around the apps · *done 2026-09-16, except calibration*
Built: apps zoom out of the icon or widget they were opened from and shrink back into it; Notification Centre (drag down from the top edge, or tap it) lists everything that has arrived, newest first, and a tap opens the thread; holding a banner expands it and stops it auto-dismissing; Recently Deleted is locked behind Face ID, which fails on a stranger and falls back to the passcode (decided: yes); Settings → Display & Brightness → Larger Text, kept per device across cases; a visible focus ring in iOS blue, and map pins reachable by keyboard. Android vibration was already in `buzz()`. Calibration is still waiting on the screenshots.
- **Motion:** apps zoom open from their icon and shrink back into it.
- **Notification Centre:** pull down from the top for the history of everything that's arrived.
- **Banners:** a long-press expands one. The existing flick-away and tap-to-open are kept.
- **Recently Deleted asks for Face ID, as iOS does,** which fails on a stranger and falls back to the passcode.
- **The buzz vibrates Android phones** (`navigator.vibrate`) in step with the sound.
- **Calibration against Siddhant's iPhone screenshots** (see "Only Siddhant"). *Still open.*
- **Accessibility inside the phone:**
  - screen-reader labels throughout
  - visible focus
  - reduced motion
  - larger text

### S4 — Never lose a case · *done 2026-09-16*
Built: case numbers like `K7Q4-MX2P-R9TA` (12 characters, nothing that reads two ways), made on request and kept on the server for a year after the last play; with a number, every save goes up a couple of seconds after it changes and again as the page is left. `/r/<number>` restores on any device and keeps, case by case, whichever save got further; the desk takes a typed number too. The card sits on end cards, on the desk ("Your cases"), and on the envelope when storage is refused; on a laptop it shows a QR code (`qrcode-generator`, loaded only there). The Instagram/Facebook guard on the envelope opens Chrome on Android and points to ••• → Safari on iPhone, and "Play here anyway" dismisses it. "Start over" asks first; finishes are kept apart from saves, so a solved case stays on the desk after it.
- **Case numbers:**
  - the save kept on the server under a code, for a year
  - a restore link that works on any device, with no account
  - offered on the desk, on end cards, and as a QR code on a laptop
- **In-app browser guard:** on the envelope only, when inside Instagram or Facebook. On Android it opens Chrome; on iPhone it gives the "Open in Safari" hint.
- **A warning when storage is refused;** the case number is offered from the first tap.
- **"Start over" asks first,** and a solved case stays on the desk.
- **"Your cases" on the desk.**
- **Keep the design doc current** with Siddhant's answers.

### S5 — The desk remembers, and the first tap · *done 2026-09-16*
Built: the desk phone as you left it — new (buzzing), mid-case (your battery, "Case file · Episode 1 · Mira is still missing", "Continue · Ep 1"), between episodes (dark, charging, a cable off the desk, "Charge it · Ep 2"), solved (dark inside an evidence bag with its label, "Play again" or "Open it"); "Something else arrived" for a returning visitor when a new case appears. A luggage tag on hover, keyboard focus or a hold (episodes, length, tone). A sound toggle on the desk, and "Sound on" in the envelope's small print is the switch. Back after 30 minutes, "While you were away" arrives once anything already due has landed, and opens the case file on "Case so far". The first tap: the desk phone morphs into the envelope (or your phone) with React's `<ViewTransition>`; full screen on an Android phone; a Wake Lock while a case is in hand; the key nudges after 20 s untouched. The envelope reads "Sound on · headphones better · about N min · saves as you play" and "16+ · A missing person, stalking and threats." Checked on real devices still: the morph, full screen, the Wake Lock, and holding for the tag.
- **Desk states:**
  - mid-case: your phone, your battery, "Continue · Ep 1"
  - between episodes: charging
  - solved: in an evidence bag with its tag
  - "Something else arrived"
- **Luggage tags** on long-press or hover: episodes, length, tone. **A sound toggle.**
- **A returning player gets** a "While you were away" notification, and Notes opens on "Case so far".
- **The first tap:**
  - a view transition from desk to envelope
  - full screen on Android
  - a Wake Lock, so the screen stays on
  - the idle hint pulsing at 20 seconds
- **The envelope's small print:** "Sound on · headphones better · about N min · saves as you play", and a content note (16+).

### S6 — Real photographs · *the pipeline is done; waiting on Siddhant's shots*
Built: `scripts/prep-photos.mjs` (`npm run photos`, `npm run photos:check`) — strips every photo's metadata, sizes it for a phone screen, blurs per-slot rectangles, gives the story shot its vertical crop, and refuses to let anything ship carrying EXIF or over 130KB. NightCam grades its frame as night vision in CSS, so the photograph stays a photograph. Sourcing found nothing usable: the one CC0 `street` candidate was approved on its description and rejected on sight (defocus bokeh at dusk, a red double-decker bus in it), and `cinema` and `balcony` have no CC0 match at all — the near misses are named cinemas under CC BY-SA. All three keep the pilot's placeholders by decision, and the wallpaper stays: it's already Marine Drive. Provenance, and what was rejected, is in PHOTO-SOURCES.md.
- **Siddhant's shots** (locker, van, cake, story, shoes, letterbox, fuel): still to come. `npm run photos` does the rest.
- **Still open:** cinema and balcony, revisited at launch; and the pilot photographs' provenance, which didn't come across with them (S15).

### S7 — Chapter One, rewritten: "The Blue Room"
On 2026-09-17 Chapter One became a new story: Raghav Mehra's phone, under
your door at 4:17 AM. The build document is [CHAPTER1.md](CHAPTER1.md): the
resolved truth, every fix to the script and why, the episodes as puzzles,
the three choices, and what's cut. It's built as a new case, `blue-room`,
next to Low Battery, which stays playable and untouched until the new
chapter plays end to end (N8).

**N1 — Foundations and the opening · *done 2026-09-17*.** Built: The Blue Room
registered as its own case (`/c/blue-room`); a story can now fix its
character instead of dealing one, open with a swipe instead of a passcode,
set its own clocks and days (04:17, Saturday), lay out its own home screen
(Phone, WhatsApp, Photos, Case file in the dock; Telegram, Recorder, Files,
Maps, Settings), time its own events, and play scripted calls that hang up
by themselves, with English under Hinglish. New icons for Phone, WhatsApp,
Telegram, Recorder and Files, drawn from scratch. The opening plays: the
envelope with no name on it, the lock screen stacking "don't call him" and
RAGHAV's missed call as they land, the call, the whisper, back to the lock
screen at 4%, swipe open, the case file introduces itself.

**N2 — The chat apps and Phone · *done 2026-09-17*.** Built: WhatsApp and
Telegram as one chat app with two looks: a chat list with pinned chats,
previews, times and unread counts, conversations with day labels, ticks,
"Forwarded", deleted and still-downloading messages, voice notes that play
their captions, documents, video, and a live location that can be stopped
(the chapter's one irreversible act), plus each contact's info page. Phone:
Recents, Contacts, contact cards with notes, and calls that dial and then get
the network's "not enough balance" line, so nobody is ever called from
Raghav's phone. Settings as rows written in the story: passcode off at 03:58,
SIM 2 removed at 03:58, the camera. Episode 1's chats with Maa, Papa, Rohan,
Ishita, the school group, the unsaved 23:19 number and the client, as data,
with the live texts at 4 AM. Tests hold every piece of evidence to exactly
one place and every attachment to something real.

**N3 — Photos, Recorder, Files.** Video clips with captions, camera imports,
the Telegram album, the hidden album and its lock; the Recorder; Files with a
tappable floor plan and a spreadsheet with a hidden sheet.

**N4 — Episode 1 as data.** CHAPTER1.md Part 5.

**N5 — Episode 2 as data.** Part 6, including three-at-once matching and the
phone dying at 1%.

**N6 — Episode 3 as data.** Part 7, including the charger gate.

**N7 — The choices and the endings.** Part 8, including the final card and
Ending 03's share.

**N8 — Tests, then retire Low Battery.** Walk every ending. Delete Low
Battery's content, apps, tests and CHAPTER1-FINAL.md; the desk, share and OG
copy move to the new chapter; PHOTOS.md becomes the new shot, video and voice
list.

<details><summary>Low Battery's S7, as it was built (S7a–S7f, done 2026-09-16)</summary>

The story is locked in `CHAPTER1-FINAL.md`: Mumbai, three episodes, an
anthology chapter that closes. Chapters do not connect — each is a different
city and a different story — so Chapter One answers everything it asks.

**S7a — Never be lost · *done 2026-09-16*.** The fix for the only real player
feedback: badges on every icon counting reachable-but-unseen evidence; the case
file asking one question at a time with a free "where to look" naming apps; a
toast saying what was added and how much is found; the case file introducing
itself on the first unlock; and an idle nudge that offers the next hint after
45 seconds, counted apart from hints the player asked for.

**S7b — Episode 1 tightening · *done 2026-09-16*.** The midpoint turn: a Guardian session logged
**Sat 00:05**, four minutes before the van photo was deleted — someone else was
inside this phone first. Dev compressed from a deduction to two messages and a
photograph. The activity report leaving the phone as it dies.

**S7c — Episode 2 tightening · *done 2026-09-16*.** Mum's confession (she saw Friday's log on
Saturday and said nothing). Five deductions down to three. "I don't know"
accepted as an answer. 3107 left unconfirmed. The last beat: the player's own
home Wi-Fi in the phone's known networks, joined three minutes before they
picked it up.
Built: the questions are now who (typed "me"), who wanted it and why a
stranger (typed; "I don't know" is accepted and answered "Good."), and did
{name} start the fire (NightCam frame 1). 3107's right answer gets "okay."
and no more. After the letterbox, a banner points to Settings, where Home-4B
reads "Auto-joined Mon 08:11". Seeing that ends the episode. The first pickup
is never earlier than 08:12, so that timing always holds.

**S7d — Episode 3 as data · *done 2026-09-16*.** `content/found/episode3.ts`: eleven NightCam
frames, the watchman, {name}'s unsent note, Kiran's three messages, and the
question that turns the chapter — who was carried out of the engine house on
Friday night. All three episode titles land together here ("Don't Unlock It.",
"Read Receipts", "Delivered"), since an episode name is a new field the
envelope and the end cards both read.
Built: eleven frames, each downloading once the one before has been opened;
the sync pauses at 11 of 12 until the watchman is named. Frame 11 is the only
zoomable photo (pinch, double-tap or scroll), and past 2.2× the two men
appear. Other pieces: the draft note (in the vault, where {name}'s own notes
live; Notes is the case file); the Dabba order to Currey Road; City Desk's
watchman column; K.'s "Stop downloading." Placeholders stand in for every
frame until the photographs exist.

**S7e — The climax and the endings · *done 2026-09-16*.** The call screen (the only full-bleed
screen in the game), the two converging clocks, three endings that each cost
something, and the desk return that lights the next object.
Built: after frame 12, K. either turns sharing on (his dot closes on yours in
Maps) or, if sharing was stopped in Episode 1, sends a photo of your
stairwell. 3107 is outside Byculla station, then "I'm outside. Bring it
down." (prefixed "You said you knew what I did." after a threat), then the
call. The call rings until answered (Decline refuses), plays captions for
45 seconds, and offers the three answers. Each ending runs: act (send, erase,
open the door, with knocking), what happened (some lines depend on the van
recovery and Mum's reply), a news item, Tara's line, then the desk and
"Close the case". The chapter end card shows what you said, "1 in N players
said what you said" (hidden under 50 answers), and Pass it on.

**S7f — Tests and the linter · *done 2026-09-16*.** Walk all three episodes and every ending; check
every question has two routes in and three hints.
Built: the perfect player walks all three episodes and each ending; the curious
players fire every event (both of K.'s routes included); every question names
at least two apps and has three distinct hints, and where-to-look includes the
app that holds its proof. 94 tests.

Retired along the way: the "Would you play Episode 3?" vote and its email box.


</details>

### S8 — Voices
- **A casting brief, and a script of every voiced line:** Mum's voicemails, K.'s voice note, Tara, Dev. Hinglish where they'd naturally speak it.
- **A recording guide** Siddhant can hand to a friend or a studio.
- **The audio pipeline:** mixing, levels, and captions kept in step.
- **The missing person stays a whisper,** because the cast is dealt at random.

### S9 — Android: the system
- Material, Pixel style, with the same Canela and Outfit:
  - lock screen and home screen
  - Google-style icons and the status bar
  - the notification shade
  - gestures: back from the edge, home swipe

### S10 — Android: the apps
- Messages and Photos first, then every app from S2, in Material.

### S11 — Built for a case a week
- **A case template and authoring guide:** a new case as pure data under `content/`.
- **Tests that walk any case** as a perfect player and as curious ones.
- **A content linter:** copy budgets, the cast-pronoun rule, assets, memo timings.
- **A private stats page** (`/stats`, behind the token). It measures **repeat play** (a second case started in the same browser), which is the trigger for the paywall.
- **Share cards that show a sender's result** on the drop preview.
- **A publishing checklist** for each week's case.

### S12 — Case two
- **The concept is Siddhant's:** a different kind of object from a phone.
- **Write and build it;** its object lights up on the desk.
- **Plant its seed inside Low Battery:** a City Desk headline, a photo detail, or a name.

### S13 — Between sessions
- **Add to Home Screen,** offered as "Keep it charged".
- **Web Push:** texts that land between sessions, and each week's new case arriving as a buzz.
- **Offline play:** a started case keeps working through a tunnel.
- **A weekly email** to the next-case list (Resend).

### S14 — Language
- **A Hinglish layer** in `say()` and the script, then a script pass. Hindi after.
- **Share images draw names in Indian scripts** (a Noto face), not "TO YOU".

### S15 — Launch readiness
- **Buy the Canela licence,** or replace the font.
- **Move the share images off the deprecated Edge runtime** (the follow-up task).
- **Accounts and hosting:** GitHub, Vercel, domain.
- **Environment variables:**
  - Upstash Redis
  - `RESEND_API_KEY`
  - `FOUND_STATS_TOKEN`
  - `NEXT_PUBLIC_SITE_URL`
- **A privacy note.**
- **Test inside WhatsApp's and Instagram's in-app browsers** on a mid-range Android over 4G.
- **Watch five people play, without helping.**
- **Decide whether sidbuilds.in/found redirects here.**
- **A final budget and performance pass.**

### After launch, only on evidence
- **S16 — Money:** ₹50 a case via UPI (for example Razorpay), only once repeat players show up in `/stats`.
- **S17 — Community:** a forum or comments, only once people are already discussing cases. Channels in the meantime: Indian mystery YouTubers and streamers, reels of the Guardian reveal, WhatsApp groups, r/india, r/IndianGaming.

## Only Siddhant can do these

| What | Unblocks | When |
|---|---|---|
| Screenshots from your iPhone: lock screen, home, Messages (list + a thread), Photos (grid + a photo) | S3 calibration | Any time |
| Set `FOUND_STATS_TOKEN` on the portfolio's Vercel and read the pilot's funnel | S5, S7 | Any time |
| Shoot the seven photos in PHOTOS.md | S6 | Before S6 |
| Approve sourced photos | S6 | In S6 |
| Answer CHAPTER1.md Part 11 (title, script fixes, English lines, app names, charger gate) | S7 N2 onwards | Before N4 |
| The Blue Room's photos, video (above all the FOUND video) and voices (CHAPTER1.md Part 10) | S7 (placeholders now), S8 | Before launch |
| Cast and record voices | S8 | Before S8 |
| Case two's concept | S12 | Before S12 |
| Buy Canela; domain; GitHub and Vercel steps | S15 | Before S15 |

## Additions of mine

Not asked for; each one is flagged here so it can be cut.

- A **working search** in Messages, and **Share and Delete that refuse** with a buzz (S1).
- A **camera line** in the photo info card (S1).
- **Face ID on Recently Deleted** (S3, approved).
- **Android vibration** with the buzz (it was already there).
- **Larger Text** in the phone's Settings (S3).
- **No banners on a dead phone** (S2).
- The **case report card** with missed clues (S7).
- **Repeat-play measurement** on `/stats`, and **result share cards** (S11).
- A **content linter** for weekly cases (S11).

## Open follow-ups already noted
- Share images run on the Edge runtime as a stopgap (S15, and a separate task).
- "What others did" and "About N minutes" appear on their own after 50 finishes.
- Whether the portfolio's `/found` redirects here (S15).
