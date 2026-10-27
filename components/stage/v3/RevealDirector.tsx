"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { ReplyOption, Said, Story } from "@/content/types";
import { clockNow, clockOf, filedClaim, has, type CaseState } from "@/lib/game/engine";
import { exchanges, heldOn, leaning } from "@/lib/game/reading";
import { FACE_DOWN, REVEAL_DONE } from "@/lib/game/scene";
import { received, sent } from "@/lib/found/tones";
import { say, useVoice } from "@/lib/found/voice";
import { phoneClock, stamp } from "@/lib/found/time";
import Ringing from "../Ringing";
import { flag, sayAll } from "../playthrough";
import { DarkLine } from "./DarkScreen";
import Hand from "./Hand";
import { YourPhoneNote, YourPhoneOverlay } from "./YourPhone";
import card from "./Screens.module.css";
import styles from "./Reveal.module.css";

/* ===========================================================================
   The reveal (RAAKH-V3 §9, scene 3.10), 3:58 to 4:04 AM. Nine steps, played
   in sequence; no other banner gets in.

     1  Bhasin's voice note: "Sameer." … "Gate do pe hoon."
     2  The second phone, ringing for the first time: Gate 2, Ram Kishan ji
     3  M rings this one: "Sameer. Ab bas." Open the camera, or face down
     4  The front camera: his face, a breath, the kada; the shutter
     5  The case file turns over: created on this iPhone, at 11:44 PM
     6  The montage: the player's own lines, and what they were answering
     7  Meera's line: which Sameer read the phone
     8  The last dark screen, and "Your story held on N of 4"
     9  The card: Tonight · Sunday · 4:04 AM

   Each step is kept in the save as it's done, so a reload lands on the
   step it left. Face down at step 3 ends it, and goes to Return to Origin.
   =========================================================================== */

const done = (step: string) => `did:rv-${step}` as const;

/** Every step, in order, and whether this save has done it. */
const STEPS = ["voice", "guard", "meera", "camera", "casefile", "montage", "line", "dark", "card"] as const;
type Step = (typeof STEPS)[number];

const stepOf = (s: CaseState): Step => STEPS.find((x) => !has(s, done(x))) ?? "card";

/* --- 1 · the voice note ---------------------------------------------------- */

function VoiceNote({ story, onDone }: { story: Story; onDone: () => void }) {
  const v = story.reveal!.voice;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    received();
    const go = window.setTimeout(() => setPlaying(true), 900);
    return () => window.clearTimeout(go);
  }, []);
  useVoice(v.key ? story.voices?.[v.key]?.src : undefined, playing);
  useEffect(() => {
    if (!playing) return undefined;
    const began = performance.now();
    const tick = window.setInterval(() => setT((performance.now() - began) / 1000), 120);
    return () => window.clearInterval(tick);
  }, [playing]);
  const bars = useMemo(() => Array.from({ length: 34 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7)) * 0.75), []);
  const shown = v.lines.filter((l) => l.at <= t);
  return (
    <div className={styles.stage} role="dialog" aria-label={`A voice note from ${v.who}`}>
      <div className={styles.vn}>
        <div className={styles.vnHead}>
          {story.owner && <Image src="/found/raakh/dp-bhasin.jpg" alt="" width={40} height={40} />}
          <span>
            <b>{v.who}</b>
            <span>🎤 Voice message · {phoneClock("03:58")} AM</span>
          </span>
        </div>
        <div className={styles.vnBubble}>
          <div className={styles.vnWave} aria-hidden="true">
            {bars.map((h, i) => (
              <span key={i} style={{ height: `${Math.round(h * 100)}%` }} data-on={i / bars.length < t / v.seconds || undefined} />
            ))}
          </div>
        </div>
        <ol className={styles.vnWords} aria-live="polite">
          {shown.map((l) => (
            <li key={l.at} lang={l.english ? "hi-Latn" : undefined}>
              {l.line}
              {l.english && <small>{l.english}</small>}
            </li>
          ))}
        </ol>
      </div>
      {t > v.seconds && (
        <button type="button" className={styles.next} onClick={onDone}>
          Go on
        </button>
      )}
    </div>
  );
}

/* --- 2 · the second phone -------------------------------------------------- */

