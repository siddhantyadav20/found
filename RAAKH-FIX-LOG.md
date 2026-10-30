# Raakh: Story & Gameplay Fix Brief, change log

Work from "Raakh — Story & Gameplay Fix Brief" (30 Oct 2026). The brief was
written from play; where the source disagreed, the conflict is listed here
with the choice made and why (brief, "How to work through it", step 2).

## Conflicts between the brief and the source

| # | Brief says | Source says | Kept | Why |
| --- | --- | --- | --- | --- |
| C1 | Meera is his partner; she blocked him on Thursday 26 Nov (H-14). | She is his ex. She ended it and blocked him on 21 Sept ("Sameer, mujhe ab message mat karna"); logline says "his ex". | Source. | Her refusal ("main ab uska bojh nahi uthaati", "confession box") only works if she has already left. The chat already answers "why did she block him". Her call now adds the history in one line ("Do mahine se baat nahi ki, aur aaj ye bhej diya") and the cause of the call (his mother rang her). |
| C2 | Meera says "*Tum* hamesha yahi karte ho, Sameer" in Episode 2 (H-02). | In Episode 2 she keeps up "Aap jo bhi ho"; she never names him to his face until 3:58. | Third person: "Woh hamesha yahi karta hai. Jab kuch sambhalta nahi, toh 'main nahi tha'." | Said to his face, the line would spend the reveal at 12:52. Said about him, to someone who has just said "Main Sameer nahi hoon", it is the same habit, named, and fair. |
| C3 | Train leaves 4:55 AM Sunday; Q1 says "before dawn" (H-13). | Train 12952 (the real Mumbai Rajdhani), Sunday 16:55; the Trade has Sameer send the phone down at 4:44 and still catch the 4:55. | Afternoon train, with the brief's "simpler alternative" sharpened: the last question is "S is ___, and **by** seven I'll be ___", and the 4:55 choice reads "gone, with the phone". | A 4:55 AM train breaks the Trade (phone down at 4:44, train at 4:55 from Malviya Nagar) and the real train number. "Gone, with the phone" is true by seven without promising the station ten hours early. |
| C4 | The deletions were on Friday 27 Nov (H-19). | The reel take, the memo and the 12:36 screenshot were deleted on Thursday night, 10:47 to 10:52 PM, before "For M" (11:20 PM); 28 days left on Saturday night. | Source. | RAAKH-V3 §4 ("the edit") puts them on Thursday. 30 days less two is 28, so the counts already match. The "why" is the two Sameers: he erased his hand at 10:47 and wrote "For M" at 11:20. |
| C5 | Courier brand like "Paytap"; refused at 11:40 AM (H-01). | DakRoute Express, same-city; Paytap is his payments app; refused 11:10. | DakRoute, 11:10. Added the missing pickup (9:10 AM) and the delivery back (10:50 PM) to the waybill. | Paytap already means money in this chapter. |
| C6 | The second phone is his SK Weddings work number (H-03). | It's the phone and SIM he bought on Tuesday for Mumbai (RAAKH-V3 §18.17), first seen at the reveal. | Source's phone, shown from the first scene as the brief asks, lighting once with Ram Kishan's 10:50 PM message. Its purchase is now on Paytap (Tuesday). | Keeps the Mumbai thread; the guard has the new number because he gave it to the gate. |
| C7 | Raju: "Sethi uncle ne aapka number diya" (H-24). | Raju, Monday 1:13 PM: "Dilip ne aapka number diya tha." | Source. | H-24 is already answered on the phone, in Raju's first message. |
| C8 | Anita writes at 3:20 because he shows online "for the first time in a week" (H-04). | He was online all week (voice note to M on Wednesday, the edit on Thursday). | Cause changed to her night round: she charges the boy's phone, sees him online after her round, and writes because she was told tonight they move him at seven. | "First time in a week" would be false on his own phone. |
| C9 | A steel kada. | A silver kada, in every image and caption. | Silver. | The photographs show silver. |
| C10 | The 4:55 epilogue: Dilip "on a bus home", Raju "gets his brother back". | Bhasin keeps Dilip until he has the phone ("Ladka hum sambhaal ke rakhenge"); Raju reprints the poster three weeks later. | Source. | The brief's own canon for seven o'clock says Bhasin only lets go once the phone is in reach; in the 4:55 it went to Mumbai. |
| C11 | The kada door clue is found before 3:58 (§6). | The whole fire clip can be deleted (RAAKH-V3 §17: every question keeps an undeletable way in). | The kada is required to file "me" in the last question, in both modes; most players meet it at the fire (Q7) or 12:29 (Q4) first. | Requiring the deletable clip before 3:58 would lock out a player who deleted it. |

