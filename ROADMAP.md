# Found — Build plan
## The pivot to *Shagun* (2026-09-22)

Chapter One is now *Shagun*: Sameer Khurana's phone, a Delhi wedding, a
shooting, a cover-up. The canon is [SCRIPT.md](SCRIPT.md); the game
adaptation is [CHAPTER1.md](CHAPTER1.md); the experience rules are
[PLAYER-JOURNEY.md](PLAYER-JOURNEY.md); the decisions are
[PROJECT.md](PROJECT.md).

*Don't Cut the Call* (P0–P12, playtested 2026-09-19) is retired to git
history, like Low Battery and The Blue Room. Its last commit is `1de34a2`.

**How a phase ends:** typecheck, lint, tests, build, budget; walk it in the
browser at 375 × 812; tick this file; commit when Siddhant says.

---

## The shape of the rebuild

| | Module | What it is |
|---|---|---|
| **S0** ✔ | Canon and docs | SCRIPT.md, the adaptation, the journey, this plan, the assets list |
| **S1** ✔ | Retire | Remove *Don't Cut the Call*; one case, `shagun` |
| **S2** | Story-agnostic engine | No call, courier, charger or ending ids baked in |
| **S3** | The chain and the record | Links, claims, Sameer's version, Revisit, the multi-lane board |
| **S4** | His phone | Photos with media, Voice Memos, WhatsApp's archive, Mail, Paytap |
| **S5** | Arrival | Parcel, envelope, the note, the phone waking, the charger |
| **S6** | Episode 1 | *Missed Calls* as data |
| **S7** | Episode 2 | *The Second Shot* as data |
| **S8** | Episode 3 | *The Cancelled Rescue* as data, and the people's routes |
| **S9** | The record and the endings | Your phone, the draft, A/B/C/Return, the end card |
| **S10** | Growth | Pass it on, drops, share images, The First Minute |
| **S11** | The real assets | ASSETS.md: photographs, clips, voices, handwriting |
| **S12** | Ship-ready | The chapter held to its laws, a budget, a human playtest |

S1 was the only destructive phase; it ran on 2026-09-23, once Siddhant had
read the adaptation.

---

## S0 — Canon and docs · **done (2026-09-22)**

- `SCRIPT.md`: the .docx word for word (checked: no word lost), never edited.
- `CHAPTER1.md`: the adaptation, with a canon trace appendix (N) covering
  script §5, §7, §11, §15, §16, §18, §20 and §21.
- `PLAYER-JOURNEY.md`, `PROJECT.md`, `ASSETS.md` and `README.md` rewritten for
  *Shagun*.
- A `.docx` of the adaptation beside the original in Downloads.

---

## S1 — Retire *Don't Cut the Call* · **done (2026-09-23)**

**Built:** the last commit of the old chapter is tagged `dont-cut-the-call`
(`1de34a2`). Deleted: `content/dont-cut-the-call/`, the live call
(`components/call/*`, `lib/game/call.ts`), `SeenByThem`, `Morning`, the old
acts and last images (`Acts`, `Last`, `parts`, `CutSlider`), The First Minute
(`components/minute/*`, `app/first-minute/`, its share card and events),
PikDrop, City Desk and the Instagram story, and the old chapter's
episode, call and blocker tests. One case, `shagun`, is the stub in
`content/shagun/` (real arrival, clocks, lock screen and home screen; empty
episodes). Saves are `found:shagun:save`, version 4.

**Kept and made neutral rather than deleted** (the plan said delete; each was
cheaper to keep than to rebuild): the pouch is now `Parcel` (the tear gesture,
the label with the content note and the promise); `Note` draws
`story.arrival`; `Charge` draws `story.gate`; `Away` and `TitleCard` share
`Interstitial.module.css`, and the title card now shows for every episode,
on its clock's minute.

**Pulled forward from S2, because removing the call broke them:** the table
has no call and no banner suppression; the lock screen's waiting notices are
`story.lockScreen`; the battery curve is `Clock.drain` and `Clock.charging`;
`Story.owner` names whose phone it is; `Ending.id` is a string and `endings`
a list; the funnel's `end:<id>` events and the "what others did" buckets come
from the story's endings; `Choice`, `Aftermath` and `EndCard` are generic
(the rows finish directly until S9 builds the acts); the day shown in chats
is the story's own day. The case's share question is `CaseMeta.ask`
("Where does it end?").

