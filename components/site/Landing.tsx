import Image from "next/image";
import Link from "next/link";

import { AppGlyph } from "@/components/owner/ios/icons";
import YourCases from "@/components/found/Desk/YourCases";
import SoundToggle from "@/components/found/SoundToggle";
import { CASES } from "@/content/cases";
import ChapterStatus from "./ChapterStatus";
import Mark from "./Mark";
import styles from "./Landing.module.css";

/* ===========================================================================
   Found's front door (2026-10-23), replacing the desk.

   What it has to do: say what Found is in one breath, show how it's played
   with the game's own pieces (a lock screen filling up, a voice note, a
   photo leaned into, a sentence in the case file), and put Chapter 1 one tap
   away. Server-rendered and animated in CSS; the only client parts are what
   this browser alone knows (how far you got, the sound).

   Every picture here is from the game. Nothing is a stock icon.
   =========================================================================== */

const raakh = CASES.raakh;
const local = CASES.lastlocal;

const STEPS = [
  {
    n: "01",
    title: "It arrives",
    body: "A parcel comes back to your door. Inside: a stranger's phone, cracked at one corner, and a note meant for someone else.",
  },
  {
    n: "02",
    title: "You get in",
    body: "No passcode. Every app works the way it does on a real phone: chats, photos, Recently Deleted, locked notes, voice memos, calls that ring in your hand.",
  },
  {
    n: "03",
    title: "You put it together",
    body: "Say what happened in the case file, a sentence at a time, and back it with what you found. Get it wrong and it tells you which word.",
  },
  {
    n: "04",
    title: "You decide",
    body: "Send the record to the lawyer it was meant for, post it for everyone, or hand the parcel back. Each ending is the one you earned.",
  },
];

const FAQ = [
  ["Is it free?", "Yes. Chapter 1 and Chapter 2 are free to play, in your browser. No download, no sign-up, no ads."],
  ["How long does a chapter take?", "Most players finish one in 45 minutes to an hour, in three episodes. Your place is kept, so you can stop between episodes."],
  ["Phone or laptop?", "Either. It's built for a phone held in one hand, at night, with the sound on. On a laptop the case file opens beside the phone like a notebook."],
  ["What if I get stuck?", "Choose “With help” at the start: the case file says where to look, every question has three hints, and the last one is the answer. Nothing counts how often you used them."],
  ["Is any of it real?", "No. Every person, company and number in Found is invented, and the game never asks you for anything real. The places are real cities; the crimes aren't."],
  ["Who is it for?", "Anyone 16 and up. Chapters deal with violence and its aftermath, never shown, and each one says what's in it before you open it."],
];