## Story holes (§5)

| ID | File | Before | After |
| --- | --- | --- | --- |
| H-01 | content/raakh/index.ts, content/cases.ts, components/stage/Parcel.tsx | Waybill: refused 11:10, nothing else | Tracking printed on the waybill: picked up B-14 09:10, refused 11:10, delivered to origin 22:50 (C5). Waybill evidence label says the same. |
| H-02 | content/raakh/episode2.ts | Meera never names the habit | "Woh hamesha yahi karta hai. Jab kuch sambhalta nahi, toh 'main nahi tha'." (C2) |
| H-03 | Parcel.tsx, index.ts, phone.ts (Paytap), evidence.ts | Second phone first seen at 3:58 | Your phone lies beside the parcel, lit with Ram Kishan ji's 10:50 PM "B-14 ka parcel aaya hai, upar bhej diya." Tuesday's Croma payment explains it (C6). |
| H-04 | story.ts, episode2.ts, episode3.ts, questions.ts, night.ts | "A week ago, to the minute" ×3 | Ep 2 card: his alarm "D", set for 12:32 every night. Nitin: "1:52. Ek hafte se ye time yaad hai mujhe." Anita writes after her night round, because he shows online (C8). Q4/Q6 replies rewritten (brief lines 14, 15). |
| H-05 | phone.ts, evidence.ts, voices | "Main wahan tha. Maine dekha." | "Unhone usko jala diya, M. Aag maine lagayi." Q7's version is now "lit, and a body"; "only watched" is refused. |
| H-06 | phone.ts (both fire clips, group-4), questions.ts, voices | "Uske kapde bhi"; nothing on the waistcoat | "Uski shirt bhi" (a stained catering shirt); Pappu 2:55 "Uska waistcoat gaadi mein rakh diya." Q7's word is "an empty mattress, sheets and a shirt". |
| H-07 | phone.ts, evidence.ts, questions.ts | One 1:56 ambulance search | 1:54 "gunshot hospital police case compulsory", 1:55 "MLC kya hota hai", 1:56 ambulance (results never tapped). Both new searches count as optional proof for Q6. |
| H-08 | — | — | Already there: 1:15 call to Nitin, 2:38 (call-115). No change. |
| H-09 | episode3.ts, evidence.ts, questions.ts | Read receipt unexplained | Anita: "Woh phone dekhta rehta hai, jawab nahi deta. Unhone mana kiya hai." The read receipt and this line both prove "alive" in Q8. |
| H-10 | instagram.ts, Instagram.tsx | lissy.anita only a comment; search found nothing | Private profile lissy.anita (bio: Bedi Nursing Home, Fatehpur Beri); a follow request on Instagram's home from Episode 2; search matches handle, name and bio ("lissy", "anita", "bedi"). |
| H-11 | episode3.ts, voices | "Aaj raat bole saat baje" | "Aaj raat bole subah saat baje le jaayenge." |
| H-12 | phone.ts, evidence.ts | "Doctor ka intezaam ho raha hai." | "Thane mein baat ho gayi hai. Doctor ka intezaam ho raha hai." |
| H-13 | questions.ts | "at seven I'll be … on my way to the 4:55" | "by seven I'll be … gone, with the phone"; Q1 keeps "tomorrow afternoon" (C3). |
| H-14 | episode2.ts, voices | No history, no cause for the call | "Uski maa ka phone aaya tha…" (why she rings) and "Do mahine se baat nahi ki, aur aaj ye bhej diya." (C1) |
| H-15 | episode3.ts | Frame, threat, jerrycan | Adds "Papa ke paas hai woh angle, bhai. Tera. Maine bola tha pose mat kar… phir bhi gun de di." Kunal's epilogue line per ending. |
| H-16 | episode2.ts, voices | "Gate pe" note with no reason when Mummy wasn't told | Told nothing: "Neelam ji ka phone location dikha raha hai. B-14." All variants say Gate 2. |
| H-17 | episode2.ts, reveal.ts, endings.ts | Raju's answers went nowhere | Told it was a bullet, Raju writes at about 1:31 that he's going round the hospitals near Chhattarpur; in Room 6 he's "paas hi" and arrives 5:40 (else 6:12). |
| H-18, H-20 | endings.ts, EndCardV3.tsx | No closure for most people | "Afterwards": one line each for Dilip, Raju, Sameer, Meera, Nitin, Bhasin, Kunal, Mummy, Anita under every ending, varying with the night. |
| H-19 | questions.ts | — | Q8's reply adds "It was also his own lie. He couldn't finish writing it." Day counts kept (C4). |
| H-21 | lib/game/engine.ts, questions.ts, CaseFile.tsx | "One more thing would prove it" | Every question has `facts`; a refusal names the fact without proof ("You've shown who S is and what he does. Nothing yet shows where he's going, and when."), and where it is. |
| H-22 | CaseFile.tsx | Sentence checked before proof | Detective: no red word, no verdict; proof opens on any whole sentence; one reply for any failure. Help keeps instant checking. |
| H-23 | lib/found/heard.ts, Clip.tsx, VoiceMemos.tsx, playthrough.ts, evidence.ts | Counted on opening | The reel take, whole fire, trimmed fire, Kunal's clip and both memos count once played past their revealing caption (or to the end). The badge already needed the zoom. Chat voice notes count as read: their words are on screen. |
| H-24 | — | — | Already answered ("Dilip ne aapka number diya tha") (C7). |
| H-25 | endings.ts, EndCardV3.tsx | "You didn't look." | "You didn't answer. You didn't look." Look again stays hidden until another ending has been reached in this browser. |
| H-26 | lib/found/filling.ts, CaseFile.tsx, Table.tsx | On a wide screen a call could cut in mid-sentence | A half-filed sentence holds calls until it's filed or the phone is used again. On the phone, the case file being open already held everything. |

