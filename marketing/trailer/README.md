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

- **Picture:** every shot is a GLSL scene in `scenes.js`, rendered on the
  CPU (SwiftShader) at 720×1280, then graded by `POST` at 1080×1920: bloom,
  halation, chromatic aberration, teal-and-amber split, vignette, grain,
  gate weave. No photographs. The words are HTML over it (`trailer.html`).
- **Sound:** `sound.py` synthesises the score and the effects with numpy:
  piano, strings, dhol, toms, braams, a shehnai with meend, rain, crows,
  the gunshot. The only sample is the game's own buzz. Everything low also
  speaks in the midrange, because phone speakers stop at about 200 Hz.

## The cut

| | Picture | Sound |
|---|---|---|
| 0:00 | A phone face-down on a dark table, light leaking from under it, buzzing | A watch starts; one piano note |
| 0:03 | India Gate in November smog, lamps coming at us · *22 NOVEMBER · NEW DELHI* | Far traffic, horns |
| 0:06 | Bulbs in the trees, a focus pull | Dhol and shehnai through a wall |
| 0:08 | The baraat's fireworks over the farmhouse trees | In the room: dhol, crowd, a rocket, crackle |
| 0:10 | White | One shot, its echo off the buildings, then ringing |
| 0:11 | *ONE SHOT IN THE AIR.* | Silence |
| 0:13 | Dawn: the trees, dead bulbs, smoke rising behind · *ONE BOY NEVER WENT HOME.* | A hit, wind, crows, piano E♭ |
| 0:17 | Light under a door, a parcel, dust; feet pass on the other side · *FIVE DAYS LATER* | Three knocks, footsteps going away |
| 0:21 | *HIS PHONE ARRIVED AT YOUR DOOR.* | A hit |
| 0:23 | His lock screen, the focus finding *47 Missed Calls* | The buzz; a heartbeat |
| 0:26 | Rain on a car window, Delhi traffic beyond · *EVERYTHING ON IT IS TRUE.* | Rain; the strings begin |
| 0:29 | *NOT EVERYTHING IS IN THE RIGHT ORDER.* | Braam |
| 0:32 | The montage: rain, fire, a flyover's light trails, embers, the gate, fireworks… cuts from 1.2 s to 0.14 s · *11:52 PM · LOCAL THANE MAT LE JAANA · 1:53 AM · LAPATA · 4:47 AM · 4. NITIN —* | Ostinato, violins, Shepard tone, a tom and dhol on every cut, the watch running away |
| 0:41 | Black | Silence |
| 0:42 | *M? Tu hai?* | One bell |
| 0:45 | **SHAGUN** · शगुन, over embers · *PLAY FREE · LINK IN BIO* | The biggest braam, a taiko, D minor, the shehnai; one last tick |

Nothing past Episode 1's first theory is shown or said. No faces, no
bodies, nothing graphic.

## Real footage, if it can be had

Every shot also names a **slot**. A clip at `footage/<slot>.mp4` replaces
that slot's scene everywhere it's used, cropped to 9:16 and put through the
same grade. The rule for every clip: no identifiable face.

| Slot | Scene it replaces | What a clip needs | Pexels search |
|---|---|---|---|
| `phone_dark` | phone | A phone face-down on a table in the dark, vibrating | "phone vibrating table dark" |
| `delhi_fog` | gate | Delhi in winter smog: India Gate, Rajpath lamps | "india gate night", "delhi fog" |
| `wedding_lights` | bulbs | Bulbs strung through trees at night | "string lights trees night" |
| `baraat_fireworks` | fireworks | Fireworks over trees at an Indian wedding | "wedding fireworks night" |
| `dawn_smoke` | dawn | Smoke rising over a tree line at dawn | "smoke dawn trees" |
| `parcel_door` | door | A parcel at a door, low light | "package doorstep night" |
| `phone_hand` | screen | A lit phone screen in the dark, out of focus | "phone screen dark bokeh" |
| `rain_glass` | rain | Rain on a car window, city lights beyond | "rain car window night city" |
| `fire` | fire | A fire before dawn: logs, embers. **Nothing else in it** | "bonfire night embers" |
| `night_road` | traffic | Light trails from a flyover | "delhi traffic night timelapse" |
| `smoke` | embers | Sparks rising in the dark | "sparks embers dark" |