function LockScreen() {
  return (
    <div className={styles.phone} aria-hidden="true">
      <div className={styles.phoneScreen}>
        <Image src={raakh.wallpaper} alt="" fill sizes="320px" className={styles.wall} priority />
        <div className={styles.island} />
        <p className={styles.lockDate}>Saturday 29 November</p>
        <p className={styles.lockTime}>11:40</p>
        <ol className={styles.notes}>
          <li style={{ "--i": 0 } as React.CSSProperties}>
            <span className={styles.noteIcon}>
              <AppGlyph app="phone" />
            </span>
            <span>
              <b>Phone</b>
              <span>47 Missed Calls</span>
            </span>
            <time>11:38 PM</time>
          </li>
          <li style={{ "--i": 1 } as React.CSSProperties}>
            <span className={styles.noteIcon}>
              <AppGlyph app="whatsapp" />
            </span>
            <span>
              <b>Mummy</b>
              <span>Beta, phone kyun nahi utha raha? Khana khaya?</span>
            </span>
            <time>10:52 PM</time>
          </li>
          <li style={{ "--i": 2 } as React.CSSProperties}>
            <span className={styles.noteIcon}>
              <AppGlyph app="phone" />
            </span>
            <span>
              <b>Bhasin Uncle</b>
              <span>2 missed calls</span>
            </span>
            <time>Fri</time>
          </li>
          <li style={{ "--i": 3 } as React.CSSProperties} data-new>
            <span className={styles.noteIcon}>
              <AppGlyph app="whatsapp" />
            </span>
            <span>
              <b>+91 70••• •2290</b>
              <span>M? Tu hai?</span>
            </span>
            <time>now</time>
          </li>
        </ol>
        <span className={styles.homeBar} />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <Link href={raakh.href} className={styles.pill}>
          <span className={styles.pillTag}>New</span>
          <span>
            Chapter 1, <i>Raakh</i>, is out
          </span>
          <span aria-hidden="true">→</span>
        </Link>
        <h1 className={styles.h1}>
          Thrillers you play on <em>somebody else&apos;s</em> phone.
        </h1>
        <p className={styles.lede}>
          A phone that isn&apos;t yours lands at your door. Read the chats, play the voice notes, dig through what was deleted, and work out what
          happened, while the people looking for it keep calling.
        </p>
        <div className={styles.ctas}>
          <ChapterStatus id="raakh" cta="Play Chapter 1: Raakh" primary />
          <a href="#how" className={styles.btnGhost}>
            How it&apos;s played
          </a>
        </div>
        <ul className={styles.facts}>
          <li>Free</li>
          <li>In your browser</li>
          <li>45–60 min a chapter</li>
          <li>Sound on</li>
        </ul>
      </div>

      <div className={styles.heroArt}>
        <div className={styles.glow} aria-hidden="true" />
        <LockScreen />

        {/* The pieces a play turns up, as the phone shows them. */}
        <figure className={`${styles.float} ${styles.floatVoice}`} aria-hidden="true">
          <span className={styles.voicePlay} />
          <span className={styles.wave}>
            {Array.from({ length: 22 }, (_, i) => (
              <i key={i} style={{ height: `${24 + Math.round(70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.55)))}%` }} />
            ))}
          </span>
          <span className={styles.voiceTime}>0:18</span>
          <figcaption>“M… main jaanta hoon tu reply nahi karegi.”</figcaption>
        </figure>

        <figure className={`${styles.float} ${styles.floatPhoto}`} aria-hidden="true">
          <span className={styles.photo}>
            <Image src="/found/raakh/w-portrait.jpg" alt="" fill sizes="180px" className={styles.cover} />
            <span className={styles.loupe}>DILIP</span>
          </span>
          <figcaption>9:48 PM · a waiter, smiling into the lens</figcaption>
        </figure>

        <figure className={`${styles.float} ${styles.floatFile}`} aria-hidden="true">
          <span className={styles.fileHead}>Case file · Q2</span>
          <span className={styles.fileLine}>
            Dilip was last seen as a <u>waiter</u> at the <u>Sehgal wedding</u>.
          </span>
          <span className={styles.fileProof}>
            <i />2 pieces of proof
          </span>
        </figure>
      </div>
    </section>
  );
}

