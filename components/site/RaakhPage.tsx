import Image from "next/image";
import Link from "next/link";

import { CASES } from "@/content/cases";
import ChapterStatus from "./ChapterStatus";
import Faq from "./Faq";
import MoreChapters from "./MoreChapters";
import Motion from "./Motion";
import Night from "./Night";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import Table from "./Table";
import { siteFonts } from "./fonts";
import night from "./Night.module.css";
import s from "./Site.module.css";
import styles from "./RaakhPage.module.css";

/* ===========================================================================
   Chapter 1's own page, /chapters/raakh (2026-10-25). It was the front
   page for a day (2026-10-24); the front page is Found's again, and this is
   where its Chapter 1 section leads.

   Raakh's own night, laid out down a page, in the site's look (the
   revamp, 2026-10-25): its name across the dark like a film's title, and
   your table in front of it with what came in the parcel, his phone face
   up and still being rung. Then the night, hour by hour, beside his phone,
   which is the game's own and works. Then the wedding as his camera roll
   kept it, the people who keep ringing him, what comes after, and seven in
   the morning, coming up ember and gold.

   Server-rendered. The client parts are the table, the night's phone (its
   code arrives as the section nears), the pointer, and what only this
   browser knows.
   =========================================================================== */

const raakh = CASES.raakh;
const R = "/found/raakh";

/** The beats of the night, each beside his phone at that minute. */
const BEATS = [
  {
    id: "home",
    at: "11:41 PM",
    day: "Saturday",
    title: "He switched the passcode off himself.",
    text: "Every app on his phone opens, and every one is keeping something: WhatsApp, Photos, Instagram, Notes, Mail, his bank. Read it the way you'd read anyone's phone. Nosily.",
    try: "Tap WhatsApp, Photos or the case file",
  },
  {
    id: "voice",
    at: "11:46 PM",
    day: "Saturday",
    title: "He kept talking to someone who'd stopped answering.",
    text: "Four voice notes to M, in his own voice, sent and never heard. English sits under every Hinglish line, so nothing depends on knowing the language.",
    try: "Press play, with the sound on",
  },
  {
    id: "call",
    at: "11:47 PM",
    day: "Saturday",
    title: "The night keeps happening while you read.",
    text: "Messages land while you dig. A stranger rings the phone in your hand, asking for his brother, and what you say back is what he hears.",
    try: "Answer him",
  },
  {
    id: "photos",
    at: "12:58 AM",
    day: "Sunday",
    title: "What he didn't want seen, he hid well.",
    text: "A camera roll from the wedding, and what he deleted from it. Chats behind a secret code. A note only his birthday opens. Nothing is handed to you.",
    try: "Open a photo, then find what's missing",
  },
  {
    id: "file",
    at: "1:52 AM",
    day: "Sunday",
    title: "Say it. Then prove it.",
    text: "The case file asks one question at a time. Finish the sentence, then put down what on his phone shows it. Get a word wrong and it tells you which, and where the right one is.",
    try: "Try the first question",
  },
  {
    id: "seven",
    at: "6:52 AM",
    day: "Sunday",
    title: "Before seven, you decide.",
    text: "Two calls, against a clock. Then what happens to everything you proved: the lawyer, the internet, or back in the parcel. Every ending is one somebody earned.",
  },
] as const;

/** His camera roll from the wedding, before anything went wrong. */
const ROLL = [
  { src: "w-0.jpg", n: "0007", w: 720, h: 480 },
  { src: "w-4.jpg", n: "0212", w: 612, h: 760 },
  { src: "w-3.jpg", n: "0236", w: 612, h: 760 },
  { src: "w-baraat.jpg", n: "0241", w: 720, h: 480 },
  { src: "w-5.jpg", n: "0388", w: 612, h: 760 },
  { src: "w-12.jpg", n: "0517", w: 547, h: 680 },
  { src: "w-11.jpg", n: "0602", w: 612, h: 760 },
  { src: "w-9.jpg", n: "0655", w: 612, h: 760 },
  { src: "w-pheras.jpg", n: "1140", w: 680, h: 547 },
  { src: "w-8.jpg", n: "1152", w: 453, h: 680 },
  { src: "w-couple.jpg", n: "1201", w: 547, h: 680 },
];

