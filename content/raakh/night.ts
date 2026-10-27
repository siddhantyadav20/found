import type { NightBeat, Shot } from "../types";

/* ===========================================================================
   Your night (the end card's timeline), and the shots that open and close
   the episodes (RAAKH-V3 §6: PG-PREV, PG-NEXT).

   The night's beats say what this player did, at the hour they did it, and
   a version of each for the share that spoils nothing. "Previously" is
   assembled from the save: the player's filed sentences being typed, what
   they said, and the line the last episode ended on.
   =========================================================================== */

export const night: readonly NightBeat[] = [
  { at: "11:40 PM", text: "Pulled the strip on a parcel meant for M.", share: "Opened a parcel.", needs: ["did:opened"] },
  { at: "11:41 PM", text: "Told Raju you weren't Sameer.", share: "Picked up a call.", needs: ["did:raju-first-denial"] },
  { at: "11:41 PM", text: "Told Raju you were finding out.", share: "Picked up a call.", needs: ["did:raju-first-finding"] },
  { at: "11:41 PM", text: "Asked Raju, “Dilip kaun?”", share: "Picked up a call.", needs: ["did:raju-first-whos"] },
  { at: "11:41 PM", text: "Let Raju ring out.", share: "Let a call ring out.", needs: ["did:declined-raju"] },
  { at: "12:02 AM", text: "Told his mother you weren't Sameer.", share: "Answered a mother.", needs: ["did:mummy-stranger"] },
  { at: "12:02 AM", text: "Told Mummy you were fine.", share: "Answered a mother.", needs: ["did:mummy-fine"] },
  { at: "12:10 AM", text: "Left Mummy on seen.", share: "Left someone on seen.", needs: ["did:mummy-none"] },
  { at: "12:13 AM", text: "Let the phone die at 2%.", share: "Lost the phone at 2%.", needs: ["did:needs-charge"] },
  { at: "12:51 AM", text: "Told Meera you weren't Sameer.", share: "Answered a call.", needs: ["did:meera-stranger"] },
  { at: "12:51 AM", text: "Asked Meera why she refused it.", share: "Answered a call.", needs: ["did:meera-why"] },
  { at: "12:51 AM", text: "Told Meera, “Main hoon.”", share: "Said it first.", needs: ["did:early-reveal"] },
  { at: "12:51 AM", text: "Promised Meera you'd delete nothing.", share: "Made a promise.", needs: ["did:promise-p3"] },
  { at: "1:05 AM", text: "Told Raju his brother had been shot.", share: "Told someone the truth.", needs: ["did:raju-told-shot"] },
  { at: "1:05 AM", text: "Promised Raju you'd find him.", share: "Made a promise.", needs: ["did:promise-p2"] },
  { at: "1:05 AM", text: "Told Raju it was Kunal Sehgal.", share: "Named someone.", needs: ["did:raju-told-kunal"] },
  { at: "1:25 AM", text: "Told Nitin you weren't Sameer.", share: "Answered a friend.", needs: ["did:nitin-stranger"] },
  { at: "1:25 AM", text: "Asked Nitin if he was okay.", share: "Asked after someone.", needs: ["did:nitin-care"] },
  { at: "1:25 AM", text: "Asked Nitin why he'd recalled the car.", share: "Blamed someone.", needs: ["did:nitin-blame"] },
  { at: "1:27 AM", text: "Promised Nitin his name wouldn't come up.", share: "Made a promise.", needs: ["did:promise-p1"] },
  { at: "1:52 AM", text: "Got back the message Sameer deleted, a week to the minute.", share: "Got a message back.", needs: ["fired:nitin-copy"] },
  { at: "2:10 AM", text: "Told Kunal you weren't Sameer.", share: "Lied to someone.", needs: ["did:kunal-denial"] },
  { at: "2:10 AM", text: "Asked Kunal for the truth, and got a frame.", share: "Asked for the truth.", needs: ["did:kunal-frame"] },
  { at: "2:10 AM", text: "Gave Kunal Nitin's name.", share: "Named someone.", needs: ["did:nitin-exposed"] },
  { at: "2:50 AM", text: "Watched the whole fire. The mattress was empty.", share: "Watched it all.", needs: ["claim:q7:truth"] },
  { at: "3:20 AM", text: "Asked the nurse how the boy was.", share: "Asked after someone.", needs: ["did:anita-care"] },
  { at: "3:20 AM", text: "Told the nurse you weren't Sameer.", share: "Answered a nurse.", needs: ["did:anita-denial"] },
  { at: "3:20 AM", text: "Asked the nurse, “Kaun ladka?”", share: "Answered a nurse.", needs: ["did:anita-what"] },
  { at: "3:40 AM", text: "Heard Dilip ask if you were coming.", share: "Heard a voice note.", needs: ["saw:dilip-plea"] },
  { at: "3:59 AM", text: "Told the guard you weren't Khurrana.", share: "Answered a call.", needs: ["did:guard-denial"] },
  { at: "4:00 AM", text: "Told Meera, again, you weren't Sameer.", share: "Answered a call.", needs: ["did:rv-meera-denial"] },
  { at: "4:01 AM", text: "Opened the front camera.", share: "Looked.", needs: ["did:camera-open"] },
  { at: "4:01 AM", text: "Put the phone face down.", share: "Didn't look.", needs: ["did:facedown"] },
  { at: "4:02 AM", text: "Took the photo.", needs: ["did:camera-photo"] },
  { at: "4:40 AM", text: "Deleted something for good.", share: "Deleted something.", needs: ["did:deleted-perm"] },
  { at: "4:40 AM", text: "Went to Fatehpur Beri.", share: "Went.", needs: ["did:end-room6"] },
  { at: "4:40 AM", text: "Sent the phone down with the guard.", share: "Made a trade.", needs: ["did:end-trade"] },
  { at: "4:40 AM", text: "Kept the phone, and took the 4:55.", share: "Took the train.", needs: ["did:end-train"] },
  { at: "4:40 AM", text: "Sent it back to M.", share: "Sent it back.", needs: ["did:end-origin"] },
];

