import styles from "./Tag.module.css";

/** The small cream ticket a section's name is printed on. */
export default function Tag({ children, tight = false }: { children: string; tight?: boolean }) {
  return (
    <div className={styles.wrap} data-tight={tight || undefined}>
      <div className={styles.ticket}>
        <div className={styles.body}>
          <h2 className={styles.text}>{children}</h2>
          <span className={styles.tear} />
        </div>
        <div className={styles.holes} aria-hidden="true">
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}
