"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LEGAL_LINKS, NAV_LINKS, REELS } from "@/content/site";
import { SiteLink, useGo } from "./Chrome";
import Logo from "./Logo";
import { reel, useReel } from "./reel";
import { hoverTick, menuTick } from "./sounds";
import styles from "./Nav.module.css";

/* ===========================================================================
   The ticket, top right (2026-10-31), 1:1 with siena.film. The stub shows the
   chapter on the reel and opens the list of chapters; the square beside it is
   the menu. Both panels unroll from under the ticket. Opening one while the
   other is open closes first and opens after 550ms; anything that moves the
   reel closes them, and so does a click anywhere else.
   =========================================================================== */

type Panel = "list" | "main";
type Route = "home" | "chapters" | "chapter" | "contact" | "page";

const SWAP_MS = 550;
/** The ticket waits for the reel to land before it changes. */
const SETTLE_MS = 800;

function Socials() {
  // No public accounts yet: the icons hold their place and go nowhere.
  return (
    <ul className={styles.socials} aria-hidden="true">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.2c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.5-1-3.4-1.6-5.5-1.7l1-4.5 3.1.7a1.6 1.6 0 1 0 .2-1l-3.6-.8c-.3 0-.5.1-.6.4l-1.1 5.2c-2.1.1-4.1.7-5.6 1.7a2.2 2.2 0 1 0-2.5 3.6l-.1.8c0 3.3 3.9 6 8.7 6s8.7-2.7 8.7-6l-.1-.8c.7-.4 1.2-1.2 1.2-2ZM7.5 13.8a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0Zm8.9 4.2c-1 .9-2.6 1-4.4 1s-3.4-.1-4.4-1a.5.5 0 0 1 .7-.7c.7.6 2 .8 3.7.8s3-.2 3.7-.8a.5.5 0 0 1 .7.7Zm-.3-2.6a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" />
        </svg>
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.5l4.4 5.9L17.6 3Zm-1.1 16.2h1.7L7.1 4.7H5.3l11.2 14.5Z" />
        </svg>
      </li>
    </ul>
  );
}

