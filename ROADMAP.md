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

### S4 — Never lose a case
- **Case numbers:**
  - the save kept on the server under a code, for a year
  - a restore link that works on any device, with no account
  - offered on the desk, on end cards, and as a QR code on a laptop
- **In-app browser guard:** on the envelope only, when inside Instagram or Facebook. On Android it opens Chrome; on iPhone it gives the "Open in Safari" hint.
- **A warning when storage is refused;** the case number is offered from the first tap.
- **"Start over" asks first,** and a solved case stays on the desk.
- **"Your cases" on the desk.**
- **Keep the design doc current** with Siddhant's answers.

### S5 — The desk remembers, and the first tap
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

### S6 — Real photographs
- **Siddhant's shots** (locker, van, cake, story, shoes, letterbox, fuel): strip location data, size them, blur any names, and give the story shot its vertical crop.
- **Source openly licensed candidates** for cinema, street, balcony (and the wallpaper, if needed). Siddhant approves each before it's downloaded; credits go where the licence asks.
- **Grade the fuel shot as NightCam** night vision.
- **Wire them in,** and re-check the size budget.

### S7 — Finish Low Battery
Cases ship whole, so Episode 3 and an ending are required before launch.
- **Episode 3's story,** decided with Siddhant; the script's truth was written for three episodes.
- **Choices that echo:** Mum's reply and K.'s threat visibly change later scenes, leading to two or three endings.
- **The case report card:** evidence found out of the total, hints, time, and the clues you never saw.
- **The final beat,** "Something else arrived.", which returns to the desk.
- **Retire the "Would you play Episode 3?" vote.**
- **Tests** walk all three episodes and every ending.

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
| Episode 3 and ending decisions | S7 | Before S7 |
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
