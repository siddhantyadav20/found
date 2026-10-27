import type { Ending, EndingLine } from "../types";

/* ===========================================================================
   The endings (RAAKH-V3 §11). The last question selects one; the night
   changes lines, people and costs inside it, and nothing else. No hidden
   score, no first-rule-that-fits.

     me + Fatehpur Beri ............ Room 6
     me + Gate 2, with the phone .... The Trade
     me + the 4:55 .................. The 4:55
     "Sameer Khurrana", or face down  Return to Origin
     Close the case before 3:58 ..... Unopened

   Each plays on a lock screen as the clock moves (PG-LOCK): somebody saying
   something is a notification; what nobody says is a line under the clock;
   `kind` marks what's shown another way (a card, the media, the last image).
   =========================================================================== */

const R = "/found/raakh";

/** Every ending, if Nitin's name reached Bhasin (`nitin_exposed`). */
const NITIN_AGAIN: EndingLine = { at: "5:30 AM", who: "Nitin", text: "Bhasin ke log phir aaye the.", english: "Bhasin's men came again.", needs: ["did:nitin-exposed"] };

/** The money, where the player saw both halves of it (E23 + E26). */
const MONEY: EndingLine = { text: "The balance was real. The silence it bought wasn't on the invoice.", needs: ["saw:balance", "saw:bhasin-balance"] };

/** Dilip's own front-camera video from 18 November: in frame, at last (Room 6's coda). */
const HELLO: EndingLine = {
  kind: "media",
  text: "Dilip, 18 November, on his front camera",
  src: `${R}/dp-dilip.jpg`,
  seconds: 9,
  voice: "clip:d-2v",
  captions: [
    { at: 0.5, who: "Dilip", line: "Hello sir, my name is Dilip Kumar Mahto." },
    { at: 3.5, who: "Dilip", line: "I am from Samastipur." },
    { at: 5.5, who: "Dilip", line: "I can hold light, I can do anything." },
  ],
};

