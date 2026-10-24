import Image from "next/image";
import Link from "next/link";

import YourCases from "@/components/found/Desk/YourCases";
import SoundToggle from "@/components/found/SoundToggle";
import { CASES } from "@/content/cases";
import ChapterStatus from "./ChapterStatus";
import Figures from "./Figures";
import Mark from "./Mark";
import styles from "./Landing.module.css";

/* ===========================================================================
   Found's front door (rebuilt 2026-10-24 on Linear's system).

   One quiet, left-aligned headline; then the product itself, large: the game
   as a player sees it on a wide screen (his chats, M's voice notes, the case
   file). A monochrome strip, a two-tone statement, three numbered figures,
   and sections that each pair a split header with a real piece of the game.
   No pills, no glows on buttons, no stickers: the restraint is the design.

   Server-rendered. The only client parts are what this browser alone knows
   (how far you got, the sound).
   =========================================================================== */

const raakh = CASES.raakh;
const local = CASES.lastlocal;
const R = "/found/raakh";

const CHATS = [
  { name: "M", sub: "Voice message · 0:06", time: "Wed", avatar: `${R}/dp-meera.jpg`, pinned: true, on: true },
  { name: "+91 62••• •4417", sub: "Bhaiya aap ho? Ya ye phone ab kisi aur…", time: "11:31 PM", unread: 2 },
  { name: "Mummy", sub: "Beta, phone kyun nahi utha raha?", time: "10:52 PM", unread: 1 },
  { name: "Banyan — Security", sub: "Messages disappear after 24 hours", time: "22/11", group: true },
  { name: "Kunal", sub: "Video · 0:14", time: "22/11", avatar: `${R}/dp-kunal.jpg` },
  { name: "Bhasin Uncle", sub: "Balance aaj aa jayega. Tab tak…", time: "Sunday", avatar: `${R}/dp-bhasin.jpg` },
  { name: "Sethi Caterers", sub: "Dilip ka hisaab Bhasin sir ne kar diya…", time: "Monday" },
];

const NOTES = [
  { at: "9:40 AM", s: "0:18", t: "M… main jaanta hoon tu reply nahi karegi. Kal shaadi mein… Kunal firing kar raha tha. Ek ladka gir gaya.", e: "M… I know you won't reply. Last night at the wedding… Kunal was firing. A boy fell." },
  { at: "11:20 PM", s: "0:11", t: "Usko hospital nahi le gaye. Bhasin ne kisi ko jaane nahi diya.", e: "They didn't take him to hospital. Bhasin didn't let anyone go." },
  { at: "2:05 AM", s: "0:09", t: "Unhone usko jala diya, M. Main wahan tha. Maine dekha.", e: "They burned him, M. I was there. I saw it." },
];

function Wave({ seed, n = 28 }: { seed: number; n?: number }) {
  return (
    <span className={styles.wave} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ height: `${22 + Math.round(72 * Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * 0.55)))}%` }} />
      ))}
    </span>
  );
}

