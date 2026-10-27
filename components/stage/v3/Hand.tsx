/* ===========================================================================
   The player's hand, on the table (PG-TABLE, RAAKH-V3 §6): a right wrist
   coming in from the bottom edge, a shirt cuff, and a plain silver kada
   half under it. Never foregrounded; always the same width (§16, the
   continuity lock), so that the hand at the parcel, at the charger and in
   the montage is plainly one hand. `holding` says what it's doing.
   =========================================================================== */

export default function Hand({ holding, className }: { holding?: "strip" | "cable"; className?: string }) {
  return (
    <svg viewBox="0 0 240 300" className={className} aria-hidden="true" data-holding={holding}>
      <defs>
        <linearGradient id="hand-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9825c" />
          <stop offset="1" stopColor="#8a5a3c" />
        </linearGradient>
        <linearGradient id="hand-kada" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8e9196" />
          <stop offset="0.45" stopColor="#f1f2f4" />
          <stop offset="0.6" stopColor="#c9ccd1" />
          <stop offset="1" stopColor="#7b7e83" />
        </linearGradient>
        <linearGradient id="hand-cuff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2f38" />
          <stop offset="1" stopColor="#171a20" />
        </linearGradient>
      </defs>
      {/* What it holds: the parcel's strip, or a charging cable. */}
      {holding === "cable" ? (
        <path d="M150 40 C 150 10, 200 0, 238 6" fill="none" stroke="#efefef" strokeWidth="7" strokeLinecap="round" />
      ) : holding === "strip" ? (
        <rect x="118" y="18" width="104" height="14" rx="3" fill="#c9a77a" transform="rotate(-8 170 25)" />
      ) : null}
      {/* Forearm, from the bottom edge. */}
      <path d="M86 300 C 92 240, 104 196, 116 162 L 170 172 C 166 204, 160 252, 158 300 Z" fill="url(#hand-skin)" />
      {/* The hand, fingers closed round what it holds. */}
      <path
        d="M112 168 C 104 132, 108 96, 128 72 C 138 60, 156 52, 170 58 C 184 64, 186 82, 178 100 C 190 96, 198 108, 192 122 C 200 124, 202 140, 192 150 C 188 166, 176 176, 166 176 Z"
        fill="url(#hand-skin)"
      />
      <path d="M134 74 C 140 56, 156 40, 172 44" fill="none" stroke="#8a5a3c" strokeWidth="13" strokeLinecap="round" />
      <path d="M150 64 C 160 46, 176 36, 190 42" fill="none" stroke="#9a6846" strokeWidth="12" strokeLinecap="round" />
      {/* The kada, plain silver, half under the cuff. */}
      <path d="M100 210 C 120 202, 150 206, 168 216 L 166 232 C 148 222, 120 218, 98 226 Z" fill="url(#hand-kada)" />
      {/* The shirt cuff, over the wrist. */}
      <path d="M84 300 C 88 268, 94 244, 98 228 C 122 220, 148 224, 168 234 C 164 258, 160 280, 160 300 Z" fill="url(#hand-cuff)" />
      <path d="M98 228 C 122 220, 148 224, 168 234" fill="none" stroke="#3a414d" strokeWidth="2" />
    </svg>
  );
}
