# Found — Chapter One assets (ROADMAP S11)

Everything *Shagun* needs that has to be **made**, not coded. One row per
asset: the beat it serves, where it plugs in, what stands in for it until it
arrives, and its status. The chapter is built to play on placeholders; each
asset replaces one without any other change.

**Rules for all of it** (CHAPTER1 L, PLAYER-JOURNEY Part 3): no real
person's face, voice or name; actors and releases for everything; every
brand in the crime is ours (SK Films, Sehgal Enterprises, Banyan Farms,
Shield Liaison Services, Sethi Caterers, Lifeline Hospital, Paytap, ZipEMI,
Rangmanch Productions). **Nothing graphic, ever:** no wound, no body, no
blood on any frame.

**Things that are plot and must survive every take:**
- **The silver kada** on Sameer's right wrist: in his Instagram selfies, in
  the 12:29 photo, and in the 22 reverted seconds of the fire clip. It's how
  the player knows the hands are his.
- **Dilip's face** must match between the 9:48 PM portrait and the poster,
  at phone size.
- **The LED panel** Dilip holds is in the 12:29 photo, and in Kunal's frame
  (Hidden).
- **Timestamps** in every clip's and photo's metadata match CHAPTER1 C to the
  minute.

Status: ⬜ not started · 🟨 in progress · ✅ delivered and swapped in

---

## 1. Photographs — the Sehgal wedding (one cast shoot)

A real-looking North Indian wedding at night: fairy lights, marigolds, a
dance-floor lawn and a back lawn with trees. One evening, a small cast.

| Asset | Beat | Placeholder | Status |
|---|---|---|---|
| **~40 wedding frames** for the Sehgal album (baraat, pheras, family, décor, candids). The album says 1,284; these repeat | Ep 1 his work | Titled cards | ⬜ |
| **Dilip's portrait, 9:48 PM**: waistcoat, tray, fairy lights, smiling at the lens, shallow focus. Sameer's best photograph of the night | Ep 1 beat 6; Q2; Ep 2 the promise | Titled card | ⬜ |
| **12:29 AM, Kunal's photo**: Sameer holding the revolver (a prop, obviously handled safely), Dilip beside him with an LED panel, the back lawn, a phone on a tripod | Ep 2 Q5 | Titled card | ⬜ |
| **Kunal's frame** (the family's evidence): Sameer's arm coming down, a flash, Dilip behind the light. **The frame stops before anything happens to him.** Screenshotted, with the WhatsApp chrome | Ep 3 Hidden | Titled card | ⬜ |
| **SK Films' Instagram grid**: 12 of his best, plus 3 selfies with the kada | Ep 1 Q1 | Titled cards | ⬜ |
| **Raju's profile photo** at Chhath, Samastipur, and **Dilip at home** (Raju sends it in A) | Ep 1; A | Titled cards | ⬜ |
| **Sameer's lock-screen wallpaper**: one of his own night shots from a wedding, the kind a photographer keeps as his best | Every screen of his phone | Generated fairy lights (`public/found/shagun-wallpaper.jpg`) | 🟨 |

## Stock stand-ins (2026-09-26)

