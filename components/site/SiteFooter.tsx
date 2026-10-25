import Link from "next/link";

import { CASES } from "@/content/cases";
import Mark from "./Mark";
import s from "./Site.module.css";

/* The foot of every site page (2026-10-25), with the name going into the dark. */

const raakh = CASES.raakh;
const local = CASES.lastlocal;

export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footRow}`}>
        <div className={s.footBrand}>
          <Mark size={18} />
          <p>Interactive fiction by Siddhant Yadav. Every person, company and number in it is invented. Made in India.</p>
        </div>
        <div className={s.footCol}>
          <b>Chapters</b>
          <Link href={raakh.page ?? raakh.href}>01 · Raakh</Link>
          <Link href={local.href}>02 · Last Local</Link>
        </div>
        <div className={s.footCol}>
          <b>Found</b>
          <Link href="/#how">How it plays</Link>
          <Link href="/#made-by">Who makes it</Link>
          <Link href="/#faq">Questions</Link>
        </div>
        <div className={s.footCol}>
          <b>If you need it</b>
          <a href="tel:14416">Tele-MANAS · 14416</a>
          <a href="tel:112">Emergency · 112</a>
        </div>
      </div>
      <p className={s.footWord} aria-hidden="true">
        Found
      </p>
    </footer>
  );
}
