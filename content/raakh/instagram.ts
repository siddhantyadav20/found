import type { FeedPost, LiveEvent, Message, Profile, Thread } from "../types";

/* ===========================================================================
   Instagram on Sameer's phone (2026-10-23: it replaced "your phone").

   Photos is what he shot and kept: candids, screenshots, the bin. Instagram
   is what people put out: his polished wedding posts, Kunal showing off a
   revolver for the reel, Nitin with a fever the day before, Meera's private
   account, and the night spreading in public once the player knows what it
   is. Faces go with names here, and anybody can be searched.

   The public chatter is the old Pulse feed, moved: none of it comes before
   the player has found its thread on the phone, so it never answers Episode
   1's questions for them, and most of it is the wrong story, told with
   confidence.
   =========================================================================== */

const R = "/found/raakh";

export const profiles: readonly Profile[] = [
  {
    handle: "sk.weddings",
    name: "Sameer Khurrana",
    own: true,
    avatar: `${R}/dp-sameer.jpg`,
    bio: "SK Weddings · Delhi weddings, planned like films ✨\nPlanner & producer · Chhattarpur to Udaipur\nDelhi → Mumbai, soon 🌊",
    followers: "12.4k",
    following: "611",
    posts: [
      // Sunday afternoon, the day after: he posted the wedding as if it had been one.
      /* The reel's first frame, posted from the back lawn at 12:22 AM and
         archived at 9:31 on Sunday morning: public for nine hours (Ritika
         saw it), gone from his grid, still in his Archive, where only he can
         see it. True, and it points away from him: the wrong story, for the
         right reasons (script §23). */
      {
        id: "k-pose",
        archived: "Archived Sunday 9:31 AM",
        when: "Saturday 22 Nov, 12:22 AM",
        src: `${R}/w-kunal.jpg`,
        title: "Back lawn, fairy lights in the mango trees: Kunal holds a revolver up beside his face, grinning",
        caption: "BTS for the Sehgal reel 🎬 @kunal.sehgal going full Animal 😂🔫",
        place: "Banyan Farms · Chhattarpur",
        likes: 388,
        comments: [
          { who: "kunal.sehgal", text: "Papa ki hai, asli wali 😎🔥", english: "It's Papa's, the real one." },
          { who: "ishita.sehgal", text: "Kunal PLEASE papa ko pata chala na", english: "Kunal PLEASE, if Papa finds out…" },
        ],
        evidence: "kunal-pose",
      },
      { id: "i-couple", when: "6 days ago", src: `${R}/w-couple.jpg`, title: "Ishita and Rohan under fairy lights", caption: "Ishita 🤍 Rohan. Banyan Farms, Chhattarpur. Planned by us, lit by the mango trees. #SKWeddings #SehgalShaadi", likes: 1840 },
      { id: "i-family", when: "6 days ago", src: `${R}/w-family.jpg`, title: "The Sehgals on the stage: Bhasin Sehgal on the left, the couple, Kunal at the end", caption: "Sehgal parivar 🙏 Thank you Bhasin uncle for trusting us with Ishita's big day. @kunal.sehgal bhai, you're next 😄", likes: 1213 },
      { id: "i-pheras", when: "6 days ago", src: `${R}/w-pheras.jpg`, title: "Pheras at night, the fire in the middle", caption: "Pheras at 1:20 AM. Worth every minute. 🔥", likes: 2106 },
      { id: "i-baraat", when: "6 days ago", src: `${R}/w-baraat.jpg`, title: "The baraat at the gate, dhol and marigolds", caption: "Baraat aa gayi 🥁🥁", likes: 977 },
      { id: "i-selfie", when: "2 weeks ago", src: `${R}/ig-selfie.jpg`, title: "A selfie, camera up, a silver kada on his right wrist", caption: "New gimbal day 🎥 (and yes, the kada stays on)", likes: 642 },
      { id: "i-crew", when: "3 weeks ago", src: `${R}/ig-crew.jpg`, title: "Sameer with his crew, arms round Nitin and a boy in a maroon waistcoat", caption: "The team that makes it happen 🤍 @nitin.edits on the edit, Dilip on the lights. Mumbai, we're coming.", likes: 731 },
      { id: "i-nitin", when: "4 weeks ago", src: `${R}/w-13.jpg`, title: "Nitin on B cam, gimbal up, grinning at the lens", caption: "Throwback: @nitin.edits on B cam at the Kapoor sangeet. Best editor in Delhi, worst dancer.", likes: 508 },
      { id: "i-haldi", when: "5 weeks ago", src: `${R}/ig-haldi.jpg`, title: "A haldi, yellow everywhere", caption: "Haldi, but make it cinema 💛", likes: 1490 },
      { id: "i-mirror", when: "6 weeks ago", src: `${R}/ig-mirror.jpg`, title: "A bride at her mirror", caption: "The last five minutes before.", likes: 2233 },
      { id: "i-drone", when: "2 months ago", src: `${R}/ig-drone.jpg`, title: "A farmhouse venue from above", caption: "Site recce, Chhattarpur. When the venue says yes to the drone 🙌", likes: 865 },
    ],
    evidence: "sk-films",
  },
  {
    handle: "kunal.sehgal",
    name: "Kunal Sehgal",
    avatar: `${R}/dp-kunal.jpg`,
    bio: "Ishita ka chhota bhai 😎\nSehgal Enterprises · cricket, cars, chaos",
    followers: "3,902",
    following: "1,118",
    posts: [
      { id: "k-gang", when: "1 week ago", src: `${R}/w-12.jpg`, title: "Kunal and his friends on the dance floor, a bottle passed along", caption: "Didi ki shaadi, bhai log ready 🥂", likes: 512 },
      { id: "k-varmala", when: "1 week ago", src: `${R}/w-5.jpg`, title: "The varmala: Ishita lifted by her brothers", caption: "Jeeju ko jeetne nahi diya 😂🏆", likes: 644 },
    ],
  },
  {
    handle: "ishita.sehgal",
    name: "Ishita Sehgal Malhotra",
    avatar: `${R}/dp-ishita.jpg`,
    bio: "Mrs Malhotra since 22.11 🤍\nDelhi · Gurgaon",
    followers: "2,240",
    following: "690",
    posts: [
      { id: "is-mehendi", when: "1 week ago", src: `${R}/w-1.jpg`, title: "Ishita's hands, mehendi, the groom's name hidden in it", caption: "Find his name 👀 #mehendi 📸 @sk.weddings", likes: 1022 },
      { id: "is-varmala", when: "1 week ago", src: `${R}/w-5.jpg`, title: "The varmala: Ishita lifted by her brothers", caption: "Bhaiyon ne jeetne nahi diya 😂 @kunal.sehgal", likes: 1388 },
    ],
  },
  {
    handle: "nitin.edits",
    name: "Nitin Kumar",
    avatar: `${R}/dp-nitin.jpg`,
    bio: "Editor @sk.weddings 🎬 cuts that hit the beat\nLaxmi Nagar, Delhi",
    followers: "1,486",
    following: "402",
    posts: [
      /* The day before the wedding, from his bed: he wasn't there, and Dilip
         was on the light in his place. */
      {
        id: "n-fever",
        when: "1 week ago",
        card: "#2b3a55",
        title: "A thermometer reading 102.4°F, on a quilt",
        caption: "102.4° 🤒 Sehgal shaadi miss ho rahi hai. Dilip, light sambhaal lena bhai 🙏 Edit toh main hi karunga 😤",
        english: "102.4°. Missing the Sehgal wedding. Dilip, handle the light, bro. I'm still doing the edit.",
        likes: 96,
      },
      { id: "n-reel", when: "3 weeks ago", src: `${R}/ig-crew.jpg`, title: "The SK Weddings crew", caption: "Team photo but I'm the only one who knows where the files are 🫡", likes: 210 },
    ],
  },
  {
    handle: "meera.arora",
    name: "Meera Arora",
    avatar: `${R}/dp-meera.jpg`,
    bio: "Advocate · Saket District Courts\nKalkaji · chai > coffee",
    followers: "1,102",
    following: "388",
    private: true,
    postCount: 214,
    posts: [],
  },
];

