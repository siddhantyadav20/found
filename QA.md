# Found — QA pass, 2026-09-18

> **Retired chapter.** This QA pass is of *Don't Cut the Call*, retired on 2026-09-22 (git tag `dont-cut-the-call`). It stays for its lessons about how the phone should feel; nothing in it describes *Shagun*.

A deliberately hostile pass over everything built for *Don't Cut the Call*
(P0–P7), from nine angles. Every finding below was **verified** — against
the code, the running app, or both — not guessed. Where it was seen in the
browser, the width is given.

**Severity:** **Blocker** = a player can get stuck, or the chapter breaks its
own rules · **Major** = visibly wrong, or undermines the design · **Minor** =
wrong but survivable · **Polish** = the gap between "works" and "feels right".

---

## 0. The headline

The game logic is in decent shape: three episodes play end to end, the
ledger works, and 61 tests pass. **The phone does not.** P4 restored the
pilot's iOS *stylesheets* but not its *behaviour*, and several apps were
rebuilt with simplified CSS instead of the iOS looks that already existed.
That is why it feels sluggish and not like an iPhone. Siddhant's reading
is correct, and it is the single biggest problem in the build.

---

## 1. iOS fidelity — **Major, across the board**

What the pilot's phone shell did (commit `c03aa03`,
`FoundPhone/index.tsx`) and the current one does not:

| Pilot had | Now | Effect |
|---|---|---|
| **Apps open by zooming out of the icon you tapped** (`zoomOver`), and close back into it | A plain fade | The single most "iPhone" motion there is, gone |
| **Swipe from the left edge to go back** (`drag.ts`) | A back button only | Feels like a web page |
| **Home bar: swipe up to leave an app** | Decorative bar, does nothing | Same |
| **Notification shade**, pulled down from the top (`shade`, `pullZone`) | None | Notifications vanish once gone |
| **Lock screen**: Canela clock, stacked glass notifications, torch and camera | None; the phone opens straight to home | Loses the first "whose phone is this" moment |
| **Banners with the buzz** (`buzz()`, recorded haptic + sound) | Silent banners | No tension on arrival; the buzz was the pilot's best-liked detail |
| **Wake lock** while playing | None | The real screen can sleep mid-call |
| **Power-off / dying moment** at low battery | None | The 4% gate has no drama on the phone itself |

**Apps rebuilt with simplified CSS when the iOS version already existed:**

| App | Restored iOS stylesheet | Used? |
|---|---|---|
| Messages / threads | `ios/Thread.module.css` (tails, delivered, contact card) | **No** — nothing imports it |
| Photos | `ios/Photos.module.css` (glass tab bar, viewer, Live Text, info card) | **No** — `apps/Photos.module.css` is mine |
| Notes | `ios/Notes.module.css` (Notes yellow, checklist, the real note look) | **No** — `apps/Notes.module.css` is mine |
| Settings | `ios/Settings.module.css` (coloured tiles, profile card) | **No** — plain rows, no tiles |

**Layout, verified at 320 × 640:**
- **Blocker for the story's key tell:** the drawn Dynamic Island **covers the
  blue recording pill** around her clock. The chapter's always-visible clue is
  invisible on small phones.
- The phone is **drawn inside the real phone** — bezel, rounded corners and
  island inside an actual phone screen. The pilot went full-bleed on handsets
  ("on a real phone, the real island is there"). This alone makes it read as
  a picture of an iPhone rather than an iPhone.
- Icon labels truncate ("Mess…", "Setti…", "Insta…"); iOS shrinks the grid,
  it never truncates a four-icon row.
- The call window sits over the status bar, the battery and the open-question
  widget.
- **Your phone** is a dark rounded rectangle with "YOUR PHONE" on it — nothing
  about it is iOS or Android.

---

## 2. Game logic — correctness

| # | Finding | Severity |
|---|---|---|
| L1 | **Cutting the call at 1:11 soft-locks Episode 1.** Every route into Q4 needs `clock` or `burmese`, and both are only findable by zooming the live feed, which no longer exists once the call is cut. CHAPTER1.md F4 promises this branch works via the diary and Safari. | **Blocker** |
| L2 | **Nikhil's call cannot be declined** (`insists: true`), though the script says "answer or not". And if it were made declinable, the stage keeps him as "the current call" forever, so **the 10:30 arrest would never ring**. The declined counter is also component state, lost on reload. | **Blocker** |
| L3 | **Episode clocks count from the start of the playthrough**, not of the episode. Episode 3 showed 11:11 instead of 10:29, and the call timer in the morning reads ~32 h instead of 40:51. Continuity is part of the plot here. | **Major** |
| L4 | **The ₹1,00,000 transfer can't be checked on her phone.** The arrest accuses the player of it, the claims board asks whether it's true, but the debit SMS doesn't exist and Messages never renders its Junk folder (`folder` is unused). | **Major** |
| L5 | The "how she died" claims board is answerable without finding anything: claims are judged on flags, not on evidence seen. Q-level fairness hole, same family as the ones fixed in P6. | Minor |
| L6 | The unmute reply's "Say nothing" option sets no flag, so the choice never goes away. | Minor |
| L7 | Evidence `helpline-held` (Episode 2) duplicates `helpline` (Episode 1) and is referenced by nothing. | Minor |
| L8 | Diary pages 2 and 5 don't exist, so "page 6 is missing" isn't special — pages 2 and 5 are missing too. | Minor |
| L9 | `did:choice` is only set by answering the 1930 question, so a player who can't decode it never reaches the ending (hints do cover it). | Minor |

