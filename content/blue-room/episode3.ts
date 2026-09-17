import type { Part } from "@/content/found/types";

/* ===========================================================================
   The Blue Room — Episode 3: "Who Hired Raghav?".

   So far (N3): what the phone holds for this episode. The 23:31 call
   recording, the B-2 archive behind its code, and the FOUND video. All gated
   on `ep:3`. The questions, the choice and the endings land in N6 and N7
   (CHAPTER1.md, Parts 7 and 8).
   =========================================================================== */

const EP3 = "ep:3" as const;

export const episode3: Part = {
  photos: [
    {
      id: "b2-files",
      album: "archive",
      alt: "A steel shelf of box files, each labelled with an address. Seven of them. One says GULMOHAR RD / JVPD.",
      takenAt: "Fri 23:22",
      place: "B-2",
      evidence: "b2-files",
      requires: [EP3],
    },
    {
      id: "b2-ids",
      album: "archive",
      alt: "A desk drawer pulled out: dozens of identity cards and passport photocopies, sorted with rubber bands.",
      liveText: "LATE M. D'SOUZA · AADHAAR",
      takenAt: "Fri 23:23",
      place: "B-2",
      evidence: "b2-ids",
      requires: [EP3],
    },
    {
      id: "b2-notebook",
      album: "archive",
      alt: "A school notebook, open, in careful Hindi handwriting: dates, amounts, names, and at the bottom a line underlined twice.",
      liveText: "SUNITA KI FEES — 1,85,000 · AGAR KAMAT NE DHOKA DIYA TOH YE SAB POLICE KO",
      takenAt: "Fri 23:25",
      place: "B-2",
      evidence: "b2-notebook",
      requires: [EP3],
    },
    {
      id: "found-video",
      album: "archive",
      alt: "Video. Raghav, somewhere dark, lit by his phone's screen. He looks like he hasn't slept.",
      takenAt: "Sat 03:44",
      place: "FOUND",
      evidence: "found-video",
      requires: [EP3],
      video: {
        seconds: 62,
        captions: [
          { at: 0, who: "Raghav", text: "“Agar tum ye dekh rahe ho, toh phone tum tak pahunch gaya.”", en: "If you're watching this, the phone reached you." },
          { at: 6, text: "[he smiles, slightly]" },
          { at: 8, who: "Raghav", text: "“I don't know who you are.”" },
          { at: 12, who: "Raghav", text: "“Aur honestly, mujhe pata nahi tum kya karoge.”", en: "And honestly, I don't know what you'll do." },
          { at: 17, who: "Raghav", text: "“Police ko doge?”", en: "Give it to the police?" },
          { at: 21, who: "Raghav", text: "“Dena chahiye.”", en: "You should." },
          { at: 24, who: "Raghav", text: "“Lekin ek baat samajh lo.”", en: "But understand one thing." },
          { at: 28, who: "Raghav", text: "“Mera naam isme har jagah hai.”", en: "My name is everywhere in this." },
          { at: 31, who: "Raghav", text: "“Mere photos. Mera number. Mera account. Meri awaaz.”", en: "My photos. My number. My account. My voice." },
          { at: 37, who: "Raghav", text: "“Maine andar jaake photos liye.”", en: "I went in and took the photos." },
          { at: 41, text: "[he swallows]" },
          { at: 43, who: "Raghav", text: "“Agar ye sab police ko milega, pehla sawaal mujhse hi hoga.”", en: "If the police get all this, the first question will be for me." },
          { at: 50, who: "Raghav", text: "“Main innocent hoon.”", en: "I'm innocent." },
          { at: 54, who: "Raghav", text: "“Lekin innocent aur safe…”", en: "But innocent and safe…" },
          { at: 58, who: "Raghav", text: "“…same cheez nahi hoti.”", en: "…aren't the same thing." },
        ],
      },
    },
  ],

  recordings: [
    {
      id: "call-2331",
      title: "Call with +91 98200 •6134",
      folder: "calls",
      at: "Fri 23:31",
      seconds: 236,
      evidence: "call-kamat",
      requires: [EP3],
      transcript: [
        { at: 0, text: "[ringing; picked up]" },
        { at: 4, who: "Raghav", text: "“Aapne mujhe hire nahi kiya tha, right?”", en: "You didn't hire me, did you?" },
        { at: 9, who: "Mahesh", text: "“Kisne bola?”", en: "Who told you that?" },
        { at: 13, who: "Raghav", text: "“Telegram waale bande ne.”", en: "The guy on Telegram." },
        { at: 17, text: "[a pause]" },
        { at: 21, who: "Mahesh", text: "“Naam kya hai?”", en: "What's his name?" },
        { at: 25, who: "Raghav", text: "“Mujhe nahi pata.”", en: "I don't know." },
        { at: 29, who: "Mahesh", text: "“Good.”" },
        { at: 32, who: "Raghav", text: "“Good?”" },
        { at: 37, text: "[another pause]" },
        { at: 44, who: "Mahesh", text: "“Raghav, ghar ja.”", en: "Raghav, go home." },
        { at: 49, who: "Raghav", text: "“Mere parents ko kuch hua—”", en: "If anything happens to my parents—" },
        { at: 52, who: "Mahesh", text: "“Maine tumhare parents ka naam nahi liya.”", en: "I didn't say anything about your parents." },
        { at: 58, text: "[silence]" },
        { at: 232, text: "[the call ends]" },
      ],
    },
  ],

  files: [
    {
      id: "b2-zip",
      name: "B-2.zip",
      folder: "Downloads",
      at: "Fri 23:34",
      size: "64 MB",
      requires: [EP3],
      content: { kind: "archive", lock: "b2", photos: ["b2-files", "b2-ids", "b2-notebook"] },
    },
    {
      id: "found",
      name: "FOUND.mov",
      folder: "FOUND",
      at: "Sat 03:44",
      size: "88 MB",
      requires: [EP3],
      content: { kind: "video", photo: "found-video" },
    },
  ],

  locks: [
    {
      id: "b2",
      app: "files",
      // The minute the blue room was named.
      answer: "2319",
      clues: ["blue-room-msg"],
      requires: [EP3],
      look: ["whatsapp", "files"],
      hints: [
        "Raghav locked it with something only someone who'd read everything would know.",
        "When did anyone first say the words “blue room” on this phone?",
        "The message came at 23:19. Type 2319.",
      ],
    },
  ],

  callLog: [{ id: "c-kamat", who: "+91 98200 •6134", dir: "out", at: "Fri 23:31", duration: "3:56", requires: [EP3] }],

  evidence: [
    { id: "b2-files", app: "files", label: "Seven property files in B-2", detail: "One box file per address. One of them is this house.", requires: [EP3] },
    { id: "b2-ids", app: "files", label: "A drawer of identity documents", detail: "Dozens of IDs and passport copies. Some of the names belong to people who are dead.", requires: [EP3] },
    { id: "b2-notebook", app: "files", label: "Prakash's notebook", detail: "“Sunita ki fees.” And underlined: if Kamat cheats him, all of this goes to the police.", requires: [EP3] },
    { id: "found-video", app: "files", label: "FOUND.mov, 03:44", detail: "Raghav, to whoever found the phone: “Innocent aur safe same cheez nahi hoti.”", requires: [EP3] },
    { id: "call-kamat", app: "recorder", label: "Raghav's call to Kamat, 23:31", detail: "“Raghav, ghar ja.” “Maine tumhare parents ka naam nahi liya.” Seven minutes later, 23:38.", requires: [EP3] },
  ],

  // Placeholders until N5 and N6: enough of Episode 3 to open the phone in it.
  stages: [{ id: "e3-open", episode: 3, when: [EP3], battery: 20, screen: "phone" }],
  actions: [{ id: "start-ep3", sets: EP3, requires: ["ep:2"] }],
};
