# Raakh — Script and Player Journey v3: Return to Origin

27 Oct 2026 · Supersedes *Raakh — Script and Player Journey* (build 830fbbc) and the ChatGPT "v2.0" spec wherever they differ.

## 1. How to read this document

This is the build specification for Chapter 1 of Found. It covers what actually happened (canon), what the player sees and does (script and gameplay), how each moment is presented, and what the engine must do. It is written so that Claude, working in the repository, can implement it without inventing story.

**Two nights share one clock, a week apart.** Dates are corrected from the previous build.

| Name | Dates | What it is |
|---|---|---|
| That night | Sat 21 → Sun 22 Nov 2026 | The Sehgal wedding at Banyan Farms, Chhattarpur. The shot, the lie, the fire. |
| Tonight | Sat 28 → Sun 29 Nov 2026 | The player's night, 11:40 PM to about 4:40 AM, then the endings. |

Everything in the old document's "week after" moves one day earlier: old "Sun 23" becomes Sun 22, old "Mon 24" becomes Mon 23, and so on through old "Thu 27", which becomes Thu 26.

**Conventions**

- **Evidence IDs** (E01–E54): items the player can table as proof. They are listed in section 13.
- **Flags** (`raju_trust`, `meera_has_copy`): facts the engine records. They are listed in section 14.
- **[A] / [C] tags** on choices: Auditor or Confessor impulse (section 14).
- **PG codes** (PG-CARD, PG-MEDIA…): presentation modes (section 6).
- **Hinglish lines** are written as spoken in the game, with the game's own English translation in italics beneath.

**What changed from build 830fbbc**

| Area | Old | New |
|---|---|---|
| The player | A stranger the parcel reached by coincidence | Sameer himself. The phone returned to its sender. Revealed at about 4:00 AM in Episode 3. |
| Parcel logic | Sameer "made up" the return address | Return address is Sameer's own flat. Meera refused delivery. Same-city return. |
| Sameer on a "new number" | Live chats with Sameer, who confesses on demand | Removed entirely. No self-texting. Sameer's admissions come from memos, voice notes and Nitin's copy. |
| Meera | Ally who appears after Q5 | Recognises Sameer's voice on her first call and plays along to protect the evidence from him. |
| Case file | 14 questions, optional money question, 12 links | 8 questions; Q1 returns in first person as the final choice. Links model removed. |
| Decider | Two calls before seven; three winning combinations | Removed. Replaced by the reveal and a first-person final choice. |
| Endings | Wrong Story, Complete Record, Sameer's Version, Return to Sender | Room 6, The Trade, The 4:55, Return to Origin, plus a short "Unopened" for early exits. |
| Dilip | Rescued object | Has a want (to be in the frame) and a voice before the decision (his plea). |
| The fire | No body; the hole of how Sameer missed it | Bhasin told him the body was rolled in the mattress; "Dekhna mat" (don't look). He filmed it and never watched it. |
| Mumbai job | His own success | Referred by Bhasin; planted on page 2 of the offer. |
| Deletion | Not a verb | A real phone action with consequences. |
| Real time | 4-minute rescue countdown, fail state | Optional, non-punitive: only Bhasin's half hour at the gate. |
| Dates, age | Wrong weekdays; Sameer 27 | Correct weekdays; Sameer 28. |

## 2. The creative contract

**Logline.** A parcel comes back to your door: a wedding planner's phone, sent to his ex and refused. Somewhere on it is the night a catering boy went missing. You read it the way she would have. By four in the morning you know who fired, who lied, and who is still alive. Then the phone tells you whose door this is.

**The twist.** The player is Sameer Khurrana. The waybill says RETURN TO ORIGIN, and the origin is Sameer's flat. He never forgot who he is. The player simply was never told.

**The stress test.** Before he re-sends the phone or boards the 4:55 to Mumbai, Sameer has to know one thing: if someone else read this phone, what could they prove? So he reads it the way M would have, in the order he left for her, to see whether his edit holds. The case file is that test.

**The two Sameers.** Sameer opens the phone with two impulses:

- **The Auditor** checks whether the lie survives.
- **The Confessor** wants someone, anyone, to find him out.

The player's choices decide which one is reading at each moment. Honest choices are the Confessor leaking through; denials, deletions and accepting his version are the Auditor. Neither is a score to optimise. The reveal reads them back, and the end card says which Sameer read the phone.

**Theme.** You cannot keep sending responsibility to someone else. It returns to origin.

**Fair-play rules.** These are binding.

1. **The game's own narration never lies.**
   - Title cards, case-file results, system banners and the brief must be literally true of Sameer.
   - Characters may lie, guess or misread.
   - The audit is in section 15.
2. **Spoken calls are limited.** The player speaks aloud only to people who have never heard Sameer's voice (Raju, the guard) or whose recognition is meant to be a clue (Meera). Everyone who knows his voice (Bhasin, Kunal, Mummy, Nitin) reaches the phone by message, voice note or voicemail.
3. **Every identity clue is reachable before the reveal.** At least one is reachable in Episode 1.
4. **No mental-health device.** Sameer knows who he is; the twist is the player's, not his.
5. **The reveal must change what the player does next.** It does: the final choice is a first-person act.
6. **Evidence the player finds always counts when found.** Questions gate progress; evidence does not.
7. **Hints never change the story, the endings or the end card.**

**What the player should feel**

- **Episode 1:** curiosity, unease, sympathy for a frightened man and a missing boy.
- **Episode 2:** the floor tilts. The man is guilty, and somebody tried to save the boy.
- **Episode 3:** horror, then hope (he is alive), then vertigo (it was you), then a choice nobody can make cleanly.

## 3. The cast

| Who | That night | Tonight | Knows / doesn't know tonight | Voice |
|---|---|---|---|---|
| Sameer Khurrana, 28 (b. 14 Mar 1998). Owner, SK Weddings. The player. | Staged his own reel with Kunal's loaded revolver. His second shot hit Dilip at 12:32. Lied to Nitin at 1:52. Lit the fire at 4:47. | Opens his own returned parcel at 11:40 PM and reads it "as M would." Train to Mumbai at 4:55 PM. | **Knows:** what he did, the codes, what he deleted. **Doesn't know:** Dilip is alive; Nitin kept the 1:52 message; the fire clip shows an empty mattress (he never watched it); Rangmanch came through Bhasin; Dilip read "maaf kar de." | Heard only in old voice notes and memos, and once, live, in the Room 6 statement. The player's own lines are never voiced. |
| Dilip Kumar Mahto, 19. Sethi Caterers, from Samastipur. | Held the light because Nitin was sick. Shot at 12:32. Awake at 1:07 and 1:14. Taken alive in Bhasin's car at 2:55. | Room 6, Bedi Nursing Home, Fatehpur Beri, filed as "Deepak, 19, road accident." To be moved at 7 AM. | **Knows:** Sameer shot him; Bhasin promised a doctor; tonight's promise that silence buys home. **Doesn't know:** the fire, the lie. | Earnest, specific, practising English. Never a mouthpiece. |
| Bhasin Sehgal, 58. Retired ACP; Sehgal Enterprises; paid for the wedding. "Bhasin Uncle" to Sameer's mother. | 12:38 "Koi 112 nahi karega" (nobody calls 112). Kept Dilip in the service room. 2:55 moved him to Bedi under a false name. 3:31 told Sameer the boy was dead and the "body" was rolled in the mattress. | Tracks the phone through Mummy's iPhone (he gifted it and set up Find My). Comes to Gate 2 in person at about 3:55 AM. | **Knows:** everything except what Sameer will do. | Low, unhurried, practical. Threats sound like advice. Messages and voice notes only, never a live two-way call. |
| Kunal Sehgal, 25. Bride's brother; Sameer's college junior. | Fired his father's revolver on the dance floor at 11:52. Brought it, loaded, to the reel. Filmed the 12:32 shot from a second angle. | Messages the phone believing (correctly) it's Sameer. | **Knows:** Sameer fired; his father arranged Rangmanch. | Mocking, entitled, scared underneath. |
| Nitin Kumar, 23. SK Weddings editor. | 102° fever at home in Laxmi Nagar. Sent Vicky's Swift at 1:22. Recalled it at 1:53 because of Sameer's 1:52 lie. | Messages when the phone comes online. Holds the only surviving copy of 1:52. | **Knows:** the car, the lie. **Doesn't know:** that Dilip is alive. | Feverish, guilty: "Maine check bhi nahi kiya" (I didn't even check). |
| Meera Arora, 28. Advocate, Saket District Courts. Lives in Kalkaji. "M." | Not there. Ended things on 21 Sep and blocked Sameer on WhatsApp (his voice notes have one grey tick). | Refused the parcel at 11:10 AM Saturday. Calls the phone at 12:51 AM, knowing it will be Sameer. Recognises his voice; plays along. | **Knows:** the parcel came from Sameer; that he's pretending; nothing of the night until the player tells or sends it. | Precise, warm under control. Never a therapist, never a fixer. |
| Raju Mahto, 24. Dilip's brother; delivery rider in Sangam Vihar. | Not there. | Has rung 47 times. Never met or heard Sameer. Dilip gave him the number on 18 Nov. | **Knows:** Dilip went to work and didn't come back. | Exhausted, direct. Trust is earned and can break. |
| Sister Anita. Night nurse, Bedi Nursing Home. | Received "Deepak" at 3:20 AM on 22 Nov. | Writes from Dilip's own phone at 3:20 AM because the move is at seven and Dilip asks for "Sameer bhaiya" every day. | **Knows:** the gunshot, the false name, the 7 AM move. | Careful, procedural, then brave. |
| Supporting | Mummy (Neelam Khurrana, Lajpat Nagar). Pappu and Ramesh (Bhasin's men; Ramesh is "the man in the safari suit"). Vicky (Nitin's friend with the Swift). Mr Sethi (the caterer). Ram Kishan ji (guard, Gate 2, Navjeevan Apartments). | | | |

## 4. Canon: what actually happened

This is the objective truth. Player-facing material must never contradict it.

**Before.** Sameer and Meera were together from August until 21 September, when she ended it and blocked him. On 14 October Bhasin gave Sameer's mother a new iPhone and "switched on the location thing so Sameer stays visible." That puts her on Family Sharing with Sameer's phone and gives Bhasin, through her, a view of its location. On 30 October Bhasin paid her knee-surgery bill.

