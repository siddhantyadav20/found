import type { Beat, Dark, LiveEvent, Message, Thread } from "../types";
import { RAJU } from "./phone";

/* ===========================================================================
   Episode 3 — "Return to Origin" (RAAKH-V3 §9). 1:52 to 4:40 AM. Prove the
   lie, see the empty fire, find Dilip alive; then the reveal (reveal.ts),
   and the choice (questions.ts, "qf").

   Kunal writes at 2:10 and can be pressed, or handed Nitin's name. Raju, if
   he was told it was Kunal, goes to the Sehgals' and hears otherwise. The
   whole fire is in the locked note; once it's filed, the screen goes dark on
   one question. At 3:20 Dilip's own number writes: his night nurse, because
   they move him at seven. At 3:40, his voice.
   =========================================================================== */

export const beats: readonly Beat[] = [
  { at: "02:00", after: ["ask:q6"] },
  // Q7 filed: the clock jumps (scene 3.6).
  { at: "03:15", after: ["ask:q7"] },
  { at: "03:30", after: ["ask:q8"] },
  { at: "03:58", after: ["did:reveal-start"] },
  { at: "04:04", after: ["did:reveal-done"] },
  // The last question: the clock holds while choosing.
  { at: "04:10", after: ["fired:bhasin-terms"] },
];

/* --- Meera, once the lie is filed (scene 3.2) ------------------------------ */

const meera: Thread = {
  id: "m",
  app: "whatsapp",
  name: "M",
  messages: [
    { id: "me-w1", from: "them", at: "02:02", day: "29/11", with: "meera-wrong", requires: ["fired:meera-wrong"], typing: 6, text: "Maine galat kiya. Parcel le lena chahiye tha.", english: "I was wrong. I should have taken the parcel." },
  ],
};

/* --- Kunal, 2:10 (scene 3.3) ----------------------------------------------- */

const kunal: Thread = {
  id: "kunal",
  app: "whatsapp",
  name: "Kunal",
  messages: [
    { id: "k-o1", from: "them", at: "02:10", day: "29/11", with: "kunal-writes", requires: ["fired:kunal-writes"], text: "Bhai. Online dikh raha hai.", english: "You're online." },
    {
      id: "k-o2",
      from: "them",
      at: "02:10",
      day: "29/11",
      with: "kunal-writes",
      requires: ["fired:kunal-writes"],
      typing: 7,
      text: "Papa bol rahe hain kisi se baat mat karna. Kal Mumbai nikal ja. Rangmanch mein Papa ne baat kar li hai, tension mat le.",
      english: "Dad says talk to nobody. Leave for Mumbai tomorrow. Dad's spoken to Rangmanch, don't worry.",
      evidence: "kunal-rangmanch",
    },
    { id: "k-p1", from: "them", at: "02:40", day: "29/11", with: "kunal-papa", requires: ["fired:kunal-papa"], text: "Papa ko bata diya. Handle ho jayega.", english: "Told Dad. It'll be handled." },
  ],
  replies: [
    {
      id: "kunal-ask",
      requires: ["fired:kunal-writes"],
      options: [
        {
          id: "denial",
          text: "Main Sameer nahi hoon.",
          english: "I'm not Sameer.",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:kunal-denial"],
          then: [{ id: "k-d1", from: "them", at: "02:11", typing: 5, text: "Haan haan. Aur main dulha hoon. Phone band kar aur so ja.", english: "Sure. And I'm the groom. Switch it off and sleep." }],
        },
        {
          id: "truth",
          text: "Us raat ka sach bata.",
          english: "Tell me the truth about that night.",
          impulse: { side: "confessor", weight: 1 },
          sets: ["did:kunal-frame"],
          then: [
            { id: "k-t1", from: "them", at: "02:11", typing: 4, text: "Sach? Le.", english: "The truth? Here." },
            {
              id: "k-t2",
              from: "them",
              at: "02:11",
              attachment: { kind: "photo", label: "A frame from Kunal's video, a second angle: Sameer's arm coming down, a flash, a boy behind a light", src: "/found/raakh/kunal-frame.jpg" },
              evidence: "kunal-frame",
            },
            { id: "k-t3", from: "them", at: "02:11", text: "Humare paas bhi hai. Soch samajh ke.", english: "We have one too. Think carefully." },
            // Fix brief H-15: who holds the second angle, and what Kunal knows he did.
            {
              id: "k-t3a",
              from: "them",
              at: "02:12",
              typing: 9,
              text: "Papa ke paas hai woh angle, bhai. Tera. Maine bola tha pose mat kar… phir bhi gun de di.",
              english: "Dad has that angle, bro. Yours. I told you not to pose… and I handed you the gun anyway.",
            },
            { id: "k-t4", from: "them", at: "02:12", typing: 8, text: "Aur jerrycan tu khud uthake le gaya tha. Papa ne bas bola tha.", english: "And you carried the jerrycan yourself. Dad just said it.", evidence: "kunal-jerrycan" },
          ],
        },
        {
          id: "expose",
          text: "Nitin ke paas 1:52 wala message hai.",
          english: "Nitin has the 1:52 message.",
          impulse: { side: "auditor", weight: 2 },
          sets: ["did:nitin-exposed"],
          then: [{ id: "k-e1", from: "them", at: "02:11", text: "Kya? Ruk.", english: "What? Wait." }],
        },
      ],
    },
  ],
};