function Guard({ story, state, onDone }: { story: Story; state: CaseState; onDone: (said: readonly ReplyOption[], declined: boolean) => void }) {
  const r = story.reveal!;
  // Declined, it rings twice more; then the guard texts.
  const [rings, setRings] = useState(0);
  const [waiting, setWaiting] = useState(false);
  // The story keeps beats: its clock needs no wall time.
  const time = phoneClock(clockNow(story, state, 0));
  useEffect(() => {
    if (!waiting) return undefined;
    const t = window.setTimeout(() => setWaiting(false), 1600);
    return () => window.clearTimeout(t);
  }, [waiting]);
  return (
    <div className={styles.stage} aria-hidden={false}>
      <YourPhoneOverlay wallpaper={story.yourPhone?.wallpaper ?? ""} time={time}>
        {rings >= 3 ? (
          <YourPhoneNote from={r.yours.call.from} text={r.yours.text} english="Khurrana sahab, Bhasin sahab is downstairs." onDone={() => onDone([], true)} />
        ) : waiting ? null : (
          <Ringing
            key={rings}
            compact
            call={r.yours.call}
            state={state}
            voices={story.voices}
            answered={false}
            onAnswer={() => {}}
            onDecline={() => {
              setRings((n) => n + 1);
              setWaiting(true);
            }}
            onSay={(said) => onDone(said, false)}
          />
        )}
      </YourPhoneOverlay>
    </div>
  );
}

/* --- 3 · M, on this phone -------------------------------------------------- */

function Meera({ story, state, onCamera, onAway }: { story: Story; state: CaseState; onCamera: () => void; onAway: () => void }) {
  const r = story.reveal!;
  const early = has(state, "did:early-reveal");
  // After an early reveal she doesn't ask who it is: she tells him to look.
  const call = early
    ? { ...r.call, id: `${r.call.id}-early`, lines: [{ who: r.early.who ?? "Meera", line: r.early.text, english: r.early.english }], reply: undefined }
    : r.call;
  return (
    <Ringing
      call={call}
      state={state}
      voices={story.voices}
      answered={false}
      wallpaper="/found/raakh-wallpaper.jpg"
      onAnswer={() => {}}
      onSay={(said) => sayAll(said)}
      finale={
        <div className={styles.look}>
          <button type="button" onClick={onCamera}>
            {r.look.open}
          </button>
          <button type="button" onClick={onAway}>
            {r.look.away}
          </button>
        </div>
      }
    />
  );
}

