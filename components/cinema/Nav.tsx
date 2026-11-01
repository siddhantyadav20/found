"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { LEGAL_LINKS, NAV_LINKS, REELS } from "@/content/site";
import Arrow from "./Arrow";
import { SiteLink, useGo } from "./Chrome";
import Logo from "./Logo";
import { reel, useReel } from "./reel";
import Socials from "./Socials";
import { filmOut, hoverTick, menuTick } from "./sounds";
import Stars from "./Stars";
import styles from "./Nav.module.css";

/* ===========================================================================
   The ticket, top right (2026-10-31), 1:1 with siena.film. The stub shows the
   chapter on the reel and opens the list of chapters; the square beside it is
   the menu. Both panels unroll from under the ticket. Opening one while the
   other is open closes first and opens after 550ms; anything that moves the
   reel closes them, and so does a click anywhere else.
   =========================================================================== */

type Panel = "list" | "case" | "sheet" | "main";
type Route = "home" | "chapters" | "chapter" | "contact" | "page";

const SWAP_MS = 550;
/** The ticket waits for the reel to land before it changes. */
const SETTLE_MS = 800;

export default function Nav({ route }: { route: Route }) {
  const go = useGo();
  const { index, footage } = useReel();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [shown, setShown] = useState(index);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const swap = useRef(0);

  const film = route === "home" || route === "chapters" || route === "chapter";
  const variant = film ? "film" : route === "contact" ? "contact" : "about";
  // On a chapter's page the stub opens that chapter's sheet; in footage mode, its billing.
  const stub: Panel = route === "chapter" ? "case" : footage ? "sheet" : "list";
  const open = panel === "list" || panel === "case" || panel === "sheet";

  const close = useCallback(() => {
    window.clearTimeout(swap.current);
    setPanel(null);
  }, []);

  const toggle = (next: Panel) => {
    if (panel !== next) (next === "main" ? menuTick : filmOut)();
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

  // Over a cream section the white logo would vanish, so it turns black.
  useEffect(() => {
    const over = new Set<Element>();
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) over.add(e.target);
          else over.delete(e.target);
        }
        setDark(over.size > 0);
      },
      { rootMargin: "0px 0px -90% 0px" },
    );
    document.querySelectorAll('[data-color="white"]').forEach((el) => seen.observe(el));
    return () => {
      seen.disconnect();
      setDark(false);
    };
  }, [pathname]);

  const select = (i: number) => {
    close();
    if (route === "home" || route === "chapters") reel.goTo(i);
    else go(REELS[i].page);
  };

  return (
    <header className={styles.nav} data-panel={panel ?? undefined} data-variant={variant} data-ink={dark ? "black" : undefined}>
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
              aria-expanded={open}
              aria-label={`${REELS[shown].title}, ${REELS[shown].eyebrow}. ${stub === "list" ? "All chapters" : "More"}`}
              onClick={() => toggle(stub)}
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
              <label htmlFor="note" className={styles.contactCta}>
                Leave a note
              </label>
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

        {variant === "film" && (
          <div className={styles.sheetPanel} data-for="sheet">
            <div className={styles.panelClip}>
              <div className={styles.sheetInner}>
                <span className={styles.dashedShort} />
                <div className={styles.sheet}>
                  {REELS.map((r, i) => (
                    <div key={r.id} className={styles.sheetItem} data-on={i === shown || undefined}>
                      <div className={styles.sheetGrid}>
                        <div className={styles.sheetBox}>
                          {r.reviews[0].stars && <Stars value={r.reviews[0].stars} className={styles.sheetStars} />}
                          <p className={styles.sheetEyebrow}>{r.reviews[0].source}</p>
                          <p className={styles.sheetTitle}>{r.reviews[0].quote}</p>
                        </div>
                        <div className={styles.sheetBox} data-left>
                          <p className={styles.sheetEyebrow}>{r.more.lead.role}</p>
                          <p className={styles.sheetTitle}>{r.more.lead.name}</p>
                          <p className={styles.sheetEyebrow}>{r.more.pair[0][0]}</p>
                          <p className={styles.sheetTitle}>{r.more.pair[0][1]}</p>
                        </div>
                      </div>
                      <SiteLink href={r.page} className={styles.sheetCta} tabIndex={panel === "sheet" && i === shown ? 0 : -1} onClick={close}>
                        <span>See the chapter</span>
                        <Arrow small tone="black" />
                      </SiteLink>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {route === "chapter" && (
          <div className={styles.sheetPanel} data-for="case">
            <div className={styles.panelClip}>
              <div className={styles.sheetInner}>
                <span className={styles.dashedShort} />
                <div className={styles.sheet}>
                  {REELS.map((r, i) => (
                    <div key={r.id} className={styles.sheetItem} data-on={i === shown || undefined}>
                      <p className={styles.caseText}>{r.logline}</p>
                      <div className={styles.caseFoot}>
                        <span className={styles.caseScore}>
                          {r.reviews[0].stars ? (
                            <>
                              <Stars value={r.reviews[0].stars} className={styles.caseStars} />
                              <span>{r.reviews[0].stars}/5</span>
                            </>
                          ) : (
                            <span>{r.badge.headline}</span>
                          )}
                        </span>
                        <span className={styles.caseCity}>{r.callouts[0][1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
              <Socials className={styles.socials} />
              <span className={styles.dashedLine} style={{ ["--delay" as string]: "0.4s" }} />
              <p className={styles.copyright}>©2026. Found Thriller Game.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
