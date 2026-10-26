# FOUND — "Raakh" (was "Shagun") · Delhi
## Chapter One, adapted for the game (2026-09-22)

**The story is [SCRIPT.md](SCRIPT.md)**, the Master Narrative Pass, copied word for
word from the finalised .docx. That file is canon and is never edited. This
document is the game adaptation: how the same story *plays* on a phone in
Found.

**The rule:** nothing here changes what happens. The objective truth (script
§5), the characters (§6), the mystery ladder (§7), the three episodes (§8–10),
the reveals (§11), the endings (§15) and the final line (§16) are all kept.
What this document adds is the *game layer*: times to the minute, which app
holds each fact, the questions, the routes, the choices and what they close,
the score, and the endings as acts. Anything the script doesn't state is
marked **(game)**. The appendix (N) traces every canon item to where the player
meets it.

Decided with Siddhant on 2026-09-22: **~20 minutes per episode** (a 60-minute
chapter, one sitting); ***Don't Cut the Call* is retired** to git history; the
score and share line is **links traced** ("I traced 9 of 11 links"). On
2026-09-24, **why the phone reaches the player** (O1) was decided: **returned to
origin** (M).

---

## The perfection pass: Q1–Q4 (2026-10-26)

**This section supersedes everything below wherever they disagree.** Siddhant asked
for Se7en-level care: no detail unnoticed, the script not sacred. Four of his
five questions are done here; **Q5 (the endings) is held** until he has
gathered feedback, so the decider, the record and endings.ts are unchanged.

**Q1 · "4. Nitin —", paid off.** Item 4 would have sent M to Nitin's chat, the
one place 1:52 still exists: that's why the list stops. Thursday night is now
a sequence a player can find (11:06 Safari, 11:10 the lock, 11:12 the memo,
11:16 the insurance note, 11:20 "For M", **11:24 a cancelled call to Nitin**,
11:25 Nitin's call back, missed, 11:26 the last edit). Nitin, once trusted,
says it ("Thursday raat usne call kiya tha. Ek ring. Phir kaat diya."); Q13's
answer says it out loud; Look again has the twenty minutes as a row.

**Q2 · Two nights, one clock, kept apart.** The wedding night (22–23 Nov) and
tonight (29–30 Nov) share their minutes. Tonight is labelled wherever its
clock shows (`Story.nowLabel`: title cards, the finale, the night's moments);
the Episode 2 cliff names "that night". The minutes a player handles are six
anchors (11:52, 12:32, 1:14, 1:52, 2:55, 4:47): Q8 and Q14 lost their time
blanks, and the shot is 12:32 everywhere. The case file opens on **the night
strip** (`Story.timeline`, `NightStrip.tsx`): that night above, a minute pinned
only once it's traced (and the 1:49/1:53/1:56 cluster once Q10 is filed);
tonight below, faint, where each episode opened and where the clock is now.
The title-card device is said once each: Q6's answer ("That was 12:32. A
week later, to the minute, his phone came back on in your hands.") and Q11's.
Two misquoted labels (Nitin's 1:53, his copy of 1:52) now quote the messages.

**Q3 · Safari and the locked chats are Episode 2's layer.** Before Episode 2,
Safari is only the tab he left open, failing to reload on 64 Kbps
(`Story.safariWaits`); "pakki" opens nothing (`chatLock.requires`). Nothing
in Episode 1 needs either (tests/layers.test.ts holds it).

**Q4 · Every later episode opens on "Previously" and a briefing**
(`Story.openers`, `Previously.tsx`, scene `opener`, before the title card).
Researched first: Life is Strange / Telltale recap the player's own choices;
Alan Wake 2's case board is the re-onboarding; Hitman briefs target, stakes
and obstacles; Golden Idol states the goals. So: the player's own filed
sentences for the beats this episode pays off ("his version" and "your
hunch" marked), the last cliff line, then *Find out*, *Still open* (moved
from the end recap), *Against you*, *Clock*. Skippable at once.

---

## Seven o'clock: the living witness (2026-10-24)

**This section supersedes everything below wherever they disagree**, including
the final cut beneath it. Why it exists is in [RAAKH-REVIEW.md](RAAKH-REVIEW.md):
Episode 3 used to be a deduction exercise with nothing at stake, and the
chapter ended on a form. Now it ends on a reversal, a deadline and a choice.

**The reversal.** Nobody burned a body. At 2:55 AM Bhasin's car took Dilip
out of the service room (Pappu in his group: "Sir gaadi nikal gayi"), and at
4:47 Sameer burned a mattress, sheets and Dilip's clothes on the back plot,
believing it was the boy. Every clue was already on the phone: the fire
clip's "Uske kapde bhi", the jerrycan beside a rolled mattress, the 2:55 car.
- **Q12** asks what Sameer did at the fire and what burned. "Dilip's body" is
  his version; the truth is a mattress, sheets and clothes ("No body.").
- **The witness**: after Q13, Dilip's own number writes in (a nurse at Bedi
  Nursing Home, Fatehpur Beri, holding his phone and a bag with his maroon
  waistcoat). In airplane mode Raju rings *your* phone and relays it instead.
- **Q14**: "The patient is Dilip. Bhasin's car took him out at 2:55, and
  nobody burned a body." Proved by the belongings and the badge, or the
  nurse's voice note and his portrait, or the car and either. Link **Still
  alive** (`alive-now`): the chain is **12 links**, 8 on the spine.

**The deadline.** They move him at seven, under the name Deepak. Sister Anita
needs two people: one who can identify him, one Bhasin is afraid of.

**The decider** (`moments` in episode3.ts): two calls, full screen, against a
clock (40 s, then 30 s). Meera (the DCP at Saket isn't Bhasin's man), Raju
(he can identify him), Sameer (he goes only if you made him face 1:52 first),
112 (the local SHO rings Bhasin), or a post from his Instagram (900 shares, and
the back gate opens once). Saved with **Meera + Raju**, **Meera + a confronted
Sameer** or **Raju + a confronted Sameer**; anything else, or the clock
running out, and he's gone at 6:58. Played live: 3:24 AM (inside Sister Anita's shift, which ends at 3:30), a white Gypsy at the
front gate, Room 6, "…Bhaiya. Light ready hai."

**The record, after.** The finale is **4:40 AM, Sunday**, its line told from
the way seven went. Every ending opens with what had already happened, then
the record's replies, then the morning (6:40 Raju, 6:58 / 7:00 the back
gate), in clock order (tests/endings.test.ts holds it). The last image is
Raju's: Dilip awake ("Ab achhi photo hai"), or Dilip at Chhath ("Jab tak woh
mil nahi jaata"). The end card leads with the fate ("Dilip Kumar Mahto is
alive." / "…is still missing."), and so does the share line ("I got there
before seven.").

**The ending, as the review set it out** (2026-10-24, second pass):
- Saved: Raju's photo of Dilip awake, then **Dilip's own voice note** to whoever has the phone ("Jo bhi ye phone rakhta hai… shukriya"), heard as it lands.
- Lost: at 6:58 the Innova leaves with its lights off ("Le gaye", "Unka phone bhi le gaye"); **three weeks later** (the lock screen moves to Sunday 21 December) Raju sends the reprinted LAPATA poster, its new line ("last seen alive: Fatehpur Beri") underlined by hand.
- Losing him is told at the hour it happened (late-police 3:09, late-post 3:12, late-meera 3:24, late-raju 3:50, late-froze 3:00, late-clock 3:30), never at 6:58 before the 4:40 finale.
- The recognition, said once in the Complete Record: "Sameer arranged this phone so his part would end before a death. Bhasin arranged the night so there would be a death for it to end before."
- **The record waits** (`Story.hold`): from the twist until the night's last moment has played, the case file and the home screen say "they move him at seven", and Send/Post aren't offered.