/** Face down: her "don't look", against Bhasin's at the fire, and then it's over. */
function Away({ line, voice, onDone }: { line: Said; voice?: string; onDone: () => void }) {
  useEffect(() => say(voice), [voice]);
  useEffect(() => {
    const t = window.setTimeout(onDone, 5200);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className={card.black} role="dialog" aria-label={line.text} onClick={onDone}>
      <div className={styles.line}>
        <p className={styles.lineWho}>{line.who}</p>
        <p className={styles.lineText} lang="hi-Latn">
          {line.text}
          {line.english && <small>{line.english}</small>}
        </p>
      </div>
    </div>
  );
}

/* --- 4 · the front camera --------------------------------------------------- */

function Camera({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const r = story.reveal!;
  const [ready, setReady] = useState(false);
  const [shot, setShot] = useState(has(state, "did:camera-photo"));
  const [flashing, setFlashing] = useState(false);
  // Three seconds of nothing: no music, no words. Then the shutter.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className={styles.camera} role="dialog" aria-label="The front camera">
      <p className={styles.camTop}>PHOTO</p>
      <div className={styles.finder}>
        <Image src={r.camera.src} alt={r.camera.alt} fill sizes="100vw" priority />
        <span className={styles.blink} aria-hidden="true" />
        <Hand className={styles.kada} />
        {flashing && <span className={styles.flash} onAnimationEnd={() => setFlashing(false)} aria-hidden="true" />}
      </div>
      <div className={styles.camBar}>
        <span className={styles.thumb} aria-label={shot ? "The photo you took" : undefined}>
          {shot && <Image src={r.camera.src} alt="" fill sizes="52px" style={{ objectFit: "cover" }} />}
        </span>
        <button
          type="button"
          className={styles.shutter}
          disabled={!ready || shot}
          aria-label="Take Photo"
          onClick={() => {
            setFlashing(true);
            setShot(true);
            flag("did:camera-photo");
          }}
        />
        {ready ? (
          <button type="button" onClick={onDone}>
            Done
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

/* --- 5 · the case file, turned over ------------------------------------------ */

function CaseInfo({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const r = story.reveal!;
  const q = story.questions.find((x) => x.id === r.info.question);
  const line = (q && filedClaim(q, state)?.text) ?? "";
  const called = has(state, "did:me-hunch");
  const [title, ...rows] = r.info.lines;
  return (
    <div className={styles.stage} role="dialog" aria-label="The case file's info">
      <div className={styles.info}>
        <p className={styles.infoHead}>{title}</p>
        <ul className={styles.infoRows}>
          {rows.map((row, i) => (
            <li key={row} style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
              {row}
            </li>
          ))}
        </ul>
        {line && <p className={styles.infoLine}>{line}</p>}
        {called && <span className={styles.stamp}>{r.info.called}</span>}
      </div>
      <button type="button" className={styles.next} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}

/* --- 6 · the montage ---------------------------------------------------------- */

type Beat = { readonly kind: "said"; readonly text: string; readonly at?: string; readonly answering: Said } | { readonly kind: "cut"; readonly index: number };

/** What an item on the phone is called, for "Deleted permanently: …". */
function itemName(story: Story, id: string): string {
  const p = [...story.photos, ...story.notes.flatMap((n) => n.attachments ?? [])].find((x) => x.id === id);
  if (p) return p.video ? (id === "reel-take" ? "the reel take" : "a video") : "a screenshot";
  if (story.memos.some((m) => m.id === id)) return "a voice memo";
  return "a message";
}

function montageOf(story: Story, s: CaseState): Beat[] {
  const r = story.reveal!;
  const options = exchanges(story).flatMap((x) => x.options);
  const lines: Beat[] = [];
  for (const m of r.montage.lines) {
    if (lines.length >= r.montage.limit || !has(s, m.said)) continue;
    if (m.said === "did:deleted-perm") {
      const gone = Object.entries(s.deleted ?? {}).find(([, how]) => how === "perm");
      if (!gone) continue;
      lines.push({ kind: "said", text: `Deleted permanently: ${itemName(story, gone[0])}`, at: clockOf(s, `deleted:${gone[0]}`), answering: m.answering });
      continue;
    }
    const o = options.find((x) => x.sets?.includes(m.said));
    if (o) lines.push({ kind: "said", text: o.text, at: clockOf(s, `said:${m.said}`), answering: m.answering });
  }
  // Two lines, a cut, two lines, a cut, the rest, the last cut.
  const out: Beat[] = [];
  lines.forEach((l, i) => {
    out.push(l);
    if (i === 1) out.push({ kind: "cut", index: 0 });
    if (i === 3) out.push({ kind: "cut", index: 1 });
  });
  if (lines.length < 2) out.push({ kind: "cut", index: 0 });
  if (lines.length < 4) out.push({ kind: "cut", index: 1 });
  out.push({ kind: "cut", index: 2 });
  return out;
}

function Montage({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const beats = useMemo(() => montageOf(story, state), [story, state]);
  const r = story.reveal!;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= beats.length) {
      onDone();
      return undefined;
    }
    const b = beats[i];
    if (b.kind === "said") sent();
    if (b.kind === "cut" && b.index === 0) say(story.voices?.["clip:reel-pakki"]?.src);
    const t = window.setTimeout(() => setI((n) => n + 1), b.kind === "said" ? 3600 : 2600);
    return () => window.clearTimeout(t);
  }, [i, beats, onDone, story.voices]);
  const b = beats[i];
  return (
    <div className={styles.stage} role="dialog" aria-label="Everything you said tonight" onClick={() => setI((n) => n + 1)}>
      {b?.kind === "said" && (
        <div key={i} className={styles.montage}>
          {b.at && <p className={styles.mAt}>{stamp(b.at)}</p>}
          <p className={styles.mLine} lang="hi-Latn">
            “{b.text}”
          </p>
          <p className={styles.mAnswer} lang="hi-Latn">
            {b.answering.who ? `${b.answering.who}: ` : ""}“{b.answering.text}”
            {b.answering.english && ` (${b.answering.english})`}
          </p>
        </div>
      )}
      {b?.kind === "cut" && b.index === 1 && (
        <div key={i} className={styles.split} role="img" aria-label="Two hands: at the parcel tonight, at the fire a week ago. The same kada.">
          <span>
            <Hand holding="strip" />
          </span>
          <span>
            <Image src="/found/raakh/jerrycan.jpg" alt="" fill sizes="210px" />
          </span>
        </div>
      )}
      {b?.kind === "cut" && b.index !== 1 && (
        <span key={i} className={styles.cut}>
          <Image src={r.montage.cuts[b.index]?.src ?? ""} alt="" fill sizes="360px" style={b.index === 2 ? { objectPosition: "20% 40%", scale: "1.5" } : undefined} />
          <span className={styles.cutText}>
            {r.montage.cuts[b.index]?.text}
            <small>{r.montage.cuts[b.index]?.sub}</small>
          </span>
        </span>
      )}
    </div>
  );
}

/* --- 7 · what she says --------------------------------------------------------- */

function MeeraLine({ story, state, onDone }: { story: Story; state: CaseState; onDone: () => void }) {
  const r = story.reveal!;
  const early = has(state, "did:early-reveal");
  const variant = early ? "early" : leaning(story, state);
  const line = r.lines[variant];
  useEffect(() => say(story.voices?.[`reveal:meera-${variant}`]?.src), [story.voices, variant]);
  // After an early reveal, the case file answers her: when the hunch was filed.
  const when = clockOf(state, "filed:q1:me");
  return (
    <div className={styles.stage} role="dialog" aria-label={line.text}>
      <div className={styles.line}>
        <p className={styles.lineWho}>{line.who}</p>
        <p className={styles.lineText} lang="hi-Latn">
          {line.text}
          {line.english && <small>{line.english}</small>}
        </p>
        {early && <p className={styles.answerNote}>Case file · Q1 · filed as your hunch{when ? ` at ${stamp(when)}` : ""}.</p>}
      </div>
      <button type="button" className={styles.next} onClick={onDone}>
        Go on
      </button>
    </div>
  );
}

/* --- 9 · the card ---------------------------------------------------------------- */

function Card({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className={card.card} role="status">
      <p className={card.cardLine}>{text}</p>
    </div>
  );
}

export default function RevealDirector({ story, state }: { story: Story; state: CaseState }) {
  const r = story.reveal!;
  const step = stepOf(state);
  const [away, setAway] = useState(false);
  const held = heldOn(story, state);

  if (away)
    return (
      <Away
        line={r.look.awayLine}
        voice={story.voices?.["reveal:away"]?.src}
        onDone={() => flag(done("meera"), FACE_DOWN, REVEAL_DONE)}
      />
    );

  switch (step) {
    case "voice":
      return <VoiceNote story={story} onDone={() => flag(done("voice"))} />;
    case "guard":
      return (
        <Guard
          story={story}
          state={state}
          onDone={(said, declined) => {
            if (said.length) sayAll(said);
            flag(done("guard"), ...(declined ? (["did:guard-declined"] as const) : []));
          }}
        />
      );
    case "meera":
      return <Meera story={story} state={state} onCamera={() => flag("did:camera-open", done("meera"))} onAway={() => setAway(true)} />;
    case "camera":
      return <Camera story={story} state={state} onDone={() => flag(done("camera"))} />;
    case "casefile":
      return <CaseInfo story={story} state={state} onDone={() => flag(done("casefile"))} />;
    case "montage":
      return <Montage story={story} state={state} onDone={() => flag(done("montage"))} />;
    case "line":
      return <MeeraLine story={story} state={state} onDone={() => flag(done("line"))} />;
    case "dark":
      return <DarkLine line={r.dark.line} sub={r.dark.held.replace("{n}", String(held.n)).replace("{of}", String(held.of))} onDone={() => flag(done("dark"))} />;
    case "card":
      return <Card text={r.card} onDone={() => flag(done("card"), REVEAL_DONE)} />;
  }
}