/** Who keeps ringing him, as his phone has them saved. */
const PEOPLE = [
  { name: "M", photo: "dp-meera.jpg", who: "Meera Arora, a lawyer, and his ex. The parcel was meant for her.", line: "last seen a long time ago" },
  { name: "Mummy", who: "His mother. Asks if he's eaten, and what he's decided about the rent.", line: "Beta, phone kyun nahi utha raha?" },
  { name: "Kunal", photo: "dp-kunal.jpg", who: "His friend, and the bride's brother.", line: "Video · 0:14" },
  { name: "Bhasin Uncle", photo: "dp-bhasin.jpg", who: "Kunal and the bride's father, retired from the police. He paid for the wedding.", line: "Jiske paas bhi ye phone hai, wapas kar do." },
  { name: "Dilip", photo: "dp-dilip.jpg", who: "Worked the lights at the wedding. Nobody has seen him in seven days.", line: "Bhaiya, light yahan theek hai?" },
  { name: "+91 62••• •4417", photo: "dp-raju.jpg", who: "Not saved. The 47 missed calls are his, and he rings again within a minute.", line: "Dilip kahan hai?" },
];

const FAQ = [
  ["What's in it?", "A shooting at a wedding, a missing young man and a fire. None of it is shown; all of it is talked about. It's for anyone 16 and over."],
  ["Is it free?", "Yes. Raakh is free in your browser. No download, no sign-up, no ads."],
  ["How long is a chapter?", "Most people take 45 minutes to an hour, in three episodes. Your place is kept between them."],
  ["Phone or laptop?", "Either. It's made for a phone in one hand, at night, with the sound on. On a laptop the case file sits beside the phone."],
  ["What if I get stuck?", "Play “With help”: the case file says where to look, and every question has three hints, the last one the answer. Nothing counts how often you used them."],
  ["Is any of it real?", "No. Every person, company and number is invented, and the game never asks you for anything real. The cities are real; the crimes aren't."],
] as const;

const NAV = [
  ["#night", "The night"],
  ["#people", "His contacts"],
  ["#faq", "Before you open it"],
] as const;

