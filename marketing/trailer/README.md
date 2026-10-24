# Raakh — the cinematic trailer

A 58-second vertical trailer for Chapter 1, *Raakh* (1080×1920, 30 fps,
stereo, −14 LUFS). v7: pictures, a score, and a few small typed lines. No
voices, no faces, and nothing composited. Every shot is real footage, and
it's Indian wherever a place shows: a wedding's pheras and havan, Diwali's
fireworks, Delhi's fog. It never says the twist (no "alive", no nursing home,
no rescue).

It keeps v6's direction (the teal night, the typed words, the tactile
inserts from the Pinterest references) and brings back the earlier cuts'
build. The cold open: Delhi in fog, and a phone that isn't yours lighting up.
The wedding is a burst of close shots on a band and a dhol, faster and
faster: feet circling the havan, the chunni passing over the flame,
sparklers, an anar, fireworks. A gun comes out, an arm goes up, and there's
one shot. After it, everything is cold and slow: a field in the morning fog,
a torch, a corridor, the jerrycan, a fire, smoke. Then the build, cut on
cuts that halve and halve with the night's times typed over them, until it
runs into true silence. Black. Then a message: *M? Tu hai?* Then dawn over the
smog, the clock, and the name.

`scripts/trailers.py` (on main) builds a simpler, card-led cut of the same
story on macOS; this one is the cinematic version.

