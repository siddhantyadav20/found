import type { ReactNode } from "react";

import Title from "./Title";
import styles from "./PageShell.module.css";

/** A page that's set up and waiting for its design: the nav works, the rest is to come. */
export default function PageShell({
  eyebrow,
  title,
  red = false,
  children,
}: {
  eyebrow: string;
  title: string;
  red?: boolean;
  children?: ReactNode;
}) {
  return (
    <main className={styles.shell} data-red={red || undefined}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <Title text={title} />
      {children}
    </main>
  );
}
