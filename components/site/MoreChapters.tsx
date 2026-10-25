import Image from "next/image";

import { CASES } from "@/content/cases";
import ChapterStatus from "./ChapterStatus";
import s from "./Site.module.css";

/* Chapter 2 on its photograph under glass, and Chapter 3 still in transit:
   a picture too blurred to read, behind frosted glass (2026-10-25). */

const local = CASES.lastlocal;

export default function MoreChapters() {
  return (
    <div className={s.more}>
      <article className={`${s.card} ${s.spot}`} data-spot>
        <Image src="/found/lastlocal/dadar.jpg" alt="A Mumbai local at Dadar, late at night." fill sizes="(max-width: 860px) 100vw, 600px" className={s.cover} />
        <div className={`${s.glass} ${s.cardBody}`}>
          <p className={s.eyebrow}>Chapter 02 · {local.city}</p>
          <h3 className={s.cardTitle}>{local.title}</h3>
          <p className={s.cardLine}>{local.logline}</p>
          <ChapterStatus id="lastlocal" cta="Pick it up" />
        </div>
      </article>
      <article className={s.sealed}>
        <Image src="/found/lastlocal/sea.jpg" alt="" fill sizes="(max-width: 860px) 100vw, 600px" className={s.cover} />
        <div className={s.frost}>
          <span className={s.lock} aria-hidden="true" />
          <p className={s.eyebrow}>Chapter 03</p>
          <p className={s.transit}>In transit</p>
          <p className={s.cardLine}>Another object, another city.</p>
        </div>
      </article>
    </div>
  );
}
