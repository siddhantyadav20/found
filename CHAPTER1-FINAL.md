# FOUND — Chapter 1: "The Phone" · LOCKED

Supersedes `CHAPTER1-REDESIGN.md` and `EPISODE3.md`. This is the build document:
story, script structure, the fix for "I didn't know what to do", and the
product, game, motion and sound design needed to ship it.

Three episodes. About 30 minutes each. Complete in itself, and it ends with one
question so specific that not knowing the answer is uncomfortable.

---

# PART 1 — What changed in this final pass

I challenged my own redesign and cut or reversed seven things.

| Change | Why |
|---|---|
| **3107 is not confirmed as {name} until Episode 3** | My earlier draft confirmed it in Ep2. Holding the ambiguity is worth more than the payoff — every message from them is then read twice. |
| **Episode 2 drops from five deductions to three** | Five is homework. "Who wanted it unlocked" and "why a stranger" are one idea. |
| **"Who put the phone in your letterbox?" is no longer a solved question in Ep2** | Answering "K." in Episode 2 kills Chapter 1's real question. Episode 3 asks it, and the answer isn't Kiran. |
| **Frame 12 is a document, not a face** | Our rules forbid a real face; a matching survey reference across two frames is fairer, cheaper, and colder. |
| **"I don't know" is an accepted case-file answer** | The game replies *"Good."* A mystery that punishes uncertainty teaches players to guess. |
| **Cut: the number `3107` scratched on a wall** | A burner number physically present at the scene before it exists is a coincidence dressed as a clue. |
| **Dev loses his deduction** | Five minutes spent eliminating a suspect nobody suspected. Two messages and a photograph do it. |

**The one line the whole chapter hangs on**, unchanged and now fully load-bearing:

> Kiran can't reach the cloud, so he poisons the container. A phone a stranger
> has been inside for three days is evidence nobody can use — and Mum's app is
> what proves a stranger was inside it.

Every hour the player keeps it charged, they are both destroying the case and
holding the only key to it.

---

# PART 2 — The confusion fix (read this first)

**The feedback was: people didn't know what to do.** That is the highest-priority
problem in this document, above any story beat. Here is the diagnosis and the
design.

## Diagnosis

The lock screen is fine — it teaches itself. The failure is the ten seconds
**after** the phone unlocks:

- The objective exists only as a widget reading *"Look around. What you open,
  you keep."* which is atmosphere, not instruction.
- The case file — the thing that *is* the game — is one icon among ten, named
  "Case file", with no reason to tap it before you're already lost.
- Hints live behind a "Think" button inside that app, so a stuck player has to
  find the help before they can be helped.
- Nothing tells you an app has something in it, so ten identical icons all look
  equally likely, and most are dead ends at any given moment.
- Nothing happens when you go quiet. A stuck player stays stuck in silence.

## The design: five mechanisms, all diegetic, no tutorial pop-ups

**1. Badges. The single biggest fix.**
An app icon carries a red badge when it holds something the player hasn't seen
yet — exactly as a real phone does. Ten identical icons become a lit path. The
badge count is *unseen evidence*, not unread messages, so Health and Settings
can carry them too. When an episode's content is exhausted, the badges are gone
and the player knows to look at the case file.

**2. One open question at a time.**
The case file shows exactly one. The home widget shows the same sentence. The
question is never "solve the crime"; it's always a single, concrete, answerable
thing: *Did {name} go home after the party?*

**3. "Where to look" — a free hint that costs nothing and never spoils.**
Under every open question, always visible:
> *Where to look: Health · Settings · Photos*

It names apps, never answers. This alone removes most of the reported
confusion: the player always knows where the next ten minutes are.

**4. The Found counter.**
Every first look at anything meaningful adds it to the case file, with a small
toast: **Added to case file · 7 found**. Opening things is *visibly* progress,
so curiosity is rewarded even when the player isn't solving anything.

**5. The idle nudge.**
Forty-five seconds with nothing found and nothing answered, the phone buzzes —
a banner from the case file, in the game's own voice, escalating one tier each
time: a direction, then a connection, then nearly the answer. It is the
existing three-tier hint ladder, delivered instead of hidden. It never blocks
and it never scolds.

**First run, the first sixty seconds, exactly:**

