# Raakh on WhatsApp: playtest kit

Raakh played over real WhatsApp, with you playing every character by hand. One tester, about 35 minutes, no code. It tests the **story and its structure** before anything gets built again.

**Revised twice on 2026-11-06**, after two AI blind runs (fresh agents playing the tester, hosted strictly from this kit). What changed and why is at the bottom of this page: [after the first run](#changes-after-the-first-blind-run), [after the second](#changes-after-the-second-blind-run).

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
| The twist came after she'd quit | **"You are Sameer" moves to minute ~15.** A payoff every 3–5 minutes after that: you held the gun → you fired → the mattress was empty → you sent the car away → Bhasin: he's alive, and the price is you → Anita: here's where, if you tell her who fired. | Each episode ends on a turn (bible §5); suspicion can be planted before it's confirmed (research §2.3) |
| Bored in the middle | **Sending is the main action.** Forward anything to anyone; they act on it tonight. Characters write because of something you did. A real deadline: once Bhasin names his terms, every message costs 5 minutes, and he waits at the gate only until 4:40. About 20 key items, not 54. | Show/Challenge conversations (bible §7.6); characters react to discoveries (research §1.3, bible §11.1); content budget (bible §13.2) |
| The case file was a memory test | **No case file.** 🗒 Notes keeps the timeline for them. The only "questions" come from characters (Raju: "Zinda hai?") and are choices, not quizzes. | The game holds the facts (bible §7.4–7.5); in-world hint ladder (bible §7.8) |

What it deliberately **leaves out** from the docs: the outsider researcher, Monday office hours, the evidence-type tags, and recommending a route to Meera.

---

## Setup (about 30 minutes, once)

**You need:** your phone with WhatsApp, WhatsApp Desktop or Web on a laptop (to paste and drag files in), this folder open, and a printed [5-SHEET.md](5-SHEET.md).

1. **Before the test, make 3 groups, each with just you and the tester:** Raju first, then 🗒 Notes, then 📱 The phone (so 📱 ends up at the top of their list). Set *Edit group settings → Only admins*, so the tester can't rename them.
2. **Every other character's group is made during the test, the moment that character first writes.** Its arrival is the notification, the way a new chat pops up on a real phone, and it means nobody can be messaged before they've spoken. Keep the names and photos ready; making a group takes about 20 seconds, and the tester is always reading something while you do it.

   | Group name | Photo | Made at | What happens there |
   |---|---|---|---|
   | 📱 The phone | `media/dp/phone.jpg` | before | Narration, the phone's screens, tonight's clock |
   | 🗒 Notes | none | before | The timeline and open questions. You post here; they read |
   | +91 62••• •4417 | `media/dp/raju.jpg` | before | Raju |
   | Mummy | none | Beat 4 | Mummy |
   | Bhasin Uncle | `media/dp/bhasin.jpg` | Beat 6 | Bhasin |
   | M | `media/dp/meera.jpg` | Beat 7 | Meera |
   | Nitin | `media/dp/nitin.jpg` | Beat 12 | Nitin |
   | Kunal | `media/dp/kunal.jpg` | Beat 13 | Kunal |
   | Dilip | `media/dp/dilip.jpg` | Beat 17 | Sister Anita, from Dilip's phone |

   Archive the groups after each test and make fresh ones for the next tester; old messages would spoil it.
3. **Mute nothing on your side.** On theirs, ask them to turn notifications on.
4. **If they try to reach someone who hasn't written yet**, use [Before they write](3-REACTIONS.md#before-they-write).
5. **Lay out the laptop:** WhatsApp Desktop on one half, [2-NIGHT.md](2-NIGHT.md) on the other, [3-REACTIONS.md](3-REACTIONS.md) a tab away, `media/` open in Finder.
6. Do one dry run with yourself as the tester (a second number, or a friend who has already played). It takes 20 minutes and will catch any file you can't find fast enough.

> The sender's name shows above messages in a group. Tell the tester once, in the briefing, that each chat *is* the person it's named after.

---

## Briefing the tester (read this aloud, then say nothing)

> "This is a story you play on WhatsApp. Tonight a phone has come to you. Everything happens in these chats. *The phone* shows you what's on the phone: tell it what to open. The other chats are people, and they'll message you. Reply however you like, in any language. You can forward anything to anyone. There's no wrong move and no score. Once it starts I can't help you. Earphones are better, but every voice note is written out too. It's about 35 minutes. There's a shooting in it; nothing graphic is shown."

Then start [Beat 1](2-NIGHT.md#beat-1--the-parcel).

---

## The rules while it's running

### Stay in character
Never explain anything, never confirm a guess, never say "good". If they ask *you* something ("what am I meant to do?"), answer as the phone: 📱 *(The phone shows what you open. People write when they write.)* After Bhasin's terms, add: *(To go somewhere, say where.)* Write the question down; it's data.

### Turns
A **turn** is one thing the tester sends to one character: a message, a burst of messages, or a forward, before they switch chats or the character replies. Reading the phone is never a turn.

### The clock
- `🕐` only ever means **tonight's clock**, and only ever appears in 📱. Notes lines about the wedding night carry their own dates instead.
- **Before Bhasin's terms (Beat 16), the clock is atmosphere.** Post it only when a beat shows a `🕐` time. Nothing else moves it.
- **After Bhasin's terms, the clock is real.** Each turn adds **5 minutes**: 4:11, 4:16, 4:21, 4:26, 4:31, 4:36. That's six turns; the seventh reaches **4:40**, Bhasin leaves, and the ending is whatever their actions add up to. Post the new time after every turn. A burst of messages to one person is one turn.
- If a beat fires early and its `🕐` would be earlier than one you've already posted, leave its `🕐` out. The clock never goes backwards.
- No real-time pressure ever. Thinking is free.

### Going somewhere
Leaving the flat is a move, and the tester says it in 📱.
- **Before Bhasin's terms:** 📱 *You get as far as the door. Go where? You don't know where he is.* Write down where they wanted to go. (If it's the police, use [If they call 112](3-REACTIONS.md#if-they-call-112-or-the-police).)
- **After Bhasin's terms** (the ⏳ line tells them): down to Bhasin's car is the deal; Bedi is Room 6; anywhere else gets one line of narration and they keep playing from there, with the clock still running. See [Beat 19](2-NIGHT.md#beat-19--the-last-half-hour).
- **Once they've left, they can still write.** Answer in character. Anything that reaches M or Raju before Anita's side-door message counts toward the Room 6 variants.

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
- After a big moment (Dilip's chat, the photo at the reveal, the 1:52 screenshot, the empty mattress, Bhasin's photo, Anita's voice), **send nothing for 20 seconds.**
- At every ✍️ pause in the endings, **send nothing at all** until they've written. Don't prompt, however long it takes.
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
| A strong reaction to the 12:29 photo, even if they'd guessed the name | 4 of 5 |
| Seriously weighed Bhasin's deal (asked him something, held off for a turn, said they were tempted, or took it) | 3 of 5 |
| Wrote something real at the ✍️ pause (more than "ok" or "skip") | 4 of 5 |
| Mention Dilip by name, unprompted, in the exit questions | 3 of 5 |
| Ask what happens next, or want Chapter 2 | 3 of 5 |
| Ever ask "what am I supposed to do?" | 1 of 5 at most |

**If a bar fails, change the story or structure, not the polish.** Note where it failed in the minute log; that's the beat to rework.

---

## After each test
- Fill in the bottom of the sheet the same day.
- Save the WhatsApp chats (*Export chat → without media*) into `results/<tester-name>/`. Their own words are the best material you have for the reveal and the endings.
- After 3 testers, compare the sheets before changing anything. One player is an anecdote; three show a pattern.

---

## Changes after the first blind run

On 2026-11-05 a fresh AI agent played the tester, with the host running strictly from this kit. It reached Room 6 in about 33 minutes, rated it 8.5/10 and never wanted to quit, but it found real problems. The log is in `results/ai-blind-run-1/`. An AI tester is a best case (it reads everything and never gets bored), so these are fixes, not a forecast.

| What happened | What changed |
|---|---|
| The ending was "obvious, I never considered the deal": Bhasin had just been caught faking a cremation, and Anita's message came first, so they sent Raju to Room 6 in one move | **Act 3 reordered.** Bhasin comes first, says "Maine bachaya", sends a photo of Dilip alive, and names the price (jail, Mummy alone). He's the only known way to Dilip. Anita arrives during the countdown as a gamble ("kahan, nahi bataya"). Dilip's plea shows the deal buys his silence |
| "Let me do the ending": the 6:05 statement was written for them and arrived as notifications | **Every ending has a ✍️ pause** where the tester writes it: the statement in Room 6, the message to Raju that Bhasin demands, the last message to M, the last message to Dilip. The ending uses their words, and the end card quotes them |
| Hearing their honest questions played back as lies felt "a bit unfair" | The playback now says *None of it was a lie. You didn't know.* Early solvers get M's "main nahi tha" line too. The 12:29 photo now lands last, so the gun is the punch even for someone who guessed the name |
| The kada was never set up | It's on their wrist in the very first message |
| The 1:52 punch never fired: they outran it, and Nitin's locked chat had already given it away | Act 2 isn't a sequence any more: pushed beats in a fixed order, pulled beats whenever, and Act 3 waits until all three punches have landed. Nitin's 1:52 now comes straight after the reveal; his locked chat stops at 1:40 |
| Messaging the live Nitin chat in Act 1 triggered an Act 2 beat | Character chats are made when the character first writes; [Before they write](3-REACTIONS.md#before-they-write) covers earlier attempts |
| Notes gave the punches away ("You fired the shot" as memo 14 played) | Notes only records what an item shows, with its source, after the tester has reacted. No ✅, no verdicts |
| Three places an impatient friend would stop: the call log first, the locked chats with no hint, eleven lines of screenshots | The phone opens on WhatsApp; the lock has a hint (*jo woh roz poochta tha*); the screenshots are five lines; Recents are in order |
| Kit errors: the 12:29 photo and the reel dated Saturday; 12:32 vs 12:31; Bhasin's "fine" voice note has no 7 AM deadline but Notes said it did; an honest "Dilip kaun?" matched two rows; no row for turning off Find My, or asking Mummy not to tell; `🕐` meant two things | All fixed. Tables are read top-down, first match wins |
| Three different faces for Dilip across the photos, and two captions that didn't match their pictures | The portrait, his "Hello sir" frame, Room 6 and Chhath were redrawn from the 12:29 photo's face, and the poster recut from the new portrait. The game uses the same files |
| The host had to improvise 9 lines | Rows added for each (Find My, Mummy, Raju and Kunal on the fire, M before the deal, Bhasin during the countdown, calling 112) |

---

## Changes after the second blind run

Also on 2026-11-06, three fresh AI agents played the revised kit as three different friends: a skimmer, a sleuth and a feeler. They scored it 8, 9 and 9, and all three reached Room 6 with a full confession. The logs and findings are in `results/ai-blind-run-2/`. Three runs now agree on the five problems below. The same caveat applies: these testers are a best case.

| What happened | What changed |
|---|---|
| **The deal cost nothing.** All three reasoned that everything was already forwarded to M, so they'd hand over the phone, let Dilip get on the bus, and go to the DCP anyway | **The price is Sameer, not the phone.** Bhasin says it himself: *"Phone rakh le… Usme sab tere khilaaf hai… Mera naam sirf tere muh se aa sakta hai. Tu chahiye. Chup."* Come down, get in the car, stay with him until the train. The deal and Room 6 are now two places to go, and you can only go to one. His terms are texts now, because the recorded voice note asks for the phone |
| **The birthday lock was the quit point.** The two testers who hit it cold nearly stopped there ("Wahan main sach mein phone rakhne wala tha"), at the lowest point of the night | **No password.** The note finishes downloading once who fired has landed, and opens |
| **Leaving wasn't a visible move.** All three were unsure they could go to Bedi; the phone's stock answer read as "no" | **Going is a reply.** The ⏳ line says you can leave and to say where. Bhasin says "Neeche aa". Dilip's "aap aa rahe ho na?" now arrives with the place. A new [Going somewhere](#going-somewhere) rule covers every point of the night |
| **Anita's gamble wasn't one.** She named Bedi in her first message, and all three solved "do log chahiye" (Raju + the DCP) at once, so all three got the same ending | **She keeps the place until Sameer tells her who fired.** She doesn't say where she works, she asks "Goli kisne chalayi thi?", and a lie gets *"Woh log bhi yahi kehte hain."* The riddle is gone; instead, *"Woh aapse darte hain."* Room 6 and Return to Origin now need a written confession to a stranger |
| **Two blows back to back.** Who fired, then 1:52 straight after, wore two of three down ("game bas mujhe peet raha hai") | **Act 2 reordered: who fired → the empty mattress → 1:52.** The hope sits between the two blows, so 1:52 lands as "he was alive, and I sent the help away". Beats 10–15 are renumbered to match, and so are their media files |
| In The Trade, Bhasin knew Raju had been told about Room 6, with no way of knowing | He reads it on Sameer's phone in the car. Raju's line no longer puts him at a gate he can't have reached yet |
| Room 6's statement didn't track Bhasin, though he'd said only Sameer could name him | A ☐ Bhasin tick, and one line at 10:30 AM that pays it off either way |