/** Fine print for the feed's own accounts: a face is an avatar, and anything else is its initial. */
export const feed: readonly FeedPost[] = [
  /* --- the night, in public, once the player knows its thread ----------- */
  {
    id: "f-family",
    who: "Dilli Dhamaka",
    handle: "dilli.dhamaka",
    when: "12m",
    card: "#7a1f1f",
    text: "Sehgal parivar ke kareebi sources: “Goli wedding planner ne chalayi thi. Parivar ka koi lena dena nahi.”",
    english: "Sources close to the Sehgal family: “The wedding planner fired. The family has nothing to do with it.”",
    shares: [0, 0, 9700],
    requires: ["ask:q11"],
  },
  {
    id: "f-ritika-2",
    who: "Ritika",
    handle: "ritika.kapoor_",
    when: "40m",
    card: "#2d2340",
    text: "Ok so now they're blaming the wedding planner?? Someone who was actually there needs to say what happened.",
    shares: [0, 0, 1800],
    requires: ["ask:q11"],
  },
  {
    id: "f-proof",
    who: "Justice for Dilip",
    handle: "justice4dilip",
    when: "1h",
    card: "#111111",
    text: "Kisi ke paas proof hai toh daalo. Chup rehna bhi gunah hai. #JusticeForDilip",
    english: "If anyone has proof, post it. Staying quiet is a crime too.",
    shares: [0, 4300, 19800],
    requires: ["ep:2"],
  },
  {
    id: "f-lawyers",
    who: "Dilli Dhamaka",
    handle: "dilli.dhamaka",
    when: "3h",
    card: "#7a1f1f",
    text: "UPDATE: Sehgal parivar ke vakeel: “Koi incident nahi hua. Fake news phailane walon pe case hoga.”",
    english: "UPDATE: The Sehgal family's lawyers: “Nothing happened. Anyone spreading fake news will be sued.”",
    shares: [0, 6100, 14200],
    requires: ["ep:2"],
  },
  {
    id: "f-rumour",
    who: "sach ka saath",
    handle: "sach.ka.saath",
    when: "Thursday",
    card: "#1d1d1d",
    text: "Waiter ko Kunal Sehgal ne goli maari. Paisa hai toh sab maaf? #JusticeForDilip",
    english: "Kunal Sehgal shot the waiter. If you've got money, all's forgiven?",
    shares: [1200, 8400, 31000],
    requires: ["did:heard-him"],
  },
  {
    id: "f-poster",
    who: "Samastipur Samachar",
    handle: "samastipur.samachar",
    when: "Wednesday",
    src: `${R}/poster-dilip.jpg`,
    text: "LAPATA: Dilip Kumar Mahto, 19, Samastipur ka ladka. Delhi mein kaam pe gaya tha. Share karein 🙏",
    english: "MISSING: Dilip Kumar Mahto, 19, a Samastipur boy. Went to Delhi for work. Please share.",
    media: "The LAPATA poster",
    shares: [5100, 12600, 30400],
    /* (game) 2026-10-24, planted where nobody looks: a nurse who thinks she's
       seen him, and nobody answering her. */
    comments: [
      { who: "lissy.anita", text: "Isko kahin dekha hai shayad… 🙏", english: "I think I've seen him somewhere…" },
      { who: "samastipur.samachar", text: "@lissy.anita kahan? DM karein", english: "@lissy.anita where? Please DM us" },
    ],
    // Raju's poster, passed on: once the player has seen it in his chat.
    requires: ["saw:poster"],
  },
  {
    id: "f-ritika",
    who: "Ritika",
    handle: "ritika.kapoor_",
    when: "Wednesday",
    card: "#1f2b3a",
    text: "Was at this wedding. The bride's brother was literally firing in the air like it's a film, the planner even posted him with the gun. Then the waiters vanished from the back lawn and nobody would say why 😶",
    shares: [340, 1200, 2900],
    requires: ["did:heard-him"],
  },
  {
    id: "f-video",
    who: "Dilli Dhamaka",
    handle: "dilli.dhamaka",
    when: "Tuesday",
    src: `${R}/w-12.jpg`,
    text: "Chhattarpur farmhouse ki shaadi, aur dance floor pe khule aam firing 🔫 Police kahan hai? #ChhattarpurFiring",
    english: "A Chhattarpur farmhouse wedding, and open firing on the dance floor. Where are the police?",
    media: "Video: a dance floor at night, phones in the air",
    shares: [2400, 9100, 23800],
    requires: ["did:heard-him"],
  },

  /* --- an ordinary Saturday night's feed, from everywhere -------------------- */
  { id: "x-sea", who: "Mumbai Diaries", handle: "mumbai.diaries", when: "2h", src: "/found/lastlocal/wallpaper.jpg", text: "Sea Link at 1 AM hits different 🌉", shares: [8800, 8900, 9000] },
  { id: "x-aqi", who: "Delhi Weather Watch", handle: "delhi.weatherwatch", when: "5h", card: "#5b4a2f", text: "AQI 412 aaj raat. Khidkiyan band, bachche andar. 😷 #DelhiAQI", english: "AQI 412 tonight. Windows shut, kids inside.", shares: [860, 1100, 1300] },
  { id: "x-marine", who: "Bombay Bylanes", handle: "bombay.bylanes", when: "6h", src: "/found/lastlocal/sea.jpg", text: "Marine Drive, Friday night. Same sea, new problems.", shares: [4100, 4200, 4300] },
  { id: "x-lehenga", who: "Priya", handle: "priya.in.delhi", when: "8h", card: "#5a1f3d", text: "Third shaadi this month and I've repeated a lehenga twice. No regrets. #ShaadiSeason", shares: [45, 52, 60] },
  { id: "x-ladakh", who: "Wander India", handle: "wander.india", when: "9h", src: `${R}/x-ladakh.jpg`, text: "Pangong at noon. No filter, we promise. 🏔️", shares: [12900, 13000, 13100] },
  { id: "x-biryani", who: "Hyderabad Food Diaries", handle: "hyd.food.diaries", when: "11h", src: `${R}/x-biryani.jpg`, text: "Sunday ka plan: dum, raita, and a nap. 🍚", shares: [5300, 5400, 5600] },
  { id: "x-goa", who: "Goa Days", handle: "goa.days", when: "14h", src: `${R}/x-goa.jpg`, text: "Morjim, 6:12 PM. The dog had the right idea.", shares: [9100, 9200, 9300] },
  { id: "x-meme", who: "Desi Memes Daily", handle: "desimemes.daily", when: "1d", card: "#3b2a6b", text: "Rishtedaar at every shaadi: “Beta, tumhari kab hai?”\nMe, who came for the paneer: 🧍", shares: [41000, 41200, 41500] },
  { id: "x-chai", who: "Purani Dilli", handle: "puranidilli", when: "1d", src: `${R}/x-chai.jpg`, text: "6 AM, Chandni Chowk. The city's first chai, before the city.", shares: [7600, 7700, 7800] },
  { id: "x-cricket", who: "Bombay Bylanes", handle: "bombay.bylanes", when: "1d", src: `${R}/x-cricket.jpg`, text: "One tip one hand. Ek tappa out. House rules are law. 🏏", shares: [15400, 15500, 15600] },
  { id: "x-dadar", who: "Mumbai Diaries", handle: "mumbai.diaries", when: "2d", src: "/found/lastlocal/dadar.jpg", text: "Dadar, platform 4, 12:41 AM. The city never really sleeps.", shares: [6200, 6300, 6400] },
  { id: "x-rain", who: "Bangalore Rains", handle: "blr.rains", when: "2d", src: `${R}/x-rain.jpg`, text: "Filter coffee, a paperback, and nowhere to be. 🌧️", shares: [6800, 6900, 7000] },
  { id: "x-quote", who: "Small Things", handle: "smallthings.co", when: "2d", card: "#20453b", text: "You don't rise to the level of your goals. You fall to the level of your excuses.", shares: [22000, 22100, 22200] },
];

