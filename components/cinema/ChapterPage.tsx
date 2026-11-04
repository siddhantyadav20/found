import type { Credit, Reel } from "@/content/site";
import { REELS } from "@/content/site";
import Arrow from "./Arrow";
import ChapterGallery from "./ChapterGallery";
import ChapterPlay, { Jump, PlayNow } from "./ChapterPlay";
import ChapterReviews from "./ChapterReviews";
import { SiteLink } from "./Chrome";
import ExploreFace from "./ExploreFace";
import Footer from "./Footer";
import { Group, Parallax } from "./Motion";
import Tag from "./Tag";
import styles from "./ChapterPage.module.css";

/* ===========================================================================
   A chapter's page (2026-11-01), 1:1 with a film's page on siena.film, top to
   bottom. Where they had a trailer there's the way into the game; where they
   had festival laurels, what's waiting on the phone; where they had investors,
   what's in it. Nothing here gives the ending away.
   =========================================================================== */

function Name({ credit, size }: { credit: Credit; size: "large" | "medium" | "small" }) {
  return (
    <div className={styles.credit} data-size={size}>
      <div className={styles.eyebrow}>{credit[0]}</div>
      <div className={styles.creditName}>{credit[1]}</div>
    </div>
  );
}

export default function ChapterPage({ item }: { item: Reel }) {
  const { more } = item;
  const next = REELS[(REELS.indexOf(item) + 1) % REELS.length];
  const crew = [more.crew.slice(0, 2), more.crew.slice(2)];
  const apps = Array.from({ length: 5 }, () => more.apps);
  const { hero } = item;
  const place = REELS.indexOf(item) + 1;
  const clockParts = hero.clock.time.split(":");

  return (
    <main className={styles.page}>
      {/* The hero (2026-11-05): an editorial poster on black. The figure stands
          right of centre, one line is set big on the left, the clock the story
          runs against sits on the right, and the ways on are along the bottom. */}
      <Group as="section" className={styles.hero} delay={0.4}>
        <div className={styles.heroFigure} data-a="alpha">
          <Parallax src={item.tall} className={styles.heroPicture} />
        </div>

        <div className={styles.heroMark}>
          <span className={styles.eyebrow} data-a="alpha">
            {item.eyebrow}
          </span>
          <h1 className={styles.heroName}>
            <span className={styles.clip}>
              <span data-a="item">{item.title}</span>
            </span>
          </h1>
          <span className={styles.heroDash} data-a="line" />
        </div>

        <SiteLink href="/chapters" className={styles.back}>
          <Arrow to="left" />
          All chapters
        </SiteLink>

        <div className={styles.heroIndex} data-a="alpha" aria-label={`Chapter ${place} of ${REELS.length}`}>
          <span>{place}</span>
          <i />
          <span>{REELS.length}</span>
        </div>

        <p className={styles.headline}>
          {hero.headline.map((line) => (
            <span key={line} className={styles.clip}>
              <span data-a="item">{line}</span>
            </span>
          ))}
        </p>

        <div className={styles.clock}>
          <div className={styles.clockTime} data-a="alpha">
            <svg className={styles.hourglass} viewBox="0 0 14 20" fill="currentColor" aria-hidden="true">
              <path d="M0 0h14v2h-1.5c0 3.4-2 5.6-4 8 2 2.4 4 4.6 4 8H14v2H0v-2h1.5c0-3.4 2-5.6 4-8-2-2.4-4-4.6-4-8H0V0Zm3.5 2c0 2.5 1.5 4.3 3.5 6.6C9 6.3 10.5 4.5 10.5 2h-7Zm3.5 9.4C5 13.7 3.5 15.5 3.5 18h7c0-2.5-1.5-4.3-3.5-6.6Z" />
            </svg>
            {clockParts[0]}
            <span className={styles.clockColon}>:</span>
            {clockParts[1]}
          </div>
          <span className={styles.clockRule} data-a="line" />
          <span className={styles.clockCaption} data-a="alpha">
            {hero.clock.caption}
          </span>
        </div>

        <div className={styles.cue} data-a="alpha">
          <span className={styles.cueLength}>{item.ticket[2]} min</span>
          <p className={styles.cueText}>
            {hero.tagline[0]}
            <br />
            {hero.tagline[1]}
          </p>
          <span className={styles.cueRule} />
          <Jump to={item.trailer ? "trailer" : "credits"} className={styles.down} label="Down the page">
            <Arrow to="down" />
          </Jump>
        </div>

        <div className={styles.heroBar} data-a="alpha">
          <div className={styles.heroBarSide}>
            <span className={styles.barNote}>{item.badge.headline}</span>
            <span className={styles.barNote} data-quiet>
              Free, in your browser
            </span>
            <PlayNow item={item} className={styles.heroPlay} />
          </div>
          <div className={styles.heroBarSide}>
            {item.trailer && (
              <Jump to="trailer" className={styles.barLink}>
                Watch the trailer · {item.trailer.length}
              </Jump>
            )}
          </div>
        </div>
      </Group>

      <div data-color="white" className={styles.white}>
        <ChapterPlay item={item} />

        <section id="credits" className={styles.credits}>
          <Group className={styles.leadCard}>
            <div className={styles.leadImage} data-a="alpha">
              {/* eslint-disable-next-line @next/next/no-img-element -- a still behind a tint */}
              <img src={more.lead.still} alt="" loading="lazy" />
            </div>
            <div className={styles.leadText}>
              <div className={styles.eyebrow}>{more.lead.role}</div>
              <div className={styles.leadName}>{more.lead.name}</div>
            </div>
          </Group>
          <Group className={styles.creditGrid}>
            <div className={styles.creditRow} data-tone="black" data-a="alpha">
              <div className={styles.creditCols}>
                {more.pair.map((c) => (
                  <Name key={c[0]} credit={c} size="large" />
                ))}
              </div>
            </div>
            <div className={styles.creditRow} data-a="alpha">
              <div className={styles.creditHead} data-cols="3">
                {more.trio.map((c) => (
                  <div key={c[0]} className={styles.eyebrow}>
                    {c[0]}
                  </div>
                ))}
              </div>
              <div className={styles.creditCells} data-cols="3">
                {more.trio.map((c) => (
                  <div key={c[0]} className={styles.credit} data-size="medium">
                    <div className={styles.creditName}>{c[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.creditRow} data-a="alpha">
              <div className={styles.creditHead}>
                <div className={styles.eyebrow}>{more.crewTitle}</div>
              </div>
              <div className={styles.creditCells}>
                {crew.map((row, r) => (
                  <div key={r} className={styles.creditWrap}>
                    {row.map((c) => (
                      <Name key={c[0]} credit={c} size="small" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Group>
        </section>
      </div>

      <section className={styles.footage}>
        <Tag>Gallery</Tag>
        <ChapterGallery frames={more.frames} />
      </section>

      <section className={styles.full}>
        <Tag>{item.reviews[0].stars ? "Reviews" : "Lock screen"}</Tag>
        <ChapterReviews reviews={item.reviews} />
      </section>

      <div data-color="white" className={styles.white}>
        <section className={styles.prizes}>
          <div className={styles.wall}>
            <Parallax src={more.appsStill} amount={3} className={styles.wallImage} />
            <span className={styles.wallShade} />
            <div className={styles.wallRoll}>
              {apps.map((list, copy) => (
                <ul
                  key={copy}
                  className={styles.wallList}
                  aria-hidden={copy > 0 || undefined}
                  style={{ animationDuration: `${list.length * 2}s` }}
                >
                  {list.map(([chip, app]) => (
                    <li key={app} className={styles.wallItem}>
                      <span className={styles.eyebrow}>{app}</span>
                      <span className={styles.wallChip}>{chip}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.warning}>
          <h2 className={styles.warningHead}>What&apos;s in it</h2>
          <p className={styles.warningText}>{more.warning}</p>
          <p className={styles.warningText}>{item.note}</p>
        </section>

        <section className={styles.next}>
          <SiteLink href="/chapters" className={styles.allChapters}>
            <span className={styles.eyebrow}>Showcase</span>
            <span className={styles.allName}>All chapters</span>
            <span className={styles.allMore}>
              <span className={styles.eyebrow}>Explore</span>
              <Arrow small tone="black" />
            </span>
          </SiteLink>
          <SiteLink href={next.page} className={styles.nextCard}>
            <span className={styles.nextText}>
              <span className={styles.holes} aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
              <span className={styles.eyebrow}>Next chapter</span>
              <span className={styles.nextName}>{next.title}</span>
              <span className={styles.nextFace} data-btn="explore">
                <ExploreFace label="EXPLORE" />
              </span>
            </span>
            <span className={styles.nextImage}>
              {/* eslint-disable-next-line @next/next/no-img-element -- scaled by hover */}
              <img src={next.still} alt="" loading="lazy" />
              <span className={styles.holes} data-right aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
            </span>
          </SiteLink>
        </section>
      </div>

      <Footer />
    </main>
  );
}
