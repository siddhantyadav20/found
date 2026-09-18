import type { AppId } from "@/content/types";
import styles from "./icons.module.css";

/* Her app icons, drawn to sit as close to current iOS as a drawing can: the
   platform's squircle tile, each app's own colour and mark, and the glassy
   edge light iOS puts on every icon. All drawn here as SVG; no artwork is
   copied from anywhere. Apple's own apps are drawn from the idea (a compass,
   a flower, a receiver); the two real third-party apps get our own drawing of
   what they are (a bubble, a lens), never their logo; and PikDrop and City
   Desk are ours outright. */

const TILE: Record<AppId, string> = {
  whatsapp: "linear-gradient(180deg, #5ee07f 0%, #1faa4f 100%)",
  phone: "linear-gradient(180deg, #67f77c 0%, #0ebd2f 100%)",
  photos: "linear-gradient(180deg, #ffffff 0%, #f4f4f6 100%)",
  instagram: "linear-gradient(150deg, #f7c14b 0%, #e0487f 45%, #8a4fd0 100%)",
  messages: "linear-gradient(180deg, #67f77c 0%, #0ebd2f 100%)",
  notes: "linear-gradient(180deg, #ffd84a 0%, #f8c81c 23%, #ffffff 23.5%, #f8f8f4 100%)",
  pikdrop: "linear-gradient(180deg, #ffc043 0%, #e08a00 100%)",
  safari: "linear-gradient(180deg, #f3f5f8 0%, #dfe6ef 100%)",
  settings: "linear-gradient(180deg, #e3e3e8 0%, #a1a1a8 100%)",
  news: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
  casefile: "linear-gradient(180deg, #ffd84a 0%, #f8c81c 23%, #ffffff 23.5%, #f8f8f4 100%)",
  kyc: "linear-gradient(180deg, #9a9aa1 0%, #6c6c72 100%)",
  "yours:chats": "linear-gradient(180deg, #67f77c 0%, #0ebd2f 100%)",
  "yours:phone": "linear-gradient(180deg, #67f77c 0%, #0ebd2f 100%)",
  "yours:share": "linear-gradient(180deg, #5eb0ff 0%, #1d6fe6 100%)",
};

/** Glyphs that are the whole picture rather than a mark on a coloured tile. */
const FULL: ReadonlySet<AppId> = new Set<AppId>(["notes", "casefile", "photos", "news", "safari"]);

/** Photos' flower: eight overlapping petals, clockwise from the top. */
const PETALS = ["#f8a326", "#f7cf2c", "#a6d25a", "#3fbf8f", "#3aa7dc", "#5b76d6", "#a45fcb", "#ee5b7b"];

