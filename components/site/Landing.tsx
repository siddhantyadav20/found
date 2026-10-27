import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import YourCases from "@/components/found/Desk/YourCases";
import { AppGlyph } from "@/components/owner/ios/icons";
import { CASES } from "@/content/cases";
import type { AppId } from "@/content/types";
import ChapterStatus from "./ChapterStatus";
import Coffee from "./Coffee";
import Fan, { type FanCard } from "./Fan";
import Faq from "./Faq";
import LivePhone from "./LivePhone";
import MoreChapters from "./MoreChapters";
import Motion from "./Motion";
import Room from "./Room";
import Showcase, { type Slide } from "./Showcase";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import Table from "./Table";
import { siteFonts } from "./fonts";
import fan from "./Fan.module.css";
import scene from "./Scene.module.css";
import s from "./Site.module.css";
import styles from "./Landing.module.css";

/* ===========================================================================
   Found's front door (2026-10-25, the second revamp), staged the way a
   game's site opens on its world:

   1. A loader counts to 100 and splits open (Splash).
   2. A wireframe room, things from his phone hanging in it at different
      depths, the headline word by word, and his apps as a fanned hand of
      cards that turns on its own.
   3. Scroll: the headline blurs away, the hand drops, and the card in the
      middle opens into a panel the size of the screen, a slide for each
      app, each next one growing out of its card.
   4. Chapter 1 as a film poster; what comes after.
   5. How it plays, as three levels that slide past sideways while the page
      holds still: the parcel, his phone, the case file. All of them live.
   6. Who makes it, as a player's card. The questions. The clock.

   Every picture is the game's own. Server-rendered; the client parts are
   the hand, the panel, the live phones and the pointer.
   =========================================================================== */

const raakh = CASES.raakh;
const RAAKH_PAGE = raakh.page ?? raakh.href;
const R = "/found/raakh";

/** His apps, as the hand of cards in the hero. */
const APPS: readonly { app: AppId; eyebrow: string; name: string; chip: string; line: string; color: string }[] = [
  { app: "whatsapp", eyebrow: "His chats", name: "WhatsApp", chip: "4 voice notes", line: "Four voice notes to M, sent and never heard.", color: "#0f8a5f" },
  { app: "phone", eyebrow: "His calls", name: "Phone", chip: "47 missed", line: "A number he never saved keeps ringing.", color: "#d9472f" },
  { app: "photos", eyebrow: "His camera roll", name: "Photos", chip: "Deleted", line: "The wedding, and what he deleted from it.", color: "#e08a12" },
  { app: "instagram", eyebrow: "His feed", name: "Instagram", chip: "Archived", line: "What his friends posted, and what they archived.", color: "#b8306f" },
  { app: "notes", eyebrow: "His notes", name: "Notes", chip: "Locked", line: "A note only his birthday opens.", color: "#6446d1" },
  { app: "casefile", eyebrow: "Yours", name: "Case file", chip: "Say it", line: "Say it. Then prove it, from his phone.", color: "#2b64c9" },
];

const CARDS: FanCard[] = APPS.map((a) => ({
  key: a.app,
  label: `${a.name}: ${a.line}`,
  color: a.color,
  node: (
    <>
      <span className={fan.top}>
        <span>
          <span className={fan.eyebrow}>{a.eyebrow}</span>
          <span className={fan.name}>{a.name}</span>
        </span>
        <span className={fan.chip}>{a.chip}</span>
      </span>
      <span className={fan.art}>
        <span>
          <AppGlyph app={a.app} />
        </span>
      </span>
      <span className={fan.line}>{a.line}</span>
    </>
  ),
}));

/** What each app is keeping, as the panel the middle card opens into. */
const SLIDES: Slide[] = [
  { key: "voice", photo: "w-blur.jpg", eyebrow: "WhatsApp · 11:46 PM", title: "Voice notes to M", tags: ["Episode 1", "Sound on"], line: "Four voice notes to M, in his own voice, sent and never heard. English sits under every Hinglish line." },
  { key: "calls", photo: "key-lawn.jpg", eyebrow: "Phone · 11:47 PM", title: "47 missed calls", tags: ["Episode 1", "Live"], line: "A number he never saved rings the phone in your hand, asking for his brother. What you say back is what he hears." },
  { key: "roll", photo: "w-couple.jpg", eyebrow: "Photos · 12:58 AM", title: "The camera roll", tags: ["1,284 photos"], line: "Ishita and Rohan under fairy lights. A whole wedding on his camera roll, and what he deleted from it." },
  { key: "lapata", photo: "poster-dilip.jpg", eyebrow: "Instagram", title: "Lapata", tags: ["Missing", "7 days"], line: "The boy who worked the lights at the wedding. Nobody has seen him in seven days." },
  { key: "note", photo: "x-rain.jpg", eyebrow: "Notes", title: "A locked note", tags: ["Hidden"], line: "Chats behind a secret code. A note only his birthday opens. Nothing is handed to you." },
  { key: "file", photo: "w-4.jpg", eyebrow: "Case file · 1:52 AM", title: "The case file", tags: ["Yours"], line: "One question at a time. Finish the sentence, then put down what on his phone shows it." },
].map(({ photo, ...sl }) => ({
  ...sl,
  bg: <Image src={`${R}/${photo}`} alt="" fill sizes="100vw" />,
  thumb: <Image src={`${R}/${photo}`} alt="" fill sizes="160px" />,
}));

