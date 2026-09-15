import type { AppId } from "@/content/found/types";
import styles from "./icons.module.css";

/* The phone's app icons, drawn to sit as close to current iOS as a drawing
   can: the platform's squircle tile, each app's own colour and mark, and the
   glassy edge light iOS now puts on every icon (icons.module.css). All drawn
   here as SVG; no artwork is copied from anywhere. The three apps that are
   the story's own (Guardian, NightCam, Dabba) are ours outright. */

const TILE: Record<AppId, string> = {
  envelope: "linear-gradient(180deg, #c9a06a, #9c7543)",
  lock: "linear-gradient(180deg, #4a4a4e, #2c2c2e)",
  messages: "linear-gradient(180deg, #67f77c 0%, #0ebd2f 100%)",
  photos: "linear-gradient(180deg, #ffffff 0%, #f4f4f6 100%)",
  maps: "linear-gradient(160deg, #f6f3ea 0%, #e6efdc 100%)",
  health: "linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)",
  memos: "linear-gradient(180deg, #232325 0%, #000 100%)",
  notes: "linear-gradient(180deg, #ffd84a 0%, #f8c81c 23%, #ffffff 23.5%, #f8f8f4 100%)",
  calculator: "linear-gradient(180deg, #2c2c2e 0%, #000 100%)",
  settings: "linear-gradient(180deg, #e3e3e8 0%, #a1a1a8 100%)",
  guardian: "linear-gradient(180deg, #5eb0ff 0%, #1d6fe6 100%)",
  nightcam: "linear-gradient(180deg, #2a2f5c 0%, #080a18 100%)",
  news: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
  food: "linear-gradient(180deg, #ffb347 0%, #ff7a1a 100%)",
};

/** Glyphs that are the whole picture (a map, a page, a mark) rather than a mark on a tile. */
const FULL: ReadonlySet<AppId> = new Set<AppId>(["maps", "notes", "photos", "health", "news"]);

/** Photos' flower: eight overlapping petals, clockwise from the top. */
const PETALS = ["#f8a326", "#f7cf2c", "#a6d25a", "#3fbf8f", "#3aa7dc", "#5b76d6", "#a45fcb", "#ee5b7b"];

