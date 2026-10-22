# Shagun — the cinematic trailer

A 53-second vertical trailer (1080×1920, 30 fps, stereo), cut the way the
modern thriller teaser is cut: a watch ticking under everything, words on
black that arrive out of focus, a wedding heard through a wall, one shot and
the ringing after it, braams, a Shepard tone under a montage that keeps
accelerating, a hard cut to silence, and the name.

```bash
python3 marketing/trailer/edit.py              # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills     # one PNG per shot and card
node marketing/trailer/render.mjs              # → out/shagun-trailer.mp4 (≈4 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy. All the sound
is synthesised in `sound.py` except the buzz, which is the game's own.
Neither `out/` nor `footage/` is committed.

## The cut

| | Picture | Sound |
|---|---|---|
| 0:00 | A phone face-down in the dark, light leaking from under it, buzzing | A watch starts ticking |
| 0:03 | **22 NOVEMBER · CHHATTARPUR · NEW DELHI** | |
| 0:05 | Bulbs in the trees, the dance floor, confetti, phones in the air | Dhol and a far-off shehnai, muffled, then in the room |
| 0:10 | A white frame | One shot, its echo off the buildings, then nothing but ringing |
| 0:11 | **ONE SHOT IN THE AIR.** / **ONE BOY NEVER WENT HOME.** | A sub hit |
| 0:16 | Smoke at dawn | Wind |
| 0:19 | **FIVE DAYS LATER** · a parcel by a door, light under it | Three knocks |
| 0:23 | **HIS PHONE ARRIVED AT YOUR DOOR.** · focus pulls onto *47 Missed Calls* | The buzz |
| 0:28 | **EVERYTHING ON IT IS TRUE.** / **NOT EVERYTHING IS IN THE RIGHT ORDER.** | Braam |
| 0:34 | The montage: cuts from 1.1 s down to 0.13 s, flash frames, *11:52 PM · LOCAL THANE MAT LE JAANA · 1:53 AM · LAPATA · 4:47 AM · 4. NITIN —* | Shepard tone, the ticking running away, a dhol hit on every cut |
| 0:42 | Black | Silence |
| 0:43 | *M? Tu hai?* | One soft tone |
| 0:46 | **SHAGUN** · शगुन · A MYSTERY YOU PLAY ON A STRANGER'S PHONE · PLAY FREE · LINK IN BIO | The biggest braam, then one last tick |

Nothing past Episode 1's first theory is shown or said.

## Footage: the shot list

Every shot is a **slot**. Until `footage/<slot>.mp4` exists, the slot plays
a stand-in (a stock still from `public/found/shagun/`, or a shot drawn in
code). Drop a clip in, re-render, and it replaces the stand-in everywhere
the slot is used. The renderer crops to 9:16 and grades it, so any
orientation will do. Only the first 12 seconds of a clip are read.

**The rule for every clip:** no identifiable face. Pexels' licence forbids
showing identifiable people in a bad light, and this is a story about a
death. Silhouettes, hands, backs, crowds out of focus, places and light.

| Slot | What it needs | Pexels search |
|---|---|---|
| `phone_dark` | A phone face-down on a table in the dark, vibrating, screen light leaking | "phone vibrating table dark", "phone notification night" |
| `wedding_lights` | Fairy lights / bulbs strung through trees at night, slow | "fairy lights night", "string lights trees" |
| `dhol` | Dhol drummer's hands or silhouette, Indian wedding baraat | "dhol", "indian wedding drum", "baraat" |
| `crowd` | Dancing crowd at night, phones in the air, backs to camera | "indian wedding dance night", "crowd dancing phones" |
| `dawn_smoke` | Smoke drifting over an empty field or lawn at dawn, grey | "smoke dawn field", "morning fog smoke" |
| `parcel_door` | A cardboard parcel at a front door, low light | "package doorstep", "parcel at door" |
| `phone_hand` | A hand holding a lit phone in the dark, screen out of focus | "hand holding phone dark", "phone screen night" |
| `night_road` | Delhi at night: traffic trails, flyover, headlights | "delhi night traffic", "india highway night" |
| `fire` | Fire before dawn: logs, embers, smoke. **No body, nothing suggestive** | "bonfire night", "embers fire close up" |
| `mehendi_hands` | Hands with mehendi, marigolds, a wedding detail | "mehndi hands", "marigold garland" |
| `rain_glass` | Rain on a car window, city lights bokeh | "rain car window night" |
| `smoke` | Tandoor or wood smoke, sparks | "sparks smoke dark" |
| `hands_phone` | Someone scrolling a phone, hands only | "scrolling phone hands dark" |
| `delhi_fog` | Delhi in winter smog/fog: India Gate, a flyover, streetlights | "delhi fog", "india gate night", "delhi smog" |

Write each clip's Pexels id here when it goes in:

| Slot | Pexels id |
|---|---|
| | |