/** Things from his phone, hanging in the room. x/y on a wide screen; xs/ys on a phone. */
const FLOATS: readonly { x: string; y: string; xs?: string; ys?: string; z: number; r: string; keep?: boolean; node: ReactNode }[] = [
  {
    x: "6%",
    y: "20%",
    xs: "-7%",
    ys: "76%",
    z: 30,
    r: "-9deg",
    keep: true,
    node: (
      <span className={scene.polaroid}>
        <span>
          <Image src={`${R}/w-couple.jpg`} alt="" fill sizes="120px" className={s.cover} />
        </span>
        <small>Ishita weds Rohan</small>
      </span>
    ),
  },
  {
    x: "74%",
    y: "17%",
    z: 45,
    r: "4deg",
    node: (
      <span className={scene.notice}>
        <span className={scene.live} style={{ width: 10, height: 10, margin: 12 }} />
        <b>47 missed calls</b>
        <small>+91 62••• •4417</small>
      </span>
    ),
  },
  {
    x: "3%",
    y: "52%",
    z: 60,
    r: "7deg",
    node: (
      <span className={scene.paper} lang="hi-Latn">
        M —<br />
        Sab isme hai.
        <span>— S</span>
      </span>
    ),
  },
  {
    x: "86%",
    y: "40%",
    xs: "84%",
    ys: "79%",
    z: 70,
    r: "12deg",
    keep: true,
    node: (
      <span className={scene.icon}>
        <AppGlyph app="whatsapp" />
      </span>
    ),
  },
  {
    x: "79%",
    y: "62%",
    z: 25,
    r: "-10deg",
    node: <span className={scene.stamp}>Return to origin</span>,
  },
  {
    x: "13%",
    y: "75%",
    z: 50,
    r: "-4deg",
    node: (
      <span className={scene.notice}>
        <Image src={`${R}/dp-bhasin.jpg`} alt="" width={34} height={34} style={{ borderRadius: "50%" }} />
        <b>Bhasin Uncle</b>
        <small lang="hi-Latn">Wapas kar do.</small>
      </span>
    ),
  },
];

/** The headline, a word at a time, each with its place in the order; the lit words are the story's. */
const HEAD = [
  ["Thrillers", "you", "play", "on"],
  ["*someone", "*else's", "phone."],
].map((line, l, all) =>
  line.map((word, k) => ({ word: word.replace("*", ""), lit: word.startsWith("*"), i: all.slice(0, l).flat().length + k })),
);

/** The cast billed across the top of Chapter 1's poster. */
const CAST = ["Sameer", "Meera", "Kunal", "Bhasin Uncle", "Dilip"];

const FAQ = [
  ["Is it free?", "Yes. Both chapters are free in your browser. No download, no sign-up, no ads."],
  ["How long is a chapter?", "Most people take 45 minutes to an hour, in three episodes. Your place is kept between them."],
  ["Phone or laptop?", "Either. It's made for a phone in one hand, at night, with the sound on. On a laptop the case file sits beside the phone."],
  ["What if I get stuck?", "Play “With help”: the case file says where to look, and every question has three hints, the last one the answer. Nothing counts how often you used them."],
  ["Is any of it real?", "No. Every person, company and number is invented, and the game never asks you for anything real. The cities are real; the crimes aren't."],
  ["Who is it for?", "Anyone 16 and over. Chapters deal with violence and its aftermath, never shown, and each says what's in it before you open it."],
] as const;

const NAV = [
  ["#how", "How it plays"],
  ["#chapters", "Chapters"],
  ["#made-by", "Made by"],
  ["#faq", "Questions"],
] as const;