Until the shoot, frames with **no character's face in them** use free
photographs from Pexels, saved at 900 px wide in `public/found/shagun/`.
The [Pexels licence](https://www.pexels.com/license/) allows free use,
including commercial use, with no attribution. It forbids showing
identifiable people in a bad light, so no stock photo stands in for Dilip,
Sameer, Kunal, Nitin, the Sehgals or the couple's faces. Those stay titled
cards until the shoot, or generated fictional people. **Never use a found
photo of a real person**, from Google or anywhere else.

| File | Stands in for | Source |
|---|---|---|
| `w-0.jpg` | The mandap going up, marigold strings (4:40 PM) | [Pexels 36652869](https://www.pexels.com/photo/36652869/) |
| `w-1.jpg` | Ishita's hands, mehendi | [Pexels 29092945](https://www.pexels.com/photo/29092945/) |
| `w-8.jpg` | The buffet, steam off the tandoor | [Pexels 32558924](https://www.pexels.com/photo/32558924/) |
| `w-blur.jpg` | The varmala, out of focus (the bin) | [Pexels 34724759](https://www.pexels.com/photo/34724759/) |
| `reel-take.jpg` | The reel take's poster: bulbs in the back lawn's trees | [Pexels 35372396](https://www.pexels.com/photo/35372396/) |
| `fire.jpg` | The fire clip's poster, 4:47 AM: logs, smoke, fairy lights behind. No body | [Pexels 28181582](https://www.pexels.com/photo/28181582/) |

**Withdrawn 2026-10-01** (the review): four frames read as a Western concert
or club, not a Delhi farmhouse wedding, and Indian players would clock them at
once. The sangeet floor (`w-11`, a blue-lit concert crowd), the confetti
cannons (`w-14`, a concert), the dance floor (`w-dance`, a nightclub) and the
pheras (`w-pheras`, a steel fire pit on tarmac, with no havan kund; it was
also his Instagram's first post, right before the fire clip). They're titled
cards again until replacements are approved. What to look for: a sangeet
floor under marigold and fairy-light canopies, a dhol-led dance floor, a
havan kund in a mandap; no identifiable faces.

Still titled cards, because each shows a character or no stock fits: the
cousins, the groom on the mare, the dhol players at the gate, the varmala,
the couple on stage, the shagun envelope (stock only has Chinese red
envelopes), the waiters, Mrs Sehgal, Kunal's friends, Nitin on B cam, the
empty mandap at midnight, the baraat twice, the couple, the family, **Dilip's
portrait**, **the 12:29 photo**, his selfies with the kada, and Raju's
photographs.

## Generated frames (2026-10-17)

Fictional people, generated with Figma's image AI (Gemini 3.1 Flash Image)
in the file "Found · Shagun photographs", then saved at 760 px in
`public/found/shagun/`. No real person's face; nothing graphic. Characters
are held to one description each (Sameer: lean, messy hair, stubble, black
shirt, **the silver kada on his right wrist**; Dilip: slim, side-parted hair,
faint moustache, maroon waistcoat; Kunal: gelled hair, beard, gold chain,
ivory bandhgala; Nitin: backwards cap, black tee, gimbal).

| File | Is |
|---|---|
| `w-portrait.jpg` | Dilip's 9:48 PM portrait, CHHOTU on the badge (the zoom sits on it) |
| `bts.jpg` | The 12:29 photo: Sameer with the revolver raised, Dilip on the LED panel, the tripod |
| `w-kunal.jpg` | Kunal at 12:20, the revolver beside his face |
| `w-12.jpg` · `w-13.jpg` | Kunal and friends with the bottle · Nitin on B cam |
| `w-family.jpg` · `w-couple.jpg` · `w-pheras.jpg` | The Sehgals on stage, Kunal at the end · the couple · the pheras (`wide`) |
| `ig-selfie.jpg` · `ig-crew.jpg` | His kada selfie · the crew, arms round Nitin and Dilip |
| `poster-dilip.jpg` | The LAPATA poster's photo: a grayscale crop of the portrait, so they match |
| `kunal-frame.jpg` | Kunal's frame: the 12:29 set-up a breath later, motion-smeared, mid-flash |

More Pexels stand-ins (faceless, or not a character): `w-baraat.jpg`
([24334592](https://www.pexels.com/photo/24334592/)), `w-twice.jpg` (a crop
of the same, the horse's head in the way), `w-15.jpg`
([14395559](https://www.pexels.com/photo/14395559/)), `ig-haldi.jpg`
([35508916](https://www.pexels.com/photo/35508916/)), `ig-mirror.jpg`
([25811159](https://www.pexels.com/photo/25811159/)), `ig-drone.jpg`
([7605172](https://www.pexels.com/photo/7605172/)).

**Album frames with no photograph are no longer on the phone** (a drawn card
among photographs read as a storyboard): the cousins, the groom on the mare,
the dhol players, the varmala, the couple on stage, the envelope changing
hands, the waiters' line, Mrs Sehgal, the sangeet floor, the confetti, the
dance floor. They come back as each is generated. **Still to generate**
(Figma's credits ran out after ten; they reset daily at 05:30 IST): those,
and **Raju's photo of Dilip at Chhath** (the ending's last image is a
lit placeholder until it exists).

## Last Local (2026-10-18)

Faceless stock from Pexels, recompressed into `public/found/lastlocal/`:

| File | Pexels | Used |
|---|---|---|
| `wallpaper.jpg` | [13074008](https://www.pexels.com/photo/13074008/) Sea Link at night, cropped | Her lock and home screen |
| `sea.jpg` | [33948766](https://www.pexels.com/photo/33948766/) | Photos: Marine Drive, Friday night |
| `dadar.jpg` | [39355049](https://www.pexels.com/photo/39355049/) | Photos: Dadar, platform 4, 12:41 AM |
| `site.jpg` | [35886615](https://www.pexels.com/photo/35886615/) | Photos: a building site at dusk |
| `door.jpg` | [11555845](https://www.pexels.com/photo/11555845/) | The locked note's recording, through a door |

**Still to make:** Rubina at sixteen (`rubina.jpg`, a generated fictional
face; then restore `src` on the attachments i-15 and i-20).

## Sound (2026-10-17)

CC0 recordings from Freesound, cut by `scripts/build-samples.mjs` from
`samples-src/` (git-ignored) into `public/sfx/`. Sections were picked off a
measured loudness envelope; levels are set in `samples.config.mjs` and
`lib/found/nightSound.ts` and should be checked by ear.

| Cue | Source | Used |
|---|---|---|
| `found-dhol` | [418780](https://freesound.org/s/418780/) "Indian Wedding Dhols", 0:30–0:42, looped | The cold open (far off), Kunal's clip (close), the reel take (far) |
| `found-shot` | [386745](https://freesound.org/s/386745/) handgun shot | The cold open's flashes; "[two shots]", "[one shot]" in clips |
| `found-laugh` | [337795](https://freesound.org/s/337795/) small group laughter | "[laughter]", "[cheering]" |
| `found-fire` | [637523](https://freesound.org/s/637523/) campfire, 0:04–0:14, looped | Both fire clips |
| `found-train` | [525058](https://freesound.org/s/525058/) Mumbai local interior, 0:21–0:33, looped | Last Local: the cold open (close) and under the whole phone (low) |

"[recording stops]" cuts every sound dead: the reel's second shot is never
heard. **Voices are still captions:** no human-sounding Hindi speech can be
made here. Linking Figma to Weave (app.weavy.ai › Profile) would allow
generated voices; VOICE-SCRIPTS.md has every line for actors.

## 2. Video — short clips, not a call

H.264 MP4, 480p and 360p, each clip with a poster frame and captions.

| Asset | Length | Beat | Placeholder | Status |
|---|---|---|---|---|
| **Kunal's 11:52 clip**: dance floor, dhol, Kunal fires two rounds into the air, cheering, phone-shot and vertical | 0:14 | Ep 2 Q6 | Still + captions | ⬜ |
| **The reel take, 12:31**: tripod, back lawn, Sameer fires once, straight up, laughs, walks toward the lens; ends abruptly | 0:14 | Ep 2 Q6–Q7 (Recently Deleted) | Still + captions | ⬜ |
| **The fire, 4:47 AM**: the full 31 s, of which the game first shows the last 9. First 22 s: Sameer's voice (*"Bhasin sir, yahan?"*), his hands and the kada, a jerrycan, walking. Last 9 s: orange light on a brick wall, smoke, crackle, *"Jaldi karo."* **No body in any frame.** | 0:31 | Ep 1 beat 10; Ep 3 Revert | Still + captions | ⬜ |

## 3. Voices

AAC/M4A mono, 64 kbps. Every line already has its transcript and English in
CHAPTER1; keep delivery to the words written there.

**The recording scripts, one section per actor, are in [VOICE-SCRIPTS.md](VOICE-SCRIPTS.md)** (2026-09-26).

| Asset | Beat | Placeholder | Status |
|---|---|---|---|
| **Sameer's four voice notes to M** (Sun 9:40 AM, Sun 11:20 PM, Mon 2:05 AM, Wed 10:15 PM): tired, fast, Delhi Hinglish. *They have to make players trust him* | Ep 1 beat 9 | Transcripts | ⬜ |
| **The memo, Mon 4:58 PM**: *"Pehli camera ke liye thi. Doosri… main pose kar raha tha. Mujhe laga khaali hai."* Barely spoken | Ep 2 beat 6 | Transcript | ⬜ |
| **Raju on the phone**: Hindi with a Bihari lilt, a rider on a road | Ep 1 beat 3 | Captions | ⬜ |
| **Kunal's clip and the reel take's audio**: the dhol, the shots (distant, not cinematic), laughter | Ep 2 | Captions | ⬜ |
| **Mummy** (a voice note, optional) | Ep 1 | Text | ⬜ |

## 4. Handwriting and paper

| Asset | Beat | Placeholder | Status |
|---|---|---|---|
| **The Sehgal shagun envelope**: maroon and gold foil, *"Ishita weds Rohan · Sehgal Parivar · 22.11"*, and on the back, in Sameer's quick ballpoint: *"M — Sab isme hai. Local thane mat le jaana. Bhasin ke log wahan baithe hain. — S"* Photographed front and back | Arrival (CHAPTER1 O2) | Drawn envelope (maroon, gold foil, a cream panel on the back) and a ballpoint-style hand | ⬜ |
| **The LAPATA poster**: a phone-made missing-person poster, Hindi and English, Dilip's photo, Raju's number, *"last seen Sat 22 Nov, Chhattarpur"* | Ep 1 beat 7 | Styled card | ⬜ |

## 5. Documents

| Asset | Beat | Placeholder | Status |
|---|---|---|---|
| **Invoice SK-1127** (SK Films → Sehgal Enterprises, 3 Nov, balance ₹1,80,000 on delivery) | Ep 1 Q1; QM | Text | ⬜ |
| **The Rangmanch offer letter** (second-unit DOP, joining Mon 1 Dec) | Ep 1 beat 5 | Text | ⬜ |
| **The Banyan Farms site plan** the planner sent for the shot list: dance lawn, back lawn, service room, service gate on Mandi Road, the back plot and tube well | Ep 3 Q10 | Drawn plan | ⬜ |
| **Vicky's live location** (Nitin's screenshot), 1:38–2:06 | Ep 3 Nitin route | Drawn map | ⬜ |

## 6. What's final in code (no asset needed)

His iPhone and every app on it, your phone, the case file and the record,
the board, the endings' acts and the end card, the share images.

---

*Retired with the pivot:* every asset row for *Don't Cut the Call* (the
Crime Branch shoot, Vasu's voices, her diary). See git history at `1de34a2`.
The old wallpaper went with S5: Sameer's lock screen is now a generated
placeholder, `public/found/shagun-wallpaper.jpg` (fairy lights at night),
until his real one is shot. `scripts/prep-photos.mjs` is the retired
chapters' photo pipeline and still names the old file; S11 re-points it.

## Raakh frames and voices (2026-10-23)

**Generated** with Figma's image AI (Gemini 3.1 Flash Image / Flash Lite) in
the file "Found · Raakh photographs" (figma.com/design/Z7NmlD9DUHAJXORvVpmc2w),
fictional people only, nothing graphic, saved under `public/found/raakh/`:

| File | Is |
|---|---|
| `dp-meera.jpg` | Meera's profile photo (a crop of her portrait at a Kalkaji café) |
| `dilip-chhath.jpg` | Raju's photo of Dilip at Chhath, the Complete Record's last image |
| `w-3.jpg` · `w-4.jpg` · `w-5.jpg` · `w-9.jpg` · `w-11.jpg` | The groom on the mare · dhol at the gate · the varmala · the waiters' line · the sangeet floor |
| `key-lawn.jpg` | The empty back lawn after midnight: the site's key art for Raakh |
| `x-*.jpg` | Instagram Explore: Ladakh, biryani, Old Delhi chai, Goa, gully cricket, Bengaluru rain |

**Crops** of existing frames for profile photos: `dp-sameer` (ig-selfie),
`dp-kunal` (w-kunal), `dp-nitin` (w-13), `dp-dilip` (w-portrait),
`dp-bhasin` (w-family, the father on the left), `dp-ishita` (w-couple).

**Voices**: `public/voices/raakh/*.m4a`, 59 recordings (voice notes, memos,
clips, every call line and answer, the cold open), built by
`scripts/voices.py` from `scripts/voices.raakh.json` with Microsoft's neural
voices via edge-tts (hi-IN Madhur at different pitches and paces for Sameer,
Bhasin, Dilip and the guard; Brian and Andrew Multilingual for Kunal and Raju;
hi-IN Swara for Meera), filtered per kind (call, voice note, memo, phone
clip) and timed to the captions. `content/raakh/voices.ts` maps each to its
key. Stand-ins until the cast is recorded: VOICE-SCRIPTS.md still has every
line for actors. To rebuild: `python3 -I scripts/voices.py <edge-tts> <work dir>`.

## Seven o'clock: footage and the living witness (2026-10-24)

**Generated** in the same Figma file, fictional people only, nothing graphic:

| File | Is |
|---|---|
| `public/found/raakh/fire-mattress.jpg` | The fire before dawn: a mattress, sheets and clothes burning on the back plot, no body. The poster for the fire clip and the whole fire (replaces `fire.jpg`, a bonfire of logs that contradicted the twist) |
| `public/found/raakh/nurse-bag.jpg` | Sister Anita's photo from Dilip's number: his belongings bag, the maroon waistcoat with its badge, the cracked phone |
| `public/found/raakh/dilip-awake.jpg` | Raju's last photo when Dilip is saved: awake, his hand in his brother's |
| `public/found/raakh/dp-raju.jpg` | Raju's profile photo (his chat, the seven o'clock calls) |
| `scripts/frames/raakh/*.jpg` | Clip frames, not deployed: `reel-1/2/3` (the tripod take: the light, the pose with the gun, the arm coming down), `kunal-fire` (the dance floor, a shot in the air), `gravel`, `jerrycan` (the hand with the silver kada), `fire-mattress` |

**Video**: `public/found/raakh/clip-{reel-take,k-3,fire,fire-whole}.mp4`,
540×960 H.264 at 420kbps with AAC, built by `scripts/clips.py` (mixes the
wedding or the fire from `public/sfx`, the shots and the voices at the
seconds the captions give) and `scripts/clip.swift` (slow moves over the
frames per `scripts/clips.raakh.json`, a shake, muzzle flashes). Compile the
Swift once (`swiftc -O scripts/clip.swift -o <clip tool>`), then
`python3 -I scripts/clips.py <work dir> <clip tool>`. A frame that doesn't
exist yet stands in with an older one (`STAND_IN`). In the phone, `film` on a
video plays the mp4 and the captions follow it (`components/owner/ios/Clip.tsx`).

**Drawn, not photographed**: the parcel on your table and what came out of
it (the table, the kraft mailer, the waybill and stamp, the torn mailer, the
phone face down) are CSS (`components/stage/Parcel`, `Note`), so they hold at
any size without a photograph.

**Voices** added for the too-late moments: the Chhattarpur SHO, Sister Anita
and Raju (`moment:late-*` in `scripts/voices.raakh.json`).

## Trailers (2026-10-24, second pass)

`scripts/trailers.py` builds both, with `scripts/card.swift` (title cards: Mac
system fonts on black) and `scripts/clip.swift` (picture, now with `still`
shots and a `bitrate`):

| File | Is |
|---|---|
| `marketing/lastlocal-teaser.mp4` | Chapter 2's teaser, 10 s, 540×960. Not committed, and not on the end card: held back on 2026-10-24 (Siddhant didn't want the trailers shipped). `Story.next.trailer` still plays one if it's set. |
| `marketing/raakh-trailer.mp4` | Raakh's trailer, 56 s, 1080×1920 at 3.5 Mbps. Not committed and not shipped (held back on 2026-10-24). |
| `scripts/frames/lastlocal/seat.jpg`, `walker.jpg` | Generated frames for the teaser (Figma). |

Run: `python3 -I scripts/trailers.py <work dir> <clip tool> <card tool> <edge-tts>`.

`public/found/raakh/reel-take.jpg` is now the real tripod frame (reel-1), not
the fairy-light stand-in. `public/voices/raakh/ending-dilip-thanks.m4a` is
Dilip's last voice note. VOICE-SCRIPTS.md is generated by
`scripts/voice-scripts.py`.
