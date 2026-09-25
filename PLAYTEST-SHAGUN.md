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
| 17 | End card, desk | **Nothing asks a finisher to come back.** No Chapter 2 tease, date or notify-me on the end card; after a finish the desk shows only the bagged phone, and even "More are being found." is gone | M | ✅ The end card ends on Meera: “Ek aur phone aaya hai. Mumbai se.” The desk says Case 2 is on its way |
| 18 | End of Episode 2 | `the-gap` fires 25 s after Q9 ([episode2.ts:437](content/shagun/episode2.ts:437)): Raju, Sameer and Bhasin's *"Jiske paas bhi ye phone hai — wapas kar do"* land and the Episode 3 card cuts over them. Their replies carry into Episode 3, but Bhasin's threat gets no beat | m | ✅ `quiet` events wait for the phone to be put down: the gap now turns 15 s after the player is back on the home screen, never inside an app or with their own phone in hand |
| 19 | Q6, Q10 | The boards solve themselves: each row's text names its lane ("Two shots… dance floor", "Gets Vicky's car"). Reading, not deduction | m | ✅ Q6 is a sentence now; the board's rows are quotes with nobody's name on them |
| 20 | Q7 | The player never names the shooter: they table proof and the reply says "Sameer." The accusation is the genre's payoff; let them make it | m | ✅ The player finishes the sentence: “…{Sameer} fired twice, and the {second} shot hit Dilip” |
| 21 | Parcel, desk | M is solved on the label ("TO MEERA ARORA, Advocate, Saket Courts") while the desk teases "someone called M". Meera is still only reachable by opening M's contact info in WhatsApp | m | ✅ Meera's mobile is on the label and she can be written to from minute one; the desk no longer teases “someone called M” |
| 22 | Meera | *"Kisi ko reply mat karo"* arrives after the game has had you reply to Raju, Sameer and Nitin | p | ✅ Her advice is now “…soch ke reply karna”: think before you reply |
| 23 | `file` questions | With one claim offered, **File it** stays disabled until the claim card is tapped, and nothing says so | m | ✅ A lone claim is the one chosen, and shows selected |
| 24 | Q10 | The instruction still says *"Tap each row until it sits in its lane"*; with five lanes a row opens chips | p | ✅ *"Tap a row, then choose its lane."* on a board with chips |
| 25 | WhatsApp | At an episode's start, chats already read get unread badges again (Banyan — Security 4, Sethi 1, Bhasin 1) with nothing new in them: the evidence nudge in [Chat.tsx:423](components/owner/apps/Chat.tsx:423). Reads as a glitch | p | ✅ What was read early counts the moment its episode opens, with no badge and no "Noted" |
| 26 | Your phone | On mobile it's a 12 px edge that went unnoticed until the widget pointed at it; inside, four glyph icons, much plainer than his iPhone | m | ✅ Whatever lands on yours slides out from the edge as a note for 6 s (*"Your phone · Pulse: Your draft is saved."*), and tapping it picks the phone up; its apps are drawn as tiles like his, Messages the same icon |
| 27 | The record | Nitin was promised *"Tumhara naam kahin nahi aayega"*, but THE CAR and THE LIE name him and can only be left out whole | p | ✅ Links that name him can go in “Without his name”, and the ending says if a promise was broken |
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

---

# Shagun — played for the story, 2026-09-25 (after the layers)

> **Still not the human playtest.** Claude played it a third time, after the
> layers (8c88cc2). This time the question was not whether it works but
> whether the story and the play would hold someone through Chapter 1 and
> bring them back for Chapter 2, without assuming the current design is right.

Played from a cleared browser at 375 × 812, from the desk, unseeded, on a
Mac on mains power (so the charger gate passed by itself). The route:
- Raju asked "Dilip kaun?".
- Every chat read in Episode 1, the archive included.
- Mummy told a stranger has the phone.
- Sameer answered as M, then told "Goli tumne chalayi".
- Raju answered carefully.
- Nitin protected.
- Sameer confronted with 1:52.
- The record posted on Pulse with every link in: **The Complete Record, 10 of 11** (the money left).

The desk says **28 minutes**: Episode 1 ~14, Episode 2 ~6, Episode 3 ~8. Canon §19
aims at 45–70 minutes *an episode*.

