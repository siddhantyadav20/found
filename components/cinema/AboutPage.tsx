import Coffee from "@/components/site/Coffee";
import { ABOUT } from "@/content/pages";
import { Arch, FlyGrid, Lean, Scrub } from "./AboutMotion";
import Arrow from "./Arrow";
import { SiteLink } from "./Chrome";
import ExploreFace from "./ExploreFace";
import Footer from "./Footer";
import Logo from "./Logo";
import { Group, Parallax } from "./Motion";
import Tag from "./Tag";
import styles from "./AboutPage.module.css";

/* ===========================================================================
   About (2026-11-01), 1:1 with siena.film/about: arches round the statement,
   the type that drifts apart, the wall of stills, who, how, and on.
   =========================================================================== */

const TITLE_OFFSETS = ["0", "80%", "140%", "70%"];
/* When each part of the type does its moving, as the page passes it. */
const TITLES = { after: 0.02, until: 0.3 };
const SMALL = { "data-after": "0.12", "data-until": "0.42" };
const MEDIUM = { "data-after": "0.22", "data-until": "0.5" };
const LAST = { "data-after": "0.34", "data-until": "0.62" };
const COLUMNS = [
  [-10, 10],
  [20, -20],
  [-10, 10],
];

export default function AboutPage() {
  const { hero, type, grid, who, steps, cta } = ABOUT;

  return (
    <main className={styles.page}>
      <Group as="section" className={styles.hero} delay={0.2}>
        <Arch src={hero.arches[0]} />
        <div className={styles.statement}>
          <svg className={styles.frame} preserveAspectRatio="none" aria-hidden="true">
            <rect x=".5" y=".5" width="99.8%" height="99.8%" rx="12" fill="none" stroke="currentColor" strokeDasharray="5 5" pathLength="1000" />
          </svg>
          <h1 className={styles.statementText}>
            {hero.lead.map((line) => (
              <span key={line} className={styles.small}>
                <span className={styles.clip}>
                  <span data-a="item">{line}</span>
                </span>
                <i data-a="line" />
              </span>
            ))}
            <Lean>
              {hero.big.map((line) => (
                <span key={line} className={styles.big}>
                  <span className={styles.clip}>
                    <span data-a="item">
                      <span data-lean>{line}</span>
                    </span>
                  </span>
                  <i data-a="line" />
                </span>
              ))}
            </Lean>
            {hero.tail.map((line) => (
              <span key={line} className={styles.small}>
                <span className={styles.clip}>
                  <span data-a="item">{line}</span>
                </span>
                <i data-a="line" />
              </span>
            ))}
          </h1>
          <span className={styles.heroDown} data-a="alpha">
            <Arrow to="down" />
          </span>
        </div>
        <Arch src={hero.arches[1]} />
      </Group>

      <Scrub className={styles.type}>
        <div className={styles.titles}>
          {type.titles.map((t, i) => (
            <span key={t} style={{ transform: `translateX(${TITLE_OFFSETS[i]})` }} className={styles.moved}>
              <span data-x="50 0" data-after={String(TITLES.after + i * 0.03)} data-until={TITLES.until} className={styles.moved}>
                {t}
              </span>
            </span>
          ))}
        </div>

        <div className={styles.smallBlock}>
          <div className={styles.smallWrap}>
            {type.small.map((row, r) => (
              <div key={r} className={styles.smallRow}>
                {row.map((word, c) => (
                  <span key={word} data-x={COLUMNS[c].join(" ")} {...SMALL} className={styles.moved}>
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.medium}>
          <div className={styles.mediumFirst}>
            <span data-x="-50 0" {...MEDIUM} className={styles.moved}>
              {type.medium.first[0]}
            </span>
            <span data-x="50 0" {...MEDIUM} className={styles.moved}>
              {type.medium.first[1]}
            </span>
          </div>
          <div className={styles.mediumSecond}>
            <span data-x="50 0" {...MEDIUM} className={styles.moved}>
              {type.medium.second[0]}
            </span>
            <i data-sx="2 1" data-x="-20 0" {...MEDIUM} />
            <span data-x="20 0" {...MEDIUM} className={styles.moved}>
              {type.medium.second[1]}
            </span>
          </div>
        </div>

        <div className={styles.xlRow}>
          <span data-x="-50 0" {...LAST} className={styles.xl}>
            {type.xl}
          </span>
          <div className={styles.side}>
            {type.side.map((t, i) => (
              <span key={t} data-x={i === 1 ? "-20 0" : "50 0"} {...LAST} className={styles.moved}>
                {t}
              </span>
            ))}
            <div className={styles.block} data-x="20 0" data-y="-200 0" {...LAST}>
              {type.block.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
        </div>
      </Scrub>

      <FlyGrid images={grid} />

      <section className={styles.who}>
        <Tag>Who</Tag>
        <Group className={styles.team}>
          <article className={styles.member}>
            <div className={styles.memberImage} data-paper>
              <Logo className={styles.memberLogo} />
            </div>
            <div className={styles.memberText}>
              <p className={styles.eyebrow}>{who.eyebrow}</p>
              <h3 className={styles.memberName}>{who.name}</h3>
              <p className={styles.bio}>{who.bio}</p>
            </div>
          </article>
          <article className={styles.member}>
            <div className={styles.memberImage}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a still, in black and white */}
              <img src={who.coffeeStill} alt="" loading="lazy" />
            </div>
            <div className={styles.memberText}>
              <p className={styles.eyebrow}>{who.coffeeEyebrow}</p>
              <h3 className={styles.memberName}>
                <Coffee className={styles.coffee}>{who.coffeeTitle}</Coffee>
              </h3>
              <p className={styles.bio}>{who.coffeeBio}</p>
            </div>
          </article>
        </Group>
      </section>

      <section className={styles.how}>
        <Tag>How it plays</Tag>
        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.label} className={styles.step}>
              <div className={styles.stepHead}>{s.label}</div>
              <div className={styles.stepRow}>
                <h3 className={styles.stepTitle}>
                  {s.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaFrame}>
          <Parallax src={cta.still} amount={3} className={styles.ctaImage} />
          <span className={styles.ctaShade} />
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>{cta.title}</h2>
            <SiteLink href="/chapters" className={styles.ctaLink} data-btn="explore">
              <ExploreFace label="EXPLORE" />
            </SiteLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
