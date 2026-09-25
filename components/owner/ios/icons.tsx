import { useId, type ReactNode } from "react";

import type { AppId } from "@/content/types";
import styles from "./icons.module.css";

/* ===========================================================================
   The found phone's app icons, drawn as the real ones look on iOS 26 and 27:
   full-bleed artwork on Apple's squircle (the `.sq` mask), each app's own
   colours and mark. The apps that are part of a chapter's crime (Paytap) are
   ours outright, and so is the one icon that's the player's: the case file.

   Every icon is drawn on a 100-unit square. Gradient ids come from `useId`,
   so the same icon twice on a screen (the dock and a banner) never borrows
   the other's gradients.
   =========================================================================== */

/** A gear's outline around (50, 50): `n` teeth rising from radius `r` to `R`. */
function gear(n: number, r: number, R: number): string {
  const step = (2 * Math.PI) / n;
  const at = (rad: number, a: number) => `${(50 + rad * Math.cos(a)).toFixed(1)} ${(50 + rad * Math.sin(a)).toFixed(1)}`;
  const p: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * step;
    p.push(at(r, a), at(r, a + step * 0.38), at(R, a + step * 0.5), at(R, a + step * 0.88));
  }
  return `M${p.join("L")}Z`;
}

const OUTER_GEAR = gear(36, 36.5, 42);
const INNER_GEAR = gear(20, 18.5, 23);

/** Photos' flower: eight petals, clockwise from the top. */
const PETALS = ["#f79a2b", "#f7cd2f", "#a2d45a", "#3cbf8c", "#35a6de", "#5874d8", "#a25ecb", "#ef577c"];

/** The Material Design handset (Apache 2.0), on a 24-unit square. */
const HANDSET =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