/* --- Raju, if he was told it was Kunal (scene 3.4): the trust breaks ------- */

const raju: Thread = {
  id: "raju",
  app: "whatsapp",
  name: RAJU,
  messages: [
    {
      id: "r-w1",
      from: "them",
      at: "02:30",
      day: "29/11",
      with: "raju-withdraws",
      requires: ["fired:raju-withdraws"],
      typing: 8,
      text: "Sehgal ke ghar gaya tha. Gate se bhaga diya. Ek aadmi bola, “Kunal toh dance floor pe tha.”",
      english: "I went to the Sehgals'. Chased off at the gate. A man said, “Kunal was on the dance floor.”",
    },
    { id: "r-w2", from: "them", at: "02:30", day: "29/11", with: "raju-withdraws", requires: ["fired:raju-withdraws"], typing: 5, text: "Aapne jhooth bola. Aap log sab ek jaise ho.", english: "You lied. You people are all the same." },
  ],
};

/* --- Nitin, once his name has reached Bhasin (scene 3.3): then silence ------- */

const nitin: Thread = {
  id: "nitin",
  app: "whatsapp",
  name: "Nitin",
  locked: true,
  messages: [
    { id: "n-t1", from: "them", at: "03:05", day: "29/11", with: "nitin-threat", requires: ["fired:nitin-threat"], typing: 8, text: "Bhasin ke log ghar aaye the. Maa ro rahi hai. Tune kisko bataya?", english: "Bhasin's men came to the house. Ma's crying. Who did you tell?" },
  ],
};

/* --- Dilip's number, 3:20 (scene 3.7): Sister Anita ------------------------
   She charges his phone at night; his chat with "Sameer Bhaiya Mumbai" is
   the one she opens, because the move is at seven and he asks for Sameer
   every day. Her first voice note plays on black (PG-DARK #2). */

/** Her voice note, as it's heard on black and then kept in the chat (E47). */
export const ANITA_VOICE = {
  seconds: 28,
  lines: [
    { at: 0.7, who: "Sister Anita", line: "Ek ladka hai. Ek hafte se.", english: "There's a boy. For a week." },
    { at: 3.8, who: "Sister Anita", line: "Register mein “Deepak, unnees saal, road accident” likha hai.", english: "The register says “Deepak, nineteen, road accident.”" },
    { at: 8.6, who: "Sister Anita", line: "Road accident nahi hai. Goli ka ghaav hai, kandhe mein.", english: "It isn't a road accident. It's a bullet wound, in the shoulder." },
    { at: 13.6, who: "Sister Anita", line: "Jo log laaye the, roz aate hain. Aaj raat bole subah saat baje le jaayenge. Kahan, nahi bataya.", english: "The men who brought him come every day. Tonight they said they'll take him at seven in the morning. Where, they didn't say." },
    { at: 22.6, who: "Sister Anita", line: "Woh roz ek hi naam leta hai. Sameer bhaiya.", english: "Every day he says one name. Sameer bhaiya." },
  ],
} as const;

/** What she sends once the voice note has been heard. */
const afterVoice = (id: string, at: string, rest: Omit<Message, "id" | "from" | "at" | "day" | "requires">): Message => ({
  id,
  from: "them",
  at,
  day: "29/11",
  requires: ["did:dark-anita"],
  ...rest,
});