---

## 3. Story and content

| # | Finding | Severity |
|---|---|---|
| C1 | **Real brand in the crime:** "FedEx" appears in her diary (page 1) and in D'Souza's message. CHAPTER1.md G6 requires a fictional courier (SkyEx). | **Major** |
| C2 | **Q1's hint describes a lock screen with her face on it.** There is no lock screen, and the wallpaper is a Mumbai skyline from the old case. | **Major** |
| C3 | The pouch label says **"BY HAND"** above **"PikDrop · 1:08 AM"** — it came by courier. | Minor |
| C4 | CHAPTER1's twist 7 (the 1:11 alert came from their profile) has **no tell** yet: the banner uses City Desk's own icon. The replay hook "look at the icon" currently has nothing to look at. | **Major** (for replay) |
| C5 | Q1 asks the player to "match the wallpaper to the news photo"; the article has no photo. | Minor |
| C6 | The morning screen's timer, and "10:41 AM" on the choice screen, are hard-coded or wrong (see L3). | Minor |

---

## 4. Player journey (against PLAYER-JOURNEY.md)

| # | Finding | Law / stage | Severity |
|---|---|---|---|
| J1 | **Developer copy is shown to players**: the choice screen says "written in CHAPTER1.md, section E, and is built in P8". | Law 6 (never break the fiction) | **Major** |
| J2 | **Unmuting is one tap** and immediately costs "Your voice". The plan says confirm-by-holding. | Stage 3 | **Major** |
| J3 | **No idle nudge** after 45 seconds. | Stage 4 | Major |
| J4 | "Tear it open" is styled as the primary button, under a pouch that is a flat grey rectangle. The gesture reads as optional. | Law 5 | Minor |
| J5 | No 90-second "Aap cooperate kar rahe ho" at the choice. | Stage 9 | Minor (P8) |
| J6 | The desk, page metadata and share image still say **"Mysteries played on the missing person's phone"** — Low Battery's line. | Arrival | **Major** |

---

## 5. Accessibility (verified in the browser)

- **No `aria-live` regions** anywhere: captions, banners, incoming messages and
  the case file's replies are never announced. — **Major**
- Claims and timeline toggles have no `aria-pressed`. — Minor
- The incoming-call screen isn't a dialog and doesn't take focus. — Minor
- Hinglish and Marathi lines carry no `lang` attribute, so screen readers
  mispronounce them. — Minor
- All 14 buttons on the home screen have accessible names. ✓

## 6. Performance

- **The whole stage re-renders every second** (the clock is state at the
  root). DOM churn is small (7 mutations in 5 s), but on a budget Android the
  reconcile of both phones every second is wasted work. — Minor now, Major at
  scale
- Build, bundle and budget are within limits. ✓

## 7. Funnel and measurement

- **The funnel is effectively dead.** Only `open`, `unlock`, `cut:early`,
  `voice:on` and the share events are sent. No milestone, answer, hint or
  wrong-answer event is tracked, and `MILESTONE_OF` is used by nothing. We
  cannot see where players get stuck. — **Major**

## 8. Tests

- 61 pass, but **every blocker above passed them**: nothing models the
  cut-the-call branch, a declined call, or episode-relative clocks. Each
  blocker gets a test when it's fixed. — Major

## 9. Code health

- `components/stage/Stage.tsx` is ~420 lines and owns everything: the save,
  clocks, cues, events, calls, gates and app routing. It should be split
  before P8 adds three endings to it. — Minor
- Dead: `lib/found/buzz.ts`, `wakeLock.ts`, `memo`/sfx plumbing, four restored
  iOS stylesheets. They become live again with section 1's fixes.

---

## What's verified working ✓

The pouch → note → call → home → apps → questions → charger → Episode 2 →
Shaila → the bin → the timeline → "Good morning, #9" → morning → Nikhil →
the arrest assembled from the ledger → the claims board → 1930 → the choice.
Resume from a reload lands on the right screen. Two-routes-per-question holds
everywhere except L1.

---

## What's pending, in the order it should happen

**R1 — Make it an iPhone again** (before anything else, because every later
phase is drawn on top of it)
- Full-bleed on handsets: no drawn bezel or island on a real phone; the
  device frame only on desktop. The recording pill clear of the island.
