"use client";

import type { ReactNode } from "react";

import styles from "./ios/App.module.css";

/* The chrome every app shares, as current iOS draws it: a glass back button,
   a large title that the body scrolls under, and inset grouped lists. Each
   app adds only what is its own. */

export default function AppView({
  title,
  onBack,
  bare,
  children,
}: {
  title: string;
  onBack: () => void;
  /** An app that brings its own bar and scrolls itself: WhatsApp, Photos. */
  bare?: boolean;
  children: ReactNode;
}) {
  if (bare)
    return (
      <section className={styles.view} aria-label={title}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
            <svg viewBox="0 0 10 17" aria-hidden="true">
              <path d="M8.5 1.5 2 8.5l6.5 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className={styles.title}>{title}</span>
          <span className={styles.barEnd} />
        </header>
        {children}
      </section>
    );

  return (
    <section className={styles.view} aria-label={title}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
          <svg viewBox="0 0 10 17" aria-hidden="true">
            <path d="M8.5 1.5 2 8.5l6.5 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={styles.title}>{title}</span>
        <span className={styles.barEnd} />
      </header>
      <div className={styles.body}>
        <h2 className={styles.big}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** An inset grouped list, iOS's own shape for "rows of facts". */
export function Group({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <>
      {label && <p className={styles.groupLabel}>{label}</p>}
      <div className={styles.group}>{children}</div>
    </>
  );
}

export function Row({
  title,
  sub,
  meta,
  onClick,
}: {
  title: ReactNode;
  sub?: ReactNode;
  meta?: ReactNode;
  onClick?: () => void;
}) {
  const inside = (
    <>
      <span className={styles.rowMain}>
        <span className={styles.rowTitle}>{title}</span>
        {sub && <span className={styles.rowSub}>{sub}</span>}
      </span>
      {meta && <span className={styles.rowMeta}>{meta}</span>}
      {onClick && (
        <svg className={styles.chev} viewBox="0 0 7 12" aria-hidden="true">
          <path d="M1 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </>
  );
  return onClick ? (
    <button type="button" className={styles.row} onClick={onClick}>
      {inside}
    </button>
  ) : (
    <div className={styles.row}>{inside}</div>
  );
}
