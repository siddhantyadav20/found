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
app/                     the one route (/), share card, /api/found (the funnel)
components/found/
  FoundPhone/            the room, the device, lock screen, home, gestures, end cards
  apps/                  Messages, Photos, Notes, Maps, Calculator, Guardian, …
content/found/           the script: episodes as typed data, no CMS
  story.ts               episodes layered as Parts, gated on the episode flag
lib/found/               engine (plays the script), progress (localStorage save),
                         voice (the cast), buzz/memoSound, events + store (funnel)
lib/                     shared helpers carried from the portfolio: sound, sfx,
                         mail (Resend), upstash (Redis), visitorId, origin
public/found/            CC0 photographs, wallpaper, memos
samples-src/             source recordings (git-ignored)
```

## Things worth knowing

- **The save lives in `localStorage` under `sy-found-v1`.** To test Episode 2,
  seed a save stopped at `dead`. Add `?cast=` to force the missing person's
  cast instead of dealing it at random (`components/found/FoundPhone/actions.ts`).
- **`GET /api/found` reads the funnel back.** Open in `next dev`; in production
  it needs `?token=` matching `FOUND_STATS_TOKEN`, and is a 404 without it.
- **`.env.local` is not Vercel.** Every production variable has to be set in
  the Vercel project too, and only reaches the next deploy.
- **Canela is the trial licence** (`app/fonts.ts`), as in the portfolio. Swap
  in licensed files before this goes public.
- **The share card only renders in a build.** `next dev` 500s on
  `opengraph-image`; check it with `npm run build && npm start`.