function Glyph({ app }: { app: AppId }) {
  switch (app) {
    case "whatsapp":
      // A bubble with a receiver in it: the idea, not the mark.
      return (
        <g>
          <path
            d="M12 4.6a7.4 7.4 0 0 0-6.4 11.1L4.8 19.4l3.8-.8A7.4 7.4 0 1 0 12 4.6Z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9.6 9.4c.3-.6.8-.6 1.1-.1l.6 1c.2.3.1.6-.1.8l-.4.4c.4.9 1 1.5 1.9 1.9l.4-.4c.2-.2.5-.3.8-.1l1 .6c.5.3.5.8-.1 1.1-1 .6-2.3.3-3.5-.8s-1.9-2.4-1.7-3.4Z"
            fill="#fff"
          />
        </g>
      );
    case "phone":
    case "yours:phone":
      return (
        <path
          d="M8.2 5.4c.6-.6 1.5-.5 2 .2l1.2 1.7c.4.6.3 1.3-.2 1.8l-.7.7c.7 1.6 2 2.9 3.6 3.6l.7-.7c.5-.5 1.2-.6 1.8-.2l1.7 1.2c.7.5.8 1.4.2 2l-.8.8c-.7.7-1.8.9-2.8.5-3.4-1.3-6-3.9-7.3-7.3-.4-1-.2-2.1.5-2.8Z"
          fill="#fff"
        />
      );
    case "messages":
    case "yours:chats":
      return (
        <path
          d="M12 5c4.2 0 7 2.6 7 6s-2.8 6-7 6c-.8 0-1.6-.1-2.3-.3L6 18.6l.9-2.6C5.7 15 5 13.6 5 11c0-3.4 2.8-6 7-6Z"
          fill="#fff"
        />
      );
    case "photos":
      return (
        <g transform="translate(12 12)">
          {PETALS.map((c, i) => (
            <ellipse key={c} cx="0" cy="-4.4" rx="2.5" ry="4.6" fill={c} opacity="0.9" transform={`rotate(${i * 45})`} />
          ))}
        </g>
      );
    case "instagram":
      // A lens in a rounded frame: our drawing of "the camera app people post to".
      return (
        <g fill="none" stroke="#fff" strokeWidth="1.7">
          <rect x="5.5" y="5.5" width="13" height="13" rx="4" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16" cy="8" r="0.9" fill="#fff" stroke="none" />
        </g>
      );
    case "notes":
    case "casefile":
      return (
        <g>
          <rect x="4" y="9" width="16" height="11" fill="#fdfdf8" />
          {[12, 14.6, 17.2].map((y) => (
            <rect key={y} x="6.5" y={y} width="11" height="1" rx="0.5" fill="#c9c4b4" />
          ))}
        </g>
      );
    case "pikdrop":
      // A box on a scooter: a two-wheeler courier, which is how Mumbai moves.
      return (
        <g fill="#fff">
          <rect x="6" y="7.5" width="7.5" height="6" rx="1" />
          <path d="M13.5 10h2.2l2.3 3.5H13.5z" />
          <circle cx="8.5" cy="16.5" r="2.2" />
          <circle cx="16.5" cy="16.5" r="2.2" />
        </g>
      );
    case "safari":
      return (
        <g>
          <circle cx="12" cy="12" r="8" fill="#1b8ff5" />
          <circle cx="12" cy="12" r="6.4" fill="#f7fafd" />
          <path d="m15.6 8.4-1.9 5.3-5.3 1.9 1.9-5.3z" fill="#ff5b4d" />
          <path d="m12 12 3.6-3.6-1.9 5.3z" fill="#e9e9ee" />
        </g>
      );
    case "settings":
      return (
        <g fill="none" stroke="#5a5a60" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.6v2.2M12 17.2v2.2M4.6 12h2.2M17.2 12h2.2M6.8 6.8l1.6 1.6M15.6 15.6l1.6 1.6M17.2 6.8l-1.6 1.6M8.4 15.6l-1.6 1.6" />
        </g>
      );
    case "news":
      return (
        <g>
          <rect x="4.5" y="5.5" width="15" height="13" rx="1.5" fill="#fff" stroke="#d8d8de" />
          <rect x="6.5" y="7.5" width="11" height="2.4" rx="0.5" fill="#1f1f24" />
          <rect x="6.5" y="11" width="11" height="1" rx="0.5" fill="#b9b9c0" />
          <rect x="6.5" y="13" width="11" height="1" rx="0.5" fill="#b9b9c0" />
          <rect x="6.5" y="15" width="7" height="1" rx="0.5" fill="#b9b9c0" />
        </g>
      );
    case "kyc":
      // The grey shield: iOS's mark for a management profile, and theirs.
      return (
        <g fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M12 4.5 18 6.7v4.9c0 3.5-2.5 6-6 7.9-3.5-1.9-6-4.4-6-7.9V6.7Z" />
          <path d="m9.4 12 1.9 1.9 3.4-3.6" />
        </g>
      );
    case "yours:share":
      return (
        <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round">
          <path d="M12 15.5V5.5M12 5.5 9 8.5M12 5.5l3 3" />
          <path d="M6.5 12.5v5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-5" />
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
