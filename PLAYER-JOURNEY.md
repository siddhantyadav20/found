# FOUND — The player's journey
## Chapter One: *Don't Cut the Call* · the experience plan

The story is [CHAPTER1.md](CHAPTER1.md). This document is the other half: what
a person feels, minute by minute, from the moment they tap a link to the moment
they put their phone down, and what the interface has to do to earn each of
those feelings. The phased build plan is [ROADMAP.md](ROADMAP.md).

Written for the pivot of 2026-09-17. Nothing here assumes the old build.

---

# PART 0 — The six laws

Every screen in this chapter obeys these. When a design decision is unclear,
the law wins over the convention.

**1. Obedience arrives before understanding.**
The player's first act is to follow an instruction from someone they've never
met: *Call mat katna.* They obey because they're curious, not because they
trust. Ninety minutes later they learn the instruction was the enemy's. The
whole chapter is that sentence, so **the note must be the first thing they
read and the easiest thing to obey.** No tutorial, no menu, no options, no
"how to play" between the pouch and the call.

**2. Every convenience is a hook.**
Real scams work through helpfulness. So does this game. The hint that saves
you is a hint they planted. The PIN that opens a folder is the PIN they
wanted. The charger that keeps the call alive keeps their camera alive.
**Anything the game does *for* the player in Episodes 1–2 must be something
the syndicate would also want.** Nothing kind in this chapter is free.

**3. Fair play is absolute.**
Every trap is avoidable, every deduction is reachable two ways, and every
twist is visible in hindsight on a screen the player already saw. The player
must be able to say *"it was there"*, never *"how was I supposed to know?"*
A trap that can't be dodged is a cutscene wearing a costume.

**4. Dread is made of timestamps, not jump scares.**
No sudden noise, no red flash, no gore. The scares in this chapter are:
a note edited at 12:39 AM, a call timer that never stops, an icon nobody
explained, and a stranger saying *"Good morning, #9."* **Quiet, specific,
checkable.**

**5. The player's hands do the irreversible things.**
Tearing the pouch, plugging in a charger, typing a PIN, dragging a phone into
the sea, pressing send. Never a button labelled "continue". If it matters, it
takes a gesture, and the gesture is the memory people keep.

**6. Never fake the real world.**
No real camera, microphone, contacts, location or personal data, ever. No
notification that imitates a police force, a bank or a messaging app. The game
is about manufactured authority, so it can't manufacture any of its own.
This is a hard rule, not a preference.

---

# PART 1 — The arc of feeling

| Minute | Where | What the player feels | What the design does to cause it |
|---|---|---|---|
| 0:00 | Link → desk | *Curiosity with a little guilt* | The desk, one object, no copy explaining the product |
| 0:30 | The pouch | *This is mine to open* | Their name on the sticker (from a drop), a physical tear |
| 1:00 | The call | **Panic, then obedience** | A live face, a timer, an instruction they follow |
| 2:00 | The news alert | *Dread with a specific shape* | She is dead, and he doesn't know |
| 4:00 | Her home screen | *Intrusion* | 3,412 unread, a grandson, huge font: a real life |
| 8:00 | Her notes | **Admiration** | She knew. She was never the victim |
| 12:00 | The clock on his wall | *Vertigo* | The villain is a hostage |
| 13:00 | The charger gate | *Complicity* | They power the thing that watches them |
| 20:00 | Tanvi, the terrace | *Anger* | A 20-year-old sold her for fear, and a man asked for the diary |
| 26:00 | Row 9 | **Cold** | The address is theirs |
| 32:00 | The PIN | *Cleverness* | They solved it, and that is the trap |
| 36:00 | The real note | **Shame** | "CUT THE CALL." They did the opposite for 36 minutes |
| 38:00 | "Good morning, #9." | *Exposure* | The watcher speaks, and the icon was always there |
| 40:00 | Morning, your phone | *Sick anticipation* | Sunlight, a thank-you from a man she saved |
| 42:00 | Your arrest | **Vertigo, personal** | Every charge is theirs and true |
| 46:00 | The choice | *Loneliness* | Two orders, three answers, no right one |
| 48:00 | The end card | **"Go back and look"** | The ledger, then the first notification's icon |

Two peaks (minute 8 and minute 36), one crash (minute 42), one silence at the
end. If a build flattens any of those four, it has failed, whatever else it
gets right.

---

# PART 2 — Stage by stage

## Stage 1 · Arrival (0:00–0:30)

