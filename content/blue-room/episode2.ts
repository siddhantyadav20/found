import type { Part } from "@/content/found/types";

/* ===========================================================================
   The Blue Room — Episode 2: "The Claim".

   So far (N3): what the phone holds for this episode. The hall camera's later
   frames, the 23:24 memo and the 23:38 recording, the roster with its hidden
   sheet, and the claim file with the contractor's estimate in it. All gated
   on `ep:2`. The questions, events and ending land in N5 (CHAPTER1.md, Part 6).
   =========================================================================== */

const EP2 = "ep:2" as const;
const HOUSE = "Malhotra Residence";

export const episode2: Part = {
  photos: [
    {
      id: "hall-2305",
      album: "camera",
      alt: "The entrance hall from a tripod: marble floor, the front door, and the study's glass door on the left. Empty.",
      takenAt: "Fri 23:05",
      place: HOUSE,
      requires: [EP2],
    },
    {
      id: "hall-2313",
      album: "camera",
      alt: "The same hall, eight minutes later. Still empty. The study's glass door is lit from inside.",
      takenAt: "Fri 23:13",
      place: HOUSE,
      evidence: "hall-2313",
      requires: [EP2],
      zoom: {
        reveal: "In the study's glass door, a reflection: a man crossing the room, face turned away. On his wrist, a silver watch.",
        evidence: "reflection-watch",
        // The study's glass door, on the left of the hall.
        at: { x: 20, y: 44 },
      },
    },
    {
      id: "hall-2338",
      album: "camera",
      alt: "Three men in the hall. Two of them are holding up the third, who can barely stand.",
      takenAt: "Fri 23:38",
      place: HOUSE,
      evidence: "hall-three",
      requires: [EP2],
    },
    {
      id: "hall-2343",
      album: "camera",
      alt: "The front door, open. One man going out alone, in a grey jacket, not hurrying.",
      takenAt: "Fri 23:43",
      place: HOUSE,
      evidence: "hall-leaving",
      requires: [EP2],
    },
    {
      id: "hall-2344",
      album: "camera",
      alt: "The hall floor, out of focus. Two shapes that don't move.",
      takenAt: "Fri 23:44",
      place: HOUSE,
      evidence: "hall-floor",
      requires: [EP2],
    },
  ],

  recordings: [
    {
      id: "memo-2324",
      title: "Gulmohar Rd 2",
      folder: "memos",
      at: "Fri 23:24",
      seconds: 38,
      evidence: "memo-2324",
      requires: [EP2],
      transcript: [
        { at: 0, text: "[whispering, close to the phone]" },
        { at: 2, who: "Raghav", text: "“Okay. I think mujhe samajh aa gaya.”", en: "Okay. I think I've got it." },
        { at: 7, text: "[a pause]" },
        { at: 9, who: "Raghav", text: "“Ye insurance wala scene nahi hai.”", en: "This isn't an insurance thing." },
        { at: 13, text: "[footsteps]" },
        { at: 15, who: "Raghav", text: "“Ye log pehle cheezein nikal rahe hain.”", en: "They're taking the things out first." },
        { at: 20, who: "Raghav", text: "“Phir damage karenge.”", en: "Then they'll do the damage." },
        { at: 24, who: "Raghav", text: "“Aur insurance se paise lenge.”", en: "And take the money from the insurance." },
        { at: 29, text: "[somewhere downstairs, a door closes]" },
        { at: 33, text: "[silence]" },
        { at: 36, who: "Raghav", text: "“Fuck.”" },
      ],
    },
    {
      id: "rec-2338",
      title: "Gulmohar Rd 3",
      folder: "memos",
      at: "Fri 23:38",
      seconds: 486,
      evidence: "rec-2338",
      requires: [EP2],
      transcript: [
        { at: 0, text: "[fabric; the phone being put down]" },
        { at: 14, text: "[downstairs: the front door, three sets of footsteps, one dragging]" },
        { at: 31, who: "Naveen", text: "“Tune bola tha sab clean hai.”", en: "You said everything was clean." },
        { at: 36, who: "Mahesh", text: "“Maine sab clean rakha tha.”", en: "I kept everything clean." },
        { at: 42, who: "Prakash", text: "“Phir usko kisne maara?”", en: "Then who beat him up?" },
        { at: 47, text: "[silence]" },
        { at: 58, text: "[Naveen laughs, and it turns into a cough]" },
        { at: 64, who: "Naveen", text: "“Tum dono ko lagta hai tumhe paise milenge?”", en: "You two think you're getting paid?" },
        { at: 72, text: "[a drawer, or a bag, being opened]" },
        { at: 78, who: "Naveen", text: "“Mahesh—”" },
        { at: 80, text: "[a gunshot]" },
        { at: 84, text: "[something heavy falls]" },
        { at: 92, who: "Prakash", text: "“Tune isko kyun maara?”", en: "Why did you kill him?" },
        { at: 97, who: "Mahesh", text: "“Because he was going to talk.”" },
        { at: 105, who: "Prakash", text: "“Aur kal tu meri beti ka naam leke police ko kya bolega?”", en: "And tomorrow, what will you tell the police, using my daughter's name?" },
        { at: 114, text: "[silence]" },
        { at: 121, text: "[a struggle; furniture scraping]" },
        { at: 127, text: "[two gunshots]" },
        { at: 131, text: "[silence]" },
        { at: 176, text: "[one set of footsteps; the front door; a car starting, and going]" },
        { at: 402, text: "[silence]" },
        { at: 418, text: "[inside the house: footsteps. Slow. Then on the stairs.]" },
        { at: 470, text: "[closer]" },
        { at: 484, text: "[the recording stops]" },
      ],
    },
  ],

  files: [
    {
      id: "roster",
      name: "duty_roster_oct.xlsx",
      folder: "WhatsApp",
      at: "Fri 23:20",
      size: "48 KB",
      requires: [EP2],
      content: {
        kind: "sheet",
        sheets: [
          {
            name: "Oct",
            columns: ["Date", "Shift", "Guard", "Sign"],
            rows: [
              ["1 Oct", "Night", "P. Yadav", "PY"],
              ["2 Oct", "Night", "P. Yadav", "PY"],
              ["3 Oct", "Night", "P. Yadav", "PY"],
              ["4 Oct", "Night", "P. Yadav", "PY"],
              ["5 Oct", "Night", "P. Yadav", "PY"],
            ],
          },
          {
            name: "7",
            hidden: true,
            evidence: "roster-seven",
            columns: ["#", "Property", "Owner", "Claim", "Paid", "Payee", "Sold to"],
            rows: [
              ["1", "Bungalow, Pali Hill", "D. Kapadia", "₹1.9 Cr", "₹1.9 Cr", "Coastline Estates LLP", "Coastline Estates LLP"],
              ["2", "Flat 1201, Worli", "R. Iyer", "₹74 L", "₹74 L", "Coastline Estates LLP", "Coastline Estates LLP"],
              ["3", "Bungalow, Versova", "late M. D'Souza", "₹2.2 Cr", "₹2.2 Cr", "Coastline Estates LLP", "Coastline Estates LLP"],
              ["4", "Villa, Madh Island", "S. Bhatia", "₹1.1 Cr", "₹1.1 Cr", "Coastline Estates LLP", "Coastline Estates LLP"],
              ["5", "Flat 8A, Bandra W", "N. Merchant", "₹96 L", "₹96 L", "Coastline Estates LLP", "—"],
              ["6", "Bungalow, Chembur", "V. Rao", "₹1.4 Cr", "₹60 L", "Coastline Estates LLP", "—"],
              ["7", "Bungalow, JVPD", "ARVIND MALHOTRA", "₹2.8 CR", "₹18.4 L", "Coastline Estates LLP", "—"],
            ],
          },
        ],
      },
    },
    {
      id: "claim",
      name: "MALHOTRA_claim_draft.pdf",
      folder: "WhatsApp",
      at: "Fri 23:22",
      size: "2.1 MB",
      requires: [EP2],
      content: {
        kind: "pdf",
        pages: [
          {
            title: "Property loss claim — DRAFT",
            lines: [
              { text: "Insured: Arvind Malhotra" },
              { text: "Risk location: Bungalow, Gulmohar Road, JVPD, Juhu, Mumbai" },
              { text: "Cause of loss: Break-in and theft" },
              { text: "Date of loss: __ / __ / ____ (to be filled)", strong: true, evidence: "claim-undated" },
              { text: "Surveyor: Naveen Shah" },
              { text: "Amount claimed: ₹2,80,00,000", strong: true, evidence: "claim-280" },
            ],
          },
          {
            title: "Schedule of contents, as present on Friday at 20:00",
            lines: [
              { text: "All items photographed and verified present, Friday 20:00.", strong: true, evidence: "claim-present-8pm" },
              { text: "3. Silver wristwatch (study) — ₹6,20,000" },
              { text: "5. Jewellery cabinet and contents (living room) — ₹41,00,000" },
              { text: "7. Oil on canvas, master bedroom — ₹48,00,000" },
              { text: "9. Electronics and AV equipment — ₹22,50,000" },
              { text: "12. Furniture, ground floor — ₹31,00,000" },
            ],
          },
          {
            title: "Kamat Interiors & Restoration — restoration estimate",
            lines: [
              { text: "Water ingress from a burst pipe, first floor, affecting ground-floor rooms.", strong: true, evidence: "estimate-water" },
              { text: "Furniture and contents removed from site for drying and restoration." },
              { text: "Estimated restoration: ₹38,40,000" },
              { text: "— M. Kamat" },
            ],
          },
        ],
      },
    },
  ],

  evidence: [
    { id: "hall-2313", app: "photos", label: "The hall camera, 23:13", detail: "An empty hall. The study's glass door is lit.", requires: [EP2] },
    { id: "reflection-watch", app: "photos", label: "A man in the study's glass, 23:13", detail: "Zoomed in: someone crossing the study, face turned away, wearing a silver watch.", requires: [EP2] },
    { id: "hall-three", app: "photos", label: "Three men in the hall, 23:38", detail: "Two holding up a third, who can barely stand.", requires: [EP2] },
    { id: "hall-leaving", app: "photos", label: "One man leaving, 23:43", detail: "The front door. One man goes out alone, not hurrying.", requires: [EP2] },
    { id: "hall-floor", app: "photos", label: "The hall floor, 23:44", detail: "Two shapes that don't move.", requires: [EP2] },
    { id: "memo-2324", app: "recorder", label: "Raghav's memo, 23:24", detail: "“Ye log pehle cheezein nikal rahe hain. Phir damage karenge. Aur insurance se paise lenge.”", requires: [EP2] },
    { id: "rec-2338", app: "recorder", label: "The recording from 23:38", detail: "Three men downstairs. One shot, then a fight, then two. Then, after the car leaves, footsteps inside.", requires: [EP2] },
    { id: "roster-seven", app: "files", label: "The roster's hidden sheet: 7 properties", detail: "Seven claims. Malhotra: ₹2.8 Cr claimed, ₹18.4 L paid, to Coastline Estates LLP.", requires: [EP2] },
    { id: "claim-undated", app: "files", label: "The claim's date of loss: blank", detail: "A break-in claim, drafted before the break-in, waiting for its date.", requires: [EP2] },
    { id: "claim-280", app: "files", label: "₹2,80,00,000 claimed", detail: "Filed in Arvind Malhotra's name, for a break-in and theft.", requires: [EP2] },
    { id: "claim-present-8pm", app: "files", label: "“Present on Friday at 20:00”", detail: "The claim says every item was in the house at 20:00, including the painting and the watch.", requires: [EP2] },
    { id: "estimate-water", app: "files", label: "Kamat's estimate: a burst pipe", detail: "Water damage, and furniture removed for drying. Signed M. Kamat.", requires: [EP2] },
  ],

  // Placeholders until N4 and N5: enough of Episode 2 to open the phone in it.
  stages: [{ id: "e2-open", episode: 2, when: [EP2], battery: 3, screen: "phone" }],
  actions: [{ id: "start-ep2", sets: EP2, requires: ["seen:plan-b2"] }],
};