/** The game on a wide screen, drawn as itself: his chats, M's voice notes, and the case file beside them. */
function Product() {
  return (
    <div className={styles.product} aria-label="The game: his WhatsApp chats, M's voice notes, and the case file" role="img">
      <div className={styles.window}>
        <aside className={styles.chats}>
          <div className={styles.chatsHead}>
            <b>Chats</b>
            <span className={styles.search}>Search</span>
          </div>
          <ul>
            {CHATS.map((c) => (
              <li key={c.name} data-on={c.on || undefined}>
                <span className={styles.av}>
                  {c.avatar ? <Image src={c.avatar} alt="" fill sizes="40px" className={styles.cover} /> : c.group ? "◎" : c.name[0] === "+" ? "" : c.name[0]}
                </span>
                <span className={styles.chatText}>
                  <span className={styles.chatTop}>
                    <b>{c.name}</b>
                    <time>{c.time}</time>
                  </span>
                  <span className={styles.chatSub}>
                    <span>{c.sub}</span>
                    {c.unread ? <i>{c.unread}</i> : null}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.thread}>
          <header className={styles.threadHead}>
            <span className={styles.av}>
              <Image src={`${R}/dp-meera.jpg`} alt="" fill sizes="40px" className={styles.cover} />
            </span>
            <span>
              <b>M</b>
              <span>last seen a long time ago</span>
            </span>
          </header>
          <div className={styles.bubbles}>
            <p className={styles.day}>Sunday</p>
            {NOTES.map((v, i) => (
              <div key={v.at} className={styles.voice}>
                <span className={styles.voiceRow}>
                  <span className={styles.play} />
                  <Wave seed={i * 2.3} />
                  <span className={styles.voiceLen}>{v.s}</span>
                </span>
                <span className={styles.voiceText}>{v.t}</span>
                <span className={styles.voiceEn}>{v.e}</span>
                <span className={styles.tick}>
                  {v.at} <b>✓</b>
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.file}>
          <p className={styles.fileTop}>
            <span>Episode 1 · Missed Calls</span>
            <span className={styles.fileDots}>
              <i data-done />
              <i data-done />
              <i data-now />
              <i />
            </span>
          </p>
          <p className={styles.fileEyebrow}>Open question</p>
          <p className={styles.fileQ}>What happened to Dilip at the wedding?</p>
          <p className={styles.fileStep}>
            <span>1</span> Say what happened
          </p>
          <p className={styles.fileSentence}>
            Dilip was shot by <u>someone at the wedding</u>, and <u>nobody</u> took him to a hospital.
          </p>
          <p className={styles.fileOk}>That&apos;s what the phone shows. Now show it.</p>
          <p className={styles.fileStep}>
            <span>2</span> Show it: the 2 things that prove it
          </p>
          <ul className={styles.proof}>
            <li data-on>
              <i />
              Voice note: “Kunal firing kar raha tha. Ek ladka gir gaya.”
            </li>
            <li data-on>
              <i />
              Voice note: “Usko hospital nahi le gaye.”
            </li>
            <li>
              <i />
              Nine seconds of fire, 4:47 AM Sunday
            </li>
          </ul>
          <span className={styles.fileBtn}>File it</span>
        </aside>
      </div>
    </div>
  );
}

const APPS = ["WhatsApp", "Photos", "Instagram", "Phone", "Notes", "Mail", "Safari", "Voice Memos", "Settings"];

const FAQ = [
  ["Is it free?", "Yes. Both chapters are free to play in your browser. No download, no sign-up, no ads."],
  ["How long is a chapter?", "Most players take 45 minutes to an hour, in three episodes. Your place is kept between them."],
  ["Phone or laptop?", "Either. It's made for a phone in one hand, at night, with the sound on. On a laptop the case file sits beside the phone."],
  ["What if I get stuck?", "Play “With help”: the case file says where to look, and every question has three hints, the last one the answer. Nothing counts how often you used them."],
  ["Is any of it real?", "No. Every person, company and number is invented, and the game never asks you for anything real. The cities are real; the crimes aren't."],
  ["Who is it for?", "Anyone 16 and over. Chapters deal with violence and its aftermath, never shown, and each says what's in it before you open it."],
];

export default function Landing() {
  return (
    <div className={styles.site}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" aria-label="Found, home" className={styles.brand}>
            <Mark size={18} />
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
        </div>
      </header>

      <main id="main">
        <section className={styles.hero}>
          <h1 className={styles.h1}>
            Thrillers you play on <br className={styles.br} />
            someone else&apos;s phone
          </h1>
          <div className={styles.heroRow}>
            <p className={styles.lede}>A stranger&apos;s phone arrives at your door. Everything you need is on it.</p>
            <Link href={raakh.href} className={styles.newLink}>
              <b>New</b> Chapter 1: Raakh <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.heroCtas}>
            <ChapterStatus id="raakh" cta="Play Raakh, free" primary />
            <span className={styles.heroNote}>In your browser · 45–60 minutes · sound on</span>
          </div>
        </section>

        <div className={styles.productWrap}>
          <Product />
        </div>

        <section className={styles.strip} aria-label="The apps you'll go through">
          <ul>
            {APPS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p>Every app on his phone works, and every one of them holds something</p>
        </section>

        <section className={styles.statement}>
          <p>
            A new kind of thriller.{" "}
            <span>
              Not a film you watch or a book you read: a stranger&apos;s phone you open, and a night you put back together from what they left on it,
              and what they didn&apos;t.
            </span>
          </p>
        </section>

        <Figures />

        <section className={styles.split} id="how">
          <header className={styles.splitHead}>
            <h2 className={styles.h2}>The night keeps happening</h2>
            <p className={styles.splitText}>
              You don&apos;t read it after the fact. Messages land while you dig. A brother who hasn&apos;t slept rings the phone in your hand. Somebody
              wants it back by morning, and knows your address.
            </p>
          </header>
          <div className={styles.panel}>
            <div className={styles.lock}>
              <Image src={raakh.wallpaper} alt="" fill sizes="(max-width: 900px) 100vw, 380px" className={styles.cover} />
              <span className={styles.lockTime}>11:40</span>
              <ul className={styles.lockNotes}>
                <li>
                  <b>Phone</b> 47 Missed Calls
                </li>
                <li>
                  <b>Mummy</b> Beta, phone kyun nahi utha raha?
                </li>
                <li data-new>
                  <b>+91 70••• •2290</b> M? Tu hai?
                </li>
              </ul>
            </div>
            <div className={styles.call}>
              <span className={styles.callWho}>+91 62••• •4417</span>
              <span className={styles.callSub}>00:07</span>
              <p className={styles.callLine}>
                <span>Raju</span>…Aap kaun ho? Ye Sameer bhaiya ka phone hai na?
                <em>…Who are you? This is Sameer bhaiya&apos;s phone, isn&apos;t it?</em>
              </p>
              <p className={styles.callLine}>
                <span>Raju</span>Dilip kahan hai?
                <em>Where&apos;s Dilip?</em>
              </p>
              <span className={styles.callOptions}>
                <i>Main Sameer nahi hoon. Ye phone mujhe mila hai.</i>
                <i>Dilip kaun?</i>
                <i>Galat number.</i>
              </span>
            </div>
            <div className={styles.threat}>
              <span className={styles.threatWho}>Bhasin Uncle</span>
              <p>Location dekh li hai.</p>
              <p>Courier company mein bhi humare log hain. Parcel pe bhejne wale ka pata aapka hai na?</p>
              <span className={styles.threatEn}>“We have people at the courier company too. The sender&apos;s address on that parcel is yours, isn&apos;t it?”</span>
            </div>
          </div>
        </section>

        <section className={styles.split}>
          <header className={styles.splitHead}>
            <h2 className={styles.h2}>Nothing is handed to you</h2>
            <p className={styles.splitText}>
              What he wanted read first is in plain view. What he didn&apos;t is behind real locks: Recently Deleted, chats hidden behind a secret code,
              photos stuck in iCloud, a note only his birthday opens.
            </p>
          </header>
          <div className={styles.duo}>
            <div className={styles.card}>
              <p className={styles.panelLabel}>Photos · Recently Deleted</p>
              <div className={styles.grid3}>
                {["w-twice", "reel-take", "w-blur"].map((src, i) => (
                  <span key={src}>
                    <Image src={`${R}/${src}.jpg`} alt="" fill sizes="160px" className={styles.cover} />
                    <i>{[25, 28, 25][i]} days</i>
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <p className={styles.panelLabel}>Notes · Agar kuch hua</p>
              <div className={styles.otp}>
                <span className={styles.otpLock}>This note is locked.</span>
                <span className={styles.otpBoxes}>
                  <i>•</i>
                  <i>•</i>
                  <i data-on />
                  <i />
                </span>
                <span className={styles.otpHint}>Hint: birthday · ddmm</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.split}>
          <header className={styles.splitHead}>
            <h2 className={styles.h2}>Say it. Then prove it.</h2>
            <p className={styles.splitText}>
              The case file asks one question at a time. You finish the sentence, then put down what on his phone shows it. Get a word wrong and it tells
              you which one, and where the right one is.
            </p>
          </header>
          <div className={styles.caseShot}>
            <p className={styles.caseQ}>Who is “S”, and where is he running to?</p>
            <p className={styles.caseSentence}>
              S is <u>Sameer Khurrana</u>, a <u data-wrong>DJ</u>, and tomorrow afternoon he&apos;s on a train to <u>Mumbai</u>.
            </p>
            <p className={styles.caseBad}>“DJ” isn&apos;t what the phone shows. The right word is on his phone: look in Instagram or Mail.</p>
            <span className={styles.chips}>
              <i>wedding planner</i>
              <i>wedding photographer</i>
              <i data-off>DJ</i>
            </span>
          </div>
        </section>

        <section className={styles.split} id="chapters">
          <header className={styles.splitHead}>
            <h2 className={styles.h2}>Chapters</h2>
            <p className={styles.splitText}>Every chapter is a different phone, in a different Indian city, and a whole story on its own. Start with the first.</p>
          </header>
          <div className={styles.chapters}>
            <article className={styles.chapter}>
              <div className={styles.chapterArt}>
                <Image
                  src={`${R}/key-lawn.jpg`}
                  alt="The back lawn of a Delhi farmhouse after midnight: fairy lights in the mango trees, chairs knocked over, a light panel face down beside an empty tripod."
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.cover}
                />
              </div>
              <div className={styles.chapterBody}>
                <p className={styles.mono}>Chapter 01 · {raakh.city}</p>
                <h3 className={styles.chapterTitle}>Raakh</h3>
                <p className={styles.body}>{raakh.logline}</p>
                <p className={styles.small}>{raakh.note}</p>
                <ChapterStatus id="raakh" cta="Open the parcel" primary />
              </div>
            </article>
            <article className={styles.chapter}>
              <div className={styles.chapterArt}>
                <Image src="/found/lastlocal/wallpaper.jpg" alt="Mumbai's sea link at night." fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.cover} />
              </div>
              <div className={styles.chapterBody}>
                <p className={styles.mono}>Chapter 02 · {local.city}</p>
                <h3 className={styles.chapterTitle}>Last Local</h3>
                <p className={styles.body}>{local.logline}</p>
                <p className={styles.small}>{local.note}</p>
                <ChapterStatus id="lastlocal" cta="Pick it up" />
              </div>
            </article>
          </div>
          <p className={styles.next}>
            <span className={styles.mono}>Chapter 03</span> A different object, another city. Being found.
          </p>
          <div className={styles.yours}>
            <YourCases />
          </div>
        </section>

        <section className={styles.split} id="faq">
          <header className={styles.splitHead}>
            <h2 className={styles.h2}>Questions</h2>
            <p className={styles.splitText}>Before you open it.</p>
          </header>
          <dl className={styles.faq}>
            {FAQ.map(([q, a]) => (
              <div key={q} className={styles.qa}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.final}>
          <h2 className={styles.finalTitle}>
            It&apos;s 11:40 PM.
            <br />
            <span>It isn&apos;t your phone.</span>
          </h2>
          <ChapterStatus id="raakh" cta="Open Chapter 1" primary />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Mark size={16} />
            <p>Interactive fiction. Every person, company and number in it is invented. Made in India.</p>
          </div>
          <div className={styles.footerCol}>
            <b>Chapters</b>
            <Link href={raakh.href}>01 · Raakh</Link>
            <Link href={local.href}>02 · Last Local</Link>
          </div>
          <div className={styles.footerCol}>
            <b>The game</b>
            <a href="#how">How it works</a>
            <a href="#faq">Questions</a>
          </div>
          <div className={styles.footerCol}>
            <b>If you need it</b>
            <a href="tel:14416">Tele-MANAS · 14416</a>
            <a href="tel:112">Emergency · 112</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
