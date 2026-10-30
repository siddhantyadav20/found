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

/* --- How the night changes each ending (fix brief §7) ------------------------
   One canon for seven o'clock: Ramesh collects "Deepak" from Bedi and puts
   him on a bus at Anand Vihar, with cash and a warning. Once he leaves
   Bedi there is no record. Bhasin only waits while the phone is out of his
   reach. Each ending has two ways it can go, by what the player did. */

type When = Pick<EndingLine, "needs" | "any" | "unless">;

/** One line, for each of these ways the night can have gone (only one ever holds). */
const under = (line: EndingLine, ...whens: readonly When[]): EndingLine[] => whens.map((w) => ({ ...line, ...w }));

/** Room 6, A: Raju rang before Sameer left, and nothing was deleted. Anita has her two people. */
const R6_A: When = { needs: ["did:raju-called"], unless: ["did:deleted-perm"] };
/** Room 6, B: no brother to say his name, or the record broken. */
const R6_NOT_A: readonly When[] = [{ unless: ["did:raju-called"] }, { needs: ["did:raju-called", "did:deleted-perm"] }];
/** B with no police on the way: Sameer makes the call himself. */
const R6_B: readonly When[] = R6_NOT_A.map((w) => ({ ...w, unless: [...(w.unless ?? []), "did:dcp-route"] }));
/** B with Meera's DCP on the way: the police are already there when Ramesh comes. */
const R6_DCP: readonly When[] = R6_NOT_A.map((w) => ({ ...w, needs: [...(w.needs ?? []), "did:dcp-route"] }));
/** The Trade, A: he wrote to Dilip's number first. */
const TR_A: When = { needs: ["did:trade-message"] };
const TR_B: When = { unless: ["did:trade-message"] };
/** The 4:55, A: he kept everything. */
const GO_A: When = { unless: ["did:deleted-perm"] };
const GO_B: When = { needs: ["did:deleted-perm"] };
/** Return to Origin, A: nothing deleted, and "Ab sach mein sab hai" on the note. */
const RO_A: When = { needs: ["did:repack-all"] };
const RO_B: When = { unless: ["did:repack-all"] };

