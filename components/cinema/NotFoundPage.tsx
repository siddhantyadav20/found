import { NOT_FOUND } from "@/content/pages";
import Chrome, { SiteLink } from "./Chrome";
import ExploreFace from "./ExploreFace";
import Footer from "./Footer";
import { Group, Rollover } from "./Motion";
import styles from "./NotFoundPage.module.css";

/** A wrong turn, on three ticket stubs. */
export default function NotFoundPage() {
  return (
    <Chrome>
      <main className={styles.page}>
        <Group as="section" className={styles.section} delay={1}>
          <h1 className={styles.heading} aria-label={`404. ${NOT_FOUND.line}`}>
            <span className={styles.numbers} aria-hidden="true">
              <span className={styles.number}>
                <Rollover text="4" delay={0.3} className={styles.digit} />
              </span>
              <span className={styles.number}>
                <Rollover text="0" delay={0.4} className={styles.digit} />
              </span>
              <span className={styles.number}>
                <Rollover text="4" delay={0.5} className={styles.digit} />
              </span>
            </span>
            <span className={styles.lines} aria-hidden="true">
              <span className={styles.rule} data-a="line" />
              <span className={styles.clip}>
                <span data-a="item">{NOT_FOUND.note}</span>
              </span>
              <span className={styles.rule} data-a="line" />
              <span className={styles.clip}>
                <span data-a="item">{NOT_FOUND.line}</span>
              </span>
              <span className={styles.rule} data-a="line" />
            </span>
          </h1>
          <div data-a="alpha">
            <SiteLink href="/" className={styles.explore} data-btn="explore">
              <ExploreFace label="EXPLORE" />
            </SiteLink>
          </div>
        </Group>
        <Footer bare />
      </main>
    </Chrome>
  );
}
