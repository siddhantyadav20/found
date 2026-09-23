import type { Link } from "../types";

/* ===========================================================================
   The night's chain of responsibility: the chapter's score, what the endings
   read, and the end card (CHAPTER1.md D).

   A link is traced when a question's answer sets `link:<id>`. Spine links
   every finisher traces; deep links are optional, because the case file
   accepts Sameer's version of them without comment. An untraced link is
   shown in his words, which is the whole chapter in one screen.
   =========================================================================== */

export const chain: readonly Link[] = [
  {
    id: "reel",
    label: "The reel",
    truth: "Sameer was staging his own reel at the wedding, with a real gun.",
    owner: "Sameer",
    kind: "spine",
    version: "Main bas shaadi shoot kar raha tha.",
    english: "I was only shooting the wedding.",
  },
  {
    id: "kunals-gun",
    label: "Kunal's gun",
    truth: "Kunal fired his father's revolver at the celebration, then brought it to the reel, loaded.",
    owner: "Kunal",
    kind: "spine",
  },
  {
    id: "two-firings",
    label: "Two firings",
    truth: "Kunal's shots on the dance floor and the shot that hit Dilip were forty minutes and a lawn apart.",
    owner: "—",
    kind: "spine",
    version: "Kunal firing kar raha tha. Ek ladka gir gaya.",
    english: "Kunal was firing. A boy fell.",
  },
  {
    id: "shot",
    label: "The shot",
    truth: "Sameer's second discharge, made while posing, hit Dilip.",
    owner: "Sameer",
    kind: "spine",
    version: "Goli Kunal ki thi.",
    english: "It was Kunal's bullet.",
  },
  {
    id: "alive",
    label: "Alive",
    truth: "Dilip survived the shot, and was conscious for more than two hours.",
    owner: "—",
    kind: "spine",
  },
  {
    id: "kept",
    label: "Kept there",
    truth: "Bhasin had him moved to the service room: no 112, no hospital.",
    owner: "Bhasin",
    kind: "spine",
  },
  {
    id: "car",
    label: "The car",
    truth: "Nitin got a car to the service gate, and it left without Dilip.",
    owner: "Nitin",
    kind: "spine",
  },
  {
    id: "lie",
    label: "The lie",
    truth: "At 1:52 Sameer told Nitin that Dilip had gone for treatment. He knew he hadn't.",
    owner: "Sameer",
    kind: "deep",
    version: "Bhasin ne gaadi wapas bhej di.",
    english: "Bhasin sent the car away.",
  },
  {
    id: "fire",
    label: "The fire",
    truth: "The body was burned before dawn on Bhasin's orders, and Sameer took part and filmed it.",
    owner: "Bhasin, Sameer",
    kind: "deep",
    version: "Maine dekha. Main wahan tha.",
    english: "I saw it. I was there.",
  },
  {
    id: "price",
    label: "The price",
    truth: "His own balance, ₹1,80,000, was held back until he agreed to stay quiet.",
    owner: "The family",
    kind: "deep",
    version: "Unka paisa. Chup rehne ka.",
    english: "Their money. To keep quiet.",
  },
  {
    id: "edit",
    label: "The edit",
    truth: "Sameer arranged this phone so that his part ends before the death.",
    owner: "Sameer",
    kind: "deep",
    version: "Sab phone mein hai.",
    english: "It's all on the phone.",
  },
];
