"use client";

import { useState, type ReactNode } from "react";

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

  if (bare)
    return (
      <section className={styles.view} aria-label={title}>
        <AppBar title={title} onBack={onBack} backLabel="Home" />
        {children}
      </section>
    );

  return (
    <Page title={title} large onBack={onBack} backLabel="Home" root>
      {children}
    </Page>
  );
}

/**
 * One screen of an app, as iOS 26 draws it: a bar with the glass back circle,
 * the title in the middle and any actions at the end; a body that scrolls
 * under it; and, on a top-level screen, the large title, which hands over to
 * the bar's small one as it scrolls away. A screen pushed on top of another
 * slides in from the right.
 */
export function Page({
  title,
  large = false,
  onBack,
  backLabel = "Back",
  end,
  root = false,
  tabbed = false,
  onTitle,
  tint,
  children,
}: {
  title: string;
  large?: boolean;
  onBack?: () => void;
  backLabel?: string;
  end?: ReactNode;
  /** The app's first screen: it opens out of the icon rather than sliding in. */
  root?: boolean;
  /** Room at the bottom for a floating tab bar. */
  tabbed?: boolean;
  onTitle?: () => void;
  /** The app's own colour, which iOS 26 gives the glyphs on its glass buttons (Notes' yellow). */
  tint?: string;
  children: ReactNode;
}) {
  const [under, setUnder] = useState(false);
  return (
    <section
      className={styles.view}
      data-push={root ? undefined : ""}
      aria-label={title}
      style={tint ? ({ "--tint": tint } as React.CSSProperties) : undefined}
    >
      <AppBar title={title} hideTitle={large && !under} onBack={onBack} backLabel={backLabel} end={end} onTitle={onTitle} />
      <div className={styles.body} data-tabbed={tabbed || undefined} onScroll={(e) => setUnder(e.currentTarget.scrollTop > 38)}>
        {large && <h2 className={styles.big}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

/** iOS 26's search field: a capsule with the magnifier, the prompt and the microphone. It only sets the scene here. */
export function SearchField({ prompt = "Search" }: { prompt?: string }) {
  return (
    <div className={styles.search} aria-hidden="true">
      <svg viewBox="0 0 16 16" className={styles.searchGlass}>
        <circle cx="6.8" cy="6.8" r="4.9" />
        <path d="m10.5 10.5 3.8 3.8" />
      </svg>
      <span>{prompt}</span>
      <svg viewBox="0 0 16 16" className={styles.searchMic}>
        <rect x="5.4" y="1.5" width="5.2" height="8.6" rx="2.6" />
        <path d="M3.3 7.6a4.7 4.7 0 0 0 9.4 0M8 12.3v2.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** A tab in a tab bar: its SF-style glyph (a 24-unit path, filled), its label, and whether it's the one open. */
export type Tab = { readonly label: string; readonly d: string; readonly on?: boolean; readonly badge?: number };

/**
 * iOS 26's tab bar: a capsule of glass floating over the content, the open
 * tab on a lighter lozenge in the app's tint, and search, when the app has
 * it, in its own glass circle beside it. Only the open tab answers here; the
 * others are the furniture of the real app.
 */
export function TabBar({
  tabs,
  search = false,
  tint = "#0a84ff",
  onSelect,
}: {
  tabs: readonly Tab[];
  search?: boolean;
  tint?: string;
  /** Tabs that go somewhere: without it the bar only sets the scene. */
  onSelect?: (label: string) => void;
}) {
  return (
    <div className={styles.tabBar} aria-hidden={onSelect ? undefined : true}>
      <span className={`${styles.tabs} lg`} style={{ "--tint": tint } as React.CSSProperties}>
        {tabs.map((t) => {
          const inside = (
            <>
              <svg viewBox="0 0 24 24">
                <path d={t.d} fillRule="evenodd" />
              </svg>
              {t.label}
              {t.badge ? <span className={styles.tabBadge}>{t.badge}</span> : null}
            </>
          );
          return onSelect ? (
            <button key={t.label} type="button" className={styles.tab} data-on={t.on || undefined} aria-pressed={t.on} onClick={() => onSelect(t.label)}>
              {inside}
            </button>
          ) : (
            <span key={t.label} className={styles.tab} data-on={t.on || undefined}>
              {inside}
            </span>
          );
        })}
      </span>
      {search && (
        <span className={`${styles.tabSearch} lg`}>
          <svg viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.1" />
            <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </div>
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
