"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CallFeed from "@/components/call/CallFeed";
import { AppGlyph } from "@/components/her/ios/icons";
import { FEATURED } from "@/content/cases";
import { duration } from "@/lib/game/call";
import { useNow } from "@/lib/found/now";
import { track } from "@/lib/found/track";
import styles from "./FirstMinute.module.css";

/* ===========================================================================
   The First Minute (CHAPTER1.md G7, ROADMAP P10).

   Sixty seconds of the opening, for the people who will never play forty-five
   minutes and most need to: the pouch, the call, the alert, the whisper, and
   one question. Whatever they answer, it ends on the real advice, and a way
   into the whole night for anyone who wants it.

   Built for a family WhatsApp group: one tap to start, Hinglish with English
   under it, big targets, nothing to read before it begins, and a share button
   that goes straight back into the chat it came from.
   =========================================================================== */

const SINCE = 113_587;

type Beat = { at: number; line: string; english: string; whisper?: boolean; supervisor?: boolean };

const BEATS: readonly Beat[] = [
  { at: 0.6, line: "Madam? Madam, camera on kijiye.", english: "Madam? Madam, turn your camera on." },
  { at: 10, line: "Mat kaatna… please.", english: "Don't cut it… please.", whisper: true },
  {
    at: 14.5,
    line: "CALL MAT KAATNA. Aapke naam pe non-bailable warrant hai.",
    english: "DON'T CUT THE CALL. There is a non-bailable warrant in your name.",
    supervisor: true,
  },
];
const ALERT_AT = 5.5;
const ASK_AT = 20;

type Phase = "pouch" | "call" | "after";

export default function FirstMinute({ shareUrl }: { shareUrl: string }) {
  const [phase, setPhase] = useState<Phase>("pouch");
  const [began, setBegan] = useState(0);
  const [answer, setAnswer] = useState<"cut" | "stay" | null>(null);
  const now = useNow(250);

  useEffect(() => {
    track({ case: FEATURED, event: "minute:open" });
  }, []);

  const t = phase === "call" && began && now ? Math.max(0, (now - began) / 1000) : 0;
  const beat = [...BEATS].reverse().find((b) => t >= b.at);

  const pick = (a: "cut" | "stay") => {
    setAnswer(a);
    setPhase("after");
    track({ case: FEATURED, event: a === "cut" ? "minute:cut" : "minute:stay" });
    window.scrollTo(0, 0);
  };

  if (phase === "pouch")
    return (
      <main className={styles.room}>
        <p className={styles.eyebrow}>1:11 AM · a courier at your door</p>
        <button
          type="button"
          className={styles.pouch}
          onClick={() => {
            setBegan(Date.now());
            setPhase("call");
          }}
        >
          <span className={styles.strip}>TAP TO OPEN</span>
          <span className={styles.sticker}>
            <b>FLAT —</b>
            <span>PikDrop · 1:08 AM</span>
          </span>
        </button>
        <p className={styles.lede}>
          Inside: a stranger&apos;s phone, already on a video call.
          <span className={styles.en} lang="hi-Latn">
            Andar: kisi anjaan ka phone, jo pehle se video call par hai.
          </span>
        </p>
        <p className={styles.small}>60 seconds · sound optional · nothing real is asked of you</p>
      </main>
    );

  if (phase === "call")
    return (
      <main className={styles.room}>
        <div className={styles.phone} data-supervisor={beat?.supervisor || undefined}>
          <div className={styles.top}>
            <span>Mumbai Crime Branch</span>
            <span className={styles.timer}>{duration(SINCE + t)}</span>
          </div>
          <div className={styles.feed}>
            <CallFeed board="MUMBAI POLICE · CRIME BRANCH" clock="02:11" supervisor={Boolean(beat?.supervisor)} />
          </div>

          {t >= ALERT_AT && (
            <div className={styles.alert} role="status">
              <span className={styles.alertIcon}>
                <AppGlyph app="kyc" />
              </span>
              <span>
                <b>City Desk</b>
                <br />
                Dadar: retired bank manager, 64, found dead below building
              </span>
            </div>
          )}

          <p className={styles.caption} aria-live="polite" data-whisper={beat?.whisper || undefined}>
            {beat && (
              <>
                <span lang="hi-Latn">{beat.line}</span>
                <span className={styles.en}>{beat.english}</span>
              </>
            )}
          </p>
        </div>

        {t >= ASK_AT && (
          <div className={styles.ask}>
            <p className={styles.question}>
              Cut the call?
              <span className={styles.en} lang="hi-Latn">
                Call kaatenge?
              </span>
            </p>
            <div className={styles.choices}>
              <button type="button" className={styles.choice} onClick={() => pick("cut")}>
                Cut it
                <span lang="hi-Latn">Kaat do</span>
              </button>
              <button type="button" className={styles.choice} onClick={() => pick("stay")}>
                Stay on
                <span lang="hi-Latn">Rehne do</span>
              </button>
            </div>
          </div>
        )}
      </main>
    );

  const text = `60 seconds. Would you have cut the call?\n60 second. Aap call kaatte?\n${shareUrl}`;

  return (
    <main className={styles.room} data-after>
      <p className={styles.said}>
        {answer === "cut" ? "You cut it." : "You stayed on."}
        <span className={styles.en}>
          {answer === "cut"
            ? "The woman whose phone this is didn't. She stayed on for 31 hours."
            : "So did the woman whose phone this is. For 31 hours."}
        </span>
      </p>

      <section className={styles.advice} aria-label="What to do if this happens for real">
        <p className={styles.adviceHead}>Real police never arrest anyone on a video call.</p>
        <p lang="hi-Latn" className={styles.adviceHi}>
          Asli police kabhi video call par arrest nahi karti.
        </p>
        <ol className={styles.steps}>
          <li>
            <b>Cut the call.</b> <span lang="hi-Latn">Call kaat dijiye.</span>
          </li>
          <li>
            <b>
              Call <a href="tel:1930">1930</a>
            </b>
            , the cyber-fraud helpline. <span lang="hi-Latn">1930 par call kijiye.</span>
          </li>
          <li>
            <b>
              Report at{" "}
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
                cybercrime.gov.in
              </a>
            </b>
            . <span lang="hi-Latn">Kisi ko paise mat bhejiye.</span>
          </li>
        </ol>
        <p className={styles.small}>&ldquo;Digital arrest&rdquo; does not exist in Indian law.</p>
      </section>

      <a
        className={styles.whatsapp}
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ case: FEATURED, event: "minute:share" })}
      >
        Send this to your family group
      </a>

      <Link className={styles.play} href="/c/dont-cut-the-call" onClick={() => track({ case: FEATURED, event: "minute:play" })}>
        Play the whole night · about 40 minutes
      </Link>
    </main>
  );
}
