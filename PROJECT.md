# Found — Brief

A mystery-thriller web app in which you play on a stranger's phone. Grounded
thriller with a psychological edge, played in one sitting, made for India.

The product is the shape: **you are handed a stranger's device, and everything
you open to help them becomes evidence.**

- Chapter One is [CHAPTER1.md](CHAPTER1.md) — *Don't Cut the Call*.
- How it feels, screen by screen: [PLAYER-JOURNEY.md](PLAYER-JOURNEY.md).
- What gets built, in order: [ROADMAP.md](ROADMAP.md).

---

## The pivot (2026-09-17)

Chapter One is now **Don't Cut the Call**: Vasundhara Kulkarni's phone, 31
hours into a digital arrest, in a courier pouch at your door at 1:11 AM. It
replaces *Low Battery* (finished) and *The Blue Room* (half built). Both are
retired to git history; nothing was kept because it existed.

**Why:** the crime is the one happening to Indian families right now, the
twists land on screens the player has already seen, and the endings come out
of the scam's own two commands — *don't cut the call, don't tell anyone*.

## Decisions this pivot reversed

- **The found phone no longer matches the player's platform.** It belongs to
  its owner. **Decided 2026-09-18:** Vasu's is the iPhone her son handed down,
  drawn in current iOS with the look and feel built for the pilot, with the
  text size on Largest. Her surveillance is what an iPhone really carries: a
  configuration profile she was talked into installing, her Apple Account on a
  device she never owned, and the blue recording pill around her clock. The
  player's own phone still matches the player's platform.
- **No random cast.** Every person in the chapter is a specific person with a
  face and a voice, and actors play them under signed releases. The old rule
  against identifiable faces now applies only to *real* people.
- **The share result is not hint squares.** It is the ledger: *"They had 4
  things on me."*
- **The irreversible act is not a location toggle.** It's removing the profile
  that's watching.

## Decisions that survive the pivot

- **Full chapters, shipped whole.** Each is one city, one object, one story.
- **Replies are picked from a list, never generated.** No LLM ever speaks as a
  character.
- **The case file asks one question at a time**, with a free "where to look",
  three hints and an idle nudge, because the only real player complaint was
  "I didn't know what to do".
- **Episode gating on a real charger**, now reframed: plug in to keep the call
  alive.
- **Never losing a case needs no account:** a 12-character case number, and a
  restore link.
- **In-app browsers get a note, not a wall.**
- **The funnel measures without identifying anyone**, through the allowlist in
  `lib/found/events.ts`.
- **Audience 16+, India first, free for now**; a paywall only once there are
  repeat players, and cheap (around ₹50 a case).
- **Local only** until the product is good and has multiple storylines: no
  GitHub remote, no Vercel project, no domain.

## New decisions (2026-09-17)

- **Two phones on stage:** hers and yours. Episode 3 and every ending happen
  on yours.
- **The call never leaves the screen**, and a cue engine keeps the man on it
  alive between lines.
- **The exposure ledger** records what the player hands over, and writes
  Episode 3's accusations, the endings and the end card.
- **The First Minute:** a 60-second standalone of the opening, built to be
  forwarded into family WhatsApp groups.
- **Responsibility rules, non-negotiable** (PLAYER-JOURNEY Part 3): nothing
  real is ever asked for; no notification imitates police, a bank or a
  messenger; every brand involved in the crime is fictional; the end card
  carries 1930, cybercrime.gov.in and Tele-MANAS 14416.

## Still open

- The video shoot, the voices, the handwriting and the Mumbai photographs
  (ROADMAP P11). Everything runs on placeholders until they land.
- Whether Episode 3 can arrive at 10:30 AM the next day, as an opt-in.
- A domain and a deploy, deliberately deferred.
- Whether the portfolio's `/found` redirects here once this is live.
