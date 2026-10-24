# Raakh — the cinematic trailer

A 55-second vertical trailer for Chapter 1, *Raakh* (1080×1920, 30 fps,
stereo, −14 LUFS). v6: pictures, a score, and a few small typed lines. No
voices, no faces, and nothing composited: every phone, hand, flame and clock
is really there. It never says the twist (no "alive", no nursing home, no
rescue).

It's cut the way its references are (five Pinterest edits: a Duskwood
episode teaser, a "tension in ten seconds" breakdown, a teal horror teaser,
and two fast macro-insert edits). It opens slow and teal-dark, with one
practical light doing all the work: a bulb dies, and on a table of letters a
phone that isn't yours lights up. Then a burst of close, tactile inserts of
the wedding (a match, mehndi, bangles, flame) cut on the beat, faster and
faster, until one shot. After it come long held shots in the dark: a torch
searching, the gravel, the jerrycan, the fire, a candle going out. Then you,
putting it together; the clock; three frames at once, the split screen the
tension edit uses. Then the name. The words are typed out, small, in mono, as
the teal teaser types its "Coming Soon".

`scripts/trailers.py` (on main) builds a simpler, card-led cut of the same
story on macOS; this one is the cinematic version.

```bash
node marketing/trailer/inserts.mjs                    # the props → footage/stills/
python3 marketing/trailer/footage.py                  # Pexels footage, game clips and props → footage/<slot>.mp4 (≈15 min)
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/raakh-trailer.mp4 (≈40 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy and Pillow.
Neither `out/` nor `footage/` is committed.

## How it's made

- **Picture:** real footage from Pexels, the game's own clips
  (`public/found/raakh`), and three props drawn in `inserts.html` (the
  returned parcel, the note, the MISSING poster). `footage.py` crops it all to
  9:16 with a push-in, throws the reel and the phone a little out of focus
  (so the figure and the phone's own screen read only as light), and stacks
  the three-frame shot. Everything is graded together in WebGL (`POST` in
  `scenes.js`): teal through the shadows and mids at night, with flames and
  screens keeping their colour; amber for the wedding; bloom, anamorphic
  streaks, vignette, grain, gate weave, whip-pans and light leaks across a
  few cuts, and camera shake on the hits.
- **Words:** typed out a key at a time in IBM Plex Mono (`trailer.html`),
  with the keys heard; the title as the landing page sets it, with the Found
  mark.
- **Sound:** `sound.py`, on one four-note motif (A, D, F, E). Room tone, a
  bulb's hum and its switch; the game's buzz and a felt piano alone. A match
  strike into 100 bpm: shehnai, dhol, claps and strings in D Bhairavi, going
  double time with the cuts; dead stop for the reel; the game's gunshot;
  ringing. Then no tempo: held notes, the piano slower, wind, a torch
  clicking on, gravel, a jerrycan, the game's fire, a candle blown out, a low
  braam. Then 120 bpm: a clock, a cello ostinato, taikos, a heartbeat under
  the three frames; one tick under the last words; the orchestra on the
  name. All synthesised with numpy apart from the game's sounds, through
  three convolution reverbs, tilted towards what a phone speaker plays.

## The cut

| | Picture | Words | Sound |
|---|---|---|---|
| 0:00 | A bare bulb, glowing; it dies | | Room tone, the filament's hum, the switch |
| 0:03 | A phone on a table of letters in the dark, lighting up | This phone isn't yours. *(typed)* | The buzz; the motif on a felt piano; a cold drone |
| 0:07 | The parcel: Meera Arora, Kalkaji · RETURN TO ORIGIN | | Kraft paper |
| 0:08 | A match struck in the dark | ● SATURDAY, 22 NOVEMBER *(typed)* | The strike; the band comes in |
| 0:10 | Mehndi, a hand lighting diyas, bangles, a lighter, a sparkler, the havan, diyas, fireworks, lights; then all of it again at double speed | | Shehnai, dhol, claps, strings |
| 0:18 | The back lawn, out of focus: a figure, an arm up, a light | | Everything stops but one note and a heartbeat |
| 0:19 | White, then black | | One shot. Its echo. Ringing |
| 0:20 | A torch searching in the dark | | A click, wind, the piano slower |
| 0:23 | A shoe on gravel in torchlight; a jerrycan; the fire; a candle blown out; the wick smoking | | Footsteps, a slosh, the game's fire, a breath |
| 0:33 | Black | Somebody edited / the night. *(typed)* | A low braam |
| 0:35 | Red string on an evidence board; someone at the board, from behind; an alarm clock in the dark; a second hand; rain, the note, the poster | | A clock, a cello ostinato, taikos |
| 0:41 | Three frames at once: the second hand, the phone, MISSING | | A heartbeat, violins climbing, a Shepard tone |
| 0:45 | Black | Before seven, / you'll have to choose. *(typed)* | One tick a second, a low note, a breath in |
| 0:48 | Embers | Found · CHAPTER 01 · DELHI · **Raakh** · A thriller you play on someone else's phone. · PLAY FREE · FOUND-GAME.VERCEL.APP | Braam, taiko, the motif home over the orchestra |
| 0:54 | | | One more buzz |

## Sources

The game's own clips and sounds are the game's. The rest is Pexels footage
under the [Pexels licence](https://www.pexels.com/license/) (free, commercial
use allowed, no attribution required), downloaded from `videos.pexels.com` by
id. Every clip was checked by eye: no identifiable face, nothing graphic.

| Slot | What it is | Source |
|---|---|---|
| `bulb` | A bare bulb going out | Pexels [853772](https://www.pexels.com/video/853772/) |
| `phone`, `three` | A phone on letters, lighting up | Pexels [7821643](https://www.pexels.com/video/7821643/) |
| `parcel`, `note`, `poster`, `three` | Props | `inserts.html` |
| `match` | A match struck in the dark | Pexels [8618706](https://www.pexels.com/video/8618706/) |
| `mehndi` | Mehndi being drawn, marigolds | Pexels [15455199](https://www.pexels.com/video/15455199/) |
| `lamp` | A hand lighting diyas | Pexels [19971139](https://www.pexels.com/video/19971139/) |
| `bangles` | Hands with mehndi and bangles | Pexels [2078587](https://www.pexels.com/video/2078587/) |
| `lighter` | A lighter in the dark | Pexels [2544525](https://www.pexels.com/video/2544525/) |
| `sparkler` | A sparkler | Pexels [6378175](https://www.pexels.com/video/6378175/) |
| `havan` | The havan's fire | Pexels [15157494](https://www.pexels.com/video/15157494/) |
| `diyas` | Diyas | Pexels [14182074](https://www.pexels.com/video/14182074/) |
| `fireworks` | Fireworks | Pexels [14875803](https://www.pexels.com/video/14875803/) |
| `bokeh` | Lights out of focus | Pexels [854088](https://www.pexels.com/video/854088/) |
| `reel` | The reel on the back lawn, out of focus | the game: `clip-reel-take.mp4` (picture only) |
| `torch` | A torch in the dark | Pexels [18359612](https://www.pexels.com/video/18359612/) |
| `gravel`, `jerrycan`, `fire` | The walk over gravel, the jerrycan, the fire | the game: `clip-fire-whole.mp4`, `clip-fire.mp4` (picture only) |
| `candle` | A candle blown out | Pexels [4055408](https://www.pexels.com/video/4055408/) |
| `smoke` | A wick burning down to smoke | Pexels [7034152](https://www.pexels.com/video/7034152/) |
| `board` | Red string on an evidence board | Pexels [8369880](https://www.pexels.com/video/8369880/) |
| `back` | Someone at the board, from behind | Pexels [8369883](https://www.pexels.com/video/8369883/) |
| `alarm` | An alarm clock in the dark | Pexels [11267667](https://www.pexels.com/video/11267667/) |
| `seconds`, `three` | A second hand, close | Pexels [7033786](https://www.pexels.com/video/7033786/) |
| `glass` | Rain on glass, tail lights | Pexels [12680281](https://www.pexels.com/video/12680281/) |
| `title_embers` | Embers, under the title | Pexels [12605103](https://www.pexels.com/video/12605103/) |

Left out on purpose: `dilip-awake.jpg`, `nurse-bag.jpg`, `kunal-frame.jpg`,
`bts.jpg`, the memo at 4:58, the reel take's and the whole fire clip's
audio, every Episode 3 call, every voice, and the typed list.
