import type { Final, Reveal } from "../types";

/* ===========================================================================
   The reveal (RAAKH-V3 §9, scene 3.10), 3:58 to 4:04 AM, and what can be
   done before the last question is answered (§9.12) and before each ending
   (§10).

   Nine steps, in order, with nothing else let in: Bhasin's voice note; the
   second phone ringing, Gate 2; Meera, "Sameer. Ab bas."; the front camera;
   the case file turning over to its info panel; the montage of the
   player's own lines; Meera's line, by which Sameer read the phone; the last
   dark screen; the card. Face down at step 3 goes straight to Return to
   Origin.
   =========================================================================== */

export const reveal: Reveal = {
  after: ["did:reveal-start"],
  voice: {
    who: "Bhasin Uncle",
    key: "voice:b-gate",
    seconds: 8,
    lines: [
      { at: 0.4, who: "Bhasin", line: "Sameer." },
      { at: 4, who: "Bhasin", line: "Gate do pe hoon. Neeche aa. Baat karni hai.", english: "I'm at Gate 2. Come down. We need to talk." },
    ],
  },
  yours: {
    call: {
      id: "guard",
      device: "yours",
      from: "Gate 2 · Ram Kishan ji",
      sub: "mobile",
      at: "03:59",
      after: ["did:reveal-start"],
      lines: [
        {
          who: "Ram Kishan ji",
          line: "Khurrana sahab, maaf karna, itni raat ko. Bhasin sahab neeche gaadi mein baithe hain. Keh rahe hain aapko bula doon.",
          english: "Khurrana sahab, sorry, so late. Bhasin sahab is downstairs in his car. Asking me to call you.",
        },
      ],
      reply: {
        id: "guard-call",
        options: [
          {
            id: "denial",
            text: "Main Khurrana nahi hoon.",
            english: "I'm not Khurrana.",
            sets: ["did:guard-denial"],
            then: [{ id: "g-1", from: "them", at: "03:59", typing: 4, text: "Sahab… B-14 aap hi ka hai na? Teen saal se aapke liye gate khol raha hoon.", english: "Sahab… B-14 is yours, isn't it? I've opened the gate for you for three years." }],
          },
          {
            id: "wait",
            text: "Unse kaho intezaar karein.",
            english: "Tell him to wait.",
            sets: ["did:guard-wait"],
            then: [{ id: "g-2", from: "them", at: "03:59", text: "Ji sahab.", english: "Yes, sahab." }],
          },
          { id: "hang", text: "[Hang up]", sets: ["did:guard-hung"] },
        ],
      },
    },
    text: "Khurrana sahab, Bhasin sahab neeche hain.",
  },
  call: {
    id: "meera-reveal",
    device: "owner",
    from: "M",
    sub: "mobile",
    at: "04:00",
    after: ["did:rv-guard"],
    lines: [{ who: "Meera", line: "Sameer. Ab bas.", english: "Sameer. Enough now." }],
    reply: {
      id: "meera-reveal-call",
      options: [
        {
          id: "denial",
          text: "Main Sameer nahi hoon.",
          english: "I'm not Sameer.",
          sets: ["did:rv-meera-denial"],
          then: [{ id: "mr-1", from: "them", at: "04:00", typing: 4, text: "Toh front camera khol. Aur mujhe bata kaun dikh raha hai.", english: "Then open the front camera. And tell me who you see." }],
        },
        {
          id: "name",
          text: "Meera…",
          english: "Meera…",
          sets: ["did:rv-meera-name"],
          then: [{ id: "mr-2", from: "them", at: "04:00", typing: 4, text: "Front camera khol, Sameer. Ek baar dekh le.", english: "Open the front camera. Look, once." }],
        },
      ],
    },
  },
  early: { who: "Meera", text: "Ab dekh le khud ko. Ek baar.", english: "Now look at yourself. Once." },
  look: {
    open: "Open the camera",
    away: "Put the phone face down",
    // Her "don't look", against Bhasin's at the fire.
    awayLine: { who: "Meera", text: "Theek hai, Sameer. Mat dekh.", english: "All right, Sameer. Don't look." },
  },
  camera: { src: "/found/raakh/viewfinder.jpg", alt: "The front camera: an unshaven man, red-eyed, lit only by the screen, a silver kada on the hand holding the phone" },
  info: {
    lines: ["Case file", "Notes", "Created Sat 28 Nov 2026, 11:44 PM", "On this iPhone", "Last edited 4:01 AM"],
    question: "q1",
    called: "You called it.",
  },
  montage: {
    limit: 6,
    lines: [
      { said: "did:mummy-stranger", answering: { who: "Mummy", text: "Tu theek hai na?", english: "You're okay, right?" } },
      { said: "did:raju-first-denial", answering: { who: "Raju", text: "Ye Sameer bhaiya ka phone hai na?", english: "This is Sameer bhaiya's phone, isn't it?" } },
      { said: "did:raju-first-finding", answering: { who: "Raju", text: "Dilip kahan hai?", english: "Where's Dilip?" } },
      { said: "did:raju-first-whos", answering: { who: "Raju", text: "Dilip kahan hai?", english: "Where's Dilip?" } },
      { said: "did:promise-p1", answering: { who: "Nitin", text: "Kaun ho aap? Bhasin ke aadmi?", english: "Who are you? Bhasin's man?" } },
      { said: "did:raju-told-kunal", answering: { who: "Raju", text: "Dilip ke baare mein kuch pata chala?", english: "Found anything about Dilip?" } },
      { said: "did:anita-denial", answering: { who: "Sister Anita", text: "Aap Sameer ho?", english: "Are you Sameer?" } },
      { said: "did:anita-care", answering: { who: "Sister Anita", text: "Aap Sameer ho?", english: "Are you Sameer?" } },
      { said: "did:anita-what", answering: { who: "Sister Anita", text: "Aap Sameer ho?", english: "Are you Sameer?" } },
      { said: "did:meera-stranger", answering: { who: "Meera", text: "Sameer—", english: "Sameer—" } },
      { said: "did:meera-parcel", answering: { who: "Meera", text: "Sameer—", english: "Sameer—" } },
      { said: "did:meera-why", answering: { who: "Meera", text: "Sameer—", english: "Sameer—" } },
      { said: "did:early-reveal", answering: { who: "Meera", text: "Sameer—", english: "Sameer—" } },
      // Anything deleted for good, said as Photos would: "Deleted permanently: reel take, 1:13 AM".
      { said: "did:deleted-perm", answering: { text: "Kuch delete mat karna.", english: "Don't delete anything." } },
    ],
    cuts: [
      { text: "“Pakki.”", sub: "The reel take, 12:31 AM", src: "/found/raakh/reel-take.jpg" },
      { text: "The same kada", sub: "The parcel, tonight · the fire, a week ago", src: "/found/raakh/jerrycan.jpg" },
      { text: "12:29 AM", sub: "Kunal's shared album, at the wrist", src: "/found/raakh/bts.jpg" },
    ],
  },
  lines: {
    confessor: {
      who: "Meera",
      text: "Main pehli call se jaanti thi. Main dekhna chahti thi tu khud padhega toh kya karega. …Tu chahta tha koi tujhe pakde, Sameer. Isliye tune ye phone khola.",
      english: "I knew from the first call. I wanted to see what you'd do reading it yourself. …You wanted someone to catch you. That's why you opened this phone.",
    },
    auditor: {
      who: "Meera",
      text: "Main pehli call se jaanti thi. Main dekhna chahti thi tu khud padhega toh kya karega. …Tu dekh raha tha tera jhooth kitna tikta hai.",
      english: "I knew from the first call. I wanted to see what you'd do reading it yourself. …You were checking how long your lie would hold.",
    },
    early: { who: "Meera", text: "Tujhe kab pata chala?", english: "When did you know?" },
  },
  dark: {
    line: "Somebody was checking whether it could be solved. Somebody wanted it solved. Both of them were you.",
    held: "Your story held on {n} of {of}.",
  },
  card: "Tonight · Sunday · 4:04 AM",
};

