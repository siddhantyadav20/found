"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import LockScreen from "@/components/owner/LockScreen";
import type { Notice } from "@/components/owner/Phone";
import { CASES } from "@/content/cases";
import Device from "./Device";
import styles from "./Table.module.css";

/* ===========================================================================
   The front page's first picture (2026-10-24): what came out of the parcel,
   on your table, under one lamp. The courier's mailer with its label to
   Meera and the stamp that sent it back; the Sehgal wedding's shagun
   envelope, turned over to the note on its back; and his phone, face up,
   lit, still being rung.

   The phone is the game's own lock screen. The missed calls keep counting
   while you read, with a buzz each time, and swiping it open (or a tap)
   opens the chapter.

   Drawn at 760 × 780 and scaled as one picture, so the waybill's small
   print and the note's hand keep their proportions at any width.
   =========================================================================== */

const raakh = CASES.raakh;
const label = raakh.label!;

/** The note, as `story.arrival` has it: in his hand, to M. */
const NOTE = ["M —", "Sab isme hai.", "Local thane mat le jaana.", "Bhasin ke log wahan baithe hain."];

/** What was waiting on his lock screen when it arrived (`story.lockScreen`). */
const waiting = (calls: number): Notice[] => [
  { key: `calls-${calls}`, app: "phone", from: "Phone", text: `${calls} Missed Calls` },
  {
    key: "mummy",
    app: "whatsapp",
    from: "Mummy",
    text: "Beta, phone kyun nahi utha raha? Khana khaya?",
    english: "Why aren't you picking up? Have you eaten?",
  },
  { key: "bhasin", app: "phone", from: "Bhasin Uncle", text: "2 missed calls" },
];

/** When the next missed call lands, after the one before (ms). */
const RINGS = [5200, 9000, 13000];

/** The stage's own size, before it's scaled to the column. */
const STAGE = 760;

export default function Table() {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);
  const [calls, setCalls] = useState(47);
  const [buzz, setBuzz] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => setK(el.clientWidth / STAGE);
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  // Somebody keeps ringing him. Three more, then they give up for now.
  useEffect(() => {
    if (calls - 47 >= RINGS.length) return undefined;
    const t = window.setTimeout(() => {
      setCalls((n) => n + 1);
      setBuzz((n) => n + 1);
    }, RINGS[calls - 47]);
    return () => window.clearTimeout(t);
  }, [calls]);

  // A light parallax under the pointer, as if leaning over the table.
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <div
      ref={box}
      className={styles.box}
      data-ready={k !== null || undefined}
      style={k !== null ? ({ "--k": k } as CSSProperties) : undefined}
      onPointerMove={lean}
    >
      <div className={styles.stage}>
        {/* The mailer, its strip pulled, the waybill still on it. */}
        <div className={styles.mailer} aria-hidden="true">
          <div className={styles.waybill}>
            <span className={styles.barcode} />
            <span className={styles.courier}>DakRoute Express · Surface · 1 of 1</span>
            <span className={styles.to}>TO {label.to.toUpperCase()}</span>
            <span className={styles.line}>{label.address}</span>
            <span className={styles.line}>Mob: {label.phone}</span>
            <span className={styles.line}>From: {label.from}</span>
            <span className={styles.decl}>
              <b>Contains</b> 1 mobile phone, used
            </span>
            <span className={styles.stamp}>
              {label.stamp[0]}
              <small>{label.stamp[1]}</small>
            </span>
          </div>
        </div>

        {/* The shagun envelope, turned over: his note where the sender's name goes. */}
        <figure className={styles.envelope} lang="hi-Latn">
          <span className={styles.flap} aria-hidden="true" />
          <span className={styles.note}>
            {NOTE.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span className={styles.sign}>— S</span>
          </span>
          <figcaption className={styles.hidden}>
            On the back of a wedding envelope, in his hand: “M — It&apos;s all in here. Don&apos;t take it to the local police station. Bhasin&apos;s people sit
            there. — S”
          </figcaption>
        </figure>

        {/* His phone, face up, and its light on the table. */}
        <span className={styles.glow} aria-hidden="true" />
        <div className={styles.phone} data-buzz={buzz % 2 ? "a" : buzz ? "b" : undefined}>
          <Device time="11:40" battery={9} locked wallpaper={raakh.wallpaper} label={`His phone's lock screen, Saturday 11:40 PM: ${calls} missed calls, and Mummy asking why he isn't picking up`}>
            <LockScreen day="Saturday 29 November" clock="11:40" notes={waiting(calls)} onOpen={() => router.push(raakh.href)} />
          </Device>
          <span className={styles.crack} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
