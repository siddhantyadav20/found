"use client";

import { usePathname } from "next/navigation";

import { FOOTER_WORDS, LEGAL_LINKS, SITEMAP } from "@/content/site";
import Arrow from "./Arrow";
import { SiteLink } from "./Chrome";
import Logo from "./Logo";
import { Group } from "./Motion";
import { Sent, useNotify } from "./Notify";
import Socials from "./Socials";
import styles from "./Footer.module.css";

function Bar() {
  return (
    <div className={styles.bar}>
      <div className={styles.barLeft}>
        <span className={styles.eyebrow}>Follow us —</span>
        <Socials className={styles.socials} />
      </div>
      <div className={styles.barCentre}>
        <span className={styles.eyebrow}>@found. All rights reserved</span>
      </div>
      <div className={styles.barRight}>
        {LEGAL_LINKS.map((l, i) => (
          <span key={l.href} className={styles.legal}>
            {i > 0 && <span className={styles.eyebrow}>-</span>}
            <SiteLink href={l.href} className={styles.eyebrow}>
              {l.label}
            </SiteLink>
          </span>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  const { value, setValue, status, send } = useNotify("site");
  return (
    <div className={styles.news}>
      <h2 className={styles.heading}>Stay up to date</h2>
      <form className={styles.field} onSubmit={send}>
        {status.state === "done" ? (
          <span className={styles.input}>
            <Sent>You&apos;re on the list.</Sent>
          </span>
        ) : (
          <>
            <input
              className={styles.input}
              type="text"
              inputMode="email"
              autoComplete="email"
              name="contact"
              required
              aria-label="Your email or number"
              placeholder={status.state === "error" ? status.message : "Enter your email"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className={styles.send} aria-label="Tell me when the next chapter is out">
              <Arrow tone="black" small />
            </button>
          </>
        )}
      </form>
    </div>
  );
}

/** The cream foot of every long page, and the bar alone under the 404. */
export default function Footer({ bare = false }: { bare?: boolean }) {
  const pathname = usePathname();

  if (bare) {
    return (
      <footer className={styles.footer} data-bare>
        <Bar />
      </footer>
    );
  }

  return (
    <Group as="footer" className={styles.footer}>
      <div className={styles.top}>
        <span className={styles.badge} aria-hidden="true">
          <Logo className={styles.badgeLogo} />
        </span>
        <div className={styles.words}>
          {FOOTER_WORDS.map((word) => (
            <div key={word} className={styles.word}>
              <span data-a="item">{word.toUpperCase()}</span>
            </div>
          ))}
          <div className={styles.rules} aria-hidden="true">
            <i data-a="line" />
            <i data-a="line" />
            <i data-a="line" />
            <i data-a="line" />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <Newsletter />
        <div className={styles.sitemap}>
          <h2 className={styles.heading}>Sitemap</h2>
          <ul>
            {SITEMAP.map((l) => (
              <li key={l.href}>
                <SiteLink href={l.href} className={styles.mapLink} data-current={pathname === l.href || undefined}>
                  <span className={styles.mapText}>{l.label}</span>
                  <Arrow tone="black" small className={styles.mapArrow} />
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.contact}>
          <h2 className={styles.heading}>Contact us</h2>
          <SiteLink href="/contact" className={styles.contactRow}>
            <i data-a="line" />
            <span className={styles.eyebrow}>Inquiries</span>
            <span className={styles.contactWord}>Leave a note</span>
            <i data-a="line" />
          </SiteLink>
        </div>
      </div>

      <Bar />
    </Group>
  );
}
