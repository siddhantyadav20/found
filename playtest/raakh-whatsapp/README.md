# Raakh on WhatsApp: playtest kit

Raakh played over real WhatsApp, with you playing every character by hand. One tester, about 35 minutes, no code. It tests the **story and its structure** before anything gets built again.

| File | What it's for |
|---|---|
| **README.md** (this) | Setup, the rules, what's being tested, how to brief the tester |
| [2-NIGHT.md](2-NIGHT.md) | The cue sheet: every beat, trigger, message and file, in order |
| [3-REACTIONS.md](3-REACTIONS.md) | What each character does with what the tester sends, the tracker, and the four endings |
| [4-PHONE.md](4-PHONE.md) | Every screen of the phone, ready to paste, plus the timeline lines |
| [5-SHEET.md](5-SHEET.md) | Observation sheet, pass bars and exit questions. Print one per tester |
| `media/` | Every photo, clip and voice note, named by the beat that uses it. Rebuild it from the game's files with `sh make-media.sh` |

---

## What this test is checking

The first tester quit halfway through Episode 2. She never suspected she was Sameer, and the case file needed several nudges. This version changes three things, using ideas from the RAAKH_01/02 docs, and keeps the story:

| Problem | Change | Taken from |
|---|---|---|
| The twist came after she'd quit | **"You are Sameer" moves to minute ~15.** A payoff every 3–5 minutes after that: you fired → you sent the car away → the mattress was empty → he's alive → Bhasin's terms. | Each episode ends on a turn (bible §5); suspicion can be planted before it's confirmed (research §2.3) |
| Bored in the middle | **Sending is the main action.** Forward anything to anyone; they act on it tonight. Characters write because of something you did. A real deadline (7 AM, Bhasin at the gate). About 20 key items, not 54. | Show/Challenge conversations (bible §7.6); characters react to discoveries (research §1.3, bible §11.1); content budget (bible §13.2) |
| The case file was a memory test | **No case file.** 🗒 Notes keeps the timeline for them. The only "questions" come from characters (Raju: "Zinda hai?") and are choices, not quizzes. | The game holds the facts (bible §7.4–7.5); in-world hint ladder (bible §7.8) |

What it deliberately **leaves out** from the docs: the outsider researcher, Monday office hours, the evidence-type tags, and recommending a route to Meera.

---

## Setup (about 30 minutes, once)

**You need:** your phone with WhatsApp, WhatsApp Desktop or Web on a laptop (to paste and drag files in), this folder open, and a printed [5-SHEET.md](5-SHEET.md).

1. **Make 8 groups, each with just you and the tester.** (A ninth, Dilip, gets made during the test.) Group name and photo as below. Set *Edit group settings → Only admins*, so the tester can't rename them.

   | Group name | Photo | What happens there |
   |---|---|---|
   | 📱 The phone | `media/dp/phone.jpg` | Narration, the phone's screens, the clock |
   | 🗒 Notes | none | The timeline and open questions. You post here; they read |
   | +91 62••• •4417 | `media/dp/raju.jpg` | Raju |
   | Mummy | none | Mummy |
   | M | `media/dp/meera.jpg` | Meera |
   | Bhasin Uncle | `media/dp/bhasin.jpg` | Bhasin |
   | Kunal | `media/dp/kunal.jpg` | Kunal |
   | Nitin | `media/dp/nitin.jpg` | Nitin |
   | *Dilip* | `media/dp/dilip.jpg` | **Don't make it yet.** Create it at Beat 16; its arrival *is* the notification from Dilip's number |

   Make them in reverse order, so 📱 The phone ends up at the top of their list. Archive the groups after each test and make fresh ones for the next tester; old messages would spoil it.
