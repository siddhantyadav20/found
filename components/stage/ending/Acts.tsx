"use client";

import { useEffect, useRef, useState } from "react";

import { has, type CaseState } from "@/lib/game/engine";
import CutSlider from "./CutSlider";
import { CallBar, placeName, RouteMap } from "./parts";
import styles from "./Ending.module.css";

/* ===========================================================================
   The three acts. Each ending is something done with the hands, never a menu
   pick (PLAYER-JOURNEY Stage 9):

     01  drag the red button all the way, a map, a door
     02  drag it, walk to the sea, throw her phone off the edge of the screen
     03  don't cut; open the share sheet while he talks, type a name, send

   Until the act is done the player can still step back to the rows. After
   it, nothing is undone.
   =========================================================================== */

type Act = { state: CaseState; onDone: () => void; onBack: () => void };

const WALK_S = 10;

/* --- 01 ------------------------------------------------------------------ */

export function Police({ state, onDone, onBack }: Act) {
  const [step, setStep] = useState<"cut" | "map" | "door">("cut");
  // Her real note said where to go. Without it, the nearest station.
  const place = has(state, "saw:real-note") ? "bkc" : "dadar";

  if (step === "cut")
    return (
      <div className={styles.column}>
        <CallBar state={state} />
        <p className={styles.line}>Cut the call.</p>
        <CutSlider label="slide to end call" onCut={() => setStep("map")} />
        <button type="button" className={styles.quiet} onClick={onBack}>
          Not yet
        </button>
      </div>
    );

  if (step === "map")
    return (
      <div className={styles.column}>
        <CallBar state={state} ended />
        <RouteMap to={place} />
        <button type="button" className={styles.button} onClick={() => setStep("door")}>
          Go
        </button>
      </div>
    );

  return (
    <div className={styles.column}>
      <p className={styles.eyebrow}>{placeName(place)}</p>
      <div className={styles.door} aria-hidden="true" />
      <p className={styles.sub}>Her phone is in your pocket. It is still warm.</p>
      <button type="button" className={styles.button} onClick={onDone}>
        Go in
      </button>
    </div>
  );
}

/* --- 02 ------------------------------------------------------------------ */

export function Sea({ state, onDone, onBack }: Act) {
  const [step, setStep] = useState<"cut" | "walk" | "sea">("cut");

  // Ten seconds for the walk, then the sea. Nothing to press.
  useEffect(() => {
    if (step !== "walk") return undefined;
    const t = window.setTimeout(() => setStep("sea"), WALK_S * 1000 + 600);
    return () => window.clearTimeout(t);
  }, [step]);

  if (step === "cut")
    return (
      <div className={styles.column}>
        <CallBar state={state} />
        <p className={styles.line}>Cut the call.</p>
        <CutSlider label="slide to end call" onCut={() => setStep("walk")} />
        <button type="button" className={styles.quiet} onClick={onBack}>
          Not yet
        </button>
      </div>
    );

  if (step === "walk")
    return (
      <div className={styles.column} style={{ ["--walk" as string]: `${WALK_S}s` }}>
        <CallBar state={state} ended />
        <RouteMap to="chowpatty" walk />
        <p className={styles.sub}>Noon. You walk.</p>
      </div>
    );

  return <Throw state={state} onDone={onDone} />;
}

/** Her phone, and the edge of the screen. */
function Throw({ state, onDone }: { state: CaseState; onDone: () => void }) {
  const phone = useRef<HTMLDivElement>(null);
  const from = useRef<{ x: number; y: number } | null>(null);
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  const [gone, setGone] = useState(false);
  // If they used her password, the last thing it does is light up with the bank.
  const pin = has(state, "did:typed-password");

  const letGo = () => {
    if (gone) return;
    setGone(true);
    setAt((a) => ({ x: a.x * 3 || 40, y: -window.innerHeight }));
    window.setTimeout(onDone, 1000);
  };

  return (
    <div className={styles.column} style={{ flex: 1, width: "100%" }}>
      <p className={styles.eyebrow}>Dadar Chowpatty · 12:04 PM</p>
      <div className={styles.sea}>
        <div
          ref={phone}
          className={styles.herPhone}
          data-flying={gone || undefined}
          data-back={(!held && !gone) || undefined}
          style={{ transform: `translate(${at.x}px, ${at.y}px) rotate(${at.x / 12}deg)` }}
          role="img"
          aria-label="Her phone, in your hand"
          onPointerDown={(e) => {
            if (gone) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            from.current = { x: e.clientX - at.x, y: e.clientY - at.y };
            setHeld(true);
          }}
          onPointerMove={(e) => {
            if (!from.current) return;
            setAt({ x: e.clientX - from.current.x, y: e.clientY - from.current.y });
          }}
          onPointerUp={() => {
            from.current = null;
            setHeld(false);
            // Far enough up and out, and it's gone. Otherwise it comes back to your hand.
            const box = phone.current?.parentElement?.getBoundingClientRect();
            const far = box ? -at.y > box.height * 0.45 || Math.abs(at.x) > box.width * 0.4 : false;
            if (far) letGo();
            else setAt({ x: 0, y: 0 });
          }}
        >
          <span className={styles.herPill}>01:11</span>
          {pin && (held || gone) && (
            <span className={styles.herNotice}>
              <b>Unknown Sender</b>
              <br />
              Rs.1,00,000.00 debited 03:02 via UPI to TANVI R DESHMUKH
            </span>
          )}
        </div>
      </div>
      <p className={styles.sub}>Throw it.</p>
      <button type="button" className={styles.quiet} onClick={letGo} disabled={gone}>
        Let go of it
      </button>
    </div>
  );
}

/* --- 03 ------------------------------------------------------------------ */

const FRIEND_KEY = "found:friend";

/** Who the player sent it to, for the thread that follows. Kept for this visit only. */
export function readFriend(): string {
  try {
    return window.sessionStorage.getItem(FRIEND_KEY) || "";
  } catch {
    return "";
  }
}

export function Share({ state, onDone, onBack }: Act) {
  const [name, setName] = useState("");
  // Everything goes: whatever of hers the player found.
  const attached = [
    ["saw:diary-1", "Her diary, photographed"],
    ["saw:list", "The list, page 6"],
    ["saw:real-note", "Her real note"],
    ["saw:collector", "The 38-second recording"],
    ["saw:detour", "The bike's route"],
  ]
    .filter(([f]) => has(state, f as `saw:${string}`))
    .map(([, label]) => label);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const who = name.trim().slice(0, 24);
    if (!who) return;
    try {
      window.sessionStorage.setItem(FRIEND_KEY, who);
    } catch {
      // The thread calls them "your friend" instead.
    }
    onDone();
  };

  return (
    <form className={styles.column} onSubmit={send}>
      {/* The call keeps running while you do it. For them, you're still cooperating. */}
      <CallBar state={state} />
      <div className={styles.sheet}>
        <p className={styles.eyebrow} style={{ textAlign: "left" }}>
          Share · {attached.length + 1} items
        </p>
        <div className={styles.chips}>
          <span className={styles.chip}>Screenshots of her phone</span>
          {attached.map((a) => (
            <span key={a} className={styles.chip}>
              {a}
            </span>
          ))}
        </div>
        <label className={styles.to}>
          <span>To:</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="A friend's first name"
            autoComplete="off"
            autoCapitalize="words"
            maxLength={24}
          />
        </label>
      </div>
      <button type="submit" className={styles.button} disabled={!name.trim()}>
        Send
      </button>
      <button type="button" className={styles.quiet} onClick={onBack}>
        Not yet
      </button>
    </form>
  );
}