/** "Previously on Raakh", before Episodes 2 and 3 (PG-PREV). */
export const previously: Readonly<Record<2 | 3, readonly Shot[]>> = {
  2: [
    { kind: "card", text: "Seven days later, a parcel comes back to your door." },
    { kind: "filed", question: "q1" },
    { kind: "voice", who: "Sameer, to M", text: "Kunal firing kar raha tha.", english: "Kunal was firing.", voice: "voice:m-1" },
    { kind: "said", reply: "raju-call", to: "Raju" },
    { kind: "banner", from: "Bhasin Uncle", text: "Ghar pe hi hai. Achha hai.", english: "It's at home. Good.", unless: ["did:went-dark"] },
    { kind: "banner", from: "Bhasin Uncle", text: "Phone band kar diya? Koi baat nahi. Ghar ka pata hai.", english: "Switched it off? Doesn't matter. I know the house.", needs: ["did:went-dark"] },
    { kind: "battery", from: 9, to: 2 },
  ],
  3: [
    { kind: "filed", question: "q4" },
    { kind: "filed", question: "q5" },
    { kind: "voice", who: "Meera", text: "Kuch delete mat karna.", english: "Don't delete anything.", voice: "prev:meera-delete" },
    { kind: "said", reply: "nitin-open", to: "Nitin" },
    { kind: "bubble", who: "Sameer Bhai", text: "Dilip ko le gaye. Bhasin sir ki gaadi mein, hospital. Tu Vicky ko wapas bula aur so ja.", english: "They've taken Dilip. In Bhasin sir's car, to hospital. Call Vicky back and sleep.", at: "01:52" },
  ],
};

/** "Next on Raakh", after Episodes 1 and 2 (PG-NEXT): nothing in it answers a question. */
export const teasers: Readonly<Record<1 | 2, readonly Shot[]>> = {
  1: [
    { kind: "black", seconds: 1.2 },
    { kind: "voice", who: "", text: "Rolling, bhai?", voice: "prev:rolling" },
    { kind: "image", src: "/found/raakh/bts.jpg", blur: true },
    { kind: "ring", from: "M" },
    { kind: "voice", who: "", text: "Kuch delete mat karna.", english: "Don't delete anything.", voice: "prev:meera-delete" },
    { kind: "card", text: "Episode 2 · The Second Shot" },
  ],
  2: [
    { kind: "sound", text: "[a jerrycan, set down]" },
    { kind: "lock", digits: 4 },
    { kind: "banner", from: "Dilip", text: "" },
    { kind: "sound", text: "[a whisper you can't make out]" },
    { kind: "card", text: "Episode 3 · Return to Origin" },
  ],
};
