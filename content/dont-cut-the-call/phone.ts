import type { CallEntry, SettingsGroup, Thread } from "../types";

/* ===========================================================================
   What is on Vasundhara Kulkarni's phone.

   Her life first, because the player has to like her before they can be
   frightened for her: a son who says "call later", 3,412 unread good
   mornings, a society group that cares about the society's name, and a friend
   from the laughter club at Shivaji Park.

   Then the scam, in its own words, sitting in her chats like an appointment.

   Episode 1's share of CHAPTER1.md Part B3 and D. Episodes 2 and 3 add to
   these lists; nothing here is ever rewritten by them.
   =========================================================================== */

export const threads: Thread[] = [
  {
    id: "crime-branch",
    app: "whatsapp",
    name: "Mumbai Crime Branch",
    sub: "+91 62xx xxx 441",
    pinned: true,
    number: "+91 62901 77441",
    messages: [
      {
        id: "cb-1",
        from: "them",
        text: "Madam, aapke naam se ek parcel Mumbai airport pe seize hua hai. Contents: MDMA 140 gm, 5 passports, ek laptop.",
        english: "Madam, a parcel in your name was seized at Mumbai airport. Contents: 140 g MDMA, five passports, a laptop.",
        at: "17:38",
        day: "Thursday",
      },
      {
        id: "cb-2",
        from: "them",
        text: "Aapko digital arrest mein rakha gaya hai. Video call band nahi karni hai. Kisi ko batana nahi hai — parents, bete, kisi ko bhi nahi.",
        english: "You are under digital arrest. The video call must not be ended. Do not tell anyone — not your parents, not your son, nobody.",
        at: "17:44",
        day: "Thursday",
      },
      {
        id: "cb-warrant",
        from: "them",
        at: "23:30",
        day: "Thursday",
        attachment: { kind: "document", label: "ARREST_WARRANT_VK.pdf", meta: "FIR No. 9820457713 · 2 pages" },
        evidence: "warrant",
      },
      {
        id: "cb-3",
        from: "them",
        text: "Verification ke liye RBI account mein funds transfer kijiye. ₹38,00,000. Clearance ke baad wapas aa jayega.",
        english: "Transfer funds to the RBI verification account: ₹38,00,000. It comes back after clearance.",
        at: "09:12",
        day: "Friday",
      },
      {
        id: "cb-4",
        from: "her",
        text: "Haan sir.",
        english: "Yes sir.",
        at: "09:14",
        day: "Friday",
      },
      {
        id: "cb-5",
        from: "her",
        text: "Beta, PIN bhool gayi. Bank jaake karna padega. FD todne mein do din lagte hain.",
        english: "Son, I've forgotten the PIN. I'll have to do it at the bank. Breaking an FD takes two days.",
        at: "09:31",
        day: "Friday",
        evidence: "stalling",
      },
      {
        id: "cb-6",
        from: "them",
        text: "Do din nahi hain, madam.",
        english: "You don't have two days, madam.",
        at: "09:33",
        day: "Friday",
      },
    ],
  },
  {
    id: "nikhil",
    app: "whatsapp",
    name: "Nikhil ❤️",
    pinned: true,
    messages: [
      { id: "n-1", from: "her", text: "Jevlas ka?", english: "Have you eaten?", at: "18:02", day: "Thursday" },
      { id: "n-2", from: "them", text: "Aai, call later. Meeting 🙏", at: "18:02", day: "Thursday" },
      { id: "n-3", from: "her", text: "Ho. Nantar bol.", english: "Alright. Talk later.", at: "18:04", day: "Thursday" },
      {
        id: "n-4",
        from: "her",
        text: "Nikhil, ek gosht vicharaychi hoti. Important aahe.",
        english: "Nikhil, I wanted to ask you something. It's important.",
        at: "23:58",
        day: "Friday",
        evidence: "last-call-son",
      },
      { id: "n-5", from: "system", text: "Missed voice call · 11:58 PM", at: "23:58", day: "Friday" },
    ],
  },
  {
    id: "society",
    app: "whatsapp",
    name: "Shanti Kunj CHS",
    group: true,
    sub: "41 members",
    messages: [
      {
        id: "s-1",
        from: "them",
        text: "Watchman: Crime Branch se sir aaye hai Kulkarni madam ke liye. ID dikhaya hai. Upar bhej diya.",
        english: "Watchman: An officer from Crime Branch has come for Mrs Kulkarni. He showed ID. I sent him up.",
        at: "00:21",
        day: "Saturday",
        evidence: "watchman",
      },
      { id: "s-2", from: "them", text: "Kaun sir? Itni raat ko?", english: "Which officer? At this hour?", at: "00:23", day: "Saturday" },
      { id: "s-3", from: "them", text: "Ambulance aayi hai. Kya hua??", english: "An ambulance has come. What happened??", at: "00:58", day: "Saturday" },
      {
        id: "s-4",
        from: "them",
        text: "Secretary: Please koi kuch forward mat karo. Society ka naam kharab hota hai. Family ko hum inform kar rahe hain.",
        english: "Secretary: Please don't forward anything. It gives the society a bad name. We are informing the family.",
        at: "01:04",
        day: "Saturday",
        evidence: "secretary",
      },
    ],
  },
  {
    id: "shaila",
    app: "whatsapp",
    name: "Shaila (laughter club)",
    messages: [
      { id: "sh-1", from: "them", text: "Vasu, kal yeshil na? Park madhe 6:15.", english: "Vasu, coming tomorrow? 6:15 at the park.", at: "20:40", day: "Thursday" },
      { id: "sh-2", from: "her", text: "Baghu. Thoda kaam aahe.", english: "We'll see. I have some work.", at: "21:02", day: "Thursday" },
      {
        id: "sh-3",
        from: "her",
        at: "23:48",
        day: "Friday",
        attachment: { kind: "voice", seconds: 40, transcript: "Shaila, ghabrana mat. Jar mala kahi zala, tar he police la de. Nikhil la nako — to ghabrel.", english: "Shaila, don't panic. If anything happens to me, give this to the police. Not to Nikhil — he'll panic." },
        evidence: "her-voice",
      },
      { id: "sh-4", from: "her", text: "", at: "23:48", day: "Friday", deleted: true, evidence: "deleted-photo" },
    ],
  },
  {
    /* The number she decoded out of his "FIR number". She rang it on Friday
       afternoon, and a woman in Kurla answered who has not heard her son's
       voice since March. */
    id: "rukhsana",
    app: "whatsapp",
    name: "+91 98204 57713",
    sub: "Unsaved number",
    messages: [
      {
        id: "r-1",
        from: "her",
        text: "Namaste. Main Vasundhara Kulkarni. Aapka number ek ajeeb tareeke se mila hai. Kya aapka koi beta hai jo bahar gaya hai kaam ke liye?",
        english: "Hello. I'm Vasundhara Kulkarni. I got your number in a strange way. Do you have a son who went abroad for work?",
        at: "13:10",
        day: "Friday",
        evidence: "rukhsana",
      },
      {
        id: "r-2",
        from: "them",
        at: "13:26",
        day: "Friday",
        attachment: {
          kind: "voice",
          seconds: 31,
          transcript: "Haan madam. Sahil. Mera beta. Instagram pe ad tha — Thailand, data entry, assi hazaar mahina. Kothari saab ne dedh lakh liya, Andheri East mein office hai unka. Maine apne kangan girvi rakhe the.",
          english: "Yes madam. Sahil. My son. There was an ad on Instagram — Thailand, data entry, eighty thousand a month. Kothari sahib took one and a half lakh, his office is in Andheri East. I pawned my bangles.",
        },
        evidence: "rukhsana-voice",
      },
      {
        id: "r-3",
        from: "them",
        at: "13:29",
        day: "Friday",
        attachment: { kind: "voice", seconds: 18, transcript: "March se awaaz nahi aayi madam. Sirf paise maangne ke message aate hain, aur woh uski likhaai nahi hai.", english: "No voice since March, madam. Only messages asking for money, and they aren't the way he writes." },
      },
      {
        id: "r-4",
        from: "them",
        at: "13:31",
        day: "Friday",
        attachment: { kind: "photo", label: "Sahil, at his cousin's wedding" },
        evidence: "sahil-photo",
      },
      {
        id: "r-5",
        from: "her",
        text: "Main dekhungi kya kar sakti hoon. Aap uska number mat badalna.",
        english: "I'll see what I can do. Don't change his number.",
        at: "13:44",
        day: "Friday",
      },
    ],
  },
  {
    id: "parivar",
    app: "whatsapp",
    name: "Kulkarni Parivar",
    group: true,
    sub: "3,412 unread",
    messages: [
      { id: "p-1", from: "them", text: "🌸 Good Morning 🌸 Have a blessed day 🙏", at: "06:11", day: "Friday" },
      { id: "p-2", from: "them", text: "Forwarded many times: Do not pick up calls from +92 numbers!!", at: "07:40", day: "Friday", forwarded: true },
      { id: "p-3", from: "them", text: "Vasu atya, happy anniversary to you and Madhav kaka in heaven 🙏❤️", at: "09:02", day: "Friday" },
    ],
  },
];