/** A vertical gradient for a tile, `from` at the top. */
const Vertical = ({ id, from, to }: { id: string; from: string; to: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

const Tile = ({ fill }: { fill: string }) => <rect width="100" height="100" fill={fill} />;

/** Each app's artwork. `id` prefixes its gradient ids. */
const ART: Record<AppId, (id: string) => ReactNode> = {
  whatsapp: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#62fb7d" to="#23b83f" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      {/* The bubble: a ring round (50, 48) that runs out into its tail, bottom left. */}
      <path
        fillRule="evenodd"
        fill="#fff"
        d="M24 63A30 30 0 1 1 37.3 75.2L19 80.5ZM75.5 48A25.5 25.5 0 1 0 24.5 48A25.5 25.5 0 1 0 75.5 48Z"
      />
      <path d={HANDSET} fill="#fff" transform="translate(36.5 34.5) scale(1.12)" />
    </>
  ),
  phone: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#6cfa80" to="#12c13a" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <path d={HANDSET} fill="#fff" transform="translate(22 22) scale(2.33)" />
    </>
  ),
  "yours:phone": (id) => ART.phone(id),
  messages: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#6cfa80" to="#12c13a" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <ellipse cx="50" cy="47" rx="31.5" ry="26.5" fill="#fff" />
      <path d="M28.5 63.5C28.8 70.5 24.8 76.4 18 80C28.5 81 36.5 77.4 41.5 72Z" fill="#fff" />
    </>
  ),
  "yours:chats": (id) => ART.messages(id),
  mail: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#3fb2ff" to="#0f5ef0" />
        <Vertical id={`${id}e`} from="#ffffff" to="#e4ecf8" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <rect x="16" y="28.5" width="68" height="44" rx="5.5" fill={`url(#${id}e)`} />
      <path d="M18 31.5 50 56l32-24.5" fill="none" stroke="#9fb6d8" strokeWidth="2.4" strokeLinejoin="round" />
    </>
  ),
  safari: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#ffffff" to="#e2e2e8" />
        <Vertical id={`${id}c`} from="#26a6f7" to="#1164e0" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <circle cx="50" cy="50" r="37.5" fill={`url(#${id}c)`} />
      {/* The compass rose's ticks: one dashed ring. */}
      <circle cx="50" cy="50" r="32.5" fill="none" stroke="#fff" strokeWidth="5.5" strokeDasharray="0.75 2.65" opacity="0.92" />
      <path d="M73 27 52.9 52.9 47.1 47.1Z" fill="#ff3b30" />
      <path d="M27 73 52.9 52.9 47.1 47.1Z" fill="#f2f2f7" />
    </>
  ),
  photos: () => (
    <>
      <Tile fill="#fff" />
      <g transform="translate(50 50)" style={{ mixBlendMode: "multiply" }}>
        {PETALS.map((c, i) => (
          <rect key={c} x="-10.5" y="-40" width="21" height="33" rx="10.5" fill={c} opacity="0.94" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </>
  ),
  settings: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#d9d9de" to="#8f8f95" />
        <Vertical id={`${id}m`} from="#f4f4f6" to="#a9a9b0" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <path d={OUTER_GEAR} fill="#4a4a4f" />
      <circle cx="50" cy="50" r="34" fill={`url(#${id}m)`} />
      <circle cx="50" cy="50" r="27" fill="#47474c" />
      <path d={INNER_GEAR} fill={`url(#${id}m)`} />
      <circle cx="50" cy="50" r="12" fill="#47474c" />
      <circle cx="50" cy="50" r="5" fill={`url(#${id}m)`} />
    </>
  ),
  notes: (id) => (
    <>
      <defs>
        <Vertical id={`${id}y`} from="#fedd4a" to="#f8c21c" />
      </defs>
      <Tile fill="#fdfdfb" />
      <rect width="100" height="26" fill={`url(#${id}y)`} />
      <rect y="26" width="100" height="1.5" fill="#000" opacity="0.08" />
      <path d="M8 32.5h84" stroke="#b8b8bd" strokeWidth="1.6" strokeDasharray="0.1 5.4" strokeLinecap="round" />
      {[47, 61, 75, 89].map((y) => (
        <rect key={y} y={y} width="100" height="1.3" fill="#d1d1d6" />
      ))}
    </>
  ),
  voicememos: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#1c1c1e" to="#000000" />
        <linearGradient id={`${id}w`} x1="20" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff2d55" />
          <stop offset="1" stopColor="#ff6a3d" />
        </linearGradient>
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <g stroke={`url(#${id}w)`} strokeWidth="2.8" strokeLinecap="round">
        {[5, 9, 15, 24, 33, 21, 13, 28, 38, 26, 17, 11, 19, 10, 6].map((h, i) => (
          <path key={i} d={`M${22 + i * 4} ${50 - h / 2}V${50 + h / 2}`} />
        ))}
      </g>
    </>
  ),
  instagram: (id) => (
    <>
      <defs>
        <radialGradient id={`${id}a`} cx="0.28" cy="1.08" r="1.3">
          <stop offset="0" stopColor="#ffdd55" />
          <stop offset="0.12" stopColor="#ffdd55" />
          <stop offset="0.5" stopColor="#ff543e" />
          <stop offset="1" stopColor="#c837ab" />
        </radialGradient>
        <radialGradient id={`${id}p`} cx="-0.17" cy="0.07" r="0.62">
          <stop offset="0" stopColor="#3771c8" />
          <stop offset="0.13" stopColor="#3771c8" />
          <stop offset="1" stopColor="#6600ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Tile fill={`url(#${id}a)`} />
      <Tile fill={`url(#${id}p)`} />
      <g fill="none" stroke="#fff" strokeWidth="6.2">
        <rect x="24" y="24" width="52" height="52" rx="15" />
        <circle cx="50" cy="50" r="12.4" />
      </g>
      <circle cx="64.6" cy="35.4" r="3.9" fill="#fff" />
    </>
  ),
  paytap: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#169a82" to="#0a4a3f" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <circle cx="50" cy="50" r="29" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3.2" />
      <path
        d="M38 36h24M38 46h24M43 36c11 0 14.5 4.6 14.5 9.5S54 56 43 56l18 13"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  casefile: (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#3d4250" to="#1b1e25" />
        <Vertical id={`${id}f`} from="#f0c77a" to="#d7a24f" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <path d="M18 33.5c0-3.3 2.7-6 6-6h14.5l6 6.5H76c3.3 0 6 2.7 6 6V71c0 3.3-2.7 6-6 6H24c-3.3 0-6-2.7-6-6Z" fill={`url(#${id}f)`} />
      <rect x="28" y="43" width="40" height="4.6" rx="2.3" fill="#8a6a2e" />
      <circle cx="68" cy="62" r="9.5" fill="none" stroke="#fff" strokeWidth="5" />
      <path d="m75 69 7 7" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" />
    </>
  ),
  "yours:share": (id) => (
    <>
      <defs>
        <Vertical id={`${id}b`} from="#5eb4ff" to="#1d6fe6" />
      </defs>
      <Tile fill={`url(#${id}b)`} />
      <g fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 60V22M50 22 38 34M50 22l12 12" />
        <path d="M30 48v25a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V48" />
      </g>
    </>
  ),
};

/** An app's icon, filling whatever box it's put in. */
export function AppGlyph({ app }: { app: AppId }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`${styles.tile} sq`}>
      <svg viewBox="0 0 100 100" className={styles.art} aria-hidden="true">
        {ART[app]?.(id)}
      </svg>
    </span>
  );
}
