import type { LegalPage as Legal } from "@/content/pages";
import Footer from "./Footer";
import { Group } from "./Motion";
import styles from "./LegalPage.module.css";

/** Cookies, Terms and Privacy: the one plain page, ending on the footer. */
export default function LegalPage({ page }: { page: Legal }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Group as="article" className={styles.text} delay={0.2}>
          <h1 className={styles.title} data-a="rise">
            {page.title}
          </h1>
          <p className={styles.updated} data-a="rise">
            Last updated {page.updated}
          </p>
          {page.sections.map((s) => (
            <section key={s.heading} data-a="rise">
              <h3 className={styles.heading}>{s.heading}</h3>
              {s.body.map((p) => (
                <p key={p} className={styles.body}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </Group>
      </section>
      <Footer />
    </main>
  );
}
