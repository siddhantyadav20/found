# Found — Brief

A mystery-thriller web app in which you play on the missing person's phone.
Grounded thriller with a psychological edge. Each case is played in one sitting.

Piloted inside the portfolio (sidbuilds.in/found) to measure interest first;
the funnel it records decides how far the standalone app goes. **Early days:
the direction of this app is not finalised.**

## Decisions already made

These come from the pilot and aren't recoverable from the code alone.

- **Full episodes, not slices.**
- **Cast:** the missing person's gender is dealt at random and never asked.
  The script adapts through cast tokens, and a test forbids a plain pronoun in
  any line that uses one.
- **Replies are picked from a list, never generated.** Characters never talk
  through free text or an LLM (`Reply` / `ReplyOption` in `content/found/types.ts`).
- **Story spine:** "curiosity is part of the crime." Mum's Guardian
  screen-time app records the player's own session, which is read back as the
  missing person's. In Episode 2 the player types "me" to answer who unlocked
  the phone.
- **Photographs:** CC0 only, approved slot by slot before download. No
  identifiable faces, because a real person's face must not play a suspect.
  Puzzle details that no stock photo shows go in a Live Text chip or a story
  overlay.
- **Audio:** CC0 Freesound recordings. The whispers are macOS `say -v Whisper`,
  which has no gender to give away.
- **The funnel measures without identifying anyone.** Events are allowlisted
  (`lib/found/events.ts`) and no identifier is sent.

## Still open

- Episode 2's NightCam fuel-can photo is a placeholder: no CC0 photo fits.
- Episode 3 hasn't been started.
- A domain, and a Vercel project, for this app. Deliberately deferred: Found
  stays local until it's a good product with multiple storylines.
- Whether the portfolio's `/found` redirects here once this app is live.