**Around it** (the review's enhancement list):
- **Real time** (`Story.realtime`, chosen at the parcel): once Q14 is filed, a four-minute countdown sits over the phone ("Sister Anita's shift ends at 3:30") with *Make the calls*; the player can still go back into the phone (to confront Sameer) while it runs; at zero, he's lost (late-clock). The nurse says when her shift ends in every mode (nu-10).
- **Everyone's outcome**: `fate:yes|no` are counted; once 50 have played, the end card says "{n}% of everyone who's played got there before seven."
- **Your night** (`content/raakh/night.ts`): the player's choices as a timeline on the end card, shared as a version with no names or spoilers.
- **Episode drops** (`lib/found/release.ts`): `NEXT_PUBLIC_RELEASE_RAAKH_3=<ISO time>` holds Episode 3 behind the Episode 2 recap with a countdown and "tell me the moment it's out". Unset, nothing is held.
- **Trailers** (`scripts/trailers.py`): built, but held back from the site on 2026-10-24; neither the Chapter 2 teaser nor the Raakh trailer ships.
- **Voice actors**: VOICE-SCRIPTS.md is generated from the voice spec, per actor, file by file, so a real recording drops in with no code change.

**The first minute** (rebuilt): your table under a lamp, drawn rather than
photographed; a kraft mailer with its waybill to Meera Arora, Kalkaji, and
the courier's RETURN TO ORIGIN stamp; a strip to pull. Inside, the shagun
envelope lifts and turns over in 3D, beside the torn mailer and his phone
face down with a cracked corner, which buzzes on the wood.

**Footage.** The reel take, Kunal's dance-floor clip, the fire and the whole
fire play as real video (`public/found/raakh/clip-*.mp4`, `scripts/clips.py`):
picture, the wedding or the fire under it, and the voices, with the captions
following the footage.

---

## The final cut: Raakh (2026-10-23)

**This section supersedes everything below wherever they disagree.** Siddhant
renamed the chapter **Raakh** (राख, ash; route `/c/raakh`, `/c/shagun`
redirects), made it Chapter 1 ahead of Last Local (now Chapter 2, which the
end card opens), and fixed the cast. SCRIPT.md is still untouched; where this
cast differs from it, this cast is the game's.

**The cast**
- **Sameer Khurrana, 27** (born 14 March 1998): wedding **planner**, SK Weddings, South Delhi; plans the weddings and shoots the brand's reels. Offer: Senior Wedding Producer, Rangmanch Weddings, Mumbai. Instagram @sk.weddings.
- **Kunal Sehgal, 25**: his friend since college; **the bride's brother**. Brought his father's licensed revolver to the reel.
- **Bhasin Sehgal, 58**: Kunal and Ishita's father, retired from the police, runs Sehgal Enterprises; paid for the wedding and ran the cover-up. "Bhasin Uncle" to Sameer's mother.
- **Dilip Kumar Mahto, 19**: catering worker (Sethi Caterers), Samastipur; held the light. **Never "Chhotu"**: his chat, badge and poster say Dilip.
- **Nitin Kumar, 23**: SK Weddings' crew member and **editor**; had a 102° fever and **wasn't at the wedding**, which is why Dilip held the light. From his bed in Laxmi Nagar he sent his friend Vicky's car to the service gate.
- **Meera Arora, 28**: advocate (Saket District Courts), Sameer's ex, **lives in Kalkaji**; the parcel went to her home there while she was at a wedding in Jaipur.
- Chats only: Mummy (Neelam Khurrana), Raju Mahto (Dilip's brother), Mr Sethi; Pappu and Ramesh in Bhasin's group.

**The phone**
- Faces: profile photos on WhatsApp, Settings and Instagram (generated fictional people, ASSETS.md "Raakh frames").
- **Instagram replaces "your phone"** for this chapter: a home feed and Explore (the night going public once its thread is known, and an ordinary feed from everywhere), search, private accounts (Meera), and the posts Photos no longer has (the couple, the family, the pheras, the baraat; Kunal's revolver at 12:24, `kunal-pose`; Nitin's fever post).
- **Meera** rings in Episode 2, unblocks Sameer and writes in the M chat: his passwords are his birthday; airplane mode once Bhasin has the location.
- **The locked note** "Agar kuch hua" takes **1403** (his birthday, Settings › his name › Personal Information; hint "birthday · ddmm"), entered in OTP boxes. Opened early, its contents count in Episode 3.
- **Safari** keeps the WhatsApp Help page on hiding locked chats open in a tab, readable from minute one.
- **Photos**: left/right by arrow keys or swipe, "n of N", and the grid stays where it was.
- **Voices**: every voice note, memo, clip and call is voiced (neural Hindi TTS from the captions, `scripts/voices.py`), timed to the captions.

**The case file**
- Every word of every blank is offered from the start (no locked words).
- A whole sentence is read back at once: the wrong word is struck in red, with where the right one is shown, or a near miss answered in its own words.
- Proof is step 2, a short list of what bears on the question, and a failed filing says what's missing and which app has it, or which item doesn't belong.
- Q10 is a sentence (service room, Bhasin's orders, awake at 1:14); its answer names 1:49, 1:53 and 1:56 as the moments that don't fit.
- A progress strip (episode, a dot per question, links traced) heads every question.
- **Closing the case** is the case file's last page: the record's rows, then send to Meera, post on his Instagram, or hand it back to the courier (any time).

**Episodes end as episodes**: a recap (filed, found, links, hunches called, the cliffhanger line, what's still open) before the charger and before Episode 3's title.

---

## The thriller pass (2026-10-17)

After a blind first play (PLAYTEST-SHAGUN.md #94–108; the full list is
ROADMAP "The thriller pass"). SCRIPT.md is untouched; every line below is
(game):

- **Sameer's why.** After "Mujhe pata tha woh nahi nikla tha" (I knew he hadn't got out), the player
  can ask "Kyun?" (Why?). He answers with canon's motive (§6: protect career, not be
  the sole face of it): Kunal's video of his shot, a case that would be his
  alone, Mumbai on Monday, Bhasin's doctor he chose to believe, and "Woh
  mujhe bhaiya bolta tha." (He called me bhaiya.) Still his version: it explains, it doesn't excuse.
- **Bhasin has the player's address.** With "Location dekh li hai" (I've seen the location): the
  parcel's sender line is the player's (O1), and his people reach the
  courier. The epilogue's man at the gate keeps that promise.
- **The showreel.** Rangmanch's offer asks him to bring one on day one: the
  reel on the back lawn was for him, and ambition is why a boy was holding a
  light in front of a loaded gun.
- **Dilip before the light.** 18/11: "Mumbai mein samundar roz dikhega?" (Will I see the sea every day in Mumbai?)
- **Raju on the call** closes it himself rather than being hung up on.
- **The board** takes 12:38 in Dilip's lane and 1:22 in the car's; its
  answer ends on the question the player marked. Q13 reads "as insurance
  against them".
- **The cold open.** Before a first parcel: 12:31 at Banyan Farms in
  captions, a boy asking about the light, "Rolling, bhai?", two shots, the
  dhol playing on. Nobody named; no "pakki".
- **The train, from Q1.** Sameer is "on a train tomorrow afternoon"; the
  RailBook ticket is evidence; the 4:55 departure closes the ending.
- **The knock.** At 2:40 the guard at the player's own gate rings: a man
  in a safari suit asking for their flat, "from the courier". He comes back
  at 7.
- **Nitin and Kunal write first** in Episode 3, seeing his phone online.
- **The morning, on your phone.** The ending's lines arrive as your lock
  screen's notifications; Meera files at Saket against her senior's advice;
  a named Nitin has Bhasin's people at his door; Mummy writes to a son
  already on the train. The fire clip in Favorites says it's trimmed.

---

## After the review (2026-10-01)

**This section supersedes the ones below wherever they disagree.** A review
from three standpoints (PLAYTEST-SHAGUN.md #58–83) found the game handing the
player its answers. Siddhant asked for all of it fixed. SCRIPT.md is untouched:
what changed is what the phone shows when, and how the player says it.

- **Words are learned (Golden Idol).** A sentence's blanks offer a word only
  once something on the phone has taught it (`Say.learn`): no name before
  it's met, no twist before what shows it. Q9 is built from words ("{who}
  {why}"), so "Sameer told Nitin" is the player's to assemble. Q11 has no time
  to fill in (the title card says it).
- **Episode 1 no longer gives Episode 2 away.** The shot list reads *"12:15 —
  KS reel. back lawn… C — light"*; Mr Sethi asks if Chhotu was *"with your
  crew"*; Safari's 1:57 *"goli lagne ke baad kitne ghante"* is gone (12:44–1:56
  stay: canon reveal #6). The poster names no venue and no job.
- **The wrong story, for the right reasons (script §23).** In plain view:
  Kunal at 12:20 on the back lawn, a revolver by his face (`kunal-pose`). Q5
  offers "Kunal's reel", and refuses it: whose tripod, whose take.
- **The passcode** shows only *Off*: iOS doesn't say when. Q4's *Thursday
  night* comes from "For M".
- **The code** (*pakki*): memo 15 is a riddle (*"woh jo woh roz poochta
  tha"*), answered by the reel take, where the boy asks *"Bhaiya… Mumbai pakki
  na?"* seconds before the shot. Raju, trusted, says it too; Sameer still
  gives it away.
- **Claiming to be M is tested.** M's chat keeps her messages from before the
  block (*"Sammy, ghar pahunch ke message kar dena"*); Sameer asks what she
  called him. Right, he believes; wrong, *"Tu M nahi hai."*
- **"Mujhe laga khaali hai" can be caught**: he'd fired a round from it ten
  seconds before. He admits *"Pata tha usme goli hai."*
- **M rings his phone in Episode 2**, after the reel is known: the courier
  told her about the parcel. Her bias shows at once (*"darpok hai, par jhooth
  nahi bolta"*); her number lands on the player's phone; Nitin hears her name
  as a reason however she was met.
- **The board asks its own question.** Lanes are cells under each row; once
  they're right, the player marks what can't all be true (1:49, 1:53, 1:56).
  Nothing lights for them.
- **The line is the climax, not an echo.** Sameer's "Sab dekh liya?" comes
  after the board; he can be *asked* (*"Beech mein tumne usko kya bola?"*), and
  his answer is a way to file Q11.
- **The night waits for the player.** Nothing arrives while the case file is
  open; turns land ten seconds apart; the phone dies once his first message
  has been read.
- **Help is chosen.** At the parcel: *With help* or *Detective* (no
  where-to-look, no nudges).
- **Look again.** After the end card: his phone, with what was there from the
  first minute (K1, tap for what it meant), and where the untraced links were.

## Chapter 1 as its first players get it (2026-09-25)

**This section supersedes the detail in E–J wherever they disagree.** Siddhant
asked for Chapter 1 to be made ready for friends, with every finding from the
third play (PLAYTEST-SHAGUN.md #34–50) solved, and the calls left to Claude.
Nothing that happens changes: SCRIPT.md's events, people, ladder, reveals and
endings all stand. What changed is **when the phone shows each thing** and
**how the player answers**.

**1. The night unfolds, a layer an episode (#34, #37).** Before this, the
plain-view chats held the whole chain by Episode 1's tenth minute. Now:
- **Bhasin's group has disappearing messages** (he turned them on as he made
  it, as an ex-policeman would). In Episode 1 it holds two system lines and
  nothing else. The night survives only as **Sameer's four screenshots**,
  taken Sunday morning, 8:52. They're in iCloud until Episode 2, like the reel
  take and the 12:29 photo. The one naming him (12:36, *"Sameer, gun Kunal ko
  do"*) he deleted: it's in Recently Deleted. "For M" now reads *"3. Bhasin
  wala group — screenshots"*.
- **Nitin's and Chhotu's chats are behind WhatsApp Chat Lock**, with "Hide
  locked chats" on: not in the list at all. The door is visible in Episode 1
  (WhatsApp › Settings › Privacy › Chat lock: *2 chats*; a Safari search on
  Thursday, *"whatsapp chat lock hide chats secret code"*). The code is
  **pakki**, the word of his promise to Dilip (*"Mumbai wali baat pakki
  na?"*). **Sameer gives it away himself** in Episode 2, after he's been
  proved to have fired, to show "he tried". The other way, for a player he
  can't reach, is a second memo he deleted, *New Recording 15*: he starts to
  tell M the code, and stops, as "For M" stops at "4. Nitin —".
- **Kunal's chat stays in plain view**: it blames Kunal (his father's gun),
  so Sameer kept it. The curation now has one rule (#44): he kept what points
  at others, deleted what points at him, locked what he couldn't bear to
  delete, and locked away his insurance.

**2. The player says it (#35, #36, #19, #20).** Every question but the
five-lane board is a **sentence to finish**, blank by blank, from a few
words each, then proved with what's on the table. The words are the
player's; nothing is chosen from a list of conclusions. A sentence can be:
- **Sameer's version** (filed, never called wrong);
- **only what the phone shows** (*"someone at the wedding"*);
- **a hunch** that runs ahead of the phone (filed "on your word").

Near misses get a pointed answer instead of "no" (*"Believing it? Where was
Sameer at 1:49?"*). The board's rows are quotes with nobody's name on them.

**3. Each episode ends on the next one's question.** Episode 1's Q3 asks who
shot Dilip; Episode 2's Q6 tests it. Episode 2's Q9 asks why the car left
empty; Episode 3's Q11 tests it. When the answer lands:
- a version on file is **struck from the record** on the spot, shown as it's
  crossed out (no Revisit to refile);
- a hunch pays off: ***"You called it at 11:45 PM."***

**The questions now:**
- **Episode 1:** Q1 whose phone, Q2 the boy, Q3 who shot him (version / someone / hunch), Q4 prepared.
- **Episode 2:** Q5 the reel, Q6 who fired (the two firings and the shot, one sentence), Q7 alive, Q8 the car, Q9 why it left empty (version / someone / hunch), QM the money (side).
- **Episode 3:** Q10 the board, Q11 who sent the car away, Q12 the fire, Q13 why he sent the phone.

**4. The reveals are staged (#38).** The three that turn the story land as a
word on its own, large, before what it means: **"Sameer."**, **"Alive."**,
**"He knew."** (and "His hands.", "His version." for the fire and the phone).
Then the phone reacts: Sameer starts typing; Raju **rings**.

**5. Three people, with arcs (#39).**
- **Raju** rings in Episode 1, and rings again the moment Dilip is known to have
  been alive. At the end he asks the question nobody else can answer:
  *"Kuch pata chala? Sach batana."* Told the truth, he answers *"Maa ko kya bolun?"* and sends
  a photograph of Dilip at Chhath: *"Isko rakhna. Uski yahi achhi photo hai."*
- **Sameer** steers from his first message and gives the code away to prove
  he tried. Told "Haan" (you're M), he says *"Tune block kiya tha."*
- **Nitin** won't hand a stranger anything: *"Kaun ho aap? Bhasin ke
  aadmi?"* He gives the 1:52 message only for a reason the player earned:
  - Raju's trust
  - having written to Meera
  - a promise to keep his name out

**6. The thriller reaches the player (#40).** In Episode 3 **Bhasin rings**:
the phone's location shows on Sameer's mother's phone, and on his. Later:
*"Location dekh li hai. Subah 7 baje tak phone gate pe chhod dena."*
Airplane mode (Meera's advice) is the counter. The endings say whether a man
in a safari suit came asking at 7.

**7. The endings close on people (#41, #21, #22, #27).**
- Meera's mobile is **on the parcel's label**, so she can be written to (and
  sent the record) from the first minute: no hidden step.
- Links that name Nitin can go in **"Without his name"**. The Complete Record
  says whether you kept a promise.
- Three last lines close the threads: Raju's answer, Bhasin's 7 AM, and Sameer's train (*4:55 PM, coach B3, seat
  41 is taken*).

**8. Chapter 2 is announced (#17, #49).** The end card ends on Meera: *"Ek aur
phone aaya hai. Mumbai se. Is baar label pe naam tumhara hai."* The desk
says Case 2 is on its way. Canon §21: a new case, not the missing half of
this one.

**Also:**
- the lock screen's English (#47)
- the parcel strip can't be selected (#48)
- an answer never narrates evidence the player hasn't seen (#42)
- a call waits for the player to hang up (#46)
- on a charger that's already in, the player plugs his phone in by hand (#45)
- a fuller wedding album (#50)
- the desk line no longer teases "someone called M" (#21)

---

# A. THE PREMISE, AS PLAYED

A parcel at your door. Inside, a phone with a cracked corner, and a wedding
envelope, maroon and gold, from somebody else's shaadi. On its back, in a
man's quick handwriting: **"M — Sab isme hai. Local thane mat le jaana. Bhasin
ke log wahan baithe hain."** *(M — It's all in here. Don't take it to the local
police station. Bhasin's people sit there.)* You are not M. **(game: the
envelope)**

The courier's label says who M is: **Meera Arora, Advocate, Saket Courts**.
Across it, a stamp: **RETURN TO ORIGIN · Addressee not available**. She was away
when it came. So the courier brought it back to the sender's address, and
Sameer, who couldn't use his own, made that address up. It's yours. Nobody
chose you. **(game: O1)**

The phone has no passcode. It wakes to **47 missed calls** from a number
nobody saved, and while you're still reading the list, that number rings in
your hand.

The phone belongs to **Sameer Khurana, 27**, a Delhi wedding photographer
(SK Films) with a job offer in Mumbai and a camera on EMI. Among 1,284
photographs of the Sehgal wedding at a farmhouse in Chhattarpur is a
nineteen-year-old waiter smiling over a tray. By the end of the first episode
you'll have seen his face on a missing-person poster, heard Sameer's voice
notes saying *Kunal was firing, a boy fell, they didn't treat him, they burned
him*, and watched nine seconds of firelight on a wall.

It looks like a witness's phone. It's the phone of the man who fired the shot,
and he arranged it before he sent it. **Everything on it is true. The order
is his.**

**The chapter's question** (script §17): *when an accident becomes a chain of
choices, where does responsibility actually end?* The player answers it with
their hands: by what they put in the record, and what they do with it.

---

# B. THE PEOPLE

| | |
|---|---|
| **Sameer Khurana, 27** | Wedding photographer, SK Films, South Delhi. Ambitious; wants a cinematic reel for Mumbai. Remembers exactly what he did; builds a meaning around it that protects him. Writes Roman Hinglish, fast, lowercase. (canon) |
| **Dilip Kumar Mahto, 19** | Catering worker, "Chhotu". Had started helping Sameer's crew on small jobs. Trusted Sameer, because the relationship was real. (canon) Sameer had promised to take him to Mumbai as an assistant. **(game: the promise's content)** |
| **Kunal Sehgal, 24** | The groom's younger brother. His father's licensed revolver. Social, careless; enables the shooting and helps contain it, and believes he's less responsible because he didn't fire the fatal shot. (canon) |
| **Vinod Bhasin, 58** | Retired police officer, now security and liaison for the Sehgals. Calm. Sees control as problem-solving. (canon) Known to Sameer's mother as "Bhasin uncle". **(game)** |
| **Nitin, 22** | Sameer's assistant. Really tries to help, and obeys a false reassurance without checking it. (canon) |
| **Raju Mahto, 24** | Dilip's older brother, a delivery rider in Delhi; his SIM is from home, Samastipur, Bihar. (canon, **game:** the district) |
| **Meera Arora, 28** | Junior advocate, Sameer's former partner. "M." Blocked Sameer after they split. **(game: the block)** Her history with him helps her read him and biases her toward him at first. (canon) |
| *Game layer* | **Neelam Khurana**, Sameer's mother ("Mummy"). **Vicky**, Nitin's friend with a Swift. **Pappu and Ramesh**, the farmhouse guards. **Mr Sethi**, the catering supervisor. Rohan and Ishita, the couple (names only). |

**Fictional names for everything that's part of the crime:** SK Films,
Sehgal Enterprises, the venue (**Banyan Farms, Chhattarpur**), Bhasin's agency
(**Shield Liaison Services**), **Sethi Caterers**, **Lifeline Hospital,
Mehrauli**, the payments app (**Paytap**), the lender (**ZipEMI**), and the
Mumbai production house (**Rangmanch Productions**). Real places (Delhi,
Chhattarpur, Mehrauli, Samastipur, Mumbai) are fine.

---

# C. THE NIGHT, MINUTE BY MINUTE

The objective truth (script §5), with times and the record that holds each
moment. **(game: every time and every record.)** The wedding is **Saturday 22
November**; the player's night is **Saturday 29 November**, exactly a week
later.

## C1. Before

| When | What happened | Where the phone knows it |
|---|---|---|
| Thu 20, 4:18 PM | Kunal to Sameer: *"Bhai reel mein Papa wali le aaunga. Asli feel aayegi 🔥"* Sameer: *"😂 done. back lawn, 12:15"* | WhatsApp › Kunal |
| Fri 21, 11:02 PM | Sameer's shot list for the Sehgal job, last item: *"12:15 — KS reel. back lawn, mango trees. Dilip — light. Nitin — van/batteries."* | Notes › "Sehgal — shot list" |
| Sat 22, 7:10 PM | Dilip: *"Bhaiya Mumbai wali baat pakki na? 🙏"* Sameer: *"pakki. shaadi ke baad baat karte hain. aaj light tu pakdega"* | WhatsApp › Chhotu (Dilip) |

## C2. The wedding

| When | What happened | Where the phone knows it |
|---|---|---|
| 9:48 PM | Sameer takes a real portrait of Dilip in a break: caterer's waistcoat, a tray, fairy lights, smiling at the lens | Photos › Sehgal wedding |
| **11:52 PM** | **Kunal fires two rounds into the air** on the dance-floor lawn, dhol and cheering. At 11:58 he sends Sameer the clip: *"bhai ye bhi daal dena film mein 🔥🔥"* | WhatsApp › Kunal (video, 0:14) |
| 12:15 AM | The private reel on the back lawn: Sameer, Kunal, Dilip holding an LED panel, Sameer's iPhone on a tripod. Nitin is outside at the van. | Notes (shot list) |
| 12:29 AM | Kunal photographs the setup: Sameer holding the revolver, Dilip beside him with the light. He sends it: *"🔥 boss"* | WhatsApp auto-saved it to Photos (the message itself was later deleted) |
| **12:31:40** | Sameer fires once, upward, for the camera. The take ends at 12:31:54, when he stops recording to check it | Photos › **Recently Deleted** (the take, 0:14; in iCloud until Episode 2) |
| **12:32:05** | **The second discharge**, made while posing for Kunal's phone, lower than intended. **It hits Dilip. He is alive.** | Kunal's phone (the family's video). Not on Sameer's phone until Monday (C4) |

## C3. The missing interval

| When | What happened | Where the phone knows it |
|---|---|---|
| 12:36 AM | Bhasin creates a group, **"Banyan — Security"** (Bhasin, Kunal, Sameer, Pappu, Ramesh). First message: *"Sameer, gun Kunal ko do. Abhi."* | WhatsApp › the group |
| 12:38 AM | Bhasin: *"Koi 112 nahi karega. Ladke ko service room le jao. Main sambhaal raha hoon."* Dilip is moved, not driven to a hospital | The group |
| 12:44–12:52 AM | Sameer searches: *"goli lagne pe kya karein"*, *"gunshot hospital without police case delhi"*, *"lifeline hospital mehrauli emergency number"* | Safari › History |
| 12:52 AM | Bhasin: *"Doctor ka intezaam ho raha hai."* No doctor comes. | The group |
| 12:58 AM | Nitin: *"Bhai kya hua? andar se awaaz aayi. sab bhaag rahe hain"* | WhatsApp › Nitin (**archived** later) |
| **1:07 AM** | **Dilip to Sameer:** *"Bhaiya dard ho raha hai. Aap aa rahe ho na?"* Sameer, 1:08: *"aa raha hoon. hospital le jayenge. bas thodi der"* | WhatsApp › Chhotu (Dilip) |
| 1:14 AM | Pappu: *"Sir ladka hosh mein hai. Paani maang raha hai."* | The group |
| 1:22 AM | Nitin: *"maine Vicky ko bola hai, uski gaadi hai. 20 min. service gate pe laata hoon. Dilip ko wahan le aao"* **Nitin's genuine attempt.** | Nitin (archived) |
| 1:31 AM | Bhasin: *"Doctor aa raha hai. Sab shaant raho."* | The group |
| 1:40 AM | Nitin: *"Vicky 10 min. service gate — Mandi Road wala na?"* | Nitin (archived) |
| 1:49 AM | Ramesh: *"Sir, Sameer sir service room mein hain ladke ke paas."* | The group |
| **1:52 AM** | **Sameer to Nitin:** *"Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bhej aur nikal yahan se."* **He knows it's false.** He tells himself Bhasin has it in hand, and that Nitin will make it worse. | **Deleted "for me" on Thursday.** Nitin still has it. |
| 1:53 AM | Nitin: *"theek hai bhai. agar le gaye hain toh main Vicky ko wapas bhej deta hoon"* | Nitin (archived): **a reply to a message that isn't there** |
| **1:56 AM** | Sameer searches *"private ambulance chhattarpur 24 hours"*; at 1:57, *"goli lagne ke baad kitne ghante"*. **He is still looking for help four minutes after saying help had come.** | Safari › History |
| 1:59 AM | Pappu: *"Sir service gate pe ek Swift aayi hai, kisi ko lene."* Bhasin: *"Kaun? Pata karo."* | The group |
| 2:04 AM | Pappu: *"Chali gayi sir. Driver bol raha tha cancel ho gaya."* Nitin, the same minute: *"Vicky wapas aa gaya. bhai sab theek hai na?"* No reply. **The car left empty.** | The group; Nitin (archived) |
| 2:41 AM | Pappu: *"Sir ladka bol nahi raha."* Bhasin, 2:42: *"Call karo mujhe."* The group goes quiet. | The group |
| 2:41–3:30 AM | Dilip dies on the property. **The game never states a minute** (script §18: no false certainty). | — |
| 3:31 AM | Bhasin calls Sameer: 4 min 12 s | Phone › Recents |
| 4:20–5:05 AM | The body is burned on the back plot by the old tube well, on Bhasin's orders. Sameer takes part. At 4:47 he films 31 seconds. | Photos › Favorites (the clip, **trimmed** to 0:09 on Thursday) |

## C4. The week after

| When | What happened | Where the phone knows it |
|---|---|---|
| Sun 9:10 AM | Bhasin to Sameer: *"Balance aaj aa jayega. Tab tak kisi se baat nahi. Nitin se bhi nahi."* | WhatsApp › Bhasin Uncle |
| Sun 9:40 AM | Voice note 1 to "M": *"M… main jaanta hoon tu reply nahi karegi. Kal shaadi mein… Kunal firing kar raha tha. Ek ladka gir gaya."* One grey tick: **she blocked him.** | WhatsApp › M (pinned) |
| Sun 11:04 AM | **+₹1,80,000** from SEHGAL ENTERPRISES: *"Final balance – wedding coverage"*. It's the balance due on his own invoice, dated 3 Nov. **(legitimate money, now leverage)** | Paytap; Mail › invoice SK-1127 |
| Sun 11:20 PM | Voice note 2: *"Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya."* | M |
| Mon 2:05 AM | Voice note 3: *"Unhone usko jala diya, M. Main wahan tha. Maine dekha."* | M |
| Mon 10:12 AM | Mr Sethi: *"Chhotu ka hisaab Bhasin sir ne kar diya. List se naam hata diya. Aap bhi kuch mat bolna."* **(money that makes the incident disappear)** | WhatsApp › Sethi Caterers |
| Mon, from 1 PM | Raju's calls begin (he got the number from Dilip's contacts), then a forwarded poster: **LAPATA — Dilip Kumar Mahto (Chhotu), 19**, last seen Sat 22 Nov, Chhattarpur | Phone; WhatsApp › unsaved number |
| **Mon 3:10 PM** | **Kunal sends a frame from his video:** Sameer's arm coming down, the flash, Dilip behind the light. *"Humare paas bhi hai. Soch samajh ke."* Sameer screenshots it. **Now he knows he fired the shot, and that they can prove it.** | Notes › **"Agar kuch hua"**, locked (the screenshot); the chat message deleted |
| Mon 4:58 PM | A voice memo, to nobody: *"Pehli camera ke liye thi. Doosri… main pose kar raha tha. Mujhe laga khaali hai."* *(The first was for the camera. The second… I was posing. I thought it was empty.)* | Voice Memos › **Recently Deleted** (the app offloaded) |
| Tue 11:30 AM | Mummy: *"Bhasin uncle aaye the. Pooch rahe the tu kahan hai. Beta sab theek hai?"* | WhatsApp › Mummy |
| Tue | Mumbai goes on: the offer letter from Rangmanch Productions (second-unit DOP, joining **Mon 1 Dec**), a flat deposit, and a train, **Sun 30 Nov**, New Delhi → Mumbai Central | Mail; Paytap |
| Wed 10:15 PM | Voice note 4: *"Agar mujhe kuch hua… sab phone mein hai."* | M |
| **Thu 27, 10:40–11:41 PM** | **He prepares the phone** (E below). The last act: passcode off, 11:41 PM | Settings; every "deleted", "edited", "archived" and "hidden" marker |
| Fri 28 | **He books it at a courier counter** to Meera at her chamber in Saket Courts, with the envelope. Not daring to give his own address or his mother's, he writes **a sender's address he makes up**. It's a real flat: the player's. **(game: O1)** | The parcel's label |
| Fri 28 – Sat 29 | **Two delivery attempts.** Meera is away at a wedding, out of town. *Addressee not available* → **return to origin.** **(game)** | The stamp across the label; Meera: *"Courier wale ka phone aaya tha. Main ek shaadi mein thi."* |
| Sat 29, evening | It's delivered back to the address he made up. **(game)** | — |
| **Sat 29, 11:40 PM** | **You open it.** | — |

---

# D. THE CHAIN — ELEVEN LINKS

The score, and what the endings read. **(game)** Each link is a step in the
causal chain, with its owner (script §17). A link is **traced** when the
player files it in the record with its proof. An untraced link stays in
**Sameer's version**, and the end card shows that version in his words.

| # | Link | Owner | Kind | How it's traced | Sameer's version, if untraced |
|---|---|---|---|---|---|
| 1 | **The reel.** Sameer staged his own reel with a real gun | Sameer | Spine | Q5 | *"Main bas shaadi shoot kar raha tha."* |
| 2 | **Kunal's gun.** Kunal fired first, then handed over his father's loaded revolver | Kunal | Spine | Q5 | — (Sameer wants this one found) |
| 3 | **Two firings.** The celebration shots and the shot that hit Dilip were separate | — | Spine | Q6 | *"Kunal firing kar raha tha. Ek ladka gir gaya."* |
| 4 | **The shot.** Sameer's second discharge hit Dilip | Sameer | Spine | Q7 | *"Goli Kunal ki thi."* |
| 5 | **Alive.** Dilip survived the shot, conscious, for more than two hours | — | Spine | Q8 | — |
| 6 | **Kept there.** Bhasin had him moved to the service room: no 112, no hospital | Bhasin | Spine | Q10 | — |
| 7 | **The car.** Nitin got a car to the service gate, and it left empty | Nitin | Spine | Q9 | — |
| 8 | **The lie.** Sameer told Nitin that Dilip had gone for treatment, knowing he hadn't | Sameer | **Deep** | Q11 | *"Bhasin ne gaadi wapas bhej di."* |
| 9 | **The fire.** The body was burned before dawn, and Sameer took part and filmed it | Bhasin, Sameer | **Deep** | Q12 | *"Maine dekha. Main wahan tha."* |
| 10 | **The price.** His legitimate balance became leverage for silence | The family | **Deep** | QM | *"Unka paisa. Chup rehne ka."* |
| 11 | **The edit.** Sameer arranged the phone so that his part ends before the death | Sameer | **Deep** | Q13 | *"Sab phone mein hai."* |

- **Spine links (1–7) are required.** Every finisher of the full chapter
  traces them. Sameer *wants* 2, 5 and 6 found; 1, 3 and 4 he can't hide,
  only minimise.
- **Deep links (8–11) are optional.** The case file accepts Sameer's version
  for them, without a buzzer, so scores really differ: a first play typically
  lands between 7 and 10, and **11 of 11** is the replay goal.
- **Ending A needs links 8 and 11** in the record (I). Missing either one, or
  leaving the lie out, is Ending B.

---

# E. THE PHONE AS HE PREPARED IT

Script §3 says the phone is *deliberately curated, not a neutral archive, not
a magical evidence box*. This is that curation, done in one hour on Thursday
night. **(game: every item.)** It's also the chapter's second law (PLAYER-
JOURNEY): **every convenience is curation.** The easy paths are Sameer's
version, and the harder routes hold what he left out. Every harder route is a
real iOS or WhatsApp behaviour, so it's checkable, and it teaches something
true about phones.

**What he put in front (the easy path)**
- The **M** chat pinned to the top of WhatsApp: four voice notes, in order,
  each with one grey tick.
- The fire clip in **Favorites**, trimmed to nine seconds.
- **"Banyan — Security"** left untouched: it's his case against Bhasin.
- A note, **"For M"** (Thu 11:20 PM, last edited 11:26):
  *"1. Voice notes — M chat. 2. Favorites — video. 3. Bhasin wala group.
  4. Nitin —"* **The last line stops there.** He began to point at Nitin,
  and didn't.
- Passcode off, 11:41 PM, so M can get in.

**What he minimised or hid (the harder routes)**

| Thu | What he did | What survives it | Real behaviour it rests on |
|---|---|---|---|
| 10:48 PM | Deleted the reel take | **Photos › Recently Deleted**, "28 days" | iOS keeps deleted photos and videos for 30 days |
| 10:52 PM | Deleted the "Doosri… main pose kar raha tha" memo | **Voice Memos › Recently Deleted** | Voice Memos has its own 30-day bin |
| 10:53 PM | **Offloaded Voice Memos (2026-09-25)** | Its icon, with iOS's cloud; tapped, it downloads again, with everything it kept | Offloading an app removes it and keeps its data |
| 11:02 PM | Trimmed the fire clip to its last 0:09 with *Save Video as New Clip*, and favourited the new clip | **Notes › "Agar kuch hua"**, locked with its own password: the whole 0:31, his voice, *"Bhasin sir, yahan?"*, and his hands with a jerrycan, the silver kada from his Instagram selfies on his wrist. **No body, ever.** | Trim can save a new clip and keep the old; a note can be locked with a Notes password of its own |
| 11:06 PM | Deleted Kunal's 12:29 photo from their chat | The copy WhatsApp **auto-saved to Photos** | Deleting a WhatsApp message doesn't delete the saved photo |
| 11:08 PM | **Locked** Dilip's chat ("Chhotu"), which ends on his 1:08 *"aa raha hoon. hospital le jayenge"*, with Hide locked chats on (2026-09-25) | **Search › the secret code "pakki"**: the promise at 7:10 PM, and Dilip alive at 1:07 | WhatsApp's Chat Lock hides a chat until its code is typed into Search |
| 11:10 PM | Deleted his 1:52 message to Nitin "for me", then **locked** Nitin's chat with Dilip's | The locked chats, and Nitin's 1:53 reply to a message that isn't there | "Delete for me" removes nothing from the other phone |
| 11:12 PM | Started to tell M the code in a voice memo, and deleted it (2026-09-25) | **Voice Memos › Recently Deleted**: *New Recording 15* | Voice Memos keeps deleted recordings 30 days |
| Sun 8:52 AM | Screenshotted Bhasin's group before its disappearing messages went (2026-09-25); deleted the one naming him on Thursday, 10:47 PM | **Photos › Screenshots**, and the 12:36 one in Recently Deleted | Disappearing messages vanish from every phone; a screenshot doesn't |
| 11:14 PM | Moved the screenshot of Kunal's frame into the same locked note (2026-09-25) | **"Agar kuch hua"**. The password is **0152**, the minute he told Nitin; the hint, his own: *"When I told N"* | A Notes password is separate from the phone's passcode |
| 11:15 PM | Turned off **Show Hidden Album**, over two screenshots of his EMI notices | **Settings › Apps › Photos › Show Hidden Album**: his shame, not the case | With no passcode, the Hidden album opens once it's shown |
| 11:20 PM | Wrote "For M" | The unfinished "4. Nitin —" | — |

**What he didn't think to curate:** Safari history, whose timestamps he
believed showed a man trying to help (reveal #6), and the security group,
whose integrity is the point of keeping it.

---

# F. THE THREE EPISODES

Every episode is about 20 minutes, has about six sequences and four
questions, and each question sits on a stage of the mystery ladder (script
§7, "L1"–"L10" below). Every question has **two routes and three hints**, as
the engine already enforces. Hints and full dialogue come in S6–S8; key lines
are drafted here. **English sits under every Hinglish line in the game.**

**Pacing (game, decided 2026-09-24, layered 2026-09-25): the phone opens in
layers.** The whole phone is there from minute one, as he left it. What he
pointed M at counts from Episode 1. Anything in plain view that a later
episode needs can be read early, and counts once its episode opens. What
would *give an episode away* has a door a digging player can find in
Episode 1 and can't open until its own episode (PLAYTEST-SHAGUN.md #11):

- **Episode 2's layer waits for the phone to wake.** In Episode 1 the phone
  is in Low Power Mode (Sameer turned it on for the courier) and its day's
  Jio data is used up (the SMS says so). The 12:29 photo and the reel take
  are only thumbnails, the rest in iCloud (Optimise iPhone Storage):
  opening one spins, then *"Unable to Load Video"*. Voice Memos is offloaded,
  and the App Store says it can't be downloaded. Once the phone has died,
  charged and passed midnight, the data renews (a Jio SMS), Photos says
  *"Updated Just Now"*, and Voice Memos downloads when tapped.
- **Episode 3's layer is behind his own lock.** "Agar kuch hua" holds the
  whole fire clip and Kunal's frame, locked with 0152: the minute of the
  lie, which nothing on the phone says before Episode 3 opens on it.
- **Airplane mode** doesn't hold a layer back: it lifts with the episode.
  Airplane mode is one-way on this phone, so a network-true lock would
  strand a player who turned it on in Episode 1.

**Question types.** *Pick* (table the proof, name the answer), *type*,
*timeline* (multi-lane, ordered), and *claims* (proven / not proven). New in
this chapter **(game):** a question can accept **Sameer's version** as a claim,
and a later find can reopen it as **Revisit** (G).

## Episode 1 — *Missed Calls* · ~20 min · Sat 29 Nov, 11:40 PM · his battery 9%

**End belief (canon):** Sameer witnessed a murder and is being hunted. **And
(game):** he is alive, and steering what M reads.

| # | Beat | Where | Interaction |
|---|---|---|---|
| 1 | **The parcel.** On the desk: a padded parcel. Inside: the phone, cracked at one corner, and the **Sehgal wedding shagun envelope** (*"Ishita weds Rohan · Sehgal Parivar · 22.11"*), with the note on its back, addressed to **"M"** and naming Bhasin. The note is a **photograph of his handwriting**, English beneath. | Arrival | Tear, lift, turn the envelope over. **(game: the envelope, O2)** |
| 2 | **It wakes.** No passcode. The lock screen stacks up: **Missed Calls (47)** from an unsaved +91 62… number, *Mummy (6)*, *Bhasin Uncle (2)*. Within seconds the unsaved number **rings in your hand**. | Lock screen, Phone | **Choice:** answer / decline / let it ring (H: *reply to Raju early*) |
| 3 | If answered, Raju: *"Hello? Sameer bhaiya?… Aap kaun ho? Ye Sameer bhaiya ka phone hai na? Dilip kahan hai?"* *(Who are you? Isn't this Sameer's phone? Where's Dilip?)* Pick a reply, or hang up. | Call | Choice |
| 4 | **Q1 — Who is “S”, and where is he going?** *(asked as a man leaving town since 2026-09-26)* SK Films on Instagram (his grid of weddings, selfies with a silver kada), invoice SK-1127 in Mail, the Apple Account in Settings. **Sameer Khurana, wedding photographer.** *L1* | Instagram, Mail, Settings | Cross-app match (onboarding; answerable in 15 seconds) |
| 5 | **His life.** Mummy: *"Beta khana khaya? Rent ka kya socha?"* ZipEMI: *"EMI overdue ₹14,200 — Sony A7 IV"*. Mumbai: an offer letter, a flat deposit, a train **tomorrow**. 1,284 photos of the Sehgal wedding. | WhatsApp, Messages, Mail, Paytap, Photos | Reading (*intrusion; liking him*) |
| 6 | **The boy with the tray.** In the Sehgal album, 9:48 PM: a waiter in a caterer's waistcoat, smiling into the lens. **Just another face.** | Photos | — (planted) |
| 7 | **The poster.** The unsaved number, on WhatsApp: a forwarded **LAPATA** poster, *Dilip Kumar Mahto (Chhotu), 19*, and *"Aap Sameer bhaiya ho na? Dilip aapke saath kaam kar raha tha. Ye phone ab kiske paas hai?"* *(Is this Sameer? Dilip was working with you. Who has this phone now?)* His profile photo is from Chhath, in Samastipur. | WhatsApp | Reading (*dread*) |
| 8 | **Q2 — Dilip is missing. Where was he last seen?** *(a missing person, not a caption, since 2026-09-26)* The waiter from 9:48 PM: zoom into his face, or match *Chhotu* on the poster to Mr Sethi's *"Chhotu Saturday ke baad se nahi aaya"*. **Dilip Kumar Mahto, a catering worker at the Sehgal wedding.** *L3 (first half)* | Photos (zoom), WhatsApp | Face match / name match |
| 9 | **The voice notes.** The pinned **M** chat: four voice notes, each with one grey tick. *"Kunal firing kar raha tha. Ek ladka gir gaya."* … *"Usko hospital nahi le gaye."* … *"Unhone usko jala diya, M. Main wahan tha. Maine dekha."* | WhatsApp › M | Listening (captions) |
| 10 | **The fire.** Favorites: a 0:09 clip, 4:47 AM Sunday. A fire before dawn, smoke drifting across the wedding's fairy lights, a crackle, a man off-camera: *"Jaldi karo."* **No body.** | Photos › Favorites | Watching |
| 11 | **Q3 — What happened at the wedding?** The case file **accepts Sameer's version** as a claim, filed with its sources: *"A worker was shot while Kunal Sehgal was firing; he wasn't treated, and his body was burned."* No verdict, no buzzer. *L2*. **Revisited in Episode 2.** | Case file | Claim (Sameer's version) |
| 12 | **Someone is looking.** A Find My alert: *a sound was played on this iPhone*. Then Mummy: *"Beta, phone ki location kahin aur dikha rahi hai. Tu kahan hai? Bhasin uncle phir aaye the."* *(Your phone's location shows somewhere else. Where are you? Bhasin uncle came again.)* | Lock screen, WhatsApp | **Choice:** tell her a stranger has it / reply as Sameer / nothing (H: *answer Sameer's mother*) |
| 13 | **Q4 — Someone set this phone up for M to read. When, and where does his list stop?** Yes. Settings › Face ID & Passcode: *turned off Thu 11:41 PM*. Notes › **"For M"**, Thu 11:20 PM: a reading order, whose last line stops at *"4. Nitin —"*. *L1 (the complication)* | Settings, Notes | Two routes to one realisation |
| 14 | **Last beat.** An unknown number: *"M? Tu hai?"* … *"Voice notes sun liye? Order mein dekhna. Jo pehle rakha hai woh pehle."* … *"Mere ghar mat jaana. Bhasin wahan aata hai."* *(Did you hear the voice notes? Look in order. What I put first, first. Don't go to my house.)* **2%.** The screen dims. **Plug the phone in to keep it alive.** | WhatsApp; the real charger | The charger gate (re-skinned) |

**Believes:** a frightened photographer saw Kunal Sehgal's gun kill a waiter
and a family burn him, and he is hiding. **Doesn't know:** the chronology
(canon), that there was a reel, or why "Nitin —" stops.

## Episode 2 — *The Second Shot* · ~20 min · title card **"12:32 AM"** · charging

The title card carries **the minute of the shot, a week on**. **(game)**
Sameer's thread is waiting.

| # | Beat | Where | Interaction |
|---|---|---|---|
| 1 | **Sameer.** The phone comes back online on the player's charger, and he sees it: *"Online dikh raha hai. M?"* **(game)** Reply to *"M? Tu hai?"*: *"Main M nahi hoon."* / *"Haan."* / *"Tum kahan ho?"* / nothing. From here he can be messaged, and he steers: *"Bhasin ka group dekh. Sab wahan hai."* (H: *the Sameer route*) | WhatsApp › unknown number | Choice (O1 affects only his reaction) |
| 2 | **The reel.** Photos › WhatsApp: Kunal's 12:29 AM photo, **Sameer holding the revolver**, Dilip beside him with the light. It isn't in their chat any more. Notes › shot list: *"12:15 — KS reel… Dilip — light."* Kunal, Thursday: *"reel mein Papa wali le aaunga."* | Photos, Notes, WhatsApp | Finding (*suspicion*) |
| 3 | **Q5 — What was Sameer doing at 12:15?** Shooting his own reel with Kunal's father's real revolver, which Kunal brought. *(links 1, 2)* *L2 → L4* | Case file | Pick |
| 4 | **Two firings.** Kunal's 11:52 clip (dance floor, two shots up, cheering) against the 12:29 photo and a clip in **Recently Deleted**: the reel take, 12:31, one shot up for the camera, Sameer laughing, 14 seconds, cut off. | WhatsApp, Photos › Recently Deleted | Watching; the timestamps |
| 5 | **Q6 — Was it one firing or two?** A timeline of the lawns: dance floor at 11:52, back lawn at 12:31. **Two**, forty minutes and a lawn apart. **The Episode 1 claim cracks: *Revisit Q3*.** The player strikes *"while Kunal was firing"* by hand. *(link 3)* *L2's complication* | Case file | Timeline, then Revisit |
| 6 | **The memo.** Voice Memos › Recently Deleted, Mon 4:58 PM: *"Pehli camera ke liye thi. Doosri… main pose kar raha tha. Mujhe laga khaali hai."* | Voice Memos | Listening (*cold*) |
| 7 | **Q7 — Who fired the shot that hit Dilip?** **Sameer.** Route 1: the memo plus the reel take (the gun in his hand at 12:31). Route 2: the security group's first line, 12:36, *"Sameer, gun Kunal ko do. Abhi."* (Third, if taken: Kunal, messaged as Sameer, *"Tu khud jaanta hai goli kisne chalayi."*) **The first reveal. It should feel like the answer, and it isn't the end.** *(link 4)* *L4* | Case file | Pick |
| 8 | **Alive.** The Chhotu chat (**archived**, E), 1:07 AM: *"Bhaiya dard ho raha hai. Aap aa rahe ho na?"* Sameer, 1:08: *"aa raha hoon. hospital le jayenge. bas thodi der."* The group, 1:14: *"Sir ladka hosh mein hai."* | WhatsApp | Reading (*the crash*) |
| 9 | **Q8 — Did the shot kill Dilip?** No. He was alive and conscious at 1:07 and at 1:14. **The window.** Safari's 12:44–12:52 hospital searches now mean something else. *(link 5)* *L5* | Case file | Pick; the searches recontextualise |
| 10 | **Raju.** If you reply to him and keep his trust (H), he tells you what Dilip told him: *"Sameer bhaiya usko Mumbai le jaane wale the. Assistant banayenge bole the. Woh unko bhaiya bolta tha."* And about that night: *"Usko bharosa tha. Sameer bhaiya hain na, sab sambhaal lenge."* *(He trusted him. Sameer bhaiya's there, he'll handle it.)* **The promise, and the expectation.** Fallback: the Chhotu chat, Sat 7:10 PM, *"Mumbai wali baat pakki na?"* *L3 (second half)* | WhatsApp | Trust; reply list |
| 11 | **QM — What was the ₹1,80,000?** *Optional* (it doesn't block). Claims to mark **proven / not proven**: *"It was hush money"* (not proven: it matches his own invoice); *"The balance was held until he agreed to stay quiet"* (proven: Bhasin, Sun 9:10); *"The family paid to take Dilip off the records"* (proven: Mr Sethi, Mon 10:12). *(link 10)* **Sameer's version is accepted:** *"unka paisa, chup rehne ka"*. | Paytap, Mail, WhatsApp | Claims |
| 12 | **Bhasin writes.** *"Jiske paas bhi ye phone hai — wapas kar do. Sameer ke liye achha hoga."* *(Whoever has this phone, return it. It'll be better for Sameer.)* It arrives earlier if you told Mummy (H). | WhatsApp | Reading (*danger*) |
| 13 | **Nitin.** Chats › **Archived (1)**. Nitin at 12:58, *"sab bhaag rahe hain"*; at 1:22, **the car**; at 1:40, *"service gate — Mandi Road wala na?"*; the group at 1:59, *"service gate pe ek Swift aayi hai"*; at 2:04, *"Chali gayi sir."* | WhatsApp (Archived), the group | Finding (*hope*) |
| 14 | **Q9 — Did anyone try to get him out?** Yes: **Nitin got a car to the service gate. It left empty at 2:04.** *(link 7)* *L6* | Case file | Pick |
| 15 | **Cliffhanger.** In Nitin's chat, between 1:40 and his 1:53: **nothing**. Then Nitin: *"theek hai bhai. agar le gaye hain toh main Vicky ko wapas bhej deta hoon."* *(OK. If they've taken him, I'll send Vicky back.)* **A reply to a message that isn't there.** Someone told Nitin that Dilip was already on his way. | WhatsApp (Archived) | The episode ends on the gap |

**Built in S7 (game), beyond the table:**
- **Sameer asks what you've seen**, once Q7 is answered (*"Group dekha? Ab samajh aaya Bhasin kya cheez hai?"*). Whatever the player gives him, he reshapes: *"Goli tumne chalayi"* gets *"Mujhe laga khaali hai… Par uske baad jo hua, woh Bhasin ne kiya"*; *"Kunal ne chalayi na?"* gets *"Haan. Uski gun thi"*; an open question gets *"Maine koshish ki thi."* (H: tell Sameer your theory.)
- **Raju writes** once Dilip is known to have been alive. Asking about Dilip earns the promise; telling him *"Kunal Sehgal ne goli chalayi"* sends him to the Sehgals' house (S8 has him withdraw once that's taken back).
- **Q6's board needs Kunal's clip and one back-lawn find** before it proves anything: a board holding one row can't say "two".
- **QM reopens only on a later find.** Filing *hush money* before seeing Bhasin's 9:10 AM message brings QM back on the side once it's seen; a player who filed it with that message in hand chose it, and isn't asked again.
- **The Kunal route** (messaged as Sameer) is written with the other routes in S8.

**Believes (canon):** Sameer fired the shot, but the family controlled what
happened afterwards. **Doesn't know:** what was said at 1:52, or by whom.

## Episode 3 — *The Cancelled Rescue* · ~20 min · title card **"1:52 AM"**

| # | Beat | Where | Interaction |
|---|---|---|---|
| 1 | **Q10 — The missing interval.** A **five-lane timeline**, 12:32 → 4:47 AM: *Dilip · Sameer · Nitin · the car · Bhasin*. Place the group's lines, the Chhotu chat, Nitin's archived messages, the Safari searches, the Recents. Beside the board, **the venue's site plan** (Mail: the planner sent it to Sameer for his shot list) puts the service room forty metres from the service gate on Mandi Road: a minute's carry. **Bhasin's lane** holds the orders: 12:38 *no 112*, 12:52 *doctor*, 1:31 *doctor*, 1:59 *kaun?*. **Contradictions light up**: 1:49 *Sameer is with Dilip*, 1:53 *"agar le gaye hain"*, 1:56 *Sameer searches for an ambulance.* *(link 6; reconfirms 5 and 7)* *L6–L7* | Case file (the board) | Multi-lane, ordered timeline |
| 2 | **Nitin.** Message him (he thinks you're Sameer, until you say otherwise). **Protect him**, and he sends two screenshots, the 1:52 message and **Vicky's live location** from 1:38 to 2:06 (the car's own movement: in, a six-minute stop at the service gate, out), and says: *"Maine check bhi nahi kiya. Bas maan gaya."* *(I didn't even check. I just believed it.)* **Expose him**, or have confronted Kunal first, and he goes silent (H). | WhatsApp | Trust; reply list |
| 3 | **Q11 — Why did the car leave empty?** **Sameer's version is accepted:** *"Bhasin's people turned it away"* (the group, 1:59–2:04). **The traced answer:** *Sameer told Nitin at 1:52 that Dilip had gone for treatment, and he knew it was false.* Route 1: Nitin's screenshot. Route 2, on this phone: 1:49 (he's in the service room), 1:53 (the reply to a missing message), 1:56 (still searching for an ambulance). *(link 8)* *L7* | Case file | Pick (two answers accepted, H) |
| 4 | **The fire, again.** Notes › **"Agar kuch hua"**, locked since Episode 1, opens with **0152**, the minute of the lie (its hint: *"When I told N"*). Thirty-one seconds: Sameer's voice, *"Bhasin sir, yahan?"*, his hands, the kada, a jerrycan. **No body.** (Until 2026-09-25: Edit › Revert.) | Notes | A password, known only now |
| 5 | **Q12 — Why did Sameer film the fire?** **Sameer's version is accepted:** *"to have proof against them"* (voice note 3, Favorites, "For M"). **The traced answer:** *he took part, and kept the footage as counter-evidence.* Route 1: the whole clip, in the note. Route 2: Kunal, if messaged, *"Aur aag? Lakdi tu khud dhoke laaya tha."* *(link 9)* *L8* | Case file | Pick |
| 6 | **Their evidence.** The same note holds one screenshot: Kunal's frame of the second discharge, and *"Humare paas bhi hai. Soch samajh ke."* (Second route: exposing Nitin, or accusing Kunal, makes Kunal send it again, H.) | Notes | Finding (*understanding*) |
| 7 | **Q13 — Why did he send this phone?** **Sameer's version is accepted:** *"to confess and get help"* (voice note 4, the envelope's *"Sab isme hai"*). **The traced answer:** *they can prove he fired, so he sent a counter-file: what they did after the shot, with his lie left out.* It needs their evidence (beat 6) and at least two of his edits traced (E). *(link 11)* *L8–L9* | Case file | Pick |
| 8 | **Sameer, one last time.** **Give him the rescuer:** *"Tumne bachane ki koshish ki thi."* He takes it gratefully and keeps talking. **Or confront him with the full chain** (only with links 4, 5, 7 and 8 traced): *"1:49 pe tum uske paas the. 1:52 pe tumne Nitin ko bola Dilip chala gaya."* Typing… for a long time. Then: ***"Maine usko bola Dilip nikal gaya hai. Mujhe pata tha woh nahi nikla tha."*** *(I told him Dilip had already left. I knew he hadn't.)* **He never writes again.** *L10* | WhatsApp | The chapter's last choice before the record |
| 9 | **The record.** Your phone. **(I.)** | Your phone | The ending |

**Built in S8 (game), beyond the table:**
- **Nitin** can also be **pressed** (*"Tumne gaadi wapas kyun bheji?"*), and he shuts the door: *"Mujhe is sab mein mat daal."*
- **Kunal**, once Q7 is answered, can be asked for the truth or handed Nitin's name. Either way he names Nitin to Bhasin (*"Bhai tune Kunal ko mera naam de diya?"*), and Nitin's route closes. Exposing Nitin is also the second route to the frame.
- **Raju**, told it was Kunal, goes to the Sehgals' and hears otherwise: *"Aapne jhooth bola. Aap log sab ek jaise ho."*
- **The board's three odd rows** (1:49, 1:53, 1:56) light when it's filed, unexplained.
- **Airplane mode**, from Episode 2 on, silences Raju, Nitin, Kunal, Bhasin and Sameer, and nothing can be sent. Every link keeps its route on the phone.

**Believes (canon):** Sameer and the family are both responsible, but not in
the same way. **The key reveal (canon):** the deepest lie on this phone isn't
a made-up event. It's a true sequence, arranged so his responsibility seems
to end earlier than it does.

---

# G. HOW QUESTIONS WORK HERE **(game)**

- **One question at a time**, with free *where to look* and three hints, and
  the idle nudge after 45 seconds, as in every Found chapter.
- **The case file is the record.** Every answer is filed as a **claim** with
  its sources beside it (script §12: observation, then inference). The
  player sees their theory as a document they're writing.
- **Sameer's version is a real answer.** Where the evidence Sameer left
  supports his framing (Q3, Q11, Q12, Q13, QM), the file accepts it: filed,
  sourced, and never called wrong. **Fair play (law 3) is what makes this
  honest:** the contradicting evidence is always on a screen the player can
  reach.
- **Revisit.** When a later find contradicts a filed claim, the claim cracks
  and the question comes back. The player strikes the old line by hand and
  files the new one (script §12: contradiction). **Q3 must be revisited** to
  go on (spine). Q11–13 and QM reopen only if the player finds the evidence
  later, and they may never.
- **Hints lead to the traced answer.** A player who asks for help gets the
  truth. A player who's sure of themselves may file Sameer's version without
  ever asking. The score measures that confidence.

---

# H. ROUTES AND CHOICES

Script §13 (branches) and §14 (decisions), made playable. **Every fact a
closed route could give has a second source**, and a test holds the chapter
to it (ROADMAP S12).

| Decision (canon) | When and how **(game)** | Immediate | Later | If it closes something, the fallback |
|---|---|---|---|---|
| **Answer Sameer's mother** | Ep 1 beat 12: tell her a stranger has it / reply as Sameer / nothing | She learns an unknown person has the phone, or thinks her son answered | *Stranger:* she tells Bhasin, and his message (Ep 2 beat 12) comes early and knows you're not Sameer. *As Sameer:* Bhasin writes to "Sameer": *"Ghar aa jao. Baat karte hain."* *Nothing:* Find My keeps sounding | Nothing closes; the pressure changes shape |
| **Reply to Raju early** | Ep 1 beats 2–3 (the call), or replying before Q2 | Raju is in the story before you understand Dilip | If you tell him something you later have to take back (*"Kunal ne maara"*), he withdraws: *"Aap log sab ek jaise ho."* | The promise: the Chhotu chat, Sat 7:10 PM |
| **Protect Nitin** | Ep 3 beat 2 | He trusts you and sends the 1:52 screenshot | Kunal's frame arrives more slowly (the locked note only) | — |
| **Expose Nitin** | Forward his messages to Kunal, or name him to Bhasin | Kunal and Bhasin move fast: Kunal sends the frame, *"Tera Nitin bhi andar hai"* | Nitin goes silent | The lie: route 2 on this phone (1:49 / 1:53 / 1:56) |
| **Confront Kunal** | Message Kunal as Sameer (Ep 2 or 3) | The firing order, his *"maine sirf gun di thi"*, the family's story: *"Papa ne bola hai Bhasin uncle sambhalenge. Tu bas Mumbai ja."* | He names Nitin to Bhasin, and **the Nitin route closes** | The lie: route 2 |
| **Publish early theory** | Your phone's **draft post**, from the end of Q3 on, until the end | Public pressure, now | **Before link 3: Ending C.** After: the chapter ends there, with the post as your record (I) | — |
| **Preserve evidence first** | Reach **Meera** from your phone (O1 decides how) and do what she says: *"Us phone ko airplane mode pe daalo. Kuch delete mat karo. Kisi ko reply mat karo."* | Control Centre: airplane mode, by your hand. **Raju, Nitin, Kunal and Sameer go quiet.** | She reads his habits for you: *"Sameer jo nahi dekhna chahta, archive karta hai. Ya hide."* The record is stronger in A and B | Every link keeps its on-phone route. Her bias shows first (*"Sameer darpok hai, par jhooth nahi bolta"*), and she takes it back if the lie is traced |
| **Give Sameer the rescuer narrative** | Ep 3 beat 8 | He cooperates and talks | His *"Maine koshish ki thi"* joins the record as a source for his version | — |
| **Confront Sameer with the full chain** | Ep 3 beat 8, with links 4, 5, 7 and 8 | The line | He never writes again | — |
| **The work-record route** (script §13) | Any time: the shot list, invoice SK-1127, the planner's site plan, Paytap, the Mumbai offer | Nobody is contacted, so nothing closes | Establishes the arrangement (link 1), the payment timing (link 10) and his professional motive. Slower and colder: no one talks to you | — |
| **Tell Sameer your theory** (script §13 cost) | Any time you message him | He agrees with whatever you give him, and adds to it | **His words become sources for his own version:** his agreement can be filed with Q11–Q13's Sameer answers | Ask open questions instead (*"1:52 pe tum kahan the?"*): he's evasive but learns nothing |

---

# I. THE ENDINGS

Three principal endings and one early exit (script §15), decided by **what
the player traced and what they did with it**. Each is an act, done by hand,
on **your phone** or with the parcel. **(game: the acts and variables.)**
Following the script's realism audit, **no ending declares a verdict**:
formal legal outcomes stay outside the game.

**The final act, the record.** On your phone, the record lists your claims,
link by link, each with its sources. Traced links can be ticked in or out.
An untraced link can go in as what it is (*"Sameer says…"*) or **as fact**.
Filing his version as fact is what the script means by *claiming more than
the evidence can support*. Then
**send it** (to Meera, with the phone) or **post it** (the draft).

| Ending | How it's reached |
|---|---|
| **A — The Complete Record** | Links **8 and 11 traced and left in**, and **no untraced link filed as fact**; sent or posted |
| **B — Sameer's Version** | Everything else that reaches the record: the lie untraced, or traced and **ticked out** (script: *"never establishes or chooses to disclose"*), or Sameer's version of any link filed as fact |
| **C — The Wrong Story** | The draft posted **before link 3** (two firings) |
| **Early exit — Return to Sender** | Reseal the parcel and give it back to the courier as **not the sender**, available from minute one |

**Built in S9 (game):**
- **How Meera is reached:** her name is on the parcel's label from minute one. Her number is on his phone: WhatsApp's contact info on the pinned M chat, with her About line, *"Meera Arora · Advocate, Saket Courts"*. The player writes to her from their own phone, and she explains why she never took it: *"Courier wale ka phone aaya tha. Main ek shaadi mein thi, shehar se bahar."*
- **The record's defaults:** traced links in; a version the player filed, in as fact, in their own words; anything else out. The draft post is the record as posted.
- **Return to Sender** hands it back to the courier as *"not the sender"*. It goes to a shelf of parcels nobody will claim.
- **Your phone, rebuilt (2026-10-01):** two apps. **Messages**: Meera, and the courier's SMS (*"Not yours? Book a return pickup."*), which is how Return to Sender is reached, from minute one and again in Episode 3. **Pulse**: the night in public, the Kunal rumour first and loudest (the *publish early theory* row, made visible), with the draft post on top. The record opens from posting it or attaching it in Meera's chat. The phone's own notifications are few and only its own.

**Variables:** `LINKS` (count), `LIE`, `FIRE`, `PRICE`, `EDIT`, `PUBLIC`
(posted rather than sent), `NITIN` (protected / exposed / never),
`RAJU` (trust kept / lost / never), `MEERA` (preserved), `SAMEER` (confronted
/ rescuer / never), `MUMMY` (stranger / as Sameer / nothing).

## A — The Complete Record
The account separates **Kunal's enabling conduct, Sameer's shot and his lie,
Bhasin's control, Nitin's complicity and failure to verify, and the
disposal** (canon). It resolves without pretending one person explains it.
- *Draft beats:* Meera, reading it: *"Ye complete hai. Isliye kisi ko pasand
  nahi aayega."* *(It's complete. That's why nobody will like it.)*
- **It costs.** Nitin's name is in it, the one person who tried
  (*if NITIN protected, he writes: "Theek hai. Sach hai."*). Sameer stops
  existing on WhatsApp. If `PUBLIC`, the family's lawyers answer within the
  hour, and the record holds, because every line has its source.
- *If RAJU:* Raju's last message is a photo of Dilip at Chhath, and nothing
  else.

## B — Sameer's Version
Largely factual, and it keeps his boundary: ***"I caused the accident; they
caused the death."*** (canon) The player invented nothing. They gave
authority to an incomplete reading.
- *Draft beats:* Sameer, if he's still writing: *"Thank you. Tune wahi
  dekha jo hua tha."* *(Thank you. You saw what happened.)* The record
  names Bhasin for the car. **Nitin is never asked anything.**
- *If the lie was traced and ticked out:* the end card says so, flatly: *You
  knew about 1:52. You left it out.* No other comment. (Law: the game never
  scolds.)

## C — The Wrong Story
The player named Kunal from the 11:52 clip and Sameer's framing, and acted
publicly before separating the two firings (canon).
- *Draft beats:* the post climbs. Then the family releases **the frame**,
  Sameer with the gun and Dilip behind the light, with a statement: *the
  photographer fired; our son was forty metres away.* The story collapses
  (canon). **A correction can't erase the accusation** (script §14): the
  first post still has more shares than the correction ever will.
- Raju, *if RAJU:* *"Aapne toh bola tha Kunal ne…"* *(You told me it was
  Kunal…)*

## Early exit — Return to Sender
The player decides the phone isn't theirs to carry and hands it back through
the proper channel (canon): **the courier, as not the sender (game: O1)**. It
goes to the hub, onto a shelf of parcels nobody will claim. The Delhi story stays
partly unresolved for them (canon). Lines vary with what they'd already seen:
*if they'd heard the voice notes*, the last image is the M chat's grey ticks.

---

# J. THE END CARD AND THE SHARE

1. **The chain.** Eleven rows, one at a time. **Traced** rows are in the
   player's words from the record. **Untraced** rows are Sameer's version,
   in quotes: *"Bhasin ne gaadi wapas bhej di."* Then the count: **"You
   traced 9 of 11 links."**
2. **What only this ending showed.** One line (for example, A: *what Nitin
   said when he saw his name*; B: *what Sameer said when he said thank you*;
   C: *the frame*).
3. **The replay image, identical for everyone.** The note **"For M"**, the
   cursor blinking after *"4. Nitin —"*. One line: ***"He started to tell
   you."*** Then **Play again**.
4. **Pass it on.** Share text: *"I traced 9 of 11 links."* Preset message
   (draft): *"A photographer's phone. A wedding. Where does it end?"*
5. **Keep your case number**, then back to the desk.
6. **Outside the fiction, one quiet screen** (L).

**The sentence players tell each other (F5 in the old chapter's terms):**
> *"Read the last line of the note he left for M."*

---

# K. WHY IT'S REPLAYABLE

**K1. Minute one holds clues nobody can read yet** (from script §11).

| On screen early | Why nobody sees it | What it means on a second play |
|---|---|---|
| The phone opens with no passcode | It's convenient | He prepared it (11:41 PM Thursday) |
| One grey tick on every voice note | Voice notes are voice notes | M blocked him. That's why he sent the phone and didn't just talk |
| *"Kunal firing kar raha tha. Ek ladka gir gaya."* | One sentence | Two sentences, two moments, forty minutes apart |
| The boy smiling over the tray | A waiter | A portrait, taken for someone he'd promised Mumbai to |
| The fire clip starts mid-movement | It's shaky night footage | It was trimmed, and the rest locked away |
| **"4. Nitin —"** | An unfinished list | The whole chapter |
| *"Archived (1)"* at the top of Chats | Everyone archives | The chat he couldn't delete |
| *"Bhasin uncle phir aaye the"* | A mother fussing | The family's man is at his mother's door |
| The hospital searches | A man trying to help | 1:56: help had already "come" |
| The title cards, *12:32 AM* and *1:52 AM* | Times | The shot, and the lie |

**K2. The chain makes a second play a different game.** "11 of 11" means
tracing all four deep links without taking Sameer's version once. First plays
rarely manage it, because a first play is exactly the reader Sameer was
counting on.

**K3. The routes differ.** Protecting Nitin, confronting Kunal, trusting Raju
and preserving with Meera each show a scene the others don't, and some close
each other (H). No single play hears every voice.

---

# L. RESPONSIBILITY

- **Content note** (on the parcel label): *Contains: death, gun violence, a
  body burned (not shown). 16+.* Beside it, the promise: *This game never
  asks for anything real.*
- **Nothing graphic, ever.** The shot happens off every screen. The fire is
  light, smoke and sound. The service room is only words.
- **Fictional names** for everything in the crime (B). Real platforms
  (WhatsApp, Instagram, iOS) are drawn by us, as before.
- **No real-world notification** imitates police, a bank or a messaging app.
- **Outside the fiction, the end card's last screen** (each fact checked
  against the text of the law before S9 writes the copy):
  - Celebratory firing is a crime in India: the Arms Act, as amended in 2019,
    s.25(9).
  - **Any hospital must give emergency care to an injured person first; a
    police case can't delay it** (Supreme Court, *Parmanand Katara v. Union
    of India*, 1989). Dilip stayed on that property partly because of the
    belief that it can.
  - Emergency: **112**. Mental health: **Tele-MANAS 14416**.

---

# M. OPEN DECISIONS

| # | Decision | What it touches | Status |
|---|---|---|---|
| **O1** | **Why the phone reaches the player** (the note is to M) | Sameer's reaction to *"Main M nahi hoon"*; Return to Sender's destination; how the player first reaches Meera; how *"he wanted an independent investigator"* lands | **Decided 2026-09-24: returned to origin.** He couriered it to Meera at Saket Courts with a made-up sender's address, which turned out to be the player's. She was away at a wedding, so it came back to "the sender". Nobody chose the player. **The four beats:** (1) *"Kaun hai? …Parcel wapas aa gaya? Usne liya hi nahi. Woh bhejne wala address maine aise hi likh diya tha."*; (2) Return to Sender is the courier, as *not the sender* (the legitimate channel, per the script); (3) Meera's name is on the label and her number on his phone, which is the credible route; (4) the reveal lands as irony: he prepared it for someone who knew him, and it reached no one he'd chosen. Also considered: the new tenant (*Script Draft*), Meera's intake (*Complete Narrative Design*, *Second Writers' Room*), Meera recusing herself, a wrong wing, left in an auto, the rider, a stranger chosen on purpose. |
| O2 | The shagun envelope as the note's paper | Arrival; the replay list; the title made physical | Proposed (game); no story fact depends on it |
| O3 | Where Sameer is while he writes | His messages (*"Main Delhi mein nahi hoon"*?), the Mumbai hook | Open; not needed before the dialogue pass |
| O4 | Age rating (16+ kept from the last chapter) | The label | Revisit once the fire clip's audio exists |
| O5 | The First Minute for this chapter | Growth (ROADMAP S10) | To design; the lesson is the end card's |

---

# N. CANON TRACE (appendix)

Every item in the script, and where the game delivers it.

## N1. Objective truth (script §5)

| Canon | In the game |
|---|---|
| Hired to shoot a wealthy Delhi wedding, farmhouse near Chhattarpur | C2; Ep 1 beats 4–5 |
| Kunal has his father's licensed revolver and is already firing | C2 11:52; Ep 2 beat 4 |
| Sameer is making his own cinematic reel | C1 shot list; Ep 2 beats 2–3 (link 1) |
| Dilip, helping Sameer's crew, asked to assist | C1 7:10 PM; the shot list; the 12:29 photo |
| Kunal hands over the loaded revolver; Sameer fires once for camera; the second discharge while posing, lower | C2 12:29–12:32; Ep 2 beats 2–7 |
| The bullet hits Dilip; he's alive | C2 12:32:05; Ep 2 beats 8–9 (link 5) |
| Bhasin contains it; no uncontrolled police or medical response | C3 12:36–12:52; Ep 3 beat 1 (link 6) |
| Dilip moved to a service area | C3 12:38 |
| Sameer frightened, tries to help, knows a proper response exposes him | C3 searches 12:44–12:52, 1:56; 1:08 reply |
| Nitin independently arranges a vehicle | C3 1:22–1:40; Ep 2 beat 13 (link 7) |
| Sameer tells Nitin Dilip has already gone, knowing it's false | C3 1:52; Ep 3 beats 1–3 (link 8) |
| Nitin abandons; the vehicle arrives and leaves without Dilip | C3 1:53–2:04; Ep 2 beats 13–15 |
| Dilip dies on the property | C3 2:41–3:30 (no stated minute) |
| A body that contradicts every attempt to erase the night | C3 3:31 call; the fire |
| Bhasin organises the burning before dawn; Sameer takes part and records part | C3 4:20–5:05; Ep 1 beat 10; Ep 3 beats 4–5 (link 9) |
| The family's legitimate payment becomes leverage | C4 Sun 9:10, 11:04; QM (link 10) |
| Sameer later finds evidence that he fired | C4 Mon 3:10 PM (Kunal's frame) |
| He also holds evidence that the family obstructed, and that an intervention was abandoned | The security group; Nitin's archived chat |
| He prepares the phone: keeps the family's wrongdoing, leaves out his false assurance | E, all of it |
| He sends it for an independent reconstruction, still wanting "my accident / their crime" | Q13 (link 11); B's thank-you |

## N2. The mystery ladder (script §7)

| Stage | Question on the ladder | Where |
|---|---|---|
| 1 | Who owns this phone? → prepared | Q1; Q4 |
| 2 | What happened at the wedding? → compressed moments | Q3 (Sameer's version); Q6 (Revisit) |
| 3 | Who is Dilip? → knew him, owed him a promise | Q2; Ep 2 beat 10 |
| 4 | Who fired the gun? → Sameer, the later shot | Q5; Q7 |
| 5 | Did the shot kill Dilip? → alive, a long window | Q8 |
| 6 | Was anyone trying to save him? → Nitin | Q9 |
| 7 | Why did that attempt fail? → Sameer's false assurance | Q10; Q11 |
| 8 | Why did Sameer keep evidence? → also to build his boundary | Q12 |
| 9 | Why did he send the phone? → a counter-file, still framing | Q13 |
| 10 | What is the real truth? → a chain of choices | The record; the end card |

## N3. Revelation map (script §11)

| # | Discovery | First read (where) | Final meaning (where) |
|---|---|---|---|
| 1 | Dilip's portrait | Ep 1 beat 6 | Ep 2 beat 10 (the promise) |
| 2 | Sameer's wedding images | Ep 1 beat 5 | Ep 2 beats 2–3 (the reel) |
| 3 | Kunal firing | Ep 1 voice notes | Q6 (a separate, earlier firing) |
| 4 | Sameer with the gun | Ep 2 beat 2 | Q7 (the source of the injury) |
| 5 | Dilip still responsive | Ep 2 beat 8 | Q8 (the decision window) |
| 6 | Hospital searches | Q8 (trying to help) | Q10–Q11 (1:56: not proof that help happened) |
| 7 | The vehicle | Ep 2 beat 13 | Q9 (a genuine attempt) |
| 8 | Sameer's reassurance to Nitin | Ep 2 beat 15 (a gap) | Q11 (a knowing lie) |
| 9 | The burning video | Ep 1 beat 10 | Q12 (his participation) |
| 10 | Payment records | Paytap, Ep 1 | QM (legitimate money turned leverage) |
| 11 | Phone preparation | Q4 | Q13 (a curated counter-file) |
| 12 | Phone sent away | The note | Q13; Ep 3 beat 8 (a preferred conclusion inside it) |

## N4. Endings (script §15), final reveal (§16), thought sequence (§20)

- **A, B, C, Return to Sender:** I, one for one.
- **The two-step reveal:** step one is Q7 (Episode 2, deliberately not last);
  step two is Q11 and Q13, and the line itself is Ep 3 beat 8.
- **§20's ten thoughts** map to Q1, Q3, Q2 and the poster, the voice notes,
  Q7, Q8, Q9, Q11, Q13 and the end card, in that order.
- **§21's sequel hook** (Meera, another handset, Mumbai): the last message
  after A and B, from Meera: *"Mumbai mein ek aur phone hai."* It promises a
  new mystery and doesn't tease this one.

## N5. The realism audit (script §18)

| Risk | How the game answers it |
|---|---|
| Why does Sameer keep, then send, the phone? | Kunal's frame (Mon 3:10 PM): they can prove the shot, so his phone is the counter-file (Q13) |
| Why not call the police? | Bhasin's 12:38 order, Sameer's fear and self-interest (the searches), Nitin's car. Emergency help exists in the world; people chose around it |
| Why would Nitin believe Sameer? | Sameer is his boss; *"Bhasin sir ki gaadi mein"* is plausible that night; the car's own movement corroborates it (Vicky's location, the guards' 1:59 and 2:04) |
| Why does Dilip stay on the property? | Injured, dependent, and trusting Sameer: 1:07 *"Aap aa rahe ho na?"* / 1:08 *"aa raha hoon"* |
| Why burn the body? | Treated as destructive and imperfect; the game never claims the fire erased anything |
| Why doesn't the family destroy every record? | Different devices: Kunal's phone, Nitin's phone, the guards' group, Sameer's phone. The fight is over which version is believed |
| Why is the player investigating? | The parcel came back to them, and the phone rings in their hand (O1: returned to origin). Once they reach Meera, it becomes a bounded task. And the evidence contradicts itself: the record is the player's own |
| Too many coincidences | Every event has a prior cause: the shot list, the promise, Kunal's message, the invoice, Vicky, the Thursday curation |
| The drone as omniscient proof | There is no drone. The shot is proven from imperfect sources: a photo, a cut-off take, a memo, a group message, and the family's frame |
| Too much legal certainty | No ending declares a verdict. The record is a factual reconstruction, with its uncertainty (no stated time of death) |
