# FOUND — The player's journey
## Chapter One: *Shagun* · the experience plan

The story is [SCRIPT.md](SCRIPT.md) (canon) and its game adaptation is
[CHAPTER1.md](CHAPTER1.md). This document is the other half: what a person
feels, minute by minute, from the moment they tap a link to the moment they
put their phone down, and what the interface has to do to earn each of those
feelings. The phased build is [ROADMAP.md](ROADMAP.md).

Written for the pivot of 2026-09-22. It replaces the journey for *Don't Cut
the Call*; what carried over is carried over on merit, and said so.

---

# PART 0 — The six laws

Every screen in this chapter obeys these. When a design decision is unclear,
the law wins over the convention.

**1. Belief arrives before understanding.**
The player's first theory is the one Sameer arranged: *Kunal was firing, a
boy fell, they burned him.* They believe it because the evidence is real and
it's in the right order. Forty minutes later they learn the order was his.
The whole chapter is that sentence, so **the first theory must be easy to
reach, well supported, and accepted by the case file without comment.** The
script's aim is that expert players form the wrong theory for the right
reasons (script §23).

**2. Every convenience is curation.**
What the phone makes easy is what Sameer wants seen: the pinned chat, the
starred voice notes, Favorites, a note titled *"For M"*, and a phone with no
passcode. What he didn't want seen is one step harder, never hidden by the
game: Recently Deleted, Revert, Archived, the Hidden album, other people's
phones. **Anything the phone does *for* the player in Episodes 1–2 is
something Sameer set up.** The harder route is always a real iOS or WhatsApp
behaviour, never an invented one.

**3. Fair play is absolute.** *(carried over)*
Every deduction is reachable two ways, every closed route has a fallback,
and every twist is visible in hindsight on a screen the player already saw.
The player must be able to say *"it was there"*: *"4. Nitin —"* was there in
minute seventeen.

**4. Dread is made of timestamps.** *(carried over)*
No sudden noise, no red flash, no gore. The scares in this chapter are a
reply at 1:53 to a message that isn't there, a search for an ambulance at
1:56, one grey tick on a voice note, and a guard writing *"Sir ladka bol nahi
raha."* **Quiet, specific, checkable.**

**5. The player's hands do the irreversible things.** *(carried over)*
Tearing the parcel, turning the envelope over, plugging in the charger,
striking a claim, reverting an edited video, switching on airplane mode,
holding to post, resealing the parcel. Never a button labelled "continue".

**6. Never fake the real world.** *(carried over, unchanged)*
No real camera, microphone, contacts, location or personal data, ever. No
notification that imitates a police force, a bank or a messaging app. Every
brand that's part of the crime is fictional. This is a hard rule.

---

# PART 1 — The arc of feeling

| Minute | Where | What the player feels | What the design does to cause it |
|---|---|---|---|
| 0:00 | Link → desk | *Curiosity, a little guilt* | The desk, one parcel, no copy explaining the product |
| 0:40 | The envelope | *This isn't mine* | A wedding envelope; a note to someone called M; a name, Bhasin |
| 1:30 | The phone wakes | **Pressure** | 47 missed calls, and the number rings in your hand |
| 4:00 | His life | *Intrusion, then liking him* | SK Films, Mummy asking if he's eaten, an EMI, a Mumbai offer |
| 7:00 | The boy with the tray | *Nothing yet* | A face among 1,284 |
| 9:00 | The poster | **Dread** | The same face, *LAPATA* |
| 12:00 | The voice notes | *Grief, and alliance with him* | His voice; one grey tick each |
| 14:00 | Nine seconds of fire | *Horror, and certainty* | Light on a wall, no body |
| 17:00 | "For M" | *Unease* | A reading order that stops at "4. Nitin —" |
| 19:00 | "M? Tu hai?" | *Watched* | He's alive, and steering. The phone dies |
| 20:00 | The charger | *Care* | You keep a stranger's phone alive, with your own cable |
| 24:00 | 12:29 AM | *Suspicion* | Sameer holding the revolver |
| 28:00 | Two firings | *Cleverness* | 11:52 and 12:31, two lawns |
| 31:00 | The memo | **Cold** | *"Doosri… main pose kar raha tha."* The first reveal |
| 34:00 | 1:07 AM | **The crash** | *"Aap aa rahe ho na?"* / *"aa raha hoon."* |
| 38:00 | The money | *Disgust* | His own invoice, turned into a leash |
| 41:00 | The car | *Hope* | Nitin tried |
| 43:00 | 1:53 AM | **Cliffhanger** | A reply to a message that isn't there |
| 46:00 | The board | *Focus* | Five lanes, one interval |
| 49:00 | 1:56 AM | **Vertigo** | He searched for an ambulance after saying help had come |
| 51:00 | Revert | *Betrayed by your own liking* | His voice at the fire |
| 53:00 | Hidden | *Understanding* | They had him. The phone is his counter-file |
| 55:00 | The line | **Silence** | *"Mujhe pata tha woh nahi nikla tha."* |
| 57:00 | The record | *Weight* | Which links go in |
| 60:00 | The end card | **"Go back and look"** | The chain, then "4. Nitin —" with the cursor blinking |

