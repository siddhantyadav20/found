import type { FeedPost, LiveEvent, Profile, Thread } from "../types";

/* ===========================================================================
   Instagram on Sameer's phone (2026-10-23: it replaced "your phone").

   Photos is what he shot and kept: candids, screenshots, the bin. Instagram
   is what people put out: his polished wedding posts, Nitin with a fever
   the day before, Meera's private account, Kunal's 12:22 story, shared to
   him by DM (RAAKH-V3 E18), and the night spreading in public once the
   player knows what it is. Faces go with names here, and anybody can be
   searched.

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
    followers: "12.4K",
    following: "611",
    posts: [
      // Sunday afternoon, the day after: he posted the wedding as if it had been one.
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
  /* What the public can know before the end (2026-10-28): Kunal's firing on
     the dance floor, which guests filmed, the family denying it, a guest who
     saw waiters vanish, and Raju's poster. Nobody outside knows a boy was
     shot, or who fired: the posts that said so were cut. */



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
    text: "Was at this wedding. The bride's brother was literally firing in the air like it's a film, and the planner's team was filming him for a reel. Then the waiters vanished from the back lawn and nobody would say why 😶",
    shares: [340, 1200, 2900],
    requires: ["ask:q2"],
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
    requires: ["ask:q2"],
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

/* --- Kunal's story, shared to Sameer by DM (RAAKH-V3 E18) ------------------
   12:22 AM on the back lawn, ten minutes before the reel: Kunal with his
   father's revolver by his face. True, and it points away from Sameer. */
const kunalStory: Thread = {
  id: "ig-kunal",
  app: "instagram",
  name: "kunal.sehgal",
  avatar: `${R}/dp-kunal.jpg`,
  sub: "Kunal Sehgal",
  messages: [
    {
      id: "igk-1",
      from: "them",
      at: "00:22",
      day: "Sunday",
      attachment: { kind: "photo", label: "Kunal's story: the back lawn, fairy lights in the mango trees, Kunal holding a revolver up beside his face, grinning", src: `${R}/w-kunal.jpg` },
      text: "Papa ki hai, asli wali 😎🔥",
      english: "It's Dad's. The real one.",
      evidence: "kunal-story",
    },
    { id: "igk-2", from: "owner", at: "00:24", day: "Sunday", text: "😂🔥 reel mein rakhte hain", english: "Let's put it in the reel." },
  ],
};

export const threads: readonly Thread[] = [kunalStory];

/* The feed changes as the night does (each post's `requires`), and says
   nothing about it: the beats are RAAKH-V3 §5's and nobody else's. */
export const events: readonly LiveEvent[] = [];
