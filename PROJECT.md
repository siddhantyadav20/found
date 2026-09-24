# Found — Brief

A mystery-thriller web app in which you play on a stranger's phone. Grounded
thriller with a psychological edge, played in one sitting, made for India.

The product is the shape: **you are handed a stranger's device, and
everything on it is true, but not everything on it is in the right order.**

- Chapter One is *Shagun*. The canon is [SCRIPT.md](SCRIPT.md); the game
  adaptation is [CHAPTER1.md](CHAPTER1.md).
- How it feels, screen by screen: [PLAYER-JOURNEY.md](PLAYER-JOURNEY.md).
- What gets built, in order: [ROADMAP.md](ROADMAP.md).

---

## The pivot (2026-09-22)

Chapter One is now **Shagun**: Sameer Khurana's phone, a Delhi wedding at a
farmhouse in Chhattarpur, a shooting, a cover-up, and four versions of one
night. The script (the Master Narrative Pass) was finalised outside this repo
and arrived as a .docx; `SCRIPT.md` is a word-for-word copy and is never
edited. **The game adapts it; it never changes it.**

It replaces *Don't Cut the Call* (built P0–P12 and playtested, 2026-09-17 to
09-19), which is retired to git history at `1de34a2`, like Low Battery and
The Blue Room before it.

## Decisions made with the pivot (2026-09-22)

- **About 20 minutes an episode**, a 60-minute chapter in one sitting. The
  script suggests 45–70 minutes an episode for prototyping; the game keeps
  every revelation and compresses the sequences.
- **The score is the chain:** eleven links in the night's chain of
  responsibility, and the share line is *"I traced 9 of 11 links."* It
  replaces the exposure ledger ("They had 4 things on me").
- **Sameer's version is a real answer.** The case file accepts his framing
  where his evidence supports it, and reopens it (Revisit) when a later find
  contradicts it. Script §12's claim model, made playable.
- **No live call.** The chapter has no permanent HUD; the owner's voice
  arrives as messages from a new number.
- **The standing temptation is a draft post** on your own phone. Posting
  before the two firings are separated is Ending C.
- **Why the phone reaches the player** (CHAPTER1 O1, decided 2026-09-24):
  it was **returned to origin**. Sameer couriered it to Meera with a made-up
  sender's address, which was the player's. She was away, so it came back.

## Decisions that survive (and have for three chapters)

- **Full chapters, shipped whole.** Each is one city, one object, one story.
- **The found phone belongs to its owner.** Sameer's is an iPhone, drawn in
  current iOS, with a cracked corner. The player's own phone matches the
  player's platform, and the endings happen on it.
- **Replies are picked from a list, never generated.** No LLM ever speaks as
  a character.
- **The case file asks one question at a time**, with a free "where to look",
  three hints and an idle nudge, because the only real player complaint was
  "I didn't know what to do".
- **A real charger gates Episode 2**, now to keep a stranger's phone alive.
- **Never losing a case needs no account:** a 12-character case number, and
  a restore link.
- **In-app browsers get a note, not a wall.**
- **The funnel measures without identifying anyone**, through the allowlist
  in `lib/found/events.ts`.
- **No random cast.** Every person is specific, played by an actor under a
  release. No real person's face, voice or name.
- **Audience 16+, India first, free for now**; a paywall only once there are
  repeat players, and cheap (around ₹50 a case).
- **Local only** until the product is good and has multiple storylines: no
  GitHub remote, no Vercel project, no domain.
- **Responsibility rules, non-negotiable** (PLAYER-JOURNEY Part 3): nothing
  real is ever asked for; no notification imitates police, a bank or a
  messenger; every brand in the crime is fictional; the end card carries the
  real facts (celebratory firing is a crime; any hospital must treat first;
  112; Tele-MANAS 14416).

## Still open

- The shoot: a cast wedding, the reel, the fire clip, the voices (ASSETS.md).
- The First Minute for this chapter (CHAPTER1 O5).
- A domain and a deploy, deliberately deferred.
