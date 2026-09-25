"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore, ViewTransition } from "react";

import { CASES, FEATURED, type CaseMeta } from "@/content/cases";
import { ago, deskState, type DeskState } from "@/lib/found/keeping";
import { enterFullscreen } from "@/lib/found/platform";
import { useArrivals, useYourCases } from "@/lib/found/shelf";
import styles from "./Desk.module.css";

/** Holding the phone this long shows its luggage tag instead of picking it up. */
const HOLD_MS = 450;
const TAG_MS = 3500;

const never = () => () => {};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

function captionOf(state: DeskState, meta: CaseMeta, now: number): { hint: string; cta: string; small: string } {
  switch (state.kind) {
    case "playing":
      return { hint: "It's where you left it.", cta: `Continue · Ep ${state.episode}`, small: `You put it down ${ago(state.last, now)}.` };
    case "between":
      return { hint: "The phone is dying.", cta: "Charge it · Ep 2", small: "It's waiting for a charger." };
    case "solved":
      return {
        hint: state.solved ? `Closed${state.solved.minutes ? ` in ${state.solved.minutes} min` : ""}.` : "Closed.",
        cta: state.again ? "Play again" : "Open it",
        small: state.again ? "Someone else goes missing next time." : "Bagged and tagged. Case 2 is on its way: a phone, from Mumbai.",
      };
    default:
      return { hint: meta.hint, cta: meta.cta, small: "More are being found." };
  }
}

/**
 * The one live thing on the desk, as this browser left it. The server draws
 * it new: a sealed courier parcel that buzzes, because the phone inside it
 * keeps ringing (PLAYER-JOURNEY Stage 1). Once the browser can read the save
 * it becomes yours: the phone mid-case with its battery, charging between
 * episodes, or sealed in an evidence bag with its tag once it's solved.
 *
 * Hover (or hold, on a touch screen) shows its luggage tag: how many
 * episodes, how long, what kind of story. Picking it up morphs it into the
 * parcel (or the phone), and on Android takes the whole screen.
 */
export default function DeskPhone({ minutes }: { minutes?: number }) {
  const meta = CASES[FEATURED];
  const cards = useYourCases();
  const arrived = useArrivals();
  const now = useSyncExternalStore(never, minute, () => 0);
  const card = cards?.find((c) => c.id === FEATURED);
  const state = deskState(card?.save ?? null, card?.solved ?? null);
  const caption = captionOf(state, meta, now);
  const battery = card?.battery ?? null;

  const [tag, setTag] = useState(false);
  const held = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const press = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    held.current = false;
    timer.current = window.setTimeout(() => {
      held.current = true;
      setTag(true);
      window.setTimeout(() => setTag(false), TAG_MS);
    }, HOLD_MS);
  };
  const release = () => window.clearTimeout(timer.current);
  const pickUp = (e: React.MouseEvent) => {
    // The tap that ends a hold only showed the tag.
    if (held.current) {
      e.preventDefault();
      held.current = false;
      return;
    }
    enterFullscreen();
  };

  return (
    <>
      {arrived.length > 0 && <p className={styles.arrived}>Something else arrived.</p>}

      <div className={styles.desk}>
        <span className={`${styles.thing} ${styles.thingA}`} aria-hidden="true" />
        <span className={`${styles.thing} ${styles.thingB}`} aria-hidden="true" />

        <div className={styles.object} data-state={state.kind} data-tag={tag || undefined}>
          <ViewTransition name="found-phone" share="morph" default="none">
            <Link
              href={meta.href}
              className={styles.phone}
              aria-label={`${meta.title}. ${caption.hint} ${caption.cta}.`}
              aria-describedby="case-tag"
              onClick={pickUp}
              onPointerDown={press}
              onPointerUp={release}
              onPointerCancel={release}
              onPointerLeave={release}
              onContextMenu={(e) => e.preventDefault()}
            >
              {state.kind === "new" ? (
                <span className={styles.parcel} aria-hidden="true">
                  <span className={styles.parcelStrip}>TAP TO PICK UP</span>
                  <span className={styles.sticker}>
                    <b>{meta.label ? `TO ${meta.label.to.toUpperCase()}` : "TO —"}</b>
                    <span>{meta.note}</span>
                    {/* The courier's stamp: this came back. */}
                    {meta.label && <span className={styles.stickerStamp}>{meta.label.stamp[0]}</span>}
                  </span>
                </span>
              ) : (
              <span className={styles.screen}>
                {state.kind === "between" ? (
                  <span className={styles.charging} aria-hidden="true">
                    <span className={styles.chargeCell}>
                      <span />
                    </span>
                    <svg viewBox="0 0 10 16" className={styles.bolt}>
                      <path d="M6 0 0 9h4l-1 7 7-10H6z" fill="currentColor" />
                    </svg>
                  </span>
                ) : (
                  <>
                    <Image src={meta.wallpaper} alt="" fill priority sizes="220px" className={styles.wallpaper} />
                    {state.kind === "playing" && battery !== null && (
                      <span className={styles.deskBattery} data-low={battery <= 5 || undefined}>
                        {battery}%
                      </span>
                    )}
                    <span className={styles.time}>{meta.time}</span>
                    <span className={styles.notes}>
                      {state.kind === "playing" && (
                        <span className={styles.note} style={{ "--i": 0 } as React.CSSProperties}>
                          <b>{meta.teaser[0].from}</b>
                          <span>{meta.teaser[0].text}</span>
                        </span>
                      )}
                    </span>
                  </>
                )}
              </span>
              )}
            </Link>
          </ViewTransition>

          {state.kind === "solved" && (
            <span className={styles.bag} aria-hidden="true">
              <span className={styles.bagLabel}>
                <b>Evidence</b>
                <span>{meta.title}</span>
                <span>{state.solved ? `Ep ${state.solved.episode}` : "Closed"}</span>
              </span>
            </span>
          )}

          <span className={styles.tag} id="case-tag" role="note">
            <b>{meta.title}</b>
            <span>
              {meta.episodes} episodes{minutes ? ` · about ${minutes} min` : ""}, in one sitting
            </span>
            <span>{meta.tone}</span>
          </span>
        </div>
      </div>

      <div className={styles.caption}>
        <p className={styles.eyebrow}>Case 1 · {meta.title}</p>
        <p className={styles.hint}>{caption.hint}</p>
        <Link href={meta.href} className={styles.cta} onClick={() => enterFullscreen()}>
          {caption.cta}
        </Link>
        <p className={styles.small}>{caption.small}</p>
      </div>
    </>
  );
}