/** Which answer the player gave to Q1, again (fix brief §6): the moment of admission, named. */
const SAID_ME: EndingLine = { text: "You answered “me”." };

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
    notes: [SAID_ME],
    epilogue: [
      { who: "Dilip", text: "In a trauma ward under his own name. Raju beside him.", ...R6_A },
      ...under({ who: "Dilip", text: "Safe. He asks if Sameer bhaiya is coming back." }, ...R6_NOT_A),
      { who: "Raju", text: "Signs as next of kin.", ...R6_A },
      ...under({ who: "Raju", text: "Gets the police call at eight." }, ...R6_NOT_A),
      { who: "Sameer", text: "Gives the statement himself. “Main tha.”" },
      { who: "Meera", text: "Picks up when he calls from the police post." },
      { who: "Nitin", text: "Gives his copy of 1:52 to the police.", needs: ["claim:q6:truth"] },
      { who: "Nitin", text: "Is asked about 1:52 at last, and shows them.", unless: ["claim:q6:truth"] },
      { who: "Bhasin", text: "Summoned by a police station that isn't his." },
      { who: "Kunal", text: "Sends Sameer the second angle. “Sorry bhai.”" },
      { who: "Mummy", text: "“Khana khaya?” goes unanswered. Then he calls her." },
      { who: "Sister Anita", text: "Ends her shift with the register corrected.", ...R6_A },
      ...under({ who: "Sister Anita", text: "Stays past her shift, until the police write down his real name." }, ...R6_NOT_A),
    ],
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
      // Told it was a bullet, he'd been going round the hospitals near Chhattarpur all night (fix brief H-17).
      { at: "5:40 AM", who: "Raju", text: "Pahunch gaya. Main paas hi tha.", english: "I'm here. I was close by.", needs: ["did:raju-called", "did:raju-told-shot"] },
      { at: "5:52 AM", who: "Meera", text: "DCP raste mein hai. Pandrah minute.", english: "The DCP's on the way. Fifteen minutes.", needs: ["did:dcp-route"] },
      /* 6:05, the statement: the first time "their" voice is heard live, said
         to his own camera, from what the player filed (RAAKH-V3 §11). */
      { at: "6:05 AM", kind: "statement", who: "Sameer", text: "Main Sameer Khurrana hoon.", english: "I am Sameer Khurrana." },
      { kind: "statement", who: "Sameer", text: "Doosri goli maine chalayi thi.", english: "I fired the second shot.", any: ["claim:q4:truth", "claim:q4:hunch"] },
      { kind: "statement", who: "Sameer", text: "Us raat goli chali thi. Main wahan tha.", english: "A shot was fired that night. I was there.", unless: ["claim:q4:truth", "claim:q4:hunch"] },
      { kind: "statement", who: "Sameer", text: "1:52 pe maine Nitin ko jhooth bola. Gaadi meri wajah se khaali gayi.", english: "At 1:52 I lied to Nitin. The car left empty because of me.", needs: ["claim:q6:truth"] },
      { kind: "statement", who: "Sameer", text: "4:47 pe aag maine lagayi thi, Bhasin sir ke kehne pe.", english: "At 4:47 I lit the fire, on Bhasin sir's word.", needs: ["claim:q7:truth"] },
      { kind: "statement", who: "Sameer", text: "Ye Dilip hai. Dilip Kumar Mahto. Zinda hai.", english: "This is Dilip. Dilip Kumar Mahto. He's alive." },
      { at: "6:12 AM", who: "Raju", text: "Pahunch gaya. Gate pe hoon.", english: "I'm here. At the gate.", needs: ["did:raju-called"], unless: ["did:raju-told-shot"] },
      { at: "6:20 AM", text: "DCP South arrives. The admission record is copied in front of her.", needs: ["did:dcp-route"] },
      // A: the one who knows him, and the one they fear, with the phone whole.
      { at: "6:24 AM", text: "Raju stands at the bed and says his brother's name. Sister Anita writes it in the register, over “Deepak”.", ...R6_A },
      { at: "6:40 AM", text: "She signs him out to family. An ambulance takes Dilip to the AIIMS Trauma Centre, under his own name.", ...R6_A },
      { at: "6:58 AM", text: "A white Innova waits at the back gate for a patient called Deepak. Nobody comes out.", ...R6_A },
      { at: "7:10 AM", text: "A bullet wound at a government trauma centre is a medico-legal case. It's registered there, far from Fatehpur Beri's thana. Sameer gives his statement, and the phone.", ...R6_A },
      // B: Sister Anita can't release him to a stranger, so Sameer stays, and makes the call himself.
      ...under({ at: "6:58 AM", text: "A white Innova at the back gate. Ramesh comes up the stairs for a patient called Deepak." }, ...R6_B),
      ...under({ at: "7:01 AM", text: "Sister Anita won't sign the boy out to Ramesh, and can't sign him out to Sameer. Sameer stays in Room 6." }, ...R6_B),
      ...under({ at: "7:02 AM", text: "Sameer dials 112. The call he didn't make a week ago." }, ...R6_B),
      ...under({ at: "7:25 AM", text: "Dilip goes to the trauma centre under police guard. Sameer is held in the corridor." }, ...R6_B),
      ...under({ at: "6:58 AM", text: "A white Innova reaches the back gate, sees the DCP's jeep, and drives on." }, ...R6_DCP),
      ...under({ at: "7:10 AM", text: "Dilip is moved to AIIMS Trauma Centre under his own name. Sameer gives a formal statement." }, ...R6_DCP),
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
    notes: [SAID_ME],
    epilogue: [
      { who: "Dilip", text: "On a bus home, arm in a sling, saying nothing." },
      { who: "Raju", text: "Gets his brother back. Never the truth." },
      { who: "Sameer", text: "Takes the balance. Bhasin calls him “beta” again." },
      { who: "Meera", text: "Blocks him again." },
      { who: "Nitin", text: "Gets a message from Bhasin: “delete kar de.” He doesn't." },
      { who: "Bhasin", text: "Gets the phone, and a clean wedding album." },
      { who: "Kunal", text: "Posts the wedding film." },
      { who: "Mummy", text: "“Bhasin uncle bahut achhe hain.”" },
      { who: "Sister Anita", text: "Keeps the photo, and the real name in her register.", ...TR_A },
      { who: "Sister Anita", text: "Watches the bed empty at seven, and writes nothing down.", ...TR_B },
    ],
    lines: [
      { at: "4:44 AM", who: "Gate 2 · Ram Kishan ji", text: "Le gaye, sahab. Bhasin sahab ne bola, shukriya.", english: "They've taken it. Bhasin sahab said thank you." },
      { at: "5:02 AM", who: "Bhasin Uncle", text: "Shabaash beta. Saat baje bus.", english: "Well done. Bus at seven." },
      NITIN_AGAIN,
      { at: "6:50 AM", who: "+91 98••• •5512", text: "Main Anita. Discharge ho gaya. Woh chal ke gaya.", english: "It's Anita. He's discharged. He walked out." },
      // A photo, previewed as a phone previews one; what's in it goes underneath (2026-10-28: the description read as his text).
      { at: "7:20 AM", who: "Bhasin Uncle", text: "📷 Photo", english: "Dilip in a bus seat at Anand Vihar ISBT, his arm in a sling, looking at the camera, not smiling." },
      { who: "Bhasin Uncle", text: "Zinda. Jaisa kaha tha.", english: "Alive. As I said." },
      // A: he wrote to Dilip's number first, and she answered (fix brief §7).
      { at: "7:24 AM", who: "+91 98••• •5512", text: "Main Anita. Register mein asli naam likh diya hai. Photo bhi rakh li.", english: "It's Anita. I've written his real name in the register. Kept a photo too.", ...TR_A },
      { at: "7:30 AM", text: "Nothing outside the phone remembers what happened. The phone is Bhasin's.", ...TR_B },
      // By mail: the old phone is Bhasin's now, and his new number is nobody's she knows (2026-10-28).
      { at: "9:30 AM", who: "Mail · Meera Arora", text: "Bhasin ka phone aaya tha mere senior ko. Maine copy delete nahi ki. Dilip ghar pahunch jaaye, phir baat karenge.", english: "Bhasin called my senior. I haven't deleted the copy. Once Dilip's home, we'll talk.", needs: ["did:sent-m"] },
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
      // An old one (2026-10-28): Chhath was in November, and the photo has no sling in it.
      { kind: "final", src: `${R}/dilip-chhath.jpg`, text: "From Dilip, an old one: last year's Chhath at the Samastipur ghat, before Delhi." },
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
    /* Dilip stays held: Bhasin only lets him go once the phone is in his
       hand, and it went to Mumbai (fix brief §7's canon; the brief's "on a
       bus home" line for this ending contradicted it, and was not used). */
    epilogue: [
      { who: "Dilip", text: "Moved at seven, somewhere nobody wrote down. Kept until the phone turns up." },
      { who: "Raju", text: "Prints the poster again." },
      { who: "Sameer", text: "12:32 AM, his alarm, on a dark platform at Ratlam." },
      { who: "Meera", text: "Keeps what he sent her, and waits for him to use it.", needs: ["did:sent-m"] },
      { who: "Meera", text: "Never opens the chat again.", unless: ["did:sent-m"] },
      { who: "Nitin", text: "Keeps 1:52. Still doesn't sleep." },
      { who: "Bhasin", text: "Waits for the phone to surface." },
      { who: "Kunal", text: "“Safe journey bhai.” Then he unfollows Sameer." },
      { who: "Mummy", text: "Forty-eight missed calls become sixty-one." },
      { who: "Sister Anita", text: "Watches the bed empty at seven, and keeps his phone." },
    ],
    notes: [
      SAID_ME,
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
      { at: "4:55 PM", who: "Kunal", text: "Safe journey bhai. Papa ne bola tension mat lena.", english: "Safe journey, bhai. Dad says don't worry." },
      { at: "11:40 PM", who: "Mail · Rangmanch Weddings", text: "Welcome aboard, Sameer! (cc: Sehgal Enterprises)" },
      // What he carries (fix brief §7): the whole record, or a phone with nothing on it but the alarm.
      { text: "He takes the whole record with him, and Meera's “Kuch delete mat karna”.", ...GO_A },
      { text: "He takes the phone with him. Nothing on it now but the alarm at 12:32.", ...GO_B },
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
    notes: [
      // Face down skips the question: the card says so (fix brief H-25).
      { text: "You didn't answer. You didn't look.", needs: ["did:facedown"] },
      { text: "You answered “Sameer Khurrana”: him, not you.", needs: ["claim:qf:origin"] },
      { text: "This time, it didn't come back.", ...RO_A },
    ],
    lines: [
      // Said under the clock, not texted (2026-10-28): the phone this plays on is the one in the envelope.
      { at: "4:58 AM", text: "Ram Kishan ji puts the envelope on the counter at Gate 2. The courier comes in the morning." },
      // A: everything in it, and the line that says so (fix brief §7).
      { at: "5:06 AM", text: "Bhasin's driver asks for the envelope. Ram Kishan ji: “Courier ka hai, sahab. Resident ka saamaan main nahi de sakta.”", ...RO_A },
      { at: "5:10 AM", who: "Bhasin Uncle", text: "Phir bhej raha hai? Theek hai. Hum bhi intezaar kar lete hain. Ladka bhi.", english: "Sending it again? Fine. We'll wait too. So will the boy.", ...RO_B },
      { at: "5:20 AM", who: "M", text: "Gate pe hoon. Is baar main khud le rahi hoon.", english: "I'm at the gate. This time I'm taking it myself.", ...RO_A },
      NITIN_AGAIN,
      { at: "6:10 AM", text: "Meera walks the envelope into the police post at the AIIMS Trauma Centre.", ...RO_A },
      { at: "6:40 AM", text: "Police reach Bedi Nursing Home. Room 6 is still occupied.", ...RO_A },
      { at: "6:58 AM", who: "Dilip", text: "Main Anita. Police aa gayi. Woh theek hai.", english: "It's Anita. The police came. He's all right.", ...RO_A },
      // B: Bhasin waits while the phone is out of his reach, and so does the boy.
      { at: "7:05 AM", who: "Dilip", text: "Main Anita. Aaj nahi le gaye. Bole, jab tak parcel wapas nahi aata.", english: "It's Anita. They didn't take him today. They said: not till the parcel comes back.", ...RO_B },
      // The last image: the guard's counter, empty, or the sealed envelope with the phone lighting up through it.
      { kind: "final", text: "Gate 2's counter, in early light. Nothing on it.", ...RO_A },
      { kind: "card", text: "Dilip Kumar Mahto, 19. Somebody said it for you.", ...RO_A },
      { kind: "final", text: "The sealed envelope on the guard's counter, in early light.", ...RO_B },
      { kind: "glow", who: "Phone", text: "48 missed calls", ...RO_B },
      { kind: "glow", who: "M", text: "Maine copy rakh li hai. Jab tu tayyar ho.", english: "I've kept a copy. Whenever you're ready.", needs: ["did:sent-m"], unless: ["did:repack-all"] },
      { kind: "glow", who: "Mummy", text: "Khana khaya?", english: "Have you eaten?", ...RO_B },
      { kind: "cold", text: "", ...RO_B },
      { kind: "card", text: "The next night, a parcel comes back to your door.", ...RO_B },
      { kind: "parcel", text: "RETURN TO ORIGIN · Attempt 2 · Refused by addressee", ...RO_B },
      {
        at: "Tuesday",
        clock: "16:10",
        day: { day: "Tuesday", date: "01/12" },
        who: "Dilip",
        text: "Main Anita. Aaj ghar bhej diya. Bus mein. Kuch nahi bola.",
        english: "It's Anita. They sent him home today. On a bus. He said nothing.",
        ...RO_B,
      },
      { kind: "card", text: "Dilip Kumar Mahto, 19. He asked if you were coming.", ...RO_B },
    ],
    epilogue: [
      { who: "Dilip", text: "Found at Bedi at 6:40.", ...RO_A },
      { who: "Dilip", text: "Sent home on Tuesday, on a bus, saying nothing.", ...RO_B },
      { who: "Raju", text: "Brought in by Meera's call.", ...RO_A },
      { who: "Raju", text: "Waits at Sethi Caterers all week.", ...RO_B },
      { who: "Sameer", text: "Sleeps through 12:32 for the first time in a week. Or doesn't.", ...RO_A },
      { who: "Sameer", text: "Back to his alarm at 12:32. Or not sleeping at all.", ...RO_B },
      { who: "Meera", text: "Does what he couldn't.", ...RO_A },
      { who: "Meera", text: "Refuses it a second time.", ...RO_B },
      { who: "Nitin", text: "Called as a witness.", ...RO_A },
      { who: "Nitin", text: "Still doesn't sleep.", ...RO_B },
      { who: "Bhasin", text: "Loses the race to seven.", ...RO_A },
      { who: "Bhasin", text: "Waits, and wins.", ...RO_B },
      { who: "Kunal", text: "Deletes his story.", ...RO_A },
      { who: "Kunal", text: "Posts the wedding film.", ...RO_B },
      { who: "Mummy", text: "“Khana khaya?”" },
      { who: "Sister Anita", text: "Signs the corrected register.", ...RO_A },
      { who: "Sister Anita", text: "Watches the bed empty on Tuesday.", ...RO_B },
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
