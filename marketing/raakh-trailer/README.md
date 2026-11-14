# RAAKH: trailer v4, "Every phone was recording" (draft)

v4 replaces v3. It's a 72-second widescreen trailer: 1920×1080 at 24 fps, with the picture in a 2.39:1 frame.
It uses real HD footage only, no game stills and no voice clips.
Title cards tell the story, and the music and sound design carry it.
The video is `marketing/raakh-trailer-v4-draft.mp4` (117 MB, mixed to −14 LUFS). It's gitignored like every mp4 in `marketing/`.

## The form

It's built the way card-led prestige thriller trailers are, such as Fincher's *Gone Girl* and *The Girl with the Dragon Tattoo*:

- short title cards in wide-tracked capitals, one idea each;
- a warm first act cut on the beat;
- one hard sound event (the gunshot), then black;
- a cold second half cut to the score's own hits;
- a fast montage, then dead silence before the title.

## Screenplay

| Time | Picture | Card | Sound |
|---|---|---|---|
| 0–18 | A wedding venue from the air at night, the party, sparklers, a dance floor, a boy with a sparkler, phones held up filming, fireworks over the city | A WEDDING IN DELHI. / EVERYONE WAS DANCING. / EVERY PHONE WAS RECORDING. | A dhol wedding track, cut on its beat |
| 18.1 | Hard cut to black | — | One gunshot. Ears ring, and the party carries on muffled, then true silence. |
| 19–21 | Black | ONE BOY DIDN'T GO HOME. | Silence |
| 21–34 | A figure walks into fog, a roadside at night, an empty road | HE WAS NINETEEN. / NO POLICE. / NO HOSPITAL. | The score begins: four slow booms, one cut on each |
| 34–41 | Figures around a pyre, someone watching it burn, ash | NO BODY. / BY MORNING, IT NEVER HAPPENED. | Fire, and the score builds |
| 41–53 | A hand reaching for a phone, a phone on envelopes waking, a face lit by a screen, chats, a message landing, typing, 5:00 AM | BUT SOMEONE KEPT THE PHONE. / AND NOW IT'S IN YOUR HANDS. / UNLOCK IT. / READ EVERYTHING. / FIND OUT WHAT THEY DID. / THEY WANT IT BACK BY SEVEN. | The drive |
| 53–58 | 14 shots of the night, each cut shorter than the last | — | The drive |
| 58–60 | Black | EVERYONE HAS A VERSION. | The score drops out |
| 60.4 | Ash | RAAKH · CHAPTER ONE | The hit |
| 64.7 | End card | FOUND · *A thriller you play on a phone.* · PLAY FREE IN YOUR BROWSER | The second hit |
| 69–72 | A phone lights up in the dark | — | It buzzes |

## Twist safety

- No card names the phone's owner.
- "Someone kept the phone" and "it's in your hands" are both literally true of Sameer.
- No game art is used, so no kada appears.

## Build

The build files are in this folder:

- `v4-edit.py` is the edit as data. It cuts, slows and grades each shot with ffmpeg, then composites the cards, grain and frame.
- `v4-mix.py` builds the sound.
- `v4-cards.html` and `v4-cards.mjs` render the title cards.

The footage is not in the repo.

## Sources and licences

**Footage** comes from Pexels (free, commercial use). Pexels IDs by section:

| Section | Clips |
|---|---|
| Wedding | 38804641, 4174213, 7685044, 30077981, 4824123, 35008225, 13953530, 17735952, 33287257 |
| Night | 11792115, 28780676, 28928755, 38328416, 38328417, 6383997 |
| The phone | 35999376, 7821643, 5281602, 28828935, 34786878, 39494839, 7924639, 1190185 |
| Montage | 10385802, 31153703, 11839716, 9085510, 34703788, 10597765, 13643105, 5509723, 6580999, 12165393, 7948198, 854309 |

**Music** comes from Pixabay (Pixabay Content License):