1. Envelope. One line: *"Someone left this for you."* Button: **Take it out.**
2. Lock screen. Notifications. "Don't unlock it." Swipe up. (Already works.)
3. Passcode via Medical ID. (Already works, already has hints.)
4. **On unlock:** one buzz. A banner: **Case file · You started a note.** Tap
   it — the case file opens with Q1 and *Where to look*. That is the tutorial,
   and it is in fiction.
5. Home screen: Messages badged 3, Photos badged 2, everything else quiet.

Nobody is confused after that, and nothing on screen admits a game is being
taught.

---

# PART 3 — The story, locked

## The truth (unchanged from canon; motive sharpened)

A listed structure can't be demolished. One damaged beyond repair can be
delisted and cleared. Anand Realty needs the 1923 engine house at Shree Ram
Mills to be unsalvageable, and needs the fire to look like the old wiring above
the engine bay.

Kiran Shetty hires {name} Sethi, 19, who photographs shut buildings at night,
to shoot the interior first — because the client needs to know exactly where
the engine sits and where the original wiring runs. **{name} was not
documenting a crime. {name} was drawing the plan.** And a student's night
photographs of that interior, taken 48 hours before a fire, on a traceable
phone, is a scapegoat you can buy for ₹15,000.

Friday night runs exactly as built: the party, Dev's hotspot, the walk, the
crew's router, the van at 23:38, twelve NightCam frames 23:39–23:50 uploaded
over the arsonists' own Wi-Fi, the memo at 23:52, caught. Kiran unlocks the
phone at 00:05, finds the van photo, deletes it at 00:07, and finds nothing
else, because NightCam keeps nothing on the phone. {name} escapes Saturday
night and reaches Tara's. The mill burns Sunday 23:48.

**Monday 07:40: Kiran posts the phone into a stranger's letterbox** — and the
reason is not that a curious stranger makes a convenient trail. It's that
evidence handled by an unidentified person for three days is evidence no
prosecutor will touch. He can't delete the cloud. So he ruins the chain of
custody, and Guardian — a mother's own app, her own account — produces the
proof that a stranger was inside it.

**And the thing Kiran doesn't know:** he didn't choose the letterbox. He was
given the address. The final photograph in Chapter 1 is of the player's
building, timestamped **Friday 20:55** — an hour before {name} even left the
party. Somebody picked this player before there was a crime to clean up.

## Who is lying

- **Tara** is hiding {name} and lies to the player from Friday night onward.
  True *and* misleading: she is genuinely terrified, and she is a person making
  believable bad decisions.
- **Mum** saw Friday's Guardian entries on Saturday morning — the mill, the
  network, the silence after 23:52 — and told nobody, because she suspected her
  own daughter. Two days lost.
- **Dev** won't say what the argument was about: he'd found out about K. and
  threatened to tell her mother. He thinks that's why she went.
- **Kiran** is a subcontractor who believes he is running this.
- **3107** is {name} — but the player can't confirm it until Episode 3.

---

# PART 4 — Episode structure

## Episode 1 — "Low Battery" · ~30 min

**Question the player is given:** whose phone is this, and where did they go?

| Beat | App | What happens |
|---|---|---|
| 1 | Envelope | 4%. One buzz. *"Don't unlock it."* |
| 2 | Lock screen | Medical ID → **140306** |
| 3 | — | **Case file opens itself.** Q1 + where to look |
| 4 | Messages, Dabba, Photos | Ten minutes of liking a stranger: the cake order, chai in Lalbaug, a 2am chemist search, "i leave it on so she can sleep" |
| 5 | Health / Settings / Messages | **Q1: Did {name} go home?** No — 4.1 km at 22:30, home Wi-Fi last seen 17:06 |
| 6 | Messages | Dev, compressed: two messages and Tara's story photo |
| 7 | **Guardian** | **THE MIDPOINT TURN — new.** A session logged **Sat 00:05**, four minutes before the van photo was deleted at 00:07. She was already gone. *Someone else has been inside this phone, and edited what you're reading.* |
| 8 | Calculator | The vault (code findable three ways). Inside: Kiran's job — and his side of it is already scrubbed |
| 9 | Maps | **Q2: Where was {name} at 23:52?** Three things point at Gate 3 |
| 10 | — | Banner: *K. can see where this phone is.* 3107's first message. **"Keep it charged."** |
| 11 | **Guardian** | The last thing the dying screen shows: *Today's activity report sent to Anjali Sethi.* You watch your own snooping leave the phone |
| 12 | — | 1%. Dark. **SESSION SAVED.** |

