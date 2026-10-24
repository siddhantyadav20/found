# Raakh — the cinematic trailer

A 70-second vertical trailer for Chapter 1, *Raakh* (1080×1920, 30 fps,
stereo, −14 LUFS), in English, cut to the game as it now plays (CHAPTER1.md,
"Seven o'clock" and "The final cut"). It never says the twist: no "alive",
no nursing home, no rescue; "a body burned" only ever as Sameer's version.

`scripts/trailers.py` (on main) builds a simpler, card-led cut of the same
story on macOS; this one is the cinematic version: real footage graded with
the game's own pictures, clips and voices, a score, and the game's type.

```bash
node marketing/trailer/inserts.mjs                    # the props → footage/stills/
python3 marketing/trailer/footage.py                  # footage, game pictures and props → footage/<slot>.mp4 (≈25 min)
python3 marketing/trailer/edit.py                     # edit.py → edit.json (the cut)
node marketing/trailer/render.mjs --stills            # one PNG per shot and card
node marketing/trailer/render.mjs --stills --at 9,34  # just those moments
node marketing/trailer/render.mjs                     # → out/raakh-trailer.mp4 (≈50 min)
```

Needs Playwright (Chromium), ffmpeg, and Python 3 with numpy and Pillow.
Neither `out/` nor `footage/` is committed.

## How it's made

- **Picture:** the game's own pictures and clips (`public/found/raakh`,
  `scripts/frames/raakh`: the Sehgal album, Dilip at 9:48 PM and at Chhath,
  the back lawn, Kunal on the dance floor, the reel, the fire, the jerrycan,
  the gravel), Pexels footage for Delhi, the street tonight and the montage,
  and four props drawn in `inserts.html` (the returned parcel, the MISSING
  poster with the game's photograph of Dilip, the envelope's note with its
  English, Bhasin Uncle ringing). `footage.py` crops all of it to 9:16 with a
  push-in, keys Sameer's lock screen (Saturday 29 November, 11:40) into a
  green-screen phone that wakes on the first buzz, and gives props a hand's
  drift. Everything is graded together in WebGL (`POST` in `scenes.js`):
  bloom, anamorphic streaks, Delhi smog, chromatic aberration, teal and
  amber, vignette, grain, gate weave, camera shake on the hits.
- **Words:** HTML over the picture (`trailer.html`) in the game's type:
  Newsreader for the cards, IBM Plex Mono for labels (with the ember dot),
  Inter Tight for subtitles and the title, which is set as the landing page
  sets it, with the Found mark.
- **Voices:** the game's own recordings (`public/voices/raakh`), cut phrase by
  phrase in `edit.py`, each with an English subtitle and who's speaking.
- **Sound:** `sound.py`. The game's dhol, gunshot, fire and buzz
  (`public/sfx`); the rest synthesised with numpy. One original tune: band
  baaja in Khamaj at the wedding, then harmonium in Bhairavi over a tanpura
  under Dilip's voice, then its last phrase under the title. The voices sit
  on their own bus and everything ducks under them (every line clears the
  music by 6 dB or more in the 300 Hz–4 kHz band a phone plays).

## The cut