**Where players come from.** A WhatsApp forward from a friend (a drop link), a
reel, or the desk itself. Assume: an Android phone, 4G, one hand, possibly in
bed at night, possibly inside Instagram's in-app browser.

**What they see.** The desk: a dark surface, one courier pouch, and the other
objects as unnamed silhouettes. No headline explaining what FOUND is, no
"Play" button, no sign-up, no cookie banner. The pouch carries a delivery
sticker: **their friend's handwriting with their own name**, when they arrived
by a drop.

**Psychology.** A found object is an invitation to trespass. Explaining the
product breaks it. The single strongest thing we own is that the first screen
asks nothing and offers one object.

**UX rules**
- **First paint is server-rendered**, so the pouch exists before JavaScript.
- **One tap to start.** Sound is offered *inside* the fiction, not as a modal:
  the phone's own ringer switch, before the call begins.
- **The content note lives on the sticker**, like a courier's declaration
  line: *Contains: death, fraud, human trafficking. 16+.* One line, legible,
  never a pop-up.
- **The "not real" line goes on the same sticker:** *This game never asks for
  anything real: no PIN, no number, no camera.* It reads as flavour and it is
  a promise.
- **In-app browsers get a note, not a wall** (as decided): offer Chrome,
  let them play anyway.
- **Returning players** see the pouch already torn, and the phone lying as
  they left it. Resume is the default; "Start over" asks twice.

## Stage 2 · The pouch (0:30–1:00)

**The gesture.** Drag to tear along the perforation. Real haptics
(`navigator.vibrate`) on the tear. Inside: the phone face-down, a power bank
taped to it with one LED lit, and a folded note.

**The note is a photograph, not text.** Block capitals, ballpoint, slightly
crooked in frame. **CALL MAT KATNA. SAB DEKHO. — V** with a small English line
beneath, the way the whole chapter subtitles Hinglish.

**Psychology.** Physicality creates ownership, and ownership creates guilt
later. The player must be able to say *I tore it open.*

**UX rules**
- Turning the phone over is a second gesture, not automatic.
- The power bank's LED is a **visible fuel gauge** from this second on.
- Nothing on screen is a game control yet: no HUD, no progress, no badges.

## Stage 3 · The call (1:00–2:30)

The screen is the call, full bleed: **Inspector Rathore**, a Crime Branch
board, 31:33:07 counting up, the mic crossed out and the camera off.

**The first choice is the red button.** A player's instinct is to hang up.
Let them press it. A confirm sheet slides up, and before they can answer,
Sahil leans in and whispers *"Mat kaatna… please."* Then he shouts his
script. **Both paths continue the game** (cutting it is a real branch, see
CHAPTER1.md F4), but the whisper is what keeps most hands off the button.

**Psychology.** A person on a video call is a social obligation. That's the
whole mechanism of the real crime, and the game earns the right to teach it by
making the player feel it in ninety seconds.

**UX rules**
- **The call never leaves the screen.** It becomes a small window with the
  timer, draggable, never closable. It is the chapter's only permanent HUD.
- **Mute and camera stay off by default**, and unmuting is always the player's
  deliberate act with a confirm-by-holding gesture.
- **He must feel alive while idle:** typing, drinking, glancing off-camera,
  a supervisor crossing behind him. Loops, not a freeze frame.
- **He speaks on cues, not on timers**, so nobody is interrupted mid-read.

## Stage 4 · Learning to look (2:30–8:00)

The news alert lands over the call. The player minimises the call themselves,
and the home screen is the first time they touch her life.

**The first question is answerable in fifteen seconds** — *whose phone is
this?* — because the point of question one is to teach that the case file
exists, not to test anyone.

**Psychology.** People don't fear being stuck, they fear looking stupid. The
old build's only real complaint was "I didn't know what to do". The fix isn't
more hints, it's **a world where the next thing is always visibly unread**:
badges on app icons, a count in the case file, and a single question in view.

**UX rules**
- **The case file is one question at a time**, with a free *where to look*
  naming apps, and three hints escalating from nudge to answer.
- **An idle nudge after 45 seconds**, counted separately from asked-for hints,
  so the ledger and the result never punish someone for being lost.
- **Badges count reachable-but-unseen evidence only.** They never bait.
- Two new question types this chapter needs: the **two-lane timeline** and
  **claim checking** (true / bluff), both described in ROADMAP P3.

## Stage 5 · The first turn, and the charger (8:00–14:00)

Her notes, her diary, his mother, the clock on his wall. Then the power bank
dies, the supervisor crosses, and Sahil asks the dark *"Aunty, aap ho na?"*