**What the player believes:** she's missing and the phone is the record.
**What's true:** the phone is what somebody chose to leave behind.
**Hook:** someone is watching this phone, and it just told on you.

## Episode 2 — "Read Receipts" · ~30 min

**Gate:** the player's own device must really be charging. Keep it.

| Beat | App | What happens |
|---|---|---|
| 1 | — | Plug in. The phone wakes at 7%. Three days land |
| 2 | News | The fire · petrol traces · **police seek missing student**, quoting *this phone's* Monday morning — including what the player did |
| 3 | Messages | Mum: the police showed her the Guardian report. Then her confession: *"I saw it on Saturday. I thought you had done something. I am your mother and I thought that."* |
| 4 | Case file | **Q3: Who unlocked {name}'s phone at 08:14?** The player **types "me"** |
| 5 | Case file | **Q4: Who wanted it unlocked, and why a stranger?** Both times 5520 said don't, you did — and he was told on Friday that this phone is watched. *"I don't know"* is accepted |
| 6 | Settings → NightCam → Calculator | Wi-Fi restores the cloud: **1 of 12** (petrol cans, **Friday 23:39**), K.'s receipt, and a device session: **Tara's MacBook, Sunday 22:14** |
| 7 | Case file | **Q5: Did {name} start the fire?** No. The petrol was there two days early |
| 8 | Messages | 3107's trust test — extended. They ask for something only a friend would know. The player answers from the phone. *"okay."* Not proof |
| 9 | Messages | Three replies that matter: to Mum (lie / truth / silence), to Kiran (threaten / ask / silence) |
| 10 | Messages | The burner sends a photo of **your letterbox**, 07:40 Monday. *"You kept it. Good. Keep it charged."* |
| 11 | **Settings** | **The episode's last beat — new.** Your own home Wi-Fi is in the phone's known networks. Joined **08:11 Monday** — three minutes *before* you picked it up. It has been logging you since before you touched it |

**What the player believes:** my curiosity built a false trail.
**What's true:** the trail was the point, and it's worse than false.
**Hook:** the phone has been recording *me*.

## Episode 3 — "Delivered" · ~35 min

A message status. And what the player turns out to be.

| Beat | App | What happens |
|---|---|---|
| 1 | NightCam | Eleven frames download one at a time, **against the battery**. Progress is interaction-based, never a real clock |
| 2 | Frame 3 | A sprinkler head, taped. 23:41 |
| 3 | Frame 4 | The original wiring above the engine bay, lit and centred. *Why photograph a ceiling?* Because that is where the fire had to start |
| 4 | Frame 5 | A clipboard: **ENGINE HOUSE · HERITAGE CONDITION · …1923…**. The target was never random |
| 5 | Notes | A draft {name} never sent: *"ask K what clearance means"* / *"if this is just photos why does he care what survives"* |
| 6 | Dabba | A food order Saturday night near Currey Road. She got out. Nobody says so |
| 7 | Frames 6–9 | Gate 3, the van's plate, a man unloading, wet tracks following her in |
| 8 | Voice Memos | Replay 23:52. Under the train, a metal knock. **Q: Was {name} alone?** |
| 9 | Messages | 3107 finally proves it — one detail only she could know, and it's the one the player found in Episode 1 |
| 10 | Frames 10–11 | Behind a hand over the lens: the van, the engine-house door, and **a flat archive box being carried out**. Something was removed before it burned |
| 11 | Frame 12 | No face. A reflection, a wrist, a site document — whose reference **matches the survey number in Frame 5** |
| 12 | News / Messages | **THE TURN.** A line about the investigation: an unidentified person had the device for three days, so none of it is reliable. *That's me. I did that* |
| 13 | Guardian | **THE FIX.** The report that damns her is the only complete custody record. It can be repaired — by a person with a name |
| 14 | Messages | Kiran, for the third and last time, uses the player's name |
| 15 | — | **The choice** (below) |
| 16 | Desk | Whatever they chose: a photograph of **the player's building**, timestamped **Friday 20:55** |

