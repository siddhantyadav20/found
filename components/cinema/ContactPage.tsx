"use client";

import Coffee from "@/components/site/Coffee";
import { CONTACT } from "@/content/pages";
import Arrow from "./Arrow";
import { Group, Rollover } from "./Motion";
import { Sent, useNotify } from "./Notify";
import styles from "./ContactPage.module.css";

/* ===========================================================================
   Contact (2026-11-01), 1:1 with siena.film/contact: the red page and its
   departure-board headline. Found publishes no address, so the first row takes
   one instead, and it reaches Siddhant through /api/notify.
   =========================================================================== */

export default function ContactPage() {
  const { value, setValue, status, send } = useNotify("talk");

  return (
    <main className={styles.page}>
      <Group className={styles.head} delay={0.4}>
        <h2 className={styles.eyebrow}>
          <span data-a="alpha">{CONTACT.eyebrow}</span>
        </h2>
        <h1 className={styles.headline} aria-label={CONTACT.headline.join(" ")}>
          <span className={styles.rule} data-a="line" />
          {CONTACT.headline.map((line, i) => (
            <span key={line} aria-hidden="true">
              <span className={styles.line}>
                <Rollover text={line} delay={0.2 + i * 0.1} />
              </span>
              <span className={styles.rule} data-a="line" />
            </span>
          ))}
        </h1>
      </Group>

      <Group className={styles.rows} delay={0.8}>
        <div className={styles.row} data-a="alpha">
          <span className={styles.rule} />
          <form className={styles.item} onSubmit={send}>
            <label htmlFor="note" className={styles.label}>
              {CONTACT.inquiries}
            </label>
            {status.state === "done" ? (
              <Sent>
                <span className={styles.value}>{CONTACT.thanks}</span>
              </Sent>
            ) : (
              <>
                <input
                  id="note"
                  className={styles.field}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={CONTACT.placeholder}
                  autoComplete="email"
                  required
                />
                <button type="submit" className={styles.send} aria-label="Send" disabled={status.state === "sending"}>
                  <Arrow tone="black" />
                </button>
              </>
            )}
          </form>
          <span className={styles.rule} />
          {status.state === "error" && (
            <p className={styles.error} role="alert">
              {status.message}
            </p>
          )}
        </div>
        <div className={styles.row} data-a="alpha">
          <span className={styles.rule} />
          <div className={styles.item}>
            <span className={styles.label}>{CONTACT.coffee}</span>
            <Coffee className={styles.coffee}>{CONTACT.coffeeCta}</Coffee>
          </div>
          <span className={styles.rule} />
        </div>
      </Group>
    </main>
  );
}
