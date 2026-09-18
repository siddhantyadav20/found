"use client";

import type { ReactNode } from "react";

import styles from "./ios/App.module.css";
import AppBar, { Chevron } from "./ios/AppBar";

/* ===========================================================================
   The chrome every app shares, as current iOS draws it: the pilot's app bar
   (a glass back circle carrying `data-back`, so every screen with one can be
   swiped away), a large title the body scrolls under, and inset grouped
   lists. Each app adds only what is its own.
   =========================================================================== */

export default function AppView({
  title,
  onBack,
  bare,
  own,
  whole,
  children,
}: {
  title: string;
  onBack: () => void;
  /** An app that brings its own navigation and scrolls itself. */
  bare?: boolean;
  /** An app that draws its own screens, bars and all. */
  own?: boolean;
  /** An app that is its own section, bar included: Photos. */
  whole?: boolean;
  children: ReactNode;
}) {
  if (whole) return <>{children}</>;

  if (own)
    return (
      <section className={styles.view} aria-label={title}>
        <AppBar onBack={onBack} backLabel="Home" />
        {children}
      </section>
    );

  return (
    <section className={styles.view} aria-label={title}>
      <AppBar title={bare ? title : ""} onBack={onBack} backLabel="Home" />
      {bare ? (
        children
      ) : (
        <div className={styles.body}>
          <h2 className={styles.big}>{title}</h2>
          {children}
        </div>
      )}
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
      {onClick && <Chevron />}
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