export const calls: CallEntry[] = [
  { id: "c-cb", name: "Mumbai Crime Branch", kind: "in", at: "17:38", day: "Thursday", seconds: 113_587, number: "+91 62901 77441" },
  { id: "c-1930", name: "1930", kind: "out", at: "21:48", day: "Friday", seconds: 1_440, evidence: "helpline" },
  { id: "c-dsouza", name: "C. D'Souza", kind: "out", at: "22:19", day: "Friday", seconds: 96, number: "+91 98204 11902" },
  { id: "c-unknown-1", name: "+91 90040 23117", kind: "out", at: "22:02", day: "Friday", seconds: 0 },
  { id: "c-unknown-2", name: "+91 99873 40021", kind: "out", at: "22:31", day: "Friday", seconds: 12 },
  { id: "c-nikhil", name: "Nikhil ❤️", kind: "out", at: "23:58", day: "Friday", seconds: 0, evidence: "last-call-son" },
];

export const settings: SettingsGroup[] = [
  {
    rows: [
      {
        title: "Vasundhara Kulkarni",
        sub: "Apple Account, iCloud and more",
        value: "2 devices",
        evidence: "apple-account",
      },
    ],
  },
  {
    label: "Security",
    rows: [
      { title: "Face ID & Passcode", value: "Off", sub: "Turned off Thursday, 8:10 PM", evidence: "passcode-off" },
      { title: "Screen Time", value: "Off" },
      { title: "Emergency SOS", value: "On" },
    ],
    footer: "Turning the passcode off also turned off Face ID for this iPhone.",
  },
  {
    label: "General",
    rows: [
      { title: "Software Update", value: "iOS 26.2" },
      {
        title: "VPN & Device Management",
        value: "1 profile",
        sub: "RBI Secure KYC · installed Thursday, 8:14 PM",
        evidence: "profile",
      },
      { title: "AirDrop", value: "Contacts Only" },
    ],
  },
  {
    label: "Display & Text",
    rows: [
      { title: "Text Size", value: "Largest" },
      { title: "Bold Text", value: "On" },
    ],
  },
  {
    label: "Battery",
    rows: [{ title: "Battery Percentage", value: "On" }, { title: "Low Power Mode", value: "Off" }],
  },
];