export default function Nav({ route }: { route: Route }) {
  const go = useGo();
  const { index } = useReel();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [shown, setShown] = useState(index);
  const swap = useRef(0);

  const film = route === "home" || route === "chapters" || route === "chapter";
  const variant = film ? "film" : route === "contact" ? "contact" : "about";

  const close = useCallback(() => {
    window.clearTimeout(swap.current);
    setPanel(null);
  }, []);

  const toggle = (next: Panel) => {
    menuTick();
    window.clearTimeout(swap.current);
    if (panel === next) setPanel(null);
    else if (panel) {
      setPanel(null);
      swap.current = window.setTimeout(() => setPanel(next), SWAP_MS);
    } else setPanel(next);
  };

  useEffect(() => {
    const t = window.setTimeout(() => setShown(index), SETTLE_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  // Moving anything closes the menu, and Escape does what it always does.
  useEffect(() => {
    if (!panel) return;
    const onReel = () => reel.get().moving && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const off = reel.subscribe(onReel);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      off();
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [panel, close]);

  const select = (i: number) => {
    menuTick();
    close();
    if (route === "home") reel.goTo(i);
    else go(REELS[i].page);
  };

  return (
    <header className={styles.nav} data-panel={panel ?? undefined} data-variant={variant}>
      {panel && <div className={styles.catcher} onClick={close} />}
      <div className={styles.mobileBg} />

      <SiteLink href="/" className={styles.logo} aria-label="Found, home" onClick={close} data-cursor="hide">
        <Logo className={styles.wordmark} />
        <span className={styles.logoLine}>Thriller Game</span>
      </SiteLink>

      <div className={styles.menu} data-cursor="hide" onMouseEnter={hoverTick}>
        <div className={styles.large}>
          {variant === "film" && (
            <button
              type="button"
              className={styles.ticket}
              aria-expanded={panel === "list"}
              aria-label={`${REELS[shown].title}, ${REELS[shown].eyebrow}. All chapters`}
              onClick={() => toggle("list")}
            >
              {REELS.map((r, i) => (
                <span key={r.id} className={styles.row} data-on={i === shown || undefined}>
                  <span className={styles.rowTop}>
                    <span className={styles.thumb} style={{ backgroundImage: `url(${r.tall})` }} />
                    <span className={styles.rowTitle}>{r.title}</span>
                  </span>
                  <span className={styles.rowBot}>
                    <span className={styles.rule} />
                    <span className={styles.clip}>
                      <span className={styles.info}>
                        <span>{r.ticket[0]}</span>
                        <span data-centre>{r.ticket[1]}</span>
                        <span>MIN.{r.ticket[2]}</span>
                      </span>
                    </span>
                  </span>
                </span>
              ))}
              <span className={styles.chevron}>
                <svg viewBox="0 0 15 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m1 1 5.086 5.086a2 2 0 0 0 2.828 0L14 1" />
                </svg>
              </span>
            </button>
          )}

          {variant === "about" && (
            <div className={styles.ticket} data-plain>
              <span className={styles.aboutBar}>
                <span>Found</span>
                <span>Admit one</span>
                <span>001</span>
              </span>
            </div>
          )}

          {variant === "contact" && (
            <div className={styles.ticket} data-plain data-contact>
              <span className={styles.envelope}>
                <svg viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="1" y="1" width="22" height="16" rx="1.5" />
                  <path d="m1.5 2 10.5 8L22.5 2" />
                </svg>
                <span>Let&apos;s talk</span>
              </span>
              <span className={styles.contactCta}>Email us</span>
            </div>
          )}

          {variant === "film" && (
            <div className={styles.listPanel}>
              <div className={styles.panelClip}>
                <div className={styles.listInner}>
                  <span className={styles.shadow} />
                  <ul className={styles.films}>
                    {REELS.map((r, i) => (
                      <li key={r.id} className={styles.film} data-current={i === index || undefined}>
                        <button
                          type="button"
                          className={styles.filmPick}
                          tabIndex={panel === "list" ? 0 : -1}
                          onClick={() => select(i)}
                        >
                          <span className={styles.filmLeft}>
                            <span
                              className={styles.filmThumb}
                              style={{ backgroundImage: `url(${r.tall})`, ["--delay" as string]: `${i * 0.02}s` }}
                            />
                            <span className={styles.clip}>
                              <span className={styles.filmTitle} style={{ ["--delay" as string]: `${i * 0.02}s` }}>
                                {r.title}
                              </span>
                            </span>
                          </span>
                          <span className={styles.dot} />
                        </button>
                        <SiteLink
                          href={r.page}
                          className={styles.direct}
                          tabIndex={panel === "list" ? 0 : -1}
                          aria-label={`${r.title}'s page`}
                          onClick={close}
                        >
                          <svg viewBox="0 0 26 26" fill="none" stroke="currentColor">
                            <path strokeDasharray="2 2" d="M23 25H3.2L1 22.333V3.256L3.2 1H23l2 2.051v19.282L23 25Z" />
                            <path d="M9.5 16.5 16 10M11 10h5v5" />
                          </svg>
                        </SiteLink>
                        <span className={styles.dashed} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className={styles.perforation} aria-hidden="true" />

        <button
          type="button"
          className={styles.burger}
          aria-expanded={panel === "main"}
          aria-label={panel === "main" ? "Close the menu" : "Open the menu"}
          onClick={() => toggle("main")}
        >
          <span className={styles.icon}>
            <i />
            <i />
            <i />
          </span>
        </button>

        <div className={styles.main}>
          <div className={styles.panelClip}>
            <div className={styles.mainInner}>
              <div className={styles.topRule}>
                <span />
                <span data-last />
              </div>
              <ul className={styles.links}>
                {NAV_LINKS.map((l, i) => (
                  <li key={l.href}>
                    <SiteLink
                      href={l.href}
                      className={styles.link}
                      tabIndex={panel === "main" ? 0 : -1}
                      onClick={() => {
                        menuTick();
                        close();
                      }}
                    >
                      <span className={styles.linkText} style={{ ["--delay" as string]: `${(i + 1) * 0.1}s` }} data-n={`0${i + 1}`}>
                        {l.label}
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
              <span className={styles.dashedLine} style={{ ["--delay" as string]: "0.2s" }} />
              <ul className={styles.legal}>
                {LEGAL_LINKS.map((l, i) => (
                  <li key={l.href}>
                    <SiteLink href={l.href} tabIndex={panel === "main" ? 0 : -1} onClick={close}>
                      <span className={styles.linkText} style={{ ["--delay" as string]: `${0.3 + i * 0.1}s` }}>
                        {l.label}
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
              <span className={styles.dashedLine} style={{ ["--delay" as string]: "0.3s" }} />
              <Socials />
              <span className={styles.dashedLine} style={{ ["--delay" as string]: "0.4s" }} />
              <p className={styles.copyright}>©2026. Found Thriller Game.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