/* --- Meera, once she's rung and unblocked him (episode2.ts) ------------------
   She said she'd write to his phone, and she does, in the chat he pinned for
   her: one tick turns to two. What she knows about him is what a player
   without her can't easily get; once the lie is traced she takes back what
   she said about him. */
const meera: readonly Message[] = [
  { id: "me-0", from: "them", at: "00:46", with: "meera-call", requires: ["did:meera-called"], text: "Unblock kar diya. Ye main hoon. Meera.", english: "I've unblocked him. This is me. Meera." },
  {
    id: "me-5",
    from: "them",
    at: "01:20",
    with: "meera-reads",
    requires: ["fired:meera-reads"],
    text: "Ek baat. Sameer jo nahi dekhna chahta, lock kar deta hai. Aur password hamesha apna birthday rakhta hai. Har jagah. Bewakoof.",
    english: "One thing. What Sameer doesn't want to look at, he locks. And his password is always his birthday. Everywhere. Idiot.",
  },
  {
    id: "me-air",
    from: "them",
    at: "02:12",
    with: "meera-airplane",
    requires: ["fired:meera-airplane"],
    text: "Bhasin uncle ko location dikh rahi hai? Toh phone airplane mode pe daalo. Abhi. Uske baad mera message bhi nahi aayega, theek hai.",
    english: "Bhasin uncle can see the location? Then put the phone on airplane mode. Now. My messages won't come through after that either, that's fine.",
  },
  { id: "me-7", from: "them", at: "02:20", with: "meera-takes-back", requires: ["fired:meera-takes-back"], text: "Maine kaha tha woh jhooth nahi bolta.", english: "I said he doesn't lie." },
  { id: "me-8", from: "them", at: "02:20", with: "meera-takes-back", requires: ["fired:meera-takes-back"], typing: 5, text: "Maine galat kaha tha.", english: "I was wrong." },
];

