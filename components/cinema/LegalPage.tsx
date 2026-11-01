import type { LegalPage as Legal } from "@/content/pages";
import Footer from "./Footer";
import styles from "./LegalPage.module.css";

/** Cookies, Terms and Privacy: the one plain page, ending on the footer. */
export default function LegalPage({ page }: { page: Legal }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <article className={styles.text}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.updated}>Last updated {page.updated}</p>
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h3 className={styles.heading}>{s.heading}</h3>
              {s.body.map((p) => (
                <p key={p} className={styles.body}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </section>
      <Footer />
    </main>
  );
}