export default function Landing() {
  return (
    <div className={`${s.site} ${siteFonts}`}>
      <Motion />
      <SiteNav links={NAV} cta={{ href: raakh.href, label: "Play free" }} />

      <main id="main">
        {/* --- the room, the hand, and the panel it opens into ------------------ */}
        <section className={scene.scene} aria-labelledby="hero-title">
          <div className={scene.stage} data-tilt>
            <Room />
            <div className={scene.floats} aria-hidden="true">
              {FLOATS.map((f, i) => (
                <div
                  key={i}
                  className={scene.float}
                  data-keep={f.keep || undefined}
                  style={{ "--x": f.x, "--y": f.y, "--xs": f.xs, "--ys": f.ys, "--z": f.z, "--r": f.r, "--i": i } as CSSProperties}
                >
                  {f.node}
                </div>
              ))}
            </div>

            <div className={scene.text}>
              <h1 id="hero-title" className={scene.h1}>
                {HEAD.map((line, l) => (
                  <span key={l}>
                    {line.map(({ word, lit, i }) => (
                      <i key={word} data-lit={lit || undefined} style={{ "--i": i } as CSSProperties}>
                        {word}
                      </i>
                    ))}
                  </span>
                ))}
              </h1>
              <p className={scene.lede}>
                A wedding planner&apos;s phone comes back to your door. Read his chats, play his voice notes, open what he deleted, and work out
                what happened.
              </p>
              <div className={scene.bar}>
                <Link href={RAAKH_PAGE} className={scene.barText}>
                  <i className={scene.live} />
                  <span>
                    <b>New</b> · Chapter 1: Raakh, a Delhi wedding
                  </span>
                </Link>
                <ChapterStatus id="raakh" cta="Play free" primary />
              </div>
              <p className={scene.meta}>In your browser · no download · 45–60 min</p>
            </div>

            <div className={scene.fanWrap}>
              <Fan cards={CARDS} />
            </div>

            <div className={scene.panel}>
              <Showcase slides={SLIDES} label="What's on his phone" cta={<ChapterStatus id="raakh" cta="Play Chapter 1, free" primary />} />
            </div>
          </div>
        </section>

        {/* --- chapters: the poster ------------------------------------------------------ */}
        <section className={`${s.wrap} ${styles.chapters}`} id="chapters" aria-labelledby="chapters-title">
          <header className={s.head}>
            <p className={s.eyebrow}>Chapters</p>
            <h2 id="chapters-title" className={s.h2}>
              A different phone, a different city. <span>Every chapter a whole story, set in India.</span>
            </h2>
          </header>

          <article className={styles.poster} data-tilt>
            <div className={styles.posterTop}>
              <span className={styles.posterNo}>Chapter 01</span>
              <span className={styles.tags}>
                <span className={s.tag}>Thriller</span>
                <span className={s.tag}>{raakh.city}</span>
                <span className={s.tag}>16+</span>
              </span>
              <span className={styles.posterNew}>New</span>
            </div>
            <ul className={styles.cast} aria-label="Starring">
              {CAST.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className={styles.posterMid}>
              <h3 className={styles.posterTitle}>{raakh.title}</h3>
              <span className={styles.sun} aria-hidden="true" />
              <div className={styles.still}>
                <Image
                  src={`${R}/key-lawn.jpg`}
                  alt="The back lawn of a Delhi farmhouse after midnight: fairy lights in the mango trees, chairs knocked over, a light panel face down beside an empty tripod."
                  fill
                  sizes="(max-width: 760px) 60vw, 340px"
                  className={s.cover}
                />
                <p className={styles.note} lang="hi-Latn">
                  M —<br />
                  Sab isme hai.
                  <br />
                  Local thane mat le jaana.
                  <span>— S</span>
                </p>
              </div>
            </div>
            <span className={styles.ticks} aria-hidden="true" />
            <div className={styles.posterFoot}>
              <div className={styles.posterLine}>
                <p>{raakh.logline}</p>
                <p className={styles.facts}>
                  {raakh.episodes} episodes · {raakh.tone.split(" · ").at(-1)} · free
                </p>
              </div>
              <div className={styles.posterCtas}>
                <ChapterStatus id="raakh" cta="Open the parcel" primary />
                <Link href={RAAKH_PAGE} className={s.ghost}>
                  Inside Chapter 1
                </Link>
              </div>
              <Link href={RAAKH_PAGE} className={styles.badge} aria-label="Inside Chapter 1">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="badge-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
                  </defs>
                  <text>
                    <textPath href="#badge-ring">Chapter 01 · Raakh · Now open · </textPath>
                  </text>
                </svg>
                <i />
              </Link>
            </div>
          </article>

          <MoreChapters />
          <div className={styles.yours}>
            <YourCases />
          </div>
        </section>

        {/* --- how it plays: three levels, sliding past ------------------------------------ */}
        <section className={styles.levels} id="how" aria-labelledby="how-title">
          <div className={styles.levelsPin}>
            <header className={`${s.wrap} ${styles.levelsHead}`}>
              <p className={s.eyebrow}>How it plays</p>
              <h2 id="how-title" className={s.h2}>
                Open it. Get in. <span>Decide.</span>
              </h2>
            </header>
            <ol className={styles.row}>
              <li className={styles.level}>
                <Room className={styles.levelRoom} />
                <div className={styles.levelText}>
                  <p className={styles.levelNo}>01</p>
                  <p className={s.eyebrow}>It arrives</p>
                  <h3 className={styles.levelTitle}>It comes to your door</h3>
                  <p className={styles.levelLine}>
                    Every chapter starts with something that wasn&apos;t meant for you. In Chapter 1, a parcel comes back to your door: a wedding
                    planner&apos;s phone, a wedding envelope with a note to M, and a courier&apos;s label stamped return to origin.
                  </p>
                </div>
                <div className={styles.levelArt}>
                  <div className={styles.levelTable}>
                    <Table />
                  </div>
                </div>
              </li>
              <li className={styles.level}>
                <Room className={styles.levelRoom} />
                <div className={styles.levelText}>
                  <p className={styles.levelNo}>02</p>
                  <p className={s.eyebrow}>You get in</p>
                  <h3 className={styles.levelTitle}>Every app on it works</h3>
                  <p className={styles.levelLine}>
                    Not a story about a phone: the phone. Chats, calls, photos, notes, mail, his bank. And the night keeps happening while you read:
                    messages land, people ring, somebody wants it back. These two are live. Touch them.
                  </p>
                </div>
                <div className={`${styles.levelArt} ${styles.pair}`}>
                  <LivePhone beat="home" />
                  <LivePhone beat="call" />
                </div>
              </li>
              <li className={styles.level}>
                <Room className={styles.levelRoom} />
                <div className={styles.levelText}>
                  <p className={styles.levelNo}>03</p>
                  <p className={s.eyebrow}>You decide</p>
                  <h3 className={styles.levelTitle}>Say it, then prove it</h3>
                  <p className={styles.levelLine}>
                    The case file asks one question at a time. Finish the sentence, then put down what on his phone shows it. Then choose what
                    you do at seven.
                  </p>
                  <ul className={styles.perks}>
                    <li>With help, or as a detective</li>
                    <li>Hinglish, with English underneath</li>
                    <li>Take your time. Nothing is lost by reading slowly.</li>
                    <li>Pass it on to a friend</li>
                  </ul>
                </div>
                <div className={styles.levelArt}>
                  <LivePhone beat="file" className={styles.single} />
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* --- who makes it: a player's card -------------------------------------------------- */}
        <section className={`${s.wrap} ${styles.maker}`} id="made-by" aria-labelledby="maker-title">
          <div className={`${s.glass} ${styles.profile}`}>
            <div className={styles.who}>
              <span className={styles.avatar} aria-hidden="true">
                S
              </span>
              <div>
                <p className={s.eyebrow}>Made by</p>
                <h2 id="maker-title" className={styles.makerName}>
                  Siddhant Yadav
                </h2>
                <p className={styles.role}>Writer · Designer · Builder · India</p>
              </div>
            </div>
            <dl className={styles.stats}>
              <div>
                <dt>Chapters out</dt>
                <dd>2</dd>
              </div>
              <div>
                <dt>In transit</dt>
                <dd>1</dd>
              </div>
              <div>
                <dt>Ads</dt>
                <dd>0</dd>
              </div>
            </dl>
            <div className={styles.bio}>
              <p>
                I write, design and build Found on my own: the stories, the phones they happen on, the photographs and the voices. One person, in
                India.
              </p>
              <p>
                Found is free, and it will stay cheap. If a chapter kept you up past midnight and you&apos;d like to say so, you can buy me a coffee.
                Every one goes into the next chapter.
              </p>
              <p className={styles.sign}>— Siddhant</p>
            </div>
            <div className={styles.support}>
              <Coffee />
            </div>
          </div>
        </section>

        <Faq items={FAQ} />

        {/* --- the clock ------------------------------------------------------------------------- */}
        <section className={styles.final} data-tilt>
          <Room />
          <p className={styles.clock} aria-hidden="true">
            11:40<small>PM</small>
          </p>
          <h2 className={styles.finalTitle}>
            It&apos;s 11:40 PM. <em>It came back.</em>
          </h2>
          <ChapterStatus id="raakh" cta="Open Chapter 1" primary />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
