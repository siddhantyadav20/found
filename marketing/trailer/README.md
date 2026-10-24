# Raakh — the cinematic trailer

A 60-second vertical trailer for Chapter 1, *Raakh* (1080×1920, 30 fps,
stereo, −14 LUFS). v5: pictures, a score, and only as many words as it
needs. No voices: the story is the player's to hear in the game, and it
never says the twist (no "alive", no nursing home, no rescue).

The idea is a phone that isn't yours, and going into it. Out here it's a
vertical phone shot in a dark room. A hand opens a photo from that night,
the camera pushes through the glass, and inside is the night itself, framed
like cinema as the letterbox closes in. The wedding is hands, lights and
fire, never a face. Then one shot, what was done after, and the clock to
seven.

`scripts/trailers.py` (on main) builds a simpler, card-led cut of the same
story on macOS; this one is the cinematic version.

```bash
node marketing/trailer/inserts.mjs                    # the props → footage/stills/
python3 marketing/trailer/footage.py                  # footage, game pictures and props → footage/<slot>.mp4 (≈20 min)
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/raakh-trailer.mp4 (≈45 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy and Pillow.
Neither `out/` nor `footage/` is committed. `footage.py` cuts `bokeh` before
`enter`, because the photo on the phone is `bokeh`'s first frame.

## How it's made

- **Picture:** Pexels footage, the game's own pictures and clips
  (`public/found/raakh`), and two of the props drawn in `inserts.html` (the
  returned parcel and the note on the envelope).
  `footage.py` crops it all to 9:16 with a push-in, and keys Sameer's lock
  screen into two green-screen phones. The second one is the way in: it
  tracks the screen, swipes it from the lock screen to a photo, and pushes the
  camera through the glass, turning to square up with it, until the photo is
  the whole frame and the next shot carries on from it. Everything is graded
  together in WebGL (`POST` in `scenes.js`): bloom, anamorphic streaks, teal
  and amber, vignette, grain, gate weave, whip-pans and light leaks across
  cuts, and camera shake on the hits. The letterbox is keyframed: none out
  here, 200 px inside.
- **Words:** HTML over the picture (`trailer.html`) in the game's type:
  Newsreader for the cards, IBM Plex Mono for labels and times, Inter Tight
  for the title. Four cards in a minute, a date, four times, one
  message.
- **Sound:** `sound.py`. Four movements on one four-note motif (A, D, F, E).
  I: a felt piano alone over a low drone, the game's buzz, a reversed swell
  into the screen. II: 100 bpm from the moment we're through, with the
  shehnai taking the motif over strings, tanpura, dhol and claps, in D
  Bhairavi with a flattened ninth on the way home. It stops dead for the
  reel; the game's gunshot; ringing. III: 120 bpm, a cello ostinato and
  taikos under footsteps on gravel, a jerrycan, the game's fire, a braam on
  the turn, then drums and a Shepard tone that run away with the montage.
  IV: silence, a message, a clock, the motif on the piano, and the whole
  orchestra on the name. All synthesised with numpy apart from the game's
  sounds, through three convolution reverbs (room, hall, cathedral), and
  tilted towards the midrange a phone speaker plays.

## The cut

| | Picture | Words | Sound |
|---|---|---|---|
| 0:00 | Black | | A buzz in the dark |
| 0:00 | His phone on a dark table, waking: Saturday 29 November, 11:40 | This phone isn't yours. | A low hit, the felt piano, the drone |
| 0:03 | The parcel: Meera Arora, Kalkaji · RETURN TO ORIGIN | | Kraft paper |
| 0:05 | Your hand holding it. The lock screen swipes away to a photo of lights; the camera pushes into the screen | | The motif, alone; a reversed swell, a riser |
| 0:10 | Through: the same lights, alive; the letterbox closes in | ● SATURDAY 22 NOVEMBER · DELHI | An impact; the band comes in |
| 0:12 | A hand lighting diyas, mehndi, hands with bangles, diyas, a sparkler, the havan, fireworks, lights out of focus (whips and light leaks between) | | Shehnai, strings, tanpura, dhol, claps |
| 0:22 | The back lawn, out of focus: a figure, an arm up, a light | | Everything stops but one note and a pulse |
| 0:24 | White, then black | | One shot. Its echo. Ringing |
| 0:25 | The back lawn after: chairs over, the tripod | | Wind, a cold chord, one note |
| 0:27 | A shoe on gravel in a torch's light; a jerrycan; a fire; ash falling | | Cello ostinato, taikos, footsteps, the game's fire |
| 0:35 | Black | Somebody edited *the night.* | Braam |
| 0:38 | Montage: rain on glass, a night drive, a city from above, his note, the fire, smoke, coals, incense, fog, traffic, embers, the parcel… | 11:52 PM · 12:32 AM · 1:52 AM · 4:47 AM | Drums speeding up, a Shepard tone, a hit on every cut |
| 0:45 | Black | | Silence |
| 0:47 | | UNKNOWN NUMBER · *M? Tu hai?* · M? Is that you? | A bell, one piano note |
| 0:49 | A clock tower over a street at night | Before seven, *you'll have to choose.* | A clock, the motif on the piano, strings and choir rising |
| 0:53 | Embers | Found · CHAPTER 01 · DELHI · **Raakh** · A thriller you play on someone else's phone. · PLAY FREE · FOUND-GAME.VERCEL.APP | Braam, taiko, the motif home over the orchestra |
| 0:59 | | | One more buzz |

## Sources

The game's own pictures, clips and sounds are the game's. The rest is
Pexels footage under the [Pexels licence](https://www.pexels.com/license/)
(free, commercial use allowed, no attribution required), downloaded from
`videos.pexels.com` by id. Every clip was checked by eye: no identifiable
face, nothing graphic. The one human figure, at the reel, is the game's own,
thrown out of focus.

| Slot | What it is | Source |
|---|---|---|
| `phone_dark` | Green-screen phone on a table, keyed with the lock screen | Pexels [4525346](https://www.pexels.com/video/4525346/) |
| `enter` | A hand holding a green-screen phone; the push through the glass | Pexels [8566854](https://www.pexels.com/video/8566854/) |
| `parcel`, `m_note` | Props | `inserts.html` |
| `bokeh`, `blur` | Lights out of focus | Pexels [854088](https://www.pexels.com/video/854088/) |
| `lamp` | A hand lighting diyas | Pexels [19971139](https://www.pexels.com/video/19971139/) |
| `mehndi` | Mehndi being drawn, marigolds | Pexels [15455199](https://www.pexels.com/video/15455199/) |
| `bangles` | Hands with mehndi and bangles | Pexels [2078587](https://www.pexels.com/video/2078587/) |
| `diyas` | Diyas | Pexels [14182074](https://www.pexels.com/video/14182074/) |
| `sparkler` | A sparkler | Pexels [6378175](https://www.pexels.com/video/6378175/) |
| `havan` | The havan's fire | Pexels [15157494](https://www.pexels.com/video/15157494/) |
| `fireworks` | Fireworks | Pexels [14875803](https://www.pexels.com/video/14875803/) |
| `reel` | The reel on the back lawn, out of focus | the game: `clip-reel-take.mp4` (picture only) |
| `lawn` | The back lawn after | the game: `key-lawn.jpg` |
| `gravel`, `jerrycan`, `m_pyre` | The walk over gravel, the jerrycan, the fire | the game: `clip-fire-whole.mp4`, `clip-fire.mp4` (picture only) |
| `fire` | A fire, close | Pexels [11210464](https://www.pexels.com/video/11210464/) |
| `ash` | Ash falling | Pexels [4211320](https://www.pexels.com/video/4211320/) |
| `m_glass` | Rain on glass, tail lights | Pexels [12680281](https://www.pexels.com/video/12680281/) |
| `m_car` | A night drive | Pexels [10451977](https://www.pexels.com/video/10451977/) |
| `m_aerial` | A highway from above at night | Pexels [9370566](https://www.pexels.com/video/9370566/) |
| `m_smoke` | Smoke | Pexels [6894947](https://www.pexels.com/video/6894947/) |
| `m_rain` | Rain on a windshield at night | Pexels [11631455](https://www.pexels.com/video/11631455/) |
| `m_coals` | Coals | Pexels [7571829](https://www.pexels.com/video/7571829/) |
| `m_incense` | Incense smoke | Pexels [1793318](https://www.pexels.com/video/1793318/) |
| `m_fog` | A road in fog | Pexels [1405527](https://www.pexels.com/video/1405527/) |
| `m_traffic` | Highway light trails | Pexels [11437954](https://www.pexels.com/video/11437954/) |
| `m_embers` | Embers | Pexels [4389495](https://www.pexels.com/video/4389495/) |
| `clock` | A clock tower over a street at night | Pexels [13687405](https://www.pexels.com/video/13687405/) |
| `title_embers` | Embers, under the title | Pexels [12605103](https://www.pexels.com/video/12605103/) |

Left out on purpose: `dilip-awake.jpg`, `nurse-bag.jpg`, `kunal-frame.jpg`,
`bts.jpg`, the memo at 4:58, the reel take's and the whole fire clip's
audio, every Episode 3 call, and every voice. Each gives part of the story
away.
