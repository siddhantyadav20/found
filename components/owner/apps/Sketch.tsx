import type { CSSProperties } from "react";

import styles from "./Sketch.module.css";

/* ===========================================================================
   Until the shoot: a photograph drawn as a sketch of what's in it, instead
   of its caption on a gradient (the 2026-10-02 stress test: mixed in with
   real stock frames, the captions read as broken images, and the 9:48 waiter
   had no waistcoat to lean in on).

   The ones a question turns on are drawn for what they show: the waiter
   with a badge where the zoom finds DILIP, Kunal with his father's
   revolver, Sameer with the gun raised and a boy holding the light. Every
   other frame is the same night, a string of lights and the people under it,
   with its caption at the foot. Drawn in a 300 × 400 frame, a portrait photo.
   =========================================================================== */

const LIGHTS = Array.from({ length: 16 }, (_, i) => ({ x: 10 + i * 19, y: 40 + 10 * Math.sin(i * 0.9) }));

function Lights({ y = 0 }: { y?: number }) {
  return (
    <g className={styles.lights} transform={`translate(0 ${y})`}>
      <path d={`M0 ${LIGHTS[0].y} ${LIGHTS.map((p) => `L${p.x} ${p.y}`).join(" ")} L300 40`} className={styles.wire} />
      {LIGHTS.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y + 3} r="3" />
      ))}
    </g>
  );
}

/** A person, head and shoulders: `coat` is what they wear. */
function Person({ x, y, s = 1, coat }: { x: number; y: number; s?: number; coat: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-46 140v-52q0-34 46-38q46 4 46 38v52z" className={coat} />
      <circle cx="0" cy="22" r="24" className={styles.skin} />
      <path d="M-24 14q4-30 24-30q22 0 24 30q-10-14-24-14t-24 14z" className={styles.hair} />
    </g>
  );
}

function Revolver({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} className={styles.gun}>
      <rect x="0" y="-5" width="40" height="10" rx="2" />
      <rect x="-10" y="-8" width="16" height="16" rx="4" />
      <path d="M-8 6l-6 18h10l4-14z" />
    </g>
  );
}

const DRAWN: Record<string, (hue: number) => React.ReactNode> = {
  // 9:48 PM: the badge sits where Photo.zoom puts it (34%, 66% of the frame).
  "w-portrait": () => (
    <>
      <Lights />
      <Person x={150} y={150} s={1.6} coat={styles.waistcoat} />
      <rect x={86} y={258} width={32} height={12} rx={2} className={styles.badge} />
      <path d="M185 228q30-6 60-2" className={styles.arm} />
      <ellipse cx={248} cy={222} rx={40} ry={7} className={styles.tray} />
    </>
  ),
  "w-kunal": () => (
    <>
      <circle cx={30} cy={70} r={60} className={styles.leaf} />
      <circle cx={280} cy={60} r={64} className={styles.leaf} />
      <Lights y={20} />
      <Person x={140} y={170} s={1.5} coat={styles.kurta} />
      <path d="M190 260q24-40 40-84" className={styles.arm} />
      <Revolver x={222} y={170} angle={-70} />
    </>
  ),
  bts: () => (
    <>
      <Lights />
      <Person x={100} y={180} s={1.3} coat={styles.dark} />
      <path d="M140 250q24-46 46-96" className={styles.arm} />
      <Revolver x={180} y={150} angle={-62} />
      <Person x={232} y={230} s={0.95} coat={styles.waistcoat} />
      <rect x={210} y={130} width={50} height={36} rx={3} className={styles.led} />
      <path d="M235 166v40" className={styles.stand} />
    </>
  ),
};

/** The rest of the night: a crowd under the lights, set by the frame's own hue. */
function Night({ hue }: { hue: number }) {
  const n = 2 + (hue % 3);
  return (
    <>
      <Lights />
      {Array.from({ length: n }, (_, i) => (
        <Person key={i} x={60 + (i * 200) / Math.max(1, n - 1)} y={230 + ((i * 37) % 40)} s={0.9} coat={i % 2 ? styles.dark : styles.kurta} />
      ))}
    </>
  );
}

export default function Sketch({ id, title, hue, big }: { id: string; title: string; hue: number; big?: boolean }) {
  const drawn = DRAWN[id];
  return (
    <div className={styles.sketch} data-big={big || undefined} style={{ "--hue": hue } as CSSProperties}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
        {drawn ? drawn(hue) : <Night hue={hue} />}
      </svg>
      <span className={styles.caption}>{title}</span>
    </div>
  );
}
