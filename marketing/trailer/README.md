# Shagun — the cinematic trailer

A 52-second vertical trailer (1080×1920, 30 fps, stereo, −14 LUFS for
Instagram), cut the way the modern thriller teaser is cut: a watch ticking
under everything, words that arrive out of focus, a wedding heard through a
wall, one shot and the ringing after it, braams on the words, a string
ostinato and a Shepard tone under a montage that keeps accelerating, a hard
cut to silence, then the name over a shehnai.

```bash
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/shagun-trailer.mp4 (≈25 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy. Neither
`out/` nor `footage/` is committed.

## How it's made

- **Picture:** real Pexels footage (see Footage, below), graded in WebGL by
  `POST` in `scenes.js` at 1080×1920: bloom, halation, chromatic aberration,
  teal-and-amber split, vignette, grain, gate weave. The words are HTML over
  it (`trailer.html`).
- **Sound:** `sound.py` synthesises the score and the effects with numpy:
  piano, strings, dhol, toms, braams, a shehnai with meend, rain, crows,
  the gunshot. The only sample is the game's own buzz. Everything low also
  speaks in the midrange, because phone speakers stop at about 200 Hz.

## The cut

| | Picture | Sound |
|---|---|---|
| 0:00 | His phone on a table in the dark, the lock screen lit: *Missed Calls (47)* | A watch starts; one piano note |
| 0:03 | India Gate in the dusk haze, pushing in · *22 NOVEMBER · NEW DELHI* | Far traffic, horns |
| 0:06 | Night lights, out of focus | Dhol and shehnai through a wall |
| 0:08 | Fireworks bursting overhead | In the room: dhol, crowd, a rocket, crackle |
| 0:10 | White | One shot, its echo off the buildings, then ringing |
| 0:11 | *ONE SHOT IN THE AIR.* | Silence |
| 0:13 | Morning: a fog-bound marsh, bare trees · *ONE BOY NEVER WENT HOME.* | A hit, wind, crows, piano E♭ |
| 0:17 | A street at night, an auto-rickshaw passing · *FIVE DAYS LATER* | Traffic, horns; a knock |
| 0:21 | *HIS PHONE ARRIVED AT YOUR DOOR.* | A hit |
| 0:23 | His phone in a hand, *47 Missed Calls* under a thumb | The buzz; a heartbeat |
| 0:26 | Rain on glass, a red light beyond · *EVERYTHING ON IT IS TRUE.* | Rain; the strings begin |
| 0:29 | *NOT EVERYTHING IS IN THE RIGHT ORDER.* | Braam |
| 0:32 | The montage: rain on a windshield, a bonfire, highway trails, embers, India Gate, a street, fireworks, a sparkler, coals… cuts from 1.2 s to 0.14 s, then a held frame of his lock screen · *11:52 PM · LOCAL THANE MAT LE JAANA · 1:53 AM · LAPATA · 4:47 AM · 4. NITIN —* | Ostinato, violins, Shepard tone, a tom and dhol on every cut, the watch running away |
| 0:41 | Black | Silence |
| 0:42 | *M? Tu hai?* | One bell |
| 0:45 | **SHAGUN** · शगुन, over embers · *PLAY FREE · LINK IN BIO* | The biggest braam, a taiko, D minor, the shehnai; one last tick |

Nothing past Episode 1's first theory is shown or said. No faces, no
bodies, nothing graphic.

## Footage

The picture is real footage from Pexels, under the [Pexels licence](https://www.pexels.com/license/)
(free, commercial use allowed, no attribution required). `footage.py` downloads
each clip straight from `videos.pexels.com` by id (no API key needed), cuts it
to 9:16 with a push-in, and keys Sameer's lock screen into the two green-screen
phones. Each clip was checked by eye: no identifiable face, nothing graphic.

```bash
python3 marketing/trailer/footage.py            # all slots → footage/<slot>.mp4 (≈20 min)
python3 marketing/trailer/footage.py rain_glass  # just one
```

| Slot | What it is | Pexels |
|---|---|---|
| `phone_dark` | Green-screen phone on a table, keyed with the lock screen, darkened to night | [4525346](https://www.pexels.com/video/4525346/) |
| `delhi_fog` | India Gate at dusk | [6587044](https://www.pexels.com/video/6587044/) |
| `wedding_lights` | Night lights, out of focus | [854088](https://www.pexels.com/video/854088/) |
| `baraat_fireworks` | Fireworks, vertical | [14875803](https://www.pexels.com/video/14875803/) |
| `dawn_smoke` | A fog-bound marsh and trees | [11514996](https://www.pexels.com/video/11514996/) |
| `night_street` | A street at night, an auto-rickshaw | [4182795](https://www.pexels.com/video/4182795/) |
| `phone_hand` | Green-screen phone in a hand, keyed with the lock screen | [8566854](https://www.pexels.com/video/8566854/) |
| `rain_glass` | Rain on glass, a red light beyond | [12680281](https://www.pexels.com/video/12680281/) |
| `m_rain` | Rain on a windshield at night | [11631455](https://www.pexels.com/video/11631455/) |
| `m_fire` | A bonfire, close | [16753425](https://www.pexels.com/video/16753425/) |
| `m_traffic` | Highway light trails | [11437954](https://www.pexels.com/video/11437954/) |
| `m_embers` | Embers, out of focus | [4389495](https://www.pexels.com/video/4389495/) |
| `m_gate` | India Gate at dusk | [6583820](https://www.pexels.com/video/6583820/) |
| `m_fireworks` | Fireworks over a street | [4832681](https://www.pexels.com/video/4832681/) |
| `m_bokeh` | Night lights, out of focus | [854088](https://www.pexels.com/video/854088/) |
| `m_fire2` | A fire, vertical | [11210464](https://www.pexels.com/video/11210464/) |
| `m_street` | The street at night | [4182795](https://www.pexels.com/video/4182795/) |
| `m_smog` | A city under smog | [5941316](https://www.pexels.com/video/5941316/) |
| `m_sparkler` | A sparkler | [6378175](https://www.pexels.com/video/6378175/) |
| `m_bridge` | Light trails over a bridge | [10194738](https://www.pexels.com/video/10194738/) |
| `m_coals` | Coals | [7571829](https://www.pexels.com/video/7571829/) |
| `m_fire3` | Burning logs | [11203341](https://www.pexels.com/video/11203341/) |
| `title_embers` | Embers, under the title | [12605103](https://www.pexels.com/video/12605103/) |

`m_phone` (1190185) is cut but not in the edit. Pexels files newer uploads
under a second id, so only older clips can be fetched by id alone; the rest
need the site or an API key.

If a slot's clip is missing, the shot falls back to its scene in `scenes.js`,
a GLSL stand-in drawn in code, so the trailer always renders.