- "Dark Mystery Trailer (Taking Our Time)" by AlexGrohl;
- "Midnight Dhol Swagger".

**Sound effects:**

- Mixkit: 563, 3111;
- the game's own gunshot, fire and buzz from `public/sfx`.

---

# (previous) RAAKH: trailer v3, "It's all on the phone" (draft)

This is a 75-second vertical trailer, 1080×1920 at 24 fps, mixed to −14 LUFS with English subtitles throughout.
It's built for Reels and Status, where it starts muted.
The video is `marketing/raakh-trailer-v3-draft.mp4`, which is gitignored like every mp4 in `marketing/`.

## What it learned from

| Reference | Award | What we took |
|---|---|---|
| Weapons, "Beware" (Mark Woollen & Associates) | Golden Trailer Awards 2026, Best Thriller | One calm storyteller tells the whole premise in order. Long, patient holds, broken by strobe bursts. |
| undertone (A24) | Best Sound Editing, "Silence" | The opening talks straight to the viewer, and the sound carries the story while the picture holds still. |
| Searching (Sony) | — | The screen is the world: full-frame UI, with punch-ins on single details. |
| Limetown | — | Found audio: real voices on phones and voice notes, never a narrator. |

## The form

- The phone fills the screen. When we're inside it, it's your phone.
- The world plays in a cinematic 4:5 window. The chapter stills are barely upscaled there, and subtitles live in the clean band below.
- The storyteller is Sameer's undelivered voice notes to M. They play whole and unedited.
- Real sparks, fog, embers and flame are layered over the stills, with a handheld drift, flicker, halation and grain. That stops them reading as a slideshow.

## Cut

| Time | Section | What happens |
|---|---|---|
| 0–6 | Cold open | Your phone buzzes awake, with 47 missed calls and an incoming call. "Hello? Sameer bhaiya?… Where's Dilip?" |
| 6–15 | The parcel | RETURN TO ORIGIN. M: "Listen. Don't delete anything. Anything." |
| 15–28 | The voice note | "M… I know you won't reply. Last night, at the wedding… Kunal was firing. … A boy fell." Then a hard cut to silence. |
| 29–42 | Who he was | Dilip's audition: "My name is Dilip Kumar Mahto… I can hold light. I can do anything." Raju: "Every day he'd ask, Mumbai's for real, right?" |
| 42–51 | What they did | "They didn't take him to a hospital. Bhasin didn't let anyone go. They burned him, M." |
| 51–58 | The clock | Bhasin: "Whoever has this phone… leave it at Gate 2 by seven." A strobe burst that cuts faster and faster. |
| 58–64 | Silence | "…is he alive?" Then: "If anything happens to me… it's all on the phone." |
| 64–75 | Title and button | RAAKH. Then, in the dark: "I lit the fire." End card. |

## Twist safety

- No image shows the kada, so raakh-planner, the hand stills and the reel's second shot are all left out.
- The tagline is "A thriller you play on a phone." It is not "somebody else's phone".

## Build

Everything is in this folder:

- `v3-timeline.js` is the edit as data.
- `v3-trailer.html` is a canvas compositor.
- `v3-render.mjs` renders through headless Chrome (muted) into ffmpeg.
- `v3-mix.py` builds the sound.
- `v3-prep.py` extracts the frames.

The v2 build files (16:9) are kept beside them.

## Sources and licences

- **Stills:** the game's own art in `public/found/chapters` and `public/found/game`.
- **Game clips:** `public/found/raakh`.
- **Voices:** `public/voices/raakh`.
- **Overlays and strobe footage:** Pexels (free, commercial use).
- **Music and sound effects:** Mixkit (free licence).
  - Music: 188 "Echoes", 680 "Epical Drums 05".
  - Sound effects: 563, 3111, 632, 1059, 494, 1446, 2385, 3081.
- **Game sound effects:** `public/sfx`.