On 2 November SK Weddings invoiced the Sehgals ₹1,80,000 for planning and film (SK-1127). Sameer, building a showreel for a Mumbai job, planned his own reel at the wedding. Dilip, a catering boy Sameer had photographed and befriended, asked every day whether the Mumbai promise was real, and Sameer said "pakki" (it's settled). Kunal offered his father's revolver for "real feel." Nitin fell sick the night before, so Dilip took the light.

**The shot.** At 11:52 PM Kunal fired twice into the air on the dance floor. At 12:31 AM, on the back lawn, Sameer's phone (on a tripod) and Kunal's phone (handheld) recorded the reel. Dilip asked once more about Mumbai; Sameer said "Pakki. Ab hilna mat" (Settled. Now don't move). Sameer fired once into the air for the camera, reset his pose and fired again. The second shot went low and hit Dilip in the left shoulder. Nobody planned it.

**The suppression.** Bhasin took control within minutes. He made a disappearing-message group, "Banyan — Security": "Sameer, gun Kunal ko do. Abhi" (Sameer, give the gun to Kunal. Now). Then: "Koi 112 nahi karega. Ladke ko service room le jao" (Nobody calls 112. Take the boy to the service room). He promised a doctor who never came. Sameer searched for help on his phone and told Dilip at 1:08, "aa raha hoon. hospital le jayenge" (I'm coming. We'll take you to hospital). Dilip was conscious at 1:14.

From his sickbed, Nitin sent Vicky's Swift to the service gate on Mandi Road, 40 metres from the service room. At 1:49 Sameer was in that room with Dilip. At 1:52 he texted Nitin that Dilip had already gone to hospital in Bhasin's car and told him to call Vicky back. He knew it was false. He did it because Bhasin had told him a hospital meant a police case, and he had fired. Nitin believed him and recalled the car, which left empty at 2:04.

**The move and the lie.** At 2:41 Dilip stopped speaking (exhaustion and blood loss, not death). At 2:55 Bhasin's car took him to Bedi Nursing Home, whose owner Bhasin knows. He was admitted at 3:20 AM as "Deepak, 19, road accident," still wearing his catering waistcoat with the DILIP badge, his phone in its pocket.

At 3:31 Bhasin called Sameer for four minutes. He said the boy had died in the car, that the body was rolled in the service-room mattress on the back plot, and: "Tu bas aag laga. Dekhna mat" (Just light the fire. Don't look).

**The fire.** At 4:47 Sameer carried a jerrycan to the back plot. He burned the rolled, blood-soaked mattress, the sheets, and Dilip's own clothes and bag from the staff changing room ("Uske kapde bhi" — his clothes too). He filmed 31 seconds because some part of him wanted proof. He never watched it. When the mattress burns open, it is empty.

Bhasin's reasons are coherent. A corpse is a murder file; a wounded migrant worker, treated quietly and sent home with money and a story, is a manageable problem. The fire destroyed real evidence (the blood). Telling Sameer it was a body bound him for life.

**The week after.** Bhasin released the overdue ₹1,80,000 on Sunday morning, after writing that it would come "if nobody talks." That is leverage, not a proven separate bribe. Sameer sent Meera four voice notes she would never receive.

On Monday 23 Nov at 1:10 AM he wrote to Dilip's number: "Dilip?" and "maaf kar de" (forgive me). On Monday night Sister Anita charged Dilip's phone for him, and at 3:12 AM Tuesday Dilip read the message. Sameer saw the blue ticks, searched "whatsapp blue tick matlab kisi ne padh liya" (blue tick means someone read it?), assumed Bhasin's men had the phone, and did nothing.

Also on Monday:
- Kunal sent the frame of Sameer firing: "Humare paas bhi hai. Soch samajh ke" (We have one too. Think carefully).
- Rangmanch Weddings, Mumbai, made Sameer an offer. Page 2 of the PDF reads "Referred by: Mr B. Sehgal, Sehgal Enterprises."

On Tuesday Sameer booked the 4:55 PM train for Sunday 29 Nov, paid a ₹35,000 deposit on an Andheri 1RK, and bought a new phone and SIM. Bhasin visited his mother.

**The edit, Thursday 26 Nov, 10:47–11:26 PM.** Sameer:
- deleted the reel take, the first group screenshot (the one naming him with the gun) and his confession memo;
- offloaded Voice Memos;
- locked and hid Dilip's and Nitin's chats with the code "pakki";
- recorded and deleted a riddle for M ("Code woh hai… jo woh roz poochta tha" — the code is what he asked every day);
- put the full fire clip, Kunal's frame and a note of Bhasin's 3:31 words into a locked note, "Agar kuch hua" (If something happens), password 1403;
- wrote "For M": 1. Voice notes, 2. Favorites, 3. Bhasin wala group, 4. Nitin —;
- stopped writing at Nitin, because Nitin's chat is the one place the 1:52 message still exists;
- turned the passcode off.

**The parcel.** On Friday 27 Nov at 10:05 AM Sameer posted the phone in the Sehgal wedding's shagun envelope, via DakRoute Express (same-city), to Meera at Kalkaji. The sender address was his own: B-14, Navjeevan Apartments, Malviya Nagar.

On Saturday at 11:10 AM Meera saw the sender's name and refused it. It was returned to origin and signed for at Gate 2 at 7:50 PM. Ram Kishan ji left it at B-14's door. At 11:40 PM Sameer, who had spent the evening walking because he could not sit in the flat, came home to it.

**Tonight, off-screen.**
- Bhasin sees the phone online through Mummy's Find My. Kunal reports that "Sameer is acting weird."
- Bhasin had planned to send Dilip home on Sunday once Sameer was gone and the phone dealt with. With the phone back and talking to Nitin, he holds the 7 AM move as leverage. Without the phone he will not release Dilip; he will move him somewhere nobody knows.
- At about 3:55 AM he parks at Gate 2.

## 5. Canonical timeline

One event table drives the status bar, message arrival, the night strip and the ending montages. Every timestamp below is canonical.

**Before the wedding**

| When | What happened | Where the player finds it |
|---|---|---|
| Mon 21 Sep, 1:14 AM | Meera ends it: "mujhe ab message mat karna" (don't message me anymore). Blocks him. | WhatsApp › M (old messages), E04 area |
| Wed 14 Oct | Mummy: "Bhasin uncle ne naya phone dilaya. Location wala bhi on kar diya, bole tu dikhta rahega toh mujhe tension nahi hogi." *(Bhasin uncle got me a new phone. Switched the location thing on, said if you stay visible I won't worry.)* | WhatsApp › Mummy, E27 |
| Fri 30 Oct | Mummy: "Bhasin uncle ne ghutne ka bill de diya. Kitne achhe hain." *(Bhasin uncle paid the knee bill. So kind.)* | E27 |
| Mon 2 Nov, 10:30 AM | Invoice SK-1127, balance ₹1,80,000 | Mail, E19 |
| Mon 16 Nov, 11:05 AM | Sameer rehearses his Rangmanch pitch: "Main shaadiyon mein kahaniyan dhoondhta hoon." *(I find stories in weddings.)* | Voice Memos (Ep2) |
| Tue 17 Nov | Dilip: "Bhaiya, Mumbai mein samundar roz dikhega?" Sameer: "Roz." *(Will I see the sea every day? / Every day.)* | Dilip chat (locked), E36 |
| Wed 18 Nov, 12:40 PM | Venue site plan: service room 40 m from the service gate, Mandi Road | Mail, E22 |
| Wed 18 Nov, 9:02 PM | Dilip's voice note: "Sir, light is ready. Sir, battery full." | E36 |
| Wed 18 Nov, 9:04 PM | Dilip's front-camera video: "Hello sir, my name is Dilip Kumar Mahto. I am from Samastipur. I can hold light, I can do anything." | E36 |
| Thu 19 Nov, 4:18 PM | Kunal: "Bhai reel mein Papa wali le aaunga. Asli feel aayegi." Sameer: "done. back lawn, 12:15." *(I'll bring Dad's one for the reel. Real feel.)* | WhatsApp › Kunal, E16 |
| Fri 20 Nov, 10:31 PM | Nitin, 102° fever, can't come. Sameer: "Dilip light sambhaal lega." *(Dilip will handle the light.)* | Nitin chat (locked), E37 |
| Fri 20 Nov, 11:02 PM | Run sheet: "12:15 — SK reel w/ Kunal. back lawn. D — light (N sick)." | Notes, E11 |
| Sat 21 Nov, 2:10 PM | Sethi: "Dilip ko aapke shoot ke liye 12 baje chhod dunga." *(I'll send Dilip to your shoot at 12.)* | WhatsApp › Sethi Caterers, E09 |

**That night: Sat 21 → Sun 22 Nov, Banyan Farms**

| When | What happened | Where found |
|---|---|---|
| 7:10 PM | Dilip: "Bhaiya Mumbai wali baat pakki na?" Sameer: "pakki. …aaj light tu pakdega." *(The Mumbai thing is settled, right? / Settled. Tonight you hold the light.)* | E36 |
| 9:48 PM | Portrait of Dilip with a tray; badge reads DILIP when zoomed | Photos › Favorites, E10 |
| 11:52 PM | Kunal fires twice on the dance floor; sends the clip at 11:58 | WhatsApp › Kunal, E17 |
| 12:22 AM | Kunal shares his story to Sameer by DM: revolver, "Papa ki hai, asli wali." *(It's Dad's. The real one.)* | Instagram › Messages, E18 |
| 12:29 AM | Kunal adds a photo to the shared album: Sameer, revolver raised, kada on his wrist; Dilip holding the LED panel | Photos › Shared Album (iCloud, Ep2), E29 |
| 12:31 AM | Reel take on Sameer's tripod phone (18 s) | Photos › Recently Deleted (Ep2), E30 |
| 12:32 AM | Second shot hits Dilip; Kunal films a second angle | E30; Kunal's frame, E43 |
| 12:36 AM | "Banyan — Security" group created: "Sameer, gun Kunal ko do. Abhi." | Recently Deleted screenshot (Ep2), E34 |
| 12:38 AM | Bhasin: "Koi 112 nahi karega. Ladke ko service room le jao." | Screenshots, E33 |
| 12:44–12:52 AM | Searches: "goli lagne pe kya karein" (what to do for a gunshot), "gunshot hospital without police case delhi", "lifeline hospital mehrauli" | Safari (Ep2), E35 |
| 12:52 AM | Bhasin: "Doctor ka intezaam ho raha hai." *(A doctor's being arranged.)* | E33 |
| 12:58 AM | Nitin: "tum log theek ho?" *(Are you all okay?)* | E37 |
| 1:07 AM | Dilip: "Bhaiya dard ho raha hai. Aap aa rahe ho na?" *(It hurts. You're coming, right?)* | E36 |
| 1:08 AM | Sameer: "aa raha hoon. hospital le jayenge." | E36 |
| 1:14 AM | Pappu: "Sir ladka hosh mein hai. Paani maang raha hai." *(The boy's conscious. Asking for water.)* | E33 |
| 1:15 AM | Sameer calls Nitin, 2 min 38 s | Phone › Recents, E38 |
| 1:22 AM | Nitin: "Vicky ki Swift bhej raha hoon, 20 min. Dilip ko service gate pe le aao." *(Sending Vicky's Swift. Bring Dilip to the service gate.)* | E37 |
| 1:31 AM | Bhasin: "Doctor aa raha hai. Sab shaant raho." *(Doctor's coming. Everyone stay calm.)* | E33 |
| 1:40 AM | Nitin: "Vicky 10 min. Service gate — Mandi Road wala na?" | E37 |
| 1:49 AM | Ramesh: "Sameer sir service room mein hain, ladke ke saath." *(Sameer sir is in the service room with the boy.)* | E33 |
| 1:52 AM | **The lie.** Sameer to Nitin: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja." *(They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.)* Later deleted "for me." | Only Nitin's copy (Ep2 end), E42 |
| 1:53 AM | Nitin: "theek hai bhai. agar le gaye hain toh main Vicky ko wapas bula leta hoon." | E37 (answers a message that isn't there) |
| 1:56 AM | Search: "private ambulance chhattarpur 24 hours" | E35 |
| 1:59 AM | Pappu: "Service gate pe ek Swift aayi hai." | E33 |
| 2:04 AM | Pappu: "Chali gayi sir. Driver bol raha tha cancel ho gaya." Nitin: "Vicky wapas aa gaya." *(It left. Driver said it was cancelled. / Vicky's back.)* | E33, E37 |
| 2:06 AM | Nitin rings Sameer three times; unanswered | E38 |
| 2:41 AM | Pappu: "Sir ladka bol nahi raha." Bhasin: "Call karo mujhe." *(The boy isn't speaking. / Call me.)* | E33 |
| 2:55 AM | Pappu: "Sir gaadi nikal gayi." Bhasin: "Baaki back plot pe." *(The car's left. / The rest to the back plot.)* | E33 |
| 3:20 AM | Admitted at Bedi as "Deepak, 19, RTA," Room 6 | Anita's photo (Ep3), E48 |
| 3:31 AM | Bhasin calls Sameer, 4 min 12 s: "Body gadde mein lapet di hai. Tu bas aag laga. Dekhna mat." *(The body's wrapped in the mattress. Just light it. Don't look.)* | E38 (call); words in the locked note, E46b |
| 4:47 AM | The fire, filmed for 31 s; a 9 s trim saved to Photos | Photos (9 s), E28; locked note (31 s), E46a |

**The week after**

| When | What happened | Where found |
|---|---|---|
| Sun 22, 8:52 AM | Sameer screenshots the group before it disappears | Screenshots, E33 |
| Sun 22, 9:10 AM | Bhasin: "Balance aaj aa jayega. Tab tak kisi se baat nahi. Nitin se bhi nahi." *(The balance comes today. Till then, talk to nobody. Not even Nitin.)* | WhatsApp › Bhasin Uncle, E26 |
| Sun 22, 9:40 AM | Voice note 1 to M: "Kunal firing kar raha tha. Ek ladka gir gaya." *(Kunal was firing. A boy fell.)* | WhatsApp › M, E04 |
| Sun 22, 11:04 AM | ₹1,80,000 from Sehgal Enterprises, "SK-1127 balance" | Paytap, E23 |
| Sun 22, 12:30 PM | ₹5,000 to Nitin, "Edit advance · Sehgal film" | Paytap, E25 |
| Sun 22, 11:20 PM | Voice note 2: "Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya." *(They didn't take him to hospital. Bhasin let no one go.)* | E05 |
| Mon 23, 1:10 AM | To Dilip: "Dilip?" "maaf kar de." (Read Tue 24, 3:12 AM) | E36 |
| Mon 23, 2:05 AM | Voice note 3: "Unhone usko jala diya, M. Main wahan tha. Maine dekha." *(They burned him, M. I was there. I saw.)* | E06 |
| Mon 23 | Sethi: "Dilip ka hisaab Bhasin sir ne kar diya. List se naam hata diya." *(Bhasin sir settled Dilip's account. Took him off the list.)* Raju sends the LAPATA (missing) poster. Kunal sends the frame. | E09, E08, E43 |
| Mon 23, 4:58 PM | Memo: "Pehli camera ke liye thi. Doosri… main pose kar raha tha. Mujhe laga khaali hai." *(The first was for the camera. The second… I was posing. I thought it was empty.)* | Voice Memos › Recently Deleted (Ep2), E31 |
| Mon 23, 6:02 PM | Rangmanch offer; page 2: "Referred by: Mr B. Sehgal" | Mail, E20 |
| Tue 24, 3:20 AM | Search: "whatsapp blue tick matlab kisi ne padh liya" | E35 |
| Tue 24 | Train booked (12952, Sun 29, 4:55 PM, B3/41). ₹35,000 Andheri deposit. New phone and SIM. Bhasin visits Mummy: "Bhasin uncle aaye the. Pooch rahe the tu Mumbai kab ja raha hai." *(Asking when you leave for Mumbai.)* | Mail E21, Paytap E24, E27 |
| Wed 25, 10:15 PM | Voice note 4: "Agar mujhe kuch hua… sab phone mein hai." *(If something happens to me… it's all on the phone.)* | E07 |
| Thu 26, 10:47–11:26 PM | The edit (section 4). 11:24 one ring to Nitin; 11:25 Nitin calls back, missed. | Recently Deleted, Safari, Notes, Settings, E38 |
| Fri 27, 10:05 AM | Parcel posted | Waybill, E02 |
| Sat 28, 11:10 AM | Refused by addressee, Kalkaji | E02 |
| Sat 28, 7:50 PM | Returned to origin, signed at Gate 2 | E02 |

**Tonight: authored beats.** The clock advances only at these beats, never by wall time. Section 7–9 give full scripts.

| Clock | Beat | Ep |
|---|---|---|
| 11:40 PM | Phone wakes; 9% | 1 |
| 11:41 PM | Raju rings | 1 |
| 11:44 PM | Case file created (brief) | 1 |
| ~11:52 PM | Q1 | 1 |
| ~12:00 AM | Q2 → 12:02 Find My sound, Mummy | 1 |
| ~12:10 AM | Q3 → 12:12 Bhasin "Ghar pe hi hai" → 12:13 phone dies | 1 |
| 12:32 AM | Episode 2 title; 12:33 data renews | 2 |
| 12:40 AM | Bhasin voice note | 2 |
| ~12:48 AM | Q4 → 12:51 Meera calls | 2 |
| 1:05 AM | Raju's second call | 2 |
| ~1:20 AM | Q5 → 1:25 Nitin | 2 |
| 1:52 AM | Nitin sends 1:52; episode ends | 2 |
| 1:52 AM | Episode 3 title; ~2:00 Q6 | 3 |
| 2:10 AM | Kunal | 3 |
| 2:30 AM | Raju's withdrawal (if lied to) | 3 |
| ~2:50 AM | Q7 → "Then where is Dilip?" | 3 |
| 3:05 AM | Nitin threatened (if exposed) | 3 |
| 3:20 AM | Sister Anita, from Dilip's number | 3 |
| ~3:30 AM | Q8 | 3 |
| 3:40 AM | Dilip's voice note | 3 |
| 3:58–4:04 AM | The reveal | 3 |
| 4:06 AM | Bhasin's terms | 3 |
| 4:10–4:40 AM | Final choice (clock holds while choosing) | 3 |
| 4:40 AM → | Endings | — |

## 6. Presentation grammar

Each kind of moment has one way of being shown. Use them exactly where the script calls for them and nowhere else. Restraint is what makes the three dark-screen moments land.

| Code | What it is | Rules | Used for |
|---|---|---|---|
| **PG-COLD** | Cold open: audio only on true black | No UI, no subtitles for the first play (subtitles appear on replay or with accessibility on). 10–14 s. Skippable only after the chapter is finished once. | Chapter start; reprised identically in Return to Origin |
| **PG-CARD** | Title card: black, centred serif, white | 2.5 s hold, 600 ms fades, one line (two at most). The only place narration speaks directly. Every card passes the fair-play audit. | "Seven days later…", episode time cards, "Three weeks later", final line cards |
| **PG-TABLE** | Physical tabletop scene (2.5D, warm lamp, wood) | The player's hand is visible: right wrist, silver kada partly under a shirt cuff, never foregrounded. | Parcel, envelope, charging, repack |
| **PG-PHONE** | Default: the simulated phone | Everything happens in apps. | Most of the game |
| **PG-LIVE** | Live interruption: call screen or banner | Real ringtone and haptics where supported. Calls the player speaks on show options as text; the player's lines are never voiced. | Calls, messages |
| **PG-YOURPHONE** | The second device | A plainer phone slides up from the bottom edge to cover about 40% of the screen. Wallpaper: Marine Drive at dusk. Never browsable. | Guard call at the reveal; Trade and Return to Origin ending notifications |
| **PG-MEDIA** | Full-screen media, no chrome | The first play of each key video is uninterrupted and unskippable for its length (max 31 s); after that, a normal player with scrub and pause markers. | Reel take, full fire clip, camera viewfinder, Room 6 videos, Mumbai reel |
| **PG-DARK** | Dark-screen revelation | The phone UI dims to black over 1.2 s; one line or one waveform with a transcript; no music. **Used exactly three times.** | 1: "Then where is Dilip?" · 2: Anita's first voice note · 3: the reveal's final card |
| **PG-MONTAGE** | Recontext montage | The player's own lines, timestamped, white on black, each arriving with a soft message tick. Cut against original media. About 25 s. | The reveal only |
| **PG-PREV** | "Previously on Raakh" | 20–30 s, auto-assembled from this player's state: their filed sentences being typed, two of their choices quoted, the cliff line. TV-style. Skippable. | Before Episodes 2 and 3 |
| **PG-NEXT** | "Next on Raakh" | 10–12 s teaser of upcoming media, with nothing that answers a question. Skippable. | After Episodes 1 and 2 |
| **PG-DEATH** | Phone death | Low-battery alert, two flickers, off. The black glass shows, for about 8 frames, a faint silhouette of whoever holds it (no features). | End of Episode 1 |
| **PG-LOCK** | Ending on a lock screen | Notifications stack while the clock advances. Each lands with sound; there is a pause between beats. | All endings |
| **PG-FINAL** | Final image | Full-bleed photo or video, 4–6 s, then the final line card. | All endings |
| **PG-END** | End card | Section 11. | All endings |
| **PG-STINGER** | Post-credits | Optional, pending the Chapter 2 canon. | The 4:55 only |

**"Previously on Raakh" content**

- **Before Episode 2:**
  1. The "Seven days later" card, quickly.
  2. The player's Q1 sentence being typed.
  3. Voice note 1 snippet: "Kunal firing kar raha tha."
  4. The player's own line to Raju, quoted with its timestamp.
  5. Bhasin's banner: "Ghar pe hi hai. Achha hai."
  6. The battery falling 9% → 2%.
- **Before Episode 3:**
  1. The Q4 and Q5 sentences.
  2. Meera's voice: "Kuch delete mat karna."
  3. The player's line to Nitin.
  4. The 1:52 message bubble arriving.

**"Next on Raakh" content**

- **After Episode 1:**
  1. Black.
  2. Kunal's voice: "Rolling, bhai?"
  3. Six frames of the 12:29 photo, heavily blurred.
  4. A phone ringing with caller "M".
  5. Meera's voice: "Kuch delete mat karna."
  6. Card: "Episode 2 · The Second Shot".
- **After Episode 2:**
  1. The sound of a jerrycan set down.
  2. A padlock with four dots filling.
  3. A banner sliding in, sender "Dilip", no preview text.
  4. An indistinct whisper.
  5. Card: "Episode 3 · Return to Origin".

**Chapter trailer** (45 s, landing page and social media; must pass the fair-play audit)

| Time | Content |
|---|---|
| 0–6 s | Black. Distant dhol. Card: "Banyan Farms, Chhattarpur. Saturday night." |
| 6–10 s | One shot, off-screen. The dhol keeps playing. |
| 10–14 s | Card: "Seven days later, a parcel comes back to your door." |
| 14–20 s | The waybill; the RETURN TO ORIGIN stamp thuds. |
| 20–26 s | Lock screen, 47 missed calls. Raju: "Dilip kahan hai?" |
| 26–32 s | Cuts: the LAPATA poster; a locked note; the M chat with four grey ticks. Bhasin: "Jiske paas bhi ye phone hai…" |
| 32–38 s | Meera: "Kuch delete mat karna. Kuch bhi." |
| 38–42 s | Black. A phone vibrates on wood. |
| 42–45 s | "RAAKH · Chapter 1 · Found" · Play free |

## 7. Episode 1 — Missed Calls

**Purpose:** whose phone this is, who is missing, and Sameer's version of events.
**Clock:** 11:40 PM to about 12:13 AM. Battery 9% → 2% → dead. About 12–15 minutes. Questions Q1–Q3.

**Scene 1.0 — Before the parcel** (menu)
- Content note: "A shooting at a wedding, a cover-up, a missing worker. Violence is heard, never shown."
- Modes:
  - **With help:** where to look, plus nudges.
  - **Detective:** no pointers; hints only if asked.
- Toggle: **Real time** — "The last half hour of the night runs on a real clock. Nothing is lost if it runs out." Off by default.

**Scene 1.1 — Cold open** (PG-COLD), about 12 s on black:

> *Dhol and crowd, distant.*
> DILIP: "Bhaiya, light yahan theek hai?"
> *Is the light okay here?*
> SAMEER: "Haan, wahin. Rolling, bhai?"
> *Yes, there. Rolling?*
> KUNAL: "Rolling."
> DILIP: "Bhaiya… Mumbai pakki na?"
> *Mumbai's settled, right?*
> SAMEER: "Pakki. Ab hilna mat."
> *Settled. Now don't move.*
> *A shot. Laughter.*
> SAMEER: "Ek aur, pose mein—"
> *One more, posing—*
> *A shot. The laughter stops. The dhol plays on for two seconds. Cut.*

PG-CARD: "Seven days later, a parcel comes back to your door."

**Scene 1.2 — The parcel** (PG-TABLE). A courier mailer. The waybill reads:

- DakRoute Express · Same-city · AWB DR-4471-0926 · Attempt 1
- **To:** Meera Arora, Kalkaji, New Delhi 110019
- **From:** S. Khurrana, B-14 Navjeevan Apartments, Malviya Nagar, New Delhi 110017
- **Contains:** 1 mobile phone, used
- **Stamp:** RETURN TO ORIGIN · Refused by addressee · 28/11 11:10

Line under the waybill: "Something inside is buzzing. It was meant for M." Button: **Pull the strip.** The hand that pulls it wears the kada.

*Never print the words "your address." Whose door this is must stay a fact the player can deduce, not one they are told.*

**Scene 1.3 — The envelope** (PG-TABLE)

- Shagun envelope: "Ishita weds Rohan." On the back, in a man's quick hand: "M — Sab isme hai. Local thane mat le jaana. Bhasin ke log wahan baithe hain. — S" *(M — It's all in here. Don't take it to the local police station. Bhasin's people sit there. — S)*
- Card line: "You aren't M."
- The phone: face down, cracked at one corner, ringer on.
- Button: **Turn the phone over.**

**Scene 1.4 — It rings** (PG-LIVE). Six seconds after the phone wakes, +91 62••• •4417 rings, the number that has rung 47 times.

> RAJU: "Hello? Sameer bhaiya?… Hello? Aap kaun? Ye Sameer bhaiya ka phone hai na? …Dilip kahan hai?"
> *Who are you? This is Sameer bhaiya's phone, isn't it? …Where's Dilip?*

| Option | Tag | Raju | Sets |
|---|---|---|---|
| "Main Sameer nahi hoon. Ye phone mere paas aaya hai." *(I'm not Sameer. This phone came to me.)* | A+1 | "Toh Sameer bhaiya kahan hain? Saat din se phone kar raha hoon." *(Then where is he? I've called for seven days.)* Hangs up. | `raju_first=denial`, `raju_trust=low` |
| "Main pata kar raha hoon. Thoda waqt do." *(I'm finding out. Give me some time.)* | C+1 | "Waqt? Saat din ho gaye… Theek hai. Main phir karunga." *(Time? It's been seven days… Fine. I'll call again.)* | `raju_first=finding`, `raju_trust=med` |
| "Dilip kaun?" *(Who's Dilip?)* | A+2 | "Dilip kaun? DILIP KAUN?" Hangs up. | `raju_first=whos_dilip`, `raju_trust=low` |
| Decline | 0 | Text: "Aap jo bhi ho, Dilip kahan hai?" *(Whoever you are, where's Dilip?)* | `raju_first=declined`, `raju_trust=low` |

**Scene 1.5 — Lock screen.** Saturday 28 November, 11:40. 9%, Low Power Mode.
- Notifications: 47 missed calls; Mummy: "Beta, phone kyun nahi utha raha? Khana khaya?" *(Why aren't you picking up? Have you eaten?)*; Bhasin Uncle: 2 missed calls.
- No passcode.

**Scene 1.6 — The case file brief** (11:44 PM). The case file opens as a note, with its header in the Notes style: "On this iPhone · Today 11:44 PM." Brief:

> "This phone was posted to M — Meera Arora, Kalkaji. She refused it. A boy called Dilip went missing at a Delhi wedding a week ago. Find out what happened to him. Somebody else wants this phone back before morning."

The home-screen widget always shows the open question.

**Scene 1.7 — Sameer's version.** WhatsApp › M is pinned and holds four voice notes, each with one grey tick (E04–E07). The case file tags them "Sameer's account." Players will hear "Unhone usko jala diya… Maine dekha" and believe a body burned. That is intended misdirection; the line is true of what Sameer believes and of the fire he saw.

**Scene 1.8 — Free exploration** (with Episode 1 availability)

| App | Holds now | Held for later |
|---|---|---|
| WhatsApp | M's notes; Raju's poster and messages; Sethi; Bhasin Uncle (9:10 AM balance); Kunal ("Papa wali", the 11:52 clip); Mummy (history incl. 14 Oct, 30 Oct, 24 Nov) | Dilip and Nitin chats, locked and hidden (code "pakki", accepted from Ep2) |
| Photos | Wedding shots; the 9:48 portrait (zoomable badge); the 9 s fire trim; Recently Deleted thumbnails greyed with "Syncing Paused" | Shared Album (12:29), Screenshots, reel take: Ep2 |
| Instagram | @sk.weddings; DM from Kunal with his 12:22 story | — |
| Notes | "For M"; run sheet; "Mumbai flats"; "Agar kuch hua" (locked; "This note hasn't finished downloading") | Downloads after Ep2's data renewal; password 1403 |
| Mail | Invoice SK-1127; Rangmanch offer (2-page PDF); train ticket; site plan | — |
| Settings | Apple Account: Sameer Khurrana, 14 Mar 1998, address B-14 Navjeevan Apartments, Malviya Nagar; Passcode: Off; Find My: "This iPhone · Home · Malviya Nagar · Sharing location with: Mummy" | — |
| Paytap | ₹35,000 Andheri deposit; ₹1,80,000 in; ₹5,000 to Nitin | — |
| Phone | Recents (1:15, 3:31, Thu 11:24/11:25); 47 missed from Raju | — |
| Voice Memos | Offloaded (cloud icon) | Download in Ep2 |
| Safari | The last open tab, stalled on 64 Kbps | History in Ep2 |
| Camera | **Unavailable** ("Camera is unavailable in Low Power Mode on this device.") | Unlocks at the reveal |

*The camera rule is a fiction convenience. Keep it consistent: the camera opens only when Meera asks at the reveal, and the phone is charged by then.*

**Scene 1.9 — Q1, Q2, Q3** (section 12) unlock in order.

**Scene 1.10 — After Q2: Find My** (12:02 AM). Banner: "Find My · A sound was played on this iPhone." Then Mummy:

> "Beta, maine phone dhoondhne wala button daba diya. Location on dikh rahi hai. Tu theek hai na? Bhasin uncle ka phone aaya tha, pooch rahe the."
> *I pressed the find-phone button. The location's showing. You're okay, right? Bhasin uncle called, asking.*

| Reply | Tag | Mummy | Sets |
|---|---|---|---|
| "Aunty, main Sameer nahi hoon." *(Aunty, I'm not Sameer.)* | A+2 | "Aunty? …Beta, tu kya bol raha hai? Tu theek hai? Main Bhasin uncle ko bolti hoon." *(Aunty? What are you saying? Are you okay? I'll tell Bhasin uncle.)* | `mummy_told=stranger` |
| "Main theek hoon, Mummy." *(I'm fine, Mummy.)* | C+1 | "Achha. Khana kha lena. Uncle ko bata deti hoon." *(Good. Eat something. I'll tell uncle.)* | `mummy_told=fine` |
| No reply | 0 | "Seen kar ke bhi reply nahi?" *(Seen, and no reply?)* | `mummy_told=none` |

**Scene 1.11 — After Q3: the phone dies.** Battery 2%. Bhasin Uncle: "Ghar pe hi hai. Achha hai." *(It's at home. Good.)* In airplane mode instead: "Phone band kar diya? Koi baat nahi. Ghar ka pata hai." *(Switched it off? Doesn't matter. I know the house.)* Then PG-DEATH.

**Scene 1.12 — Between episodes**
1. Recap card, "Found so far": the three filed sentences and the open question. Last line: "Sameer has told M what happened. He hasn't proved it."
2. PG-NEXT.
3. Charging (PG-TABLE): the kada hand plugs a cable into the phone. On laptops with the Battery Status API, a real charger plug advances the scene; otherwise a **Plug in** button appears after 5 s.

## 8. Episode 2 — The Second Shot

**Purpose:** prove Sameer fired, prove Dilip lived, and find the car that left empty.
**Clock:** 12:32 → 1:52 AM. About 15–20 minutes. Questions Q4–Q5.

**Scene 2.0** — PG-PREV.

**Scene 2.1** — PG-CARD: "Tonight · Sunday · 12:32 AM." Under it, smaller: "A week ago, to the minute: the second shot."

**Scene 2.2 — Data renews** (12:33). Jio's daily pack renews and iCloud syncs (not in airplane mode; if airplane mode is on, everything below queues until it's turned off):
- the Shared Album photo (12:29);
- the Screenshots of the group;
- Recently Deleted (reel take, 12:36 screenshot);
- Voice Memos (re-download from the home screen);
- Safari history;
- the "Agar kuch hua" note finishes downloading.

**Scene 2.3 — Bhasin's voice note** (12:40). The variant follows `mummy_told`:

| `mummy_told` | Voice note |
|---|---|
| stranger | "Jiske paas bhi ye phone hai. Neelam ji keh rahi thi koi aur hai. Achha natak hai. Subah saat baje tak phone gate pe chhod dena. Baaki hum dekh lenge." *(Whoever has this phone. Neelam ji says someone else has it. Nice act. Leave it at the gate by seven. We'll handle the rest.)* |
| fine | "Neelam ji ne bataya tu theek hai. Achha hai. Toh ghar pe hi rehna. Subah baat karte hain." *(Neelam ji says you're fine. Good. Then stay home. We'll talk in the morning.)* |
| none | "Jiske paas bhi ye phone hai. Subah saat baje tak gate pe chhod dena." |

**Scene 2.4 — The reel take** (Photos › Recently Deleted, E30).
- First play is PG-MEDIA, uninterrupted. Direction is in section 16.
- On replay, pause markers sit at the first shot, the second shot and the panel drop.
- **Delete permanently** is available (section 17).

**Scene 2.5 — The memos** (Voice Memos › Recently Deleted)
- E31, the confession memo: "Pehli camera ke liye thi. Doosri… main pose kar raha tha. Mujhe laga khaali hai."
- E32, the code memo: "Code woh hai… jo woh roz poochta tha." Then: "Nahi. Rehne de." *(The code is what he asked every day… No. Leave it.)*

**Scene 2.6 — Locked chats.** Typing "pakki" in WhatsApp search opens Dilip's and Nitin's chats. The code can be found three ways:
- the reel audio ("Mumbai pakki na?" / "Pakki.");
- the code memo plus the 7:10 PM "pakki" (visible in the cold open as well);
- Raju, if trusted (scene 2.8).

Hints, in order: "What did Dilip keep asking?" → "Listen to the reel take." → "The code is pakki."

Dilip's chat ends with Sameer's Monday "Dilip?" / "maaf kar de" showing **blue ticks**, with info: "Read Tue 24 Nov, 3:12 AM." *(A boy everyone says is dead read a message on Tuesday. Clue for Q8; never pointed at directly.)*

**Scene 2.7 — Q4, then Meera** (12:51). Q4 is the shot. Then M calls; Meera has unblocked him for this call.

> MEERA: "Sameer—" *(two seconds of silence)* "…Hello?"

| Option | Tag | Meera |
|---|---|---|
| "Main Sameer nahi hoon. Ye parcel mere darwaze pe wapas aaya." *(I'm not Sameer. This parcel came back to my door.)* | A+1 | "…Theek hai. Aap jo bhi ho." *(…All right. Whoever you are.)* |
| "Parcel wapas aa gaya." *(The parcel came back.)* | 0 | "…Haan. Pata hai." *(…Yes. I know.)* |
| "Aapne ise lene se mana kyun kiya?" *(Why did you refuse it?)* | C+1 | "Kyunki main uska confession box nahi hoon." *(Pause.)* "Aap jo bhi ho." *(Because I'm not his confession box. Whoever you are.)* |
| *Only if the Q1 "me" hunch is filed:* "Meera. Main hoon." *(Meera. It's me.)* | C+3 | Long pause. "Pata hai. Pehle shabd se." *(I know. From the first word.)* Sets `early_reveal=true` (section 9.10b). |

Then, on every path except early reveal:

> MEERA: "Maine aaj subah ye lene se mana kiya tha. Usne mujhe bheja tha, aur main ab uska bojh nahi uthaati. Lekin agar ye aapke haath mein hai, toh ek kaam karna. Kuch delete mat karna. Kuch bhi."
> *I refused this this morning. He sent it to me, and I don't carry his weight anymore. But if it's in your hands, do one thing. Don't delete anything. Anything.*

| Option | Tag | Effect |
|---|---|---|
| "Theek hai. Kuch delete nahi karunga." *(Okay. I won't delete anything.)* | C+1 | Promise P3 made |
| "Kyun?" *(Why?)* | 0 | "Kyunki jo ise bhejta hai, woh sabse pehle wahi mitata hai jo use phasata hai." *(Because whoever sends it erases first whatever traps him.)* |

Meera, closing: "Uske passwords uski birthday hote hain. Hamesha. Aur order mein dekhna. Usne order mein rakha hai." *(His passwords are his birthday. Always. And look in order. He put it in order.)*

She then writes in M's chat: "Block hata diya hai. Kuch bhejna ho toh yahan bhejna." *(I've unblocked. If you need to send anything, send it here.)* From now on, every evidence item has **Send to M** (sets `meera_has_copy`, C+1 the first time). Sets `meera_contact=true`.

*Meera's pause after "Sameer—" and her pointed "Aap jo bhi ho" are identity clues. Directed delivery: warm, controlled, never knowing-winking.*

**Scene 2.8 — Raju's second call** (1:05). If he was answered before: "Aap hi ho na? Jisne pichhli baar phone uthaya tha?" *(It's you, isn't it? Who picked up last time?)* Then: "Dilip ke baare mein kuch pata chala? Maa roz phone karti hai." *(Found anything about Dilip? Ma calls every day.)*

| Option | Tag | Raju | Sets |
|---|---|---|---|
| "Goli lagi thi. Dilip ko. Main aage pata kar raha hoon." *(He was shot. I'm finding out more.)* | C+1 | Silence. "Zinda hai?" *(Is he alive?)* — "Pata nahi." *(I don't know.)* Then: "Woh roz poochta tha, 'Mumbai pakki na?' Har baar. Pakki, pakki." *(He asked every day: "Mumbai's settled, right?" Every time.)* | `raju_trust=high`; code clue |
| "Main usse dhoondh lunga. Pakki." *(I'll find him. Promise.)* | 0 | "Pakki? …Woh bhi yahi bolta tha." *(Promise? …He used to say that too.)* Then the code clue. | Promise P2 made; `raju_trust=med` |
| "Kunal Sehgal ne goli chalayi." *(Kunal Sehgal fired.)* | A+2 | "Sehgal? Shaadi wale?" *(The wedding family?)* Hangs up. | `raju_kunal=true` (scene 3.4) |
| Decline | 0 | — | — |

**Scene 2.9 — Q5.**

**Scene 2.10 — Nitin** (1:25). "Bhai? Online dikh raha hai." "Us raat ke baad se neend nahi aayi." *(Bro? You're showing online. I haven't slept since that night.)*

| Path | Opening option | Tag | What follows |
|---|---|---|---|
| Stranger | "Main Sameer nahi hoon. Mujhe jaanna hai us raat kya hua." *(I'm not Sameer. I need to know what happened that night.)* | A+1 | Nitin: "Kaun ho aap? Bhasin ke aadmi?" *(Who are you? Bhasin's man?)* He needs a reason. The player gives one or more (below). He replies "…Theek hai. Ek cheez hai mere paas. Ruk." *(Okay. I have something. Wait.)* |
| Care | "Tu theek hai?" *(Are you okay?)* | C+1 | "Nahi bhai. …Tu poochh raha hai? Tu? Ek hafte se tu ek baar nahi bola." *(No. …You're asking? You? You didn't say one word all week.)* He treats the player as Sameer from here. |
| Blame | "Gaadi kyun wapas bulayi thi?" *(Why did you recall the car?)* | A+1 | "Tu… ye mujhse pooch raha hai?" *(You're asking me this?)* Seen, then silence. No lock: he still sends the copy at 1:52, as an accusation. |

Reasons on the stranger path:
- "Raju ke liye, Dilip ka bhai." *(For Raju, Dilip's brother.)* Only if `raju_trust` is med or high.
- "Meera ke liye." *(For Meera.)* Only if `meera_contact`.
- "Tera naam kahin nahi aayega. Pakki." *(Your name won't come up anywhere. Promise.)* A+1; promise P1 made.

**Scene 2.11 — 1:52 AM: the copy arrives.** A week to the minute. Nitin forwards a screenshot of his chat showing Sameer's 1:52 message (E42). The accompanying line depends on the path:

| Path | Nitin's line |
|---|---|
| Stranger | "Ye uska message hai. 1:52. Uske phone se delete hai, mere se nahi. Maine check bhi nahi kiya. Bas maan gaya." *(This is his message. Deleted from his phone, not mine. I didn't even check. I just believed it.)* |
| Care | "Ye tera hi message hai. 1:52. Tune delete kiya hoga. Mere paas hai. Maine check bhi nahi kiya. Tujhe maan liya." *(This is your own message. You must have deleted it. I have it. I didn't even check. I believed you.)* |
| Blame | "Ye dekh. Phir poochna." *(Look at this. Then ask.)* |

The episode freezes on the bubble, holds 1.5 s, and cuts to black.

**Scene 2.12** — Recap card ("The phone was edited. Somebody kept what he deleted."), then PG-NEXT.

## 9. Episode 3 — Return to Origin

**Purpose:** prove the lie, see the empty fire, find Dilip alive, the reveal, the choice.
**Clock:** 1:52 → 4:40 AM. About 20 minutes plus the ending. Questions Q6–Q8, then the final Q1.

**Scene 3.0** — PG-PREV.

**Scene 3.1** — PG-CARD: "Tonight · Sunday · 1:52 AM." Smaller: "A week ago, to the minute: the lie." The 1:52 bubble is on screen.

**Scene 3.2 — Q6.** On the truth result, if `meera_contact`, Meera writes: "Maine galat kiya. Parcel le lena chahiye tha." *(I was wrong. I should have taken the parcel.)*

**Scene 3.3 — Kunal** (2:10). "Bhai. Online dikh raha hai. Papa bol rahe hain kisi se baat mat karna. Kal Mumbai nikal ja. Rangmanch mein Papa ne baat kar li hai, tension mat le." *(You're online. Dad says talk to nobody. Leave for Mumbai tomorrow. Dad's spoken to Rangmanch, don't worry.)*

| Option | Tag | Kunal | Sets |
|---|---|---|---|
| "Main Sameer nahi hoon." | A+1 | "Haan haan. Aur main dulha hoon. Phone band kar aur so ja." *(Sure. And I'm the groom. Switch it off and sleep.)* | — |
| "Us raat ka sach bata." *(Tell me the truth about that night.)* | C+1 | "Sach? Le." Sends the frame (E43): "Humare paas bhi hai. Soch samajh ke." Then: "Aur jerrycan tu khud uthake le gaya tha. Papa ne bas bola tha." *(And you carried the jerrycan yourself. Dad just said it.)* (E44) | `kunal_frame=true` |
| "Nitin ke paas 1:52 wala message hai." *(Nitin has the 1:52 message.)* | A+2 | "Kya? Ruk." … 2:40: "Papa ko bata diya. Handle ho jayega." *(Told Dad. It'll be handled.)* | `nitin_exposed=true` |

If `nitin_exposed`, at 3:05 Nitin writes: "Bhasin ke log ghar aaye the. Maa ro rahi hai. Tune kisko bataya?" *(Bhasin's men came to the house. Ma's crying. Who did you tell?)* Nitin goes silent for the rest of the night.

**Scene 3.4 — Raju withdraws** (2:30, only if `raju_kunal`). "Sehgal ke ghar gaya tha. Gate se bhaga diya. Ek aadmi bola, 'Kunal toh dance floor pe tha.' Aapne jhooth bola. Aap log sab ek jaise ho." *(I went to the Sehgals'. Chased off at the gate. A man said Kunal was on the dance floor. You lied. You people are all the same.)* Sets `raju_trust=broken`.

This holds: Raju does not call again. He can be reached only if the player calls him in the final act and admits the lie (section 10).

**Scene 3.5 — The locked note.** "Agar kuch hua", password 1403. Hints: "birthday · ddmm"; Settings shows the birthday; Meera said so. The note body (E46b) holds:

> "If they use theirs, I use mine.
> 3:31 — B: 'Body gadde mein lapet di hai. Tu bas aag laga. Dekhna mat.'
> Maine dekha nahi.
> [video, 0:31]
> [image: frame]"

*(I didn't look.)*

**Scene 3.6 — The whole fire** (PG-MEDIA, 31 s; direction in section 16). Then Q7. On filing the truth:

- Result text: "…his own hand, with the kada, sets down a jerrycan beside a rolled mattress. 'Uske kapde bhi.' Bhasin told him the boy was inside. He didn't look. When the mattress burns open, it's empty."
- Then **PG-DARK #1:** "Then where is Dilip?"
- Clock jumps to 3:15.

**Scene 3.7 — Sister Anita** (3:20). A banner: sender **Dilip** (from the locked chat; the notification breaks through the hidden chat):

> "Aap Sameer ho? Ye phone ek ladke ka hai. Main Bedi Nursing Home, Fatehpur Beri mein night nurse hoon. Aapka number isme 'Sameer Bhaiya Mumbai' naam se save hai."
> *Are you Sameer? This phone belongs to a boy. I'm the night nurse at Bedi Nursing Home, Fatehpur Beri. Your number is saved in it as "Sameer Bhaiya Mumbai."*

| Option | Tag |
|---|---|
| "Main Sameer nahi hoon. Ladka kaun hai?" *(I'm not Sameer. Who's the boy?)* | A+1 |
| "Ladka kaisa hai?" *(How is the boy?)* | C+1 |
| "Kaun ladka?" *(What boy?)* | A+1 |

Whatever the reply, her voice note plays as **PG-DARK #2** (waveform on black, transcript fading in line by line):

> "Ek ladka hai. Ek hafte se. Register mein 'Deepak, unnees saal, road accident' likha hai. Road accident nahi hai. Goli ka ghaav hai, kandhe mein. Jo log laaye the, roz aate hain. Aaj raat bole saat baje le jaayenge. Kahan, nahi bataya. Woh roz ek hi naam leta hai. Sameer bhaiya."
> *There's a boy. For a week. The register says "Deepak, nineteen, road accident." It isn't a road accident. It's a bullet wound, in the shoulder. The men who brought him come every day. Tonight they said they'll take him at seven. Where, they didn't say. Every day he says one name. Sameer bhaiya.*

Then two photos (E48): a belongings bag with a maroon waistcoat, a dried stain and the DILIP badge; and the admission slip: "Deepak · 19 · M · RTA · Adm 22/11 3:20 AM · Room 6." Then:

> "Akele main kuch nahi kar sakti. Do log chahiye: ek jo isko pehchaane, aur ek jisse woh log darte hain."
> *Alone I can't do anything. It needs two people: one who can identify him, and one those men are afraid of.*

**Scene 3.8 — Q8.**

**Scene 3.9 — Dilip** (3:40). Anita: "Woh jaag gaya hai. Maine bataya aapka phone online hai. Woh kuch bolna chahta hai." *(He's awake. I told him your phone is online. He wants to say something.)* Then a voice note in Dilip's voice: weak, breath between phrases, a ward fan audible (E49).

> "Bhaiya… aap aa rahe ho na? Unhone bola hai agar main kuch nahi bolunga toh ghar bhej denge. Main kuch nahi bolunga. Maa ko mat batana ki goli lagi thi. Bas… aap aa jao."
> *Bhaiya… you're coming, right? They said if I don't say anything, they'll send me home. I won't say anything. Don't tell Maa I was shot. Just… come.*

There are no reply options. The chat input is available but sends nothing until after the reveal.

**Scene 3.10 — The reveal** (3:58–4:04). Play each step in sequence; do not let other banners interrupt.

1. **Bhasin's voice note:** "Sameer." *(Three seconds of silence.)* "Gate do pe hoon. Neeche aa. Baat karni hai." *(I'm at Gate 2. Come down. We need to talk.)*

2. **PG-YOURPHONE.** For the first time a second phone slides up from the bottom edge, ringing: "Gate 2 · Ram Kishan ji." If declined, it rings twice more, then texts: "Khurrana sahab, Bhasin sahab neeche hain." If answered:

   > GUARD: "Khurrana sahab, maaf karna, itni raat ko. Bhasin sahab neeche gaadi mein baithe hain. Keh rahe hain aapko bula doon."
   > *Khurrana sahab, sorry, so late. Bhasin sahab is downstairs in his car. Asking me to call you.*

   | Option | Guard |
   |---|---|
   | "Main Khurrana nahi hoon." *(I'm not Khurrana.)* | "Sahab… B-14 aap hi ka hai na? Teen saal se aapke liye gate khol raha hoon." *(Sahab… B-14 is yours, isn't it? I've opened the gate for you for three years.)* |
   | "Unse kaho intezaar karein." *(Tell him to wait.)* | "Ji sahab." |
   | Hang up | — |

3. **Meera calls the old phone.** "Sameer. Ab bas." *(Sameer. Enough now.)*

   | Option | Meera |
   |---|---|
   | "Main Sameer nahi hoon." | "Toh front camera khol. Aur mujhe bata kaun dikh raha hai." *(Then open the front camera. And tell me who you see.)* |
   | "Meera…" | "Front camera khol, Sameer. Ek baar dekh le." *(Open the front camera. Look, once.)* |

   Two buttons: **Open the camera** / **Put the phone face down**.

   *Face down goes directly to Return to Origin, "Face down" variant (section 11). Meera: "Theek hai, Sameer. Mat dekh." (All right. Don't look.) It mirrors Bhasin's "Dekhna mat" at the fire.*

4. **The camera** (PG-MEDIA)
   - The viewfinder opens in selfie mode on Sameer's face: a 6 s live loop of a blink and a breath. He is unshaven, his eyes are red, the room is lit only by the screen, and the kada is visible as his hand steadies the phone.
   - Three seconds of silence; no music.
   - The shutter pulses. Taking the photo saves E53 ("Proof: you"); not taking it is fine.

5. **The case file turns over.** The case file slides up by itself and flips to its info panel: "Case file · Notes · Created Sat 28 Nov 2026, 11:44 PM · On this iPhone · Last edited 4:01 AM." The Q1 entry "S is Sameer Khurrana" highlights. If the "me" hunch was filed, a stamp lands: "You called it."

6. **PG-MONTAGE** (about 25 s): the player's own lines, timestamped, each followed by a beat of what it was answering. Assemble from state, choosing up to six in this priority order:
   1. Mummy denial
   2. Raju first line
   3. Nitin promise
   4. Raju "Kunal Sehgal ne chalayi"
   5. Anita reply
   6. Meera opening line
   7. any permanent deletion ("Deleted permanently: reel take, 1:13 AM")

   Then intercut:
   - Dilip's "Pakki" from the reel take;
   - a split frame: the parcel hand (Ep1) beside the fire hand (Ep3), same kada;
   - the 12:29 photo, unblurred, at the wrist.

7. **Meera's line.** The variant follows the impulse tally (section 14):
   - **Confessor ≥ Auditor:** "Main pehli call se jaanti thi. Main dekhna chahti thi tu khud padhega toh kya karega. …Tu chahta tha koi tujhe pakde, Sameer. Isliye tune ye phone khola." *(I knew from the first call. I wanted to see what you'd do reading it yourself. …You wanted someone to catch you. That's why you opened this phone.)*
   - **Auditor > Confessor:** "Main pehli call se jaanti thi. Main dekhna chahti thi tu khud padhega toh kya karega. …Tu dekh raha tha tera jhooth kitna tikta hai." *(…You were checking how long your lie would hold.)*

8. **PG-DARK #3:** "Somebody was checking whether it could be solved. Somebody wanted it solved. Both of them were you." Then, smaller: "Your story held on N of 4."

9. PG-CARD: "Tonight · Sunday · 4:04 AM."

**Scene 3.10b — Early-reveal variant** (`early_reveal=true`). Steps 1, 2, 4, 5 and 6 still play.
- Step 3 changes to Meera saying: "Ab dekh le khud ko. Ek baar." *(Now look at yourself. Once.)*
- Step 7 changes to: "Tujhe kab pata chala?" *(When did you know?)* The case file answers with the timestamp of the hunch filing.

**Scene 3.11 — Bhasin's terms** (4:06, voice note; E50)

> "Sameer. Ab tujhe pata hai ladka zinda hai. Toh seedhi baat. Phone guard ke haath neeche bhej de. Saat baje ladka Samastipur ki bus mein hoga. Zinda, dawai ke saath, paise ke saath. Tu 4:55 ki train pakad. Rangmanch mein maine baat kar li hai, wahan sab theek rahega. Kunal wala video mere paas rahega. Bas mere paas rahega. Aur agar phone neeche nahi aaya… toh ladka bhi kahin nahi jaayega. Aadha ghanta hai."
>
> *Sameer. Now you know the boy's alive. So, straight talk. Send the phone down with the guard. At seven the boy will be on the bus to Samastipur. Alive, with medicine, with money. You catch the 4:55. I've spoken to Rangmanch; everything will be fine there. Kunal's video stays with me. It just stays with me. And if the phone doesn't come down… the boy doesn't go anywhere either. You have half an hour.*

**Real time (opt-in only).** A 5:00 real countdown appears, labelled "Bhasin waits." At zero:
- Bhasin: "Theek hai. Tu nahi aaya. Ladka bhi kahin nahi jaayega." *(Fine. You didn't come. Nor will the boy go anywhere.)*
- His car leaves and The Trade becomes unavailable. Nothing else is lost.
- Pausing the game pauses the clock.

**Scene 3.12 — Before you choose** (optional)
- **Call M.** Available whether or not she was reached before; if never reached: "Sameer?" / "Haan." / "…Kahan hai tu?" Her advice:
  > "Main tujhe nahi bataungi kya karna hai. Bas itna: agar tu Bedi jaata hai, main DCP ko bula sakti hoon, Bhasin ka aadmi nahi."
  > *I won't tell you what to do. Only this: if you go to Bedi, I can bring a DCP, not one of Bhasin's.*

  Then, if `meera_has_copy`: "Agar nahi jaata, toh jo mere paas hai, mere paas rahega." *(If you don't, what I have stays with me.)* Otherwise: "Agar nahi jaata, toh mere paas kuch nahi hai. Sab tere haath mein hai." *(If you don't, I have nothing. It's all in your hands.)*
- **Listen to Dilip again.**
- **Open the case file:** the final question.

## 10. The final choice: Q1, again

The case file opens Q1 rewritten. Header: "Q1, again · Who is S, and where is he going?"

> **S is** {me · Sameer Khurrana}**, and at seven I'll be** {at Fatehpur Beri · at Gate 2, with the phone · on my way to the 4:55}**.**

- **Choosing "Sameer Khurrana"** morphs the sentence back, letter by letter, into Episode 1's: "S is Sameer Khurrana, a wedding planner, and tomorrow afternoon he's on a train to Mumbai." It is pre-filled and filed with the original proof. This is Return to Origin.
- **Choosing "me"** requires proof: the camera photo (E53), the case-file metadata (E54), or the waybill plus Apple Account address (E02 + E13).

| Destination proof | Accepts |
|---|---|
| At Fatehpur Beri | Anita's slip (E48) or Dilip's voice note (E49) |
| At Gate 2, with the phone | Bhasin's terms (E50) |
| On my way to the 4:55 | Train ticket (E21) |

**Confirmation lines.** These are plain, one sentence, and true.

| Choice | Confirmation |
|---|---|
| Room 6 | "You go to him. Whatever you say there goes on the record." |
| The Trade | "Bhasin gets the phone. Dilip gets the bus. You get the train." |
| The 4:55 | "You keep the phone and take the train. Bhasin keeps Dilip until he has it." |
| Return to Origin | "You send it back to M. It will come back here." |

**Pre-ending steps**

**Room 6 — "Before you go."** Any order, all optional.

- **Call Meera:** "Aa raha hai? …Theek hai. DCP ko main bulaati hoon. Andar akele mat jaana jab tak woh na aaye." *(You're coming? …Fine. I'll get the DCP. Don't go in alone before she arrives.)* Sets `dcp_route`.
- **Call Raju.** The call depends on `raju_trust`:
  - **high or med:** "Aap… aap hi ho na?" / "Haan. Main Sameer hoon. Dilip zinda hai. Bedi Nursing Home, Fatehpur Beri. Room 6." Silence. "Main nikal raha hoon." *(It's you, isn't it? / Yes. I'm Sameer. Dilip's alive. Room 6. / I'm leaving now.)*
  - **low:** the same call, plus "Aapne kaha tha aap Sameer nahi ho." / "Jhooth tha." *(You said you weren't Sameer. / That was a lie.)*
  - **broken:** the player must choose "Maine jhooth bola tha. Kunal ne nahi chalayi. Maine chalayi thi." *(I lied. Kunal didn't fire. I did.)* Raju: "…Agar ye bhi jhooth hua—" *(If this is a lie too—)* and hangs up. He comes.
- **Message Nitin:** "Mera naam aayega. Tera bhi aa sakta hai. Maaf kar de." *(My name will come up. Yours might too. Forgive me.)* Sets `nitin_warned`.
- **Message Mummy:** "Main theek hoon, Mummy."
- **Leave by Gate 1.** Guard: "Gate 1 khol deta hoon, sahab. Bhasin sahab Gate 2 pe hain." *(I'll open Gate 1. Bhasin sahab's at Gate 2.)*

**The 4:55 and Return to Origin — "Clean up"** (optional). A list of the breaking items still on the phone, each with a Delete toggle: Nitin's copy, the full fire clip, Kunal's frame, the reel take, the confession memo. If promise P3 was made, Meera's line echoes as a faint caption: "Kuch delete mat karna."

**Return to Origin — repack** (PG-TABLE, the reverse of the opening). The note can stay as written, or the player may add one line:
- "Ab sach mein sab hai." *(Now it really is all here.)* Only offered if nothing was permanently deleted.
- "Maaf kar de." *(Forgive me.)*

The new waybill is identical but reads **Attempt 2**.

**The Trade — "Before you send it"** (optional): message Dilip's number from the old phone: "Ghar ja. Maaf kar de." *(Go home. Forgive me.)*

## 11. The endings

**Selection.** The final choice selects the ending. State changes lines, people and costs inside it. There is no hidden score and no "first rule that fits."

| Final choice | Ending |
|---|---|
| me + Fatehpur Beri | Room 6 |
| me + Gate 2 with the phone | The Trade (unavailable if Real time ran out) |
| me + the 4:55 | The 4:55 |
| "Sameer Khurrana", or face down at the camera | Return to Origin |
| "Close the case" at any point before 3:58 AM | Unopened |

### Room 6

The ending plays on the old phone in his pocket (PG-LOCK), then on its own camera (PG-MEDIA).

| Clock | Beat | Condition |
|---|---|---|
| 4:52 AM | Bhasin: "Sameer. Gaadi dikh rahi hai. Kahan ja raha hai?" *(I can see the car. Where are you going?)* | Always |
| 5:01 AM | Bhasin: "Theek hai. Jaa. Dekhte hain kaun pehle pahunchta hai." *(Fine. Go. Let's see who gets there first.)* | Always |
| 5:18 AM | Anita: "Side door khula hai. Main yahin hoon." *(The side door's open. I'm here.)* | Always |
| 5:31 AM | PG-MEDIA, 14 s, front camera. Sameer films himself for the first time: corridor, tube light, his breathing; Anita's hand points to a door, "6." If he came alone, Anita: "Aap akele aaye ho? …Aap hi dono ho." *(You came alone? …You're both.)* | Alone line if neither Raju nor Meera was called |
| 5:33 AM | Room 6 (PG-MEDIA, phone held low): a bed, a boy, a bandaged shoulder; his eyes open. Audio only, no transcript until it ends: "…Bhaiya. Aap aa gaye." *(Pause.)* "Light ready hai." *(You came. …The light's ready.)* | Always |
| 5:40 AM | Raju: "Pahunch gaya. Gate pe hoon." *(I'm here. At the gate.)* | Raju called |
| 5:52 AM | Meera: "DCP raste mein hai. Pandrah minute." *(The DCP's on the way. Fifteen minutes.)* | `dcp_route` |
| 6:05 AM | **The statement** (PG-MEDIA, front camera): the first time the player hears "their" voice live. It is assembled from the case file (below). | Always |
| 6:20 AM | DCP South arrives; the admission record is copied in front of her. **Or** the SHO from Fatehpur Beri arrives, after making one call before he comes in. | `dcp_route` / not |
| 6:58 AM | "A white Innova waits at the back gate for a patient called Deepak. Nobody comes out." | Always |
| 7:10 AM | "Dilip is moved to AIIMS Trauma Centre under his own name. Sameer gives a formal statement." **Or** "Sister Anita doesn't sign the discharge. Dilip stays in Room 6. The SHO takes Sameer instead." | `dcp_route` / not |
| 9:12 AM | A news post card: Kunal's frame, captioned "Wedding planner caught firing at catering worker." Bhasin's counter. | Always |
| 11:30 AM | "Police record a statement from the bride's father about a 12:38 AM order. He denies it." | `dcp_route` |
| 9:40 AM | Mummy: "Beta, TV pe tera naam aa raha hai. Tu theek hai? Khana khaya?" *(Your name is on TV. Are you okay? Have you eaten?)* | Always |
| 11:12 AM | Nitin. If P1 was made and the statement named 1:52: "Tune pakki bola tha." *(You said pakki.)* If `nitin_warned`: "Mera naam aaya. Theek hai. Sach hai." *(My name came up. It's okay. It's true.)* If the statement omitted 1:52: "Tune 1:52 nahi bataya." *(You didn't tell them about 1:52.)* | Per state |

**The statement**, assembled from what the player filed:

- **Opening:** "Main Sameer Khurrana hoon." *(I am Sameer Khurrana.)*
- **Q4.** Truth filed: "Doosri goli maine chalayi thi." *(I fired the second shot.)* If Q4 still holds Sameer's version: "Us raat goli chali thi. Main wahan tha." *(A shot was fired that night. I was there.)* The edit survives even in his confession.
- **Q6** truth filed: "1:52 pe maine Nitin ko jhooth bola. Gaadi meri wajah se khaali gayi." *(At 1:52 I lied to Nitin. The car left empty because of me.)*
- **Q7** truth filed: "4:47 pe aag maine lagayi thi, Bhasin sir ke kehne pe." *(At 4:47 I lit the fire, on Bhasin sir's word.)*
- **Always:** "Ye Dilip hai. Dilip Kumar Mahto. Zinda hai." *(This is Dilip. He's alive.)*

**Final image** (PG-FINAL): the old phone in a police evidence bag on a steel table. Its screen lights: "Mummy: …Khana khaya?" Cut to Raju's LAPATA poster: LAPATA struck through in ballpoint, "MIL GAYA" (found) written above Dilip's photo. If Raju wasn't called, Anita sends the poster photo instead: "Inke bhai ne bheja." *(His brother sent this.)*

**Final line card:** "Dilip Kumar Mahto, 19. He held the light."

**Coda** (6 s): Dilip's front-camera video from 18 Nov: "Hello sir, my name is Dilip Kumar Mahto…" He is finally in frame.

**End card headline:** "Dilip Kumar Mahto is alive. Sameer Khurrana told them."

### The Trade

The old phone goes down with the guard. Its screen faces the floor as it leaves, then goes dark. The rest plays on PG-YOURPHONE (Marine Drive wallpaper).

| Clock | Beat |
|---|---|
| 4:44 AM | Guard (call): "Le gaye, sahab. Bhasin sahab ne bola, shukriya." *(They've taken it. Bhasin sahab said thank you.)* |
| 5:02 AM | Bhasin: "Shabaash beta. Saat baje bus." *(Well done. Bus at seven.)* |
| 6:50 AM | Unknown number: "Main Anita. Discharge ho gaya. Woh chal ke gaya." *(It's Anita. He's discharged. He walked out.)* (She copied the number from Bhasin's man's slip.) |
| 7:20 AM | Bhasin sends a photo: Dilip in a bus seat at Anand Vihar ISBT, arm in a sling, looking at the camera, not smiling. "Zinda. Jaisa kaha tha." *(Alive. As I said.)* |
| 9:30 AM | If `meera_has_copy`, Meera: "Bhasin ka phone aaya tha mere senior ko. Maine copy delete nahi ki. Dilip ghar pahunch jaaye, phir baat karenge." *(Bhasin called my senior. I haven't deleted the copy. Once Dilip's home, we'll talk.)* |
| 4:55 PM | "Train 12952 has departed New Delhi. Coach B3, seat 41." |
| 11:02 PM | Rangmanch: "Welcome aboard, Sameer! Mr Sehgal speaks very highly of you." (cc: Sehgal Enterprises) |

PG-CARD: "Three weeks later." A voice note arrives from a Bihar number:

> DILIP: "Bhaiya, main Dilip. Bhasin sir ne aapka naya number diya. Bole aapne hi mujhe ghar bhijwaya. Shukriya bhaiya. Sach mein. Maa ko kuch nahi bataya. …Mumbai mein light ka kaam ho toh bula lena."
> *It's Dilip. Bhasin sir gave me your new number. Said you're the one who sent me home. Thank you. Really. I didn't tell Maa anything. …If there's light work in Mumbai, call me.*

**Final image:** a photo from Dilip of Chhath at a Samastipur ghat, evening lamps on the water, his mother beside him. Alive, home.

**Final line card:** "Dilip Kumar Mahto, 19. He thinks you saved him."

**End card headline:** "Dilip Kumar Mahto is home." Line: "The record of that night is with Bhasin."

### The 4:55

The ending plays on the old phone, which Sameer keeps.

| Clock | Beat |
|---|---|
| 4:41 AM | Bhasin: "Neeche nahi aayega? …Theek hai." *(Not coming down? …Fine.)* |
| 6:30 AM | Bhasin: "Jaa. Mumbai mein humare log hain. Phone sambhaal ke rakhna. Ladka hum sambhaal ke rakhenge." *(Go. We have people in Mumbai. Look after the phone. We'll look after the boy.)* |
| 6:58 AM | Anita: "Le gaye. White Innova. Kahan, nahi bataya." *(They took him. White Innova. Didn't say where.)* |
| 7:02 AM | Anita: "Woh pooch raha tha aap aaye kyun nahi." *(He was asking why you didn't come.)* |
| 7:03 AM | Anita: "Uska phone mere paas hai. Main rakh lungi. Shayad koi aaye." *(I have his phone. I'll keep it. Maybe someone will come.)* |
| 8:00 AM | Missed call: Raju (48) |
| 4:55 PM | Train 12952 departs. Kunal: "Safe journey bhai. Papa ne bola tension mat lena." *(Dad said don't worry.)* |
| 11:40 PM | Rangmanch welcome mail, cc Sehgal Enterprises |

PG-FINAL (Mon 30 Nov, 8:35 AM): the sea at Marine Drive, full-bleed, morning haze. Over it, from the old Dilip chat, two bubbles drift up: "Bhaiya, Mumbai mein samundar roz dikhega?" / "Roz." Hold 4 s.

PG-CARD: "Three weeks later." Raju, still writing to this number, sends a reprinted poster: "Naya chhapwaya hai. Koi bhi khabar ho toh batana." *(Had new ones printed. If you hear anything, tell me.)* The poster still reads "Last seen: Banyan Farms, Chhattarpur." He never learned more.

**Coda** (PG-MEDIA, 10 s): a Rangmanch reel at a Mumbai wedding, fairy lights. A new boy, about 18, behind an LED panel: "Sir, light yahan theek hai?" Sameer, off-camera: "Haan. Wahin. Ab hilna mat." *(Yes. There. Now don't move.)* Black.

**Final line card:** "Dilip Kumar Mahto, 19. He held the light. Somebody else holds it now."

**End card headline:** "Dilip Kumar Mahto is still missing." Line: "Sameer Khurrana reached Mumbai."

**PG-STINGER** (optional, pending the Chapter 2 canon): the last local at Dadar; a phone left buzzing on the seat beside him. "Chapter 2 · Last Local."

### Return to Origin

The ending plays on the old phone, inside the envelope.

| Clock | Beat |
|---|---|
| 4:58 AM | Guard (PG-YOURPHONE): "Gate pe rakh diya, sahab. Courier subah aayega." *(Left it at the gate. Courier comes in the morning.)* |
| 5:10 AM | Bhasin: "Phir bhej raha hai? Theek hai. Hum bhi intezaar kar lete hain. Ladka bhi." *(Sending it again? Fine. We'll wait too. So will the boy.)* |
| 6:58 AM | Anita: "Le gaye." *(They took him.)* |

PG-FINAL: the sealed envelope on the guard's counter in early light. Through the paper, the phone's screen lights up: "48 missed calls." If `meera_has_copy`, the next notification glows through: "M: Maine copy rakh li hai. Jab tu tayyar ho." *(I've kept a copy. Whenever you're ready.)* Then "Mummy: Khana khaya?" The screen dims.

Black. **PG-COLD replays, identical to the opening.** PG-CARD: "Seven days later, a parcel comes back to your door." The parcel screen, waybill "RETURN TO ORIGIN · Attempt 2 · Refused by addressee." Hold 3 s.

**Final line card:** "Dilip Kumar Mahto, 19. He asked if you were coming."

**End card headline:** "Return to Origin." Line: "It will come back."

**Face-down variant:** no camera and no montage. Meera's "Theek hai, Sameer. Mat dekh." leads straight into the repack, and the montage is never shown. The end card adds: "You didn't look."

### Unopened

Triggered by **Close the case** before 3:58 AM, after the confirmation "Put it away? You can open it again."

PG-TABLE: the phone face down on the envelope. Notifications glow at the table's edge (Raju, Mummy). PG-CARD: "You put it away. It's still ringing."

The end card is minimal: "Unopened" and **Open it again**, which resumes the exact state. There is no tally and no Look again.

### Ending modifiers

| State | Effect |
|---|---|
| `nitin_exposed` | Every ending adds 5:30 AM, Nitin: "Bhasin ke log phir aaye the." *(Bhasin's men came again.)* |
| Promise P1 made | Room 6, if the statement names 1:52: "Tune pakki bola tha." Other endings: the promise is kept. |
| Promise P2 made | Kept in Room 6 and the Trade; broken in the 4:55 and Return to Origin. The end card reads it back. |
| Promise P3 made | Broken if anything is permanently deleted. Room 6 with nothing deleted and `meera_contact`: Meera at 7:30 AM, "Phone mein kuch nahi badla. Achha kiya." *(Nothing on the phone changed. Good.)* |
| Money evidence observed (E23 + E26) | Room 6 and the 4:55 add: "The balance was real. The silence it bought wasn't on the invoice." |
| Rangmanch page 2 observed (E20 p2) | The 4:55 end card adds: "You knew who sent you." Otherwise: "Page 2 of the offer: 'Referred by: Mr B. Sehgal.'" |
| `raju_trust=broken` and not repaired | Raju is never present; Anita sends the poster. |

### End card (all endings except Unopened)

- **Headline** and **line** as above.
- **"Which Sameer read the phone."** Two bars, *The one checking* (Auditor) and *The one who wanted it found* (Confessor), each with the player's single most weighted line quoted under it.
- **"Your story held on N of 4."** The four contestable questions (section 12).
- **"Promises made: N. Kept: N."**
- **"Clues you walked past: N of 15"**, with a **Look again** button (section 15).
- **"Your night":** the player's choices as a timeline.
- **Ending split** across all players, shown only after 500 completions.
- **Share card**, spoiler-safe by default: "Raakh · Ending: Room 6 · Promises kept: 1 of 3." A second "Finished it? Share the full card" version includes the bars.
- **Chapter 2 card.**

## 12. Case file: eight questions

**Rules**

- Each question is a sentence with blanks. All options are shown from the start.
- The player fills the blanks, tables proof, then files.
- Filing the truth gives a result line.
- Filing Sameer's version is accepted without comment and labelled "Sameer's version" (A+1). It "holds" until the truth is filed on that question.
- A hunch is accepted without full proof and pays off later as "You called it."
- Refusals always point somewhere useful.
- Any listed proof bundle is enough.
- Three hints per question; the third is the answer.
- With help shows "Where to look"; Detective doesn't.

**Contestable questions** (the "your story held" count): Q4, Q6, Q7, Q8. Q7's version is automatically overturned the moment Q8 is filed, because Dilip is alive.

**Q1 · Who is S, and where is he running to?** Episode 1. Where to look: settings, instagram, mail.

Sentence: "S is {name}, a {job}, and tomorrow afternoon he's on a train to {city}."
- {name}: Sameer Khurrana · Rohan · Kunal · Nitin · me
- {job}: wedding planner · wedding photographer · caterer
- {city}: Mumbai · Jaipur · Samastipur

| Words | Kind | Proof (any one) | Result |
|---|---|---|---|
| Sameer Khurrana / wedding planner / Mumbai | Truth | @sk.weddings + E19; or E20 + E21; or E13 + E19 | "Sameer Khurrana, 28. SK Weddings, South Delhi. Leaving for a job in Mumbai that starts Monday. His train goes at 4:55 tomorrow." |
| me / any | Refused before the hunch threshold | — | "Nothing on the phone puts you in it. Not yet." |
| me / wedding planner / Mumbai | Hunch (Q1 is editable after filing; allowed once E02 and E13 are both observed, or E15 is) | E02 + E13, or E15 | "Filed, as your hunch. The parcel went back to the address on his account. It reached your door." Unlocks the Meera option "Meera. Main hoon." |

Hints: "Who does this phone belong to? Try Settings." → "The invoice and the train ticket name the same man." → "S is Sameer Khurrana, a wedding planner going to Mumbai."

**Q2 · Dilip is missing. Who is he, and where was he last seen?** Episode 1. Where to look: whatsapp, photos, notes.

Sentence: "Dilip is a {role}, last seen {where}, holding {what} for Sameer."
- {role}: catering worker · guest · driver
- {where}: at the Sehgal wedding · at the caterer's kitchen · at Samastipur bus stand
- {what}: the light · the camera · a tray

| Words | Kind | Proof | Result |
|---|---|---|---|
| catering worker / Sehgal wedding / the light | Truth | E08 + E10 (badge zoomed) + E11; or E09 (2:10 PM) + E10 + E11 | "Dilip Kumar Mahto, nineteen, Sethi Caterers. At 9:48 Sameer photographed him smiling over a tray. At 12:15 he was holding Sameer's light. Nobody has seen him since." |
| … / a tray | Refused | — | "That was 9:48. Where was he at 12:15?" |

Hints: "Zoom into the portrait in Favorites." → "The run sheet says who held the light." → "A catering worker, at the Sehgal wedding, holding the light."

**Q3 · Someone set this phone up for M. When, and where does the list stop?** Episode 1. Where to look: notes, settings.

Sentence: "It was got ready on {when}: the passcode off, and a list for M that stops at {name}."
- {when}: Thursday night · the wedding night · Saturday morning
- {name}: Nitin · Bhasin · Kunal · Dilip

| Words | Kind | Proof | Result |
|---|---|---|---|
| Thursday night / Nitin | Truth | E12 (± E14) | "Thursday night, 11:20: a reading order for M, and a phone anyone can open. The list stops mid-line, at a name." Triggers the end of Episode 1. |

**Q4 · Who fired the shot that hit Dilip?** Episode 2. Where to look: photos, voice memos, whatsapp. Contestable.

Sentence: "Kunal fired on the {place} at 11:52. Forty minutes later on the back lawn, {who} fired twice, and the {which} shot hit Dilip."
- {place}: dance floor · back lawn
- {who}: Sameer · Kunal · Bhasin
- {which}: second · first

| Words | Kind | Proof | Result |
|---|---|---|---|
| dance floor / Sameer / second | Truth | E17 + E30; or E17 + E31; or E17 + E43; or E17 + E29 + E34; or **non-deletable:** E17 + E29 + E16 | "The first shot was for the camera. The second, as he posed for Kunal, went lower than he meant. That was 12:32. A week later, to the minute, his phone came back on." |
| dance floor / Kunal / second | Sameer's version | E04 + E18 | "On the record, as Sameer tells it." |
| dance floor / Sameer / second, partial proof | Hunch | E11 + E16 only | "Filed, as your hunch. Nothing you've tabled puts the gun in his hand. Not yet." |
| back lawn / … | Refused | — | "Look at the floor under Kunal's feet at 11:52." |
| … / first | Refused | — | "The first went straight up, for the camera. Listen again." |

**Q5 · After the shot, was Dilip alive, and what happened to the car that came for him?** Episode 2. Where to look: whatsapp, photos.

Sentence: "At {time} Dilip was {state}. {who} sent a car to the service gate, and at 2:04 it left {how}."
- {time}: 1:14 · 2:41
- {state}: awake · already gone
- {who}: Nitin · Bhasin · Sameer
- {how}: without him · with him

| Words | Kind | Proof | Result |
|---|---|---|---|
| 1:14 / awake / Nitin / without him | Truth | (E33 1:14 or E36 1:07) + E37 (1:22) + (E37 2:04 or E33 2:04) | "At 1:14, forty minutes after the shot, he was awake and asking for water. Forty metres away, Nitin's car waited at the service gate on Mandi Road. At 2:04 it left without him." |
| 2:41 / already gone | Refused | — | "At 2:41 he'd stopped speaking. That isn't the same thing. Look earlier." |
| … / Sameer / … | Refused | — | "Who wrote 'Dilip ko service gate pe le aao'?" |

**Q6 · Why did the car leave empty?** Episode 3. Where to look: whatsapp, photos, safari. Contestable.

Sentence: "The car left empty because {cause}."

| Option | Kind | Proof | Result |
|---|---|---|---|
| Sameer told Nitin Dilip had already gone, knowing he hadn't | Truth | E42 + E33 (1:49); or **non-deletable:** E33 (1:49) + E37 (1:53) + E35 (1:56) | "At 1:49 he was in the room with Dilip. At 1:52 he told Nitin Dilip had gone. At 1:56 he was still searching for an ambulance. A week later, to the minute, Nitin sent the message back." |
| Bhasin's people turned it away at the gate | Sameer's version | E33 (1:59 + 2:04) | "On the record, as Sameer tells it." |
| Sameer told Nitin Dilip had already gone, believing it | Refused | — | "Believing it? Where was he at 1:49?" |
| Nitin gave up waiting | Refused | — | "Read 1:53 again. He's answering someone." |

**Q7 · What burned on the back plot?** Episode 3. Where to look: notes, photos, whatsapp. Contestable (auto-overturned by Q8).

Sentence: "At 4:47 Sameer {role} on {whose} orders, and what burned was {what}."
- {role}: lit the fire · only watched
- {whose}: Bhasin's · Kunal's
- {what}: Dilip's body, rolled in a mattress · an empty mattress, sheets and clothes

| Words | Kind | Proof | Result |
|---|---|---|---|
| lit the fire / Bhasin's / empty mattress… | Truth | E46a; or **non-deletable:** E33 (2:55) + E28 + E44 | Section 9, scene 3.6; then PG-DARK #1 |
| only watched / Bhasin's / body | Sameer's version | E06 + E28 | "On the record, as Sameer tells it." |
| lit the fire / Bhasin's / body | Refused | — | "Watch the whole clip. Watch the mattress when it opens." |

**Q8 · Who is the patient they call Deepak, and why does 'For M' stop at Nitin?** Episode 3. Where to look: whatsapp, photos, notes. Contestable on its second blank.

Sentence: "The patient is {who}, alive. 'For M' stops at Nitin because {why}."
- {who}: Dilip · a stranger · Nitin
- {why}: Nitin's chat is the one place 1:52 still exists · Nitin wasn't there that night · he ran out of time

| Words | Kind | Proof | Result |
|---|---|---|---|
| Dilip / one place 1:52 still exists | Truth | E48 + E10 + (E42, or E12 with Q6 truth filed) | "Dilip Kumar Mahto is alive, in a room in Fatehpur Beri, under somebody else's name. He has been there a week. Bhasin didn't kill him. He hid him, and let Sameer believe the rest. 'For M' stops where it does because item 4 was the one place 1:52 still exists. They move him at seven." |
| Dilip / ran out of time | Sameer's version | E48 + E10 + E12 + E07 | Dilip part as above; second clause "as Sameer tells it." |
| a stranger / … | Refused | — | "Look at the badge in the bag. You've zoomed into it before." |

## 13. Evidence register

**Del** means deletable (section 17). **ID** means identity clue (section 15).

| ID | Item | Where · from | Establishes | Doesn't establish | Flags |
|---|---|---|---|---|---|
| E01 | Lock screen | Phone · Ep1 | Urgency; who's looking | Anything about guilt | |
| E02 | Waybill | Parcel · Ep1 | Refused by M; returned to S. Khurrana's address | — | ID |
| E03 | Envelope note | Parcel · Ep1 | Sameer's warning about the local station | That it's true | |
| E04–E07 | Voice notes 1–4 to M | WhatsApp › M · Ep1 | Sameer's account | That it's true | |
| E08 | LAPATA poster | WhatsApp › Raju · Ep1 | Dilip is missing; family searching | Cause | |
| E09 | Sethi chat | WhatsApp · Ep1 | Dilip's job; assignment to Sameer's shoot; "hisaab" settled by Bhasin | — | |
| E10 | 9:48 portrait | Photos › Favorites · Ep1 | Identity via the badge | — | |
| E11 | Run sheet | Notes · Ep1 | Sameer's own reel; D on the light | Who fired | |
| E12 | "For M" | Notes · Ep1 | Thursday prep; the list stops at Nitin | Why | |
| E13 | Apple Account | Settings · Ep1 | Name, birthday, address | — | ID |
| E14 | Passcode off | Settings · Ep1 | Set up for a reader | — | |
| E15 | Find My | Settings · Ep1 | This iPhone is "Home," Malviya Nagar; shared with Mummy | — | ID (deep) |
| E16 | "Papa wali" | WhatsApp › Kunal · Ep1 | A real gun was planned | Who fired | |
| E17 | 11:52 clip | WhatsApp › Kunal · Ep1 | Kunal's dance-floor firing | The lawn shot | |
| E18 | 12:22 story DM | Instagram · Ep1 | Kunal had the real revolver | Who fired | |
| E19 | Invoice SK-1127 | Mail · Ep1 | ₹1,80,000 owed | A bribe | |
| E20 | Rangmanch offer (p2: "Referred by: Mr B. Sehgal") | Mail · Ep1 | The job came through Bhasin | — | |
| E21 | Train ticket | Mail · Ep1 | 4:55, Sun 29, B3/41 | — | |
| E22 | Site plan | Mail · Ep1 | Service room 40 m from the gate | — | |
| E23 | ₹1,80,000 in | Paytap · Ep1 | Paid Sunday 11:04 AM | A bribe | |
| E24, E25 | ₹35,000 deposit; ₹5,000 to Nitin | Paytap · Ep1 | Mumbai plans; paying Nitin | Hush money | |
| E26 | Bhasin's 9:10 AM message | WhatsApp · Ep1 | Payment tied to silence | — | |
| E27 | Mummy history | WhatsApp · Ep1 | Bhasin's gifts; Find My setup | — | |
| E28 | 9 s fire trim | Photos · Ep1 | A fire, a rolled mattress | What's inside | |
| E29 | 12:29 photo | Shared Album · Ep2 | Gun in Sameer's hand; Dilip on the light; kada | That it fired | ID (kada) |
| E30 | Reel take | Recently Deleted · Ep2 | The sequence; second shot by Sameer | — | Del |
| E31 | Confession memo | Voice Memos › Recently Deleted · Ep2 | Sameer's own admission and excuse | Innocence | Del |
| E32 | Code memo | Voice Memos › Recently Deleted · Ep2 | Code clue | — | |
| E33 | Group screenshots | Screenshots · Ep2 | No 112; service room; 1:14 alive; 1:49; car arrived and left; 2:55 car out; "Baaki back plot pe" | Who fired | |
| E34 | 12:36 screenshot | Recently Deleted · Ep2 | Sameer held the gun | — | Del |
| E35 | Safari history | Safari · Ep2 | His searches; the 1:56 ambulance search; blue-tick search | — | |
| E36 | Dilip chat | Locked · Ep2 | Promises; 1:07 alive; read receipt Tue 3:12 AM; Dilip's intro video | Where he is | |
| E37 | Nitin chat | Locked · Ep2 | Car sent; 1:53 answers a missing message | Who lied | |
| E38 | Recents | Phone · Ep1 | 1:15, 3:31, Thursday calls | Content | |
| E40 | Raju's code line | Call · Ep2 | "Pakki" | — | |
| E42 | Nitin's copy of 1:52 | Nitin · Ep2 end | The lie, knowingly | — | Del |
| E43 | Kunal's frame | Kunal / locked note · Ep2–3 | Sameer firing, second angle | — | Del (in note) |
| E44 | Kunal's jerrycan line | Kunal · Ep3 | Sameer carried the jerrycan | — | |
| E45 | Kunal's Rangmanch line | Kunal · Ep3 | Bhasin arranged the job | — | |
| E46a | Full fire clip | Locked note · Ep2+ | Sameer lit it; the mattress was empty; kada | Where Dilip is | Del; ID (kada) |
| E46b | Note text | Locked note · Ep2+ | Bhasin's 3:31 words; "Maine dekha nahi" | — | |
| E47, E48 | Anita's text and voice note; belongings and slip photos | Dilip's number · Ep3 | Deepak is Dilip; alive; 7 AM move | Legal outcome | |
| E49 | Dilip's plea | Dilip's number · Ep3 | His wish | — | |
| E50 | Bhasin's terms | Voice note · Ep3 | The trade; Rangmanch; holding Dilip | That he'll keep his word | |
| E53 | Camera photo | Camera · reveal | "Proof: you" | — | ID |
| E54 | Case-file metadata | Case file · reveal | Created on this iPhone at 11:44 PM | — | ID |

## 14. Choices, the two impulses, and the state model

**Impulse tally.** Choices carry [A] or [C] weights (listed in the scene tables). Also counted:

| Action | Weight |
|---|---|
| Filing Sameer's version | A+1 |
| Filing the truth on a contestable question | C+1 |
| Soft delete (to Recently Deleted) | A+1 |
| Permanent delete | A+2 |
| Recovering an item | C+1 |
| First Send to M | C+1 |

The tally changes the reveal's Meera line and the end card, never which ending is available.

**Promise ledger**

| Promise | Made by | Kept when |
|---|---|---|
| P1, to Nitin | "Tera naam kahin nahi aayega. Pakki." | His name never appears: kept in the Trade, the 4:55 and Return to Origin; broken in Room 6 if the statement names 1:52 |
| P2, to Raju | "Main usse dhoondh lunga. Pakki." | Room 6 or the Trade |
| P3, to Meera | "Kuch delete nahi karunga." | No permanent deletions |

**State** (one owner per flag; derived values computed, never stored twice)

```
episode: 1|2|3|ending
mode: with_help|detective
real_time: bool
clock: canonical beat id
airplane: bool
raju_first: denial|finding|whos_dilip|declined
raju_trust: low|med|high|broken        // derived from raju_first + Ep2 call + raju_kunal
raju_kunal: bool
mummy_told: stranger|fine|none
meera_contact: bool
meera_has_copy: bool
early_reveal: bool                      // "Meera. Main hoon." chosen
nitin_path: stranger|care|blame
nitin_exposed: bool
nitin_warned: bool
kunal_frame: bool
questions: {Q1..Q8: {status: open|truth|version|hunch|refused, filed_at, proof[]}}
q1_me_hunch: {filed: bool, at: clock}
evidence: {E##: observed|filed|challenged|deleted_soft|deleted_perm}
impulse: {auditor: int, confessor: int}
quotes: {auditor_top: line_id, confessor_top: line_id}
promises: {P1: made|kept|broken, P2…, P3…}
camera_photo: bool
final: {who: me|sameer, where: beri|gate|train, ending: room6|trade|train|origin|unopened, facedown: bool}
pre_ending: {dcp_route, raju_called, nitin_messaged, mummy_messaged, cleanup_deleted[], note_line}
hints_used: {Q#: 0..3}                  // UI only; never read by story or end card
```

**Consequence matrix**

| Choice | Immediate | Later | Never |
|---|---|---|---|
| Mummy: "Aunty…" | She tells Bhasin | Bhasin's "Achha natak hai" voice note | Changes Dilip's timeline |
| Raju: "Kunal Sehgal ne chalayi" | Raju goes to the Sehgals | 2:30 withdrawal; repair costs a confession | Hard-locks Room 6 |
| Nitin, any path | Copy arrives at 1:52 | Path flavours the reveal montage and endings | Withholds the copy |
| Kunal: names Nitin | Bhasin is told | 3:05 threat; Nitin silent; ending line | Goes unmentioned later |
| Send to M | `meera_has_copy` | Meera's glints in the Trade and Return to Origin | Changes the ending selection |
| Permanent delete | Item gone | P3 broken; Room 6 statement unaffected; montage line | Soft-locks a question (non-deletable bundles exist) |
| Q1 "me" hunch | "You called it" | The "Main hoon" option; reveal variant | Skips the reveal |
| Airplane mode | Live messages queue | Bhasin's Ep1 variant | Loses a message |

## 15. Planted clues and the fair-play audit

**Identity clues.** "Look again" lists these with when the player first saw them. The count is "Clues you walked past: N of 15."

| # | Clue | Where | Ep |
|---|---|---|---|
| IC1 | Waybill sender address = Apple Account address | E02, E13 | 1 |
| IC2 | Find My: "This iPhone · Home" | E15 | 1 |
| IC3 | The kada on the hand that opens the parcel | Scene 1.2 | 1 |
| IC4 | Case-file header "On this iPhone · Today 11:44 PM" | Scene 1.6 | 1 |
| IC5 | Bhasin: "Ghar pe hi hai. Achha hai." | Scene 1.11 | 1 |
| IC6 | Mummy: "Aunty? …Beta, tu kya bol raha hai?" | Scene 1.10 (conditional) | 1 |
| IC7 | Silhouette in the dead screen | PG-DEATH | 1 |
| IC8 | Kada on the charging hand | Scene 1.12 | 1→2 |
| IC9 | Kada on the gun hand at 12:29 | E29 | 2 |
| IC10 | Bhasin: "Achha natak hai." | Scene 2.3 (conditional) | 2 |
| IC11 | Meera's pause after "Sameer—"; "Aap jo bhi ho" | Scene 2.7 | 2 |
| IC12 | Nitin: "Ye tera hi message hai" (care path) | Scene 2.11 | 2 |
| IC13 | Kunal: "Aur main dulha hoon" | Scene 3.3 (conditional) | 3 |
| IC14 | Kada on the hand at the fire | E46a | 3 |
| IC15 | Q1's "me" refusal: "Not yet." | Q1 | 1 |

*Target: about one in five blind players suspects before 3:58 AM (section 19). Tune by playtest: the prominence of IC1, IC3 and IC5 are the main dials.*

**System-text audit.** Every narration string is listed here and checked as true of Sameer.

| String | True? | Note |
|---|---|---|
| "Seven days later, a parcel comes back to your door." | Yes | It is his door |
| "Something inside is buzzing. It was meant for M." | Yes | Replaces "It isn't yours" |
| "You aren't M." | Yes | |
| Brief: "This phone was posted to M… She refused it… Somebody else wants this phone back before morning." | Yes | Bhasin |
| "Sameer has told M what happened. He hasn't proved it." | Yes | |
| "The phone was edited. Somebody kept what he deleted." | Yes | Nitin |
| Q results using "his"/"Sameer" in the third person | Yes | Third person is still true of Sameer |
| Q1 refusal: "Nothing on the phone puts you in it. Not yet." | Yes | Until IC1/IC2 are observed, nothing tabled does |
| "Then where is Dilip?" | Yes (a question) | |
| "Somebody was checking… Both of them were you." | Yes | Canon: both impulses exist |
| Ending lines and cards | Yes | Checked per ending |
| Camera unavailable in Low Power Mode | Yes (fiction rule) | Applies until the reveal |
| **Banned anywhere in-game and on the Raakh pages:** "stranger's phone", "It isn't your phone", "isn't yours", "your address" (as a label) | — | Section 20, landing-page migration |

## 16. Media, photography, video and audio direction

**Continuity lock.** Produce a single sheet before any final asset. These items must match across every appearance:

- **Sameer's face.** It appears in the contact photo, gallery selfies, the 12:29 photo (partial profile), Kunal's frame and the camera reveal. Recognition at the reveal must be instant.
- **The kada.** Plain silver, right wrist, the same width everywhere: parcel hand, charging hand, 12:29 gun hand, fire hand, camera viewfinder.
- **The revolver.** The same model and finish at 11:52, 12:29, 12:31 and in the frame.
- **The LED panel and stand.** The same size and shape in the portrait background, the 12:29 photo and the reel.
- **The waistcoat and badge.** The maroon waistcoat and the DILIP badge are identical in the 9:48 portrait and Anita's photo. The badge must be legible at normal phone width when zoomed.
- **The fire objects.** Jerrycan, rolled mattress, sheets and clothes.
- **Banyan Farms.** One map: dance floor, back lawn, service room, service gate (Mandi Road), back plot.
- **Bedi Nursing Home.** Side entrance, corridor, Room 6.

**The reel take** (E30, 18 s, vertical, 30 fps, tripod, phone compression and autofocus breathing; warm string lights; the LED panel overexposes Dilip slightly)

| Time | Content |
|---|---|
| 0–3 s | Dilip adjusts the panel: "Bhaiya, light yahan theek hai?" |
| 3–6 s | "Mumbai pakki na?" / "Pakki. Ab hilna mat." |
| 6–9 s | Sameer, in frame from the side, raises the gun and fires up. The audio clips. Laughter. |
| 9–13 s | He resets his pose. "Ek aur, pose mein—" |
| 13 s | Second shot. The panel tips out of frame. |
| 14–16 s | Nobody speaks. A chair scrapes. Sameer, very quietly: "Dilip?" |
| 16–18 s | Someone's legs cross the frame toward the tripod. Cut. |

No wound is shown. The clue is the sequence.

**The fire** (E46a, 31 s handheld, never showing Sameer's face, fire as the only light plus a cool spill from a security lamp)

| Time | Content |
|---|---|
| 0–6 s | The kada hand sets down a jerrycan beside a rolled mattress and a bundle of sheets. |
| 6–9 s | Bhasin, off-camera: "Uske kapde bhi." A bag and a shirt are thrown on. |
| 9–14 s | Pouring. Hesitation. Ignition. |
| 14–24 s | The camera drifts but stays on the pile. |
| 24–31 s | **The rolled mattress burns open and lies flat. It is empty: foam, springs, nothing else.** Cut. |

The 9 s trim (E28) is 0–9 s only. The emptiness must be readable without frame-stepping. Never use smoke or cropping to imply a body.

**The camera viewfinder.** A 6 s live loop with micro-motion (blink, breath, a slight hand tremor). Lit only by the screen. The kada enters frame at the lower edge. Unshaven; red eyes; a T-shirt, not wedding clothes. It must read as a live camera, not a photo.

**Room 6 media**
- Corridor walk: 14 s, front camera, a tube light flickering once.
- Room 6: 10 s, phone held low, the bed edge in the foreground, Dilip's face partly in shadow, eyes opening.
- The statement: 25–40 s, front camera, Sameer speaking to his own phone. It is assembled from voiced segments recorded per clause.

**Voice**
- One consistent actor per character.
- **The player's lines are never voiced** until the Room 6 statement. This is a rule, not an omission.
- Sameer's voice notes: fluent early on; later full of self-corrections.
- Bhasin: quiet certainty.
- Meera: precise; the two-second pause after "Sameer—" is the most important line reading in the chapter.
- Raju: exhaustion, no strings under him.
- Anita: a private recording at the end of a shift.
- Dilip: earnest; his English is simple, never comic.
- Recordings sound like phones in real rooms: distance, breath, compression.

**Sound**
- Distant dhol is the chapter's memory. It is used in the cold open and its reprise, sparingly elsewhere, never under clues.
- The three PG-DARK moments have no music.
- Endings: one sparse motif (tanpura drone plus a single piano note) under final images only.

**Accessibility.** Transcripts and English for every audio item. No vital clue conveyed by sound alone. Replayable media. No flashing; no screen shake on the gunshots.

## 17. Phone UI and engine rules

- **Phone shell.** Keep the current apps. Add **Camera** (front viewfinder only; unavailable until the reveal) and the **PG-YOURPHONE** overlay (not browsable; incoming call and notification surfaces only).

- **Case file**
  - Restyle as a Notes-backed document. Header: "On this iPhone · Today 11:44 PM" (set when first opened). The info panel exists but is not reachable until the reveal.
  - Persistent banner with the open question.
  - Two-lane night strip: THAT NIGHT and TONIGHT, labelled "Known" / "Sameer says" / "Contradicted." Tap an entry to open its evidence.

- **Story clock**
  - Advances only at authored beats.
  - The status bar never shows a time earlier than a delivered message.
  - It holds during the final choice.
  - Live messages arrive only after the beat that sends them.
  - (This fixes the old "Saturday" header and the out-of-order Kunal and Sameer stamps.)

- **Evidence**
  - Registered on first observation and usable as proof immediately, whatever the episode.
  - Questions gate progress; evidence does not.
  - States: observed → filed → challenged (struck through when a later truth contradicts it; the original is never altered).

- **Deletion**
  - Long-press or the ⋯ menu on deletable items offers Delete (moves to Recently Deleted) and, from Recently Deleted, Delete permanently or Recover.
  - Filed questions keep their status if a source is deleted; the proof shows "source deleted."
  - Every question has a non-deletable proof bundle.

- **Airplane mode.** Live messages queue and deliver when turned off, exactly as on a real phone. Find My can't locate. iCloud doesn't sync. No beat is ever lost.

- **Battery**
  - 9% → 2% across Episode 1 beats, then the death and the charging interstitial.
  - The physical charger is optional via the Battery Status API; the fallback button appears after 5 s.
  - Battery never ends the story.

- **Real time.** Opt-in; applies only to Bhasin's half hour; 5:00 real minutes; pausable; on expiry only The Trade closes.

- **Hints and modes.** Three hints per question. With help shows app pointers and highlights; Detective shows neither. Switching modes is free. Hint use is never read by story logic.

- **Save and resume.** Autosave on every observation, filing, choice and beat. Resume to the same screen and clock. If storage fails, offer a "Copy progress code" fallback.

- **Privacy.** No real contacts, location, microphone, camera or notifications. The "camera" is a pre-rendered asset.

- **Look again.** After any ending (except Unopened), replay with a clue layer: each IC has a soft marker and a "first seen" time. The list view shows walked-past clues.

## 18. Continuity and plausibility audit

These are the questions a careful player will ask, with the answers the game supports.

1. **Why didn't Sameer recognise his own phone?** He did. He reads it as M would, to test what a reader could prove. Section 2; the two-impulse framing.

2. **Why "solve" things he already knows?**
   - The case file tests what a reader can *prove*, not what he knows.
   - Some discoveries are genuinely new to him: Nitin kept 1:52; the empty mattress (he never watched the clip); Dilip read "maaf kar de"; Dilip is alive; Rangmanch came through Bhasin.

3. **Why tell Raju or Mummy "I'm not Sameer"?** Because the player chose to, and because Sameer couldn't face them. The reveal reads it back.

4. **Why doesn't Bhasin just take the phone?**
   - Navjeevan is gated, with a guard who knows Sameer.
   - Bhasin needs Sameer's silence and his departure, not a theft.
   - He fears copies (Meera).

5. **How does Bhasin track the phone?** Mummy's iPhone, which he gifted and set up with Family Sharing on 14 Oct (E27, E15).

6. **How did the parcel come back the same day?** Same-city express: refused at 11:10 AM, signed for at Gate 2 at 7:50 PM, left at the door.

7. **Why did Meera refuse it, and why does she call?** She won't be his confession box. Then she can't sleep, and calls the number she knows will be answered by him.

8. **Why does Meera play along?** She recognises him and suspects he'll destroy what traps him. She stays to protect the evidence and to see what he does. She never claims to know anything she hasn't been told.

9. **Why didn't Sameer see there was no body?** Bhasin said it was rolled in the mattress and "Dekhna mat." He didn't look, and he never watched what he filmed.

10. **Why keep Dilip alive?** A corpse is a murder file; a living "road accident" is manageable.

11. **Why not send Dilip home already?** He needed a week of treatment, and Bhasin wanted the phone resolved and Sameer gone first. The phone's return turned the 7 AM move into leverage.

12. **Why does Anita write tonight, and how?** She learned of the 7 AM move. She saw Sameer's number online in Dilip's chat; she charges his phone at night. It is his phone, from his waistcoat pocket.

13. **"Uske kapde bhi" — but the waistcoat survived?** The burned clothes were his own clothes and bag from the staff changing room. He left wearing the catering waistcoat.

14. **Why the blue ticks on Tuesday?** Dilip read "maaf kar de" when Anita charged his phone. Sameer saw the ticks, assumed Bhasin's men had the phone, and did nothing (E35, 3:20 AM search).

15. **Why can the player speak to Raju without being recognised?** They never met; Dilip gave Raju the number.

16. **Why can't the player call Bhasin or Kunal?** They know his voice. They reach the phone only by message, which is also realistic of both men.

17. **Where does "your phone" come from?** The new phone and SIM bought on Tue 24 Nov for Mumbai.

18. **Why can't Sameer just call 112 at the end?** The local thana is Bhasin's (the envelope note). Room 6 without Meera shows the SHO path honestly.

19. **Does saving Dilip mean arrest?** It means a statement. With the DCP, a formal statement; with the SHO, Sameer is taken on Bhasin's terms. A statement is not a verdict.

20. **Can he reach Fatehpur Beri in time?** It's about 25 minutes from Malviya Nagar at 5 AM, and the move is at 7.

21. **Why is the Trade credible?** It matches Bhasin's interest throughout. Anita confirms the discharge, and Bhasin sends a photo.

22. **The ₹1,80,000.** A legitimate balance whose timing bought silence. Never call it a proven bribe.

23. **Dates and age.** 21, 28 Nov 2026 are Saturdays; 22, 29 are Sundays. Sameer is 28.

24. **Is narration ever false?** No. See the system-text audit in section 15.

## 19. QA matrix, playtest plan and acceptance

**Automated content checks**

- Every event timestamp is in canonical order; no delivered message is earlier than the status bar.
- Every weekday is correct.
- Every question has at least one non-deletable truth bundle.
- Every evidence ID referenced exists.
- Every choice has a declared state effect or is marked flavour.
- Every ending is reachable from a fresh save.
- No banned string (section 15) appears in the content files or Raakh pages.
- The impulse tally changes only lines, never route availability.

**Branch routes to run end to end**

1. Honest throughout (C-heavy) → Room 6 with Meera and Raju.
2. Denials throughout (A-heavy) → Room 6 alone: the "Aap hi dono ho" line plays, and the SHO path runs.
3. Raju told "Kunal" → withdrawal → repaired in "Before you go" → Room 6.
4. Raju told "Kunal" and never repaired → The 4:55: Raju's poster is unchanged.
5. Nitin's promise P1 → Room 6 statement names 1:52 → "Tune pakki bola tha."
6. Kunal told about Nitin → 3:05 threat → any ending shows the 5:30 line.
7. Send to M early → The Trade → Meera's 9:30 line.
8. Permanent deletes → The 4:55 → P3 broken; montage line present.
9. Q1 "me" hunch in Episode 1 → "Meera. Main hoon." → early-reveal variant → The Trade.
10. Face down at the camera → Return to Origin, face-down variant.
11. "Sameer Khurrana" at the final question → Return to Origin, with and without `meera_has_copy`.
12. Close the case in Episode 2 → Unopened → Open it again resumes the exact state.
13. Real time on and expired → The Trade unavailable; Bhasin's expiry line.
14. Airplane mode on through Episode 2 → queued delivery; no beat lost.
15. All hints used → identical availability and end card to a no-hint run.
16. Browser closed at Q6 and resumed → same clock, message order and state.

**Blind playtest** (8–12 players with no script access)

Ask after a first play:
- What did you think happened, and why?
- When, if ever, did you suspect whose phone it was, and what made you suspect?
- At the reveal, did it feel earned or cheated? Name a clue.
- Why did Sameer open his own phone?
- Which ending did you choose, and what did you think it would cost?
- Would you play Chapter 2?

| Metric | Target | If missed |
|---|---|---|
| Suspected the twist before 3:58 AM | 15–25% | Over 35%: soften IC1/IC3/IC5. Under 10%: strengthen IC4/IC11. |
| After the reveal, can name 2 or more clues they had seen | ≥ 80% | Make the clues more legible |
| Says the reveal felt "cheated" | ≤ 15% | Re-audit the narration |
| Can explain why Sameer read his own phone | ≥ 70% | Sharpen Meera's reveal line and the PG-DARK #3 card |
| Confuses Kunal's 11:52 shots with the 12:32 shot | ≤ 10% | Fix the media |
| Believes the full fire clip shows a body | 0% | Fix the media |
| No single ending above 50% across the cohort | — | Rebalance the Trade's appeal (Dilip's plea, Anita's confirmation) |
| "Would play Chapter 2" | ≥ 80% | — |

**Release definition**
- All checks pass and all routes run.
- No placeholder media remains in the released flow.
- The decisive assets are final: the reel take, the full fire clip, the 12:29 photo, Kunal's frame, Anita's photos, the camera loop, the Room 6 media and the voice notes.
- Playtest targets are met or consciously waived.

## 20. Implementation and migration notes

**Remove from 830fbbc**
- The decider (two calls, 40/30 s timers, the combination table, all "Lost" scenes).
- The 12-link model and the "links traced" score.
- Q1–Q14 and QM.
- The record rows (include, leave out, "as Sameer tells it").
- Endings: Wrong Story, Complete Record, Sameer's Version, Return to Sender.
- The entire Sameer new-number thread: "M? Tu hai?", "Online dikh raha hai. M?", "Screenshots dekhe?", "Sab dekh liya?", and every Sameer reply and confession delivered through it.
- The 4-minute real-time countdown.
- Bhasin's two-way call in Episode 3 (replace with voice notes).
- The guard call at 2:40 (moves to the reveal).
- The "opened early only counts in Episode 3" rule.

**Reassign**
- The code "pakki": now from the reel audio, the code memo and Raju (no longer from Sameer).
- Sameer's "Galti thi" / "Maine koshish ki thi" / "Pata tha usme goli hai": dropped. The confession memo (E31) carries his excuse, and the Room 6 statement carries his admission.
- Meera: no longer triggered by Q5. She calls at the 12:51 beat.
- Sister Anita: her shift runs to 7 AM, and she writes at the 3:20 beat.

**Shift**
- All "that night" and "week after" dates move one day earlier (section 1).
- Sameer is 28.
- The train is Sun 29 Nov.

**New content files** (suggested; the existing `content/raakh/*.ts` layout is fine)
- `timeline.ts`: the canonical event table, driving the status bar, delivery, night strip and ending montages.
- `evidence.ts`: the register, with flags (del, id-clue), episode availability and supported claims.
- `questions.ts`: eight questions, the final Q1, bundles, refusals, results, hints.
- `beats.ts`: scene triggers keyed to the clock.
- `choices.ts`: options with impulse weights, promises and state effects.
- `endings.ts`: five endings, timelines, modifiers, final images, cards.
- `presentation.ts`: PG cues per beat.
- `clues.ts`: IC1–IC15 for Look again.
- `strings.audit.ts`: every narration string, for the banned-string check.

**New components**
- `YourPhoneOverlay`
- `CameraViewfinder`
- `CaseFileInfoPanel`
- `RecentlyDeleted` semantics and deletion
- `RevealDirector`: the step sequence, montage assembly, tally variant
- `PreviouslyMontage`, auto-assembled from state
- `NextTeaser`
- `LockscreenEnding`
- `EndCardV3`
- `LookAgainLayer`
- `ImpulseTally`
- `PromiseLedger`
- `RealTimeBhasin`

**Landing page and in-game copy**
- Meta and OG description: "A stranger's phone arrives at your door…" → "A wedding planner's phone comes back to your door. Read his chats, play his voice notes, open what he deleted, and work out what happened."
- "It's 11:40 PM. It isn't your phone." → "It's 11:40 PM. It came back."
- "How it plays · Every chapter starts with something that wasn't meant for you": keep (true: it was meant for M).
- Chapter card ("A wedding planner's phone comes back to your door with a note meant for his ex."): keep; already true.
- Lock-screen preview date (Saturday 28 November): update.
- The site-wide tagline "Thrillers you play on somebody else's phone" can stay as the series promise. Remove it from the Raakh chapter page and the in-game splash.
- Replace "The battery is real" with "Take your time. Nothing is lost by reading slowly."

**Build order**
1. Canonical timeline and dates; run the order checks.
2. Evidence register and the eight questions with non-deletable bundles.
3. State model, impulse tally, promise ledger.
4. Episode beats and live messages.
5. The reveal director and camera.
6. Five endings with modifiers.
7. Presentation layer (PG cues, Previously, Next, end card, Look again).
8. Decisive media assets.
9. QA routes and the blind playtest.
10. Landing-page copy.

**Report back after implementation**
- Files changed; old state removed or migrated; the ending decision tree as built.
- Test results; missing or placeholder assets.
- Playtest numbers against the section 19 targets.
- Any place where code forced a deviation from this spec, and why.

---

The riskiest assumption in the whole document is the guess rate on the twist. The first thing worth testing with real players is Episode 3, from 1:52 to the camera, before any other asset work.
