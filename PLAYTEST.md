# Found — full playtest, 2026-09-19

> **Retired chapter.** This playtest is of *Don't Cut the Call*, retired on 2026-09-22 (git tag `dont-cut-the-call`). It stays for its lessons about how the phone should feel; nothing in it describes *Shagun*.

Played from a cleared browser at 375 × 812 (phone), from the desk to every
ending, as a player. Every issue is logged where it was met, then fixed in
one pass. **Sev:** B blocker · M major · m minor · p polish.
**Status:** ⬜ open · ✅ fixed · ➖ won't fix (reason given).

## Desk and pouch

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 1 | The desk's pouch strip says **"PULL TO OPEN →"** but on the desk it's a tap (it's a link) | UI copy | m | ✅ |
| 2 | The case page's pouch **doesn't buzz**, though the desk's does and the phone inside is on a call | Motion / continuity | m | ✅ |
| 3 | Tearing the pouch **cuts straight to the note**: no tear, no phone sliding out, no sound | Motion / sound | M | ✅ |
| 4 | The note's English translation is printed **on the paper**, as if she'd written it | Story / UI | m | ✅ |
| 5 | The phone and the power bank sit **side by side**; the story says "taped" | UI | p | ✅ |
| 6 | The case page's eyebrow wraps awkwardly ("…EPISODE 1 · CALL MAT / KAATNA") | UI | p | ✅ |

## The call and her lock screen

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 7 | With the call full screen, **her status bar is hidden**, and with it the blue recording pill: the chapter's "always visible" tell | UI / story | M | ✅ |
| 8 | Times on her phone have a **leading zero** ("01:11"); an iPhone shows "1:11" on the lock screen and status bar | iOS fidelity | M | ✅ |
| 9 | The 1:11 alert appears **twice on the lock screen**: as a banner over the clock *and* in the list below it | iOS fidelity | m | ✅ |
| 10 | **Banners never go away** on their own; the alert still covers the Open Question widget after unlocking | iOS fidelity / UX | M | ✅ |
| 11 | **Every app badge is drawn at the screen's top-right corner**, stacked, instead of on its icon (badge is outside the tile) | UI bug | **B** | ✅ |
| 12 | The **Case file** in the dock has the **same icon as Notes**, and the dock has no labels: the most important app is unrecognisable | UX | **B** | ✅ |
| 13 | The minimised call is parked **top-right, over app content** (evidence list, Settings values, chat bubbles); nothing can be read under it | UX | M | ✅ |
| 14 | Settings shows **"RBI Secure KYC · installed Thursday 8:14 PM"** on the top-level row from the first minute: Episode 2's twist, given away, and not how iOS shows it (it lives one level down) | Story / iOS | **B** | ✅ |
| 15 | Every app's **root screen has a back button**; iOS apps don't (you leave with the home bar). Needs a tappable home bar for desktop | iOS fidelity | m | ➖ kept: on a desktop the back circle is the only visible way out; the home-bar swipe still works on a phone |
| 16 | Settings: her name wraps onto two lines beside "2 devices" | UI | p | ✅ |
| 17 | Evidence named **"Whose phone this is"** states Q1's answer instead of the clue | Story | m | ✅ |
| 18 | Her Notes app is still the simplified style: no Notes yellow, no preview line, no date groups | iOS fidelity | M | ✅ |
| 19 | Times use **three formats**: "01:11", "17:52", "8:10 PM" | iOS fidelity | M | ✅ |
| 20 | **Idle lines from every episode are pooled**: "Subah ho rahi hai" (it's getting light) plays at 1:13 AM | Story | M | ✅ |
| 21 | The lock screen says **Nikhil missed-called her at 11:58 PM**; the story is that *she* called *him* then and he didn't answer. His WhatsApp row says "Missed voice call" for the same outgoing call | Story | M | ✅ |
| 22 | WhatsApp has **no header, no back, no tab bar, no unread counts**; previews show "41 members" and phone numbers instead of the last message | iOS / WhatsApp fidelity | M | ✅ |
| 23 | **BLOCKER, found and fixed mid-play:** opening a WhatsApp chat **crashed the game** (infinite update loop: every save stamped a new time, and the read effect re-saved forever) | Bug | **B** | ✅ |
| 24 | WhatsApp chat header is broken: avatar overlaps "‹ Chats", the name floats right | UI | M | ✅ |
| 25 | The **photo Rukhsana sent** renders as an empty bubble with only "13:31" | UI | M | ✅ |
| 26 | Voice-note ▶ buttons do nothing | UX | m | ✅ |
| 27 | After a reload, the call **re-expands full screen** if it was put away by an arriving alert (only a manual minimise is remembered) | UX | m | ✅ |
| 28 | Zooming into the clock **finds** evidence silently: no sign it counted | UX | M | ✅ |
| 29 | **No pinch-to-zoom** on the call: only double-tap and the mouse wheel; on a phone, pinch is the gesture | Gesture | M | ✅ |
| 30 | The case file's pick list grows to 19+ items in one undifferentiated column | UX | m | ✅ |
| 31 | Q4's reply says "the writing on his wall is Burmese" even when the player never looked at it | Story | p | ✅ |
| 32 | **Episode 1's last beat plays inside the minimised call**, captions hidden, while the player reads the Q4 answer: the supervisor, the power bank dying and "Aunty, aap ho na?" are missed; the charger cuts in 1 s later | Timing / story | **B** | ✅ |
| 33 | The charger screen talks about the call ("he is still talking") while the call has vanished from view; its narrator knows things the player doesn't ("neither of you knows that yet") | Story / UI | m | ✅ |
| 34 | **No episode title cards**: nothing marks Episode 2 "Delete for Everyone" or Episode 3 "10:30" | Experience | M | ✅ |
| 35 | Plugging in cuts **straight to Nikhil ringing**, before the call's "charger laga diya?" line; the script has him ring at 1:34 while Episode 2 opens at 1:40 | Timing / story | M | ✅ |
| 36 | The incoming-call screen isn't iOS: no glyphs on the buttons, name mid-screen, no ringtone or buzz, and it replaces her phone instead of ringing on it | iOS / sound | M | ✅ |
| 37 | Nikhil **hangs up instantly** after the player's reply, with no reaction | Story | M | ✅ |
| 38 | "His mother died half an hour ago" at ~1:40; she died at 12:40 | Story | p | ✅ |
| 39 | After plugging in, **her battery still reads a red 4%**: no charging bolt, never rises | UI / continuity | M | ✅ |

## Episode 2

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 40 | Recents is **not in time order** and **Nikhil's call from a minute ago isn't in it**; the running call shows a frozen "31 h 33 min"; no iOS Phone tab bar | iOS fidelity | M | ✅ |
| 41 | The "how she died" board labels a newspaper's claim **"BLUFF"** (a word for accusations); its "where to look" omits Photos, which holds one of the proofs | UX / copy | m | ✅ |
| 42 | Instagram isn't Instagram: blue segmented buttons, no stories row, no DM list look; the cat is drawn like a shield | iOS / app fidelity | M | ✅ |
| 43 | Instagram's "Messages" tab has the same label as the Messages app (ambiguous to assistive tech and to tests) | a11y | p | ✅ |
| 44 | **Diary page 6 is fully readable in Recently Deleted** but only counts once recovered: a player who reads it there thinks they've found it | UX | M | ✅ |
| 45 | PikDrop is a generic settings list: no courier-app identity, no map of the route | App fidelity | m | ✅ |
| 46 | **Shaila's messages are stamped 2:14 and 2:31 AM while her clock says 1:42**: messages from the future (Episode 2 opens too early in the night) | Story / time | M | ✅ |
| 47 | Shaila **replies instantly**, with no "typing…" | Timing | M | ✅ |
| 48 | The player's **second reply to Shaila ("6:15. Shivaji Park") never appears** in the thread | Bug | M | ✅ |
| 49 | **Her real note is set in BLOCK CAPITALS**, like the forged one; the clue is her cursive against their capitals. The Marathi blessing is missing | Story | M | ✅ |
| 50 | The timeline rows are **out of order** (00:21 before 00:08) and its instruction sits under the list | UX | m | ✅ |
| 51 | After the timeline, **"Nothing else to answer yet"**: nothing points at Settings, where Episode 2 ends. A player can stall here | Story / UX | **B** | ✅ |
| 52 | **Telling Sahil she's dead gets no reaction**; he carries on with "Madam, aap sun rahi hain na?" to a stranger's voice. The script's break ("Nahi…", the supervisor's shadow) was never written as cues | Story | **B** | ✅ |
| 53 | Episode 2 ends **3 s after Settings is opened**, whether or not the profile was looked at; the script has the player open the profile | Story / timing | M | ✅ |

## Episode 3 and the endings

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 54 | **"Sit up" → the arrest rings 0.5 s later.** The morning's relief (D'Souza's thank-you, the 6:42 article) is never seen; the script gives it about sixty seconds | Timing / story | **B** | ✅ |
| 55 | The arrest is **a text transcript** on a generic screen; it's a WhatsApp *video* call on *your* phone, with the supervisor in frame | UI / story | M | ✅ |
| 56 | **Her battery reads 4% at 10:29 AM** after charging all night (should be 61%) | Continuity | M | ✅ |
| 57 | The 6:42 article arrives as a "now" banner at 10:29 | Story / time | p | ✅ |
| 58 | Typing the password in Episode 3 produces a **debit stamped 3:02 AM**, hours before it was typed; the charge board then calls it a 3:02 transfer | Story / time | m | ✅ |
| 59 | "Unknown Senders" is drawn as **one contact called "Unknown senders"**; on iOS it's a filter over real senders | iOS fidelity | m | ✅ |
| 60 | The charge board lists charges **he never read out** (a clean player sees "They have your voice") | Story / UX | M | ✅ |
| 61 | **Solving 1930 jumps straight to the choice**; the reply ("the third time tonight he has risked himself") is never seen | Timing / story | M | ✅ |
| 62 | Nothing in Episode 3 points at **removing the profile**, the chapter's one irreversible act | Story / UX | m | ➖ optional by design; the profile's own page now offers Remove Management plainly in Episode 3 |
| 63 | Your phone still says **"It stays quiet until 10:30"** after 10:30, and shows "No notifications" during the arrest | Continuity | m | ✅ |

## Across the whole game

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 64 | **Almost silent**: the only sound is the banner buzz. No ringtone for Nikhil or the arrest, no connect/end tones, no message sounds, no tear | Sound | M | ✅ |
| 65 | The screenshot pane stalls CSS animations, so motion was judged from code; on-device motion needs a real phone | Test note | — | ➖ |
| 66 | "Instagram" truncates to "Instagr…" on the desktop phone | UI | p | ✅ |

## Found while fixing

| # | Issue | Domain | Sev | Status |
|---|---|---|---|---|
| 67 | Leaving the case file mid-answer forgot the proof already laid out | UX | m | ✅ |
| 68 | Episode 3's charge-sheet question was open (and nudged) **before the arrest had rung** | Story / timing | M | ✅ |
| 69 | Instagram filled only the top half of the screen; the home screen showed through | UI bug | M | ✅ |
| 70 | The neighbour's story counted as watched the moment Instagram opened (grey ring, found without listening) | Story / UX | m | ✅ |
| 71 | An alert that arrived on the lock screen popped again as a banner after unlocking | iOS fidelity | m | ✅ |

---

## Pointers: what the playtest found, and what was done

**The headline.** The chapter was complete but didn't *play* well. One crash,
four places a player could stall or miss the story's key beats, and a phone
that still read as a web page in its busiest apps. All of it is fixed except
three deliberate calls (➖ above) and what needs real media (ASSETS.md).

**Blockers (7), all fixed**
- **Crash (#23).** Opening a WhatsApp chat looped forever. A save that
  changes nothing is now skipped, and the apps' read callbacks are stable.
- **Stalls (#51, #54).** Episode 2 ended on a Settings visit nothing pointed
  to; a new question ("They knew every tap. How?") leads there. The arrest
  rang half a second after waking; the morning now gets a minute, with
  D'Souza's thank-you arriving first.
- **Missed beats (#32, #52).** Episode 1's last beat played in a minimised
  window; the power bank dying now brings the call back up and the charger
  waits for his last line. Telling Sahil she's dead now breaks him ("Nahi…")
  and brings the supervisor back; saying his name does too.
- **Spoiler (#14).** Settings showed Episode 2's twist on the top level; the
  profile now lives on its own page, as on iOS, and opening it is the find.
- **Unreadable home screen (#11, #12).** Badges were piled in a corner and
  the case file wore the Notes icon; badges sit on their tiles and the case
  file is a folder with a magnifier.

**Story and time**
- Episode 2 opens at **2:35 AM** behind a title card, so Shaila's 2:14 and
  2:31 messages are in the past; Nikhil rings half a minute in, reacts to
  what he's told, and appears in Recents.
- Her **real note** is her own cursive, sentence case, signed, with a Marathi
  blessing, against the pouch's block capitals.
- Idle lines belong to their episode, and change once a stranger has spoken.
- The password typed at night is used at 3:02; typed in the morning, at
  10:34, and the charges say so. The charge board lists only what he read.
- Solving 1930 shows its reply before the choice; Episode 3's questions
  wait for the arrest; the 6:42 article sits in the list with its real time.
- Smaller: the missed call is now his, from Friday; clue names no longer
  give answers away; replies fit every route in.

**The phone**
- 12-hour times everywhere ("1:11", "11:48 PM"); the status bar (and the
  blue pill) stays above the call; banners slide away after 5 s and never
  pop over the lock screen; her battery charges in Episode 2 and is 61% in
  the morning.
- **WhatsApp** rebuilt on the pilot's design: Chats title, previews, unread
  counts, tab bar, a proper contact header, photos, handwriting, voice notes
  that play their length, and replies that arrive after "typing…".
- **Instagram** as Instagram: wordmark, story rings, Direct in its colours.
  **Notes** in iOS Notes' style. **PikDrop** with its orange and a route map.
  **Recents** in order, live. **Unknown Senders** as real senders.
- The incoming call is iOS's, rings until answered, and the arrest is
  *video*, with the supervisor in frame.
- The minimised call parks bottom-right and can be **tucked away at the
  edge**; the call has **pinch-to-zoom**, and a zoom that finds something says
  "noted".

**Motion and sound**
- The pouch shivers because something inside is ringing, and tearing it
  lifts the phone out before the note; the phone is taped to its bank.
- Synthesised tones (lib/found/tones.ts): a ringtone, connect and end, sent
  and received. Sounds of real objects (the tear, voices) wait for the
  recordings in ASSETS.md.

**Still open / for a real phone**
- Motion and haptics were judged from code, because the test pane pauses
  animation; they want a pass on an actual iPhone and Android.
- Voices, video and handwriting are placeholders until the shoot (ASSETS.md).
