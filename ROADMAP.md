# Found — Build plan
## The pivot to *Don't Cut the Call* (2026-09-17)

Chapter One is now [CHAPTER1.md](CHAPTER1.md): Vasundhara Kulkarni's phone,
31 hours into a digital arrest, delivered to your door at 1:11 AM. The
experience rules are [PLAYER-JOURNEY.md](PLAYER-JOURNEY.md), and the decisions
behind both are [PROJECT.md](PROJECT.md).

Everything before this file's date belongs to two retired stories, Low Battery
and The Blue Room. They live in git history and nowhere else.

**How a phase ends:** typecheck, lint, tests, build, budget; walk it in the
browser at phone size; tick this file; commit when Siddhant says so.

---

## The shape of the rebuild

| | Module | What it is |
|---|---|---|
| **P0** | Pivot | Retire the old cases, keep the engine, one case in the registry |
| **P1** | The stage | Two phones: hers (Android) and yours (platform-matched) |
| **P2** | The live call | The persistent video call, cue engine, zoom on video |
| **P3** | The ledger and the board | Exposure ledger; timeline and claim-check questions |
| **P4** | Her apps | Chat, gallery, settings, PikDrop, Instagram, messages, notes, Chrome, recorder |
| **P5** | Episode 1 | "Call Mat Kaatna" as data |
| **P6** | Episode 2 | "Delete for Everyone" as data |
| **P7** | Episode 3 | "10:30": your arrest, generated from the ledger |
| **P8** | The endings | Three acts, the end card, the ledger share |
| **P9** | Arrival | Desk, pouch, first sixty seconds, resume |
| **P10** | The First Minute | The 60-second shareable |
| **P11** | The real assets | Shoot, voices, handwriting, documents |
| **P12** | Ship-ready | Performance, accessibility, captions, tests, QA |

**P0–P6 are done** (2026-09-17/18): the opening plays, from the pouch
to the call to her home screen and the first question. What each phase left
for later is noted under it.

P0–P8 are the game. P9–P10 are how it spreads. P11 runs in parallel from P2
(Siddhant shoots; placeholders stand in until each asset lands). P12 is the
gate before anyone outside sees it.

---

## P0 — Pivot · *the only destructive phase*

**Goal:** the repo holds one story, one case and a story-agnostic engine.