## Sections 6 to 10

- **§6 Door clues.** Q3 now needs the waybill ("…it went to her from his own flat, B-14"). New Q5b, "How does Bhasin know where this phone is?", needs Mummy's 12:02 Find My pin (a map screenshot in her chat). The last question's "me" needs the camera photo plus the same kada on his hand (the whole fire, 12:29, or his selfie). clues.ts adds D1–D3 (shown first in Look again, with times) and the optional IC16–IC21. At 3:58 the guard's "Teen saal se…" line is said to everyone, the camera needs the shutter before Done, and the fire still is pinned beside the viewfinder. With help, the last question offers "Look at yourself".
- **§7 Endings.** Variants as the brief's table, with one change (C10). Room 6 B splits by whether Meera's DCP is coming: without her, Sameer dials 112 himself. The end card names the answer ("You answered “me”" / "“Sameer Khurrana”: him, not you").
- **§8.** Claims and evidence (above). "Prove N things", with the claims listed and ticked in help mode, count only for a detective. Hints: a detective gets two tiers, and the card counts hints. Proof list grouped by where it was found, searchable past 8. Low battery: the 5% warning is gone (once on the way down, then the story's death beat). Message speed (Normal / Fast / Instant) in Leave the case; tap a typing bubble to skip. Mode asked before the parcel opens, every time. "Close the case" is now "Leave the case": Resume later, Restart Episode N (saves keep each episode's starting state), Restart the chapter, Switch to help (one way, noted on the card), Put it away. WhatsApp search matches message words and group members; Notes search is real.
- **§9 Lines.** All 22 applied, except #1 and #12 (C3, C7) and #3 in third person (C2). Voices rebuilt for the 12 changed recordings (scripts/voices.raakh.json updated).
- **§10 UI.** The second phone grows to fit a call, so the guard's whole line is on screen at 390 px and 1280×720. "Go on" is a centred button that takes Enter/Space. On a wide screen the phone's case-file icon goes to the notebook. Case-file labels are at least 11 px and the faint text is at least 4.5:1. Reduced motion was already global (app/globals.css).

## Not done

- Text-size option; the case file as a bottom sheet on phones; a separate share card per ending.
- Landing pages (halve the scroll, swipe carousel, one call to action per screen).
- Launch readiness (§11): brand look-alikes, business-name checks, Chapter 2 continuity. These are decisions and design work, not story fixes.
- Dialogue audit: Meera's "Kyun?" (why not delete) pays off only in her answer; every other choice now feeds the meter or a later beat.

## Tested

- `vitest` 120/120 (new: a fact refusal is named; two proofs of one fact never fail), `tsc`, `eslint`.
- In the browser, at 375 px with sound off, help mode, from seeded saves: the parcel (tracking, your phone, the mode question), Q3's named refusal, Q5b and Mummy's pin, the 3:58 sequence through the camera, the last question's kada refusal and Room 6, and the end cards for Room 6 and face-down Return to Origin. The guard call was also checked at 1280×720.
- Not played by hand: detective mode, the Trade, the 4:55, Return to Origin A, Leave the case, Restart episode, message speed. The brief's acceptance checklist asks for a fresh playthrough in each mode; that is still owed.
