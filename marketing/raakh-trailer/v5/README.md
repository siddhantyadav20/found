# RAAKH trailer v5: "47 Missed Calls" (draft)

12 Nov 2026. An 85-second landscape trailer, 1920×1080 at 24 fps, built from the game itself: its lock screen, its chats, its voice notes, its photos and clips, its sounds. No stock footage. The research it answers is in `../TRAILER-RESEARCH.md`.

Output: `out/raakh-v5.mp4` (H.264, AAC, −14 LUFS). Gitignored like every mp4 in `marketing/`.

## The form

The phone is the trailer. It sits on a dark desk and the camera punches into its screen the way *Searching* and *The Social Network* open inside the interface. Title cards keep v4's tracked capitals; the voices are the game's own, filtered as what they are (a call, a WhatsApp voice note), with English subtitles burned in. The score is made from the game's sounds: the dhol track until the gunshot, then a drone, the dhol's low thump slowed to a heartbeat, booms under the cards, the phone's buzz as the metronome, a riser, a drop, a hit.

Quarter, half, quarter: the wedding (0–18), the phone (23–53), the clock (53–69), then the title.

## Screenplay

| Time | Picture | Sound | Text |
|---|---|---|---|
| 0–3 | Black. The phone lights on the desk: lock screen, 47 Missed Calls, Mummy, Bhasin Uncle. A call comes in from +91 62••• •4417. | Two buzzes | — |
| 3–6.7 | The call is answered. | Raju: "Hello? Sameer bhaiya?… Dilip kahan hai?" | subtitled |
| 6.7–18.5 | Hard cut. Inside the phone: the pheras on Instagram, Kunal's video of Dilip holding the light, Kunal's video of the dance floor, every hand holding a phone up, the gun raised. | The dhol, full, from the cut | 21 NOVEMBER. BANYAN FARMS. / EVERY PHONE WAS RECORDING. |
| 18.5 | One white frame, then black. | The gunshot. The party carries on muffled for a breath, then ringing silence. | — |
| 19.9–22.6 | Black | Silence | ONE BOY DIDN'T GO HOME. |
| 23–33 | The LAPATA poster, "Forwarded many times". "Aap Sameer bhaiya ho na?" "Bhaiya, Dilip kahan hai?" Sameer's voice note to M, the waveform moving. | The drone breathes in; the heartbeat. Sameer: "Kal shaadi mein… Kunal firing kar raha tha. Ek ladka gir gaya." | — |
| 33–46 | Three cards on black, a boom under each, and between them: Sethi Caterers ("Bhasin sir settled Dilip's account"), Banyan Security ("turned on disappearing messages"), Bhasin ("talk to nobody"), the Locked chats, "maaf kar de". | Sameer: "Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya." | NO POLICE. / NO HOSPITAL. / NO BODY. |
| 46–50 | The desk: the phone at left, the case file at right filling itself in: "Dilip is a catering worker, last seen Banyan Farms, holding light for Sameer." | Meera: "Kuch delete mat karna." | — |
| 50–53 | Black | A soft boom | FIND OUT WHAT THEY DID. |
| 53–58 | Bhasin's voice note arrives and plays. | Bhasin: "Jiske paas bhi ye phone hai… Subah saat baje tak phone Gate 2 pe chhod dena. Baaki hum dekh lenge." | subtitled |
| 58–63 | The battery, 7 → 5 → 3. Mummy calling at 3:12 AM. | Buzzes; the heartbeat quickens | — |
| 63–68.6 | The night in the phone's own pictures, each cut shorter than the last: Kunal with the revolver, the empty lawn, Kunal's smeared frame, the fire, 47 Missed Calls, the varmala out of focus, LAPATA, the battery at 1. | A buzz on every cut, a riser, the floor goes | — |
| 68.6–72.6 | Black | Silence. Raju, quiet: "…zinda hai?" | …Is he alive? |
| 72.6–77.4 | Title, embers | The hit | RAAKH · CHAPTER ONE |
| 77.4–82.4 | End card | The second hit | FOUND · A thriller you play on a phone · CHAPTER ONE · PLAY FREE IN YOUR BROWSER |
| 82.4–85.5 | The phone lights once more, 4:40 AM, battery 1: "Mummy: Beta? Khana khaya?" | A buzz | — |

## Twist safety

- Nothing names the phone's owner beyond what Episode 1 shows ("Aap Sameer bhaiya ho na?", "Sameer bhaiya?").
- No kada appears: `jerrycan.jpg`, the selfie and the reel's second shot are not used. The reel is cut before the gun appears.
- No Room 6, no nurse, no Anita, no Dilip-weak, no reveal screen, no "aag maine lagayi". Bhasin's "Neelam ji keh rahi thi koi aur hai" is cut out of his voice note.
- "…zinda hai?" is a question, and the cards are all literally true of Sameer.

## Build

```bash
cd marketing/raakh-trailer/v5
npm i                                                   # playwright-core, ffmpeg-static
python3 mix.py node_modules/ffmpeg-static/ffmpeg out/mix.wav   # the soundtrack (needs numpy)
node render.mjs --out out/picture.mp4                   # the picture, ~3 minutes
node_modules/ffmpeg-static/ffmpeg -y -i out/picture.mp4 -i out/mix.norm.wav -c:v copy -c:a aac -b:a 192k -shortest out/raakh-v5.mp4
node render.mjs --stills 1,8,24,48.5,72.6               # single frames, into stills/
```

- `timeline.js` is the edit as data: every mark the picture and sound share, the montage, the cards, the subtitles. `mix.py` reads it, so the two cannot drift.
- `trailer.html` + `trailer.js` draw any second of the trailer on demand: the phone (lock screen, call, Instagram, WhatsApp media viewer and chats, Locked chats), the case file, the cards, the title, the end card, grain, embers.
- `render.mjs` serves the repo root, drives the page through headless Chrome and pipes JPEG frames into ffmpeg.
- `frames/` are the game's clips (`public/found/raakh/clip-*.mp4`) cut to 24 fps stills, so a frame is exact.
- `fonts/` are the product's web fonts, fetched once from Google Fonts, plus Neue Brücke from `app/fonts`.

## Sources

Everything is the game's own: `public/found/raakh/*`, `public/found/raakh-wallpaper.jpg`, `public/voices/raakh/*` and `public/sfx/*`. The score is synthesised in `mix.py`. Nothing needs a licence beyond what the game already has.
