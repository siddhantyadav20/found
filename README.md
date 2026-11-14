# Found

Mysteries played on a stranger's phone. **Chapter 1 is *Raakh*** (called
*Shagun* until 2026-10-23): a Delhi wedding planner's phone arrives with a
note addressed to someone else, and everything on it is true, but not in the
right order. **Chapter 2 is *Last Local*** (Mumbai). The front page is a
film-site front (`components/cinema/`) with both chapters.

Planning docs (the script, the chapter specs, the roadmap, playtests, the
motion audit), playtest exports, marketing and the trailer tooling live in
`Misc/`, which is git-ignored: kept on this machine, never deployed. They were
in git until 2026-11-15, so history still has them.

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
| `python3 -I scripts/voices-direct.py --backend elevenlabs samples-src/voices-eleven` | Rebuild Raakh's voices from the cached ElevenLabs lines (`--cached` shows coverage; macOS `afconvert`) |
| `python3 scripts/voice-peaks.py` | Re-read every recording's loudness into `content/raakh/voices.ts` (the `peaks` the waveforms draw; a voice build writes them too) |

## Layout

```
app/
  (site)/                / and the site's pages: chapters, about, contact, legal (components/cinema/)
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
  found/                 KeepCase, Restore, StoryContext, shareCards
  cinema/                the site: nav, chapter pages, the strip and roll, the intro
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
