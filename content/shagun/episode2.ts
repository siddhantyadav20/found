import type { Evidence, LiveEvent, Question } from "../types";

/* ===========================================================================
   Episode 2 — "The Second Shot". ROADMAP S7 writes CHAPTER1.md F, Episode 2,
   as data: the reel, two firings, the memo, 1:07 AM, the money, Raju,
   Bhasin, the archived chat, Q5–Q9 and QM, and the reply to a message that
   is not there.

   Defined early, because Episode 1's Q3 can be revisited with them: Kunal's
   clip (in his chat from the start), the 12:29 photo WhatsApp saved to
   Photos, and the reel take in Recently Deleted. None counts before Episode 2
   (the hybrid pacing).
   =========================================================================== */

const evidence: readonly Evidence[] = [
  { id: "kunal-clip", device: "owner", app: "whatsapp", label: "Kunal's clip: two shots on the dance floor, 11:52 PM", within: true, requires: ["ep:2"] },
  { id: "bts", device: "owner", app: "photos", label: "12:29 AM: Sameer holding the revolver, Dilip beside him with the light", within: true, requires: ["ep:2"] },
  { id: "reel-take", device: "owner", app: "photos", label: "The reel take, 12:31 AM, in Recently Deleted", manual: true, requires: ["ep:2"] },
];

const questions: readonly Question[] = [];
const events: readonly LiveEvent[] = [];

export const episode2 = { evidence, questions, events };