/* --- Before you choose (scene 3.12), and before each ending (§10) ---------- */

/** Whether Raju still trusts the voice on this phone (RAAKH-V3 §14, `raju_trust`). */
const RAJU_MED_HIGH = ["did:raju-first-finding", "did:raju-told-shot", "did:promise-p2"] as const;
const BROKEN = "did:raju-withdrew" as const;

/** The breaking items still on the phone, each with a Delete (the 4:55 and Return to Origin). */
const cleanUp = [
  { id: "del-nitin", label: "Nitin's copy of 1:52", delete: "n-copy" },
  { id: "del-fire", label: "The whole fire clip", delete: "fire-whole" },
  { id: "del-frame", label: "Kunal's frame", delete: "frame" },
  { id: "del-reel", label: "The reel take", delete: "reel-take" },
  { id: "del-memo", label: "The confession memo", delete: "memo-458" },
] as const;

export const final: Final = {
  asides: [
    {
      id: "call-m",
      label: "Call M",
      lines: [
        { who: "Meera", text: "Sameer?", unless: ["did:meera-contact"] },
        { who: "You", text: "Haan.", unless: ["did:meera-contact"] },
        { who: "Meera", text: "…Kahan hai tu?", english: "…Where are you?", unless: ["did:meera-contact"] },
        {
          who: "Meera",
          text: "Main tujhe nahi bataungi kya karna hai. Bas itna: agar tu Bedi jaata hai, main DCP ko bula sakti hoon, Bhasin ka aadmi nahi.",
          english: "I won't tell you what to do. Only this: if you go to Bedi, I can bring a DCP, not one of Bhasin's.",
        },
        { who: "Meera", text: "Agar nahi jaata, toh jo mere paas hai, mere paas rahega.", english: "If you don't, what I have stays with me.", needs: ["did:sent-m"] },
        { who: "Meera", text: "Agar nahi jaata, toh mere paas kuch nahi hai. Sab tere haath mein hai.", english: "If you don't, I have nothing. It's all in your hands.", unless: ["did:sent-m"] },
      ],
      sets: ["did:aside-meera"],
    },
    {
      id: "listen",
      label: "Listen to Dilip again",
      lines: [
        {
          who: "Dilip",
          text: "Bhaiya… aap aa rahe ho na? Unhone bola hai agar main kuch nahi bolunga toh ghar bhej denge. Main kuch nahi bolunga. Maa ko mat batana ki goli lagi thi. Bas… aap aa jao.",
          english: "Bhaiya… you're coming, right? They said if I don't say anything, they'll send me home. I won't say anything. Don't tell Maa I was shot. Just… come.",
        },
      ],
      sets: ["did:aside-dilip"],
    },
  ],
  before: {
    room6: {
      title: "Before you go",
      go: "Go to Fatehpur Beri",
      steps: [
        {
          id: "meera",
          label: "Call Meera",
          lines: [{ who: "Meera", text: "Aa raha hai? …Theek hai. DCP ko main bulaati hoon. Andar akele mat jaana jab tak woh na aaye.", english: "You're coming? …Fine. I'll get the DCP. Don't go in alone before she arrives." }],
          sets: ["did:dcp-route"],
        },
        {
          id: "raju",
          label: "Call Raju",
          unless: [BROKEN],
          lines: [
            { who: "Raju", text: "Aap… aap hi ho na?", english: "It's you, isn't it?" },
            { who: "Raju", text: "Aapne kaha tha aap Sameer nahi ho.", english: "You said you weren't Sameer.", needs: ["did:raju-first-denial"], unless: [...RAJU_MED_HIGH] },
            { who: "You", text: "Jhooth tha.", english: "That was a lie.", needs: ["did:raju-first-denial"], unless: [...RAJU_MED_HIGH] },
            { who: "You", text: "Haan. Main Sameer hoon. Dilip zinda hai. Bedi Nursing Home, Fatehpur Beri. Room 6.", english: "Yes. I'm Sameer. Dilip's alive. Bedi Nursing Home, Fatehpur Beri. Room 6." },
            { who: "Raju", text: "…Main nikal raha hoon.", english: "…I'm leaving now." },
          ],
          sets: ["did:raju-called"],
        },
        // Lied to, and gone to the Sehgals' on the strength of it: the truth first, or nothing.
        {
          id: "raju-broken",
          label: "Call Raju",
          requires: [BROKEN],
          lines: [{ who: "Raju", text: "…", english: "(He picks up, and says nothing.)" }],
          choose: [
            {
              id: "confess",
              text: "Maine jhooth bola tha. Kunal ne nahi chalayi. Maine chalayi thi.",
              english: "I lied. Kunal didn't fire. I did.",
              sets: ["did:raju-called", "did:raju-repaired"],
            },
          ],
          sets: [],
        },
        { id: "nitin", label: "Message Nitin", lines: [{ who: "You", text: "Mera naam aayega. Tera bhi aa sakta hai. Maaf kar de.", english: "My name will come up. Yours might too. Forgive me." }], sets: ["did:nitin-warned"] },
        { id: "mummy", label: "Message Mummy", lines: [{ who: "You", text: "Main theek hoon, Mummy.", english: "I'm fine, Mummy." }], sets: ["did:mummy-told-final"] },
        { id: "gate1", label: "Leave by Gate 1", lines: [{ who: "Ram Kishan ji", text: "Gate 1 khol deta hoon, sahab. Bhasin sahab Gate 2 pe hain.", english: "I'll open Gate 1. Bhasin sahab's at Gate 2." }], sets: ["did:gate-1"] },
      ],
    },
    trade: {
      title: "Before you send it",
      go: "Send it down with the guard",
      steps: [{ id: "dilip", label: "Message Dilip's number", lines: [{ who: "You", text: "Ghar ja. Maaf kar de.", english: "Go home. Forgive me." }], sets: ["did:trade-message"] }],
    },
    train: {
      title: "Clean up",
      go: "Leave for the 4:55",
      echo: { text: "Kuch delete mat karna.", english: "Don't delete anything.", needs: ["did:promise-p3"] },
      steps: cleanUp.map((c) => ({ id: c.id, label: c.label, delete: c.delete })),
    },
    origin: {
      title: "Repack it",
      go: "Seal the envelope",
      echo: { text: "Kuch delete mat karna.", english: "Don't delete anything.", needs: ["did:promise-p3"] },
      steps: [
        ...cleanUp.map((c) => ({ id: c.id, label: c.label, delete: c.delete })),
        {
          id: "line",
          label: "Add a line to the note",
          choose: [
            // Only while it's true: nothing deleted for good.
            { id: "all", text: "Ab sach mein sab hai.", english: "Now it really is all here.", sets: ["did:repack-all"], unless: ["did:deleted-perm"] },
            { id: "sorry", text: "Maaf kar de.", english: "Forgive me.", sets: ["did:repack-sorry"] },
          ],
        },
      ],
    },
  },
};