const dilip: Thread = {
  id: "dilip",
  app: "whatsapp",
  name: "Dilip",
  locked: true,
  messages: [
    {
      id: "an-1",
      from: "them",
      at: "03:20",
      day: "29/11",
      with: "anita",
      requires: ["fired:anita"],
      typing: 8,
      text: "Aap Sameer ho? Ye phone ek ladke ka hai. Main Bedi Nursing Home, Fatehpur Beri mein night nurse hoon. Raat ke round pe iska phone charge karti hoon. Aaj aap online dikhe. Aapka number isme “Sameer Bhaiya Mumbai” naam se save hai.",
      english: "Are you Sameer? This phone belongs to a boy. I'm the night nurse at Bedi Nursing Home, Fatehpur Beri. I charge his phone on my night round. Tonight you showed online. Your number is saved in it as “Sameer Bhaiya Mumbai.”",
      evidence: "anita",
    },
    afterVoice("an-v", "03:22", {
      attachment: { kind: "voice", seconds: ANITA_VOICE.seconds, transcript: ANITA_VOICE.lines.map((l) => l.line).join(" "), english: ANITA_VOICE.lines.map((l) => l.english).join(" ") },
      evidence: "anita-voice",
    }),
    afterVoice("an-p1", "03:23", {
      attachment: { kind: "photo", label: "A patient's belongings in a plastic bag: a maroon waistcoat with a dried stain, and a name badge, DILIP", src: "/found/raakh/nurse-bag-2.jpg" },
      evidence: "belongings",
    }),
    afterVoice("an-p2", "03:23", {
      attachment: {
        kind: "photo",
        label: "An admission slip, Bedi Nursing Home: Deepak · 19 · M · brought by Ramesh · RTA · 22/11/26, 3:20 AM · Room 6 · Sister on duty: Anita",
        src: "/found/raakh/slip.jpg",
      },
      evidence: "slip",
    }),
    // Fix brief H-09: who read "maaf kar de" on Tuesday, and why nobody answered.
    afterVoice("an-1b", "03:23", {
      typing: 6,
      text: "Woh phone dekhta rehta hai, jawab nahi deta. Unhone mana kiya hai.",
      english: "He keeps looking at his phone, and never answers. They've told him not to.",
      evidence: "anita-read",
    }),
    afterVoice("an-2", "03:24", {
      typing: 7,
      text: "Akele main kuch nahi kar sakti. Do log chahiye: ek jo isko pehchaane, aur ek jisse woh log darte hain.",
      english: "Alone I can't do anything. It needs two people: one who can identify him, and one those men are afraid of.",
    }),
    /* 3:40 (scene 3.9): he's awake, and he wants to say something. */
    { id: "an-3", from: "them", at: "03:40", day: "29/11", with: "dilip-plea", requires: ["fired:dilip-plea"], typing: 6, text: "Woh jaag gaya hai. Maine bataya aapka phone online hai. Woh kuch bolna chahta hai.", english: "He's awake. I told him your phone is online. He wants to say something." },
    {
      id: "an-4",
      from: "them",
      at: "03:40",
      day: "29/11",
      with: "dilip-plea",
      requires: ["fired:dilip-plea"],
      attachment: {
        kind: "voice",
        seconds: 21,
        transcript: "Bhaiya… aap aa rahe ho na? Unhone bola hai agar main kuch nahi bolunga toh ghar bhej denge. Main kuch nahi bolunga. Maa ko mat batana ki goli lagi thi. Bas… aap aa jao.",
        english: "Bhaiya… you're coming, right? They said if I don't say anything, they'll send me home. I won't say anything. Don't tell Maa I was shot. Just… come.",
      },
      evidence: "dilip-plea",
    },
  ],
  replies: [
    {
      id: "anita-reply",
      requires: ["fired:anita"],
      options: [
        {
          id: "denial",
          text: "Main Sameer nahi hoon. Ladka kaun hai?",
          english: "I'm not Sameer. Who's the boy?",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:anita-denial", "did:anita-replied"],
        },
        {
          id: "care",
          text: "Ladka kaisa hai?",
          english: "How is the boy?",
          impulse: { side: "confessor", weight: 1 },
          sets: ["did:anita-care", "did:anita-replied"],
        },
        {
          id: "what",
          text: "Kaun ladka?",
          english: "What boy?",
          impulse: { side: "auditor", weight: 1 },
          sets: ["did:anita-what", "did:anita-replied"],
        },
      ],
    },
  ],
};

/* --- Bhasin: his terms at 4:06 (scene 3.11, E50), and, on a real clock, his leaving */

export const TERMS = {
  seconds: 43,
  transcript:
    "Sameer. Ab tujhe pata hai ladka zinda hai. Toh seedhi baat. Phone guard ke haath neeche bhej de. Saat baje ladka Samastipur ki bus mein hoga. Zinda, dawai ke saath, paise ke saath. Tu 4:55 ki train pakad. Rangmanch mein maine baat kar li hai, wahan sab theek rahega. Kunal wala video mere paas rahega. Bas mere paas rahega. Aur agar phone neeche nahi aaya… toh ladka bhi kahin nahi jaayega. Aadha ghanta hai.",
  english:
    "Sameer. Now you know the boy's alive. So, straight talk. Send the phone down with the guard. At seven the boy will be on the bus to Samastipur. Alive, with medicine, with money. You catch the 4:55. I've spoken to Rangmanch; everything will be fine there. Kunal's video stays with me. It just stays with me. And if the phone doesn't come down… the boy doesn't go anywhere either. You have half an hour.",
} as const;