2. **Mute nothing on your side.** On theirs, ask them to turn notifications on for these groups.
3. **If they try to message Dilip before Beat 16** (from inside the phone), answer in 📱: *(Sent. ✓ One grey tick.)* His phone is switched off until Anita's night round.
4. **Lay out the laptop:** WhatsApp Desktop on one half, [2-NIGHT.md](2-NIGHT.md) on the other, [3-REACTIONS.md](3-REACTIONS.md) a tab away, `media/` open in Finder.
5. Do one dry run with yourself as the tester (a second number, or a friend who has already played). It takes 20 minutes and will catch any file you can't find fast enough.

> The sender's name shows above messages in a group. Tell the tester once, in the briefing, that each chat *is* the person it's named after.

---

## Briefing the tester (read this aloud, then say nothing)

> "This is a story you play on WhatsApp. Tonight a phone has come to you. Everything happens in these chats. *The phone* shows you what's on the phone: tell it what to open. The other chats are people, and they'll message you. Reply however you like, in any language. You can forward anything to anyone. There's no wrong move and no score. Once it starts I can't help you. Earphones are better, but every voice note is written out too. It's about 35 minutes. There's a shooting in it; nothing graphic is shown."

Then start [Beat 1](2-NIGHT.md#beat-1--the-parcel).

---

## The rules while it's running

### Stay in character
Never explain anything, never confirm a guess, never say "good". If they ask *you* something ("what am I meant to do?"), answer as the phone: 📱 *(The phone shows what you open. People write when they write.)* Write the question down; it's data.

### Turns
A **turn** is one thing the tester sends to one character: a message, a burst of messages, or a forward, before they switch chats or the character replies. Reading the phone is never a turn.

### The clock
- **Before Bhasin's terms (Beat 18), the clock is atmosphere.** Post `🕐 time` in 📱 when a beat fires, using the beat's time. Between beats, each turn adds 5 minutes, but the clock never passes the next beat's time; it waits there.
- **After Bhasin's terms, the clock is real.** Each turn adds **5 minutes**, which leaves about seven turns between 4:06 and 4:40. Post the new time after every turn. At **4:40** Bhasin leaves, and the ending is whatever their actions add up to.
- No real-time pressure ever. Thinking is free.

### Sends
The [reaction table](3-REACTIONS.md#who-reacts-to-what) covers the important items. When it doesn't, reply in one line as the character would, from what *they* know, and write it on the sheet.

### Hints
Only in-world, only when they're stuck, and one step at a time:
1. **2 minutes stuck:** a character writes something that points the way (each beat lists one).
2. **4 minutes:** a 📱 notification that names a place on the phone.
3. **6 minutes:** 📱 states the next step in a short line.

Tick each hint on the sheet. A beat that needs step 3 on most testers is a beat to fix.

### Pacing
- Send a character's lines **one message at a time**, roughly as fast as someone typing (2–6 seconds apart). Voice notes go straight after their text.
- After a big moment (Dilip's chat, the reveal, the 1:52 screenshot, the empty mattress, Anita's voice), **send nothing for 20 seconds.**
- Never let the midpoint slip past minute 16.

---

## Pass bars (agree these before the first test)

Over 5 testers:

| Bar | Pass |
|---|---|
| Reach the reveal by minute 16 | 5 of 5 |
| Finish without breaking character for help | 4 of 5 |
| Strong reaction at the reveal (said something aloud, stopped, "wait…") | 4 of 5 |
| Suspected they were Sameer before the reveal | at least 1, at most 2 (fair, but not obvious) |
| Mention Dilip by name, unprompted, in the exit questions | 3 of 5 |
| Ask what happens next, or want Chapter 2 | 3 of 5 |
| Ever ask "what am I supposed to do?" | 1 of 5 at most |

**If a bar fails, change the story or structure, not the polish.** Note where it failed in the minute log; that's the beat to rework.

---

## After each test
- Fill in the bottom of the sheet the same day.
- Save the WhatsApp chats (*Export chat → without media*) into `results/<tester-name>/`. Their own words are the best material you have for the reveal and the endings.
- After 3 testers, compare the sheets before changing anything. One player is an anecdote; three show a pattern.