**The gate:** *To keep the call alive, plug your phone in.* The real Battery
Status API where it exists, a tappable cable everywhere else.

**Psychology.** This is the chapter's complicity beat. The player gets up,
finds a cable and plugs it in **for a stranger's sake**. Thirty minutes later
they learn what they were powering. Nobody forgets doing that with their own
hands.

**UX rules**
- Ask once, warmly, and never nag: the screen dims to the call and waits.
- Desktop and unplugged-laptop players get the on-screen cable, and the beat
  reads identically.
- **This is also the natural stopping point.** If someone leaves here, the
  resume state must be exactly this screen, with the timer still counting.

## Stage 6 · The middle, and the trap (14:00–38:00)

Three versions of her death, the money, Tanvi, the terrace audio, row 9, the
PIN, Shaila, the timeline, the icon.

**Making a trap fair.** The PIN is the chapter's sharpest edge, so it gets
four protections:
1. **It is never required.** No question needs the Secure Folder.
2. **Two warnings exist before it**, and both are discoverable: Shaila's
   message about the edited note, and the fact that a bank manager who spent
   31 hours refusing to give a PIN would not write one in a note.
3. **The payoff is deliberately empty** (FD receipts and nothing else), so the
   player feels the wrongness before they understand it.
4. **Afterwards the game never scolds.** No "you shouldn't have". The ledger
   records it, the arrest uses it, and the player draws their own conclusion.

**Psychology.** Shame only works if it's self-administered. Every line of copy
after a trap must be neutral, because the player's own memory is the punishment.

**UX rules**
- **Nothing in the UI congratulates the player for opening the folder.** No
  toast, no badge, no "+1 evidence".
- The real note arrives as **a photograph of handwriting**, so the difference
  between her hand and theirs is visual, not asserted.
- **"Good morning, #9."** types out at reading speed, and then the screen
  darkens on its own. No button. The player sits with it.

## Stage 7 · The night ends (38:00–40:00)

A time cut to 10:29 AM: sunlight, a warm phone, the call timer at 40:51:12,
and two things that arrived while they slept: the real article published at
6:42 AM, and a thank-you from a man she saved at 10:12.

**Psychology.** Relief must come before the crash, or the crash is just more of
the same. The thank-you from D'Souza is the chapter's only moment of pure
good, and it exists so the player has something to lose.

**UX rules**
- **If the player actually stops and comes back later, use it:** returning
  after a real gap opens on this morning screen and says *"You slept."*
- **The optional real-time version** ("your 10:30 is tomorrow at 10:30") is
  opt-in, branded FOUND, and never imitates anyone. Default off.

## Stage 8 · Your phone (40:00–46:00)

A second device enters the story. It is **the player's own platform** (iOS on
an iPhone, Android on Android, iOS on desktop), and it is almost empty: a
family group, a couple of chats, a share sheet, a map.

**How it appears**
- **Mobile:** the found phone stays full screen; yours lives one swipe from
  the right edge and **buzzes the real device** when it rings.
- **Desktop:** both on the table, yours smaller, asleep, screen-down until it
  lights.

**The call to you.** "Mumbai Crime Branch ✔" with video. It can be left
ringing; it calls again. Answering is the only way forward, which is exactly
what a real victim experiences.

**Q11, claim checking, is the chapter's best interaction:** the accusation
plays on one phone while the player checks it on the other. Nothing else in
the game uses both devices at once, so it is saved for here.

**Psychology.** Every charge that's true is one the player produced by being
curious. The feeling to aim for is not *"I'm being framed"* but
**"I did that."** The script must therefore never exaggerate: if the player
avoided something, the syndicate bluffs, and the bluff is catchable. Their
power comes from accuracy, and their weakness is that the accurate parts are
the player's own choices.

## Stage 9 · The decision (46:00–48:00)

The supervisor's orders: *bring the phone to Andheri East by 1 PM, don't cut
the call, don't tell anyone.* The three rows appear over the still-ringing
call:

**01 · Report to police  ·  02 · Throw it away  ·  03 · Share with a friend**

**Psychology and the one rule that matters: no signalling.** Players read
layout as morality. So the rows are identical in weight, order is fixed (not
randomised, because friends compare), the copy is flat and verbal, and there
is **no "recommended", no icon connotation, no colour coding, no confirmation
that praises**. Doing nothing is also real: after 90 seconds the supervisor
says *"Good. Aap cooperate kar rahe ho,"* and the rows stay. Compliance is
the fourth thing a person can do under pressure, and the game should let the
player notice they were doing it.

