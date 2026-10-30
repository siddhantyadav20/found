"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import Link from "next/link";

import { appLabel, caseFile, dateNow, episodeOf, has, lost, restartEpisode, type CaseState } from "@/lib/game/engine";
import { commit, readProgress } from "@/lib/found/progress";
import { sentFlag } from "@/lib/game/reading";
import { DETECTIVE, REVEAL_DONE, REVEAL_START, SWITCHED, UNOPENED } from "@/lib/game/scene";
import { openOnPhone } from "@/lib/found/heard";
import { setPace, usePace } from "@/lib/found/pace";
import { sent } from "@/lib/found/tones";
import { flag, sendToM } from "../playthrough";
import { PreStepView } from "./BeforeEnding";
import styles from "./CaseNote.module.css";
import final from "./Final.module.css";

/* ===========================================================================
   The case file as a note on this iPhone (RAAKH-V3 §17): its header in the
   Notes style ("On this iPhone · Today 11:44 PM", IC4), and an info panel
   that exists from the start but can't be reached until the reveal. Below
   the question: what's been found, each with Send to M once she's asked for
   it; the last question's asides (call M, listen again); and, until 3:58,
   a way to put the phone away unopened.
   =========================================================================== */

export function NoteHead({ story, state }: { story: Story; state: CaseState }) {
  const [info, setInfo] = useState(false);
  const note = story.caseNote;
  if (!note) return null;
  const turned = has(state, REVEAL_DONE);
  return (
    <header className={styles.head}>
      {/* Its header says "Today" as Notes does, until midnight makes it yesterday. */}
      <p className={styles.meta}>{dateNow(story, state) === story.clocks[0].date ? note.header : note.header.replace("Today", "Yesterday")}</p>
      {/* The info panel: there all along, out of reach until the reveal turned it over. */}
      {turned && (
        <button type="button" className={styles.info} aria-expanded={info} aria-label="Info" onClick={() => setInfo((v) => !v)}>
          i
        </button>
      )}
      {info && story.reveal && (
        <ul className={styles.panel}>
          {story.reveal.info.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </header>
  );
}

/** Before the last question is answered: call M, listen to Dilip again (RAAKH-V3 §9.12). */
export function Asides({ story, state }: { story: Story; state: CaseState }) {
  const asides = story.final?.asides ?? [];
  if (!asides.length) return null;
  // With help, a third: the camera again, for the proof of who S is (fix brief §6).
  const look = !has(state, DETECTIVE) && story.camera;
  return (
    <section className={styles.asides} aria-label="Before you choose">
      <p className={styles.group}>Before you choose</p>
      <ul className={styles.list}>
        {asides.map((a) => (
          <PreStepView key={a.id} step={a} state={state} voices={story.voices} />
        ))}
        {look && (
          <li className={final.step}>
            <button type="button" className={final.stepButton} onClick={() => openOnPhone("camera")}>
              Look at yourself
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}

/**
 * Leave the case (fix brief §8.8): come back later, start this episode or
 * the chapter again, ask for help (a detective, one way only), or put the
 * phone away, the chapter's early exit until the reveal (RAAKH-V3 §11,
 * Unopened). Each asks once before it does anything.
 */
export function CloseTheCase({ story, state }: { story: Story; state: CaseState }) {
  const [asking, setAsking] = useState<null | "menu" | "episode" | "chapter" | "away">(null);
  const pace = usePace();
  const u = story.unopened;
  if (has(state, "did:chose")) return null;
  const away = u && !has(state, REVEAL_START) && !u.before.some((f) => has(state, f));
  const detective = has(state, DETECTIVE);
  const ep = episodeOf(state);
  const sure = (text: string, yes: string, act: () => void) => (
    <>
      <p>{text}</p>
      <span className={styles.closeRow}>
        <button type="button" onClick={act}>
          {yes}
        </button>
        <button type="button" onClick={() => setAsking("menu")}>
          Not now
        </button>
      </span>
    </>
  );
  return (
    <div className={styles.close}>
      {asking === null && (
        <button type="button" className={styles.closeLink} onClick={() => setAsking("menu")}>
          Leave the case
        </button>
      )}
      {asking === "menu" && (
        <ul className={styles.leave} aria-label="Leave the case">
          <li>
            <Link href="/">Resume later</Link>
            <span>Everything stays as it is. Open the parcel again to carry on.</span>
          </li>
          <li>
            <button type="button" onClick={() => setAsking("episode")}>
              Restart Episode {ep}
            </button>
          </li>
          <li>
            <button type="button" onClick={() => setAsking("chapter")}>
              Restart the chapter
            </button>
            <span>From the parcel. You choose how to play again.</span>
          </li>
          {detective && (
            <li>
              <button type="button" onClick={() => flagMode(SWITCHED)}>
                Switch to help
              </button>
              <span>Where to look, and every hint. You can&apos;t switch back; the end card will say so.</span>
            </li>
          )}
          {away && (
            <li>
              <button type="button" onClick={() => setAsking("away")}>
                Put it away
              </button>
            </li>
          )}
          <li>
            <span className={styles.paceHead}>Message speed</span>
            <span className={styles.pace} role="radiogroup" aria-label="Message speed">
              {(["normal", "fast", "instant"] as const).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pace === p} onClick={() => setPace(p)}>
                  {p[0].toUpperCase() + p.slice(1)}
                </button>
              ))}
            </span>
          </li>
          <li>
            <button type="button" onClick={() => setAsking(null)}>
              Keep reading
            </button>
          </li>
        </ul>
      )}
      {asking === "episode" &&
        sure(`Back to the start of Episode ${ep}? What you did in it is undone; everything before it stays.`, "Restart the episode", () => {
          restartNow();
          setAsking(null);
        })}
      {asking === "chapter" &&
        sure("Start the chapter again from the parcel? This night is wiped.", "Restart the chapter", () => {
          commit(null);
          window.scrollTo(0, 0);
        })}
      {asking === "away" && u && sure(u.ask, "Put it away", () => flag(UNOPENED, "did:unopened-once"))}
    </div>
  );
}

/** Back to this episode's start, read in the click that asks for it. */
function restartNow(): void {
  const s = readProgress();
  if (s) commit(restartEpisode(s, Date.now()));
}

/** A detective asking for help: the flag that says they were one goes, and the switch is remembered (one way only). */
function flagMode(to: typeof SWITCHED): void {
  const s = readProgress();
  if (s) commit({ ...s, flags: [...s.flags.filter((f) => f !== DETECTIVE), to] });
}

/** Everything found so far, grouped by where, with Send to M beside each once she's asked (RAAKH-V3 §8.7). */
export function FoundList({ story, state }: { story: Story; state: CaseState }) {
  const [open, setOpen] = useState(false);
  const found = caseFile(story, state);
  const to = story.sendTo;
  const canSend = Boolean(to && to.after.every((f) => has(state, f)));
  if (!found.length) return null;
  return (
    <section className={styles.found} aria-label="What you have found">
      <button type="button" className={styles.group} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        What you have found ({found.length}) {open ? "▴" : "▾"}
      </button>
      {open && (
        <ul className={styles.list}>
          {found.map((e) => {
            const gone = lost(story, state, e.id);
            const sentIt = has(state, sentFlag(e.id));
            return (
              <li key={e.id} className={styles.item} data-gone={gone || undefined}>
                <span>
                  {e.label}
                  <small>
                    {e.from ?? (e.app === "casefile" ? "Case file" : appLabel(story, e.app))}
                    {gone && " · source deleted"}
                  </small>
                </span>
                {canSend && !gone && (
                  <button
                    type="button"
                    className={styles.send}
                    disabled={sentIt}
                    onClick={() => {
                      sent();
                      sendToM([e.id]);
                    }}
                  >
                    {sentIt ? "Sent" : to!.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
