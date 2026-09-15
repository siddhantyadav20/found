# Found

Mysteries played on the missing person's phone. The first case is
**Low Battery** (Episode 1, plus Episode 2 "Read Receipts"): someone is
missing, and their phone has arrived in your post.

Found was piloted inside the portfolio at `sidbuilds.in/found` so interest
could be measured before it became its own app. This repository is that app.
It was carried over as-is on 2026-09-15, from the portfolio's `main` at
`9aa3c0d`. See `PROJECT.md` for the brief and the decisions behind it.

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
| `npm run lint` · `typecheck` · `test` | ESLint · `tsc` · Vitest (walks every episode as a player) |
| `npm run budget` | Size ceilings on JS and `public/`; run after a build |
| `npm run sfx` | Re-cut the buzz from `samples-src/` (`samples.config.mjs`) |
| `npm run audio` | Re-mix the voice memos from `samples-src/` (needs macOS `say` + `afconvert`) |

## Layout

```
app/
  page.tsx               / — the desk: a phone buzzing among found things
  c/[case]/              /c/low-battery — a case, from its cold open
  d/[code]/              /d/<code> — a passed-on phone: an envelope with a friend's name
  api/found/             the funnel (POST an event, GET it back) and /choices
  api/drop/[code]/       how far a passed-on phone has got
components/found/
  Desk/                  the homepage scene (server-rendered, no JS of its own)
  FoundPhone/            the room, the device, lock screen, home, gestures, end cards,
                         PassItOn (seal and send), WhatOthersDid
  apps/                  Messages, Photos, Notes, Maps, Calculator, Guardian, …
  StoryContext.tsx       which case this page plays (useStory / useCase)
content/
  cases.ts               every case, light: names, routes, share lines, teasers
  stories.ts             every case's script, by id
  found/                 Low Battery: episodes as typed data, no CMS
lib/found/               engine (plays the script), progress (one save per case),
                         result (the spoiler-free share), drops + dropStore,
                         events + store (funnel), voice (the cast), buzz/memoSound
lib/                     shared helpers carried from the portfolio: sound, sfx,
                         mail (Resend), upstash (Redis), visitorId, origin
public/found/            CC0 photographs, wallpaper, memos
samples-src/             source recordings (git-ignored)
```

## Things worth knowing

- **Each case's save lives in `localStorage` under `found:<case>:save`**
  (`found:low-battery:save`). Seed one with just the `dead` flag to land on
  Episode 1's end card. Add `?cast=` to force the missing person's cast instead
  of dealing it at random (`components/found/FoundPhone/actions.ts`).
- **Testing a drop in one browser:** the sender's own save would resume on
  their own link, so set it aside first (copy `found:low-battery:save` out,
  remove it, open `/d/<code>`, then put it back). Sealed envelopes are
  remembered under `found:sent`.
- **Drops need a store.** `next dev` uses the in-memory stand-in
  (`lib/upstashDev.ts`, emptied on restart). `next start` with no Upstash
  variables can't seal anything, so "Pass it on" falls back to the case's plain
  link, and a drop's preview image says "TO YOU".
- **`GET /api/found?case=low-battery` reads a funnel back.** Open in `next dev`;
  in production it needs `&token=` matching `FOUND_STATS_TOKEN`, and is a 404
  without it. "What others did" stays hidden until 50 people have answered.
- **`.env.local` is not Vercel.** Every production variable has to be set in
  the Vercel project too, and only reaches the next deploy.
- **Canela is the trial licence** (`app/fonts.ts`), as in the portfolio. Swap
  in licensed files before this goes public.
- **The share card only renders in a build.** `next dev` 500s on
  `opengraph-image`; check it with `npm run build && npm start`.
