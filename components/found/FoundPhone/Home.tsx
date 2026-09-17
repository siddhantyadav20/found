"use client";

import { useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { AppId, HomeIcon } from "@/content/found/types";
import { deductionOpen, sessionVars, type CaseState } from "@/lib/found/engine";
import { say } from "@/lib/found/voice";
import type { Nav } from "../apps/types";
import { AppGlyph } from "./icons";
import styles from "./Home.module.css";

/** Low Battery's two pages, like any phone: what gets used, and what got installed once and forgotten. */
const PAGES: HomeIcon[][] = [
  [
    { app: "health", label: "Health" },
    { app: "memos", label: "Voice Memos" },
    { app: "calculator", label: "Calculator" },
    { app: "settings", label: "Settings" },
    { app: "news", label: "News" },
    { app: "nightcam", label: "NightCam" },
  ],
  [
    { app: "guardian", label: "Guardian" },
    { app: "food", label: "Dabba" },
  ],
];

const DOCK: HomeIcon[] = [
  { app: "messages", label: "Messages" },
  { app: "photos", label: "Photos" },
  { app: "maps", label: "Maps" },
  { app: "notes", label: "Case file" },
];

/**
 * The home screen, with one addition a real phone wouldn't have: the widget
 * at the top is the player's open question. It's the quiet answer to "what
 * am I supposed to be doing", and it's always one tap from the case file.
 * Page two is where Mum's app has sat since 2021.
 *
 * It stays mounted under an open app (`covered`): pushed back, dimmed and
 * out of reach, so that pulling the app away shows it, as a phone does.
 */
export default function Home({
  state,
  nav,
  badges,
  covered = false,
}: {
  state: CaseState;
  nav: Nav;
  /** What each app is carrying that hasn't been looked at. A real phone's badges. */
  badges: Partial<Record<AppId, number>>;
  covered?: boolean;
}) {
  const ep = useStory();
  const [page, setPage] = useState(0);
  const open = [...ep.deductions].reverse().find((d) => deductionOpen(state, d));
  // A story lays out its own phone; Low Battery's is the default.
  const pages = ep.home?.pages ?? PAGES;
  const dock = ep.home?.dock ?? DOCK;

  return (
    <div className={styles.home} data-covered={covered || undefined} inert={covered} aria-hidden={covered || undefined}>
      <button type="button" className={styles.widget} onClick={(e) => nav.go("notes", undefined, e.currentTarget.getBoundingClientRect())}>
        <span className={styles.widgetLabel}>{open ? "Open question" : "Case file"}</span>
        <span className={styles.widgetText}>
          {open ? say(open.question, state.cast, sessionVars(ep, state)) : "Look around. What you open, you keep."}
        </span>
      </button>

      <div
        className={styles.pages}
        onScroll={(e) => {
          const el = e.currentTarget;
          setPage(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
      >
        {pages.map((icons, i) => (
          <div key={i} className={styles.page}>
            <div className={styles.grid}>
              {icons.map(({ app, label }) => (
                <Icon key={app} app={app} label={label} badge={badges[app] ?? 0} onOpen={(from) => nav.go(app, undefined, from)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dots} aria-hidden="true">
        {pages.map((_, i) => (
          <span key={i} className={styles.pageDot} data-on={i === page || undefined} />
        ))}
      </div>

      <div className={styles.dock}>
        {dock.map(({ app, label }) => (
          <Icon key={app} app={app} label={label} badge={badges[app] ?? 0} onOpen={(from) => nav.go(app, undefined, from)} />
        ))}
      </div>
    </div>
  );
}

function Icon({
  app,
  label,
  badge = 0,
  onOpen,
}: {
  app: AppId;
  label: string;
  badge?: number;
  onOpen: (from?: DOMRect) => void;
}) {
  return (
    <button
      type="button"
      className={styles.icon}
      // The tile's box, so the app can zoom out of it.
      onClick={(e) => onOpen(e.currentTarget.querySelector("span")?.getBoundingClientRect())}
      aria-label={badge > 0 ? `${label}, ${badge} new` : label}
    >
      <span className={styles.tile}>
        <AppGlyph app={app} />
        {badge > 0 && <span className={styles.badge}>{badge}</span>}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