const bhasin: Thread = {
  id: "bhasin",
  app: "whatsapp",
  name: "Bhasin Uncle",
  messages: [
    {
      id: "b-terms",
      from: "them",
      at: "04:06",
      day: "29/11",
      with: "bhasin-terms",
      requires: ["fired:bhasin-terms"],
      attachment: { kind: "voice", seconds: TERMS.seconds, transcript: TERMS.transcript, english: TERMS.english },
      evidence: "bhasin-terms",
    },
    { id: "b-left", from: "them", at: "04:36", day: "29/11", with: "bhasin-left", requires: ["fired:bhasin-left"], text: "Theek hai. Tu nahi aaya. Ladka bhi kahin nahi jaayega.", english: "Fine. You didn't come. Nor will the boy go anywhere." },
  ],
};

export const threads: readonly Thread[] = [meera, kunal, raju, nitin, dilip, bhasin];

export const events: readonly LiveEvent[] = [
  /* Once she's seen the lie for herself: Nitin's copy of 1:52, sent to her (2026-10-28: she used to
     say it on the case file's word, which she can't see). And once the lie is filed, at its 2:02. */
  { id: "meera-wrong", device: "owner", after: ["claim:q6:truth", "did:sent-m-nitin-152"], delay: 6, clock: "02:02", app: "whatsapp", banner: "M · Maine galat kiya. Parcel le lena chahiye tha." },
  { id: "kunal-writes", device: "owner", after: ["ask:q6"], delay: 14, clock: "02:10", app: "whatsapp", banner: "Kunal · Bhai. Online dikh raha hai." },
  { id: "raju-withdraws", device: "owner", after: ["did:raju-told-kunal", "fired:kunal-writes"], delay: 24, clock: "02:30", app: "whatsapp", banner: `${RAJU} · Sehgal ke ghar gaya tha.`, sets: ["did:raju-withdrew"] },
  { id: "kunal-papa", device: "owner", after: ["did:nitin-exposed"], delay: 20, clock: "02:40", app: "whatsapp", banner: "Kunal · Papa ko bata diya. Handle ho jayega." },
  { id: "nitin-threat", device: "owner", after: ["fired:kunal-papa"], delay: 25, clock: "03:05", app: "whatsapp", banner: "Nitin · Bhasin ke log ghar aaye the." },
  /* 3:20: from the locked chat, the notification breaks through. After a
     dark screen, never under it: events wait while one plays. */
  { id: "anita", device: "owner", after: ["ask:q7"], delay: 8, clock: "03:20", app: "whatsapp", banner: "Dilip · Aap Sameer ho? Ye phone ek ladke ka hai." },
  { id: "dilip-plea", device: "owner", after: ["ask:q8"], delay: 8, clock: "03:40", app: "whatsapp", banner: "Dilip · 🎤 Voice message" },
  /* The reveal begins once his voice has been heard, or soon after it's
     arrived (RAAKH-V3 §9, scene 3.10). Nothing else lands while it plays. */
  { id: "reveal-heard", device: "owner", after: ["saw:dilip-plea"], delay: 32, local: true, app: "casefile", sets: ["did:reveal-start"] },
  { id: "reveal-late", device: "owner", after: ["fired:dilip-plea"], unless: ["fired:reveal-heard"], delay: 60, quiet: true, local: true, app: "casefile", sets: ["did:reveal-start"] },
  { id: "bhasin-terms", device: "owner", after: ["did:reveal-done"], unless: ["did:facedown"], delay: 3, clock: "04:06", app: "whatsapp", banner: "Bhasin Uncle · 🎤 Voice message" },
  // Real time, run out (story.realtime): his car leaves, and the Trade with it.
  { id: "bhasin-left", device: "owner", after: ["did:bhasin-left"], delay: 1, clock: "04:36", app: "whatsapp", banner: "Bhasin Uncle · Theek hai. Tu nahi aaya." },
];

/** The two dark screens of this episode (PG-DARK #1 and #2); the third ends the reveal. */
export const dark: readonly Dark[] = [
  // Once the result has been read (the case file's "Keep going"), never over it.
  { id: "dark-dilip", after: ["did:fire-empty", "did:read-q7"], line: "Then where is Dilip?", sets: ["did:dark-dilip"] },
  {
    id: "dark-anita",
    // Whatever was said back: her voice note plays on black.
    after: ["did:anita-replied"],
    voice: { who: "Sister Anita", key: "voice:an-v", seconds: ANITA_VOICE.seconds, lines: ANITA_VOICE.lines },
    // Back in the chat it came from, where her photos land next.
    returnTo: { app: "whatsapp", thread: "dilip" },
    sets: ["did:dark-anita"],
  },
];

export const episode3 = { beats, events, threads, dark };
