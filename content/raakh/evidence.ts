import type { Evidence } from "../types";

/* ===========================================================================
   The evidence register (RAAKH-V3 §13): everything the player can table as
   proof, by the code the script gives it.

   Evidence the player finds always counts when found (§2, rule 6): nothing
   here waits for an episode. What the episodes hold back is the door to it
   (iCloud, an offloaded app, a locked chat, a note still downloading), in
   phone.ts and the episode files. `deletable` marks what the phone lets go
   (§17); every question keeps a way in that can't be deleted.

   `manual`: found by doing something particular (leaning in, a call, the
   reveal), so it never puts a badge on an icon. `within`: found by opening
   the thing it's in, not just the app. `foundBy`: found by something the
   player did, whenever that was.
   =========================================================================== */

export const evidence: readonly Evidence[] = [
  // From the parcel, before the phone is turned over.
  { code: "E01", id: "lock-screen", device: "owner", app: "casefile", from: "Lock screen", label: "The lock screen: 47 missed calls, Mummy, Bhasin Uncle", manual: true, foundBy: ["did:past-lock"] },
  { code: "E02", id: "waybill", device: "owner", app: "casefile", from: "From the parcel", label: "The waybill: picked up from S. Khurrana, B-14 Navjeevan Apartments, at 9:10 AM; refused by M at 11:10; returned to origin, B-14, 10:50 PM", manual: true, foundBy: ["did:opened"] },
  // Your own phone, face down beside the parcel, lit once (fix brief H-03).
  { id: "gate-note", device: "owner", app: "casefile", from: "Your phone", label: "Your phone, 10:50 PM: Ram Kishan ji, Gate 2, “B-14 ka parcel aaya hai, upar bhej diya.”", manual: true, foundBy: ["did:opened"] },
  { code: "E03", id: "note", device: "owner", app: "casefile", from: "From the parcel", label: "The envelope: “M — Sab isme hai. Local thane mat le jaana.”", manual: true, foundBy: ["did:unlock"] },

  // His account (Q1).
  { code: "E04", id: "vn-kunal", device: "owner", app: "whatsapp", label: "Voice note 1 to M: “Kunal firing kar raha tha. Ek ladka gir gaya.”", within: true },
  { code: "E05", id: "vn-hospital", device: "owner", app: "whatsapp", label: "Voice note 2: “Usko hospital nahi le gaye.”", within: true },
  { code: "E06", id: "vn-burned", device: "owner", app: "whatsapp", label: "Voice note 3, Monday 2:05 AM: “Unhone usko jala diya, M. Aag maine lagayi.”", within: true },
  { code: "E07", id: "vn-phone", device: "owner", app: "whatsapp", label: "Voice note 4: “Agar mujhe kuch hua… sab phone mein hai.”", within: true },
  { id: "meera", device: "owner", app: "whatsapp", label: "M: Meera Arora, an advocate at Saket District Courts", manual: true },

  // The boy (Q2).
  { code: "E08", id: "poster", device: "owner", app: "whatsapp", label: "LAPATA: Dilip Kumar Mahto, 19, last seen at Banyan Farms", within: true },
  { code: "E09", id: "sethi-shoot", device: "owner", app: "whatsapp", label: "Sethi Caterers, 21 Nov, 2:10 PM: “Dilip ko aapke shoot ke liye 12 baje chhod dunga.”", within: true },
  { code: "E09", id: "sethi-dilip", device: "owner", app: "whatsapp", label: "Sethi Caterers, Monday: Dilip hasn't come in since Saturday", within: true },
  { code: "E09", id: "sethi-list", device: "owner", app: "whatsapp", label: "Sethi Caterers: “Dilip ka hisaab Bhasin sir ne kar diya.”", within: true },
  { code: "E10", id: "portrait", device: "owner", app: "photos", label: "9:48 PM, in Favorites: a catering boy with a tray", within: true },
  { code: "E10", id: "badge", device: "owner", app: "photos", label: "His name badge, zoomed in: DILIP", manual: true },
  { code: "E11", id: "shot-list", device: "owner", app: "notes", label: "His run sheet: “12:15 — SK reel w/ Kunal. back lawn. D — light (N sick)”", within: true },

  // The phone, made ready (Q3).
  { code: "E12", id: "for-m", device: "owner", app: "notes", label: "“For M”: a reading order, Thursday 11:20 PM, stopping at “4. Nitin —”", within: true },
  { code: "E13", id: "apple-account", device: "owner", app: "settings", label: "His Apple Account: Sameer Khurrana, born 14 March 1998, B-14 Navjeevan Apartments, Malviya Nagar", within: true },
  { code: "E14", id: "passcode-off", device: "owner", app: "settings", label: "Passcode: off. Anyone who has this iPhone can open it.", within: true },
  { code: "E15", id: "find-my", device: "owner", app: "settings", label: "Find My: This iPhone · Home · Malviya Nagar · shared with Mummy", within: true },

  // His own Instagram: what he does (Q1, “@sk.weddings + E19”). Opening the app is opening it.
  { id: "sk-films", device: "owner", app: "instagram", label: "@sk.weddings: Delhi weddings, planned like films" },

  // The gun, and the dance floor.
  { code: "E16", id: "kunal-papa", device: "owner", app: "whatsapp", label: "Kunal, 19 Nov: “Bhai reel mein Papa wali le aaunga.”", within: true },
  { code: "E17", id: "kunal-clip", device: "owner", app: "whatsapp", label: "Kunal's clip: the dance floor, 11:52 PM, two shots into the air", within: true, heard: true },
  { id: "kada-selfie", device: "owner", app: "instagram", label: "@sk.weddings, two weeks ago: a selfie, a silver kada on his right wrist, “the kada stays on”", within: true },
  { code: "E18", id: "kunal-story", device: "owner", app: "instagram", label: "Kunal's story, 12:22 AM, by DM: a revolver, “Papa ki hai, asli wali”", within: true },

  // His life, and the money.
  { code: "E19", id: "invoice", device: "owner", app: "mail", label: "Invoice SK-1127 to Sehgal Enterprises: ₹1,80,000 balance", within: true },
  { code: "E20", id: "offer", device: "owner", app: "mail", label: "Rangmanch Weddings, Mumbai: an offer, joining Monday", within: true },
  { code: "E20", id: "offer-p2", device: "owner", app: "mail", label: "The offer, page 2: “Referred by: Mr B. Sehgal, Sehgal Enterprises”", within: true },
  { code: "E21", id: "ticket", device: "owner", app: "mail", label: "Train 12952 to Mumbai, Sunday 29 Nov at 4:55 PM, B3/41", within: true },
  { code: "E22", id: "site-plan", device: "owner", app: "mail", label: "The site plan: the service room, 40 m from the service gate on Mandi Road", within: true },
  { code: "E23", id: "balance", device: "owner", app: "paytap", label: "+₹1,80,000 from Sehgal Enterprises, Sunday 11:04 AM", within: true },
  { code: "E24", id: "deposit", device: "owner", app: "paytap", label: "₹35,000: a deposit on a 1RK in Andheri", within: true },
  { code: "E25", id: "nitin-pay", device: "owner", app: "paytap", label: "₹5,000 to Nitin: “Edit advance · Sehgal film”", within: true },
  { code: "E26", id: "bhasin-balance", device: "owner", app: "whatsapp", label: "Bhasin, Sunday 9:10 AM: “Balance aaj aa jayega. Tab tak kisi se baat nahi.”", within: true },
  { code: "E27", id: "mummy-phone", device: "owner", app: "whatsapp", label: "Mummy, 14 Oct: Bhasin uncle gave her a phone, “location wala bhi on kar diya”", within: true },
  { code: "E27", id: "mummy-bill", device: "owner", app: "whatsapp", label: "Mummy, 30 Oct: Bhasin uncle paid her knee bill", within: true },
  { code: "E27", id: "mummy-findmy", device: "owner", app: "whatsapp", label: "Mummy, 12:02 AM: she pressed Find My; Bhasin uncle rang her, asking", within: true },
  // Episode 2's door (fix brief §6): where this phone is, on Bhasin's gift.
  { code: "E27", id: "mummy-pin", device: "owner", app: "whatsapp", label: "Mummy's Find My, 12:02 AM: one pin, B-14 Navjeevan Apartments, Gate 2 side", within: true },
  { id: "bhasin-vn", device: "owner", app: "whatsapp", label: "Bhasin's voice note, 12:40 AM: the phone at Gate 2 by seven", within: true },
  { id: "new-phone", device: "owner", app: "paytap", label: "Tuesday, ₹11,499 to Croma: a second phone and a new SIM, for Mumbai", within: true },
  { code: "E27", id: "mummy-visit", device: "owner", app: "whatsapp", label: "Mummy, Tuesday: Bhasin uncle asked when he leaves for Mumbai", within: true },

  // The fire, in Episode 1: the first nine seconds.
  { code: "E28", id: "fire-clip", device: "owner", app: "photos", label: "The fire clip: 9 seconds, 4:47 AM, a rolled mattress, sheets, a shirt thrown on", within: true, heard: true },

  // What iCloud and the bin bring down (Episode 2's doors).
  { code: "E29", id: "bts", device: "owner", app: "photos", label: "Kunal's shared album, 12:29 AM: the revolver raised, the tripod, Dilip beside the light", within: true },
  { code: "E30", id: "reel-take", device: "owner", app: "photos", label: "The reel take: a deleted video, 12:31 AM; the second shot, and the light tips over", manual: true, deletable: true, heard: true },
  { code: "E31", id: "memo", device: "owner", app: "voicememos", label: "A deleted memo: “Pehli camera ke liye thi. Doosri… main pose kar raha tha.”", manual: true, deletable: true, heard: true },
  { code: "E32", id: "memo-code", device: "owner", app: "voicememos", label: "A deleted memo: “Code woh hai… jo woh roz poochta tha.”", manual: true, heard: true },
  { code: "E33", id: "no-112", device: "owner", app: "photos", label: "Screenshot: Bhasin, 12:38 AM, “Koi 112 nahi karega. Ladke ko service room le jao.”", within: true },
  { code: "E33", id: "doctor", device: "owner", app: "photos", label: "Screenshot: Bhasin, 12:52 AM, “Thane mein baat ho gayi hai. Doctor ka intezaam ho raha hai.”", within: true },
  { code: "E33", id: "conscious", device: "owner", app: "photos", label: "Screenshot: Pappu, 1:14 AM, “Sir ladka hosh mein hai. Paani maang raha hai.”", within: true },
  { code: "E33", id: "sameer-room", device: "owner", app: "photos", label: "Screenshot: Ramesh, 1:49 AM, “Sameer sir service room mein hain, ladke ke saath.”", within: true },
  { code: "E33", id: "swift", device: "owner", app: "photos", label: "Screenshot: Pappu, 1:59 AM, a Swift at the service gate", within: true },
  { code: "E33", id: "left-empty", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:04 AM, “Chali gayi sir. Driver bol raha tha cancel ho gaya.”", within: true },
  { code: "E33", id: "not-speaking", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:41 AM, “Sir ladka bol nahi raha.”", within: true },
  { code: "E33", id: "car-255", device: "owner", app: "photos", label: "Screenshot: Pappu, 2:55 AM, “Sir gaadi nikal gayi. Uska waistcoat gaadi mein rakh diya.” Bhasin: “Baaki back plot pe.”", within: true },
  { code: "E34", id: "gun-to-kunal", device: "owner", app: "photos", label: "Deleted screenshot: Bhasin, 12:36 AM, “Sameer, gun Kunal ko do. Abhi.”", manual: true, deletable: true },
  { code: "E35", id: "search-1244", device: "owner", app: "safari", label: "Safari, 12:44 AM: “goli lagne pe kya karein”", within: true },
  { code: "E35", id: "search-police", device: "owner", app: "safari", label: "Safari, 1:54 AM: “gunshot hospital police case compulsory”", within: true },
  { code: "E35", id: "search-mlc", device: "owner", app: "safari", label: "Safari, 1:55 AM: “MLC kya hota hai”", within: true },
  { code: "E35", id: "search-156", device: "owner", app: "safari", label: "Safari, 1:56 AM: “private ambulance chhattarpur 24 hours”", within: true },
  { code: "E35", id: "search-ticks", device: "owner", app: "safari", label: "Safari, Tuesday 3:20 AM: “whatsapp blue tick matlab kisi ne padh liya”", within: true },

  // The locked chats.
  { code: "E36", id: "dilip-sea", device: "owner", app: "whatsapp", label: "Dilip: “Mumbai mein samundar roz dikhega?” Sameer: “Roz.”", manual: true },
  { code: "E36", id: "dilip-video", device: "owner", app: "whatsapp", label: "Dilip, front camera: “Hello sir, my name is Dilip Kumar Mahto.”", manual: true },
  { code: "E36", id: "promise", device: "owner", app: "whatsapp", label: "Dilip, 7:10 PM: “Bhaiya Mumbai wali baat pakki na?” Sameer: “pakki.”", manual: true },
  { code: "E36", id: "dilip-107", device: "owner", app: "whatsapp", label: "Dilip, 1:07 AM: “Bhaiya dard ho raha hai. Aap aa rahe ho na?”", manual: true },
  { code: "E36", id: "dilip-read", device: "owner", app: "whatsapp", label: "Sameer to Dilip, Monday 1:10 AM: “Dilip?” “maaf kar de”. Read Tuesday, 3:12 AM", manual: true },
  { code: "E37", id: "nitin-sick", device: "owner", app: "whatsapp", label: "Nitin, 20 Nov: 102° fever. Sameer: “Dilip light sambhaal lega.”", manual: true },
  { code: "E37", id: "nitin-car", device: "owner", app: "whatsapp", label: "Nitin, 1:22 AM: “Vicky ki Swift bhej raha hoon… Dilip ko service gate pe le aao.”", manual: true },
  { code: "E37", id: "nitin-gate", device: "owner", app: "whatsapp", label: "Nitin, 1:40 AM: “Service gate — Mandi Road wala na?”", manual: true },
  { code: "E37", id: "nitin-reply", device: "owner", app: "whatsapp", label: "Nitin, 1:53 AM: “agar le gaye hain toh main Vicky ko wapas bula leta hoon.”", manual: true },
  { code: "E37", id: "nitin-back", device: "owner", app: "whatsapp", label: "Nitin, 2:04 AM: “Vicky wapas aa gaya.”", manual: true },

  // Recents.
  { code: "E38", id: "call-115", device: "owner", app: "phone", label: "1:15 AM: Sameer rang Nitin, 2 minutes 38", within: true },
  { code: "E38", id: "call-206", device: "owner", app: "phone", label: "2:06 AM: three missed calls from Nitin", within: true },
  { code: "E38", id: "call-331", device: "owner", app: "phone", label: "3:31 AM: Bhasin Uncle rang, 4 minutes 12", within: true },
  { code: "E38", id: "call-thu", device: "owner", app: "phone", label: "Thursday 11:24 PM: one ring to Nitin; he rang back at 11:25", within: true },

  // Said aloud on a call.
  { code: "E40", id: "raju-code", device: "owner", app: "phone", label: "Raju: Dilip asked every day, “Mumbai pakki na?”", manual: true, foundBy: ["did:raju-code"] },

  // Kept by somebody else.
  { code: "E42", id: "nitin-152", device: "owner", app: "whatsapp", label: "Nitin's copy of 1:52: “Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.”", within: true, deletable: true },
  { code: "E43", id: "frame", device: "owner", app: "notes", label: "In the locked note: Kunal's frame, a second angle, “Humare paas bhi hai.”", manual: true, deletable: true },
  { code: "E43", id: "kunal-frame", device: "owner", app: "whatsapp", label: "Kunal sends it again: the frame, “Humare paas bhi hai. Soch samajh ke.”", within: true },
  { code: "E44", id: "kunal-jerrycan", device: "owner", app: "whatsapp", label: "Kunal: “Aur jerrycan tu khud uthake le gaya tha. Papa ne bas bola tha.”", within: true },
  { code: "E45", id: "kunal-rangmanch", device: "owner", app: "whatsapp", label: "Kunal: “Rangmanch mein Papa ne baat kar li hai.”", within: true },
  { code: "E46a", id: "fire-original", device: "owner", app: "notes", label: "The whole fire clip, 4:47 AM, in the locked note: the kada hand lights it; the mattress burns open, empty", manual: true, deletable: true, heard: true },
  { code: "E46b", id: "note-text", device: "owner", app: "notes", label: "“Agar kuch hua”: “3:31 — B: Body gadde mein lapet di hai. Tu bas aag laga. Dekhna mat.”", manual: true },

  // From Dilip's number.
  { code: "E47", id: "anita", device: "owner", app: "whatsapp", label: "From Dilip's number: Sister Anita, night nurse, Bedi Nursing Home, Fatehpur Beri", within: true },
  { code: "E47", id: "anita-voice", device: "owner", app: "whatsapp", label: "Sister Anita's voice note: “Deepak, unnees saal, road accident… Goli ka ghaav hai.”", within: true },
  { code: "E47", id: "anita-read", device: "owner", app: "whatsapp", label: "Sister Anita: “Woh phone dekhta rehta hai, jawab nahi deta. Unhone mana kiya hai.”", within: true },
  { code: "E48", id: "belongings", device: "owner", app: "whatsapp", label: "A patient's bag: a maroon waistcoat, a dried stain, a badge: DILIP", within: true },
  { code: "E48", id: "slip", device: "owner", app: "whatsapp", label: "The admission slip: “Deepak · 19 · M · RTA · Adm 22/11 3:20 AM · Room 6”", within: true },
  { code: "E49", id: "dilip-plea", device: "owner", app: "whatsapp", label: "Dilip's voice note: “Bhaiya… aap aa rahe ho na?”", within: true },
  { code: "E50", id: "bhasin-terms", device: "owner", app: "whatsapp", label: "Bhasin's terms: the phone down with the guard, the boy on a bus at seven", within: true },

  // At the reveal.
  // Episode 3's door (fix brief §6): what the player can see on their own wrist.
  { code: "E53", id: "camera-photo", device: "owner", app: "camera", label: "The front camera: your face, and the silver kada on your wrist", manual: true, foundBy: ["did:camera-photo"] },
  { code: "E54", id: "case-meta", device: "owner", app: "casefile", label: "The case file's info: created on this iPhone, Saturday 11:44 PM", manual: true, foundBy: ["did:rv-casefile"] },

  // What the player filed, as proof of what comes after it (Q8's second way in).
  { id: "lie-proved", device: "owner", app: "casefile", label: "Your answer: why the car left empty", manual: true, foundBy: ["claim:q6:truth"] },
];
