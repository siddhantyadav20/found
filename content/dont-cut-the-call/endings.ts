import type { Ending, Flag } from "../types";

/* ===========================================================================
   The three endings (CHAPTER1.md E).

   The scam gives two orders: don't cut the call, and don't tell anyone. Each
   ending answers them differently, and none of them is the good one. They
   are fixed in this order, written in the same flat voice, and nothing on
   screen says which one a person should pick (PLAYER-JOURNEY Stage 9).

   Every ending reads the night back through the variables below. What they
   had on the player (the ledger) is the end card's; these are the story's.
   =========================================================================== */

/** Typed 0309 into the locked note, and they used it. */
const PIN: Flag = "did:typed-password";
/** Messaged Shaila, and led them to her. */
const SHAILA: Flag = "did:shaila-told";
/** Found her real note: "CUT THE CALL … Cyber Police at BKC". */
const NOTE: Flag = "saw:real-note";
/** Removed their profile from her phone. */
const APP: Flag = "did:removed-profile";
/** Answered her son, and told him you were the police. */
const NIKHIL: Flag = "did:nikhil-lied";
/** The route the bike took, which clears the player of the transfer. */
const ROUTE: Flag = "saw:detour";

export const endings: readonly [Ending, Ending, Ending] = [
  {
    id: "police",
    row: "Report to police",
    lines: [
      {
        text: "An officer takes the phone, puts it in airplane mode and bags it before she says a word.",
        any: [NOTE, APP],
      },
      {
        text: "\"Achha kiya app hataya.\"",
        english: "\"Good that you removed the app.\"",
        needs: [APP],
      },
      {
        text: "\"Aapko pata tha BKC aana hai?\"",
        english: "\"You knew to come to BKC?\"",
        needs: [NOTE],
        unless: [APP],
      },
      { text: "They question you for nine hours.", any: [NOTE, APP] },
      {
        text: "The duty officer writes a non-cognisable complaint and asks you to come back on Monday. The phone goes in a drawer.",
        unless: [NOTE, APP],
      },
      { at: "2:14 PM", text: "In the drawer, it wipes itself. What's left of the evidence is you.", unless: [NOTE, APP] },
      {
        text: "\"₹1,00,000 aapke haath mein phone ke time pe gaya.\"",
        english: "\"A lakh left her account while the phone was in your hands.\"",
        needs: [PIN],
      },
      { text: "You are a suspect for three weeks. The bike's route clears you.", needs: [PIN, ROUTE] },
      { text: "You are a suspect for three weeks, and then for longer.", needs: [PIN], unless: [ROUTE] },
      {
        at: "Nine days later",
        text: "Skyline Overseas Placements, Andheri East, is raided. A name appears on the charge sheet for the first time: PK Kothari.",
      },
      { text: "The man who carried the Crime Branch ID is arrested." },
      {
        text: "Tanvi Deshmukh is arrested as a mule. \"Bail mil jayegi. Kagaz pe naam sirf usi ka hai.\"",
        english: "She'll get bail. Hers is the only name on paper.",
      },
      { text: "The accidental-death report on Vasundhara Kulkarni becomes a murder case." },
      { text: "Nikhil sends you one message: \"Thank you.\"", unless: [NIKHIL] },
      { text: "Nikhil never writes to you.", needs: [NIKHIL] },
      {
        at: "A month later",
        text: "Eleven Indians are rescued from a compound near Myawaddy. You have heard their names before: they are the co-accused Sahil read out at 1:20 in the morning.",
      },
      { text: "Sahil's name isn't on the list." },
    ],
    last: [
      { at: "Three weeks later", who: "Your phone", text: "Mumbai Police ✔ · Video call" },
      {
        who: "A man in uniform, polite, tired",
        text: "Aapka statement record karna hai. Camera on kijiye.",
        english: "We need to record your statement. Turn your camera on.",
      },
      { text: "It's probably real." },
    ],
    onlyHere: "Who PK Kothari was.",
  },
  {
    id: "bin",
    row: "Throw it away",
    lines: [
      { at: "That afternoon", text: "\"Mumbai Crime Branch\" calls you fourteen times. You block every number." },
      { text: "On the fifteenth call, the caller ID is your own name. You don't answer." },
      { text: "Then nothing, for days." },
      { text: "You're fine. Nobody comes. No arrest team, no knock. They have lost their lever, and you're not worth the risk." },
      { text: "The accidental-death report is closed. Suicide." },
      { text: "City Desk runs a follow-up: \"Digital arrest victim's son urges families to talk.\"" },
      {
        at: "A month later",
        text: "Nikhil's reel: \"Meri Aai ne kisi ko nahi bataya. Please apne parents se baat karo.\"",
        english: "My mother didn't tell anyone. Please talk to your parents.",
        unless: [NIKHIL],
      },
      {
        at: "A month later",
        text: "Nikhil's reel: \"Aai ke phone pe kisi ne police banke mujhse jhooth bola. Kisi pe bharosa mat karo.\"",
        english: "Someone on my mother's phone lied to me that they were the police. Don't trust anyone.",
        needs: [NIKHIL],
      },
      { text: "4.2 million views. The comments say bechari. They say padhi-likhi hoke bhi.", english: "Poor thing. Even though she was educated." },
      {
        at: "Two months later",
        text: "A City Desk brief: \"Shivaji Park woman, 66, loses ₹21 lakh in digital arrest.\"",
        needs: [SHAILA],
      },
      {
        at: "Two months later",
        text: "A City Desk brief: a woman in Andheri East loses her savings to a digital arrest. She was row 7 on the list. She had told Vasu \"ye khud scam hai\", and blocked her.",
        english: "\"This is a scam itself.\"",
        unless: [SHAILA],
      },
    ],
    last: [
      { who: "Family ❤️", text: "Mausi forwarded a reel." },
      { who: "Mausi", text: "Sab log dekho 🙏 Aise mat karna.", english: "Everyone watch 🙏 Don't do this." },
      { who: "You", text: "She wasn't scared. She was the only one who—" },
      { text: "Mausi is typing…" },
    ],
    onlyHere: "What the world believes when nobody speaks.",
  },
  {
    id: "friend",
    row: "Share with a friend",
    lines: [
      // Your friend, in real time, and you can't stop them.
      { who: "friend", text: "Bhai ye AI hai kya.", english: "Is this AI?" },
      { who: "friend", text: "Wait." },
      { who: "friend", text: "WAIT." },
      { who: "friend", text: "Main post kar raha hoon.", english: "I'm posting it." },
      {
        at: "Four hours later",
        text: "\"My friend received a dead woman's phone. She wasn't a victim. She was hunting them.\" 2.3 million views. #VasundharaKulkarni is trending.",
      },
      { text: "City Desk corrects its story. Rukhsana is on a news channel, holding Sahil's wedding photograph." },
      { text: "The ministry responds within 48 hours. The true version wins, and fast." },
      { text: "The screenshots include Sahil's name, and his codes. His number goes silent." },
      {
        at: "Three weeks later",
        text: "Twenty-three Indians are rescued. He isn't among them. One of the boys, in an interview: \"Ek ladka policewala banta tha. Viral hone ke baad unhone usko alag le gaye.\"",
        english: "A boy used to play the policeman. After it went viral, they took him somewhere else.",
      },
      { text: "The screenshots include Tanvi's handle. #ArrestTanvi. Forty thousand comments. Her college suspends her before the police arrive." },
      { text: "PK Kothari is never named. Nothing in the thread says who he is, and the internet has already found its villain." },
      { text: "Reporters camp outside Shaila's building. She is safe, because she's famous.", needs: [SHAILA] },
    ],
    last: [
      { at: "11:52 PM", who: "friend", text: "Bhai. Ek call aaya. Mumbai Crime Branch. Bol rahe hain maine murder ka evidence leak kiya hai.", english: "A call came. Mumbai Crime Branch. They say I leaked murder evidence." },
      { who: "friend", text: "Bol rahe hain call mat kaatna, kisi ko mat batana.", english: "They're saying don't cut the call, don't tell anyone." },
      { who: "friend", text: "Maine tujhe bata diya. Galat kiya?", english: "I told you. Was that wrong?" },
    ],
    reply: [
      { id: "cut", text: "Kaat de.", english: "Cut it.", sets: ["did:told-friend-cut"] },
      { id: "stay", text: "Mat kaat.", english: "Don't.", sets: ["did:told-friend-stay"] },
      { id: "nothing", text: "Send nothing", sets: ["did:told-friend-nothing"] },
    ],
    onlyHere: "What going viral does to the people in the screenshots.",
  },
];
