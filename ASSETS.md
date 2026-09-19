# Found — Chapter One assets (ROADMAP P11)

Everything *Don't Cut the Call* needs that has to be **made**, not coded. One
row per asset: the beat it serves, where it plugs in, what stands in for it
now, and its status. The game is complete and playable on the placeholders;
each asset replaces one without any other change.

**Rules for all of it** (CHAPTER1.md G6, PLAYER-JOURNEY Part 3): no real
person's face, voice or name; actors and releases for everything; nothing
from a real police force, bank or courier (PikDrop, SkyEx, City Desk, Lotus
Park, Skyline Overseas and "RBI Secure KYC" are ours). **Two things are plot
and must survive every take:** Sahil's wall clock reads **Myanmar time**, one
hour ahead of Mumbai, and the extinguisher's label is **Burmese**. Both must
be unreadable at 1× and unarguable at 3× zoom.

Status: ⬜ not started · 🟨 in progress · ✅ delivered and swapped in

---

## 1. Video — the call (the biggest single asset)

A painted "Mumbai Police · Crime Branch" set: a board, a flag, a wall clock,
a desk, and a red extinguisher in the corner of frame. Shot like a bad 4G
call: fixed webcam, soft, a little behind itself.

| Asset | Beat | Plugs into | Placeholder now | Status |
|---|---|---|---|---|
| **Sahil, idle loops** (~12 min): typing, drinking water, glancing off-camera, reading from paper | The whole of Ep 1–2: he must feel alive while idle | `components/call/CallFeed.tsx` (the `<svg>` scene) | Drawn figure | ⬜ |
| **~40 cue lines**, one clip each, matching `content/dont-cut-the-call/*.ts` `cues` | Every captioned line (ids: `open`, `whisper`, `script`, `idle-*`, `after-*`, `ep2-*`, …) | `CallCue.clip` (field exists, unused) | Captions only | ⬜ |
| **The whisper**: "Mat kaatna… please." Leaning in, nobody behind him | Ep 1, reaching for the red button | cue `whisper` | Caption | ⬜ |
| **Two supervisor crossings**: a shape walking behind him; Sahil straightens and shouts the script | Ep 1 `script`, Ep 1 `supervisor` | `supervisorPresent` cues | A dark overlay | ⬜ |
| **"Aunty? Aunty, aap ho na?"** to a dark camera | Last beat of Ep 1 | cue `still-there` | Caption | ⬜ |
| **The break**: two seconds out of character when told she's dead ("Nahi…") | Ep 2, if the player unmutes and says so | reply `tell-him` | Nothing yet | ⬜ |
| **Ep 3 arrest**: Sahil in uniform, supervisor seated *in* frame; reads the charges; the "one… nine… three… zero" slowdown | Ep 3, your phone | `content/dont-cut-the-call/episode3.ts` `incoming.arrest` | Text lines on the ringing screen | ⬜ |
| **Ending 01's real police call**: a different, real-looking station; Marathi label on the extinguisher, Mumbai time on the clock | Ending 01 last image | `components/stage/ending/Last.tsx` `Statement` | The drawn feed with `label="अग्निशामक"` | ⬜ |

Format: H.264 MP4 at 480p and 360p, short segments (≤10 s) so the call can
stream and fall back to a still with captions (P12). Two actors, releases
signed.

## 2. Voices

