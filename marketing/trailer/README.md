# Shagun — the cinematic trailer

A 47-second vertical trailer for Indian Reels (1080×1920, 30 fps, stereo,
−14 LUFS), Hindi first. A stranger's phone wakes in the dark; a Delhi
wedding's band baaja plays until one shot cuts it dead; the same tune comes
back slow on a harmonium; a missing boy's poster; his phone at your door;
a dhol-tasha montage that runs away with itself; silence; *M? Tu hai?*;
**शगुन**.

```bash
node marketing/trailer/inserts.mjs                    # the props (poster, note) → footage/stills/
python3 marketing/trailer/footage.py                  # Pexels clips and props → footage/<slot>.mp4 (≈25 min)
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/shagun-trailer.mp4 (≈40 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy and Pillow.
Neither `out/` nor `footage/` is committed.

## How it's made

- **Picture:** real Pexels footage, plus two props drawn in `inserts.html`
  (the LAPATA poster, the note on the envelope's back), graded together in
  WebGL by `POST` in `scenes.js`: bloom, anamorphic streaks, Delhi smog
  haze, chromatic aberration, teal-and-amber split, vignette, grain, gate
  weave, and camera shake on the hits. `footage.py` keys Sameer's lock
  screen into two green-screen phones (the table one wakes on the first
  buzz and lights the wood around it), slows the fireworks from 50 fps, and
  crops everything to 9:16 with a push-in. If a clip is missing, a GLSL
  stand-in from `scenes.js` plays instead.
- **Words:** HTML over the picture (`trailer.html`), Hindi first in Hind,
  English under it, sized for a phone with the sound off and kept clear of
  Reels' caption and buttons. The title is Tiro Devanagari.
- **Sound:** `sound.py` synthesises everything with numpy except the game's
  own buzz. One original tune carries it: band baaja in Khamaj at the
  wedding (two trumpets never quite together, clarinet, tuba, dhol, jhanj),
  then harmonium in Bhairavi over a tanpura after the shot, and its last
  phrase under the name. Also: a watch, the gunshot and its echo, ringing,
  wind, horns, rain, knocks, a heartbeat, strings, a Shepard tone, a
  dhol-tasha that speeds up through the montage, braams. Everything low
  also speaks in the midrange, because phone speakers stop at about 200 Hz.

## The cut

| | Picture | Words | Sound |
|---|---|---|---|
| 0:00 | His phone on a dark table; the screen wakes on a buzz and lights the wood | ये फ़ोन आपका नहीं है। · THIS PHONE ISN'T YOURS. | Buzz, a hit, one piano note, a watch |
| 0:02 | India Gate in smog | 22 नवंबर · नई दिल्ली | Horns; a band somewhere |
| 0:04 | Diyas, mehndi before marigolds, hennaed hands and bangles, a sparkler, fireworks slowing down | | The band baaja, loud |
| 0:09 | White | | One shot. Everything stops. Ringing |
| 0:09 | Black | एक गोली हवा में। · ONE SHOT IN THE AIR. | |
| 0:11 | A tree-lined road in fog | एक लड़का, जो कभी घर नहीं लौटा। · ONE BOY NEVER WENT HOME. | The tune on a harmonium, in Bhairavi; tanpura |
| 0:14 | The LAPATA poster on a wall, torchlit | (the poster's own) | |
| 0:15 | An Indian street at night in the rain | पाँच दिन बाद · FIVE DAYS LATER | Rain, horns; a knock |
| 0:18 | Black | उसका फ़ोन आपके दरवाज़े तक पहुँचा। · HIS PHONE ARRIVED AT YOUR DOOR. | A hit |
| 0:20 | His phone in a hand, pushing in on *47 Missed Calls* | | Buzz; a heartbeat |
| 0:23 | Rain on glass, a red light beyond | इसमें सब सच है। · EVERYTHING ON IT IS TRUE. | Rain; strings drawing breath |
| 0:25 | Black | पर सब कुछ सही क्रम में नहीं है। · NOT EVERYTHING IS IN THE RIGHT ORDER. | Braam |
| 0:28 | Montage: windshield rain, a havan, his note, a night street, the poster, a bonfire, bikers, agarbatti smoke, India Gate, embers, fireworks… cuts from 1.3 s down to 0.16 s | 11:52 PM · 1:53 AM · 4:47 AM | Strings, Shepard tone, dhol-tasha speeding up, the watch running away |
| 0:36 | His lock screen, held | *4. Nitin —* typed, the cursor blinking | Everything stops but one note; keys |
| 0:37 | Black | | Silence |
| 0:38 | | *UNKNOWN NUMBER* · typing… · *M? Tu hai?* | One bell |
| 0:40 | Embers | **शगुन** · SHAGUN · अजनबी का फ़ोन। आपकी तफ़्तीश। · अभी खेलें · FREE · LINK IN BIO | The biggest hit, the tune's last phrase |
| 0:46 | Black | | One more buzz |

Nothing past Episode 1's first theory is shown or said. No faces, no
bodies, nothing graphic.

## Footage

Real footage from Pexels, under the [Pexels licence](https://www.pexels.com/license/)
(free, commercial use allowed, no attribution required), downloaded straight
from `videos.pexels.com` by id. Every clip was checked by eye: no
identifiable face, nothing graphic. Pexels files newer uploads under a second
id, so only older clips can be fetched by id alone.

| Slot | What it is | Pexels |
|---|---|---|
| `phone_dark` | Green-screen phone on a table, keyed with the lock screen, darkened to night | [4525346](https://www.pexels.com/video/4525346/) |
| `delhi_fog` | India Gate at dusk, graded to smog | [6587044](https://www.pexels.com/video/6587044/) |
| `w_diyas` | Diyas | [14182074](https://www.pexels.com/video/14182074/) |
| `w_mehndi` | Mehndi being applied, marigolds behind | [15455199](https://www.pexels.com/video/15455199/) |
| `w_hands` | Hennaed hands, red bangles | [2078587](https://www.pexels.com/video/2078587/) |
| `w_sparkler` | A sparkler | [6378175](https://www.pexels.com/video/6378175/) |
| `w_fireworks` | Fireworks, slowed from 50 fps | [14875803](https://www.pexels.com/video/14875803/) |
| `fog_road` | A tree-lined road in fog (Matheran) | [1405527](https://www.pexels.com/video/1405527/) |
| `rain_street` | An Indian street at night in the rain | [9481662](https://www.pexels.com/video/9481662/) |
| `phone_hand` | Green-screen phone in a hand, keyed with the lock screen | [8566854](https://www.pexels.com/video/8566854/) |
| `rain_glass` | Rain on glass, a red light beyond | [12680281](https://www.pexels.com/video/12680281/) |
| `m_rain` | Rain on a windshield at night | [11631455](https://www.pexels.com/video/11631455/) |
| `m_havan` | A havan fire | [15157494](https://www.pexels.com/video/15157494/) |
| `m_street` | A city street at night, a clock tower | [13687405](https://www.pexels.com/video/13687405/) |
| `m_fire` | A bonfire, close | [16753425](https://www.pexels.com/video/16753425/) |
| `m_bikes` | Helmeted riders on a night road | [10597765](https://www.pexels.com/video/10597765/) |
| `m_incense` | Agarbatti smoke | [1793318](https://www.pexels.com/video/1793318/) |
| `m_gate` | India Gate at dusk, graded to smog | [6583820](https://www.pexels.com/video/6583820/) |
| `m_embers` | Embers, out of focus | [4389495](https://www.pexels.com/video/4389495/) |
| `m_fireworks` | Fireworks over a street | [4832681](https://www.pexels.com/video/4832681/) |
| `m_traffic` | Highway light trails | [11437954](https://www.pexels.com/video/11437954/) |
| `m_coals` | Coals | [7571829](https://www.pexels.com/video/7571829/) |
| `m_fire3` | Burning logs | [11203341](https://www.pexels.com/video/11203341/) |
| `title_embers` | Embers, under the title | [12605103](https://www.pexels.com/video/12605103/) |

`poster`, `m_poster` and `m_note` are the props from `inserts.html`.