```bash
node marketing/trailer/inserts.mjs                    # the props → footage/stills/
python3 marketing/trailer/footage.py                  # Pexels and Mixkit footage, game clips and props → footage/<slot>.mp4 (≈10 min)
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/raakh-trailer.mp4 (≈40 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy and Pillow.
Neither `out/` nor `footage/` is committed. When footage changes, delete
`out/frames/<slot>` so render.mjs re-extracts it.

## How it's made

- **Picture:** real footage from Pexels and Mixkit, the game's own clips
  (`public/found/raakh`), and two props drawn in `inserts.html` (the returned
  parcel and the MISSING poster). `footage.py` crops it all to 9:16 with a
  push-in, and throws the reel and the phone out of focus so the figures and
  the phone's own screen read only as light. Everything is graded together in
  WebGL (`POST` in `scenes.js`): amber for the wedding; teal through the
  shadows and mids after it, with fire keeping its colour; bloom, anamorphic
  streaks, vignette, grain, gate weave, whip-pans and light leaks across a
  few cuts, and camera shake on the hits.
- **Words:** typed out a key at a time in IBM Plex Mono (`trailer.html`),
  with the keys heard; the build's times stamped large; the message as a
  phone shows one; the title as the landing page sets it, with the Found
  mark.
- **Sound:** `sound.py`, on one four-note motif (A, D, F, E) and a clock
  that keeps time under everything. Delhi's hum and far horns, a cold drone,
  the game's buzz, a felt piano alone. A wedding band heard through the walls
  under the parcel bursts in on the wedding at 120 bpm: band-baaja trumpets
  and a clarinet on the tune, a tuba, dhol, jhanj, claps, the crowd, taikos
  on the bar, double time with the cuts, sparklers fizzing and fireworks
  where they're seen. When the gun comes out the party goes far away, as if
  through a wall, under a heartbeat. It stops dead for the raised arm, then
  the game's gunshot and ringing. After that there's no tempo: low strings, wind,
  the motif slower, a soft hit on each cut, the game's fire, a braam. The
  build is a Shepard tone, the dhol and the clock running from 120 bpm to
  200, cellos doubling, strings brightening, then nothing at all (reverb
  included) for a second. Then typing, a ping, the clock and voices rising,
  and the whole orchestra on the name. All synthesised with numpy apart from
  the game's sounds, through three convolution reverbs, tilted towards what
  a phone speaker plays.

## The cut

| | Picture | Words | Sound |
|---|---|---|---|
| 0:00 | A highway at night in thick fog, sodium lights | | Delhi's hum, far horns, a cold drone |
| 0:03 | A phone on a table of letters, lighting up | This phone isn't yours. *(typed)* | The buzz; the motif on a felt piano; a low pulse |
| 0:06 | The parcel: Meera Arora, Kalkaji · RETURN TO ORIGIN | | Paper; a band, through the walls |
| 0:08 | A diya at night, festival lights | ● SATURDAY, 22 NOVEMBER *(typed)* | The band bursts in |
| 0:09 | A drum struck; feet circling the havan; a sparkler; the chunni over the flame; an anar; bride and groom's feet; sparklers; fireworks; the havan. Then faster: mehndi, rice into the fire, the pheras… | | Trumpets, clarinet, tuba, dhol, claps, crowd; double time |
| 0:15 | A gun comes out | | The party goes far away; a heartbeat |
| 0:17 | The back lawn, out of focus: an arm up, a light | | Everything stops but one note |
| 0:18 | White, then black | | One shot. Its echo. Ringing |
| 0:19 | A field in the morning fog; a torch in the dark; a corridor under a tube light; the jerrycan; a bonfire; smoke | | Low strings, wind, the motif slower; the game's fire; a clock comes in |
| 0:31 | Black | Somebody edited / the night. *(typed)* | A braam |
| 0:34 | Riders at night; rain on a street; MISSING; a cracker; a bus in the dark; the fire; the corridor; light trails; the clock; the gun; a road; the aarti; the phone… shorter and shorter | 11:52 PM · 12:32 AM · 1:52 AM · 4:47 AM | Shepard tone; dhol and clock from 120 to 200 bpm; cellos; a hit on every cut; a riser |
| 0:43 | Black | | Nothing at all |
| 0:44 | Black | *(typing…)* **M? Tu hai?** · M? Is that you? | Typing; a ping; a low note |
| 0:47 | Dawn over the city through smog | Before seven, / you'll have to choose. *(typed)* | The clock; strings and voices rising; the motif |
| 0:51 | Sparks rising | Found · CHAPTER 01 · DELHI · **Raakh** · A thriller you play on someone else's phone. · PLAY FREE · FOUND-GAME.VERCEL.APP | Braam, taiko, the motif home over the orchestra |
| 0:57 | | | One more buzz |

## Sources

The game's own clips and sounds are the game's. Pexels footage is under the
[Pexels licence](https://www.pexels.com/license/) and Mixkit footage under the
[Mixkit licence](https://mixkit.co/license/): both free, commercial use
allowed, no attribution required. Every clip was checked by eye: no
identifiable face, nothing graphic.

| Slot | What it is | Source |
|---|---|---|
| `o_city` | A highway at night in thick fog | Mixkit [9678](https://mixkit.co/free-stock-video/night-fog-in-the-city-highway-9678/) |
| `o_phone` | A phone on letters, lighting up | Pexels [7821643](https://www.pexels.com/video/7821643/) |
| `o_parcel`, `m_poster` | Props | `inserts.html` |
| `w_diya` | A diya at night under festival lights | Pexels [19971137](https://www.pexels.com/video/19971137/) |
| `w_dhol` | A drum struck | Pexels [5691239](https://www.pexels.com/video/5691239/) |
| `w_pheras`, `w_feet` | Bride and groom's feet circling the havan | Pexels [15157549](https://www.pexels.com/video/15157549/), [15157550](https://www.pexels.com/video/15157550/) |
| `w_chunni` | The chunni passing over the flame | Pexels [15157545](https://www.pexels.com/video/15157545/) |
| `w_havan`, `w_rice` | The havan; rice into the fire | Pexels [15157547](https://www.pexels.com/video/15157547/), [15157543](https://www.pexels.com/video/15157543/) |
| `w_mehndi` | Mehndi among marigolds | Pexels [15455198](https://www.pexels.com/video/15455198/) |
| `w_sparkler`, `w_sparklers` | Sparklers | Pexels [6971607](https://www.pexels.com/video/6971607/), [10718916](https://www.pexels.com/video/10718916/) |
| `w_anar`, `w_fireworks` | An anar; fireworks | Pexels [14182087](https://www.pexels.com/video/14182087/), [14182088](https://www.pexels.com/video/14182088/) |
| `w_gun` | A gun drawn | Pexels [5243197](https://www.pexels.com/video/5243197/) |
| `w_raise` | The reel on the back lawn, out of focus | the game: `clip-reel-take.mp4` (picture only) |
| `a_field` | A field in the morning fog | Mixkit [26140](https://mixkit.co/free-stock-video/fog-outside-the-train-window-26140/) |
| `a_torch` | A torch in the dark | Pexels [18359612](https://www.pexels.com/video/18359612/) |
| `a_door` | A corridor under tube lights | Pexels [15365457](https://www.pexels.com/video/15365457/) |
| `a_jerrycan` | The jerrycan | the game: `clip-fire-whole.mp4` (picture only) |
| `a_fire` | A bonfire at night, figures around it | Pexels [3948683](https://www.pexels.com/video/3948683/) |
| `a_ash` | Smoke rising | Pexels [5691247](https://www.pexels.com/video/5691247/) |
| `m_rider` | Riders at night | Pexels [10597765](https://www.pexels.com/video/10597765/) |
| `m_auto` | Rain on a street at night | Pexels [12518558](https://www.pexels.com/video/12518558/) |
| `m_car` | A bus's headlights in the dark | Pexels [15722036](https://www.pexels.com/video/15722036/) |
| `m_cracker` | A cracker bursting | Pexels [16510383](https://www.pexels.com/video/16510383/) |
| `m_trails` | Light trails | Pexels [13837044](https://www.pexels.com/video/13837044/) |
| `m_aarti` | The Ganga aarti's fire | Pexels [13953530](https://www.pexels.com/video/13953530/) |
| `m_clock` | A pendulum clock | Pexels [8322053](https://www.pexels.com/video/8322053/) |
| `m_road` | A road at night | Pexels [5691244](https://www.pexels.com/video/5691244/) |
| `m_city` | A city's lights from above, at night | Pexels [20319188](https://www.pexels.com/video/20319188/) |
| `s_dawn` | A city in smog | Pexels [10401761](https://www.pexels.com/video/10401761/) |
| `title_ash` | Sparks rising | Pexels [12298312](https://www.pexels.com/video/12298312/) |

Left out on purpose: `dilip-awake.jpg`, `nurse-bag.jpg`, `kunal-frame.jpg`,
`bts.jpg`, the memo at 4:58, the reel take's and the whole fire clip's
audio, every Episode 3 call, every voice, and the typed list.
