import Link from "next/link";
import type { ReactNode } from "react";

import SoundToggle from "@/components/found/SoundToggle";
import Mark from "./Mark";
import s from "./Site.module.css";

/* The bar over every site page (2026-10-25): clear over the hero, glass
   once the page moves under it. The sections are spaced with dots, the
   way a film's credits are. */

export default function SiteNav({
  crumb,
  links,
  cta,
}: {
  crumb?: ReactNode;
  links: readonly (readonly [href: string, label: string])[];
  cta: { href: string; label: string };
}) {
  return (
    <>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <header className={s.nav}>
        <Link href="/" aria-label="Found, home" className={s.brand}>
          <Mark size={19} />
        </Link>
        {crumb && <span className={s.crumb}>{crumb}</span>}
        <nav className={s.links} aria-label="Sections">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <SoundToggle className={s.sound} />
        <Link href={cta.href} className={s.navCta}>
          {cta.label}
        </Link>
      </header>
    </>
  );
}