## The three endings

All cost something. None is the "correct" one.

**A — Erase.** Factory reset, back in a letterbox, walk away. He lets you go
instantly: you were a consumable. Two days later, an envelope with no stamp —
addressed to someone else in your building.

**B — Publish.** Send the twelve to City Desk with the Guardian report as
custody. The heritage delisting halts. 3107: *"they're asking me who you are.
what do i say."*

**C — Step into it.** Walk it in: your name, your address, your three days.
The custody log — *the player's real playthrough, every app, every timestamp* —
scrolls with their name at the top. The thing you broke, you fix, with the only
currency you have.

**Then, in all three:** the desk, and the photograph of your building from
Friday 20:55 — before {name} left the party, before the mill, before the fire.

> **Whoever chose your letterbox chose it before there was anything to clean up.**

---

# PART 5 — Artefacts required

## Photographs (the real constraint)

**Existing, keep:** locker (dials 2719), cake, shoes, street, cinema, balcony,
wallpaper, story (vertical), letterbox, van (Gate 3).

**New for Episode 3 — eleven NightCam frames.** Most are one torchlit interior
re-framed; shoot in a single session:

| # | Shows | Note |
|---|---|---|
| 2 | Interior brick wall, van through an opening | |
| 3 | Sprinkler head with tape | Puzzle-critical |
| 4 | Ceiling wiring above the engine bay | Puzzle-critical |
| 5 | Clipboard: ENGINE HOUSE / HERITAGE CONDITION / 1923 | Puzzle-critical, prop |
| 6 | Gate 3, van, plate legible | Live Text |
| 7 | Reflective jacket, site folder: ENGINE HOUSE CLEARANCE | Prop |
| 8 | Torch in a hand, wet tracks | No face |
| 9 | Pump-room door | |
| 10 | Router, cable, crew kit | |
| 11 | Hand over lens; behind it, an archive box being carried out | The image of the chapter |
| 12 | Reflection in van glass: wrist, watch, a document reference | **No face.** Reference matches #5 |

**Plus one:** the player's building from the street, at night — the last image
in the chapter. Shoot any Mumbai society entrance, no signage, no faces.

**Props to make (cheap, and they carry puzzles):** a clipboard sheet, a site
folder cover, a cash receipt in block capitals, an archive box label.

## Audio

Existing: the buzz (signature), key taps, the refusal, two voice memos.
New: a charger-connect chime for Episode 2's wake; a soft per-frame download
tick; the Guardian "report sent" tone (the most sinister sound in the game and
it should be the most ordinary); one remastered pass on the 23:52 memo so the
metal knock is audible on a phone speaker but never obvious.

## Documents rendered in-app

Guardian's report · the custody log (generated from the player's own save) ·
K.'s receipt · the clipboard · the archive-box label · three news articles per
episode · the NightCam account screen.

---

# PART 6 — Product design

- **Free, all three episodes.** Chapter 1 is the trailer and the share loop.
  Charge from Chapter 2 (₹49 a chapter, ₹149/month), Episode 1 of every later
  chapter free. Never charge to remove an interruption.
- **Never lose a case** (built): saves per case, a case number that restores on
  any device, and a QR on laptops.
- **The desk** (built): your phone as you left it — mid-case with your battery,
  charging between episodes, bagged and tagged when solved.
- **Pass it on, reframed.** The share mechanic *is* the villain's method, and
  the end card says so: **"Someone passed this to you. Pass it on."** Spoiler-safe
  card, WhatsApp first, the friend gets their own envelope with their name on it.
- **Result card**: minutes, hints used, marks per puzzle, which ending — the
  thing people post to compare.
- **Episode 2's charger gate** stays. It is the most-described mechanic you have.

---

# PART 7 — Game design

**State is flags, as built.** `seen:*`, `solved:*`, `lock:*`, `did:*`, `said:*`,
`fired:*`, plus timestamps per flag. Everything below is derived from them —
no new engine.

