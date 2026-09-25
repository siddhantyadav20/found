# Shagun — full play, 2026-09-24

> **Not the human playtest.** Claude played this in the in-app browser, driving
> the page rather than a thumb, at ROADMAP S12. It catches what's wrong on the
> screen and in the words. It can't catch what a person feels, misses or
> misreads. That playtest, on a real phone, is still S12's to do.

Played from a cleared browser at 375 × 812, from the desk, unseeded, through
every episode to The Complete Record: Raju answered with the truth, Mummy
answered as Sameer, Sameer asked where he is and given the Kunal theory,
Raju trusted, the money traced, Nitin protected, Sameer confronted, Meera
written to, airplane mode on, the record sent. **11 of 11.** Earlier walks
(S6–S10) covered the other branches; the solver runs in `tests/ship.test.ts`
cover every ending and every closed route.

**Sev:** B blocker · M major · m minor · p polish.
**Status:** ⬜ open · ✅ fixed · ➖ won't fix (reason given).

| # | Where | Issue | Sev | Status |
|---|---|---|---|---|
| 1 | Desk | The hint leaves **"M." alone on its last line** (and did on the case's share card) | p | ✅ `text-wrap: balance`; the card's hint is narrower |
| 2 | Raju's call | His answer (Hinglish and English, ~110 characters) shows for **3.4 s** before the call ends: too short to read both | m | ✅ Scales with length, 3.4–9 s |
| 3 | Q3 | His version's reply said *"On the record, as his voice notes tell it"*: a quiet signal that it's his. Every other version says *"On the record."* | m | ✅ |
| 4 | Home | The case file widget said **"Open question"** over a Revisit, which the case file calls "Revisit" | m | ✅ |
| 5 | Q10 | The reply told the player the service room was **forty metres** from the gate, a fact from the site plan, which they may never have opened | m | ✅ Removed |
| 6 | Episode 1, offline | In airplane mode, **Raju's call still rang** and Find My, Mummy and Sameer still arrived | m | ✅ Silenced; the phone still dies on time |
| 7 | Your phone | Its composer said **"It isn't your phone."** (found in S9) | m | ✅ |
| 8 | Charger | On a Mac on mains power the gate passes by itself, which is right, but it means the gate is only seen unplugged | p | ➖ Real behaviour; `?battery=unplugged` in dev |
| 9 | Notification Centre | "Low Battery · 2%" is still listed once the phone is charging | p | ➖ iOS keeps it too |
| 10 | Instagram | The profile opens from the story ring, not a profile tab | p | ➖ S4's design; it reads |

**What held:**
- Every question answered by one of its routes, with no dead ends.
- Every arrival timed on the story's clock.
- Dates right across all three nights.
- The Revisit struck and refiled.
- The board by chips, with its three rows lit.
- The line after a long "typing…".
- Meera's whole arc.
- The record in one row style, and the aftermath read back correctly.
- The end card with "You traced 11 of 11 links."
- Storage refused shows its warning.
- Reduced motion is honoured site-wide (`globals.css`).

No app errors in the console. Only the dev server's hot-reload socket, left
over from earlier servers in that tab.

**Still for a person, on a phone** (S12):
- whether the first question lands in 15 seconds
- whether the Revisit feels like being wrong for the right reasons
- whether anyone finds Archived, the bin, Revert or Hidden without the third hint
- whether the confrontation lands
- whether 60 minutes is 60 minutes
- performance on a mid-range Android

---

# Shagun — played as a mystery player, 2026-09-24

> **Still not the human playtest.** Claude played it again in the in-app browser,
> after O1, this time as someone who plays a lot of mystery thrillers: digging
> where they dig, over-proving answers, and asking whether they'd come back for
> Chapter 2.

Played from a cleared browser at 375 × 812, from the desk, unseeded, on a Mac
on battery, so the charger gate waited and then offered its cable after 2
minutes. The route:
- Raju told the truth on the call.
- Sameer answered as M ("Haan."), then confronted ("Goli tumne chalayi thi").
- Raju told about the shot.
- Nitin protected.
- The ₹1,80,000 filed as his held balance.
- Meera written to, and airplane mode on.
- The record sent to Meera with every link in: **The Complete Record, 11 of 11.**

It took **36 minutes**: Episode 1 ~14, the charger 2, Episode 2 ~8, Episode 3 ~12.
Taps were driven faster than a thumb, so a person is likely nearer 50–60.

| # | Where | Issue | Sev | Status |
|---|---|---|---|---|
| 11 | Episode 1 | **Every twist is reachable in the first ten minutes**, where genre players look first: the memo in Voice Memos › Recently Deleted, the reel take in Photos › Recently Deleted, Edit › Revert on the fire clip (his hands, the jerrycan), and Kunal's frame once Settings › Show Hidden Album is on. Q3 then only offers Sameer's version, the Revisit reads as bookkeeping, and Episode 2 is re-opening what was already seen. Either lock them in the fiction until their episode (e.g. restoring from iCloud once the phone is charged), or reward finding them early | M | ✅ Layered (2026-09-25): each finds a door it can't open yet, in iOS's words. Episode 2's are still in iCloud or in an offloaded Voice Memos, until the phone has charged past midnight; Episode 3's are in his locked note, whose password is 1:52 |
| 12 | Case file | **Extra true proof is called wrong.** `judgeProof` ([engine.ts:189](lib/game/engine.ts:189)) wants the exact set, so tabling more valid proof than a route needs gets *"Some of that proves it. Take out what doesn't."* Hit four times: Q1 (Apple Account + @skfilms.delhi + invoice), Q3 (all three voice notes + the fire clip; "Usko hospital nahi le gaye" is half the claim), Q5 (12:29 photo + shot list + "Papa wali"), Q13 (Kunal's frame + the reverted clip + Nitin's 1:52 screenshot). Accept any route plus other items from the question's routes; keep refusing items outside them | M | ✅ A whole route plus anything else from the routes passes; a stray item still gets *"Take out what doesn't"*, and true items short of a route now get *"That's part of it. Something's missing."* Q3's version also takes all three voice notes |
| 13 | Q13 | Nitin's screenshot of Sameer's 1:52 message isn't in any route for "counter", though it's the most direct proof of what he cut; only Nitin's 1:53 "answering nothing" is | m | ✅ A route beside the 1:53, and in the third hint |
| 14 | Q2 | The LAPATA poster with the 9:48 PM portrait is refused (only the badge or Sethi counts). Right for placeholders; once Dilip's real face is in both, a player will match faces | m | ⬜ With S11 |
| 15 | Photos viewer | **Full-screen photos collapse to a 20 px strip**: `.scene[data-big]` has `height: 100%` inside an auto-height `.zoomable` ([PhotoFrame.module.css:367](components/owner/ios/PhotoFrame.module.css:367), [Photos.module.css:39](components/owner/apps/Photos.module.css:39)). It also breaks the Q2 zoom: `onScreen` measures the 632 px viewer while the badge sits in the 20 px strip, so double-tapping the badge does nothing and double-tapping empty space below reveals it, near the top | M | ✅ A portrait frame sized to the viewer (`container-type: size`), the zoom wrapper exactly the photo's box, and the zoom measuring the photo for the spot and the window for what's on screen. The badge reveals where it's drawn |
| 16 | Photos, videos, voices | The evidence is still placeholder: grey cards with captions, silent voice notes and calls. "Two figures, one holding something up" can't read as Sameer with the gun, so the case file says what the picture doesn't show. The LAPATA poster is a blurred brown square | M | ⬜ S11 |
| 17 | End card, desk | **Nothing asks a finisher to come back.** No Chapter 2 tease, date or notify-me on the end card; after a finish the desk shows only the bagged phone, and even "More are being found." is gone | M | ⬜ |
| 18 | End of Episode 2 | `the-gap` fires 25 s after Q9 ([episode2.ts:437](content/shagun/episode2.ts:437)): Raju, Sameer and Bhasin's *"Jiske paas bhi ye phone hai — wapas kar do"* land and the Episode 3 card cuts over them. Their replies carry into Episode 3, but Bhasin's threat gets no beat | m | ✅ `quiet` events wait for the phone to be put down: the gap now turns 15 s after the player is back on the home screen, never inside an app or with their own phone in hand |
| 19 | Q6, Q10 | The boards solve themselves: each row's text names its lane ("Two shots… dance floor", "Gets Vicky's car"). Reading, not deduction | m | ⬜ Design |
| 20 | Q7 | The player never names the shooter: they table proof and the reply says "Sameer." The accusation is the genre's payoff; let them make it | m | ⬜ Design |
| 21 | Parcel, desk | M is solved on the label ("TO MEERA ARORA, Advocate, Saket Courts") while the desk teases "someone called M". Meera is still only reachable by opening M's contact info in WhatsApp | m | ⬜ O1's cost |
| 22 | Meera | *"Kisi ko reply mat karo"* arrives after the game has had you reply to Raju, Sameer and Nitin | p | ⬜ |
| 23 | `file` questions | With one claim offered, **File it** stays disabled until the claim card is tapped, and nothing says so | m | ✅ A lone claim is the one chosen, and shows selected |
| 24 | Q10 | The instruction still says *"Tap each row until it sits in its lane"*; with five lanes a row opens chips | p | ✅ *"Tap a row, then choose its lane."* on a board with chips |
| 25 | WhatsApp | At an episode's start, chats already read get unread badges again (Banyan — Security 4, Sethi 1, Bhasin 1) with nothing new in them: the evidence nudge in [Chat.tsx:423](components/owner/apps/Chat.tsx:423). Reads as a glitch | p | ✅ What was read early counts the moment its episode opens, with no badge and no "Noted" |
| 26 | Your phone | On mobile it's a 12 px edge that went unnoticed until the widget pointed at it; inside, four glyph icons, much plainer than his iPhone | m | ✅ Whatever lands on yours slides out from the edge as a note for 6 s (*"Your phone · Pulse: Your draft is saved."*), and tapping it picks the phone up; its apps are drawn as tiles like his, Messages the same icon |
| 27 | The record | Nitin was promised *"Tumhara naam kahin nahi aayega"*, but THE CAR and THE LIE name him and can only be left out whole | p | ⬜ Intended? |
| 28 | Mail | Addresses end in `.example` (`sameer@skfilms.example`) | p | ✅ Kept `.example`, which can never be a real business, but behind the sender's name, as iOS Mail keeps it: tapping the name shows it |
| 29 | Notification Centre | Every item is stamped "now", including ones hours old in the story | p | ✅ "now", then "39m ago", then the time it came, on the story's clock (`minutesSince`) |
| 30 | Instagram | No feed, and an empty Messages; it's a story ring on black (see #10) | p | ✅ A feed of his posts under the rings, each name opening the profile; Messages only when there are any. A post that proves something stays out of the feed |
| 31 | Raju's call | No call timer or controls, so it reads as a dialogue box rather than a call | p | ✅ The call's time runs under the number once it's picked up, as iOS shows it. No dead buttons added |
| 32 | Charger | "Waiting for a charger…" doesn't say a cable will appear, and the 2 minutes feel long | p | ✅ *"No charger nearby? In two minutes you can plug it in here."* |
| 33 | Lock screen | A mouse drag didn't open it, only its button did; untested with touch | p | ➖ Not a bug: the drag started off the screen (a screenshot at another scale). A swipe from mid-screen and from the bottom edge both open it |

**What held:**
- The first minute: parcel, envelope, "Its ringer is on", 47 missed calls, Raju ringing.
- The writing: the security group as a timeline, the archived Chhotu chat, Safari's history, Nitin's *"Maine check bhi nahi kiya"*, Meera's *"Maine galat kaha tha"*, and "He held the light."
- The unreliable narrator: the struck version in the record, and 1:52 as the real turn.
- The phone: Recently Deleted with days left, Revert, Hidden, airplane mode, "It isn't your phone."
- The endgame: In / Leave out, Send / Post / Return, "Only this ending showed", and the facts and helplines on the end card.
- The charger gate's cable after 2 minutes: no dead end without a charger.
- No app errors in the console.

**Would players come back for Chapter 2?** The story earns it. Right now the
game doesn't ask: #17 leaves finishers with nothing to wait for, #12 teaches
them the puzzles are arbitrary, and #11 spoils the middle hour for exactly
the players most likely to return. Fix those three first.

**Answers part of S12's list:** a genre player finds Archived, the bin, Revert
and Hidden without any hint, and finds them in Episode 1.