export default function RaakhPage() {
  return (
    <div className={`${s.site} ${siteFonts}`}>
      <Motion />
      <SiteNav
        crumb={
          <>
            <Link href="/#chapters">Chapters</Link> / <b>01 · Raakh</b>
          </>
        }
        links={NAV}
        cta={{ href: raakh.href, label: "Open the parcel" }}
      />

      <main id="main">
        {/* --- the table, under its title --------------------------------- */}
        <section className={styles.hero} data-tilt>
          <p className={styles.word} aria-hidden="true">
            {raakh.title}
          </p>
          <div className={styles.heroHead}>
            <p className={styles.kicker}>
              <span className={styles.ch}>Chapter 01</span>
              <span className={s.tag}>Delhi</span>
              <span className={s.tag}>22 November</span>
              <span className={s.tag}>16+</span>
            </p>
            <h1 className={styles.h1}>
              <span>It&apos;s 11:40 PM.</span> <span>It isn&apos;t <em>your</em> phone.</span>
            </h1>
          </div>
          <div className={styles.heroTable}>
            <Table />
          </div>
          <div className={styles.heroBody}>
            <p className={styles.lede}>
              A parcel came back to your door. Inside, a wedding planner&apos;s phone and a note meant for someone else. Read his chats, play his voice
              notes, open what he deleted, and work out what happened to the boy who worked the lights.
            </p>
            <div className={styles.heroCta}>
              <ChapterStatus id="raakh" cta="Open the parcel" primary />
              <p className={styles.heroMeta}>
                3 episodes · 45–60 min
                <br />
                Free in your browser · sound on
              </p>
            </div>
          </div>
        </section>

        {/* --- the night ------------------------------------------------- */}
        <section className={styles.nightSection} id="night" aria-labelledby="night-title">
          <header className={`${s.wrap} ${s.head}`}>
            <p className={s.eyebrow}>Saturday 11:40 PM → Sunday 7:00 AM</p>
            <h2 id="night-title" className={s.h2}>
              One night, on his phone. <span>Everything below is the game itself. Touch it.</span>
            </h2>
          </header>
          <Night>
            {BEATS.map((b) => (
              <article key={b.id} className={night.beat} data-beat={b.id}>
                <p className={night.time}>
                  <time>{b.at}</time>
                  <span>{b.day}</span>
                </p>
                <h3 className={night.title}>{b.title}</h3>
                <p className={night.text}>{b.text}</p>
                {"try" in b && <p className={night.try}>{b.try}</p>}
              </article>
            ))}
          </Night>
        </section>

        {/* --- the wedding, as his camera roll kept it --------------------- */}
        <section className={styles.roll} aria-labelledby="roll-title">
          <header className={`${s.wrap} ${s.head}`}>
            <p className={s.eyebrow}>Banyan Farms, Chhattarpur · Saturday 22 November</p>
            <h2 id="roll-title" className={s.h2}>
              Ishita weds Rohan. <span>He planned every minute of it, and filmed most of them.</span>
            </h2>
          </header>
          <div className={styles.film} aria-label="Photographs from his camera roll, the night of the wedding">
            <ul className={styles.filmTrack}>
              {[...ROLL, ...ROLL].map((p, i) => (
                <li key={i} aria-hidden={i >= ROLL.length || undefined} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                  <Image src={`${R}/${p.src}`} alt="" fill sizes="(max-width: 900px) 46vw, 300px" className={s.cover} />
                  <span className={styles.exif}>{p.n} / 1,284</span>
                </li>
              ))}
            </ul>
          </div>
          <blockquote className={`${s.wrap} ${styles.cold}`}>
            <p className={styles.coldWhere}>12:31 AM · the back lawn</p>
            <p className={styles.coldLine}>
              <span>A boy</span>
              Bhaiya, light yahan theek hai?
              <em>Bhaiya, is the light all right here?</em>
            </p>
            <p className={styles.coldLine}>
              <span>A voice</span>
              Rolling, bhai?
            </p>
            <p className={styles.coldBang}>[a shot, straight up]</p>
            <p className={styles.coldBang}>[laughter]</p>
            <p className={styles.coldBang} data-last>
              [a second shot]
            </p>
          </blockquote>
        </section>

        {/* --- who keeps ringing him ------------------------------------- */}
        <section className={`${s.wrap} ${styles.people}`} id="people" aria-labelledby="people-title">
          <header className={s.head}>
            <p className={s.eyebrow}>His contacts</p>
            <h2 id="people-title" className={s.h2}>
              Everyone on it wants something. <span>Some of them want the phone back.</span>
            </h2>
          </header>
          <ul className={styles.cast}>
            {PEOPLE.map((p) => (
              <li key={p.name} className={`${s.glass} ${s.spot} ${styles.person}`} data-spot>
                <span className={styles.dp}>
                  {p.photo ? <Image src={`${R}/${p.photo}`} alt="" fill sizes="64px" className={s.cover} /> : <b>{p.name[0]}</b>}
                </span>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.personLine} lang="hi-Latn">
                  {p.line}
                </span>
                <span className={styles.personWho}>{p.who}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* --- what comes after ------------------------------------------ */}
        <section className={`${s.wrap} ${styles.after}`} id="chapters" aria-labelledby="chapters-title">
          <header className={s.head}>
            <p className={s.eyebrow}>After Raakh</p>
            <h2 id="chapters-title" className={s.h2}>
              A different phone, a different city. <span>The next one is already out.</span>
            </h2>
          </header>
          <MoreChapters />
        </section>

        <div className={styles.faq}>
          <Faq items={FAQ} />
        </div>

        {/* --- seven in the morning --------------------------------------- */}
        <section className={styles.dawn}>
          <span className={styles.sunrise} aria-hidden="true" />
          <p className={styles.dawnDate}>Sunday 30 November</p>
          <p className={styles.dawnClock} aria-hidden="true">
            6:59
          </p>
          <h2 className={styles.dawnTitle}>{raakh.ask}</h2>
          <ChapterStatus id="raakh" cta="Open Chapter 1" primary />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