Two peaks (the memo, minute 31; 1:56, minute 49), one crash (1:07, minute
34), one silence (the line, minute 55). If a build flattens any of those
four, it has failed, whatever else it gets right.

---

# PART 2 — Stage by stage

## Stage 1 · Arrival (0:00–0:40)

**Where players come from.** A WhatsApp forward from a friend (a drop link),
a reel, or the desk itself. Assume: an Android phone, 4G, one hand, possibly
in bed at night, possibly inside Instagram's in-app browser. *(carried over)*

**What they see.** The desk: one parcel, the other objects as unnamed
silhouettes. No headline, no "Play", no sign-up, no cookie banner.

**UX rules** *(carried over)*
- **First paint is server-rendered**, so the parcel exists before JavaScript.
- **One tap to start.** Sound is offered inside the fiction (the phone's
  ring/silent switch), never as a modal.
- **The content note lives on the label**, like a courier's declaration:
  *Contains: death, gun violence, a body burned (not shown). 16+.* And the
  promise beside it: *This game never asks for anything real.*
- **In-app browsers get a note, not a wall.**
- **Returning players** see the parcel already open and the phone as they
  left it. Resume is the default; "Start over" asks twice.
- **The label's addressee** depends on open decision O1 (CHAPTER1 M).

## Stage 2 · The envelope (0:40–1:30)

**The gestures.** Tear the parcel. Lift out the phone (cracked corner) and
the shagun envelope. **Turn the envelope over** to read the note: that's a
second gesture, not automatic. The note is **a photograph of his
handwriting**, with English beneath it (never printed *on* the paper).

**Psychology.** A letter addressed to someone else is the purest form of
trespass. The player reads it anyway, and that's the first choice they don't
notice making.

## Stage 3 · The phone wakes (1:30–4:00)

The lock screen fills with **47 missed calls** from an unsaved number, and
the number rings. **The first choice is whether to answer.** Both paths
continue; answering puts Raju in the story early (CHAPTER1 H).

**UX rules**
- **The incoming call is iOS's**, rings until answered or declined, and buzzes
  the real device (the existing `Ringing`).
- **It calls back**, twice, across Episode 1, then writes instead.
- **No permanent HUD.** This chapter has no live call. The status bar, the
  battery and your own phone's edge are the only furniture.

## Stage 4 · Learning to look (4:00–14:00)

**The first question is answerable in fifteen seconds** (*whose phone is
this?*), because question one teaches that the case file exists.
*(carried over)*

**UX rules**
- **The case file is the record:** one question at a time, free *where to
  look*, three hints, the 45-second idle nudge, and badges only for
  reachable-but-unseen evidence. *(carried over)*
- **Answers are filed as claims, with their sources beside them.**
- **Only what can be proven now is offered.** A claim the phone can't yet
  support isn't on the board, so the board never gives away what comes
  later.
- **Digging early is never wasted.** Something found behind a hard route
  before its episode counts the moment that episode opens.
- **Sameer's version is accepted without comment.** No buzzer, no "are you
  sure?", no hint that it's his. Law 1 depends on it.

## Stage 5 · The first unease, and the charger (14:00–20:00)

"For M" and the passcode-off time, then *"M? Tu hai?"* from an unknown number.
The battery reaches 2%.

**The gate:** *Plug in the phone to keep it alive.* The real Battery Status
API where it exists, a tappable cable everywhere else. *(carried over,
re-skinned)*

**UX rules**
- Ask once, warmly, and never nag. *(carried over)*
- **This is the natural stopping point.** Resume lands exactly here.

## Stage 6 · The second shot (20:00–43:00)

The reel, two firings, the memo, 1:07, the money, the car, 1:53.

**Revisit is the chapter's signature gesture.** When the Episode 1 claim
cracks, the question comes back and the player **strikes the old line by
hand**, then files the new one. The struck line stays visible in the
record. It is the one piece of UI that says *you were wrong*, and it says
it with the player's own hand, never in copy.

