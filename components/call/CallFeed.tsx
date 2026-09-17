"use client";

import styles from "./CallFeed.module.css";

/* ===========================================================================
   What the player sees on the call: a man in a uniform, a board behind him
   that says Mumbai Police, and a clock on the wall that is an hour wrong.

   Drawn, not filmed, until the shoot happens (ROADMAP.md P11). It is treated
   like a bad 4G video call on purpose — soft, blocky, a little behind itself
   — so that the placeholder reads as footage rather than as an illustration,
   and so the real clips can drop into the same frame later.

   Two things in here are plot and must survive every change: **the wall clock
   reads Myanmar time**, and **the extinguisher's label isn't in any Indian
   script**. Both have to be legible at 3x zoom and invisible at 1x.
   =========================================================================== */

export default function CallFeed({
  board,
  clock,
  supervisor,
  dark,
}: {
  board: string;
  /** His time, not Mumbai's: "02:11" while her phone says 01:11. */
  clock: string;
  supervisor: boolean;
  /** Her side is dark: the camera has been off since the pouch was sealed. */
  dark?: boolean;
}) {
  const [h, m] = clock.split(":").map(Number);
  // A clock face, not a digital readout: a player has to read it to notice.
  const minute = m * 6;
  const hour = ((h % 12) + m / 60) * 30;

  return (
    <div className={styles.feed} data-dark={dark ? "" : undefined}>
      <svg className={styles.scene} viewBox="0 0 320 240" role="img" aria-label="A man in a police uniform at a desk, on a video call.">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b5148" />
            <stop offset="100%" stopColor="#2e332d" />
          </linearGradient>
          <linearGradient id="man" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c5f52" />
            <stop offset="100%" stopColor="#2b2d26" />
          </linearGradient>
        </defs>

        <rect width="320" height="240" fill="url(#wall)" />

        {/* The board he is sitting in front of, which is the whole trick. */}
        <g className={styles.board}>
          <rect x="24" y="28" width="150" height="54" rx="2" fill="#1f241f" stroke="#6d7566" />
          <text x="99" y="52" textAnchor="middle" className={styles.boardText}>
            {board.split(" · ")[0]}
          </text>
          <text x="99" y="68" textAnchor="middle" className={styles.boardSub}>
            {board.split(" · ")[1] ?? ""}
          </text>
        </g>

        {/* A flag in the corner, the way every office in every video has one. */}
        <g>
          <rect x="188" y="30" width="3" height="60" fill="#5a5f52" />
          <rect x="191" y="32" width="26" height="7" fill="#c07a3a" />
          <rect x="191" y="39" width="26" height="7" fill="#d9d5cc" />
          <rect x="191" y="46" width="26" height="7" fill="#5f7a52" />
        </g>

        {/* The clock. An hour ahead of her phone, from the first second. */}
        <g className={styles.clock}>
          <circle cx="262" cy="56" r="21" fill="#1b1f1a" stroke="#8e9686" strokeWidth="1.5" />
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={262 + Math.sin((i * 30 * Math.PI) / 180) * 17}
              y1={56 - Math.cos((i * 30 * Math.PI) / 180) * 17}
              x2={262 + Math.sin((i * 30 * Math.PI) / 180) * 19}
              y2={56 - Math.cos((i * 30 * Math.PI) / 180) * 19}
              stroke="#8e9686"
              strokeWidth="1"
            />
          ))}
          <line
            x1="262"
            y1="56"
            x2={262 + Math.sin((hour * Math.PI) / 180) * 9}
            y2={56 - Math.cos((hour * Math.PI) / 180) * 9}
            stroke="#e7e2d8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="262"
            y1="56"
            x2={262 + Math.sin((minute * Math.PI) / 180) * 14}
            y2={56 - Math.cos((minute * Math.PI) / 180) * 14}
            stroke="#e7e2d8"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="262" cy="56" r="1.6" fill="#e7e2d8" />
        </g>

        {/* Him. A uniform, a desk, and a man who has been awake for two days. */}
        <g className={styles.him}>
          <ellipse cx="160" cy="146" rx="21" ry="25" fill="#6b6455" />
          <path d="M139 144c0-15 9-25 21-25s21 10 21 25" fill="#5b5547" />
          <path d="M116 240c0-34 20-54 44-54s44 20 44 54z" fill="url(#man)" />
          <rect x="140" y="196" width="40" height="6" rx="2" fill="#3a3d33" />
          <rect x="151" y="187" width="18" height="9" rx="2" fill="#7b8270" opacity="0.7" />
        </g>

        {/* The desk edge, and the extinguisher nobody looks at. */}
        <rect x="0" y="214" width="320" height="26" fill="#22251f" />
        <g className={styles.extinguisher}>
          <rect x="292" y="150" width="18" height="54" rx="5" fill="#8a3a2e" />
          <rect x="294" y="168" width="14" height="16" rx="1" fill="#e2ddd2" />
          <text x="301" y="179" textAnchor="middle" className={styles.burmese}>
            မီးသတ်
          </text>
        </g>

        {supervisor && <rect className={styles.shadow} x="0" y="0" width="320" height="240" fill="#000" />}
      </svg>

      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      {dark && <div className={styles.dark} aria-hidden="true" />}
    </div>
  );
}
