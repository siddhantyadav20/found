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
      return { hint: "The call is still running.", cta: `Continue · Ep ${state.episode}`, small: `You put it down ${ago(state.last, now)}.` };
    case "between":
      return { hint: "The phone died. The call didn't.", cta: "Charge it · Ep 2", small: "It's on the charger, waiting for you." };
    case "solved":
      return {
        hint: state.solved ? `Closed${state.solved.minutes ? ` in ${state.solved.minutes} min` : ""}. They had ${state.solved.held} on you.` : "Closed.",
        cta: state.again ? "Play again" : "Open it",
        small: state.again ? "Someone else goes missing next time." : "Bagged, tagged, and still on your desk.",
      };
    default:
      return { hint: meta.hint, cta: meta.cta, small: "More are being found." };
  }
}

/**
 * The one live thing on the desk, as this browser left it. The server draws
 * it new: a sealed courier pouch that buzzes, because the phone inside it is
 * on a call (PLAYER-JOURNEY Stage 1). Once the browser can read the save it
 * becomes yours: her phone mid-case with its battery, charging between
 * episodes, or sealed in an evidence bag with its tag once it's solved.
 *
 * Hover (or hold, on a touch screen) shows its luggage tag: how many
 * episodes, how long, what kind of story. Picking it up morphs it into the
 * envelope (or your phone), and on Android takes the whole screen.
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
                <span className={styles.pouch} aria-hidden="true">
                  <span className={styles.pouchStrip}>PULL TO OPEN →</span>
                  <span className={styles.sticker}>
                    <b>FLAT —</b>
                    <span>PikDrop · 1:08 AM · Dadar East</span>
                    <span>{meta.note}</span>
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
                    <span className={styles.time}>{state.kind === "solved" ? "10:41" : "1:11"}</span>
                    <span className={styles.notes}>
                      {state.kind === "playing" && (
                        <span className={styles.note} style={{ "--i": 0 } as React.CSSProperties}>
                          <b>Mumbai Crime Branch</b>
                          <span>
                            Episode {state.episode} · the call is still running
                          </span>
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
                <span>{state.solved ? `Ep ${state.solved.episode} · ${state.solved.held} on you` : "Closed"}</span>
              </span>
            </span>
          )}

          <span className={styles.tag} id="case-tag" role="note">
            <b>{meta.title}</b>
            <span>
              {meta.episodes} episodes · about {minutes ?? 40} min in one sitting
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
