import s from "./Site.module.css";

/* Questions, each a glass row that opens in place (2026-10-25). */

export default function Faq({ items, title = "Before you open it." }: { items: readonly (readonly [q: string, a: string])[]; title?: string }) {
  return (
    <section className={`${s.wrap} ${s.faqGrid}`} id="faq" aria-labelledby="faq-title">
      <header className={s.head}>
        <p className={s.eyebrow}>Questions</p>
        <h2 id="faq-title" className={s.h2}>
          {title}
        </h2>
      </header>
      <div className={s.faq}>
        {items.map(([q, a], i) => (
          <details key={q} className={`${s.glass} ${s.qa}`} name="faq" open={i === 0 || undefined}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