**Each ending is an action, not a menu pick:**
- **01** — drag the red button all the way to cut, then a map, then a door.
- **02** — cut, walk, and drag the phone off the edge of the screen.
- **03** — don't cut. Open the share sheet while he's still talking, type one
  name, and press send.

**The last interaction of the chapter is a reply box** (Ending 03) or a
withheld one (01 and 02). Black comes before the answer, always.

## Stage 10 · The end card, the ledger and the share (48:00–50:00)

1. **"What they had on you."** One line at a time, built from the ledger:
   *Your voice, 1:52 AM. Her PIN. Shaila's name. Her son's trust.* Then the
   count: **They had 4 things on you.**
2. **What only this ending showed**, one line, spoiler-free.
3. **The replay image, identical for everyone:** the first ten seconds again,
   frozen on the 1:11 alert, the icon enlarging. *"No one had reported her
   death yet."*
4. **Pass it on**, preset message: *"Would you have cut the call?"*
5. **Keep your case number**, then back to the desk.
6. **One quiet screen, outside the fiction:** real police never arrest anyone
   over a video call; if this happens to you or your parents, cut the call and
   call **1930**, or report at cybercrime.gov.in. Plus **Tele-MANAS 14416**.

**Psychology of the share.** People forward what makes them look interesting,
not what makes them look scared. *"They had 4 things on me"* is a score you
want to argue about, and it gives nothing away. The old 🟩🟨🟥 squares
measured hints, which measured confusion. This measures the thesis.

## Stage 11 · Coming back

**A second play must look different from the first second**, or nobody
believes their own memory:
- The desk shows the pouch **already torn**, and the sticker now carries a
  postmark: *delivered 1:11 AM*.
- **A "look again" affordance:** on a replay, zoom is permitted on things that
  weren't zoomable before (the status bar, the first notification), because the
  player now knows what they're looking for.
- **The ledger is shown live** on a replay, as a small counter, so a clean run
  is a playable goal.
- Nothing else changes. No new dialogue, no director's commentary. The story
  is identical, and that's the point.

---

# PART 3 — Trust, access and the real world

| Concern | Rule |
|---|---|
| **Real data** | The game asks for nothing real. No camera, microphone, contacts, location, files or payment. The only inputs are a first name (for a drop or an ending) and typed in-fiction answers. |
| **Notifications** | Only ever from FOUND, clearly branded. Never an imitation of a police force, bank, courier or messenger. |
| **Content** | Death (off screen, staged as suicide, revealed as murder), fraud, human trafficking, one non-graphic audio scene. Stated on the pouch, and a helpline on the end card. |
| **Age** | 16+, as decided. |
| **Real brands** | WhatsApp and Instagram appear with our own drawn icons. Everything that is part of the crime is fictional: PikDrop, SkyEx, City Desk, Lotus Park, Skyline Overseas, an unnamed bank. |
| **Real people** | No real person's face, voice or name. Actors, with releases. |

## Access and performance (India first)

- **Budget Android, 4G, one hand.** Target a mid-range phone at 60 fps for
  everything but video, and a first meaningful paint under 2 s on 4G.
- **Video is the risk.** The live call must stream in short looping segments,
  preload the next cue only, and fall back to a still frame with captions when
  the connection drops. **The chapter must be completable with video failing.**
- **Data budget:** an explicit ceiling per episode, checked in CI like the
  existing budget script.
- **Captions always on** for every spoken line, English under Hinglish and
  Marathi, as decided. Captions are the plot's safety net, not decoration.
- **Reduced motion** removes drags in favour of taps, and never removes a
  choice.
- **Screen reader:** every photograph carries a description that doesn't give
  away its clue; every question is reachable as text.
- **No sound required:** every audio clue has a transcript or a waveform
  moment that reads visually.
- **Offline / flaky:** state saves on every action, not on episode boundaries.

## Edge cases the chapter must survive

| Case | Behaviour |
|---|---|
| Player cuts the call at 1:11 | A real branch, not a fail state (CHAPTER1.md F4) |
| Player never plugs in | The call holds, the phone waits, and an on-screen cable appears after two minutes |
| Player refuses the 10:30 call | It rings again, twice, then the supervisor messages instead, and the three rows arrive by text |
| Tab closed mid-episode | Resume to the exact screen, including the call window and its timer |
| Storage refused / private mode | The existing warning, and play continues without a save |
| Desktop | Two phones on a table; every gesture has a pointer equivalent |
| In-app browser | A note offering Chrome, never a wall |
| Sound off / headphones absent | Captions carry everything |