| Step | Detail |
|---|---|
| Snapshot | Commit everything as it stands, so both retired chapters are recoverable from history |
| Delete content | `content/found/`, `content/blue-room/`, `tests/found.test.ts`, `tests/blue-room.test.ts` |
| Delete docs | `CHAPTER1-FINAL.md`, `PHOTOS.md`, `PHOTO-SOURCES.md` (superseded by P11's shot list) |
| Delete Low Battery's apps | `Health`, `Calculator`, `NightCam`, `Guardian`, `GuardianCard`, `Food`, `News`, `Maps`, `Memos`, `FaceGate`, `PhotoFrame`, `Files`, `Gallery`, `Recorder`, `Photos`, `Messages`, `Chats`, `Thread`, `Notes`, `Settings*`, `VoiceNote`, `Avatar`, `CaseSoFar`, and their CSS |
| Keep | `lib/found/*` (engine, store, drops, shelf, events, battery, platform, result), `components/found/Desk`, `KeepCase`, `Restore`, `StoryContext`, `app/**` routes, `scripts/*`, `tests/{device,guide,keeping,sharing}.test.ts` |
| Rewrite | `content/found/types.ts` → `content/types.ts`: drop `Cast`/`Gender`, `HealthDay`, `Order`, `Room`, `Network`, `Search`; add `Call`, `CallCue`, `LedgerEntry`, `Claim`, `TimelineRow`, `Device` |
| Rewrite | `content/cases.ts` with one case, `dont-cut-the-call`; `FEATURED` points at it |
| Add | `content/dont-cut-the-call/` with empty episode files, so the app builds |

**Done when:** `npm run build` passes with one case whose story is a stub, and
nothing in the tree mentions Low Battery or The Blue Room.

**Risk:** deleting app components breaks `FoundPhone/index.tsx`. Strip it to
a shell in the same commit; P1 rebuilds it.

---

## P1 — The stage · *two phones* · **done**

**Goal:** the physical arrangement the whole chapter plays on.

| Module | Detail |
|---|---|
| `components/stage/Stage.tsx` | Owns both devices. Mobile: hers full screen, yours one swipe from the right edge, with a peek affordance. Desktop: both on a table, yours smaller and asleep. |
| `components/her/Android/` | Her OS: status bar (**with the grey shield from second one**), notification shade, home screen with badges, app switcher, back gesture, huge system font, a Samsung-ish look drawn by us |
| `components/yours/` | Your OS, platform-matched by `lib/found/platform.ts`: lock screen, one chat app, a family group, a share sheet, a map. Small on purpose. |
| `lib/found/stage.ts` | Which device has focus, what each is showing, and how a beat moves focus |
| Haptics | `lib/found/buzz.ts` extended: the tear, your phone ringing |

**Psychology check (PLAYER-JOURNEY Stage 8):** yours must feel *yours* —
platform-correct, boring, and almost empty — or Episode 3 lands as fiction.

**Built:** `components/stage/Stage.tsx` owns the playthrough; `components/her`
is her Android (status bar with the grey shield, badges, app screens, banner
notifications, her clock and battery); `components/yours` is the player's own
phone, asleep, matched to their platform; the pouch tears with a drag and a
real buzz, and the note beat follows it. Resume comes off the save, so a
reload lands where the player left.

**Left for later:** her phone is one screen deep (no shade, no app switcher),
and your phone has no apps until P7.

---

## P2 — The live call · *the chapter's new core* · **done**

**Goal:** a video call that never leaves the screen and behaves like a person.

| Module | Detail |
|---|---|
| `components/call/LiveCall.tsx` | Full-bleed on entry, then a draggable window over every app. Timer counting up from 31:33:07, never pausable. Mic (muted), camera (off), red button. |
| `components/call/cues.ts` | The cue engine: idle loops (typing, drinking, glancing off), progress-triggered lines, timed supervisor crossings, reactions to unmute. Cues never interrupt each other. |
| `lib/found/callClock.ts` | The timer survives reloads, app switches and the time cut |
| Zoom on video | The existing zoom-that-counts, applied to a video surface: the wall clock and the extinguisher must be legible at 3× |
| The red button | Confirm sheet, the whisper, and a **real branch** if the player cuts it (CHAPTER1.md F4) |
| Captions | Every line captioned, English under Hinglish, always on |
| Degradation | Short looping segments, next cue preloaded only; on failure, a still frame plus captions. **The chapter is completable with video dead.** |

**Built:** `lib/game/call.ts` (the timer, the cue engine and his wall clock,
all pure and tested), `components/call/LiveCall.tsx` (full screen, then a
window that can't be closed; captions with English under Hinglish; mute; the
red button with the whisper before the confirm sheet; double-tap and wheel
zoom that counts only when the clock is readable) and `CallFeed.tsx`, a drawn
placeholder shot like a bad 4G call, carrying **the clock an hour ahead** and
**a label in Burmese** at 3x.

**Left for later:** no audio yet (captions carry it), the supervisor is a
shadow rather than a person, and the real clips arrive in P11.

---

## P3 — The ledger and the board · **done**

**Goal:** the systems that make the ending personal.

| Module | Detail |
|---|---|
| `lib/found/ledger.ts` | `record(action)` → `{ what, when, howItWillBeUsed }`. Written by unmuting (with the chosen line), the PIN, contacting Shaila, answering Nikhil, and killing the app. Saved with the case state. |
| Ledger → Episode 3 | Conditional accusation lines, and the spliced "confession" assembled from the player's own reply choices, shown as a transcript with visible cuts |
| Ledger → endings | The variables PIN, VOICE, SHAILA, NOTE, APP, NIKHIL |
| Ledger → end card | "What they had on you", then the count. **Replaces the 🟩🟨🟥 result** in `lib/found/result.ts` and the share cards. |
| Question type: timeline | Two lanes (where she was / what the phone did); dragging an event to the wrong lane says nothing, and contradictions light up |
| Question type: claim check | A list of statements marked **True** or **Bluff**, with evidence pulled from either phone; used in Ep 2 (three versions) and Ep 3 (your arrest) |
| Case file | Keep: one question at a time, free "where to look", three hints, the 45-second idle nudge, badges for reachable-but-unseen evidence |

**Built:** the ledger lives in the engine and in the save, and already records
her password and the player's voice without ever announcing either. The case
file now asks all four kinds of question — pick, type, two-lane timeline, and
true-or-bluff claims, where a claim is true only when the player actually
handed it over. `resultOf` is "What they had on you" and the share line is
"They had N things on me". All four kinds and the hint ladder are tested.

**Left for later:** the end card itself is P8, and the idle nudge after 45
seconds is not back yet.

---

## P4 — Her apps · **done**

**Goal:** everything the player opens on Vasu's phone. All Android-styled, all
drawn by us, all story-driven from `content/`.

| App | Must do |
|---|---|
| **WhatsApp** | Chats with Nikhil, Shaila, Rukhsana, the Kulkarni Parivar group, the Shanti Kunj society group (many senders, admin lines), the "Mumbai Crime Branch" chat with the warrant PDF, D'Souza. Voice notes with captions, documents, *"This message was deleted"*, and the 12:38 "You deleted this message". |
| **Phone** | Recents (1930 for 24 min, the eight warning calls, Nikhil at 11:58), contacts, and **call recordings** with waveform, captions and ±15 s |
| **Gallery** | Library, the **Diary** album (page 6 missing), the wedding photo, **Recycle Bin** with restore, and **Secure Folder** behind a PIN that opens onto nothing |
| **Settings** | Screen lock off at 8:10 PM, battery, and **Accessibility › RBI KYC Assist**, with its own screen and the uninstall |
| **PikDrop** | Booking (11:52 PM), item list, **route map with the 12:31–12:45 stop**, rider chat |
| **Instagram** | Vasu's DMs to Tanvi, profile search, and **Ruchi's expiring story** with an audio boost |
| **Messages** | Bank SMS, and a **Spam folder** holding the ₹1,00,000 debit when the PIN was typed |
| **Notes** | Her Thursday note, the shared note with *last edited 12:39 AM*, and Shaila's reaction to the edit |
| **Chrome** | History as a second route to Myawaddy |
| **News** | Notifications, and one article view for the 6:42 AM story |

**Built, in current iOS** (Siddhant asked for the look and feel back, so her
phone is the iPhone Nikhil handed down): WhatsApp with pinned chats, a society
group, documents, a voice note and "This message was deleted"; Phone's
Recents; Settings with the passcode off at 8:10 and their profile at 8:14;
Photos with her diary as paper and Recently Deleted; Notes with the edited
note and the locked one; Messages; Instagram; PikDrop with the fourteen-minute
stop; Safari; City Desk.

**Left for later:** the notification shade and app switcher, Live Text on the
paper, and the real photographs (P11).

---

## P5 · P6 · P7 — The episodes as data

| Phase | Content | Built against |
|---|---|---|
| **P5** ✔ | `content/dont-cut-the-call/episode1.ts` | **Done.** Twelve beats, Q1–Q4 each with two routes in, his ten lines, the whisper branch, the battery falling with the beats, his last line to the dark, and the charger gate |
| **P6** ✔ | `episode2.ts` | **Done**, except two beats held for P7: the unmute choice and Nikhil's call, which both need the call to take a reply. Built: Q5–Q10, the expiring story with its audio, Shaila's trust test, the bin, the timeline board, and "Good morning, #9." |
| **P7** | `episode3.ts` | Episode 3: the morning, the uninstall decision, **your phone ringing**, the generated arrest, Q11 across two phones, Sahil's 1930 code, the demand |

Each phase ends with the episode playable end to end with placeholder video,
audio and photographs, every question answerable two ways, and three hints each.

---

## P8 — The endings and the end card

| Module | Detail |
|---|---|
| Three acts | 01 drag-to-cut → map → station; 02 cut → walk → drag the phone into the sea; 03 don't cut → share sheet → type a name → send |
| Ending scripts | Line-by-line outcomes with the six ledger variables (CHAPTER1.md E) |
| Ending 03's tail | The friend's messages in real time, then the reply box, then black |
| End card | "What they had on you", the count, the one-line ending-specific reveal, the frozen 1:11 alert with its icon, Pass it on, case number |
| Outside the fiction | 1930, cybercrime.gov.in, Tele-MANAS 14416 |
| Share | `shareCards.tsx` and the OG routes rewritten for the ledger count |

**No signalling:** identical weight, fixed order, flat copy, no praise
(PLAYER-JOURNEY Stage 9). A test asserts the three rows share one style.

---

## P9 — Arrival

| Module | Detail |
|---|---|
| Desk | One courier pouch, the rest silhouettes; server-rendered first paint |
| The sticker | The friend's name from a drop, the content note, and the "nothing real" promise, as one delivery label |
| The pouch | Drag to tear, haptics, the phone face-down, the power bank's LED, the note as a photograph |
| Sound | Offered in-fiction as the ringer switch, never as a modal |
| Resume | Exact-screen resume including the call window and its timer; "You slept" when returning after a real gap |
| Replay state | Torn pouch, a postmark, the live ledger counter, and zoom permitted on the status bar and the first notification |

---

## P10 — The First Minute

A standalone 60-second version of the opening: pouch, call, alert, whisper, one
choice (**Cut the call?**). Either answer ends on the real advice and a link to
the chapter. Its own route, its own OG image, its own share line, built to be
forwarded into family WhatsApp groups. **This is the acquisition channel, not
a marketing afterthought.**

---

## P11 — The real assets *(parallel, from P2)*

| Asset | Detail |
|---|---|
| **Video** | Sahil on a painted Crime Branch set: ~12 min of idle loops, ~40 cue lines, two supervisor crossings, the whisper, the break. **The wall clock and the Burmese extinguisher label must read at 3× zoom.** Episode 3's call is a second setup on the same set. Two actors, releases signed. |
| **Voices** | Vasu's 40-second voice note (her only recording, and it has to make players love her), Rukhsana's Friday notes, the 38-second collector call, the terrace audio, D'Souza, Nikhil |
| **Handwriting** | Two hands on real paper: her convent cursive with Marathi, and the syndicate's block capitals |
| **Photographs** | Diary pages, the wedding photo, Vasu and her grandson, Hindu Colony, a Kurla lane, a cat on a balcony |
| **Documents** | The warrant PDF (our emblem, never the government's), bank SMS, the courier booking |

`PHOTOS.md` is replaced by `ASSETS.md`: one row per asset, with its beat, its
placeholder and its status.

---

## P12 — Ship-ready

- Performance on a mid-range Android: 60 fps outside video, first paint under
  2 s on 4G, a per-episode data ceiling checked in CI
- Video degradation proven by playing the chapter with video disabled
- Captions on every spoken line; screen-reader descriptions that don't spoil
- Reduced motion, no-sound and no-storage paths
- Tests: every question two routes and three hints; every ending reachable;
  **a clean run (zero ledger entries) is achievable**; every evidence item in
  exactly one place
- A full QA walk of all three endings plus the cut-the-call branch

---

## What only Siddhant can do

| | |
|---|---|
| Approve the pivot | The story, the Android reversal, the two-phone stage |
| The shoot | Cast Sahil and the supervisor, build the set, shoot the video |
| The voices | Cast and record, especially Vasu's 40 seconds |
| Handwriting and paper | Write the diary and both notes by hand |
| Mumbai photographs | Hindu Colony, Kurla, a terrace, a balcony |
| The real-time call | Whether Episode 3 can arrive at 10:30 AM the next day |
| Launch | Domain, deploy, and whether to approach a cyber cell for distribution |
