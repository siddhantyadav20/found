import styles from "./Scene.module.css";

/* ===========================================================================
   The room a site page's hero stands in (2026-10-25): a wireframe box seen
   from inside, walls, floor and ceiling ruled into squares that run back
   to a far wall, the way a game's stage is drawn before anything is
   built on it. Drawn once, here, as one SVG: nothing to load, crisp at any
   size. Its lines trace in when the page opens, and it leans away from the
   pointer (Motion sets --mx and --my on the hero).
   =========================================================================== */

const W = 1600;
const H = 1000;
/** Where the walls meet the far wall, and how big the far wall is. */
const VX = W / 2;
const VY = H * 0.46;
const BW = 560;
const BH = 340;
/** How far past the frame the near edge of the room reaches. */
const NEAR = 3.4;
/** Squares across the far wall, and rings of depth toward you. */
const ACROSS = 8;
const DOWN = 5;
const RINGS = 7;

const n = (v: number) => Math.round(v * 10) / 10;

/** The rectangle of the room at a depth: 1 is the far wall, NEAR the near edge. */
function ring(k: number) {
  return { l: VX - (BW / 2) * k, r: VX + (BW / 2) * k, t: VY - (BH / 2) * k, b: VY + (BH / 2) * k };
}

function draw(): string {
  const d: string[] = [];
  const far = ring(1);
  const near = ring(NEAR);
  // Depth: rings spaced as perspective spaces them, close together far away.
  for (let i = 0; i <= RINGS; i++) {
    const z = 1 / (1 - (i / (RINGS + 1)) * (1 - 1 / NEAR));
    const r = ring(z);
    d.push(`M${n(r.l)} ${n(r.t)}H${n(r.r)}V${n(r.b)}H${n(r.l)}Z`);
  }
  // Lines running back along the floor and ceiling, and across the far wall.
  for (let i = 0; i <= ACROSS; i++) {
    const t = i / ACROSS;
    const fx = far.l + (far.r - far.l) * t;
    const nx = near.l + (near.r - near.l) * t;
    d.push(`M${n(nx)} ${n(near.b)}L${n(fx)} ${n(far.b)}V${n(far.t)}L${n(nx)} ${n(near.t)}`);
  }
  // And along the two walls.
  for (let i = 1; i < DOWN; i++) {
    const t = i / DOWN;
    const fy = far.t + (far.b - far.t) * t;
    const ny = near.t + (near.b - near.t) * t;
    d.push(`M${n(near.l)} ${n(ny)}L${n(far.l)} ${n(fy)}H${n(far.r)}L${n(near.r)} ${n(ny)}`);
  }
  return d.join("");
}

const PATH = draw();

export default function Room({ className }: { className?: string }) {
  return (
    <div className={`${styles.room} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <path d={PATH} pathLength={1} />
      </svg>
    </div>
  );
}
