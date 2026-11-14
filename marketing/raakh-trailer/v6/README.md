# RAAKH trailer v6: "Everyone has a version" (draft)

13 Nov 2026. A 74-second landscape trailer, 1920×1080 at 24 fps, picture in a 2.39:1 scope frame. Real footage throughout; the game appears as short full-frame inserts and, once, composited onto a real phone on a real nightstand. It answers `../TRAILER-V6-BRIEF.md`.

Output: `out/raakh-v6.mp4`, copied to `marketing/raakh-trailer-v6-draft.mp4` (with a 720p copy). Gitignored like every mp4 in `marketing/`.

## The form

A film about a phone, not a phone. Light in every shot: fairy lights, sparklers, a screen, a street lamp, a fire. The grammar is v4's (tracked-capital cards, a warm first act cut on the dhol, the gunshot to black, the drop before the title), but the middle is now the flat at 3 AM with the game's own screens cut in from hands and faces, never longer than 1.5 seconds. Total UI on screen: about 9 seconds.

No voices in this draft. The voice-note slots (after "A boy fell", and Bhasin's deadline) are left for a real recording; the cards carry the premise until then.

## Screenplay

| Time | Picture | Sound | Card |
|---|---|---|---|
| 0–2.3 | A hand leaves a phone on a nightstand. It lights up: the game's lock screen, **47 Missed Calls**, then a call coming in. (Composite.) | A fan. Two buzzes on wood. A thread of tanpura. | — |
| 2.3–3.6 | A man's face, lit by the screen, reading. | | — |
| 3.6–18.6 | The wedding, cut on the dhol's beat: the venue from the air, the bride's hands, sparklers, the dance floor, every phone held up at the aarti fire, a boy with a sparkler, fireworks over the city, the boy closer. | The dhol, full. | A WEDDING IN DELHI. / 21 NOVEMBER. / EVERY PHONE WAS RECORDING. |
| 18.6 | One white frame, then black. | The gunshot. The dhol muffled for a breath. Ears ring. | — |
| 19.6–22.2 | Black. | A lone sarangi. | ONE BOY DIDN'T GO HOME. |
| 22.6–42.5 | On the cue's four hits: a figure walking into fog, a roadside with a car leaving, a fire in a field from above, silhouettes watching a pyre, ash. | The cue begins; a tanpura under it; crickets, a dog, fire. | HE WAS NINETEEN. / NO POLICE. / NO HOSPITAL. / NO BODY. / BY MORNING, IT NEVER HAPPENED. |
| 42.5–57.4 | The flat: a hand reaches for the phone; a thumb on the glass; **insert: 47 Missed Calls**; a face lit by a screen; thumbs through chats; **insert: the LAPATA poster**; typing; **insert: "turned on disappearing messages"**; a woman's face in the dark; **insert: the case file filling in**; **insert: the battery, 7, 5, 3**; a silhouette at a laptop. | The drive. Buzzes. A fan. | BUT SOMEONE KEPT THE PHONE. / AND NOW IT'S IN YOUR HANDS. / FIND OUT WHAT THEY DID. / THEY WANT IT BACK BY SEVEN. |
| 57.4–59.75 | Faster: headlights in a wet street, police lights, fire, embers, the lock screen, headlights, flames, the poster, the boy. | A riser. The floor goes. | — |
| 59.75–62 | Black. | Silence. | EVERYONE HAS A VERSION. |
| 62–66.3 | Embers rising. | The hit. | RAAKH · CHAPTER ONE |
| 66.3–70.6 | End card. | The second hit. | FOUND · A thriller you play on a phone · PLAY FREE |
| 70.6–74 | A message lands on a phone in the dark. | A buzz. The fan. | — |

Twist safety: nothing names the phone's owner beyond Episode 1's chats; no kada, no reveal, no Room 6; the cards are all literally true of Sameer.

## Build

```bash
cd marketing/raakh-trailer/v6
node inserts/render-inserts.mjs            # the game's screens, each a short clip (uses v5's compositor)
python3 edit.py cards                      # the title cards (headless Chrome)
python3 edit.py comp                       # the nightstand composite (numpy homography)
python3 edit.py shots && python3 edit.py final
python3 mix.py out/mix.wav                 # the soundtrack, -14 LUFS
../v5/node_modules/ffmpeg-static/ffmpeg -y -i out/picture.mp4 -i out/mix.norm.wav -c:v copy -c:a aac -b:a 192k -shortest out/raakh-v6.mp4
```

- `edit.py` is the edit as data: the grid (dhol beat 0.716 s from 3.6 s; the cue's hits from 22.6 s), every shot with its source, in-point, speed, grade and framing, the montage, the cards, and the composite's screen corners. It writes `marks.json`, which `mix.py` reads, so picture and sound share one clock.
- `inserts/` is v5's compositor with a list of short screen inserts instead of a timeline.
- `cards.html`/`cards.mjs` are v4's title cards with Newsreader for the tagline.
- `src/` holds the stock clips (not in git), `audio/` the music and effects (not in git), `prev/` the preview copies used to choose.

## Sources and licences

**Footage**: Pexels (free, commercial use). IDs: 35999376, 36017452, 6415082, 38804641, 11122323, 7685157, 35008225, 30077981, 13953530, 4824123, 34602730, 17735952, 33287257, 11792115, 28780676, 33644260, 38328417, 6383997, 33942937, 5281602, 28828935, 39494839, 6346221, 20563164, 36920052, 10385802, 5509723, 33780144, 13643105, 12165393, 12298312, 34786878. More downloaded and not used are listed in `src/hd.txt` and `src/hd2.txt`.

**Music** (Pixabay Content License): "Dark Mystery Trailer (Taking Our Time)" by AlexGrohl; "Midnight Dhol Swagger" by TicTacToe; "Ethereal Raga: Deep Space Tanpura Drone" by MeditativeTiger; "Sarangi bowed Instrument" by Saseendran.

**Sound effects** (Pixabay): iPhone vibrate on wood table, ceiling fan hum, night atmosphere with crickets, big dog bark distant, fire crackling, tinnitus, riser wildfire, deep sub drop, cinematic impact hit, sub bass boom, cinematic impact boom. The gunshot is the game's own (`public/sfx/found-shot-1.m4a`).

## What this draft still needs

1. A real voice: three Hinglish lines as a voice note, recorded on a phone, in the two slots above.
2. Your own six shots (the brief's section 6) to replace the stock flat: the nightstand, the hand, the face, the thumb on the real game, the laptop, the last buzz.
3. A watch with sound. I cannot hear it; the mix was built by levels and spectrogram.