| # | Where | Issue | Sev | Status |
|---|---|---|---|---|
| 34 | Episode 1 | **The chats solve the case in Episode 1.** Everything below is in plain view, in the chats that both "For M" and Sameer send you to.<br>• **Sameer fired** (Episode 2's reveal): Kunal's *"Papa wali le aaunga"* and Sameer's *"back lawn, 12:15"*, then the group's 12:36 *"Sameer, gun Kunal ko do"*.<br>• **Dilip was alive** (Episode 2): 1:07 and 1:14.<br>• **The lie** (Episode 3's final reveal): the archived Nitin chat, 1:22–2:04, with 1:53 answering nothing, and *"Driver bol raha tha cancel ho gaya"*.<br>By about minute 10 a careful reader holds the whole chain. The layers (#11) held back five media items; the text still carries the chain | M | ✅ Bhasin's group has disappearing messages (the night is in screenshots, in iCloud until Episode 2); Nitin's and Chhotu's chats are behind Chat Lock |
| 35 | Q3 | One claim is on offer: Sameer's version. A player who suspects Sameer (from #34) has to file what they believe is false. The Revisit then "cracks" what they cracked in Episode 1 | M | ✅ Q3 is said: Kunal (his version), someone (what the phone shows), or Sameer (a hunch) |
| 36 | Every question | **The player never says the answer.**<br>• In a pick question they table two items and the game writes the conclusion.<br>• In a file question they choose a written claim. The final reveal itself is a card to tap: *"At 1:52 Sameer told Nitin… He knew he hadn't."*<br>Canon's model (§12: observation → inference → contradiction → action) becomes observation → pick | M | ✅ Every question but the board is a sentence to finish, then prove |
| 37 | Episode 2 | Six minutes. At its open the case file already held Q8's and Q9's proof, read in Episode 1 and counted by #25. Q5–Q7 needed one visit to Photos. "The Second Shot" plays as five stamps | M | ✅ Follows #34 and #36; Q6 merges the two firings and the shot |
| 38 | Q7, Q11 | The two big reveals land as receipts. "Sameer." is a line after Answer. Nothing on the phone reacts: no call, no Sameer online, no pause | M | ✅ “Sameer.”, “Alive.”, “He knew.” land large; Raju rings after “Alive.” |
| 39 | Live characters | Each person gets one or two exchanges, then "It isn't your phone."<br>• Pretending to be M gets two lines from Sameer.<br>• Nitin sends the decisive screenshot to an unknown number in one message (*"Theek hai. Ye lo."*), and the option that asks him already names 1:52 | M | ✅ Raju rings twice and asks the last question; Sameer steers and gives the code away; Nitin wants a reason |
| 40 | Tension | Bhasin knows someone has the phone, Find My plays a sound, and Mummy tells Bhasin. Then nothing reaches the player. The thriller's threat never escalates, and on mains power even the battery doesn't press | M | ✅ Bhasin rings in Episode 3, then “Location dekh li hai.” Airplane mode is the counter |
| 41 | Endings | The human threads don't close.<br>• Raju's *"Dilip ke baare mein kuch pata chala?"* is never answered.<br>• The ending is about the post's reception.<br>• "Send to Meera" needs M's contact info opened in WhatsApp. All 13 questions were answered without it, so the only way out was to post publicly | M | ✅ Raju's last question; Meera from the label; the endings read Raju, Bhasin and the train |
| 42 | Q8, Q11 | The answers narrate Safari's 12:44 and 1:56 searches, which were never opened (like #5) | m | ✅ Answers mention only what their proof shows |
| 43 | Q9 | The answer points out the 1:53 gap (*"answering a message that isn't in his chat"*): the cliffhanger is explained, not noticed | m | ✅ Q8's answer ends at 2:04; the gap is Q9's to ask |
| 44 | Curation | He deleted his memo, the reel take, Kunal's photo and frame, and his own 1:52 message. Yet he left *"Sameer, gun Kunal ko do"* and *"Papa wali… back lawn, 12:15"*. The realism audit (§18) needs a rule for what he could and couldn't edit | m | ✅ One rule: kept what points at others, deleted what points at him, locked the rest |
| 45 | Episode 1 → 2 | On mains power the phone died, passed the gate, and the "12:32 AM" card went by while Sameer's chat was open. Episode 1's cliffhanger gets no pause | m | ✅ A charger already in: the player plugs his phone in by hand |
| 46 | Raju's call | His answer to the choice flashed, and the call ended before it was read. Nothing keeps it afterwards | m | ✅ The whole answer plays, then the call waits for End |
| 47 | Lock screen | Mummy's notification has no English under it | p | ✅ |
| 48 | Parcel | A mouse drag on "Pull to open" selects the text | p | ✅ |
| 49 | Mail | The train to Mumbai leaves tomorrow at 4:55 PM: a ticking clock and a bridge to Mumbai, unused | p | ✅ Sameer's train is the endings' last line before Dilip's |
| 50 | Photos | 7 photos and a video on a phone that's "84.6 GB" of photos, with 1,284 from the wedding. No haystack | p | ✅ Sixteen more wedding photographs (the rest is S11) |

**What's genuinely strong:**
- **The story.** "I told him Dilip had already left. I knew he hadn't." is a better twist than "who pulled the trigger". Canon's chain of responsibility is adult and rare in mobile mysteries.
- **The voices.**
  - Raju: *"Usko bharosa tha. Sameer bhaiya hain na, sab sambhaal lenge."*
  - Dilip at 1:07.
  - Sameer: *"Galti thi. Par uske baad jo hua, woh Bhasin ne kiya."*
  - Mummy: *"Main Bhasin uncle ko batati hoon."*
  - These are the best things in the game.
- **The first five minutes.**
  - the parcel and the envelope's three lines
  - 47 missed calls
  - Raju ringing: *"Dilip kahan hai?"*
- **The phone itself.** It feels real, and the title cards' minutes (12:32 and 1:52) are an elegant device.
- **The record.** Eleven links to keep or leave out under your name is the right last decision.

**Verdict.**
- **Will people finish Chapter 1?** Most will: it's short, guided (the widget, badges, "Where to look", hints) and gripping from the first minute.
- **Will they come back for Chapter 2?** Not yet. The story makes them want more, but the play hands it over as paperwork:
  - the case solves itself in the chats (#34)
  - the player never states a conclusion (#36)
  - the reveals arrive as receipts (#38)
  - the people are brief (#39)
  - nothing threatens the player (#40)
  - nothing on the end card asks them back (#17)
- A genre player will feel a step ahead of the game from minute ten. That player is the one most likely to return, and the one this costs.

**What would change that, in order.** None of it contradicts SCRIPT.md: the events stay, and what changes is when the phone shows them and how the player answers.

1. **Let the night unfold, a layer an episode (#34, #37).** Episode 1 should hold only what Sameer curated for M, plus his life. The timeline sources should open in layers, each key found in the layer before, as *A Normal Lost Phone* does. Two real WhatsApp features fit:
   - **Disappearing messages on Bhasin's group.** An ex-cop would turn them on. What survives is Sameer's screenshots, which come down from iCloud in Episode 2.
   - **Chat Lock with a secret code.** Nitin's and Chhotu's chats sit in a hidden Locked Chats folder that opens when the code is typed into search, and a later episode gives the code.
2. **Make the player say it (#35, #36).**
   - Claims become sentences to fill in from words found on the phone (names, times, places), *Golden Idol*-style: "At __, __ told __ that __." Tabling proof becomes the second step.
   - A player can pin a hunch at any time. When the story gets there, the game says *"You called this at 11:49 PM."* Being ahead becomes the reward instead of the boredom.
3. **Stage the three reveals (#38).** The shot, alive and the lie should each make the phone react:
   - Sameer comes online and is "typing…" for a long time.
   - Raju calls.
   - The screen dims.
4. **Three relationships with arcs instead of six cameos (#39).**
   - **Raju** is the heart.
   - **Sameer** is the narrator who steers, and can be caught lying while you play M.
   - **Nitin** has to be won over before he hands anything to a stranger.
5. **Put the player in the thriller (#40).** Bhasin escalates on whoever has the phone. Examples:
   - a call from his number at 1:30 AM
   - after Find My, *"Hum jaante hain phone kahan hai"*
   Then Return to Sender becomes a real temptation.
6. **End on people (#41).**
   - The last choice includes what to tell Raju.
   - Meera is reachable from the parcel's label, with no hidden step.
7. **Ask them back (#17, #49).** Canon §21 already has the hook: Meera gets another handset, from Mumbai. The end card and the desk should say so, with a date or a notify-me. Sameer's 4:55 PM train can carry it.

Of these, 1 and 2 fix the most. 3–7 are smaller, writing and staging work.

**Fixed the same day (2026-09-25), all of it, for friends to play.** See
CHAPTER1.md's first section and ROADMAP "Chapter 1 for its first players".
Played again end to end in the browser at phone size:
- the doors in Episode 1
  - the vanished group
  - screenshots and a video that won't load
  - Voice Memos offloaded
  - Chat lock in WhatsApp's Settings
  - the locked note
- Q3 filed as a hunch, and *"You called it at 11:45 PM."* under **"Sameer."**
- Raju ringing after **"Alive."**
- Sameer giving the code away
- Nitin wanting a reason and trusting Raju's
- Bhasin ringing
- **"He knew."**
- Raju's last question
- the record sent to Meera with Nitin's name kept out
- the Chapter 2 card

A version player sees Episode 1's line struck under "Sameer.".

Still open for a person: the human playtest on real phones, and S11's assets.

---

# Shagun — played as a stranger, 2026-09-26

The whole chapter at 375×812, from the parcel to Meera, going only by what
the screen shows. Asked: is this a gripping thriller Indian players will talk
about? **The story, yes. Episode 2 and Chhotu's locked chat carry it, and
"Maa ko kya bolun?" and the grey safari suit at the guard are what people
will argue about. The build, not until the fixes below. Nobody gets gripped
through placeholders and a proof rule that calls them wrong for being right.**

Caveat: whoever wrote it can't play it fresh. Twice the way on came from the
code (the badge's spot, which proof counts). A friend has neither, so both
are stalls.

51. ✅ **The obvious proof was called wrong, four times.** The waiter's portrait
    (Q2), the deleted reel (Q5), the Swift at the gate (Q8) and "For M" (Q13)
    each got *"Take out what doesn't."* An audit found the same gap on Q7, Q9,
    Q11 and Q12. Fixed: a claim's `also` names evidence that is true and on the
    point. It can sit beside a whole route and never completes one.
52. ✅ **Nitin's chat showed words the player never chose.** "Promise" and "for
    Raju" both set `did:protect-nitin`, and `chosenIn` took the first option
    sharing a flag. Every player who promised (for most, the only option they'd
    earned) saw the Raju line and Nitin answering it. Fixed: the option whose
    flags are all set, the most specific first.
53. ✅ **The board said only "Not quite."** With 13 rows and 5 lanes, it took all
    three hints. Nitin's own 1:40 *"Mandi Road wala na?"* belonged only in the
    car's lane. Fixed: it says how many rows are in the wrong lane, never
    which, and 1:40 is right in Nitin's lane too (`orLane`).
54. ✅ **The end card printed Nitin's name after it was kept out.** "The chain"
    used each link's `truth`, and that is the screen people screenshot. Fixed:
    a link kept "Without his name" shows its unnamed line. Found on the way:
    a save holding an `anon` row was thrown away on reload (`upgrade` didn't
    know the choice). Fixed too.
55. **Placeholders cost more than polish.** Photos are sentences on brown
    squares. Q2's name badge needs a zoom that nothing invites, and Q12's "his
    hands, with the kada" needs the kada from his Instagram. S11 is what turns
    clever into gripping.
    Started 2026-09-26:
    - Ten free-licence Pexels frames for scenes with no character's face (ASSETS.md "Stock stand-ins").
    - Voice scripts per actor (VOICE-SCRIPTS.md).
    - Still open: the character photos (generated or cast), recordings, and audio playback.
56. ✅ **Episode 1's questions are clerical after a huge hook.** "They burned him"
    lands in the first two minutes. Then Q1–Q4 ask whose phone this is, who
    the poster boy is, and when the phone was set up. Nothing says why the
    parcel came to *you* until Sameer does, in Episode 2.
    Fixed: each question now asks about the stakes, with the same answers and proof.
    - Q1: *"Who is “S”, and where is he going?"* He's leaving Delhi a week after the wedding.
    - Q2: *"Dilip is missing. Where was he last seen?"*
    - Q4: *"Someone set this phone up for M to read. When, and where does his list stop?"*
    - The parcel's label now reads *"From: S. Khurana · your address"*, so "why me?" is the first mystery, not a gap.
57. **Smaller:**
    - "Pulse: Your draft is saved" from your own phone, with no context.
    - Your own phone isn't introduced before the ending.
    - The locked note drops typed letters silently on a laptop.
    - Raju's "Kaunse hospital mein?" hangs while you press End.
    - The proof list grows to about 40 rows to scroll on a phone.