export const endings: readonly Ending[] = [
  /* --- Room 6 -------------------------------------------------------------- */
  {
    id: "room6",
    row: "Room 6",
    when: {},
    headline: "Dilip Kumar Mahto is alive. Sameer Khurrana told them.",
    onlyHere: "His own voice, to his own camera.",
    day: { day: "Sunday", date: "29/11" },
    lines: [
      { at: "4:52 AM", who: "Bhasin Uncle", text: "Sameer. Gaadi dikh rahi hai. Kahan ja raha hai?", english: "I can see the car. Where are you going?" },
      { at: "5:01 AM", who: "Bhasin Uncle", text: "Theek hai. Jaa. Dekhte hain kaun pehle pahunchta hai.", english: "Fine. Go. Let's see who gets there first." },
      { at: "5:18 AM", who: "Dilip", text: "Main Anita. Side door khula hai. Main yahin hoon.", english: "It's Anita. The side door's open. I'm here." },
      NITIN_AGAIN,
      {
        at: "5:31 AM",
        kind: "media",
        text: "Bedi Nursing Home, the side corridor: a tube light flickers once; a hand points to a door marked 6",
        seconds: 14,
        voice: "media:corridor-alone",
        captions: [
          { at: 1, line: "[his breathing, close to the phone]" },
          { at: 5, line: "[a tube light flickers once]" },
          { at: 8, line: "[a hand points to a door: 6]" },
          { at: 10, who: "Sister Anita", line: "Aap akele aaye ho? …Aap hi dono ho.", english: "You came alone? …You're both." },
        ],
        unless: ["did:raju-called", "did:dcp-route"],
      },
      {
        at: "5:31 AM",
        kind: "media",
        text: "Bedi Nursing Home, the side corridor: a tube light flickers once; a hand points to a door marked 6",
        seconds: 14,
        captions: [
          { at: 1, line: "[his breathing, close to the phone]" },
          { at: 5, line: "[a tube light flickers once]" },
          { at: 8, line: "[a hand points to a door: 6]" },
        ],
        any: ["did:raju-called", "did:dcp-route"],
      },
      {
        at: "5:33 AM",
        kind: "media",
        text: "Room 6, the phone held low: the edge of a bed, a boy, a bandaged shoulder. His eyes open.",
        src: `${R}/room6.jpg`,
        seconds: 10,
        voice: "media:room6",
        captions: [
          { at: 3, who: "Dilip", line: "…Bhaiya. Aap aa gaye.", english: "…Bhaiya. You came." },
          { at: 7, who: "Dilip", line: "Light ready hai.", english: "The light's ready." },
        ],
      },
      { at: "5:40 AM", who: "Raju", text: "Pahunch gaya. Gate pe hoon.", english: "I'm here. At the gate.", needs: ["did:raju-called"] },
      { at: "5:52 AM", who: "Meera", text: "DCP raste mein hai. Pandrah minute.", english: "The DCP's on the way. Fifteen minutes.", needs: ["did:dcp-route"] },
      /* 6:05, the statement: the first time "their" voice is heard live, said
         to his own camera, from what the player filed (RAAKH-V3 §11). */
      { at: "6:05 AM", kind: "statement", who: "Sameer", text: "Main Sameer Khurrana hoon.", english: "I am Sameer Khurrana." },
      { kind: "statement", who: "Sameer", text: "Doosri goli maine chalayi thi.", english: "I fired the second shot.", any: ["claim:q4:truth", "claim:q4:hunch"] },
      { kind: "statement", who: "Sameer", text: "Us raat goli chali thi. Main wahan tha.", english: "A shot was fired that night. I was there.", unless: ["claim:q4:truth", "claim:q4:hunch"] },
      { kind: "statement", who: "Sameer", text: "1:52 pe maine Nitin ko jhooth bola. Gaadi meri wajah se khaali gayi.", english: "At 1:52 I lied to Nitin. The car left empty because of me.", needs: ["claim:q6:truth"] },
      { kind: "statement", who: "Sameer", text: "4:47 pe aag maine lagayi thi, Bhasin sir ke kehne pe.", english: "At 4:47 I lit the fire, on Bhasin sir's word.", needs: ["claim:q7:truth"] },
      { kind: "statement", who: "Sameer", text: "Ye Dilip hai. Dilip Kumar Mahto. Zinda hai.", english: "This is Dilip. He's alive." },
      { at: "6:20 AM", text: "DCP South arrives. The admission record is copied in front of her.", needs: ["did:dcp-route"] },
      { at: "6:20 AM", text: "The SHO from Fatehpur Beri arrives, after making one call before he comes in.", unless: ["did:dcp-route"] },
      { at: "6:58 AM", text: "A white Innova waits at the back gate for a patient called Deepak. Nobody comes out." },
      { at: "7:10 AM", text: "Dilip is moved to AIIMS Trauma Centre under his own name. Sameer gives a formal statement.", needs: ["did:dcp-route"] },
      { at: "7:10 AM", text: "Sister Anita doesn't sign the discharge. Dilip stays in Room 6. The SHO takes Sameer instead.", unless: ["did:dcp-route"] },
      // A promise to keep everything, kept.
      { at: "7:30 AM", who: "Meera", text: "Phone mein kuch nahi badla. Achha kiya.", english: "Nothing on the phone changed. Good.", needs: ["did:promise-p3", "did:meera-contact"], unless: ["did:deleted-perm"] },
      { at: "9:12 AM", who: "Instagram · dilli.dhamaka", text: "Wedding planner caught firing at catering worker.", src: `${R}/kunal-frame.jpg` },
      { text: "The frame is Kunal's second angle. Bhasin released it first." },
      { at: "9:40 AM", who: "Mummy", text: "Beta, TV pe tera naam aa raha hai. Tu theek hai? Khana khaya?", english: "Your name is on TV. Are you okay? Have you eaten?" },
      { at: "11:12 AM", who: "Nitin", text: "Mera naam aaya. Theek hai. Sach hai.", english: "My name came up. It's okay. It's true.", needs: ["did:nitin-warned", "claim:q6:truth"] },
      { at: "11:12 AM", who: "Nitin", text: "Tune pakki bola tha.", english: "You said pakki.", needs: ["did:promise-p1", "claim:q6:truth"], unless: ["did:nitin-warned"] },
      { at: "11:12 AM", who: "Nitin", text: "Tune 1:52 nahi bataya.", english: "You didn't tell them about 1:52.", unless: ["claim:q6:truth"] },
      { at: "11:30 AM", text: "Police record a statement from the bride's father about a 12:38 AM order. He denies it.", needs: ["did:dcp-route"] },
      MONEY,
      /* The last image (PG-FINAL): the old phone in an evidence bag on a steel
         table, lighting up; then the poster, found. */
      { kind: "final", text: "The phone, in a police evidence bag on a steel table. Its screen lights: “Mummy: …Khana khaya?”" },
      {
        who: "Raju",
        text: "",
        poster: {
          kind: "poster",
          src: `${R}/poster-dilip.jpg`,
          label: "The LAPATA poster, LAPATA struck through in ballpoint and MIL GAYA written over it",
          heading: "लापता",
          subheading: "LAPATA · MISSING",
          name: "Dilip Kumar Mahto",
          lines: ["Umar 19 saal · Age 19", "Last seen: Banyan Farms, Chhattarpur", "Ghar: Samastipur, Bihar"],
          contact: "Sampark: Raju (bhai) · +91 62••• •4417",
          found: "MIL GAYA",
        },
        needs: ["did:raju-called"],
      },
      {
        who: "Dilip",
        text: "Inke bhai ne bheja.",
        english: "His brother sent this.",
        poster: {
          kind: "poster",
          src: `${R}/poster-dilip.jpg`,
          label: "The LAPATA poster, LAPATA struck through in ballpoint and MIL GAYA written over it",
          heading: "लापता",
          subheading: "LAPATA · MISSING",
          name: "Dilip Kumar Mahto",
          lines: ["Umar 19 saal · Age 19", "Last seen: Banyan Farms, Chhattarpur", "Ghar: Samastipur, Bihar"],
          contact: "Sampark: Raju (bhai) · +91 62••• •4417",
          found: "MIL GAYA",
        },
        unless: ["did:raju-called"],
      },
      { kind: "card", text: "Dilip Kumar Mahto, 19. He held the light." },
      HELLO,
    ],
    last: [],
  },

  /* --- The Trade ------------------------------------------------------------
     The old phone goes down with the guard, face to the floor, and goes dark.
     The rest plays on the plainer phone: Marine Drive on its wallpaper. */
  {
    id: "trade",
    row: "The Trade",
    when: {},
    on: "yours",
    headline: "Dilip Kumar Mahto is home.",
    line: "The record of that night is with Bhasin.",
    onlyHere: "A thank-you from the boy, for what Bhasin did.",
    day: { day: "Sunday", date: "29/11" },
    lines: [
      { at: "4:44 AM", who: "Gate 2 · Ram Kishan ji", text: "Le gaye, sahab. Bhasin sahab ne bola, shukriya.", english: "They've taken it. Bhasin sahab said thank you." },
      { at: "5:02 AM", who: "Bhasin Uncle", text: "Shabaash beta. Saat baje bus.", english: "Well done. Bus at seven." },
      NITIN_AGAIN,
      { at: "6:50 AM", who: "+91 98••• •5512", text: "Main Anita. Discharge ho gaya. Woh chal ke gaya.", english: "It's Anita. He's discharged. He walked out." },
      { at: "7:20 AM", who: "Bhasin Uncle", text: "📷 Dilip in a bus seat at Anand Vihar ISBT, his arm in a sling, looking at the camera, not smiling", english: "" },
      { who: "Bhasin Uncle", text: "Zinda. Jaisa kaha tha.", english: "Alive. As I said." },
      { at: "9:30 AM", who: "Meera", text: "Bhasin ka phone aaya tha mere senior ko. Maine copy delete nahi ki. Dilip ghar pahunch jaaye, phir baat karenge.", english: "Bhasin called my senior. I haven't deleted the copy. Once Dilip's home, we'll talk.", needs: ["did:sent-m"] },
      { at: "4:55 PM", who: "RailBook", text: "Train 12952 has departed New Delhi. Coach B3, seat 41." },
      { at: "11:02 PM", who: "Mail · Rangmanch Weddings", text: "Welcome aboard, Sameer! Mr Sehgal speaks very highly of you. (cc: Sehgal Enterprises)" },
      { kind: "card", text: "Three weeks later." },
      {
        at: "Three weeks later",
        clock: "19:40",
        day: { day: "Saturday", date: "19/12" },
        who: "+91 79••• •0823",
        voice: "ending:dilip-thanks",
        text: "Bhaiya, main Dilip. Bhasin sir ne aapka naya number diya. Bole aapne hi mujhe ghar bhijwaya. Shukriya bhaiya. Sach mein. Maa ko kuch nahi bataya. …Mumbai mein light ka kaam ho toh bula lena.",
        english: "It's Dilip. Bhasin sir gave me your new number. Said you're the one who sent me home. Thank you. Really. I didn't tell Maa anything. …If there's light work in Mumbai, call me.",
      },
      { kind: "final", src: `${R}/dilip-chhath.jpg`, text: "From Dilip: Chhath at a Samastipur ghat, evening lamps on the water, his mother beside him." },
      { kind: "card", text: "Dilip Kumar Mahto, 19. He thinks you saved him." },
    ],
    last: [],
  },

  /* --- The 4:55 ------------------------------------------------------------- */
  {
    id: "train",
    row: "The 4:55",
    when: {},
    headline: "Dilip Kumar Mahto is still missing.",
    line: "Sameer Khurrana reached Mumbai.",
    onlyHere: "A new boy behind the light.",
    day: { day: "Sunday", date: "29/11" },
    notes: [
      { text: "You knew who sent you.", needs: ["saw:offer-p2"] },
      { text: "Page 2 of the offer: “Referred by: Mr B. Sehgal.”", unless: ["saw:offer-p2"] },
      MONEY,
    ],
    lines: [
      { at: "4:41 AM", who: "Bhasin Uncle", text: "Neeche nahi aayega? …Theek hai.", english: "Not coming down? …Fine." },
      NITIN_AGAIN,
      { at: "6:30 AM", who: "Bhasin Uncle", text: "Jaa. Mumbai mein humare log hain. Phone sambhaal ke rakhna. Ladka hum sambhaal ke rakhenge.", english: "Go. We have people in Mumbai. Look after the phone. We'll look after the boy." },
      { at: "6:58 AM", who: "Dilip", text: "Main Anita. Le gaye. White Innova. Kahan, nahi bataya.", english: "It's Anita. They took him. White Innova. Didn't say where." },
      { at: "7:02 AM", who: "Dilip", text: "Woh pooch raha tha aap aaye kyun nahi.", english: "He was asking why you didn't come." },
      { at: "7:03 AM", who: "Dilip", text: "Uska phone mere paas hai. Main rakh lungi. Shayad koi aaye.", english: "I have his phone. I'll keep it. Maybe someone will come." },
      // Unless he was lied to and went to the Sehgals': then he doesn't call this number again (RAAKH-V3 §9.4).
      { at: "8:00 AM", who: "Phone", text: `Missed call: +91 62••• •4417 (48)`, unless: ["did:raju-withdrew"] },
      { at: "4:55 PM", who: "Kunal", text: "Safe journey bhai. Papa ne bola tension mat lena.", english: "Dad said don't worry." },
      { at: "11:40 PM", who: "Mail · Rangmanch Weddings", text: "Welcome aboard, Sameer! (cc: Sehgal Enterprises)" },
      {
        kind: "final",
        at: "8:35 AM",
        clock: "08:35",
        day: { day: "Monday", date: "30/11" },
        src: "/found/lastlocal/sea.jpg",
        text: "Marine Drive, Monday morning, the haze on the water. Two bubbles drift up from the old chat: “Bhaiya, Mumbai mein samundar roz dikhega?” · “Roz.”",
      },
      { kind: "card", text: "Three weeks later." },
      {
        at: "Three weeks later",
        clock: "21:10",
        day: { day: "Saturday", date: "19/12" },
        who: "Raju",
        text: "Naya chhapwaya hai. Koi bhi khabar ho toh batana.",
        english: "Had new ones printed. If you hear anything, tell me.",
        poster: {
          kind: "poster",
          src: `${R}/poster-dilip.jpg`,
          label: "The LAPATA poster, reprinted: Dilip Kumar Mahto, 19. Last seen: Banyan Farms, Chhattarpur.",
          heading: "लापता",
          subheading: "LAPATA · MISSING",
          name: "Dilip Kumar Mahto",
          lines: ["Umar 19 saal · Age 19", "Last seen: Banyan Farms, Chhattarpur", "Ghar: Samastipur, Bihar"],
          contact: "Sampark: Raju (bhai) · +91 62••• •4417",
        },
      },
      {
        kind: "media",
        text: "A Rangmanch reel at a Mumbai wedding: fairy lights, and a new boy, about eighteen, behind an LED panel",
        src: `${R}/key-lawn.jpg`,
        seconds: 10,
        voice: "media:rangmanch",
        captions: [
          { at: 1.5, who: "A boy, behind the light", line: "Sir, light yahan theek hai?", english: "Sir, is the light okay here?" },
          { at: 5, who: "Sameer, off camera", line: "Haan. Wahin. Ab hilna mat.", english: "Yes. There. Now don't move." },
        ],
      },
      { kind: "card", text: "Dilip Kumar Mahto, 19. He held the light. Somebody else holds it now." },
    ],
    last: [],
  },

  /* --- Return to Origin ------------------------------------------------------
     Back in the envelope, at the gate for the courier. It will come back. */
  {
    id: "origin",
    row: "Return to Origin",
    when: {},
    headline: "Return to Origin.",
    line: "It will come back.",
    onlyHere: "The parcel, at your door again.",
    day: { day: "Sunday", date: "29/11" },
    notes: [{ text: "You didn't look.", needs: ["did:facedown"] }],
    lines: [
      { at: "4:58 AM", who: "Your phone · Ram Kishan ji", text: "Gate pe rakh diya, sahab. Courier subah aayega.", english: "Left it at the gate. Courier comes in the morning." },
      { at: "5:10 AM", who: "Bhasin Uncle", text: "Phir bhej raha hai? Theek hai. Hum bhi intezaar kar lete hain. Ladka bhi.", english: "Sending it again? Fine. We'll wait too. So will the boy." },
      NITIN_AGAIN,
      { at: "6:58 AM", who: "Dilip", text: "Main Anita. Le gaye.", english: "It's Anita. They took him." },
      // The last image: the sealed envelope on the guard's counter, the phone lighting up through it.
      { kind: "final", text: "The sealed envelope on the guard's counter, in early light." },
      { kind: "glow", who: "Phone", text: "48 missed calls" },
      { kind: "glow", who: "M", text: "Maine copy rakh li hai. Jab tu tayyar ho.", english: "I've kept a copy. Whenever you're ready.", needs: ["did:sent-m"] },
      { kind: "glow", who: "Mummy", text: "Khana khaya?", english: "Have you eaten?" },
      { kind: "cold", text: "" },
      { kind: "card", text: "Seven days later, a parcel comes back to your door." },
      { kind: "parcel", text: "RETURN TO ORIGIN · Attempt 2 · Refused by addressee" },
      { kind: "card", text: "Dilip Kumar Mahto, 19. He asked if you were coming." },
    ],
    last: [],
  },

  /* --- Unopened: put away before the reveal ---------------------------------- */
  {
    id: "unopened",
    row: "Unopened",
    when: {},
    headline: "Unopened",
    onlyHere: "It's still ringing.",
    lines: [
      { kind: "glow", who: "Raju", text: "Missed call" },
      { kind: "glow", who: "Mummy", text: "Beta, phone kyun nahi utha raha?", english: "Why aren't you picking up?" },
      { kind: "card", text: "You put it away. It's still ringing." },
    ],
    last: [],
  },
];
