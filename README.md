# Found

Mysteries played on a stranger's phone. **Chapter 1 is *Raakh*** (called
*Shagun* until 2026-10-23): a Delhi wedding planner's phone arrives with a
note addressed to someone else, and everything on it is true, but not in the
right order. **Chapter 2 is *Last Local*** (Mumbai). The front page is a
landing page (`components/site/`) with both chapters.

- The story (canon, never edited): `SCRIPT.md`
- The game adaptation: `CHAPTER1.md`
- The experience rules: `PLAYER-JOURNEY.md`
- The build plan, phase by phase: `ROADMAP.md`
- The decisions behind all of it: `PROJECT.md`

**The final cut (2026-10-23):** the cast fixed, faces and voices, Instagram in
place of your phone, a simpler case file, episode recaps (CHAPTER1.md, "The
final cut"). **Where the code was (2026-10-01):** *Shagun* plays whole, three episodes to
four endings, and is live for a friends' playtest at found-game.vercel.app.
The last pass was the review of 2026-10-01 (ROADMAP, "After the review"). The
retired *Don't Cut the Call* is at the git tag `dont-cut-the-call`. Found was
piloted inside the portfolio at `sidbuilds.in/found` and became its own app on
2026-09-15.

## Running it

```bash
npm install
npm run dev          # http://localhost:3001
```

Port 3001, so the portfolio can keep 3000. Nothing needs configuring locally:
the funnel falls back to an in-memory store, and the next-episode signup logs
instead of mailing. `.env.example` lists every variable.

To play on your phone, open `http://<your-mac's-LAN-IP>:3001` on the same Wi-Fi.

## Scripts

| | |
|---|---|
| `npm run dev` | Development server, port 3001 |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` · `typecheck` · `test` | ESLint · `tsc` · Vitest (a solver plays the chapter end to end) |
| `npm run budget` | Size ceilings on JS and `public/`; run after a build |
| `npm run sfx` | Re-cut the buzz from `samples-src/` (`samples.config.mjs`) |
| `npm run audio` | Re-mix the voice memos from `samples-src/` (needs macOS `say` + `afconvert`) |

## Layout

```
app/
  page.tsx               / — the desk: one parcel among unnamed found things
  c/[case]/              /c/<case> — a case, from its arrival
  d/[code]/              /d/<code> — a passed-on case, with a friend's name on it
  r/[number]/            /r/<case number> — brings a case number's cases onto this device
  api/found/             the funnel (POST an event, GET it back) and /choices
  api/drop/[code]/       how far a passed-on case has got
  api/shelf/             POST: a new case number · [number]: GET its saves, POST one
components/
  stage/                 the playthrough: Stage (scenes), Table (the phones), CaseFile (the record),
                         Ringing, Charge, TitleCard, PassItOn, ending/
  owner/                 the found phone's iOS and its apps
  yours/                 the player's own phone
  found/                 Desk, KeepCase, Restore, StoryContext, shareCards
content/
  types.ts               the story schema
  cases.ts · stories.ts  every case, light and in full
  <case>/                a chapter as typed data, no CMS
lib/game/                the engine: flags, evidence, questions and claims, the chain, scenes, endings
lib/found/               saves, drops, shelf, events, result, battery, platform, buzz
tests/                   Vitest: the engine, the chapter's laws, keeping, sharing
```

## Things worth knowing

- **Each case's save lives in `localStorage` under `found:<case>:save`**
  (`found:raakh:save`). Saves
  carry a version, and a save of another version is dropped, not upgraded.
- **Testing a drop in one browser:** the sender's own save would resume on
  their own link, so set it aside first (copy the case's save out,
  remove it, open `/d/<code>`, then put it back). Sealed envelopes are
  remembered under `found:sent`.
- **Case numbers** live under `found:number`, and a case's finishes under
  `found:<case>:solved` (they outlive "Start over"). On the server they're
  `found:shelf:<number>` plus a key per case (`lib/found/shelfStore.ts`), kept
  a year after the last write. Dev switches: `?storage=refused` for the
  private-browsing warning, `?inapp=instagram|facebook` for the in-app guard
  (add `?os=android` for "Open in Chrome").
- **The desk reads the same keys** (plus `found:<case>:battery`) to draw the
  phone as you left it. Dev switches: `?arrived=1` on `/` for "Something else
  arrived", `?away=1` on a case for "While you were away" without waiting
  half an hour.
- **Drops need a store.** `next dev` uses the in-memory stand-in
  (`lib/upstashDev.ts`, emptied on restart). `next start` with no Upstash
  variables can't seal anything, so "Pass it on" falls back to the case's plain
  link, and a drop's preview image says "TO YOU".
- **`GET /api/found?case=<case>` reads a funnel back.** Open in `next dev`;
  in production it needs `&token=` matching `FOUND_STATS_TOKEN`, and is a 404
  without it. "What others did" stays hidden until 50 people have answered.
- **`.env.local` is not Vercel.** Every production variable has to be set in
  the Vercel project too, and only reaches the next deploy.
- **The display face is Newsreader** (OFL, through `next/font/google`), and
  the note's hand is Kalam. The Canela trial files were removed on 2026-10-01;
  they're still in git history.
- **The share card only renders in a build.** `next dev` 500s on
  `opengraph-image`; check it with `npm run build && npm start`.
