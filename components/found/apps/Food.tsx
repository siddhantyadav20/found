"use client";

import { useStory } from "@/components/found/StoryContext";
import { refuse } from "@/lib/found/buzz";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Food.module.css";

/**
 * A food app, because everyone has one: a cake for Tara, chai on Tuesday
 * night. A third-party app with its own orange, light like the real ones, so
 * the status bar turns dark over it. Reorder only buzzes: it isn't your
 * account to spend.
 */
export default function Food({ state }: AppProps) {
  const ep = useStory();
  return (
    <section className={`${app.view} ${styles.light}`} data-light-app>
      <header className={styles.top}>
        <span className={styles.brand}>dabba</span>
        <span className={styles.where}>Delivering to {state.cast.name}</span>
      </header>
      <div className={app.body}>
        <p className={styles.section}>Past orders</p>
        <ul className={styles.list}>
          {ep.food.map((o) => (
            <li key={o.at} className={styles.order}>
              <span className={styles.main}>
                <span className={styles.item}>{o.item}</span>
                <span className={styles.meta}>
                  {o.to} · {o.at}
                </span>
                <span className={styles.meta}>Paid by {state.cast.name}</span>
              </span>
              <span className={styles.side}>
                <span className={styles.price}>{o.price}</span>
                <button type="button" className={styles.reorder} onClick={() => refuse()}>
                  Reorder
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
