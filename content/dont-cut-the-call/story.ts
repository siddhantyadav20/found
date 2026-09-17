import type { Story } from "../types";

import { episode1 } from "./episode1";
import { instagramThreads, notes, photos, smsThreads } from "./paper";
import { calls, settings, threads } from "./phone";
import { article, courier, searches } from "./world";

/* ===========================================================================
   Chapter One — "Don't Cut the Call" · Mumbai.

   Vasundhara Kulkarni's phone, 31 hours into a digital arrest, in a courier
   pouch at your door at 1:11 AM. The script is CHAPTER1.md; the experience
   rules are PLAYER-JOURNEY.md; this is where they become data.

   Episodes 2 and 3 land in ROADMAP.md's P6 and P7. Until then the chapter
   plays its opening and stops, which is what a stub is for.
   =========================================================================== */

export const story: Story = {
  id: "dont-cut-the-call",
  title: "Don't Cut the Call",
  call: { caller: "Mumbai Crime Branch", since: 113_587, board: "MUMBAI POLICE · CRIME BRANCH" },
  episodes: ["Call Mat Kaatna", "Delete for Everyone", "10:30"],
  clocks: [
    { base: "01:11", day: "Saturday", battery: 7 },
    { base: "01:40", day: "Saturday", battery: 4 },
    { base: "10:29", day: "Saturday", battery: 61 },
  ],
  /* What a 64-year-old keeps on the first page, and what she keeps in the
     dock: the four she actually uses. Page two is everything a son installed
     for her once and she never opened again. */
  hersHome: {
    pages: [
      [
        { app: "messages", label: "Messages" },
        { app: "notes", label: "Notes" },
        { app: "settings", label: "Settings" },
        { app: "news", label: "City Desk" },
        { app: "instagram", label: "Instagram" },
      ],
      [
        { app: "pikdrop", label: "PikDrop" },
        { app: "safari", label: "Safari" },
      ],
    ],
    dock: [
      { app: "whatsapp", label: "WhatsApp" },
      { app: "photos", label: "Photos" },
      { app: "phone", label: "Phone" },
      { app: "casefile", label: "Case file" },
    ],
  },
  threads: [...threads, ...smsThreads, ...instagramThreads],
  photos,
  notes,
  calls,
  settings,
  courier,
  searches,
  article,
  ...episode1,
};
