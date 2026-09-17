import type { Story } from "../types";

import { episode1 } from "./episode1";

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
  hersHome: [
    { app: "whatsapp", label: "WhatsApp" },
    { app: "phone", label: "Phone" },
    { app: "gallery", label: "Gallery" },
    { app: "instagram", label: "Instagram" },
    { app: "messages", label: "Messages" },
    { app: "notes", label: "Notes" },
    { app: "pikdrop", label: "PikDrop" },
    { app: "chrome", label: "Chrome" },
    { app: "news", label: "City Desk" },
    { app: "settings", label: "Settings" },
    { app: "casefile", label: "Case file" },
  ],
  ...episode1,
};
