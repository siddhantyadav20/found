import type { LiveEvent, Thread } from "../types";

/* ===========================================================================
   Your phone (CHAPTER1.md H: preserve evidence first).

   Meera, written to from your own phone once her contact info on his has
   been found. Her first line works whatever brought the phone to the player
   (O1): she doesn't say whether she expected it. She tells the player to
   put his phone on airplane mode; if they do, she reads Sameer's habits for
   them, and her bias shows, until the lie is traced and she takes it back.
   =========================================================================== */

const meera: Thread = {
  id: "meera",
  app: "yours:chats",
  name: "Meera Arora",
  number: "+91 98••• •1206",
  requires: ["saw:meera"],
  messages: [
    { id: "me-4", from: "them", at: "02:00", with: "meera-reads", requires: ["fired:meera-reads"], text: "Achha kiya.", english: "Good." },
    { id: "me-5", from: "them", at: "02:00", with: "meera-reads", requires: ["fired:meera-reads"], text: "Ek baat. Sameer jo nahi dekhna chahta, archive karta hai. Ya hide.", english: "One thing. What Sameer doesn't want to look at, he archives. Or hides." },
    { id: "me-6", from: "them", at: "02:01", with: "meera-reads", requires: ["fired:meera-reads"], text: "Sameer darpok hai, par jhooth nahi bolta.", english: "Sameer's a coward, but he doesn't lie." },
    { id: "me-7", from: "them", at: "02:20", with: "meera-takes-back", requires: ["fired:meera-takes-back"], text: "Maine kaha tha woh jhooth nahi bolta.", english: "I said he doesn't lie." },
    { id: "me-8", from: "them", at: "02:20", with: "meera-takes-back", requires: ["fired:meera-takes-back"], typing: 5, text: "Maine galat kaha tha.", english: "I was wrong." },
  ],
  replies: [
    {
      id: "meera-first",
      requires: ["saw:meera"],
      options: [
        {
          id: "write",
          text: "Aap Meera ho? Sameer Khurana ka phone mere paas hai.",
          english: "Are you Meera? I have Sameer Khurana's phone.",
          sets: ["did:wrote-meera"],
          then: [
            { id: "me-1", from: "them", at: "01:00", text: "Sameer ka phone?", english: "Sameer's phone?" },
            { id: "me-2", from: "them", at: "01:00", typing: 6, text: "…Theek hai. Pehle ek kaam karo.", english: "…All right. First, do one thing." },
            {
              id: "me-3",
              from: "them",
              at: "01:01",
              text: "Us phone ko airplane mode pe daalo. Kuch delete mat karo. Kisi ko reply mat karo.",
              english: "Put that phone on airplane mode. Don't delete anything. Don't reply to anyone.",
            },
          ],
        },
      ],
    },
  ],
};

export const threads: readonly Thread[] = [meera];

export const events: readonly LiveEvent[] = [
  // She said airplane mode, and it was done: nothing on his phone changes after this.
  { id: "meera-reads", device: "yours", after: ["did:wrote-meera", "did:airplane"], delay: 4, app: "yours:chats", sets: ["did:meera-preserved"] },
  { id: "meera-takes-back", device: "yours", after: ["fired:meera-reads", "link:lie"], delay: 6, app: "yours:chats" },
];