- Bring back the pilot's behaviour, re-pointed at the new story: the **lock
  screen**, **apps zooming out of their icon and back**, **swipe-back**, the
  **home-bar swipe up**, the **notification shade**, **banners with the buzz**,
  the **wake lock**, press states and iOS's spring timing.
- Port the pilot's real **Messages, Photos, Notes and Settings** components
  (tails and delivered, the glass tab bar and viewer, Notes' own look, coloured
  Settings tiles) instead of the simplified ones.
- Icon grid that shrinks rather than truncates; the call window parked where
  it covers nothing.
- **Your phone** as a real lock screen for the player's own platform.

**R2 — Fix the QA list**
- Blockers: L1 (cut-the-call soft-lock), L2 (calls that can't be declined,
  and a declined call blocking the arrest).
- Majors: L3 clocks, L4 the ₹1 lakh SMS and Junk folder, C1 FedEx → SkyEx,
  C2 (solved by R1's lock screen), C4 the twist-7 tell, J1 developer copy,
  J2 hold-to-unmute, J3 the idle nudge, J6 the desk's old tagline, `aria-live`,
  the funnel events.
- A test for every blocker, and `Stage.tsx` split before P8.

**Then the roadmap as planned:** P8 the endings and end card → P9 arrival →
P10 The First Minute → P11 the shoot (yours) → P12 ship-ready.

---

## R2 — what was fixed (2026-09-18)

A third blocker turned up while fixing the first two, and it was the worst:
**in real play, Episode 1 never handed over to Episode 2.** Nothing set
`did:bank-dead` (so the power bank never died and the charger never came) or
`ep:2` (so plugging in changed nothing). Every walk-through had seeded those
flags by hand, which is how it passed QA. The screen decision now lives in
`lib/game/scene.ts` and `tests/blockers.test.ts` walks the boundary for real.

| # | Fix |
|---|---|
| **E1→2** | `bank-dies` event after he's placed; plugging in sets `did:charged` + `ep:2` |
| **L1** | Q4 answerable from diary page 4 plus her Myawaddy search (or Sahil's photo); the charger comes without his last line if the call was cut, with its own copy |
| **L2** | Nikhil can be declined, and it's saved (`did:declined-nikhil`); a declined call can't hold up the arrest; the arrest has no Decline button |
| **L3** | Episodes stamp their start (`began`); clocks read 1:11 / 1:40 / 10:29 from each start; the call timer follows the story's clock (40:51 in the morning) |
| L4 | (done in R1) the ₹1 lakh debit in Unknown Senders |
| L5 | Claims are judged only after each reachable proof has been seen |
| L6 | "Say nothing" is a choice that sets a flag |
| L7 | Duplicate `helpline-held` evidence removed |
| L8 | Diary pages 2 and 5 exist; only page 6 is missing |
| C1 | FedEx → SkyEx (diary, D'Souza, her search) |
| C2 | Q1's hints point at her name in Settings, not a face on a lock screen |
| C3 | Pouch reads "FLAT —" with no friend's name, not "BY HAND" |
| C4 | The 1:11 alert (and "Good morning, #9.") wear the grey shield (`kyc`) |
| C6 | The choice screen's time is the story's clock |
| J1 | No developer copy: the choice screen's P8 note and the stage's fallback are gone |
| J2 | Unmute is held for 0.9 s with a filling ring; keyboard Enter still works |
| J3 | 45 s with nothing new found → a Case file banner says where to look, once per question, not counted as a hint |
| J6 | "Thrillers played on somebody else's phone" on the desk, metadata and OG alt |
| a11y | Live regions for his captions (with `lang="hi-Latn"`), banners and the incoming call; dock icons named (an R1 regression) |
| Funnel | Every save reports new milestone/choice flags, `solved:<id>` and `hint:<id>:<n>`; wrong answers and nudges too; the allowlist is tested against it |
| Perf | One shared ticker (`lib/found/now.ts`): the stage re-renders on the minute, only the call timer on the second |
| Code | `Stage.tsx` 446 → ~120 lines: `Table`, `AppBody`, `playthrough` (every save), `lib/game/scene.ts` |
| Tests | 61 → 77, `tests/blockers.test.ts` holds each blocker down |

**Deferred, on purpose:**
- CHAPTER1.md F4's full cut-call branch: the call ringing back three times,
  and Sahil's Episode 3 line about the two days without food. Belongs with P8,
  where the ledger's variables are read.
- A declined Nikhil doesn't yet leave a second missed call in Recents.
- Removing the profile clears the blue pill but doesn't yet end the call a
  minute later (CHAPTER1.md Ep 3 beat 3). P8.
- J4 (the pouch's tear gesture reads as optional), J5 (the 90 s "cooperate"
  line, P8), L9 (1930 as the only way to the choice; hints cover it), the
  incoming call as a focus-taking dialog.
- Her own Notes app list still uses a simplified style (R1 leftover).
