# Shagun — the Instagram teaser

`out/shagun-teaser.mp4`: a 34-second Reel, 1080×1920, 30 fps, H.264 + AAC.

It is drawn in HTML (`teaser.html`) from the game's own look and copy, and
rendered frame by frame, so a change of words is a re-render, not a re-edit:

```bash
node marketing/teaser/render.mjs           # the Reel, with sound (≈2½ min)
node marketing/teaser/render.mjs --stills  # one PNG per scene, to check the cut
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy (for `sound.py`).

## The cut

Everything in it is Episode 1, the first theory, which the game wants
believed. Nothing past "M? Tu hai?" is shown or hinted.

| | Beat |
|---|---|
| 0:00 | *This phone isn't yours.* The lock screen: 47 missed calls, Mummy, Bhasin Uncle |
| 0:03 | *And it won't stop ringing.* The call, with the game's own buzz |
| 0:06 | *It was meant for someone else.* Meera Arora's label, stamped RETURN TO ORIGIN |
| 0:09 | The envelope's back, written as you watch: *"M — Sab isme hai…"* |
| 0:13 | *One Delhi wedding.* Four frames of the Sehgal album (stock stand-ins) |
| 0:15 | *And a boy who never went home.* The LAPATA poster, a silhouette for a face |
| 0:18 | The voice note: *"Kunal firing kar raha tha. Ek ladka gir gaya."* One grey tick |
| 0:21 | *Nine seconds of fire. No body.* Sunday, 4:47 AM. *"Jaldi karo."* |
| 0:24 | *He left her a reading order.* "For M", typed out to "4. Nitin —" |
| 0:27 | *"M? Tu hai?"* at 2%, and the screen goes out |
| 0:30 | **Shagun.** *Everything on it is true. Not everything is in the right order.* |

## The rules it keeps (PLAYER-JOURNEY Part 3, ASSETS.md)

- No real person's face: the poster's photo is a silhouette, and the
  wedding frames are the Pexels stand-ins already in `public/found/shagun/`
  (free for commercial use, no faces of characters).
- No gore: the fire is `fire.jpg`, logs and smoke.
- No app's chrome or sounds imitated: the chat and the message tick are generic.
- Fonts are OFL (Fraunces, Kalam, Hind, from Google Fonts) and Inter, not the
  trial Canela, so the Reel can be posted.
- The content note rides on the end card: *16+ · it never asks for anything real.*

## Caption

> Someone else's phone arrived at your door.
> 47 missed calls. A note for someone called M. A Delhi wedding, and a boy
> who never went home.
>
> Everything on it is true. Not everything is in the right order.
>
> **Shagun** — Chapter One of Found, a mystery you play on a stranger's
> phone. Free, in your browser, one sitting. Link in bio.
>
> 16+ · death and gun violence (nothing graphic shown)
>
> #Found #Shagun #MysteryGame #DelhiNoir #ThrillerGame #WhodunnitIndia
> #IndieGame #DetectiveGame #PlayInBrowser

`out/shagun-cover.jpg` is the title frame, for the Reel's cover.