**Tests:** `chapter.test.ts` keeps the laws (vacuous until S6); new
`scene.test.ts` holds the flow (parcel → note → table, the gate, the title
cards, a call, the ending); `questions.test.ts` and `endings.test.ts` run on
made-up data. 55 tests. `/c/[case]` went from 646KB to 577KB.

**Walked** at 375 × 812 on the production build: desk, parcel, note, lock
screen, home, all nine apps, resume after reload; the charger gate and the
Episode 2 card on `next dev` (`?battery=unplugged` is dev-only).

## S2 — Story-agnostic engine

| Where | Change |
|---|---|
| `content/types.ts` | `call` and `courier` optional (and likely deleted); `episodes`, `clocks` and `endings` become lists, not 3-tuples; `Ending.id` a string; `TimelineRow.lane` a string, with lanes declared per question; `Exposure` retired for links (S3); `Photo.album` a string |
| `lib/game/scene.ts` | The scene sequence is declared by the story (arrive → read → gate → title cards → the record → ending → card), not hard-coded flags. *(S1 already removed the old chapter's scenes and made title cards generic.)* |
| `lib/game/engine.ts` | `episodeOf` reads the story's episode count; no `ep:3` assumption |
| `components/stage/Table.tsx` | ✔ done in S1 |
| `components/stage/AppBody.tsx` | ✔ done in S1 (a locked note sets `did:unlocked-<id>`) |
| `lib/found/events.ts` | A chapter's own choices (Raju answered, Nitin protected…) reported from the story, as endings already are since S1 |
| `components/her/` | Renamed `components/owner/`: every chapter's phone has a different owner |
| Strings | ✔ done in S1: no name from the old chapter is left in code |
| Identifiers | `hers`, `hersHome`, `Message.from: "her"`, the timeline's `"her"` lane: renamed with the folder |

## S3 — The chain and the record

| Module | Detail |
|---|---|
| `lib/game/chain.ts` | Eleven links `{id, label, owner, kind: spine\|deep, tracedBy: flags, version: Sameer's line}`; `traced(state)`; the count |
| Questions (`engine.ts`) | **`variants`**: several accepted answers, each with its own proof routes and flags (the traced answer, and Sameer's version). **`reopenWhen`**: a flag that reopens an answered question as Revisit. **`optional`**: doesn't block the episode (QM). **Timelines**: any number of lanes, and optionally ordered |
| `components/stage/CaseFile.tsx` | Becomes the record: claims with their sources, Sameer's version filed without comment, Revisit with a strike by hand, a live count on replay |
| Result and share | `lib/found/result.ts` (`resultOf` → links), `keeping.ts` (`Solved.held` → `traced`), `drops.ts`, `app/d/[code]/opengraph-image.tsx`, `components/found/shareCards.tsx`: "I traced N of 11 links" |
| Tests | `questions.test.ts` gains variants, Revisit, optional and ordered multi-lane timelines |

## S4 — His phone

Current iOS, drawn by us, as before. Everything story-driven from `content/`.

| App | Must do |
|---|---|
| **Photos** | Real images and video (with captions and a poster frame), zoom-that-counts on photos and paused frames (the zone logic from the retired `LiveCall.tsx:139-221`), albums (the Sehgal wedding, WhatsApp, Favorites, Hidden), Info with time and place, **Edit › Revert**, **Recently Deleted** with days left. Recover `PhotoFrame` and `Gallery` from `c03aa03`; their CSS is still in `ios/PhotoFrame.module.css:367-492` |
| **Voice Memos** | A list and a player, and **Recently Deleted** (recover `Recorder`/`Memos` from `c03aa03`) |
| **WhatsApp** | Video and real-photo bubbles, **Archived** chats, one grey tick (blocked), a reply to a missing message, "Message yourself", groups with many senders |
| **Instagram** | SK Films' profile grid, and Kunal's profile |
| **Phone** | A 47-missed-call flood, repeated rings, and Recents |
| **Settings** | Face ID & Passcode (off, with its time), **Apps › Photos › Show Hidden Album**, Apple Account |
| **Safari** | History with times (already there) |
| **Mail** | New: the invoice, the offer letter, the venue's site plan |
| **Paytap** | New, fictional: the ₹1,80,000, the flat deposit, the train |
| **Notes** | Already there: "For M" and the shot list, with created and edited times |
| **Control Centre** | Airplane mode, by hand (Meera's route) |
| Remove | PikDrop, City Desk, the Instagram cat story, the `kyc` profile page |

## S5 — Arrival

The desk's parcel; tear, lift, **turn the envelope over**; the note as a
photograph with English beneath; the label with the content note and the
promise; the phone waking to 47 missed calls; the charger gate re-skinned
(*keep his phone alive*); resume; "You put it down" after a real gap; the
replay state. **The label's addressee waits on O1.**

## S6 · S7 · S8 — The episodes as data

| Phase | Content | Built against |
|---|---|---|
| **S6** | `content/shagun/episode1.ts` | CHAPTER1 F, Episode 1: fourteen beats, Q1–Q4, Raju's call, Mummy's Find My, "For M", *"M? Tu hai?"*, the charger |
| **S7** | `episode2.ts` | Q5–Q9 and QM, the Revisit of Q3, the memo, 1:07, Raju's trust, Bhasin's message, the archive, the 1:53 gap |
| **S8** | `episode3.ts` | Q10–Q13, the five-lane board, Nitin, Kunal, Meera, Revert, Hidden, Sameer's last message |

Each phase ends with the episode playable end to end on placeholders, every
question answerable two ways, three hints each, and a solver run through it.

## S9 — The record and the endings

| Module | Detail |
|---|---|
| Your phone | `components/yours/Phone.tsx` gains the draft post (from the end of Q3), Messages to Meera, and the record |
| The record | Links in and out, with sources; send or post; **no signalling** (one row style, fixed order, flat copy) |
| Endings | `content/shagun/endings.ts`: A, B, C and Return to Sender, read through `LINKS`, `LIE`, `FIRE`, `PRICE`, `EDIT`, `PUBLIC`, `NITIN`, `RAJU`, `MEERA`, `SAMEER`, `MUMMY`. No verdicts (script §18) |
| End card | The chain (untraced rows in Sameer's words), the count, one line only this ending shows, the "4. Nitin —" image, Pass it on, the case number |
| Outside the fiction | Celebratory firing is a crime; any hospital must treat first; 112; Tele-MANAS 14416. **Every fact checked against the source before the copy lands** |

## S10 — Growth

Pass it on (*"I traced 9 of 11 links"*), drops and the label, the share
images and OG routes, and **The First Minute**, redesigned for this chapter
(CHAPTER1 O5) or left out until it is.

## S11 — The real assets *(parallel, from S4)*

[ASSETS.md](ASSETS.md): the photographs and clips (a cast wedding shoot), the
voices, the handwriting, the documents.

## S12 — Ship-ready

- `tests/chapter.test.ts` rewritten for this chapter's laws: three hints per
  question; two sources per link that survive **any single closed route**;
  every evidence item filed once and reachable; solver runs for **the full
  chain (11/11 → A)**, **Sameer's version (→ B)**, **an early post (→ C)**
  and **Return to Sender**.
- Performance on a mid-range Android, the video-dead path, reduced motion,
  no sound, no storage.
- A full human playthrough on a phone, logged in the style of the last
  `PLAYTEST.md`.

---

## What only Siddhant can do

| | |
|---|---|
| Review the adaptation | CHAPTER1.md, before S1 |
| O1 | Why the phone reaches the player |
| The shoot | Cast Sameer, Dilip, Kunal and wedding extras; the reel; the fire clip |
| The voices | Sameer's four voice notes and the memo; Dilip (one message's worth); Raju; Nitin; Mummy |
| Handwriting | Sameer's note on the shagun envelope; the "For M" note is typed |
| Launch | Domain, deploy, and whether anyone should distribute the end card's message |