**UX rules**
- **Nothing congratulates the player** for finding a deleted thing. No toast,
  no "+1 evidence". A quiet "noted" on a zoom is the most the game ever says.
- **The first reveal must feel like the ending of a mystery** (Q7), and the
  very next screen must be 1:07, so it doesn't get to be.
- **Title cards carry minutes:** Episode 2 is *12:32 AM*, Episode 3 is
  *1:52 AM*. They're never explained.

## Stage 7 · The cancelled rescue (43:00–57:00)

The board, Nitin, 1:56, Revert, Hidden, the line.

**UX rules**
- **The five-lane board** lights contradictions; it never states them.
- **Choices that close routes say nothing about closing them.** A route that
  closes simply goes quiet. The fallback is always on the phone.
- **The line is typed out at reading speed**, after a long "typing…", and
  then the thread goes still. No button. The player sits with it.

## Stage 8 · The record (57:00–59:00)

On **your phone**: the record, link by link, with sources. Tick in, tick
out, then **send** it (to Meera, with the phone) or **post** it.

**Psychology and the one rule that matters: no signalling.** *(carried over)*
Send and post have identical weight, the order is fixed, the copy is flat,
and there is **no "recommended", no colour coding, no praise**. Ticking the
lie *out* is a choice the interface treats exactly like ticking it in.

**The draft post exists from the end of Q3.** It's the chapter's standing
temptation, and posting it before the two firings are separated is Ending C.
The phone never nudges toward it and never warns against it.

## Stage 9 · The end card (59:00–60:00)

1. **The chain**: eleven rows; untraced ones in Sameer's words. *"You traced
   9 of 11 links."*
2. **What only this ending showed**, one line.
3. **The replay image, the same for everyone:** "For M", the cursor after
   *"4. Nitin —"*. *"He started to tell you."*
4. **Pass it on**, then the case number, then the desk.
5. **One quiet screen, outside the fiction:** celebratory firing is a crime;
   any hospital must treat an injured person first, police case or not; 112;
   Tele-MANAS 14416.

**Psychology of the share.** *"I traced 9 of 11 links"* is a score people
argue about, and it spoils nothing. It measures the thesis: how far the
player got past the version they were handed.

## Stage 10 · Coming back

- The desk shows the parcel **already open**.
- **The record shows its count live** on a replay, so 11 of 11 is a playable
  goal.
- **"Look again":** on a replay, the "For M" note is already in the dock's
  Notes, and zoom works on the lock screen's first stack.
- Nothing else changes. The story is identical, and that's the point.
  *(carried over)*

---

# PART 3 — Trust, access and the real world

| Concern | Rule |
|---|---|
| **Real data** | Nothing real is asked for. No camera, microphone, contacts, location, files or payment. The only inputs are a first name (for a drop) and picked or typed in-fiction answers. |
| **Notifications** | Only ever from FOUND, clearly branded. |
| **Content** | Death (off screen), gun violence (off screen), a body burned (light, smoke and sound only). Stated on the label, with a helpline on the end card. |
| **Age** | 16+, to be revisited once the fire clip's audio exists (CHAPTER1 O4). |
| **Real brands** | WhatsApp, Instagram and iOS, drawn by us. Everything in the crime is fictional (CHAPTER1 B). |
| **Real people** | No real person's face, voice or name. Actors, with releases. |

## Access and performance (India first) *(carried over)*

- **Budget Android, 4G, one hand.** 60 fps outside video, first meaningful
  paint under 2 s on 4G.
- **Video is short here:** clips of 9 to 31 seconds (the fire, Kunal's clip,
  the reel take). Each streams on demand, has a poster frame, and **the
  chapter is completable with video failing** (captions plus a described
  still).
- **Captions always on** for every spoken line, English under Hinglish.
- **Reduced motion** swaps drags for taps and never removes a choice.
- **Screen reader:** every photograph carries a description that doesn't
  give away its clue.
- **No sound required:** every voice note has a transcript.
- **State saves on every action.**

## Edge cases the chapter must survive

| Case | Behaviour |
|---|---|
| Never answers Raju | He calls twice more, then writes; nothing is lost |
| Posts the draft at minute 16 | A real ending (C), not a fail state |
| Never plugs in | The phone waits at 2%; an on-screen cable appears after two minutes *(carried over)* |
| Goes into airplane mode on Meera's word | Every link keeps an on-phone route |
| Never finds Recently Deleted or Revert | Finishes on Sameer's version (B); the end card shows exactly which links |
| Tab closed mid-episode | Resume to the exact screen |
| Storage refused / private mode | The existing warning; play continues without a save |
| Desktop | Two phones on a table; every gesture has a pointer equivalent |
