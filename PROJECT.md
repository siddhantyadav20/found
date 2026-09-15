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

## Decided 2026-09-15

- **Release:** each case ships whole (every episode at once), and a new case
  ships every week. Cases are built around Indian cities and references.
- **Case two** is a different kind of found object from a phone, so the desk
  never repeats itself.
- **Money:** free. A paywall comes only once there are repeat players, and it
  stays cheap: around ₹50 a case.
- **Audience:** 16 and up, designed for people in India. Anyone can play.
- **Voices:** real voices for everyone except the missing person. The missing
  person stays a whisper, because their gender is dealt at random and a real
  voice would give it away.
- **Community:** no forum or comments yet. Build one once there's evidence a
  community is forming.
- **Photos must read as real photographs** taken on a phone, never as
  generated or stock.
- **Episode 2 starts only once the player's own device is really plugged in,**
  where the browser can tell.
- **The phone matches the player's platform:** iOS for iPhone, Android for
  Android, and iOS everywhere else (laptops and desktops).
  - **iOS** matches current iOS in layout, spacing, glass materials, motion
    and gestures, with app icons matched as closely as possible. They're drawn
    as our own SVG, never copied from Apple's files.
  - **Android** is Google's current Material look (Pixel style), with Google's
    icon set. Only the icons and the styling of elements change.
  - **Both** keep Found's own type: Canela and Outfit.
  - **iOS is built first.** Android follows.
- **Photos:** Siddhant shoots what he can in India. Claude sources openly
  licensed candidates for the rest, each approved before it's downloaded.

## Decided 2026-09-16

- **The plan is in `ROADMAP.md`,** in sessions S1–S17; the photo shot list is
  `PHOTOS.md`.
- **Recently Deleted asks for Face ID,** which fails on a stranger and falls
  back to the passcode. It adds a step before a key clue, on purpose.
- **Never losing a case needs no account.** A case number (12 characters,
  given on request) keeps every case's save on the server for a year after
  the last play, and a restore link brings them back on any device. The number
  is the only key, like a drop's code: nothing ties it to a person.
- **In-app browsers get a note, not a wall.** Inside Instagram or Facebook
  the envelope suggests opening the case in Chrome or Safari, and lets you
  play on anyway.
- **"Start over" asks first,** and a finished episode stays on the desk
  afterwards.

## Still open

- Episode 2's NightCam fuel-can photo is a placeholder: no CC0 photo fits.
- Episode 3 hasn't been started.
- A domain, and a Vercel project, for this app. Deliberately deferred: Found
  stays local until it's a good product with multiple storylines.
- Whether the portfolio's `/found` redirects here once this app is live.