| Asset | Beat | Plugs into | Placeholder now | Status |
|---|---|---|---|---|
| **Vasu's voice note to Shaila**, 40 s, Marathi: "Shaila, ghabrana mat…" — *the recording that has to make players love her* | Ep 1, WhatsApp, 11:48 PM | `phone.ts` thread attachment (`seconds: 40`) | Transcript | ⬜ |
| **Rukhsana's Friday notes** (31 s and 18 s) | Ep 1 Q3 route; Ep 3 | `phone.ts` `r-2`, `r-3` | Transcripts | ⬜ |
| **The 38-second collector call** ("Aunty, aap bahut samajhdaar ho…") | Ep 2, Recents | `phone.ts` `c-collector.recording` | Transcript | ⬜ |
| **1930 hold recording + officer** (24 min, cut to ~40 s) | Ep 1–2, Recents | `phone.ts` helpline `recording` | Transcript | ⬜ |
| **The terrace**: a cat, a balcony, two voices above it at 12:37 | Ep 2, Instagram story | `episode2.ts` `stories.ruchi.audio` | Transcript + audio boost UI | ⬜ |
| **Cyril D'Souza's thank-you** | Ep 3 morning | `episode3.ts` messages | Text | ⬜ |
| **Nikhil on the phone** (three lines) | Ep 2, 1:34 AM | `episode2.ts` `incoming.nikhil` | Captions | ⬜ |
| **Your friend's texts** are text; no audio | Ending 03 | — | — | n/a |

Format: AAC/M4A mono, 64 kbps. Every line already has its transcript and
English in the script; keep delivery to the words written there.

## 3. Handwriting and paper

| Asset | Beat | Plugs into | Placeholder now | Status |
|---|---|---|---|---|
| **The note in the pouch**: block capitals, ballpoint, Roman Hinglish, *KATNA* misspelled: "CALL MAT KATNA. SAB DEKHO. — V" | Ep 1 opening; Ep 2 Q9 handwriting route | `components/stage/Note.tsx` | Styled text | ⬜ |
| **Her real note**, English cursive signed *Vasundhara*, with a Marathi blessing: "CUT THE CALL. They can see this phone…" | Ep 2, from Shaila | `episode2.ts` (real-note photo) | Text | ⬜ |
| **Diary pages 1–7**, her convent cursive, photographed at 11:40 PM on a table the way she'd photograph a cheque | Ep 1–2, Photos (page 6 in Recently Deleted) | `paper.ts` + `episode2.ts` `photos` (`kind: "paper"`) | Drawn paper with typed lines | ⬜ |

Two hands, on real paper. Photograph each page flat, phone-camera quality,
3:4, with the same table and lamp throughout.

## 4. Photographs

| Asset | Beat | Plugs into | Placeholder now | Status |
|---|---|---|---|---|
| **Her wallpaper / lock screen** | Every screen of her phone | `content/dont-cut-the-call/index.ts` `wallpaper` | `public/found/wallpaper.jpg` (Marine Drive, from the retired chapter) | ⬜ |
| **Sahil at his cousin's wedding**, borrowed sherwani, laughing | Ep 1 Q4; Ending 03 (Rukhsana on TV) | `paper.ts` `sahil-photo` | Titled card | ⬜ |
| **Vasu and her grandson Aarav, Cubbon Park** | Photos, her life | `paper.ts` | Titled card | ⬜ |
| **Hindu Colony, Dadar** (her street) | Photos | — (add) | — | ⬜ |
| **A Kurla lane** (Rukhsana's) | Rukhsana's chat | — (add) | — | ⬜ |
| **A cat on a balcony, 5th floor** | Ep 2 terrace story | `episode2.ts` `stories` | Drawn | ⬜ |

## 5. Documents

| Asset | Beat | Plugs into | Placeholder now | Status |
|---|---|---|---|---|
| **The "arrest warrant" PDF** with an FIR number that is a mobile number — **our emblem, never the government's** | Ep 1, WhatsApp | `phone.ts` warrant message | Text | ⬜ |
| **Bank SMS**: the ₹49,000 debit, and the ₹1,00,000 debit at 3:02 (Unknown Senders) | Ep 2 claims; Ep 3 charges | `paper.ts` `smsThreads` | Text (already right) | ✅ as text |
| **PikDrop booking**: "Mobile + power bank + diary + letter", Dadar → your address, and the rider chat | Ep 1–2 | `world.ts` `courier` | Drawn app | ✅ as UI |

## 6. What's already final (no asset needed)

Her iPhone and every app on it, both phones, the call's UI, the case file,
the endings' acts and cards, The First Minute, the share images: all drawn
in code, and final.

---

*Removed with this file: the retired chapter's unused photos
(`public/found/photos/*`) and voice memos (`public/found/memo-*.m4a`).*