function Apps() {
  const apps = ["whatsapp", "photos", "phone", "instagram", "notes", "mail", "safari", "voicememos", "settings"] as const;
  return (
    <section className={styles.apps} aria-label="The apps you'll dig through">
      <p className={styles.appsLabel}>Nine apps that work like the real ones. Every one of them holds something.</p>
      <ul className={styles.appRow}>
        {apps.map((a, i) => (
          <li key={a} style={{ "--i": i } as React.CSSProperties}>
            <AppGlyph app={a} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function How() {
  return (
    <section className={styles.section} id="how">
      <header className={styles.sectionHead}>
        <p className={styles.kicker}>How it&apos;s played</p>
        <h2 className={styles.h2}>
          Four steps. <span>No rules to learn: you already know how to use a phone.</span>
        </h2>
      </header>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li key={s.n} className={styles.step}>
            <div className={styles.stepArt} data-step={i + 1} aria-hidden="true">
              {i === 0 && (
                <span className={styles.envelope}>
                  <span className={styles.hand}>
                    M —<br />
                    Sab isme hai.
                    <br />
                    Local thane mat le jaana.
                  </span>
                  <span className={styles.envStamp}>Return to origin</span>
                </span>
              )}
              {i === 1 && (
                <span className={styles.otp}>
                  <span>Agar kuch hua</span>
                  <span className={styles.otpBoxes}>
                    <i>•</i>
                    <i>•</i>
                    <i data-on />
                    <i />
                  </span>
                  <small>Hint: birthday · ddmm</small>
                </span>
              )}
              {i === 2 && (
                <span className={styles.sentence}>
                  <span>
                    S is <u>Sameer Khurrana</u>, a <u data-wrong>DJ</u>…
                  </span>
                  <small>“DJ” isn&apos;t what the phone shows. Look in Instagram or Mail.</small>
                </span>
              )}
              {i === 3 && (
                <span className={styles.acts}>
                  <i>Send it to Meera Arora</i>
                  <i>Post it on his Instagram</i>
                  <i>Hand it back to the courier</i>
                </span>
              )}
            </div>
            <p className={styles.stepN}>{s.n}</p>
            <h3 className={styles.h3}>{s.title}</h3>
            <p className={styles.body}>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Features() {
  return (
    <section className={styles.section} aria-labelledby="features">
      <header className={styles.sectionHead}>
        <p className={styles.kicker}>Why it feels real</p>
        <h2 className={styles.h2} id="features">
          The night doesn&apos;t wait for you. <span>It keeps happening while you read.</span>
        </h2>
      </header>
      <div className={styles.bento}>
        <article className={`${styles.card} ${styles.cardWide}`}>
          <h3 className={styles.h3}>People call. People write. Someone comes to your gate.</h3>
          <p className={styles.body}>Notifications land while you dig. A brother who hasn&apos;t slept rings the phone in your hand. What you tell him changes what he does next.</p>
          <div className={styles.call} aria-hidden="true">
            <span className={styles.callWho}>+91 62••• •4417</span>
            <span className={styles.callSub}>mobile</span>
            <span className={styles.callBtns}>
              <i data-red />
              <i />
            </span>
          </div>
        </article>
        <article className={styles.card}>
          <h3 className={styles.h3}>Voices, not just text</h3>
          <p className={styles.body}>Voice notes, memos and calls in Hindi and Hinglish, with English under every line.</p>
          <span className={styles.bigWave} aria-hidden="true">
            {Array.from({ length: 36 }, (_, i) => (
              <i key={i} style={{ "--h": `${20 + Math.round(75 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31)))}%`, "--d": `${(i % 9) * 0.08}s` } as React.CSSProperties} />
            ))}
          </span>
        </article>
        <article className={styles.card}>
          <h3 className={styles.h3}>Nothing is handed to you</h3>
          <p className={styles.body}>Chats behind Chat Lock. Photos stuck in iCloud. A note locked with a password only his life gives away. Every lock is one a real phone has.</p>
          <span className={styles.lockRow} aria-hidden="true">
            <AppGlyph app="whatsapp" />
            <AppGlyph app="photos" />
            <AppGlyph app="notes" />
          </span>
        </article>
        <article className={styles.card}>
          <h3 className={styles.h3}>Three episodes, one sitting</h3>
          <p className={styles.body}>Each episode ends on a question the next one answers. Your phone has to keep his alive in between.</p>
          <span className={styles.eps} aria-hidden="true">
            <i data-on>Missed Calls</i>
            <i>The Second Shot</i>
            <i>The Cancelled Rescue</i>
          </span>
        </article>
        <article className={styles.card}>
          <h3 className={styles.h3}>Pass it on</h3>
          <p className={styles.body}>
            Finished? Seal the parcel and send it to a friend on WhatsApp, with their name on the label. You&apos;ll see how far they got, and never what they chose.
          </p>
          <span className={styles.share} aria-hidden="true">
            <b>I traced 9 of 11 links in Raakh.</b>
            <span>A wedding planner&apos;s phone. A missing waiter. Where does it end?</span>
          </span>
        </article>
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section className={styles.section} id="chapters">
      <header className={styles.sectionHead}>
        <p className={styles.kicker}>Chapters</p>
        <h2 className={styles.h2}>
          Every chapter is a different phone, in a different Indian city. <span>Start with the first.</span>
        </h2>
      </header>
      <div className={styles.chapters}>
        <article className={`${styles.chapter} ${styles.chapterLead}`}>
          <div className={styles.chapterArt}>
            <Image src="/found/raakh/key-lawn.jpg" alt="The back lawn of a Delhi farmhouse after midnight: fairy lights in the mango trees, chairs knocked over, a light panel face down beside an empty tripod." fill sizes="(max-width: 900px) 100vw, 60vw" className={styles.cover} />
            <span className={styles.chapterNo}>Chapter 01</span>
          </div>
          <div className={styles.chapterBody}>
            <p className={styles.chapterCity}>
              {raakh.city} · {raakh.episodes} episodes · {raakh.tone.split(" · ").at(-1)}
            </p>
            <h3 className={styles.chapterTitle}>Raakh</h3>
            <p className={styles.chapterHindi} lang="hi">
              राख · ash
            </p>
            <p className={styles.body}>{raakh.logline}</p>
            <p className={styles.note}>{raakh.note}</p>
            <ChapterStatus id="raakh" cta="Open the parcel" primary />
          </div>
        </article>

        <article className={styles.chapter}>
          <div className={styles.chapterArt}>
            <Image src="/found/lastlocal/wallpaper.jpg" alt="Mumbai's sea link at night." fill sizes="(max-width: 900px) 100vw, 40vw" className={styles.cover} />
            <span className={styles.chapterNo}>Chapter 02</span>
          </div>
          <div className={styles.chapterBody}>
            <p className={styles.chapterCity}>
              {local.city} · {local.episodes} episodes · {local.tone.split(" · ").at(-1)}
            </p>
            <h3 className={styles.chapterTitle}>Last Local</h3>
            <p className={styles.body}>{local.logline}</p>
            <ChapterStatus id="lastlocal" cta="Pick it up" />
          </div>
        </article>

        <article className={`${styles.chapter} ${styles.chapterLocked}`}>
          <div className={styles.chapterArt} aria-hidden="true">
            <span className={styles.silhouette} />
            <span className={styles.chapterNo}>Chapter 03</span>
          </div>
          <div className={styles.chapterBody}>
            <p className={styles.chapterCity}>Somewhere else · being found</p>
            <h3 className={styles.chapterTitle}>Not yet</h3>
            <p className={styles.body}>A different object, a different city. It&apos;ll be here when it arrives.</p>
          </div>
        </article>
      </div>
      <div className={styles.yours}>
        <YourCases />
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className={styles.section} id="faq">
      <header className={styles.sectionHead}>
        <p className={styles.kicker}>Questions</p>
        <h2 className={styles.h2}>Before you open it.</h2>
      </header>
      <div className={styles.faq}>
        {FAQ.map(([q, a]) => (
          <details key={q} className={styles.qa}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className={styles.site}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <header className={styles.nav}>
        <Link href="/" aria-label="Found, home" className={styles.brand}>
          <Mark size={19} />
        </Link>
        <nav className={styles.links} aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#chapters">Chapters</a>
          <a href="#faq">Questions</a>
        </nav>
        <span className={styles.navEnd}>
          <SoundToggle className={styles.sound} />
          <Link href={raakh.href} className={styles.navCta}>
            Play
          </Link>
        </span>
      </header>

      <main id="main">
        <Hero />
        <Apps />
        <How />
        <Features />
        <Chapters />
        <Questions />

        <section className={styles.final}>
          <h2 className={styles.finalTitle}>
            It&apos;s 11:40 PM. <em>It isn&apos;t your phone.</em>
          </h2>
          <ChapterStatus id="raakh" cta="Open Chapter 1" primary />
        </section>
      </main>

      <footer className={styles.footer}>
        <Mark size={16} />
        <p>Interactive fiction. Every person, company and number in it is invented. Made in India.</p>
        <p className={styles.footerHelp}>
          If anything in it is close to home: Tele-MANAS, free, all day, <a href="tel:14416">14416</a>.
        </p>
      </footer>
    </div>
  );
}