function Glyph({ app }: { app: AppId }) {
  switch (app) {
    case "messages":
      return (
        <g fill="#fff">
          <ellipse cx="12" cy="11.3" rx="8.7" ry="7.3" />
          <path d="M5.3 15.4c-.2 1.9-1.2 3.4-2.3 4.3 2.4.2 4.7-.6 6.3-2.1Z" />
        </g>
      );
    case "photos":
      return (
        <g style={{ mixBlendMode: "multiply" }}>
          {PETALS.map((c, i) => (
            <ellipse key={c} cx="12" cy="7.35" rx="2.75" ry="4.6" fill={c} opacity="0.86" transform={`rotate(${i * 45} 12 12)`} />
          ))}
        </g>
      );
    case "maps":
      return (
        <g>
          <path d="M14.5 0H24v9.8h-9.5z" fill="#bfe3a3" />
          <path d="M0 15.5h7.5V24H0z" fill="#d7ecc4" />
          <path d="M8-1 11 25" stroke="#fff" strokeWidth="2.2" />
          <path d="M-1 20 25 10" stroke="#fff" strokeWidth="4.8" />
          <path d="M-1 20 25 10" stroke="#ffc42e" strokeWidth="3" />
          <path d="M4.6 6.6c3.2 1.2 6.4 4.7 11.6 10.4" fill="none" stroke="#2f8cff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16.4" cy="17.2" r="3.6" fill="#0a84ff" stroke="#fff" strokeWidth="1.4" />
          <path d="m16.4 14.9 1.6 3.9-1.6-.9-1.6.9Z" fill="#fff" />
        </g>
      );
    case "health":
      return (
        <path
          transform="translate(10.6 2.2) scale(0.5)"
          d="M12 21s-8.6-5.1-8.6-11.3A4.9 4.9 0 0 1 12 6.9a4.9 4.9 0 0 1 8.6 2.8C20.6 15.9 12 21 12 21Z"
          fill="#ff2d55"
        />
      );
    case "memos":
      return (
        <g strokeLinecap="round" strokeWidth="1.7">
          <path d="M3.6 11.2v1.6M5.9 10v4M8.2 8.2v7.6M10.5 5.8v12.4" stroke="#ff453a" />
          <path d="M12.8 4.6v14.8M15.1 7v10M17.4 9v6M19.7 10.6v2.8" stroke="#fff" />
        </g>
      );
    case "notes":
      return (
        <g>
          <path d="M0 5.8h24" stroke="#c99f00" strokeWidth="0.6" strokeDasharray="0.6 1" />
          <path d="M3.4 10.4h17.2M3.4 13.8h17.2M3.4 17.2h11" stroke="#d1d1d6" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case "calculator":
      return (
        <g strokeLinecap="round" strokeWidth="1.3">
          <circle cx="7.6" cy="7.6" r="4" fill="#5c5c60" />
          <circle cx="16.4" cy="7.6" r="4" fill="#ff9f0a" />
          <circle cx="7.6" cy="16.4" r="4" fill="#5c5c60" />
          <circle cx="16.4" cy="16.4" r="4" fill="#ff9f0a" />
          <path d="M5.9 7.6h3.4" stroke="#fff" />
          <path d="M16.4 5.9v3.4M14.7 7.6h3.4" stroke="#fff" />
          <path d="m6.4 15.2 2.4 2.4m0-2.4-2.4 2.4" stroke="#fff" />
          <path d="M14.7 15.6h3.4M14.7 17.2h3.4" stroke="#fff" />
        </g>
      );
    case "settings":
      return (
        <g>
          {/* Two geared rings, as the real one has: the outer's teeth are a
              thick dashed ring, the inner's a finer one. */}
          <circle cx="12" cy="12" r="8.6" fill="none" stroke="#3a3a3f" strokeWidth="2.6" strokeDasharray="1.7 1.2" />
          <circle cx="12" cy="12" r="7.4" fill="#4a4a50" />
          <circle cx="12" cy="12" r="6.1" fill="#d6d6db" />
          <circle cx="12" cy="12" r="4.6" fill="none" stroke="#6e6e75" strokeWidth="1.5" strokeDasharray="1 0.9" />
          <circle cx="12" cy="12" r="3.3" fill="#8e8e95" />
          <circle cx="12" cy="12" r="1.5" fill="#3a3a3f" />
        </g>
      );
    case "guardian":
      return (
        <g>
          <path d="M12 3.6 5.2 6.2v5.3c0 4.3 2.9 7.4 6.8 8.9 3.9-1.5 6.8-4.6 6.8-8.9V6.2L12 3.6Z" fill="#fff" />
          <path d="m8.8 12.1 2.2 2.2 4.2-4.4" fill="none" stroke="#1d6fe6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "nightcam":
      return (
        <g>
          <path
            d="M4 8.6h3.1l1.4-2.1h7l1.4 2.1H20a1 1 0 0 1 1 1v8.6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.6a1 1 0 0 1 1-1Z"
            fill="#fff"
          />
          <circle cx="12" cy="13.6" r="3.7" fill="#0d1030" />
          <path d="M13.4 11.9a2.1 2.1 0 1 0 0 3.4 1.7 1.7 0 0 1 0-3.4Z" fill="#ffd60a" />
        </g>
      );
    case "news":
      return (
        <g>
          {/* An N in two reds: the uprights, and the lighter stroke between them. */}
          <path d="M5 5h4.2l5.8 8.7V19H10.8L5 10.3Z" fill="#ff6479" />
          <path d="M5 5h4.2v14H5zM14.8 5H19v14h-4.2z" fill="#fa2d48" />
        </g>
      );
    case "food":
      return (
        <g fill="#fff">
          {/* A dabba: three tiers and the handle that clips them together. */}
          <path d="M8.5 7V5.4a3.5 3.5 0 0 1 7 0V7" fill="none" stroke="#fff" strokeWidth="1.6" />
          <rect x="6" y="7" width="12" height="3.6" rx="1.2" />
          <rect x="6" y="11.4" width="12" height="3.6" rx="1.2" opacity="0.9" />
          <rect x="6" y="15.8" width="12" height="3.6" rx="1.2" opacity="0.8" />
        </g>
      );
    case "envelope":
      return (
        <g>
          <rect x="3.5" y="6.5" width="17" height="11" rx="1.6" fill="#fff" />
          <path d="m4 7.2 8 6 8-6" fill="none" stroke="#9c7543" strokeWidth="1.4" strokeLinejoin="round" />
        </g>
      );
    case "lock":
      return (
        <g>
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="#fff" strokeWidth="1.8" />
          <rect x="6.5" y="10.5" width="11" height="8.5" rx="2" fill="#fff" />
        </g>
      );
    default:
      return null;
  }
}

/** A tile with its glyph, filling whatever box it's put in. */
export function AppGlyph({ app }: { app: AppId }) {
  return (
    <span className={styles.tile} style={{ background: TILE[app] }}>
      <svg viewBox="0 0 24 24" className={styles.glyph} data-full={FULL.has(app) || undefined} aria-hidden="true">
        <Glyph app={app} />
      </svg>
    </span>
  );
}