| | Picture | Words | Sound |
|---|---|---|---|
| 0:00 | His phone on a dark table, the screen waking | This phone isn't yours. | The buzz, a hit, a piano note, a watch |
| 0:02 | The parcel: Meera Arora, Kalkaji · RETURN TO ORIGIN | It was meant for someone else. | Kraft paper |
| 0:04 | India Gate in smog | ● SATURDAY 22 NOVEMBER · DELHI | Horns; a band somewhere |
| 0:06 | The Sehgal wedding: dhol players, the baraat, the varmala, a sparkler | | Band baaja over the game's dhol |
| 0:09 | Dilip with his tray | ● 9:48 PM | |
| 0:10 | Kunal firing into the air on the dance floor | | Shots, cheering, *"Oye hoye!"* |
| 0:12 | The reel on the back lawn: the light, the revolver | ● THE BACK LAWN · *Rolling, bro?* | The band stops; one note |
| 0:13 | White | | One shot. Ringing |
| 0:13 | Black | One shot in the air. | |
| 0:15 | The MISSING poster | DILIP · VOICE NOTE: *Bhaiya, listen… "Sir, light is ready." "Sir, battery full."* | His voice; the tune on a harmonium |
| 0:19 | Dilip at Chhath | *Did I say it right? In Mumbai, I'll have to speak English.* | |
| 0:23 | The back lawn after: a chair over, the tripod | SAMEER · VOICE NOTE TO M: *Kunal was firing. A boy fell.* | Wind, tanpura |
| 0:27 | The fire, 4:47 AM | *They burned him, M. I was there. I saw.* | The game's fire |
| 0:32 | A street tonight, in the rain | THE GUARD · GATE 2: *There's a man at the gate. In a safari suit. He's asking for your flat number.* | Rain, horns, a heartbeat |
| 0:38 | Bhasin Uncle calling | *You're not Sameer.* | The ring |
| 0:40 | India Gate in smog | *Give it back to the courier by morning. We'll handle the rest.* | Strings |
| 0:44 | Black | Everything on it is true. *Somebody edited the night.* | Braam |
| 0:47 | Montage: windshield rain, the gravel at night, his note, Kunal firing, the poster, the jerrycan, a bonfire, the pheras, the reel… | 11:52 PM · 12:32 AM · 1:52 AM | Strings, Shepard tone, dhol-tasha speeding up |
| 0:53 | His lock screen | *4. Nitin —* typed | Everything stops but a note |
| 0:54 | Black | | Silence |
| 0:55 | | UNKNOWN NUMBER · *M? Tu hai?* · M? Is that you? | A bell |
| 0:57 | Black | THE GUARD: *He's gone. Said he'll be back at seven.* | A clock |
| 1:01 | Black | Before seven, *you'll have to choose.* | |
| 1:03 | Embers | Found · CHAPTER 01 · DELHI · **Raakh** · A thriller you play on someone else's phone. · PLAY FREE · FOUND-GAME.VERCEL.APP | The biggest hit, the tune's last phrase |
| 1:09 | Black | | One more buzz |

## Sources

The game's own pictures, clips and voices are the game's. The rest is
Pexels footage under the [Pexels licence](https://www.pexels.com/license/)
(free, commercial use allowed, no attribution required), downloaded from
`videos.pexels.com` by id; every clip was checked by eye: no identifiable
face, nothing graphic.

| Slot | What it is | Source |
|---|---|---|
| `phone_dark` | Green-screen phone on a table, keyed with the lock screen | Pexels [4525346](https://www.pexels.com/video/4525346/) |
| `parcel`, `poster`, `m_poster`, `m_note`, `call` | Props | `inserts.html` |
| `delhi_fog`, `m_gate` | India Gate at dusk, graded to smog | Pexels [6587044](https://www.pexels.com/video/6587044/), [6583820](https://www.pexels.com/video/6583820/) |
| `g_dhol`, `g_baraat`, `g_varmala`, `g_portrait`, `m_pheras`, `m_baraat` | The Sehgal wedding | the game: `w-4`, `w-3`, `w-5`, `w-portrait`, `w-pheras`, `w-baraat` |
| `w_sparkler` | A sparkler | Pexels [6378175](https://www.pexels.com/video/6378175/) |
| `k_dance` | Kunal firing on the dance floor | the game: `clip-k-3.mp4` |
| `g_reel`, `m_reel3`, `m_kfire`, `m_jerrycan` | The reel, Kunal firing, the jerrycan | the game: `scripts/frames/raakh/` |
| `g_chhath` | Dilip at Chhath | the game: `dilip-chhath.jpg` |
| `g_lawn` | The back lawn after | the game: `key-lawn.jpg` |
| `g_fire`, `m_gravel` | The fire; the walk over gravel | the game: `clip-fire.mp4`, `clip-fire-whole.mp4` (picture only) |
| `rain_street` | An Indian street at night in the rain | Pexels [9481662](https://www.pexels.com/video/9481662/) |
| `m_rain` | Rain on a windshield at night | Pexels [11631455](https://www.pexels.com/video/11631455/) |
| `m_fire` | A bonfire, close | Pexels [16753425](https://www.pexels.com/video/16753425/) |
| `m_embers` | Embers | Pexels [4389495](https://www.pexels.com/video/4389495/) |
| `m_traffic` | Highway light trails | Pexels [11437954](https://www.pexels.com/video/11437954/) |
| `m_coals` | Coals | Pexels [7571829](https://www.pexels.com/video/7571829/) |
| `title_embers` | Embers, under the title | Pexels [12605103](https://www.pexels.com/video/12605103/) |

Left out on purpose: `dilip-awake.jpg`, `nurse-bag.jpg`, `kunal-frame.jpg`,
`bts.jpg`, the memo at 4:58, the reel take's and the whole fire clip's
audio, and every Episode 3 call. Each gives part of the twist away.