export const threads: readonly Thread[] = [{ id: "m", app: "whatsapp", name: "M", messages: meera }];

/* The phone speaks rarely, and only when it matters: Meera, once she knows,
   and the night going public on Instagram once the player knows what it is.
   News that didn't get through in its own episode lapses rather than
   arrives stale. */
export const events: readonly LiveEvent[] = [
  { id: "meera-reads", device: "owner", after: ["did:knows-meera"], unless: ["did:airplane"], delay: 30, app: "whatsapp", banner: "M · Ek baat. Sameer jo nahi dekhna chahta, lock kar deta hai.", sets: ["did:meera-preserved"] },
  { id: "meera-airplane", device: "owner", after: ["did:knows-meera", "fired:bhasin-rings"], unless: ["did:airplane"], delay: 8, app: "whatsapp", banner: "M · Phone airplane mode pe daalo. Abhi." },
  // Once the lie is traced, she takes back what she said about him, however she said it.
  { id: "meera-takes-back", device: "owner", after: ["did:knows-meera", "link:lie"], unless: ["did:airplane"], delay: 6, app: "whatsapp", banner: "M · Maine kaha tha woh jhooth nahi bolta." },
  { id: "ig-trend", device: "owner", after: ["did:heard-him"], unless: ["ep:2", "did:airplane"], delay: 25, app: "instagram", banner: "Instagram · dilli.dhamaka: Chhattarpur farmhouse ki shaadi, aur dance floor pe khule aam firing 🔫" },
  { id: "ig-rumour", device: "owner", after: ["ask:q5"], unless: ["ep:3", "did:airplane"], delay: 30, app: "instagram", banner: "Instagram · sach.ka.saath: “Waiter ko Kunal Sehgal ne goli maari.”" },
  { id: "ig-family", device: "owner", after: ["ask:q11"], unless: ["did:airplane"], delay: 30, app: "instagram", banner: "Instagram · dilli.dhamaka: “Goli wedding planner ne chalayi thi.”" },
  // Bhasin's man at the player's own gate, a little after Bhasin says he knows where it is (T12; the call is in episode3.ts).
  { id: "guard-rings", device: "yours", after: ["fired:bhasin-near"], delay: 45, app: "yours:phone" },
];
