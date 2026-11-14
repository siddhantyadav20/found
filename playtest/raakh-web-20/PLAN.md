# Raakh: twenty blind players (testing plan)

**2026-11-06.** This is a playtest, not QA. Twenty fresh AI agents each play the live web build of Raakh from the homepage to an ending, knowing nothing about it. The question isn't "does every button work". It's what a new player understands, believes, feels and gets stuck on, and whether the story holds together while they play it.

## What it answers

| # | Question | How we find out |
|---|---|---|
| 1 | **Inconsistencies.** Where does the game contradict itself (times, dates, names, faces, who knows what, what an item shows vs what's said about it)? | Every player logs `[INCONSISTENCY]` with the exact words and where they saw them. Two players (Dev, Ira) are briefed to audit times and photos. |
| 2 | **Plot holes.** What doesn't fit the game's own logic, or is never explained? | `[HOLE]` for questions the game never answers, `[LOGIC]` for rules or motives that don't add up. Each claim is then checked against the content and the canon (RAAKH-V3.md, RAAKH-FIX-LOG.md). |
| 3 | **Difficulty and endings.** How hard is it to play, and to reach each ending? How good are the endings? | `[STUCK]` points, hints used, minutes and commands per episode. Ending reached, rated 1–10, with "was it a real choice?". Six players replay for other endings: Sahil tries for every one. |
| 4 | **Everything else.** Pacing, boredom, onboarding, language, UI, emotion, the reveal, want for Chapter 2. | A turn log with interest 1–10, quit points, and the same exit interview for all twenty. |

## The build

- The live code at `a35254e` (what found-game.vercel.app serves), built with `next build` and run with `next start -p 3002`.
- Each player gets its own headless Chrome tab at phone size (412×860, Android Chrome), a fresh save, and starts on the homepage `/`. Sound is off (the game's own switch) and captions carry every voice.
- Their own phone is on battery at 34%. When the game asks for a charger, they "plug in".
- A small driver (`p <slot> <command>`) reads them only what's on screen and on top, and taps by reference. They can take screenshots and look at them, which is how they see photos.
- They may not read any file in the repo, use another browser, or look at storage. They know only what the screen shows.

## The twenty

Mixed by play style, patience, language, gaming background and temperament. Mode choices (With help / Detective / Real time) are theirs, but the persona leans them.

| Slot | Player | Lens | Replays |
|---|---|---|---|
| 1 | Aarav, 26, Gurgaon analyst | Skimmer, in bed, quits on 90 s of nothing | |
| 2 | Ishita, 24, law student | Sleuth (Her Story, Obra Dinn), Detective mode | |
| 3 | Kabir, 28, Lucknow teacher | Rarely games, plays for the people | |
| 4 | Rhea, 31, Bangalore designer | Weak Hindi, reads the English lines; judges the interface | |
| 5 | Vikram, 47, Jaipur shopkeeper | Hindi first, Android only, lost in iPhone menus | |
| 6 | Zoya, 19, Mumbai student | Mobile gamer, short bursts, hints early | |
| 7 | Arjun, 34, indie game designer | Critic of mechanics and fairness; Detective + Real time | one other ending |
| 8 | Meher, 29, crime-show fan | Predicts twists, wants to be surprised | |
| 9 | Dev, 38, chartered accountant | Audits every time and date in a notebook | one other ending |
| 10 | Tanvi, 27, labour reporter | For Dilip; wants the police, wants justice | |
| 11 | Rohit, 30, Noida sales manager | Pragmatist: takes a way out when offered | the deal |
| 12 | Neha, 25, avoider | Hates confrontation; ignores, hides, may walk away | the way out |
| 13 | Sahil, 33, completionist | Blind first, then every ending it lets him reach | all endings |
| 14 | Kavya, 22, speedrunner | Skims, taps fast, uses every hint | |
| 15 | Farhan, 36, screenwriter | Structure, motive, Hinglish dialogue | |
| 16 | Priya, 41, mother of two | Reads English; plays for Mummy and Dilip's family | |
| 17 | Ankit, 23, contrarian | Lies, denies, deletes, protects himself | one bad-faith route |
| 18 | Ira, 35, photographer | Studies every photo: faces, dates, clothes, light | |
| 19 | Manav, 28, twist-game veteran | Suspects the twist early; judges whether it's fair | |
| 20 | Sana, 32, night-shift doctor | Plays in three sittings, comes back cold; Real time | |

Two waves of ten (the machine can't hold twenty browsers at once): slots 1–10, then 11–20.

## What each player writes

One file each in `results/` (`01-aarav.md` …), written as they go:

1. **Turn log:** minute, where, what they did, interest 1–10, what they're thinking.
2. **What I believe now:** a snapshot at the end of each episode (who S is, what happened to Dilip, who they are).
3. **Tagged findings:** `[INCONSISTENCY]` `[HOLE]` `[LOGIC]` `[STUCK]` `[UI]` `[QUIT-POINT]` `[HARNESS]` (the driver, not the game), each with exact on-screen words.
4. **Ending:** which one, how they chose it, 1–10, earned or not, a real choice or not. Replays where assigned.
5. **Exit interview,** the same nine questions for everyone: the story in three sentences; when they suspected who they were; best, worst and nearly-quit moments; what they wanted to do and couldn't; what's still unexplained; the ending; difficulty; score, recommend, Chapter 2; one change.

## Pass bars (set before the results)

Over the twenty first plays:

| Bar | Pass |
|---|---|
| Reach an ending without stopping for good | 16 of 20 |
| Never needed the third level of help on any question | 14 of 20 |
| Suspected they were Sameer before the reveal | between 3 and 8 (fair, not obvious) |
| Strong reaction at the reveal | 15 of 20 |
| Felt the last choice was a real choice | 12 of 20 |
| Endings reached on first plays | at least 3 different ones |
| Rated the ending 7+ | 14 of 20 |
| Named Dilip unprompted in the exit interview | 15 of 20 |
| Want Chapter 2 | 12 of 20 |
| A real quit point (would not have come back) | 4 of 20 at most |

## How the findings get judged

Every `[INCONSISTENCY]`, `[HOLE]` and `[LOGIC]` claim is checked against `content/raakh/*` and the canon (RAAKH-V3.md, with RAAKH-FIX-LOG.md where they conflict), and marked:

- **Confirmed:** the game really does contradict itself, or never answers it.
- **Misread:** the game is consistent, but a player read it wrong. Still a clarity problem if more than one player did.
- **Driver:** caused by the test setup, not the game. Thrown out.

Findings are then ranked by how many players hit them and how much they cost (a quit, a wrong belief, a dull stretch).

## Caveats

- These are one model wearing twenty personas. They read more, quit less and reason better than real friends will, so treat the scores as a ceiling and the patterns as strong signals.
- They can't hear or watch video. Voices come through captions, clips through captions and stills.
- They're slower than people. Their thinking time passes on the game's real-time timers, so "Stuck?" nudges arrive more often than a person would see them, and minute counts run long. Command counts are the better measure of effort.
- The last two blind runs were of the WhatsApp kit, not this build. This is the first AI run of the web game.
- **Change on 2026-11-07:** players 1–10 began on Opus and hit the usage limit in Episode 1 (about 120 commands each). At Siddhant's call, each of those runs was picked up by a Sonnet player from its own save and log, after a four-hour pause the game itself noticed ("You put it down 4 h ago"). Players 11–20 run on Sonnet from the start.
