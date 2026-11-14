# RAAKH trailer v7: "Return to origin" (draft)

13 Nov 2026. An 80-second landscape trailer, 1920×1080 at 24 fps, picture in a 2.39:1 scope frame. Reimagined from zero: nothing from v4, Indian footage only, and the game appears as itself, captured from the running build with Playwright. No overlays, no mimicry, no synthetic voices.

Output: `out/raakh-v7.mp4`, copied to `marketing/raakh-trailer-v7-draft-1080p.mp4` (with a 720p copy). Gitignored like every mp4 in `marketing/`.

## What changed from v6, point by point

| v6 complaint | v7 |
|---|---|
| Pieces reused from v4 | Every clip is new. The v4 list was excluded at the search stage. |
| Music cuts off in the first half | One continuous bed: a tanpura from the first frame, the dhol over it for the wedding, the cue from its first hit. The gunshot's silence is one held breath with the ears ringing and a sarangi in it. `mix.py` prints every quarter-second window below −45 dBFS outside the two designed silences; the list is empty. |
| Abrupt fades between scenes | Every transition is a cut on the grid (the dhol's beat, then the cue's hits). Black appears only where it is designed: after the shot, at the drop, around the end card. |
| Shots that aren't Indian | Every face, street, room and wedding is Indian: Delhi fog and rain, Mumbai local at night, a farmhouse lawn from the air, mehndi, pheras, a man in a Delhi flat with the phone. |
| Phones glitching under an overlay | No composites. The phone is the game's own render: the parcel, the envelope, the lock screen, the incoming call, WhatsApp, the Low Battery alert, the case file, all screenshots of the real build at 2×. |
| Foreign phone UIs and artefacts | No stock phone screens at all. Any phone on screen is the real game. |

## Screenplay

| Time | Picture | Sound | Card |
|---|---|---|---|
| 0–3.9 | A hand at a doorbell. A black-wrapped parcel, received. | A fan, a dog far off, the bell. A tanpura, low. | — |
| 3.9–9.6 | The game: the parcel on the table, the waybill, **RETURN TO ORIGIN · Refused by addressee**. The envelope's back: "M — sab isme hai. Local thane mat le jaana." The lock screen: **47 Missed Calls**. | Two buzzes on wood. | — |
| 9.6–24.6 | The wedding on the dhol's beat: the lawn from the air, chandeliers under the tent, mehndi, the pheras fire, everyone dancing, sparklers, a twirl in the dark, the bride, an anar's sparks, the fire close, the farmhouse lit up from above. | The dhol, full, over the bed. | A WEDDING IN DELHI. / 21 NOVEMBER. |
| 24.6 | One white frame, then black. | The gunshot. The dhol muffled for a breath. Ears ring. A lone sarangi. | ONE BOY DIDN'T GO HOME. |
| 28.6–48.5 | On the cue's four hits: a station in the fog, rain on a Delhi road, a petrol pump at night, a man walking a dark street, the city under smog at dawn. | The cue; crickets; a dog. | HE WAS NINETEEN. / NO POLICE. / NO HOSPITAL. / NO BODY. / BY MORNING, IT NEVER HAPPENED. |
| 48.5–60.7 | A man in bed with the phone. **The game:** a call from +91 62••• •4417. Thumbs on the glass. **The game:** the LAPATA poster in WhatsApp. A woman on a balcony with her phone. **The game:** voice notes to M. Hands over a face. **The game:** the case file. **The game:** Low Battery, 9%. **The game:** Bhasin's chat. | The drive. Buzzes. A fan. | BUT SOMEONE KEPT THE PHONE. / AND NOW IT'S IN YOUR HANDS. / FIND OUT WHAT THEY DID. / THEY WANT IT BACK BY SEVEN. |
| 60.7–65.75 | Faster: a man by cars at night, rain, a flyover at speed, the Mumbai local, the poster, sparks, a street, the Photos grid, a silhouette at a window, a platform, a lit street. | A riser. The floor goes. | — |
| 65.75–68 | Black. | Silence. | EVERYONE HAS A VERSION. |
| 68–72.3 | Sparks, slowed and darkened. | The hit. | RAAKH · CHAPTER ONE |
| 72.3–76.6 | End card. | The second hit. | FOUND · A thriller you play on a phone · PLAY FREE |
| 76.6–80 | The game's lock screen lights once more in the dark. | A buzz. | — |

Twist safety: the parcel, the envelope and every chat are Episode 1 screens the game shows every player; no kada beyond the game's own opening frame, no reveal, no Room 6.

## Build

```bash
cd marketing/raakh-trailer/v7
node capture.mjs desktop && node capture2.mjs      # the real game, from the dev server on :3001
python3 edit.py cards && python3 edit.py shots && python3 edit.py final
python3 mix.py out/mix.wav                          # the soundtrack, -14 LUFS, with the continuity check
../v5/node_modules/ffmpeg-static/ffmpeg -y -i out/picture.mp4 -i out/mix.norm.wav -c:v copy -c:a aac -b:a 192k -shortest out/raakh-v7.mp4
```

- `capture.mjs` / `capture2.mjs` walk the chapter like a player (Begin, the cold open, the strip, the envelope, the phone, the apps) and screenshot each screen at 3840×2160.
- `edit.py` is the edit as data; `still()` pushes into a capture with zoompan inside the 2.39 band. It writes `marks.json`, which `mix.py` reads.
- `src/` holds the clips (Pexels, free for commercial use), `audio/` the music and effects (Pixabay), `game/` the captures. None are in git.

## Sources

**Footage** (Pexels IDs): 7702049, 6667254, 34431085, 38804596, 34187403, 29766220, 29028274, 7685157, 35764324, 18522875, 29217159, 15157547, 29277472, 30837748, 9481662, 35680723, 3795117, 30358172, 8070888, 34796502, 15083562, 8458497, 36498235, 9481660, 32031047, 38979012, 17812439, 6319109, 35778192, 10853328.

**Music** (Pixabay): "Dark Mystery Trailer (Taking Our Time)" by AlexGrohl; "Midnight Dhol Swagger" by TicTacToe; "Ethereal Raga: Deep Space Tanpura Drone" by MeditativeTiger; "Sarangi bowed Instrument" by Saseendran. **Effects** (Pixabay): vibrate on wood, ceiling fan hum, night crickets, distant dog, tinnitus, riser, sub drop, impact hit, sub boom, impact boom. The doorbell is synthesised. The gunshot is the game's own.