**Puzzle types, one of each per episode, never repeated twice in a row:**
cross-app deduction (Q1) · temporal contradiction (the 00:05 session) ·
visual forensic (Live Text, frame 5 ↔ frame 12) · typed answer (the "me")
· social deduction (Tara's timeline) · interpretation (what "clearance" means).

**Hint ladder, unchanged and now surfaced:** direction → connection → nearly
the answer. Delivered by the idle nudge as well as on request.

**Difficulty floor:** every question has at least two independent routes to the
answer. Nobody is gated on noticing one line.

**Consequence:** four irreversible acts — opening Mum's thread (she sees
"Read"), turning receipts off, recovering the deleted photo (restoration is
logged), threatening Kiran. Each changes a later line, a headline, or who will
speak for the player at the end. None branches the content.

---

# PART 8 — Motion design

The rule: **the phone never animates to impress. It animates to be believed.**

Built and kept: the desk phone morphing into the envelope; apps zooming out of
their icon and shrinking back; banners that can be flicked away or held open;
Notification Centre dragging down; the lock screen lifting.

New, four moments:

1. **The report leaving (Ep1's last frame).** Guardian's notification slides in
   as the battery hits 1%, holds one beat longer than comfortable, then the
   screen dies — not a fade: the phone's real power-off collapse, a white line
   shrinking to nothing.
2. **The download (Ep3).** Each frame arrives at its own pace, thumbnail first,
   sharpening as it lands. The battery percentage ticks down in the same status
   bar. Nothing is on a clock; it advances when the player does.
3. **The custody log (Ending C).** The player's own session scrolls as a
   document — app names and timestamps, their real playthrough — slowly enough
   to read, with their name at the top.
4. **The last photograph.** It loads the way a photo loads on bad signal: a
   grey block, then a band of pixels, then the building. The timestamp appears
   last. Then nothing happens for three seconds. That silence is the beat.

`prefers-reduced-motion` removes every one of these without removing meaning.

---

# PART 9 — Sound design

- **The buzz is the franchise.** A motor against wood, not a chime. It is the
  only sound that ever startles.
- **Silence is the instrument.** The typing indicator that stops. The sync that
  halts at 11 of 12. The memo's held breath. No score under discovery.
- **Ordinary sounds for terrible moments.** Guardian's "report sent" is a
  pleasant two-note system tone. That's the point.
- **Voices:** real voices for everyone except {name}, who stays a whisper,
  because their gender is dealt at random.
- **Everything is optional.** The sound toggle is on the desk and in the
  envelope's small print; the game is fully playable silent, with captions on
  every memo.

---

# PART 10 — Build plan

**Cheap — content in existing apps (days each)**
Guardian's Sat 00:05 session · Mum's confession · Tara's lie made legible ·
Dev compressed · the vault's third route in · your own Wi-Fi in Settings ·
{name}'s unsent Note · Dabba's Saturday order · Episode 3's messages ·
all three endings' text · News variants.

**Medium — new screens in existing apps (1–2 weeks each)**
Badges on icons · the case file's "where to look" + Found toast · the idle
nudge · NightCam's eleven-frame download against battery · the custody log
document · the Erase All Content flow · photo zoom for frames 5 and 12.

**Expensive — do not build for Chapter 1**
Any new app · multiplayer · voice calls · procedural anything.

**Sessions, in order:**
1. **S7a — Never be lost.** Badges, one-question case file, where-to-look,
   Found toast, idle nudge. *Ship this before any new story.* It is the fix for
   the only piece of player feedback we have.
2. **S7b — Episode 1 tightening.** The 00:05 session, Dev compressed, the
   report leaving.
3. **S7c — Episode 2 tightening.** Mum's confession, three deductions, the
   Wi-Fi ending, 3107 left unconfirmed.
4. **S7d — Episode 3 as data.** `content/found/episode3.ts`: frames, Notes
   draft, Kiran's three messages, the turn, the fix.
5. **S7e — The endings**, the custody log, the last photograph, the desk return.
6. **S7f — Tests** walk all three episodes and every ending; the content linter
   checks every question has two routes and three hints.

---

# PART 11 — North star

**FOUND should make the player feel:** that looking is never free.

**They should tell their friend:** *"Don't Google anything. And plug your phone
in before Episode 2."*

**They should fear:** that the record of what they did is more complete than
their memory of doing it.

**They should wonder:** who took a photograph of their building on Friday at
20:55 — an hour before any of this started.

**They should pay for Chapter 2 because:** Chapter 1 gave them something whole,
and then made them part of it.

**We must never lose:** the moment the player realises the crime scene has a
record of *them*.
