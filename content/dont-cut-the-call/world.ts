import type { Courier, Search, Story } from "../types";

/* ===========================================================================
   The three small apps that carry big things: the courier that brought this
   phone here, what she searched for at midnight, and the newspaper that has
   the story wrong.

   The route is the proof. She booked Dadar → your door at 11:52 PM. The bike
   stopped for fourteen minutes in Andheri East, at an address nobody asked
   for, and everything that happened to this phone between 12:36 and 12:39
   happened there (CHAPTER1.md, twist 5).
   =========================================================================== */

export const courier: Courier = {
  bookedAt: "23:52",
  day: "Friday",
  item: "Mobile + power bank + diary + letter",
  from: "Shanti Kunj CHS, Hindu Colony, Dadar East",
  to: "Your building",
  rider: "Imran · ★ 4.8",
  fare: "₹184",
  route: [
    { at: "00:08", place: "Picked up · Dadar East", note: "Handed over by the watchman" },
    {
      at: "00:31",
      place: "Stopped · Andheri East",
      note: "14 minutes. Not on the route.",
      wrong: true,
      evidence: "detour",
      requires: ["ep:2"],
    },
    { at: "00:45", place: "Moving again" },
    { at: "01:08", place: "Delivered · your door" },
  ],
  chat: [
    { from: "rider", text: "Madam pickup ho gaya 👍", english: "Madam, picked up 👍", at: "00:08" },
    {
      from: "rider",
      text: "Madam ek call aaya tha, bola aapka bhai hai, saaman pehle Andheri mein dena hai. Theek hai na?",
      english: "Madam, I got a call, he said he's your brother, the parcel has to go to Andheri first. That's alright?",
      at: "00:24",
      evidence: "brother",
    },
    { from: "rider", text: "Madam?", at: "00:29" },
  ],
};

export const searches: Search[] = [
  { id: "s1", text: "can police arrest on video call india", at: "17:51", day: "Thursday", evidence: "she-searched" },
  { id: "s2", text: "fedex parcel aadhaar scam", at: "17:54", day: "Thursday" },
  { id: "s3", text: "myawaddy lotus park indians rescued", at: "13:22", day: "Friday", evidence: "she-searched-mw" },
  { id: "s4", text: "1930 cyber helpline complaint status", at: "22:16", day: "Friday" },
];

export const article: Story["article"] = {
  kicker: "City Desk · Mumbai · 1:11 AM",
  headline: "Dadar: retired bank manager, 64, found dead below her building",
  body: [
    "The body of Vasundhara Kulkarni, 64, was found at the foot of Shanti Kunj CHS, Hindu Colony, shortly after midnight.",
    "A family member said she had been under “digital arrest” for 31 hours and had lost ₹38 lakh to callers posing as the Crime Branch.",
    "Police said no foul play is suspected.",
  ],
  note: "No other outlet is carrying this yet.",
};
