import type { Credit, Reel } from "@/content/site";
import { REELS } from "@/content/site";
import Arrow from "./Arrow";
import ChapterGallery from "./ChapterGallery";
import ChapterPlay from "./ChapterPlay";
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

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Parallax src={item.still} className={styles.heroPicture} />
          <span className={styles.heroShade} />
          <SiteLink href="/chapters" className={styles.back}>
            <Arrow to="left" />
            All chapters
          </SiteLink>
        </div>
        <Group className={styles.heroText} delay={0.4} data-color="white">
          <div className={styles.eyebrow} data-a="alpha">
            {item.eyebrow}
          </div>
          <div className={styles.titleWrap}>
            <span className={styles.rule} data-a="line" />
            <h1 className={styles.title}>
              <span className={styles.clip}>
                <span data-a="item">{item.title}</span>
              </span>
            </h1>
            <span className={styles.rule} data-a="line" />
          </div>
          <span className={styles.down} data-a="alpha">
            <Arrow to="down" tone="black" />
          </span>
        </Group>
      </section>

      <div data-color="white" className={styles.white}>
        <ChapterPlay item={item} />

        <section className={styles.credits}>
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
